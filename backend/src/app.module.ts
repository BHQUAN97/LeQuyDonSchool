import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
