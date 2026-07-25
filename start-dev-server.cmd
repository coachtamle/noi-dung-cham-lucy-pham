@echo off
cd /d "%~dp0"
corepack pnpm dev --host 127.0.0.1 --port 4321
