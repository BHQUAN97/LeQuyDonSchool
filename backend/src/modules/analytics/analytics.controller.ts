import { Controller, Post, Get, Body, Query, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { RecordPageviewDto } from './dto/record-pageview.dto';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { Public } from '@/common/decorators/public.decorator';
import { SuperAdminOnly } from '@/common/decorators/admin-only.decorator';
import { ok } from '@/common/helpers/response.helper';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Ghi nhan page view — PUBLIC, rate limited 10 req/60s per IP.
   * Auto-extract IP, User-Agent, Referer tu request.
   */
  @Post('pageview')
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async recordPageview(@Body() dto: RecordPageviewDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.ip
      || '0.0.0.0';
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers['referer'] || req.headers['referrer'];

    // Fire-and-forget — khong cho ket qua
    this.analyticsService.recordPageView(dto.path, ip, userAgent, referrer as string);

    return ok(null, 'OK');
  }

  /**
   * Dashboard stats — ADMIN only.
   * Default: 30 ngay gan nhat.
   */
  @Get('dashboard')
  @SuperAdminOnly()
  async getDashboard(@Query() query: AnalyticsQueryDto) {
    const endDate = query.end || new Date().toISOString().split('T')[0];
    const startDate = query.start || (() => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return d.toISOString().split('T')[0];
    })();

    const data = await this.analyticsService.getDashboardStats(startDate, endDate);
    return ok(data);
  }

  /**
   * Thong ke theo trang cu the — ADMIN only.
   */
  @Get('pages')
  @SuperAdminOnly()
  async getPageStats(@Query() query: AnalyticsQueryDto) {
    const endDate = query.end || new Date().toISOString().split('T')[0];
    const startDate = query.start || (() => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return d.toISOString().split('T')[0];
    })();

    if (!query.path) {
      return ok(null, 'Vui lòng chỉ định path');
    }

    const data = await this.analyticsService.getPageStats(query.path, startDate, endDate);
    return ok(data);
  }
}
