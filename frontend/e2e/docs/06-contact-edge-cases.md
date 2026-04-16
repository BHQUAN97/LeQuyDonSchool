# 06. Contact Edge Cases — Boundary & Edge Cases cho form lien he

## Summary

Test cac truong hop bien (boundary) va dac biet cua form lien he: ten tieng Viet co dau, ten dung 2 ky tu (min), noi dung dung 10 ky tu (min), SDT format quoc te, SDT co ngoac, noi dung chi spaces, ten chi spaces, submit button loading state, email phuc tap co subdomain.

**File test:** `e2e/contact-edge-cases.spec.ts`
**So test:** 9
**Trang:** `/lien-he`

## Workflow

```
Boundary testing:
  Ten "Nguyen Van Binh" (tieng Viet co dau) → khong co loi
  Ten "AB" (dung 2 ky tu = min) → khong co loi
  Noi dung "1234567890" (dung 10 ky tu = min) → khong co loi
  SDT "+84 987 654 321" (quoc te) → khong co loi
  SDT "(024) 6287-2079" (ngoac) → khong co loi

Invalid edge cases:
  Noi dung "         " (chi spaces) → loi validation (trim)
  Ten "   " (chi spaces) → loi validation (trim)

UX:
  Submit → button disabled/loading state
  Email "user@mail.example.co.vn" → khong loi
```

## Chi tiet cac test case

**TC-01: ten voi ky tu dac biet hop le**
- Fill: "Nguyen Van Binh" (tieng Viet Unicode)
- Ky vong: KHONG co validation error

**TC-02: ten dung 2 ky tu (min boundary)**
- Fill: "AB" (boundary = 2)
- Ky vong: KHONG co error `.bg-red-50:has-text("2-100")`

**TC-03: noi dung dung 10 ky tu (min boundary)**
- Fill: "1234567890" (boundary = 10)
- Ky vong: KHONG co error `.bg-red-50:has-text("10-2000")`

**TC-04: sdt voi format quoc te hop le**
- Fill: "+84 987 654 321"
- Ky vong: KHONG co error "dien thoai"

**TC-05: sdt voi format ngoac hop le**
- Fill: "(024) 6287-2079"
- Ky vong: KHONG co error "dien thoai"

**TC-06: noi dung chi co spaces khong hop le**
- Fill: "         " (9 spaces)
- Ky vong: error "10-2000" visible (trim → rong → fail)

**TC-07: ten chi co spaces khong hop le**
- Fill: "   " (3 spaces)
- Ky vong: error "2-100" visible (trim → rong → fail)

**TC-08: submit button disabled khi dang loading**
- Fill form hop le → click submit → kiem tra button text/state
- Ky vong: button text thay doi (co the la "Dang gui...")

**TC-09: email format hop le phuc tap**
- Fill: "user@mail.example.co.vn" (subdomain)
- Ky vong: KHONG co email validation error

## Ky thuat

- **Boundary testing:** Test dung gia tri min (2 ky tu ten, 10 ky tu noi dung)
- **Trim validation:** Server/client trim spaces truoc khi validate → "   " thanh ""
- **Phone regex:** Chap nhan: +84, ngoac (), dau gach, khoang trang
- **Wait 2s:** Cho API response hoac validation render

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Tieng Viet bi reject | Regex khong support Unicode | Sua validation regex |
| Min boundary fail | Schema min value thay doi | Cap nhat test value |
| Spaces khong bi reject | Thieu trim() truoc validate | Them .trim() trong schema |
| Phone format reject | Regex qua strict | Mo rong phone regex pattern |
