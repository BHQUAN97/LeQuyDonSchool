# ADR-0003: ULID thay vi UUID/auto-increment

- **Status**: accepted
- **Date**: 2026-03-20
- **Tags**: database, pattern

## Context

Truong data: articles, menus, events, navigation... cac table nhieu, nhieu relation. Can ID:
- Sortable theo thoi gian (list bai moi nhat)
- Unique across distributed (neu sau scale)
- URL-safe (ar/[id])

## Decision

**ULID** (Universally Unique Lexicographically Sortable Identifier) cho moi primary key:
- 26 ky tu base32
- 48-bit timestamp prefix + 80-bit random
- Column `id CHAR(26) NOT NULL PRIMARY KEY`
- Bat buoc validate o ParamPipe (`ULIDValidationPipe`) — sai format tra 400

## Rationale

- Sort by id = sort by creation → pagination tot hon UUID v4 random
- 26 char < 36 UUID → URL dep va DB nho hon
- Collision xac suat thap
- Compatible voi WebTemplate ADR-0002

## Consequences

### Tich cuc
- `/admin/articles?sort=id` = newest first, khong can index `createdAt` rieng
- API URL dep: `/articles/01HX3...`

### Tieu cuc
- 26 byte vs 4 byte int → storage tang
- JOIN slower hon int (chap nhan)

## References

- Same pattern trong: WebTemplate, VietNet2026
- `backend/src/common/pipes/ulid-validation.pipe.ts`
