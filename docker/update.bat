@echo off
pushd %~dp0
echo Updating running environment...

echo Installing dependencies...
docker compose exec app npm install

echo Applying database migrations...
docker compose exec app npx wrangler d1 migrations apply DB --local

echo Update complete!
popd
pause
