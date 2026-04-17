import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { PageView, DeviceType } from './entities/page-view.entity';
import { PageViewDaily } from './entities/page-view-daily.entity';

/** Regex phat hien bot tu user-agent */
const BOT_PATTERNS = /bot|crawl|spider|wget|curl|lighthouse|headless|phantom|selenium|puppeteer|slurp|mediapartners|googlebot|bingbot|yandex|baidu|duckduck/i;

/**
 * Anonymize IP — GDPR/PDPA compliance.
 * IPv4: zero out last octet (1.2.3.4 → 1.2.3.0).
 * IPv6: zero out last 80 bits (keep first /48 prefix).
 * Unknown format: return '0.0.0.0'.
 */
function anonymizeIp(ip: string): string {
  if (!ip) return '0.0.0.0';
  // IPv6 detection — chua dau ':'
  if (ip.includes(':')) {
    const parts = ip.split(':');
    // Giu 3 segment dau (48 bits), zero 5 segment cuoi
    return parts.slice(0, 3).concat(['0', '0', '0', '0', '0']).join(':');
  }
  // IPv4
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  return '0.0.0.0';
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(PageView) private readonly pvRepo: Repository<PageView>,
    @InjectRepository(PageViewDaily) private readonly pvdRepo: Repository<PageViewDaily>,
  ) {}

  /**
   * Ghi nhan page view — dedup: bo qua neu cung IP+path trong 30s gan nhat.
   * Tu dong detect device type va bot.
   */
  async recordPageView(path: string, ip: string, userAgent?: string, referrer?: string) {
    try {
      // Anonymize IP truoc khi luu — chi giu /24 (IPv4) hoac /48 (IPv6)
      const anonIp = anonymizeIp(ip);
      // Dedup: kiem tra xem cung IP+path da co trong 30s gan day chua
      const thirtySecondsAgo = new Date(Date.now() - 30_000);
      const recent = await this.pvRepo
        .createQueryBuilder('pv')
        .where('pv.visitor_ip = :ip', { ip: anonIp })
        .andWhere('pv.page_path = :path', { path })
        .andWhere('pv.viewed_at > :since', { since: thirtySecondsAgo })
        .getCount();

      if (recent > 0) return; // Skip — dedup

      const isBot = userAgent ? BOT_PATTERNS.test(userAgent) : false;
      const deviceType = this.detectDevice(userAgent);

      const pv = this.pvRepo.create({
        page_path: path,
        visitor_ip: anonIp,
        user_agent: userAgent || null,
        referrer: referrer || null,
        device_type: deviceType,
        is_bot: isBot,
      });

      await this.pvRepo.save(pv);
    } catch (err) {
      // Fire-and-forget — khong throw loi ra ngoai
      this.logger.error('Loi ghi page view:', err);
    }
  }

  /**
   * Thong ke dashboard — aggregate tu page_view_daily.
   * Tra ve: tong views, unique visitors, device breakdown, daily trend, top 10 pages.
   */
  async getDashboardStats(startDate: string, endDate: string) {
    // Tong hop chung
    const summary = await this.pvdRepo
      .createQueryBuilder('d')
      .select('SUM(d.total_views)', 'totalViews')
      .addSelect('SUM(d.unique_visitors)', 'uniqueVisitors')
      .addSelect('SUM(d.mobile_views)', 'mobileViews')
      .addSelect('SUM(d.desktop_views)', 'desktopViews')
      .addSelect('SUM(d.tablet_views)', 'tabletViews')
      .addSelect('SUM(d.bot_views)', 'botViews')
      .where('d.view_date >= :startDate', { startDate })
      .andWhere('d.view_date <= :endDate', { endDate })
      .getRawOne();

    // Daily trend — tung ngay
    const dailyTrend = await this.pvdRepo
      .createQueryBuilder('d')
      .select('d.view_date', 'date')
      .addSelect('SUM(d.total_views)', 'views')
      .addSelect('SUM(d.unique_visitors)', 'uniqueVisitors')
      .where('d.view_date >= :startDate', { startDate })
      .andWhere('d.view_date <= :endDate', { endDate })
      .groupBy('d.view_date')
      .orderBy('d.view_date', 'ASC')
      .getRawMany();

    // Top 10 pages
    const topPages = await this.pvdRepo
      .createQueryBuilder('d')
      .select('d.page_path', 'path')
      .addSelect('SUM(d.total_views)', 'views')
      .addSelect('SUM(d.unique_visitors)', 'uniqueVisitors')
      .where('d.view_date >= :startDate', { startDate })
      .andWhere('d.view_date <= :endDate', { endDate })
      .groupBy('d.page_path')
      .orderBy('views', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalViews: Number(summary?.totalViews || 0),
      uniqueVisitors: Number(summary?.uniqueVisitors || 0),
      mobileViews: Number(summary?.mobileViews || 0),
      desktopViews: Number(summary?.desktopViews || 0),
      tabletViews: Number(summary?.tabletViews || 0),
      botViews: Number(summary?.botViews || 0),
      dailyTrend: dailyTrend.map((r: any) => ({
        date: r.date,
        views: Number(r.views),
        uniqueVisitors: Number(r.uniqueVisitors),
      })),
      topPages: topPages.map((r: any) => ({
        path: r.path,
        views: Number(r.views),
        uniqueVisitors: Number(r.uniqueVisitors),
      })),
    };
  }

  /**
   * Thong ke cho 1 trang cu the.
   */
  async getPageStats(path: string, startDate: string, endDate: string) {
    const daily = await this.pvdRepo
      .createQueryBuilder('d')
      .where('d.page_path = :path', { path })
      .andWhere('d.view_date >= :startDate', { startDate })
      .andWhere('d.view_date <= :endDate', { endDate })
      .orderBy('d.view_date', 'ASC')
      .getMany();

    const totals = daily.reduce(
      (acc, row) => {
        acc.totalViews += row.total_views;
        acc.uniqueVisitors += row.unique_visitors;
        acc.mobileViews += row.mobile_views;
        acc.desktopViews += row.desktop_views;
        acc.tabletViews += row.tablet_views;
        acc.botViews += row.bot_views;
        return acc;
      },
      { totalViews: 0, uniqueVisitors: 0, mobileViews: 0, desktopViews: 0, tabletViews: 0, botViews: 0 },
    );

    return { ...totals, daily };
  }

  /**
   * Tong hop raw page_views thanh page_view_daily cho 1 ngay.
   * Group by path, count unique IPs, count theo device type.
   */
  async aggregateDaily(date: string) {
    this.logger.log(`Bat dau aggregate page views cho ngay ${date}`);

    // Lay du lieu aggregate tu raw page_views
    const rows = await this.pvRepo
      .createQueryBuilder('pv')
      .select('pv.page_path', 'page_path')
      .addSelect('COUNT(*)', 'total_views')
      .addSelect('COUNT(DISTINCT pv.visitor_ip)', 'unique_visitors')
      .addSelect("SUM(CASE WHEN pv.device_type = 'mobile' THEN 1 ELSE 0 END)", 'mobile_views')
      .addSelect("SUM(CASE WHEN pv.device_type = 'desktop' THEN 1 ELSE 0 END)", 'desktop_views')
      .addSelect("SUM(CASE WHEN pv.device_type = 'tablet' THEN 1 ELSE 0 END)", 'tablet_views')
      .addSelect('SUM(CASE WHEN pv.is_bot = true THEN 1 ELSE 0 END)', 'bot_views')
      .where('DATE(pv.viewed_at) = :date', { date })
      .groupBy('pv.page_path')
      .getRawMany();

    // Upsert tung page_path vao page_view_daily
    for (const row of rows) {
      await this.pvdRepo
        .createQueryBuilder()
        .insert()
        .into(PageViewDaily)
        .values({
          page_path: row.page_path,
          view_date: date,
          total_views: Number(row.total_views),
          unique_visitors: Number(row.unique_visitors),
          mobile_views: Number(row.mobile_views),
          desktop_views: Number(row.desktop_views),
          tablet_views: Number(row.tablet_views),
          bot_views: Number(row.bot_views),
        })
        .orUpdate(
          ['total_views', 'unique_visitors', 'mobile_views', 'desktop_views', 'tablet_views', 'bot_views'],
          ['page_path', 'view_date'],
        )
        .execute();
    }

    this.logger.log(`Aggregate xong: ${rows.length} paths cho ngay ${date}`);
    return rows.length;
  }

  /**
   * Xoa raw page_views cu hon X ngay — giu lai du lieu da aggregate.
   */
  async purgeRawViews(days: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const result = await this.pvRepo
      .createQueryBuilder()
      .delete()
      .from(PageView)
      .where('viewed_at < :cutoff', { cutoff })
      .execute();

    this.logger.log(`Purge raw views: xoa ${result.affected || 0} rows (truoc ${cutoff.toISOString()})`);
    return result.affected || 0;
  }

  /**
   * Cron: chay luc 2:00 AM moi ngay — aggregate du lieu hom qua.
   */
  @Cron('0 2 * * *')
  async handleDailyAggregation() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];
    await this.aggregateDaily(dateStr);
  }

  /**
   * Cron: chay luc 3:00 AM moi chu nhat — xoa raw views cu hon 90 ngay.
   */
  @Cron('0 3 * * 0')
  async handleWeeklyPurge() {
    await this.purgeRawViews(90);
  }

  /**
   * Detect device type tu user-agent string.
   */
  private detectDevice(ua?: string): DeviceType | null {
    if (!ua) return null;
    const lower = ua.toLowerCase();
    if (/tablet|ipad|playbook|silk/i.test(lower)) return DeviceType.TABLET;
    if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(lower)) return DeviceType.MOBILE;
    return DeviceType.DESKTOP;
  }
}
