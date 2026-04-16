# 13. Cross Navigation — Dieu huong xuyen trang

## Summary

Test cac user flow xuyen nhieu trang: trang chu → tin tuc, tin tuc → su kien → ngoai khoa, tuyen sinh → FAQ, search → lien he, lien he → mailto/tel links, breadcrumb navigation, 404 co link home, tat ca trang con khong bi 500, va admin redirect khong bi loop.

**File test:** `e2e/cross-navigation.spec.ts`
**So test:** 10 (7 user flows + 3 error handling)
**Trang:** Tat ca trang public + admin

## Workflow

```
User Flows:
  / → click link tin-tuc/hoc-tap → chuyen trang thanh cong
  /tin-tuc/su-kien → /tin-tuc/ngoai-khoa (navigate truc tiep)
  /tuyen-sinh/thong-tin → click FAQ link → /tuyen-sinh/cau-hoi-thuong-gap
  /tim-kiem → nhap "tuyen sinh" → Enter → URL ?q= → navigate /lien-he
  /lien-he → mailto link co "@"
  /lien-he → tel link match /tel:\+?\d/
  /tuyen-sinh/cau-hoi-thuong-gap → breadcrumb "Trang chu" → click → ve /

Error Handling:
  404 page → co link a[href="/"] (ve trang chu)
  9 trang con → tat ca status < 500
  /admin → redirect /admin/login → khong redirect tiep (no loop)
```

## Chi tiet cac test case

### User Flows (7 tests)

**TC-01: flow: trang chu → tin tuc hoc tap**
- `/` → tim link `a[href*="/tin-tuc"]` → click → URL match tin-tuc/hoc-tap

**TC-02: flow: trang tin tuc → navigate den su kien**
- `/tin-tuc/su-kien` → h1/h2 visible
- Navigate tiep `/tin-tuc/ngoai-khoa` → h1/h2 visible

**TC-03: flow: trang tuyen sinh → chuyen giua thong tin va FAQ**
- `/tuyen-sinh/thong-tin` → tim link "cau-hoi-thuong-gap" → click → URL match

**TC-04: flow: search page va quay lai**
- `/tim-kiem` → fill "tuyen sinh" → Enter → URL chua `q=`
- Navigate sang `/lien-he` → URL chua "lien-he"

**TC-05: flow: lien he → click email link**
- `/lien-he` → `a[href^="mailto:"]` → href chua "@"

**TC-06: flow: lien he → click so dien thoai**
- `/lien-he` → `a[href^="tel:"]` → href match `/tel:\+?\d/`

**TC-07: breadcrumb navigation hoat dong**
- `/tuyen-sinh/cau-hoi-thuong-gap` → breadcrumb link `a[href="/"]` → click → URL match `/`

### Error Handling (3 tests)

**TC-08: 404 page co link ve trang chu**
- `/trang-khong-ton-tai-xyz-abc` → `a[href="/"]` count >= 1

**TC-09: trang con khong bi loi 500**
- 9 URLs: hoc-tap, su-kien, ngoai-khoa, tuyen-sinh/thong-tin, FAQ, CLB, lien-he, tim-kiem, thuc-don
- Ky vong: tat ca status < 500

**TC-10: admin redirect khong bi loop**
- `/admin` → redirect `/admin/login` → cho 2s → van o `/admin/login` (khong redirect lai `/admin`)

## Ky thuat

- **Conditional click:** `if (await link.isVisible())` — skip neu link khong co (flexible layout)
- **waitForLoadState:** Dung `networkidle` cho navigation, `domcontentloaded` cho page check
- **Status assertion:** `response?.status()` kiem tra HTTP status code
- **Loop detection:** Goto `/admin` → wait redirect → wait 2s → confirm URL khong thay doi

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Link khong visible | Layout thay doi | Cap nhat selector |
| Redirect loop | Middleware logic sai | Fix auth middleware condition |
| Status 500 | Server error tren route | Kiem tra page component + API |
| Breadcrumb khong click | aria-label thay doi | Cap nhat breadcrumb selector |
| mailto/tel thieu | Chua add link | Them mailto/tel links trong ContactInfo |
