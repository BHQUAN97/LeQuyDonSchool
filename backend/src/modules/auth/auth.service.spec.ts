import { UnauthorizedException, ForbiddenException, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashed-value'),
}));

const bcrypt = require('bcrypt');

function createMockDeps() {
  const jwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn(),
  };

  const configService = {
    get: jest.fn((key: string, defaultValue?: any) => defaultValue),
    getOrThrow: jest.fn().mockReturnValue('jwt-secret'),
  };

  const userRepo = {
    findOne: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const refreshRepo = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn((data: any) => data),
    save: jest.fn((entity: any) => Promise.resolve(entity)),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const attemptRepo = {
    count: jest.fn().mockResolvedValue(0),
    create: jest.fn((data: any) => data),
    save: jest.fn((entity: any) => Promise.resolve(entity)),
  };

  const adminActionsService = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  return { jwtService, configService, userRepo, refreshRepo, attemptRepo, adminActionsService };
}

describe('AuthService', () => {
  let service: AuthService;
  let deps: ReturnType<typeof createMockDeps>;

  beforeEach(() => {
    jest.clearAllMocks();
    deps = createMockDeps();
    service = new AuthService(
      deps.jwtService as any,
      deps.configService as any,
      deps.userRepo as any,
      deps.refreshRepo as any,
      deps.attemptRepo as any,
      deps.adminActionsService as any,
    );
  });

  describe('login()', () => {
    const loginDto = { email: 'admin@test.com', password: 'password123' };
    const mockUser = {
      id: 'user-1',
      email: 'admin@test.com',
      full_name: 'Admin',
      password_hash: 'hashed-password',
      status: 'active',
      role: 'admin',
    };

    it('should login successfully with valid credentials', async () => {
      deps.attemptRepo.count.mockResolvedValue(0);
      deps.userRepo.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await service.login(loginDto, '127.0.0.1', 'Mozilla/5.0');

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.user.email).toBe('admin@test.com');
      // Should not expose password_hash
      expect((result.user as any).password_hash).toBeUndefined();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      deps.attemptRepo.count.mockResolvedValue(0);
      deps.userRepo.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto, '127.0.0.1', '')).rejects.toThrow(UnauthorizedException);
      // Should record failed attempt
      expect(deps.attemptRepo.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      deps.attemptRepo.count.mockResolvedValue(0);
      deps.userRepo.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(service.login(loginDto, '127.0.0.1', '')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException when user is inactive', async () => {
      deps.attemptRepo.count.mockResolvedValue(0);
      deps.userRepo.findOne.mockResolvedValue({ ...mockUser, status: 'inactive' });

      await expect(service.login(loginDto, '127.0.0.1', '')).rejects.toThrow(ForbiddenException);
    });

    it('should throw HttpException when rate limited (too many attempts)', async () => {
      deps.attemptRepo.count.mockResolvedValue(5); // MAX_LOGIN_ATTEMPTS = 5

      await expect(service.login(loginDto, '127.0.0.1', '')).rejects.toThrow(HttpException);
    });
  });

  describe('logout()', () => {
    it('should delete all refresh tokens for user', async () => {
      deps.userRepo.findOne.mockResolvedValue({ id: 'user-1', email: 'test@test.com', full_name: 'Test' });

      const result = await service.logout('user-1', '127.0.0.1');
      expect(deps.refreshRepo.delete).toHaveBeenCalledWith({ user_id: 'user-1' });
      expect(result.message).toBeDefined();
    });

    it('should log admin action on logout', async () => {
      deps.userRepo.findOne.mockResolvedValue({ id: 'user-1', email: 'test@test.com', full_name: 'Test' });

      await service.logout('user-1', '127.0.0.1');
      expect(deps.adminActionsService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'logout', entityType: 'auth' }),
      );
    });
  });

  describe('changePassword()', () => {
    it('should change password when current password is correct', async () => {
      deps.userRepo.findOne.mockResolvedValue({ id: 'user-1', password_hash: 'old-hash' });
      bcrypt.compare.mockResolvedValue(true);

      const result = await service.changePassword('user-1', {
        currentPassword: 'oldpass',
        newPassword: 'newpass123',
      });

      expect(deps.userRepo.update).toHaveBeenCalledWith('user-1', { password_hash: 'hashed-value' });
      expect(deps.refreshRepo.delete).toHaveBeenCalledWith({ user_id: 'user-1' });
      expect(result.message).toBeDefined();
    });

    it('should throw when current password is wrong', async () => {
      deps.userRepo.findOne.mockResolvedValue({ id: 'user-1', password_hash: 'old-hash' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        service.changePassword('user-1', { currentPassword: 'wrong', newPassword: 'new' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when user not found', async () => {
      deps.userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.changePassword('nonexistent', { currentPassword: 'x', newPassword: 'y' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile()', () => {
    it('should return user without password_hash', async () => {
      deps.userRepo.findOne.mockResolvedValue({
        id: 'user-1',
        email: 'admin@test.com',
        full_name: 'Admin',
        password_hash: 'secret-hash',
      });

      const result = await service.getProfile('user-1');
      expect(result.email).toBe('admin@test.com');
      expect((result as any).password_hash).toBeUndefined();
    });

    it('should throw when user not found', async () => {
      deps.userRepo.findOne.mockResolvedValue(null);
      await expect(service.getProfile('nonexistent')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getRefreshCookieOptions()', () => {
    it('should return httpOnly cookie options', () => {
      const options = service.getRefreshCookieOptions();
      expect(options.httpOnly).toBe(true);
      expect(options.path).toBe('/');
      expect(options.sameSite).toBe('lax');
    });
  });
});
