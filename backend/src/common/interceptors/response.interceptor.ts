import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface WrappedResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * Wrap tat ca response thanh { success, data, message }.
 * Neu response da co success field → pass through (de helper functions hoat dong).
 */
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
