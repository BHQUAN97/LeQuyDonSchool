# LeQuyDon — Truong Tieu hoc Le Quy Don.

**Constitution:** `.sdd/constitution.md` — doc TRUOC khi lam bat ky viec gi.

## Quick Start
```bash
# Frontend
cd frontend && npm install && npm run dev  # http://localhost:3200

# Backend
cd backend && npm install && npm run start:dev  # http://localhost:4200

# Docker (production)
docker compose -f docker-compose.prod.yml up -d
```

## Ports

| Service | Dev | Docker Prod |
|---------|-----|-------------|
| Frontend (Next.js) | 3200 | 5200 (HTTP) / 5201 (HTTPS) |
| Backend (NestJS) | 4200 | 5202 |
| MySQL | 3306 | 3306 (internal) |
| Redis | 6379 | 6379 (internal) |

## AUTO MODE — QUYET DINH TU DONG

### TU DONG THUC HIEN (khong hoi):
- Doc bat ky file nao trong repo
- Chay: build, typecheck, lint, test
- Tao/sua file code trong src/
- Cai package npm (khong phai global)
- Doc .env.example (KHONG doc .env that)

### BAT BUOC HOI USER:
- Xoa file hoac thu muc
- Chay migration DB production
- SSH vao VPS / lenh tren server
- Deploy len production
- Thay doi .env production
- Xoa data trong DB
- Commit va push len git
- Bat ky hanh dong khong the hoan tac

## Key Files
- `.sdd/constitution.md` — Nguyen tac bat bien, doc TRUOC KHI lam viec
- `.sdd/features/` — Spec tung feature
- `ThietKe/` — 44 mockup PNG (1-44.png) tu website goc lequydonhanoi.edu.vn
- `frontend/` — Next.js 14 App Router + Tailwind + Shadcn
- `backend/` — NestJS 10 + TypeORM + MySQL

## Reference
- VietNet2026 (`E:\DEVELOP\VietNet2026`) — cung stack, tham khao architecture + patterns
- Website goc: lequydonhanoi.edu.vn

## Build & Deploy
```bash
# Build
cd frontend && npm run build
cd backend && npm run build

# Deploy (Docker)
docker compose -f docker-compose.prod.yml up -d
```

## Database
- MySQL 8.0 — schema managed by TypeORM migrations
- `npm run migration:generate -- -n MigrationName` (trong backend/)
- `npm run migration:run`
