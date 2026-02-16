@echo off
pushd %~dp0
docker compose up %*
popd
