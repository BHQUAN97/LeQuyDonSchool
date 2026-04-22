import { test, expect } from '@playwright/test';

/**
 * Tests responsive behavior — chi chay tren project mobile (Pixel 7)
 * de dam bao mobile UX dung.
 */

test.describe('Responsive — Mobile Menu', () => {
  // Chi chay tren mobile project
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium only');

  test('mobile menu toggle hoat dong', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Chi test tren mobile viewport');
    await page.goto('/');

    // Tim hamburger button
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], header button:has(svg)').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);
      // Menu phai hien thi (mobile nav visible)
      const mobileNav = page.locator('nav, [class*="mobile"], [class*="menu"]');
      expect(await mobileNav.count()).toBeGreaterThan(0);
    }
  });

  test('mobile — trang chu hien thi khong bi tran ngang', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Chi test tren mobile viewport');
    await page.goto('/');
    // Kiem tra khong co horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    // Body width khong nen vuot qua viewport + 10px tolerance
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });

  test('mobile — form lien he responsive', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Chi test tren mobile viewport');
    await page.goto('/lien-he');
    // Tat ca input phai visible
    const inputs = page.locator('#contact-name, #contact-email, #contact-phone, #contact-address, #contact-message');
    for (let i = 0; i < await inputs.count(); i++) {
      const input = inputs.nth(i);
      await expect(input).toBeVisible();
    }
    // Submit button visible
    const btn = page.locator('button[type="submit"], button:has-text("Gửi")');
    await expect(btn).toBeVisible();
  });

  test('mobile — search page input accessible', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Chi test tren mobile viewport');
    await page.goto('/tim-kiem');
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();
    // Input phai focus duoc
    await searchInput.focus();
    await searchInput.fill('test');
    const value = await searchInput.inputValue();
    expect(value).toBe('test');
  });

  test('mobile — footer hien thi day du', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Chi test tren mobile viewport');
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    // Footer text visible
    const footerText = await footer.textContent();
    expect(footerText!.length).toBeGreaterThan(20);
  });
});

test.describe('Responsive — Desktop Navigation', () => {
  test('desktop — header nav links hien thi', async ({ page, isMobile }) => {
    test.skip(isMobile === true, 'Chi test tren desktop');
    await page.goto('/');
    // Desktop phai co nav links visible (khong can hamburger)
    const navLinks = page.locator('header nav a, header a[href]');
    const visibleCount = await navLinks.count();
    expect(visibleCount).toBeGreaterThanOrEqual(3);
  });

  test('desktop — dropdown menu hover', async ({ page, isMobile }) => {
    test.skip(isMobile === true, 'Chi test tren desktop');
    await page.goto('/');
    // Tim 1 nav item co dropdown (group class)
    const navItem = page.locator('header .group, header [class*="dropdown"]').first();
    if (await navItem.isVisible()) {
      await navItem.hover();
      await page.waitForTimeout(300);
      // Dropdown con phai xuat hien
      const dropdown = navItem.locator('[class*="absolute"], [class*="dropdown"]');
      if (await dropdown.count() > 0) {
        await expect(dropdown.first()).toBeVisible();
      }
    }
  });
});

/** Helper: lay viewport width */
async function viewportWidth(page: import('@playwright/test').Page): Promise<number> {
  return page.evaluate(() => window.innerWidth);
}
