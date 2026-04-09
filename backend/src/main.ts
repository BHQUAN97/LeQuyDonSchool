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

  // Serve static files tu /uploads
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath, { maxAge: '30d' }));

  const port = config.get<number>('app.port', 4000);
  await app.listen(port);
  console.log(`[LeQuyDon API] Running on http://localhost:${port}`);
}

bootstrap();
