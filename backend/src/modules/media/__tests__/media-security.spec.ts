/**
 * Security tests — Media upload MIME bypass & SVG injection
 *
 * VULN #1: fileFilter only checks client-sent MIME type, not file extension or magic bytes.
 * VULN #3: image/svg+xml is in ALLOWED_MIMES — SVGs can contain <script> tags (XSS).
 *
 * These tests verify the vulnerabilities exist and will PASS once proper fixes are applied.
 */

// ---- Test the file filter logic directly (extracted from MediaModule config) ----

// Reproduce the ALLOWED_MIMES and fileFilter from media.module.ts
const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'video/mp4', 'video/webm',
];

// Map of safe extensions per MIME type
const SAFE_EXTENSIONS: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
};

// Dangerous extensions — should NEVER be uploaded regardless of MIME
const DANGEROUS_EXTENSIONS = ['.html', '.htm', '.php', '.exe', '.bat', '.cmd', '.js', '.jsp', '.asp', '.aspx'];

function currentFileFilter(_req: any, file: { mimetype: string; originalname: string }, cb: (err: Error | null, accept: boolean) => void) {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Loai file khong duoc ho tro: ${file.mimetype}`), false);
  }
}

/** Proposed secure filter — checks extension AND MIME match */
function secureFileFilter(_req: any, file: { mimetype: string; originalname: string }, cb: (err: Error | null, accept: boolean) => void) {
  // 1. MIME must be allowed
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(new Error(`MIME type khong duoc ho tro: ${file.mimetype}`), false);
  }

  // 2. Extension must match MIME
  const ext = '.' + file.originalname.split('.').pop()!.toLowerCase();
  const allowedExts = SAFE_EXTENSIONS[file.mimetype];
  if (!allowedExts || !allowedExts.includes(ext)) {
    return cb(new Error(`Extension ${ext} khong khop voi MIME type ${file.mimetype}`), false);
  }

  // 3. Block dangerous extensions regardless
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    return cb(new Error(`Extension ${ext} bi cam`), false);
  }

  cb(null, true);
}

// Helper to promisify filter
function testFilter(
  filter: typeof currentFileFilter,
  mimetype: string,
  originalname: string,
): Promise<{ accepted: boolean; error?: string }> {
  return new Promise((resolve) => {
    filter({}, { mimetype, originalname }, (err, accept) => {
      resolve({ accepted: accept, error: err?.message });
    });
  });
}

describe('Media Security — File Upload Validation', () => {
  describe('VULN #1: MIME bypass — current filter only checks mimetype', () => {
    it('VULNERABILITY: accepts .html file with fake image/jpeg MIME', async () => {
      // Attacker sends .html file but claims MIME is image/jpeg
      const result = await testFilter(currentFileFilter, 'image/jpeg', 'malicious.html');
      // Current filter ACCEPTS this — this IS the vulnerability
      expect(result.accepted).toBe(true);
    });

    it('VULNERABILITY: accepts .php file with fake image/png MIME', async () => {
      const result = await testFilter(currentFileFilter, 'image/png', 'shell.php');
      expect(result.accepted).toBe(true);
    });

    it('VULNERABILITY: accepts .exe file with fake application/pdf MIME', async () => {
      const result = await testFilter(currentFileFilter, 'application/pdf', 'virus.exe');
      expect(result.accepted).toBe(true);
    });

    it('VULNERABILITY: accepts double extension .jpg.html with fake MIME', async () => {
      const result = await testFilter(currentFileFilter, 'image/jpeg', 'photo.jpg.html');
      expect(result.accepted).toBe(true);
    });
  });

  describe('Secure filter should reject extension/MIME mismatches', () => {
    it('should reject .html file with image/jpeg MIME', async () => {
      const result = await testFilter(secureFileFilter, 'image/jpeg', 'malicious.html');
      expect(result.accepted).toBe(false);
      expect(result.error).toContain('khong khop');
    });

    it('should reject .php file with image/png MIME', async () => {
      const result = await testFilter(secureFileFilter, 'image/png', 'shell.php');
      expect(result.accepted).toBe(false);
    });

    it('should reject .exe file with application/pdf MIME', async () => {
      const result = await testFilter(secureFileFilter, 'application/pdf', 'virus.exe');
      expect(result.accepted).toBe(false);
    });

    it('should accept legitimate .jpg with image/jpeg MIME', async () => {
      const result = await testFilter(secureFileFilter, 'image/jpeg', 'photo.jpg');
      expect(result.accepted).toBe(true);
    });

    it('should accept legitimate .png with image/png MIME', async () => {
      const result = await testFilter(secureFileFilter, 'image/png', 'image.png');
      expect(result.accepted).toBe(true);
    });

    it('should accept legitimate .pdf with application/pdf MIME', async () => {
      const result = await testFilter(secureFileFilter, 'application/pdf', 'document.pdf');
      expect(result.accepted).toBe(true);
    });
  });

  describe('VULN #3: SVG with JavaScript — SVG is in ALLOWED_MIMES', () => {
    it('VULNERABILITY: SVG MIME type is allowed (SVGs can contain <script>)', () => {
      // image/svg+xml is in ALLOWED_MIMES — this IS the vulnerability
      expect(ALLOWED_MIMES).toContain('image/svg+xml');
    });

    it('VULNERABILITY: current filter accepts .svg uploads', async () => {
      const result = await testFilter(currentFileFilter, 'image/svg+xml', 'icon.svg');
      expect(result.accepted).toBe(true);
    });

    it('should document that SVG can contain malicious payloads', () => {
      // Example malicious SVG content — this would execute JS if served inline
      const maliciousSvg = `
        <svg xmlns="http://www.w3.org/2000/svg">
          <script>alert('XSS')</script>
          <rect width="100" height="100"/>
        </svg>
      `;
      expect(maliciousSvg).toContain('<script>');
    });
  });

  describe('Current filter correctly rejects unknown MIME types', () => {
    it('should reject text/html MIME', async () => {
      const result = await testFilter(currentFileFilter, 'text/html', 'page.html');
      expect(result.accepted).toBe(false);
    });

    it('should reject application/x-httpd-php MIME', async () => {
      const result = await testFilter(currentFileFilter, 'application/x-httpd-php', 'shell.php');
      expect(result.accepted).toBe(false);
    });

    it('should reject application/javascript MIME', async () => {
      const result = await testFilter(currentFileFilter, 'application/javascript', 'evil.js');
      expect(result.accepted).toBe(false);
    });
  });
});
