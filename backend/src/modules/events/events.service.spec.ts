import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventStatus } from './entities/event.entity';

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
    _qb: qb,
  };
}

describe('EventsService', () => {
  let service: EventsService;
  let repo: ReturnType<typeof createMockRepo>;

  beforeEach(() => {
    repo = createMockRepo();
    service = new EventsService(repo as any);
  });

  describe('findOne()', () => {
    it('should return event when found', async () => {
      const mockEvent = { id: '1', title: 'Khai giảng', status: EventStatus.UPCOMING };
      repo.findOne.mockResolvedValue(mockEvent);

      const result = await service.findOne('1');
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException when event not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUpcoming()', () => {
    it('should return upcoming and ongoing events', async () => {
      const events = [
        { id: '1', title: 'Event 1', status: EventStatus.UPCOMING },
        { id: '2', title: 'Event 2', status: EventStatus.ONGOING },
      ];
      repo.find.mockResolvedValue(events);

      const result = await service.findUpcoming();
      expect(result).toHaveLength(2);
      expect(repo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { start_date: 'ASC' },
        }),
      );
    });

    it('should return empty array when no upcoming events', async () => {
      repo.find.mockResolvedValue([]);

      const result = await service.findUpcoming();
      expect(result).toHaveLength(0);
    });
  });

  describe('create()', () => {
    it('should create event with required fields', async () => {
      const dto = {
        title: 'Ngày hội thể thao',
        startDate: '2024-12-15T08:00:00Z',
        status: EventStatus.UPCOMING,
      };

      await service.create(dto as any, 'user-1');

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Ngày hội thể thao',
          start_date: expect.any(Date),
          status: EventStatus.UPCOMING,
          created_by: 'user-1',
        }),
      );
      expect(repo.save).toHaveBeenCalled();
    });

    it('should handle optional fields', async () => {
      const dto = {
        title: 'Simple Event',
        startDate: '2024-12-15',
      };

      await service.create(dto as any, 'user-1');
      const createArg = repo.create.mock.calls[0][0];
      expect(createArg.description).toBeNull();
      expect(createArg.end_date).toBeNull();
      expect(createArg.location).toBeNull();
    });
  });

  describe('update()', () => {
    it('should update event fields', async () => {
      repo.findOne
        .mockResolvedValueOnce({ id: '1', title: 'Old Title' })  // first findOne
        .mockResolvedValueOnce({ id: '1', title: 'New Title' }); // findOne after update

      const dto = { title: 'New Title', location: 'Sân trường' };
      const result = await service.update('1', dto as any, 'user-1');

      expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'New Title',
        location: 'Sân trường',
        updated_by: 'user-1',
      }));
    });

    it('should throw NotFoundException when event not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update('nonexistent', {} as any, 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should soft delete event', async () => {
      repo.findOne.mockResolvedValue({ id: '1', title: 'Test Event' });

      const result = await service.remove('1');
      expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining({ deleted_at: expect.any(Date) }));
      expect(result.message).toBeDefined();
    });

    it('should throw NotFoundException when event not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll()', () => {
    it('should return paginated results', async () => {
      repo._qb.getCount.mockResolvedValue(10);
      repo._qb.getMany.mockResolvedValue([{ id: '1', title: 'Event' }]);

      const result = await service.findAll({ page: 1, limit: 10, order: 'DESC' } as any);
      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(10);
    });
  });
});
