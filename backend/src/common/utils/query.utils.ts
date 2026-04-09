/**
 * Escape LIKE wildcards to prevent SQL injection via % and _ characters.
 */
export function escapeLike(str: string): string {
  return str.replace(/%/g, '\\%').replace(/_/g, '\\_');
}
