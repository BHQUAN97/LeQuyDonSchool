#!/bin/bash
# ──────────────────────────────────────────
# LeQuyDon — Manual Deployment Script
# Domain: demo.remoteterminal.online
# ──────────────────────────────────────────

set -euo pipefail

# ─── Configuration ───────────────────────
APP_DIR="/opt/lqd"
REPO_URL="https://github.com/BHQUAN97/LeQuyDon.git"
BRANCH="main"
DOMAIN="demo.remoteterminal.online"
COMPOSE_FILE="docker-compose.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ─── Pre-flight checks ──────────────────
log "Starting deployment to ${DOMAIN}..."

command -v docker >/dev/null 2>&1 || err "Docker not installed"
command -v docker compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1 || err "Docker Compose not installed"

if docker compose version >/dev/null 2>&1; then
    COMPOSE="docker compose"
else
    COMPOSE="docker-compose"
fi

# ─── Pull latest code ───────────────────
if [ -d "${APP_DIR}/.git" ]; then
    log "Pulling latest code..."
    cd "${APP_DIR}"
    git fetch origin "${BRANCH}"
    git reset --hard "origin/${BRANCH}"
else
    log "Cloning repository..."
    git clone -b "${BRANCH}" "${REPO_URL}" "${APP_DIR}"
    cd "${APP_DIR}"
fi

# ─── Check .env files ───────────────────
if [ ! -f "${APP_DIR}/.env" ]; then
    warn ".env not found! Copy from config/env or create manually."
    if [ -f "${APP_DIR}/config/env" ]; then
        cp "${APP_DIR}/config/env" "${APP_DIR}/.env"
        chmod 600 "${APP_DIR}/.env"
        log "Created .env from config/env"
    else
        err "No .env and no config/env found!"
    fi
fi

# ─── Ensure shared networks ──────────────
log "Ensuring shared Docker networks..."
docker network create webphoto_backend 2>/dev/null || true
docker network create lqd_frontend 2>/dev/null || true

# ─── Build & Deploy ─────────────────────
log "Building Docker images..."
cd "${APP_DIR}"

${COMPOSE} -f docker-compose.prod.yml build --no-cache

log "Stopping old containers..."
${COMPOSE} -f docker-compose.prod.yml down --timeout 30

log "Starting new containers..."
${COMPOSE} -f docker-compose.prod.yml up -d

# ─── Connect shared-nginx ────────────────
if docker ps --filter name=shared-nginx --format '{{.Names}}' | grep -q shared-nginx; then
    docker network connect lqd_frontend shared-nginx 2>/dev/null || true
    docker exec shared-nginx nginx -s reload 2>/dev/null || true
    log "shared-nginx connected to lqd_frontend"
fi

# ─── Wait for health checks ─────────────
log "Waiting for services to start..."
sleep 10

RETRIES=0
MAX_RETRIES=30
until curl -sf http://localhost:4200/api/health > /dev/null 2>&1; do
    RETRIES=$((RETRIES + 1))
    if [ ${RETRIES} -ge ${MAX_RETRIES} ]; then
        err "Backend health check failed after ${MAX_RETRIES} attempts"
    fi
    echo -n "."
    sleep 2
done
echo ""
log "Backend is healthy!"

until curl -sf http://localhost:3200 > /dev/null 2>&1; do
    RETRIES=$((RETRIES + 1))
    if [ ${RETRIES} -ge ${MAX_RETRIES} ]; then
        err "Frontend health check failed"
    fi
    echo -n "."
    sleep 2
done
echo ""
log "Frontend is healthy!"

# ─── Post-deploy verification ───────────
log "Running post-deploy checks..."

HEALTH=$(curl -s http://localhost:4200/api/health)
log "Health: ${HEALTH}"

RUNNING=$(${COMPOSE} -f docker-compose.prod.yml ps --services --filter "status=running" | wc -l)
EXPECTED=2
if [ "${RUNNING}" -lt "${EXPECTED}" ]; then
    warn "Only ${RUNNING}/${EXPECTED} services running!"
    ${COMPOSE} -f docker-compose.prod.yml ps
else
    log "All ${EXPECTED} services running"
fi

# ─── Cleanup ─────────────────────────────
log "Cleaning up old images..."
docker image prune -f > /dev/null 2>&1

log "================================================"
log "  Deployment complete!"
log "  URL: https://${DOMAIN}"
log "  API: https://${DOMAIN}/api/health"
log "================================================"
