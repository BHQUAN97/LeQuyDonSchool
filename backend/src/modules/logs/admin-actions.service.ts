import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAction, ActionType } from './entities/admin-action.entity';
import { QueryActionDto } from './dto/query-action.dto';
import { generateUlid } from '@/common/utils/ulid';
import { escapeLike } from '@/common/utils/query.utils';
import { paginated, ok } from '@/common/helpers/response.helper';

@Injectable()
export class AdminActionsService {
  private readonly logger = new Logger(AdminActionsService.name);

  constructor(
    @InjectRepository(AdminAction)
    private readonly actionRepo: Repository<AdminAction>,
  ) {}

  /**
   * Ghi hanh dong admin — khong throw error de tranh anh huong logic chinh.
   */
  async log(data: {
    action: ActionType;
    entityType: string;
    entityId?: string;
    description: string;
    changes?: Record<string, unknown>;
    userId: string;
    userName?: string;
    ip?: string;
  }): Promise<void> {
    try {
      const record = this.actionRepo.create({
        id: generateUlid(),
        action: data.action,
        entity_type: data.entityType,
        entity_id: data.entityId || null,
        description: data.description,
        changes: data.changes || null,
        user_id: data.userId,
        user_name: data.userName || null,
        ip: data.ip || null,
      });
      await this.actionRepo.save(record);
    } catch (err) {
      this.logger.error('Failed to log admin action', err);
    }
  }

  /**
   * Danh sach admin actions voi phan trang va filter.
   */
  async findAll(query: QueryActionDto) {
    const { page, limit, action, entityType, userId, search, startDate, endDate, sort, order } = query;

    const qb = this.actionRepo.createQueryBuilder('a');

    if (action) {
      qb.andWhere('a.action = :action', { action });
    }

    if (entityType) {
      qb.andWhere('a.entity_type = :entityType', { entityType });
    }

    if (userId) {
      qb.andWhere('a.user_id = :userId', { userId });
    }

    if (search) {
      qb.andWhere('(a.description LIKE :search OR a.user_name LIKE :search)', {
        search: `%${escapeLike(search)}%`,
      });
    }

    if (startDate) {
      qb.andWhere('a.created_at >= :startDate', { startDate });
    }

    if (endDate) {
      qb.andWhere('a.created_at <= :endDate', { endDate });
    }

    const allowedSort = ['created_at', 'action', 'entity_type'];
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
   * Thong ke hanh dong theo loai.
   */
  async getStats() {
    const counts = await this.actionRepo
      .createQueryBuilder('a')
      .select('a.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('a.action')
      .getRawMany();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalToday = await this.actionRepo
      .createQueryBuilder('a')
      .where('a.created_at >= :today', { today })
      .getCount();

    const stats: Record<string, number> = {
      create: 0, update: 0, delete: 0,
      login: 0, logout: 0, upload: 0,
      totalToday,
    };

    for (const row of counts) {
      stats[row.action] = parseInt(row.count, 10);
    }

    return ok(stats);
  }
}
