import { Entity, Column, PrimaryColumn, CreateDateColumn, BeforeInsert, Index } from 'typeorm';
import { generateUlid } from '@/common/utils/ulid';

@Entity('login_attempts')
@Index('idx_login_attempts_ip_time', ['ip_address', 'attempted_at'])
@Index('idx_login_attempts_email_time', ['email', 'attempted_at'])
export class LoginAttempt {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 45 })
  ip_address!: string;

  @Column({ type: 'boolean', default: false })
  success!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  attempted_at!: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = generateUlid();
  }
}
