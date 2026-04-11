#!/bin/bash
# ============================================================
# LeQuyDon — SEED PRODUCTION DATA
# ============================================================
# Chay tu may local — seed du lieu vao production
#
# Usage:
#   bash scripts/seed-prod.sh <vps-ip>
#   bash scripts/seed-prod.sh 143.198.217.127
# ============================================================

set -e

VPS_IP="${1:?Usage: bash scripts/seed-prod.sh <vps-ip>}"
VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_USER}@${VPS_IP}"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'
log() { echo -e "${GREEN}[OK]${NC} $1"; }
err() { echo -e "${RED}[ERR]${NC} $1"; exit 1; }
warn() { echo -e "${YELLOW}[!!]${NC} $1"; }

echo ""
echo "=== LeQuyDon — Seed Production Data ==="
echo "  VPS: ${VPS_HOST}"
echo ""

# Kiem tra container dang chay
ssh -o ConnectTimeout=5 "${VPS_HOST}" "docker ps --filter name=lqd-api --format '{{.Status}}'" | grep -q "Up" || err "lqd-api khong chay!"
log "lqd-api is running"

# Kiem tra seed files co trong dist/
ssh "${VPS_HOST}" "docker exec lqd-api ls dist/database/seeds/ 2>/dev/null" || err "Seed files khong co trong dist/. Can rebuild container."

echo ""
echo "--- Seed Admin ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/admin-seed.js" && log "Admin seed done" || warn "Admin seed failed (co the da ton tai)"

echo ""
echo "--- Seed Content (categories, articles, pages, events, settings, navigation) ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/content-seed.js" && log "Content seed done" || err "Content seed failed"

echo ""
echo "--- Seed Admissions ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/seed-admissions.js" && log "Admissions seed done" || warn "Admissions seed failed"

echo ""
echo "=== Seed hoan tat! ==="
echo ""
