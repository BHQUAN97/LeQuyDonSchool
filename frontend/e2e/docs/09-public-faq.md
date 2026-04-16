# 09. FAQ Page — Trang cau hoi thuong gap

## Summary

Kiem tra trang FAQ tuyen sinh `/tuyen-sinh/cau-hoi-thuong-gap`: hien thi dung (breadcrumb), accordion co it nhat 5 cau hoi, click mo/dong cau tra loi, chi 1 accordion mo tai 1 thoi diem, va noi dung lien quan den tuyen sinh (tuyen sinh, lop 1, ho so).

**File test:** `e2e/public-faq.spec.ts`
**So test:** 5
**Trang:** `/tuyen-sinh/cau-hoi-thuong-gap`

## Workflow

```
/tuyen-sinh/cau-hoi-thuong-gap:
  → h1/h2 visible + breadcrumb (Trang chu / Tuyen sinh)
  → Accordion: >= 5 cau hoi (default 8)
  → Click cau hoi 1 → hien cau tra loi (expand)
  → Click cau hoi 2 → cau 1 dong lai, cau 2 mo
  → Icon: "+" (dong), "−" (mo)
  → Noi dung: tuyen sinh, lop 1, ho so
```

## Chi tiet cac test case

**TC-01: trang FAQ hien thi dung**
- h1/h2 visible
- Breadcrumb chua "Trang chu" hoac "Tuyen sinh"

**TC-02: co it nhat 5 cau hoi trong accordion**
- Selector: `[class*="cursor-pointer"], button:has-text("?"), [role="button"]`
- Ky vong: count >= 5

**TC-03: click mo accordion hien thi cau tra loi**
- Click cau hoi dau tien → cho 300ms
- Ky vong: parent/grandparent co them `p, div` visible (cau tra loi)

**TC-04: click cau hoi khac se dong cau truoc**
- Click cau 1 → click cau 2 → cho 300ms
- Ky vong: cau 2 co icon "−" (dang mo)
- Chi 1 accordion mo tai 1 thoi diem

**TC-05: FAQ content co cac chu de tuyen sinh**
- Body text chua it nhat 1 trong: "tuyen sinh", "lop 1", "ho so"

## Ky thuat

- **Accordion pattern:** Click toggle → expand/collapse voi animation
- **Single open:** Chi 1 item mo tai 1 thoi diem (dong item truoc khi mo item moi)
- **Icon indicator:** "+" = dong, "−" = mo
- **DOM traversal:** Dung `.locator('..')` de navigate len parent/grandparent tim noi dung

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Cau hoi < 5 | Bot FAQ hoac chua seed data | Kiem tra FAQ data source |
| Click khong expand | Accordion JS loi | Kiem tra click handler |
| Ca 2 deu mo | Khong implement single-open | Them logic dong item cu truoc khi mo moi |
| Icon khong doi | CSS/state khong cap nhat | Kiem tra icon toggle logic |
