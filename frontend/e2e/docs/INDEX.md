# E2E Test Documentation — LeQuyDon School CMS

> Tai lieu nghiep vu E2E Playwright cho website Truong Tieu hoc Le Quy Don
> Cap nhat: 2026-04-16 | Tong: 14 test suites | 116 tests (desktop + mobile)

## Tong quan

| # | Nghiep vu | File test | So test | Trang |
|---|-----------|-----------|---------|-------|
| 01 | [Homepage](01-homepage.md) | `homepage.spec.ts` | 11 | `/` |
| 02 | [Admin Auth](02-admin-auth.md) | `admin-auth.spec.ts` | 10 | `/admin/*` |
| 03 | [Admin Pages](03-admin-pages.md) | `admin-pages.spec.ts` | 11 | `/admin/dashboard`, `/admin/articles`, `/admin/contacts`, `/admin/categories`, `/admin/settings` |
| 04 | [Public Pages](04-public-pages.md) | `public-pages.spec.ts` | 14 | Tat ca trang public |
| 05 | [Contact Form](05-public-contact.md) | `public-contact.spec.ts` | 8 | `/lien-he` |
| 06 | [Contact Edge Cases](06-contact-edge-cases.md) | `contact-edge-cases.spec.ts` | 9 | `/lien-he` |
| 07 | [Search](07-public-search.md) | `public-search.spec.ts` | 8 | `/tim-kiem` |
| 08 | [Search Edge Cases](08-search-edge-cases.md) | `search-edge-cases.spec.ts` | 9 | `/tim-kiem` |
| 09 | [FAQ Page](09-public-faq.md) | `public-faq.spec.ts` | 5 | `/tuyen-sinh/cau-hoi-thuong-gap` |
| 10 | [Category Tabs & Articles](10-category-tabs.md) | `category-tabs.spec.ts` | 9 | `/tin-tuc/*`, `/tuyen-sinh/*`, `/dich-vu-hoc-duong/*` |
| 11 | [Dynamic Pages & Security](11-dynamic-pages.md) | `dynamic-pages.spec.ts` | 11 | URL dong, performance, XSS |
| 12 | [Accessibility](12-accessibility.md) | `accessibility.spec.ts` | 11 | `/`, `/lien-he`, `/admin/login`, `/tuyen-sinh/cau-hoi-thuong-gap` |
| 13 | [Cross Navigation](13-cross-navigation.md) | `cross-navigation.spec.ts` | 10 | User flows xuyen trang |
| 14 | [Responsive Mobile](14-responsive-mobile.md) | `responsive-mobile.spec.ts` | 7 | Mobile + Desktop viewport |

## Coverage theo man hinh

```
PUBLIC PAGES:
  [x] Homepage /                                — 11 tests (sections, SEO, meta, favicon, links)
  [x] Tin tuc — Hoc tap /tin-tuc/hoc-tap        — 3 tests (tabs, sidebar, articles)
  [x] Tin tuc — Su kien /tin-tuc/su-kien        — 2 tests (tab active, navigate)
  [x] Tin tuc — Ngoai khoa /tin-tuc/ngoai-khoa  — 2 tests (articles, navigate)
  [x] Tuyen sinh /tuyen-sinh/thong-tin          — 3 tests (cards, title, date)
  [x] Tuyen sinh — FAQ /tuyen-sinh/cau-hoi-thuong-gap — 5 tests (accordion, expand/collapse)
  [x] Tuyen sinh — CLB /tuyen-sinh/clb-ngoi-nha-mo-uoc — 1 test (content)
  [x] Thuc don /dich-vu-hoc-duong/thuc-don      — 2 tests (list, content)
  [x] Lien he /lien-he                          — 17 tests (form, validation, edge cases, map)
  [x] Tim kiem /tim-kiem                         — 17 tests (search, suggestions, edge cases, results)
  [x] 404 Page                                  — 3 tests (render, link home, status code)

ADMIN PAGES:
  [x] Login /admin/login                        — 10 tests (form, validation, redirect, Enter, disabled)
  [x] Dashboard /admin                          — 3 tests (stats, articles count, contacts)
  [x] Articles /admin/articles                  — 3 tests (list, search, filter)
  [x] Contacts /admin/contacts                  — 2 tests (list, filter)
  [x] Categories /admin/categories              — 1 test (list, create button)
  [x] Settings /admin/settings                  — 2 tests (tabs, switch content)
  [x] Route Protection                          — 11 routes tested (redirect to login)

CROSS-CUTTING:
  [x] Navigation                                — 10 tests (menu, logo, footer, breadcrumb, flows)
  [x] Accessibility                             — 11 tests (lang, h1, alt, labels, focus, contrast)
  [x] Responsive                                — 7 tests (mobile menu, overflow, form, footer, desktop nav)
  [x] Performance                               — 4 tests (load time < 10s cho 4 trang)
  [x] Security                                  — 3 tests (XSS search, XSS contact, URL injection)
```

## Cach chay test

```bash
# Tat ca tests (desktop + mobile)
npx playwright test

# Chi desktop Chrome
npx playwright test --project=desktop-chrome

# Chi mobile (Pixel 7)
npx playwright test --project=mobile

# Chi 1 file
npx playwright test homepage.spec.ts

# Chi 1 test case
npx playwright test -g "homepage co header"

# Voi UI mode (debug)
npx playwright test --ui

# Xem report
npx playwright show-report
```

## Cau hinh

- **Base URL:** `http://localhost:3200` (dev) hoac `E2E_BASE_URL` env var
- **Backend API:** `http://localhost:4200/api`
- **Browsers:** Desktop Chrome (1280x720) + Mobile Pixel 7
- **Timeout:** 30s/test
- **Retries:** 0 (dev), 2 (CI)
- **Workers:** Unlimited (dev), 1 (CI)

## Giai phap ky thuat chung

### 1. Backend down → Skip graceful
```typescript
async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:4200/api');
    return res.ok || res.status < 500;
  } catch { return false; }
}
test.skip(!backendUp, 'Backend khong chay — skip');
```

### 2. Element co the an tren mobile → Check visible truoc khi click
```typescript
if (await link.isVisible()) {
  await link.click();
}
```

### 3. Console errors → Filter known issues
Hydration warnings, favicon, network errors, resource loading duoc bo qua.

### 4. Validation errors → Target cu the
```typescript
page.locator('.bg-red-50:has-text("2-100")') // Target error div, khong label
```

## Cau truc file

```
frontend/e2e/
  ├── docs/                              ← TAI LIEU (ban dang doc)
  │   ├── INDEX.md                       ← File nay
  │   ├── 01-homepage.md
  │   ├── 02-admin-auth.md
  │   ├── 03-admin-pages.md
  │   ├── 04-public-pages.md
  │   ├── 05-public-contact.md
  │   ├── 06-contact-edge-cases.md
  │   ├── 07-public-search.md
  │   ├── 08-search-edge-cases.md
  │   ├── 09-public-faq.md
  │   ├── 10-category-tabs.md
  │   ├── 11-dynamic-pages.md
  │   ├── 12-accessibility.md
  │   ├── 13-cross-navigation.md
  │   └── 14-responsive-mobile.md
  ├── accessibility.spec.ts              ← Test files
  ├── admin-auth.spec.ts
  ├── admin-pages.spec.ts
  ├── category-tabs.spec.ts
  ├── contact-edge-cases.spec.ts
  ├── cross-navigation.spec.ts
  ├── dynamic-pages.spec.ts
  ├── homepage.spec.ts
  ├── public-contact.spec.ts
  ├── public-faq.spec.ts
  ├── public-pages.spec.ts
  ├── public-search.spec.ts
  ├── responsive-mobile.spec.ts
  └── search-edge-cases.spec.ts
```
