# `src/glossary/` — the terms

One page per in-universe term, rendered by `_includes/glossary-entry.njk`, grouped by `category` on `index.md`. Binding canon like lore, and under the same rules (see `src/lore/README.md`): consistent or relocated to the Codex, changed only by extension, clarification or dilemma. Story content under CC BY-NC-ND 4.0.

Front matter: `title` required; `id`, `category`, `short`, `related`, `plain`, `revealed_by`, `revised_by` optional (the last two are the revelation fields, see `CLAUDE.md`, 2026-09-20; they hide nothing). `short` is the one-line definition listings show; `plain` the plain-register version; `related` a list of page **titles** that `glossaryUrl` resolves against glossary and lore titles, falling back to `/glossary/` on a miss rather than erroring. That fallback is why `scripts/check-related-terms.js` exists and is part of `npm test`: matching is exact, case, punctuation and leading articles included, and the script prints near-miss suggestions.

This directory holds the entries. The canonical-terms list and the migration map that govern them are the reference document at `src/lore/glossary/canonical-glossary-and-migration-guide.md`. Craft vocabulary about how the story is built (thread, strand, arc, scene, POV block) is not in-universe and belongs in `story-bible/`, not here.

A coined alien pronoun paradigm (subject, object, possessive) is registered here like any term, declared once in the species' lore entry and applied consistently.
