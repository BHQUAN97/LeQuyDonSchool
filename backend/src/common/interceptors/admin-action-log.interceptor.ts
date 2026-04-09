import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AdminActionsService } from '@/modules/logs/admin-actions.service';
import { ActionType } from '@/modules/logs/entities/admin-action.entity';

/**
 * Interceptor tu dong ghi admin action log cho moi request POST/PUT/DELETE
 * trong cac route /api/* (tru /api/auth, /api/logs, /api/analytics).
 */
@Injectable()
export class AdminActionLogInterceptor implements NestInterceptor {
  constructor(private readonly adminActionsService: AdminActionsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const method: string = req.method;

    // Chi log write operations
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    // Bo qua cac route khong can log
    const url: string = req.url || '';
    if (/^\/(api\/)?(auth|logs|analytics|health)/.test(url)) {
      return next.handle();
    }

    const user = req.user;
    if (!user) return next.handle();

    return next.handle().pipe(
      tap((response) => {
        const action = this.resolveAction(method, url);
        const entityType = this.resolveEntityType(url);
        const entityId = this.resolveEntityId(response);

        this.adminActionsService.log({
          action,
          entityType,
          entityId,
          description: `${action} ${entityType}${entityId ? ` #${entityId}` : ''}`,
          userId: user.id,
          userName: user.fullName || user.email,
          ip: req.ip,
        });
      }),
    );
  }

  private resolveAction(method: string, url: string): ActionType {
    if (url.includes('/upload')) return ActionType.UPLOAD;
    switch (method) {
      case 'POST': return ActionType.CREATE;
      case 'PUT':
      case 'PATCH': return ActionType.UPDATE;
      case 'DELETE': return ActionType.DELETE;
      default: return ActionType.CREATE;
    }
  }

  // Lay ten entity tu URL path segment dau tien sau /api/
  private resolveEntityType(url: string): string {
    const match = url.match(/\/api\/([a-z-]+)/);
    return match ? match[1] : 'unknown';
  }

  // Thu lay entity ID tu response data
  private resolveEntityId(response: unknown): string | undefined {
    if (!response || typeof response !== 'object') return undefined;
    const data = (response as Record<string, unknown>).data;
    if (data && typeof data === 'object' && 'id' in (data as Record<string, unknown>)) {
      return (data as Record<string, unknown>).id as string;
    }
    return undefined;
  }
}
