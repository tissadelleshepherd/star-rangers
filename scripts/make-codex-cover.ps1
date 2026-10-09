# Generates a Star Rangers codex cover card as a JPG, matching the designed
# dark-gradient template used by src/images/codex/*.jpg.
#
# LOCAL AUTHORING TOOL — not part of the build, not run by `npm test`, not
# touched by CI. Windows-only (uses System.Drawing/GDI+). It exists because the
# original codex covers were produced ad hoc and never scripted, so a broken or
# missing cover had no reproducible way to be rebuilt. Text is rendered by the
# font engine, so titles come out sharp and correctly spelled — unlike an image
# generator, which cannot be trusted with lettering.
#
# Example:
#   .\scripts\make-codex-cover.ps1 `
#       -TitleLines "THE COSMIC LIMITATION","ON EVIL" `
#       -Category "DOCTRINAL RECORD" `
#       -Subtitle "The One Confirmed Exception" `
#       -Institution "Survey Archive - Doctrinal Division" `
#       -Author "THEORIST EMRYS KADE" `
#       -Stamp "CONTESTED" -Motif dissolution `
#       -Out src\images\codex\cosmic-limitation-on-evil.jpg
#
# Motifs: rules (ruled lines, the template default seen on Redline Protocol),
#         dissolution (a ring fading round its circumference),
#         none.
#
# -Underlay puts a photograph behind the lettering instead of the gradient, so
# this becomes the compositor for picture-led cards as well as designed ones:
#
#   .\scripts\make-codex-cover.ps1 `
#       -Underlay art\slipwave-common-room.jpg -Scrim 66 `
#       -TitleLines "BALLAD OF THE STARS" `
#       -Category "CULTURAL RECORD" `
#       -Institution "Eden Space Habitat Collections" `
#       -Out src\images\codex\ballad-of-the-stars.jpg
#
# WHY IT EXISTS: an image generator cannot spell, and every card it letters
# arrives with a word like "superical" in it. Generate the picture wordless,
# then run it through here - the font engine sets the type, so the words are
# typed rather than drawn, and they are correct by construction.
#
# The underlay is centre-cropped to fill the square, then darkened by a scrim
# heaviest at the two bands the lettering occupies: the category line at the
# top and the title block below the divider. That is what keeps text legible
# over an unknown photograph without hiding the middle of it.
#
# Generate the underlay SQUARE. The card is 1:1 and cropping is centred, so a
# 16:9 source loses a third of its width and a panorama loses most of itself -
# and what it loses is whatever the composition put at the edges.

param(
  [Parameter(Mandatory = $true)][string[]]$TitleLines,
  [Parameter(Mandatory = $true)][string]$Category,
  [string]$Subtitle = "",
  [string]$Institution = "",
  [string]$Author = "",
  [string]$Stamp = "",
  [ValidateSet("rules", "dissolution", "none")][string]$Motif = "rules",
  [string]$Underlay = "",
  [ValidateRange(0, 100)][int]$Scrim = 62,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$Size = 1600,
  [int]$Quality = 94
)

# A motif drawn over a photograph fights it, so an underlay turns the motif off
# unless one was asked for explicitly. Passing -Motif rules alongside -Underlay
# still does exactly what it says.
if ($Underlay -and -not $PSBoundParameters.ContainsKey("Motif")) { $Motif = "none" }

Add-Type -AssemblyName System.Drawing

$W = $Size; $H = $Size
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
$tf = [System.Drawing.StringFormat]::GenericTypographic
$s = $W / 1600.0   # scale factor if a non-default size is requested

function New-Col([int]$a, [int]$r, [int]$gr, [int]$b) {
  return [System.Drawing.Color]::FromArgb($a, $r, $gr, $b)
}

function Measure-Tracked {
  param([string]$text, [System.Drawing.Font]$font, [double]$tracking)
  $total = 0.0
  foreach ($ch in $text.ToCharArray()) {
    if ($ch -eq ' ') { $w = [double]($font.Size * 0.40) }
    else { $w = [double]$script:g.MeasureString([string]$ch, $font, 4000, $script:tf).Width }
    $total = $total + $w + $tracking
  }
  return ($total - $tracking)
}

function Draw-Tracked {
  param(
    [string]$text, [System.Drawing.Font]$font, [System.Drawing.Brush]$brush,
    [double]$centerX, [double]$y, [double]$tracking
  )
  if ([string]::IsNullOrEmpty($text)) { return }
  $x = $centerX - ((Measure-Tracked -text $text -font $font -tracking $tracking) / 2.0)
  foreach ($ch in $text.ToCharArray()) {
    if ($ch -eq ' ') { $w = [double]($font.Size * 0.40) }
    else {
      $w = [double]$script:g.MeasureString([string]$ch, $font, 4000, $script:tf).Width
      $script:g.DrawString([string]$ch, $font, $brush, [single]$x, [single]$y, $script:tf)
    }
    $x = $x + $w + $tracking
  }
}

# Vertical alpha wash between two y positions. The brush is built over a
# rectangle one pixel taller than the fill on each side: GDI+ otherwise renders
# a hairline of the wrong colour along a gradient's first row.
function Fill-VWash {
  param([double]$y0, [double]$y1, [System.Drawing.Color]$top, [System.Drawing.Color]$bottom)
  if ($y1 -le $y0) { return }
  $fill = New-Object System.Drawing.Rectangle(0, [int]$y0, $script:W, [int]($y1 - $y0))
  $span = New-Object System.Drawing.Rectangle(0, [int]($y0 - 1), $script:W, [int]($y1 - $y0 + 2))
  $br = New-Object System.Drawing.Drawing2D.LinearGradientBrush($span, $top, $bottom, 90.0)
  $script:g.FillRectangle($br, $fill)
  $br.Dispose()
}

# ---------- background ----------
if ($Underlay) {
  $underFull = $Underlay
  if (-not [System.IO.Path]::IsPathRooted($underFull)) {
    $underFull = Join-Path (Get-Location) $Underlay
  }
  if (-not (Test-Path -LiteralPath $underFull)) {
    throw "make-codex-cover.ps1: -Underlay file not found: $underFull"
  }

  $img = [System.Drawing.Image]::FromFile($underFull)
  try {
    # Centre-crop to fill the square: scale by the larger ratio, centre the
    # overflow. A card is square and a photograph rarely is, so something has
    # to go, and cropping beats letterboxing a designed card.
    $scale = [Math]::Max($W / [double]$img.Width, $H / [double]$img.Height)
    $dw = $img.Width * $scale
    $dh = $img.Height * $scale
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, [single](($W - $dw) / 2.0), [single](($H - $dh) / 2.0), [single]$dw, [single]$dh)
  }
  finally {
    $img.Dispose()
  }

  # Scrim, in the template's navy rather than neutral black so the photograph
  # is tinted toward the set's palette instead of merely darkened. Three
  # passes: an overall veil, then the two bands the lettering sits in.
  $veil = [int](255 * ($Scrim / 100.0) * 0.35)
  $topA = [int](255 * ($Scrim / 100.0) * 0.85)
  $botA = [Math]::Min(235, [int](255 * ($Scrim / 100.0)))

  $allRect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
  $veilBrush = New-Object System.Drawing.SolidBrush(New-Col $veil 10 12 20)
  $g.FillRectangle($veilBrush, $allRect)
  $veilBrush.Dispose()

  Fill-VWash -y0 0 -y1 (420 * $s) -top (New-Col $topA 8 10 16) -bottom (New-Col 0 8 10 16)
  Fill-VWash -y0 (760 * $s) -y1 $H -top (New-Col 0 8 10 16) -bottom (New-Col $botA 8 10 16)
}
else {
  $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
  $lg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, (New-Col 255 26 32 46), (New-Col 255 8 10 16), 50.0)
  $g.FillRectangle($lg, $rect)

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddEllipse((-500 * $s), (-700 * $s), (2200 * $s), (1900 * $s))
  $pgb = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
  $pgb.CenterColor = (New-Col 46 92 124 190)
  $pgb.SurroundColors = @((New-Col 0 10 12 20))
  $g.FillPath($pgb, $path)
}

$barRect = New-Object System.Drawing.Rectangle(0, 0, $W, [int](7 * $s))
$bar = New-Object System.Drawing.Drawing2D.LinearGradientBrush($barRect, (New-Col 255 74 104 164), (New-Col 255 128 158 216), 0.0)
$g.FillRectangle($bar, $barRect)

# ---------- fonts ----------
function New-F([string]$name, [double]$px) {
  return New-Object System.Drawing.Font($name, [single]($px * $s), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
}
$fCat   = New-F "Consolas" 26
$fStamp = New-F "Consolas" 25
$fSub   = New-F "Georgia"  46
$fInst  = New-F "Georgia"  34
$fAuth  = New-F "Consolas" 23

$cx = $W / 2.0

# ---------- category ----------
$bCat = New-Object System.Drawing.SolidBrush(New-Col 255 127 159 212)
Draw-Tracked -text $Category -font $fCat -brush $bCat -centerX $cx -y (92 * $s) -tracking (9 * $s)

# ---------- motif ----------
if ($Motif -eq "rules") {
  $ruleY = 300 * $s
  $widths = @(1355, 1355, 1355, 1035)
  for ($i = 0; $i -lt 4; $i++) {
    $al = 46 - ($i * 6)
    $pen = New-Object System.Drawing.Pen((New-Col $al 150 175 225), [single](1.5 * $s))
    $g.DrawLine($pen, [single](122 * $s), [single]$ruleY, [single]((122 + $widths[$i]) * $s), [single]$ruleY)
    $pen.Dispose()
    $ruleY = $ruleY + (52 * $s)
  }
}
elseif ($Motif -eq "dissolution") {
  $mx = $cx; $my = 500 * $s
  foreach ($ring in @(@(178, 160, 1.7, 140, 2.2), @(118, 80, 2.4, 150, 1.6))) {
    $r = $ring[0] * $s; $peak = $ring[1]; $pow = $ring[2]; $from = $ring[3]; $wid = $ring[4]
    for ($i = 0; $i -lt 240; $i++) {
      $a0 = $i * 1.5
      $rad = ($a0 - $from) * [Math]::PI / 180.0
      $f = (1.0 + [Math]::Cos($rad)) / 2.0
      $alpha = [int]($peak * [Math]::Pow($f, $pow))
      if ($alpha -gt 2) {
        $pen = New-Object System.Drawing.Pen((New-Col $alpha 150 175 228), [single]($wid * $s))
        $g.DrawArc($pen, [single]($mx - $r), [single]($my - $r), [single](2 * $r), [single](2 * $r), [single]$a0, [single]1.2)
        $pen.Dispose()
      }
    }
  }
  $rnd = New-Object System.Random(7)
  for ($i = 0; $i -lt 34; $i++) {
    $ang = (300 + $rnd.Next(0, 90)) * [Math]::PI / 180.0
    $dist = (178 + 14 + $rnd.Next(0, 130)) * $s
    $px = $mx + [Math]::Cos($ang) * $dist
    $py = $my + [Math]::Sin($ang) * $dist * 0.9
    $al = 46 - [int]($i * 1.1)
    if ($al -gt 3) {
      $sb = New-Object System.Drawing.SolidBrush(New-Col $al 160 185 235)
      $sz = (1.6 + ($rnd.NextDouble() * 2.0)) * $s
      $g.FillEllipse($sb, [single]$px, [single]$py, [single]$sz, [single]$sz)
      $sb.Dispose()
    }
  }
}

# ---------- stamp ----------
if (-not [string]::IsNullOrEmpty($Stamp)) {
  $state = $g.Save()
  $g.TranslateTransform([single](1368 * $s), [single](152 * $s))
  $g.RotateTransform(-8)
  $halfW = ((Measure-Tracked -text $Stamp -font $fStamp -tracking (7 * $s)) / 2.0) + (22 * $s)
  $penS = New-Object System.Drawing.Pen((New-Col 200 112 142 202), [single](3 * $s))
  $g.DrawRectangle($penS, [single](-$halfW), [single](-33 * $s), [single](2 * $halfW), [single](66 * $s))
  $bStamp = New-Object System.Drawing.SolidBrush(New-Col 215 138 166 224)
  $stampY = -15.0 * $s
  Draw-Tracked -text $Stamp -font $fStamp -brush $bStamp -centerX 0 -y $stampY -tracking (7 * $s)
  $g.Restore($state)
}

# ---------- divider ----------
$divY = 1042 * $s
$penD = New-Object System.Drawing.Pen((New-Col 120 150 175 225), [single](1.6 * $s))
$g.DrawLine($penD, [single]($cx - 112 * $s), [single]$divY, [single]($cx + 112 * $s), [single]$divY)
$penD2 = New-Object System.Drawing.Pen((New-Col 40 150 175 225), [single](5 * $s))
$g.DrawLine($penD2, [single]($cx - 94 * $s), [single]$divY, [single]($cx + 94 * $s), [single]$divY)

# ---------- title (auto-fit to the longest line) ----------
$maxW = 1310 * $s
$px = 112.0
$fT = $null
while ($px -gt 40) {
  if ($fT) { $fT.Dispose() }
  $fT = New-F "Georgia" $px
  $widest = 0.0
  foreach ($ln in $TitleLines) {
    $w = Measure-Tracked -text $ln -font $fT -tracking (5 * $s)
    if ($w -gt $widest) { $widest = $w }
  }
  if ($widest -le $maxW) { break }
  $px = $px - 2
}
$bTitle = New-Object System.Drawing.SolidBrush(New-Col 255 205 213 233)
$ty = 1092 * $s
foreach ($ln in $TitleLines) {
  Draw-Tracked -text $ln -font $fT -brush $bTitle -centerX $cx -y $ty -tracking (5 * $s)
  $ty = $ty + ($px * 1.16 * $s)
}
$titleBottom = $ty + ($px * $s * 0.10)

# ---------- subtitle / institution / author ----------
$bSub = New-Object System.Drawing.SolidBrush(New-Col 255 159 176 208)
Draw-Tracked -text $Subtitle -font $fSub -brush $bSub -centerX $cx -y ($titleBottom + 18 * $s) -tracking (1 * $s)

$bInst = New-Object System.Drawing.SolidBrush(New-Col 255 124 138 168)
$instText = $Institution.Replace(" - ", " " + [char]0x00B7 + " ")
Draw-Tracked -text $instText -font $fInst -brush $bInst -centerX $cx -y ($titleBottom + 84 * $s) -tracking (1 * $s)

$bAuth = New-Object System.Drawing.SolidBrush(New-Col 255 107 119 144)
Draw-Tracked -text $Author -font $fAuth -brush $bAuth -centerX $cx -y ($titleBottom + 168 * $s) -tracking (7 * $s)

# ---------- save ----------
$outFull = $Out
if (-not [System.IO.Path]::IsPathRooted($outFull)) {
  $outFull = Join-Path (Get-Location) $Out
}
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
$bmp.Save($outFull, $enc, $ep)
$g.Dispose(); $bmp.Dispose()
Write-Output ("Wrote {0} ({1} KB), title {2}px" -f $outFull, [int]((Get-Item $outFull).Length / 1KB), [int]$px)
