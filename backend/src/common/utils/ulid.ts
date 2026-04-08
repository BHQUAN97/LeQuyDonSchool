import { ulid } from 'ulid';

/** Generate a ULID — sortable, URL-safe, 26 chars */
export function generateUlid(): string {
  return ulid();
}
