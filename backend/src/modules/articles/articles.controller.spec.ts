import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: Partial<ArticlesService>;

  beforeEach(() => {
    service = {
      findAll: jest.fn().mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 10 } }),
      findAllPublic: jest.fn().mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 10 } }),
      findOne: jest.fn().mockResolvedValue({ id: '1', title: 'Test' }),
      findBySlug: jest.fn().mockResolvedValue({ id: '1', title: 'Test', slug: 'test' }),
      create: jest.fn().mockResolvedValue({ id: '1', title: 'New Article' }),
      update: jest.fn().mockResolvedValue({ id: '1', title: 'Updated' }),
      remove: jest.fn().mockResolvedValue({ message: 'Deleted' }),
      incrementViewCount: jest.fn().mockResolvedValue(undefined),
    };

    controller = new ArticlesController(service as ArticlesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should call service.findAll with query params', async () => {
      const query = { page: 1, limit: 10, order: 'DESC' } as any;
      const result = await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result.data).toEqual([]);
    });
  });

  describe('findAllPublic()', () => {
    it('should call service.findAllPublic', async () => {
      const query = { page: 1, limit: 10 } as any;
      await controller.findAllPublic(query);
      expect(service.findAllPublic).toHaveBeenCalledWith(query);
    });
  });

  describe('findBySlug()', () => {
    it('should return article by slug and increment view count', async () => {
      const result = await controller.findBySlug('test-slug');
      expect(service.findBySlug).toHaveBeenCalledWith('test-slug');
      expect(service.incrementViewCount).toHaveBeenCalledWith('1');
    });
  });

  describe('findOne()', () => {
    it('should return article by ID', async () => {
      const result = await controller.findOne('article-id');
      expect(service.findOne).toHaveBeenCalledWith('article-id');
      expect(result.title).toBe('Test');
    });
  });

  describe('create()', () => {
    it('should create article with user ID', async () => {
      const dto = { title: 'New', content: 'Content' } as any;
      await controller.create(dto, 'user-1');
      expect(service.create).toHaveBeenCalledWith(dto, 'user-1');
    });
  });

  describe('update()', () => {
    it('should update article by ID', async () => {
      const dto = { title: 'Updated Title' } as any;
      await controller.update('article-1', dto, 'user-1');
      expect(service.update).toHaveBeenCalledWith('article-1', dto, 'user-1');
    });
  });

  describe('remove()', () => {
    it('should remove article by ID', async () => {
      const result = await controller.remove('article-1');
      expect(service.remove).toHaveBeenCalledWith('article-1');
    });
  });
});
