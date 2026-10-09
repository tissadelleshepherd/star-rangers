# `scripts/` — gates, deploy, and local tools

Three kinds of file share this directory. Which kind a script is decides who runs it and what breaks if it is wrong. MIT.

## Gates, run by `npm test` or CI

| Script | Catches |
|---|---|
| `validate-content.js` | Malformed front matter against `lib/content-schema.js`, id/filename mismatches, duplicate `comment_id`s, and the image bookkeeping (missing targets, unreferenced files, byte-identical duplicates, the URL each layout actually emits, each edition's hero cast) |
| `check-internal-links.js` | Any `/star-rangers/` link in `src/` or `lib/` that resolves to nothing |
| `check-related-terms.js` | A `related:` term that matches no page title (the fallback link is valid, so nothing else notices) |
| `check-changelog.js` | A released changelog section that has gone missing |
| `check-changelog-coverage.js` | Content pages never mentioned in `CHANGELOG.md`; warns only |
| `sync-version.js --check` | README's version line disagreeing with `package.json` |
| `check-contrast.js` | A palette below WCAG AA on the pairs `main.css` composes; CI only, run after `generate-themes` |
| `generate-themes.js` | Not a gate itself, but CI regenerates and fails on drift |

`TestingStrategy.md` says where each runs and why; `CLAUDE.md`'s *Commands* section describes what each exists to catch.

## Deploy, run on the cPanel host

`cpanel-deploy.sh` is this repo's own. `deploy-lib.sh`, `mail-lib.sh`, `ensure-node.sh` and `cpanel-autopull.sh` are **shared byte-identical with `dermot-cochran-photography`**: CI diffs them against that repo's `main`, so an edit here lands there in the same piece of work. All five are shellchecked at `--severity=warning`. `resolve-edition.js` resolves a domain's identity from `lib/editions.js` for `deploy.conf` keys left unset; `fetch-giscus-ids.js` fetches the comment repo ids. `alias-notice/` is the redirect page installed on decommissioned alias domains. `TECHNICAL-README.md` is the reference for all of it.

## Local authoring tools, never part of the build

Each is marked LOCAL AUTHORING TOOL in its header. `new-content.js` (`npm run new`) scaffolds content. `list-canon-facts.js` aggregates `canon_facts` in story order. The image pipeline: `image-prompts.js` works through `story-bible/images.md` (Gemini config in an untracked `gemini.local.json`, sample beside it), `build-photo-catalogue.js` rebuilds `story-bible/own-photography.json` from the sibling photography checkout, `mark-placeholder.js` stamps a card as unfinished. The card generators: `make-codex-cover.ps1`, `make-emblem-card.ps1`, `make-lore-cards.ps1`, `make-placeholder-card.ps1`, `import-image.ps1` and `image-file.ps1` are Windows-only (GDI+); `make-cards.js` is the cross-platform port of the two designed-card modes and needs `sharp` installed with `--no-save`. `giscus-welcome-posts.md` is authored copy for the comment boards.

A generator cannot spell, so anything with words on it is made by these tools, never by an image model.
