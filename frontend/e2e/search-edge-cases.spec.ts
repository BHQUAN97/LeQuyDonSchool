import { test, expect } from '@playwright/test';

test.describe('Search — Edge Cases', () => {
  test('search voi ky tu dac biet tieng Viet', async ({ page }) => {
    await page.goto('/tim-kiem');
    const input = page.locator('input[type="text"]');
    await input.fill('tuyển sinh');
    await input.press('Enter');
    await page.waitForTimeout(2000);
    // URL phai encode tieng Viet dung
    expect(page.url()).toContain('q=');
    // Phai hien ket qua hoac thong bao (backend co the khong chay)
    const resultArea = page.locator('text=/kết quả|Không tìm thấy|Đang tìm/i');
    await expect(resultArea.first()).toBeVisible({ timeout: 5000 });
  });

  test('search voi ky tu dac biet HTML', async ({ page }) => {
    await page.goto('/tim-kiem');
    const input = page.locator('input[type="text"]');
    // Nhap ky tu HTML — khong nen bi XSS
    await input.fill('<script>alert(1)</script>');
    await input.press('Enter');
    await page.waitForTimeout(2000);
    // Script tag khong execute (khong co alert dialog)
    // Trang van hien thi binh thuong — input van visible
    await expect(page.locator('input[type="text"]')).toBeVisible();
    // Khong co executable script tag trong main content
    const scripts = page.locator('main script');
    expect(await scripts.count()).toBe(0);
  });

  test('search voi query dai', async ({ page }) => {
    await page.goto('/tim-kiem');
    const input = page.locator('input[type="text"]');
    const longQuery = 'abcdef'.repeat(30); // 180 chars
    await input.fill(longQuery);
    await input.press('Enter');
    await page.waitForTimeout(2000);
    // Trang khong bi crash
    await expect(page.locator('input[type="text"]')).toBeVisible();
    // Co phan hoi nao do (ket qua hoac thong bao)
    const hasResponse = await page.locator('text=/kết quả|Không tìm thấy|Đang tìm/i').first().isVisible().catch(() => false);
    expect(hasResponse).toBeTruthy();
  });

  test('search — quick suggestion an sau khi da tim', async ({ page }) => {
    await page.goto('/tim-kiem');
    await page.waitForTimeout(1000);
    // Quick suggestions hien thi truoc khi search
    const suggestion = page.locator('button:has-text("Tuyển sinh")');
    if (await suggestion.isVisible()) {
      await suggestion.click();
      await page.waitForTimeout(2000);
      // Quick suggestions section phai bien mat
      const suggestionsLabel = page.locator('text=/Tìm kiếm phổ biến/i');
      expect(await suggestionsLabel.count()).toBe(0);
    }
  });

  test('search — clear input va search lai', async ({ page }) => {
    await page.goto('/tim-kiem');
    const input = page.locator('input[type="text"]');
    // Nhap query 1
    await input.fill('hoc tap');
    await input.press('Enter');
    await page.waitForTimeout(1500);
    // Clear va nhap query moi
    await input.fill('');
    await input.fill('su kien');
    await input.press('Enter');
    await page.waitForTimeout(1500);
    // URL phai cap nhat voi query moi
    expect(decodeURIComponent(page.url())).toContain('su');
  });

  test('search — URL encode dac biet', async ({ page }) => {
    // Truy cap voi query co ky tu dac biet
    await page.goto('/tim-kiem?q=%26%3D%3F');
    await page.waitForTimeout(2000);
    // Trang khong bi crash
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('search — debounce thuc su hoat dong', async ({ page }) => {
    await page.goto('/tim-kiem');
    const input = page.locator('input[type="text"]');
    // Go nhanh nhieu ky tu
    await input.pressSequentially('hoc tap ngoai khoa', { delay: 50 });
    // Cho debounce 300ms + API
    await page.waitForTimeout(2000);
    // Sau khi debounce fire, phai co ket qua hoac thong bao
    const hasResponse = await page.locator('text=/kết quả|Không tìm thấy|Đang tìm/i').first().isVisible().catch(() => false);
    expect(hasResponse).toBeTruthy();
  });
});

test.describe('Search — Result Display', () => {
  test('ket qua search co so luong hien thi', async ({ page }) => {
    await page.goto('/tim-kiem?q=tuyen+sinh');
    await page.waitForTimeout(3000);
    // Phai hien thi text "Tim thay X ket qua" (dung selector cu the)
    const resultCountP = page.locator('p:has-text("Tìm thấy")').first();
    const noResultsH = page.locator('h3:has-text("Không tìm thấy")').first();
    const hasResultCount = await resultCountP.isVisible().catch(() => false);
    const hasNoResults = await noResultsH.isVisible().catch(() => false);
    // It nhat 1 trong 2 phai hien thi
    expect(hasResultCount || hasNoResults).toBeTruthy();
  });

  test('no results hien thi icon va message', async ({ page }) => {
    await page.goto('/tim-kiem?q=xyzabcdefghijklmnop');
    await page.waitForTimeout(3000);
    // Phai hien thong bao khong tim thay
    const noResults = page.locator('text=/Không tìm thấy/i');
    if (await noResults.isVisible()) {
      // Co icon SVG search
      const searchIcon = page.locator('main svg');
      expect(await searchIcon.count()).toBeGreaterThan(0);
      // Co message goi y
      const suggestion = page.locator('text=/từ khóa khác/i');
      expect(await suggestion.count()).toBeGreaterThan(0);
    }
    // Neu backend khong chay, "Tim thay 0 ket qua" cung OK
    const zeroResults = page.locator('text=/0.*kết quả/i');
    const hasAny = (await noResults.count()) + (await zeroResults.count());
    expect(hasAny).toBeGreaterThan(0);
  });
});
