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
echo "--- Seed Content (basic categories, articles, pages, events, settings, nav) ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/content-seed.js" && log "Content seed done" || warn "Content seed failed"

echo ""
echo "--- Seed Categories + Articles (extended) ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/seed-categories-articles.js" && log "Categories+articles seed done" || warn "Categories+articles seed failed"

echo ""
echo "--- Seed Events (extended) ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/seed-events.js" && log "Events seed done" || warn "Events seed failed"

echo ""
echo "--- Seed Contacts, Settings, Navigation ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/seed-contacts-settings-nav.js" && log "Contacts+settings+nav seed done" || warn "Contacts+settings+nav seed failed"

echo ""
echo "--- Seed Media ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/seed-media.js" && log "Media seed done" || warn "Media seed failed"

echo ""
echo "--- Seed Pages (25 nested pages) ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/pages-seed.js" && log "Pages seed done" || warn "Pages seed failed"

echo ""
echo "--- Seed Pages Part 1 ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/seed-pages-part1.js" && log "Pages part 1 done" || warn "Pages part 1 failed"

echo ""
echo "--- Seed Pages Part 2 ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/seed-pages-part2.js" && log "Pages part 2 done" || warn "Pages part 2 failed"

echo ""
echo "--- Seed Pages Part 3 ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/seed-pages-part3.js" && log "Pages part 3 done" || warn "Pages part 3 failed"

echo ""
echo "--- Seed Admissions ---"
ssh "${VPS_HOST}" "docker exec lqd-api node dist/database/seeds/seed-admissions.js" && log "Admissions seed done" || warn "Admissions seed failed"

echo ""
echo "=== Seed hoan tat! ==="
echo ""
