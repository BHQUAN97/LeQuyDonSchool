/**
 * Security tests — Category circular reference & orphan articles
 *
 * VULN #5: update() only checks direct self-reference (parentId === id),
 *          not indirect chains like A->B->C, then set C.parent=A.
 * VULN #6: remove() does not handle articles referencing the deleted category.
 */

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from '../categories.service';

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
  };
}

function createMockArticleRepo() {
  return {
    update: jest.fn().mockResolvedValue({ affected: 0 }),
  };
}

describe('Categories Security', () => {
  let service: CategoriesService;
  let repo: ReturnType<typeof createMockRepo>;
  let articleRepo: ReturnType<typeof createMockArticleRepo>;

  beforeEach(() => {
    repo = createMockRepo();
    articleRepo = createMockArticleRepo();
    service = new CategoriesService(repo as any, articleRepo as any);
  });

  describe('FIX #5: Circular parent reference — both direct and indirect blocked', () => {
    it('blocks direct self-reference (A.parent = A)', async () => {
      repo.findOne.mockResolvedValue({ id: 'cat-A', name: 'A', slug: 'a', parent_id: null });

      await expect(
        service.update('cat-A', { parentId: 'cat-A' } as any, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('blocks indirect circular reference (A->B->C, set A.parent=C)', async () => {
      // findOne calls for checkCircularReference:
      // 1. Find category A (the one being updated)
      // 2. checkCircularReference: find cat-C (parent_id: cat-B)
      // 3. checkCircularReference: find cat-B (parent_id: cat-A)
      // 4. checkCircularReference: cat-A === categoryId → throws
      repo.findOne
        .mockResolvedValueOnce({ id: 'cat-A', name: 'A', slug: 'a', parent_id: null }) // category A found
        .mockResolvedValueOnce({ id: 'cat-C', name: 'C', slug: 'c', parent_id: 'cat-B' }) // checkCircular: C's parent is B
        .mockResolvedValueOnce({ id: 'cat-B', name: 'B', slug: 'b', parent_id: 'cat-A' }); // checkCircular: B's parent is A → cycle!

      await expect(
        service.update('cat-A', { parentId: 'cat-C' } as any, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('blocks 2-level indirect cycle (A->B, set A.parent=B creates A->B->A)', async () => {
      // checkCircularReference walks: B -> parent_id=cat-A → matches categoryId → throws
      repo.findOne
        .mockResolvedValueOnce({ id: 'cat-A', name: 'A', slug: 'a', parent_id: null }) // find A
        .mockResolvedValueOnce({ id: 'cat-B', name: 'B', slug: 'b', parent_id: 'cat-A' }); // checkCircular: B's parent is A → cycle!

      await expect(
        service.update('cat-A', { parentId: 'cat-B' } as any, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('FIX #6: Category delete now nullifies article references', () => {
    it('should set category_id=null on articles before deleting category', async () => {
      repo.findOne.mockResolvedValue({ id: 'cat-1', name: 'Tin tuc' });
      repo.count.mockResolvedValue(0); // no child categories
      articleRepo.update.mockResolvedValue({ affected: 3 });

      const result = await service.remove('cat-1');
      expect(result.data.message).toBeDefined();

      // Verify: articleRepo.update was called to nullify category_id
      expect(articleRepo.update).toHaveBeenCalledWith(
        { category_id: 'cat-1' },
        { category_id: null },
      );

      // Category soft-deleted after articles are unlinked
      expect(repo.update).toHaveBeenCalledWith('cat-1', expect.objectContaining({ deleted_at: expect.any(Date) }));
    });
  });
});
