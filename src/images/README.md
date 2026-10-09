# `src/images/` — pictures the site ships

| Directory | Holds | Size |
|---|---|---|
| `characters/` | Portraits, plus `<id>/` subfolders for galleries | ~1200px long edge; portraits at 1200×675 for the 16:9 slot |
| `lore/` | Lore illustrations and 1600×900 emblem cards | ~1600px long edge |
| `codex/` | Designed 1600×1600 title cards, never photographs | fixed |
| `hero/` | Section-page heroes and the homepage | ~1600px long edge |
| `icons/` | Favicons | as generated |

JPEG at quality about 85. Each layout hardcodes which of these directories it reads from and appends the page's `image:` value, so a file one directory out passes an existence check by basename and still 404s; `scripts/validate-content.js` checks the URL the layout will actually emit, plus: every `image:` target exists, no file here is unreferenced, no two files are byte-identical (share one file with two references, never two files), and `story-bible/images.md` names no stale slug.

**Where an image may come from** (Dermot's ruling, 2026-09-03, in full in `story-bible/images.md`): a generator may make only what no camera can — a non-human body, a habitat, an artificial mind, an artefact, a portrait of someone who does not exist (a fictional character of a photographable species counts, 2026-09-05). Anything a camera can photograph comes from Dermot's own frames (`story-bible/own-photography.json`) or takes a designed card. Every generated image is registered in `story-bible/image-prompts.md` and stays in this repository.

`image_alt` describes what the file actually shows; the July 2026 audit found many describing an image the file no longer contained.

**Placeholders.** A PORTRAIT PENDING or ILLUSTRATION PENDING card is stamped in its JPEG COM segment (`scripts/mark-placeholder.js`, detected by `lib/placeholder-marker.js`), so the homepage slideshow skips it and the image queue counts it as unfinished. The tools that make cards are in `scripts/` (`make-codex-cover.ps1`, `make-emblem-card.ps1`, `make-placeholder-card.ps1`, and `make-cards.js` for non-Windows sessions).

**Finish.** A generated photograph is finished toward Dermot's own photographs on the way in (`scripts/photo-finish.py`, run by `import-image.ps1` at strength 1 by default, since 2026-10-07): black floor, saturation eased, a light optical softening, grain to the measured shortfall against `scripts/photo-profile.json`. Cards, emblems and his own plates take `-Finish 0`; the `codex/` path does so by itself. Rule and reasons in `story-bible/images.md`, *Finish*.

**Which pages carry an image** (Dermot, 2026-10-07): a character with a body gets a portrait and a mind or an instrument signature does not; a place, a people, a thing or a sky gets an illustration, an institution an emblem card, and an abstract concept, doctrine or law none. A page without an image is complete.

Tone applies to images as to prose: unsettling, never horror.
