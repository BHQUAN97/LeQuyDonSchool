# LeQuyDon — Index tai lieu

> Danh muc tat ca tai lieu du an. Cap nhat: 2026-04-16

---

## Tai lieu goc (Root)

| File | Mo ta |
|------|--------|
| [`CLAUDE.md`](../CLAUDE.md) | Huong dan AI agent — quick start, key files, build & deploy, ports |
| [`.env.example`](../.env.example) | Mau bien moi truong (MySQL, Redis, Cloudflare R2, JWT...) |
| [`docker-compose.yml`](../docker-compose.yml) | Docker Compose chinh (dev + prod services) |
| [`docker-compose.dev.yml`](../docker-compose.dev.yml) | Docker Compose cho moi truong dev |
| [`docker-compose.prod.yml`](../docker-compose.prod.yml) | Docker Compose cho moi truong production |
| [`.lighthouserc.js`](../.lighthouserc.js) | Cau hinh Lighthouse CI (performance audit) |

---

## Tai lieu nghiep vu & ky thuat (`docs/`)

| File | Mo ta |
|------|--------|
| [`BUSINESS-FLOWS.md`](BUSINESS-FLOWS.md) | Luong nghiep vu toan dien — 15 muc: Auth, Users, Bai viet, Danh muc, Trang tinh, Media, Lien he, Su kien, Tuyen sinh, Menu, Tim kiem, Cai dat, Audit, Analytics, Public pages |
| [`DEPLOYMENT-GUIDE.md`](DEPLOYMENT-GUIDE.md) | Huong dan trien khai chi tiet — Local, Docker, Production VPS, DB migration/seed, Nginx, SSL, CI/CD, Backup, Monitoring, Troubleshooting |

---

## Constitution & SDD (`.sdd/`)

| File | Mo ta |
|------|--------|
| [`.sdd/constitution.md`](../.sdd/constitution.md) | Nguyen tac bat bien — KHONG duoc vi pham |

---

## Feature Specs & Plans (`.sdd/features/`)

### Backend Foundation
| File | Mo ta |
|------|--------|
| [`spec.md`](../.sdd/features/backend-foundation/spec.md) | Dac ta: NestJS setup, TypeORM, Auth, base modules |
| [`plan.md`](../.sdd/features/backend-foundation/plan.md) | Ke hoach trien khai |
| [`tasks.md`](../.sdd/features/backend-foundation/tasks.md) | Task list |
| [`workflow.md`](../.sdd/features/backend-foundation/workflow.md) | Workflow thuc hien |

### Public Layout & Homepage
| File | Mo ta |
|------|--------|
| [`spec.md`](../.sdd/features/public-layout-homepage/spec.md) | Dac ta: Layout cong khai, Homepage, Header, Footer |
| [`plan.md`](../.sdd/features/public-layout-homepage/plan.md) | Ke hoach trien khai |
| [`tasks.md`](../.sdd/features/public-layout-homepage/tasks.md) | Task list |
| [`workflow.md`](../.sdd/features/public-layout-homepage/workflow.md) | Workflow thuc hien |

### Public Pages
| File | Mo ta |
|------|--------|
| [`spec.md`](../.sdd/features/public-pages/spec.md) | Dac ta: Tin tuc, Su kien, Tuyen sinh, Lien he, FAQ, Tim kiem |
| [`plan.md`](../.sdd/features/public-pages/plan.md) | Ke hoach trien khai |
| [`tasks.md`](../.sdd/features/public-pages/tasks.md) | Task list |
| [`workflow.md`](../.sdd/features/public-pages/workflow.md) | Workflow thuc hien |

### Admin Layout & Dashboard
| File | Mo ta |
|------|--------|
| [`spec.md`](../.sdd/features/admin-layout-dashboard/spec.md) | Dac ta: Admin layout, Sidebar, Dashboard thong ke |
| [`plan.md`](../.sdd/features/admin-layout-dashboard/plan.md) | Ke hoach trien khai |
| [`tasks.md`](../.sdd/features/admin-layout-dashboard/tasks.md) | Task list |
| [`workflow.md`](../.sdd/features/admin-layout-dashboard/workflow.md) | Workflow thuc hien |

### Admin API Wiring
| File | Mo ta |
|------|--------|
| [`spec.md`](../.sdd/features/admin-api-wiring/spec.md) | Dac ta: Ket noi Admin UI voi Backend API |
| [`plan.md`](../.sdd/features/admin-api-wiring/plan.md) | Ke hoach trien khai |
| [`tasks.md`](../.sdd/features/admin-api-wiring/tasks.md) | Task list |
| [`workflow.md`](../.sdd/features/admin-api-wiring/workflow.md) | Workflow thuc hien |

### TipTap Editor
| File | Mo ta |
|------|--------|
| [`spec.md`](../.sdd/features/tiptap-editor/spec.md) | Dac ta: Rich text editor (TipTap) cho bai viet/trang |
| [`plan.md`](../.sdd/features/tiptap-editor/plan.md) | Ke hoach trien khai |
| [`tasks.md`](../.sdd/features/tiptap-editor/tasks.md) | Task list |
| [`workflow.md`](../.sdd/features/tiptap-editor/workflow.md) | Workflow thuc hien |

### Homepage Customizer
| File | Mo ta |
|------|--------|
| [`spec.md`](../.sdd/features/homepage-customizer/spec.md) | Dac ta: Tuy chinh Homepage tu Admin (sections, order, content) |
| [`plan.md`](../.sdd/features/homepage-customizer/plan.md) | Ke hoach trien khai |
| [`tasks.md`](../.sdd/features/homepage-customizer/tasks.md) | Task list |
| [`testcases.md`](../.sdd/features/homepage-customizer/testcases.md) | Test cases |
| [`workflow.md`](../.sdd/features/homepage-customizer/workflow.md) | Workflow thuc hien |

---

## Thiet ke (`ThietKe/`)

| Folder | Noi dung |
|--------|----------|
| `ThietKe/` | 40 mockup PNG (1.png — 40.png) tu website goc lequydonhanoi.edu.vn |

---

## Database

| File / Folder | Mo ta |
|---------------|--------|
| `db/changelog/_init/` | SQL migration init (directory-versioned) |
| `scripts/db-changelog.sh` | Script chay pending SQL migrations |
| `scripts/seed-data.sh` | Seed data day du (87KB) |
| `scripts/seed-prod.sh` | Seed data cho production |
| `scripts/seed-custom-demo.js` | Seed data demo tuy chinh |
| `scripts/seed-remaining.js` | Seed data bo sung |

---

## Scripts (`scripts/`)

| File | Mo ta |
|------|--------|
| [`deploy.sh`](../scripts/deploy.sh) | Script deploy len VPS |
| [`quick-deploy.sh`](../scripts/quick-deploy.sh) | Quick deploy 1 lenh |
| [`update-deploy.sh`](../scripts/update-deploy.sh) | Update va re-deploy |
| [`backup-mysql.sh`](../scripts/backup-mysql.sh) | Backup MySQL database |
| [`docker-cleanup.sh`](../scripts/docker-cleanup.sh) | Don dep Docker images/containers |
| [`monitor-disk.sh`](../scripts/monitor-disk.sh) | Giam sat dung luong disk |
| [`pre-launch-checklist.sh`](../scripts/pre-launch-checklist.sh) | Kiem tra truoc khi go-live |
| [`crontab.example`](../scripts/crontab.example) | Mau crontab (backup, cleanup, monitor) |

---

## Infrastructure

| File | Mo ta |
|------|--------|
| [`nginx/nginx.conf`](../nginx/nginx.conf) | Cau hinh Nginx chinh |
| [`nginx/conf.d/`](../nginx/conf.d/) | Nginx virtual host configs |
| [`infra/docker-compose.yml`](../infra/docker-compose.yml) | Docker Compose cho infra (MySQL, Redis, Nginx) |
| [`config/env`](../config/env) | Template bien moi truong cho deploy |

---

## CI/CD (`.github/`)

| Folder | Mo ta |
|--------|----------|
| `.github/workflows/` | GitHub Actions workflows |

---

## E2E Tests (`frontend/e2e/`)

| File | Pham vi |
|------|---------|
| `homepage.spec.ts` | Homepage layout, sections, responsive |
| `public-pages.spec.ts` | Cac trang cong khai: tin tuc, su kien, tuyen sinh |
| `public-contact.spec.ts` | Form lien he — validation, submit |
| `public-faq.spec.ts` | Trang FAQ — accordion, search |
| `public-search.spec.ts` | Tim kiem — keyword, filter, ket qua |
| `admin-auth.spec.ts` | Admin login/logout, session |
| `admin-pages.spec.ts` | Admin CRUD — bai viet, danh muc, trang, media |
| `category-tabs.spec.ts` | Tabs danh muc — chuyen tab, filter |
| `contact-edge-cases.spec.ts` | Lien he — edge cases, XSS, long input |
| `search-edge-cases.spec.ts` | Tim kiem — edge cases, special chars |
| `dynamic-pages.spec.ts` | Trang dong — slug routing, 404 |
| `cross-navigation.spec.ts` | Dieu huong lien trang — breadcrumb, back |
| `responsive-mobile.spec.ts` | Mobile responsive — menu, layout, touch |
| `accessibility.spec.ts` | WCAG accessibility — ARIA, keyboard, contrast |
