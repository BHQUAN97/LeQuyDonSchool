import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Between } from 'typeorm';
import { Menu, MenuStatus } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { generateUlid } from '@/common/utils/ulid';
import { paginated } from '@/common/helpers/response.helper';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
  ) {}

  /**
   * Danh sach thuc don — admin, phan trang + filter theo khoang ngay / status.
   */
  async findAll(query: QueryMenuDto) {
    const { page, limit, status, dateFrom, dateTo, sort, order } = query;

    const qb = this.menuRepo.createQueryBuilder('m').where('m.deleted_at IS NULL');

    if (status) {
      qb.andWhere('m.status = :status', { status });
    }
    if (dateFrom) {
      qb.andWhere('m.date >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      qb.andWhere('m.date <= :dateTo', { dateTo });
    }

    // Sort — whitelist field an toan
    const allowedSort = ['date', 'created_at', 'updated_at', 'status'];
    const sortField = allowedSort.includes(sort) ? `m.${sort}` : 'm.date';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Lay thuc don cho 1 ngay — public, chi tra ve neu da published.
   */
  async findByDate(date: string) {
    const menu = await this.menuRepo.findOne({
      where: { date, status: MenuStatus.PUBLISHED, deleted_at: IsNull() },
    });
    return menu || null;
  }

  /**
   * Lay thuc don cho 1 khoang ngay (thuong la 1 tuan) — public, chi published.
   */
  async findByDateRange(dateFrom: string, dateTo: string) {
    return this.menuRepo.find({
      where: {
        date: Between(dateFrom, dateTo),
        status: MenuStatus.PUBLISHED,
        deleted_at: IsNull(),
      },
      order: { date: 'ASC' },
    });
  }

  /**
   * Chi tiet thuc don theo ID — admin.
   */
  async findOne(id: string) {
    const menu = await this.menuRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!menu) throw new NotFoundException('Không tìm thấy thực đơn');
    return menu;
  }

  /**
   * Tao thuc don moi — kiem tra trung ngay (unique).
   */
  async create(dto: CreateMenuDto, createdBy: string) {
    await this.ensureUniqueDate(dto.date);

    const menu = this.menuRepo.create({
      id: generateUlid(),
      date: dto.date,
      breakfast: dto.breakfast || null,
      lunch: dto.lunch || null,
      dinner: dto.dinner || null,
      note: dto.note || null,
      status: dto.status || MenuStatus.DRAFT,
      created_by: createdBy,
    });

    return this.menuRepo.save(menu);
  }

  /**
   * Cap nhat thuc don.
   */
  async update(id: string, dto: UpdateMenuDto, updatedBy: string) {
    const menu = await this.menuRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!menu) throw new NotFoundException('Không tìm thấy thực đơn');

    const updateData: Partial<Menu> = { updated_by: updatedBy };

    if (dto.date && dto.date !== menu.date) {
      await this.ensureUniqueDate(dto.date, id);
      updateData.date = dto.date;
    }
    if (dto.breakfast !== undefined) updateData.breakfast = dto.breakfast || null;
    if (dto.lunch !== undefined) updateData.lunch = dto.lunch || null;
    if (dto.dinner !== undefined) updateData.dinner = dto.dinner || null;
    if (dto.note !== undefined) updateData.note = dto.note || null;
    if (dto.status) updateData.status = dto.status;

    await this.menuRepo.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Soft delete thuc don.
   */
  async remove(id: string) {
    const menu = await this.menuRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!menu) throw new NotFoundException('Không tìm thấy thực đơn');

    await this.menuRepo.update(id, { deleted_at: new Date() });
    return { message: 'Đã xóa thực đơn' };
  }

  /**
   * Duplicate thuc don tu 1 ngay sang 1 ngay khac — tien cho bep
   * khi tuan nay nau giong tuan truoc. Menu dich se o trang thai DRAFT.
   */
  async copyFromDate(fromDate: string, toDate: string, createdBy: string) {
    const source = await this.menuRepo.findOne({
      where: { date: fromDate, deleted_at: IsNull() },
    });
    if (!source) {
      throw new NotFoundException(`Không tìm thấy thực đơn ngày ${fromDate}`);
    }

    await this.ensureUniqueDate(toDate);

    const copied = this.menuRepo.create({
      id: generateUlid(),
      date: toDate,
      breakfast: source.breakfast,
      lunch: source.lunch,
      dinner: source.dinner,
      note: source.note,
      status: MenuStatus.DRAFT,
      created_by: createdBy,
    });

    return this.menuRepo.save(copied);
  }

  /**
   * Dam bao 1 ngay chi co 1 thuc don — tranh trung.
   */
  private async ensureUniqueDate(date: string, excludeId?: string) {
    const qb = this.menuRepo
      .createQueryBuilder('m')
      .where('m.date = :date', { date })
      .andWhere('m.deleted_at IS NULL');

    if (excludeId) {
      qb.andWhere('m.id != :excludeId', { excludeId });
    }

    const existing = await qb.getOne();
    if (existing) {
      throw new ConflictException(`Đã có thực đơn cho ngày ${date}`);
    }
  }
}
