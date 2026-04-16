# 12. Accessibility — Kiem tra kha nang truy cap

## Summary

Kiem tra accessibility co ban: lang attribute, so luong h1, alt tren images, form labels lien ket, login labels, links co href, buttons co text/aria-label, focus visible, FAQ content do dai, error message mau do noi bat, va login error visual feedback.

**File test:** `e2e/accessibility.spec.ts`
**So test:** 11 (9 basic + 2 color contrast)
**Trang:** `/`, `/lien-he`, `/admin/login`, `/tuyen-sinh/cau-hoi-thuong-gap`

## Workflow

```
Basic Checks:
  / → html[lang] = "vi" hoac "en"
  / → h1 count <= 3
  / → img[alt] !== null (20 img dau)
  /lien-he → label[for] match input id (5 fields)
  /admin/login → label[for="email"], label[for="password"]
  / → a[href] khong rong, khong = "#" (20 links dau)
  / → button co text, aria-label, hoac title (15 buttons dau)
  /lien-he → Tab 3 lan → :focus co outline hoac box-shadow
  /tuyen-sinh/cau-hoi-thuong-gap → main text > 200 chars + >= 3 dau "?"

Color Contrast:
  /lien-he → trigger error → .bg-red-50 co background color (khong transparent)
  /admin/login → error div co class mau do (.text-red-600, .bg-red-50)
```

## Chi tiet cac test case

### Basic Checks (9 tests)

**TC-01: trang chu co lang attribute**
- Ky vong: `html[lang]` match `/vi|en/`

**TC-02: trang chu co duy nhat 1 h1**
- Ky vong: h1 count <= 3 (cho phep nhieu hon cho homepage co sections)

**TC-03: tat ca img co alt attribute**
- Kiem tra 20 img dau tien
- Ky vong: `alt !== null` (co the la "" cho decorative images)

**TC-04: form inputs co label lien ket**
- 5 inputs: contact-name, contact-email, contact-address, contact-phone, contact-message
- Ky vong: moi input co `label[for="id"]` tuong ung

**TC-05: trang login — inputs co label**
- Ky vong: `label[for="email"]` va `label[for="password"]` visible

**TC-06: links phan biet duoc voi text thuong (co href)**
- 20 links dau tien
- Ky vong: href khong rong va khong = "#"

**TC-07: button co text hoac aria-label**
- 15 buttons dau tien
- Ky vong: text.length > 0 HOAC aria-label HOAC title

**TC-08: focus visible tren interactive elements**
- Tab 3 lan → kiem tra `:focus` element
- Ky vong: co outline hoac box-shadow (focus ring)
- Chi warn, khong fail test

**TC-09: trang FAQ — accordion co nhieu cau hoi**
- Main text > 200 chars
- Dau "?" >= 3 (co nhieu cau hoi)

### Color Contrast (2 tests)

**TC-10: error messages co mau do noi bat**
- Trigger validation error (ten = "A") → `.bg-red-50`
- Ky vong: backgroundColor khong phai transparent

**TC-11: login error co visual feedback**
- Kiem tra `.text-red-600, .text-red-700, .bg-red-50` ton tai trong markup
- Khong fail — chi kiem tra structure (error chi hien khi backend chay)

## Ky thuat

- **WCAG compliance:** Test co ban — khong phai full audit, nhung dam bao minimum
- **Alt attribute:** `alt=""` hop le cho decorative images (WCAG 1.1.1)
- **Label association:** `label[for]` phai match `input[id]` (WCAG 1.3.1)
- **Focus indicator:** outline hoac box-shadow (WCAG 2.4.7)
- **evaluate():** Dung `page.evaluate()` de doc computed styles (outline, box-shadow)

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Lang thieu | Chua set trong html tag | Them `lang="vi"` trong layout.tsx |
| Alt thieu | Next/Image khong co alt prop | Them alt prop cho moi Image component |
| Label thieu | Input khong co id match label | Them for/id association |
| Focus khong visible | CSS reset bo outline | Them focus-visible styles |
| Error khong noi bat | Thieu background color | Them bg-red-50 cho error div |
