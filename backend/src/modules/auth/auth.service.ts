import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '@/modules/users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginAttempt } from './entities/login-attempt.entity';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { generateUlid } from '@/common/utils/ulid';
import { AdminActionsService } from '@/modules/logs/admin-actions.service';
import { ActionType } from '@/modules/logs/entities/admin-action.entity';

// Gioi han dang nhap: 5 lan sai trong 30 phut
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 30;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken) private readonly refreshRepo: Repository<RefreshToken>,
    @InjectRepository(LoginAttempt) private readonly attemptRepo: Repository<LoginAttempt>,
    private readonly adminActionsService: AdminActionsService,
  ) {}

  /**
   * Dang nhap — kiem tra rate limit, validate user, tao token pair.
   */
  async login(dto: LoginDto, ip: string, userAgent: string) {
    // Kiem tra rate limit theo IP
    await this.checkLoginRateLimit(ip, dto.email);

    // Tim user
    const user = await this.userRepo.findOne({
      where: { email: dto.email, deleted_at: IsNull() },
    });

    if (!user) {
      await this.recordAttempt(dto.email, ip, false);
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Tài khoản đã bị vô hiệu hóa');
    }

    // So sanh mat khau
    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) {
      await this.recordAttempt(dto.email, ip, false);
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Dang nhap thanh cong
    await this.recordAttempt(dto.email, ip, true);
    await this.userRepo.update(user.id, { last_login_at: new Date() });

    const tokens = await this.generateTokens(user, ip, userAgent);
    const { password_hash, ...safeUser } = user;

    // Ghi log admin action — login
    await this.adminActionsService.log({
      action: ActionType.LOGIN,
      entityType: 'auth',
      entityId: user.id,
      description: `Đăng nhập: ${user.email}`,
      userId: user.id,
      userName: user.full_name || user.email,
      ip,
    });

    return { user: safeUser, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  /**
   * Refresh token — verify, detect theft, rotate.
   */
  async refresh(refreshTokenValue: string, ip: string, userAgent: string) {
    if (!refreshTokenValue) {
      throw new UnauthorizedException('Refresh token không tồn tại');
    }

    // Verify JWT
    let payload: { sub: string; type: string };
    try {
      payload = this.jwtService.verify(refreshTokenValue, {
        secret: this.configService.getOrThrow<string>('jwt.secret'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token hết hạn hoặc không hợp lệ');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    // Tim tat ca refresh tokens cua user
    const storedTokens = await this.refreshRepo.find({
      where: { user_id: payload.sub },
    });

    if (storedTokens.length === 0) {
      throw new UnauthorizedException('Phiên đăng nhập không tồn tại');
    }

    // Tim token khop
    let matchedToken: RefreshToken | null = null;
    for (const stored of storedTokens) {
      const isMatch = await bcrypt.compare(refreshTokenValue, stored.token_hash);
      if (isMatch) {
        matchedToken = stored;
        break;
      }
    }

    // Token theft detection: co tokens nhung khong khop → huy tat ca
    if (!matchedToken) {
      await this.refreshRepo.delete({ user_id: payload.sub });
      throw new UnauthorizedException('Phát hiện bất thường — đã hủy tất cả phiên đăng nhập');
    }

    // Xoa token cu
    await this.refreshRepo.delete(matchedToken.id);

    // Lay user
    const user = await this.userRepo.findOne({
      where: { id: payload.sub, status: UserStatus.ACTIVE, deleted_at: IsNull() },
    });
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    // Tao token moi
    const tokens = await this.generateTokens(user, ip, userAgent);
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  /**
   * Dang xuat — xoa tat ca refresh tokens cua user, ghi log.
   */
  async logout(userId: string, ip?: string) {
    // Lay ten user de ghi log
    const user = await this.userRepo.findOne({ where: { id: userId } });
    await this.refreshRepo.delete({ user_id: userId });

    // Ghi log admin action — logout
    await this.adminActionsService.log({
      action: ActionType.LOGOUT,
      entityType: 'auth',
      entityId: userId,
      description: `Đăng xuất: ${user?.email || userId}`,
      userId,
      userName: user?.full_name || user?.email || undefined,
      ip,
    });

    return { message: 'Đăng xuất thành công' };
  }

  /**
   * Doi mat khau — verify mat khau cu, hash mat khau moi, huy tat ca phien.
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại');

    const valid = await bcrypt.compare(dto.currentPassword, user.password_hash);
    if (!valid) throw new UnauthorizedException('Mật khẩu hiện tại không đúng');

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.update(userId, { password_hash: newHash });

    // Huy tat ca phien — bat buoc dang nhap lai
    await this.refreshRepo.delete({ user_id: userId });

    return { message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' };
  }

  /**
   * Lay thong tin user hien tai.
   */
  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId, deleted_at: IsNull() },
    });
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại');

    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  // === Private methods ===

  /** Tao access + refresh token pair */
  private async generateTokens(user: User, ip: string, userAgent: string) {
    const accessPayload = { sub: user.id, email: user.email, role: user.role, type: 'access' };
    const refreshPayload = { sub: user.id, email: user.email, role: user.role, type: 'refresh' };

    const expiresIn = this.configService.get<number>('jwt.expiresIn', 900);
    const refreshExpiresIn = this.configService.get<number>('jwt.refreshExpiresIn', 604800);

    const accessToken = this.jwtService.sign(accessPayload, { expiresIn });
    const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: refreshExpiresIn });

    // Luu hash cua refresh token vao DB
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const refreshRecord = this.refreshRepo.create({
      id: generateUlid(),
      user_id: user.id,
      token_hash: tokenHash,
      ip_address: ip,
      user_agent: userAgent?.substring(0, 500) || null,
      expires_at: new Date(Date.now() + refreshExpiresIn * 1000),
    });
    await this.refreshRepo.save(refreshRecord);

    return { accessToken, refreshToken };
  }

  /** Kiem tra rate limit dang nhap */
  private async checkLoginRateLimit(ip: string, email: string) {
    const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000);

    const failedAttempts = await this.attemptRepo.count({
      where: {
        ip_address: ip,
        success: false,
        attempted_at: MoreThan(since),
      },
    });

    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      throw new HttpException(
        `Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau ${LOCKOUT_MINUTES} phút.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /** Ghi nhan lan dang nhap */
  private async recordAttempt(email: string, ip: string, success: boolean) {
    const attempt = this.attemptRepo.create({
      id: generateUlid(),
      email,
      ip_address: ip,
      success,
    });
    await this.attemptRepo.save(attempt);
  }

  /** Lay refresh token config cho cookie */
  getRefreshCookieOptions() {
    const refreshExpiresIn = this.configService.get<number>('jwt.refreshExpiresIn', 604800);
    const isProduction = this.configService.get<string>('app.nodeEnv') === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/api/auth',
      maxAge: refreshExpiresIn * 1000,
    };
  }
}
