# `src/audio/` — footer themes and in-universe recordings

The per-edition footer audio player (`base.njk`) plays the file named by that edition's `themeAudio` in `lib/editions.js`; `validateEditions` checks the file exists here, since `scripts/check-internal-links.js` cannot resolve a templated path. The remaining files are in-universe recordings referenced from codex entries (the ballads).

Music has the same provenance discipline as images: `story-bible/music-prompts.md` holds the house sonic signature, the per-edition briefs and the in-universe recording briefs, and records that the five files that predate it have no prompt kept. Engine-side asset; add a file here and its brief there in the same change.
