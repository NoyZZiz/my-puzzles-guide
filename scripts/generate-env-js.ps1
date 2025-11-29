# PowerShell script to generate env.js from .env
# Usage: powershell -ExecutionPolicy Bypass -File scripts/generate-env-js.ps1

$parent = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path -Path $parent -ChildPath '.env'
$outFile = Join-Path -Path $parent -ChildPath 'env.js'

if (-Not (Test-Path $envFile)) {
    Write-Host ".env file not found at $envFile" -ForegroundColor Red
    Exit 1
}

$entries = @{}
$lines = Get-Content $envFile
foreach ($line in $lines) {
    $line = $line.Trim()
    if ($line -eq '' -or $line.StartsWith('#')) { continue }
    $idx = $line.IndexOf('=')
    if ($idx -lt 0) { continue }
    $key = $line.Substring(0, $idx).Trim()
    $value = $line.Substring($idx + 1).Trim()
    $entries[$key] = $value
}

# Convert to JS
$jsLines = @()
$jsLines += 'window.__env = {'
$keys = $entries.Keys | Sort-Object
for ($i = 0; $i -lt $keys.Count; $i++) {
    $k = $keys[$i]
    $v = ($entries[$k] -replace "'", "\\'")
    $comma = ','
    if ($i -eq $keys.Count - 1) { $comma = '' }
    $jsLines += "  '$k': '$v'$comma"
}
$jsLines += '};'

$jsLines | Set-Content -Path $outFile -Encoding UTF8

Write-Host "Generated env.js at $outFile" -ForegroundColor Green
