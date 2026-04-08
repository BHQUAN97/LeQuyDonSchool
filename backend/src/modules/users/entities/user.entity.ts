import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  EDITOR = 'editor',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password_hash!: string;

  @Column({ type: 'varchar', length: 100 })
  full_name!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url!: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EDITOR })
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at!: Date | null;

  @Column({ type: 'char', length: 26, nullable: true })
  created_by!: string | null;

  @Column({ type: 'char', length: 26, nullable: true })
  updated_by!: string | null;
}
