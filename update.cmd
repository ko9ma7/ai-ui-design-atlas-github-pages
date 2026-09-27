@echo off
setlocal
echo [CHECK] Pull
git pull --ff-only || exit /b 1
echo [CHECK] Validate
where node >nul 2>nul && node scripts\validate.mjs || echo [WARN] Node unavailable; validator skipped.
echo [CHECK] Status
git status --short
echo [OK] Update check complete.
