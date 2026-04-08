import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum AdmissionPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('admission_posts')
@Index('idx_admission_posts_slug', ['slug'], { unique: true })
@Index('idx_admission_posts_status', ['status'])
export class AdmissionPost extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  slug!: string;

  @Column({ type: 'longtext' })
  content!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnail_url!: string | null;

  @Column({ type: 'enum', enum: AdmissionPostStatus, default: AdmissionPostStatus.DRAFT })
  status!: AdmissionPostStatus;

  @Column({ type: 'timestamp', nullable: true })
  published_at!: Date | null;

  @Column({ type: 'char', length: 26 })
  created_by!: string;

  @Column({ type: 'char', length: 26, nullable: true })
  updated_by!: string | null;
}
