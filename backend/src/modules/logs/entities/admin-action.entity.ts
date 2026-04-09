import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { generateUlid } from '@/common/utils/ulid';

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  UPLOAD = 'upload',
}

/**
 * Bang admin_actions — ghi nhat ky hanh dong quan tri vien.
 */
@Entity('admin_actions')
export class AdminAction {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string;

  @Column({ type: 'enum', enum: ActionType })
  @Index('idx_admin_actions_action')
  action!: ActionType;

  @Column({ type: 'varchar', length: 100 })
  entity_type!: string;

  @Column({ type: 'char', length: 26, nullable: true })
  entity_id!: string | null;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ type: 'json', nullable: true })
  changes!: Record<string, unknown> | null;

  @Column({ type: 'char', length: 26 })
  @Index('idx_admin_actions_user_id')
  user_id!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  user_name!: string | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  @Index('idx_admin_actions_created_at')
  created_at!: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = generateUlid();
  }
}
