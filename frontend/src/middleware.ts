import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware bao ve route /admin — kiem tra cookie refreshToken ton tai.
 * Day la lop bao ve server-side bo sung cho client-side AuthContext guard.
 * Neu khong co cookie → redirect ve /admin/login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cho phep truy cap trang login ma khong can auth
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Kiem tra cookie refreshToken — backend set httpOnly cookie nay khi login
  const refreshToken = request.cookies.get('refreshToken');
  if (!refreshToken?.value) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Chi ap dung cho cac route /admin (tru static assets)
  matcher: ['/admin/:path*'],
};
