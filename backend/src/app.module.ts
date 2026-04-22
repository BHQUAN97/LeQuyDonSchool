import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { CsrfMiddleware } from './common/middleware/csrf.middleware';

import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { r2Config } from './config/r2.config';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { MediaModule } from './modules/media/media.module';
import { PagesModule } from './modules/pages/pages.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { EventsModule } from './modules/events/events.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { LogsModule } from './modules/logs/logs.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { SearchModule } from './modules/search/search.module';
import { MenusModule } from './modules/menus/menus.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // Config — global, doc tu .env
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, r2Config],
      envFilePath: ['.env'],
    }),

    // Database — MySQL via TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: config.get<string>('app.nodeEnv') === 'development',
        charset: 'utf8mb4',
      }),
    }),

    // Rate limiting — 100 req/min chung
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Cache — Redis global store. Neu Redis khong reachable, CacheModule tu fallback
    // ve in-memory store nho try/catch, de backend van chay duoc local khong docker.
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const host = process.env.REDIS_HOST || '127.0.0.1';
        const port = parseInt(process.env.REDIS_PORT || '6379', 10);
        const password = process.env.REDIS_PASSWORD || undefined;
        try {
          const store = await redisStore({
            socket: { host, port, connectTimeout: 2000 },
            password,
            ttl: 3600_000, // default 1h in ms
          });
          // Redis client emits 'error' on disconnect — swallow to avoid crashing Node
          const client = (store as any).client;
          if (client && typeof client.on === 'function') {
            client.on('error', (e: Error) => {
              // eslint-disable-next-line no-console
              console.warn('[CacheModule] Redis runtime error:', e.message);
            });
          }
          // eslint-disable-next-line no-console
          console.log(`[CacheModule] connected to Redis at ${host}:${port}`);
          return { store: store as any, ttl: 3600_000 };
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(
            `[CacheModule] Redis unavailable (${host}:${port}) — falling back to in-memory cache.`,
            (err as Error).message,
          );
          return { ttl: 3600_000 };
        }
      },
    }),

    // Scheduler — cron jobs (analytics aggregation)
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    UsersModule,
    CategoriesModule,
    ArticlesModule,
    MediaModule,
    PagesModule,
    SettingsModule,
    ContactsModule,
    EventsModule,
    AdmissionsModule,
    NavigationModule,
    LogsModule,
    AnalyticsModule,
    HealthModule,
    SearchModule,
    MenusModule,
  ],
  providers: [
    // Auth mac dinh — tat ca route yeu cau JWT, dung @Public() de bypass
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  /**
   * CSRF double-submit cookie — chi ap dung cho cac public form endpoint.
   * Admin API da duoc JWT Bearer bao ve (khong kem theo tu dong nen khong bi CSRF).
   *
   * Path dang ky o day la relative so voi global prefix `/api`, tuc la endpoint
   * thuc te la: GET/POST /api/csrf-token, POST /api/contacts, POST /api/admissions/registrations.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .forRoutes(
        // Endpoint de frontend fetch token ban dau
        { path: 'csrf-token', method: RequestMethod.GET },
        // Gui lien he cong khai
        { path: 'contacts', method: RequestMethod.POST },
        // Dang ky tuyen sinh cong khai
        { path: 'admissions/registrations', method: RequestMethod.POST },
      );
  }
}
