import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum RegistrationStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  COMPLETED = 'completed',
}

@Entity('admission_registrations')
@Index('idx_registration_status', ['status'])
export class AdmissionRegistration extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  full_name!: string;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 20 })
  grade!: string;

  @Column({ type: 'boolean', default: false })
  is_club_member!: boolean;

  @Column({ type: 'enum', enum: RegistrationStatus, default: RegistrationStatus.NEW })
  status!: RegistrationStatus;

  @Column({ type: 'text', nullable: true })
  note!: string | null;
}
