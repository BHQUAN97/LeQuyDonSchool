import { test, expect } from '@playwright/test';

test.describe('Cross-Page Navigation — User Flows', () => {
  test('flow: trang chu → tin tuc hoc tap', async ({ page }) => {
    await page.goto('/');
    // Tim link den trang tin tuc hoac hoc tap
    const newsLink = page.locator('a[href*="/tin-tuc"], a[href*="/hoc-tap"]').first();
    if (await newsLink.isVisible()) {
      await newsLink.click();
      await page.waitForLoadState('networkidle');
      // Phai chuyen trang thanh cong
      expect(page.url()).toMatch(/tin-tuc|hoc-tap/);
      await expect(page.locator('h1, h2').first()).toBeVisible();
    }
  });

  test('flow: trang tin tuc → navigate den su kien', async ({ page }) => {
    // Truy cap truc tiep su kien page
    await page.goto('/tin-tuc/su-kien');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('su-kien');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Tu su kien, truy cap ngoai khoa
    await page.goto('/tin-tuc/ngoai-khoa');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('ngoai-khoa');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('flow: trang tuyen sinh → chuyen giua thong tin va FAQ', async ({ page }) => {
    await page.goto('/tuyen-sinh/thong-tin');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Tim link den FAQ
    const faqLink = page.locator('a[href*="cau-hoi-thuong-gap"]').first();
    if (await faqLink.isVisible()) {
      await faqLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('cau-hoi-thuong-gap');
      await expect(page.locator('h1, h2').first()).toBeVisible();
    }
  });

  test('flow: search page va quay lai', async ({ page }) => {
    // Search page load
    await page.goto('/tim-kiem');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    // Nhap tu khoa
    await page.fill('input[type="text"]', 'tuyen sinh');
    await page.press('input[type="text"]', 'Enter');
    await page.waitForTimeout(2000);
    // URL phai cap nhat
    expect(page.url()).toContain('q=');
    // Navigate sang trang khac
    await page.goto('/lien-he');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('lien-he');
  });

  test('flow: lien he → click email link', async ({ page }) => {
    await page.goto('/lien-he');
    // Kiem tra co mailto link
    const mailtoLink = page.locator('a[href^="mailto:"]');
    if (await mailtoLink.count() > 0) {
      const href = await mailtoLink.first().getAttribute('href');
      expect(href).toContain('@');
    }
  });

  test('flow: lien he → click so dien thoai', async ({ page }) => {
    await page.goto('/lien-he');
    // Kiem tra co tel link
    const telLink = page.locator('a[href^="tel:"]');
    if (await telLink.count() > 0) {
      const href = await telLink.first().getAttribute('href');
      expect(href).toMatch(/tel:\+?\d/);
    }
  });

  test('breadcrumb navigation hoat dong', async ({ page }) => {
    await page.goto('/tuyen-sinh/cau-hoi-thuong-gap');
    // Kiem tra co breadcrumb voi link Trang chu
    const homeLink = page.locator('nav[aria-label="Breadcrumb"] a[href="/"], nav a[href="/"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/$/, { timeout: 10_000 });
    }
  });
});

test.describe('Cross-Page Navigation — Error Handling', () => {
  test('404 page co link ve trang chu', async ({ page }) => {
    await page.goto('/trang-khong-ton-tai-xyz-abc');
    await page.waitForLoadState('networkidle');
    // Tim link quay ve trang chu
    const homeLink = page.locator('a[href="/"]');
    const count = await homeLink.count();
    // Co the co link trong header hoac trong 404 content
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('trang con khong bi loi 500', async ({ page }) => {
    const pages = [
      '/tin-tuc/hoc-tap',
      '/tin-tuc/su-kien',
      '/tin-tuc/ngoai-khoa',
      '/tuyen-sinh/thong-tin',
      '/tuyen-sinh/cau-hoi-thuong-gap',
      '/tuyen-sinh/clb-ngoi-nha-mo-uoc',
      '/lien-he',
      '/tim-kiem',
      '/dich-vu-hoc-duong/thuc-don',
    ];
    for (const url of pages) {
      const response = await page.goto(url);
      expect(response?.status(), `${url} should not return 500`).toBeLessThan(500);
    }
  });

  test('admin redirect khong bi loop', async ({ page }) => {
    // Truy cap admin → redirect login → khong redirect lai admin
    await page.goto('/admin');
    await page.waitForURL(/\/admin\/login/, { timeout: 5000 });
    // O trang login, khong bi redirect tiep
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/login');
  });
});
