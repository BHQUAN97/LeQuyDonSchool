import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AdminActionLogInterceptor } from './common/interceptors/admin-action-log.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { globalValidationPipe } from './common/pipes/validation.pipe';
import { validateEnv } from './config/env.validation';
import { AdminActionsService } from './modules/logs/admin-actions.service';
import { LogsService } from './modules/logs/logs.service';

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Trust proxy — lay IP chinh xac tu reverse proxy (nginx)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Global prefix — tat ca routes bat dau voi /api
  app.setGlobalPrefix('api');

  // Security headers
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // Cookie parser — doc refreshToken tu httpOnly cookie
  app.use(cookieParser());

  // CORS — cho phep frontend truy cap
  const origins = config.get<string[]>('app.allowedOrigins') || ['http://localhost:3000'];
  app.enableCors({ origin: origins, credentials: true });

  // Global pipes, filters, interceptors
  app.useGlobalPipes(globalValidationPipe);
  app.useGlobalFilters(new AppExceptionFilter());
  const adminActionsService = app.get(AdminActionsService);
  const logsService = app.get(LogsService);
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new AdminActionLogInterceptor(adminActionsService),
    new LoggingInterceptor(logsService),
  );

  // Serve static files tu /uploads — voi security headers
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  // MIME types duoc phep hien thi inline (images)
  const INLINE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  app.use('/uploads', express.static(uploadsPath, {
    maxAge: '30d',
    setHeaders: (res, filePath) => {
      // Chong MIME sniffing attack
      res.setHeader('X-Content-Type-Options', 'nosniff');

      // Non-image files -> force download, chong XSS qua PDF/HTML
      const ext = path.extname(filePath).toLowerCase();
      const contentType = res.getHeader('Content-Type') as string || '';
      const isInlineAllowed = INLINE_MIMES.some((m) => contentType.includes(m));
      if (!isInlineAllowed) {
        res.setHeader('Content-Disposition', 'attachment');
      }
    },
  }));

  const port = config.get<number>('app.port', 4000);
  await app.listen(port);
  console.log(`[LeQuyDon API] Running on http://localhost:${port}`);
}

bootstrap();
