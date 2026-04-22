# ADR-0004: REST envelope `{ success, data, message, pagination? }`

- **Status**: accepted
- **Date**: 2026-03-20
- **Tags**: api, pattern

## Context

Frontend can xu ly response thong nhat (toast success/error, pagination). Neu moi endpoint return format khac → FE co switch case khong co hoi ket.

## Decision

**Global ResponseInterceptor** wrap moi response:

```json
{
  "success": true,
  "data": { ... },
  "message": "Thanh cong",
  "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

Error format:
```json
{
  "success": false,
  "data": null,
  "message": "Loi xac thuc",
  "statusCode": 401,
  "errors": [{ "field": "email", "message": "Email khong hop le" }]
}
```

### Enforcement
- `ResponseInterceptor` (global) — auto-wrap neu controller return object tru di co `success` field
- `AppExceptionFilter` (global) — error format chuan
- Status codes: 200/201/204/400/401/403/404/409/422/429/500

## Rationale

- FE helper `api.get<T>()` extract `data` field, unified error handling
- Pagination optional theo endpoint
- Tieng Viet `message` cho user-facing

## Consequences

### Tich cuc
- FE type safe: `ApiResponse<T>` generic
- Error handling 1 cho (axios interceptor)

### Tieu cuc
- Khong RFC 7807 standard (FashionEcom dung RFC 7807)
- Breaking change neu doi format → mitigation: version API neu can

## References

- `backend/src/common/interceptors/response.interceptor.ts`
- `backend/src/common/filters/app-exception.filter.ts`
