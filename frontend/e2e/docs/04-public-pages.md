# 04. Public Pages — Smoke Tests & Navigation

## Summary

Smoke test cho tat ca trang public chinh: trang chu, tin tuc (hoc tap, su kien, ngoai khoa), tuyen sinh (thong tin, CLB), thuc don hoc duong, 404 page, va console errors. Kem theo test navigation: menu links, logo click, footer thong tin.

**File test:** `e2e/public-pages.spec.ts`
**So test:** 14 (11 smoke tests + 3 navigation)
**Trang:** `/`, `/tin-tuc/*`, `/tuyen-sinh/*`, `/dich-vu-hoc-duong/thuc-don`, `/lien-he`, `404`

## Workflow

```
Smoke Tests:
  / → title match "Le Quy Don", header + footer visible
  / → hero/banner hoac main content visible
  /tin-tuc/hoc-tap → h1/h2 visible + breadcrumb
  /tin-tuc/su-kien → h1/h2 visible + category tabs
  /tin-tuc/ngoai-khoa → h1/h2 visible
  /tuyen-sinh/thong-tin → h1/h2 visible + article cards >= 1
  /tuyen-sinh/clb-ngoi-nha-mo-uoc → h1/h2 visible
  /dich-vu-hoc-duong/thuc-don → h1/h2 visible + content cards >= 1
  /trang-khong-ton-tai → 404 status hoac "khong tim thay" UI
  / → console errors filter (bo qua hydration, favicon, resource)

Navigation:
  Header → >= 3 links
  /lien-he → click logo → ve trang chu
  Footer → visible + co text + >= 1 link
```

## Chi tiet cac test case

### Smoke Tests (11 tests)

**TC-01: trang chu load thanh cong**
- Title match `/Le Quy Don/i`, header + footer visible

**TC-02: trang chu co banner hoac hero section**
- Tim: `[class*="banner"], [class*="hero"], [class*="slider"], [class*="carousel"], section >> img`
- Fallback: main content area visible

**TC-03: trang tin tuc — hoc tap**
- Goto `/tin-tuc/hoc-tap` → h1/h2 visible
- Breadcrumb hoac text "Trang chu" visible

**TC-04: trang tin tuc — su kien**
- Goto `/tin-tuc/su-kien` → h1/h2 visible
- Category tabs (Su kien, Hoc tap) >= 1

**TC-05: trang tin tuc — ngoai khoa**
- Goto `/tin-tuc/ngoai-khoa` → h1/h2 visible

**TC-06: trang tuyen sinh — thong tin**
- Goto `/tuyen-sinh/thong-tin` → h1/h2 visible
- Article cards >= 1

**TC-07: trang tuyen sinh — CLB ngoi nha mo uoc**
- Goto `/tuyen-sinh/clb-ngoi-nha-mo-uoc` → h1/h2 visible

**TC-08: trang thuc don hoc duong**
- Goto `/dich-vu-hoc-duong/thuc-don` → h1/h2 visible
- Content cards >= 1

**TC-09: trang 404 khi URL khong ton tai**
- Status 404 HOAC UI hien "khong tim thay" / "not found" / "404"

**TC-10: khong co loi console nghiem trong tren trang chu**
- Lang nghe `console.error` → filter known (hydration, favicon, resource)
- Ghi warn nhung khong fail test

### Navigation (3 tests)

**TC-11: menu chinh co cac link quan trong**
- Header → links count >= 3

**TC-12: click logo ve trang chu**
- `/lien-he` → click `header a[href="/"]` → URL match `/`

**TC-13: footer co thong tin lien he va copyright**
- Footer visible, co text, co >= 1 link

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Title khong match | Title thay doi trong layout.tsx | Cap nhat regex |
| Breadcrumb thieu | Component chua render | Kiem tra Breadcrumb component |
| Article cards = 0 | API khong tra data / backend down | Kiem tra API + empty state |
| Console errors nhieu | Component loi JS | Doc error cu the → fix source |
