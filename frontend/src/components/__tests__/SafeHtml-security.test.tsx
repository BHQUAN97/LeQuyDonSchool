import DOMPurify from 'dompurify';

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

function isAllowedDocumentIframeSrc(src: string): boolean {
  return src.startsWith('/uploads/') && src.split('?')[0].toLowerCase().endsWith('.pdf');
}

let iframeHookInstalled = false;

function installIframeSanitizerHook() {
  if (iframeHookInstalled) return;

  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName !== 'iframe') return;

    const src = node.nodeType === 1 ? (node as Element).getAttribute('src') : null;
    if (!src || (!isAllowedDocumentIframeSrc(src) && !ALLOWED_IFRAME_SRC.some((pattern) => pattern.test(src)))) {
      node.parentNode?.removeChild(node);
    }
  });

  iframeHookInstalled = true;
}

function sanitize(html: string): string {
  installIframeSanitizerHook();

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

describe('SafeHtml Security', () => {
  it('strips style attributes to prevent CSS injection', () => {
    const html = '<div style="background: url(https://attacker.com/track?user=1)">Content</div>';
    const result = sanitize(html);

    expect(result).not.toContain('style=');
    expect(result).toContain('Content');
  });

  it('strips script tags', () => {
    const html = '<p>Hello</p><script>alert("XSS")</script>';
    const result = sanitize(html);

    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
    expect(result).toContain('<p>Hello</p>');
  });

  it('strips event handlers', () => {
    const html = '<img src="x" onerror="alert(1)"><a href="#" onmouseover="alert(2)">Hover</a>';
    const result = sanitize(html);

    expect(result).not.toContain('onerror');
    expect(result).not.toContain('onmouseover');
    expect(result).toContain('Hover');
  });

  it('strips unsafe iframes', () => {
    const html = '<iframe src="https://evil.com"></iframe>';
    const result = sanitize(html);

    expect(result).not.toContain('<iframe');
  });

  it('allows Google Forms iframe embeds', () => {
    const html = '<iframe src="https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true" title="Form"></iframe>';
    const result = sanitize(html);

    expect(result).toContain('<iframe');
    expect(result).toContain('https://docs.google.com/forms/');
  });

  it('allows local uploaded PDF iframe embeds', () => {
    const html = '<iframe src="/uploads/thu-ngo.pdf" title="Thư ngỏ"></iframe>';
    const result = sanitize(html);

    expect(result).toContain('<iframe');
    expect(result).toContain('/uploads/thu-ngo.pdf');
  });

  it('strips object, embed, and form tags', () => {
    const html = '<object data="malware.swf"></object><embed src="malware.swf"><form><input name="password"></form>';
    const result = sanitize(html);

    expect(result).not.toContain('<object');
    expect(result).not.toContain('<embed');
    expect(result).not.toContain('<form');
    expect(result).not.toContain('<input');
  });

  it('allows normal rich article HTML', () => {
    const html = '<h2>Title</h2><p>Hello <strong>world</strong></p><ul><li>Item</li></ul><table><tbody><tr><td>Cell</td></tr></tbody></table>';
    const result = sanitize(html);

    expect(result).toContain('<h2>');
    expect(result).toContain('<strong>');
    expect(result).toContain('<li>');
    expect(result).toContain('<table>');
  });

  it('strips javascript URI schemes', () => {
    const html = '<a href="javascript:alert(1)">Click</a><img src="javascript:alert(2)">';
    const result = sanitize(html);

    expect(result).not.toContain('javascript:');
    expect(result).toContain('Click');
  });
});
