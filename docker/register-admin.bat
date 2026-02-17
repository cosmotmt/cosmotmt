@echo off
pushd %~dp0
set /p email="Enter Admin Email: "
set /p password="Enter Admin Password: "

echo Registering admin...
docker compose exec app node scripts/setup-admin.js %email% %password%

echo Registration complete!
popd
pause
