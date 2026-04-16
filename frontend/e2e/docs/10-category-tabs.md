# 10. Category Tabs & Articles — Tabs danh muc va danh sach bai viet

## Summary

Kiem tra he thong tabs danh muc tin tuc (Hoc tap, Su kien, Ngoai khoa), active state cua tab, navigate giua tabs, danh sach article cards (tuyen sinh thong tin, thuc don, CLB), card content (title, date), va sidebar related content.

**File test:** `e2e/category-tabs.spec.ts`
**So test:** 9 (4 category tabs + 4 article list + 1 sidebar)
**Trang:** `/tin-tuc/hoc-tap`, `/tin-tuc/su-kien`, `/tin-tuc/ngoai-khoa`, `/tuyen-sinh/thong-tin`, `/tuyen-sinh/clb-ngoi-nha-mo-uoc`, `/dich-vu-hoc-duong/thuc-don`

## Workflow

```
Category Tabs:
  /tin-tuc/hoc-tap → 3 tabs (Su kien, Ngoai khoa, Hoc tap) >= 2 visible
  /tin-tuc/su-kien → tab "Su kien" co active class (green/active/white)
  /tin-tuc/ngoai-khoa → h1/h2 + articles/cards > 0
  /tin-tuc/hoc-tap → click tab "Su kien" → navigate den /tin-tuc/su-kien

Article List:
  /tuyen-sinh/thong-tin → article cards >= 1
  /tuyen-sinh/thong-tin → first card co text > 5 chars
  /dich-vu-hoc-duong/thuc-don → articles/cards >= 1
  /tuyen-sinh/clb-ngoi-nha-mo-uoc → main text > 100 chars

Sidebar:
  /tin-tuc/hoc-tap → aside/sidebar (co the an tren mobile)
```

## Chi tiet cac test case

### Category Tabs (4 tests)

**TC-01: hoc tap page — co 3 category tabs**
- Selector: links `/tin-tuc/su-kien`, `/tin-tuc/ngoai-khoa`, `/tin-tuc/hoc-tap`
- Ky vong: count >= 2

**TC-02: su kien page — tab su kien active**
- Tim `a[href*="/tin-tuc/su-kien"]` → kiem tra class chua "green", "active", hoac "white"
- Ghi warn neu khong co active state (co the la bug UI)

**TC-03: ngoai khoa page — co articles hoac placeholder**
- h1/h2 visible
- Articles count (article + card + links tin-tuc) > 0

**TC-04: click tab chuyen trang dung**
- `/tin-tuc/hoc-tap` → click tab "Su kien" → URL chua `/tin-tuc/su-kien`

### Article List (4 tests)

**TC-05: tuyen sinh thong tin — co article cards**
- Ky vong: cards (article, [class*="card"], links tin-tuc) >= 1

**TC-06: article card co title va date**
- First card visible → card text length > 5

**TC-07: thuc don page — co danh sach thuc don**
- h1/h2 visible + cards >= 1

**TC-08: CLB ngoi nha mo uoc — co noi dung**
- h1/h2 visible + main text > 100 chars

### Sidebar (1 test)

**TC-09: trang tin tuc co sidebar**
- Selector: `aside, [class*="sidebar"], [class*="sticky"]`
- Chi kiem tra tren desktop (sidebar co the an tren mobile)

## Ky thuat

- **Active tab detection:** Kiem tra CSS class (green, active, white) vi khong co `aria-current`
- **Flexible card selectors:** Dung nhieu selector ket hop: article, [class*="card"], a[href*="/tin-tuc/"]
- **Mobile caveat:** Sidebar co the an tren mobile viewport → chi assert khi count > 0
- **Wait 2s:** Cho data load tu API truoc khi count cards

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Tabs < 2 | Layout thay doi | Cap nhat tab selectors |
| Tab khong active | Thieu active class CSS | Them conditional class cho current route |
| Cards = 0 | API khong tra data | Kiem tra backend + seed data |
| Sidebar khong thay | CSS responsive an | Kiem tra breakpoint CSS |
