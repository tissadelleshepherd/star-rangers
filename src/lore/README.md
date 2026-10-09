# `src/lore/` — settled fact

*Revelation:* every page may carry `revealed_by` (the chapter id whose prose first establishes its subject) and `revised_by` (chapter ids after which it was revised). Nothing is hidden by them; `node scripts/revelation-ledger.js` reads them (rule in `CLAUDE.md`, 2026-09-20).

Lore states what is flatly true in the world: cosmology, institutions, physics, species, places, history. Binding canon, story content under CC BY-NC-ND 4.0, rendered by `_includes/lore-entry.njk` and listed by `index.md` by `category`. A new or changed entry is second-tier work under `CLAUDE.md`.

## Subdirectories

- `planets/` — worlds (`locationType`, `galaxy` in front matter feed the Atlas).
- `universes/` — the other universes of the setting.
- `worldwrights/` — the makers of universes.
- `glossary/canonical-glossary-and-migration-guide.md` — the one reference document here that is **not** a glossary entry: the canonical terms list and the legacy→canonical migration map. *Terminology is law, and this is where it lives.* Renaming a term means updating its list and its map, then sweeping the corpus.

## Front matter

`title` required; `category`, `tags`, `description`, `image`, `image_alt`, `plain` optional. `plain` is a plain-register summary the children's and primer presentations use. Images live in `src/images/lore/`, around 1600px long edge; entries naming a thing with an identity carry a 1600×900 emblem card from `scripts/make-emblem-card.ps1` rather than a photograph.

## The rules that bind this directory

- **Consistent, or move it.** Lore and the glossary never disagree with each other or with themselves. A contested, devotional or paradoxical reading is relocated to `src/codex/` as a named source's account; lore does not pick a winner.
- **Change only by extension, clarification or genuine dilemma** (2026-08-25). Before editing a published page, say which of the three the edit is; if none, it waits.
- **Hard science fiction by default.** A new deviation from real-world physics is a canon change, proposed here with its scope stated, never improvised in prose.
- **Explain gaps in-story.** The Archive is a narrator with limits; *the record has not established this* is a real answer. Explain the epistemology, never invent the fact.
- **Canon is centralised.** Nothing an edition carries may assert a fact; this directory is identical on every domain. `CUSTOM_LORE_FILE` is deprecated for exactly that reason.

`related:`-style cross-references resolve by page **title** (`glossaryUrl` in `.eleventy.js`), so retitling a page silently degrades every list naming it; `scripts/check-related-terms.js` catches that. The homepage's Lore card fronts whichever entry here was touched most recently (`_data/latestLore.js`).
