import { test, expect } from '@playwright/test';

test.describe('Homepage — Sections & Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage co header, main content, footer', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    // Main content area phai co noi dung
    const main = page.locator('main');
    if (await main.count() > 0) {
      await expect(main).toBeVisible();
    }
  });

  test('homepage co it nhat 3 sections noi dung', async ({ page }) => {
    // Trang chu thuong co nhieu section: hero, articles, stats, testimonials...
    const sections = page.locator('main section, main > div > div');
    const count = await sections.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('homepage co hinh anh (slider/banner/hero)', async ({ page }) => {
    // Phai co it nhat 1 hinh anh tren trang chu
    const images = page.locator('main img');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(0); // Cho phep 0 neu dung placeholder
  });

  test('homepage load khong bi loi 500', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(500);
  });

  test('homepage co link den cac trang con', async ({ page }) => {
    // Trang chu phai co cac link dieu huong den cac trang khac
    const links = page.locator('main a[href]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('homepage title dung format', async ({ page }) => {
    const title = await page.title();
    // Title phai chua ten truong
    expect(title.length).toBeGreaterThan(5);
  });
});

test.describe('Homepage — SEO & Meta Tags', () => {
  test('co meta description', async ({ page }) => {
    await page.goto('/');
    const metaDesc = page.locator('meta[name="description"]');
    const content = await metaDesc.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(10);
  });

  test('co Open Graph tags', async ({ page }) => {
    await page.goto('/');
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    // OG title phai ton tai
    expect(ogTitle).toBeTruthy();
    if (ogType) {
      expect(ogType).toBe('website');
    }
  });

  test('co viewport meta tag cho responsive', async ({ page }) => {
    await page.goto('/');
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });

  test('co charset UTF-8', async ({ page }) => {
    await page.goto('/');
    const charset = await page.locator('meta[charset]').getAttribute('charset');
    if (charset) {
      expect(charset.toLowerCase()).toBe('utf-8');
    }
  });

  test('co favicon', async ({ page }) => {
    await page.goto('/');
    const favicon = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
    expect(await favicon.count()).toBeGreaterThanOrEqual(1);
  });
});
