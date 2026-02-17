@echo off
pushd %~dp0

echo Starting development server...
docker compose up %*

popd
