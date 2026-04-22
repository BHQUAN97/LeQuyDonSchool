import { Injectable, BadRequestException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Setting, SettingGroup } from './entities/setting.entity';
import { generateUlid } from '@/common/utils/ulid';
import { HomepageConfig, DEFAULT_HOMEPAGE_CONFIG, VALID_BLOCK_VARIANTS } from './homepage-config';
import { UpdateHomepageConfigDto } from './dto/homepage-config.dto';

/** Cache key cho public settings — TTL 1h */
const CACHE_KEY_PUBLIC_SETTINGS = 'settings:public';
const CACHE_TTL_PUBLIC_SETTINGS = 3600_000; // 1h in ms

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectRepository(Setting) private readonly settingRepo: Repository<Setting>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  /**
   * Lay tat ca settings, nhom theo group.
   */
  async getAll(): Promise<Record<string, Setting[]>> {
    const settings = await this.settingRepo.find({ order: { group: 'ASC', key: 'ASC' } });
    return this.groupSettings(settings);
  }

  /**
   * Lay settings theo group.
   */
  async getByGroup(group: string): Promise<Setting[]> {
    return this.settingRepo.find({ where: { group }, order: { key: 'ASC' } });
  }

  /**
   * Lay gia tri 1 setting theo key.
   */
  async getByKey(key: string): Promise<Setting | null> {
    return this.settingRepo.findOne({ where: { key } });
  }

  /**
   * Tao hoac cap nhat 1 setting.
   */
  async upsert(key: string, value: string, group: string): Promise<Setting> {
    let setting = await this.settingRepo.findOne({ where: { key } });

    if (setting) {
      setting.value = value;
      setting.group = group;
      const saved = await this.settingRepo.save(setting);
      await this.invalidatePublicSettingsCache();
      return saved;
    }

    setting = this.settingRepo.create({
      id: generateUlid(),
      key,
      value,
      group,
    });
    const created = await this.settingRepo.save(setting);
    await this.invalidatePublicSettingsCache();
    return created;
  }

  /**
   * Tao hoac cap nhat nhieu settings cung luc.
   */
  async bulkUpsert(items: { key: string; value: string; group: string }[]): Promise<Setting[]> {
    const results: Setting[] = [];
    for (const item of items) {
      const setting = await this.upsert(item.key, item.value, item.group);
      results.push(setting);
    }
    // invalidate them 1 lan cuoi de chac chan (upsert da goi roi, day la safety net)
    await this.invalidatePublicSettingsCache();
    return results;
  }

  /**
   * Lay cac settings public — hien thi tren trang cong khai.
   * Chi tra ve cac key can thiet: ten truong, thong tin lien he, mang xa hoi.
   * Cache trong Redis key `settings:public`, TTL 1h, invalidate khi admin update.
   */
  async getPublicSettings(): Promise<Record<string, string>> {
    // Thu cache truoc
    try {
      const cached = await this.cache.get<Record<string, string>>(CACHE_KEY_PUBLIC_SETTINGS);
      if (cached) return cached;
    } catch (err) {
      this.logger.warn(`Cache get failed: ${(err as Error).message}`);
    }

    const publicKeys = [
      'school_name', 'slogan', 'logo_url', 'favicon_url',
      'address', 'phone', 'email', 'google_maps_url',
      'facebook_url', 'youtube_url', 'zalo_url', 'messenger_url',
      'default_title', 'meta_description', 'og_image_url',
      'phone_enabled', 'phone_number', 'messenger_enabled', 'messenger_url_floating',
      'zalo_enabled', 'zalo_url_floating', 'form_enabled', 'form_url',
    ];

    const settings = await this.settingRepo
      .createQueryBuilder('s')
      .where('s.key IN (:...keys)', { keys: publicKeys })
      .getMany();

    // Tra ve dang flat object {key: value}
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }

    // Set cache
    try {
      await this.cache.set(CACHE_KEY_PUBLIC_SETTINGS, result, CACHE_TTL_PUBLIC_SETTINGS);
    } catch (err) {
      this.logger.warn(`Cache set failed: ${(err as Error).message}`);
    }

    return result;
  }

  /**
   * Invalidate cache public settings — goi sau khi upsert/update.
   */
  private async invalidatePublicSettingsCache() {
    try {
      await this.cache.del(CACHE_KEY_PUBLIC_SETTINGS);
    } catch (err) {
      this.logger.warn(`Cache del failed: ${(err as Error).message}`);
    }
  }

  // --- Homepage config ---

  /** Preview store — luu tam config de xem truoc, TTL 1h, toi da 100 entry */
  private static readonly MAX_PREVIEW_ENTRIES = 100;
  private previewStore = new Map<string, { config: HomepageConfig; expires: number }>();

  /**
   * Validate homepage config — dung chung cho save va preview.
   */
  validateHomepageConfig(config: UpdateHomepageConfigDto): void {
    // Toi thieu 1 block visible
    const hasVisible = config.blocks.some(b => b.visible);
    if (!hasVisible) {
      throw new BadRequestException('Phải giữ tối thiểu 1 section hiển thị');
    }
    // Validate variant hop le
    for (const block of config.blocks) {
      const validVariants = VALID_BLOCK_VARIANTS[block.id];
      if (validVariants && !validVariants.includes(block.variant)) {
        throw new BadRequestException(
          `Variant "${block.variant}" không hợp lệ cho block "${block.id}"`,
        );
      }
    }
  }

  /**
   * Lay homepage config — tra default neu chua co.
   */
  async getHomepageConfig(): Promise<HomepageConfig> {
    const setting = await this.settingRepo.findOne({ where: { key: 'homepage_config' } });
    if (!setting?.value) return DEFAULT_HOMEPAGE_CONFIG;
    try {
      return JSON.parse(setting.value) as HomepageConfig;
    } catch {
      return DEFAULT_HOMEPAGE_CONFIG;
    }
  }

  /**
   * Luu homepage config — validate variant truoc khi luu.
   */
  async saveHomepageConfig(config: UpdateHomepageConfigDto): Promise<HomepageConfig> {
    this.validateHomepageConfig(config);
    const value = JSON.stringify(config);
    await this.upsert('homepage_config', value, SettingGroup.HOMEPAGE);
    return config as HomepageConfig;
  }

  /**
   * Tao preview token — luu tam config 1h de xem truoc.
   */
  createHomepagePreview(config: HomepageConfig): string {
    const token = crypto.randomUUID();
    const expires = Date.now() + 60 * 60 * 1000; // 1h

    // Don dep entry het han truoc khi them moi
    const now = Date.now();
    for (const [key, entry] of this.previewStore) {
      if (entry.expires < now) this.previewStore.delete(key);
    }

    // Gioi han so luong entry de tranh memory leak
    if (this.previewStore.size >= SettingsService.MAX_PREVIEW_ENTRIES) {
      // Xoa entry cu nhat
      const oldestKey = this.previewStore.keys().next().value;
      if (oldestKey) this.previewStore.delete(oldestKey);
    }

    this.previewStore.set(token, { config, expires });
    return token;
  }

  /**
   * Lay preview config theo token — tra null neu het han hoac khong ton tai.
   */
  getHomepagePreview(token: string): HomepageConfig | null {
    // Don dep cac entry het han
    const now = Date.now();
    for (const [key, entry] of this.previewStore) {
      if (entry.expires < now) this.previewStore.delete(key);
    }
    const entry = this.previewStore.get(token);
    if (!entry || entry.expires < now) return null;
    return entry.config;
  }

  /**
   * Nhom settings theo group.
   */
  private groupSettings(settings: Setting[]): Record<string, Setting[]> {
    const grouped: Record<string, Setting[]> = {};
    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = [];
      grouped[s.group].push(s);
    }
    return grouped;
  }
}
