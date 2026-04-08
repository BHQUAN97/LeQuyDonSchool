import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: Record<string, unknown>;
}

/**
 * Lay user hien tai tu request.
 * @CurrentUser() user — lay toan bo
 * @CurrentUser('id') userId — lay 1 field
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (!user) return null;
    return data ? user[data] : user;
  },
);
