@echo off
pushd %~dp0

echo --- Initializing Environment ---

echo 1. Cleaning up existing environment...
docker compose down
if exist "..\app\.wrangler" rd /s /q "..\app\.wrangler"
if exist "..\app\.next" rd /s /q "..\app\.next"

echo 2. Starting containers...
docker compose up -d --build

echo 3. Applying database migrations...
:: コンテナが立ち上がるのを少し待つ
timeout /t 10 /nobreak > nul
docker compose exec -T app npx wrangler d1 migrations apply DB --local

echo 4. Registering admin user...
docker compose exec app node scripts/setup-admin.js

echo 5. Stopping containers...
docker compose stop

echo.
echo --- Initialization Complete! ---
echo You can now start the development server with run.bat
popd
pause
