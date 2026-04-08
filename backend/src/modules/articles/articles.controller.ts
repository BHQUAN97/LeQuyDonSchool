import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { SuperAdminOnly } from '@/common/decorators/admin-only.decorator';
import { EditorOnly } from '@/common/decorators/admin-only.decorator';
import { Public } from '@/common/decorators/public.decorator';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /** Danh sach bai viet — admin, phan trang + filter */
  @Get()
  @EditorOnly()
  async findAll(@Query() query: QueryArticleDto) {
    return this.articlesService.findAll(query);
  }

  /** Danh sach bai viet — public, chi published */
  @Get('public')
  @Public()
  async findAllPublic(@Query() query: QueryArticleDto) {
    return this.articlesService.findAllPublic(query);
  }

  /** Chi tiet bai viet theo slug — public */
  @Get('slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    const article = await this.articlesService.findBySlug(slug);
    // Tang luot xem — fire-and-forget
    this.articlesService.incrementViewCount(article.id);
    return article;
  }

  /** Chi tiet bai viet theo ID — admin */
  @Get(':id')
  @EditorOnly()
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  /** Tao bai viet moi */
  @Post()
  @EditorOnly()
  async create(@Body() dto: CreateArticleDto, @CurrentUser('id') userId: string) {
    return this.articlesService.create(dto, userId);
  }

  /** Cap nhat bai viet */
  @Put(':id')
  @EditorOnly()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.articlesService.update(id, dto, userId);
  }

  /** Xoa bai viet — chi Super Admin */
  @Delete(':id')
  @SuperAdminOnly()
  async remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
