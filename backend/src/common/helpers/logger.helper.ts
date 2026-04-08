import { Logger } from '@nestjs/common';

/**
 * ActionLogger — structured logging cho admin actions.
 * Ghi log dang "[entity] action #id by userId"
 */
export class ActionLogger {
  private static readonly logger = new Logger('ActionLogger');

  /** Log hanh dong chung */
  static action(entity: string, action: string, id: string, userId?: string) {
    const by = userId ? ` by ${userId}` : '';
    this.logger.log(`[${entity}] ${action} #${id}${by}`);
  }

  /** Log tao moi */
  static created(entity: string, id: string, userId?: string) {
    this.action(entity, 'CREATED', id, userId);
  }

  /** Log cap nhat */
  static updated(entity: string, id: string, userId?: string) {
    this.action(entity, 'UPDATED', id, userId);
  }

  /** Log xoa (soft delete) */
  static deleted(entity: string, id: string, userId?: string) {
    this.action(entity, 'DELETED', id, userId);
  }
}
