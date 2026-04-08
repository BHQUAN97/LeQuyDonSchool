import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { generateUlid } from '../utils/ulid';

/**
 * Base entity — ULID PK, timestamps, soft delete.
 * Tat ca entity khac extend tu day.
 */
export abstract class BaseEntity {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at!: Date | null;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = generateUlid();
  }
}
