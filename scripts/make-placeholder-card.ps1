# Generates the PORTRAIT PENDING / ILLUSTRATION PENDING cards that stand in
# where an image was removed and no replacement exists yet — and stamps each one
# so the image queue knows it is not finished work.
#
# LOCAL AUTHORING TOOL — not part of the build, not run by `npm test`, not
# touched by CI. Windows-only (System.Drawing/GDI+), deliberately: this repo has
# no image dependency and should not gain one to draw a card. That is the same
# reasoning behind make-codex-cover.ps1, and this sits beside it.
#
# WHY IT EXISTS AT ALL
#
# Twenty-eight of these cards were committed on 12 August 2026 by a script that
# lived in a session scratch directory and no longer exists. That is exactly the
# failure make-codex-cover.ps1's own header records about the original codex
# covers — "produced ad hoc and never scripted, so a broken or missing cover had
# no reproducible way to be rebuilt" — and exactly what happened to the four
# landscape lore cards in #117, whose generator was never committed either. This
# is the third occurrence, and the last one worth having.
#
# WHAT IT DRAWS
#
#   1600x900, matching the four landscape lore cards' dimensions rather than
#   make-codex-cover.ps1's square 1600x1600. Dark blue-black gradient, hairline
#   border, letter-spaced eyebrow over a short rule, serif title (wrapping to
#   two lines), sub-line, and a STAR RANGERS footer.
#
#   It does NOT draw the ringed seal and device the four good lore cards carry.
#   Those remain unreproduced; see make-lore-cards.ps1's header for that open
#   question. A placeholder arguably SHOULD look plainer than a finished card,
#   so this is a defensible difference rather than a gap to close — but it is a
#   third visual language on the site and worth deciding about deliberately.
#
# THE MARKER
#
#   Each card gets a JPEG COM segment carrying STAR-RANGERS-PLACEHOLDER, which
#   scripts/image-prompts.js reads: such an entry reports [placeholder], not
#   [done]. The marker lives inside the file, so overwriting a card with a real
#   image clears it and there is no list to keep in step.
#
# Usage:
#   .\scripts\make-placeholder-card.ps1 -Page src\lore\mnemari.md
#   .\scripts\make-placeholder-card.ps1 -All            # every card in the table
#   .\scripts\make-placeholder-card.ps1 -All -WhatIf    # say what it would do
#   .\scripts\make-placeholder-card.ps1 -MarkOnly       # stamp existing cards only
#
# -MarkOnly is the pass to run over the cards made before this script existed:
# it inserts the marker without redrawing, so nothing changes visually.

[CmdletBinding()]
param(
  [string]$Page,
  [switch]$All,
  [switch]$MarkOnly,
  [switch]$WhatIf,
  [int]$Quality = 92
)

Add-Type -AssemblyName System.Drawing

$RepoRoot  = Split-Path -Parent $PSScriptRoot
$ImagesDir = Join-Path $RepoRoot 'src\images'
$Marker    = 'STAR-RANGERS-PLACEHOLDER'
$W = 1600; $H = 900

# The twenty-eight replaced on 12 August 2026. Data, not decisions — the
# decisions are recorded in story-bible/images.md Open work 0.
$Cards = @(
  # Tier 1: photographs of real, identifiable people (PR #396)
  'src\characters\cormac-dubhghlas.md', 'src\characters\demelza-trevithick.md',
  'src\characters\fergus-aonghas.md', 'src\characters\idris-bryneth.md',
  'src\characters\imogen-petrakis.md', 'src\characters\niamh-o-ceallaigh.md',
  'src\characters\petra-voss.md', 'src\characters\rhian-gwynne.md',
  'src\characters\rhiannon-ceridwen.md', 'src\characters\sen.md',
  'src\characters\zara-wayland.md', 'src\characters\bertram-ashcombe.md',
  'src\characters\brother-daire.md', 'src\characters\ilsabet-marrowtide.md',
  'src\characters\rasa-oyelaran.md',
  # Reviewed individually (PR #398)
  'src\characters\eden-warden.md', 'src\characters\reeves.md',
  'src\lore\civilisation-comparison.md', 'src\lore\planets\ynys-wydrin.md',
  # Batch 1 remainder and Batch 2 (PR #399)
  'src\lore\mnemari.md', 'src\lore\meta-dimensional-beings.md',
  'src\lore\military-space-command.md', 'src\lore\ftl-mechanics.md',
  'src\lore\lagrange-fold-points.md', 'src\lore\chthonari.md',
  'src\lore\solar-time-and-local-calendars.md',
  # Page heroes — these carry alt inline on the <img>, not in front matter
  'src\characters\index.md', 'src\about\index.md',
  # Carded at creation, 5 September 2026: a cat is photographable, so no prompt
  # (images.md, Conventions), and no frame in own-photography.json is a cat.
  # First drawn by a Pillow port of New-Card on a Linux session; re-running
  # this script over it redraws it in Georgia. A prompt is queued for it since
  # the same evening (Dermot: a fictional character may be generated whatever
  # its species); drop this row when the portrait is filed over the card.
  'src\characters\zhulik.md'
)

# Heroes have no `image:` in front matter; their file and title are fixed here.
$HeroOverrides = @{
  'src\characters\index.md' = @{ Image = 'hero\characters-concourse.jpg'; Title = 'Characters';        Sub = 'Star Rangers' }
  'src\about\index.md'      = @{ Image = 'hero\about-writer.jpg';        Title = 'About the Author'; Sub = 'Dermot R. Cochran' }
}

function Get-FrontMatter([string]$Path) {
  $fm = @{}
  # -Encoding UTF8 is not optional. Windows PowerShell 5.1 reads as ANSI by
  # default, which turns "Niamh Ó Ceallaigh" into "Niamh Ã“ Ceallaigh" — and
  # this script draws the title, so the mojibake would be baked into a JPEG
  # rather than showing up somewhere a person would notice and fix it.
  $lines = Get-Content -LiteralPath $Path -Encoding UTF8
  if ($lines.Count -eq 0 -or $lines[0].Trim() -ne '---') { return $fm }
  for ($i = 1; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Trim() -eq '---') { break }
    if ($lines[$i] -match '^([A-Za-z_]+):\s*(.*)$') {
      $fm[$Matches[1]] = $Matches[2].Trim() -replace '^"(.*)"$', '$1'
    }
  }
  return $fm
}

function Split-Title([string]$Text, [int]$Max, [int]$MaxLines) {
  $out = @(); $cur = ''
  foreach ($w in ($Text -split '\s+' | Where-Object { $_ })) {
    if (($cur + ' ' + $w).Trim().Length -gt $Max -and $cur) { $out += $cur; $cur = $w }
    else { $cur = ($cur + ' ' + $w).Trim() }
  }
  if ($cur) { $out += $cur }
  if ($out.Count -gt $MaxLines) { $out = $out[0..($MaxLines - 1)] }
  return , $out
}

# GDI+ has no letter-spacing, so tracked text is drawn a glyph at a time. Used
# for the eyebrow and the footer, which are the two tracked elements.
function Draw-Tracked($g, [string]$Text, $Font, $Brush, [single]$CenterX, [single]$Y, [single]$Track) {
  $fmt = [System.Drawing.StringFormat]::GenericTypographic
  $widths = @()
  foreach ($c in $Text.ToCharArray()) {
    $widths += $g.MeasureString([string]$c, $Font, [System.Drawing.PointF]::new(0, 0), $fmt).Width
  }
  $total = ($widths | Measure-Object -Sum).Sum + ($Track * ($Text.Length - 1))
  $x = $CenterX - ($total / 2)
  for ($i = 0; $i -lt $Text.Length; $i++) {
    $g.DrawString([string]$Text[$i], $Font, $Brush, $x, $Y, $fmt)
    $x += $widths[$i] + $Track
  }
}

function Draw-Centred($g, [string]$Text, $Font, $Brush, [single]$CenterX, [single]$Y) {
  $fmt = [System.Drawing.StringFormat]::new()
  $fmt.Alignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString($Text, $Font, $Brush, $CenterX, $Y, $fmt)
}

function New-Card([string]$Title, [string]$Sub, [string]$Eyebrow, [string]$OutFile) {
  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  # Background: a three-stop diagonal gradient, top-left lighter.
  $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
  $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect, [System.Drawing.Color]::FromArgb(0x12, 0x18, 0x1F),
           [System.Drawing.Color]::FromArgb(0x07, 0x0A, 0x0E), 55.0)
  $blend = New-Object System.Drawing.Drawing2D.ColorBlend(3)
  $blend.Colors = @(
    [System.Drawing.Color]::FromArgb(0x12, 0x18, 0x1F),
    [System.Drawing.Color]::FromArgb(0x0B, 0x10, 0x16),
    [System.Drawing.Color]::FromArgb(0x07, 0x0A, 0x0E))
  $blend.Positions = @(0.0, 0.55, 1.0)
  $grad.InterpolationColors = $blend
  $g.FillRectangle($grad, $rect)

  # A soft glow behind the title block, so the card is not a flat field.
  $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $glowPath.AddEllipse(($W / 2) - 620, ($H * 0.38) - 420, 1240, 840)
  $glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
  $glow.CenterColor = [System.Drawing.Color]::FromArgb(90, 0x1E, 0x3A, 0x52)
  $glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
  $g.FillPath($glow, $glowPath)

  $line = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(0x2C, 0x3E, 0x4F), 2)
  $g.DrawRectangle($line, 54, 54, $W - 108, $H - 108)

  $eyebrowFont = New-Object System.Drawing.Font('Georgia', 13.5, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
  $subFont     = New-Object System.Drawing.Font('Georgia', 18.0, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
  $footFont    = New-Object System.Drawing.Font('Georgia', 12.5, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
  $eyebrowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0x6E, 0x8A, 0xA3))
  $titleBrush   = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0xE6, 0xED, 0xF3))
  $subBrush     = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0x8F, 0xA3, 0xB8))
  $footBrush    = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0x54, 0x69, 0x7D))

  Draw-Tracked $g $Eyebrow $eyebrowFont $eyebrowBrush ($W / 2) 228 8.0
  $g.DrawLine($line, ($W / 2) - 120, 300, ($W / 2) + 120, 300)

  # Title size scales smoothly with the longest line rather than stepping
  # between two values, so a short name and a long one carry equal weight in a
  # grid of these.
  $titleLines = Split-Title $Title 30 2
  $longest = ($titleLines | Measure-Object -Property Length -Maximum).Maximum
  $pt = [Math]::Max(30.0, [Math]::Min(50.0, 50.0 - (($longest - 18) * 1.12)))
  $titleFont = New-Object System.Drawing.Font('Georgia', $pt, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Point)
  $titleH = $g.MeasureString('Ag', $titleFont).Height

  $subLines = Split-Title $Sub 58 2
  $blockH = ($titleLines.Count * $titleH) + 34 + ($subLines.Count * 40)
  $y = (($H - $blockH) / 2) + 6
  foreach ($l in $titleLines) { Draw-Centred $g $l $titleFont $titleBrush ($W / 2) $y; $y += $titleH }
  $y += 30
  foreach ($l in $subLines) { Draw-Centred $g $l $subFont $subBrush ($W / 2) $y; $y += 40 }

  Draw-Tracked $g 'STAR RANGERS' $footFont $footBrush ($W / 2) ($H - 116) 3.0

  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
  $bmp.Save($OutFile, $codec, $ep)

  $g.Dispose(); $bmp.Dispose()
}

# Inserts a JPEG COM segment straight after SOI. Every decoder ignores it, and
# it survives nothing that rewrites the file — which is the point.
function Add-Marker([string]$File) {
  $bytes = [System.IO.File]::ReadAllBytes($File)
  if ($bytes.Length -lt 2 -or $bytes[0] -ne 0xFF -or $bytes[1] -ne 0xD8) {
    Write-Warning "$File is not a JPEG (no SOI); left alone."
    return $false
  }
  $head = [System.Text.Encoding]::ASCII.GetString($bytes[0..([Math]::Min(4095, $bytes.Length - 1))])
  if ($head.Contains($Marker)) { return $false }

  $text = [System.Text.Encoding]::ASCII.GetBytes($Marker)
  $len  = $text.Length + 2
  $seg  = New-Object byte[] (4 + $text.Length)
  $seg[0] = 0xFF; $seg[1] = 0xFE
  $seg[2] = [byte](($len -shr 8) -band 0xFF); $seg[3] = [byte]($len -band 0xFF)
  [Array]::Copy($text, 0, $seg, 4, $text.Length)

  # Built with Array::Copy rather than a List[byte]: PowerShell's range slicing
  # ($bytes[0..1]) yields Object[], which AddRange refuses to take as
  # IEnumerable[byte]. Copying by offset keeps everything typed and avoids
  # materialising a second copy of the whole file as boxed objects.
  $out = New-Object byte[] ($bytes.Length + $seg.Length)
  [Array]::Copy($bytes, 0, $out, 0, 2)
  [Array]::Copy($seg, 0, $out, 2, $seg.Length)
  [Array]::Copy($bytes, 2, $out, 2 + $seg.Length, $bytes.Length - 2)
  [System.IO.File]::WriteAllBytes($File, $out)
  return $true
}

function Resolve-Card([string]$PageRel) {
  $pagePath = Join-Path $RepoRoot $PageRel
  if (-not (Test-Path -LiteralPath $pagePath)) { Write-Warning "no such page: $PageRel"; return $null }

  if ($HeroOverrides.ContainsKey($PageRel)) {
    $o = $HeroOverrides[$PageRel]
    return @{ Out = (Join-Path $ImagesDir $o.Image); Title = $o.Title; Sub = $o.Sub; Eyebrow = 'ILLUSTRATION PENDING' }
  }

  $fm = Get-FrontMatter $pagePath
  if (-not $fm.ContainsKey('image')) { Write-Warning "$PageRel has no image: field"; return $null }
  $isCharacter = $PageRel -like '*\characters\*'
  $dir = if ($isCharacter) { 'characters' } elseif ($PageRel -like '*\lore\*') { 'lore' } else { 'hero' }
  return @{
    Out     = (Join-Path (Join-Path $ImagesDir $dir) ($fm['image'] -replace '/', '\'))
    Title   = $(if ($fm.ContainsKey('title')) { $fm['title'] } else { [IO.Path]::GetFileNameWithoutExtension($PageRel) })
    Sub     = $(if ($isCharacter) { if ($fm.ContainsKey('role')) { $fm['role'] } else { '' } } else { if ($fm.ContainsKey('category')) { $fm['category'] } else { '' } })
    Eyebrow = $(if ($isCharacter) { 'PORTRAIT PENDING' } else { 'ILLUSTRATION PENDING' })
  }
}

$targets = if ($All -or $MarkOnly) { $Cards } elseif ($Page) { @($Page) } else {
  Write-Error 'Pass -Page <path.md>, or -All, or -MarkOnly.'; exit 1
}

$drawn = 0; $marked = 0; $skipped = 0
foreach ($p in $targets) {
  $card = Resolve-Card $p
  if (-not $card) { $skipped++; continue }
  $rel = $card.Out.Substring($RepoRoot.Length + 1)

  if ($MarkOnly) {
    if (-not (Test-Path -LiteralPath $card.Out)) { Write-Warning "missing: $rel"; $skipped++; continue }
    if ($WhatIf) { Write-Output "would mark  $rel"; continue }
    if (Add-Marker $card.Out) { Write-Output "marked      $rel"; $marked++ }
    else { Write-Output "already     $rel"; $skipped++ }
    continue
  }

  if ($WhatIf) { Write-Output "would draw  $rel  `"$($card.Title)`""; continue }
  New-Card $card.Title $card.Sub $card.Eyebrow $card.Out
  if (Add-Marker $card.Out) { $marked++ } else { Write-Warning "marker not applied: $rel" }
  Write-Output "drew        $rel  `"$($card.Title)`""
  $drawn++
}

if (-not $WhatIf) {
  Write-Output ''
  Write-Output "$drawn drawn, $marked marked, $skipped skipped."
}
