import { test, expect } from '@playwright/test';

test.describe('Search Page — Tim kiem', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tim-kiem');
  });

  test('trang tim kiem hien thi dung', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Co o input tim kiem
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();
    // Co nut tim kiem
    await expect(page.locator('button[type="submit"], button:has-text("Tìm kiếm")')).toBeVisible();
  });

  test('empty state — chua tim kiem', async ({ page }) => {
    // Hien thi thong bao nhap tu khoa
    await expect(page.locator('text=/Nhập từ khóa|bắt đầu tìm kiếm/i')).toBeVisible();
  });

  test('quick suggestions hien thi truoc khi tim', async ({ page }) => {
    // Cac tu khoa goi y: Tuyen sinh, Hoc phi, Lich hoc, Thuc don, Ngoai khoa
    const suggestions = page.locator('text=/Tuyển sinh|Học phí|Lịch học|Thực đơn|Ngoại khóa/');
    const count = await suggestions.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('click quick suggestion dien vao o tim kiem', async ({ page }) => {
    const suggestion = page.locator('button:has-text("Tuyển sinh")');
    if (await suggestion.isVisible()) {
      await suggestion.click();
      // Cho 1 chut de input update
      await page.waitForTimeout(500);
      const inputValue = await page.locator('input[type="text"]').inputValue();
      expect(inputValue).toBe('Tuyển sinh');
    }
  });

  test('nhap tu khoa qua ngan (< 2 ky tu) khong trigger search', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('a');
    await page.waitForTimeout(500);
    // Van con empty state
    await expect(page.locator('text=/Nhập từ khóa|bắt đầu tìm kiếm/i')).toBeVisible();
  });

  test('nut tim kiem disabled khi input < 2 ky tu', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('a');
    const submitBtn = page.locator('button[type="submit"], button:has-text("Tìm kiếm")');
    // Kiem tra disabled state
    const isDisabled = await submitBtn.isDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test('search voi URL param ?q=', async ({ page }) => {
    await page.goto('/tim-kiem?q=tuyen+sinh');
    // Input phai co gia tri tu URL
    const inputValue = await page.locator('input[type="text"]').inputValue();
    expect(inputValue.toLowerCase()).toContain('tuyen');
    // Cho search chay xong (loading hoac ket qua)
    await page.waitForTimeout(2000);
    // Phai hien ket qua hoac thong bao khong tim thay
    const hasResults = await page.locator('text=/kết quả|Không tìm thấy/i').count();
    expect(hasResults).toBeGreaterThan(0);
  });

  test('search form submit khi nhan Enter', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('hoc tap');
    await searchInput.press('Enter');
    // Cho debounce + API
    await page.waitForTimeout(2000);
    // URL phai cap nhat
    expect(page.url()).toContain('q=');
  });
});
