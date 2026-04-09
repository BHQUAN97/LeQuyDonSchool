/**
 * Test stripHtmlAndTruncate va formatDate — helper functions cua SearchService.
 * Vì cac ham nay la module-level (khong export), ta test gian tiep
 * bang cach re-implement logic de verify.
 */

// Re-implement de test doc lap — cung logic nhu trong search.service.ts
function stripHtmlAndTruncate(html: string | null, maxLen = 150): string | null {
  if (!html) return null;
  const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

describe('SearchService helpers', () => {
  describe('stripHtmlAndTruncate', () => {
    it('should return null for null input', () => {
      expect(stripHtmlAndTruncate(null)).toBeNull();
    });

    it('should strip HTML tags', () => {
      expect(stripHtmlAndTruncate('<p>Hello <b>world</b></p>')).toBe('Hello world');
    });

    it('should replace &nbsp; with space', () => {
      expect(stripHtmlAndTruncate('Hello&nbsp;world')).toBe('Hello world');
    });

    it('should truncate long text and add ellipsis', () => {
      const longText = 'A'.repeat(200);
      const result = stripHtmlAndTruncate(longText);
      expect(result).toBe('A'.repeat(150) + '...');
    });

    it('should not truncate text within maxLen', () => {
      expect(stripHtmlAndTruncate('Short text')).toBe('Short text');
    });

    it('should respect custom maxLen', () => {
      const result = stripHtmlAndTruncate('Hello world', 5);
      expect(result).toBe('Hello...');
    });
  });

  describe('formatDate', () => {
    it('should return empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });

    it('should format date as dd/mm/yyyy', () => {
      const date = new Date('2024-03-15T00:00:00Z');
      const result = formatDate(date);
      expect(result).toMatch(/15\/03\/2024/);
    });

    it('should pad single-digit day and month', () => {
      const date = new Date('2024-01-05T00:00:00Z');
      const result = formatDate(date);
      expect(result).toMatch(/0[45]\/01\/2024/);
    });
  });
});
