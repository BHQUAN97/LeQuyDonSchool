import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 * API response contract (constitution.md):
 *
 * Success: `{ success: true, data: <any>, message: string, pagination?: {...} }`
 * Error: xu ly boi `AllExceptionsFilter` — shape:
 *   `{ success: false, data: null, message: string, statusCode: number, errors?: {...} }`
 *
 * Client nen check `success` field truoc khi dung `data`.
 * Interceptor nay:
 *  - Wrap success response nao chua co `success` key thanh shape chuan.
 *  - Pass-through neu controller da dung `ok()` / `paginated()` helpers (da co `success`).
 */
export interface WrappedResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, WrappedResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<WrappedResponse<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (data && typeof data === 'object' && 'success' in (data as Record<string, unknown>)) {
          return data as unknown as WrappedResponse<T>;
        }
        return { success: true, data: data as T, message: 'OK' };
      }),
    );
  }
}
