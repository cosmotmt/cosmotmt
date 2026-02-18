@echo off
pushd %~dp0\..\app

echo --- Cloudflare Remote Admin Registration ---

echo 1. Registering Admin to Remote...
call node scripts/setup-admin.js --remote

echo.
echo --- Registration Complete! ---
popd
pause
