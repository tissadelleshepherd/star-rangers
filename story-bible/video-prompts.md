# Video prompts — generation and provenance

The prompt-of-record for moving images, and the house motion signature they
share. Third of the family: `images.md` and `image-prompts.md` cover stills,
[`music-prompts.md`](music-prompts.md) covers audio, this covers video. Kept in
`story-bible/`, never published.

**Why this file exists.** `src/video/` held two files (one since 18 September
2026, below) and neither has a prompt
recorded anywhere — the same gap the audio check found on 20 August 2026, in the
one remaining medium. It is worse here in two specific ways:

- **`grok-video-2026-05-10.mp4` is referenced by nothing.** Not by a page, not by
  a template, not by a script. 30 s, 448×672, 4.5 MB, sitting in the repo. An
  unreferenced image fails `npm test`; an unreferenced video is invisible to
  every gate the project has. **Identified 18 September 2026:** Dermot re-sent
  the same file (byte-identical by checksum, generator filename dated 11 May)
  with the direction in `intake-2026-09-18.md`. It is the earliest Grok-era
  Tissadelle — red hair long and loose, a fitted navy-and-silver costume
  uniform with a spiral badge, heels, at a starship viewport over a nebula,
  speaking or singing to camera — in the costume uniform the 5 September
  portrait regeneration replaced. Three shapes put in that intake's *Left
  open*, C, and ruled the same day (*Recommendations accepted*): it stays
  where it is, identified, until this file's own question is ruled. **Ruled
  and removed the same day**, Dermot's instruction verbatim *Remove the
  orphan video from src/video*: the file is deleted from `src/video/`, not
  parked, on the same footing as the 5 September source clip — he holds the
  original, and nothing in the repository referenced it.
- **`baby-universe.mp4` is not really a video.** 4:02 at **1 fps** — one still
  image held over the audio, letterboxed to 854×480 with a third-party
  watermark. It works, and it is 19 MB to show one picture.

**Rule going forward:** no generated video enters the repo without an entry here.

---

## The reference file, read 20 August 2026

`InnerSpaceBloom_3.mp4`, supplied as the current state of the art for this kind
of piece. 854×480, 3:25, **one still frame for the entire runtime**, AAC audio
with a hard shelf at ~16 kHz (so the audio was already lossy before it was
muxed). Same production pattern as `baby-universe.mp4`.

Four things to fix in the next one, in the order they cost:

1. **The lettering is garbled.** The card reads *"Healng. Sleeep."* and
   *"Live Concert oororing"*. This is the failure `images.md` already names —
   a generator cannot spell, which is why every codex title card is built by
   `scripts/make-codex-cover.ps1` instead. **Title text is composited in the
   edit, never generated in the frame.** The generator makes the picture; the
   words go on afterwards, in a typeface, spelled correctly.
2. **480p.** The site's own still images are ~1600 px on the long edge. A video
   at 854×480 is below the standard the pictures beside it already meet. Deliver
   1920×1080.
3. **A still held for three and a half minutes is not a video.** If the piece is
   genuinely one image, ship it as **an image plus an audio player** — exactly
   what `src/codex/ballad-of-the-stars.md` already does, at a quarter of the
   bytes and with the picture at full resolution. Reach for video when something
   moves.
4. **"Live Concert Recording" claims a provenance the file does not have.** Worth
   a decision rather than a fix, and it is Dermot's: this is a site whose whole
   temper is *who says so*, whose codex entries state exactly what each recording
   is and how it reached the archive, and whose fan-work rule turns on the
   difference between referencing and endorsing. A generated track captioned as a
   live recording is the one kind of label the rest of the project is built to
   avoid. Say what it is; the piece loses nothing.

None of that is a judgement on the track, which is not what was asked about and
is not mine to judge. It is a judgement on the container.

**A second file, `RotationalHum_1.mp4`, arrived the same day** — 4:02, same
854×480, same 1 fps still-over-audio pattern, so defects 2 and 3 apply to it
unchanged. Defect 1 does not: **its card is the best of the supplied stills.** A
ribbed black rotor-like form narrowing to a waist, standing on a pale floor with
its own reflection under it, no lettering in the picture at all and the title
composited cleanly by the tool. It is enigmatic without straining, it is a matte
object in real light, and it is exactly what a still should be if a piece is
going to be one. It became scene 11 below.

### The one supplied Grok clip, read the same way

`grok_video_20260605000549.mp4` — 30 s, 448×672, 24 fps with audio: three
dancers in neon bodysuits shuffling on a club stage under moving lights, an LED
wall behind them reading *SHUFFLE TRANSCENDENCE* (and, in two frames, not quite
reading it). It is competent and it moves well, which is the case for keeping
Grok in the pipeline.

**Three notes, one of which is a canon flag:**

- **Low-gravity shuffle dance is not canon.** It comes from the 26 July intake,
  and that intake's own check column marks it — with the cross-species
  translation methodology — as *"Neither exists in canon"*. Establishing it is a
  lore or glossary decision, not something a video settles.
- **If it does get established, the low gravity is the entire point.** The intake
  describes microgravity drift, magnetic-sole footwork and tether-assisted spins
  — *"movement vocabulary impossible in full gravity"*. This clip is a full-gravity
  club floor, which is the one version that says nothing the reader could not see
  on Earth tonight. The shot to want is a dancer who **lands too late**, which is
  also the house signature.
- **Text in frame, again**, and garbled in two frames out of eight. Third file
  in a row. The rule is not a preference.

And the same register drift as the band cards: an arena, a crowd, matched
costumes, moving lights. Slipwave played dock common rooms. Whatever this clip
is for, it is not them.

### The format already has an in-universe reading

Before treating the still-over-audio wrapper as merely a limitation: the record
has already absorbed it. `src/codex/paper-galaxies-audit-dialogue.md` audits a
recovered fragment consisting of *"a single held frame, a singer before a
painted, swirling field of light standing in for a galaxy. Audio: one
performance, repeating"* — which is this production pattern, described from
inside the world, before anyone here called it a defect.

And Sen's verdict on the backdrop is a sharper version of everything above:
*"paper, not physics. It is built to read as cosmos from the audience's seat and
nowhere else. Step around it and there is nothing behind the light."*

That is the house instruction working as intended — a limit of the medium
answered from inside the story rather than shrugged at. **It does not excuse the
fixable things.** A garbled word and a 480p master are errors, and the standing
rule is that a genuine mistake gets fixed rather than diegetically excused. What
the audit earns is the *format*: a held frame over a repeating performance is a
real kind of artifact in this setting, not a shortfall, provided the frame is
worth holding.

**Disclosure about this reading:** I did not hear the audio. Everything above and
in the timed plan below comes from the file's structure, a waveform render and a
log-scale spectrogram — a machine reading, good for where sections start and stop
and useless for whether any of it is any good. Check the plan against your own
ears before cutting to it.

---

## What governs

### The target, and the new word

The standing target (`images.md`, 12 August 2026) is *enigmatic and haunting,
with beauty, mystery, hope and serenity woven through*. Dermot's direction of
**20 August 2026** adds one: **beautiful, enigmatic, haunting, dramatic.**

*Dramatic* is not in the earlier line and does not contradict it — it scopes it.
See `music-prompts.md`'s note on the same direction: **a footer loop and a film
are different jobs.** The loop plays under someone reading and must not compete
with the prose. A video is a thing someone chose to watch, gave three minutes to,
and is looking directly at. Drama is what that attention is for, and withholding
it there is not restraint, it is just quiet.

The horror line does not move. Dramatic means *stakes and structure* — a shape
that arrives somewhere — not shock. Nothing lunges at the camera, and the dark
fact is still hinted rather than depicted.

### The camera is a witness

The strongest rule here, and it comes straight out of how the prose works:
**there is no omniscient narrator anywhere in this project**, only named
viewpoints, each withholding what the others supply. The camera inherits that.

- **No impossible camera.** No drone flight through a sealed hull, no move
  through solid matter, no orbital pull-back that no instrument was in a position
  to take. If no person and no mounted instrument could have been where the lens
  is, the shot is narrating rather than witnessing.
- **The frame knows less than the scene.** Something is usually out of shot, and
  it is usually the thing being reacted to.
- **Instrument footage is a legitimate viewpoint** — a fixed dock camera, a hull
  mount, a survey rig — and often the better one. It is the form the record
  itself would hold.

### Light is diegetic

From `src/lore/narrative-works-and-their-adaptation.md`, which already settles
what audiovisual work looks like in this setting: imagery on matte unlit surfaces
read by ambient light, *"nothing glowing, nothing projected"* — closer to a
scored and illustrated record than to a film. So: **no holographic displays, no
glowing interfaces, no projected UI**, all three of which the 26 July intake
listed among refused tropes, and which every generator reaches for the moment it
hears "spaceship". Light comes from lamps, windows, work lights, stars and fires.

### No text in frame

Not a stylistic preference — see defect 1. No signage, no readouts, no name
tapes, no console lettering, no subtitles baked in. Carry it in every negative
prompt, and composite anything the piece genuinely needs.

---

## The house motion signature

The audio has three anchors and the video shares them, because they are facts
about the setting rather than facts about a medium:

1. **The hum** — everything is on something that is running. A frame is never
   perfectly still: there is always the faintest structural vibration, the kind a
   camera resting on a bulkhead picks up.
2. **The drift** — the *slipwave* signature. Movement is slow, continuous and
   never corrects: a push that does not arrive, a drift that does not settle. No
   locked-off tripod, no snap zoom, no whip pan.
3. **The forty seconds** — where two things ought to be in step, one is very
   slightly behind, and stays behind.

Plus two of pace: **long takes, few cuts**, and **cut on the music's structure,
never on its beat.** A cut on every fourth bar is a promo; this is not one.

### Shared preamble

> Slow continuous camera drift, never locked off and never settling. Long
> unbroken take. Diegetic light only — work lamps, window light, starlight,
> fire; nothing glows that would not glow. Matte surfaces, real materials, dust
> and wear. Deep shadow with detail retained in it. Restrained, patient,
> unhurried, no event arriving suddenly. Cinematic, filmic grain, shallow depth
> of field. Enigmatic, haunting, beautiful, quietly dramatic. 24 fps.

### Shared negative

> No on-screen text, letters, numbers, signage, subtitles or watermarks. No
> holograms, holographic displays, projected interfaces, glowing UI or floating
> icons. No lens flares, no light streaks, no volumetric god rays as decoration.
> No drone flythrough, no crash zoom, no whip pan, no camera passing through
> solid objects. No jump scares, no sudden movement toward camera, no gore, no
> horror imagery. No time-lapse clouds, no slow-motion explosion, no
> hyperspace star streaks. Not a music-video montage, not a trailer.

### Tools

**Current tool: Grok Imagine, and it is genuinely well suited to two of the four
jobs here.** It is fast, cheap, generates native audio, and its clip length —
6–15 s, extendable to about 30 s by chaining — is the right size for the scene
library below, where nearly every entry is one held shot rather than a sequence.
The 30 s portrait clip already in `src/video/` is exactly its output shape.

**Where it stops, measured against this file's own specs:**

- **720p is the ceiling** (480p on the entry tier), against a site whose still
  images are ~1600 px on the long edge. A Grok clip cannot be finished at 1080p,
  only upscaled, and upscaled footage next to native footage reads instantly.
- **Portrait by default.** Fine for a social cut, wrong for anything that sits
  in a page beside 16:9 stills.
- **Camera control is its weak axis**, and the house motion signature is almost
  entirely camera: a slow push that does not arrive, a drift that never settles,
  no cut. That is the one thing to buy elsewhere.

**So: keep Grok for what it is good at.** Look development, testing a framing
before spending on it, and any shot where the subject moves and the camera
merely watches. Roughs are worth more than they look — half the scenes below
will turn out wrong in ways only a moving version reveals.

**For finishing, keyed to the shot rather than ranked:**

| Shot | Tool | Why |
|---|---|---|
| Camera-led — scenes 1, 2, 3, 12 | **Runway Gen-4.5** | The strongest at taking camera direction and holding it, plus generative editing for fixing one element without re-rolling. The whole house signature lives on this axis. |
| Material and naturalistic — 7, 8, 11 | **Veo 3.1** | Closest to high-end stock footage, best on natural surfaces, fabric, dust and hair, native audio, 1080p. |
| Anything with people moving — 3 | **Kling 3.0** | Human motion is its axis. |

Two notes with dates on them, because this moves fast: **Sora 2 was deprecated
in April 2026** with its API shutting down that September, so do not build a
pipeline on it; and **Seedance 2.0 and HappyHorse-1.0** took the top leaderboard
slots in early 2026 without me having tested either against this brief. Check
before committing to a subscription — this table will go stale faster than
anything else in the file.

**The one thing no generator does:** the title text. Composite it afterwards, in
a real typeface, spelled correctly. That is not a tool recommendation, it is the
same rule as everywhere else here.

### Delivery

- **1920×1080, 24 fps** as the default. Vertical 1080×1920 only for a social cut,
  generated as its own frame rather than cropped out of the wide one.
- **If a piece is Grok-sourced end to end, hold the whole thing at 720p 16:9**
  rather than mixing tiers. Consistency reads better than a resolution number,
  and a uniformly 720p piece looks made; a 480p shot inside a 1080p one looks
  broken.
- **Generate 5–10 s clips and assemble.** No current tool holds a coherent
  three-minute take, and pretending otherwise is what produces the drifting-face
  problem. A 3½-minute piece is 20–30 generations, most of them discarded.
- **Cut, do not dissolve, unless the music dissolves.** The house dissolve is a
  slow one across a held tone.
- **Never upscale-stretch a 480p source to sit beside 1080p footage.** It reads
  instantly and it reads as carelessness.
- Keep the surviving clips and their prompts. An assembled piece whose sources
  are gone cannot be re-cut, which is this file's whole subject.

---

## Scene library

Each is a single generated clip, canon-grounded, framed from a viewpoint someone
could have occupied. Paste the shared preamble ahead and the shared negative
behind. **All are proposals** — a video attached to a codex entry is
publication-adjacent, and the scenes touching narrative ground are draft-and-stop.

### 1. The forty seconds

> Two mechanical instrument dials side by side on a worn bulkhead panel in a
> dim station corridor, lit by one amber work lamp. Both sweep hands move
> steadily; one is a fraction behind the other and never catches up. Slow push
> in over eight seconds. Nobody present. Dust in the lamp light.

The premise of the entire work in one shot, and it needs no text to say so.

### 2. Half-light causeway

> A long enclosed dock causeway at half-light, empty, viewed from one end. Wet
> metal floor, handrails, a row of failing lamps down one side, one lamp near
> the far end burning a different colour to all the others. Slow drift forward,
> never reaching the end. Cold blue ambient, one warm source.

Straight out of the anthem's own lines — *every dock has a light it can't
explain*.

### 3. The muster

> A crowd of young people in dark service dress standing close together in a
> large hard-walled hall, singing. Camera at head height **inside** the group,
> not in front of it, drifting slowly past shoulders and faces in profile. No
> stage, no conductor, no audience. Overhead industrial light, faces half in
> shadow.

Pairs with `music-prompts.md`'s Take B. The camera being inside the group rather
than facing it is the shot.

### 4. The empty berth

> A vacant docking berth seen through a scratched observation window at night.
> Mooring clamps open, guide lights still cycling for a ship that is not there,
> a barrier line across the walkway. Static frame with a faint structural
> vibration. One figure out of focus in the foreground reflection, still.

The Ballad's register — hint at the dark fact, never depict it.

### 5. Inner space bloom

> Total darkness. One small point of warm light appears off-centre and begins,
> very slowly, to acquire structure — filaments, a faint spiral, a
> shell — as if something is organising rather than exploding. Extremely slow
> outward drift. No debris, no shockwave, no sound-implied impact. Vast scale
> implied by how slowly it changes.

The uploaded track's own title, and the one scene where the music can be
dramatic without anything being violent. **Note the canon caution:** if this is
ever attached to *Baby Universe*, that codex entry deliberately declines to
resolve whether the song's reading is true, and a picture that shows it happening
resolves it. Keep it abstract enough to remain a song's image rather than the
record's finding.

### 6. The Undersong

> A dark stone chamber cut by hand, dry dust on a level floor. The dust shifts
> and settles into clean geometric standing-wave patterns, then reorganises into
> another. Nothing visible causes it. Slow overhead drift. Faint amber light
> from a single opening.

Shows resonance without putting a Chthonari on screen and without inventing one.

### 7. The Garden Core

> A cultivated terrace inside a rotating habitat, humid air, working lamps
> among green growth, the curve of the floor rising away in the far distance. A
> single leaf falls far too slowly and lands without sound. Handheld drift at
> walking height.

Variable gravity carried by one falling leaf instead of by exposition.

### 8. Prismere

> A silicate-carbon biosphere: living tissue built of glass and crystal,
> bioluminescent throughout, the world producing its own light. Translucent
> forms, soft shifting colour washes, dense particulate haze. Slow drift between
> two crystal masses. No figures.

Deliberately reuses the shared preamble already recorded in `image-prompts.md`
for the Prismere cluster, so the moving version and the stills read as one place.

### 9. Both ends of a fold

> Two shots of the same short length, cut together with nothing between them: a
> ship's running lights receding from a quiet transit marker, then the same
> class of lights approaching a different marker under a different sky. Static
> frames, long holds. Nothing dramatic happens in either.

*Nothing has ever been lost inside a fold, only at the two ends of one.* The
absence of a transit shot is the point, and a generator will supply star streaks
unless the negative forbids them.

### 10. Off the roster

> Close on a hand in service dress at a wall-mounted crew board in a corridor,
> lifting one name plate out of a slot and closing the empty space with a
> finger. No face in frame. One overhead light. Held four seconds after the hand
> leaves.

No lettering: the plate is out of focus or turned away. What it says is not the
information.

---

### 11. The rotor

> A large ribbed metal rotor assembly in a maintenance space, seen side-on from
> a catwalk. Stacked discs narrowing to a waist at the centre, matte black,
> worked and worn. It is turning slowly enough that only the surface texture
> shows it. One caged work lamp, deep shadow behind. Camera drifts a few
> degrees; nothing else happens.

The hum with a body. Shape borrowed from the card art supplied with
*Rotational Hum*, which is the best of the supplied stills and the one that
needs no fixing.

### 12. Listening to the structure

> An engineer in coveralls presses a long metal rod against a bulkhead and rests
> an ear on the other end, eyes closed, entirely still. Corridor lit by one
> failing overhead. Held for eight seconds with no cut and no reaction. Faint
> vibration visible in dust on a nearby ledge.

Diagnosis by ear, which is how a structure is read by the people who live inside
one — and the human counterpart to scene 6.

---

## Card art for a recording

Where a piece really is one held image, that image is doing all the work, and
three of the five supplied cards get Slipwave wrong in the same direction — they
put a small unglamorous band on a big stage. The canon detail is in
[`music-prompts.md`](music-prompts.md); this is the brief that answers it:

> A three-piece band playing in a dock-adjacent common room aboard a space
> habitat. A red-haired woman in her twenties singing into a single shared
> microphone, a man behind her on hand percussion, a second man seated with a
> stringed instrument. Working clothes, not stage clothes. Fluorescent overhead
> light and one work lamp — no stage lighting, no coloured wash, no haze. A dozen
> people sitting on crates and mismatched chairs, close enough to touch the
> players. Scuffed deck plating, cable runs, a bulkhead door standing open.
> Warm, unpolished, small. Nobody in the room thinks this is going anywhere.

Negative: no stage, no crowd barrier, no arena, no spotlights, no smoke, no
matching outfits, no leather stage costume, no electric guitars, no drum kit, no
video wall, **no text or lettering of any kind**.

A file-by-file verdict on every supplied card — which to keep, which to redo and
why — is in [`music-prompts.md`](music-prompts.md#regeneration-worklist), kept
there so the audio and card decisions sit side by side.

**And the prior question:** the four Slipwave-adjacent codex entries already
share a designed cover set — gold serif on a dark starfield with a trailing star,
built by `scripts/make-codex-cover.ps1` precisely because a generator cannot
spell. Photographic band art would change that whole set and invalidate four
`image_alt` lines. Worth deciding as a set rather than one cover at a time.

---

## A timed plan for `InnerSpaceBloom_3`

The track's structure as measured from its own waveform and spectrogram —
verify by ear before cutting:

| Time | What the audio does | Scene |
|---|---|---|
| 0:00–0:25 | thin, low, few events | **5. Inner space bloom**, first light only |
| 0:25–0:55 | first fill, harmonics arrive | **8. Prismere** drift |
| 0:55–1:20 | sustained, stable | **6. The Undersong** |
| 1:20–1:35 | thins out | **4. The empty berth**, static, long hold |
| 1:35–2:00 | rebuilds | **7. The Garden Core** |
| 2:00–2:30 | fullest, brightest | **2. Half-light causeway** |
| 2:30–2:50 | peak | **5** again, structure now forming |
| 2:50–3:10 | falling away | **9. Both ends of a fold** |
| 3:10–3:25 | tail, low sweep, fade | **1. The forty seconds**, then black |

Nine clips, two of them the same scene at different stages, which is what gives
a three-minute piece a shape instead of a sequence. Title card composited at the
head over the first hold — set, not generated.

---

## A timed plan for `RotationalHum_1`

4:02, and the more sectioned of the two — a pulse arrives partway through a piece
that starts without one, which gives an edit real hinges to cut on. Same
disclosure: measured, not heard.

| Time | What the audio does | Scene |
|---|---|---|
| 0:00–0:16 | thin, low, almost nothing | **11. The rotor**, dark, barely turning |
| 0:16–0:48 | bed builds, still beatless | **12. Listening to the structure** |
| 0:48–1:18 | **pulse enters** | **1. The forty seconds** — the two dials |
| 1:18–1:36 | fuller | **6. The Undersong**, dust reorganising |
| 1:36–2:08 | sustained, two internal edges | **3. The muster**, one long take |
| 2:08–2:24 | thins out | **4. The empty berth**, static |
| 2:24–2:32 | bright break | cut to black, hold |
| 2:32–3:52 | fullest and longest passage | **5. Inner space bloom**, the whole arc |
| 3:52–4:02 | tail | **11** again, still turning, lights out |

The two hinges are the ones to protect: **the pulse at 0:48**, which should land
on the dials so the mechanism and the beat arrive together, and **the break at
2:24**, which is the one place in either track where cutting to nothing is
better than cutting to a picture.

---

## Entry format

    ### <filename>
    - **Type:** generation | assembly
    - **Tool:** name and version
    - **Date:**
    - **Used by:** page path, or "unreferenced"
    - **Prompt:** verbatim, per clip
    - **Negative:**
    - **Notes:** seed, clip count and lengths, cut points, source clips kept where

### `odonata-raise-your-banners.mp4`
- **Type:** supplied, 7 October 2026 (Dermot: *Two codex music videos from Slipwave band*)
- **Tool:** unrecorded — do not reconstruct
- **Date:** filed 2026-10-07
- **Used by:** `src/codex/odonata-raise-your-banners.md`
- **Prompt:** unrecorded
- **Negative:** unrecorded
- **Notes:** 3:32, 1280×720, 24 fps, H.264 + AAC 48 kHz stereo, 27 MB. Genuinely moving footage (slow camera moves and animated water, wings, lanterns), not a held still. Nine lyric lines composited as captions at the foot of the frame, one per section, in a clean serif, correctly spelled; title card composited at the head. Poster frame `odonata-raise-your-banners-poster.jpg` taken at 0:01.

### `borrow-the-angle.mp4`
- **Type:** supplied, same day
- **Tool:** unrecorded — do not reconstruct
- **Date:** filed 2026-10-07
- **Used by:** `src/codex/borrow-the-angle.md`
- **Prompt:** unrecorded
- **Negative:** unrecorded
- **Notes:** 3:52, 1280×720, 24 fps, H.264 + AAC 48 kHz stereo, 23 MB. Moving footage as above. Ten captioned lines, same treatment; the last twenty seconds carry no caption. Poster frame `borrow-the-angle-poster.jpg` taken at 0:01.

The first file in `src/video/`, `baby-universe.mp4`, predates this file and has no
recorded prompt; do not reconstruct one and file it as though it were the
original. The two above are recorded as absences for the same reason.

## The two Slipwave videocasts, read 7 October 2026

Supplied as *two codex music videos from Slipwave band* and filed the same day
as codex entries, each carrying its file. What the files are, measured and
looked at (not heard — the standing disclosure applies):

- **The caption rule is met, for the first time.** Every earlier supplied piece
  broke on lettering in the frame. These composite a title card and one lyric
  line per section in a real typeface, spelled correctly, held for the
  section's length. That is exactly what *Title text is composited in the
  edit, never generated in the frame* asked for.
- **They move.** 24 fps, slow pushes and drifts, animated water and wings,
  cut on the song's sections. The still-over-audio question (open item 2
  below) does not arise for them.
- **720p, held throughout** — the *Delivery* rule's second case, a uniformly
  720p piece rather than a mixed one. Below the stills' 1600 px, as every
  generated video so far has been.
- **The register is off-house and the record already has the answer.** Bronze
  gates, towers, a harbour under dragon wings, light with no source, sparkle
  and bloom: the house signature (diegetic light, matte surfaces, the camera
  as witness) is not what these are doing. `performers-and-generated-work.md`
  calls a recording with pictures a *videocast* and files generated pictures
  as the maker's; both entries therefore say the pictures were laid over the
  recording after the fact, are uncredited, and witness nothing. The imagery
  is the maker's painted world, as *Paper Galaxies*' backdrop was, and the
  Archive reads it as that.
- **The captions are the only confirmed text.** Nine and ten lines, one to a
  section, and no lyric sheet. Both entries print the captions in order as
  confirmed and transcribe nothing else — the 20 August rule that a lyric
  cannot be derived from a spectrogram holds, and a full sheet from Dermot
  closes the gap when he has one.
- **Nobody in frame is a named character.** The woman at the water in *Borrow
  the Angle* is dark-haired and unnamed; the entry says so.

Three things stay his, put in `intake-2026-10-07.md`: which session the
recordings belong to (dock-era with Shepherd, later with Ashgrove and
Calloway alone, or left unfixed as filed), the full lyric sheets, and the
codex covers (the Slipwave set shares a designed card; two more are owed via
`make-codex-cover.ps1`, filed as a `needs-desktop` issue).

---

## Open questions

Mirrored into [`open-questions.md`](open-questions.md).

1. **`grok-video-2026-05-10.mp4` is an orphan.** Referenced nowhere, 448×672,
   30 s, and the only genuinely moving footage in the repo. Find it a home or
   remove it — but removal of anything published-adjacent is Dermot's call.
   **Content identified 18 September 2026** (see the top of this file): the
   earliest Tissadelle clip, in the retired costume uniform. **Removed the
   same day at Dermot's instruction** (*Remove the orphan video from
   src/video*); this item is closed.
2. **Should the still-over-audio pieces become image + audio player?**
   `baby-universe.mp4` is 19 MB of one picture. The pattern already exists in
   `ballad-of-the-stars.md`. This changes a live page, so it is a proposal.
3. **Should `validate-content.js` cover `src/video/` and `src/audio/`?** Same
   question the audio file raises, and the orphan above is the evidence for it.
4. **Does *Inner Worlds / Inner Space Bloom* belong to this site at all?** It
   carries no Fian Ilchruinne branding and reads as a separate ambient project.
   If it is a site piece it needs a codex home and a named author like every
   other recording; if it is a separate release it needs no canon check at all,
   and these scene prompts should be treated as a loose library rather than as
   anything the record commits to. Nobody has said which, and the answer changes
   what this section is for.

---

## Three clips offered 8 October 2026, written before anything is generated

Dermot's offer, verbatim: *"let me know if short generated video clips would
also be useful"*, then *"Would you trust Grok to create these videos? I have a
fixed price subscription and I could open it in Chrome."* The answer given:
yes for the two landscapes, with eyes open for the ark, since generators turn
a spine with its drum. Each is one held shot in the house motion signature,
derived from its page (and, for the ark, from `starship-design.md`'s sheet A),
run on Grok Imagine from his Chrome, two takes each, his pick, anything
lettered or physically wrong dropped rather than healed. Kept clips go into
`src/video/` with a poster frame and an entry here, by one pull request.

### A. The drithle run over Drithane (The Honest Dark; the Guest Ring)

> Slow continuous camera drift, never locked off and never settling. Long unbroken take. Diegetic light only: starlight, moonlight, lightning; nothing glows that would not glow. Matte surfaces, real materials, dust and wear. Deep shadow with detail retained in it. Restrained, patient, unhurried, no event arriving suddenly. Cinematic, filmic grain, shallow depth of field. Enigmatic, haunting, beautiful, quietly dramatic. 24 fps, 16:9 landscape, 10 seconds. A fixed camera on a hillside above a snowbound valley at night: a cluster of low dark buildings with not one window lit, a single low bright moon over mountains, and across a sky crowded with sharp stars a scatter of fine silent white streaks all travelling the same way, one after another, unhurried, for the whole take. The snow blue-grey in moonlight. Nothing on the ground moves. No on-screen text, letters, numbers, signage, subtitles or watermarks. No holograms, projected interfaces, glowing UI or floating icons. No lens flares, no light streaks, no volumetric god rays as decoration. No drone flythrough, no crash zoom, no whip pan, no camera passing through solid objects. No jump scares, no sudden movement toward camera, no gore, no horror imagery. No time-lapse clouds, no slow-motion explosion, no hyperspace star streaks. No people, no figures, no vehicles. Not a music-video montage, not a trailer.

### B. The standing storm at Quern (Quern)

> Slow continuous camera drift, never locked off and never settling. Long unbroken take. Diegetic light only: starlight, moonlight, lightning; nothing glows that would not glow. Matte surfaces, real materials, dust and wear. Deep shadow with detail retained in it. Restrained, patient, unhurried, no event arriving suddenly. Cinematic, filmic grain, shallow depth of field. Enigmatic, haunting, beautiful, quietly dramatic. 24 fps, 16:9 landscape, 10 seconds. A fixed camera on a plain of wet black grit looking along the line of a permanent sideways rain: a row of low rounded windowless stone houses that do not move, rain streaking across the frame horizontally for the whole take, and on the right horizon a towering wall of storm cloud lit from within by continuous slow lightning, red-amber at its base, while the sky to the left is a clear starless black. The storm wall breathes but never advances. No on-screen text, letters, numbers, signage, subtitles or watermarks. No holograms, projected interfaces, glowing UI or floating icons. No lens flares, no light streaks, no volumetric god rays as decoration. No drone flythrough, no crash zoom, no whip pan, no camera passing through solid objects. No jump scares, no sudden movement toward camera, no gore, no horror imagery. No time-lapse clouds, no slow-motion explosion, no hyperspace star streaks. No people, no figures, no vehicles. Not a music-video montage, not a trailer.

### C. The ark's drum turning (The Generation-Ark Era; sheet A of starship-design.md)

> Slow continuous camera drift, never locked off and never settling. Long unbroken take. Diegetic light only: starlight, moonlight, lightning; nothing glows that would not glow. Matte surfaces, real materials, dust and wear. Deep shadow with detail retained in it. Restrained, patient, unhurried, no event arriving suddenly. Cinematic, filmic grain, shallow depth of field. Enigmatic, haunting, beautiful, quietly dramatic. 24 fps, 16:9 landscape, 10 seconds. A hull-mounted camera on the still spine of a Currach-era generation ark in deep space, looking aft along the spine: the wide patched drum amidships turns slowly and steadily about the ship's long axis, about one turn in twenty seconds, while the spine, the flat radiator panels and the stars behind stay still. Dull grey hull patched in many greys, no window band, no markings, nothing lit, one far sun lighting it from the side. The drum's turn is the only motion. No on-screen text, letters, numbers, signage, subtitles or watermarks. No holograms, projected interfaces, glowing UI or floating icons. No lens flares, no light streaks, no volumetric god rays as decoration. No drone flythrough, no crash zoom, no whip pan, no camera passing through solid objects. No jump scares, no sudden movement toward camera, no gore, no horror imagery. No time-lapse clouds, no slow-motion explosion, no hyperspace star streaks. No people, no figures, no vehicles. Not a music-video montage, not a trailer. No engine glow, no glazed cabin, no fins, no lit flank, and the spine must not rotate.

**Run and judged, 8 October 2026.** Grok Imagine from Dermot's Chrome, 720p
(the plan's ceiling; 1080p refused), 10 s, 16:9, two takes each, frames pulled
at 0, 3, 6 and 9 s with ffmpeg and read against the lines below. Kept and filed
in `src/video/` with poster frames, embedded on their pages after the opening
paragraph:

- **A, take 1** (`the-honest-dark.mp4`): a slow drift that never settles, the
  streaks one way for the whole take, the moon steady, not a window lit. Take 2
  passed too and is the alternate, in `image-out/video/`.
- **B, take 1** (`quern.mp4`): the wall on the right lit from within and
  breathing, the dark to the left, the row of houses still. Take 2 passed with
  the wall more central; alternate kept.
- **C, take 1** (`the-generation-ark-era.mp4`): the drum turns about the
  spine, ports coming round into view across the take, the spine's truss
  still; the camera drifts a little, which the preamble allows. Take 2 failed
  the sheet, a bare cylinder with no spine or radiators and the camera
  orbiting it; dropped.

Lettering: none in any take. Lesson for the next clips: Grok respects a
negative stated as objects ("no lit windows") and a motion stated as the one
thing that moves; it does not respect "camera fixed" unless the mount is named.

**Judging a take:** A fails if a window lights or the streaks change direction;
B fails if the houses move or the storm advances; C fails if the spine turns
with the drum, the drum's ends morph, or anything on the hull glows.
