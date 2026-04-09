import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock dompurify — simulate sanitization behavior
vi.mock('dompurify', () => ({
  default: {
    sanitize: (html: string, options: any) => {
      // Simulate stripping script tags (XSS prevention)
      let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      // Simulate stripping event handlers
      clean = clean.replace(/\s*on\w+="[^"]*"/gi, '');
      return clean;
    },
  },
}));

import SafeHtml from '../public/SafeHtml';

describe('SafeHtml', () => {
  it('should render safe HTML content', () => {
    render(<SafeHtml html="<p>Hello World</p>" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should strip script tags (XSS prevention)', () => {
    const { container } = render(
      <SafeHtml html='<p>Safe</p><script>alert("xss")</script>' />
    );
    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });

  it('should strip inline event handlers', () => {
    const { container } = render(
      <SafeHtml html='<p onclick="alert(1)">Click me</p>' />
    );
    const p = container.querySelector('p');
    expect(p?.getAttribute('onclick')).toBeNull();
  });

  it('should apply className to wrapper div', () => {
    const { container } = render(
      <SafeHtml html="<p>Content</p>" className="prose my-4" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toBe('prose my-4');
  });

  it('should render complex HTML structures', () => {
    const { container } = render(
      <SafeHtml html="<h2>Title</h2><ul><li>Item 1</li><li>Item 2</li></ul>" />
    );
    expect(container.querySelector('h2')).toBeTruthy();
    expect(container.querySelectorAll('li').length).toBe(2);
  });

  it('should handle empty HTML', () => {
    const { container } = render(<SafeHtml html="" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.innerHTML).toBe('');
  });
});
