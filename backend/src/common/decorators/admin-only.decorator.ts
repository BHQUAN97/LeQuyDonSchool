import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '@/modules/users/entities/user.entity';

/** Chi Super Admin moi truy cap duoc */
export const SuperAdminOnly = () =>
  applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(UserRole.SUPER_ADMIN));

/** Ca Super Admin va Editor deu truy cap duoc */
export const EditorOnly = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(UserRole.SUPER_ADMIN, UserRole.EDITOR),
  );
