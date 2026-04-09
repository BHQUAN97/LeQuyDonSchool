import { NotFoundException, ConflictException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleStatus } from './entities/article.entity';

// Mock articleRepo
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
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
  };

  return {
    createQueryBuilder: jest.fn().mockReturnValue(qb),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn((data: any) => data),
    save: jest.fn((entity: any) => Promise.resolve({ ...entity, id: entity.id || 'test-id' })),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    _qb: qb,
  };
}

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repo: ReturnType<typeof createMockRepo>;

  beforeEach(() => {
    repo = createMockRepo();
    service = new ArticlesService(repo as any);
  });

  describe('findOne()', () => {
    it('should return article when found', async () => {
      const mockArticle = { id: '1', title: 'Test', slug: 'test' };
      repo.findOne.mockResolvedValue(mockArticle);

      const result = await service.findOne('1');
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when article not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug()', () => {
    it('should return published article by slug', async () => {
      const mockArticle = { id: '1', title: 'Test', slug: 'test-article', status: ArticleStatus.PUBLISHED };
      repo.findOne.mockResolvedValue(mockArticle);

      const result = await service.findBySlug('test-article');
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when slug not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findBySlug('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create()', () => {
    it('should create article with auto-generated slug', async () => {
      // ensureUniqueSlug — slug khong trung
      repo._qb.getOne.mockResolvedValue(null);

      const dto = {
        title: 'Bài viết mới',
        content: '<p>Nội dung</p>',
        status: ArticleStatus.DRAFT,
      };

      const result = await service.create(dto as any, 'user-1');
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();

      const createArg = repo.create.mock.calls[0][0];
      expect(createArg.title).toBe('Bài viết mới');
      expect(createArg.slug).toBe('bai-viet-moi');
      expect(createArg.created_by).toBe('user-1');
    });

    it('should set published_at when status is PUBLISHED', async () => {
      repo._qb.getOne.mockResolvedValue(null);

      const dto = {
        title: 'Published Article',
        content: 'content',
        status: ArticleStatus.PUBLISHED,
      };

      await service.create(dto as any, 'user-1');
      const createArg = repo.create.mock.calls[0][0];
      expect(createArg.published_at).toBeInstanceOf(Date);
    });

    it('should throw ConflictException when slug already exists', async () => {
      repo._qb.getOne.mockResolvedValue({ id: 'existing', slug: 'test' });

      const dto = { title: 'Test', content: 'content' };
      await expect(service.create(dto as any, 'user-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('remove()', () => {
    it('should soft delete article', async () => {
      repo.findOne.mockResolvedValue({ id: '1', title: 'Test' });

      const result = await service.remove('1');
      expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining({ deleted_at: expect.any(Date) }));
      expect(result.message).toBeDefined();
    });

    it('should throw NotFoundException when article not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll()', () => {
    it('should return paginated results', async () => {
      repo._qb.getCount.mockResolvedValue(2);
      repo._qb.getMany.mockResolvedValue([
        { id: '1', title: 'Article 1' },
        { id: '2', title: 'Article 2' },
      ]);

      const result = await service.findAll({ page: 1, limit: 10, order: 'DESC' } as any);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should apply search filter', async () => {
      repo._qb.getCount.mockResolvedValue(0);
      repo._qb.getMany.mockResolvedValue([]);

      await service.findAll({ page: 1, limit: 10, search: 'test', order: 'DESC' } as any);
      expect(repo._qb.andWhere).toHaveBeenCalledWith('a.title LIKE :search', { search: '%test%' });
    });
  });

  describe('slug generation (via create)', () => {
    beforeEach(() => {
      repo._qb.getOne.mockResolvedValue(null);
    });

    it('should generate slug from Vietnamese title', async () => {
      const dto = { title: 'Khai giảng năm học mới 2024', content: 'c' };
      await service.create(dto as any, 'u1');
      const slug = repo.create.mock.calls[0][0].slug;
      expect(slug).toBe('khai giang nam hoc moi 2024'.replace(/ /g, '-'));
    });

    it('should handle special characters in title', async () => {
      const dto = { title: 'Đại hội thể dục & thể thao', content: 'c' };
      await service.create(dto as any, 'u1');
      const slug = repo.create.mock.calls[0][0].slug;
      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug).not.toContain('&');
    });
  });
});
