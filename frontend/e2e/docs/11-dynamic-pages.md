# 11. Dynamic Pages, Performance & Security — Trang dong, hieu nang, bao mat

## Summary

3 nhom test: (1) Dynamic pages — catch-all slug xu ly 404, slug nhieu cap, ky tu dac biet, tieng Viet; (2) Performance — 4 trang chinh load trong 10s; (3) Security — XSS qua search input, contact form, va URL injection.

**File test:** `e2e/dynamic-pages.spec.ts`
**So test:** 11 (4 dynamic + 4 performance + 3 security)
**Trang:** URL dong, `/`, `/lien-he`, `/tim-kiem`, `/admin/login`

## Workflow

```
Dynamic Pages:
  /trang-khong-co-abc-xyz → 404 status hoac "khong tim thay"
  /trang/khong/ton/tai/abc (nhieu cap) → 404
  /abc%20def%3Cscript%3E (encoded chars) → status < 500
  /gioi-thieu-truong (tieng Viet URL) → status < 500

Performance (budget 10s):
  / → domcontentloaded < 10s
  /lien-he → domcontentloaded < 10s
  /tim-kiem → domcontentloaded < 10s
  /admin/login → domcontentloaded < 10s

Security (XSS):
  /tim-kiem?q=<img src=x onerror=alert(1)> → khong render img[src="x"]
  /lien-he → fill XSS vao name + message → khong render img[onerror]
  /tim-kiem?q="><script>alert(1)</script> → input van visible
```

## Chi tiet cac test case

### Dynamic Pages (4 tests)

**TC-01: trang dong khong ton tai → 404**
- Goto `/trang-khong-co-abc-xyz`
- Ky vong: status 404 HOAC UI "khong tim thay"

**TC-02: slug nhieu cap khong ton tai → 404**
- Goto `/trang/khong/ton/tai/abc` (4 cap)
- Ky vong: status 404 HOAC UI "khong tim thay"

**TC-03: slug voi ky tu dac biet khong crash**
- Goto `/abc%20def%3Cscript%3E` (URL-encoded)
- Ky vong: status < 500 (khong server error)

**TC-04: slug co dau tieng Viet khong crash**
- Goto `/gioi-thieu-truong` (UTF-8 URL)
- Ky vong: status < 500

### Performance (4 tests)

**TC-05: trang chu load trong 10 giay**
- Do: `Date.now()` truoc va sau `page.goto('/', { waitUntil: 'domcontentloaded' })`
- Ky vong: loadTime < 10000ms

**TC-06: trang lien he load trong 10 giay**
- Ky vong: loadTime < 10000ms

**TC-07: trang tim kiem load trong 10 giay**
- Ky vong: loadTime < 10000ms

**TC-08: trang admin login load trong 10 giay**
- Ky vong: loadTime < 10000ms

### Security — XSS (3 tests)

**TC-09: search input khong render HTML**
- Goto `/tim-kiem?q=<img src=x onerror=alert(1)>`
- Ky vong: `img[src="x"]` count = 0

**TC-10: contact form khong render HTML trong error**
- Fill name: `<img src=x onerror=alert(1)>`
- Fill message: `<script>alert(1)</script> noi dung test`
- Submit → kiem tra: `main img[onerror]` count = 0
- Input value giu nguyen text `<img` (khong render HTML)

**TC-11: URL injection khong anh huong trang**
- Goto `/tim-kiem?q="><script>alert(1)</script>`
- Ky vong: search input van visible (trang khong bi pha)

## Ky thuat

- **Catch-all route:** Next.js `[...slug]` xu ly tat ca URL khong match route cu the
- **Performance budget:** 10s la muc chap nhan cho local dev (production nen < 3s)
- **XSS prevention:** React tu dong escape HTML trong JSX — test dam bao khong dung `dangerouslySetInnerHTML`
- **URL encoding:** Playwright tu encode URL — test voi ca encoded va raw chars

## Giai phap khi fail

| Loi | Nguyen nhan thuong gap | Cach fix |
|-----|----------------------|----------|
| Slug crash (500) | Catch-all route throw | Them try/catch trong page component |
| Load > 10s | Server cham / API blocking | Profile va optimize SSR |
| XSS render | Dung dangerouslySetInnerHTML | Chuyen sang text content hoac sanitize |
| URL injection | Query khong escape | Dung encodeURIComponent |
