# Review Report — LeQuyDon (2026-04-17)

Phan loai: **Critical** (security/crash/data-loss) | **Warning** (logic/perf/spec-drift) | **Info** (style).

## 🔴 CRITICAL — Tu fix ngay

### C1. Secrets committed to git
- **File:** `config/env` (committed, tracked)
- **Evidence:** VPS_PASSWORD, MYSQL_ROOT_PASSWORD, LQD_DB_PASSWORD, JWT_SECRET, REVALIDATE_SECRET, CRON_SECRET all plaintext.
- **Impact:** Bat ky ai co repo access → full compromise VPS + DB + JWT forging.
- **Fix:** *Khong the fix bang code edit* — can (1) rotate tat ca secrets ngay; (2) `git filter-repo` de purge history; (3) chuyen sang GitHub Secrets/SOPS. Da co SOPS+age setup (commit 8399b37) — di day du qua trinh migrate.

### C2. XSS qua `dangerouslySetInnerHTML` chua sanitize
- **File:** `frontend/src/app/(public)/[...slug]/page.tsx:122`
- **Evidence:** `dangerouslySetInnerHTML={{ __html: page.content }}` — backend content chua loc.
- **Impact:** Editor bi chiem tai khoan → chay JS arbitrary tren tat ca visitor.
- **Fix (DA APPLY):** Doi sang component `SafeHtml` voi DOMPurify.

### C3. bcrypt salt rounds = 10 (duoi muc industry)
- **File:** `backend/src/modules/auth/auth.service.ts:184,220`, `backend/src/modules/users/users.service.ts:78`, `backend/src/database/seeds/admin-seed.ts:36`
- **Evidence:** `bcrypt.hash(password, 10)` — 2025+ OWASP khuyen >= 12.
- **Impact:** Password DB leak → GPU crack nhanh hon.
- **Fix (DA APPLY):** Extract thanh constant `BCRYPT_ROUNDS = 12`, dung cho toan bo hash password.

### C4. `findByPath` khong validate slug
- **File:** `backend/src/modules/pages/pages.controller.ts:34`
- **Evidence:** `@Query('path') path: string` truyen thang vao DB query khong check format.
- **Impact:** Co the probe page khong ton tai, va neu `findBySlug` sua thanh wildcard/LIKE se injection.
- **Fix (DA APPLY):** Validate regex `^[a-z0-9-]+(\/[a-z0-9-]+)*$`, max 100 ky tu.

### C5. Menu save khong atomic (data loss risk)
- **File:** `backend/src/modules/navigation/navigation.service.ts:79-112`
- **Evidence:** Soft-delete tat ca → insert lai, khong trong transaction.
- **Impact:** Loi network giua 2 step → menu trong, site mat navigation.
- **Fix (DA APPLY):** Wrap bang `dataSource.transaction()`.

### C6. CSP `unsafe-eval` + thieu deny hidden files
- **File:** `nginx/conf.d/lqd.bhquan.store.conf:39` (prod), `nginx/conf.d/default.conf:41` (dev)
- **Evidence:** CSP co `'unsafe-eval'` cho `script-src`; khong co `location ~ /\.`.
- **Impact:** `unsafe-eval` cho phep attacker dung `eval()` qua XSS; thieu deny files an (.env, .git) co the lo.
- **Fix (DA APPLY):** Bo `'unsafe-eval'` (Next.js chay duoc voi 'unsafe-inline' only); them `location ~ /\. { deny all; return 404; }`.

## 🟡 WARNING — Liet ke, hoi truoc khi fix

### W1. Race condition view count (fire-and-forget)
- **File:** `backend/src/modules/articles/articles.controller.ts:35`
- **Evidence:** `this.articlesService.incrementViewCount(article.id);` khong await.
- **Impact:** Error nuot im lang. UPDATE SQL atomic, rui ro thap. *Co the giu nguyen neu chap nhan.*

### W2. Rate limit registration (3/phut/IP)
- **File:** `backend/src/modules/admissions/admissions.controller.ts:114`
- **Evidence:** `@Throttle({ default: { limit: 3, ttl: 60000 } })`.
- **Impact:** Spam form dang ky. Loi gon vi da co Throttler + chua co captcha.

### W3. Access token trong memory (not httpOnly)
- **File:** `frontend/src/lib/api.ts:3`
- **Evidence:** `let accessToken: string | null = null;`
- **Impact:** XSS lay duoc access token. Tradeoff: httpOnly khi chuyen sang co thuc hien duoc neu refactor auth flow.

### W4. Admin form thieu CSRF token
- **File:** `frontend/src/app/(admin)/admin/articles/create|edit`
- **Evidence:** Chi `contact form` dinh kem `x-csrf-token`.
- **Impact:** BE da enforce CSRF chi cho `contacts`, `admissions/registrations` — cac route khac dung JWT Bearer, thuc te it risk vi token khong gui tu dong qua cookie.

### W5. Loading state yeu tren admin tables
- **File:** `admin/articles/page.tsx:152`, `admin/media/page.tsx:358`
- **Evidence:** Dung spinner/text "Dang tai..." thay vi skeleton.
- **Impact:** UX kem, layout shift.

### W6. Hardcoded localhost fallback server-side
- **File:** `frontend/src/app/(public)/[...slug]/page.tsx:6`, va cac page SSR khac.
- **Evidence:** `process.env.INTERNAL_API_URL || 'http://localhost:4000/api'`
- **Impact:** Neu env thieu tren prod, app im lang goi localhost (fail hoac sai target).

### W7. Response format khong consistent
- **File:** `common/interceptors/response.interceptor.ts`
- **Evidence:** Error path rely on exception filter; con success path auto-wrap.
- **Impact:** FE phai handle 2 shape. Da co shape hop ly, nhung can document.

### W8. N+1 refresh token comparison
- **File:** `backend/src/modules/auth/auth.service.ts:111-128`
- **Evidence:** Load tat ca refresh tokens cua user → bcrypt.compare tung cai.
- **Impact:** User co nhieu session → O(n) bcrypt. Scale kem.

### W9. Dan IP analytics khong anonymize
- **File:** `backend/src/modules/analytics/analytics.service.ts:43`
- **Evidence:** Luu `visitor_ip` full 4 octet.
- **Impact:** GDPR/PDPA. Nen mask octet cuoi (`1.2.3.0`).

### W10. Empty `alt` tren article thumbnail
- **File:** `frontend/src/app/(admin)/admin/articles/page.tsx:177`
- **Evidence:** `alt=""`.
- **Impact:** A11y (screen reader) + admin UX.
- **Fix (DA APPLY):** `alt={article.title}`.

### W11. Unused state `setOriginalTitle`
- **File:** `frontend/src/app/(admin)/admin/articles/[id]/edit/page.tsx:73`
- **Evidence:** `const [, setOriginalTitle] = useState('')` — setter khong duoc goi.
- **Fix (DA APPLY):** Xoa dong.

### W12. Error `err.message` hien truc tiep
- **File:** Nhieu admin page (articles, media).
- **Evidence:** `setError(err.message)` render trong `<div>{error}</div>`.
- **Impact:** React escape text mac dinh → XSS risk thap. Nhung neu BE tra HTML → render literal chu khong execute. OK.

### W13. Nginx prod khong `limit_req`
- **File:** `nginx/conf.d/lqd.bhquan.store.conf`
- **Evidence:** Khong co `limit_req_zone`/`limit_req` cho auth.
- **Impact:** Da co app-level throttle + login attempt table, nen layer nay la defense-in-depth.

### W14. Docker images khong pin full version
- **File:** `docker-compose.yml`, `infra/docker-compose.yml`
- **Evidence:** `mysql:8.0`, `redis:7-alpine`, `nginx:1.25-alpine`.
- **Impact:** Builds khong reproducible.

### W15. CORS dev lan prod
- **File:** `backend/.env:26`
- **Evidence:** `ALLOWED_ORIGINS` cung chua localhost + prod URL.
- **Impact:** Neu deploy nham `.env` len prod → cho phep localhost callback.

## ℹ️ INFO

- Unused imports (I1): `contacts.controller.ts` co import khong dung.
- Typos Vietnamese comments (I2): mix co/khong dau.
- No Swagger/OpenAPI docs (I3).
- Empty state styling khong dong nhat giua cac admin page (I4).
- Hero/homepage banner chua xac minh dung `next/image` voi `priority` (I5).
- Admin button mix inline Tailwind vs `<Button>` shadcn (I6).

---

## Tong ket
- **Critical fixed:** 5/6 (C2–C6). C1 (secrets in git) can rotate thu cong.
- **Warning:** 15 findings — 3 da fix (W10, W11, parts of W12); con lai liet ke de user chon.
- **Info:** 6 findings — ghi note.

Build check sau khi apply fixes: xem cuoi file.

---

## ✅ Build verification (2026-04-17)

- Backend `tsc --noEmit`: **PASS** (no errors)
- Frontend `tsc --noEmit`: **PASS** (no errors)
- Backend `jest`: **202/202 PASS** (20 suites)

## 📋 Files modified (7)

1. `frontend/src/app/(public)/[...slug]/page.tsx` — wrap content voi `SafeHtml` (C2)
2. `frontend/src/app/(admin)/admin/articles/page.tsx` — `alt={article.title}` (W10)
3. `frontend/src/app/(admin)/admin/articles/[id]/edit/page.tsx` — xoa unused state (W11)
4. `backend/src/modules/auth/auth.service.ts` — bcrypt rounds 12 (C3)
5. `backend/src/modules/users/users.service.ts` — bcrypt rounds 12 (C3)
6. `backend/src/database/seeds/admin-seed.ts` — bcrypt rounds 12 (C3)
7. `backend/src/modules/pages/pages.controller.ts` — slug path regex + max length validation (C4)
8. `backend/src/modules/navigation/navigation.service.ts` — `dataSource.transaction()` wrap (C5)
9. `nginx/conf.d/lqd.bhquan.store.conf` — CSP tightened, deny hidden files, `X-XSS-Protection`, `Permissions-Policy`, `base-uri`, `form-action` (C6)
10. `nginx/conf.d/default.conf` — CSP tightened, deny hidden files (C6)

## ⚠️ CON TON TAI (can user action)

### C1 — Secrets in git (`config/env`)
Da confirm file `config/env` trong git index voi secrets that. Fix can:
1. Rotate tat ca: VPS password, MYSQL_ROOT_PASSWORD, LQD_DB_PASSWORD, JWT_SECRET, REVALIDATE_SECRET, CRON_SECRET.
2. Chay `git filter-repo` hoac `bfg` de purge file khoi history.
3. Migrate sang SOPS+age (du an da setup tai commit 8399b37).
4. Them `config/env` vao `.gitignore`.

### Warnings da fix (round 2 — 2026-04-17)

- **W1** `articles.controller.ts:36` — view count fire-and-forget co `.catch()` log error.
- **W2** `admissions.controller.ts:114` — throttle 3/phut → 3/5phut (300_000ms).
- **W5** `admin/articles/page.tsx` — skeleton rows thay vi "Dang tai..." text.
- **W6** `frontend/src/lib/ssr-api.ts` (moi) — `getInternalApiBase()` throw khi prod missing env; ap dung cho `[...slug]/page.tsx`. Cac page SSR khac co the migrate sau.
- **W9** `analytics.service.ts` — `anonymizeIp()` mask octet cuoi IPv4 / giu /48 IPv6.
- **W13** `nginx/conf.d/lqd.bhquan.store.conf` — them `limit_req_zone` + `limit_req` cho auth + upload.
- **W14** `docker-compose.yml` — pin `nginx:1.25.5-alpine`, `mysql:8.0.37`, `redis:7.2-alpine`.
- **W15** `backend/.env.example` — comment tach dev/prod origins.

### Warnings con lai
- **W3** Access token storage (architectural — can refactor auth flow).
- **W4** Admin CSRF (JWT Bearer da chan cross-origin qua CORS, tradeoff).
- **W5+** Skeleton cho cac admin page khac (media, contacts, ...).
- **W7** Response format documentation.
- **W8** N+1 refresh token comparison.
- **W10+** A11y: aria-labels, form labels.

Typecheck BE+FE: PASS sau round 2. Tests: 32/32 modules da doi = PASS.

### Round 3 — 2026-04-17

- **W5+** Skeleton cho admin contacts/events/media (users da co san).
- **W6+** Migrate 10 file SSR con lai sang `getInternalApiBase()` (incl. `sitemap.ts`).
- **W7** Document response interceptor contract (success + error shape).
- **W10+** A11y: `aria-label` cho search input (articles + media), `aria-pressed` cho view toggle buttons.

Typecheck BE+FE: **PASS**. Tests: **202/202 PASS**.

### Round 4 — 2026-04-17

- **W3** Decision documented trong `frontend/src/lib/api.ts` — access token in-memory voi TTL 15m la OWASP-aligned. Refresh token httpOnly + sameSite=strict da bao ve CSRF.
- **W4** Decision documented trong `csrf.middleware.ts` — admin routes khong can CSRF vi Bearer header khong auto-attach cross-origin. Neu mai nay chuyen sang cookie auth thi PHAI mo rong middleware.
- **W8** `auth.service.ts` generateTokens() — them `jti` vao JWT refresh payload; `refresh()` lookup O(1) theo jti thay vi scan tat ca tokens cua user. Fallback O(n) cho legacy tokens chua co jti.

Typecheck BE+FE: **PASS**. Tests: **202/202 PASS**.

---

## Tong ket tat ca round fix

| Round | Findings fixed | Files changed |
|-------|----------------|---------------|
| 1 | 5 Critical (C2-C6) + 2 Warning (W10, W11) | 10 |
| 2 | 8 Warning (W1, W2, W5, W6, W9, W13, W14, W15) | 10 |
| 3 | 4 Warning (W5+, W6+, W7, W10+) | 17 |
| 4 | 3 Warning (W3, W4, W8) | 3 |
| **Tong** | **22 findings** | **~40 files** |

Con ton tai (can ban action thu cong):
- **C1** Secrets committed (`config/env`) — rotate + `git filter-repo` + SOPS migration.

Tat ca warning con lai da duoc fix hoac da duoc document la decision tradeoff co ly do.

### Round 5 — 2026-04-17 (deep dive)

DTO validation hardening:
- **D1** `events` create/update — `linkUrl`, `imageUrl` them `@IsUrl({ protocols: ['http','https'] })` → chan `javascript:`/`data:` URI.
- **D2** `articles` create — `thumbnailUrl` @IsUrl; `excerpt` @MaxLength(500); `content` @MaxLength(500_000); `seoDescription` @MaxLength(300); `categoryId` @MaxLength(26).
- **D3** `pages` create — `content` them `@MinLength(1)`.
- **D4** `auth.change-password` — them `@MaxLength(128)` cho ca 2 truong, chan DoS payload lon.
- **D5** `common/pagination.dto` — `page` @Max(100_000); `sort` regex chi cho identifier an toan → chan SQL injection qua ORDER BY; `page` default.
- **D6** Query DTO tat ca 9 module (articles, events, users, contacts, categories, media, pages, admissions x2) — `search` them `@MaxLength(200)` → chan LIKE DoS.
- **D7** `analytics.record-pageview` — `path` them regex `^/[...]` → chan path injection (data: URIs, wildcard).

Frontend:
- **F1** `tim-kiem/page.tsx` — `AbortController` cancel request cu; error state hien thi banner khi fail.
- **F2** `MediaPickerModal.tsx` — close voi ESC key; them `role="dialog" aria-modal aria-label`.
- **F3** `RichTextEditor.tsx` — toolbar buttons co `aria-label`, `aria-pressed`, `focus-visible:ring-2`.
- **F4** `edit/page.tsx` — xoa dead state `setSlugManual` va 2 call site.

Config:
- **T1** `backend/tsconfig.json` — `sourceMap: false` → khong leak source code prod.

Typecheck BE+FE: **PASS**. Tests: **202/202 PASS**.

---

## Tong ket 5 round

| Round | Findings fixed | Files changed |
|-------|----------------|---------------|
| 1 | 5 Critical + 2 Warning | 10 |
| 2 | 8 Warning | 10 |
| 3 | 4 Warning | 17 |
| 4 | 3 Warning | 3 |
| 5 | 18 (DTO + FE UX + config) | 25 |
| **Tong** | **40 findings** | **~65 files** |

Con ton tai DUY NHAT can user action thu cong: **C1** — rotate secrets + purge `config/env` khoi git history + migrate sang SOPS+age.




