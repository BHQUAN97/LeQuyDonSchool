import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '@/modules/users/entities/user.entity';

/**
 * Helper — tao ExecutionContext gia lap cho unit test.
 * Handler/class identity chi can co `.name` de guard log warning.
 */
function createMockContext(user: any): ExecutionContext {
  const handler = function testHandler() {};
  class TestController {}

  return {
    getHandler: () => handler,
    getClass: () => TestController,
    switchToHttp: () => ({
      getRequest: () => ({ user }),
      getResponse: () => ({}),
      getNext: () => ({}),
    }),
    getArgs: () => [],
    getArgByIndex: () => null,
    switchToRpc: () => ({}) as any,
    switchToWs: () => ({}) as any,
    getType: () => 'http',
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: { getAllAndOverride: jest.Mock };

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  describe('default-deny behavior', () => {
    it('should throw ForbiddenException when @Roles() metadata is missing (undefined)', () => {
      reflector.getAllAndOverride.mockReturnValue(undefined);
      const ctx = createMockContext({ role: UserRole.SUPER_ADMIN });

      // Su dung try/catch thay vi .toThrow(Class) — Jest 30 co ve co issue voi class matcher khi class tu @nestjs/common
      let caught: unknown = null;
      try {
        guard.canActivate(ctx);
      } catch (e) {
        caught = e;
      }
      expect(caught).toBeInstanceOf(ForbiddenException);
    });

    it('should throw ForbiddenException when @Roles() metadata is empty array', () => {
      reflector.getAllAndOverride.mockReturnValue([]);
      const ctx = createMockContext({ role: UserRole.SUPER_ADMIN });

      let caught: unknown = null;
      try {
        guard.canActivate(ctx);
      } catch (e) {
        caught = e;
      }
      expect(caught).toBeInstanceOf(ForbiddenException);
    });
  });

  describe('role matching', () => {
    it('should allow when user role matches required roles', () => {
      reflector.getAllAndOverride.mockReturnValue([UserRole.SUPER_ADMIN]);
      const ctx = createMockContext({ role: UserRole.SUPER_ADMIN });

      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('should allow when user role matches one of multiple required roles', () => {
      reflector.getAllAndOverride.mockReturnValue([UserRole.SUPER_ADMIN, UserRole.EDITOR]);
      const ctx = createMockContext({ role: UserRole.EDITOR });

      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('should throw ForbiddenException when user role does not match', () => {
      reflector.getAllAndOverride.mockReturnValue([UserRole.SUPER_ADMIN]);
      const ctx = createMockContext({ role: UserRole.EDITOR });

      let caught: unknown = null;
      try {
        guard.canActivate(ctx);
      } catch (e) {
        caught = e;
      }
      expect(caught).toBeInstanceOf(ForbiddenException);
    });

    it('should throw ForbiddenException when user is missing', () => {
      reflector.getAllAndOverride.mockReturnValue([UserRole.SUPER_ADMIN]);
      const ctx = createMockContext(undefined);

      let caught: unknown = null;
      try {
        guard.canActivate(ctx);
      } catch (e) {
        caught = e;
      }
      expect(caught).toBeInstanceOf(ForbiddenException);
    });

    it('should throw ForbiddenException when user has no role', () => {
      reflector.getAllAndOverride.mockReturnValue([UserRole.SUPER_ADMIN]);
      const ctx = createMockContext({ id: 'u1' });

      let caught: unknown = null;
      try {
        guard.canActivate(ctx);
      } catch (e) {
        caught = e;
      }
      expect(caught).toBeInstanceOf(ForbiddenException);
    });
  });
});
