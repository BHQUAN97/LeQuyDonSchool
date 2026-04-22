import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

/**
 * CSRF double-submit cookie pattern — chong cross-site request forgery
 * cho cac public form (contact, admission register).
 *
 * LY DO ADMIN ROUTES KHONG CAN CSRF (W4 decision):
 *  - Access token luu in-memory va gui qua `Authorization: Bearer ...` header.
 *  - Trinh duyet KHONG tu dong gui header nay cho cross-origin requests.
 *  - Refresh cookie `httpOnly + sameSite=strict` trong production,
 *    browser tu chan cross-site submit.
 *  - Neu attacker co XSS thi lay duoc access token tu memory roi — CSRF token
 *    khong chong duoc XSS anyway. CSRF chi lam vi dung cookie-based auth.
 *
 * Neu sau nay chuyen access token sang httpOnly cookie thi PHAI mo rong
 * middleware nay cho admin POST/PUT/DELETE.
 *
 * Flow:
 *  - Safe methods (GET/HEAD/OPTIONS): neu chua co cookie csrf-token thi sinh
 *    random 32 bytes (hex 64 chars), set cookie (JS doc duoc, sameSite strict,
 *    secure khi production). Client doc cookie do roi gui header x-csrf-token
 *    cung gia tri khi submit form.
 *  - Unsafe methods (POST/PUT/PATCH/DELETE): so sanh header x-csrf-token voi
 *    cookie csrf-token (constant-time compare). Khong khop -> ForbiddenException.
 */
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  /** Ten cookie + header — cong khai de frontend biet doc/gui */
  private static readonly COOKIE_NAME = 'csrf-token';
  private static readonly HEADER_NAME = 'x-csrf-token';
  private static readonly SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

  use(req: Request, res: Response, next: NextFunction) {
    const isProd = process.env.NODE_ENV === 'production';
    const method = req.method.toUpperCase();
    const cookieToken = (req as any).cookies?.[CsrfMiddleware.COOKIE_NAME] as string | undefined;

    // Safe methods: ensure a token exists in the cookie so the client can echo it back
    if (CsrfMiddleware.SAFE_METHODS.has(method)) {
      let token = cookieToken;
      if (!token) {
        token = crypto.randomBytes(32).toString('hex');
        res.cookie(CsrfMiddleware.COOKIE_NAME, token, {
          httpOnly: false, // JS phai doc duoc de gui kem header
          sameSite: 'strict',
          secure: isProd,
          path: '/',
          // Khong set maxAge -> session cookie, xoa khi dong trinh duyet
        });
      }

      // Endpoint chuyen dung de frontend chu dong lay token truoc khi submit form.
      // Path match cho ca /csrf-token va /api/csrf-token (tuy NestJS mount prefix).
      const url = req.originalUrl || req.url || '';
      if (url === '/api/csrf-token' || url.startsWith('/api/csrf-token?') || url === '/csrf-token') {
        res.status(200).json({ success: true, data: { csrfToken: token } });
        return;
      }

      return next();
    }

    // Unsafe methods: require matching header + cookie
    const headerToken = req.headers[CsrfMiddleware.HEADER_NAME] as string | undefined;

    if (!cookieToken || !headerToken) {
      throw new ForbiddenException('CSRF token missing');
    }

    // Constant-time compare to avoid timing attacks
    if (!CsrfMiddleware.safeEqual(cookieToken, headerToken)) {
      throw new ForbiddenException('CSRF token mismatch');
    }

    return next();
  }

  /** Constant-time string comparison — tranh timing attack. */
  private static safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    try {
      return crypto.timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
    } catch {
      return false;
    }
  }
}
