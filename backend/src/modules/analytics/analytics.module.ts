import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PageView } from './entities/page-view.entity';
import { PageViewDaily } from './entities/page-view-daily.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PageView, PageViewDaily])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
