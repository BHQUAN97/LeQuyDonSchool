import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { Media } from './entities/media.entity';
import { QueryMediaDto } from './dto/query-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { generateUlid } from '@/common/utils/ulid';
import { paginated } from '@/common/helpers/response.helper';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
  ) {}

  /**
   * Danh sach media voi phan trang, search theo ten, filter theo mime type.
   */
  async findAll(query: QueryMediaDto) {
    const { page, limit, search, mimeType, sort, order } = query;

    const qb = this.mediaRepo.createQueryBuilder('m').where('m.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(m.filename LIKE :search OR m.original_name LIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Filter theo loai mime — ho tro filter "image", "application/pdf"...
    if (mimeType) {
      qb.andWhere('m.mime_type LIKE :mimeType', { mimeType: `${mimeType}%` });
    }

    const allowedSort = ['created_at', 'updated_at', 'filename', 'size', 'original_name'];
    const sortField = allowedSort.includes(sort) ? `m.${sort}` : 'm.created_at';
    qb.orderBy(sortField, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginated(data, { page, limit, total });
  }

  /**
   * Tim media theo ID.
   */
  async findOne(id: string) {
    const media = await this.mediaRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!media) throw new NotFoundException('Không tìm thấy file');
    return media;
  }

  /**
   * Upload file — luu vao uploads/, tao record trong DB.
   * Multer da luu file vao disk, day chi xu ly metadata.
   */
  async upload(file: Express.Multer.File, userId: string) {
    if (!file) throw new BadRequestException('Không có file được gửi');

    // Tao ten file duy nhat voi ULID
    const ext = path.extname(file.originalname);
    const ulid = generateUlid();
    const uniqueFilename = `${ulid}${ext}`;

    // Rename file tu ten Multer sang ten ULID
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const newPath = path.join(uploadsDir, uniqueFilename);
    fs.renameSync(file.path, newPath);

    const media = this.mediaRepo.create({
      id: ulid,
      filename: uniqueFilename,
      original_name: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
      url: `/uploads/${uniqueFilename}`,
      thumbnail_url: null,
      alt_text: null,
      width: null,
      height: null,
      created_by: userId,
    });

    return this.mediaRepo.save(media);
  }

  /**
   * Cap nhat metadata — doi ten file hien thi, alt text.
   */
  async update(id: string, dto: UpdateMediaDto) {
    const media = await this.mediaRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!media) throw new NotFoundException('Không tìm thấy file');

    if (dto.filename !== undefined) media.filename = dto.filename;
    if (dto.alt_text !== undefined) media.alt_text = dto.alt_text;

    return this.mediaRepo.save(media);
  }

  /**
   * Soft delete — giu file tren disk, chi danh dau xoa trong DB.
   * File se duoc don dep bang cron job sau.
   */
  async remove(id: string) {
    const media = await this.mediaRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!media) throw new NotFoundException('Không tìm thấy file');

    await this.mediaRepo.update(id, { deleted_at: new Date() });
    return { message: 'Đã xóa file' };
  }
}
