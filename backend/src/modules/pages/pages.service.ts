import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Page, PageStatus } from './entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { QueryPageDto } from './dto/query-page.dto';
import { generateUlid } from '@/common/utils/ulid';
import { escapeLike } from '@/common/utils/query.utils';
import { paginated } from '@/common/helpers/response.helper';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page) private readonly pageRepo: Repository<Page>,
  ) {}

  /**
   * Danh sach trang voi phan trang, search, filter status.
   */
  async findAll(query: QueryPageDto) {
    const { page, limit, search, status, sort, order } = query;

    const qb = this.pageRepo.createQueryBuilder('p').where('p.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(p.title LIKE :search OR p.slug LIKE :search)', {
        search: `%${escapeLike(search)}%`,
      });
    }
    if (status) qb.andWhere('p.status = :status', { status });

    const allowedSort = ['created_at', 'updated_at', 'title'];
    const sortField = allowedSort.includes(sort) ? `p.${sort}` : 'p.created_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Tim trang theo ID.
   */
  async findOne(id: string) {
    const page = await this.pageRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!page) throw new NotFoundException('Khong tim thay trang');
    return page;
  }

  /**
   * Tim trang theo slug — public, chi tra ve trang published.
   */
  async findBySlug(slug: string) {
    const page = await this.pageRepo.findOne({
      where: { slug, status: PageStatus.PUBLISHED, deleted_at: IsNull() },
    });
    if (!page) throw new NotFoundException('Khong tim thay trang');
    return page;
  }

  /**
   * Tao trang moi — tu dong tao slug tu title.
   */
  async create(dto: CreatePageDto, createdBy: string) {
    const slug = await this.generateUniqueSlug(dto.title);

    const page = this.pageRepo.create({
      id: generateUlid(),
      title: dto.title,
      slug,
      content: dto.content,
      status: dto.status || PageStatus.DRAFT,
      seo_title: dto.seoTitle || null,
      seo_description: dto.seoDescription || null,
      created_by: createdBy,
    });

    return this.pageRepo.save(page);
  }

  /**
   * Cap nhat trang — neu doi title thi re-gen slug.
   */
  async update(id: string, dto: UpdatePageDto, updatedBy: string) {
    const page = await this.pageRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!page) throw new NotFoundException('Khong tim thay trang');

    const updateData: Partial<Page> = { updated_by: updatedBy };

    if (dto.title && dto.title !== page.title) {
      updateData.title = dto.title;
      updateData.slug = await this.generateUniqueSlug(dto.title, id);
    }
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.status) updateData.status = dto.status;
    if (dto.seoTitle !== undefined) updateData.seo_title = dto.seoTitle || null;
    if (dto.seoDescription !== undefined) updateData.seo_description = dto.seoDescription || null;

    await this.pageRepo.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Soft delete trang.
   */
  async remove(id: string) {
    const page = await this.pageRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!page) throw new NotFoundException('Khong tim thay trang');

    await this.pageRepo.update(id, { deleted_at: new Date() });
    return { message: 'Da xoa trang' };
  }

  /**
   * Tao slug duy nhat tu title — viet thuong, bo dau, thay khoang trang bang dash.
   * Neu trung thi them hau to -2, -3...
   */
  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    // Chuyen title thanh slug — bo dau tieng Viet
    let base = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // bo dau
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 280);

    if (!base) base = 'trang';

    let slug = base;
    let counter = 1;

    while (true) {
      const qb = this.pageRepo
        .createQueryBuilder('p')
        .where('p.slug = :slug AND p.deleted_at IS NULL', { slug });

      if (excludeId) {
        qb.andWhere('p.id != :excludeId', { excludeId });
      }

      const exists = await qb.getCount();
      if (exists === 0) break;

      counter++;
      slug = `${base}-${counter}`;
    }

    return slug;
  }
}
