@echo off
pushd %~dp0\..\app

echo --- Cloudflare Remote Update ---

echo 1. Applying D1 Migrations to Remote...
:: echo y をパイプで渡すことで、確認プロンプトに自動で回答する
echo y | call npx wrangler d1 migrations apply db --remote

echo.
echo --- Update Complete! ---
popd
pause
