import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { generateUlid } from '@/common/utils/ulid';

/**
 * R2Service — Cloudflare R2 storage.
 * Hien tai stub — chi ghi log. Se implement S3-compatible API khi can.
 */
@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private readonly enabled: boolean;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    this.enabled = this.config.get<boolean>('r2.enabled', false);
    this.publicUrl = this.config.get<string>('r2.publicUrl', '');
    if (!this.enabled) {
      this.logger.log('R2 storage disabled — dung local storage');
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  /** Tao key duy nhat cho file tren R2 */
  generateKey(originalName: string): { key: string; ulid: string } {
    const ext = path.extname(originalName);
    const ulid = generateUlid();
    return { key: `media/${ulid}${ext}`, ulid };
  }

  /** Upload buffer len R2 — stub, se implement khi co R2 credentials */
  async upload(key: string, _buffer: Buffer, _mimeType: string): Promise<string> {
    // TODO: implement S3 PutObject khi co R2 credentials
    this.logger.warn(`R2 upload stub called for ${key} — should not happen when disabled`);
    return `${this.publicUrl}/${key}`;
  }

  /** Xoa file tren R2 — stub */
  async delete(key: string): Promise<void> {
    // TODO: implement S3 DeleteObject khi co R2 credentials
    this.logger.warn(`R2 delete stub called for ${key}`);
  }
}
