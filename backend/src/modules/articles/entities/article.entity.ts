import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Category } from '@/modules/categories/entities/category.entity';

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
}

@Entity('articles')
@Index('idx_articles_slug', ['slug'], { unique: true })
@Index('idx_articles_status', ['status'])
@Index('idx_articles_category', ['category_id'])
export class Article extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  slug!: string;

  @Column({ type: 'longtext' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  excerpt!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnail_url!: string | null;

  @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
  status!: ArticleStatus;

  @Column({ type: 'int', default: 0 })
  view_count!: number;

  @Column({ type: 'timestamp', nullable: true })
  published_at!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  seo_title!: string | null;

  @Column({ type: 'text', nullable: true })
  seo_description!: string | null;

  @Column({ type: 'char', length: 26 })
  created_by!: string;

  @Column({ type: 'char', length: 26, nullable: true })
  updated_by!: string | null;

  @Column({ type: 'char', length: 26, nullable: true })
  category_id!: string | null;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category!: Category | null;
}
