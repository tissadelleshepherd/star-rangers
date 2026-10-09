# `src/` — the site's input tree

Everything Eleventy reads to build the site lives here (`.eleventy.js`: input `src/`, output `_site/`, includes `_includes/`, data `_data/`). Markdown, HTML and data templates all render through Nunjucks. Each subdirectory below has its own `README.md`; those files are documentation for people, not pages — `.eleventyignore` excludes `src/**/README.md` from the build and every content walker in `scripts/` skips them.

## Two kinds of thing in one tree

The repo's licence split runs through this directory (root `README.md`, *License*):

- **Engine, MIT**: `_includes/`, `_data/`, `css/`, `js/`, `static/`, and the site-level templates listed below.
- **Story content, CC BY-NC-ND 4.0** (`CONTENT-LICENSE.md`): `seasons/`, `threads/`, `characters/`, `timeline/`, `lore/`, `glossary/`, `codex/`. Everything asserting a fact about the world is content; see `CLAUDE.md`'s *Authority and review boundary* for what that means for editing it.

`journal/` and `about/` are the site's two non-diegetic sections, out-of-character writing. The root README's split names neither, so by its wording (*everything else not listed* is MIT) they fall on the engine side; whether that is intended is worth Dermot's confirmation before anyone relies on it.

## Content directories (one schema each)

| Directory | Layout | What it holds |
|---|---|---|
| `seasons/` | `chapter.njk` | Chapters, `s<NN>/e<NN>/s<NN>e<NN>c<NN>.md`, plus season and episode index pages |
| `threads/` | `base.njk` | One landing page per storyline thread, registered in `lib/storyline-threads.js` |
| `characters/` | `character.njk` | One page per character, being or entity |
| `lore/` | `lore-entry.njk` | Settled, binding fact about the world; subdirectories for planets, universes, worldwrights, and the canonical glossary reference doc |
| `glossary/` | `glossary-entry.njk` | In-universe terms, one per page |
| `codex/` | `codex.njk` | In-universe documents, each by a named author, canon only for its author |
| `timeline/` | `base.njk` | Hand-written HTML event entries ordered by `sort_order` |
| `journal/` | `journal-entry.njk` | Dermot's out-of-character process notes, under `/story-engine/` |

The front-matter shape of every type is `lib/content-schema.js`'s `CONTENT_TYPES` registry, enforced by `scripts/validate-content.js` and scaffolded by `npm run new`. Prefer the scaffold to hand-writing front matter.

## Single-page sections

Each is one `index.md`: `about/`, `atlas/` (the map of places), `forking/` (how to run the engine on your own domain), `official/` (the list of official deployments), `start/` (the reading plan), `story-engine/` (parent of the Journal), `tiers/` (the reading tiers and how they nest).

## Site-level templates at this level

| File | Emits |
|---|---|
| `index.md` | The homepage, with the per-edition hero slideshow |
| `404.md` | The not-found page |
| `scene-pov.njk` | One page per (chapter, scene, character) from `_data/scenePovPages.js` |
| `chapter-aliases.njk` | `/c/<comment_id>/`, a chapter's permanent citation URL, which survives renumbering |
| `feed.njk` | The Atom feed of chapters by real-world `date` |
| `sitemap.njk`, `robots.njk` | Sitemap and robots, aware of tier gating and staging domains |
| `llms.njk` | `/llms.txt`, an orientation index for language models |
| `version.njk`, `version-latest.njk` | `/version.txt`, what this domain is serving, and the `…/latest/` redirect for versioned pages |

## Media and assets

`images/` (see its README for the conventions), `audio/` (per-edition footer themes), `video/`, `static/` (the favicon), `css/` and `js/`.
