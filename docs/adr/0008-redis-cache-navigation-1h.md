# ADR-0008: Redis cache navigation/settings TTL 1h, in-memory fallback

- **Status**: accepted
- **Date**: 2026-04-15
- **Tags**: performance, cache

## Context

Moi public page render → load navigation menu + site settings. 2 truy van SQL moi page. Voi 300 DAU x 5 pageview = 1500 pageview/day → 3000 query/day chi cho menu + settings.

Navigation rarely change (admin edit vai lan/thang). Settings cung hiem thay doi.

## Decision

Cache 2 resource o Redis voi TTL 1h:

```typescript
@Injectable()
export class NavigationService {
  async getPublicMenu() {
    return this.cache.wrap('nav:public-menu', async () => {
      return this.repo.find({ where: { active: true }, order: { order: 'ASC' } });
    }, 3600);  // 1h
  }

  async invalidate() {
    await this.cache.del('nav:public-menu');
  }
}
```

### Invalidation
- Admin save navigation → call `invalidate()`
- Tuong tu cho settings

### Fallback
- Redis down → `CacheModule` auto fallback to in-memory store
- App khong crash

## Rationale

- 1h TTL: admin save → cache invalidate ngay, TTL chi la safety net
- Redis share voi project khac (CROSS-0001) → khong cost them
- In-memory fallback → dev khong can Redis running

## Consequences

### Tich cuc
- Giam ~99% query menu + settings
- Response time page public giam 100-200ms

### Tieu cuc
- Khi Redis restart, first request slow (cache miss)
- Invalidation phai manual every admin mutation

### Rui ro
- **Missing invalidation** (admin save khong call invalidate) → user thay cu 1h → mitigation: test coverage

## References

- `backend/src/modules/navigation/navigation.service.ts`
- Related: CROSS-0001 (shared Redis)
