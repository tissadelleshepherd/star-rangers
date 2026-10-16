# Files generated or downloaded images into src/images/ at the right size and
# name, and stages them on a branch.
#
# LOCAL AUTHORING TOOL - not part of the build, not run by `npm test`, not
# touched by CI. Windows-only, because it drives import-image.ps1, which is
# (System.Drawing/GDI+). Same standing as make-lore-cards.ps1.
#
# WHY THIS EXISTS: twenty-three lore images meant saving each file, resizing
# it, working out which of src/images/characters/, src/images/lore/,
# .../universes/ or .../planets/ it belonged in, renaming it, and opening a
# PR. scripts/image-prompts.js removes the prompting; this removes everything
# after the image exists.
#
# TWO MODES, PICKED AUTOMATICALLY
#
# MANIFEST MODE - after `image-prompts.js --generate`. Every image is already
# in image-out/ under a key naming its target exactly, so there is nothing to
# pair and nothing to guess. The only choice left is which variation:
# -Pick "<key>=<n>", default 1. This is the mode to prefer.
#
# DOWNLOADS MODE - the clipboard loop, where images arrive in a browser's
# Downloads folder with names that say nothing about what they are. Pairing is
# POSITIONAL: image-prompts.js records the order it served prompts, downloads
# are taken oldest-first, and the two lists are zipped. That holds only as
# long as one image was downloaded per prompt, in the order served.
#
# WHICH IS WHY -WhatIf EXISTS, AND WHY YOU SHOULD USE IT FIRST in downloads
# mode. A re-roll you saved twice, or a prompt you skipped, puts the zip off
# by one FROM THAT POINT ON, and every later image lands under the wrong name.
# -WhatIf prints the whole pairing and changes nothing; -Map overrides any
# pair that is wrong; leftover downloads are reported rather than ignored.
#
# WHAT STAYS MANUAL, ON PURPOSE:
#
#   - Which variation is the keeper.
#   - Writing `image` / `image_alt` into each page's front matter. Alt text
#     describes what the file ACTUALLY SHOWS, which cannot be derived from the
#     prompt that asked for it - see story-bible/images.md, "Alt text is the
#     prompt of record."
#   - Merging. New portraits and lore images are the repo's "draft it and stop"
#     tier: the PR is a proposal.
#
# USAGE
#   .\scripts\image-file.ps1 -WhatIf                    # show what would happen
#   .\scripts\image-file.ps1                            # resize, file, branch
#   .\scripts\image-file.ps1 -Pick "lore-arilon=2"      # manifest mode: variation 2
#   .\scripts\image-file.ps1 -From "$env:USERPROFILE\Downloads"   # force downloads mode
#   .\scripts\image-file.ps1 -Map "lore-arilon=abc.png"           # downloads mode: fix a pair
#   .\scripts\image-file.ps1 -NoBranch                  # file into the working tree only
#
# -Since (downloads mode) defaults to the last 24 hours, so an old Downloads
# folder does not get dragged in. Widen it if a session ran long.

param(
  [string]$From = "",
  [string[]]$Map,
  [string[]]$Pick,
  [string[]]$Only,
  [string[]]$Skip,
  [int]$Since = 24,
  [string]$Branch = "",
  [switch]$NoBranch,
  [switch]$WhatIf
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$progressPath = Join-Path $repoRoot "image-out\progress.json"
$manifestPath = Join-Path $repoRoot "image-out\manifest.json"

# Shared tail for both modes: resize each source to convention through
# import-image.ps1, put it at its target path, and stage the lot on a branch.
# Defined up here because PowerShell resolves a call against what has already
# been parsed, and manifest mode returns long before the end of the file.
function Invoke-Filing {
  param([Parameter(Mandatory)][object[]]$Pairs)

  Write-Host ""
  foreach ($p in $Pairs) {
    $dest = Join-Path $repoRoot $p.Target
    $destDir = Split-Path -Parent $dest
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force $destDir | Out-Null }
    & (Join-Path $PSScriptRoot "import-image.ps1") -In $p.Source.FullName -Out $dest -MaxEdge $p.MaxEdge
    Write-Host ("filed  {0}" -f $p.Target) -ForegroundColor Green
  }

  if ($NoBranch) {
    Write-Host "`n$($Pairs.Count) image(s) filed. -NoBranch: not staged."
    return
  }

  $b = $Branch
  if (-not $b) { $b = "lore-art-" + (Get-Date -Format "yyyy-MM-dd-HHmm") }

  Push-Location $repoRoot
  try {
    git checkout -b $b
    foreach ($p in $Pairs) { git add -- $p.Target }
    git status --short
    Write-Host "`nStaged on branch $b." -ForegroundColor Green
  } finally {
    Pop-Location
  }

  Write-Host @"

Still to do - deliberately, not oversights:

  1. Add ``image`` and ``image_alt`` to each page's front matter. Write the alt
     text from what the file actually shows, not from the prompt.
  2. Commit, push, open the PR as a proposal - new portraits and lore images
     are the "draft it and stop" tier.
  3. CHANGELOG.md entry under [Unreleased] if these are going out (never in
     the changelog/ archive, which holds released sections only).
  4. Clear the working state once these have landed:
       Remove-Item -Recurse -Force image-out
     (entries with a file in src/images/ read as done anyway)
"@
}

# ---------------------------------------------------------------------------
# MANIFEST MODE - the generated path.
#
# When image-prompts.js --generate has run, every image is already sitting in
# image-out/ under a key that names its target exactly. There is nothing to
# pair and nothing to guess, so none of the ordering machinery below applies:
# the manifest says which file becomes which target, and the only choice left
# is which variation. -Pick "<key>=<n>" selects; variation 1 is the default.
#
# -From forces the Downloads path even when a manifest exists, for the case
# where some were generated and one was redone by hand in an app.
# ---------------------------------------------------------------------------
if ((Test-Path $manifestPath) -and -not $From) {
  $entries = (Get-Content $manifestPath -Raw | ConvertFrom-Json).generated
  $choice = @{}
  foreach ($p in $Pick) {
    $parts = $p -split '=', 2
    if ($parts.Count -ne 2) { throw "Bad -Pick value '$p'. Expected <key>=<n>." }
    $choice[$parts[0].Trim()] = [int]$parts[1]
  }

  $pairs = @()
  foreach ($e in $entries) {
    if ($e.PSObject.Properties.Name -contains 'error') {
      Write-Host "SKIP  $($e.key) - generation failed: $($e.error)" -ForegroundColor Yellow
      continue
    }
    # -Only / -Skip exist because a run is judged image by image. Some come
    # back usable and some do not, and the ones that do should not have to
    # wait for the ones that need another pass - the manifest is a record of
    # what was generated, never an assertion that all of it is good.
    if ($Only -and $Only -notcontains $e.key) { continue }
    if ($Skip -and $Skip -contains $e.key) {
      Write-Host "SKIP  $($e.key) - held back by -Skip" -ForegroundColor Yellow
      continue
    }
    $n = if ($choice.ContainsKey($e.key)) { $choice[$e.key] } else { 1 }
    if ($n -lt 1 -or $n -gt $e.outputs.Count) {
      throw "$($e.key) has $($e.outputs.Count) variation(s); asked for #$n."
    }
    $src = Get-Item (Join-Path $repoRoot "image-out\$($e.outputs[$n - 1].file)")
    $pairs += [pscustomobject]@{ Key = $e.key; Source = $src; Target = $e.target; MaxEdge = $e.maxEdge }
  }
  if ($pairs.Count -eq 0) { throw "Manifest has no usable entries." }

  Write-Host "`nFiling $($pairs.Count) generated image(s) from the manifest:`n"
  foreach ($p in $pairs) {
    Write-Host ("  {0,-46} <- {1}" -f $p.Target, (Split-Path -Leaf $p.Source.FullName))
  }
  Write-Host "`n(variation 1 unless -Pick says otherwise)"

  if ($WhatIf) { Write-Host "`n-WhatIf: nothing changed."; return }
  Invoke-Filing -Pairs $pairs
  return
}

# ---------------------------------------------------------------------------
# DOWNLOADS MODE - the clipboard path, where pairing is positional.
# ---------------------------------------------------------------------------
if (-not $From) { $From = "$env:USERPROFILE\Downloads" }
if (-not (Test-Path $From)) { throw "Source folder not found: $From" }

if (-not (Test-Path $progressPath)) {
  throw "No $progressPath and no manifest. Either generate (node scripts/image-prompts.js --generate) or serve prompts (--next) first."
}
$served = (Get-Content $progressPath -Raw | ConvertFrom-Json).served
if (-not $served -or $served.Count -eq 0) { throw "Nothing has been served yet." }

# Targets and sizes come from image-prompts.js's own --all listing rather
# than being re-derived here. One parser, not two: images.md stays the only
# place a prompt or a target is written down, and this script cannot drift
# from it. Format: '### src/images/<...>  [<n>px]'
$targets = @{}
$lines = & node (Join-Path $PSScriptRoot "image-prompts.js") --all
foreach ($l in $lines) {
  if ($l -match '^###\s+(src/images/(characters|lore)/(.+?))\s+\[(\d+)px\]$') {
    $targetRel = $Matches[1]; $dir = $Matches[2]; $rel = $Matches[3] -replace '\.jpg$',''
    $key = ("$dir-$rel" -replace '[/\\]', '-')
    $targets[$key] = @{ Target = $targetRel; MaxEdge = [int]$Matches[4] }
  }
}
if ($targets.Count -eq 0) { throw "Could not read targets from image-prompts.js --all." }

# --- the downloads, oldest first -------------------------------------------
$cutoff = (Get-Date).AddHours(-$Since)
$downloads = Get-ChildItem -Path $From -File |
  Where-Object { $_.Extension -match '^\.(png|jpg|jpeg|webp)$' -and $_.LastWriteTime -ge $cutoff } |
  Sort-Object LastWriteTime

# --- build the pairing ------------------------------------------------------
$explicit = @{}
foreach ($m in $Map) {
  $parts = $m -split '=', 2
  if ($parts.Count -ne 2) { throw "Bad -Map value '$m'. Expected <key>=<filename>." }
  $explicit[$parts[0].Trim()] = $parts[1].Trim()
}

$pairs = @()
$autoQueue = [System.Collections.ArrayList]@($downloads)

# Explicit maps claim their file first, so they never consume a slot in the
# positional zip and shift everything after them.
foreach ($key in $served) {
  if ($explicit.ContainsKey($key)) {
    $f = $autoQueue | Where-Object { $_.Name -eq $explicit[$key] } | Select-Object -First 1
    if (-not $f) { throw "-Map named '$($explicit[$key])' for $key, but no such file in $From (within $Since h)." }
    $autoQueue.Remove($f)
  }
}
foreach ($key in $served) {
  if (-not $targets.ContainsKey($key)) {
    Write-Host "SKIP  $key - no prompt with that key in images.md any more" -ForegroundColor Yellow
    continue
  }
  $src = $null
  if ($explicit.ContainsKey($key)) {
    $src = Get-ChildItem -Path $From -File | Where-Object { $_.Name -eq $explicit[$key] } | Select-Object -First 1
  } elseif ($autoQueue.Count -gt 0) {
    $src = $autoQueue[0]; $autoQueue.RemoveAt(0)
  }
  if (-not $src) {
    Write-Host "SKIP  $key - ran out of downloads to pair with" -ForegroundColor Yellow
    continue
  }
  $pairs += [pscustomobject]@{
    Key     = $key
    Source  = $src
    Target  = $targets[$key].Target
    MaxEdge = $targets[$key].MaxEdge
  }
}

if ($pairs.Count -eq 0) { throw "Nothing to pair. Downloads found: $($downloads.Count) in the last $Since h." }

Write-Host "`nPairing $($pairs.Count) of $($served.Count) served prompt(s), from $From (last $Since h):`n"
foreach ($p in $pairs) {
  Write-Host ("  {0,-46} <- {1}" -f $p.Target, $p.Source.Name)
}
if ($autoQueue.Count -gt 0) {
  Write-Host "`n$($autoQueue.Count) download(s) left over and ignored:" -ForegroundColor Yellow
  foreach ($f in $autoQueue) { Write-Host "  $($f.Name)" -ForegroundColor Yellow }
  Write-Host "If that is a surprise, the order is off - use -Map." -ForegroundColor Yellow
}

if ($WhatIf) { Write-Host "`n-WhatIf: nothing changed."; return }

Invoke-Filing -Pairs $pairs
