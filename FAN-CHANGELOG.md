# Fan changelog

Changes this fork (`tissadelleshepherd/star-rangers`) makes on top of `dermot-r-cochran/star-rangers`, newest first, in the Keep a Changelog shape. `CHANGELOG.md` is the original record's and is kept exactly as it comes from upstream (see `FORKING.md`, *Versions and changelog in a fork*). The version in `package.json` stays the upstream release this fork is built on.

## [Unreleased]

- **A Fan Tales thread, Season 90, with its first scene, [The Length That Was Not Fibre](src/seasons/s90/e01/s90e01c01.md)** (`lib/storyline-threads.js`, `src/threads/fan-tales/`, `src/seasons/s90/`, 2026-10-15). First filed as Season 14 and moved the same day to Season 90, a number set apart for fan seasons, well clear of the original's. Unofficial fan fiction on `tissadelleshepherd/star-rangers`, under the original's Fan Works Policy, labelled as such on the thread, season, episode and chapter pages. A single scene on Antariksha's hub foundry with two invented viewpoints, Meenal Raghunath and Arjun Velloor: a fibre flaw that repeats at an interval nothing on the hub produces, filed and kept, never explained. It carries no `canon_facts` and no images, and it is listed on no edition's tier, so only the unfiltered build shows it.

- **The unreferenced-image check exempts `src/images/IMG_1786938939320.jpg`** (`scripts/validate-content.js`, 2026-10-15). The picture stays in the repository unreferenced and uncaptioned, as fork PR #5 left it, and `npm test` passes again; every other unreferenced image still fails the check.
