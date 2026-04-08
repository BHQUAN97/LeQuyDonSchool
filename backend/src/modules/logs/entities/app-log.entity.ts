import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { generateUlid } from '@/common/utils/ulid';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Bang app_logs — luu log he thong, khong co soft delete.
 */
@Entity('app_logs')
export class AppLog {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string;

  @Column({ type: 'enum', enum: LogLevel, default: LogLevel.INFO })
  @Index('idx_app_logs_level')
  level!: LogLevel;

  @Column({ type: 'varchar', length: 500 })
  message!: string;

  @Column({ type: 'text', nullable: true })
  stack_trace!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  endpoint!: string | null;

  @Column({ type: 'smallint', nullable: true })
  status_code!: number | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip!: string | null;

  @Column({ type: 'char', length: 26, nullable: true })
  user_id!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  user_agent!: string | null;

  @Column({ type: 'json', nullable: true })
  context!: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamp' })
  @Index('idx_app_logs_created_at')
  created_at!: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = generateUlid();
  }
}
