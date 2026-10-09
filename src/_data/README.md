# `src/_data/` — Eleventy global data

Each file here is a global data value available to every template under its filename (`site`, `build`, `giscus`, `latestLore`, `scenePovPages`, `storylineThreads`). Engine code, MIT. Data files run at build time with the same environment `scripts/cpanel-deploy.sh` exports from `deploy.conf`, which is how one build knows which edition it is.

| File | Provides |
|---|---|
| `site.js` | Site name, description and absolute domain (`SITE_DOMAIN`, set per cPanel clone; the GitHub Pages URL otherwise), plus the `noindex` flag for staging |
| `build.js` | Build time and copyright years, computed once per build |
| `giscus.js` | The comment widget's config: which comments repo and category each page uses, resolved in the order `GISCUS_PROFILE` → `giscus.local.json` → the default profile, with `GISCUS_*` env overrides on top. Read `TECHNICAL-README.md`'s giscus section before touching it |
| `latestLore.js` | The homepage Lore card's teaser: the most recently touched entry under `lore/`, by git commit date or mtime |
| `scenePovPages.js` | Every `(chapter, scene, character)` combination, flattened from the chapter token stream so `scene-pov.njk` can paginate one page per POV. Uses `lib/markdown-containers.js`, the same parser the chapter page uses, so the two cannot disagree |
| `storylineThreads.js` | The thread registry from `lib/storyline-threads.js`, with tier-gated threads removed for builds below their tier, for `threads/index.md` |

The rule that keeps these honest: a data file that decides what a reader sees (`scenePovPages`, `storylineThreads`) must apply the same inclusion predicates as `.eleventy.js` (`lib/content-filter.js`, `lib/classify-content.js`), or a narrowed or tier-gated build will show a page in one place and hide it in another.
