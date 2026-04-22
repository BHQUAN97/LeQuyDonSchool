import { NotFoundException, ConflictException } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenuStatus } from './entities/menu.entity';

// Mock repo pattern giong articles.service.spec.ts — chain query builder + CRUD methods
function createMockRepo() {
  const qb = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(0),
    getMany: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue(null),
  };

  return {
    createQueryBuilder: jest.fn().mockReturnValue(qb),
    findOne: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockResolvedValue([]),
    create: jest.fn((data: any) => data),
    save: jest.fn((entity: any) => Promise.resolve({ ...entity, id: entity.id || 'test-id' })),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    _qb: qb,
  };
}

describe('MenusService', () => {
  let service: MenusService;
  let repo: ReturnType<typeof createMockRepo>;

  beforeEach(() => {
    repo = createMockRepo();
    service = new MenusService(repo as any);
  });

  describe('findByDate()', () => {
    it('should return menu when found', async () => {
      const mockMenu = {
        id: 'm1',
        date: '2026-04-17',
        breakfast: { mainDish: 'Pho' },
        status: MenuStatus.PUBLISHED,
      };
      repo.findOne.mockResolvedValue(mockMenu);

      const result = await service.findByDate('2026-04-17');
      expect(result).toEqual(mockMenu);
      expect(repo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: '2026-04-17',
            status: MenuStatus.PUBLISHED,
          }),
        }),
      );
    });

    it('should return null when menu not found', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.findByDate('2099-01-01');
      expect(result).toBeNull();
    });
  });

  describe('findByDateRange()', () => {
    it('should return published menus in date range ordered by date', async () => {
      const menus = [
        { id: 'm1', date: '2026-04-15' },
        { id: 'm2', date: '2026-04-16' },
      ];
      repo.find.mockResolvedValue(menus);

      const result = await service.findByDateRange('2026-04-15', '2026-04-21');
      expect(result).toEqual(menus);
      expect(repo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: MenuStatus.PUBLISHED }),
          order: { date: 'ASC' },
        }),
      );
    });
  });

  describe('findOne()', () => {
    it('should return menu when found', async () => {
      const mockMenu = { id: 'm1', date: '2026-04-17' };
      repo.findOne.mockResolvedValue(mockMenu);

      const result = await service.findOne('m1');
      expect(result).toEqual(mockMenu);
    });

    it('should throw NotFoundException when menu not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create()', () => {
    it('should create menu when date is unique', async () => {
      // ensureUniqueDate — khong co menu trung
      repo._qb.getOne.mockResolvedValue(null);

      const dto = {
        date: '2026-04-17',
        breakfast: { mainDish: 'Pho' },
        lunch: { mainDish: 'Com ga' },
        status: MenuStatus.DRAFT,
      };

      const result = await service.create(dto as any, 'user-1');
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();

      const createArg = repo.create.mock.calls[0][0];
      expect(createArg.date).toBe('2026-04-17');
      expect(createArg.breakfast).toEqual({ mainDish: 'Pho' });
      expect(createArg.lunch).toEqual({ mainDish: 'Com ga' });
      expect(createArg.created_by).toBe('user-1');
      expect(createArg.status).toBe(MenuStatus.DRAFT);
    });

    it('should throw ConflictException when date already exists', async () => {
      // ensureUniqueDate tra ve menu da ton tai → throw conflict
      repo._qb.getOne.mockResolvedValue({ id: 'existing', date: '2026-04-17' });

      const dto = { date: '2026-04-17' };
      await expect(service.create(dto as any, 'user-1')).rejects.toThrow(ConflictException);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should default status to DRAFT when not provided', async () => {
      repo._qb.getOne.mockResolvedValue(null);

      const dto = { date: '2026-04-18' };
      await service.create(dto as any, 'user-1');

      const createArg = repo.create.mock.calls[0][0];
      expect(createArg.status).toBe(MenuStatus.DRAFT);
    });
  });

  describe('copyFromDate()', () => {
    it('should copy breakfast/lunch/dinner from source menu', async () => {
      const source = {
        id: 'm-source',
        date: '2026-04-10',
        breakfast: { mainDish: 'Pho bo', vegetable: 'Rau muong' },
        lunch: { mainDish: 'Com ga', soup: 'Canh chua' },
        dinner: { mainDish: 'Bun cha' },
        note: 'Tuan truoc',
        status: MenuStatus.PUBLISHED,
      };
      // findOne cho source
      repo.findOne.mockResolvedValue(source);
      // ensureUniqueDate cho toDate
      repo._qb.getOne.mockResolvedValue(null);

      await service.copyFromDate('2026-04-10', '2026-04-17', 'user-1');

      expect(repo.create).toHaveBeenCalled();
      const createArg = repo.create.mock.calls[0][0];
      expect(createArg.date).toBe('2026-04-17');
      expect(createArg.breakfast).toEqual(source.breakfast);
      expect(createArg.lunch).toEqual(source.lunch);
      expect(createArg.dinner).toEqual(source.dinner);
      expect(createArg.note).toBe('Tuan truoc');
      // Menu dich phai la DRAFT, khong phai PUBLISHED
      expect(createArg.status).toBe(MenuStatus.DRAFT);
      expect(createArg.created_by).toBe('user-1');
    });

    it('should throw NotFoundException when source date not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        service.copyFromDate('2020-01-01', '2026-04-17', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when target date already exists', async () => {
      repo.findOne.mockResolvedValue({ id: 'src', date: '2026-04-10', breakfast: null });
      repo._qb.getOne.mockResolvedValue({ id: 'dup', date: '2026-04-17' });

      await expect(
        service.copyFromDate('2026-04-10', '2026-04-17', 'user-1'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove()', () => {
    it('should soft-delete menu (set deleted_at)', async () => {
      repo.findOne.mockResolvedValue({ id: 'm1', date: '2026-04-17' });

      const result = await service.remove('m1');
      expect(repo.update).toHaveBeenCalledWith(
        'm1',
        expect.objectContaining({ deleted_at: expect.any(Date) }),
      );
      expect(result.message).toBeDefined();
    });

    it('should throw NotFoundException when menu not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update menu fields', async () => {
      const existing = { id: 'm1', date: '2026-04-17' };
      repo.findOne.mockResolvedValue(existing);
      // findOne se duoc goi lai trong findOne() sau update — mock lai
      repo.findOne.mockResolvedValueOnce(existing).mockResolvedValueOnce({
        ...existing,
        note: 'Updated',
      });

      const dto = { note: 'Updated', status: MenuStatus.PUBLISHED };
      await service.update('m1', dto as any, 'user-2');

      expect(repo.update).toHaveBeenCalledWith(
        'm1',
        expect.objectContaining({
          note: 'Updated',
          status: MenuStatus.PUBLISHED,
          updated_by: 'user-2',
        }),
      );
    });

    it('should throw NotFoundException when menu not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update('nonexistent', {} as any, 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
