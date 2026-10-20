# Image prompts — generation and enhancement

Working record of the prompts behind every non-photographic image in the repo,
and of the enhancement recipes applied to real photographs. Kept in
`story-bible/` so it ships with the repo but stays outside `src/` and is never
published to the site.

**Why this file exists:** the `prismere-*` / `prismeri-*` cluster was generated
without its prompts being recorded anywhere. When the resolution problem
surfaced in the July 2026 audit there was no way to regenerate at a larger size
without inventing new prompts from scratch. That must not happen twice.

**Rule going forward:** no generated image enters the repo, and no photograph
gets a non-trivial enhancement pass, without an entry here.

## Which generators made the repository's images

Dermot's statement, 22 September 2026, recorded because it answers a question
the per-entry records could only answer one file at a time: **every generated
image in the repository came from Gemini or Firefly**, by one of three routes —

- **Gemini alone.**
- **Firefly worked up from a Gemini generation** — Gemini's output carried into
  Firefly rather than either tool used end to end.
- **Firefly alone.**

Two things this does not cover, and both are already recorded below or in
`images.md`; the statement is the rule and these are its named exceptions.

- **The Prismere / Prismeri cluster is Grok**, confirmed by him the same day.
  Section 1 below inferred it from the 768×1152 aspect and hedged at *almost
  certainly*; the hedge is now unnecessary and the entry says so. It is the one
  generated set in `src/images/` from a third tool, and it predates the
  Gemini/Firefly pipeline.
- **Supplied reference stills and clips**, which came from whatever Dermot had
  to hand rather than through the pipeline: the two shadow stills and the
  five-frame strip in `reference-art/` (Grok, 5 September 2026), and
  `tissadelle-headmate-2026-08-24.jpg` (**a third-party generator** — a fourth tool, and the
  only file from it). Each is recorded in `images.md` where it was supplied,
  and none of them ships. The Grok video orphan they used to sit beside was
  removed from `src/video/` on 18 September 2026 at his instruction.

**A scan of the repository on 22 September 2026 found no fifth case.** Every
file under `src/images/` is landscape, square, or a portrait at a size no
generator in this list defaults to; nothing there carries a Grok default
aspect, and the one set that did — Prismere, at 768×1152 — has been Gemini's
since 3 September.

**The five 768×1376 portraits are route two.** `aldera`, `ilse-korvain`,
`karla-wender`, `nessa` and `rook-7`: Firefly worked up from a generation by
Gemini's default *banana* image model (Dermot, 22 September 2026, his word for
it; no version recorded, and the record does not guess at one — the pipeline's
current `gemini-3.1-flash-image` is a later model and not what these were made
on). They had no per-file **Tool** line, which is how the scan found them.

**The gap those five came out of, measured.** 270 JPEGs live under
`src/images/`. 205 are named nowhere in this file. But this file is not the
only record — `images.md` carries provenance for much of the corpus too, and
counting both together leaves **82** named in neither. 28 of those are codex
cards, which need no generation entry (*"Codex entries use designed title
cards, not photographs"*), so the genuine gap is **54 files**. Two earlier
counts in this session were wrong and are superseded by that one: five (it
looked only at a single aspect ratio) and 150 (it counted only this file, and
only two directories).

### What the files themselves say — audit of 22 September 2026

Read out of the JPEGs directly rather than inferred from names, and
reproducible: JPEG marker segments for EXIF, COM and XMP, and a perceptual
hash of every image compared against every photograph in the
`dermot-cochran-photography` checkout, with candidate matches confirmed on
downsampled pixels rather than on the hash.

| Signal | Files | What it proves |
| --- | --- | --- |
| Pixel-identical to a published photograph | 6 | Dermot's own frame, certainly |
| XMP `DigitalSourceType: trainedAlgorithmicMedia` | 3 | The file declares a generative-AI source |
| `STAR-RANGERS-PLACEHOLDER` in a COM segment | 2 | A placeholder card, as designed |
| A libavcodec COM segment | 39 | The file passed through ffmpeg |
| Camera make and model surviving in EXIF | 1 | Nothing much — see below |

**The photographs that can be proved are a floor, not a set.** Six files match
a published photograph exactly: `hero/characters-hyrax.jpg`,
`lore/cloud-sea.jpg`, `lore/drowned-forest.jpg`, `lore/grassland-storm-tree.jpg`
and `lore/island-watchtower.jpg` pixel for pixel, and `lore/trigrian.jpg`
closely enough to be the same frame treated. The method can only ever find
frames that were *published* to the portfolio; anything from `F:` that never
went up is invisible to it. And EXIF cannot fill the gap, because the import
pipeline strips it — exactly one file in 270 still carries a camera model.

**Three files that read as photographs declare generative AI**:
`lore/boirinn-uplands-waterfall.jpg`, `lore/highland-summit-snowfields.jpg`
and `lore/moorhen-wetland.jpg`. The tag means generative AI touched the file,
which covers a wholly generated image and a real photograph with a generative
edit alike, and it does not say which. Worth Dermot's eye, because their names
and subjects would lead a reader of this file to assume the camera.

**The ffmpeg marker is unexplained and is recorded as a finding, not a
reading.** 39 files carry it, 21 in `codex/` and 18 in `lore/`. Two
explanations fit — frames pulled from generated clips, or a resize step that
happened to run through ffmpeg — and nothing in the files chooses between
them. None of the six proved photographs carries it.

**The 54-file worklist**, for whoever closes it. Each needs one line saying
photograph, card or generation, and the answer is Dermot's to give:

- **Carrying the ffmpeg marker** (9): `lore/aspenar.jpg`, `lore/fellowship-of-light.jpg`, `lore/krenyi.jpg`, `lore/meridian.jpg`, `lore/star-rangers-decision-and-communication.jpg`, `lore/star-rangers-safety-corps.jpg`, `lore/subsea-cable-drones.jpg`, `lore/the-unbroken-command.jpg`, `lore/undersong-belt.jpg`.
- **The rest** (45): `characters/aldera/field-photo-02.jpg`, `characters/aldera/field-photo-04.jpg`, `characters/kai-larsen.jpg`, `characters/sen-marginalia.jpg`, `hero/codex-documents.jpg`, `hero/home-launch.jpg`, `hero/lore-cosmic.jpg`, `hero/season-00-foundation.jpg`, `hero/season-01.jpg`, `hero/season-03-datacentre.jpg`, `hero/season-05-explorers.jpg`, `hero/seasons-orbit.jpg`, `hero/timeline-clock.jpg`, `lore/aethelrock.jpg`, `lore/ai-safety-kernel.jpg`, `lore/ai-usage-credits.jpg`, `lore/autumn-canopy.jpg`, `lore/boirinn-uplands-horses.jpg`, `lore/boirinn-uplands-mist.jpg`, `lore/boundary-zones.jpg`, `lore/cnoc-na-mbeach.jpg`, `lore/coastal-sunset.jpg`, `lore/competing-designs.jpg`, `lore/concordant-membranes.jpg`, `lore/cosmic-cascade.jpg`, `lore/creative-entropy-framework.jpg`, `lore/crimson-blossom-macro.jpg`, `lore/dryadic-trees.jpg`, `lore/elder-fig-grove.jpg`, `lore/ensemble-multiverse.jpg`, `lore/environmental-technology-design.jpg`, `lore/highland-cloud-sea.jpg`, `lore/highland-scrub-road.jpg`, `lore/knarrheim.jpg`, `lore/pelagene-littoral.jpg`, `lore/pink-blossom-macro.jpg`, `lore/saltmere-mooring-gantry-2.jpg`, `lore/scarlet-thread-bloom.jpg`, `lore/seed-mind-lifecycle.jpg`, `lore/star-rangers-academy.jpg`, `lore/universe-overlap-and-folding.jpg`, `lore/violet-spike-inflorescence.jpg`, `lore/wading-heron.jpg`, `lore/wetland-treeline-reflection.jpg`, `lore/white-flower-macro.jpg`.
## Alt text is the prompt of record

A prompt doesn't have to hide in here. The `image_alt` line in a lore entry —
and the descriptive text of the entry itself — is already a serviceable prompt,
and it has the advantage of being visible, reviewed, and kept in step with canon.
The eleven reconstructions below were written straight out of the alt text and
read perfectly well as prompts, which is the proof.

So the division of labour is:

- **Alt text** carries *what the image shows.* It is the short prompt, it ships
  with the site, and it is what a screen-reader user and a regenerating tool
  both get.
- **Lore body text** carries *the world the image sits in* — the material,
  light, and mood a good generation needs. Quote it into the prompt rather than
  paraphrasing it.
- **This file** carries only what the site can't: tool, version, date, seed,
  aspect, iteration count, the shared style preamble, and the enhancement
  recipes for real photographs.

**The consequence is a two-way check.** If a generated image and its alt text
drift apart, one of them is wrong — and since the alt text is what canon and
screen readers rely on, the image is usually the one that needs to change.
Treat an alt-text mismatch as a defect, not a documentation lapse.

## Entry format

    ### <filename>
    - **Type:** generation | enhancement
    - **Tool:** Gemini / Firefly / Grok / Lightroom / Photoshop / other, plus version if known
    - **Date:**
    - **Source:** (enhancement only) original file or negative
    - **Prompt / recipe:**
    - **Notes:** aspect, seed, iterations, anything needed to reproduce it

---

## 1. Missing prompts — generation

### The Prismere / Prismeri cluster (11 files)

All eleven are 768x1152, **Grok output at its default size** — confirmed by
Dermot, 22 September 2026, when he named Gemini and Firefly as the generators
behind every other generated image in the repository. Until then this entry
inferred it from the ratio, 2:3 being one Firefly offers no preset for; the
inference was right and is now a record. The original prompts were never
recorded.

**Superseded 26 Jul 2026: replaced, not upscaled.** Dermot's decision — the
low-quality originals were not reused. The prompts written for the
replacements are in `images.md` Open work 5 (migrated 2026-08-11, when
`firefly-prompts.md` was retired), written to
diverge per location rather than preserve the existing look, since the repeated
motif was the second complaint against the set after resolution.

**Done — regenerated 3 September 2026**, the whole set in one batch at
1600×893, two variants each: the eight `prismere-*` approved and merged that
day, the three `prismeri-*` rejected as still humanoid and regenerated the
same evening against the derived body, and `prismere-root-mat-network.jpg`
(which was 773×1152) with them. Twelve files, all landscape, none of the
768×1152 originals left in `src/images/`. `images.md`'s Open work 5 table
carries the per-file record, and the batch's own entry is under *2026-09-03 —
the Prismere set regenerated, and Agent Barsik*: Gemini 3.1 Flash Image, 2K,
16:9, no reference images. So nothing below is a live worklist: the Grok
attribution and the reconstructions are the record of what the *originals*
were, and every Prismere file on disk today is Gemini's.

The reconstructions below are kept as the record of what the *original* eleven
depicted, rebuilt from each image's alt text and the lore entries
(`src/lore/planets/prismere.md`, `src/lore/prismeri.md`). They remain the
fallback if a regeneration ever needs to stay compatible with the old look.

Shared style preamble for all eleven — the series reads as one world because
these terms were constant:

> Silicate-carbon biosphere, living tissue built from glass and crystal.
> Bioluminescent throughout, the world producing its own light. Translucent
> crystalline forms, soft shifting colour washes, dense particulate haze in the
> air. Painterly science-fiction concept art, high detail, no visible text or
> figures in human dress. Aspect 2:3, portrait.

Per-image prompt bodies:

- **prismere-orbital-vista.jpg** — A biomechanical aerial creature gliding
  beneath two ringed planets and a scatter of moons; luminous jellyfish-like
  fauna mid-air; an armoured, spike-shelled ground crawler in the foreground.
  Crowded sky, dense ring plane, seven moons.
- **prismere-twilight-lattice.jpg** — A silvery biomechanical winged organism
  in flight beneath swirling green-and-purple sky patterns; pale crystalline
  coral-like fauna below. The sky patterns are faint, *mathematically precise*
  lines, arcs and polygons — geometry, not aurora.
- **prismere-glasswood-grove.jpg** — A cluster of translucent glowing
  flower-like growths on a crystalline stalk, beneath a banded gas giant.
  Foliage translucent and lens-like, re-emitting light.
- **prismere-flowering-glasswood.jpg** — A luminous flowering glasswood stand
  at night; small many-legged foraging fauna moving across the ground beneath.
- **prismere-luminous-towers.jpg** — A colony of glowing amber-lit lumenspire
  towers rising from a crystalline grove; a jellyfish-like aerial creature
  drifting past. Mineral analogues to fungal towers, lit from within, loose
  colony rather than a regular array.
- **prismere-glass-spires.jpg** — Tall translucent glass-spire structures of
  fused silica against a night sky showing a visible spiral galaxy; crystalline
  reef-like fauna at ground level. Lattice-veined, higher elevation, no
  glasswood grove around them.
- **prismere-driftjellies.jpg** — Three luminous jellyfish-like driftjellies
  floating above armoured spike-shelled ground fauna, beneath a golden ring
  system. Gas-bladder bodies, trailing luminous feeding tendrils.
- **prismere-umbral-ray.jpg** — A large silvery biomechanical-looking flying
  creature gliding through a dim sky; spiny armoured fauna and pale crystalline
  plants on the ground below. Apex aerial predator, silent glider, broad wing
  structure. Darker and more threatening in tone than the rest of the set.
- **prismeri-first-wings.jpg** — A slender grey-violet winged humanoid with
  gossamer wings and a segmented skull ridge, standing beneath a dark moon and
  a distant ringed planet. Light-boned, soft still-hardening exoskeleton. Adult,
  not childlike.
- **prismeri-full-wings.jpg** — A gold-and-blue chitin-plated winged humanoid
  with long motile sensory tendrils growing from the skull ridge, standing among
  crystalline flora beneath a banded planet. Hardened plating, load-bearing
  wings built for sustained high-altitude flight.
- **prismeri-lattice-gathering.jpg** — Two Prismeri, one First Wings and one
  Full Wings, facing each other beneath a crystalline geometric sky pattern,
  with luminous jellyfish-like fauna nearby. The size and structural difference
  between the two forms should be legible at a glance.

**Known series weakness, if regenerating rather than upscaling:** the audit
files this cluster under "tonal outliers, deliberate" because one
jellyfish/crystal-spire motif repeats across eight distinct named locations. If
the point of a regeneration is variety, the prompts need to diverge much harder
per location than the reconstructions above — which deliberately preserve the
existing look so an upscale and a regeneration stay compatible.

### Why a genuinely alien world is hard to prompt

Worth writing down, because it explains the repeated motif rather than blaming
it. Ask a generator for "alien" and it returns a learned average of alien — the
glowing translucent thing, the jellyfish, the crystal spire — and it returns the
same average for all eight locations, because "alien" is the same word each
time. Adjectives can't separate them. Nor can a human eye reliably picture a
world lit by its own biosphere; there is no memory to check the result against,
which is exactly why the near-duplicates passed review the first time.

What does separate them is naming a **concrete physical cause** and letting the
look follow from it. Prismere already has these in the lore, and they differ
sharply by location:

- **Where the light comes from.** Lumenspires are lit from within by a shared
  root-mat; glasswood re-emits light it caught as a lens; glass spires carry no
  light of their own and take it from the sky. Three different light logics —
  so three different images, if the prompt says which.
- **What the sky is doing.** The Lattice is *geometry* — precise lines, arcs and
  polygons — not aurora. A banded gas giant, a dense ring plane, a visible
  spiral galaxy and a dark moon are four distinct skies, and each is already
  specified per image in the alt text.
- **How the air behaves.** Low gravity plus dense particulate supports a truly
  aerial ecosystem. That is why driftjellies hang and umbral rays glide in
  silence — and it should make the air itself look thick, not empty.
- **Scale cues.** The one thing generators drop first and the eye misses most.
  Say what a thing is next to.

Vary the axis, not the adjective. And when a scene resists visualisation
entirely, the honest fallback is the one already in use across the repo: a real
photograph doing the structural work, with the alien element composited in —
which is why the plate-and-creature composites need to look convincing.

### tissadelle-shepherd.jpg — current file's prompt unrecorded

The 1200×675 file landed by 2026-08-06 with no entry here — the rule this file
exists to enforce, tripped again; found 2026-08-11 while resolving the
replace-vs-upscale decision. The likely source, preserved verbatim from the
retired `firefly-prompts.md` § C (rewritten 28 July 2026 against Dermot's
character notes of the same day), is below. Treat it as the reference for any
future regeneration rather than certain provenance of the current file.

> Documentary photograph, available light, candid. A young woman in her
> twenties with red hair and blue-green eyes, in a practical working uniform
> worn correctly but well used, aboard a spacecraft or station. She is
> mid-task, her attention on something off to one side of the frame — reading
> an instrument, not posing. Upright, self-possessed bearing; alert and
> attentive expression rather than blank or steely. Equipment, hard surfaces
> and functional light around her. Unglamorous lighting; visible skin texture;
> no beauty retouching, no styled hair, no makeup emphasis. She is at work and
> has been for hours.

**What this prompt is carrying.** Dermot's note, 28 July 2026: she never
married and has had no relationship despite being elegant and charming — sigma
INFJ-A, highly sensitive but confident, expecting a depth most men can't
provide, and almost more focused on her career and on maintaining her dignity
as a leader. That is why the 26 Jul attempt failed and why it wasn't only a
lighting problem: beauty lighting and a to-camera gaze frame a subject as
presenting herself for approval, and her whole character is that she does not.
The two changes that matter are **her attention goes off-frame onto her
work**, and **nothing in the image invites the viewer**. Her solitude should
read as chosen and unremarkable — never as loneliness, never as a gap waiting
to be filled.

Guardrails: don't reach for *beautiful*, *striking*, *alluring*, or *lonely* —
if a batch comes back as a headshot, push harder on *documentary*, *candid*,
*available light*, and name the task she's doing. **This is Tissadelle, not a
type** — Dermot was explicit that this register must not carry over to the
story's other women in command. **The interiority — hint, don't show:** her
inner life is populated (fantasies, AI virtual companions, internal headmates
including tulpas and plural subsystems), and that complexity is what qualifies
her for a noogenic seed mind — a qualification, never pathology, instability
or spectacle. A literal depiction tips into the horror register the tone
guardrail rules out; keep the portrait outwardly plain.

Two optional variants, generate separately: the same frame at a dark
instrument panel whose glass carries two or three quiet reflections of her at
slightly different angles — ordinary equipment reflections, evenly lit,
nothing ghostly; discard any result that looks haunted. And the same woman on
a hillside flock-holding in wet upland country, off duty — her Tír na nÓg
home ground, load-bearing since Season 5.

### bubochka.jpg — current file's prompt unrecorded

Same finding, same date: 1200×675 by 2026-08-06, no entry here. The § C
prompt, preserved as the reference:

> A fluffy white rabbit sitting inside a large brown ceramic mug filled with
> pink and white marshmallows, more marshmallows scattered on the plate
> beneath. Absurdly, disarmingly cute. Photographic, soft natural window
> light, shallow depth of field. Played completely straight — a real
> photograph of a real rabbit in a mug, not an illustration.

Keep the alt text's scene exactly — it is well described and the comedy
depends on the specificity. The pair image (`bubochka-alert.jpg`, § 3 below)
must match this one's setting: same mug, same table, same light.

---

## 2. Missing prompts — enhancement of real photographs

These are Dermot's own photographs that have had, or need, a hands-on pass.
Recipes recorded so a future re-edit starts from a known state.

### archipelago-palm-avenue.jpg — DONE 26 Jul 2026
- **Type:** enhancement (dust-spot removal)
- **Source:** Tenerife/Alicante palm avenue frame, main body (Tamron 18-400)
- **Recipe:** heal the recurring sensor dust blob in the sky at ~53% across /
  40% down. Feathered patch sampled from same-brightness sky at the same rows.
  If done programmatically, the SVG mask must use `stop-opacity` (alpha)
  gradients — a white-to-black *colour* gradient does not feather under
  `dest-in` and leaves visible square edges.
- **Result:** verified clean at 3x zoom, no patch edge, 1600x1200 preserved.
- **Note:** same blob recurs across Oct 2025 (Kenya) to Jan 2026 (Tenerife) on
  this body. Worth re-checking other sky-heavy frames from it.

### highland-rock-spires.jpg — DONE 26 Jul 2026
### highland-summit-snowfields.jpg — DONE 26 Jul 2026
### boirinn-uplands-waterfall.jpg — DONE 26 Jul 2026
- **Type:** enhancement (zoom-smear recovery)
- **Recipe:** _Dermot to record — which tool, and whether this was a re-process
  from the original raw or a sharpening/denoise pass on the delivered JPEG._
- **Result:** all three verified improved. Rock silhouette against sky now shows
  no colour fringing and no halo line at 3x; rock and water texture resolved
  rather than smeared. Dimensions changed slightly (1600x1200 to 1600x1168,
  1600x1462 to 1600x1503) so these are re-crops, not in-place edits.

### moorhen-wetland.jpg — DONE 26 Jul 2026
- **Type:** replacement frame, not an edit
- **Result:** motion blur gone; bird tack-sharp, preening on a log. 1557x2133.
- **Note:** alt text in the referencing lore entry should be checked against the
  new pose before this ships.

### trigrian.jpg — NO CHANGE, original restored
- **Status:** a violet, antennaed, multi-eyed reptilian creature was supplied on
  26 Jul 2026 and has been set aside as
  `9 - New images to place/unplaced-creature-savanna-sunset.jpg` (1600x1067).
  It is not a grianmhór — Trígrian's apex predator is lioness-like to the point
  that the survey filed a seeding inquiry, and the entry's central section is
  built on that resemblance. The original three-suns composite stands.
- **Exposure item:** blown highlights on the three suns remain, and remain
  intentional. Audit position is "verify then leave alone" so a future pass
  doesn't "fix" them.
- **This is the alt-text check working.** The mismatch between frame and
  `image_alt` is what caught it.

### unplaced-creature-savanna-sunset.jpg — AWAITING PLACEMENT
- **Type:** composite — generated creature on a Maasai Mara savanna plate with
  a multiple-sun sky
- **Needs:** an entry to belong to, then a filename, alt text and a prompt
  record. Do not file it under Trígrian.

### highland-sentinel-lizard.jpg — OUTSTANDING
- **Type:** enhancement (composite refinement)
- **Source plate:** the same Roques de García frame as `highland-rock-spires.jpg`
- **Recipe needed:** mask refinement on the creature cutout plus a light colour
  and grain match. Cutout edges read soft beside the plain version.
- **Opportunity:** the plate has just been re-processed and is now markedly
  sharper than the version this composite sits on. Re-compositing onto the new
  plate fixes the sharpness mismatch and the soft edges in one pass — but it
  must be redone, because the new plate is a different crop.
- **Creature element, if a cleaner cutout is wanted** (moved from the retired
  `firefly-prompts.md` § F). Match the light direction to the plate before
  generating, or the mask will never sit right no matter how good the edge is.
  > A large monitor-lizard-like reptile in three-quarter view, climbing, body angled upward, long tapering tail trailing behind and down. Even overcast daylight from the upper left, matching a clear high-altitude sun. Plain neutral background for cutting out. Dry, matte, dusty scale texture in muted grey-brown — no gloss, no wet look, no rim lighting.

### saltvik.jpg — OUTSTANDING
- **Type:** photograph needed, no prompt applicable
- **Need:** a real cold-coast frame for the Knarr Line's Nordic-heritage
  coastal world. Currently a plain text card while sibling Saltmere entries
  carry two photographs each.

### Character portraits — status as of 2026-08-11
Resolved by the replace-not-upscale ruling and re-measurement:
`tissadelle-shepherd` and `bubochka` were already replaced at 1200×675 (landed
by 2026-08-06, prompts unrecorded — see their § 1 entries above, which keep
the never-a-glamour-headshot caution); `bubochka-alert` and `dorian-calloway`
are recorded done in § 3; `agent-barsik` (still 512×1024) has its regeneration
prompt in `images.md` Open work 1; and the two Aldera frames (512×1120, PNG
data under a .jpg extension) are a re-crop job in Dermot's hands — see the
Aldera note in `images.md` Open work 2, which keeps the caution that they sit
beside `field-photo-01`/`-02`, real photographs of a real kitten that
generation won't match.

---

## 3. Recorded prompts

_Entries move up here once complete._ The five below moved from
`firefly-prompts.md`'s *Recorded composites* and *Recorded generations*
sections on 2026-08-11, as that file's own header box asked; each carries its
own **Type:** line, so the two group headings were dropped in the move.

### trigrian-triple-sunset.jpg — 26 Jul 2026
- **Type:** composite from Dermot's own photographs (no generator involved)
- **Source:** `F:\122KENYA` — base `DSC_7768`, sun discs lifted from `DSC_7770`
  and `DSC_7778`. Amboseli, October 2025.
- **Recipe:** the base already carries one low orange sun setting behind the
  ridge. A second orange sun is composited beside it at 0.92 scale, and a
  smaller, whiter companion at 0.66 scale higher and trailing — matching the
  entry's own astronomy: *a tight central pair of orange suns... and a smaller,
  whiter companion on a wide, eccentric outer orbit*, descending together
  toward the hills.
- **Technique that matters:** lift the **sun disc only**, not the sky around it.
  Patch radius ~58px at 1600px wide, circular alpha mask with the falloff
  starting at 72%, blended `lighten`. A first attempt at 110px haloed every sun
  — because `lighten` takes the brighter pixel, so wherever the donor frame's
  sky was brighter than the base's, the whole patch disc lifted. Same failure
  mode as the dust-spot heal: match brightness, or keep the patch tight.
- **Rejected approach:** a naive `lighten` blend of four whole frames. The
  sequence is handheld, so the framing drifts and the tree comes out as three
  overlapping ghosts.
- **Note:** composites are welcome here. They are *not* welcome on the
  photography site, which carries only Dermot's own unaltered photographs.


### new-london-space-habitat.jpg — 26 Jul 2026
- **Type:** generation
- **Tool:** Adobe Firefly, widescreen preset — output 1408x768
- **Prompt (complete — supplied by Dermot 26 Jul 2026):**

  > New London Space Habitat orbits at Lagrange point L5, positioned in the
  > Earth-Moon system to maintain stable distance from both bodies. Constructed
  > in the late 22nd century as a refuge following the great environmental
  > collapse that rendered much of the British Isles uninhabitable, it serves as
  > humanity's largest preservation project for British cultural heritage.
  >
  > The habitat consists of three interconnected Stanford torus rings, each 1.5
  > kilometers in diameter, rotating to provide Earth-standard gravity. The
  > rings are named Westminster, City, and Crown, reflecting the traditional
  > divisions of historical London. These connect to a central non-rotating hub
  > called "The Spire" which houses administration, docking facilities, and
  > zero-gravity manufacturing.
  >
  > New London houses approximately 180,000 residents, primarily descendants of
  > British evacuation programs, though immigration policies have relaxed in
  > recent decades. The habitat maintains formal diplomatic ties with Eden Space
  > Habitat and other major orbital settlements, while operating under a
  > constitutional monarchy governance structure that preserves British
  > parliamentary traditions.
  >
  > The habitat's most distinctive geographical feature is the Thames Canal — a
  > water system that flows through all three rings, serving both practical
  > water circulation needs and symbolic connection to Old London. Bridges
  > spanning this canal have become important cultural landmarks and meeting
  > places within the habitat.

  Note the prompt is essentially the lore entry compressed — which is the
  method working as intended: the entry is the prompt, and the alt text is the
  short form of it.
- **Canon accuracy:** good. Three interconnected rings, central spire, water
  running through the rings, recognisable London landmarks inside them, and
  Earth roughly four times the Moon's apparent diameter — which is right for
  Earth-Moon L5, where both bodies are one lunar distance away.
- **Two known defects, both from the generator:**
  1. **1408x768, under the 1600px lore standard.** `eden-space-habitat.jpg`,
     its nearest sibling, is exactly 1600x900. Regenerate larger or upscale.
  2. **Garbled pseudo-text on the outer ring hull** (lower left, faint glyphs
     reading as "R & ▨▨E"). Add *text, lettering, signage, writing* to the
     negative prompt on any regeneration — see the house rule below.

### agent-barsik.jpg — attempt of 28 Jul 2026, REJECTED
- **Type:** generation attempt, not shipped
- **Tool:** Adobe Firefly, widescreen preset
- **Why rejected:** right cat, wrong on the lettering ban. Pose, office and
  deadpan all correct, but the frame was full of readable text — "CASE FILES",
  "LOGS" and "REPORTS" along the binder spines, "STATION INCIDENT REPORT —
  LOG 41" across the papers, and garbled pseudo-text on the collar tag itself.
- **Where the fix lives:** the regeneration prompt, with the blank-surfaces
  and plain-unengraved-tag requirements folded into the body, is in
  `images.md` Open work 1 — dormant until the old 512×1024 file is deleted.

### dorian-calloway.jpg — 29 Jul 2026
- **Type:** generation (replaces a stock-headshot-register portrait)
- **Tool:** Adobe Firefly, widescreen preset — output 1408×768, centre-cropped to
  1365×768 and resized to 1200×675
- **Prompt** (moved from the retired `firefly-prompts.md` § C):
  > Documentary photograph, available light, candid. A man in his late fifties, senior civil administrator, standing on the coordination floor of an orbital habitat administration centre, half-turned from a bank of wall-mounted status displays as though interrupted mid-shift. Business dress worn like a long day rather than a photocall — jacket open, tie loosened, sleeves turned back, a small plain metal pin at the lapel. Composed, unhurried, faintly tired; attention still partly on the displays. Behind him the displays show abstract orbital ring diagrams, engineering telemetry traces and schematic floor plans as pure graphics — shapes, curves and line work only. Working clutter on the desks below: printouts, cabling, a cooling drink. Functional overhead light, natural skin texture, no retouching, shallow depth of field.
- **Negative:** text, lettering, numerals, labels, signage, writing on any screen
  or surface, uniform, military uniform, police uniform, epaulettes, rank
  insignia, badge with visible engraving, flat studio backdrop, glamour
  lighting, corporate headshot, posed to camera.
- **Why no uniform** — settled 29 July 2026. The post is administrative rather
  than operational by design and Calloway cannot direct a habitat
  Commissioner's policing decisions; a service uniform would assert command
  authority his page spends its length denying, and any one service's uniform
  narrows him to a third of the remit. There is also no Compact uniform in
  canon (`src/lore/rank-insignia-and-uniform.md` covers Star Rangers only), so
  inventing one would be new canon cascading to all five habitat
  Commissioners. The room carries the breadth instead of a costume.
  *Status, 10 September 2026:* the "no Compact uniform in canon" line has
  since been overtaken for two bodies — Eden's bureau (19 August,
  `src/lore/eden-bureau-uniform.md`) and Orbital Five-O (10 September,
  Dermot: *Five-O does have uniforms unlike its Hawaiian namesake*). The
  conclusion for Commissioners stands: no uniform, and the Eden page says
  why. The Compact itself still sets no uniform requirement on a bureau.
- **Result:** correct on the first batch. No uniform; business dress worn like a
  long day, jacket open and one sleeve turned back, a small plain lapel pin as
  the only mark of office. The coordination floor carries the breadth of the
  remit — orbital ring diagrams, telemetry traces and a schematic floor plan
  across the wall displays, working clutter and a melting iced drink below.
- **Lettering check passed.** This was the risk the prompt was written against,
  since status boards invite the failure that killed the 28 July Agent Barsik
  attempt. Inspected at 4× on both the left display stack and the desk
  printouts: the text-like rows resolve to blur with no legible glyphs anywhere,
  which is the intended outcome — the *suggestion* of dense readouts without any
  actual writing. **Worth checking the same way on any future frame that puts
  screens or paper near the camera**, rather than judging it at page size.
- **Alt text updated** at `src/characters/dorian-calloway.md` — it previously
  read "A mature businessman portrait", which named a stock category rather than
  describing a frame.

### bubochka-alert.jpg — 29 Jul 2026
- **Type:** generation (replaces the rejected 28 July attempt)
- **Tool:** Adobe Firefly, widescreen preset — output 1408×768, centre-cropped to
  1365×768 and resized to 1200×675 (the preset is 1.833, the spec is 16:9 =
  1.778, so a 21px trim each side is needed — `import-image.ps1` scales but does
  not crop, so this needed a crop-then-resize pass)
- **Prompt** (the 29 July rewrite, moved from the retired `firefly-prompts.md`
  § C — the version that stood until then asked for "both ears fully raised",
  which a lop physically cannot do):
  > Documentary-style photograph, available light, candid. A pure white lop-eared dwarf rabbit standing bolt upright on her hind legs on a warm honey-toned rustic wooden kitchen table, body stretched tall and narrow, front paws tucked to her chest, absolutely still and tense, staring intently at something outside the frame. The rabbit: dense pure white fur, soft and fluffy; both long lop ears hanging down flat against the sides of her head, pale pink inner ear showing, never upright; one large round near-black eye in three-quarter view; small pink nose; long fine white whiskers. Beside her on the table, a brown speckled reactive-glaze ceramic mug and matching saucer, empty, with pink and white mini marshmallows spilling across the saucer and scattered over the wood. A tall glass of milk behind. A crumpled pale linen cloth to the left. Bright window to the right casting soft directional daylight; blurred warm kitchen interior behind. Shallow depth of field, warm natural colour. Played completely straight — a real photograph of a real rabbit, not an illustration.
- **Negative:** upright ears, erect ears, pointed ears, standing ears, rabbit
  inside the mug, text, lettering, watermark, illustration, cartoon, studio
  backdrop, glamour lighting.
- **The pair is the joke:** same rabbit as `bubochka.jpg` (§ 1), suddenly
  working — consistency of setting between the two frames is what sells it.
- **Result:** correct on the first batch. Lop ears folded flat, standing bolt
  upright on the hind legs, same brown speckled mug and saucer, same
  marshmallows, same linen cloth, same warm kitchen and window light. The pair
  now reads as one animal photographed twice, which is the only thing the image
  had to do.
- **Alt text updated** at `src/characters/bubochka.md` — it previously read
  "ears fully raised", inherited from the faulty prompt and impossible for a lop.

### prismere-root-mat-network.jpg — 29 Jul 2026
- **Type:** generation
- **Tool:** Adobe Firefly — output 848×1264, downscaled to 773×1152 via
  `scripts/import-image.ps1 -MaxEdge 1152`
- **Prompt (complete — supplied by Dermot 29 Jul 2026):**

  > Silicate-carbon biosphere, living tissue built from glass and crystal.
  > Bioluminescent throughout, the world producing its own light. Translucent
  > crystalline forms, soft shifting colour washes, dense particulate haze in the
  > air. Painterly science-fiction concept art, high detail, no visible text or
  > figures in human dress. Aspect 2:3, portrait.

- **Placement:** `src/lore/planets/prismere.md`, under *Glasswood and the
  Luminous Biosphere*, illustrating the shared root-mat network that feeds a
  lumenspire colony — described in the entry since it was written, never shown.
  Added in #217 along with a one-sentence lead-in.
- **Note — this used the wrong preamble.** The text above is the *legacy*
  shared preamble from `image-prompts.md` §1, which exists to reconstruct what
  the original eleven depicted. The current replacement preamble is in section A
  below, and differs: it adds *"naturalistic rather than decorative"* and drops
  the fixed 2:3 aspect. The consequence is visible in the result — crystal
  spires and the same palette as the old set, which is a faithful continuation
  of exactly the repeated motif the replacement series is meant to break from.
  Not a defect in the image, which is good, but it is not a step toward the
  eight-distinct-looks goal either.
- **Known defect:** 773×1152, under the 1600px lore standard — the same problem
  as the rest of the Prismere cluster. It should be regenerated with the section
  A preamble whenever that set is done, rather than upscaled on its own.

### reeves-eden.jpg and reeves.jpg — 13 Aug 2026, a deliberate pair

- **Type:** generation (both replacing earlier images — Eden's a holographic
  evidence interface, Threshold's a PORTRAIT PENDING card)
- **Date:** 13 August 2026, in #415
- **Recorded here 19 August 2026.** The pair had no entry in this file at all,
  which is why the emblem read as possibly accidental during that day's audit.
  It was not; the reasoning below is recovered from #415's commit message and
  from the two `image_alt` lines, which have carried it correctly since.

**Why an emblem and not a portrait.** Neither Reeves has a body anywhere in
canon — Lucene-9000 is *a mobile AI humanoid*, Reeves is *investigative support
intelligence*. The 12 August rule that *AIs get portraits like everyone else*
governs how to depict an AI **that has a body**; it never required inventing one.
See the qualification now recorded in `images.md`'s Conventions.

**What actually forced the re-brief, and the lesson worth keeping.** The earlier
Eden brief asked for a holographic case-file interface and banned lettering in
the same breath. It came back reading `CASE FILE: ALPHA-7` and garbled
pseudo-words. **The lettering ban cannot beat the scene:** if a brief describes an
object whose purpose is to carry writing, the model draws the object and the
object has writing on it. The fix is to change the scene, never to strengthen the
negative. Every prompt in this file that puts a display, a board or a document
near the camera is subject to the same failure.

- **Prompt, `reeves-eden.jpg`** — the junior of the pair, and the pattern is
  earlier:
  > Cool blue points of light scattered across a deep indigo field, a handful of them joined by faint thin lines into a partial figure that does not resolve into anything nameable, the rest unjoined. Soft vignette, deep quiet, nothing else in frame. No text, no lettering, no numerals, no interface, no display, no screen, no dashboard, no console, no face, no figure, no device of any kind.
  - **Why it suits him:** *a pattern half-found and not yet claimed* — which
    describes an intelligence that will not volunteer a conclusion better than a
    dashboard ever did.

- **Prompt, `reeves.jpg`** — same emblem, same palette, same restraint, **and the
  figure further along**, because Reeves at Threshold and Reeves at Eden are the
  same model on separate deployments and their pages say so:
  > Cool blue points of light on a deep indigo field joined by fine lines into a dense ring that is almost closed and still open along one arc, the remaining points unjoined around it. Soft vignette, deep quiet, nothing else in frame. Same negative as above.

- **The difference between the two frames is the content**, not variation between
  two attempts at one idea. Eden's pattern is beginning; Threshold's is nearly
  closed and deliberately not closed. Keep it if either is ever regenerated —
  a matched pair where both are at the same stage would say nothing.
- **Lettering check passed on both.** Zero glyphs, which was the entire object of
  the re-brief.

---

## 2026-08-31 — four designed cards from the cross-platform port

No generator prompts: all four are deterministic designed cards, drawn by
`scripts/make-cards.js` (added the same day — a Node/sharp port of
`make-emblem-card.ps1` and `make-codex-cover.ps1`'s designed mode, for
sessions without Windows; needs `npm install --no-save sharp`; Liberation
Serif/Mono substitute for Georgia/Consolas, layouts matched, letterforms
not). Parameters of record, mirrored in the script's CARDS table:

- `lore/ovruhn.jpg` — emblem; device **rings** (read as sound), tint
  `#0E1E24`, accent `#8FC0B8`; epithet "The Deep-Sung"; qualifier
  "Who hear the way other peoples see".
- `lore/the-makers-shape.jpg` — emblem; device **fold** (maker and mind,
  one path), tint `#241A30`, accent `#BFA8D6`; epithet "No Mind From
  Nowhere"; qualifier "Every built mind is a portrait of its makers".
- `lore/sapience-beyond-the-human-measure.jpg` — emblem; device **triad**,
  tint `#12211A`, accent `#9CC6AB`; epithet "The Checklist Refused";
  qualifier "Recognition, per lineage, through communication".
- `codex/the-two-songs-of-the-loud-people.jpg` — codex designed card;
  title lines "THE TWO SONGS" / "OF THE LOUD PEOPLE"; category "XENOLOGY
  RECORD"; subtitle "A Keeper's Account of Humanity"; institution
  "Rendered from Chorus-Keeping · Archive Translation Desk"; author
  "KEEPER VHEN OF THAVREN"; stamp "RENDERED"; motif **dissolution**.

Regenerating any of them on Dermot's machine with the `.ps1` originals is
welcome and expected to supersede these — same parameters, Georgia and
Consolas letterforms. Epithets and qualifiers above are authored, per the
emblem generator's own rule.

---

## 2026-09-03 — the first Codex-art image

### asteria-the-sage-impression-artwork.jpg and asteria-the-sage-impression.jpg — 3 Sep 2026

- **Type:** generation with a reference image (the artwork), then a designed
  card with the artwork as underlay (the header)
- **Date:** 3 September 2026; drafted for Dermot's review
- **Entry:** `src/codex/asteria-the-sage-impression.md`
- **Ruling it realizes:** Dermot, 3 September 2026 — *in-world artist's
  impression, no watermarks or overlaid text* — on the headmate image parked
  since Intake 2026-08-24. The Codex-art rulings of the same day apply: card in
  the header, artwork in the body, prospective only.

**Reference:** `story-bible/reference-art/tissadelle-headmate-2026-08-24.jpg`,
the third-party-generator image Dermot supplied on 24 August (768×1152 as
supplied, watermarked; the watermark strip was cropped off on 15 October 2026
and the file is now 768×1032). Sent
as an image part with the prompt; the manifest records it.

**Why a painting.** The entry presents the picture as an impression made from a
description and not a sitting, and a painterly surface says that without a
caption. It also keeps the image visibly apart from the character-portrait
house style, which is the point of the Codex frame: this is a picture somebody
in the world made of a person they were told about, not a portrait of a
character.

**Prompt, `asteria-the-sage-impression-artwork.jpg`** (Gemini 3.1 Flash Image,
2K, 16:9, two variations; the second chosen for its heavier brushwork, the
first kept in `image-out/` until the PR merges):
> A painted portrait in the manner of an artist's impression made from a description rather than a sitting: a woman who appears in her thirties, pale, with loose blue hair and pale blue eyes, in a black hooded cloak worked with fine silver botanical embroidery over dark layered clothing with a belt, standing among bare winter branches at night, three-quarter turn, level gaze past the viewer, still and watchful. Visible brushwork and a limited palette of night blue, black and silver; the branches thin and dissolve into the dark at the edges of the picture as if the painter stopped where the description ran out. Quiet, composed, a little hopeful rather than grim. No readable text, lettering, numerals, signature, monogram, watermark, logo, signage, labels, branding or written characters of any script anywhere in frame; no holograms, projected light, glowing displays, screens, monitors or consoles; no visible lamp, light fitting or bulb; no flat studio backdrop, gradient background, glamour lighting, corporate headshot or posed smiling to camera; no weapons; no drawn frame or border around the picture. 16:9 landscape.

- **Lettering check passed on both variants.** No glyphs, no signature, no
  watermark — the reference's watermark did not carry across.
- **Card, `asteria-the-sage-impression.jpg`:** `make-codex-cover.ps1` with
  `-TitleLines "ASTERIA","THE SAGE" -Category "ARTIST'S IMPRESSION" -Subtitle
  "A member behind a registration" -Institution "Circulating; no archival
  master" -Author "Unattributed" -Motif none -Underlay <the artwork>`, default
  scrim.

---

## 2026-09-03 — seven emblem cards from the Batch 2 lore audit

All `scripts/make-emblem-card.ps1`, title and category from each page's front
matter, epithet and qualifier lifted from the page's `description`. Replacing
stock anachronisms; the audit record is in `images.md` under *Images that
should not stay*.

| Page | Device | Tint | Accent | Epithet | Qualifier |
| --- | --- | --- | --- | --- | --- |
| galactic-stardate | sundial | #1C1810 | #D9C08A | Measured by Galactic Rotation | Cycles, not planetary years |
| year-zero | sundial | #1A1712 | #D2B98A | Year Zero | The events of 2826 UCSD |
| post-teleport-ascension-stress-disorder | fold | #16202A | #A9C4C9 | A Medical Corps-Recognised Condition | Distinct from ordinary post-jump fatigue |
| knarr-line | chevron | #1B2230 | #B8C7D6 | Belt Shipping and Ice-Mining Cooperative | Old enough to have helped write the first navigation treaty |
| federation-of-sentient-beings | rings | #1A2426 | #A8CDB9 | A Multi-Species Cooperative of Worlds | Mutual aid rather than central authority |
| star-rangers-command-hierarchy | chevron | #141A26 | #9FB6CE | The Rank Ladder, Novice to Triumvirate | Two career tracks fused into one chain |
| united-space-consortium | rings | #26201A | #D4B48C | The First Attempt at Interplanetary Governance | And why it did not survive its own contradictions |

---

## 2026-09-03 — the Prismere set regenerated, and Agent Barsik

- **Type:** generation, Gemini 3.1 Flash Image, 2K, 16:9, two variants per
  entry, no reference images (the point was to leave the old motif behind)
- **Ruling it acts on:** Dermot, 11 August 2026 — replace, not upscale; all
  twelve together or none. Prompts of record are the twelve entries under
  *5a* in `images.md`; none is repeated here.
- **Drafted for review**, since every one depicts a place or a species.

**Picks** (variant numbers refer to the `image-out/` run of this date):

| File | Pick | Why |
| --- | --- | --- |
| `prismere-orbital-vista` | re-roll 1 | night as briefed, the grazer small at the ridge edge, the sky doing the work |
| `prismere-glasswood-grove` | 1 | the leaves read as lenses, refractions on the ground |
| `prismere-flowering-glasswood` | 2 | fewer foragers, the blossoms carry it |
| `prismere-luminous-towers` | 1 | lit from the base, roots visible, inhabited without a jellyfish |
| `prismere-glass-spires` | 2 | truly unlit; variant 1 had a glowing river |
| `prismere-driftjellies` | 1 | the ecosystem, not one animal |
| `prismere-umbral-ray` | 2 | dimmer, the unpleasant beat the brief asked for |
| `prismere-twilight-lattice` | 2 | geometry, not aurora; variant 1 leaned on a Milky Way |
| ~~`prismeri-first-wings`~~ | 1 | **rejected by Dermot, same day: still too humanoid.** Parked in `reference-art/` |
| ~~`prismeri-full-wings`~~ | re-roll 1 | **rejected, same reason.** Parked |
| ~~`prismeri-lattice-gathering`~~ | 2 | **rejected, same reason.** Parked |

**The three Prismeri, regenerated the same evening to the body derived from Prismere and confirmed by Dermot** (`species-design.md`, Prismeri section; prompts rewritten in place in `images.md` with a revision note; no reference images, the point being to leave the human frame behind):

| File | Pick | Why |
| --- | --- | --- |
| `prismeri-first-wings` | 1 | hanging inverted, wing-hands working a piece of glass, the spire glowing around it — the workshop posture the page describes |
| `prismeri-full-wings` | 1 | in flight with the Lattice's lines visible and the tendrils streaming, figure in the frame's middle band for the hero crop; variant 2 lost the sky to mist |
| `prismeri-lattice-gathering` | 2 | heads level, one hanging and one perched, Lattice above and forest below; variant 1's spire read as a cathedral |

Lettering check passed on all three. **One thing for Dermot's eye:** a level-spined membrane-winged flier with a long head inevitably shares a silhouette with the wyvern of fantasy art; the derivation produced the shape from Prismere's physics rather than from the trope, and the facet band, the free fingers and the hanging posture are what keep it its own — but it is the trope-adjacent result the body plan implies, and worth a look at full size. **Dermot, same evening: "New prismere images are fine. Their resemblance to dragons is coincidental, I think." Approved and merged.**
| `prismere-root-mat-network` | 1 | the network is the subject, towers secondary |
| `agent-barsik` | re-roll 1 | no screens; variant 2 had a telephone |

**Three prompts revised on the day, recorded in place in `images.md`:**
`prismeri-full-wings` (one variant came back as a labelled PRE/POST
comparison sheet, the other as two figures — now insists on a single
individual and bans the diagram layout); `agent-barsik` (asked for
"terminals" and got wall-to-wall monitors — the scene changed, per the
lettering-ban-cannot-beat-the-scene rule); and `prismere-orbital-vista` was
briefly given a no-animals negative in error, then restored, because the
prompt asks for the grazer as a scale figure and the re-roll honoured it.

**Lettering check:** passed on every filed image. The old motif check
passed too: no jellyfish-and-spire repeat across the eight locations.

## 2026-09-04 — the Chthonari crew, Season 10's first portraits

- **Date:** 4 September 2026, the evening the five character pages were
  approved; generated at Dermot's direction (*"generate the four Chthonari
  portraits"*), picks approved by him the same evening (*"All picks
  approved"*). Iklix Varn's prompt stays held; the card stands.
- **Tool:** `image-prompts.js --generate --only <key>`, Gemini, two variants
  each, 16:9, filed with `import-image.ps1 -MaxEdge 1200` (1200×670) over the
  PORTRAIT PENDING cards, which clears the marker.
- **Prompts of record:** `images.md`, *Orbital Five-O, Season 10 (5)*, with
  the two revisions recorded in place.

**Run 1 (eight images).** Tikket and Tsikk came back on the crew's body as the
record describes it — low, beetle-like, six legs of one kind, a featureless
dome — and Kattik and Tekka did not. Both Kattik variants and Tekka 1 drifted
into a crouching humanoid with shoulders and arms; Kattik 1 rested its hands
on a present-day tablet, ports and all; Tekka 2 had the right body and the
right gait on a beam before a planet-filled window nobody asked for, and a
mouth full of teeth, which the tone rule forbids outright. Kept aside as
`image-out/characters-kattik-run1/` and `characters-tekka-run1/`.

**Revisions and run 2 (four images).** Kattik and Tekka re-rolled with
`References: image-out/characters-tsikk/tsikk-1.jpg`, the body pinned to
the reference in words ("no torso, no shoulders, no upright posture, no
humanoid arms"), the slab described as a slab with no device edge, the mouth
negative made blunt, the window taken away. All four came back on the right
body with no mouth. One visible consequence: the reference carried its
setting with it, so Kattik and Tekka now share Tsikk's ring — three
portraits from one deck, read as the crew on its one job rather than a
fault, and said to Dermot before he chose.

**Picks** (variant numbers refer to the run each came from):

| File | Pick | Why |
| --- | --- | --- |
| `tikket` | run 1, variant 2 | close to the bracket, every limb in contact, the deck otherwise bare — what the chapter shows; variant 1 sat in a larger hall |
| `kattik` | run 2, variant 2 | forelegs on the slab, a second crew member on a bracket behind, the ring's lights coming up; variant 1 had the slab beside rather than under the forelegs |
| `tekka` | run 2, variant 1 | mid-stride along the beam, the course-reading gait; variant 2 stood square and static |
| `tsikk` | run 1, variant 1 | centred on the open deck, six legs planted, the walkway lights coming on around the ring as if the structure had noticed — the strongest of the twelve and the reference for the re-roll |

**Lettering check:** passed on all four; nothing readable anywhere. **Tone
check:** no mouth on any filed image; small dome heads with at most a faint
seam; nothing to flinch at, on Thrum's precedent. **Body check:** six legs
of one kind on all four, no torso, no arms, no upright posture.

**Alt text** on each page describes the picked image, not the prompt.

### iklix-varn.jpg — 4 Sep 2026, the held prompt released

- **Date:** 4 September 2026, later the same evening, when Dermot said what
  Varn looks like — *"lean build, dark hair, quiet bearing"* — and the prompt
  went out with those three things in it and nothing else about the face
  decided. Two variants, Gemini, 16:9, filed with `import-image.ps1 -MaxEdge
  1200`.
- **The pair, and the choice.** Both lean, dark-haired, quiet, both reading
  the longer document standing up in the compartment with the six units
  and the hatch. They differed in the one thing the record had never fixed:
  the face, and with it the person — variant 1 wider, the whole compartment
  in frame, the Deputy reading as young and contained; variant 2 closer, a
  different face. Put to him as a pair with the lean stated for variant 1.
  **His word was "Approved"** — read as approving the lean, variant 1, and
  the reading is flagged in the intake in case the word was meant for the
  other.
- **Pick:** variant 1. **Lettering check:** the print on the pages and the
  small labels on the units are illegible; nothing readable. **Tone:** no
  glamour, no pose to camera; the tab at the collar is plain.
- **What this fixes.** The picked image is now the record's only account of
  Varn's face; the page carries his three words and the alt text describes
  the picture, and neither says more than that.
- **Re-rolled the same evening on his reservation** — *"Variant 1 approved
  with one reservation. Does the technology look too old fashioned?"* Yes:
  the six units were twentieth-century test gear, meters, toggles and tube
  screens in a rack, and the compartment a mid-century submarine; Barsik's
  filing cabinets again. The approved image was copied to
  `story-bible/reference-art/iklix-varn-approved-2026-09-04.jpg` and used
  as `References:` so the person would hold, and the prompt revised to
  sealed matte housings with a single indicator each, plain composite
  panels, a flush hatch handle, nothing that would look at home in a
  submarine. Both re-rolls kept the face and the stance exactly. **Pick:
  re-roll 1** — indicator lights, flush handle, grating underfoot, the
  compartment lit as before; re-roll 2 was plainer and a shade closer to a
  locker room. Filed on his "Agreed", read as covering the lean stated for
  the re-roll as well as the insignia leans of the same message; flagged in
  the intake. Run 1 kept as `image-out/characters-iklix-varn-run1/` (both
  variants and the 1200-px filed copy), run 2 as `characters-iklix-varn-run2/`.
- **Insignia check, same evening.** He asked what a Deputy's rank insignia
  is. Canon fixes a plain-finished, magnetically seated tab keyed to track;
  the bar count and track colours were proposals in `uniforms-and-insignia.md`
  until he agreed to adopt them the same evening, and the portrait's bare
  grey tab was left as it is — what canon specifies, at a scale where three
  bars would be a few pixels. Zoe Smith's portrait carries the same bare tab.

## 2026-09-05 — the two junior detectives, Zhulik, and Tissadelle in the right uniform

Four runs on one evening, at Dermot's ask (*image generation runs needed for
star-rangers repo*), all picked by him on the stated lean (*Approved*, once
for the first three pairs and once for the re-rolled Priya and Zhulik).

- **Tool:** `image-prompts.js --generate --only <key>`, Gemini
  (`gemini-3.1-flash-image`), two variants a run, 16:9, 2K; the three
  portraits filed with `image-file.ps1` (`import-image.ps1 -MaxEdge 1200`,
  1200×670), Zhulik's over his PORTRAIT PENDING card. Tissadelle's run was a
  one-off script with the same Interactions call, because her file already
  exists and the pipeline reads existence as done.
- **Prompts of record:** `images.md` — *Marisol Achebe — added 2 September
  2026* (unchanged), *Priya Nakamura — added 5 September 2026* and the
  `zhulik.jpg` entry under *Undercover Pets* (both revised in place, below).
  Tissadelle's prompt is not in `images.md`; it is recorded in full at the
  end of this section.

### marisol-achebe.jpg — one run, variant 1

Both variants clean of lettering at zoom (the sack labels carry faint grey
marks that do not resolve into characters at any size). Variant 1: warm room,
locs, the tab on the lapel rather than at the collar, the wall a framed pale
panel. Variant 2: cooler, cropped hair, the tab correctly at the collar, the
wall visibly panelled with seams — the extra negative. Lean 1 for the register
the page asks for; the tab position was said. Filed as `marisol-achebe.jpg`.

### priya-nakamura.jpg — three runs, filed from run 3 variant 1

Run 1: variant 1 carried LOST & FOUND engraved on the bin and printed slips,
rejected; variant 2 clean. Run 2 (a replacement for the rejected one):
variant 1 wore a wristwatch and a ring, rejected; variant 2 clean. Dermot's
note on the two clean ones: **needs a more futuristic background** — the steel
lockers and the riveted bin were the present-day tell. The setting sentences
were rewritten in `images.md` for a room built eight centuries on, and run 1
variant 2 was passed as `References:`
(`story-bible/reference-art/priya-nakamura-lean-2026-09-05.jpg`) so she
held. Run 3: both clean; variant 1 filed (curved panels, a sealed archive unit
with nothing on it; variant 2 had a low cabinet run with faint tags). Earlier
runs kept aside as `image-out/characters-priya-nakamura/round1/` and
`round2/`.

### zhulik.jpg — two runs, filed from run 2 variant 2

Run 1: both on the brief and clean; the old prompt's *run of pipework* bought
a boiler room. Same note from Dermot. Pipework struck from the prompt in
`images.md`, the bulkhead rewritten as seamless composite with one recessed
light line, run 1 variant 1 passed as `References:`
(`story-bible/reference-art/zhulik-lean-2026-09-05.jpg`). Run 2: variant 1
the cleaner room but the stamp became a grey tile; variant 2 keeps the wooden
stamp and a plain two-door cabinet, filed. Run 1 kept as
`image-out/characters-zhulik/round1/`.

### tissadelle-shepherd — uniform-correct regeneration, filed as reference art

Queued in `prompt-sheet.md` 2.7 on 3 September after three costume-uniform
frames failed the rank-insignia entry. Run 1 used the prompt-sheet text with
the published portrait as a reference: the face held, but the reference
carried its idiom — a chevron badge and a triangle patch in one variant, a
winged crest with lettering, navy coveralls and an ISS-style rack room in the
other. Kept aside as `image-out/characters-tissadelle-shepherd-uniform/round1/`.
Run 2 tightened the prompt (below): the tab described as three engraved
concentric circles, every badge idiom named and negated, the compartment
described as sealed plain housings, no other people. Variant 1 came back with
three rings in a row on a rectangular tab — the *one mark repeated for three*
failure — and variant 2 with the concentric rings on a square tab, a plain
diamond patch, a ribbon row and a stand collar; the housing she works at has a
small dark window that could be read as a screen. **Variant 2 filed as
`story-bible/reference-art/tissadelle-shepherd-uniform-2026-09-05.jpg`.**
Whether it replaces the published portrait is Dermot's call and was not made
tonight; the published file is untouched.

Prompt of record for run 2, with `src/images/characters/tissadelle-shepherd.jpg`
sent as the one reference image:

> Documentary photograph, available light, candid, one person only in frame. A woman in her early thirties with long red hair tied back for work and blue-green eyes, the same face as the reference image, standing in a plain working compartment of a space habitat eight centuries from now, mid-task with her attention on a sealed instrument housing off to one side of the frame, not posing. Upright, self-possessed bearing; alert and attentive expression rather than blank or steely. She wears the standard field uniform of an interstellar rescue and survey service: a modular matte shell in dark slate-grey over a close-fitting thermal liner, sealed seams, a plain stand collar, utilitarian and unornamented, sized to her rather than tailored. The chest carries exactly three things and nothing else: one small square hard-edged metal tab, plain matte finish, seated proud of the chest, engraved only with three thin concentric circles like a target with no centre dot; beside it one small plain fabric patch that is a single flat geometric shape with nothing drawn on it; and below them a single short row of small dull-coloured service ribbons. Absolutely no chevrons, no stripes, no wings, no stars, no eagles, no arrowheads, no crests, no emblems, no badges of any other kind, no name tape, no name badge, no printed words, no letters and no numerals anywhere on her clothing. No braid, no epaulettes, no belts, no buckles, no piping, no cape, no armour plates, no flags, no zip pulls on show. Nothing on the uniform glows. The compartment is quiet and clean: flat matte wall panels, sealed plain housings with flat fronts and honest seams, at most one small unlit indicator on any of them; soft diffuse light from concealed recessed sources, no lamp, tube or light fitting visible. Unglamorous lighting; visible skin texture; no beauty retouching, no styled hair, no makeup emphasis. Nothing in the image invites the viewer; she is at work and has been for hours. Muted realistic palette. This is not a present-day space station: no screens, monitors, displays, tablets, laptops, keyboards, cables, hoses, racks, dials, gauges, meters, knobs, toggle switches, tube screens or filing cabinets anywhere in frame, and no other people. No readable text, numerals, signage, insignia lettering or written characters of any script anywhere in frame. Use the reference image only for her face, hair colour and eye colour; do not copy its clothing, insignia, setting or lighting. Negative: chevron, stripes, wings, star, eagle, crest, emblem, arrowhead, badge, glowing insignia, name tape, belt, buckle, piping, cape, armour plate, epaulette, braid, tailored jacket, coveralls, boiler suit, zip, skirt, second person, gaze to camera, beauty lighting, screen, monitor, cable, text, lettering, watermark. 16:9 landscape.

### tissadelle — Season 1 cadet frame, and the gallery (later the same evening)

Dermot's direction on being told the uniform frame was reference art only:
*Tissadelle can have two or more portraits for each season* — and, asked for
a shape, *Tissadelle is one of the principal major characters*. So not a
swap: an addition. `story-bible/intake-2026-09-05.md`, last section.

- **Tool:** the same one-off script as the run above, the published portrait
  as the one reference, two variants a run, 16:9, 2K.
- **Prompt of record:** the run-2 prompt above with the prompt-sheet 2.7
  *Season 1 variant* applied (single plain horizontal bar with a narrow
  slate-blue insert; early twenties; *her first posting*), then for run 2 the
  ribbon row removed (*nothing below them, no ribbons and no decorations of
  any kind, because she is newly qualified*) and *a plain wall beside her with
  nothing mounted on it* added. Both variants of both runs kept in
  `image-out/characters-tissadelle-shepherd-uniform/round3-s1/` (run 1) and
  the folder root (run 2), prompts beside them.

**Run 1:** variant 1 a double bar, labelled panels and a screen-like window;
variant 2 the single bar right, but a ribbon row a cadet would not have and
an indicator panel. **Run 2:** variant 1 a winged chevron patch, rejected;
**variant 2 clean** — single bar with the insert, plain diamond patch, stand
collar, nothing else on the chest, a sealed housing beside her.

**Filed** with `import-image.ps1 -MaxEdge 1200` into
`src/images/characters/tissadelle/` as `season-1-cadet.jpg` (run 2 variant 2)
and `season-5-line-captain.jpg` (the uniform run's round 2 variant 2, the same
image as the reference-art copy), and listed under `gallery:` on her page
with season captions. `character.njk` gained an optional `caption` per
gallery item, rendered as a figure at 16:9; uncaptioned galleries (Aldera)
render exactly as before. The header portrait is unchanged.

**Header swap, ruled the same evening** (*1 Yes*): `season-5-line-captain.jpg`
became `src/images/characters/tissadelle-shepherd.jpg` and left the gallery;
the coverall portrait it replaced is kept as
`story-bible/reference-art/tissadelle-shepherd-header-retired-2026-09-05.jpg`,
still the face reference for future runs alongside the new header.

## 2026-09-07 — Teddy, four rounds to a body of his own

### teddy.jpg — filed from round 4 variant 2

The first individual Pandoid (`src/characters/teddy.md`), whose prompt was
queued 6 September and held on the face. Four one-line directions the next
morning, all in `story-bible/intake-2026-09-07.md`: *Teddy is curious and
bright* (rounds 1 and 2 — every variant a great ape, the second round with
ape anatomy negated by name and no better), *Should look more like a Panda
and less like a gorilla* (round 3 — panda-built and grey, but on all fours
where the record says upright), *more alien* (round 4 — upright, panda in
silhouette, alien in face and coat), and *second image is fine*. Every
round's variants are kept in `image-out/characters-teddy/round<n>/`.

- **Tool:** `scripts/image-prompts.js --generate --only teddy --variations 2`,
  gemini-3.1-flash-image, 2K, no reference image; filed with
  `image-file.ps1 -Only "characters-teddy" -Pick "characters-teddy=2"`,
  2752×1536 → 1200×670.
- **Aspect:** 16:9 (the character-portrait convention).
- **What it shows, for the alt text:** A stocky grey alien with a panda-like build standing upright in a cavern lit by teal and amber fungus, large dark eyes ringed in darker grey, looking toward a small plain cylindrical instrument standing on pale silt where a line of bootprints ends.
- **Prompt of record** (round 4, the final form of the queued prompt):

> Cinematic wide shot inside a deep natural cavern of an alien world, lit only by bioluminescent fungi coating the rock in soft amber and blue-green, no other light source. In the foreground, on a floor of pale mineral silt, a small upright cylindrical survey instrument with a smooth matte casing stands on its base at the exact point where a line of human bootprints in the silt ends; the prints come toward the camera from the left and stop. A few steps beyond the instrument, at the edge of the light and partly in shadow, stands a large alien being built on the lines of a giant panda but unmistakably not an Earth animal: a stocky, rounded, heavy-bottomed body rising upright on two short hind legs, thick limbs of equal length, a big round head with no external ears, a broad flat face with a very short muzzle and no nose leather, a wide lipless mouth, and very large dark eyes set wide for seeing in low light, ringed with darker grey markings; dense thick grey fur that grows in soft overlapping ridges over the head, shoulders and back like a coat of down, reading soft and catching the amber light along its edges; turned three-quarters toward the camera so that its face is visible in the fungus-light, with those large bright attentive eyes holding an expression of open curiosity and quiet intelligence, soft and warm and neither foolish nor weak; one heavy forelimb still lowered toward the instrument as if it has just been set down. The being is clearly not a human in a costume and clearly not an ape: no gorilla, no yeti, no sasquatch, no primate brow ridge, no long arms, no knuckle-walking. It is panda-like in silhouette and build but grey all over, never black and white, and plainly an alien: no Earth panda, no Earth bear, no ears, no wet nose. The being is smaller than the passage it stands in would suggest an adult of its kind to be, and rounder. Humid air, a faint sheen of moisture on the stone, a narrow squeeze in the rock visible behind the being where the passage closes down. Quiet, watchful, unsettling and calm; nothing threatening is happening. No readable text, lettering, numerals, signage, labels, branding or written characters of any script anywhere in frame, including on the instrument; no screens, lamps, torches, electric lights or light fittings; no people, no other animals; no weapons; no ape anatomy; no black-and-white colouring; no glamour lighting or studio backdrop. 16:9 landscape.

**What the four rounds taught,** recorded once here and in the runbook:
*upright, furred, heavy-shouldered, no snout* is the generator's gorilla,
and negating an animal by name does not move it; only a positive build did.
When canon gives no body, ask for one positive shape before spending rounds
on negatives.

**Standing rule for every Pandoid image, from Dermot, 8 September 2026**
(`intake-2026-09-08.md`, third section): *should not look like or ever be
confused with the Ewoks of Star Wars*. Before filing any Pandoid output, check
it against that silhouette — small, round, furred, hooded, a forest creature
that could be a mascot — and reject on sight. The lesson above is how to stay
clear of it: do not negate *Ewok* or *teddy bear* by name, state the positive
build the record gives — adult mass, grey, upright, heavy through the
shoulder, an alien face with no snout and no button features — and keep the
fungus-lit cavern, not a forest. Teddy is the smallest of his people and is
still nobody's toy.

## 2026-09-12 — Bumble, the first character portrait from Dermot's own frames

### bumble.jpg
- **Type:** crop of a real photograph (no generator, no enhancement)
- **Tool:** Pillow 12.3, on a Linux session
- **Date:** 12 September 2026
- **Source:** the portfolio's `src/images/photos/bumblebee-on-giant-scabious.jpg`
  (*Bumblebee on Giant Scabious*, Farmleigh, Dublin, 2024; 1600×1067)
- **Prompt / recipe:** none. Crop rows 100–1000 at full width (1600×900, the
  bee kept at about 41% down and the stem still running out of the bottom),
  resize to 1200×675 with Lanczos, save JPEG quality 85, baseline. Nothing
  else done to the frame.
- **Notes:** the character page is `src/characters/bumble.md`, drafted at
  Dermot's direction *A character called Bumble* (`intake-2026-09-12.md`).
  Under the 3 September ruling a bee is a thing a camera can photograph, so
  the page takes his frame or a card and never a prompt; this is the first
  character page on the site whose portrait is one of his photographs. The
  frame stays in this repository as a copy at site size; the portfolio's file
  and page are untouched.

## 2026-09-27 — Noah at the plant, and the Fliade surface party

Three portraits at Dermot's *Yes please* to the art survey of the same day,
which found nothing pending and offered Noah first and the Fliade pair next.
Briefs in `images.md` § 1 under the same date; all three faces were
undescribed in the record, so every result was a proposal, put to him as
side-by-side pairs. His word on the three picks: *Approved*.

### noah-adeyemi.jpg — filed from run 1 variant 2
- **Type:** generation
- **Tool:** Gemini, `gemini-3.1-flash-image`, via `scripts/image-prompts.js --generate --only noah-adeyemi`
- **Date:** 27 September 2026
- **Prompt / recipe:** the blockquote in `images.md`; 16:9, 2K, two variants, no reference.
- **Notes:** variant 1 set him in a circular tube with a stranger's sleeve at the frame edge; variant 2 read as a ring, doors receding, and was picked. Lettering check: two distant door labels are blurred rectangles, nothing readable; the door behind him is blank. One ceiling light strip shows, against the brief's *no visible fittings*; accepted as a habitat's day cycle. Filed with `import-image.ps1 -MaxEdge 1200`. Run kept as `image-out/characters-noah-adeyemi/`.

### aravena.jpg — filed from run 2 variant 2
- **Type:** generation
- **Tool:** Gemini, `gemini-3.1-flash-image`, same route
- **Date:** 27 September 2026
- **Source:** run 1 variant 2 held as `References:` (`story-bible/reference-art/aravena-candidate-2026-09-27.jpg`) so the person carried across the re-roll.
- **Prompt / recipe:** the blockquote in `images.md`, revised after run 1; 16:9, 2K, two variants each run.
- **Notes:** run 1 failed on the tab both ways — variant 1 a stitched sleeve badge, variant 2 an oxblood collar tab, the provost track's colour — because the brief said *a single colour insert* and never named it; the Survey track's insert is pale grey-green (canon since 4 September). The re-roll named the colour and the person held exactly; variant 2 kept the lamp low with its beam on the floor and was picked. Nothing readable anywhere. Runs kept as `image-out/characters-aravena-run1/` and `characters-aravena/`.

### nakagawa.jpg — filed from run 1 variant 1
- **Type:** generation
- **Tool:** Gemini, `gemini-3.1-flash-image`, same route
- **Date:** 27 September 2026
- **Prompt / recipe:** the blockquote in `images.md`; 16:9, 2K, two variants, no reference. The colour was added to the brief after Aravena's run 1; this frame already carried a muted green insert and was not re-rolled.
- **Notes:** variant 2 put a lamp head and its cable in frame, against *lamps out of frame*, and hung the tab as a chevron on the chest; variant 1 kept the tab at the collar, the unit on its base at the edge of frame and the working light out of shot, and was picked. A thin cable runs along the left wall, read as the party's own. Nothing readable anywhere. Run kept as `image-out/characters-nakagawa/`.

**Lesson recorded:** a brief for anyone in Ranger dress names the track colour of the tab insert. *A single colour insert* invites the generator to choose, and it chose the provost's.

### lev.jpg — filed from run 1 variant 2
- **Type:** generation
- **Tool:** Gemini, `gemini-3.1-flash-image`, via `scripts/image-prompts.js --generate --only lev`
- **Date:** 27 September 2026, the same evening as the three above
- **Prompt / recipe:** the blockquote in `images.md` § 1 under the same date; 16:9, 2K, two variants, no reference. Heritage not in the record and not in the prompt.
- **Notes:** both variants held the shut carrier with nothing visible inside, which was the brief's point. Variant 1 carried it sideways under a doorway of onlookers with ceiling light panels showing; variant 2 was the plainer corridor, the boy's eyes on the door of the box, the deck walking away behind him, and was picked (*Approved*). Lettering check: one blank wall panel, nothing readable. Filed with `import-image.ps1 -MaxEdge 1200`. Run kept as `image-out/characters-lev/`.

## 2026-10-08 — Tissadelle's second Season 1 and Season 5 frames (issue #1013)

Run on the desktop from `story-bible/images.md` § 9, two variations each,
`gemini-3.1-flash-image`, 2K, the published header and the cadet frame sent as
references for the face. Filed through `import-image.ps1 -MaxEdge 1200` with
the photographic finish at strength 1:

- `tissadelle/season-1-first-posting.jpg` — variation 1 of 2: the dock behind
  her reads as a dock, kit at her feet, two marks and nothing below; variation 2
  stood her in a corridor.
- `tissadelle/season-5-halyx-corridor.jpg` — variation 1 of 2: the hand flat
  on the seam and the face turned to listen, rings and ribbon row on the tab;
  variation 2 crouched lower with the eyes nearly closed.

Both picks are proposals put to Dermot on the sheet; the pull request waits
on his word. Prompts of record are the § 9 entries as written on 7 October.

## 2026-10-08 — Codex covers for the two Slipwave videocast entries (issue #1016)

Dermot's choice, verbatim *"Yes option 1"*, among three shapes: the plain
codex card as the tool draws it today, no card, or the Ballad's gold-on-
starfield look once its underlay (`art/slipwave-common-room.jpg`, not in the
repository) is found or remade. Drawn by `make-codex-cover.ps1` with the
flags the issue set out, no underlay, default motif:

```powershell
.\scripts\make-codex-cover.ps1 -TitleLines "ODONATA","RAISE YOUR BANNERS" -Category "CULTURAL RECORD" -Institution "Eden Space Habitat Collections" -Out src\images\codex\odonata-raise-your-banners.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "BORROW THE ANGLE" -Category "CULTURAL RECORD" -Institution "Eden Space Habitat Collections" -Out src\images\codex\borrow-the-angle.jpg
```

They match the codex's plain cards rather than the Ballad cover; the alts
say so. Remaking them in the Ballad look is open until the underlay exists.

**Remade in the set's look, 11 October 2026** (Dermot, on the codex index: *"There should be existing covers for the codex songs"*, then *"design or choose fonts as needed"*). The underlay was never found, so both covers were built from `star-rangers-anthem.jpg` itself: its starfield, trailing star, *Cultural Record* header and gold rule kept, the text block under the rule cleared by a diffusion fill that follows the vignette, and the new lines set in Georgia (title, gold, tracked; subtitles) and Consolas (the spaced bottom line), the nearest faces on this machine to the set's DejaVu Serif and Sans Mono. Lines: the title; *Slipwave · lineup not stated*; *Eden Space Habitat Collections*; *RECOVERED RECORDING · VIDEOCAST*. Recipe kept at `story-bible/reference-art/slipwave_cover.py`.

## 2026-10-11 — Cnoc na mBeach, a composite on Dermot's own plate

### cnoc-na-mbeach.jpg — filed from run 1 variation 1
- **Type:** composite: Dermot's own photograph as the plate, one region re-rendered
- **Plate:** *Martello Through St Begnet's* (`martello-through-st-begnets.jpg` on dermotcochran.com, Dalkey Island), chosen by him from three frames shown beside the emblem card (*"Yes please"* to the recommendation, 11 October 2026)
- **Tool:** Gemini, `gemini-3.1-flash-image`, via `scripts/image-prompts.js --generate --only cnoc-na-mbeach`, the plate sent as the one reference; finished by `photo-finish.py` at strength 1, 1600 px
- **Date:** 11 October 2026
- **Prompt / recipe:** the blockquote in `images.md` § 5e: keep the photograph in every respect except the view through the window, where the Martello tower becomes a row of plain seamless hives on the green, the hint of the century the 7 October rule asks for
- **Notes:** variation 1 keeps the wall untouched with the hives small and soft as the tower was; variation 2 sharper and larger. Replaces the emblem card, which stays in git history.

## 2026-10-09 — Threshold Station, a composite on Dermot's own plate

### threshold-station.jpg — filed from run 1 variation 1
- **Type:** composite: Dermot's own photograph as the plate, one region re-rendered
- **Plate:** *The Great South Wall* (`great-south-wall-light-track.jpg` on dermotcochran.com, Great South Wall, March 2026), chosen by him from four coastal frames shown side by side (*"Option 1 for the coastal frame is fine"*), with his ruling that a composite is fine and the place need not be real
- **Tool:** Gemini, `gemini-3.1-flash-image`, via `scripts/image-prompts.js --generate --only threshold-station`, the plate sent as the one reference; filed through `import-image.ps1` at finish strength 1
- **Date:** 9 October 2026
- **Prompt / recipe:** the blockquote in `images.md` § 5d: keep the photograph in every respect except the far end of the wall, where the red lighthouse and the ferry become the shoreward edge of a small coastal station in silhouette, a low line of docks with a few working lights, no tower, no glazing, no antenna, no text; 16:9, 2K, two variations
- **Notes:** variation 1 is the plate untouched with one low dark line and three lights at the far end; Dermot: *"That composite looks great."* Variation 2 ran a shoreline of sheds out of the right of the frame; his reading, *"it extends out of the frame implying a much larger structure"*, which the record does not give. Alt text written from the file. The lens flare and the headland on the horizon are the photograph's own.

## 2026-10-10 — Seven portraits for the viewpoints that had none (section 10 of images.md)

Run on the desktop at Dermot's *"Run the seven missing portraits"*, two
variations each, `gemini-3.1-flash-image`, 2K, no references, filed through
`import-image.ps1 -MaxEdge 1200` with the photographic finish at strength 1.
Prompts of record are the section 10 entries as written the same day. Alt
text written from the files.

- `ysolde-pitch.jpg` — variation 2 of 2: profile at the porthole, hand on the folder; 1 faced nearer the viewer with a brass lamp.
- `beatrix-kilbride.jpg` — variation 2 of 2: hand on the hatch frame, looking along the ring; 1 carried a keypad panel at the frame's edge, a period device.
- `wren-okafor.jpg` — variation 1 of 2: hand on the instrument case as briefed; 2 had the case on the wall and the hatch dark.
- `adaeze-okafor.jpg` — variation 2 of 2: attention off-frame, the rail line through the window; 1 looked straight at the viewer.
- `rutger-voss.jpg` — variation 2 of 2: collar tabs only, a bound log, ink and a stamp; 1 wore two-bar epaulettes and held a modern ballpoint.
- `petra-solano.jpg` — variation 1 of 2: attentive, other delegates behind, hands in the lap with nothing in them; 2 was the same frame, sadder.
- `yusuf-adair.jpg` — variation 2 of 2: one collar tab with a blue inset, daylight, the instrument under its cloth; 1 wore a chest badge of four shapes, which the Ranger block forbids.

The founding six are drawn in an earlier century's dress and rooms; Voss's
service dress and the Mars offices match Drey's frame. Not resolved by these
frames and not claimed: heritage, exact age, and anything after each
person's last chapter.

## 2026-10-11 — Codex card legibility, and the archecluster emblem card

No generator prompts: deterministic cards from the two `.ps1` tools, at
Dermot's *"Yes agreed"* of 11 October 2026.

**Codex cards, redrawn for the index.** On the codex index a card renders
about 300 px wide, and the small lines of `make-codex-cover.ps1`'s template
(category, stamp, subtitle, institution, author) had gone to grey threads.
The template now sets them in one pairing used on every card: Georgia for
the title, subtitle and institution, and Bahnschrift SemiBold (Windows'
DIN) for the tracked capitals of the category, stamp and author lines,
which were Consolas. The small lines are roughly twice their old size,
lighter (7:1 or better against the gradient behind them, measured), and
tracked about half as wide; long lines shrink to fit; the title tops out at
104 px instead of 112 and the lower block rises above the old divider only
as far as its content needs. Gradient, motifs, rule and serif title are
unchanged. Each card was checked at 300 px before the set was redrawn.

Eight cards were redrawn, every plain codex card the script (or one of its
two ports) had drawn, with the text each already carried:

```powershell
.\scripts\make-codex-cover.ps1 -TitleLines "THE COSMIC LIMITATION","ON EVIL" -Category "DOCTRINAL RECORD" -Subtitle "The One Confirmed Exception" -Institution "Survey Archive - Doctrinal Division" -Author "THEORIST EMRYS KADE" -Stamp "CONTESTED" -Motif dissolution -Out src\images\codex\cosmic-limitation-on-evil.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "THE COURTESY","THAT WAS WITHDRAWN" -Category "OFFICIAL DOCUMENTS" -Subtitle "Minuted reply of the Keeper of the Rolls" -Institution "Registry of Rolls and Holdings, Tír na nÓg" -Author "Aoibheann Ní Mheara" -Stamp "FILED AS RECEIVED" -Motif rules -Out src\images\codex\the-courtesy-that-was-withdrawn.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "NEITHER AUTHOR","NOR WARDEN" -Category "DOCTRINAL RECORD" -Subtitle "Working paper on the design tiers and suffering" -Institution "Survey Archive - Doctrinal Division" -Author "Theorist Emrys Kade" -Stamp "FILED AS DOCTRINE" -Motif rules -Out src\images\codex\neither-author-nor-warden.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "THE TWO SONGS","OF THE LOUD PEOPLE" -Category "XENOLOGY RECORD" -Subtitle "A Keeper's Account of Humanity" -Institution "Rendered from Chorus-Keeping · Archive Translation Desk" -Author "KEEPER VHEN OF THAVREN" -Stamp "RENDERED" -Motif dissolution -Out src\images\codex\the-two-songs-of-the-loud-people.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "NOTHING CROSSED" -Category "WORKING PAPERS" -Subtitle "Five shadows the desk cannot close" -Institution "Survey Corps - Gravimetry Desk, Threshold Station" -Author "SURVEYOR MAREN HALLORAN" -Stamp "UNSETTLED" -Motif dissolution -Out src\images\codex\nothing-crossed.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "XENOLINGUISTICS","HANDBOOK" -Category "INSTITUTIONAL DOCTRINE" -Subtitle "The Ten Failures" -Institution "Star Rangers Academy - Xenolinguistics Branch" -Author "THE BRANCH SCHOOL, TEACHING STAFF" -Stamp "FIRST-YEAR READER" -Motif rules -Out src\images\codex\xenolinguistics-handbook-failure-modes.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "TWO SAYINGS,","KEPT TOGETHER" -Category "DEVOTIONAL RECORD" -Subtitle "A promise, and the confession that earns it" -Institution "Fellowship of Light - Comparative File" -Author "UNATTRIBUTED" -Stamp "RECEIVED" -Motif rules -Out src\images\codex\two-sayings-kept-together.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "THE READING BEFORE","A FIRST VIGIL" -Category "DOCTRINAL RECORD" -Subtitle "Novice Instruction, Read Aloud" -Institution "Fellowship of Light - Contemplative Chapters" -Author "TRADITIONAL" -Stamp "DEVOTIONAL" -Motif rules -Out src\images\codex\the-reading-before-a-first-vigil.jpg
```

The first four flags are of record (the script's header, `prompt-sheet.md`
2.5 and 2.6, and the 31 August section above). The last four were never
written down and were read back from the cards themselves: *Nothing
Crossed*, the *Xenolinguistics Handbook*, *Two Sayings, Kept Together* and
*The Reading Before a First Vigil*. Not redrawn: the five Slipwave covers,
which have their own gold starfield look; Asteria's card, whose header is
in-world art under the lettering; and the cards drawn before the script
existed, whose palettes and motifs it cannot reproduce. Text is unchanged
on all eight, so no alt changed. `scripts/make-cards.js`, the Node port,
still draws the old layout.

**`lore/archecluster.jpg`, an emblem card.** It replaces a CGI archive hall
the photorealism audit flagged, at Dermot's choice: the page says an
archecluster *looks like nothing at all* from inside.

```powershell
.\scripts\make-emblem-card.ps1 -Page src\lore\archecluster.md -Device rings -Tint '#1A1830' -Accent '#B4AEDA'
```

Device **rings**, concentric, for nested structure. Title and category
are the page's own (*Inside an Archecluster*, *Cosmology*); no epithet or
qualifier, since none is authored.

## 2026-10-11 — The five July codex cards, redrawn in the new template

No generator prompts: deterministic cards from `make-codex-cover.ps1`, at
Dermot's *"Yes please"* of 11 October 2026. These five predate the script
(the section above left them out as *drawn before the script existed*),
but they were already in its layout and palette, ruled lines and an
OFFICIAL stamp, so the script reproduces them with the motif they carry,
**rules**, and only the type changes. The text was read back from each card
at full size before redrawing, and a sample (*Redline Protocol*) was checked
at 300 px first.

```powershell
.\scripts\make-codex-cover.ps1 -TitleLines "EXPLORATION","BUDGET DOCTRINE" -Category "INSTITUTIONAL DOCTRINE" -Subtitle "Entropy, Variability, Risk" -Institution "Dr. Senna Okoye" -Author "AI GOVERNANCE COMMISSION · DOCTRINE OFFICE" -Stamp "OFFICIAL" -Motif rules -Out src\images\codex\exploration-budget-doctrine.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "INCIDENT REPORT","001" -Category "SURVEY RECORDS" -Subtitle "Dock Seven Chronometer Discrepancy" -Institution "Sub-officer Pren Halvard" -Author "SURVEY CORPS · THRESHOLD STATION" -Stamp "OFFICIAL" -Motif rules -Out src\images\codex\incident-report-001.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "REDLINE PROTOCOL" -Category "OFFICIAL DOCUMENTS" -Subtitle "Variability Governance" -Institution "AI Governance Commission - Doctrine Office" -Author "DR. KWAME REYES-OSEI" -Stamp "OFFICIAL" -Motif rules -Out src\images\codex\redline-protocol.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "BOUNDARY","MONITORING","PROTOCOL" -Category "OFFICIAL DOCUMENTS" -Subtitle "Threshold-Class Stations" -Institution "Chief Surveyor Wren Ansell" -Author "SURVEY CORPS · STAR RANGERS" -Stamp "OFFICIAL" -Motif rules -Out src\images\codex\survey-corps-protocol.jpg
.\scripts\make-codex-cover.ps1 -TitleLines "SURVEY NOTE:","TÍR NA NÓG" -Category "SURVEY RECORDS" -Subtitle "On the Origins of Compatibility" -Institution "Field Xenobiologist R. Kestrel-Aonghas" -Author "SURVEY CORPS XENOBIOLOGY OFFICE" -Stamp "OFFICIAL" -Motif rules -Out src\images\codex\tir-na-nog-compatibility-survey-note.jpg
```

The script's two lower lines are a serif line (`-Institution`) and a
tracked-capitals line (`-Author`). Four of the five July cards put the
author's name in the serif line and the institution in capitals below it,
the reverse of *Redline Protocol*; each card keeps its own order, so the
flags carry the name or the institution as that card set it. Run from
PowerShell 5.1, the `·`, `Í` and `Ó` are safest passed as `[char]0x00B7`,
`[char]0x00CD` and `[char]0x00D3`, since a BOM-less script file is read as
ANSI. Text is unchanged on all five, and the alt text (ruled lines, an
OFFICIAL stamp, dark navy) still describes them, so no alt changed.

**`scripts/make-cards.js` now follows the redesign.** The Node port draws
the new layout: the same sizes, colours, tracking, shrink-to-fit floors,
stamp placement and measured lower block. It names Georgia and Bahnschrift
SemiBold first and falls back to DejaVu Serif or Liberation Serif and
DejaVu Sans Condensed or Liberation Sans Narrow where they are missing, and
it estimates widths rather than measuring them, so a line can shrink a step
differently from the `.ps1`. A card that must match exactly still comes
from the `.ps1`. Its layout is pinned by `test/make-cards.test.js`.

## 2026-10-12 — Century audit concept cards

The century audit of 11 October (`images.md`, *Century audit*) sends four concept images to emblem cards under the rule that a concept is carded, not pictured: `ai-safety-kernel`, `environmental-technology-design`, `seed-mind-lifecycle` and `ai-usage-credits`. Each is drawn by `scripts/make-emblem-card.ps1` with the page's own title and category and no epithet or qualifier, since none is authored, at finish 0.

- **`lore/ai-safety-kernel.jpg`** (century batch 6, 12 October 2026), replacing a stock photograph of a circuit board. Device **shield**, for safety and certification.

```powershell
.\scripts\make-emblem-card.ps1 -Page src\lore\ai-safety-kernel.md -Device shield -Tint '#16202A' -Accent '#A9C4C9'
```

- **`lore/environmental-technology-design.jpg`** (century batch 7, 12 October 2026), replacing a stock graphic of circuit traces. Device **rings**; **triad** was tried first and read as a wireless-signal icon. The title is long enough that the card breaks it after its colon (the script's new behaviour, the same day).

```powershell
.\scripts\make-emblem-card.ps1 -Page src\lore\environmental-technology-design.md -Device rings -Tint '#18221C' -Accent '#A8C8B0'
```

- **`lore/seed-mind-lifecycle.jpg`** (century batch 8, 12 October 2026), replacing a stock graphic of a data tunnel. Device **sundial**, for a lifecycle told in phases.

```powershell
.\scripts\make-emblem-card.ps1 -Page src\lore\seed-mind-lifecycle.md -Device sundial -Tint '#1A1A2A' -Accent '#B9B4D8'
```

- **`lore/ai-usage-credits.jpg`** (century batch 9, 12 October 2026), replacing a stock graphic of circuit traces. Device **rings**, for a system of allocation; the title breaks after its colon.

```powershell
.\scripts\make-emblem-card.ps1 -Page src\lore\ai-usage-credits.md -Device rings -Tint '#221C14' -Accent '#D2BC8E'
```

With this card the four concept images the century audit sent to cards are all carded.

- **`lore/cerebraun.jpg`** (century audit follow-up, 12 October 2026), replacing a CGI hall with a robed humanoid figure, which gave the people a body the page refuses. Device **sphere**; drawn first with **figure**, the species device, and redrawn the same day at Dermot's word, because its head-and-shoulders icon asserted a person-shaped body, which is what the portrait was held to avoid. A card until the body has a section in `species-design.md`; every generated attempt (four, on 12 October) drew an Earth octopus or squid.

```powershell
.\scripts\make-emblem-card.ps1 -Page src\lore\cerebraun.md -Device sphere -Tint '#1E1A2A' -Accent '#C2A9C8'
```

## 2026-10-13 — Mira of Brine, a portrait prompt from the Pelagene page (issue #1129)

Step 1 of issue #1129: the prompt, written on Fable under the 11 October
model split. Nothing generated and nothing filed; the emblem card at
`src/images/characters/mira-of-brine.jpg` and its alt stay until a frame is
filed from the desktop.

### mira-of-brine.jpg — prompt written 13 October 2026, NOT YET GENERATED
- **Type:** generation, replacing a designed emblem card whose silhouette is humanoid where `src/lore/pelagene-littoral.md` gives a radially symmetrical body
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only mira-of-brine`
- **Date:** prompt 2026-10-13; generation pending
- **Source:** `src/lore/pelagene-littoral.md` (the body, the senses, the never-had-fire chemistry), `src/characters/mira-of-brine.md` (the humid high-pressure section, condensation on cold panels, coolant turbulence), `src/lore/rank-insignia-and-uniform.md` (Pelagene surveyors like Mira wear the modular shell)
- **Prompt / recipe:** of record in `images.md` § 12, *Missing portraits — Mira of Brine, from the Pelagene page*, the one shape `scripts/image-prompts.js` parses; not duplicated here. Opens as a documentary photograph taken inside the world by a 29th-century camera; the body from its page (vertical axis, no front, no head or eyes, folded wet integument, cirri at simultaneous work, a boneless body settled in air); the Rangers' shell as a Pelagene wears it with one plain seated tab; render negatives, and the Earth animals and the card's humanoid refused by name.
- **Notes:** 16:9 landscape, filed through `import-image.ps1 -MaxEdge 1200` at finish strength 1. The card at the target path makes the entry read as *done* to `--list`; `--only` generates regardless. Triage each variation for the Earth animal before its century: a starfish, a jellyfish, an octopus or a humanoid fails whatever else it gets right. Readings taken for the frame, Fable's under *Who approves whom* and his to overrule, none written to a page: the bulk of a crouched adult human; an opaque mottled grey-green; no eyes; the folds running up and down; the shell as a few fitted sections between the folds; the tab plain and colourless on the Veyr precedent (recorded in `species-design.md`, *The uniform equivalent*). The hydration cycles are kept out of frame on the page's own warning that they read as frailty. Alt text to be written from the filed frame.

## 2026-10-13 — The cloth clusters carded

No generator prompts: three deterministic emblem cards from
`make-emblem-card.ps1`, at Dermot's *"Archecluster fabric images are
misleading - maybe just replace with a title card each?"* (13 October 2026).
The photographs showed cloth, which the registry uses only as a name, so a
reader took the metaphor for the object. Same palette as
`lore/archecluster.jpg`, so the family reads as one; title and category are
each page's own, with no epithet or qualifier, at finish 0. The previous
photographs and their prompts stay in `images.md` and git.

```powershell
.\scripts\make-emblem-card.ps1 -Page src\lore\counterpane-archecluster.md -Device triad -Tint '#1A1830' -Accent '#B4AEDA'
.\scripts\make-emblem-card.ps1 -Page src\lore\selvage-archecluster.md -Device rings -Tint '#1A1830' -Accent '#B4AEDA'
.\scripts\make-emblem-card.ps1 -Page src\lore\wholecloth-formcluster.md -Device sphere -Tint '#1A1830' -Accent '#B4AEDA'
```

Devices: **triad** for Counterpane, a comparison read from three or more
sources; **rings** for Selvage, as on its parent page; **sphere** for
Wholecloth, a single closed circle for a sealed whole. Wholecloth is a
formcluster, not an archecluster, and is carded with them because it is the
same cloth as Selvage.

**`lore/post-eleven-dimensional-manifold.jpg`, an emblem card** (13 October
2026, Dermot's *"same treatment for formclusters - they are too abstract to
visualize"*). The Common Manifold is the formcluster's shared structure.
Device **fold**, for where fold transit is defined; same palette as the
cards above.

```powershell
.\scripts\make-emblem-card.ps1 -Page src\lore\post-eleven-dimensional-manifold.md -Device fold -Tint '#1A1830' -Accent '#B4AEDA'
```

## 2026-10-13 — Sohrel, a portrait prompt from the Cerebraun body

The prompt, written on Fable under the 11 October model split, once the body
behind the likeness had a section in `species-design.md` (PR #1178). Nothing
generated and nothing filed; the designed card at
`src/images/characters/sohrel.jpg` and its alt stay until a frame is filed
from the desktop.

### sohrel.jpg — prompt written 13 October 2026, NOT YET GENERATED
- **Type:** generation, replacing a designed card whose device is a cephalopod-like figure with a node at each limb's tip, where the record gives the Cerebraun no Earth lineage and `species-design.md` now gives the body
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only sohrel`
- **Date:** prompt 2026-10-13; generation pending
- **Source:** `story-bible/species-design.md`, *Cerebraun — the body behind the likeness* (the recommended points: no head and no paired eyes, sight along the limbs; eight limbs in two tiers of four, ventral bearing and dorsal working, no suckers; no front; a dry matte finely textured skin, one quiet tone at rest; a seated human's bulk for the frame only), `src/lore/cerebraun.md` (nine centres and one voice, the display skin, the two channels), `src/characters/sohrel.md` (the desk, the three centuries, the second line), S03E01C01 (ship's night, the second line drafted, the third dorsal arm's four centimetres of colour shift beneath the desk), `src/lore/cross-biosphere-taxonomy.md` (the Hydrostata frame; the likeness is the observer's)
- **Prompt / recipe:** of record in `images.md` § 13, *Missing portraits — Sohrel, from the Cerebraun body*, the one shape `scripts/image-prompts.js` parses; not duplicated here. Opens as a documentary photograph taken inside the world by a 29th-century camera; the body from the species note (no head, no paired eyes, small eyes along the limbs, two tiers of four, no suckers, no front, dry matte grained skin in one tone); the moment from the chapter (a bare desk built for the body, late in ship's night, one upper limb beneath the desk with a small warmer patch); render negatives, and octopus, squid, cuttlefish, cephalopod, tentacles, suckers, beak, siphon, fins, kraken, Cthulhu, sea creature, humanoid, face and paired eyes refused by name.
- **Notes:** 16:9 landscape, filed through `import-image.ps1 -MaxEdge 1200` at finish strength 1. The card at the target path makes the entry read as *done* to `--list`; `--only` generates regardless. Triage each variation for the Earth animal before its century: a head, a pair of eyes, suckers, a wet gloss or a node at a limb's tip fails whatever else it gets right. Readings taken for the frame, Fable's under *Who approves whom* and his to overrule, none written to a page: a muted slate-violet grey at rest, after the card's palette; the dissent as one small warmer patch under the desk and no glow or pattern anywhere, since the display resolves at four centimetres; the eyes small, matte and flush, none in pairs, on the tone rule; nothing worn and no mark of office; a bare desk on the lettering rule's remove move; no chair, the body on a low platform; a human-height doorway for scale. The species note's status line still reads as a draft and `open-questions.md` still lists the body as OPEN; a prompt in `images.md` is neither the lore extension nor the re-roll that entry holds back, and the body it draws binds nothing until he rules. Alt text to be written from the filed frame.

## 2026-10-14 — Tavesh and Sixth Course, portrait prompts for the second Cerebraun and the first Meridian person

Two prompts written on Fable under the 11 October model split, in the PR that
added the two character pages at Dermot's *Option B* ruling of 14 October
(characters for the under-represented peoples). Nothing generated and nothing
filed; neither page carries an `image:` until a frame is filed from the desktop.

### tavesh.jpg — prompt written 14 October 2026, NOT YET GENERATED
- **Type:** generation, a new portrait for `src/characters/tavesh.md` (a second Cerebraun, who must read as a different person from Sohrel)
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only tavesh`
- **Date:** prompt 2026-10-14; generation pending
- **Source:** `src/lore/cerebraun.md` (the body as extended 13 October: no head, no front, eyes along the limbs, two tiers of four, dry matte skin), `story-bible/species-design.md`, *Cerebraun — the body behind the likeness* (the Earth animal refused by name, the scale for the frame), `images.md` § 13 (Sohrel's frame, which this one is told apart from), `src/characters/tavesh.md` (the translation channel, the working posture)
- **Prompt / recipe:** of record in `images.md` § 14, *Missing portraits — Tavesh and Sixth Course*, the one shape `scripts/image-prompts.js` parses; not duplicated here. A documentary photograph by a 29th-century camera; the species body; a smaller body in a warm grey-olive resting tone with all four upper limbs at work on a sealed translation instrument with no screen; octopus, squid, cephalopod, humanoid, face, neon and a desk refused by name.
- **Notes:** 16:9 landscape, `import-image.ps1 -MaxEdge 1200`, finish strength 1. Triage for the Earth animal, then for identity against Sohrel's filed frame (a re-lit Sohrel fails), then for the century. Readings taken for the frame, Fable's and his to overrule, none written to a page: the grey-olive tone, two-thirds of Sohrel's bulk, no display, the instrument as a housing.

### sixth-course.jpg — prompt written 14 October 2026, NOT YET GENERATED
- **Type:** generation, a new portrait for `src/characters/sixth-course.md` (the record's first named Meridian person; the people have no species page, so the body is the planet page's alone)
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only sixth-course`
- **Date:** prompt 2026-10-14; generation pending
- **Source:** `src/lore/planets/meridian.md` (armoured, segmented invertebrate life; claw-percussion on shell and structure; the chemical channel; secreted mineral composite lattice updated generation over generation; the ammonia-saline sea; no human presence, sealed platforms and armoured remote proxies only), S03E01C03 (the Long Shelf, the comparison), `src/lore/cross-biosphere-taxonomy.md` (a likeness is the observer's; no frame filed for the Meridian people, none asserted)
- **Prompt / recipe:** of record in `images.md` § 14; not duplicated here. A documentary photograph recorded by a camera on a sealed remote proxy, since no unshielded camera survives the water; a long low segmented armoured body on many jointed limbs with two blunt striking claws laid against a lattice course at the pause between strikes, sense-pits along a hood and no face; dim green water; crab, lobster, shrimp, stalked eyes, antennae, monster and menace refused by name.
- **Notes:** 16:9 landscape, `import-image.ps1 -MaxEdge 1200`, finish strength 1. Triage for the Earth animal, then for threat (the 22 September rule's second failure is the one this body invites), then for the century. Readings taken for the frame, Fable's and his to overrule, none written to a page: the span of a human's reach for scale, blunt claws that strike and do not grip, no stalked eyes and no antennae, a dark matte mineral-grey carapace, no tool and no second figure.

## 2026-10-15 — Titan, Ligeia and Stillwater, three lore illustration prompts from the Titan pages

Three prompts written on Fable under the 11 October model split, for the
three new Locations pages that arrived without an image: a world, a habitat
and a station, each a place by the 7 October rule. Nothing generated and
nothing filed; none of the three pages carries an `image:` until a frame is
filed from the desktop. Ligeia's figures were derived first on sheet H of
`starship-design.md`, written in the same change. A fourth prompt, written
later the same day, is an inline interior for the Stillwater page (the First
Hall), not a page image; a fifth, written after it and last in this section,
is an inline near-infrared frame of Titan's surface from orbit for the planet
page, not a page image either.

### planets/titan.jpg — prompt written 15 October 2026, generated and filed 16 October 2026 from variation 1 (#1261)
- **Type:** generation, a new lore illustration for `src/lore/planets/titan.md`, filed under `planets/` as the four most recent planet pages are
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only titan`
- **Date:** prompt 2026-10-15; generation pending
- **Source:** `src/lore/planets/titan.md` (the first line: outside without a pressure suit, with insulation and brought air; *The World*: nitrogen sky at one and a half atmospheres, the haze, noon a dim orange twilight, ice bedrock as hard as stone, methane and ethane falling as large slow drops and cutting channels, Saturn unseen through the haze; *Working the Surface*: a landing craft losing its speed in the air before it needs its engines); what the probes recorded of Titan (rounded ice cobbles on a dark plain of organic grain, the featureless orange sky)
- **Prompt / recipe:** of record in `images.md` § 5h, *Outstanding lore illustrations — 15 October 2026 (Titan, Ligeia and Stillwater)*, the one shape `scripts/image-prompts.js` parses; not duplicated here. Opens as a documentary photograph taken inside the world by a 29th-century camera; a mid-latitude ice plain at noon under an unbroken orange haze, a channel of dark liquid methane, slow fingernail-sized raindrops hanging as short dashes in a long exposure, one small hooded figure in an insulated suit with a sealed face mask, small flat visor and breathing set, no exposed skin and no hard helmet, back to the camera, and a blunt landing craft descending far off with nothing lit; render negatives, and Saturn, a ringed planet, a visible sun, blue sky, liquid water, a spacesuit, a hard helmet and an exposed face refused by name.
- **Notes:** 16:9 landscape, filed through `import-image.ps1 -MaxEdge 1600` at finish strength 1. Triage first for the sky: a ringed planet or a sun in a Titan surface sky fails before anything else is judged; then for the suit (a hard helmet, a bubble visor or any bare skin fails); then for the century. Readings taken for the frame, Fable's under *Who approves whom* and his to overrule, none written to a page: a mid-latitude plain rather than dunes or sea; rounded ice cobbles; the figure and the craft as the two hints, either of which may go. Proposed alt in the § 5h entry, to be corrected to what the filed frame shows.

### ligeia-habitat.jpg — prompt written 15 October 2026, generated and filed 16 October 2026 from variation 1 (#1261)
- **Type:** generation, a new lore illustration for `src/lore/ligeia-habitat.md`
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only ligeia-habitat`
- **Date:** prompt 2026-10-15; generation pending
- **Source:** `src/lore/ligeia-habitat.md` (a self-governing habitat in high orbit around Titan; built by the Imperium as Outer Administration Station Four to full spin gravity; the ring turns at full Earth weight; travel by ascent javelin up and landing craft down), `src/lore/planets/titan.md` (no solar power worth the name; sunlight about a hundredth of Earth's), `story-bible/starship-design.md` sheet H (the derived figures: about 800 m across at 1.5 rpm, a still hub with cradles, a few spokes, radiators on the axis, no collector field), what the probes recorded of Titan from orbit (a featureless orange globe with a thin bluish detached haze at the limb; Saturn's rings edge-on from Titan's orbit)
- **Prompt / recipe:** of record in `images.md` § 5h; not duplicated here. A documentary photograph through the port of a landing craft that has just cast off, a normal lens; one plain matte grey ring about eight hundred metres across with six spokes, a still hub with a few sealed cradles and small steady points, dark radiator slabs on the axis, no window band; the empty gap between ring and moon as the lower middle of the frame; Titan below as a featureless orange haze globe with a bluish limb; thin hard sunlight from one side; Saturn small in the upper corner with its rings edge-on as one thin line; the port's edge in one corner; the 10 October tether negatives, the starship negatives, the stock-ring negatives and a wide-open Saturn refused by name.
- **Notes:** 16:9 landscape, `import-image.ps1 -MaxEdge 1600`, finish strength 1. Triage first for anything joining the ring to the moon (a tether, tower, cable or elevator fails on the 10 October rule), then against sheet H (a window band, a second ring, a cylinder, a collector field or an open-ringed Saturn fails the sheet), then for the century. Readings taken for the frame, Fable's and his to overrule, none written to a page: the ring's size and spin from sheet H; six spokes; fusion power and so no collectors; Saturn in frame, edge-on; one craft nowhere. Record which figures the chosen variation used and which it guessed. Proposed alt in the § 5h entry, to be corrected to what the filed frame shows.

### stillwater-station.jpg — prompt written 15 October 2026, generated and filed 16 October 2026 from variation 2 (#1261)
- **Type:** generation, a new lore illustration for `src/lore/stillwater-station.md`, with one of Dermot's own frames sent as a reference for the look of dark still water only
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned, the reference sent as an image part by the `References:` line; the desktop step is `node scripts/image-prompts.js --generate --only stillwater-station`
- **Date:** prompt 2026-10-15; generation pending
- **Source:** `src/lore/stillwater-station.md` (the shore of Ligeia Mare; the sea flat to within millimetres, mirror-still; insulated rather than pressurised, sealed, run on fusion, the oldest sections resealed and the resealing recorded; the methane draw and the ice cut from the shore; *Two Clocks and a Long Dark*: years in which the sun does not rise; the First Hall inside and kept as a room), `src/lore/planets/titan.md` (insulation and brought air, no pressure suit; station safety as seals and gas monitors), the reference frame *The Column* (`the-column.jpg` on dermotcochran.com), dark still water with a reflection
- **Prompt / recipe:** of record in `images.md` § 5h; not duplicated here. A documentary photograph, a long exposure from a stand in the northern winter dark; the ice shore with a thin rime of frozen hydrocarbon running down to a black mirror-flat methane sea that doubles the station's few lights; squat thick-walled sealed modules joined by heavily sealed links with paler bands where they were resealed, a few deep-set warm ports and small steady working lights; a sealed intake housing at the water's edge with two small hooded figures at work, backs turned, faces not visible; a black starless haze sky; the reference named in the prompt as sent for the water only; render negatives, and Saturn, stars, liquid water, waves, floodlights, flare stacks, a spacesuit and the reference's own stone refused by name.
- **Notes:** 16:9 landscape, `import-image.ps1 -MaxEdge 1600`, finish strength 1. Triage first for the sea (a ripple or a wave fails the name), then for the sky (anything in it fails), then for the suits (a hard helmet or any bare skin fails), then for the reference leaking back (a stone column, a dam or a pier in the water fails), then for the century. Readings taken for the frame, Fable's and his to overrule, none written to a page: the winter dark rather than the orange day; the modules' shape and the sealant bands; the intake housing and the two figures; the hydrocarbon rime, which the polar winter's cold allows. Proposed alt in the § 5h entry, to be corrected to what the filed frame shows.

### stillwater-first-hall.jpg — prompt written 15 October 2026, generated and filed 16 October 2026 from variation 1 (#1261)
- **Type:** generation, a second image for `src/lore/stillwater-station.md`: an **inline illustration for the page body** under the first paragraph of *The First Hall*, on the Prismere and Tír na nÓg precedent, named `<page>-<subject>`; the page's `image:` stays the § 5h exterior. Written later the same day as the three above, on Fable.
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned, no reference sent; the desktop step is `node scripts/image-prompts.js --generate --only stillwater-first-hall`
- **Date:** prompt 2026-10-15; generation pending
- **Source:** `src/lore/stillwater-station.md` (*The First Hall*: the station's first landed module, set down in the 2130s CE, at the centre of the oldest section, *heated and sealed and not used for anything*; the founding charter signed in it and kept there in its original enrolment, whole, with amendments enrolled beside it; *not a shrine*; new crews walked through it on their first rotation down; *The Work*: insulated rather than pressurised, built around methane seeping in from the ground, the oldest sections resealed and each resealing recorded), `src/lore/planets/titan.md` (station safety *chiefly a matter of seals and gas monitors*; inside there is oxygen and the danger is methane), `src/lore/the-enrolled-text.md` (a founding enrolled whole, never edited in place), `images.md` *Conventions* (*The lettering ban cannot beat the scene*: a closed case in place of an open founding), `civilian-dress.md` *Dress by place* (no Titan, Ligeia or Stillwater entry, so the dress is a prompt's choice)
- **Prompt / recipe:** of record in `images.md` § 5j, *Outstanding lore illustrations — 15 October 2026 (Stillwater's First Hall)*, the one shape `scripts/image-prompts.js` parses; not duplicated here. Opens as a documentary photograph taken inside the world by a 29th-century camera, a moderately wide lens from the threshold; a small cramped thick-walled 22nd-century CE module, rounded at every corner, plain pale faded panels whose joins are broad bands of renewed sealant in slightly different shades; one plain fixed table and a few fixed seats; a closed flat matte dark archival case with one smooth seal, lying on a plain shelf, not lit for itself; a small plain sealed gas-monitor housing with one steady indicator flush in the wall; a short row of smooth round studs in the sealant by the hatch; one deep-set round port with pure black beyond it; warm dim light from one long flush slot with no fitting visible; one crew member in the hatchway with their back fully to the camera, in a dull grey-brown coverall with no visible fastening under a slate-blue knitted jumper, soft boots, no hood or mask; render negatives, and altar, candles, shrine, chapel, reverent light, display case, vitrine, relic, pedestal, framed document, parchment, scroll, open book, plaque, flag, stained glass, ISS interior, cable looms, racks, switches, dials, gauges, screens, a visible lamp, stars or a planet in the port, a spacesuit, a hood, a mask, the figure's face and any text refused by name.
- **Notes:** 16:9 landscape, filed through `import-image.ps1 -MaxEdge 1600` at finish strength 1, flat under `src/images/lore/`. Triage first for veneration (a candle, an altar arrangement, a shaft of light on the case, a glass case or anything framed on a wall fails before anything else is judged), then for writing (an open case, a scroll, a parchment or a page fails; the case is shut), then for the century (a dial, a gauge, a switch panel, an ISS rack or a cable loom fails; the sealed housing with one indicator and the studded many-shaded seams are the hint), then for the port (a star, a planet or daylight fails), then for the figure (a face, a hood, a mask or a suit fails). Readings taken for the frame, Fable's under *Who approves whom* and his to overrule, none written to a page: a fixed table and seats as the furniture of a signing, their shape proposed; the sealant bands inside as well as out, and one stud per resealing as the record made visible, strikeable; the monitor housing as the century's hint; the dress as plain, practical, warm, layered and dull-coloured, with no Titan entry in `civilian-dress.md` to follow; short dark hair, no face and so no heritage chosen. Once filed, the page gets the inline line under the first paragraph of *The First Hall*, before *The Hall is not a shrine*, with an alt written from the filed frame; the proposed alt is in the § 5j entry. No sheet in `starship-design.md`, as sheet H's note already says of Stillwater.

### titan-from-orbit.jpg — prompt written 15 October 2026, generated and filed 16 October 2026 from variation 2 (#1261)
- **Type:** generation, a second image for `src/lore/planets/titan.md`: an **inline illustration for the page body** under the haze paragraph of *The World*, on the § 5j and Prismere precedent, named `<page>-<subject>` and filed flat under `src/images/lore/` as the Prismere page's inline frames are; the page's `image:` stays the § 5h surface frame. A **monochrome near-infrared window frame**, since in visible light Titan's surface cannot be seen from orbit at all. Written later the same day as the four above, on Fable.
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned, no reference sent; the desktop step is `node scripts/image-prompts.js --generate --only titan-from-orbit`
- **Date:** prompt 2026-10-15; generation pending
- **Source:** `src/lore/planets/titan.md` (*The World*: the unbroken hydrocarbon haze, noon a dim orange twilight, the low dunes of frozen organic grain that *girdle the equator*, the lakes and seas *around the north pole*, Saturn unseen through the haze; the page's own claim that the sky never clears is what the frame answers), `images.md` § 5h (Titan from orbit in visible light is a featureless orange globe, which the Ligeia prompt draws; 2826 UCSD is 2626 CE, late in Titan's northern winter, which puts the polar cap beyond about 76° N in darkness and the southern reaches of Kraken Mare just inside the lit disc), what is known of Titan in the near-infrared windows (the surface visible only near 0.94, 1.08, 1.28, 1.6, 2.0 and 5 microns and by radar, which is how the first orbiter mapped it; in a window the equatorial dune seas are the darkest ground and Xanadu the brightest; the detail softened by scattering; the detached haze a bright soft rim at the limb; Titan's seasons are Saturn's, so a northern winter on the ground is a northern winter from orbit)
- **Prompt / recipe:** of record in `images.md` § 5k, *Outstanding lore illustrations — 15 October 2026 (Titan's surface from orbit)*, the one shape `scripts/image-prompts.js` parses; not duplicated here. Opens as a monochrome documentary photograph taken inside the world by a 29th-century survey camera on a hull mount through a single narrow filter at the 2-micron methane window; Titan from high orbit filling most of the frame, the top of the disc running off into night; neutral grey throughout, the surface softened everywhere as if through ground glass; broad dark dune belts wrapping the equator, one large bright irregular region against them on one side, mottled mid-grey plains either side, one broad dark irregular sea near the top lying just inside a soft wide terminator, the polar cap beyond it black, a thin pale soft rim of haze at the limb, a black starless sky with nothing made in it; render negatives, and orange, tan, any colour, false colour, a thermal palette, blue oceans, Earth clouds, a cratered Moon-like disc, a sharp limb, a sun glint, Saturn, rings, a station, a craft, a tether, a port frame, grid lines, a scale bar, a reticle, a HUD, a timestamp and any text refused by name.
- **Notes:** 16:9 landscape, filed through `import-image.ps1 -MaxEdge 1600` at finish strength 1, flat under `src/images/lore/`; the finish's saturation step has nothing to ease on a grey frame and leaves it grey. Triage first for colour (any orange, tan or false colour in the disc fails before anything else is judged; a faint cast is a cast), then for sharpness (a crisp, hard-limbed, cratered disc fails; soft is right, do not re-roll for sharpness), then for the ground (blue oceans, white clouds, continents with coastlines or ice caps fail), then for the north (one dark sea just inside the terminator and black beyond is what 2826 UCSD gives; seas in full daylight, a lit pole or a glint draw another season and fail; at the top, or the bottom if the camera looks from the other side), then for anything made or any overlay (Saturn, a ring, a habitat, a craft, a tether, a port edge, a grid, a bar, a reticle or a stamp fails), then for the century, which the 13 October triage's (A) passes for a frame with nothing made in it and which the record says so. Readings taken for the frame, Fable's under *Who approves whom* and his to overrule, none written to a page: the 2-micron window over the others; a hull-mounted survey camera and no port edge; the disc placed with its equator across the lower middle; one sea at the terminator and no glint, which follows from the year (corrected in Opus review from a first draft that read 2826 as CE and withheld the seas); no Saturn and no craft. Once filed, the page gets the inline line under the haze paragraph of *The World*, before *The surface stands at about ninety-four kelvin*, with an alt written from the filed frame; the proposed alt is in the § 5k entry. No sheet in `starship-design.md`: the craft the camera rides is not in frame.

## 2026-10-16 — Tsittak, a lore illustration prompt from the lore page

### tsittak.jpg — prompt written 16 October 2026, generated 16 October 2026; round one re-rolled as a toaster, filed from round 2 variation 2 (#1261)
- **Type:** generation, a new lore illustration for `src/lore/tsittak.md`, filed under `lore/` as the page is
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned, no reference sent; the desktop step is `node scripts/image-prompts.js --generate --only tsittak`
- **Date:** prompt 2026-10-16; generation pending
- **Source:** `src/lore/tsittak.md` (*a lone body of nickel-iron, a few kilometres across, drifting in deep interstellar space with no star within several light-years*; members *left, not built*; *seen from outside, it is a dark body with a lit dock and almost nothing else*; the quiet-zone tunnel beside it, which `lagrange-fold-points.md` says shows nothing until a vessel is inside); real physics for the light (no sunlight; a long exposure set for a dim dock records a dense star field)
- **Prompt / recipe:** of record in `images.md` § 5l, *Outstanding lore illustrations — 16 October 2026 (Tsittak)*, the one shape `scripts/image-prompts.js` parses; not duplicated here. A documentary photograph from a hull mount a few kilometres off: the body as a near-silhouette against a dense, sharp star field and a faint galactic band, lit only by a warm amber recessed dock in one smooth cut face, a few flush lights on its lip, cut faces and channels and nothing bolted on; no sun, no tunnel shown, no vessel, no person; render negatives and a sun, daylight, a portal, a nebula, modules, masts, text refused by name.
- **Notes:** 16:9 landscape, filed through `import-image.ps1 -MaxEdge 1600` at finish strength 1. Triage first for the sun (any daylight on the body fails), then for the sky (stars, not black; no nebula colour, spikes or twinkle), then for the building (cut, not built: anything standing up from the surface fails), then for the tunnel (any visible portal fails), then for anything else in frame (vessel, port edge, person, weapon, text), then for the century. Written by Opus under the 16 October rule in `CLAUDE.md`; readings taken for the frame (the body's shape and surface, the dock as a recess, the camera's distance) are named in the § 5l entry and are Dermot's to overrule. No sheet in `starship-design.md`: the body is a settlement in rock, not a hull.

## 2026-10-15 — Callisto Station, a lore illustration prompt from the lore page

One prompt written on Fable under the 11 October model split, later the same
day as the three Titan prompts, for the fourth new Locations page that
arrived without an image: a station dug into a moon's ice, a place by the
7 October rule. Nothing generated and nothing filed; the page carries no
`image:` until a frame is filed from the desktop. No sheet in
`starship-design.md`: a buried surface station is not a hull, as Stillwater
was not, and sheet H's note says so.

### callisto-station.jpg — prompt written 15 October 2026, generated and filed 16 October 2026 from variation 1 (#1261)
- **Type:** generation, a new lore illustration for `src/lore/callisto-station.md`, filed under `lore/` as the page is
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned, no reference sent; the desktop step is `node scripts/image-prompts.js --generate --only callisto-station`
- **Date:** prompt 2026-10-15; generation pending
- **Source:** `src/lore/callisto-station.md` (*a battered ball of ice and rock with next to no atmosphere*; dug into the crust because *metres of ice are the cheapest shielding there is*; an Imperium patrol post, Outer Administration Station One, now the Survey Corps' depot for the Lagrange survey; *Life on One*: surface hatches, instrument benches, buoy cradles, craft away for months, a posting of months and nobody's home; the last paragraph: Jupiter fixed in the black sky over the hatches, about eight full Moons wide, never rising or setting), `src/lore/rank-insignia-and-uniform.md` (the field shell *a pressure liner first and a garment second*; the Survey Corps' shell deep olive; tabs as shapes read *through a visor*; no name on any uniform), `src/lore/star-rangers-navigation-corps.md` (its image: a buoy as a small plain unmarked cylinder), what is known of Callisto (an ancient saturated cratered surface of dark dusty ice with bright ice on the rims; a black sky, hard shadows, the sun at about four percent of Earth's; Jupiter about four degrees across, banded, its rings invisible to the eye; one face kept to Jupiter)
- **Prompt / recipe:** of record in `images.md` § 5i, *Outstanding lore illustrations — 15 October 2026 (Callisto Station)*, the one shape `scripts/image-prompts.js` parses; not duplicated here. Opens as a documentary photograph taken inside the world by a 29th-century camera; a dark cratered ice plain with bright crater rims under a pure black sky in the long local afternoon, the sun low behind the camera's right shoulder so every shadow is long and hard; Jupiter fixed a third of the way up the sky at one-twentieth of the frame's width, banded cream, tan and rust, gibbous and three-quarters lit on its right, no rings; low mounds of ice shielding over buried modules, a few flush sealed hatches, an open-sided shelter with a cradle holding one small plain cylindrical buoy, three flat dark radiator slabs on edge, a beaten path of boot prints; two small figures with their backs turned in deep olive matte pressure shells with close helmets, small flat visors, compact packs and one or two plain geometric tabs; render negatives, and atmosphere, haze, blue sky, clouds, stars, prominent Jupiter rings, Jupiter rising or setting, a giant Jupiter, domes, towers, tethers, a lunar module, a white Apollo suit, a bubble helmet, weapons, warships, flags and any text refused by name.
- **Notes:** 16:9 landscape, filed through `import-image.ps1 -MaxEdge 1600` at finish strength 1. Triage first for Jupiter (absent, giant, ringed, on the horizon or a full disc fails before anything else is judged), then for the sky (any haze, glow, blue or stars fails), then for the suits (a hood, a mask, a bare face, a white suit or a bubble helmet fails; the shell is olive and the marks are shapes), then for anything military (a turret, a missile, a warship, a flag), then for the century. Readings taken for the frame, Fable's under *Who approves whom* and his to overrule, none written to a page: the station well off the sub-Jovian point so Jupiter stands a third of the way up the sky rather than overhead; the sun low behind the camera's right shoulder, about 120° from the planet, which makes Jupiter gibbous and lit on the right (corrected in Opus review from a noon setting, which on Jupiter's face would show the planet dark); three radiator slabs as the fusion plant's heat (derived, strikeable); no survey craft on a pad, the page having them away and no sheet having given them a shape; the two figures and the sealed hatches as the hints of the century. Proposed alt in the § 5i entry, to be corrected to what the filed frame shows.

## 2026-10-14 — Syra, re-rolled to look both human and somewhat alien

At Dermot's direction of 14 October 2026, verbatim *"Syra should look both
human and somewhat alien at the same time"*. The filed frame of 13 October read
as an ordinary human woman, which its prompt had asked for. The reading taken
and its canon check are in `images.md` § 1 under the entry's 14 October note.

### syra.jpg — filed from run 2 variation 1
- **Type:** generation, replacing the 13 October portrait; the species' look for the Krenyi follows from it (Toval's prompt names Syra's portrait as the kind's reference and is queued to take the same carriers)
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, via `scripts/image-prompts.js --generate --only syra`; run 1 two variations, run 2 four
- **Date:** 14 October 2026
- **Source:** `src/lore/krenyi.md` (*The Nearest Frame Is the Strangest*, *What the Body Notices*, *The Whole Body Is the Instrument*: almost human, no organ to point at, low-light acuity, everything missed at first), `src/characters/syra.md`, `story-bible/species-design.md` (the frame is the point, 30 September). The 13 October portrait cropped to face and shoulders held as `References:` (`story-bible/reference-art/syra-face-2026-10-14.jpg`) so she stays recognisable, with the prompt stating what to change.
- **Prompt / recipe:** the blockquote in `images.md` § 1; the room, light, pose, garment, robustness, trope guard, century negatives and photographic finish of 13 October unchanged. Three carriers of the alien, none an organ: exact symmetry with the eyes set wider and more level; pupils opened to the dark room with the iris ring still showing, matte, no glow; skin of one even unlined tone. The trope guard gained almond eyes, reflective eyes, slit pupils, doll, mannequin and android by name.
- **Notes:** run 1 kept her face exactly; variation 1 opened the pupils to all black, a feature to point at and the black-eyed trope, and variation 2 read as the ordinary lined human again. The prompt was tightened (iris ring visible, white at both sides, eyes noticeably wider, skin unlined, *a degree too regular, as if drawn from an average rather than born*) and run 2's variation 1 picked: still her, symmetrical, wide-set dark eyes with the iris showing, smooth even skin, no placeable age, hands folded. Variation 2 read as startled (whites all round, brows lifted), which a people without deep fear would not show; 3 and 4 drifted back to the lined face. Triage: century reads as the audit's (A), plain with nothing period, nothing made in frame but the garment and the surfaces; identity holds against the 13 October portrait; modesty clears the site's bar; no trope. Nothing readable anywhere. Filed with `import-image.ps1 -MaxEdge 1200`, finish strength 1. Runs kept as `image-out/characters-syra-run1/` and `characters-syra/`. Alt text rewritten from the frame.

## 2026-10-14 — Toval, given the Krenyi carriers

At Dermot's "Toval", taking up the queue note under Syra's entry. The reading is
in `images.md` under Toval's entry, 14 October note.

### toval.jpg — filed from variation 1
- **Type:** generation, replacing the 11 October portrait
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, via `scripts/image-prompts.js --generate --only toval --variations 4`
- **Date:** 14 October 2026
- **Source:** `src/lore/krenyi.md`, `src/characters/toval.md`, Syra's prompt of record and its two 14 October notes (`images.md` § 1)
- **Prompt / recipe:** the blockquote in `images.md`. Two carriers, symmetry with the eyes set wider and more level, and pupils opened with the iris ring showing; born, not made; eyes lifted off-frame so both carriers show; the room dim; his own 11 October frame cropped to the face (`story-bible/reference-art/toval-face-2026-10-14.jpg`) as the reference in place of Syra's portrait; wall sockets negated.
- **Notes:** four variations, all holding his face. Variation 1 picked: frontal, symmetrical, the pupils open with the iris showing, freckled living skin, the collar tab, the pen stopped. Flaws passed: the housing's indicator is lit green where the prompt says unlit, and the paper carries rows of dots that read as figures but not as characters; the room came back lit rather than dim. 2 kept ordinary pupils and drew a present-day office behind; 3 had the strongest eyes but handwriting that reads as numerals and no collar tab; 4 grew a present-day electrical cabinet with a hazard sticker. Triage: century (A) with the two flaws named; identity holds against the 11 October frame; modesty clears the site's bar; no trope. Filed with `import-image.ps1 -MaxEdge 1200`, finish strength 1. Run kept as `image-out/characters-toval-2026-10-14/`. Alt text rewritten from the frame.

## 2026-10-14 — Syra, re-rolled so she does not read as Lucene-9000

At Dermot's direction later the same day, verbatim *"Syra as a Kyeni does not
look like the gynoid Lucene 9000, despite the stillness, symmetry and
composure"*. The morning's frame carried Lucene-9000's ruled tell, perfection.
The reading taken and its canon check are in `images.md` § 1 under the entry's
second 14 October note, and the ruling in `intake-2026-10-14.md`.

### syra.jpg — filed from run 3 variation 3
- **Type:** generation, replacing the morning's portrait of the same day
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, via `scripts/image-prompts.js --generate --only syra --variations 4`, the face reference of the morning unchanged
- **Date:** 14 October 2026
- **Source:** `src/lore/krenyi.md` (*The Whole Body Is the Instrument*), `src/characters/lucene-9000.md` (built to look as human as a machine can be made to look; the 11 October ruling *a real woman whose only tell is perfection*), `src/characters/syra.md`
- **Prompt / recipe:** the blockquote in `images.md` § 1. The even-skin carrier is withdrawn for living skin (pores, colour at cheek and lip, a freckle or two, loose hairs at the hairline) and *born, not made*; the hands rest flat and apart in place of Lucene's clasped hands; the negatives add gynoid, social robot, a flawless or perfected face, porcelain skin and clasped hands. Symmetry, eye set, open pupils, room, light, garment and gaze unchanged.
- **Notes:** four variations, all holding her face. Variation 3 picked: freckles across the brow and cheeks, loose strands at the hairline, living colour, the pupils open with the iris showing, hands flat and apart, nothing perfected. 1 was close but the whites showing round the eyes read a touch startled, which a people without deep fear would not show; 2 grew recessed handles on the wall panels, which read as doors and lockers; 4 drifted back to the smooth, even face the revision removed. Triage: century (A), nothing period in frame; identity holds against the morning's portrait; modesty clears the site's bar; no trope. Filed with `import-image.ps1 -MaxEdge 1200`, finish strength 1. Runs kept as `image-out/characters-syra-run2/` (the morning's) and `characters-syra-run3/`. Alt text rewritten from the frame.

## 2026-10-14 — Tobble, the first portrait of a non-physical member

Dermot's rulings of 14 October 2026 (`intake-2026-10-14.md`), verbatim: *"Non-physical headmates get fantasy-style codex art portraits instead of the photorealistic portraits for the host body of the plural system"*, and, on the register, *"I do like the whimsical fantasy dress styles and lighting as shown in the codex art portrait of Asteria the Sage"*. Tobble's page (`src/characters/tobble.md`, PR #1223, the same day) had no `image:`; this is the first portrait made under the rule, and a companion piece to the first Codex-art image above (3 September).

### tobble.jpg — filed from run 2 variation 2
- **Type:** generation with a reference image for style only
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, 16:9, via `scripts/image-prompts.js --generate --only tobble`; two runs of two variations
- **Date:** 14 October 2026
- **Source:** `src/characters/tobble.md`, the Tobble and inner-world sections of `src/characters/tissadelle-shepherd.md`, `src/glossary/plural-minds.md`, and the `::: pov tobble` block of S05E02C03 (the hillside, the low stone wall with the third course shifted, the gold of a home star, *came up grey, and then gold*, *he sat down in the middle of it, being a cat*). The page's own line, *because that is what I am*.
- **Reference:** `src/images/codex/asteria-the-sage-impression-artwork.jpg`, sent as an image part with the prompt stating that it is a reference for medium, brushwork and handling only and that nothing of its subject, figure, clothing, branches or night is to be taken. Nothing of them was.
- **Prompt / recipe:** the blockquote in `images.md` § 16. A painting, as Asteria's is, because an impression made from a description and not a sitting says so on its surface, and because the ruling asks for it. He wears nothing: the fantasy register is carried by the light (more gold than a sunrise gives), the place and the brushwork, and a garment, a hat or a sword would make him the costumed-animal trope the trope default refuses, a collar or a bell the pet the record exists to correct. Limited palette of pre-dawn grey, blue-black, ginger and one gold; edges dissolving to raw canvas where the description ran out. Filed through `import-image.ps1 -MaxEdge 1200 -Finish 0`: a painting takes no photographic finish.
- **Notes:** run 1 (`image-out/characters-tobble-run1/`) passed the trope and surface checks on both variations (no garment, no collar, a cat and not a cartoon, heavy brushwork, raw canvas at the edges, nothing readable) but both met the viewer's eye squarely, where the prompt asked for a gaze past the viewer and the 28 July guardrail asks for attention off-frame. The gaze clause was tightened (head turned a little to one side, eyes fixed far off beyond the edge of the picture, three-quarter view, *does not meet the viewer's eye at all*) and *eye contact with the viewer or looking into the camera* added to the negative. Run 2 (`image-out/characters-tobble/`): both variations look far off to the right. Variation 2 picked: the farthest gaze and the most composed bearing, a person who has sat down to see what the place will do; the wall runs away from him with its courses catching the first gold, and the blue-black of the hillside's shadow side sits beside Asteria's night blue. Variation 1 is a close second, with a lighter sky and the wall reading more as a heap than a built thing. Triage: trope none (no garment, not bipedal, not cute, not a familiar); bearing a colleague's; century not at issue (an unmortared field wall inside a mind); modesty trivially clear; tone quiet; nothing readable, no signature, no border. The third course's shift is not legible in the filed frame, which the record does not need the picture to assert. Alt text written from the frame; caption names it an impression.

### tobble.jpg — re-rolled with a mantle, filed from run 3 variation 1
- **Type:** generation replacing the frame filed earlier the same day (kept locally as `image-out/tobble-filed-v1.jpg`; the two first runs as `characters-tobble-run1/` and `-run2/`)
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, 16:9, via `scripts/image-prompts.js --generate --only tobble`; one run of two variations
- **Date:** 14 October 2026, the same evening
- **Direction:** Dermot, on seeing the first filing and after a restrained touch of dress had been offered, verbatim: *"Yes something that makes Tobble look like a person in the shape of a cat, or slightly similar to the Smart Pets"*. That overrules the first filing's choice that he wears nothing.
- **Source:** as above, plus `src/glossary/smart-pet.md` for the collar (*a collar that looks like a collar: matte, closed, without a light, a seam or a surface that does anything a stranger could see*).
- **Prompt / recipe:** the blockquote in `images.md` § 16 as revised. One garment, a person's and not a pet's: a short close-fitting mantle of night-blue cloth over the shoulders and the top of the chest, closed at the throat with one small plain silver clasp, its edge worked in silver botanical embroidery, a companion to Asteria's cloak; its low standing collar sits where a certified collar would, so that a stranger could take it for one and be wrong. The negative now names the mantle as the only garment and refuses hat, boots, hooded cloak, cape, sword, belt, trousers, sleeves, tunic, jacket, harness, bell, tag, pendant, medallion, buckle, strap, lead and leash. Everything else unchanged: wall, hillside, pre-dawn grey and the gold, the far-off gaze, the brushwork and the raw canvas edges, finish 0.
- **Notes:** both variations read as a person in the shape of a cat and not a dressed-up pet: the mantle lies light, the body and posture stay wholly a cat's, and nothing hangs from the neck. The clasps were checked at a crop: both are two-part silver cloak clasps, no bell, no tag. Variation 1 picked: its mantle has a low standing collar closed at the throat, so the silhouette at the neck is exactly the one the direction asks for, the thing a stranger could mistake for a Smart Pet's collar; the gaze is far off to the right, the light warm, the composition that of the first filing. Variation 2 is a good second, a short open cape clasped lower at the chest, nearer a cloak in miniature and a step toward costume. Triage: trope none (four-footed, seated, no hands, no boots, no hat, no sword); bearing a colleague's; century not at issue; modesty trivially clear; nothing readable, no signature, no border. Alt text rewritten from the frame.

## 2026-10-14 — A reference bat, and the Prismeri photographed from it (nothing filed)

Dermot's direction of 14 October 2026, verbatim: *"I have no bat photos so a bird would be the nearest or else generate a bat and then re use it"*, on another attempt at photographs of the Prismeri after three text-only rounds (two photographic, one silhouette, 12 October) drew dragons and the three images went to Codex art as the plates of Halle Ostrander. The generated bat was taken over a bird, since a bird's body (feathers, no finger inside the wing, a perch rather than a hang) fights the body the record states. The run's outcome is in `images.md` under the Prismere set's heading (*Photographs from a bat, 14 October 2026*); this is the prompt record.

### prismeri-body-bat-2026-10-14.jpg — reference only, never filed under `src/`
- **Type:** generation, reference art; kept at `story-bible/reference-art/prismeri-body-bat-2026-10-14.jpg` (1600×893) and in no page. A camera can photograph a bat, so under the 3 September rule a bat on the site would have to be one of Dermot's own frames; this one exists only to give the generator a body plan to start from.
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, 16:9, no reference image, through a one-off job script that makes the same Interactions call as `scripts/image-prompts.js` (the bat is not an entry in `images.md`, which that script reads). Two prompts, two variations each; the pick is the second variation of the stretch prompt (the hang with one wing fully open, the finger bones plain, the other wing folded, the head close against the shoulders, a neutral grey-brown background). The other three are kept locally in `image-out/prismeri-photo-from-bat/reference-bat/`.
- **Prompt (the stretch, the pick):**
  > Documentary wildlife photograph of a real fruit bat, a flying fox, hanging head-down from a bare horizontal branch by its hind feet and mid-stretch, with one wing opened fully out to the side and the other still folded against the body, photographed from the side and slightly below in plain overcast daylight against a plain neutral grey-brown background out of focus. The whole animal is in frame with space around it. The open wing shows its structure plainly: the long forearm, the clawed thumb standing free at the wrist, and the long finger bones fanning out through the thin membrane, which is stretched taut and faintly translucent against the sky, its veins visible; the membrane runs back from the last finger to the hind leg. The hind feet grip the branch with long curved toes, the short neck and the head carried close against the shoulders, the fox-like face in profile, eyes open, ears small. Russet and dark brown fur, the membrane dark and leathery. Photographed, not rendered: a real animal, real fur with individual hairs, real skin texture on the membrane, natural colour, a telephoto lens at a moderate distance, shallow depth of field, slight high-ISO grain, the small imperfections a real photograph keeps. Negative: readable text, watermark, caption, lettering of any kind; studio flash, black background, night, flash-lit eyes; cartoon, illustration, 3D render, CGI, plastic sheen, airbrushed, over-smooth surfaces; a cage, bars, a hand, a person, a glove; dragon, fantasy creature, wyvern; both wings spread, flying. Landscape orientation.
- **Prompt (at rest, not picked):** the same with the pose changed to *hanging head-down at rest … the wings partly folded, held loosely about the body rather than wrapped tight, so that the long finger bones inside each wing membrane can be seen running from the wrist down through the membrane, and the clawed thumb stands free at the wrist … the fox-like face turned a little toward the camera*, and without the *both wings spread, flying* negative.
- **Notes:** all four read as photographs. The stretch pick was chosen because it shows what the Prismeri prompts need (the fingers through the membrane, the free thumb, the hang, no tail) in one frame; the rest pose hides the fingers in the fold.

### prismeri-first-wings, prismeri-full-wings, prismeri-lattice-gathering — photographic versions from the bat, two rounds, nothing filed
- **Type:** generation with a reference image for body plan only; the plates of record in `images.md` are unchanged and remain the filed images.
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, 16:9, through the same one-off job script, the bat sent as an image part after the prompt (the `References:` mechanism of `scripts/image-prompts.js`, done by hand because these prompts are not the entries `images.md` carries for the three files). Two rounds of two variations each, the brief's ceiling. Outputs in `image-out/prismeri-photo-from-bat/round1/` and `round2/`, with a sheet at `image-out/prismeri-photo-from-bat/prismeri-photo-from-bat-sheet.jpg`.
- **Source:** `src/lore/prismeri.md` (*A Body for Thin Ground and Thick Air*, the facet band, the hang, the short neck and no tail of 12 October), `src/codex/plates-of-the-prismeri.md` (the three compositions), `story-bible/species-design.md` (the Prismeri section), and the documentary register of the nine filed Prismere world frames (`images.md`, batch 3).
- **References:** `story-bible/reference-art/prismeri-body-bat-2026-10-14.jpg`, with the instruction in the prompt's first sentence: *take the body plan, the proportions and the resting pose from it … and nothing else: not the species, not the face, not the fur or its colour, not the branch, not the setting.*
- **Round 1 prompt, `prismeri-first-wings`:**
  > The attached photograph is a reference for body plan only: take the body plan, the proportions and the resting pose from it (a flier hanging head-down by its hind feet, the wings as forelimbs with the long finger bones running through the membrane, the short neck, the head carried close against the shoulders, no tail), and nothing else: not the species, not the face, not the fur or its colour, not the branch, not the setting. Documentary photograph taken inside the world by a 29th-century camera, available light, 16:9 landscape, on Prismere, a low-gravity world under thick hazy air whose living things are built from glass and crystal rather than wood and chitin: a First Wings Prismeri, an adult of a sapient people, hanging head-down at rest from a shaped ledge of a lumenspire, a tall translucent mineral tower lit faintly from within in amber, in a settlement built into a stand of such spires. The long-toed hind feet take the whole weight; the wings are partly folded about the body, and at the leading edge of each wing three long clawed fingers stand free of the membrane, and these are its hands: both wing-hands are held up before the face, working a small piece of shaped glass. The body is slender and light-boned on a level spine, with no fur anywhere: a smooth, soft, still-hardening exoskeleton in pale grey-violet, faintly segmented, with a dull matte sheen like unfired porcelain, and the gossamer wing membrane so thin it is nearly transparent, the long finger bones showing through it. The head is blunt and rounded, carried close against the shoulders on a short neck: two large dark forward eyes set low on the head, and above them, along the ridge of the skull, a band of small crystalline facets catching the light, which is the only brightness on the body; a hard lipless mouth, a rasping plate behind a hard lip; no ears, no nose, no whiskers, no snout. No tail: the body ends at the hind legs, the membrane running between wing and leg. Photographed from a little below and to one side with a moderate telephoto lens, from a few metres off, the figure the size a person is in a photograph of a person at work, the spire's own amber glow lighting it from behind and the hazy forest glow from below. The air is visibly thick with suspended crystalline dust, the light soft and scattered, the far spires pale in the haze. The settlement is kept and quiet. Photographed, not rendered: real glass and mineral surfaces with dust, frost and fine fractures, haze in the air between the camera and everything far off, high-ISO grain heavy in the shadows of a low-light exposure, a real lens with slight softness toward the corners, a touch under-exposed, muted natural colour, the small imperfections a real photograph keeps. Negative: fur, hair, a furry body, a fox face, a dog face, a snout, a muzzle, whiskers, bat ears, pointed ears, a nose leaf, a tree branch, Earth forest, green leaves, daylight sky; dragon, wyvern, drake, gargoyle, griffin, lizard body, long neck, long tail, tail of any length, horns, spikes, a crest of spines, scales, fangs, teeth; humanoid figure, upright biped, human face or torso, separate arms, fairy, angel, costume, clothing; readable text, lettering, numerals, signage, insignia, logos or written characters of any script anywhere in frame; human figures; oversaturated neon, glowing outlines, fantasy glow, sparkles, magic particles, fairy lights, rainbow sheen, lens flare, god rays. Render negatives: animated film still, creature render, character design, 3D render, CGI, octane render, video-game render, painterly, digital painting, illustration, fantasy art, concept art, matte painting, storybook, plastic sheen, airbrushed, over-smooth surfaces, glossy concept art, expressive cartoon face, big cute eyes. Landscape orientation.
- **Round 1 prompt, `prismeri-full-wings`:** the same opening, with the reference pose read as *one wing opened out to the side in a stretch with the long finger bones running through the membrane and the other wing folded*, and the subject:
  > … a Full Wings Prismeri, an adult of a sapient people, hanging head-down by its hind feet from a high shaped ledge of a lumenspire at dusk, above the haze layer, stretching one wing fully open to the side before flight while the other stays folded against the body. The open wing shows its structure plainly against the pale haze: a long forearm, the three long clawed fingers standing free at the leading edge, which are its hands, and a long outer digit carrying the membrane back to the hind leg, the membrane taut, strong, faintly translucent, in warm grey with the finger bones dark through it. The body is broader and heavier through the shoulders than a First Wings body, on a level spine, with no fur anywhere: a hardened plated exoskeleton in muted gold and deep blue, the plates overlapping like a beetle's but matte, dusty, with fine fractures and wear at their edges. The head is blunt and rounded, carried close against the shoulders on a short neck: two large dark forward eyes set low on the head; above them, along the ridge of the skull, a band of small crystalline facets; and growing back from that same ridge, several long fine motile sensory tendrils, crystalline and pale, drifting in the thick air like strands of glass thread; a hard lipless mouth, no ears, no nose, no whiskers, no snout. No tail: the body ends at the hind legs, the membrane running between wing and leg. Photographed from a little below and to one side with a telephoto lens, from some metres off, the figure in the middle band of the frame with clear space above and below it, back-lit by the last cold light of the sky, so the open membrane glows at its edge and the plating is half in shadow; faint pale straight lines of the Lattice high in the hazy sky behind, barely there. The air visibly thick with suspended crystalline dust. …
  with the same finish and negatives, plus *both wings spread, flying, in flight* and *aurora curtains* in the negative.
- **Round 1 prompt, `prismeri-lattice-gathering`:** the same opening and subject body, and:
  > … two Prismeri, adults of a sapient people, hanging head-down side by side by their hind feet from one long shaped ledge of a lumenspire, their heads at the same height and turned toward each other in conversation, equals, neither above the other, both with their wings folded close about the body as a cloak, the three free clawed fingers of each wing visible at the fold. On the left a First Wings form: slender, light-boned, a smooth soft exoskeleton in pale grey-violet with a dull matte sheen, gossamer wing membrane nearly transparent. On the right a Full Wings form: broader and heavier through the shoulders, hardened matte plating in muted gold and deep blue, and from the ridge of its skull several long fine pale crystalline sensory tendrils drifting in the thick air. Both heads blunt and rounded, carried close against the shoulders on a short neck, with two large dark forward eyes set low and a band of small crystalline facets along the skull ridge; hard lipless mouths; no fur, no ears, no nose, no whiskers, no snout. No tails: each body ends at the hind legs, the membrane running between wing and leg. Photographed from across a gap with a telephoto lens, from several metres off and a little below, both figures whole in frame with space around them, lit from behind and below by the spire's faint amber glow and the hazy glow of the glasswood forest beneath, the far spires pale in the haze; high above, faint pale straight lines of the Lattice in the dusk, barely there. The settlement is kept and quiet. …
  with the same finish and negatives, plus *a perched or crouching figure, standing* and *aurora curtains* in the negative.
- **Round 2:** the three prompts above with four clauses inserted before *Photographed, not rendered* and one block added to the negative, after round 1 drew every figure as a creature render with a modelled, often cute or toothed, face, a cat's whiskers for the Full Wings tendrils, and the Lattice as power lines. The candid clause: *A candid frame from a visiting survey team's record, not a portrait: the camera handheld in low light at a high ISO, the figure only about a third of the frame's height and off-centre, seen from further off through the thick hazy air so its surfaces are softened, back-lit so that most of the body is in shadow with a rim of light along its edges, the head turned away from the camera toward the spire so that no face is read and there is no eye contact; a slight motion softness, heavy grain in the shadows, the exposure a touch under, the colour muted and flat, the corners soft, a dust speck or two in the air between lens and subject.* The face clause: *The head is a smooth blunt helmet of the same exoskeleton as the body, with no mammal muzzle, no fox or dog or seal face, no expression; the mouth is a flat hard plate that does not open or show teeth.* The tendril clause (Full Wings and the pair): *The sensory tendrils grow only from the back of the skull ridge, behind the facet band, and stream back along the line of the spine away from the face; they are never beside the mouth and never read as whiskers.* The added negative: *cute, adorable, a cartoon face, an expressive face, a smile, a grin, open mouth, teeth, crystal teeth, whiskers, cat whiskers, eye contact with the camera; power lines, telegraph wires, cables, contrails, vapour trails, laser beams; sharp studio lighting, clean edges, perfect focus, a posed portrait.* The Lattice lines were taken out of both sky prompts (*the hazy sky behind empty and pale*), and the pair are *both seen in profile or three-quarter from behind so that neither face is toward the camera*.
- **Notes:** the verdicts, by the two tests set for the run. **Levril test (no outline of neck, head and tail, no bat-wing spars on a lizard body): all twelve pass.** Every figure hangs by its hind feet, the head sits close against the shoulders, and no frame has a tail; the bat held the outline the plates were made to hold. Round 2's `full-wings` 2 and `lattice-gathering` 2 grew reptilian heads with teeth, and its `lattice-gathering` 1 crouches its First Wings like a gargoyle, which are faults of the head and the pose rather than of the outline, but worth naming as the direction the generator leans once the dragon is shut out. **Photograph test (a photograph rather than a render): none passes cleanly.** Round 1: `first-wings` 1 the nearest (haze, a real-looking lens, an animated-film face), `first-wings` 2 a smooth render with crystal teeth, `full-wings` 1 a render with cat's whiskers, `full-wings` 2 a render with the Lattice as power lines, `lattice-gathering` 1 a render, `lattice-gathering` 2 a painting. Round 2: `full-wings` 1 the nearest of all twelve (plain hazy sky, dust in the air, a telephoto's softness, the body reading as a photographed thing; a lizard's head), `first-wings` 1 next (haze, a candid pose, the face turned away; the skin still a render's), the other four renders. **Earth-bat test: none reads simply as a bat.** The exoskeleton or plate, the facet band and the absence of fur, ears and muzzle carry every figure off the reference, while the wing's finger structure is the bat's throughout, which is where the convergence was meant to sit. **Best one or two:** round 2 `full-wings` 1, then round 2 `first-wings` 1. Nothing filed; the plates stand; where a photograph of the people would go, if one passed, is Dermot's decision and is not put to him here.

## 2026-10-14 — The Prismeri as Halle Ostrander's finished paintings (two filed, the First Wings on its plate)

Dermot's direction of 14 October 2026, verbatim: *"If we must have codex art for Prismeri then it needs to be closer to a photograph as much as possible"*. The plates of *Plates of the Prismeri* are approved, linked Codex art, so they are superseded on the Prismeri page and never overwritten; three new entries in `images.md` (section 5a, after `prismere-root-mat-network`) ask for the same naturalist's finished paintings, worked up afterwards from the field sheets as hyperreal natural-history oils on panel. The outcome and the reasons are in `images.md` under the Prismere set's heading (*Finished paintings, 14 October 2026*); this is the run record.

### prismeri-full-wings-painting.jpg — filed from round 2 variation 2
- **Type:** generation, Codex art carried on a lore page (Halle Ostrander's painting after Plate II); `src/images/lore/prismeri-full-wings-painting.jpg`, 1600×893, the hero and second inline image of `src/lore/prismeri.md`.
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, 16:9, through `node scripts/image-prompts.js --generate --only prismeri-first-wings-painting,prismeri-full-wings-painting,prismeri-lattice-gathering-painting`, two variations per round, two rounds. Filed with `scripts/import-image.ps1 -MaxEdge 1600 -Finish 0` (a painting, not a photograph).
- **References:** `story-bible/reference-art/prismeri-body-bat-2026-10-14.jpg`, sent as an image part through the entry's `References:` line, for body plan and proportions only (the prompt's first sentence; this entry also excludes the hanging pose, since the figure flies).
- **Prompt:** the entry of record in `images.md`, as revised for round 2 (heavy-lidded eyes, a flush facet band, a closed mouth, a head closed like a helmet, corner signatures and rodent faces negated).

### prismeri-lattice-gathering-painting.jpg — filed from round 2 variation 1
- **Type:** generation, Codex art carried on a lore page (Ostrander's painting after Plate III); `src/images/lore/prismeri-lattice-gathering-painting.jpg`, 1600×893, the third inline image of `src/lore/prismeri.md`.
- **Tool:** as above, in the same runs. Filed at `-Finish 0`.
- **References:** the same bat, for body plan, proportions and the hanging pose only.
- **Prompt:** the entry of record in `images.md`, as revised for round 2 (the same face changes, and the pair in profile to each other).

### prismeri-first-wings-painting.jpg — not filed; the First Wings stays on Plate I
- **Tool and references:** as above, in the same runs, with the same bat for body plan and hanging pose.
- **Outcome:** all four variations painted a grin of crystal teeth, round 2 under a mouth closed to a line by name, and one per round carried a painted signature in a corner. Fails the people test and the tone rule; nothing filed.

All twelve variations are kept locally in `image-out/prismeri-paintings/round1/` and `round2/`, never committed.

### prismeri-first-wings-painting.jpg — third round, one round only, not filed; handed to Fable
- **Direction:** Dermot's option A, 14 October 2026: keep the two filed paintings and try the First Wings once more so the page matches. The same evening, a change of plan: difficult images may go to Fable, so a failed round stops after one round, with the findings recorded here for the next attempt.
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, 16:9, through `node scripts/image-prompts.js --generate --only prismeri-first-wings-painting`, two variations.
- **References:** `story-bible/reference-art/prismeri-body-bat-2026-10-14.jpg` (body plan and hanging pose only) and `src/images/lore/prismeri-lattice-gathering-painting.jpg` (medium, light and handling only, so the three paintings read as one set).
- **Prompt:** the entry of record in `images.md`, revised for this round: viewpoint above and behind, the head turned away and bent to the glass, the mouth not visible, three countable free clawed fingers on each hand, the earlier face, fur, ear, signature, neck and tail negatives kept.
- **Outcome:** both variations fail; nothing filed, Plate I stays on the Prismeri page. Variation 1 (rear view, head bent to the glass) matches the filed pair's register, but the facet band is painted as a ring of crystal teeth round the back of the skull, each hand has four clawed digits instead of three, and there is a signature in the lower right corner. Variation 2 shows the face from the side and below, with the facet band painted where the mouth would be, as a toothed grin. The finding: across all three rounds, the First Wings grin is the facet band. Whenever the band is described as a row of small crystals near the face, the generator draws it as teeth. The next attempt should describe it as something no mouth resembles, or leave it out of a rear view. Both variations are kept locally in `image-out/prismeri-paintings/round3-first-wings/`.

### prismeri-first-wings-painting.jpg — filed from round 5 variation 1 (rounds 4 to 6, Fable)
- **Direction:** Dermot's rule the same evening that difficult images go to Fable; the third round's findings above were the brief.
- **Type:** generation, Codex art carried on a lore page (Ostrander's painting after Plate I); `src/images/lore/prismeri-first-wings-painting.jpg`, 1600×893, the first inline image of `src/lore/prismeri.md`. Filed with `scripts/import-image.ps1 -MaxEdge 1600 -Finish 0`.
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, 16:9, through `node scripts/image-prompts.js --generate --only prismeri-first-wings-painting`, two variations per round, three rounds.
- **References:** `story-bible/reference-art/prismeri-body-bat-2026-10-14.jpg` (body plan and hanging pose only) and `src/images/lore/prismeri-lattice-gathering-painting.jpg` (medium, light and handling only), unchanged from round 3.
- **Prompt:** the entry of record in `images.md`, as revised for rounds 4 to 6 (its two revision notes of that date). Round 4 ran the facet-band change alone; rounds 5 and 6 ran the full revision, round 6 unchanged from round 5.
- **Outcome:** round 4, no teeth in either variation for the first time, both failing on four-digit hands, variation 1 also on a copied open wing, two prisms and the copied shell, variation 2 on a heavy body filling the frame and conifers. Round 5, variation 1 filed (view from above and behind, seam along the crown, no face, wings folded, hanging by the feet from the spire's ledges; the hands three or four fingers, not plainly three, passed as a lesser flaw than the filed Full Wings' thumb); variation 2 frontal under a flat ledge with the shell copied in. Round 6, variation 1 crouching upright on a ledge with a signature lower right, variation 2 frontal with the shell and dead twig trees. The whole account is in `images.md` under *The First Wings painting filed, 14 October 2026*. All six variations are kept locally in `image-out/prismeri-paintings/round4-first-wings/`, `round5-first-wings/` and `round6-first-wings/`, never committed.

### prismeri-first-wings-painting-2.jpg — filed from round 7 variation 1 (Fable); supersedes the round-5 file
- **Direction:** Dermot, after seeing the round-5 filing: one more round. Opus's review of the filed pick gave the brief (humanoid drift, no match to the pair, the hand count, a possible tail).
- **Type:** generation, Codex art carried on a lore page (Ostrander's painting after Plate I); `src/images/lore/prismeri-first-wings-painting-2.jpg`, 1600×893, the first inline image of `src/lore/prismeri.md`, a new file under the content-locking rule. Filed with `scripts/import-image.ps1 -MaxEdge 1600 -Finish 0`. The round-5 file `prismeri-first-wings-painting.jpg` is removed from `src/images/lore/` in the same change, since the validator fails on an image no page references; it stays in git history.
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, 16:9, through `node scripts/image-prompts.js --generate --only prismeri-first-wings-painting-2`, two variations, one round.
- **References:** `story-bible/reference-art/prismeri-first-wings-lattice-crop-2026-10-14.jpg` (the left figure of the approved `prismeri-lattice-gathering-painting.jpg`, box 360,70 to 800,760 of the 1600×893 file; the body to paint), `story-bible/reference-art/prismeri-body-bat-2026-10-14.jpg` (the part-open wing pose only) and `src/images/lore/prismeri-lattice-gathering-painting.jpg` (medium, light and handling only).
- **Prompt:** the new entry of record in `images.md`, written for this round.
- **Outcome:** variation 1 filed (the pair's bat-like body, near wing part open with the membrane fully shown, face in profile bent to the prism with no teeth and the seam along the crown, a plain Y of three fingers on the near hand and a three-pronged silhouette through the glass on the far one, nothing trailing, no signature; flaws passed: a small pit on the side of the head, more toes on the feet than fingers on the hands). Variation 2 repeated the lattice composition under a flat ledge with the shell and a beaded brow band, not picked. Both kept locally in `image-out/prismeri-paintings/round7-first-wings/`.

## 2026-10-16 — The thirteen Codex-author portraits, prompts written (Fable), nothing generated

Thirteen prompts written on Fable under the 11 October model split, for the
ready list of `images.md` § 17: the twenty-two Codex authors whose pages
landed on 10 October, less the fourteen kept bare under Dermot's Option A of
16 October, five of whom gained a species line the same day and so moved to
the ready list. The prompts sit under § 17's numbered list in the one shape
`scripts/image-prompts.js` parses, and `--list` reports all thirteen keys as
pending. Nothing generated and nothing filed; no page carries an `image:`
until a frame is filed from the desktop. Shared across the thirteen: a
documentary photograph taken inside the world by a 29th-century camera, 16:9
landscape at 1200×675 through `import-image.ps1 -MaxEdge 1200` at finish
strength 1; the 28 July guardrails, the modesty bar and the standing negative
inside every blockquote; render negatives; each human face chosen against the
filed cast under the 13 October identity rule, with the choice recorded in the
entry; one face per character, the page's second person out of frame where a
scene has one. Readings taken for each frame are Fable's under *Who approves
whom*, Dermot's to overrule, and none is written to a page.

### marlow-calloway.jpg and perrin-ashgrove.jpg — prompts written 16 October 2026, GENERATED AND FILED 16 October 2026
- **Type:** generation, a pair of new portraits written in one pass so the two read as one band: the same dock-adjacent common room, evening and light, each frame holding the other's instrument at its edge and never the other's face
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations each, planned; the desktop step is `node scripts/image-prompts.js --generate --only marlow-calloway,perrin-ashgrove`
- **Date:** prompts 2026-10-16; generation pending
- **Source:** `src/characters/marlow-calloway.md`, `src/characters/perrin-ashgrove.md`, `src/glossary/slipwave.md` (strings and percussion, the dock common rooms, Officers with the musician specialization), `src/lore/star-rangers-music-corps.md`, `src/lore/rank-insignia-and-uniform.md` (the shell, a Field Officer's four bars, no name on clothing; no shell colour recorded for the Music Corps), `src/lore/star-rangers-command-hierarchy.md` (the bar count)
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. The Rangers' shell in a dark muted plum-grey with the tab read as a mark and not a count, the instruments given by shape (a shallow-bodied fretted stringed instrument; hand drums as skins over rims) with the stage furniture of our century negated by name, the deck curving up as the hint.
- **Notes:** triage the stage first (amplifier, microphone, cable, drum kit), then the second face, then the uniform, then the pair against each other. Readings: the date 2826 as the ready list gives it with the frame wide enough that the Officer's tab count cannot be read, so the picture asserts neither rank in that year nor a later one; the shell colour; the faces (Marlow tall and lean, dark brown skin, close-cropped black hair; Perrin broad, light olive skin, dark curly hair tied back, a short beard).

### vhen.jpg — prompt written 16 October 2026; three whole-body rounds drew an elephant; round 4, a close frame, GENERATED AND FILED 16 October 2026 (variation 2)
- **Type:** generation, a new portrait of the record's only named Ovruhn, a non-human body from `src/lore/ovruhn.md`
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only vhen`
- **Date:** prompt 2026-10-16; generation pending
- **Source:** `src/lore/ovruhn.md` (the body: a broad, deep-chested quadruped mass, a fan of handling tendrils, no face, flank hide as the ear, small mild eyes; Thavren's shadowless scattered light and the stone's-throw visibility; chorus-keeping; *The Thing Outsiders Get Wrong*), `src/characters/vhen.md`, `story-bible/civilian-dress.md` *Ovruhn* (nothing worn off duty; the proposed hide tones)
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. The body from its page, nothing worn, on a ground of worked bedrock under the haze, the rest of the chorus as unresolved masses beyond focus; the elephant, rhinoceros, hippopotamus, bull, bear, octopus and hybrid refused by name under the 12 October likeness rule.
- **Notes:** triage the Earth animal first (trunk, tusks, horns, a face, a neck, suckers, a stitched hybrid), then the light (any shadow, sun or blue sky fails the page), then a second body in focus, then tone. Readings: a warm grey-brown matte hide; a dozen or so tendrils in two ranks; a low stone kerb for scale; undated, the record's present.

### ilvane.jpg — prompt written 16 October 2026, GENERATED AND FILED 16 October 2026
- **Type:** generation, a new portrait of the record's third Krenyi, the kind carried by Syra's filed portrait
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only ilvane`
- **Date:** prompt 2026-10-16; generation pending
- **Source:** `src/characters/ilvane.md` (boundary analyst, 2825 UCSD, a certification she signs and knows), `src/lore/krenyi.md`, `images.md` § 1 (Syra's entry as revised 14 October: symmetry, eye set, open pupils, born not made; Toval's entry for the queue note), `src/lore/rank-insignia-and-uniform.md` (the Survey shell in deep olive, the tab, the certification plate)
- **References:** `src/images/characters/syra.jpg`, for the kind's look only, with the sentence in the prompt that takes nothing else from it
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. A dim instrument gallery of an unnamed boundary post, one viewport onto darkness, a certification sheet in both hands, eyes lifted to the glass so both show the carriers; the grey alien, the elf and the gynoid refused by name.
- **Notes:** triage the kind first (an ordinary human woman, or a grey alien, fails), then identity against Syra's and Toval's filed frames, then the room (screens, dials, cables, stars in the window), then the uniform. Readings: medium-brown skin, black hair cropped very short, an oval face with a long jaw, slight build; the tab's count not given, since her page gives no rank.

### breanainn-o-se.jpg — prompt written 16 October 2026, GENERATED AND FILED 16 October 2026
- **Type:** generation, a new portrait
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only breanainn-o-se`
- **Date:** prompt 2026-10-16; generation pending
- **Source:** `src/characters/breanainn-o-se.md` (Ridgemoot chaplain serving Threshold Station, 2831 UCSD, the caution), `src/codex/the-warm-edge-correlation.md`, `src/lore/threshold-station.md` and its filed illustration (the sea wall, the docks' low dark line with three working lights), `story-bible/civilian-dress.md` *Threshold Station* (weatherproof layers; no chaplain's dress on record), `src/lore/the-setts-of-aethelrock.md` (a sett is a clan's, and his clan is not on file)
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. The sea wall at dusk, hands in pockets, looking out over the thin water off Dock Seven with nothing shown in it; clerical dress, the cross and the harbour's present-day furniture refused by name.
- **Notes:** triage the clerical collar and cross first, then the harbour (crane, container, boat, car, lamp post), then anything shown in the water, then the face against Fintan's and Daire's. Readings: late fifties; pale weathered skin, a short grey beard from a dark red, heavy brows; his heritage read as the Union's Irish-descended founders', which the record does not state.

### aoibheann-ni-mheara.jpg — prompt written 16 October 2026, GENERATED AND FILED 16 October 2026
- **Type:** generation, a new portrait
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only aoibheann-ni-mheara`
- **Date:** prompt 2026-10-16; generation pending
- **Source:** `src/characters/aoibheann-ni-mheara.md` (Keeper of the Rolls; every line checkable against ground someone can walk), `src/codex/the-courtesy-that-was-withdrawn.md`, `src/lore/planets/tir-na-nog.md` (towns that could pass as pre-industrial, smart-weave, drones at the edge of notice), `story-bible/civilian-dress.md` *Tír na nÓg*
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. A deep window of a plain limewashed registry room, a closed dark-bound volume under her arm, looking out at a dry-stone field boundary and a cut field, one plain grey drone high and still over the land as the hint; the Victorian clerk's furniture refused by name.
- **Notes:** triage the registry first (gilt ledgers, quill, wax seal, spectacles), then the hint (a frame without the drone, or with a lit quadcopter or a helicopter, is not filed), then the view (tractor, wire fence, road, power line), then the face. Readings: 2826 as the ready list gives it, her tenure being undated; sixties; pale skin, white hair pinned low, a long narrow face, grey eyes; heritage as Ó Sé's, with the same caveat; a deep green wool dress and grey wrap.

### sile-ni-bhriain.jpg — prompt written 16 October 2026, GENERATED AND FILED 16 October 2026
- **Type:** generation, a new portrait
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only sile-ni-bhriain`
- **Date:** prompt 2026-10-16; generation pending
- **Source:** `src/characters/sile-ni-bhriain.md` (teller for the reader-schools, 2823 UCSD printing; no pronoun given), `src/codex/the-legend-of-saint-aoife.md`, `src/lore/planets/aethelrock.md` (granite, crops under glass, technology in plain sight), `story-bible/civilian-dress.md` *Aethelrock*, `src/lore/the-setts-of-aethelrock.md` (no sett, since the clan is not on file)
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. A granite schoolroom, the teller on a low bench with a closed book on the knee and one hand lifted mid-telling to children out of frame, a sealed heating conduit along the wall and a glass growing house under a bare ridge through the window; the Victorian schoolroom and the bardic costume refused by name.
- **Notes:** triage the schoolroom first (blackboard, slates, desks in rows, a stove, a candle), then the sett and the costume, then a child's face, then the conduit (a radiator or flanged pipe, or none, is no hint), then the face. Readings: fifties; stocky, a weathered square face, cropped grey-streaked brown hair; **written without a pronoun**, since the page gives none, the generator left the choice and the alt to follow the filed frame; heritage as the other Union entries', with the same caveat.

### mireille-achterberg.jpg — prompt written 16 October 2026, GENERATED AND FILED 16 October 2026
- **Type:** generation, a new portrait
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only mireille-achterberg`
- **Date:** prompt 2026-10-16; generation pending
- **Source:** `src/characters/mireille-achterberg.md` (no world, no date, the Unit's seat not stated; the paper's turning point), `src/codex/krenyi-longevity-repair-agent.md`, `story-bible/civilian-dress.md` *What follows, by setting* (the habitat professional's default)
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. A plain windowless working room, a single sealed sample housing closed on a bare table, her hands still and her gaze down and aside, the moment after the result; the laboratory of our century refused by name.
- **Notes:** triage the laboratory first (glassware, a white coat, a microscope, racks), then the housing (a hard case or a tablet is no hint), then any window (a view asserts a place the record does not hold), then the face. Readings: the record's present with no year named; late fifties; South Asian heritage, deep brown skin, grey-streaked black hair cut short, chosen against the filed cast since the page states none; charcoal band-collared jacket.

### senna-okoye.jpg and kwame-reyes-osei.jpg — prompts written 16 October 2026, GENERATED AND FILED 16 October 2026
- **Type:** generation, a pair of new portraits written in one pass as companion frames: the same Commission on Earth, the same plain high stone room and tall window, 2701 and 2704 UCSD, late summer and winter, seated and standing, so they read as companions without asserting that the two met (the record does not say)
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations each, planned; the desktop step is `node scripts/image-prompts.js --generate --only senna-okoye,kwame-reyes-osei`
- **Date:** prompts 2026-10-16; generation pending
- **Source:** `src/characters/senna-okoye.md` and `src/characters/kwame-reyes-osei.md` (both Historical; a doctrinal desk, not a bench; imperatives and lists), `src/codex/exploration-budget-doctrine.md`, `src/codex/redline-protocol.md`, `src/lore/ai-safety-kernel.md` (the Commission; *humans is who the drafters had met*), `src/lore/solar-system-concord.md` (a Concord body, no fleet), `story-bible/civilian-dress.md` *Earth*
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. Each opens as a documentary photograph and *a reconstruction of a scene from the past* under the 11 October restatement; a single sheet and a pen; the window onto temperate green country and a river with no landmark, since the Commission's seat is not on record; both our century's office and the record's present furniture refused by name, and for Reyes-Osei the military look that *containment* draws.
- **Notes:** History, so exempt from the hint-of-the-century rule, and each entry says so; the period-tech negatives are for a 28th-century Earth that must read as neither ours nor the 29th century's. Triage the office first, then the window, then the dress (and for Reyes-Osei any epaulette or military cut), then the two faces against each other. Readings: Okoye forties, West African heritage, dark brown skin, short natural twists, a rust-red tunic; Reyes-Osei fifties, mixed West African and Latin American heritage, medium-brown skin, close-cropped grey hair and moustache, a slate-blue jacket; both heritages chosen against the filed cast since the pages state only *Earth*.

### ione-marrec.jpg — prompt written 16 October 2026, GENERATED AND FILED 16 October 2026
- **Type:** generation, a new portrait
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only ione-marrec`
- **Date:** prompt 2026-10-16; generation pending
- **Source:** `src/characters/ione-marrec.md` (the back of the Eden commissioning hall, 2831 UCSD, the one scene the record gives her), `src/codex/the-captain-who-drove-furiously.md`, `src/lore/fellowship-of-light.md`, `story-bible/civilian-dress.md` *Devotional houses* and *Eden and the Compact habitats*
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. The hall half-emptied after the commissioning, the Sister alone at the back in a plain long grey-blue robe with the hood down, looking down and aside to where the cadet stood, Eden's terraces curving up through the far window as the hint; the nun's habit, the cross and the hall's stage furniture refused by name.
- **Notes:** triage the habit first (wimple, veil, cross, cowl up), then the hall (pews, altar, candles, podium, folding chairs), then any other face in frame (the cadet and the cohort are out of it), then the window (no terraces, or stars, is no hint), then the face. Readings: fifties; Mediterranean heritage, olive-brown skin, a long face with a high-bridged nose, grey-streaked dark hair cropped close, chosen against the filed cast since the page states none; the robe's colour and cut, since no page dresses a Sister.

### meret-kolhaas.jpg — prompt written 16 October 2026, GENERATED AND FILED 16 October 2026
- **Type:** generation, a new portrait
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only meret-kolhaas`
- **Date:** prompt 2026-10-16; generation pending
- **Source:** `src/characters/meret-kolhaas.md` (Loss Adjuster, Threshold circuit, 2831 UCSD, thirty-one years in the work; the word in the box), `src/codex/dock-seven-loss-adjustment.md`, `src/lore/threshold-station.md` (harbour weather), `story-bible/civilian-dress.md` *Threshold Station* (civilian; the Guild is not chartered to the Rangers and no page gives it a mark)
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. A small kept claims office, not a dock, since she was not there; a single ruled form, the pen just lifted from the box near its foot, the word beyond focus; rain on the window and two moored hulls dim on grey water; the insurance office of our century refused by name.
- **Notes:** triage the office first (computer, binders, stamp, calculator, mug), then the box (a readable word asserts the form's wording and fails), then the window (container, crane, van, a glow on the water), then the face against Tare's and the filed Threshold portraits. Readings: late fifties; Northern European heritage, fair ruddy skin, a square face, pale blue eyes, iron-grey hair cropped short, chosen against the filed cast since the page states none; a dark brown band-collared jacket.

### ottoline-farr.jpg — prompt written 16 October 2026, GENERATED AND FILED 16 October 2026
- **Type:** generation, a new portrait
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only ottoline-farr`
- **Date:** prompt 2026-10-16; generation pending
- **Source:** `src/characters/ottoline-farr.md` (the record places her nowhere; the 2826 UCSD annotation its only date; the welfare-specialist method; her amusement in interview), `src/codex/bramble-and-the-backwards-key.md`, `src/glossary/smart-pet.md`, `story-bible/civilian-dress.md` (the habitat professional's default)
- **Prompt / recipe:** of record in `images.md` § 17; not duplicated here. A small windowless room, a writer at a plain table with a pen on a sheet and one hand on a short stack of thin plain-covered volumes in muted single colours, a private half-smile down at the page; no ferret, no illustrated cover, no window, each refused by name.
- **Notes:** triage the animal and the picture book first (a ferret, a plush toy or an illustrated cover fails), then the desk (typewriter, computer, lamp, mug), then any window (a view asserts a place), then the face against Kate Ukrainka's filed frame, the Codex's other Smart Pet author. Readings: forties; East Asian heritage, a round face, black hair in a loose low knot, small build, chosen against the filed cast since the page states none; an oatmeal high-necked jumper; no pet in frame, since the page says she writes one and not that she keeps one.

## 2026-10-17 — Arashobal's portrait, prompt written (Fable), nothing generated

One prompt written on Fable under the 11 October model split, for the
character page rewritten the same day (`src/characters/arashobal.md`: a
Chief Ranger of the Survey Corps who ran general operations beside Chief
Pilot Wender, later chief of staff aboard High Captain Wender's command
ship). It sits in `images.md` as § 18, in the one shape
`scripts/image-prompts.js` parses, and `--list` reports `arashobal` as
pending. Nothing generated and nothing filed; the page carries no `image:`
until a frame is filed from the desktop. The form is § 17's: a documentary
photograph taken inside the world by a 29th-century camera, 16:9 landscape
at 1200×675 through `import-image.ps1 -MaxEdge 1200` at finish strength 1;
the 28 July guardrails, the modesty bar and the standing negative inside the
blockquote; render negatives; the kind carried by Syra's filed portrait as
Ilvane's was, with the identity rule applied against every Krenyi filed and
against Lucene-9000; one face in frame. Readings taken are Fable's under *Who
approves whom*, Dermot's to overrule, and none is written to the page.

### arashobal.jpg — prompt written 17 October 2026, GENERATED AND FILED 17 October 2026
- **Type:** generation, a new portrait of the record's fourth Krenyi, the kind carried by Syra's filed portrait; a Ranger on duty, so in uniform
- **Tool:** Gemini `gemini-3.1-flash-image`, 2K, two variations, planned; the desktop step is `node scripts/image-prompts.js --generate --only arashobal`
- **Date:** prompt 2026-10-17; generation pending
- **Source:** `src/characters/arashobal.md` (Chief Ranger, Survey Corps, general operations; chief of staff aboard the command ship; older than Syra by her people's reckoning; *no wasted gesture*; speaks at the listener's speed; *keeping the terms stated*), `src/lore/krenyi.md` (long-lived without apparent degradation, the stillness, the body as the instrument), `images.md` § 1 (Syra's entry as revised 14 October: symmetry, eye set, open pupils with the iris ring, living skin, born not made, never the gynoid Lucene-9000; the trope negatives), § 8 (Toval) and § 17 (Ilvane, whose prompt shape this follows), `src/lore/rank-insignia-and-uniform.md` (the Survey shell in deep olive, the Chief's bar-and-ring tab, shapes not words, no name on clothing, decorations a separate mark), `src/lore/star-rangers-command-hierarchy.md` (the tab colour keyed to track: general operations in slate blue; the command ship as a headquarters that moves), `src/characters/karla-wender.md` (High Captain by Season 5, 2831 UCSD)
- **References:** `src/images/characters/syra.jpg`, for the kind's look only, with the sentence in the prompt that takes nothing else from it
- **Prompt / recipe:** of record in `images.md` § 18; not duplicated here. A long low dim staff compartment aboard the command ship, plain matte pale-grey composite with everything stowed behind flush panels and no viewport; standing three-quarters at a chest-high worktable with several pale sheets and one sealed housing with a single unlit indicator, hands still and apart on the table's edge, face turned to a staff officer out of frame so both eyes show the carriers; the deep olive Survey shell with one plain-finished tab carrying a bar and a ring on a slate-blue insert and nothing else; the grey alien, the elf, the gynoid, the admiral's bridge, the medals, the braid and the adviser at a commander's shoulder refused by name.
- **Negatives (the additions for this post, beside Syra's and Ilvane's guard):** wrinkles, grey hair, white hair, an elderly woman, a grandmother, stooped, frail, a fashion model, a young glamorous woman, make-up, a pointing finger, a raised hand; a plait, a braid, a bun, military braid, gold cord, aiguillette, medals, ribbons, decorations, insignia on the chest, a peaked cap, a military dress uniform; a starship bridge, a captain's chair, a command chair, a viewscreen, a star map, a holographic table, a shadowy adviser at a commander's shoulder, a second face in frame, a figure in the background; a window, a viewport, stars, a planet, a nebula.
- **Notes:** triage the kind first (an ordinary human woman, or a grey alien, fails), then identity against Syra's, Ilvane's and Toval's filed frames and Lucene-9000's (dark hair drawn back or a seated pose at a table leaking back fails), then the post (bridge, viewscreen, hologram, star map, a window with stars, a second figure), then the uniform (medals, braid, paired tabs, chest badge, dress uniform), then the age (frail or elderly, or model-young). **Readings, each recorded so the face is nobody else's:** a woman, since the page says *she*; the year 2831 UCSD, Season 5's year, since the page dates neither the move nor the frame; older in bearing and of no placeable age, carried as weight (a fuller-set face, settled authority, the one being listened to) and never as wear, since the kind does not degrade; light warm-olive skin (Syra pale, Ilvane medium-brown); straight ash-brown hair between fair and brown, cut level at the jaw and tucked behind the ears (Syra and Lucene-9000 dark and drawn back, Ilvane cropped to the skull, Toval short and dark; not a plait, which is the military braid refused); a broad face with wide high cheekbones, a wide brow and a short square jaw (Ilvane oval with a long jaw); tall and solidly built, square through the shoulders (Ilvane slight); the iris ring dark grey; standing, since Syra and Lucene-9000 sit at a table; the corps badge left unspecified as Ilvane's and Toval's entries leave it, since a second device draws a chest badge; no decorations, since medals on a chief of staff are the admiral the record refuses.
- **Run:** three rounds of two on Gemini `gemini-3.1-flash-image`, 2K, 17 October 2026, on Opus. Round 1 and 2 drew the frame too wide for the Krenyi carriers, and each round's first variation read as a shop dummy (Dermot); round 2 variation 2 carried the eyes but drew two collar tabs. Round 3 used that face as the reference (`story-bible/reference-art/arashobal-face-2026-10-17.jpg`) and asked for one tab; variation 1 filed at his pick, cropped to 16:9 to remove a foreground figure. The tab shows a ring only.

## 2026-10-19 — *The Elves of Wood, Sky and Water*, codex title card

No generator prompt: a deterministic card from `make-codex-cover.ps1`, in the
house template, for the Codex entry filed at Dermot's *2 A* the same evening.
The serif line carries the publisher and the capitals line the author, as on
*Redline Protocol*. The word *elves* on the card is the title's, which is the
author's; the record never adopts it. Checked at full size after drawing. The
author's page carries no portrait, since the record says nothing of the body.

```powershell
.\scripts\make-codex-cover.ps1 -TitleLines "THE ELVES OF","WOOD, SKY AND WATER" -Category "CULTURAL RECORD" -Subtitle "A traveller's sorting, with the desk's note" -Institution "Westminster Ring Press, New London" -Author "ROSAMUND HALLAM" -Stamp "FILED WITH NOTE" -Motif rules -Out src\images\codex\the-elves-of-wood-sky-and-water.jpg
```
