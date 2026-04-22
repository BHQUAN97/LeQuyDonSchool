# Scripts — LeQuyDon

Backup / restore / ops tooling cho LeQuyDon CMS. Tat ca script duoc viet bash + `set -euo pipefail`.

## Muc luc

| Script | Muc dich |
|---|---|
| `backup-mysql.sh` | Dump MySQL gzipped, retention 7 ngay, optional rclone upload |
| `restore-mysql.sh` | Restore dump `.sql.gz` vao container MySQL (interactive hoac tu arg) |
| `backup-gdrive.sh` | (Sap co) Sync `BACKUP_DIR` len Google Drive qua rclone |
| `deploy.sh` / `quick-deploy.sh` / `update-deploy.sh` | Docker compose deploy workflows |
| `db-changelog.sh` | Ghi log migration applied |
| `monitor-disk.sh` | Canh bao khi dung luong disk vuot nguong |
| `docker-cleanup.sh` | Don `docker system prune` an toan |

---

## 1. `backup-mysql.sh`

Dump database va nen `.sql.gz` vao `BACKUP_DIR`. Xoa backup cu hon `RETENTION_DAYS`. Neu co `rclone` se upload len remote `r2:lqd-backups/mysql/`.

### Usage
```bash
# One-shot manual
./scripts/backup-mysql.sh

# Override config qua env vars
BACKUP_DIR=/tmp/lqd-backups DB_NAME=lqd RETENTION_DAYS=14 ./scripts/backup-mysql.sh

# Password: dat MYSQL_BACKUP_PASSWORD hoac luu LQD_DB_PASSWORD vao /opt/lqd/.env
export MYSQL_BACKUP_PASSWORD='xxx'
./scripts/backup-mysql.sh
```

### Env vars
- `BACKUP_DIR` (default `/opt/lqd/backups/mysql`)
- `RETENTION_DAYS` (default `7`)
- `DB_CONTAINER` (default `shared-mysql`)
- `DB_NAME`, `DB_USER` (default `lqd`)
- `MYSQL_BACKUP_PASSWORD` — bat buoc (hoac doc tu `/opt/lqd/.env`)

### Output
- File: `${BACKUP_DIR}/${DB_NAME}_YYYY-MM-DD_HH-MM.sql.gz`
- Log: `/var/log/lqd/backup.log`

---

## 2. `restore-mysql.sh`

Restore backup `.sql.gz` vao container MySQL. Verify gzip integrity, prompt confirmation, ghi log start/end/duration.

### Usage
```bash
# Interactive: script liet ke tat ca backup va cho chon
./scripts/restore-mysql.sh

# Restore file cu the
./scripts/restore-mysql.sh /opt/lqd/backups/mysql/lqd_2026-04-17_02-00.sql.gz

# Skip confirmation (dung cho CI / automation)
./scripts/restore-mysql.sh /opt/lqd/backups/mysql/lqd_2026-04-17_02-00.sql.gz --force
```

### Exit codes
| Code | Nghia |
|---|---|
| 0 | Success |
| 1 | File not found / directory missing |
| 2 | Gzip corrupted (`gunzip -t` fail) |
| 3 | MySQL restore failed / container khong chay / khong co password |
| 4 | User aborted (khong confirm hoac chon `q`) |

### Env vars
Cung nhom nhu backup + `LOG_FILE` (default `/var/log/lqd/restore.log`).

---

## 3. `backup-gdrive.sh` (sap co)

Sync `BACKUP_DIR` len Google Drive qua rclone remote `gdrive:lqd-backups/`. Chay sau `backup-mysql.sh`.

```bash
./scripts/backup-gdrive.sh
```

---

## Cron setup

Tren VPS (xem `scripts/crontab.example` de biet chi tiet):

```cron
# Backup MySQL moi dem luc 2h sang
0 2 * * * /opt/lqd/scripts/backup-mysql.sh >> /var/log/lqd/backup.log 2>&1

# Sync len Google Drive luc 2h15
15 2 * * * /opt/lqd/scripts/backup-gdrive.sh >> /var/log/lqd/backup.log 2>&1

# Giam sat disk moi gio
0 * * * * /opt/lqd/scripts/monitor-disk.sh
```

Cai dat:
```bash
crontab -e
# paste cac dong tren, save
crontab -l   # verify
```

---

## Troubleshooting

### `ERROR: MYSQL_BACKUP_PASSWORD env var not set`
- Export env var truoc khi chay, hoac dam bao `/opt/lqd/.env` co dong `LQD_DB_PASSWORD=...`.

### `Container "shared-mysql" khong chay`
- `docker ps` kiem tra ten container. Override qua env: `DB_CONTAINER=lqd-mysql-1 ./restore-mysql.sh ...`.

### `File gzip bi corrupt`
- `gunzip -t file.sql.gz` de verify thu cong. Neu corrupt thi file dump loi — lay backup khac.

### Restore xong nhung app van doc du lieu cu
- Xoa cache Redis: `docker exec shared-redis redis-cli FLUSHDB`
- Restart backend: `docker compose restart backend` (dev) hoac `docker restart lqd-api` (prod)

### Uploads bi mat sau khi `docker compose down -v`
- `docker compose down -v` xoa named volumes. Dev dung bind mount `./backend/uploads` nen an toan.
- Prod dung named volume `lqd_uploads` — backup rieng truoc khi prune:
  ```bash
  docker run --rm -v lqd_uploads:/data -v $(pwd):/backup alpine \
    tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
  ```

### Permission denied khi chay restore
- `chmod +x scripts/restore-mysql.sh`
- Tren Windows dung Git Bash / WSL, khong dung cmd.exe.
