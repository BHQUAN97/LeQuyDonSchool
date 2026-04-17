/**
 * SSR API base URL helper.
 * Throws trong production neu `INTERNAL_API_URL` thieu — chan silent fallback sang localhost.
 */
export function getInternalApiBase(): string {
  const url = process.env.INTERNAL_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'INTERNAL_API_URL env var la bat buoc trong production. ' +
      'Dat trong frontend/.env hoac docker-compose.yml.',
    );
  }
  // Dev fallback — cu the, khong doan
  return 'http://localhost:4000/api';
}
