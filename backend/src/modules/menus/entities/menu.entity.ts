import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

/** Trang thai menu an — nhap hoac da cong bo cho phu huynh xem */
export enum MenuStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

/**
 * Cau truc JSON cho 1 bua an — lap lai cho breakfast/lunch/dinner.
 * Khong la entity, chi la type reference de documentation.
 */
export interface MenuItem {
  mainDish?: string;   // Mon chinh
  vegetable?: string;  // Mon rau
  soup?: string;       // Canh/sup
  starch?: string;     // Tinh bot (com/mi/...)
  dessert?: string;    // Trang mieng
}

/**
 * Thuc don an uong theo tung ngay — khac voi navigation menu (menu thanh dieu huong).
 * Moi ngay co 1 row, chua 3 bua (sang/trua/chieu) duoi dang JSON.
 */
@Entity('food_menus')
@Index('idx_food_menus_date', ['date'], { unique: true })
@Index('idx_food_menus_status', ['status'])
export class Menu extends BaseEntity {
  /** Ngay ap dung thuc don — unique theo ngay */
  @Column({ type: 'date' })
  date!: string;

  /** Bua sang — JSON {mainDish, vegetable, soup, starch, dessert} */
  @Column({ type: 'json', nullable: true })
  breakfast!: MenuItem | null;

  /** Bua trua */
  @Column({ type: 'json', nullable: true })
  lunch!: MenuItem | null;

  /** Bua chieu / bua phu */
  @Column({ type: 'json', nullable: true })
  dinner!: MenuItem | null;

  /** Ghi chu tu bep (di ung, thay doi...) */
  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ type: 'enum', enum: MenuStatus, default: MenuStatus.DRAFT })
  status!: MenuStatus;

  @Column({ type: 'char', length: 26, nullable: true })
  created_by!: string | null;

  @Column({ type: 'char', length: 26, nullable: true })
  updated_by!: string | null;
}
