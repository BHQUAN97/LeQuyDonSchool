import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { BulkUpsertSettingDto } from './dto/upsert-setting.dto';
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
}
