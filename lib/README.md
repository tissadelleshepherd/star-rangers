# `lib/` — the engine's shared modules

Plain Node modules required by `.eleventy.js`, by `src/_data/*.js` and by `scripts/*.js`, so one decision lives in one place. MIT. Most were extracted from `.eleventy.js` specifically so they could be unit-tested without booting Eleventy; each has a suite in `test/` (see `TestingStrategy.md`).

| Module | Owns |
|---|---|
| `content-schema.js` | `CONTENT_TYPES`, the one registry of each content type's front-matter shape, read by both `scripts/validate-content.js` and `scripts/new-content.js` so they cannot drift |
| `content-filter.js` | `CHARACTERS`/`TOPICS`/`THREADS` narrowing from `deploy.conf`, and the tier gate on threads: `isCharacterIncluded`, `isChapterIncluded`, `isTopicPageIncluded`, `isThreadIncluded`, `isCharacterPovIncluded`, `gatedThreadForPage` |
| `classify-content.js` | `classifyContentPath` and the whole-page include-or-placeholder decision, by input path and never by `layout` |
| `storyline-threads.js` | `STORYLINE_THREADS`, the registry of threads and their seasons; `threadForSeason` |
| `editions.js` | The registry of per-domain editions keyed by domain, the tier ladder, `tierVisible`, `PRESENTATION_MODES`, `validateEditions`; an untracked `editions.local.json` overlays it for a fork |
| `markdown-containers.js` | The `::::: scene` and `::: pov` containers, shared by the chapter render and `scenePovPages.js` |
| `image-size.js` | JPEG/PNG dimensions from the header, null rather than guess, for Open Graph tags |
| `placeholder-marker.js` | Detects the PLACEHOLDER stamp in a JPEG COM segment |
| `status-key.js` | The class key for a character's status badge: head clause, slugified |
| `archive-backlinks.js` | `findArchiveBacklinks`: which lore, glossary, codex and journal pages cite a chapter (by URL, by `/c/` alias, or by `revealed_by` / `revised_by`), behind the chapter layout's "In the Archive" block; derived every build, never authored |

Two rules. Anything that decides what a reader sees goes through `content-filter.js` and `classify-content.js`; a new content-bearing field or page type has to be added to those predicates and to `classifyContentPath`, or it will silently always or never be included under a narrowed deploy. And `editions.js` is the one file here that is a decision about live sites: registering or re-pointing a domain is second-tier work, and moving a tier is never done without instruction (`CLAUDE.md`, *Authority and review boundary*).

`scripts/check-internal-links.js` scans this directory as well as `src/`, because `editions.js` carries authored copy with links in it.
