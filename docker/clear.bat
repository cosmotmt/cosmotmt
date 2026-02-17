@echo off
pushd %~dp0
echo Cleaning up environment...

echo Stopping containers...
docker compose down

echo Deleting local database and cache...
if exist "..\app\.wrangler" rd /s /q "..\app\.wrangler"
if exist "..\app\.next" rd /s /q "..\app\.next"

echo Done! Environment is cleared.
popd
pause
