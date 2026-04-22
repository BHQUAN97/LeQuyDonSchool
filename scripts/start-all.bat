@echo off
title LeQuyDon - Start All (Dev)
setlocal enabledelayedexpansion

echo ========================================
echo   LeQuyDon - Khoi dong dev moi truong
echo   (Docker full stack: MySQL + Redis + BE + FE)
echo ========================================
echo.

cd /d %~dp0..

:: ── Kiem tra Docker ──
docker info >nul 2>&1
if errorlevel 1 (
    echo [LOI] Docker chua chay. Mo Docker Desktop truoc!
    pause
    exit /b 1
)

:: ── .env backend ──
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo [INFO] Da tao backend\.env tu .env.example
    )
)

:: ── .env frontend (KHONG override neu da co — tranh mat tunnel domain) ──
if not exist "frontend\.env" (
    if exist "frontend\.env.example" (
        copy "frontend\.env.example" "frontend\.env" >nul
        echo [INFO] Da tao frontend\.env tu .env.example
    )
)

set COMPOSE=-f docker-compose.yml -f docker-compose.dev.yml

echo [1/3] Build backend + frontend (dev)...
docker compose %COMPOSE% build backend frontend
if errorlevel 1 (
    echo [LOI] Build that bai
    pause
    exit /b 1
)

echo.
echo [2/3] Khoi dong MySQL + Redis...
docker compose %COMPOSE% up -d mysql redis

echo.
echo [3/3] Khoi dong Backend + Frontend...
docker compose %COMPOSE% up -d backend frontend

echo.
echo ========================================
echo   LeQuyDon Dev dang chay
echo ----------------------------------------
echo   Frontend: http://localhost:3200
echo   Backend:  http://localhost:4200/api
echo   MySQL:    localhost:3308
echo   Redis:    localhost:6381
echo ----------------------------------------
echo   Cloudflare tunnel (neu bat):
echo     lequydon.remoteterminal.online
echo ----------------------------------------
echo   Logs:  docker compose %COMPOSE% logs -f
echo   Dung:  docker compose %COMPOSE% down
echo ========================================

start http://localhost:3200
pause
