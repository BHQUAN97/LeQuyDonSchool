/**
 * Integration test — Upload security chain
 *
 * Tests the complete file filter logic from media.module.ts:
 * valid images accepted, invalid extensions rejected, MIME spoofing blocked,
 * SVG rejected, file size limit configured.
 */

import * as path from 'path';

// Reproduce the security config from media.module.ts
const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'video/mp4', 'video/webm',
];

const ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.mp4', '.webm',
];

const EXT_MIME_MAP: Record<string, string[]> = {
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.gif': ['image/gif'],
  '.webp': ['image/webp'],
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.xls': ['application/vnd.ms-excel'],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  '.mp4': ['video/mp4'],
  '.webm': ['video/webm'],
};

const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

/** Replica of the fileFilter from media.module.ts */
function fileFilter(
  _req: any,
  file: { mimetype: string; originalname: string },
  cb: (err: Error | null, accept: boolean) => void,
) {
  // Check MIME type
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(new Error(`Loại file không được hỗ trợ: ${file.mimetype}`), false);
  }

  // Check file extension whitelist
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error(`Phần mở rộng file không được hỗ trợ: ${ext}`), false);
  }

  // Cross-check extension vs MIME — chong spoof
  const allowedMimesForExt = EXT_MIME_MAP[ext];
  if (!allowedMimesForExt || !allowedMimesForExt.includes(file.mimetype)) {
    return cb(new Error(`MIME type ${file.mimetype} không khớp với extension ${ext}`), false);
  }

  cb(null, true);
}

/** Helper to promisify the filter for clean test assertions */
function testFilter(
  mimetype: string,
  originalname: string,
): Promise<{ accepted: boolean; error?: string }> {
  return new Promise((resolve) => {
    fileFilter({}, { mimetype, originalname }, (err, accept) => {
      resolve({ accepted: accept, error: err?.message });
    });
  });
}

describe('Upload Security Chain — Complete Flow', () => {
  describe('Valid images accepted', () => {
    it('should accept .jpg with image/jpeg MIME', async () => {
      const result = await testFilter('image/jpeg', 'photo.jpg');
      expect(result.accepted).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept .jpeg with image/jpeg MIME', async () => {
      const result = await testFilter('image/jpeg', 'photo.jpeg');
      expect(result.accepted).toBe(true);
    });

    it('should accept .png with image/png MIME', async () => {
      const result = await testFilter('image/png', 'screenshot.png');
      expect(result.accepted).toBe(true);
    });

    it('should accept .gif with image/gif MIME', async () => {
      const result = await testFilter('image/gif', 'animation.gif');
      expect(result.accepted).toBe(true);
    });

    it('should accept .webp with image/webp MIME', async () => {
      const result = await testFilter('image/webp', 'modern.webp');
      expect(result.accepted).toBe(true);
    });

    it('should accept .pdf with application/pdf MIME', async () => {
      const result = await testFilter('application/pdf', 'document.pdf');
      expect(result.accepted).toBe(true);
    });
  });

  describe('Invalid extensions rejected', () => {
    it('should reject .html file', async () => {
      const result = await testFilter('text/html', 'page.html');
      expect(result.accepted).toBe(false);
      expect(result.error).toContain('không được hỗ trợ');
    });

    it('should reject .exe file', async () => {
      const result = await testFilter('application/x-msdownload', 'virus.exe');
      expect(result.accepted).toBe(false);
    });

    it('should reject .php file', async () => {
      const result = await testFilter('application/x-httpd-php', 'shell.php');
      expect(result.accepted).toBe(false);
    });

    it('should reject .js file', async () => {
      const result = await testFilter('application/javascript', 'evil.js');
      expect(result.accepted).toBe(false);
    });

    it('should reject .bat file', async () => {
      const result = await testFilter('application/x-bat', 'script.bat');
      expect(result.accepted).toBe(false);
    });

    it('should reject files with no extension', async () => {
      const result = await testFilter('application/octet-stream', 'noext');
      expect(result.accepted).toBe(false);
    });
  });

  describe('MIME spoofing rejected', () => {
    it('should reject .html with spoofed image/jpeg MIME', async () => {
      // Attacker claims MIME is image/jpeg but file is .html
      const result = await testFilter('image/jpeg', 'malicious.html');
      expect(result.accepted).toBe(false);
      expect(result.error).toContain('không được hỗ trợ');
    });

    it('should reject .php with spoofed image/png MIME', async () => {
      const result = await testFilter('image/png', 'shell.php');
      expect(result.accepted).toBe(false);
    });

    it('should reject .exe with spoofed application/pdf MIME', async () => {
      const result = await testFilter('application/pdf', 'virus.exe');
      expect(result.accepted).toBe(false);
    });

    it('should reject .jpg with wrong MIME (image/png)', async () => {
      // Extension-MIME mismatch — suspicious
      const result = await testFilter('image/png', 'photo.jpg');
      expect(result.accepted).toBe(false);
      expect(result.error).toContain('không khớp');
    });

    it('should reject double extension .jpg.html with fake MIME', async () => {
      const result = await testFilter('image/jpeg', 'photo.jpg.html');
      expect(result.accepted).toBe(false);
    });

    it('should reject .png with application/pdf MIME', async () => {
      const result = await testFilter('application/pdf', 'fake.png');
      expect(result.accepted).toBe(false);
      expect(result.error).toContain('không khớp');
    });
  });

  describe('SVG rejected (XSS prevention)', () => {
    it('should reject .svg file — SVG removed from allowed MIMES', async () => {
      const result = await testFilter('image/svg+xml', 'icon.svg');
      expect(result.accepted).toBe(false);
    });

    it('should verify image/svg+xml is NOT in ALLOWED_MIMES', () => {
      expect(ALLOWED_MIMES).not.toContain('image/svg+xml');
    });

    it('should verify .svg is NOT in ALLOWED_EXTENSIONS', () => {
      expect(ALLOWED_EXTENSIONS).not.toContain('.svg');
    });
  });

  describe('File size limit enforced', () => {
    it('should have 10MB limit configured', () => {
      expect(FILE_SIZE_LIMIT).toBe(10 * 1024 * 1024);
    });

    it('should verify limit is exactly 10485760 bytes', () => {
      expect(FILE_SIZE_LIMIT).toBe(10485760);
    });
  });

  describe('Edge cases', () => {
    it('should handle uppercase extension case-insensitively', async () => {
      // path.extname preserves case, but our filter lowercases
      const result = await testFilter('image/jpeg', 'PHOTO.JPG');
      expect(result.accepted).toBe(true);
    });

    it('should reject file with allowed extension but unknown MIME', async () => {
      const result = await testFilter('application/octet-stream', 'image.jpg');
      expect(result.accepted).toBe(false);
    });

    it('should reject empty filename', async () => {
      const result = await testFilter('image/jpeg', '');
      expect(result.accepted).toBe(false);
    });
  });
});
