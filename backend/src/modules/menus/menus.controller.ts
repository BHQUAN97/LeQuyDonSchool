import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { CopyMenuDto } from './dto/copy-menu.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { EditorOnly, SuperAdminOnly } from '@/common/decorators/admin-only.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { ok } from '@/common/helpers/response.helper';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  /**
   * Thuc don public — client truyen ?date=YYYY-MM-DD (1 ngay)
   * hoac ?dateFrom=&dateTo= (khoang ngay, thuong la 1 tuan).
   */
  @Get('public')
  @Public()
  async findPublic(
    @Query('date') date?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    // Uu tien single-date neu co
    if (date) {
      const data = await this.menusService.findByDate(date);
      return ok(data);
    }
    if (dateFrom && dateTo) {
      const data = await this.menusService.findByDateRange(dateFrom, dateTo);
      return ok(data);
    }
    throw new BadRequestException('Phải truyền ?date hoặc ?dateFrom & ?dateTo');
  }

  /** Danh sach thuc don — admin */
  @Get()
  @EditorOnly()
  async findAll(@Query() query: QueryMenuDto) {
    return this.menusService.findAll(query);
  }

  /** Chi tiet thuc don theo ID — admin */
  @Get(':id')
  @EditorOnly()
  async findOne(@Param('id') id: string) {
    return this.menusService.findOne(id);
  }

  /** Tao thuc don moi */
  @Post()
  @EditorOnly()
  async create(@Body() dto: CreateMenuDto, @CurrentUser('id') userId: string) {
    return this.menusService.create(dto, userId);
  }

  /** Duplicate thuc don tu ngay khac */
  @Post('copy')
  @EditorOnly()
  async copy(@Body() dto: CopyMenuDto, @CurrentUser('id') userId: string) {
    return this.menusService.copyFromDate(dto.fromDate, dto.toDate, userId);
  }

  /** Cap nhat thuc don */
  @Patch(':id')
  @EditorOnly()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMenuDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.menusService.update(id, dto, userId);
  }

  /** Xoa thuc don — chi Super Admin */
  @Delete(':id')
  @SuperAdminOnly()
  async remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}
