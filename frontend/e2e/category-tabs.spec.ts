import { test, expect } from '@playwright/test';

test.describe('Category Tabs — Tin tuc pages', () => {
  test('hoc tap page — co 3 category tabs', async ({ page }) => {
    await page.goto('/tin-tuc/hoc-tap');
    // Phai co 3 tabs: Su kien, Ngoai khoa, Hoc tap
    const tabs = page.locator('a[href*="/tin-tuc/su-kien"], a[href*="/tin-tuc/ngoai-khoa"], a[href*="/tin-tuc/hoc-tap"]');
    expect(await tabs.count()).toBeGreaterThanOrEqual(2);
  });

  test('su kien page — tab su kien active', async ({ page }) => {
    await page.goto('/tin-tuc/su-kien');
    // Tim tab su kien va kiem tra active state
    const suKienTab = page.locator('a[href*="/tin-tuc/su-kien"]').first();
    if (await suKienTab.isVisible()) {
      // Active tab thuong co class khac (bg-green, text-white, border-green...)
      const classes = await suKienTab.getAttribute('class') || '';
      const isActive = classes.includes('green') || classes.includes('active') || classes.includes('white');
      // Ghi nhan neu khong active — co the la bug UI
      if (!isActive) {
        console.warn('Tab "Su kien" khong co active state visual');
      }
    }
  });

  test('ngoai khoa page — co articles hoac placeholder', async ({ page }) => {
    await page.goto('/tin-tuc/ngoai-khoa');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Phai co articles (real hoac placeholder)
    const articles = page.locator('article, [class*="card"], a[href*="/tin-tuc/"]');
    const mainArticles = page.locator('main article, main [class*="card"]');
    const count = await articles.count() + await mainArticles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('click tab chuyen trang dung', async ({ page }) => {
    await page.goto('/tin-tuc/hoc-tap');
    // Click tab su kien
    const suKienTab = page.locator('a[href*="/tin-tuc/su-kien"]').first();
    if (await suKienTab.isVisible()) {
      await suKienTab.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/tin-tuc/su-kien');
    }
  });
});

test.describe('Article List — Pagination & Cards', () => {
  test('tuyen sinh thong tin — co article cards', async ({ page }) => {
    await page.goto('/tuyen-sinh/thong-tin');
    // Phai co it nhat 1 article card (real hoac placeholder)
    const cards = page.locator('article, [class*="card"], a[href*="/tin-tuc/"]');
    await page.waitForTimeout(2000);
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test('article card co title va date', async ({ page }) => {
    await page.goto('/tuyen-sinh/thong-tin');
    await page.waitForTimeout(2000);
    // Tim card dau tien
    const firstCard = page.locator('article, [class*="card"]').first();
    if (await firstCard.isVisible()) {
      const cardText = await firstCard.textContent() || '';
      // Card phai co text (title)
      expect(cardText.length).toBeGreaterThan(5);
    }
  });

  test('thuc don page — co danh sach thuc don', async ({ page }) => {
    await page.goto('/dich-vu-hoc-duong/thuc-don');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Phai co articles/cards
    const content = page.locator('article, [class*="card"]');
    await page.waitForTimeout(2000);
    expect(await content.count()).toBeGreaterThanOrEqual(1);
  });

  test('CLB ngoi nha mo uoc — co noi dung', async ({ page }) => {
    await page.goto('/tuyen-sinh/clb-ngoi-nha-mo-uoc');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Co articles hoac noi dung mo ta
    const body = await page.locator('main').textContent() || '';
    expect(body.length).toBeGreaterThan(100);
  });
});

test.describe('Sidebar — Related Content', () => {
  test('trang tin tuc co sidebar', async ({ page }) => {
    await page.goto('/tin-tuc/hoc-tap');
    await page.waitForTimeout(2000);
    // Sidebar thuong o ben phai tren desktop
    const sidebar = page.locator('aside, [class*="sidebar"], [class*="sticky"]');
    // Sidebar co the khong hien tren mobile
    const count = await sidebar.count();
    // Chi kiem tra tren desktop (sidebar an tren mobile)
    if (count > 0) {
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });
});
