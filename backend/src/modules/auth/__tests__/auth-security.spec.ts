/**
 * Security tests — Auth rate limiting & user enumeration
 *
 * VULN #10: Login rate limit only counts by IP, not by email.
 *           An attacker with many IPs (botnet) can brute-force a single account.
 */

import { HttpException } from '@nestjs/common';
import { AuthService } from '../auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashed-value'),
}));

const bcrypt = require('bcrypt');

function createMockDeps() {
  return {
    jwtService: {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      verify: jest.fn(),
    },
    configService: {
      get: jest.fn((_key: string, defaultValue?: any) => defaultValue),
      getOrThrow: jest.fn().mockReturnValue('jwt-secret'),
    },
    userRepo: {
      findOne: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    },
    refreshRepo: {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((data: any) => data),
      save: jest.fn((entity: any) => Promise.resolve(entity)),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    },
    attemptRepo: {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn((data: any) => data),
      save: jest.fn((entity: any) => Promise.resolve(entity)),
    },
    adminActionsService: {
      log: jest.fn().mockResolvedValue(undefined),
    },
  };
}

describe('Auth Security', () => {
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

  describe('VULN #10: Rate limit by IP only, not by email', () => {
    it('VULNERABILITY: rate limit query only filters by ip_address, not email', async () => {
      /**
       * checkLoginRateLimit() counts failed attempts WHERE ip_address = :ip.
       * It receives `email` parameter but DOES NOT use it in the query.
       *
       * Attack scenario: attacker uses 100 different IPs to try passwords
       * on admin@school.edu.vn — each IP only has 1-2 attempts,
       * so rate limit never triggers.
       */

      // Simulate: 5 failed attempts from IP-A (blocked)
      deps.attemptRepo.count.mockResolvedValue(5);
      await expect(
        service.login({ email: 'admin@test.com', password: 'wrong' }, '1.1.1.1', ''),
      ).rejects.toThrow(HttpException);

      // Simulate: same email from different IP — count resets to 0
      deps.attemptRepo.count.mockResolvedValue(0);
      deps.userRepo.findOne.mockResolvedValue(null);

      // This succeeds (no rate limit) even though same email was just rate limited
      // The vulnerability: no per-email rate limiting
      try {
        await service.login({ email: 'admin@test.com', password: 'wrong' }, '2.2.2.2', '');
      } catch (e: any) {
        // Should be UnauthorizedException (wrong creds), NOT HttpException (rate limited)
        expect(e.status).not.toBe(429);
      }

      // Verify: attemptRepo.count was called with IP only, not email
      const countCall = deps.attemptRepo.count.mock.calls[1][0];
      expect(countCall.where).toHaveProperty('ip_address');
      // email is NOT in the where clause — vulnerability confirmed
      expect(countCall.where.email).toBeUndefined();
    });
  });

  describe('User enumeration prevention', () => {
    it('should return same error message for non-existent user and wrong password', async () => {
      deps.attemptRepo.count.mockResolvedValue(0);

      // Case 1: user not found
      deps.userRepo.findOne.mockResolvedValue(null);
      let error1Message = '';
      try {
        await service.login({ email: 'nonexistent@test.com', password: 'pass' }, '1.1.1.1', '');
      } catch (e: any) {
        error1Message = e.message;
      }

      // Case 2: user found, wrong password
      deps.userRepo.findOne.mockResolvedValue({
        id: 'user-1',
        email: 'admin@test.com',
        password_hash: 'hashed',
        status: 'active',
      });
      bcrypt.compare.mockResolvedValue(false);
      let error2Message = '';
      try {
        await service.login({ email: 'admin@test.com', password: 'wrong' }, '1.1.1.1', '');
      } catch (e: any) {
        error2Message = e.message;
      }

      // Both should return identical message to prevent user enumeration
      expect(error1Message).toBe(error2Message);
      expect(error1Message).toBe('Email hoặc mật khẩu không đúng');
    });
  });

  describe('Login attempt recording', () => {
    it('should record failed attempt with email when user not found', async () => {
      deps.attemptRepo.count.mockResolvedValue(0);
      deps.userRepo.findOne.mockResolvedValue(null);

      try {
        await service.login({ email: 'test@test.com', password: 'wrong' }, '1.1.1.1', '');
      } catch {
        // expected
      }

      expect(deps.attemptRepo.save).toHaveBeenCalled();
      const savedAttempt = deps.attemptRepo.create.mock.calls[0][0];
      expect(savedAttempt.email).toBe('test@test.com');
      expect(savedAttempt.ip_address).toBe('1.1.1.1');
      expect(savedAttempt.success).toBe(false);
    });

    it('should record successful attempt after login', async () => {
      deps.attemptRepo.count.mockResolvedValue(0);
      deps.userRepo.findOne.mockResolvedValue({
        id: 'user-1',
        email: 'admin@test.com',
        full_name: 'Admin',
        password_hash: 'hashed',
        status: 'active',
        role: 'admin',
      });
      bcrypt.compare.mockResolvedValue(true);

      await service.login({ email: 'admin@test.com', password: 'correct' }, '1.1.1.1', 'Mozilla');

      const savedAttempt = deps.attemptRepo.create.mock.calls[0][0];
      expect(savedAttempt.success).toBe(true);
    });
  });
});
