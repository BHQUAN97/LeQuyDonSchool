import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { SuperAdminOnly, EditorOnly } from '@/common/decorators/admin-only.decorator';
import { Public } from '@/common/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** Danh sach danh muc — public, ho tro ?tree=true */
  @Get()
  @Public()
  async findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  /** Chi tiet danh muc — public */
  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  /** Tao danh muc moi — Editor tro len */
  @Post()
  @EditorOnly()
  async create(@Body() dto: CreateCategoryDto, @CurrentUser('id') userId: string) {
    return this.categoriesService.create(dto, userId);
  }

  /** Cap nhat danh muc — Editor tro len */
  @Put(':id')
  @EditorOnly()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.categoriesService.update(id, dto, userId);
  }

  /** Xoa danh muc (soft delete) — chi Super Admin */
  @Delete(':id')
  @SuperAdminOnly()
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
