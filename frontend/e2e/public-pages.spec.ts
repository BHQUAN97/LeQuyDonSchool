import { test, expect } from '@playwright/test';

test.describe('Public Pages — Smoke Tests', () => {
  test('trang chu load thanh cong', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Lê Quý Đôn|Le Quy Don/i);
    // Header va footer phai hien thi
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('trang tin tuc — hoc tap', async ({ page }) => {
    await page.goto('/tin-tuc/hoc-tap');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Khong bi loi 500
    await expect(page.locator('text=500')).not.toBeVisible();
  });

  test('trang tin tuc — su kien', async ({ page }) => {
    await page.goto('/tin-tuc/su-kien');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('trang tin tuc — ngoai khoa', async ({ page }) => {
    await page.goto('/tin-tuc/ngoai-khoa');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('trang tuyen sinh — thong tin', async ({ page }) => {
    await page.goto('/tuyen-sinh/thong-tin');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('trang tuyen sinh — cau hoi thuong gap', async ({ page }) => {
    await page.goto('/tuyen-sinh/cau-hoi-thuong-gap');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('trang lien he', async ({ page }) => {
    await page.goto('/lien-he');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Co form lien he hoac thong tin lien he
    const hasForm = await page.locator('form').count();
    const hasContact = await page.locator('text=/liên hệ|điện thoại|email/i').count();
    expect(hasForm + hasContact).toBeGreaterThan(0);
  });

  test('trang tim kiem', async ({ page }) => {
    await page.goto('/tim-kiem');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('trang thuc don', async ({ page }) => {
    await page.goto('/dich-vu-hoc-duong/thuc-don');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('trang 404 khi URL khong ton tai', async ({ page }) => {
    const response = await page.goto('/trang-khong-ton-tai-xyz', {
      waitUntil: 'networkidle',
    });
    // Next.js tra 404 (production) hoac hien not-found UI (dev)
    const status = response?.status() ?? 0;
    const notFoundText = page.locator('text=/không tìm thấy|not found|404/i');
    const hasNotFoundUI = await notFoundText.count();
    expect(status === 404 || hasNotFoundUI > 0).toBeTruthy();
  });
});

test.describe('Navigation', () => {
  test('menu chinh co cac link quan trong', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Kiem tra co it nhat 3 link trong header (desktop nav hoac mobile menu)
    const links = header.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('click logo ve trang chu', async ({ page }) => {
    await page.goto('/lien-he');
    // Click logo hoac ten truong
    const logo = page.locator('header a[href="/"]').first();
    if (await logo.isVisible()) {
      await logo.click();
      await expect(page).toHaveURL('/');
    }
  });
});
