/**
 * Shared helpers for seed scripts.
 * Dung fetch (Node 18+ built-in), khong can axios.
 */

const API = process.env.API_URL || 'http://localhost:4200/api';
let token = '';

export function setToken(t: string) {
  token = t;
}

export function getToken() {
  return token;
}

/** POST request voi auth token */
export async function apiPost(path: string, data: any) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) console.error(`  FAIL ${path}:`, json.message || res.status);
  return json;
}

/** GET request voi auth token */
export async function apiGet(path: string) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

/** Login va luu token */
export async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@lequydon.edu.vn',
      password: 'Admin@123456',
    }),
  });
  const json = await res.json();
  const accessToken = json.access_token || json.data?.accessToken;
  if (accessToken) {
    token = accessToken;
    console.log('Login OK');
  } else {
    throw new Error('Login failed: ' + JSON.stringify(json));
  }
  return token;
}
