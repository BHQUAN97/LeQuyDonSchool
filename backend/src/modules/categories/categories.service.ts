import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Category, CategoryStatus } from './entities/category.entity';
import { Article } from '../articles/entities/article.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { generateUlid } from '@/common/utils/ulid';
import { escapeLike } from '@/common/utils/query.utils';
import { paginated, ok } from '@/common/helpers/response.helper';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Article) private readonly articleRepo: Repository<Article>,
  ) {}

  /**
   * Danh sach danh muc — ho tro flat list hoac nested tree.
   */
  async findAll(query: QueryCategoryDto) {
    const { page, limit, search, status, parentId, sort, order, tree } = query;

    // Neu yeu cau tree → tra ve toan bo danh muc dang cay
    if (tree === 'true') {
      return ok(await this.buildTree(status));
    }

    const qb = this.categoryRepo.createQueryBuilder('c').where('c.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(c.name LIKE :search OR c.slug LIKE :search)', {
        search: `%${escapeLike(search)}%`,
      });
    }
    if (status) qb.andWhere('c.status = :status', { status });
    if (parentId) {
      qb.andWhere('c.parent_id = :parentId', { parentId });
    }

    // Sort — chi cho phep cac truong an toan
    const allowedSort = ['created_at', 'updated_at', 'name', 'display_order', 'slug'];
    const sortField = allowedSort.includes(sort) ? `c.${sort}` : 'c.display_order';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Xay dung cay danh muc tu flat list.
   */
  private async buildTree(statusFilter?: CategoryStatus): Promise<Category[]> {
    const where: any = { deleted_at: IsNull() };
    if (statusFilter) where.status = statusFilter;

    const all = await this.categoryRepo.find({
      where,
      order: { display_order: 'ASC', name: 'ASC' },
    });

    // Map id → category, gan children rong
    const map = new Map<string, any>();
    for (const cat of all) {
      map.set(cat.id, { ...cat, children: [] });
    }

    // Gan children vao parent
    const roots: Category[] = [];
    for (const cat of map.values()) {
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.children.push(cat);
      } else {
        roots.push(cat);
      }
    }

    return roots;
  }

  /**
   * Tim danh muc theo ID.
   */
  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['children'],
    });
    if (!category) throw new NotFoundException('Không tìm thấy danh mục');
    return ok(category);
  }

  /**
   * Tao danh muc moi — tu dong tao slug tu ten neu khong co.
   */
  async create(dto: CreateCategoryDto, createdBy: string) {
    const slug = dto.slug || this.generateSlug(dto.name);

    // Kiem tra slug trung
    await this.ensureSlugUnique(slug);

    // Kiem tra parent ton tai (neu co)
    if (dto.parentId) {
      await this.ensureParentExists(dto.parentId);
    }

    const category = this.categoryRepo.create({
      id: generateUlid(),
      name: dto.name,
      slug,
      parent_id: dto.parentId || null,
      description: dto.description || null,
      display_order: dto.displayOrder ?? 0,
      status: CategoryStatus.ACTIVE,
      created_by: createdBy,
    });

    const saved = await this.categoryRepo.save(category);
    return ok(saved);
  }

  /**
   * Cap nhat danh muc — kiem tra slug trung voi danh muc khac.
   */
  async update(id: string, dto: UpdateCategoryDto, updatedBy: string) {
    const category = await this.categoryRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!category) throw new NotFoundException('Không tìm thấy danh mục');

    // Kiem tra vong tham chieu (truc tiep va gian tiep)
    if (dto.parentId) {
      await this.checkCircularReference(id, dto.parentId);
      await this.ensureParentExists(dto.parentId);
    }

    // Tao slug tu ten moi neu ten thay doi ma khong co slug moi
    const newSlug = dto.slug || (dto.name ? this.generateSlug(dto.name) : undefined);

    // Kiem tra slug trung voi danh muc khac
    if (newSlug && newSlug !== category.slug) {
      await this.ensureSlugUnique(newSlug, id);
    }

    const updateData: Partial<Category> = { updated_by: updatedBy };
    if (dto.name !== undefined) updateData.name = dto.name;
    if (newSlug) updateData.slug = newSlug;
    if (dto.parentId !== undefined) updateData.parent_id = dto.parentId || null;
    if (dto.description !== undefined) updateData.description = dto.description || null;
    if (dto.displayOrder !== undefined) updateData.display_order = dto.displayOrder;
    if (dto.status !== undefined) updateData.status = dto.status;

    await this.categoryRepo.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Soft delete danh muc.
   */
  async remove(id: string) {
    const category = await this.categoryRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!category) throw new NotFoundException('Không tìm thấy danh mục');

    // Kiem tra co danh muc con khong
    const childCount = await this.categoryRepo.count({
      where: { parent_id: id, deleted_at: IsNull() },
    });
    if (childCount > 0) {
      throw new BadRequestException(
        'Không thể xóa danh mục có danh mục con. Hãy xóa hoặc di chuyển danh mục con trước.',
      );
    }

    // Go lien ket bai viet thuoc danh muc nay — set category_id = null
    await this.articleRepo.update(
      { category_id: id },
      { category_id: null },
    );

    await this.categoryRepo.update(id, { deleted_at: new Date() });
    return ok({ message: 'Đã xóa danh mục' });
  }

  /**
   * Tao slug tu ten — bo dau tieng Viet, lowercase, thay khoang trang bang dau gach.
   */
  private generateSlug(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bo dau tieng Viet
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Chi giu chu, so, khoang trang, gach
      .replace(/\s+/g, '-') // Khoang trang → gach
      .replace(/-+/g, '-') // Nhieu gach → 1 gach
      .replace(/^-|-$/g, ''); // Bo gach dau/cuoi
  }

  /**
   * Dam bao slug khong trung.
   */
  private async ensureSlugUnique(slug: string, excludeId?: string) {
    const where: any = { slug, deleted_at: IsNull() };
    if (excludeId) where.id = Not(excludeId);

    const existing = await this.categoryRepo.findOne({ where });
    if (existing) {
      throw new ConflictException(`Slug "${slug}" đã được sử dụng`);
    }
  }

  /**
   * Kiem tra vong tham chieu — duyet nguoc parent chain,
   * dam bao newParentId khong phai la hau due cua categoryId.
   */
  private async checkCircularReference(categoryId: string, newParentId: string): Promise<void> {
    if (newParentId === categoryId) {
      throw new BadRequestException('Danh mục không thể là con của chính nó');
    }

    let currentId: string | null = newParentId;
    const visited = new Set<string>();

    while (currentId) {
      if (currentId === categoryId) {
        throw new BadRequestException('Phát hiện tham chiếu vòng — danh mục cha là hậu duệ của danh mục hiện tại');
      }
      if (visited.has(currentId)) break; // Da gap roi, tranh loop vo han
      visited.add(currentId);

      const parent = await this.categoryRepo.findOne({
        where: { id: currentId, deleted_at: IsNull() },
      });
      currentId = parent?.parent_id ?? null;
    }
  }

  /**
   * Dam bao parent category ton tai.
   */
  private async ensureParentExists(parentId: string) {
    const parent = await this.categoryRepo.findOne({
      where: { id: parentId, deleted_at: IsNull() },
    });
    if (!parent) {
      throw new NotFoundException('Danh mục cha không tồn tại');
    }
  }
}
