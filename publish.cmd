@echo off
setlocal
where gh >nul 2>nul || (echo [ERROR] GitHub CLI not found.& exit /b 1)
where node >nul 2>nul && node scripts\validate.mjs || exit /b 1
git add -A
git diff --cached --quiet
if errorlevel 1 git commit -m "chore: update catalog"
git push origin main || exit /b 1
gh run list --workflow pages.yml --limit 1
echo [OK] Publish requested.
