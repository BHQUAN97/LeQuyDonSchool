import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { SuperAdminOnly, EditorOnly } from '@/common/decorators/admin-only.decorator';
import { Public } from '@/common/decorators/public.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /** Danh sach su kien — admin, phan trang + filter */
  @Get()
  @EditorOnly()
  async findAll(@Query() query: QueryEventDto) {
    return this.eventsService.findAll(query);
  }

  /** Su kien sap dien ra va dang dien ra — public */
  @Get('upcoming')
  @Public()
  async findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  /** Chi tiet su kien theo ID — admin */
  @Get(':id')
  @EditorOnly()
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  /** Tao su kien moi */
  @Post()
  @EditorOnly()
  async create(@Body() dto: CreateEventDto, @CurrentUser('id') userId: string) {
    return this.eventsService.create(dto, userId);
  }

  /** Cap nhat su kien */
  @Put(':id')
  @EditorOnly()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.update(id, dto, userId);
  }

  /** Xoa su kien — chi Super Admin */
  @Delete(':id')
  @SuperAdminOnly()
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
