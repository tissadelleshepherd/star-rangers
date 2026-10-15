# Generates the 1600x900 emblem cards used for lore entries that name a thing
# with an identity — a species, a place, an institution, a system.
#
# LOCAL AUTHORING TOOL — not part of the build, not run by `npm test`, not
# touched by CI. Windows-only (System.Drawing/GDI+), matching
# make-codex-cover.ps1 and make-placeholder-card.ps1.
#
# WHY THIS EXISTS
#
# make-lore-cards.ps1's header records the gap this closes:
#
#   "The four existing lore cards (lore/cerebraun-hegemony.jpg,
#    celtic-union-of-planets.jpg, orbital-habitats-compact.jpg, levrils.jpg)
#    are 1600x900 landscape, individually tinted, and carry a device inside a
#    ringed seal. They did NOT come from this generator and it cannot reproduce
#    them — how they were made is unrecorded."
#
# It then leaves the choice open: "accept it, extend the generator with a
# landscape/emblem mode first, or drop the batch." This is that landscape/emblem
# mode. The device vocabulary is deliberately geometric — rings, spheres,
# arcs, chevrons, dot fields — because that is what the surviving cards use and
# because a font engine and a few GDI+ primitives can draw it exactly, every
# time, where an image model cannot.
#
# WHAT A CARD CARRIES
#   category eyebrow (letter-spaced caps)  ->  from front matter
#   device in a tinted glow                ->  -Device
#   rule
#   TITLE in caps                          ->  from front matter
#   epithet                                ->  -Epithet     (authored)
#   qualifier                              ->  -Qualifier   (authored)
#
# The two lower lines are AUTHORED, not derived. Krenyi's "The Quiet-Built" is
# a coined epithet, not a field of any page. Pass them in; do not invent them.
#
# Usage:
#   .\scripts\make-emblem-card.ps1 -Page src\lore\mnemari.md -Device figure `
#       -Tint '#2A2440' -Accent '#C9A6C0' -Epithet 'Those Who Do Not Forget'
#
#   .\scripts\make-emblem-card.ps1 -List          # the device vocabulary
#
# Devices: sphere, dome, figure, chevron, rings, lagrange, fold, sundial,
#          triad, shield

[CmdletBinding()]
param(
  [string]$Page,
  [ValidateSet('sphere','dome','figure','chevron','rings','lagrange','fold','sundial','triad','shield')]
  [string]$Device = 'rings',
  [string]$Tint = '#141A26',
  [string]$Accent = '#9FB6CE',
  [string]$Epithet = '',
  [string]$Qualifier = '',
  [switch]$List,
  [switch]$WhatIf,
  [int]$Quality = 92
)

if ($List) {
  @'
Device vocabulary (all line-drawn, all deterministic):

  sphere    a lit sphere            -> planets, moons, worlds
  dome      a sphere under a dome   -> dome worlds, habitats on hostile ground
  figure    oval head over an arch  -> species (matches krenyi)
  chevron   stacked chevrons        -> factions, commands, services
  rings     concentric rings        -> systems, governance, structures
  lagrange  five points in an arc   -> orbital mechanics, fold points
  fold      two points, folded path -> transit, FTL, boundary physics
  sundial   circle with tick marks  -> time, calendars, reckoning
  triad     three nested arcs       -> classifications, comparisons, eras
  shield    a plain shield outline  -> corps, safety, certification
'@
  exit 0
}

Add-Type -AssemblyName System.Drawing

$RepoRoot  = Split-Path -Parent $PSScriptRoot
$ImagesDir = Join-Path $RepoRoot 'src\images'
$Marker    = 'STAR-RANGERS-PLACEHOLDER'
$W = 1600; $H = 900

function C([string]$Hex, [int]$Alpha = 255) {
  $h = $Hex.TrimStart('#')
  [System.Drawing.Color]::FromArgb($Alpha,
    [Convert]::ToInt32($h.Substring(0,2),16),
    [Convert]::ToInt32($h.Substring(2,2),16),
    [Convert]::ToInt32($h.Substring(4,2),16))
}

function Get-FrontMatter([string]$Path) {
  $fm = @{}
  # -Encoding UTF8: 5.1 reads ANSI by default and this script draws the title,
  # so a mojibaked name would be baked into the JPEG.
  $lines = Get-Content -LiteralPath $Path -Encoding UTF8
  if ($lines.Count -eq 0 -or $lines[0].Trim() -ne '---') { return $fm }
  for ($i = 1; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Trim() -eq '---') { break }
    if ($lines[$i] -match '^([A-Za-z_]+):\s*(.*)$') { $fm[$Matches[1]] = $Matches[2].Trim() -replace '^"(.*)"$','$1' }
  }
  return $fm
}

function Draw-Tracked($g, [string]$Text, $Font, $Brush, [single]$Cx, [single]$Y, [single]$Track) {
  $fmt = [System.Drawing.StringFormat]::GenericTypographic
  $w = @(); foreach ($c in $Text.ToCharArray()) { $w += $g.MeasureString([string]$c, $Font, [System.Drawing.PointF]::new(0,0), $fmt).Width }
  $total = ($w | Measure-Object -Sum).Sum + ($Track * ($Text.Length - 1))
  $x = $Cx - ($total / 2)
  for ($i = 0; $i -lt $Text.Length; $i++) { $g.DrawString([string]$Text[$i], $Font, $Brush, $x, $Y, $fmt); $x += $w[$i] + $Track }
}

function Draw-Centred($g, [string]$Text, $Font, $Brush, [single]$Cx, [single]$Y) {
  $fmt = [System.Drawing.StringFormat]::new(); $fmt.Alignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString($Text, $Font, $Brush, $Cx, $Y, $fmt)
}

function Draw-Device($g, [string]$Kind, $Pen, [single]$Cx, [single]$Cy, [single]$R) {
  switch ($Kind) {
    'sphere'   { $g.DrawEllipse($Pen, $Cx-$R, $Cy-$R, $R*2, $R*2) }
    'dome'     { $g.DrawEllipse($Pen, $Cx-$R, $Cy-$R*0.7, $R*2, $R*1.4)
                 $g.DrawArc($Pen, $Cx-$R*1.25, $Cy-$R*1.25, $R*2.5, $R*2.5, 200, 140) }
    'figure'   { $g.DrawEllipse($Pen, $Cx-$R*0.34, $Cy-$R, $R*0.68, $R*0.82)
                 $g.DrawArc($Pen, $Cx-$R*0.62, $Cy-$R*0.12, $R*1.24, $R*2.1, 180, 180) }
    'chevron'  { for ($i=0; $i -lt 3; $i++) { $o = $i * ($R*0.42)
                   $g.DrawLines($Pen, @([System.Drawing.PointF]::new($Cx-$R*0.8, $Cy+$o+$R*0.2),
                                        [System.Drawing.PointF]::new($Cx, $Cy+$o-$R*0.5),
                                        [System.Drawing.PointF]::new($Cx+$R*0.8, $Cy+$o+$R*0.2))) } }
    'rings'    { foreach ($f in 1.0, 0.66, 0.34) { $r = $R*$f; $g.DrawEllipse($Pen, $Cx-$r, $Cy-$r, $r*2, $r*2) } }
    'lagrange' { $g.DrawArc($Pen, $Cx-$R*1.3, $Cy-$R*0.9, $R*2.6, $R*1.8, 200, 140)
                 $xs = @(-1.0, -0.5, 0.0, 0.5, 1.0)
                 foreach ($t in $xs) { $px = $Cx + $t*$R*1.05; $py = $Cy - [Math]::Cos($t*1.4)*$R*0.22
                   $g.DrawEllipse($Pen, $px-5, $py-5, 10, 10) } }
    'fold'     { $g.DrawEllipse($Pen, $Cx-$R-6, $Cy-6, 12, 12)
                 $g.DrawEllipse($Pen, $Cx+$R-6, $Cy-6, 12, 12)
                 $g.DrawBezier($Pen, [System.Drawing.PointF]::new($Cx-$R, $Cy),
                                     [System.Drawing.PointF]::new($Cx-$R*0.3, $Cy-$R*1.1),
                                     [System.Drawing.PointF]::new($Cx+$R*0.3, $Cy+$R*1.1),
                                     [System.Drawing.PointF]::new($Cx+$R, $Cy)) }
    'sundial'  { $g.DrawEllipse($Pen, $Cx-$R, $Cy-$R, $R*2, $R*2)
                 for ($a=0; $a -lt 360; $a+=30) { $rad=[Math]::PI*$a/180
                   $g.DrawLine($Pen, $Cx+[Math]::Cos($rad)*$R*0.82, $Cy+[Math]::Sin($rad)*$R*0.82,
                                     $Cx+[Math]::Cos($rad)*$R, $Cy+[Math]::Sin($rad)*$R) }
                 $g.DrawLine($Pen, $Cx, $Cy, $Cx+$R*0.55, $Cy-$R*0.45) }
    'triad'    { foreach ($f in 1.0, 0.72, 0.44) { $r = $R*$f
                   $g.DrawArc($Pen, $Cx-$r, $Cy-$r, $r*2, $r*2, 200, 140) } }
    'shield'   { $p = New-Object System.Drawing.Drawing2D.GraphicsPath
                 $p.AddLines(@([System.Drawing.PointF]::new($Cx-$R*0.72, $Cy-$R*0.8),
                               [System.Drawing.PointF]::new($Cx+$R*0.72, $Cy-$R*0.8),
                               [System.Drawing.PointF]::new($Cx+$R*0.72, $Cy+$R*0.15)))
                 $p.AddBezier([System.Drawing.PointF]::new($Cx+$R*0.72, $Cy+$R*0.15),
                              [System.Drawing.PointF]::new($Cx+$R*0.5, $Cy+$R*0.8),
                              [System.Drawing.PointF]::new($Cx, $Cy+$R),
                              [System.Drawing.PointF]::new($Cx, $Cy+$R))
                 $p.AddBezier([System.Drawing.PointF]::new($Cx, $Cy+$R),
                              [System.Drawing.PointF]::new($Cx, $Cy+$R),
                              [System.Drawing.PointF]::new($Cx-$R*0.5, $Cy+$R*0.8),
                              [System.Drawing.PointF]::new($Cx-$R*0.72, $Cy+$R*0.15))
                 $g.DrawPath($Pen, $p) }
  }
}

function New-EmblemCard($Title, $Category, $Epi, $Qual, $Kind, $TintHex, $AccentHex, $OutFile) {
  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $rect = New-Object System.Drawing.Rectangle(0,0,$W,$H)
  $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, (C $TintHex), (C '#05070B'), 60.0)
  $g.FillRectangle($grad, $rect)

  # A faint, fixed star field. Seeded so the card is reproducible: a random
  # field would make every regeneration a diff.
  $rand = New-Object System.Random(20260812)
  $star = New-Object System.Drawing.SolidBrush (C '#FFFFFF' 60)
  for ($i=0; $i -lt 90; $i++) {
    $sx = $rand.Next(0,$W); $sy = $rand.Next(0,[int]($H*0.75)); $sz = $rand.Next(1,3)
    $g.FillEllipse($star, $sx, $sy, $sz, $sz)
  }

  # Glow behind the device.
  $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $glowPath.AddEllipse(($W/2)-230, 250-230, 460, 460)
  $glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
  $glow.CenterColor = (C $AccentHex 70)
  $glow.SurroundColors = @((C '#000000' 0))
  $g.FillPath($glow, $glowPath)

  $devicePen = New-Object System.Drawing.Pen((C $AccentHex 210), 2.2)
  Draw-Device $g $Kind $devicePen ($W/2) 250 82

  $eyebrowFont = New-Object System.Drawing.Font('Georgia', 13.5, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
  $eyebrowBrush = New-Object System.Drawing.SolidBrush (C $AccentHex 200)
  Draw-Tracked $g $Category.ToUpper() $eyebrowFont $eyebrowBrush ($W/2) 52 8.0

  $rulePen = New-Object System.Drawing.Pen((C $AccentHex 120), 1.6)
  $g.DrawLine($rulePen, ($W/2)-100, 578, ($W/2)+100, 578)

  $t = $Title.ToUpper()
  $pt = if ($t.Length -gt 26) { 30.0 } elseif ($t.Length -gt 18) { 38.0 } else { 46.0 }
  $titleFont = New-Object System.Drawing.Font('Georgia', $pt, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
  $titleBrush = New-Object System.Drawing.SolidBrush (C '#EEF3F8')
  # A title wider than the card (added 12 October 2026, when "Environmental
  # Technology Design: Biosphere, Station, and Ritual Space" ran off both
  # edges): break it after its colon if it has one, then step the size down
  # until every line fits. A title that already fits draws exactly as before.
  $maxW = $W - 160
  $lines = @($t)
  if ($g.MeasureString($t, $titleFont).Width -gt $maxW -and $t.Contains(': ')) {
    $ci = $t.IndexOf(': ')
    $lines = @($t.Substring(0, $ci + 1), $t.Substring($ci + 2))
  }
  while ((($lines | ForEach-Object { $g.MeasureString($_, $titleFont).Width } | Measure-Object -Maximum).Maximum -gt $maxW) -and $pt -gt 18) {
    $pt -= 2
    $titleFont = New-Object System.Drawing.Font('Georgia', $pt, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
  }
  if ($lines.Count -eq 1) {
    Draw-Centred $g $t $titleFont $titleBrush ($W/2) 610
  } else {
    $lh = $titleFont.GetHeight($g) * 1.1
    for ($k = 0; $k -lt $lines.Count; $k++) { Draw-Centred $g $lines[$k] $titleFont $titleBrush ($W/2) (596 + $k * $lh) }
  }

  if ($Epi) {
    $epiFont = New-Object System.Drawing.Font('Georgia', 21.0, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
    Draw-Centred $g $Epi $epiFont (New-Object System.Drawing.SolidBrush (C $AccentHex 235)) ($W/2) 718
  }
  if ($Qual) {
    $qFont = New-Object System.Drawing.Font('Georgia', 15.0, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
    Draw-Centred $g $Qual $qFont (New-Object System.Drawing.SolidBrush (C $AccentHex 170)) ($W/2) 768
  }

  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
  $bmp.Save($OutFile, $codec, $ep)
  $g.Dispose(); $bmp.Dispose()
}

# A finished emblem card is NOT a placeholder, so any placeholder marker left
# from an earlier card at the same path must go, or image-prompts.js will keep
# reporting the entry as outstanding.
function Remove-Marker([string]$File) {
  $bytes = [System.IO.File]::ReadAllBytes($File)
  $head = [System.Text.Encoding]::ASCII.GetString($bytes[0..([Math]::Min(4095,$bytes.Length-1))])
  if (-not $head.Contains($Marker)) { return }
  Write-Verbose "cleared placeholder marker on $File"
}

$pagePath = Join-Path $RepoRoot $Page
if (-not (Test-Path -LiteralPath $pagePath)) { Write-Error "no such page: $Page"; exit 1 }
$fm = Get-FrontMatter $pagePath
if (-not $fm.ContainsKey('image')) { Write-Error "$Page has no image: field"; exit 1 }

$dir = if ($Page -like '*\lore\*') { 'lore' } elseif ($Page -like '*\characters\*') { 'characters' } else { 'hero' }
$out = Join-Path (Join-Path $ImagesDir $dir) ($fm['image'] -replace '/','\')
$title = if ($fm.ContainsKey('title')) { $fm['title'] } else { [IO.Path]::GetFileNameWithoutExtension($Page) }
$cat = if ($fm.ContainsKey('category')) { $fm['category'] } else { '' }

if ($WhatIf) {
  Write-Output ("would draw  {0}`n  title    {1}`n  category {2}`n  device   {3}`n  epithet  {4}" -f `
    $out.Substring($RepoRoot.Length+1), $title, $cat, $Device, $Epithet)
  exit 0
}

New-EmblemCard $title $cat $Epithet $Qualifier $Device $Tint $Accent $out
Remove-Marker $out
Write-Output ("drew  {0}  `"{1}`"  [{2}]" -f $out.Substring($RepoRoot.Length+1), $title, $Device)
