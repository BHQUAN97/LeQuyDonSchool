import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@/modules/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const handlerName = `${context.getClass().name}.${context.getHandler().name}`;

    // Default deny: route co attach RolesGuard nhung thieu @Roles() → chan
    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.warn(`RolesGuard invoked without @Roles() metadata on ${handlerName} — denying`);
      throw new ForbiddenException('Không có quyền truy cập');
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user?.role) throw new ForbiddenException('Không có quyền truy cập');
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Không đủ quyền thực hiện thao tác này');
    }

    return true;
  }
}
