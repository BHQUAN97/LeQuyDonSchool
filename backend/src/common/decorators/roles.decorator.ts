import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@/modules/users/entities/user.entity';

export const ROLES_KEY = 'roles';

/** Gioi han truy cap theo vai tro. VD: @Roles(UserRole.SUPER_ADMIN) */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
