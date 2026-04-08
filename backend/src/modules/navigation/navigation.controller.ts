import { Controller, Get, Put, Body } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { SaveMenuDto } from './dto/save-menu.dto';
import { SuperAdminOnly } from '@/common/decorators/admin-only.decorator';
import { Public } from '@/common/decorators/public.decorator';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  /** Menu tree public — chi visible items */
  @Get('menu')
  @Public()
  async findPublicMenu() {
    return this.navigationService.findPublicMenu();
  }

  /** Tat ca menu items — admin, bao gom hidden */
  @Get('menu/all')
  @SuperAdminOnly()
  async findAllMenu() {
    return this.navigationService.findAllMenu();
  }

  /** Luu toan bo menu tree — replace all */
  @Put('menu')
  @SuperAdminOnly()
  async saveMenu(@Body() dto: SaveMenuDto) {
    return this.navigationService.saveMenu(dto);
  }
}
