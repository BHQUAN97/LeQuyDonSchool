import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { generateUlid } from '@/common/utils/ulid';
import { User } from '@/modules/users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string;

  @Column({ type: 'char', length: 26 })
  user_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 255 })
  token_hash!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  user_agent!: string | null;

  @Column({ type: 'timestamp' })
  expires_at!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = generateUlid();
  }
}
