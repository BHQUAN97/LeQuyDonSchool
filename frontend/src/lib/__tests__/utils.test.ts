import { cn } from '../utils';

describe('cn (className merge utility)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base', isActive && 'active');
    expect(result).toBe('base active');
  });

  it('should remove falsy values', () => {
    const result = cn('base', false, null, undefined, 'end');
    expect(result).toBe('base end');
  });

  it('should merge conflicting tailwind classes (last wins)', () => {
    // tailwind-merge should resolve conflicts
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });
});
