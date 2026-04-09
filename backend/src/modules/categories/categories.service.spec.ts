import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CategoriesService } from './categories.service';

function createMockRepo() {
  const qb = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(0),
    getMany: jest.fn().mockResolvedValue([]),
  };

  return {
    createQueryBuilder: jest.fn().mockReturnValue(qb),
    findOne: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockResolvedValue([]),
    create: jest.fn((data: any) => data),
    save: jest.fn((entity: any) => Promise.resolve(entity)),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    count: jest.fn().mockResolvedValue(0),
    _qb: qb,
  };
}

function createMockArticleRepo() {
  return {
    update: jest.fn().mockResolvedValue({ affected: 0 }),
  };
}

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repo: ReturnType<typeof createMockRepo>;
  let articleRepo: ReturnType<typeof createMockArticleRepo>;

  beforeEach(() => {
    repo = createMockRepo();
    articleRepo = createMockArticleRepo();
    service = new CategoriesService(repo as any, articleRepo as any);
  });

  describe('findOne()', () => {
    it('should return category with children when found', async () => {
      const mockCategory = { id: '1', name: 'Tin tức', children: [] };
      repo.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne('1');
      expect(result.data).toEqual(mockCategory);
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create()', () => {
    it('should create category with auto-generated slug', async () => {
      // slug khong trung
      repo.findOne
        .mockResolvedValueOnce(null)   // ensureSlugUnique — khong trung
        .mockResolvedValueOnce({ id: '1', name: 'New', children: [] }); // findOne after create

      const dto = { name: 'Hoạt động ngoại khóa' };
      const result = await service.create(dto as any, 'user-1');

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      const createArg = repo.create.mock.calls[0][0];
      expect(createArg.slug).toBe('hoat-dong-ngoai-khoa');
    });

    it('should throw ConflictException when slug already exists', async () => {
      repo.findOne.mockResolvedValue({ id: 'existing', slug: 'tin-tuc' });

      const dto = { name: 'Tin tức' };
      await expect(service.create(dto as any, 'user-1')).rejects.toThrow(ConflictException);
    });

    it('should verify parent exists when parentId provided', async () => {
      repo.findOne
        .mockResolvedValueOnce(null)                        // ensureSlugUnique
        .mockResolvedValueOnce(null);                       // ensureParentExists — NOT FOUND

      const dto = { name: 'Child', parentId: 'nonexistent-parent' };
      await expect(service.create(dto as any, 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should throw BadRequestException when parentId equals id (self-reference)', async () => {
      repo.findOne.mockResolvedValue({ id: 'cat-1', name: 'Test', slug: 'test' });

      const dto = { parentId: 'cat-1' };
      await expect(service.update('cat-1', dto as any, 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when category not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update('nonexistent', {} as any, 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should soft delete category with no children', async () => {
      repo.findOne.mockResolvedValue({ id: '1', name: 'Test' });
      repo.count.mockResolvedValue(0);

      const result = await service.remove('1');
      expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining({ deleted_at: expect.any(Date) }));
    });

    it('should throw BadRequestException when category has children', async () => {
      repo.findOne.mockResolvedValue({ id: '1', name: 'Parent' });
      repo.count.mockResolvedValue(3);

      await expect(service.remove('1')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when category not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll()', () => {
    it('should return paginated results for flat list', async () => {
      repo._qb.getCount.mockResolvedValue(5);
      repo._qb.getMany.mockResolvedValue([{ id: '1', name: 'Cat 1' }]);

      const result: any = await service.findAll({ page: 1, limit: 10, order: 'ASC' } as any);
      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(5);
    });

    it('should return tree structure when tree=true (wrapped in ok())', async () => {
      repo.find.mockResolvedValue([
        { id: '1', name: 'Root', parent_id: null },
        { id: '2', name: 'Child', parent_id: '1' },
      ]);

      const result = await service.findAll({ tree: 'true' } as any);
      // ok() wraps as { success, data, message }
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});
