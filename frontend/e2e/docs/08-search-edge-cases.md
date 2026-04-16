# 08. Search Edge Cases — Truong hop dac biet tim kiem

## Summary

Test cac truong hop dac biet cua search: tieng Viet co dau, HTML injection (XSS), query dai (180 chars), quick suggestion an sau khi da tim, clear + search lai, URL encode dac biet, debounce thuc te, hien thi so luong ket qua, va no results UI.

**File test:** `e2e/search-edge-cases.spec.ts`
**So test:** 9 (7 edge cases + 2 result display)
**Trang:** `/tim-kiem`

## Workflow

```
Edge Cases:
  "tuyen sinh" (tieng Viet co dau) → URL encode dung + hien ket qua
  "<script>alert(1)</script>" → khong execute, input van visible
  "abcdef" x 30 (180 chars) → khong crash, co response
  Click suggestion → suggestions section bien mat
  Fill query 1 → clear → fill query 2 → URL cap nhat
  ?q=%26%3D%3F (special chars) → khong crash
  Type nhanh (delay 50ms) → debounce fire → co response

Result Display:
  ?q=tuyen+sinh → "Tim thay X ket qua" HOAC "Khong tim thay"
  ?q=xyzabcdefghijklmnop → "Khong tim thay" + icon SVG + goi y "tu khoa khac"
```

## Chi tiet cac test case

### Edge Cases (7 tests)

**TC-01: search voi ky tu dac biet tieng Viet**
- Fill "tuyen sinh" (Unicode) → Enter → URL chua `q=`
- Ky vong: hien "ket qua" hoac "Khong tim thay" hoac "Dang tim"

**TC-02: search voi ky tu dac biet HTML**
- Fill `<script>alert(1)</script>` → Enter
- Ky vong: input van visible, `main script` count = 0

**TC-03: search voi query dai**
- Fill 180 chars → Enter
- Ky vong: trang khong crash, co response

**TC-04: quick suggestion an sau khi da tim**
- Click "Tuyen sinh" → cho 2s
- Ky vong: text "Tim kiem pho bien" bien mat

**TC-05: clear input va search lai**
- Fill "hoc tap" → Enter → clear → fill "su kien" → Enter
- Ky vong: URL chua "su"

**TC-06: URL encode dac biet**
- Goto `?q=%26%3D%3F` → trang khong crash

**TC-07: debounce thuc su hoat dong**
- `pressSequentially` "hoc tap ngoai khoa" (delay 50ms) → cho 2s
- Ky vong: co response (debounce fire 1 lan, khong nhieu lan)

### Result Display (2 tests)

**TC-08: ket qua search co so luong hien thi**
- Goto `?q=tuyen+sinh`
- Ky vong: `p:has-text("Tim thay")` HOAC `h3:has-text("Khong tim thay")` visible

**TC-09: no results hien thi icon va message**
- Goto `?q=xyzabcdefghijklmnop` (khong co ket qua)
- Ky vong: "Khong tim thay" visible + SVG icon + text "tu khoa khac"

## Ky thuat

- **XSS prevention:** Input value khong bi render thanh HTML — chi text
- **pressSequentially:** Simulate go phim thuc te voi delay 50ms giua moi ky tu
- **Debounce:** Search API chi goi sau 300ms ke tu ky tu cuoi cung
- **URL encoding:** Tieng Viet va special chars phai encode/decode dung

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| XSS execute | innerHTML thay vi textContent | Dung React JSX (tu escape) |
| Query dai crash | API khong handle | Them max length validation |
| Debounce khong fire | Delay qua ngan/dai | Kiem tra debounce timeout config |
| No results thieu icon | Component render loi | Kiem tra NoResults component |
