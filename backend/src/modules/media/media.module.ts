import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import * as os from 'os';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { R2Service } from './r2.service';
import { Media } from './entities/media.entity';

// Mime types cho phep upload
const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'video/mp4', 'video/webm',
];

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Media]),
    MulterModule.register({
      dest: os.tmpdir(), // File tam — se upload len R2 hoac move vao uploads/
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIMES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Loại file không được hỗ trợ: ${file.mimetype}`), false);
        }
      },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, R2Service],
  exports: [MediaService],
})
export class MediaModule {}
