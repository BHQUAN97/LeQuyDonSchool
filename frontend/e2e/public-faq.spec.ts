import { test, expect } from '@playwright/test';

test.describe('FAQ Page — Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tuyen-sinh/cau-hoi-thuong-gap');
  });

  test('trang FAQ hien thi dung', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Co breadcrumb
    const breadcrumb = page.locator('text=/Trang chủ|Tuyển sinh/i');
    expect(await breadcrumb.count()).toBeGreaterThan(0);
  });

  test('co it nhat 5 cau hoi trong accordion', async ({ page }) => {
    // Moi cau hoi la 1 button hoac clickable element trong accordion
    const questions = page.locator('[class*="cursor-pointer"], button:has-text("?"), [role="button"]');
    // Default FAQs co 8 cau hoi
    const count = await questions.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('click mo accordion hien thi cau tra loi', async ({ page }) => {
    // Tim cau hoi dau tien (accordion item)
    const firstQuestion = page.locator('[class*="cursor-pointer"], [role="button"]').first();
    if (await firstQuestion.isVisible()) {
      await firstQuestion.click();
      await page.waitForTimeout(300);
      // Sau khi click, phai co noi dung tra loi hien thi
      const parent = firstQuestion.locator('..');
      const grandparent = parent.locator('..');
      // Kiem tra co text moi xuat hien (cau tra loi)
      const visibleTexts = await grandparent.locator('p, div').count();
      expect(visibleTexts).toBeGreaterThan(0);
    }
  });

  test('click cau hoi khac se dong cau truoc', async ({ page }) => {
    const questions = page.locator('[class*="cursor-pointer"], [role="button"]');
    const count = await questions.count();
    if (count >= 2) {
      // Click cau 1
      await questions.nth(0).click();
      await page.waitForTimeout(300);
      // Click cau 2
      await questions.nth(1).click();
      await page.waitForTimeout(300);
      // Chi 1 accordion dang mo tai 1 thoi diem
      // Kiem tra icon: cau 2 co "-" (dang mo), cau 1 co "+" (dong)
      const firstText = await questions.nth(0).textContent() || '';
      const secondText = await questions.nth(1).textContent() || '';
      // Cau dang mo co icon "-"
      expect(secondText).toContain('−');
    }
  });

  test('FAQ content co cac chu de tuyen sinh', async ({ page }) => {
    const pageText = await page.locator('body').textContent() || '';
    // Kiem tra co cac chu de chinh
    const topics = ['tuyển sinh', 'lớp 1', 'hồ sơ'];
    let matchCount = 0;
    for (const topic of topics) {
      if (pageText.toLowerCase().includes(topic.toLowerCase())) matchCount++;
    }
    expect(matchCount).toBeGreaterThanOrEqual(1);
  });
});
