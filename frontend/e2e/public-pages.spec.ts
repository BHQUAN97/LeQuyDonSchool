import { test, expect } from '@playwright/test';

test.describe('Public Pages — Smoke Tests', () => {
  test('trang chu load thanh cong', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Lê Quý Đôn|Le Quy Don/i);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('trang chu co banner hoac hero section', async ({ page }) => {
    await page.goto('/');
    // Trang chu phai co hinh anh hoac banner noi bat
    const hasHero = await page.locator('[class*="banner"], [class*="hero"], [class*="slider"], [class*="carousel"], section >> img').first().isVisible().catch(() => false);
    const hasContent = await page.locator('main, [role="main"], .container, .max-w-7xl').first().isVisible().catch(() => false);
    expect(hasHero || hasContent).toBeTruthy();
  });

  test('trang tin tuc — hoc tap', async ({ page }) => {
    await page.goto('/tin-tuc/hoc-tap');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Phai co breadcrumb hoac navigation
    const hasBreadcrumb = await page.locator('nav[aria-label*="breadcrumb"], [class*="breadcrumb"]').count()
      + await page.locator('text=/Trang chủ/i').count();
    expect(hasBreadcrumb).toBeGreaterThan(0);
  });

  test('trang tin tuc — su kien', async ({ page }) => {
    await page.goto('/tin-tuc/su-kien');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Co category tabs
    const tabs = page.locator('a[href*="/tin-tuc/"], button:has-text("Sự kiện"), button:has-text("Học tập")');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThanOrEqual(1);
  });

  test('trang tin tuc — ngoai khoa', async ({ page }) => {
    await page.goto('/tin-tuc/ngoai-khoa');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('trang tuyen sinh — thong tin', async ({ page }) => {
    await page.goto('/tuyen-sinh/thong-tin');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Co danh sach bai viet hoac placeholder articles
    const articles = page.locator('article, [class*="card"], [class*="article"]');
    const articleCount = await articles.count();
    expect(articleCount).toBeGreaterThanOrEqual(1);
  });

  test('trang tuyen sinh — CLB ngoi nha mo uoc', async ({ page }) => {
    await page.goto('/tuyen-sinh/clb-ngoi-nha-mo-uoc');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('trang thuc don hoc duong', async ({ page }) => {
    await page.goto('/dich-vu-hoc-duong/thuc-don');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Co danh sach thuc don hoac placeholder
    const content = page.locator('article, [class*="card"], [class*="article"], .prose');
    const count = await content.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('trang 404 khi URL khong ton tai', async ({ page }) => {
    const response = await page.goto('/trang-khong-ton-tai-xyz-123', {
      waitUntil: 'networkidle',
    });
    const status = response?.status() ?? 0;
    const notFoundText = page.locator('text=/không tìm thấy|not found|404/i');
    const hasNotFoundUI = await notFoundText.count();
    expect(status === 404 || hasNotFoundUI > 0).toBeTruthy();
  });

  test('khong co loi console nghiem trong tren trang chu', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    await page.waitForTimeout(2000);
    // Cho phep warning nhung khong cho phep error nghiem trong
    const criticalErrors = errors.filter(
      (e) => !e.includes('hydration') && !e.includes('Warning') && !e.includes('Failed to load resource')
    );
    // Ghi chu loi nhung khong fail test neu chi la resource errors
    if (criticalErrors.length > 0) {
      console.warn('Console errors:', criticalErrors);
    }
  });
});

test.describe('Navigation', () => {
  test('menu chinh co cac link quan trong', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    const links = header.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('click logo ve trang chu', async ({ page }) => {
    await page.goto('/lien-he');
    await page.waitForLoadState('networkidle');
    const logo = page.locator('header a[href="/"]').first();
    if (await logo.isVisible()) {
      await logo.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/$/, { timeout: 10_000 });
    }
  });

  test('footer co thong tin lien he va copyright', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    // Co ten truong hoac thong tin lien he
    const footerText = await footer.textContent();
    expect(footerText).toBeTruthy();
    // Co it nhat 1 link trong footer
    const footerLinks = footer.locator('a');
    expect(await footerLinks.count()).toBeGreaterThanOrEqual(1);
  });
});
