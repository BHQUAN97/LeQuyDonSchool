import { Injectable, Logger } from '@nestjs/common';
import sharp = require('sharp');

/**
 * ImageProcessorService — resize va chuyen doi format anh bang sharp.
 *
 * Muc tieu:
 * - Tao thumbnail 150x150 (cover) cho grid preview trong admin
 * - Tao preview ~800px cho hien thi article (toi uu bandwidth)
 * - Doc kich thuoc goc de luu vao DB (width/height)
 *
 * Graceful degrade: neu sharp loi (file corrupt, format la, native binary fail),
 * tat ca method tra ve null thay vi throw — caller (media.service) van upload
 * original thanh cong, chi bo qua thumbnail.
 */
@Injectable()
export class ImageProcessorService {
  private readonly logger = new Logger(ImageProcessorService.name);

  // Supported image MIME types for processing
  private static readonly IMAGE_MIMES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ]);

  // Thumbnail dimensions (square crop)
  private static readonly THUMB_SIZE = 150;

  // Preview max width (preserve aspect ratio)
  private static readonly PREVIEW_MAX_WIDTH = 800;

  // WebP quality levels
  private static readonly THUMB_QUALITY = 80;
  private static readonly PREVIEW_QUALITY = 85;

  /**
   * Kiem tra mime type co phai la anh ma ta xu ly duoc khong.
   * Chu y: GIF animated → sharp mac dinh chi xu ly frame dau.
   */
  isImage(mimeType: string): boolean {
    if (!mimeType) return false;
    return ImageProcessorService.IMAGE_MIMES.has(mimeType.toLowerCase());
  }

  /**
   * Tao thumbnail 150x150 WebP tu buffer anh goc.
   *
   * Strategy:
   *   - fit: 'cover' + position: 'center' → crop vua khung, khong meo
   *   - Output WebP quality 80 → nhe (~30% size JPEG tuong duong)
   *   - Fallback: neu WebP encode fail → thu JPEG quality 80
   *
   * @returns Buffer thumbnail, hoac null neu process that bai hoan toan.
   */
  async generateThumbnail(buffer: Buffer, mimeType: string): Promise<Buffer | null> {
    if (!this.isImage(mimeType)) return null;

    try {
      // Primary path: WebP output
      return await sharp(buffer, { failOn: 'none' })
        .rotate() // respect EXIF orientation
        .resize(ImageProcessorService.THUMB_SIZE, ImageProcessorService.THUMB_SIZE, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: ImageProcessorService.THUMB_QUALITY })
        .toBuffer();
    } catch (webpErr) {
      const msg = webpErr instanceof Error ? webpErr.message : String(webpErr);
      this.logger.warn(`Thumbnail WebP fail, thu JPEG fallback: ${msg}`);

      // Fallback: JPEG (wider codec support, rarely fails)
      try {
        return await sharp(buffer, { failOn: 'none' })
          .rotate()
          .resize(ImageProcessorService.THUMB_SIZE, ImageProcessorService.THUMB_SIZE, {
            fit: 'cover',
            position: 'center',
          })
          .jpeg({ quality: ImageProcessorService.THUMB_QUALITY })
          .toBuffer();
      } catch (jpegErr) {
        const jpegMsg = jpegErr instanceof Error ? jpegErr.message : String(jpegErr);
        this.logger.error(`Thumbnail JPEG fallback cung fail: ${jpegMsg}`);
        return null;
      }
    }
  }

  /**
   * Tao preview max 800px width, giu ty le goc.
   * withoutEnlargement: true → khong upscale anh vua/nho (tranh mo).
   *
   * @returns Buffer preview WebP, hoac null neu fail.
   */
  async generatePreview(buffer: Buffer, mimeType: string): Promise<Buffer | null> {
    if (!this.isImage(mimeType)) return null;

    try {
      return await sharp(buffer, { failOn: 'none' })
        .rotate()
        .resize({
          width: ImageProcessorService.PREVIEW_MAX_WIDTH,
          withoutEnlargement: true,
        })
        .webp({ quality: ImageProcessorService.PREVIEW_QUALITY })
        .toBuffer();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Preview generation fail: ${msg}`);
      return null;
    }
  }

  /**
   * Doc kich thuoc (width, height) cua anh. Dung de luu metadata vao DB.
   * Tra ve null cho ca 2 chieu neu khong doc duoc (corrupt, format la...).
   */
  async getDimensions(buffer: Buffer): Promise<{ width: number; height: number } | null> {
    try {
      const metadata = await sharp(buffer, { failOn: 'none' }).metadata();
      if (!metadata.width || !metadata.height) return null;
      return { width: metadata.width, height: metadata.height };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`getDimensions fail: ${msg}`);
      return null;
    }
  }
}
