#Requires -Version 5.1
# setup-conventional-release.ps1
# Automatiza Husky (moderno), Commitlint, release-please y GitHub Actions para publicar en npm con provenance.

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Section($text) {
  Write-Host "`n==> $text" -ForegroundColor Cyan
}

function Try-Exec($cmd, $fatal = $true) {
  Write-Host "    $cmd"
  try {
    & cmd /c $cmd | Out-Host
  } catch {
    if ($fatal) { throw $_ } else { Write-Warning "    (continuando) $($_.Exception.Message)" }
  }
}

function Has-Command($name) {
  $null -ne (Get-Command $name -ErrorAction SilentlyContinue)
}

function Write-LFFile($Path, [string]$Content) {
  $lf = $Content -replace "`r?`n","`n"
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $lf, $utf8NoBom)
}

function Ensure-JsonScript($pkgPath, $key, $value) {
  $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
  if (-not $pkg.scripts) { $pkg | Add-Member -NotePropertyName scripts -NotePropertyValue (@{}) }
  $pkg.scripts.$key = $value
  ($pkg | ConvertTo-Json -Depth 100) + "`n" | Set-Content -LiteralPath $pkgPath -Encoding UTF8
}

Write-Section "Detectando gestor de paquetes"
$PM = "npm"
$lockPnpm = Test-Path "pnpm-lock.yaml"
$lockYarn = Test-Path "yarn.lock"
if (Has-Command "pnpm") { $PM = "pnpm" }
elseif (Has-Command "yarn") { $PM = "yarn" }
elseif ($lockPnpm -or $lockYarn) {
  Write-Warning "Se detectó lockfile pero no el gestor en PATH; se usará npm."
}
Write-Host "    Gestor: $PM"

Write-Section "Verificando proyecto"
if (-not (Test-Path "package.json")) {
  Write-Host "    No hay package.json, inicializando…"
  switch ($PM) {
    "pnpm" { Try-Exec "pnpm init -y" }
    "yarn" { Try-Exec "yarn init -y" }
    default { Try-Exec "npm init -y" }
  }
}
if (-not (Test-Path ".git")) {
  Write-Host "    No hay repo Git, inicializando…"
  Try-Exec "git init"
}

Write-Section "Instalando devDependencies: husky + commitlint"
switch ($PM) {
  "pnpm" { Try-Exec "pnpm add -D husky @commitlint/cli @commitlint/config-conventional" $false; if ($LASTEXITCODE -ne 0) { Try-Exec "npm i -D husky @commitlint/cli @commitlint/config-conventional" } }
  "yarn" { Try-Exec "yarn add -D husky @commitlint/cli @commitlint/config-conventional" $false; if ($LASTEXITCODE -ne 0) { Try-Exec "npm i -D husky @commitlint/cli @commitlint/config-conventional" } }
  default { Try-Exec "npm i -D husky @commitlint/cli @commitlint/config-conventional" }
}

Write-Section "Configurando script prepare='husky'"
Ensure-JsonScript -pkgPath "package.json" -key "prepare" -value "husky"
Write-Host "    package.json actualizado"

Write-Section "Inicializando Husky (moderno)"
# Preferimos npx universalmente; si falla en entorno pnpm puro, intentamos pnpm dlx
$huskyInitOk = $true
try { Try-Exec "npx --yes husky init" } catch { $huskyInitOk = $false }
if (-not $huskyInitOk -and $PM -eq "pnpm") {
  Try-Exec "pnpm dlx husky init"
}

# Asegurar carpeta .husky
if (-not (Test-Path ".husky")) { New-Item -ItemType Directory -Path ".husky" | Out-Null }

Write-Section "Configurando commitlint"
if (-not (Test-Path "commitlint.config.js")) {
  @"
export default { extends: ['@commitlint/config-conventional'] };
"@ | Set-Content -LiteralPath "commitlint.config.js" -Encoding UTF8
  Write-Host "    commitlint.config.js creado"
} else {
  Write-Host "    commitlint.config.js ya existe"
}

Write-Section "Creando hook commit-msg (valida Conventional Commits)"
$commitMsg = @'
npx --no -- commitlint --edit "$1"
'@
Write-LFFile ".husky/commit-msg" $commitMsg
Try-Exec "git add .husky/commit-msg" $false
Try-Exec "git update-index --chmod=+x .husky/commit-msg" $false

Write-Section "Creando hook pre-commit seguro (lint/typecheck/tests ligeros si existen)"
$preCommit = @'
# Lint si existe
if npm run -s | grep -q "^  lint$"; then
  npm run -s lint || exit 1
fi

# Typecheck si existe
if npm run -s | grep -q "^  typecheck$"; then
  npm run -s typecheck || exit 1
fi

# Tests rápidos solo si existen scripts o config
if npm run -s | grep -q "^  test:precommit$"; then
  npm run -s test:precommit || exit 1
elif [ -f "vitest.config.ts" ] || [ -f "vitest.config.js" ] || [ -d "tests" ] || [ -d "__tests__" ]; then
  npm run -s test || npm run -s test:ci || true
else
  echo "No tests configured yet, skipping tests"
fi
'@
Write-LFFile ".husky/pre-commit" $preCommit
Try-Exec "git add .husky/pre-commit" $false
Try-Exec "git update-index --chmod=+x .husky/pre-commit" $false

Write-Section "Configurando release-please (manifest y config)"
$ghDir = ".github"
$rpManifest = Join-Path $ghDir ".release-please-manifest.json"
$rpConfig   = Join-Path $ghDir "release-please-config.json"
if (-not (Test-Path $ghDir)) { New-Item -ItemType Directory -Path $ghDir | Out-Null }

# Detectar monorepo simple en packages/*
$packagesDir = "packages"
$packages = @()
if (Test-Path $packagesDir) {
  Get-ChildItem $packagesDir -Directory | ForEach-Object {
    if (Test-Path (Join-Path $_.FullName "package.json")) { $packages += $_.FullName }
  }
}

if ($packages.Count -gt 0) {
  # Monorepo
  $manifestObj = @{}
  foreach ($p in $packages) {
    $rel = Resolve-Path $p | ForEach-Object { $_.Path }
    $rel = $rel -replace [regex]::Escape((Resolve-Path .).Path + [IO.Path]::DirectorySeparatorChar), ''
    $manifestObj[$rel] = "0.0.0"
  }
  ($manifestObj | ConvertTo-Json -Depth 10) + "`n" | Set-Content -LiteralPath $rpManifest -Encoding UTF8

  $cfg = @{
    "release-type"   = "node"
    "include-v-in-tag" = $true
    "packages"       = @{}
  }
  foreach ($p in $packages) {
    $rel = Resolve-Path $p | ForEach-Object { $_.Path }
    $rel = $rel -replace [regex]::Escape((Resolve-Path .).Path + [IO.Path]::DirectorySeparatorChar), ''
    $base = Split-Path $rel -Leaf
    $cfg.packages[$rel] = @{ component = $base }
  }
  ($cfg | ConvertTo-Json -Depth 100) + "`n" | Set-Content -LiteralPath $rpConfig -Encoding UTF8
  Write-Host "    Monorepo detectado; manifest y config generados"
} else {
  (@{ "." = "0.0.0" } | ConvertTo-Json -Depth 10) + "`n" | Set-Content -LiteralPath $rpManifest -Encoding UTF8
  @{
    "release-type" = "node"
    "include-v-in-tag" = $true
    "packages" = @{ "." = @{} }
  } | ConvertTo-Json -Depth 10 | ForEach-Object { $_ + "`n" } | Set-Content -LiteralPath $rpConfig -Encoding UTF8
  Write-Host "    Repo simple configurado"
}

Write-Section "Creando workflows de GitHub Actions"
$wfDir = ".github/workflows"
if (-not (Test-Path $wfDir)) { New-Item -ItemType Directory -Path $wfDir | Out-Null }

$wfReleasePlease = @'
name: release-please
on:
  push:
    branches: [main]
permissions:
  contents: write
  pull-requests: write
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          config-file: .github/release-please-config.json
          manifest-file: .github/.release-please-manifest.json
'@
Write-LFFile (Join-Path $wfDir "release-please.yml") $wfReleasePlease

$wfPublishNpm = @'
name: publish-npm
on:
  release:
    types: [published]
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "lts/*"
          registry-url: "https://registry.npmjs.org"
      - run: npm ci || npm i --no-audit --no-fund --ignore-scripts
      - run: npm run build --if-present
      - run: npm test --if-present
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      - name: Verify publication
        run: npm view ${{ github.event.repository.name }}@${{ github.event.release.tag_name }}
'@
Write-LFFile (Join-Path $wfDir "publish-npm.yml") $wfPublishNpm

Write-Section "Finalizando"
Write-Host '    ✔ Husky moderno y Commitlint listos'
Write-Host '    ✔ release-please configurado (manifest + config)'
Write-Host '    ✔ Workflows de Actions creados (release-please + publish-npm)'
Write-Host ''
Write-Host 'Siguientes pasos:'
Write-Host -ForegroundColor Yellow '  1) Crea el secreto NPM_TOKEN en GitHub (Settings > Secrets and variables > Actions).'
Write-Host -ForegroundColor Yellow '  2) Usa mensajes de commit convencionales: feat/fix/docs/refactor/test/chore/ci'
Write-Host -ForegroundColor Yellow '  3) Haz push a main; release-please abrirá un Release PR y, al hacer merge, se publicará en npm con provenance.'
