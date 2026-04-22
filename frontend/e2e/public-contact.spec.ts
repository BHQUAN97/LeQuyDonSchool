import { test, expect } from '@playwright/test';

test.describe('Contact Page — UI & Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lien-he');
  });

  test('trang lien he hien thi day du', async ({ page }) => {
    // Co tieu de
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Co thong tin lien he co ban
    const pageText = await page.locator('body').textContent() || '';
    // Co dia chi, dien thoai, hoac email
    const hasContactInfo =
      pageText.includes('024') ||
      pageText.includes('Lưu Hữu Phước') ||
      pageText.includes('lequydon') ||
      pageText.includes('email');
    expect(hasContactInfo).toBeTruthy();
  });

  test('form lien he co day du fields', async ({ page }) => {
    // 5 fields: ho ten, email, dia chi, sdt, noi dung
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-address')).toBeVisible();
    await expect(page.locator('#contact-phone')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
    // Co nut gui
    await expect(page.locator('button[type="submit"], button:has-text("Gửi")')).toBeVisible();
  });

  test('form validation — ten qua ngan', async ({ page }) => {
    await page.fill('#contact-name', 'A');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '0123456789');
    await page.fill('#contact-message', 'Day la noi dung lien he test.');
    await page.click('button[type="submit"], button:has-text("Gửi")');
    // Phai hien loi validation
    await expect(page.locator('text=/2-100 ký tự|Họ tên/i')).toBeVisible({ timeout: 5000 });
  });

  test('form validation — email khong hop le', async ({ page }) => {
    await page.fill('#contact-name', 'Nguyen Van Test');
    await page.fill('#contact-email', 'not-an-email');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '0123456789');
    await page.fill('#contact-message', 'Day la noi dung lien he test.');
    // Browser validation se chan truoc, nhung kiem tra form co required
    const emailInput = page.locator('#contact-email');
    const type = await emailInput.getAttribute('type');
    expect(type).toBe('email');
  });

  test('form validation — noi dung qua ngan', async ({ page }) => {
    await page.fill('#contact-name', 'Nguyen Van Test');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '0123456789');
    await page.fill('#contact-message', 'Ngan');
    await page.click('button[type="submit"], button:has-text("Gửi")');
    // Phai hien loi ve do dai noi dung — chi target error div, khong label
    await expect(page.locator('.bg-red-50:has-text("10-2000")')).toBeVisible({ timeout: 5000 });
  });

  test('form validation — sdt khong hop le', async ({ page }) => {
    await page.fill('#contact-name', 'Nguyen Van Test');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', 'abc-not-phone');
    await page.fill('#contact-message', 'Day la noi dung lien he test day du.');
    await page.click('button[type="submit"], button:has-text("Gửi")');
    // Phai hien loi ve so dien thoai — chi target error div
    await expect(page.locator('.bg-red-50:has-text("điện thoại")')).toBeVisible({ timeout: 5000 });
  });

  test('form co cac truong required', async ({ page }) => {
    // Kiem tra cac input co required attribute
    const nameRequired = await page.locator('#contact-name').getAttribute('required');
    const emailRequired = await page.locator('#contact-email').getAttribute('required');
    const messageRequired = await page.locator('#contact-message').getAttribute('required');
    expect(nameRequired !== null || nameRequired === '').toBeTruthy();
    expect(emailRequired !== null || emailRequired === '').toBeTruthy();
    expect(messageRequired !== null || messageRequired === '').toBeTruthy();
  });

  test('trang co Google Maps embed', async ({ page }) => {
    const iframe = page.locator('iframe[src*="google.com/maps"], iframe[src*="maps.google"]');
    const iframeCount = await iframe.count();
    expect(iframeCount).toBeGreaterThanOrEqual(1);
  });
});
