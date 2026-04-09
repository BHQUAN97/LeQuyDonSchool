import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan } from 'typeorm';
import { AppLog, LogLevel } from './entities/app-log.entity';
import { QueryLogDto } from './dto/query-log.dto';
import { generateUlid } from '@/common/utils/ulid';
import { escapeLike } from '@/common/utils/query.utils';
import { paginated, ok } from '@/common/helpers/response.helper';

/**
 * LogsService — ghi va truy van log he thong.
 * Method write() KHONG DUOC throw error de tranh infinite loop.
 */
@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(
    @InjectRepository(AppLog) private readonly logRepo: Repository<AppLog>,
  ) {}

  /**
   * Ghi log vao DB — wrap try/catch, fallback console.
   */
  async write(data: Partial<AppLog>): Promise<void> {
    try {
      const log = this.logRepo.create({
        id: generateUlid(),
        level: data.level || LogLevel.INFO,
        message: data.message || '',
        stack_trace: data.stack_trace || null,
        endpoint: data.endpoint || null,
        status_code: data.status_code || null,
        ip: data.ip || null,
        user_id: data.user_id || null,
        user_agent: data.user_agent || null,
        context: data.context || null,
      });
      await this.logRepo.save(log);
    } catch (err) {
      // Fallback console — KHONG throw de tranh infinite loop
      this.logger.error('Failed to write log to DB', err);
    }
  }

  /**
   * Danh sach log voi phan trang va filter.
   */
  async findAll(query: QueryLogDto) {
    const { page, limit, level, search, startDate, endDate, sort, order } = query;

    const qb = this.logRepo.createQueryBuilder('l');

    if (level) {
      qb.andWhere('l.level = :level', { level });
    }

    if (search) {
      qb.andWhere('(l.message LIKE :search OR l.endpoint LIKE :search)', {
        search: `%${escapeLike(search)}%`,
      });
    }

    if (startDate) {
      qb.andWhere('l.created_at >= :startDate', { startDate });
    }

    if (endDate) {
      qb.andWhere('l.created_at <= :endDate', { endDate });
    }

    // Sort — chi cho phep cac truong an toan
    const allowedSort = ['created_at', 'level', 'status_code'];
    const sortField = allowedSort.includes(sort) ? `l.${sort}` : 'l.created_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Chi tiet 1 log entry.
   */
  async findOne(id: string) {
    const log = await this.logRepo.findOne({ where: { id } });
    if (!log) return ok(null, 'Khong tim thay log');
    return ok(log);
  }

  /**
   * Thong ke so luong theo level + total hom nay.
   */
  async getStats() {
    // Dem theo tung level
    const counts = await this.logRepo
      .createQueryBuilder('l')
      .select('l.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('l.level')
      .getRawMany();

    // Dem total hom nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalToday = await this.logRepo
      .createQueryBuilder('l')
      .where('l.created_at >= :today', { today })
      .getCount();

    const stats: Record<string, number> = {
      error: 0,
      warn: 0,
      info: 0,
      debug: 0,
      totalToday,
    };

    for (const row of counts) {
      stats[row.level] = parseInt(row.count, 10);
    }

    return ok(stats);
  }

  /**
   * Xoa nhieu log theo danh sach IDs (toi da 500).
   */
  async bulkDelete(ids: string[]) {
    if (!ids?.length) return ok({ deleted: 0 }, 'Khong co ID nao');
    const safeIds = ids.slice(0, 500);
    const result = await this.logRepo.delete({ id: In(safeIds) });
    return ok({ deleted: result.affected || 0 }, `Da xoa ${result.affected} log`);
  }

  /**
   * Xoa tat ca log, hoac chi 1 level.
   */
  async deleteAll(level?: string) {
    const qb = this.logRepo.createQueryBuilder().delete().from(AppLog);
    if (level && Object.values(LogLevel).includes(level as LogLevel)) {
      qb.where('level = :level', { level });
    }
    const result = await qb.execute();
    return ok({ deleted: result.affected || 0 }, `Da xoa ${result.affected} log`);
  }

  /**
   * Xoa log cu hon X ngay.
   */
  async purgeOlderThan(days: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const result = await this.logRepo.delete({
      created_at: LessThan(cutoff),
    });
    return ok({ deleted: result.affected || 0 }, `Da xoa ${result.affected} log cu hon ${days} ngay`);
  }
}
