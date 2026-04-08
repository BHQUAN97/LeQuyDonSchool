import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum MenuTarget {
  SELF = '_self',
  BLANK = '_blank',
}

@Entity('menu_items')
@Index('idx_menu_items_parent', ['parent_id'])
@Index('idx_menu_items_order', ['display_order'])
export class MenuItem extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  label!: string;

  @Column({ type: 'varchar', length: 500 })
  url!: string;

  @Column({ type: 'enum', enum: MenuTarget, default: MenuTarget.SELF })
  target!: MenuTarget;

  @Column({ type: 'char', length: 26, nullable: true })
  parent_id!: string | null;

  @Column({ type: 'int', default: 0 })
  display_order!: number;

  @Column({ type: 'boolean', default: true })
  is_visible!: boolean;

  @ManyToOne(() => MenuItem, (item) => item.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: MenuItem;

  @OneToMany(() => MenuItem, (item) => item.parent)
  children?: MenuItem[];
}
