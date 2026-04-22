import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: Partial<AuthService>;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    service = {
      login: jest.fn().mockResolvedValue({
        user: { id: '1', email: 'test@test.com' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }),
      refresh: jest.fn().mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }),
      logout: jest.fn().mockResolvedValue({ message: 'Đăng xuất thành công' }),
      getProfile: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com' }),
      changePassword: jest.fn().mockResolvedValue({ message: 'Đổi mật khẩu thành công.' }),
      getRefreshCookieOptions: jest.fn().mockReturnValue({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 604800000,
      }),
    };

    mockReq = {
      ip: '127.0.0.1',
      headers: { 'user-agent': 'TestAgent', 'x-forwarded-for': undefined },
      cookies: {},
    };

    mockRes = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      json: jest.fn(),
    };

    controller = new AuthController(service as AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    it('should set refresh token cookie and return user data', async () => {
      const dto = { email: 'test@test.com', password: 'pass123' };
      await controller.login(dto as any, mockReq, mockRes);

      expect(service.login).toHaveBeenCalledWith(dto, '127.0.0.1', 'TestAgent');
      expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ accessToken: 'access-token' }),
        }),
      );
      // refreshToken should NOT be in response body
      const responseData = mockRes.json.mock.calls[0][0].data;
      expect(responseData.refreshToken).toBeUndefined();
    });

    it('should use req.ip for client IP (trust proxy handles x-forwarded-for)', async () => {
      mockReq.ip = '10.0.0.1';
      const dto = { email: 'test@test.com', password: 'pass' };
      await controller.login(dto as any, mockReq, mockRes);

      expect(service.login).toHaveBeenCalledWith(dto, '10.0.0.1', 'TestAgent');
    });
  });

  describe('refresh()', () => {
    it('should refresh token and set new cookie', async () => {
      mockReq.cookies = { refreshToken: 'old-refresh-token' };
      await controller.refresh(mockReq, mockRes);

      expect(service.refresh).toHaveBeenCalledWith('old-refresh-token', '127.0.0.1', 'TestAgent');
      expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'new-refresh-token', expect.any(Object));
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: { accessToken: 'new-access-token' },
        }),
      );
    });
  });

  describe('logout()', () => {
    it('should clear cookie and return success', async () => {
      await controller.logout('user-1', mockReq, mockRes);

      expect(service.logout).toHaveBeenCalledWith('user-1', '127.0.0.1');
      expect(mockRes.clearCookie).toHaveBeenCalledWith('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });
  });

  describe('getProfile()', () => {
    it('should return user profile', async () => {
      const result = await controller.getProfile('user-1');
      expect(service.getProfile).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ id: '1', email: 'test@test.com' });
    });
  });

  describe('changePassword()', () => {
    it('should change password', async () => {
      const dto = { currentPassword: 'old', newPassword: 'new' };
      const result = await controller.changePassword('user-1', dto as any);
      expect(service.changePassword).toHaveBeenCalledWith('user-1', dto);
    });
  });
});
