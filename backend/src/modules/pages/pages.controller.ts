import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { QueryPageDto } from './dto/query-page.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { SuperAdminOnly } from '@/common/decorators/admin-only.decorator';
import { EditorOnly } from '@/common/decorators/admin-only.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { ok } from '@/common/helpers/response.helper';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  /** Danh sach trang — admin */
  @Get()
  @EditorOnly()
  async findAll(@Query() query: QueryPageDto) {
    return this.pagesService.findAll(query);
  }

  /** Xem trang theo slug — public */
  @Get('slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    const page = await this.pagesService.findBySlug(slug);
    return ok(page);
  }

  /** Xem trang theo path (ho tro nested slug) — public */
  @Get('by-path')
  @Public()
  async findByPath(@Query('path') path: string) {
    const page = await this.pagesService.findBySlug(path);
    return ok(page);
  }

  /** Xem chi tiet trang — admin */
  @Get(':id')
  @EditorOnly()
  async findOne(@Param('id') id: string) {
    const page = await this.pagesService.findOne(id);
    return ok(page);
  }

  /** Tao trang moi */
  @Post()
  @EditorOnly()
  async create(@Body() dto: CreatePageDto, @CurrentUser('id') userId: string) {
    const page = await this.pagesService.create(dto, userId);
    return ok(page, 'Tao trang thanh cong');
  }

  /** Cap nhat trang */
  @Put(':id')
  @EditorOnly()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePageDto,
    @CurrentUser('id') userId: string,
  ) {
    const page = await this.pagesService.update(id, dto, userId);
    return ok(page, 'Cap nhat trang thanh cong');
  }

  /** Xoa trang — chi Super Admin */
  @Delete(':id')
  @SuperAdminOnly()
  async remove(@Param('id') id: string) {
    const result = await this.pagesService.remove(id);
    return ok(result);
  }
}
