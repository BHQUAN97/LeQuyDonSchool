# ADR-0007: Cloudflare R2 production, local disk dev (graceful fallback)

- **Status**: accepted
- **Date**: 2026-04-10
- **Tags**: storage, infra

## Context

Can storage cho media (anh banner, article image, icon...). Options:
- Local disk: re, nhung khong scale, backup phu thuoc server
- AWS S3: standard, dat
- Cloudflare R2: S3-compatible, **khong egress fee**, re 80%

Dev local khong can R2 setup phuc tap → can fallback.

## Decision

### Production: Cloudflare R2
- AWS SDK v3 (S3 client) + R2 endpoint
- Bucket `lqd-media`
- Key format: `media/YYYY/MM/<ulid>.<ext>` → partition time
- Sharp 0.34 processing: thumb 150px, preview 800px, original
- Public URL qua Cloudflare CDN

### Dev: Local disk fallback
- `R2Service` detect `process.env.R2_ACCESS_KEY_ID` empty → switch `LocalDiskProvider`
- Store `./uploads/` → serve qua `/uploads/*` static middleware
- Khong error startup neu thieu R2 config → warn log

## Rationale

- Dev nhanh (khong can setup R2 account)
- Prod: R2 egress free = tiet kiem khi serve nhieu anh
- Pattern dong: Interface `StorageProvider` → swap duoc

## Consequences

### Tich cuc
- Dev onboard nhanh (khong can credential)
- Prod serve anh tu CDN = fast
- Graceful degrade khi R2 down = fallback local (neu setup dual-write)

### Tieu cuc
- Code luong (2 provider)
- Migration dev → prod: dev anh khong tu dong sync → acceptable (dev data disposable)

## References

- `backend/src/modules/media/r2.service.ts`
- WebPhoto cung dung pattern nay voi dual-backend
