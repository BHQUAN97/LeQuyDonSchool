# ADR-0002: JWT access 15m + refresh 7d (httpOnly cookie, token theft detection)

- **Status**: accepted
- **Date**: 2026-03-20
- **Tags**: security, auth

## Context

Admin-only CMS (khong co public user registration). 5 admin account, yeu cau bao mat cao (sua noi dung truong → phai chinh xac).

## Decision

- **Access token**: JWT 15 phut, memory (khong cookie)
- **Refresh token**: JWT 7 ngay, **httpOnly cookie**, bcrypt-hashed trong `refresh_token` table
- **Rotation**: moi lan refresh cap 2 token moi, revoke token cu
- **Token theft detection**: re-use refresh token da revoke → **revoke tat ca session user** (force re-login)
- **Cookie**: sameSite `strict` production, `lax` dev
- **Bcrypt rounds**: 12 (OWASP 2023+)

## Rationale

- 15m access giam thiet hai khi lo cookie (attack window ngan)
- httpOnly refresh → XSS khong doc duoc
- Theft detection: attacker reuse stolen refresh = tu loe

## Consequences

### Tich cuc
- OWASP compliant
- Session revoke instant (xoa refresh row)
- Audit trail: log ip + user_agent moi refresh token

### Tieu cuc
- User re-login moi 15m neu offline khi access expire
- Refresh token table grow → weekly cleanup cron

## Alternatives Considered

### Session cookie only
- **Nhuoc**: khong mobile-friendly (TODO app mobile trong tuong lai)

### 1 JWT 7d
- **Nhuoc**: stolen = 7d attack window

## References

- `backend/src/modules/auth/`
- Related: ADR-0005 (RolesGuard), ADR-0006 (CSRF)
