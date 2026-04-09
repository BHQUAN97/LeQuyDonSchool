import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LogsService } from '@/modules/logs/logs.service';
import { LogLevel } from '@/modules/logs/entities/app-log.entity';

/**
 * Ghi access log tu dong cho moi request vao DB.
 * Dung DI de inject LogsService — KHONG instantiate bang new.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = req;

    // Skip health check
    if (url === '/api/health') {
      return next.handle();
    }

    const userAgent = headers['user-agent'] || null;
    const userId = req.user?.id || null;
    const endpoint = `${method} ${url}`;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode as number;
        const duration = Date.now() - start;

        this.logsService.write({
          level: statusCode >= 500 ? LogLevel.ERROR : LogLevel.INFO,
          message: `${endpoint} ${statusCode} ${duration}ms`,
          endpoint,
          status_code: statusCode,
          ip,
          user_id: userId,
          user_agent: userAgent,
        });
      }),
      catchError((err) => {
        const statusCode =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const duration = Date.now() - start;

        this.logsService.write({
          level: LogLevel.ERROR,
          message: `${endpoint} ${statusCode} ${duration}ms — ${err.message}`,
          stack_trace: err.stack || null,
          endpoint,
          status_code: statusCode,
          ip,
          user_id: userId,
          user_agent: userAgent,
        });

        return throwError(() => err);
      }),
    );
  }
}
