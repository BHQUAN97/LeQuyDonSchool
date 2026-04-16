# 14. Responsive Mobile — Kiem tra responsive mobile va desktop

## Summary

Test responsive behavior tren 2 viewport: Mobile (Pixel 7) va Desktop Chrome. Mobile: hamburger menu toggle, khong tran ngang, form lien he, search input, footer. Desktop: nav links visible, dropdown hover.

**File test:** `e2e/responsive-mobile.spec.ts`
**So test:** 7 (5 mobile + 2 desktop)
**Trang:** `/`, `/lien-he`, `/tim-kiem`

## Workflow

```
Mobile (Pixel 7 — 412x915):
  / → hamburger button → click → mobile nav hien thi
  / → body.scrollWidth <= viewport + 10px (khong tran ngang)
  /lien-he → tat ca inputs + submit button visible
  /tim-kiem → search input visible + focus + fill
  / → footer visible + text > 20 chars

Desktop (1280x720):
  / → header nav links >= 3 (khong can hamburger)
  / → hover nav item .group → dropdown [class*="absolute"] visible
```

## Chi tiet cac test case

### Mobile (5 tests)

**TC-01: mobile menu toggle hoat dong**
- **Chi mobile viewport**
- Tim: `button[aria-label*="menu"], header button:has(svg)`
- Click → cho 300ms → nav/menu elements hien thi

**TC-02: mobile — trang chu hien thi khong bi tran ngang**
- **Chi mobile viewport**
- `body.scrollWidth <= window.innerWidth + 10` (10px tolerance)

**TC-03: mobile — form lien he responsive**
- **Chi mobile viewport**
- 5 inputs visible: name, email, phone, address, message
- Submit button visible

**TC-04: mobile — search page input accessible**
- **Chi mobile viewport**
- Input visible → focus → fill "test" → value = "test"

**TC-05: mobile — footer hien thi day du**
- **Chi mobile viewport**
- Footer visible + text length > 20

### Desktop (2 tests)

**TC-06: desktop — header nav links hien thi**
- **Chi desktop viewport**
- `header nav a, header a[href]` count >= 3

**TC-07: desktop — dropdown menu hover**
- **Chi desktop viewport**
- Tim `header .group` → hover → dropdown `[class*="absolute"]` visible

## Ky thuat

- **isMobile flag:** Playwright cung cap `isMobile` parameter tu project config
- **test.skip:** Skip mobile tests tren desktop va nguoc lai
- **browserName check:** `test.skip(({ browserName }) => browserName !== 'chromium')` — chi Chromium
- **Horizontal overflow:** So sanh `body.scrollWidth` voi `window.innerWidth` — neu vuot qua = tran ngang
- **Hover test:** Chi co y nghia tren desktop (mobile khong co hover)
- **Tolerance 10px:** Cho phep sai lech 10px do scrollbar hoac border

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Hamburger khong thay | aria-label thay doi | Cap nhat button selector |
| Tran ngang | Element co width co dinh / overflow | Them overflow-x: hidden hoac responsive width |
| Input khong visible | CSS an tren mobile | Kiem tra responsive CSS breakpoints |
| Dropdown khong hien | Hover state CSS loi | Kiem tra group-hover Tailwind class |
| Nav links < 3 | Menu an tren desktop | Kiem tra header component responsive logic |
