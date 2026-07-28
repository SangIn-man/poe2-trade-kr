param(
  [string]$Version
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $repoRoot 'manifest.json'
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json

if (-not $Version) {
  $Version = [string]$manifest.version
}

if ($Version -notmatch '^\d+\.\d+\.\d+$') {
  throw "Version must use semantic version format, for example 2.0.0."
}

if ([string]$manifest.version -ne $Version) {
  throw "manifest.json version '$($manifest.version)' does not match requested version '$Version'."
}

$packageName = "poe-trade-quick-v$Version"
$distDir = Join-Path $repoRoot 'dist'
$stagingDir = Join-Path $distDir $packageName
$zipPath = Join-Path $distDir "$packageName.zip"

if (Test-Path -LiteralPath $stagingDir) {
  Remove-Item -LiteralPath $stagingDir -Recurse -Force
}
if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

New-Item -ItemType Directory -Path $stagingDir -Force | Out-Null

$runtimeFiles = @(
  'manifest.json',
  'background.js',
  'content.js',
  'content.css',
  'trade-compat.js',
  'league-data.js',
  'map-regex.js',
  'page-trade-fetch-bridge.js',
  'pob-character.js',
  'pob-compare.js',
  'sidepanel.html',
  'sidepanel.js',
  'stash-history.js',
  'README.md',
  'USER_MANUAL_v2.0.md',
  'RELEASE_NOTES_v2.0.0.md'
)

foreach ($relativePath in $runtimeFiles) {
  $source = Join-Path $repoRoot $relativePath
  if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
    throw "Required release file is missing: $relativePath"
  }
  Copy-Item -LiteralPath $source -Destination (Join-Path $stagingDir $relativePath)
}

Copy-Item -LiteralPath (Join-Path $repoRoot 'data') -Destination $stagingDir -Recurse
Copy-Item -LiteralPath (Join-Path $repoRoot 'icons') -Destination $stagingDir -Recurse
Copy-Item -LiteralPath (Join-Path $repoRoot 'docs') -Destination $stagingDir -Recurse

$requiredManifestPaths = @(
  [string]$manifest.background.service_worker
)
$requiredManifestPaths += @($manifest.content_scripts | ForEach-Object { @($_.js) + @($_.css) })
$requiredManifestPaths += @($manifest.icons.PSObject.Properties.Value)
$requiredManifestPaths += @($manifest.web_accessible_resources | ForEach-Object { @($_.resources) })

foreach ($relativePath in ($requiredManifestPaths | Where-Object { $_ } | Select-Object -Unique)) {
  if (-not (Test-Path -LiteralPath (Join-Path $stagingDir $relativePath) -PathType Leaf)) {
    throw "Packaged manifest dependency is missing: $relativePath"
  }
}

Compress-Archive -LiteralPath $stagingDir -DestinationPath $zipPath -CompressionLevel Optimal
$hash = Get-FileHash -LiteralPath $zipPath -Algorithm SHA256

[pscustomobject]@{
  Version = $Version
  Package = $zipPath
  Size = (Get-Item -LiteralPath $zipPath).Length
  SHA256 = $hash.Hash
}
