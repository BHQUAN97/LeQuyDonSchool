import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Contact, ContactStatus } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { generateUlid } from '@/common/utils/ulid';
import { paginated } from '@/common/helpers/response.helper';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private readonly contactRepo: Repository<Contact>,
  ) {}

  /**
   * Danh sach lien he voi phan trang, search, filter status.
   */
  async findAll(query: QueryContactDto) {
    const { page, limit, search, status, sort, order } = query;

    const qb = this.contactRepo.createQueryBuilder('c').where('c.deleted_at IS NULL');

    if (search) {
      qb.andWhere(
        '(c.full_name LIKE :search OR c.email LIKE :search OR c.phone LIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (status) qb.andWhere('c.status = :status', { status });

    const allowedSort = ['created_at', 'updated_at', 'full_name', 'email', 'status'];
    const sortField = allowedSort.includes(sort) ? `c.${sort}` : 'c.created_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Xem chi tiet lien he.
   */
  async findOne(id: string) {
    const contact = await this.contactRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!contact) throw new NotFoundException('Khong tim thay lien he');
    return contact;
  }

  /**
   * Khach truy cap gui lien he.
   */
  async create(dto: CreateContactDto) {
    const contact = this.contactRepo.create({
      id: generateUlid(),
      full_name: dto.fullName,
      email: dto.email,
      phone: dto.phone || null,
      content: dto.content,
      status: ContactStatus.NEW,
    });

    return this.contactRepo.save(contact);
  }

  /**
   * Cap nhat trang thai lien he (new -> read -> replied).
   */
  async updateStatus(id: string, status: ContactStatus) {
    const contact = await this.contactRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!contact) throw new NotFoundException('Khong tim thay lien he');

    await this.contactRepo.update(id, { status });
    return this.findOne(id);
  }

  /**
   * Soft delete lien he.
   */
  async remove(id: string) {
    const contact = await this.contactRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!contact) throw new NotFoundException('Khong tim thay lien he');

    await this.contactRepo.update(id, { deleted_at: new Date() });
    return { message: 'Da xoa lien he' };
  }
}
