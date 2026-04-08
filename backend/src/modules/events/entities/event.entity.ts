import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  PAST = 'past',
}

@Entity('events')
@Index('idx_events_status', ['status'])
@Index('idx_events_start_date', ['start_date'])
export class Event extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url!: string | null;

  @Column({ type: 'timestamp' })
  start_date!: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  link_url!: string | null;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.UPCOMING })
  status!: EventStatus;

  @Column({ type: 'char', length: 26 })
  created_by!: string;

  @Column({ type: 'char', length: 26, nullable: true })
  updated_by!: string | null;
}
