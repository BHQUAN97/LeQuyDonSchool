import { Controller, Post, Get, Put, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res() res: Response) {
    const ip = req.ip || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || '';

    const result = await this.authService.login(dto, ip, userAgent);

    // Set refresh token vao httpOnly cookie
    const cookieOptions = this.authService.getRefreshCookieOptions();
    res.cookie('refreshToken', result.refreshToken, cookieOptions);

    // Khong tra refreshToken trong response body — chi trong cookie
    const { refreshToken, ...responseData } = result;
    res.json({ success: true, data: responseData, message: 'Đăng nhập thành công' });
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    const ip = req.ip || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || '';

    const result = await this.authService.refresh(refreshToken, ip, userAgent);

    // Set refresh token moi vao cookie (rotation)
    const cookieOptions = this.authService.getRefreshCookieOptions();
    res.cookie('refreshToken', result.refreshToken, cookieOptions);

    res.json({ success: true, data: { accessToken: result.accessToken }, message: 'OK' });
  }

  @Post('logout')
  async logout(@CurrentUser('id') userId: string, @Req() req: Request, @Res() res: Response) {
    const ip = req.ip || '0.0.0.0';
    const result = await this.authService.logout(userId, ip);
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ success: true, data: null, message: result.message });
  }

  @Get('me')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @Put('change-password')
  async changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(userId, dto);
  }
}
