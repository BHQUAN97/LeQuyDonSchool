# 03. Admin Pages — Cac trang quan tri

## Summary

Kiem tra cac trang quan tri sau khi login: Dashboard (stat cards, thong ke bai viet, lien he gan day), Articles (danh sach, search, filter), Contacts (danh sach, filter), Categories (danh sach, nut them), Settings (tabs, switch noi dung). Tat ca test can backend chay de login.

**File test:** `e2e/admin-pages.spec.ts`
**So test:** 11
**Trang:** `/admin` (dashboard), `/admin/articles`, `/admin/contacts`, `/admin/categories`, `/admin/settings`

## Workflow

```
Login thanh cong (admin@lequydon.edu.vn)
  → Redirect ve /admin (dashboard)
    → Stat cards (tong quan)
    → Thong ke bai viet
    → Danh sach lien he gan day

/admin/articles:
  → Tieu de trang + nut "Tao" / "Them"
  → Search box (input text/search)
  → Filter tabs: Tat ca, Nhap, Da xuat ban, An

/admin/contacts:
  → Tieu de trang
  → Filter tabs: Tat ca, Moi, Da doc, Da tra loi

/admin/categories:
  → Tieu de trang + nut "Them" / "Tao"

/admin/settings:
  → Tabs: Chung, Lien he, SEO...
  → Click tab → thay doi noi dung (input/textarea)
```

## Chi tiet cac test case

### Dashboard (3 tests)

**TC-01: dashboard hien thi sau khi login**
- Login → kiem tra stat cards visible
- Selector: `[class*="stat"], [class*="card"]`

**TC-02: dashboard co thong ke bai viet**
- Ky vong: text "bai viet" / "Bai viet" / "articles" visible

**TC-03: dashboard co danh sach lien he gan day**
- Ky vong: text "lien he" / "Lien he" / "contacts" visible

### Articles (3 tests)

**TC-04: articles page hien thi danh sach**
- Ky vong: h1/h2 visible + nut tao moi visible

**TC-05: articles co search box**
- Selector: input text/search voi placeholder "tim" / "Tim"
- Ky vong: search input visible

**TC-06: articles co filter theo trang thai**
- Ky vong: >= 2 filter buttons (Tat ca, Nhap, Da xuat ban, An)

### Contacts (2 tests)

**TC-07: contacts page hien thi danh sach**
- Ky vong: h1/h2 visible

**TC-08: contacts co filter theo trang thai**
- Ky vong: >= 2 filter buttons (Tat ca, Moi, Da doc, Da tra loi)

### Categories (1 test)

**TC-09: categories page hien thi**
- Ky vong: h1/h2 visible + nut them danh muc

### Settings (2 tests)

**TC-10: settings page co tabs**
- Ky vong: >= 2 tabs (Chung, Lien he, SEO)

**TC-11: settings — switch tab thay doi noi dung**
- Click tab "SEO" → kiem tra co input/textarea hien thi
- Ky vong: so fields > 0

## Ky thuat

- **Login helper:** `loginAsAdmin(page)` — fill email/password → click submit → wait redirect
- **Seed account:** `admin@lequydon.edu.vn` / `admin123`
- **Backend required:** Tat ca tests skip neu backend down
- **Wait timeout:** 10s cho stat cards, 3s cho page load + filter render

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Login fail | Seed account chua co / password doi | Kiem tra DB seed data |
| Stat cards khong hien | Dashboard API cham | Tang timeout |
| Filter buttons < 2 | UI chua render tabs | Kiem tra component render logic |
| Search input khong visible | Layout thay doi | Cap nhat selector |
