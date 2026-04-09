import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { AdmissionPost, AdmissionPostStatus } from './entities/admission-post.entity';
import { AdmissionFaq } from './entities/admission-faq.entity';
import { AdmissionRegistration, RegistrationStatus } from './entities/admission-registration.entity';
import { CreateAdmissionPostDto } from './dto/create-admission-post.dto';
import { UpdateAdmissionPostDto } from './dto/update-admission-post.dto';
import { QueryAdmissionPostDto } from './dto/query-admission-post.dto';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationStatusDto } from './dto/update-registration-status.dto';
import { QueryRegistrationDto } from './dto/query-registration.dto';
import { generateUlid } from '@/common/utils/ulid';
import { escapeLike } from '@/common/utils/query.utils';
import { paginated } from '@/common/helpers/response.helper';

@Injectable()
export class AdmissionsService {
  constructor(
    @InjectRepository(AdmissionPost) private readonly postRepo: Repository<AdmissionPost>,
    @InjectRepository(AdmissionFaq) private readonly faqRepo: Repository<AdmissionFaq>,
    @InjectRepository(AdmissionRegistration) private readonly regRepo: Repository<AdmissionRegistration>,
  ) {}

  // ─── BÀI ĐĂNG TUYỂN SINH ────────────────────────────────

  /**
   * Danh sach bai dang cho admin — phan trang, search, filter.
   */
  async findAllPosts(query: QueryAdmissionPostDto) {
    const { page, limit, search, status, sort, order } = query;

    const qb = this.postRepo.createQueryBuilder('p').where('p.deleted_at IS NULL');

    if (search) {
      qb.andWhere('p.title LIKE :search', { search: `%${escapeLike(search)}%` });
    }
    if (status) {
      qb.andWhere('p.status = :status', { status });
    }

    const allowedSort = ['created_at', 'updated_at', 'published_at', 'title'];
    const sortField = allowedSort.includes(sort) ? `p.${sort}` : 'p.created_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Bai dang tuyen sinh public — chi published.
   */
  async findPublicPosts(query: QueryAdmissionPostDto) {
    const { page, limit, search, sort, order } = query;

    const qb = this.postRepo
      .createQueryBuilder('p')
      .where('p.deleted_at IS NULL')
      .andWhere('p.status = :status', { status: AdmissionPostStatus.PUBLISHED });

    if (search) {
      qb.andWhere('p.title LIKE :search', { search: `%${escapeLike(search)}%` });
    }

    const allowedSort = ['published_at', 'created_at', 'title'];
    const sortField = allowedSort.includes(sort) ? `p.${sort}` : 'p.published_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Chi tiet bai dang theo ID.
   */
  async findOnePost(id: string) {
    const post = await this.postRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!post) throw new NotFoundException('Không tìm thấy bài đăng');
    return post;
  }

  /**
   * Tao bai dang moi — tu dong tao slug tu title.
   */
  async createPost(dto: CreateAdmissionPostDto, createdBy: string) {
    const slug = dto.slug || this.generateSlug(dto.title);
    await this.ensureUniqueSlug(slug);

    // Tu dong set published_at khi status = published
    let publishedAt: Date | null = null;
    if (dto.publishedAt) {
      publishedAt = new Date(dto.publishedAt);
    } else if (dto.status === AdmissionPostStatus.PUBLISHED) {
      publishedAt = new Date();
    }

    const post = this.postRepo.create({
      id: generateUlid(),
      title: dto.title,
      slug,
      content: dto.content,
      thumbnail_url: dto.thumbnailUrl || null,
      status: dto.status || AdmissionPostStatus.DRAFT,
      published_at: publishedAt,
      created_by: createdBy,
    });

    return this.postRepo.save(post);
  }

  /**
   * Cap nhat bai dang — re-gen slug neu title thay doi.
   */
  async updatePost(id: string, dto: UpdateAdmissionPostDto, updatedBy: string) {
    const post = await this.postRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!post) throw new NotFoundException('Không tìm thấy bài đăng');

    const updateData: Partial<AdmissionPost> = { updated_by: updatedBy };

    // Re-gen slug neu title thay doi va khong co slug thu cong
    if (dto.title && dto.title !== post.title) {
      const newSlug = dto.slug || this.generateSlug(dto.title);
      if (newSlug !== post.slug) {
        await this.ensureUniqueSlug(newSlug, id);
        updateData.slug = newSlug;
      }
      updateData.title = dto.title;
    } else if (dto.slug && dto.slug !== post.slug) {
      await this.ensureUniqueSlug(dto.slug, id);
      updateData.slug = dto.slug;
    }

    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.thumbnailUrl !== undefined) updateData.thumbnail_url = dto.thumbnailUrl || null;

    // Xu ly status va published_at
    if (dto.status) {
      updateData.status = dto.status;
      if (dto.status === AdmissionPostStatus.PUBLISHED && !post.published_at && !dto.publishedAt) {
        updateData.published_at = new Date();
      }
    }
    if (dto.publishedAt !== undefined) {
      updateData.published_at = dto.publishedAt ? new Date(dto.publishedAt) : null;
    }

    await this.postRepo.update(id, updateData);
    return this.findOnePost(id);
  }

  /**
   * Soft delete bai dang.
   */
  async removePost(id: string) {
    const post = await this.postRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!post) throw new NotFoundException('Không tìm thấy bài đăng');

    await this.postRepo.update(id, { deleted_at: new Date() });
    return { message: 'Đã xóa bài đăng' };
  }

  // ─── FAQ ─────────────────────────────────────────────────

  /**
   * Danh sach FAQ public — chi hien visible, sap xep theo display_order.
   */
  async findPublicFaq() {
    return this.faqRepo.find({
      where: { is_visible: true, deleted_at: IsNull() },
      order: { display_order: 'ASC' },
    });
  }

  /**
   * Danh sach FAQ cho admin — tat ca.
   */
  async findAllFaq() {
    return this.faqRepo.find({
      where: { deleted_at: IsNull() },
      order: { display_order: 'ASC' },
    });
  }

  /**
   * Tao FAQ moi.
   */
  async createFaq(dto: CreateFaqDto) {
    const faq = this.faqRepo.create({
      id: generateUlid(),
      question: dto.question,
      answer: dto.answer,
      display_order: dto.displayOrder ?? 0,
      is_visible: dto.isVisible ?? true,
    });
    return this.faqRepo.save(faq);
  }

  /**
   * Cap nhat FAQ.
   */
  async updateFaq(id: string, dto: UpdateFaqDto) {
    const faq = await this.faqRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!faq) throw new NotFoundException('Không tìm thấy FAQ');

    const updateData: Partial<AdmissionFaq> = {};
    if (dto.question !== undefined) updateData.question = dto.question;
    if (dto.answer !== undefined) updateData.answer = dto.answer;
    if (dto.displayOrder !== undefined) updateData.display_order = dto.displayOrder;
    if (dto.isVisible !== undefined) updateData.is_visible = dto.isVisible;

    await this.faqRepo.update(id, updateData);
    return this.faqRepo.findOne({ where: { id } });
  }

  /**
   * Soft delete FAQ.
   */
  async removeFaq(id: string) {
    const faq = await this.faqRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!faq) throw new NotFoundException('Không tìm thấy FAQ');

    await this.faqRepo.update(id, { deleted_at: new Date() });
    return { message: 'Đã xóa FAQ' };
  }

  // ─── ĐĂNG KÝ TUYỂN SINH ─────────────────────────────────

  /**
   * Danh sach dang ky — admin, phan trang + filter.
   */
  async findAllRegistrations(query: QueryRegistrationDto) {
    const { page, limit, search, status, grade, sort, order } = query;

    const qb = this.regRepo.createQueryBuilder('r').where('r.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(r.full_name LIKE :search OR r.phone LIKE :search OR r.email LIKE :search)', {
        search: `%${escapeLike(search)}%`,
      });
    }
    if (status) {
      qb.andWhere('r.status = :status', { status });
    }
    if (grade) {
      qb.andWhere('r.grade = :grade', { grade });
    }

    const allowedSort = ['created_at', 'full_name', 'grade', 'status'];
    const sortField = allowedSort.includes(sort) ? `r.${sort}` : 'r.created_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Tao dang ky tuyen sinh moi — tu form public.
   */
  async createRegistration(dto: CreateRegistrationDto) {
    const reg = this.regRepo.create({
      id: generateUlid(),
      full_name: dto.fullName,
      phone: dto.phone,
      email: dto.email || null,
      grade: dto.grade,
      is_club_member: dto.isClubMember ?? false,
      status: RegistrationStatus.NEW,
      note: dto.note || null,
    });
    return this.regRepo.save(reg);
  }

  /**
   * Cap nhat trang thai dang ky.
   */
  async updateRegistrationStatus(id: string, dto: UpdateRegistrationStatusDto) {
    const reg = await this.regRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!reg) throw new NotFoundException('Không tìm thấy đăng ký');

    const updateData: Partial<AdmissionRegistration> = { status: dto.status };
    if (dto.note !== undefined) updateData.note = dto.note;

    await this.regRepo.update(id, updateData);
    return this.regRepo.findOne({ where: { id } });
  }

  // ─── HELPERS ─────────────────────────────────────────────

  /**
   * Tao slug tu title — chuyen tieng Viet, lowercase, thay dau cach bang "-".
   */
  private generateSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 280);
  }

  /**
   * Dam bao slug khong trung voi bai dang khac.
   */
  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const qb = this.postRepo
      .createQueryBuilder('p')
      .where('p.slug = :slug', { slug })
      .andWhere('p.deleted_at IS NULL');

    if (excludeId) {
      qb.andWhere('p.id != :excludeId', { excludeId });
    }

    const existing = await qb.getOne();
    if (existing) {
      throw new ConflictException('Slug đã tồn tại, vui lòng chọn slug khác');
    }
  }
}
