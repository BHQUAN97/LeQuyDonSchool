# 01. Homepage — Trang chu

## Summary

Kiem tra trang chu (/) — man hinh chinh cua website Truong Tieu hoc Le Quy Don. Test dam bao layout dung (header, main, footer), co nhieu sections noi dung, hinh anh, links dieu huong, page title, va day du SEO meta tags (description, Open Graph, viewport, charset, favicon).

**File test:** `e2e/homepage.spec.ts`
**So test:** 11 (6 Sections & Content + 5 SEO & Meta Tags)
**Trang:** `/`

## Workflow

```
User truy cap trang chu /
  → Server render homepage (SSR via Next.js App Router)
    → Header (logo, navigation menu)
    → Main content (nhieu sections: hero/banner, articles, stats...)
    → Images (slider, banner, hero)
    → Links den cac trang con
    → Footer
  → Meta tags: description, OG, viewport, charset, favicon
```

## Chi tiet cac test case

### Sections & Content (6 tests)

**TC-01: homepage co header, main content, footer**
- Ky vong: `<header>` visible, `<footer>` visible, `<main>` visible (neu co)
- Kiem tra layout co ban cua trang

**TC-02: homepage co it nhat 3 sections noi dung**
- Selector: `main section, main > div > div`
- Ky vong: `count >= 2`

**TC-03: homepage co hinh anh (slider/banner/hero)**
- Selector: `main img`
- Ky vong: `count >= 0` (cho phep 0 neu dung placeholder)

**TC-04: homepage load khong bi loi 500**
- Goto `/` → kiem tra response status
- Ky vong: `status < 500`

**TC-05: homepage co link den cac trang con**
- Selector: `main a[href]`
- Ky vong: `count >= 1`

**TC-06: homepage title dung format**
- `page.title()` phai co do dai > 5 ky tu
- Dam bao title khong bi rong hoac default

### SEO & Meta Tags (5 tests)

**TC-07: co meta description**
- Selector: `meta[name="description"]`
- Ky vong: content khong rong, length > 10

**TC-08: co Open Graph tags**
- Kiem tra: `og:title` ton tai, `og:type` = "website" (neu co)

**TC-09: co viewport meta tag cho responsive**
- Ky vong: viewport content chua "width=device-width"

**TC-10: co charset UTF-8**
- Ky vong: `meta[charset]` = "utf-8"

**TC-11: co favicon**
- Selector: `link[rel="icon"], link[rel="shortcut icon"]`
- Ky vong: `count >= 1`

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Header/footer khong visible | CSS layout sai | Kiem tra component render |
| Sections < 2 | Chua co data hoac component loi | Kiem tra API data + SectionRenderer |
| Status 500 | Server error | Kiem tra Next.js logs + API |
| Meta tags thieu | Chua add trong layout.tsx | Them metadata vao Next.js App Router metadata export |
| Favicon thieu | Chua co file favicon | Them favicon.ico vao public/ |
