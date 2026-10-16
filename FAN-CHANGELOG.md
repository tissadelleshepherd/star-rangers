# Fan changelog

The changes this fork makes on top of *Fian Ilchruinne*, newest first. This
is unofficial fan work on `tissadelleshepherd/star-rangers`, under the
original's Fan Works Policy. `CHANGELOG.md` is the original's record and is
left exactly as it comes from `dermot-r-cochran/star-rangers`; the version in
`package.json` likewise says which release of the original this fork is built
on. The fork's own releases, if any, are tagged with a suffix, such as
`v1.40.0+fan.1` (the original's `FORKING.md`, *Versions and changelog in a fork*).

## [Unreleased]

- **Synced from the original at its release 1.41.0 and the commits after it, up to its PR #1276** (2026-10-16). `package.json` now says 1.41.0, the release this fork is built on; `CHANGELOG.md` and the new `changelog/` archive are the original's, unchanged.

- **Synced from the original up to its PR #1252** (2026-10-15): seasons 90–99 and `fan-` thread ids are now reserved for forks there, and Fan Tales already sits inside both (Season 90, `fan-tales`), so nothing here needed renumbering.

- **The August picture moves out of the site, and the validator is the original's again** (`fan-images/IMG_1786938939320.jpg`, `scripts/validate-content.js`, 2026-10-15). The picture now sits in `fan-images/` at the root, outside `src/`, still uncaptioned and unidentified, so the unreferenced-image check no longer sees it; the exemption below is withdrawn and `scripts/validate-content.js` matches the original exactly, leaving nothing of the engine for a sync to combine.

- **A Fan Tales thread, Season 90, with its first scene, [The Length That Was Not Fibre](src/seasons/s90/e01/s90e01c01.md)** (`lib/storyline-threads.js`, `src/threads/fan-tales/`, `src/seasons/s90/`, 2026-10-15). First filed as Season 14 and moved the same day to Season 90, a number set apart for fan seasons, well clear of the original's. Unofficial fan fiction on `tissadelleshepherd/star-rangers`, under the original's Fan Works Policy, labelled as such on the thread, season, episode and chapter pages. A single scene on Antariksha's hub foundry with two invented viewpoints, Meenal Raghunath and Arjun Velloor: a fibre flaw that repeats at an interval nothing on the hub produces, filed and kept, never explained. It carries no `canon_facts` and no images, and it is listed on no edition's tier, so only the unfiltered build shows it.

- **The unreferenced-image check exempts `src/images/IMG_1786938939320.jpg`** (`scripts/validate-content.js`, 2026-10-15). The picture stays in the repository unreferenced and uncaptioned, as fork PR #5 left it, and `npm test` passes again; every other unreferenced image still fails the check.

- **This file**, 2026-10-15: the two entries above moved here from `CHANGELOG.md`, which now matches the original.
