#!/bin/bash
# ============================================================
# LeQuyDon — UPDATE DEPLOY
# ============================================================
# Chay tu may local — chi build + upload + restart
# Nginx chay trong Docker (shared-nginx), config tai /opt/webphoto/nginx/conf.d/
#
# Usage:
#   bash scripts/update-deploy.sh <vps-ip>
# ============================================================

set -e

VPS_IP="${1:?Usage: bash scripts/update-deploy.sh <vps-ip>}"
VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_USER}@${VPS_IP}"
APP_DIR="/opt/lqd"
WEBPHOTO_DIR="/opt/webphoto"
DOMAIN="demo.remoteterminal.online"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'
log() { echo -e "${GREEN}[OK]${NC} $1"; }
step() { echo -e "\n${CYAN}━━━ $1${NC}"; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo ""
echo "=== LeQuyDon — Update Deploy ==="
echo "  VPS: ${VPS_HOST}"
echo ""

# 1. Build
step "1/6 — Build local"
cd "$ROOT_DIR/backend" && npm run build
cd "$ROOT_DIR/frontend" && npm run build
cd "$ROOT_DIR"
log "Build OK"

# 2. Upload
step "2/6 — Upload to VPS"
ssh "${VPS_HOST}" "rm -rf ${APP_DIR}/backend/src ${APP_DIR}/backend/dist ${APP_DIR}/frontend/src"

echo "  Uploading backend..."
scp -r "$ROOT_DIR/backend/src" "${VPS_HOST}:${APP_DIR}/backend/"
scp "$ROOT_DIR/backend/package.json" "${VPS_HOST}:${APP_DIR}/backend/"
scp "$ROOT_DIR/backend/package-lock.json" "${VPS_HOST}:${APP_DIR}/backend/"

echo "  Uploading frontend..."
scp -r "$ROOT_DIR/frontend/src" "${VPS_HOST}:${APP_DIR}/frontend/"
scp "$ROOT_DIR/frontend/package.json" "${VPS_HOST}:${APP_DIR}/frontend/"
scp "$ROOT_DIR/frontend/package-lock.json" "${VPS_HOST}:${APP_DIR}/frontend/"
scp "$ROOT_DIR/frontend/next.config.mjs" "${VPS_HOST}:${APP_DIR}/frontend/"
scp "$ROOT_DIR/frontend/tailwind.config.ts" "${VPS_HOST}:${APP_DIR}/frontend/"
scp -r "$ROOT_DIR/frontend/public" "${VPS_HOST}:${APP_DIR}/frontend/" 2>/dev/null || true

log "Upload OK"

# 3. DB Changelog
step "3/6 — DB Changelog"
CHANGELOG_DIR="$ROOT_DIR/db/changelog"
if [ -d "$CHANGELOG_DIR" ]; then
  LQD_DB_PASS=$(ssh "${VPS_HOST}" "grep '^LQD_DB_PASSWORD=' ${APP_DIR}/.env | cut -d= -f2-")

  # Run _init scripts
  for f in $(find "$CHANGELOG_DIR/_init" -name '*.sql' -type f 2>/dev/null | sort); do
    ssh "${VPS_HOST}" "docker exec -i shared-mysql mysql -u lqd -p'${LQD_DB_PASS}' lqd" < "$f" 2>&1 || true
  done

  # Run versioned changelogs
  MYSQL_CMD="docker exec -i shared-mysql mysql -u lqd -p${LQD_DB_PASS} lqd"
  APPLIED=$(ssh "${VPS_HOST}" "$MYSQL_CMD -N -e \"SELECT CONCAT(version, '/', filename) FROM schema_changelog\"" 2>/dev/null || echo "")

  for ver_dir in $(find "$CHANGELOG_DIR" -mindepth 1 -maxdepth 1 -type d ! -name '_init' | sort); do
    VER=$(basename "$ver_dir")
    for f in $(find "$ver_dir" -name '*.sql' -type f | sort); do
      FNAME=$(basename "$f")
      KEY="${VER}/${FNAME}"
      if ! echo "$APPLIED" | grep -qF "$KEY"; then
        echo -n "  $FNAME ... "
        ssh "${VPS_HOST}" "$MYSQL_CMD" < "$f" 2>&1 && echo "OK" || echo "SKIP"
      fi
    done
  done
  log "DB Changelog done"
else
  log "No changelog directory (skip)"
fi

# 4. Update Nginx config
step "4/6 — Update Nginx config"
scp "$ROOT_DIR/nginx/conf.d/demo.remoteterminal.online.conf" "${VPS_HOST}:${WEBPHOTO_DIR}/nginx/conf.d/demo.remoteterminal.online.conf"

ssh "${VPS_HOST}" "
  if [ -f ${WEBPHOTO_DIR}/docker-compose.prod.yml ]; then
    cd ${WEBPHOTO_DIR}
    CERT_EXISTS=\$(docker compose -f docker-compose.prod.yml run --rm --entrypoint '' certbot \
      test -f /etc/letsencrypt/live/${DOMAIN}/fullchain.pem 2>/dev/null && echo yes || echo no)
    if [ \"\$CERT_EXISTS\" = 'no' ]; then
      echo '  Placeholder cert for ${DOMAIN}...'
      docker compose -f docker-compose.prod.yml run --rm --entrypoint '' certbot sh -c '
        mkdir -p /etc/letsencrypt/live/${DOMAIN}
        openssl req -x509 -nodes -days 1 -newkey rsa:2048 \
          -keyout /etc/letsencrypt/live/${DOMAIN}/privkey.pem \
          -out /etc/letsencrypt/live/${DOMAIN}/fullchain.pem \
          -subj /CN=${DOMAIN} 2>/dev/null
      '
    fi
  fi
  docker exec shared-nginx nginx -t 2>&1 | tail -1 && docker exec shared-nginx nginx -s reload 2>&1
"
log "Nginx config updated"

# 5. Rebuild + Restart
step "5/6 — Rebuild Docker + Restart"
ssh "${VPS_HOST}" "
  docker network create webphoto_backend 2>/dev/null || true
  docker network create lqd_frontend 2>/dev/null || true

  cd ${APP_DIR}
  docker compose build backend frontend 2>&1 | tail -5
  docker compose up -d backend frontend

  # Dam bao shared-nginx tren lqd_frontend network
  if ! docker inspect shared-nginx --format '{{range \$k,\$v := .NetworkSettings.Networks}}{{\$k}} {{end}}' | grep -q lqd_frontend; then
    docker network connect lqd_frontend shared-nginx
    echo 'shared-nginx reconnected to lqd_frontend'
  fi
"
log "Containers restarted"

# 6. Health check
step "6/6 — Health check"
sleep 8
ssh "${VPS_HOST}" "
  curl -sf http://localhost:4200/api/health && echo '' || echo 'API not ready'
  curl -sf -o /dev/null -w 'HTTPS: %{http_code}\n' https://${DOMAIN}/ || true
  docker ps --filter 'name=lqd-' --format 'table {{.Names}}\t{{.Status}}'
"
log "Update deploy done!"

echo ""
echo "=== Update complete — https://${DOMAIN} ==="
echo ""
