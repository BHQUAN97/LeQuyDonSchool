import { test, expect } from '@playwright/test';

/** Kiem tra backend co chay khong */
async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:4200/api');
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

test.describe('Admin Authentication', () => {
  test('redirect ve login khi chua dang nhap', async ({ page }) => {
    await page.goto('/admin');
    // Phai redirect ve /admin/login
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('trang login hien thi form', async ({ page }) => {
    await page.goto('/admin/login');
    // Co input email/username va password
    const emailInput = page.locator('input[type="email"], input[type="text"], input[name*="email"], input[name*="user"]').first();
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });

  test('login sai hien thi thong bao loi', async ({ page }) => {
    // Test nay can backend de xu ly login request
    const backendUp = await isBackendAvailable();
    test.skip(!backendUp, 'Backend khong chay — skip login test');

    await page.goto('/admin/login');

    const emailInput = page.locator('input[type="email"], input[type="text"], input[name*="email"], input[name*="user"]').first();
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await emailInput.fill('wrong@test.com');
    await passwordInput.fill('wrongpassword123');
    await submitBtn.click();

    // Cho thong bao loi xuat hien
    const errorMsg = page.locator('text=/sai|lỗi|error|invalid|không đúng/i');
    await expect(errorMsg).toBeVisible({ timeout: 10_000 });
  });

  test('cac trang admin khac cung redirect khi chua auth', async ({ page }) => {
    const protectedRoutes = ['/admin/articles', '/admin/categories', '/admin/users', '/admin/settings'];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/admin\/login/, {
        timeout: 5_000,
      });
    }
  });
});
