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
import { ImageProcessorService } from './image-processor.service';
import { generateUlid } from '@/common/utils/ulid';
import { paginated } from '@/common/helpers/response.helper';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly uploadsDir = path.resolve(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    private readonly r2Service: R2Service,
    private readonly imageProcessor: ImageProcessorService,
  ) {}

  /**
   * Build thumbnail key/path tu original key/filename.
   * Pattern: {original_key}.thumb.webp — cung thu muc voi original.
   */
  private buildThumbnailKey(originalKey: string): string {
    return `${originalKey}.thumb.webp`;
  }

  /**
   * Resolve filename thanh absolute path trong uploadsDir.
   * Reject traversal (..), null byte, absolute path, separators.
   */
  private resolveSafeUploadPath(filename: string): string {
    if (typeof filename !== 'string' || filename.length === 0) {
      throw new BadRequestException('Tên file không hợp lệ');
    }
    if (filename.includes('\0') || filename.includes('..')) {
      throw new BadRequestException('Tên file không hợp lệ');
    }
    // Reject absolute paths va path separators — filename phai la basename
    if (path.isAbsolute(filename) || /[/\\]/.test(filename)) {
      throw new BadRequestException('Tên file không hợp lệ');
    }

    const resolved = path.resolve(this.uploadsDir, filename);
    const rel = path.relative(this.uploadsDir, resolved);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new BadRequestException('Tên file không hợp lệ');
    }
    return resolved;
  }

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
    let thumbnailUrl: string | null = null;
    let width: number | null = null;
    let height: number | null = null;

    // Doc buffer mot lan, tai su dung cho original + thumbnail + dimensions
    // (voi local path thi fs.readFileSync, voi R2 cung can buffer → unified doc som)
    const buffer = fs.readFileSync(file.path);
    const isImage = this.imageProcessor.isImage(file.mimetype);

    if (this.r2Service.isEnabled()) {
      // Upload len R2
      const { key, ulid: id } = this.r2Service.generateKey(file.originalname);
      ulid = id;
      filename = key;

      url = await this.r2Service.upload(key, buffer, file.mimetype);

      // Generate + upload thumbnail cho anh — fail silent de khong block original
      if (isImage) {
        const thumbBuffer = await this.imageProcessor.generateThumbnail(buffer, file.mimetype);
        if (thumbBuffer) {
          try {
            const thumbKey = this.buildThumbnailKey(key);
            thumbnailUrl = await this.r2Service.upload(thumbKey, thumbBuffer, 'image/webp');
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logger.warn(`Thumbnail upload R2 fail cho ${key}: ${msg}`);
            thumbnailUrl = url; // fallback dung original URL
          }
        } else {
          thumbnailUrl = url; // sharp fail → dung original
        }
      }
    } else {
      // Fallback: luu local. Filename = ULID + ext → an toan, khong phu thuoc user input.
      const ext = path.extname(file.originalname).toLowerCase();
      ulid = generateUlid();
      filename = `${ulid}${ext}`;

      if (!fs.existsSync(this.uploadsDir)) {
        fs.mkdirSync(this.uploadsDir, { recursive: true });
      }
      const newPath = this.resolveSafeUploadPath(filename);
      // copyFile + unlink thay vi rename de tranh EXDEV khi khac o dia
      fs.copyFileSync(file.path, newPath);

      url = `/uploads/${filename}`;

      // Generate + ghi thumbnail local cho anh
      if (isImage) {
        const thumbBuffer = await this.imageProcessor.generateThumbnail(buffer, file.mimetype);
        if (thumbBuffer) {
          try {
            const thumbFilename = this.buildThumbnailKey(filename);
            const thumbPath = this.resolveSafeUploadPath(thumbFilename);
            fs.writeFileSync(thumbPath, thumbBuffer);
            thumbnailUrl = `/uploads/${thumbFilename}`;
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logger.warn(`Thumbnail write local fail: ${msg}`);
            thumbnailUrl = url;
          }
        } else {
          thumbnailUrl = url;
        }
      }
    }

    // Doc dimensions tu buffer goc — chi anh moi co
    if (isImage) {
      const dims = await this.imageProcessor.getDimensions(buffer);
      if (dims) {
        width = dims.width;
        height = dims.height;
      }
    }

    // Xoa file temp sau khi da xu ly xong (original + thumb + metadata)
    this.cleanupTempFile(file.path);

    const media = this.mediaRepo.create({
      id: ulid,
      filename,
      original_name: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
      url,
      thumbnail_url: thumbnailUrl,
      alt_text: null,
      width,
      height,
      created_by: userId,
    });

    return this.mediaRepo.save(media);
  }

  /**
   * Upload nhieu file cung luc. Tra ve danh sach ket qua (thanh cong + that bai).
   */
  async uploadMultiple(files: Express.Multer.File[], userId: string) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có file được gửi');
    }

    const results: { success: Media[]; errors: string[] } = { success: [], errors: [] };

    for (const file of files) {
      try {
        const media = await this.upload(file, userId);
        results.success.push(media);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload thất bại';
        results.errors.push(`${file.originalname}: ${message}`);
      }
    }

    return results;
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

    // Xoa file tren storage — R2 hoac local (ca original + thumbnail)
    if (this.r2Service.isEnabled() && media.filename.startsWith('media/')) {
      await this.r2Service.delete(media.filename);

      // Xoa thumbnail neu co — best effort, khong block delete neu fail
      // Chi xoa khi thumbnail_url khac original url (tuc la thumb da duoc tao rieng)
      if (media.thumbnail_url && media.thumbnail_url !== media.url) {
        try {
          await this.r2Service.delete(this.buildThumbnailKey(media.filename));
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          this.logger.warn(`Xoa thumbnail R2 fail cho ${media.filename}: ${msg}`);
        }
      }
    } else if (!this.r2Service.isEnabled()) {
      // Xoa file local — sanitize path de chan traversal tu DB bi tampered
      try {
        const localPath = this.resolveSafeUploadPath(media.filename);
        this.cleanupTempFile(localPath);
      } catch {
        this.logger.warn(`Skip unsafe filename in media record ${media.id}: ${media.filename}`);
      }

      // Xoa thumbnail local neu co
      if (media.thumbnail_url && media.thumbnail_url !== media.url) {
        try {
          const thumbFilename = this.buildThumbnailKey(media.filename);
          const thumbPath = this.resolveSafeUploadPath(thumbFilename);
          this.cleanupTempFile(thumbPath);
        } catch {
          this.logger.warn(`Skip unsafe thumbnail filename in media ${media.id}`);
        }
      }
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
