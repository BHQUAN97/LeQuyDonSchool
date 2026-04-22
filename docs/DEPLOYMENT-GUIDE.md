# LeQuyDon — Huong Dan Trien Khai Chi Tiet

> Truong Tieu hoc Le Quy Don — He thong CMS
> Stack: Next.js 14 + NestJS 10 + MySQL 8.0 + Redis 7 + Nginx + Docker
> Cap nhat: 2026-04-16

---

## Muc luc

1. [Tong quan Kien truc](#1-tong-quan-kien-truc)
2. [Yeu cau He thong](#2-yeu-cau-he-thong)
3. [Bien Moi truong (Environment Variables)](#3-bien-moi-truong)
4. [Trien khai Local (Development)](#4-trien-khai-local-development)
5. [Trien khai Docker (Development)](#5-trien-khai-docker-development)
6. [Trien khai Production (VPS)](#6-trien-khai-production-vps)
7. [Database — Migration & Seed](#7-database--migration--seed)
8. [Nginx Configuration](#8-nginx-configuration)
9. [SSL/HTTPS](#9-sslhttps)
10. [CI/CD Pipeline](#10-cicd-pipeline)
11. [Backup & Restore](#11-backup--restore)
12. [Monitoring & Health Check](#12-monitoring--health-check)
13. [Troubleshooting](#13-troubleshooting)
14. [Port Map & Resource Limits](#14-port-map--resource-limits)

---

## 1. Tong quan Kien truc

### Deployment Architecture

```
                         Internet
                            |
                     ┌──────▼──────┐
                     │   Nginx     │  SSL termination
                     │  :80/:443   │  Reverse proxy, Gzip, Rate limit
                     └──────┬──────┘
                            |
               ┌────────────┼────────────┐
               |                         |
          ┌────▼─────┐             ┌─────▼────┐
          │ Frontend  │             │ Backend  │
          │ Next.js   │  ────────▶  │ NestJS   │
          │ :3000     │  (API call) │ :4000    │
          │ SSR+Static│             │ REST API │
          └───────────┘             └────┬─────┘
                                        |
                             ┌──────────┼──────────┐
                             |                     |
                        ┌────▼────┐          ┌─────▼────┐
                        │ MySQL   │          │  Redis   │
                        │ 8.0     │          │  7       │
                        │ :3306   │          │  :6379   │
                        └─────────┘          └──────────┘
                             |
                        ┌────▼─────┐
                        │Cloudflare│  Media storage
                        │   R2     │  (optional, fallback local)
                        └──────────┘
```

### Docker Container Map

```
┌─────────────────────────────────────────────────────┐
│                    VPS (Production)                   │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │         shared-nginx (webphoto_frontend)     │    │
│  │         Port 80/443 → Internet               │    │
│  └─────────┬──────────────────────┬─────────────┘    │
│            │                      │                  │
│  ┌─────────▼─────────┐  ┌───────▼──────────┐       │
│  │   lqd-frontend    │  │    lqd-api       │       │
│  │   Port 3200→3000  │  │   Port 4200→4000 │       │
│  │   (lqd_frontend)  │  │ (lqd_frontend +  │       │
│  └───────────────────┘  │  webphoto_backend)│       │
│                          └───────┬──────────┘       │
│                                  │                  │
│  ┌───────────────────────────────┼──────────┐       │
│  │        webphoto_backend network          │       │
│  │  ┌─────────────┐  ┌───────────────┐     │       │
│  │  │ shared-mysql │  │ shared-redis  │     │       │
│  │  │ MySQL 8.0    │  │ Redis 7       │     │       │
│  │  └──────────────┘  └───────────────┘     │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

### Thanh phan chinh

| Thanh phan | Vai tro | Image |
|------------|---------|-------|
| **Nginx** | Reverse proxy, SSL, gzip, rate limit, cache | `nginx:1.25-alpine` |
| **Frontend** | SSR web app, SEO | `node:20-alpine` (standalone) |
| **Backend** | REST API, business logic | `node:20-alpine` + PM2 (2 instances) |
| **MySQL** | Database chinh | `mysql:8.0` |
| **Redis** | Cache, session, rate limit | `redis:7-alpine` |

---

## 2. Yeu cau He thong

### Development (Local)

| Yeu cau | Phien ban |
|---------|-----------|
| Node.js | 20 LTS |
| npm | 9+ |
| MySQL | 8.0 (hoac Docker) |
| Redis | 7 (hoac Docker) |
| Git | 2.30+ |

### Production (VPS)

| Yeu cau | Toi thieu | Khuyen nghi |
|---------|-----------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB SSD | 40 GB SSD |
| OS | Ubuntu 22.04 | Ubuntu 22.04 |
| Docker | 24+ | Latest |
| Docker Compose | v2+ | Latest |

### Resource Limits (Production)

| Service | CPU | Memory |
|---------|-----|--------|
| Backend | 1.0 | 2 GB |
| Frontend | 1.0 | 2 GB |
| MySQL (shared) | 0.5 | 2 GB |
| Redis (shared) | 0.5 | 1 GB |
| **Tong** | **3.0** | **7 GB** |

---

## 3. Bien Moi truong

### 3.1 Root `.env` (Docker Compose)

```bash
# === DATABASE ===
MYSQL_ROOT_PASSWORD=<strong-random-password>
MYSQL_PASSWORD=<strong-random-password>
DB_HOST=mysql                    # Container name (Docker) hoac localhost (local)
DB_PORT=3306
DB_USERNAME=lqd
DB_PASSWORD=<same-as-MYSQL_PASSWORD>
DB_NAME=lqd

# === REDIS ===
REDIS_HOST=redis                 # Container name (Docker) hoac localhost (local)
REDIS_PORT=6379

# === JWT (BAT BUOC) ===
JWT_SECRET=<min-32-ky-tu-random>         # KHONG duoc chua "change-this" trong production
JWT_EXPIRATION=900                        # 15 phut
REFRESH_TOKEN_EXPIRATION=604800           # 7 ngay

# === CLOUDFLARE R2 (Optional) ===
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=
R2_BUCKET_NAME=lequydon-public
R2_PUBLIC_URL=https://cdn.lequydon.edu.vn

# === ADMIN SEED ===
ADMIN_EMAIL=admin@lequydon.edu.vn
ADMIN_PASSWORD=<strong-password>

# === FRONTEND ===
NEXT_PUBLIC_API_URL=https://demo.remoteterminal.online/api
NEXT_PUBLIC_SITE_URL=https://demo.remoteterminal.online
INTERNAL_API_URL=http://backend:4000/api     # Server-side only

# === REVALIDATION ===
REVALIDATE_SECRET=<random-secret>
NEXT_REVALIDATE_URL=http://frontend:3000

# === PORTS (Dev only) ===
FRONTEND_PORT=3200
BACKEND_PORT=4200
MYSQL_PORT=3308
REDIS_PORT=6381
NGINX_HTTP_PORT=5200
NGINX_HTTPS_PORT=5201

# === BACKUP ===
MYSQL_BACKUP_PASSWORD=<same-as-DB_PASSWORD>
```

### 3.2 Backend `.env` (Local dev)

```bash
LQD_PORT=4200
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=lequydon
DB_PASSWORD=lequydon_dev
DB_NAME=lequydon
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=dev-secret-change-this-in-production-min-32-chars
JWT_EXPIRATION=900
REFRESH_TOKEN_EXPIRATION=604800
ADMIN_EMAIL=admin@lequydon.edu.vn
ADMIN_PASSWORD=Admin@123456
ALLOWED_ORIGINS=http://localhost:3200
```

### 3.3 Frontend `.env` (Local dev)

```bash
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SITE_URL=http://localhost:3200
INTERNAL_API_URL=http://localhost:4200/api
PREVIEW_SECRET=change-me-to-a-random-secret
REVALIDATE_SECRET=change-me-to-a-random-secret
```

### 3.4 Validation khi khoi dong

Backend tu dong validate khi start:
- **BAT BUOC**: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
- **Production check**: `JWT_SECRET` KHONG duoc chua `"change-this"`
- Thieu → app crash voi error message ro rang

---

## 4. Trien khai Local (Development)

### Buoc 1: Clone & Cai dat

```bash
git clone https://github.com/BHQUAN97/LeQuyDon.git
cd LeQuyDon

# Backend
cd backend
cp .env.example .env           # Chinh sua .env theo moi truong
npm install

# Frontend
cd ../frontend
cp .env.example .env           # Chinh sua .env
npm install
```

### Buoc 2: Chuan bi Database

```bash
# Option A: MySQL local (da cai san)
mysql -u root -p
> CREATE DATABASE lequydon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> CREATE USER 'lequydon'@'localhost' IDENTIFIED BY 'lequydon_dev';
> GRANT ALL PRIVILEGES ON lequydon.* TO 'lequydon'@'localhost';
> FLUSH PRIVILEGES;

# Option B: Dung Docker chi cho MySQL + Redis
docker run -d --name lqd-mysql -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=lequydon \
  -e MYSQL_USER=lequydon \
  -e MYSQL_PASSWORD=lequydon_dev \
  mysql:8.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

docker run -d --name lqd-redis -p 6379:6379 redis:7-alpine
```

### Buoc 3: Migration & Seed

```bash
cd backend

# Chay migration
npm run migration:run

# Seed data (THEO THU TU)
npm run seed:admin                    # 1. Tao Super Admin (BAT BUOC truoc)
npm run seed:content                  # 2. Categories, articles, pages, settings, nav
npm run seed:categories-articles      # 3. 8 parent + 17 child categories, 25 articles
npm run seed:events                   # 4. 25 events
npm run seed:contacts-settings-nav    # 5. 25 contacts, settings, menu
npm run seed:media                    # 6. 25 media records
npm run seed:pages-p1                 # 7. Pages Part 1 (9 pages)
npm run seed:pages-p2                 # 8. Pages Part 2 (9 pages)
npm run seed:pages-p3                 # 9. Pages Part 3 (9 pages)
npm run seed:admissions               # 10. Admission posts, FAQ, registrations
```

> **Luu y:** Tat ca seeds deu idempotent — chay lai nhieu lan an toan, tu dong skip neu da ton tai.

### Buoc 4: Khoi dong

```bash
# Terminal 1: Backend
cd backend
npm run dev                    # http://localhost:4200

# Terminal 2: Frontend
cd frontend
npm run dev                    # http://localhost:3200
```

### Kiem tra

| URL | Ket qua mong doi |
|-----|------------------|
| `http://localhost:3200` | Trang chu public |
| `http://localhost:3200/admin/login` | Trang dang nhap admin |
| `http://localhost:4200/api/health` | `{ "status": "ok" }` |

---

## 5. Trien khai Docker (Development)

### Buoc 1: Chuan bi

```bash
cd LeQuyDon
cp .env.example .env           # Chinh sua .env
```

### Buoc 2: Khoi dong tat ca services

```bash
# Cach 1: All-in-one (bao gom Nginx)
docker compose up -d

# Cach 2: Development mode (hot reload, ko Nginx)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Buoc 3: Doi services healthy

```bash
# Xem trang thai
docker compose ps

# Doi cho tat ca healthy
docker compose ps --format "table {{.Name}}\t{{.Status}}"

# Xem logs neu co loi
docker compose logs backend -f
docker compose logs frontend -f
```

### Buoc 4: Migration & Seed (trong container)

```bash
# Chay migration
docker compose exec backend npm run migration:run

# Seed data
docker compose exec backend npm run seed:admin
docker compose exec backend npm run seed:content
docker compose exec backend npm run seed:categories-articles
docker compose exec backend npm run seed:events
docker compose exec backend npm run seed:contacts-settings-nav
docker compose exec backend npm run seed:media
docker compose exec backend npm run seed:pages-p1
docker compose exec backend npm run seed:pages-p2
docker compose exec backend npm run seed:pages-p3
docker compose exec backend npm run seed:admissions
```

### Port Map (Development Docker)

| Service | Host Port | Container Port | URL |
|---------|-----------|---------------|-----|
| Frontend | 3200 | 3000 | `http://localhost:3200` |
| Backend | 4200 | 4000 | `http://localhost:4200/api` |
| MySQL | 3308 | 3306 | `mysql -h localhost -P 3308` |
| Redis | 6381 | 6379 | `redis-cli -p 6381` |
| Nginx (HTTP) | 5200 | 80 | `http://localhost:5200` |
| Nginx (HTTPS) | 5201 | 443 | `https://localhost:5201` |

### Hot Reload

Development Docker mount source code:
- `./backend/src` → `/app/src` (backend container)
- `./frontend/src` → `/app/src` (frontend container)

Thay doi code → tu dong reload, khong can rebuild.

---

## 6. Trien khai Production (VPS)

### 6.1 Chuan bi VPS

```bash
# SSH vao VPS
ssh root@143.198.217.127

# Cap nhat he thong
apt update && apt upgrade -y

# Cai Docker (neu chua co)
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin -y

# Tao thu muc
mkdir -p /opt/lqd /opt/infra /opt/webphoto
```

### 6.2 Setup Shared Infrastructure

MySQL va Redis duoc chia se giua cac apps (LeQuyDon, WebPhoto).

```bash
# Tao shared network
docker network create webphoto_backend

# File: /opt/infra/docker-compose.yml
```

```yaml
# /opt/infra/docker-compose.yml
version: "3.8"
services:
  mysql:
    image: mysql:8.0
    container_name: shared-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    command: >
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_unicode_ci
      --innodb-buffer-pool-size=256M
      --max-connections=100
      --slow-query-log=1
      --slow-query-log-file=/var/log/mysql/slow.log
      --long-query-time=2
    volumes:
      - shared_mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 2G
    networks:
      - webphoto_backend

  redis:
    image: redis:7-alpine
    container_name: shared-redis
    restart: unless-stopped
    command: >
      redis-server
      --maxmemory 128mb
      --maxmemory-policy noeviction
      --appendonly yes
    volumes:
      - shared_redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 1G
    networks:
      - webphoto_backend

volumes:
  shared_mysql_data:
  shared_redis_data:

networks:
  webphoto_backend:
    external: true
```

```bash
# Khoi dong shared services
cd /opt/infra
docker compose up -d

# Tao database cho LeQuyDon
docker exec shared-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "
  CREATE DATABASE IF NOT EXISTS lqd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'lqd'@'%' IDENTIFIED BY '${DB_PASSWORD}';
  GRANT ALL PRIVILEGES ON lqd.* TO 'lqd'@'%';
  FLUSH PRIVILEGES;
"
```

### 6.3 Deploy LeQuyDon

```bash
cd /opt/lqd

# Clone hoac upload source
git clone https://github.com/BHQUAN97/LeQuyDon.git .

# Tao .env tu template
cp .env.example .env
nano .env                      # Chinh sua tat ca env vars (xem Section 3)

# Tao network rieng cho frontend
docker network create lqd_frontend
```

### 6.4 Build & Start

```bash
cd /opt/lqd

# Build images
docker compose -f docker-compose.prod.yml build --no-cache

# Start services
docker compose -f docker-compose.prod.yml up -d

# Xem logs
docker compose -f docker-compose.prod.yml logs -f
```

### 6.5 Migration & Seed (Production)

```bash
# Chay migration
docker exec lqd-api npm run migration:run:prod

# Seed data (production scripts)
docker exec lqd-api npm run seed:admin:prod
docker exec lqd-api npm run seed:content:prod
docker exec lqd-api npm run seed:categories-articles:prod
docker exec lqd-api npm run seed:events:prod
docker exec lqd-api npm run seed:contacts-settings-nav:prod
docker exec lqd-api npm run seed:media:prod
docker exec lqd-api npm run seed:pages-p1:prod
docker exec lqd-api npm run seed:pages-p2:prod
docker exec lqd-api npm run seed:pages-p3:prod
docker exec lqd-api npm run seed:admissions:prod
```

### 6.6 Verify

```bash
# Health checks
curl -s http://localhost:4200/api/health
# → {"status":"ok","timestamp":"..."}

curl -s http://localhost:3200
# → HTML trang chu

# Container status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### 6.7 Production docker-compose.prod.yml

```yaml
version: "3.8"
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: lqd-api
    restart: unless-stopped
    ports:
      - "4200:4000"
    environment:
      NODE_ENV: production
      DB_HOST: shared-mysql
      DB_PORT: 3306
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      REDIS_HOST: shared-redis
      REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: ${JWT_EXPIRATION}
      REFRESH_TOKEN_EXPIRATION: ${REFRESH_TOKEN_EXPIRATION}
      ALLOWED_ORIGINS: ${NEXT_PUBLIC_SITE_URL}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      R2_ACCESS_KEY_ID: ${R2_ACCESS_KEY_ID}
      R2_SECRET_ACCESS_KEY: ${R2_SECRET_ACCESS_KEY}
      R2_ENDPOINT: ${R2_ENDPOINT}
      R2_BUCKET_NAME: ${R2_BUCKET_NAME}
      R2_PUBLIC_URL: ${R2_PUBLIC_URL}
    volumes:
      - lqd_uploads:/app/uploads
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:4000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 2G
    networks:
      - webphoto_backend
      - lqd_frontend

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
        INTERNAL_API_URL: http://lqd-api:4000/api
    container_name: lqd-frontend
    restart: unless-stopped
    ports:
      - "3200:3000"
    environment:
      NODE_ENV: production
      INTERNAL_API_URL: http://lqd-api:4000/api
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 2G
    networks:
      - lqd_frontend

volumes:
  lqd_uploads:

networks:
  webphoto_backend:
    external: true
  lqd_frontend:
    external: true
```

---

## 7. Database — Migration & Seed

### 7.1 Migration Files

| # | File | Noi dung |
|---|------|---------|
| 1 | `1712534400000-InitialSchema.ts` | users, refresh_tokens, login_attempts |
| 2 | `1712620800000-AddAllModules.ts` | categories, articles, media, pages, settings, contacts, events, admissions, menu_items |
| 3 | `1712707200000-AddAnalyticsTables.ts` | page_views, page_events |
| 4 | `1712707200000-AddAppLogs.ts` | app_logs |
| 5 | `1712793600000-AddAdminActions.ts` | admin_actions |

**Tong cong: 18 tables**

### 7.2 Migration Commands

```bash
# Development (TypeScript)
cd backend
npm run migration:run              # Chay tat ca migrations pending
npm run migration:generate         # Tao migration moi tu entity changes

# Production (Compiled JavaScript)
npm run migration:run:prod
```

### 7.3 Seed Order (QUAN TRONG)

```
seed:admin (BAT BUOC chay truoc — tao Super Admin)
    |
    ├── seed:content (categories, articles, pages, events, settings, nav)
    ├── seed:categories-articles (8 parent + 17 child categories, 25 articles)
    ├── seed:events (25 events: 8 past, 5 ongoing, 12 upcoming)
    ├── seed:contacts-settings-nav (25 contacts, settings, navigation)
    ├── seed:media (25 media records)
    ├── seed:pages-p1 (9 pages — Part 1)
    ├── seed:pages-p2 (9 pages — Part 2)
    ├── seed:pages-p3 (9 pages — Part 3)
    └── seed:admissions (admission posts, FAQs, registrations)
```

> **Tat ca seeds deu idempotent**: kiem tra ton tai truoc khi insert (by email, slug, filename, title). An toan khi chay lai nhieu lan.

### 7.4 Seed Content Chi tiet

| Seed | So luong | Noi dung |
|------|---------|---------|
| admin | 1 | Super Admin (tu ADMIN_EMAIL env) |
| categories-articles | 25 cats + 25 articles | 8 parent, 17 child categories; 25 articles phan bo |
| events | 25 | 8 PAST, 5 ONGOING, 12 UPCOMING |
| contacts-settings-nav | 25 + settings + menu | 25 contacts (NEW/READ/RESOLVED), site settings, menu tree |
| media | 25 | Image records voi picsum.photos URLs |
| pages-p1/p2/p3 | 27 | 27 trang tinh voi rich HTML content |
| admissions | posts + FAQs + regs | Bai dang tuyen sinh, Q&A, don dang ky |

### 7.5 Tao Migration Moi

```bash
cd backend

# 1. Sua entity file (VD: src/modules/articles/article.entity.ts)
# 2. Tao migration tu dong
npm run migration:generate -- -n AddNewField

# 3. Review migration file trong src/database/migrations/
# 4. Chay migration
npm run migration:run
```

---

## 8. Nginx Configuration

### 8.1 Rate Limiting

```nginx
# Zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/s;
limit_req_zone $binary_remote_addr zone=upload_limit:10m rate=5r/s;

# Ap dung
/api/auth/*         → auth_limit   burst=10 nodelay
/api/*/upload       → upload_limit burst=5 nodelay
/api/*              → api_limit    burst=50 nodelay
```

### 8.2 Micro-cache (API)

```nginx
proxy_cache_path /tmp/api_cache levels=1:2 keys_zone=api_cache:10m
                 max_size=100m inactive=1m;

# Chi cache GET requests
# Bypass khi co Authorization header
# Cache 1 giay — giam tai cho backend khi traffic cao
```

### 8.3 Gzip Compression

```nginx
gzip on;
gzip_comp_level 6;
gzip_min_length 256;
gzip_types text/plain text/css application/json application/javascript
           text/xml application/xml image/svg+xml font/woff2;
```

### 8.4 Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; ..." always;
```

### 8.5 Locations

| Path | Upstream | Dac biet |
|------|----------|---------|
| `/` | frontend:3000 | SSR pages |
| `/api/auth/*` | backend:4000 | Rate limit 5r/s, no cache |
| `/api/*/upload` | backend:4000 | Max 20MB, timeout 120s |
| `/api/*` | backend:4000 | Micro-cache GET, rate limit 30r/s |
| `/uploads/*` | backend:4000 | Static files, cache 30d |
| `/_next/static/*` | frontend:3000 | Cache 365d, immutable |
| `/socket.io/` | backend:4000 | WebSocket, timeout 86400s |

---

## 9. SSL/HTTPS

### 9.1 Let's Encrypt (Production)

```bash
# Cai certbot
apt install certbot -y

# Lay certificate (dung standalone mode)
certbot certonly --standalone -d demo.remoteterminal.online

# Hoac dung webroot (nginx dang chay)
certbot certonly --webroot -w /var/www/html -d demo.remoteterminal.online

# Certificate luu tai:
# /etc/letsencrypt/live/demo.remoteterminal.online/fullchain.pem
# /etc/letsencrypt/live/demo.remoteterminal.online/privkey.pem
```

### 9.2 Nginx SSL Config

```nginx
server {
    listen 443 ssl http2;
    server_name demo.remoteterminal.online;

    ssl_certificate /etc/letsencrypt/live/demo.remoteterminal.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/demo.remoteterminal.online/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
}

# HTTP → HTTPS redirect
server {
    listen 80;
    server_name demo.remoteterminal.online;

    location /.well-known/acme-challenge/ {
        root /var/www/html;     # Certbot renewal
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
```

### 9.3 Auto-renew

```bash
# Test renewal
certbot renew --dry-run

# Cron tu dong renew (2 lan/ngay)
echo "0 */12 * * * certbot renew --quiet && docker exec shared-nginx nginx -s reload" \
  | crontab -
```

---

## 10. CI/CD Pipeline

### 10.1 CI Pipeline (`.github/workflows/ci.yml`)

```
Push/PR → master
    |
    ├── Security Check
    │   ├── No .env files committed
    │   ├── No hardcoded secrets (AWS, Cloudflare, GitHub keys)
    │   └── npm audit (high severity)
    |
    ├── DB Changelog Validation
    │   ├── Naming convention check
    │   ├── SQL safety (no DROP without IF EXISTS)
    │   └── UTF8MB4 requirement
    |
    ├── Backend
    │   ├── npm ci
    │   ├── tsc --noEmit (type check)
    │   ├── npm run build
    │   └── jest tests
    |
    ├── Frontend
    │   ├── npm ci
    │   ├── tsc --noEmit
    │   ├── npm run build
    │   └── vitest tests
    |
    └── E2E Tests (Playwright)
        ├── Start MySQL (test DB)
        ├── Start Backend (compiled)
        ├── Start Frontend
        └── Playwright tests → http://localhost:3200
```

### 10.2 Deploy Pipeline (`.github/workflows/deploy.yml`)

```
Push → master (manual trigger)
    |
    ├── Stage 1: Type Check
    │   ├── Frontend tsc --noEmit
    │   └── Backend tsc --noEmit
    |
    ├── Stage 2: Detect Changes
    │   ├── INIT mode (first deploy) vs UPDATE mode
    │   └── Change detection: frontend/, backend/, docker, nginx, db
    |
    ├── Stage 3: Deploy to VPS
    │   ├── INIT: Upload all → build → start → SSL
    │   └── UPDATE: Upload changed → rebuild affected → restart
    │   |
    │   └── Shared steps:
    │       ├── Sync .env
    │       ├── Ensure DB + user
    │       ├── Run migrations
    │       └── Run seeds (idempotent)
    |
    └── Stage 4: Verify
        ├── Health check backend (15 × 2s)
        ├── Health check frontend (10 × 2s)
        ├── Container status
        └── Deploy summary
```

### 10.3 Deploy Secrets (GitHub)

| Secret | Muc dich |
|--------|---------|
| `VPS_HOST` | IP address VPS (143.198.217.127) |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | SSH private key |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | JWT signing secret |
| `ADMIN_PASSWORD` | Initial admin password |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 key (optional) |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret (optional) |

---

## 11. Backup & Restore

### 11.1 Backup tu dong

**Script**: `scripts/backup-mysql.sh`

```bash
# Crontab — chay 2 AM hang ngay
0 2 * * * BACKUP_DIR=/opt/lqd/backups/mysql \
          RETENTION_DAYS=7 \
          DB_CONTAINER=shared-mysql \
          MYSQL_BACKUP_PASSWORD=${DB_PASSWORD} \
          /opt/lqd/scripts/backup-mysql.sh

# Output: /opt/lqd/backups/mysql/lqd_YYYY-MM-DD_HH-MM.sql.gz
```

**Backup process:**
1. `mysqldump` voi `--routines --triggers --events --set-gtid-purged=OFF`
2. Compress bang `gzip`
3. Verify integrity bang `gunzip -t`
4. Xoa backup cu hon 7 ngay
5. (Optional) Upload len R2 qua `rclone`

### 11.2 Restore thu cong

```bash
# 1. Tim backup file
ls -la /opt/lqd/backups/mysql/

# 2. Tao safety backup truoc khi restore
docker exec shared-mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} lqd | gzip > safety_backup.sql.gz

# 3. Drop va recreate database
docker exec shared-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "
  DROP DATABASE lqd;
  CREATE DATABASE lqd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  GRANT ALL PRIVILEGES ON lqd.* TO 'lqd'@'%';
"

# 4. Restore tu backup
gunzip -c /opt/lqd/backups/mysql/lqd_2026-04-16_02-00.sql.gz | \
  docker exec -i shared-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} lqd

# 5. Chay migrations (neu co pending)
docker exec lqd-api npm run migration:run:prod

# 6. Restart services
docker restart lqd-api lqd-frontend

# 7. Verify
curl -s http://localhost:4200/api/health
```

### 11.3 Restore tu dong (GitHub Actions)

Trigger: `workflow_dispatch` voi options:
- `date`: Ngay backup cu the hoac "latest"
- `restore_db`: true/false
- `restore_uploads`: true/false
- `run_changelog`: true/false

Process: Fetch backup → safety backup → DROP/CREATE → import → migrations → restart → health check.

### 11.4 Backup Uploads (Media files)

```bash
# Backup volume uploads
docker run --rm -v lqd_uploads:/data -v /opt/lqd/backups:/backup \
  alpine tar czf /backup/uploads_$(date +%Y-%m-%d).tar.gz -C /data .

# Restore
docker run --rm -v lqd_uploads:/data -v /opt/lqd/backups:/backup \
  alpine sh -c "cd /data && tar xzf /backup/uploads_2026-04-16.tar.gz"
```

---

## 12. Monitoring & Health Check

### 12.1 Health Check Endpoints

| Service | URL | Response |
|---------|-----|----------|
| Backend | `GET /api/health` | `{ "status": "ok", "timestamp": "..." }` |
| Frontend | `GET /` | HTTP 200 + HTML |
| MySQL | `mysqladmin ping` | "mysqld is alive" |
| Redis | `redis-cli ping` | "PONG" |

### 12.2 Docker Health Checks

```yaml
# Backend
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost:4000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3

# Frontend
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3

# MySQL
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  interval: 10s
  timeout: 5s
  retries: 5

# Redis
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### 12.3 Monitoring Commands

```bash
# Trang thai containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Resource usage
docker stats --no-stream

# Logs (real-time)
docker logs lqd-api -f --tail 100
docker logs lqd-frontend -f --tail 100
docker logs shared-nginx -f --tail 100

# MySQL slow queries
docker exec shared-mysql cat /var/log/mysql/slow.log

# Redis memory
docker exec shared-redis redis-cli INFO memory

# Disk usage
docker system df
du -sh /opt/lqd/backups/
```

### 12.4 Process Manager (PM2)

Backend chay PM2 trong production:
```dockerfile
CMD ["pm2-runtime", "dist/main.js", "-i", "2"]
```
- 2 cluster instances → tan dung multi-core
- Auto-restart khi crash
- `pm2-runtime` giu container alive

---

## 13. Troubleshooting

### 13.1 Container khong start

```bash
# Xem logs chi tiet
docker compose -f docker-compose.prod.yml logs backend

# Kiem tra .env
docker compose -f docker-compose.prod.yml config

# Kiem tra network
docker network ls
docker network inspect webphoto_backend

# Rebuild
docker compose -f docker-compose.prod.yml build --no-cache backend
docker compose -f docker-compose.prod.yml up -d backend
```

### 13.2 Database connection refused

```bash
# Kiem tra MySQL chay chua
docker exec shared-mysql mysqladmin ping -u root -p

# Kiem tra user/database ton tai
docker exec shared-mysql mysql -u root -p -e "SHOW DATABASES; SELECT user, host FROM mysql.user;"

# Kiem tra network connectivity
docker exec lqd-api ping shared-mysql

# Tao lai database neu can
docker exec shared-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "
  CREATE DATABASE IF NOT EXISTS lqd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'lqd'@'%' IDENTIFIED BY '${DB_PASSWORD}';
  GRANT ALL PRIVILEGES ON lqd.* TO 'lqd'@'%';
  FLUSH PRIVILEGES;
"
```

### 13.3 Frontend 502 Bad Gateway

```bash
# Kiem tra frontend container
docker logs lqd-frontend --tail 50

# Kiem tra frontend co response
curl -v http://localhost:3200

# Kiem tra Nginx upstream
docker exec shared-nginx nginx -t
docker exec shared-nginx cat /etc/nginx/conf.d/lqd.bhquan.store.conf

# Restart
docker restart lqd-frontend
docker exec shared-nginx nginx -s reload
```

### 13.4 API 401 Unauthorized

```bash
# Kiem tra JWT_SECRET giong nhau giua frontend va backend
docker exec lqd-api env | grep JWT

# Kiem tra CORS
docker exec lqd-api env | grep ALLOWED_ORIGINS

# Kiem tra cookie domain
# Neu domain khac → refresh token khong gui duoc
```

### 13.5 Upload khong duoc

```bash
# Kiem tra volume mount
docker exec lqd-api ls -la /app/uploads/

# Kiem tra quyen ghi
docker exec lqd-api touch /app/uploads/test && echo "OK" || echo "NO WRITE"

# Kiem tra R2 config (neu dung)
docker exec lqd-api env | grep R2

# Kiem tra Nginx max body size (20M)
docker exec shared-nginx nginx -T | grep client_max_body_size
```

### 13.6 Migration loi

```bash
# Xem migration status
docker exec lqd-api npx typeorm migration:show -d dist/database/data-source.js

# Chay lai migration
docker exec lqd-api npm run migration:run:prod

# Neu can revert migration cuoi
docker exec lqd-api npx typeorm migration:revert -d dist/database/data-source.js
```

### 13.7 Out of memory

```bash
# Kiem tra memory usage
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}"

# Tang memory limit trong docker-compose
# deploy.resources.limits.memory: 4G

# Xoa unused images/volumes
docker system prune -a --volumes
```

---

## 14. Port Map & Resource Limits

### Tong hop Ports

| Service | Dev Local | Dev Docker | Prod Docker | Exposed |
|---------|-----------|------------|-------------|---------|
| Frontend | 3200 | 3200 → 3000 | 3200 → 3000 | Qua Nginx |
| Backend | 4200 | 4200 → 4000 | 4200 → 4000 | Qua Nginx |
| MySQL | 3306 | 3308 → 3306 | Internal only | Shared |
| Redis | 6379 | 6381 → 6379 | Internal only | Shared |
| Nginx (dev) | — | 5200/5201 | — | — |
| Nginx (prod) | — | — | 80/443 | Internet |

### Tong hop Resource Limits

| Moi truong | Backend | Frontend | MySQL | Redis | Tong |
|------------|---------|----------|-------|-------|------|
| **Dev Docker** | 2 CPU / 4G | 1 CPU / 4G | 0.5 CPU / 2G | 0.5 CPU / 1G | 4 CPU / 11G |
| **Production** | 1 CPU / 2G | 1 CPU / 2G | 0.5 CPU / 2G | 0.5 CPU / 1G | 3 CPU / 7G |

### Logging

Tat ca containers:
```yaml
logging:
  driver: json-file
  options:
    max-size: "50m"
    max-file: "5"
```
→ Toi da 250 MB log/container (5 files × 50 MB).

---

## Quick Reference Card

### Lenh hay dung

```bash
# === DEVELOPMENT ===
cd backend && npm run dev                   # Backend dev
cd frontend && npm run dev                  # Frontend dev
docker compose up -d                        # Docker dev all-in-one

# === PRODUCTION ===
docker compose -f docker-compose.prod.yml up -d          # Start
docker compose -f docker-compose.prod.yml down            # Stop
docker compose -f docker-compose.prod.yml build --no-cache # Rebuild
docker compose -f docker-compose.prod.yml logs -f         # Logs

# === DATABASE ===
npm run migration:run                       # Dev migrations
npm run migration:run:prod                  # Prod migrations
npm run seed:admin                          # Seed admin (dev)
docker exec lqd-api npm run seed:admin:prod # Seed admin (prod)

# === MONITORING ===
docker ps                                   # Container status
docker stats                                # Resource usage
curl localhost:4200/api/health              # API health

# === BACKUP ===
# Manual backup
docker exec shared-mysql mysqldump -u root -p lqd | gzip > backup.sql.gz

# === NGINX ===
docker exec shared-nginx nginx -t           # Test config
docker exec shared-nginx nginx -s reload    # Reload config

# === CLEANUP ===
docker system prune -a                      # Xoa unused images
docker volume prune                         # Xoa unused volumes
```

### URL Quan trong

| URL | Muc dich |
|-----|---------|
| `https://demo.remoteterminal.online` | Production site |
| `https://demo.remoteterminal.online/admin` | Admin panel |
| `http://localhost:3200` | Dev frontend |
| `http://localhost:4200/api/health` | Dev API health |
| `http://localhost:4200/api` | Dev API base |

---

> **Tai lieu nay huong dan trien khai day du he thong LeQuyDon CMS.**
> Tu local development → Docker development → Production VPS.
> Bao gom: setup, migration, seed, Nginx, SSL, CI/CD, backup, monitoring, troubleshooting.
