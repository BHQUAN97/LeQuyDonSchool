# ADR-0001: Stack — Next.js 14 + NestJS 10 + MySQL 8 + TypeORM + Redis + Cloudflare R2

- **Status**: accepted
- **Date**: 2026-03-15
- **Tags**: stack, architecture

## Context

School CMS: 22 public pages (news, admissions, food menus...), 19 admin pages. Traffic: 300 DAU, 5 admin. SEO critical (Google rank keyword "truong Le Quy Don").

## Decision

- **Frontend**: Next.js 14 App Router (SSR cho SEO), React 18, Tailwind CSS, shadcn/ui
- **Backend**: NestJS 10 (modular, decorator), TypeORM 0.3 (KHONG synchronize, dung migrations)
- **DB**: MySQL 8 (utf8mb4 cho tieng Viet + emoji)
- **Cache**: Redis 7 (navigation + settings), fallback in-memory
- **Storage**: Cloudflare R2 prod (S3-compatible), local disk dev
- **Framework reference**: giong WebTemplate/VietNet2026 → patterns tai su dung

## Rationale

- Next.js SSR = Google index content (khac SPA Vue phai render tay)
- NestJS decorator gan voi MISA convention (snake_case DB, REST envelope)
- MySQL 8 shared VPS voi project khac (CROSS-0001)
- R2 re hon AWS S3 ~80% cho dung luong 10-100GB

## Consequences

### Tich cuc
- SEO tot (SSR)
- Scale stateless API
- Shared infra = chi phi thap

### Tieu cuc
- Next.js 14 App Router con moi, ecosystem chua day du
- TypeORM performance kem hon Prisma cho complex query

## Alternatives Considered

### Astro + Node API
- **Nhuoc**: Astro tot cho blog nhung admin UI phuc tap kho

### WordPress
- **Nhuoc**: bao mat, khong tuy bien theo yeu cau truong

## References

- Related: WebTemplate ADR-0001 (same stack base)
