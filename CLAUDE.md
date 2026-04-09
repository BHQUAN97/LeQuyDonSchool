# LeQuyDon — Truong Tieu hoc Le Quy Don.

## Quick Start
```bash
# Frontend
cd frontend && npm install && npm run dev  # http://localhost:3000

# Backend
cd backend && npm install && npm run start:dev  # http://localhost:4000

# Docker (production)
docker compose up -d
```

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
