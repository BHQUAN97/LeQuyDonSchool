# 02. Admin Auth — Xac thuc quan tri

## Summary

Kiem tra he thong xac thuc admin: login form UI, input validation, redirect khi chua dang nhap, xu ly sai mat khau, submit qua Enter, va disabled state khi loading. Backend can chay de test 1 so case (login sai, Enter submit, disabled button).

**File test:** `e2e/admin-auth.spec.ts`
**So test:** 10
**Trang:** `/admin`, `/admin/login`, 11 protected routes

## Workflow

```
User truy cap /admin (chua login)
  → Redirect ve /admin/login
    → Form: email input + password input + submit button
    → Logo "LQ" + ten "Le Quy Don" + text "Dang nhap quan tri"
    → Submit voi sai credentials → error message
    → Submit → button disabled (loading state)
    → Enter key → trigger submit

Protected routes (chua auth):
  /admin/articles, /admin/categories, /admin/users,
  /admin/settings, /admin/contacts, /admin/events,
  /admin/media, /admin/pages, /admin/admissions,
  /admin/navigation, /admin/profile
  → Tat ca redirect ve /admin/login
```

## Chi tiet cac test case

### Authentication (10 tests)

**TC-01: redirect ve login khi chua dang nhap**
- Goto `/admin` → URL phai match `/admin/login`

**TC-02: trang login hien thi form day du**
- Ky vong: Logo "LQ", ten truong "Le Quy Don", text "Dang nhap quan tri"
- Input `#email`, `#password`, button submit co text "Dang nhap"

**TC-03: input email co placeholder**
- Ky vong: placeholder chua "lequydon"

**TC-04: email input co type email**
- Ky vong: `type="email"` (browser validation)

**TC-05: password input co type password**
- Ky vong: `type="password"` (an mat khau)

**TC-06: login sai hien thi thong bao loi**
- **Can backend** — skip neu backend down
- Fill email/password sai → click submit
- Ky vong: button chuyen "Dang dang nhap", sau do hien error message
- Error match: `/sai|loi|error|invalid|khong dung|that bai/i`

**TC-07: cac trang admin quan trong redirect khi chua auth**
- 5 routes: articles, categories, users, settings, contacts
- Ky vong: tat ca redirect ve `/admin/login`

**TC-08: cac trang admin phu redirect khi chua auth**
- 6 routes: events, media, pages, admissions, navigation, profile
- Ky vong: tat ca redirect ve `/admin/login`

**TC-09: form submit khi nhan Enter**
- **Can backend** — skip neu backend down
- Fill form → press Enter tren password field
- Ky vong: trigger submit (hien loading hoac error)

**TC-10: nut dang nhap disabled khi dang loading**
- **Can backend** — skip neu backend down
- Click submit → button phai disabled trong luc API call

## Ky thuat

- **Backend check:** `isBackendAvailable()` — fetch `http://localhost:4200/api`, skip test neu 500 hoac unreachable
- **Skip graceful:** `test.skip(!backendUp, 'Backend khong chay — skip login test')`
- **Timeout:** Error message co the mat 10s de hien (API response time)

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Khong redirect | Middleware auth chua cau hinh | Kiem tra Next.js middleware |
| Form thieu fields | Component render loi | Kiem tra LoginForm component |
| Login sai khong hien error | Error state khong handle | Kiem tra error handling trong login logic |
| Button khong disabled | Missing loading state | Them disabled prop khi isLoading |
