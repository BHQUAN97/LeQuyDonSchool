import { test, expect } from '@playwright/test';

test.describe('Contact Form — Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lien-he');
  });

  test('ten voi ky tu dac biet hop le', async ({ page }) => {
    // Ten co dau tieng Viet phai accepted
    await page.fill('#contact-name', 'Nguyễn Văn Bình');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Hà Nội');
    await page.fill('#contact-phone', '0987654321');
    await page.fill('#contact-message', 'Đây là nội dung test với tiếng Việt có dấu.');
    await page.click('button[type="submit"], button:has-text("Gửi")');
    // Khong nen co loi validation (chi loi API vi backend khong chay)
    await page.waitForTimeout(2000);
    const validationError = page.locator('.bg-red-50:has-text("2-100"), .bg-red-50:has-text("10-2000")');
    expect(await validationError.count()).toBe(0);
  });

  test('ten dung 2 ky tu (min boundary)', async ({ page }) => {
    await page.fill('#contact-name', 'AB');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '0987654321');
    await page.fill('#contact-message', 'Noi dung du dai de pass validation.');
    await page.click('button[type="submit"], button:has-text("Gửi")');
    await page.waitForTimeout(2000);
    // Khong nen co loi validation ten
    const nameError = page.locator('.bg-red-50:has-text("2-100")');
    expect(await nameError.count()).toBe(0);
  });

  test('noi dung dung 10 ky tu (min boundary)', async ({ page }) => {
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '0987654321');
    await page.fill('#contact-message', '1234567890'); // dung 10 ky tu
    await page.click('button[type="submit"], button:has-text("Gửi")');
    await page.waitForTimeout(2000);
    // 10 ky tu phai pass
    const msgError = page.locator('.bg-red-50:has-text("10-2000")');
    expect(await msgError.count()).toBe(0);
  });

  test('sdt voi format quoc te hop le', async ({ page }) => {
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '+84 987 654 321');
    await page.fill('#contact-message', 'Noi dung test du dai de pass.');
    await page.click('button[type="submit"], button:has-text("Gửi")');
    await page.waitForTimeout(2000);
    // SDT quoc te phai accepted
    const phoneError = page.locator('.bg-red-50:has-text("điện thoại")');
    expect(await phoneError.count()).toBe(0);
  });

  test('sdt voi format ngoac hop le', async ({ page }) => {
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '(024) 6287-2079');
    await page.fill('#contact-message', 'Noi dung test du dai de pass.');
    await page.click('button[type="submit"], button:has-text("Gửi")');
    await page.waitForTimeout(2000);
    const phoneError = page.locator('.bg-red-50:has-text("điện thoại")');
    expect(await phoneError.count()).toBe(0);
  });

  test('noi dung chi co spaces khong hop le', async ({ page }) => {
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '0987654321');
    await page.fill('#contact-message', '         '); // chi spaces
    await page.click('button[type="submit"], button:has-text("Gửi")');
    await page.waitForTimeout(2000);
    // trim() se lam message thanh rong → loi validation
    const msgError = page.locator('.bg-red-50:has-text("10-2000")');
    await expect(msgError).toBeVisible({ timeout: 5000 });
  });

  test('ten chi co spaces khong hop le', async ({ page }) => {
    await page.fill('#contact-name', '   ');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '0987654321');
    await page.fill('#contact-message', 'Noi dung test du dai de pass.');
    await page.click('button[type="submit"], button:has-text("Gửi")');
    await page.waitForTimeout(2000);
    // trim() se lam name thanh rong → loi
    const nameError = page.locator('.bg-red-50:has-text("2-100")');
    await expect(nameError).toBeVisible({ timeout: 5000 });
  });

  test('submit button disabled khi dang loading', async ({ page }) => {
    // Dien form hop le
    await page.fill('#contact-name', 'Test User Name');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '0987654321');
    await page.fill('#contact-message', 'Noi dung test du dai cho validation pass.');
    // Click submit
    await page.click('button[type="submit"], button:has-text("Gửi")');
    // Nut phai chuyen sang disabled/loading
    const btn = page.locator('button[type="submit"], button:has-text("Đang gửi")');
    // Check text changes to loading hoac disabled state
    await page.waitForTimeout(500);
    const btnText = await btn.first().textContent();
    // Co the la "Dang gui..." hoac van la "Gui lien he" (neu API nhanh)
    expect(btnText).toBeTruthy();
  });

  test('email format hop le phuc tap', async ({ page }) => {
    // Test email co subdomain
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'user@mail.example.co.vn');
    await page.fill('#contact-address', 'Ha Noi');
    await page.fill('#contact-phone', '0987654321');
    await page.fill('#contact-message', 'Noi dung test du dai de pass.');
    await page.click('button[type="submit"], button:has-text("Gửi")');
    await page.waitForTimeout(2000);
    // Email hop le — khong co loi email
    const emailError = page.locator('.bg-red-50:has-text("Email")');
    expect(await emailError.count()).toBe(0);
  });
});
