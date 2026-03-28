[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ThemePath,

    [string]$PalettePath = (Join-Path $PSScriptRoot 'palettes/gilded-crimson.json')
)

$resolvedThemePath = (Resolve-Path -LiteralPath $ThemePath).Path
$resolvedPalettePath = (Resolve-Path -LiteralPath $PalettePath).Path

$palette = Get-Content -LiteralPath $resolvedPalettePath -Raw | ConvertFrom-Json -AsHashtable
$replacements = $palette.replacements

if (-not $replacements -or $replacements.Count -eq 0) {
    throw "Palette '$resolvedPalettePath' does not define any replacements."
}

$content = Get-Content -LiteralPath $resolvedThemePath -Raw

foreach ($entry in $replacements.GetEnumerator() | Sort-Object { $_.Key.Length } -Descending) {
    $pattern = '(?i)' + [regex]::Escape($entry.Key)
    $content = [regex]::Replace($content, $pattern, $entry.Value)
}

Set-Content -LiteralPath $resolvedThemePath -Value $content -NoNewline

Write-Host "Applied palette '$($palette.name)' to '$resolvedThemePath'."
