import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Article, ArticleStatus } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { generateUlid } from '@/common/utils/ulid';
import { paginated } from '@/common/helpers/response.helper';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private readonly articleRepo: Repository<Article>,
  ) {}

  /**
   * Danh sach bai viet cho admin — phan trang, search, filter.
   */
  async findAll(query: QueryArticleDto) {
    const { page, limit, search, status, categoryId, dateFrom, dateTo, sort, order } = query;

    const qb = this.articleRepo.createQueryBuilder('a').where('a.deleted_at IS NULL');

    if (search) {
      qb.andWhere('a.title LIKE :search', { search: `%${search}%` });
    }
    if (status) {
      qb.andWhere('a.status = :status', { status });
    }
    if (categoryId) {
      qb.andWhere('a.category_id = :categoryId', { categoryId });
    }
    if (dateFrom) {
      qb.andWhere('a.created_at >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      qb.andWhere('a.created_at <= :dateTo', { dateTo });
    }

    // Sort — chi cho phep cac truong an toan
    const allowedSort = ['created_at', 'updated_at', 'published_at', 'title', 'view_count'];
    const sortField = allowedSort.includes(sort) ? `a.${sort}` : 'a.created_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Danh sach bai viet public — chi hien published.
   */
  async findAllPublic(query: QueryArticleDto) {
    const { page, limit, search, categoryId, sort, order } = query;

    const qb = this.articleRepo
      .createQueryBuilder('a')
      .where('a.deleted_at IS NULL')
      .andWhere('a.status = :status', { status: ArticleStatus.PUBLISHED });

    if (search) {
      qb.andWhere('a.title LIKE :search', { search: `%${search}%` });
    }
    if (categoryId) {
      qb.andWhere('a.category_id = :categoryId', { categoryId });
    }

    // Sap xep theo published_at mac dinh cho public
    const allowedSort = ['published_at', 'created_at', 'view_count', 'title'];
    const sortField = allowedSort.includes(sort) ? `a.${sort}` : 'a.published_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Chi tiet bai viet theo ID — admin.
   */
  async findOne(id: string) {
    const article = await this.articleRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');
    return article;
  }

  /**
   * Chi tiet bai viet theo slug — public, chi published.
   */
  async findBySlug(slug: string) {
    const article = await this.articleRepo.findOne({
      where: { slug, status: ArticleStatus.PUBLISHED, deleted_at: IsNull() },
    });
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');
    return article;
  }

  /**
   * Tao bai viet moi — tu dong tao slug tu title.
   */
  async create(dto: CreateArticleDto, createdBy: string) {
    const slug = dto.slug || this.generateSlug(dto.title);

    // Kiem tra slug trung
    await this.ensureUniqueSlug(slug);

    // Tu dong set published_at khi status = published
    let publishedAt: Date | null = null;
    if (dto.publishedAt) {
      publishedAt = new Date(dto.publishedAt);
    } else if (dto.status === ArticleStatus.PUBLISHED) {
      publishedAt = new Date();
    }

    const article = this.articleRepo.create({
      id: generateUlid(),
      title: dto.title,
      slug,
      content: dto.content,
      excerpt: dto.excerpt || null,
      thumbnail_url: dto.thumbnailUrl || null,
      status: dto.status || ArticleStatus.DRAFT,
      seo_title: dto.seoTitle || null,
      seo_description: dto.seoDescription || null,
      published_at: publishedAt,
      category_id: dto.categoryId || null,
      created_by: createdBy,
    });

    return this.articleRepo.save(article);
  }

  /**
   * Cap nhat bai viet — re-gen slug neu title thay doi va slug khong duoc set thu cong.
   */
  async update(id: string, dto: UpdateArticleDto, updatedBy: string) {
    const article = await this.articleRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');

    const updateData: Partial<Article> = { updated_by: updatedBy };

    // Re-gen slug neu title thay doi va khong co slug thu cong
    if (dto.title && dto.title !== article.title) {
      const newSlug = dto.slug || this.generateSlug(dto.title);
      if (newSlug !== article.slug) {
        await this.ensureUniqueSlug(newSlug, id);
        updateData.slug = newSlug;
      }
      updateData.title = dto.title;
    } else if (dto.slug && dto.slug !== article.slug) {
      await this.ensureUniqueSlug(dto.slug, id);
      updateData.slug = dto.slug;
    }

    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.excerpt !== undefined) updateData.excerpt = dto.excerpt || null;
    if (dto.thumbnailUrl !== undefined) updateData.thumbnail_url = dto.thumbnailUrl || null;
    if (dto.seoTitle !== undefined) updateData.seo_title = dto.seoTitle || null;
    if (dto.seoDescription !== undefined) updateData.seo_description = dto.seoDescription || null;
    if (dto.categoryId !== undefined) updateData.category_id = dto.categoryId || null;

    // Xu ly status va published_at
    if (dto.status) {
      updateData.status = dto.status;
      if (dto.status === ArticleStatus.PUBLISHED && !article.published_at && !dto.publishedAt) {
        updateData.published_at = new Date();
      }
    }
    if (dto.publishedAt !== undefined) {
      updateData.published_at = dto.publishedAt ? new Date(dto.publishedAt) : null;
    }

    await this.articleRepo.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Soft delete bai viet.
   */
  async remove(id: string) {
    const article = await this.articleRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');

    await this.articleRepo.update(id, { deleted_at: new Date() });
    return { message: 'Đã xóa bài viết' };
  }

  /**
   * Tang luot xem — fire-and-forget, khong throw loi.
   */
  async incrementViewCount(id: string) {
    try {
      await this.articleRepo
        .createQueryBuilder()
        .update(Article)
        .set({ view_count: () => 'view_count + 1' })
        .where('id = :id', { id })
        .execute();
    } catch {
      // Fire-and-forget — bo qua loi
    }
  }

  /**
   * Tao slug tu title — chuyen tieng Viet, lowercase, thay dau cach bang "-".
   */
  private generateSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Xoa dau tieng Viet
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Chi giu chu, so, dau gach
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 280);
  }

  /**
   * Dam bao slug khong trung voi bai viet khac.
   */
  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const qb = this.articleRepo
      .createQueryBuilder('a')
      .where('a.slug = :slug', { slug })
      .andWhere('a.deleted_at IS NULL');

    if (excludeId) {
      qb.andWhere('a.id != :excludeId', { excludeId });
    }

    const existing = await qb.getOne();
    if (existing) {
      throw new ConflictException('Slug đã tồn tại, vui lòng chọn slug khác');
    }
  }
}
