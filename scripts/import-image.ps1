# Converts a source image (typically a Firefly PNG from Downloads) into a
# repo-ready JPG: resized to the site's conventions and re-encoded at a
# sensible quality.
#
# LOCAL AUTHORING TOOL — not part of the build, not run by `npm test`, not
# touched by CI. Windows-only (uses System.Drawing/GDI+).
#
# Site conventions (see story-bible/image-audit-2026-07.md):
#   lore / hero images  ~1600px long edge
#   character portraits ~1200px long edge
#
# Examples:
#   .\scripts\import-image.ps1 -In "$env:USERPROFILE\Downloads\Firefly_xyz.png" `
#       -Out src\images\characters\someone.jpg -MaxEdge 1200
#
#   # keep native size (most Firefly output is already within convention):
#   .\scripts\import-image.ps1 -In ".\foo.png" -Out src\images\lore\bar.jpg

#
# PHOTOGRAPHIC FINISH (default on since 2026-10-07). A generated image is
# finished toward Dermot's own photographs on the way in - black floor, eased
# saturation, a light optical softening, grain to the measured shortfall - by
# scripts/photo-finish.py, which also does the resize and the encode so the
# file is written once. -Finish 1 is Dermot's default ("Strength 1 as default
# please"); -Finish 2 is the imperfect-camera look, per image and on purpose;
# -Finish 0 is the plain GDI+ path below, for designed cards, emblems and
# Dermot's own plates, which are photographs already and are never finished.
# If python/numpy/pillow are missing the GDI+ path runs with a warning, so the
# tool never blocks on them. Why: story-bible/images.md, "Finish".

param(
  [Parameter(Mandatory = $true)][string]$In,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$MaxEdge = 0,          # 0 = leave dimensions alone
  [int]$Quality = 85,
  [int]$Finish = 1            # 0 = none (cards, plates), 1 = measured match (default), 2 = imperfect camera
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $In)) { throw "Source not found: $In" }

if ($Finish -gt 0 -and $Out -match '[\\/]codex[\\/]') {
  Write-Output "codex/ target: a designed card, not a photograph - finish skipped."
  $Finish = 0
}

if ($Finish -gt 0) {
  # The py launcher first: on a machine where `python` is only the Microsoft
  # Store alias it exits 9009, and the finish was being skipped with a warning.
  $py = Get-Command py -ErrorAction SilentlyContinue
  if (-not $py) { $py = Get-Command python -ErrorAction SilentlyContinue }
  $finishScript = Join-Path $PSScriptRoot "photo-finish.py"
  if ($py -and (Test-Path $finishScript)) {
    $outFull = $Out
    if (-not [System.IO.Path]::IsPathRooted($outFull)) { $outFull = Join-Path (Get-Location) $Out }
    $outDir = Split-Path $outFull -Parent
    if (-not (Test-Path $outDir)) { throw "Output directory does not exist: $outDir" }
    & $py.Source $finishScript (Resolve-Path $In).Path $outFull --max-edge $MaxEdge --strength $Finish --quality $Quality
    if ($LASTEXITCODE -eq 0) {
      Write-Output "Remember: update the entry's image / image_alt front matter, then run npm test."
      exit 0
    }
    Write-Warning "photo-finish.py failed (exit $LASTEXITCODE); falling back to the plain resize. pip install numpy pillow to enable the finish."
  }
  else {
    Write-Warning "python or scripts/photo-finish.py not found; the image is resized without the photographic finish. pip install numpy pillow to enable it."
  }
}

$src = [System.Drawing.Image]::FromFile((Resolve-Path $In))
$srcW = $src.Width; $srcH = $src.Height

$w = $srcW; $h = $srcH
if ($MaxEdge -gt 0) {
  $longEdge = [Math]::Max($srcW, $srcH)
  if ($longEdge -gt $MaxEdge) {
    $scale = $MaxEdge / [double]$longEdge
    $w = [int][Math]::Round($srcW * $scale)
    $h = [int][Math]::Round($srcH * $scale)
  }
}

$outFull = $Out
if (-not [System.IO.Path]::IsPathRooted($outFull)) {
  $outFull = Join-Path (Get-Location) $Out
}
$outDir = Split-Path $outFull -Parent
if (-not (Test-Path $outDir)) { throw "Output directory does not exist: $outDir" }

$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

if ($w -eq $srcW -and $h -eq $srcH) {
  $src.Save($outFull, $enc, $ep)
}
else {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($src, 0, 0, $w, $h)
  $bmp.Save($outFull, $enc, $ep)
  $g.Dispose(); $bmp.Dispose()
}
$src.Dispose()

Write-Output ("{0}: {1}x{2} -> {3}x{4}, {5} KB" -f (Split-Path $outFull -Leaf), $srcW, $srcH, $w, $h, [int]((Get-Item $outFull).Length / 1KB))
Write-Output "Remember: update the entry's image / image_alt front matter, then run npm test."
