# ADR-0009: App Router route groups `(public)` + `(admin)` tach layout

- **Status**: accepted
- **Date**: 2026-03-25
- **Tags**: frontend, architecture

## Context

22 public pages + 19 admin pages. Moi nhom co:
- Layout khac (public: header + footer truong; admin: sidebar + topbar)
- Data fetching khac (public SSR; admin CSR voi auth)
- SEO khac (public: og tag; admin: noindex)

Neu 1 layout chung → if/else moi noi → mess.

## Decision

**Next.js 14 App Router route groups**:

```
frontend/src/app/
├── (public)/
│   ├── layout.tsx           # header + footer truong
│   ├── page.tsx             # homepage
│   ├── tin-tuc/page.tsx     # news listing
│   ├── tin-tuc/[slug]/page.tsx
│   ├── tuyen-sinh/page.tsx
│   ├── lien-he/page.tsx
│   └── [...slug]/page.tsx   # catch-all CMS pages
└── (admin)/
    ├── layout.tsx           # sidebar + topbar + AuthProvider
    ├── login/page.tsx       # NGOAI dashboard layout
    ├── admin/
    │   ├── page.tsx         # dashboard
    │   ├── articles/page.tsx
    │   ├── menus/page.tsx
    │   └── ...
```

### Route groups `()` khong vao URL
- `(public)` → `/`, `/tin-tuc/...`
- `(admin)/admin/` → `/admin/*`

## Rationale

- Layout tach biet, khong if/else
- Folder grouping = directory look clean
- Next.js official pattern

## Consequences

### Tich cuc
- Maintain easy
- Add page moi: chi drop vao folder tuong ung
- SEO config per-group (noindex admin)

### Tieu cuc
- Moi route group co layout.tsx rieng → duplicate neu share gi

## References

- `frontend/src/app/(public)/layout.tsx`
- `frontend/src/app/(admin)/layout.tsx`
