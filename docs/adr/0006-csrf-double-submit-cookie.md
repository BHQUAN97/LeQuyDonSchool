# ADR-0006: CSRF double-submit cookie cho public form (admin exempt)

- **Status**: accepted
- **Date**: 2026-04-10
- **Tags**: security, auth

## Context

Public form (lien he, dang ky tuyen sinh) submit tu user chua auth → khong co JWT. Attacker co the CSRF tu domain khac.

Admin routes: auth qua JWT trong memory → browser khong auto-submit Authorization header → KHONG bi CSRF.

## Decision

### Public form: Double-submit cookie CSRF protection
- GET: set cookie `csrf-token` (random 32 byte)
- POST/PUT/DELETE: client gui lai qua header `x-csrf-token`
- Server so sanh timing-safe → match = pass
- Cookie sameSite `strict` → attacker khong the dat

### Admin routes: EXEMPT
- Access token trong memory (khong cookie)
- Browser khong auto-attach Authorization header
- CSRF khong ap dung

### Fallback
Neu tuong lai chuyen access token vao httpOnly cookie → CSRF middleware phai MO RONG cho admin routes.

## Rationale

- Stateless (khong can server store)
- Timing-safe chong side-channel attack
- Admin exempt tranh false positive (fetch() khong tu dong co CSRF)

## Consequences

### Tich cuc
- Public form secure
- Admin UX khong anh huong
- Standard pattern (OWASP)

### Tieu cuc
- Neu refactor auth → phai nho update CSRF scope
- API client (mobile) khong dung cookie → bi lock out form → mitigation: require API key thay CSRF

## References

- `backend/src/common/middleware/csrf.middleware.ts`
- Related: ADR-0002, ADR-0005
