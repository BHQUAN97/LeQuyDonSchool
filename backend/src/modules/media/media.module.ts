import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import * as os from 'os';
import * as path from 'path';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { R2Service } from './r2.service';
import { ImageProcessorService } from './image-processor.service';
import { Media } from './entities/media.entity';

// Mime types cho phep upload (SVG removed — XSS risk)
const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'video/mp4', 'video/webm',
];

// Whitelist extension — chong MIME spoof
const ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.mp4', '.webm',
];

// Map extension -> MIME de cross-check
const EXT_MIME_MAP: Record<string, string[]> = {
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.gif': ['image/gif'],
  '.webp': ['image/webp'],
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.xls': ['application/vnd.ms-excel'],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  '.mp4': ['video/mp4'],
  '.webm': ['video/webm'],
};

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Media]),
    MulterModule.register({
      dest: os.tmpdir(), // File tam — se upload len R2 hoac move vao uploads/
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) => {
        // Check MIME type
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
          return cb(new Error(`Loại file không được hỗ trợ: ${file.mimetype}`), false);
        }

        // Check file extension whitelist
        const ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          return cb(new Error(`Phần mở rộng file không được hỗ trợ: ${ext}`), false);
        }

        // Cross-check extension vs MIME — chong spoof
        const allowedMimesForExt = EXT_MIME_MAP[ext];
        if (!allowedMimesForExt || !allowedMimesForExt.includes(file.mimetype)) {
          return cb(new Error(`MIME type ${file.mimetype} không khớp với extension ${ext}`), false);
        }

        cb(null, true);
      },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, R2Service, ImageProcessorService],
  exports: [MediaService, R2Service, ImageProcessorService],
})
export class MediaModule {}
