const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

/**
 * Fetch wrapper voi auto-refresh token.
 * Khi nhan 401 → thu refresh 1 lan → retry request goc.
 */
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include', // gui cookie refreshToken
  });

  // Auto-refresh khi 401
  if (res.status === 401 && accessToken) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      const retryRes = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: 'include',
      });
      if (!retryRes.ok) {
        const err = await retryRes.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(err.message || `HTTP ${retryRes.status}`);
      }
      return retryRes.json();
    }
    // Refresh that bai → redirect login
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    throw new Error('Phiên đăng nhập hết hạn');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

/** Promise dedup — tranh race condition khi nhieu request 401 cung luc */
let refreshPromise: Promise<boolean> | null = null;

/** Thu refresh token (co dedup) */
async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
  return refreshPromise;
}

/** Thuc hien refresh token */
async function doRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      accessToken = data.data.accessToken;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
