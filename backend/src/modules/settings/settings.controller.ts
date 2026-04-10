import { Controller, Get, Put, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { BulkUpsertSettingDto } from './dto/upsert-setting.dto';
import { UpdateHomepageConfigDto } from './dto/homepage-config.dto';
import { HomepageConfig } from './homepage-config';
import { SuperAdminOnly } from '@/common/decorators/admin-only.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { ok } from '@/common/helpers/response.helper';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /** Lay tat ca settings (grouped) — chi Super Admin */
  @Get()
  @SuperAdminOnly()
  async getAll() {
    const data = await this.settingsService.getAll();
    return ok(data);
  }

  /** Lay settings public — khong can dang nhap */
  @Get('public')
  @Public()
  async getPublic() {
    const data = await this.settingsService.getPublicSettings();
    return ok(data);
  }

  /** Bulk upsert settings — chi Super Admin */
  @Put()
  @SuperAdminOnly()
  async bulkUpsert(@Body() dto: BulkUpsertSettingDto) {
    const data = await this.settingsService.bulkUpsert(dto.items);
    return ok(data, 'Luu cau hinh thanh cong');
  }

  // --- Homepage config endpoints ---

  /** Lay homepage config — public, khong can dang nhap */
  @Public()
  @Get('homepage')
  async getHomepageConfig() {
    const data = await this.settingsService.getHomepageConfig();
    return ok(data);
  }

  /** Cap nhat homepage config — chi Super Admin */
  @Put('homepage')
  @SuperAdminOnly()
  async updateHomepageConfig(@Body() dto: UpdateHomepageConfigDto) {
    const data = await this.settingsService.saveHomepageConfig(dto);
    return ok(data, 'Đã cập nhật trang chủ');
  }

  /** Tao preview token — chi Super Admin */
  @Post('homepage/preview')
  @SuperAdminOnly()
  async createHomepagePreview(@Body() dto: UpdateHomepageConfigDto) {
    // Validate giong saveHomepageConfig nhung khong luu DB
    this.settingsService.validateHomepageConfig(dto);
    const token = this.settingsService.createHomepagePreview(dto as HomepageConfig);
    return ok({ token });
  }

  /** Lay preview config theo token — public de iframe/tab moi co the load */
  @Public()
  @Get('homepage/preview/:token')
  async getHomepagePreview(@Param('token') token: string) {
    const config = this.settingsService.getHomepagePreview(token);
    if (!config) {
      throw new NotFoundException('Preview không tồn tại hoặc đã hết hạn');
    }
    return ok(config);
  }
}
