import { NotFoundException } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactStatus } from './entities/contact.entity';

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
    create: jest.fn((data: any) => data),
    save: jest.fn((entity: any) => Promise.resolve(entity)),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    _qb: qb,
  };
}

describe('ContactsService', () => {
  let service: ContactsService;
  let repo: ReturnType<typeof createMockRepo>;

  beforeEach(() => {
    repo = createMockRepo();
    service = new ContactsService(repo as any);
  });

  describe('create()', () => {
    it('should create contact with NEW status', async () => {
      const dto = {
        fullName: 'Nguyen Van A',
        email: 'test@example.com',
        phone: '0901234567',
        content: 'Toi muon dang ky cho con',
      };

      await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          full_name: 'Nguyen Van A',
          email: 'test@example.com',
          phone: '0901234567',
          content: 'Toi muon dang ky cho con',
          status: ContactStatus.NEW,
        }),
      );
      expect(repo.save).toHaveBeenCalled();
    });

    it('should handle optional phone field', async () => {
      const dto = {
        fullName: 'Nguyen Van B',
        email: 'test2@example.com',
        content: 'Hello',
      };

      await service.create(dto as any);
      const createArg = repo.create.mock.calls[0][0];
      expect(createArg.phone).toBeNull();
    });
  });

  describe('findOne()', () => {
    it('should return contact when found', async () => {
      const mockContact = { id: '1', full_name: 'Test', status: ContactStatus.NEW };
      repo.findOne.mockResolvedValue(mockContact);

      const result = await service.findOne('1');
      expect(result).toEqual(mockContact);
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus()', () => {
    it('should update contact status', async () => {
      const mockContact = { id: '1', full_name: 'Test', status: ContactStatus.NEW };
      repo.findOne
        .mockResolvedValueOnce(mockContact)  // first findOne in updateStatus
        .mockResolvedValueOnce({ ...mockContact, status: ContactStatus.READ }); // findOne after update

      const result = await service.updateStatus('1', ContactStatus.READ);
      expect(repo.update).toHaveBeenCalledWith('1', { status: ContactStatus.READ });
    });

    it('should throw NotFoundException when contact not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.updateStatus('nonexistent', ContactStatus.READ)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should soft delete contact', async () => {
      repo.findOne.mockResolvedValue({ id: '1', full_name: 'Test' });

      const result = await service.remove('1');
      expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining({ deleted_at: expect.any(Date) }));
      expect(result.message).toBeDefined();
    });

    it('should throw NotFoundException when contact not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll()', () => {
    it('should return paginated results', async () => {
      repo._qb.getCount.mockResolvedValue(3);
      repo._qb.getMany.mockResolvedValue([
        { id: '1', full_name: 'A' },
        { id: '2', full_name: 'B' },
      ]);

      const result = await service.findAll({ page: 1, limit: 10, order: 'DESC' } as any);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
    });

    it('should apply search filter across name, email, phone', async () => {
      repo._qb.getCount.mockResolvedValue(0);
      repo._qb.getMany.mockResolvedValue([]);

      await service.findAll({ page: 1, limit: 10, search: 'nguyen', order: 'DESC' } as any);
      expect(repo._qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('full_name LIKE'),
        expect.objectContaining({ search: '%nguyen%' }),
      );
    });
  });
});
