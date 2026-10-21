@echo off
chcp 65001 >nul
echo ===================================================
echo     Simple Ledger System - Setup & Startup
echo ===================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    pause
    exit /b 1
)

:: 2. Check and copy .env if missing
if not exist .env (
    echo [*] Creating .env from .env.example...
    copy .env.example .env >nul
)

:: 3. Check node_modules
if not exist node_modules (
    echo [*] Installing dependencies with --legacy-peer-deps...
    call npm install --legacy-peer-deps
)

:: 4. Check or create SQLite Database file
if not exist data\ledger.db (
    echo [*] Initializing SQLite database file at data\ledger.db...
    node database\init-db.mjs
    if %errorlevel% neq 0 (
        echo [ERROR] Database initialization failed.
        pause
        exit /b 1
    )
) else (
    set /p RESET_DB="SQLite database exists. Do you want to re-run schema initialization? (y/N): "
    if /i "%RESET_DB%"=="y" (
        node database\init-db.mjs
    )
)

echo.
echo [*] Starting NestJS in Development Mode...
echo [*] Swagger API Docs: http://localhost:3000/api-docs
echo [*] Frontend Web:     http://localhost:3000
echo.
npm run start:dev
