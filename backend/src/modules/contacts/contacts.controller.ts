import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { EditorOnly, SuperAdminOnly } from '@/common/decorators/admin-only.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { ok } from '@/common/helpers/response.helper';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  /**
   * Khach gui lien he — public, gioi han 3 request/phut.
   * CSRF: bat buoc co header `x-csrf-token` trung voi cookie `csrf-token`
   * (enforce trong CsrfMiddleware, app.module.ts forRoutes { path: 'contacts', POST }).
   */
  @Post()
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async create(@Body() dto: CreateContactDto) {
    const contact = await this.contactsService.create(dto);
    return ok(contact, 'Gui lien he thanh cong');
  }

  /** Danh sach lien he — admin */
  @Get()
  @EditorOnly()
  async findAll(@Query() query: QueryContactDto) {
    return this.contactsService.findAll(query);
  }

  /** Chi tiet lien he — admin */
  @Get(':id')
  @EditorOnly()
  async findOne(@Param('id') id: string) {
    const contact = await this.contactsService.findOne(id);
    return ok(contact);
  }

  /** Cap nhat trang thai lien he */
  @Put(':id/status')
  @EditorOnly()
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContactStatusDto,
  ) {
    const contact = await this.contactsService.updateStatus(id, dto.status);
    return ok(contact, 'Cap nhat trang thai thanh cong');
  }

  /** Xoa lien he — chi Super Admin */
  @Delete(':id')
  @SuperAdminOnly()
  async remove(@Param('id') id: string) {
    const result = await this.contactsService.remove(id);
    return ok(result);
  }
}
