# 07. Search — Trang tim kiem

## Summary

Kiem tra trang tim kiem `/tim-kiem`: UI hien thi (input, nut tim), empty state truoc khi search, quick suggestions (Tuyen sinh, Hoc phi, Lich hoc...), click suggestion dien vao input, validation tu khoa ngan (< 2 ky tu), disabled button, URL param `?q=`, va submit bang Enter.

**File test:** `e2e/public-search.spec.ts`
**So test:** 8
**Trang:** `/tim-kiem`

## Workflow

```
/tim-kiem:
  → h1/h2 visible
  → Search input (text) + submit button
  → Empty state: "Nhap tu khoa" / "bat dau tim kiem"
  → Quick suggestions: Tuyen sinh, Hoc phi, Lich hoc, Thuc don, Ngoai khoa
  → Click suggestion → dien vao input
  → Input < 2 ky tu → button disabled, khong trigger search
  → ?q=tuyen+sinh → auto fill input + hien ket qua
  → Enter → submit + URL cap nhat ?q=...
```

## Chi tiet cac test case

**TC-01: trang tim kiem hien thi dung**
- h1/h2 visible, search input visible, submit button visible

**TC-02: empty state — chua tim kiem**
- Ky vong: text "Nhap tu khoa" hoac "bat dau tim kiem" visible

**TC-03: quick suggestions hien thi truoc khi tim**
- Ky vong: >= 3 suggestions tu: Tuyen sinh, Hoc phi, Lich hoc, Thuc don, Ngoai khoa

**TC-04: click quick suggestion dien vao o tim kiem**
- Click "Tuyen sinh" → input value = "Tuyen sinh"

**TC-05: nhap tu khoa qua ngan (< 2 ky tu) khong trigger search**
- Fill "a" → van con empty state visible

**TC-06: nut tim kiem disabled khi input < 2 ky tu**
- Fill "a" → submit button `isDisabled()` = true

**TC-07: search voi URL param ?q=**
- Goto `/tim-kiem?q=tuyen+sinh`
- Input value chua "tuyen"
- Cho 2s → hien "ket qua" hoac "Khong tim thay"

**TC-08: search form submit khi nhan Enter**
- Fill "hoc tap" → press Enter → URL chua `q=`

## Ky thuat

- **Quick suggestions:** Pre-defined keywords hien thi truoc khi user search
- **Debounce:** Search khong trigger ngay khi type, can cho delay
- **URL sync:** Query duoc sync 2 chieu voi URL param `?q=`
- **Min length:** Tu khoa phai >= 2 ky tu moi cho search

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Empty state khong hien | Text thay doi | Cap nhat regex |
| Suggestions < 3 | Bot suggestion hoac an | Kiem tra SearchPage component |
| Button khong disabled | Thieu logic min length | Them disabled khi query.length < 2 |
| URL khong cap nhat | Router push thieu | Kiem tra URL sync logic |
