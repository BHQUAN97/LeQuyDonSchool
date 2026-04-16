# 05. Contact Form — Form lien he

## Summary

Kiem tra trang lien he `/lien-he`: hien thi thong tin lien he truong (dia chi, SDT), form 5 fields (ho ten, email, dia chi, SDT, noi dung), validation (ten qua ngan, email sai, noi dung ngan, SDT sai), required attributes, va Google Maps embed.

**File test:** `e2e/public-contact.spec.ts`
**So test:** 8
**Trang:** `/lien-he`

## Workflow

```
/lien-he:
  → Tieu de trang (h1/h2)
  → Thong tin: dia chi (Luu Huu Phuoc), SDT (024...), email
  → Form: #contact-name, #contact-email, #contact-address, #contact-phone, #contact-message
  → Submit button: "Gui"
  → Validation:
    - Ten < 2 ky tu → loi "2-100 ky tu"
    - Email khong hop le → browser validation (type=email)
    - Noi dung < 10 ky tu → loi "10-2000"
    - SDT sai format → loi "dien thoai"
  → Google Maps iframe embed
```

## Chi tiet cac test case

**TC-01: trang lien he hien thi day du**
- h1/h2 visible
- Body text chua: "024" hoac "Luu Huu Phuoc" hoac "lequydon" hoac "email"

**TC-02: form lien he co day du fields**
- 5 inputs visible: `#contact-name`, `#contact-email`, `#contact-address`, `#contact-phone`, `#contact-message`
- Submit button visible

**TC-03: form validation — ten qua ngan**
- Fill ten = "A" (1 ky tu) + fields khac hop le → submit
- Ky vong: error "2-100 ky tu" visible

**TC-04: form validation — email khong hop le**
- Fill email = "not-an-email"
- Ky vong: input co `type="email"` (browser tu validate)

**TC-05: form validation — noi dung qua ngan**
- Fill message = "Ngan" (4 ky tu) → submit
- Ky vong: error `.bg-red-50:has-text("10-2000")` visible

**TC-06: form validation — sdt khong hop le**
- Fill phone = "abc-not-phone" → submit
- Ky vong: error `.bg-red-50:has-text("dien thoai")` visible

**TC-07: form co cac truong required**
- Kiem tra `required` attribute tren: name, email, message

**TC-08: trang co Google Maps embed**
- Selector: `iframe[src*="google.com/maps"]`
- Ky vong: count >= 1

## Ky thuat

- **Error targeting:** Dung `.bg-red-50:has-text(...)` de chi target error div, tranh match label text
- **Browser validation:** Email dung `type="email"` nen browser tu validate truoc khi submit
- **Required fields:** Name, email, message la required; address va phone khong bat buoc co `required`

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Fields khong visible | Form component render loi | Kiem tra ContactForm component |
| Validation khong hien | Schema validation thay doi | Kiem tra Zod/Yup schema |
| Maps khong embed | iframe src thay doi | Cap nhat Google Maps URL |
| Error class khong match | CSS class doi ten | Cap nhat selector `.bg-red-50` |
