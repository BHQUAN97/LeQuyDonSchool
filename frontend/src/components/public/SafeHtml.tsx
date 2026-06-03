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
  'a', 'img', 'iframe',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'figure', 'figcaption',
  'div', 'span', 'hr',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
  'allow', 'allowfullscreen', 'frameborder', 'loading', 'marginheight',
  'marginwidth', 'name', 'referrerpolicy', 'sandbox',
  'class', 'id', 'colspan', 'rowspan',
];

const ALLOWED_IFRAME_SRC = [
  /^https:\/\/docs\.google\.com\/forms\//i,
  /^https:\/\/www\.google\.com\/maps\/embed/i,
];

const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

function isPdfPath(pathname: string): boolean {
  return pathname.toLowerCase().endsWith('.pdf');
}

function isAllowedDocumentIframeSrc(src: string): boolean {
  if (src.startsWith('/uploads/') && isPdfPath(src.split('?')[0])) {
    return true;
  }

  try {
    const url = new URL(src);
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const configuredOrigin = PUBLIC_SITE_URL ? new URL(PUBLIC_SITE_URL).origin : '';
    const isKnownOrigin = url.origin === currentOrigin || (!!configuredOrigin && url.origin === configuredOrigin);

    return isKnownOrigin && url.pathname.startsWith('/uploads/') && isPdfPath(url.pathname);
  } catch {
    return false;
  }
}

function isAllowedIframeSrc(src: string | null): boolean {
  if (!src) return false;
  if (isAllowedDocumentIframeSrc(src)) return true;

  try {
    const url = new URL(src);
    return ALLOWED_IFRAME_SRC.some((pattern) => pattern.test(url.href));
  } catch {
    return false;
  }
}

let iframeHookInstalled = false;

function installIframeSanitizerHook() {
  if (iframeHookInstalled) return;

  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName !== 'iframe') return;

    const src = node.nodeType === 1
      ? (node as Element).getAttribute('src')
      : null;

    if (!isAllowedIframeSrc(src)) {
      node.parentNode?.removeChild(node);
    }
  });

  iframeHookInstalled = true;
}

interface SafeHtmlProps {
  html: string;
  className?: string;
}

/**
 * Render HTML content an toan — sanitize bang DOMPurify truoc khi inject vao DOM.
 * Dung cho noi dung bai viet, trang tinh, FAQ answer, etc.
 */
export default function SafeHtml({ html, className }: SafeHtmlProps) {
  installIframeSanitizerHook();

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
