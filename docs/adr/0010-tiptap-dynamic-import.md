# ADR-0010: Tiptap dynamic import (bundle 87.5kB First Load)

- **Status**: accepted
- **Date**: 2026-04-12
- **Tags**: frontend, performance

## Context

Admin su dung rich text editor cho article/page. Tiptap day du extensions (bold, italic, heading, link, image, table, quote, list, code, undo) cung voi prosemirror = **~200KB gzipped**.

Neu import bundled vao admin chunk → First Load JS admin shell ~300KB → cham, nhat la mobile admin.

Public pages KHONG can editor → khong nen bundle.

## Decision

**Dynamic import** `RichTextEditorDynamic` wrapper:

```typescript
// frontend/src/components/admin/RichTextEditorDynamic.tsx
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <EditorSkeleton />
});
```

### Use site
```tsx
<RichTextEditorDynamic
  content={article.content}
  onChange={setContent}
/>
```

### Loading state
- Skeleton hien thi trong khi tai editor (~500ms lan dau)
- Subsequent admin pages khong reload (code split cached)

## Rationale

- First Load JS admin = 87.5kB (da do)
- Editor chi load khi user mo form edit article
- SSR false vi editor chi chay client-side

## Consequences

### Tich cuc
- Admin load fast cho nhung page khong can editor (dashboard, user list...)
- Public pages khong bi affected

### Tieu cuc
- 500ms skeleton lan dau user mo editor → acceptable (admin side)
- Component code di tu 2 chunk → phai verify tu code-split hoat dong

## References

- `frontend/src/components/admin/RichTextEditorDynamic.tsx`
- Related: WebTemplate ADR-0009 (Zustand over Redux — cung perf consideration)
