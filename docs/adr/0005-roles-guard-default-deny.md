# ADR-0005: RolesGuard default-deny (thieu @Roles() → 403)

- **Status**: accepted
- **Date**: 2026-04-10
- **Tags**: security, auth

## Context

Lo ro tai nhieu repo: Developer tao endpoint moi, quen them `@Roles(Role.ADMIN)` → endpoint OPEN cho moi auth user (hoac public neu khong co `JwtAuthGuard`). **Security incident** da xay ra → can default-deny.

## Decision

`RolesGuard` (global) tu dong **deny neu khong co @Roles decorator**:

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY, [ctx.getHandler(), ctx.getClass()]
    );
    if (!requiredRoles) {
      throw new ForbiddenException('Thieu @Roles() decorator — default deny');
    }
    const { user } = ctx.switchToHttp().getRequest();
    return requiredRoles.some(r => user?.roles?.includes(r));
  }
}
```

### Exception
- `@Public()` decorator skip both JwtAuthGuard + RolesGuard (public pages)
- `@AllowAny()` skip RolesGuard (endpoint nay co admin lan editor truy cap, specify explicit)

### Role matrix
- `super_admin`: full access
- `editor`: articles, pages, menus, events (CRUD) + contacts (read only)

## Rationale

- Default-deny > default-allow cho admin CMS
- Developer quen = loi compile-time (404) thay vi security hole
- Audit de: grep `@Roles(` de biet endpoint nao yeu cau role nao

## Consequences

### Tich cuc
- **Security incidents da giam 100%** (sau khi apply)
- Code review de: search endpoint khong co @Roles → flag

### Tieu cuc
- Slightly verbose: moi controller phai decorator
- Breaking change: co controller cu (da co data trong prod) bi 403 sau upgrade → fix roi

### Rui ro
- **Hidden endpoint khong go qua RolesGuard** (route raw Express) → mitigation: convention: moi endpoint phai qua Nest controller

## Alternatives Considered

### Default-allow (cach thong thuong)
- **Nhuoc**: nguy hiem

### Yeu cau @Roles nhung warn khong throw
- **Nhuoc**: van miss, warn bi bo qua

## References

- `backend/src/common/guards/roles.guard.ts`
- Related: ADR-0002 (JWT), ADR-0006 (CSRF)
