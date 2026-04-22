/**
 * CSRF helper — doc token tu cookie `csrf-token`. Neu chua co, fetch endpoint
 * `/api/csrf-token` de backend sinh cookie moi, sau do doc lai va tra ve.
 *
 * Double-submit cookie pattern yeu cau client gui lai token trong header
 * `x-csrf-token` khi POST/PUT/PATCH/DELETE toi public form endpoints.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const COOKIE_NAME = 'csrf-token';

/** Doc cookie theo ten tu document.cookie. SSR -> tra ve null. */
function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  const parts = document.cookie ? document.cookie.split(';') : [];
  for (const raw of parts) {
    const c = raw.trim();
    if (c.startsWith(prefix)) {
      return decodeURIComponent(c.substring(prefix.length));
    }
  }
  return null;
}

/**
 * Lay CSRF token de kem vao header `x-csrf-token`.
 *  1. Doc cookie `csrf-token` neu da co.
 *  2. Neu chua -> fetch GET /api/csrf-token (credentials: include) de backend set cookie.
 *  3. Doc lai cookie sau fetch. Neu van khong co, fallback dung token tu response body.
 */
export async function getCsrfToken(): Promise<string> {
  const existing = readCookie(COOKIE_NAME);
  if (existing) return existing;

  const res = await fetch(`${API_BASE}/csrf-token`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Khong lay duoc CSRF token');
  }

  // Sau fetch, cookie da duoc set (Set-Cookie header).
  const refreshed = readCookie(COOKIE_NAME);
  if (refreshed) return refreshed;

  // Fallback: doc tu response body neu vi ly do nao do trinh duyet chua cap nhat cookie.
  const body = (await res.json().catch(() => null)) as { data?: { csrfToken?: string } } | null;
  const token = body?.data?.csrfToken;
  if (!token) {
    throw new Error('CSRF token khong hop le');
  }
  return token;
}
