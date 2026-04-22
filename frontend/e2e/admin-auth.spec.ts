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
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('trang login hien thi form day du', async ({ page }) => {
    await page.goto('/admin/login');
    // Co logo LQ
    await expect(page.locator('text=LQ')).toBeVisible();
    // Co ten truong
    await expect(page.locator('text=/Lê Quý Đôn/i')).toBeVisible();
    // Co text dang nhap quan tri
    await expect(page.locator('text=/Đăng nhập quản trị/i')).toBeVisible();
    // Co input fields
    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
    // Nut co text "Dang nhap"
    await expect(submitBtn).toHaveText(/Đăng nhập/);
  });

  test('input email co placeholder', async ({ page }) => {
    await page.goto('/admin/login');
    const emailInput = page.locator('#email');
    const placeholder = await emailInput.getAttribute('placeholder');
    expect(placeholder).toContain('lequydon');
  });

  test('email input co type email', async ({ page }) => {
    await page.goto('/admin/login');
    const type = await page.locator('#email').getAttribute('type');
    expect(type).toBe('email');
  });

  test('password input co type password', async ({ page }) => {
    await page.goto('/admin/login');
    const type = await page.locator('#password').getAttribute('type');
    expect(type).toBe('password');
  });

  test('login sai hien thi thong bao loi', async ({ page }) => {
    const backendUp = await isBackendAvailable();
    test.skip(!backendUp, 'Backend khong chay — skip login test');

    await page.goto('/admin/login');
    await page.locator('#email').fill('wrong@test.com');
    await page.locator('#password').fill('wrongpassword123');
    await page.locator('button[type="submit"]').click();

    // Nut chuyen sang loading state
    await expect(page.locator('text=/Đang đăng nhập/i')).toBeVisible({ timeout: 3000 });

    // Cho thong bao loi
    const errorMsg = page.locator('text=/sai|lỗi|error|invalid|không đúng|thất bại/i');
    await expect(errorMsg).toBeVisible({ timeout: 10_000 });
  });

  test('cac trang admin quan trong redirect khi chua auth', async ({ page }) => {
    // Test 5 routes chinh de giu trong timeout
    const protectedRoutes = [
      '/admin/articles',
      '/admin/categories',
      '/admin/users',
      '/admin/settings',
      '/admin/contacts',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/admin\/login/, {
        timeout: 5_000,
      });
    }
  });

  test('cac trang admin phu redirect khi chua auth', async ({ page }) => {
    const protectedRoutes = [
      '/admin/events',
      '/admin/media',
      '/admin/pages',
      '/admin/admissions',
      '/admin/navigation',
      '/admin/profile',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/admin\/login/, {
        timeout: 5_000,
      });
    }
  });

  test('form submit khi nhan Enter', async ({ page }) => {
    const backendUp = await isBackendAvailable();
    test.skip(!backendUp, 'Backend khong chay — skip');

    await page.goto('/admin/login');
    await page.locator('#email').fill('test@test.com');
    await page.locator('#password').fill('testpass');
    await page.locator('#password').press('Enter');

    // Phai trigger submit (hien loading hoac error)
    const indicator = page.locator('text=/Đang đăng nhập|lỗi|error|thất bại/i');
    await expect(indicator).toBeVisible({ timeout: 10_000 });
  });

  test('nut dang nhap disabled khi dang loading', async ({ page }) => {
    const backendUp = await isBackendAvailable();
    test.skip(!backendUp, 'Backend khong chay — skip');

    await page.goto('/admin/login');
    await page.locator('#email').fill('test@test.com');
    await page.locator('#password').fill('testpass');
    await page.locator('button[type="submit"]').click();

    // Nut phai disabled trong luc loading
    await expect(page.locator('button[type="submit"]')).toBeDisabled({ timeout: 3000 });
  });
});
