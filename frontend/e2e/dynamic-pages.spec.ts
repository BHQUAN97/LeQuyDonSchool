import { test, expect } from '@playwright/test';

test.describe('Dynamic Pages — [...slug] catch-all', () => {
  test('trang dong khong ton tai → 404', async ({ page }) => {
    const response = await page.goto('/trang-khong-co-abc-xyz', {
      waitUntil: 'networkidle',
    });
    const status = response?.status() ?? 0;
    const notFoundUI = page.locator('text=/không tìm thấy|not found|404/i');
    const hasNotFound = await notFoundUI.count();
    expect(status === 404 || hasNotFound > 0).toBeTruthy();
  });

  test('slug nhieu cap khong ton tai → 404', async ({ page }) => {
    const response = await page.goto('/trang/khong/ton/tai/abc', {
      waitUntil: 'networkidle',
    });
    const status = response?.status() ?? 0;
    const notFoundUI = page.locator('text=/không tìm thấy|not found|404/i');
    const hasNotFound = await notFoundUI.count();
    expect(status === 404 || hasNotFound > 0).toBeTruthy();
  });

  test('slug voi ky tu dac biet khong crash', async ({ page }) => {
    const response = await page.goto('/abc%20def%3Cscript%3E', {
      waitUntil: 'networkidle',
    });
    // Khong bi 500
    expect(response?.status()).toBeLessThan(500);
  });

  test('slug co dau tieng Viet khong crash', async ({ page }) => {
    const response = await page.goto('/giới-thiệu-trường', {
      waitUntil: 'networkidle',
    });
    expect(response?.status()).toBeLessThan(500);
  });
});

test.describe('Page Performance — Basic', () => {
  test('trang chu load trong 10 giay', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
  });

  test('trang lien he load trong 10 giay', async ({ page }) => {
    const start = Date.now();
    await page.goto('/lien-he', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
  });

  test('trang tim kiem load trong 10 giay', async ({ page }) => {
    const start = Date.now();
    await page.goto('/tim-kiem', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
  });

  test('trang admin login load trong 10 giay', async ({ page }) => {
    const start = Date.now();
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
  });
});

test.describe('Security — Basic XSS Checks', () => {
  test('search input khong render HTML', async ({ page }) => {
    await page.goto('/tim-kiem?q=<img src=x onerror=alert(1)>');
    await page.waitForTimeout(2000);
    // Kiem tra khong co alert dialog
    // Kiem tra khong co img tag bi render
    const xssImg = page.locator('img[src="x"]');
    expect(await xssImg.count()).toBe(0);
  });

  test('contact form khong render HTML trong error', async ({ page }) => {
    await page.goto('/lien-he');
    await page.fill('#contact-name', '<img src=x onerror=alert(1)>');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '0987654321');
    await page.fill('#contact-message', '<script>alert(1)</script> noi dung test day du.');
    await page.click('button[type="submit"], button:has-text("Gửi")');
    await page.waitForTimeout(2000);
    // Kiem tra khong co img tag bi render voi onerror
    const xssImg = page.locator('main img[onerror]');
    expect(await xssImg.count()).toBe(0);
    // Input value phai escape HTML (khong render HTML tag)
    const nameValue = await page.locator('#contact-name').inputValue();
    expect(nameValue).toContain('<img');  // Giu nguyen text, khong render
  });

  test('URL injection khong anh huong trang', async ({ page }) => {
    await page.goto('/tim-kiem?q="><script>alert(1)</script>');
    await page.waitForTimeout(2000);
    // Trang van hoat dong
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });
});
