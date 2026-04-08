import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('admission_faq')
@Index('idx_admission_faq_order', ['display_order'])
export class AdmissionFaq extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  question!: string;

  @Column({ type: 'text' })
  answer!: string;

  @Column({ type: 'int', default: 0 })
  display_order!: number;

  @Column({ type: 'boolean', default: true })
  is_visible!: boolean;
}
