import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as path from 'path';
import { generateUlid } from '@/common/utils/ulid';

/**
 * R2Service — Cloudflare R2 (S3-compatible) storage adapter.
 *
 * Uses @aws-sdk/client-s3 with R2 endpoint. When env vars are missing,
 * service stays in disabled state: constructor logs a warning, upload/delete
 * throw descriptive errors. App start is NEVER blocked by missing R2 config —
 * this allows dev mode to fall back to local disk.
 */
@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private readonly enabled: boolean;
  private readonly publicUrl: string;
  private readonly bucket: string;
  private readonly client: S3Client | null;

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get<string>('r2.accountId', '');
    const accessKey = this.config.get<string>('r2.accessKey', '');
    const secretKey = this.config.get<string>('r2.secretKey', '');
    this.bucket = this.config.get<string>('r2.bucket', 'lequydon-media');
    this.publicUrl = (this.config.get<string>('r2.publicUrl', '') || '').replace(/\/+$/, '');
    this.enabled = this.config.get<boolean>('r2.enabled', false);

    if (!this.enabled || !accountId || !accessKey || !secretKey) {
      // Khong co du config — giu client = null, upload/delete se throw khi goi
      this.client = null;
      this.logger.warn(
        'R2 storage config thieu hoac khong day du — upload/delete se that bai neu goi. Dung local fallback o dev.',
      );
      return;
    }

    // R2 endpoint: https://<account_id>.r2.cloudflarestorage.com
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    this.client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      // Force path-style = false; R2 works with virtual-hosted style by default
      forcePathStyle: false,
    });
    this.logger.log(`R2 storage enabled — bucket=${this.bucket}, endpoint=${endpoint}`);
  }

  isEnabled(): boolean {
    return this.enabled && this.client !== null;
  }

  /** Tao key duy nhat cho file tren R2 — format: media/YYYY/MM/<ulid>.<ext> */
  generateKey(originalName: string): { key: string; ulid: string } {
    const ext = path.extname(originalName).toLowerCase();
    const ulid = generateUlid();
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    // Dung year/month prefix de tranh collision + de phan chia o R2 console
    return { key: `media/${yyyy}/${mm}/${ulid}${ext}`, ulid };
  }

  /**
   * Upload buffer to R2 under the given key.
   *
   * Signature keeps legacy order (key, buffer, mimeType) for backwards-compat
   * with existing callers and tests. Returns the public URL (when R2_PUBLIC_URL
   * configured) or a 7-day presigned URL as fallback.
   */
  async upload(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    this.ensureEnabled();

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        // Cache 1 nam — key la immutable (ULID) nen an toan
        CacheControl: 'public, max-age=31536000, immutable',
      });
      await this.client!.send(command);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`R2 upload failed for key=${key}: ${msg}`);
      throw new InternalServerErrorException(`Upload R2 that bai: ${msg}`);
    }

    // Neu co public domain => tra public URL, neu khong => presigned URL (7 ngay)
    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`;
    }
    return this.getPresignedUrl(key, 7 * 24 * 3600);
  }

  /**
   * Overload-friendly upload for callers using {buffer, key, mimeType} payload.
   * Matches the signature described in the spec. Internally calls upload().
   */
  async uploadObject(
    buffer: Buffer,
    key: string,
    mimeType: string,
  ): Promise<{ url: string; key: string }> {
    const url = await this.upload(key, buffer, mimeType);
    return { url, key };
  }

  /** Xoa file tren R2 theo key */
  async delete(key: string): Promise<void> {
    this.ensureEnabled();

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client!.send(command);
      this.logger.log(`R2 deleted key=${key}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`R2 delete failed for key=${key}: ${msg}`);
      throw new InternalServerErrorException(`Xoa file tren R2 that bai: ${msg}`);
    }
  }

  /**
   * Generate a presigned GET URL — useful when bucket is private
   * and no R2_PUBLIC_URL is configured. Default expiresIn = 3600 (1h).
   */
  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    this.ensureEnabled();

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      return await getSignedUrl(this.client!, command, { expiresIn });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`R2 presign failed for key=${key}: ${msg}`);
      throw new InternalServerErrorException(`Tao presigned URL that bai: ${msg}`);
    }
  }

  /** Throw descriptive error neu client chua san sang — tranh crash app o startup */
  private ensureEnabled(): void {
    if (!this.client) {
      throw new InternalServerErrorException(
        'R2 storage chua duoc cau hinh (thieu R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)',
      );
    }
  }
}
