import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { generateUlid } from '@/common/utils/ulid';

export enum SettingGroup {
  GENERAL = 'general',
  CONTACT = 'contact',
  SOCIAL = 'social',
  SEO = 'seo',
  FLOATING = 'floating',
  HOMEPAGE = 'homepage',
}

/**
 * Setting entity — luu cau hinh trang web theo key-value.
 * Khong can soft delete — chi overwrite gia tri.
 */
@Entity('settings')
export class Setting {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  key!: string;

  @Column({ type: 'text' })
  value!: string;

  @Column({ type: 'varchar', length: 50 })
  group!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = generateUlid();
  }
}
