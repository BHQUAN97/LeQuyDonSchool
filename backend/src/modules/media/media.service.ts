import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { escapeLike } from '@/common/utils/query.utils';
import { Repository, IsNull } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { Media } from './entities/media.entity';
import { QueryMediaDto } from './dto/query-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { R2Service } from './r2.service';
import { generateUlid } from '@/common/utils/ulid';
import { paginated } from '@/common/helpers/response.helper';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    private readonly r2Service: R2Service,
  ) {}

  /**
   * Danh sach media voi phan trang, search theo ten, filter theo mime type.
   */
  async findAll(query: QueryMediaDto) {
    const { page, limit, search, mimeType, sort, order } = query;

    const qb = this.mediaRepo.createQueryBuilder('m').where('m.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(m.filename LIKE :search OR m.original_name LIKE :search)', {
        search: `%${escapeLike(search)}%`,
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
   * Upload file — neu R2 da config thi upload len R2, neu khong thi luu local.
   * Multer da luu file vao temp disk, day xu ly metadata + storage.
   */
  async upload(file: Express.Multer.File, userId: string) {
    if (!file) throw new BadRequestException('Không có file được gửi');

    let url: string;
    let filename: string;
    let ulid: string;

    if (this.r2Service.isEnabled()) {
      // Upload len R2
      const { key, ulid: id } = this.r2Service.generateKey(file.originalname);
      ulid = id;
      filename = key;

      const buffer = fs.readFileSync(file.path);
      url = await this.r2Service.upload(key, buffer, file.mimetype);

      // Xoa file temp sau khi upload thanh cong
      this.cleanupTempFile(file.path);
    } else {
      // Fallback: luu local nhu cu
      const ext = path.extname(file.originalname);
      ulid = generateUlid();
      filename = `${ulid}${ext}`;

      const uploadsDir = path.resolve(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const newPath = path.join(uploadsDir, filename);
      // copyFile + unlink thay vi rename de tranh EXDEV khi khac o dia
      fs.copyFileSync(file.path, newPath);
      this.cleanupTempFile(file.path);

      url = `/uploads/${filename}`;
    }

    const media = this.mediaRepo.create({
      id: ulid,
      filename,
      original_name: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
      url,
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

    // filename (storage key) la immutable — chi cho update metadata
    if (dto.original_name !== undefined) media.original_name = dto.original_name;
    if (dto.alt_text !== undefined) media.alt_text = dto.alt_text;

    return this.mediaRepo.save(media);
  }

  /**
   * Soft delete — danh dau xoa trong DB va xoa file tren R2 (neu dung R2).
   */
  async remove(id: string) {
    const media = await this.mediaRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!media) throw new NotFoundException('Không tìm thấy file');

    // Xoa file tren storage — R2 hoac local
    if (this.r2Service.isEnabled() && media.filename.startsWith('media/')) {
      await this.r2Service.delete(media.filename);
    } else if (!this.r2Service.isEnabled()) {
      // Xoa file local khi khong dung R2
      const localPath = path.resolve(process.cwd(), 'uploads', media.filename);
      this.cleanupTempFile(localPath);
    }

    await this.mediaRepo.update(id, { deleted_at: new Date() });
    return { message: 'Đã xóa file' };
  }

  /** Xoa file temp — best effort, khong throw */
  private cleanupTempFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      this.logger.warn(`Failed to cleanup temp file: ${filePath}`);
    }
  }
}
