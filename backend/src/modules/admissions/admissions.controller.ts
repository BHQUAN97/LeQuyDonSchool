import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionPostDto } from './dto/create-admission-post.dto';
import { UpdateAdmissionPostDto } from './dto/update-admission-post.dto';
import { QueryAdmissionPostDto } from './dto/query-admission-post.dto';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationStatusDto } from './dto/update-registration-status.dto';
import { QueryRegistrationDto } from './dto/query-registration.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { SuperAdminOnly, EditorOnly } from '@/common/decorators/admin-only.decorator';
import { Public } from '@/common/decorators/public.decorator';

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  // ─── BÀI ĐĂNG TUYỂN SINH ────────────────────────────────

  /** Danh sach bai dang — admin */
  @Get('posts')
  @EditorOnly()
  async findAllPosts(@Query() query: QueryAdmissionPostDto) {
    return this.admissionsService.findAllPosts(query);
  }

  /** Danh sach bai dang — public, chi published */
  @Get('posts/public')
  @Public()
  async findPublicPosts(@Query() query: QueryAdmissionPostDto) {
    return this.admissionsService.findPublicPosts(query);
  }

  /** Chi tiet bai dang — admin */
  @Get('posts/:id')
  @EditorOnly()
  async findOnePost(@Param('id') id: string) {
    return this.admissionsService.findOnePost(id);
  }

  /** Tao bai dang moi */
  @Post('posts')
  @EditorOnly()
  async createPost(@Body() dto: CreateAdmissionPostDto, @CurrentUser('id') userId: string) {
    return this.admissionsService.createPost(dto, userId);
  }

  /** Cap nhat bai dang */
  @Put('posts/:id')
  @EditorOnly()
  async updatePost(
    @Param('id') id: string,
    @Body() dto: UpdateAdmissionPostDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.admissionsService.updatePost(id, dto, userId);
  }

  /** Xoa bai dang — chi Super Admin */
  @Delete('posts/:id')
  @SuperAdminOnly()
  async removePost(@Param('id') id: string) {
    return this.admissionsService.removePost(id);
  }

  // ─── FAQ ─────────────────────────────────────────────────

  /** FAQ public — chi visible, sap xep theo display_order */
  @Get('faq')
  @Public()
  async findPublicFaq() {
    return this.admissionsService.findPublicFaq();
  }

  /** FAQ admin — tat ca */
  @Get('faq/all')
  @SuperAdminOnly()
  async findAllFaq() {
    return this.admissionsService.findAllFaq();
  }

  /** Tao FAQ moi */
  @Post('faq')
  @SuperAdminOnly()
  async createFaq(@Body() dto: CreateFaqDto) {
    return this.admissionsService.createFaq(dto);
  }

  /** Cap nhat FAQ */
  @Put('faq/:id')
  @SuperAdminOnly()
  async updateFaq(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.admissionsService.updateFaq(id, dto);
  }

  /** Xoa FAQ */
  @Delete('faq/:id')
  @SuperAdminOnly()
  async removeFaq(@Param('id') id: string) {
    return this.admissionsService.removeFaq(id);
  }

  // ─── ĐĂNG KÝ TUYỂN SINH ─────────────────────────────────

  /**
   * Dang ky tuyen sinh — public, throttle 3 lan/phut.
   * CSRF: yeu cau header `x-csrf-token` khop cookie `csrf-token`
   * (enforce trong CsrfMiddleware, app.module.ts forRoutes { path: 'admissions/registrations', POST }).
   */
  @Post('registrations')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 300_000 } })
  async createRegistration(@Body() dto: CreateRegistrationDto) {
    return this.admissionsService.createRegistration(dto);
  }

  /** Danh sach dang ky — admin */
  @Get('registrations')
  @SuperAdminOnly()
  async findAllRegistrations(@Query() query: QueryRegistrationDto) {
    return this.admissionsService.findAllRegistrations(query);
  }

  /** Cap nhat trang thai dang ky */
  @Put('registrations/:id/status')
  @SuperAdminOnly()
  async updateRegistrationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRegistrationStatusDto,
  ) {
    return this.admissionsService.updateRegistrationStatus(id, dto);
  }
}
