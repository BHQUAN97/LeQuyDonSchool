# LeQuyDon — Architecture Decision Records

> School CMS (truong Le Quy Don). Next.js 14 + NestJS 10 + MySQL 8 + TypeORM + Redis + Cloudflare R2.

## Index

- [ADR-0001](0001-stack-next-nest-mysql.md) — Stack: Next.js 14 + NestJS 10 + MySQL 8 + TypeORM + Redis + R2
- [ADR-0002](0002-jwt-15m-7d-cookie.md) — JWT access 15m + refresh 7d (httpOnly cookie, token theft detection)
- [ADR-0003](0003-ulid-primary-key.md) — ULID thay vi UUID/auto-increment
- [ADR-0004](0004-rest-envelope-format.md) — REST envelope `{ success, data, message, pagination? }`
- [ADR-0005](0005-roles-guard-default-deny.md) — RolesGuard default-deny (thieu @Roles() → 403)
- [ADR-0006](0006-csrf-double-submit-cookie.md) — CSRF double-submit cookie cho public form (admin exempt)
- [ADR-0007](0007-cloudflare-r2-production.md) — Cloudflare R2 production, local disk dev (graceful)
- [ADR-0008](0008-redis-cache-navigation-1h.md) — Redis cache navigation/settings TTL 1h, in-memory fallback
- [ADR-0009](0009-route-groups-public-admin.md) — App Router route groups `(public)` + `(admin)`
- [ADR-0010](0010-tiptap-dynamic-import.md) — Tiptap dynamic import (bundle 87.5kB First Load)

## Cross-cutting ADRs

Xem `.claude-shared/adr/cross/`:
- CROSS-0001: Shared VPS (demo.remoteterminal.online)
- CROSS-0003: SOPS+age
- CROSS-0004: SSH key ed25519
