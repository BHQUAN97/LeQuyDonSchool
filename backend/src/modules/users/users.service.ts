import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { generateUlid } from '@/common/utils/ulid';
import { paginated } from '@/common/helpers/response.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Danh sach users voi phan trang, search, filter.
   */
  async findAll(query: QueryUserDto) {
    const { page, limit, search, role, status, sort, order } = query;

    const qb = this.userRepo.createQueryBuilder('u').where('u.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(u.full_name LIKE :search OR u.email LIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (role) qb.andWhere('u.role = :role', { role });
    if (status) qb.andWhere('u.status = :status', { status });

    // Sort — chi cho phep cac truong an toan
    const allowedSort = ['created_at', 'updated_at', 'full_name', 'email', 'last_login_at'];
    const sortField = allowedSort.includes(sort) ? `u.${sort}` : 'u.created_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    // Loai bo password_hash
    const safeData = data.map(({ password_hash, ...rest }) => rest);
    return paginated(safeData, { page, limit, total });
  }

  /**
   * Tim user theo ID.
   */
  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản');
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Tao user moi — kiem tra email trung.
   */
  async create(dto: CreateUserDto, createdBy: string) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email, deleted_at: IsNull() },
    });
    if (existing) throw new ConflictException('Email đã được sử dụng');

    const user = this.userRepo.create({
      id: generateUlid(),
      email: dto.email,
      password_hash: await bcrypt.hash(dto.password, 10),
      full_name: dto.fullName,
      phone: dto.phone || null,
      role: dto.role,
      status: UserStatus.ACTIVE,
      created_by: createdBy,
    });

    const saved = await this.userRepo.save(user);
    const { password_hash, ...safeUser } = saved;
    return safeUser;
  }

  /**
   * Cap nhat user — kiem tra email trung voi user khac.
   */
  async update(id: string, dto: UpdateUserDto, updatedBy: string) {
    const user = await this.userRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản');

    // Kiem tra email trung voi user khac
    if (dto.email && dto.email !== user.email) {
      const emailTaken = await this.userRepo.findOne({
        where: { email: dto.email, id: Not(id), deleted_at: IsNull() },
      });
      if (emailTaken) throw new ConflictException('Email đã được sử dụng');
    }

    // Bao ve super admin cuoi cung
    if (dto.status === UserStatus.INACTIVE || (dto.role && dto.role !== UserRole.SUPER_ADMIN)) {
      await this.ensureNotLastSuperAdmin(id);
    }

    const updateData: Partial<User> = { updated_by: updatedBy };
    if (dto.fullName) updateData.full_name = dto.fullName;
    if (dto.email) updateData.email = dto.email;
    if (dto.role) updateData.role = dto.role;
    if (dto.status) updateData.status = dto.status;
    if (dto.phone !== undefined) updateData.phone = dto.phone || null;
    if (dto.avatarUrl !== undefined) updateData.avatar_url = dto.avatarUrl || null;

    await this.userRepo.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Soft delete user — bao ve super admin cuoi cung.
   */
  async remove(id: string) {
    const user = await this.userRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản');

    await this.ensureNotLastSuperAdmin(id);
    await this.userRepo.update(id, { deleted_at: new Date() });
    return { message: 'Đã xóa tài khoản' };
  }

  /**
   * Dam bao khong xoa/vo hieu hoa super admin cuoi cung.
   */
  private async ensureNotLastSuperAdmin(excludeId: string) {
    const count = await this.userRepo.count({
      where: {
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        deleted_at: IsNull(),
        id: Not(excludeId),
      },
    });

    if (count === 0) {
      throw new ForbiddenException('Không thể thực hiện — đây là Super Admin cuối cùng');
    }
  }
}
