'use client';

import DOMPurify from 'dompurify';

/**
 * ALLOWED_TAGS va ALLOWED_ATTR — chong XSS khi render noi dung
 * tu rich text editor (Tiptap) hoac API.
 */
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

interface SafeHtmlProps {
  html: string;
  className?: string;
}

/**
 * Render HTML content an toan — sanitize bang DOMPurify truoc khi inject vao DOM.
 * Dung cho noi dung bai viet, trang tinh, FAQ answer, etc.
 */
export default function SafeHtml({ html, className }: SafeHtmlProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
