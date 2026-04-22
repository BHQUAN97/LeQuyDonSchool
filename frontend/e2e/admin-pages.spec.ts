import { test, expect, Page } from '@playwright/test';

/**
 * Admin pages tests — can backend de login.
 * Neu backend khong chay, chi test login redirect.
 */

async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:4200/api');
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

/** Login helper — su dung seed admin account */
async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login');
  await page.locator('#email').fill('admin@lequydon.edu.vn');
  await page.locator('#password').fill('admin123');
  await page.locator('button[type="submit"]').click();
  // Cho redirect ve dashboard
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 15_000 });
}

test.describe('Admin Dashboard', () => {
  test.beforeEach(async () => {
    const backendUp = await isBackendAvailable();
    test.skip(!backendUp, 'Backend khong chay — skip admin tests');
  });

  test('dashboard hien thi sau khi login', async ({ page }) => {
    await loginAsAdmin(page);
    // Co stat cards
    const statCards = page.locator('[class*="stat"], [class*="card"]');
    await expect(statCards.first()).toBeVisible({ timeout: 10_000 });
  });

  test('dashboard co thong ke bai viet', async ({ page }) => {
    await loginAsAdmin(page);
    // Co thong ke so bai viet
    await expect(page.locator('text=/bài viết|Bài viết|articles/i').first()).toBeVisible({ timeout: 10_000 });
  });

  test('dashboard co danh sach lien he gan day', async ({ page }) => {
    await loginAsAdmin(page);
    await page.waitForTimeout(3000);
    // Co section lien he
    const contacts = page.locator('text=/liên hệ|Liên hệ|contacts/i');
    expect(await contacts.count()).toBeGreaterThan(0);
  });
});

test.describe('Admin Articles Page', () => {
  test.beforeEach(async () => {
    const backendUp = await isBackendAvailable();
    test.skip(!backendUp, 'Backend khong chay — skip');
  });

  test('articles page hien thi danh sach', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/articles');
    // Co tieu de trang
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10_000 });
    // Co nut tao moi
    await expect(page.locator('a[href*="create"], button:has-text("Tạo"), button:has-text("Thêm")').first()).toBeVisible();
  });

  test('articles co search box', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/articles');
    const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="tìm"], input[placeholder*="Tìm"]');
    await expect(searchInput.first()).toBeVisible({ timeout: 10_000 });
  });

  test('articles co filter theo trang thai', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/articles');
    await page.waitForTimeout(3000);
    // Co tabs: Tat ca, Nhap, Da xuat ban, An
    const filterButtons = page.locator('button:has-text("Tất cả"), button:has-text("Nháp"), button:has-text("Đã xuất bản"), button:has-text("Ẩn")');
    expect(await filterButtons.count()).toBeGreaterThanOrEqual(2);
  });
});

test.describe('Admin Contacts Page', () => {
  test.beforeEach(async () => {
    const backendUp = await isBackendAvailable();
    test.skip(!backendUp, 'Backend khong chay — skip');
  });

  test('contacts page hien thi danh sach', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/contacts');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10_000 });
  });

  test('contacts co filter theo trang thai', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/contacts');
    await page.waitForTimeout(3000);
    const filterButtons = page.locator('button:has-text("Tất cả"), button:has-text("Mới"), button:has-text("Đã đọc"), button:has-text("Đã trả lời")');
    expect(await filterButtons.count()).toBeGreaterThanOrEqual(2);
  });
});

test.describe('Admin Categories Page', () => {
  test.beforeEach(async () => {
    const backendUp = await isBackendAvailable();
    test.skip(!backendUp, 'Backend khong chay — skip');
  });

  test('categories page hien thi', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/categories');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10_000 });
    // Co nut them danh muc
    await expect(page.locator('button:has-text("Thêm"), button:has-text("Tạo")').first()).toBeVisible();
  });
});

test.describe('Admin Settings Page', () => {
  test.beforeEach(async () => {
    const backendUp = await isBackendAvailable();
    test.skip(!backendUp, 'Backend khong chay — skip');
  });

  test('settings page co tabs', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/settings');
    await page.waitForTimeout(3000);
    // Co cac tab: Chung, Lien he, Mang xa hoi, SEO, Nut lien he nhanh
    const tabs = page.locator('button:has-text("Chung"), button:has-text("Liên hệ"), button:has-text("SEO")');
    expect(await tabs.count()).toBeGreaterThanOrEqual(2);
  });

  test('settings — switch tab thay doi noi dung', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/settings');
    await page.waitForTimeout(3000);
    // Click tab SEO
    const seoTab = page.locator('button:has-text("SEO")');
    if (await seoTab.isVisible()) {
      await seoTab.click();
      await page.waitForTimeout(500);
      // Co input meta description hoac default title
      const seoFields = page.locator('input, textarea');
      expect(await seoFields.count()).toBeGreaterThan(0);
    }
  });
});
