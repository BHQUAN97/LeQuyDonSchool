import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { MenuItem, MenuTarget } from './entities/menu-item.entity';
import { SaveMenuDto, MenuItemDto } from './dto/save-menu.dto';
import { generateUlid } from '@/common/utils/ulid';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(MenuItem) private readonly menuRepo: Repository<MenuItem>,
  ) {}

  /**
   * Lay menu tree public — chi hien thi visible items.
   * Tra ve cau truc cay (parent → children).
   */
  async findPublicMenu() {
    const items = await this.menuRepo.find({
      where: { is_visible: true, deleted_at: IsNull() },
      order: { display_order: 'ASC' },
    });
    return this.buildTree(items);
  }

  /**
   * Lay tat ca menu items — admin, bao gom hidden.
   */
  async findAllMenu() {
    const items = await this.menuRepo.find({
      where: { deleted_at: IsNull() },
      order: { display_order: 'ASC' },
    });
    return this.buildTree(items);
  }

  /**
   * Luu toan bo menu tree — xoa het roi insert lai.
   * Cach tiep can "replace all" de dam bao consistency.
   */
  async saveMenu(dto: SaveMenuDto) {
    // Soft delete tat ca menu items hien tai
    await this.menuRepo
      .createQueryBuilder()
      .update(MenuItem)
      .set({ deleted_at: new Date() })
      .where('deleted_at IS NULL')
      .execute();

    // Insert lai tu tree moi
    const flatItems = this.flattenTree(dto.items, null, 0);

    if (flatItems.length > 0) {
      const entities = flatItems.map((item) => {
        return this.menuRepo.create({
          id: item.id || generateUlid(),
          label: item.label,
          url: item.url,
          target: item.target || MenuTarget.SELF,
          parent_id: item.parentId || null,
          display_order: item.displayOrder,
          is_visible: item.isVisible ?? true,
        });
      });

      await this.menuRepo.save(entities);
    }

    // Tra ve tree moi
    return this.findAllMenu();
  }

  /**
   * Chuyen flat list thanh tree — group theo parent_id.
   */
  private buildTree(items: MenuItem[]): any[] {
    const map = new Map<string, any>();
    const roots: any[] = [];

    // Tao map tu id -> item (co them children array)
    for (const item of items) {
      map.set(item.id, {
        id: item.id,
        label: item.label,
        url: item.url,
        target: item.target,
        parentId: item.parent_id,
        displayOrder: item.display_order,
        isVisible: item.is_visible,
        children: [],
      });
    }

    // Gan children vao parent
    for (const item of items) {
      const node = map.get(item.id);
      if (item.parent_id && map.has(item.parent_id)) {
        map.get(item.parent_id).children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  /**
   * Flatten tree thanh flat list de insert vao DB.
   * Giu nguyen parent_id va display_order tu input.
   */
  private flattenTree(
    items: MenuItemDto[],
    parentId: string | null,
    startOrder: number,
  ): Array<{
    id?: string;
    label: string;
    url: string;
    target?: MenuTarget;
    parentId: string | null;
    displayOrder: number;
    isVisible?: boolean;
  }> {
    const result: any[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const id = item.id || generateUlid();
      const order = item.displayOrder ?? startOrder + i;

      result.push({
        id,
        label: item.label,
        url: item.url,
        target: item.target,
        parentId,
        displayOrder: order,
        isVisible: item.isVisible,
      });

      // Xu ly children (de quy)
      if (item.children && item.children.length > 0) {
        const childItems = this.flattenTree(item.children, id, 0);
        result.push(...childItems);
      }
    }

    return result;
  }
}
