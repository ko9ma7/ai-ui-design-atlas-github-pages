@echo off
setlocal EnableExtensions EnableDelayedExpansion
set "REPO_NAME=ai-ui-design-atlas-github-pages"
set "DESCRIPTION=UI UX HTML SVG design-system and AI UI Skill Resource Vault"
set "VISIBILITY=public"
set "VERSION=v1.0.0"

echo [CHECK] Git
where git >nul 2>nul || (echo [ERROR] Git not found.& echo Recovery: winget install --id Git.Git -e& exit /b 1)
git --version

echo [CHECK] GitHub CLI
where gh >nul 2>nul || (echo [ERROR] GitHub CLI not found.& echo Recovery: winget install --id GitHub.cli -e& exit /b 1)
gh --version

echo [CHECK] GitHub auth
gh auth status >nul 2>nul
if errorlevel 1 (
  echo [WARN] GitHub login required.
  gh auth login
  if errorlevel 1 (echo [ERROR] GitHub authentication failed.& exit /b 1)
)
for /f "delims=" %%A in ('gh api user --jq ".login"') do set "GH_OWNER=%%A"

echo [CHECK] Git identity
git config user.name >nul 2>nul || echo [WARN] Configure: git config --global user.name "Your Name"
git config user.email >nul 2>nul || echo [WARN] Configure: git config --global user.email "you@example.com"

if not exist ".git" (
  echo [CHECK] Initializing Git
  git init
)
git branch -M main

echo [CHECK] Repository
gh repo view "%GH_OWNER%/%REPO_NAME%" >nul 2>nul
if errorlevel 1 (
  gh repo create "%REPO_NAME%" --%VISIBILITY% --source=. --remote=origin --description "%DESCRIPTION%"
  if errorlevel 1 (echo [ERROR] Repository creation failed.& exit /b 1)
) else (
  echo [OK] Repository exists.
  git remote get-url origin >nul 2>nul || git remote add origin "https://github.com/%GH_OWNER%/%REPO_NAME%.git"
)

echo [CHECK] Catalog JSON
where node >nul 2>nul
if errorlevel 1 (
  echo [WARN] Node.js not found. Skipping catalog validator.
) else (
  node scripts\validate.mjs
  if errorlevel 1 (echo [ERROR] Validation failed.& exit /b 1)
)

git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "feat: publish AI UI Design Atlas"
  if errorlevel 1 (echo [ERROR] Commit failed.& exit /b 1)
) else (
  echo [OK] Nothing new to commit.
)

echo [CHECK] Push
git push -u origin main
if errorlevel 1 (echo [ERROR] Push failed.& echo Recovery: git status ^&^& git push -u origin main& exit /b 1)

echo [CHECK] Repository metadata
gh repo edit "%GH_OWNER%/%REPO_NAME%" --description "%DESCRIPTION%" --homepage "https://%GH_OWNER%.github.io/%REPO_NAME%/"

echo [CHECK] Pages workflow
gh workflow run pages.yml >nul 2>nul
if errorlevel 1 (
  echo [WARN] Could not trigger Pages workflow. If Pages is branch-based, the push may already deploy it.
) else (
  timeout /t 3 /nobreak >nul
  for /f "delims=" %%R in ('gh run list --workflow pages.yml --limit 1 --json databaseId --jq ".[0].databaseId"') do set "RUN_ID=%%R"
  if defined RUN_ID (
    gh run watch "!RUN_ID!" --exit-status
    if errorlevel 1 echo [WARN] Inspect with: gh run view !RUN_ID! --log-failed
  )
)

git rev-parse "%VERSION%" >nul 2>nul
if errorlevel 1 (
  echo [CHECK] Initial tag
  git tag "%VERSION%"
  git push origin "%VERSION%"
) else (
  echo [OK] %VERSION% already exists.
)

echo.
echo [OK] Repository: https://github.com/%GH_OWNER%/%REPO_NAME%
echo [OK] Pages: https://%GH_OWNER%.github.io/%REPO_NAME%/
exit /b 0
