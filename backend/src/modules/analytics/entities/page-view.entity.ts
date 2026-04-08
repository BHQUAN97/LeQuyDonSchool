import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
}

@Entity('page_views')
@Index('idx_page_views_path', ['page_path'])
@Index('idx_page_views_viewed_at', ['viewed_at'])
@Index('idx_page_views_dedup', ['visitor_ip', 'page_path', 'viewed_at'])
export class PageView {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 500 })
  page_path!: string;

  @Column({ type: 'varchar', length: 45 })
  visitor_ip!: string;

  @Column({ type: 'text', nullable: true })
  user_agent!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  referrer!: string | null;

  @Column({ type: 'enum', enum: DeviceType, nullable: true })
  device_type!: DeviceType | null;

  @Column({ type: 'boolean', default: false })
  is_bot!: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  session_id!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  viewed_at!: Date;
}
