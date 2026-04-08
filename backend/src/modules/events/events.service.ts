import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { generateUlid } from '@/common/utils/ulid';
import { paginated } from '@/common/helpers/response.helper';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
  ) {}

  /**
   * Danh sach su kien cho admin — phan trang, search, filter.
   */
  async findAll(query: QueryEventDto) {
    const { page, limit, search, status, sort, order } = query;

    const qb = this.eventRepo.createQueryBuilder('e').where('e.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(e.title LIKE :search OR e.location LIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (status) {
      qb.andWhere('e.status = :status', { status });
    }

    // Sort — chi cho phep cac truong an toan
    const allowedSort = ['created_at', 'updated_at', 'start_date', 'end_date', 'title'];
    const sortField = allowedSort.includes(sort) ? `e.${sort}` : 'e.created_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Su kien sap dien ra va dang dien ra — public, sap xep theo start_date.
   */
  async findUpcoming() {
    const data = await this.eventRepo.find({
      where: [
        { status: EventStatus.UPCOMING, deleted_at: IsNull() },
        { status: EventStatus.ONGOING, deleted_at: IsNull() },
      ],
      order: { start_date: 'ASC' },
    });
    return data;
  }

  /**
   * Chi tiet su kien theo ID.
   */
  async findOne(id: string) {
    const event = await this.eventRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!event) throw new NotFoundException('Không tìm thấy sự kiện');
    return event;
  }

  /**
   * Tao su kien moi.
   */
  async create(dto: CreateEventDto, createdBy: string) {
    const event = this.eventRepo.create({
      id: generateUlid(),
      title: dto.title,
      description: dto.description || null,
      image_url: dto.imageUrl || null,
      start_date: new Date(dto.startDate),
      end_date: dto.endDate ? new Date(dto.endDate) : null,
      location: dto.location || null,
      link_url: dto.linkUrl || null,
      status: dto.status || EventStatus.UPCOMING,
      created_by: createdBy,
    });

    return this.eventRepo.save(event);
  }

  /**
   * Cap nhat su kien.
   */
  async update(id: string, dto: UpdateEventDto, updatedBy: string) {
    const event = await this.eventRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!event) throw new NotFoundException('Không tìm thấy sự kiện');

    const updateData: Partial<Event> = { updated_by: updatedBy };

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description || null;
    if (dto.imageUrl !== undefined) updateData.image_url = dto.imageUrl || null;
    if (dto.startDate !== undefined) updateData.start_date = new Date(dto.startDate);
    if (dto.endDate !== undefined) updateData.end_date = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.location !== undefined) updateData.location = dto.location || null;
    if (dto.linkUrl !== undefined) updateData.link_url = dto.linkUrl || null;
    if (dto.status !== undefined) updateData.status = dto.status;

    await this.eventRepo.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Soft delete su kien.
   */
  async remove(id: string) {
    const event = await this.eventRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!event) throw new NotFoundException('Không tìm thấy sự kiện');

    await this.eventRepo.update(id, { deleted_at: new Date() });
    return { message: 'Đã xóa sự kiện' };
  }
}
