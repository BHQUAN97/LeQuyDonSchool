import { Controller, Get, Delete, Param, Query, Body } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AdminActionsService } from './admin-actions.service';
import { QueryLogDto } from './dto/query-log.dto';
import { QueryActionDto } from './dto/query-action.dto';
import { SuperAdminOnly } from '@/common/decorators/admin-only.decorator';

@Controller('logs')
@SuperAdminOnly()
export class LogsController {
  constructor(
    private readonly logsService: LogsService,
    private readonly adminActionsService: AdminActionsService,
  ) {}

  /** Danh sach log voi phan trang + filter */
  @Get()
  async findAll(@Query() query: QueryLogDto) {
    return this.logsService.findAll(query);
  }

  /** Thong ke so luong log theo level */
  @Get('stats')
  async getStats() {
    return this.logsService.getStats();
  }

  /** Danh sach admin actions voi phan trang + filter */
  @Get('actions')
  async findAllActions(@Query() query: QueryActionDto) {
    return this.adminActionsService.findAll(query);
  }

  /** Thong ke admin actions */
  @Get('actions/stats')
  async getActionsStats() {
    return this.adminActionsService.getStats();
  }

  /** Chi tiet 1 log */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }

  /** Xoa nhieu log theo IDs */
  @Delete('bulk')
  async bulkDelete(@Body() body: { ids: string[] }) {
    return this.logsService.bulkDelete(body.ids);
  }

  /** Xoa tat ca log (hoac theo level) */
  @Delete('all')
  async deleteAll(@Query('level') level?: string) {
    return this.logsService.deleteAll(level);
  }
}
