# LE QUY DON — DEPLOYMENT GUIDE

> Domain: lqd.bhquan.store | VPS: 134.122.21.251 | Stack: NestJS + Next.js + MySQL

---

## Kiến trúc Production

```
  VPS Ubuntu (134.122.21.251)
  ┌──────────────────────────────────────────────┐
  │  shared-nginx (Docker) :80/:443               │
  │  └─ lqd.bhquan.store → lqd-api + frontend   │
  │                                               │
  │  LeQuyDon (/opt/lqd)                         │
  │  ├─ lqd-api      :4200→4000 (NestJS)         │
  │  └─ lqd-frontend :3200→3000 (Next.js)        │
  │                                               │
  │  Shared infra (/opt/infra)                    │
  │  ├─ shared-mysql  :3306                        │
  │  │   └─ DB: lqd                               │
  │  └─ shared-redis  :6379                        │
  │                                               │
  │  Docker Networks                              │
  │  ├─ webphoto_backend  (mysql, redis)          │
  │  └─ lqd_frontend      (nginx, lqd containers)│
  └──────────────────────────────────────────────┘
```

### Nginx routing

Config: `/opt/webphoto/nginx/conf.d/lqd.bhquan.store.conf`
- `/api/*` → `http://lqd-api:4000`
- `/*` → `http://lqd-frontend:3000`

---

## GitHub Actions Secrets

Secrets được lưu trong **repo settings** — không commit lên git.

| Secret | Mô tả |
|--------|-------|
| `VPS_HOST` | IP VPS: `134.122.21.251` |
| `VPS_PORT` | SSH port: `22` |
| `VPS_USER` | SSH user: `root` |
| `VPS_PASSWORD` | Mật khẩu SSH VPS |
| `MYSQL_ROOT_PASSWORD` | Root password shared-mysql |
| `LQD_DB_PASSWORD` | Password user `lqd` trong MySQL |
| `JWT_SECRET` | JWT signing secret |
| `REVALIDATE_SECRET` | Next.js revalidate secret |
| `CRON_SECRET` | Secret header cho cron endpoints |

### Thêm/cập nhật secret nhanh qua CLI

```bash
# Không cần vào GitHub UI — dùng gh CLI
gh secret set VPS_PASSWORD --body "mat_khau_moi" --repo BHQUAN97/LeQuyDonSchool

# Thêm secret mới
gh secret set LQD_DB_PASSWORD --body "db_pass_moi" --repo BHQUAN97/LeQuyDonSchool

# Xem danh sách secrets (chỉ thấy tên, không thấy giá trị)
gh secret list --repo BHQUAN97/LeQuyDonSchool
```

---

## Checklist trước khi deploy

- [ ] `gh secret list --repo BHQUAN97/LeQuyDonSchool` hiện đủ 9 secrets
- [ ] Push code lên `master` → Actions chạy tự động
- [ ] Xem progress: `gh run watch --repo BHQUAN97/LeQuyDonSchool`

> Đổi VPS password: `bash /e/DEVELOP/.claude-shared/secrets-infra/scripts/set-all-secrets.sh --shared`

---

## Deploy

### Tự động (Khuyên dùng)

Push lên nhánh `main` hoặc `master` → GitHub Actions tự động chạy:
1. Typecheck FE + BE (song song)
2. Detect changes (init vs update)
3. Upload + build + start trên VPS
4. DB changelog + seed data
5. Health check

### Lần đầu deploy (INIT mode)

Khi `/opt/lqd/docker-compose.prod.yml` chưa tồn tại trên VPS, pipeline sẽ tự động:
- Upload toàn bộ source code
- Start shared-mysql + shared-redis (nếu chưa chạy)
- Tạo DB `lqd` và user
- Lấy SSL cert cho `lqd.bhquan.store`
- Build và start `lqd-api` + `lqd-frontend`
- Chạy toàn bộ DB migrations + seed data

### Cập nhật code (UPDATE mode)

Chỉ upload những gì thay đổi (FE / BE / infra), rebuild và restart service tương ứng.

---

## Config không nhạy cảm (config/env)

File `config/env` được commit lên git, chứa các giá trị **không nhạy cảm**:

```
DOMAIN=lqd.bhquan.store
API_URL=https://lqd.bhquan.store/api
DB_HOST=shared-mysql
DB_PORT=3306
DB_USERNAME=lqd
DB_NAME=lqd
```

Các giá trị nhạy cảm (passwords, API keys) chỉ lưu trong GitHub Secrets.

---

## Quản lý trên VPS

```bash
ssh root@134.122.21.251
cd /opt/lqd

# Xem logs
docker logs lqd-api --tail 50 -f
docker logs lqd-frontend --tail 50 -f

# Restart
docker compose -f docker-compose.prod.yml restart backend frontend

# Xem DB
docker exec -it shared-mysql mysql -u lqd -p lqd

# Nginx reload
docker exec shared-nginx nginx -t && docker exec shared-nginx nginx -s reload
```

---

## Troubleshooting

```bash
# Backend không start
docker logs lqd-api --tail 30
docker inspect lqd-api --format '{{.State.Status}} ExitCode:{{.State.ExitCode}}'

# 502 Bad Gateway — kiểm tra network
docker inspect shared-nginx --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
# Phải có: lqd_frontend
# Nếu thiếu:
docker network connect lqd_frontend shared-nginx
docker exec shared-nginx nginx -s reload

# SSL cert — chạy workflow ssl-renew.yml từ GitHub Actions tab
```
