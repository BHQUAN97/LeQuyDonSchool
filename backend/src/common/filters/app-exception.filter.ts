import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * Global exception filter — bat tat ca loi, tra ve format chuan.
 * Khong leak stack trace ra client (chi log server-side).
 */
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi hệ thống';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as Record<string, unknown>).message as string || exception.message;

      // class-validator tra ve mang loi
      if (Array.isArray(message)) {
        message = (message as string[]).join(', ');
      }
    }

    // Log server-side
    const isDev = process.env.NODE_ENV === 'development';
    if (status >= 500 || isDev) {
      console.error(`[${request.method}] ${request.url} → ${status}`, exception);
    }

    response.status(status).json({
      success: false,
      message,
      ...(isDev && exception instanceof Error && { stack: exception.stack }),
    });
  }
}
