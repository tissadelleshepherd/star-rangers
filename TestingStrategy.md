# Testing Strategy

How this repository is tested, what each layer exists to catch, and how to
extend it. Mechanics live here; the authority rules they serve live in
`CLAUDE.md` ("Authority and review boundary").

## The governing principle

**The gates prove structure, not judgement.** Everything below can show that a
page is well-formed, uniquely identified, fully resolved, and that the engine's
logic behaves as pinned. Nothing in the toolchain can show that a sentence is
*true in this world*, in the house voice, or safe to be bound by later — that
review is Dermot's and is deliberately not automated. The test suite's job is
to make the mechanical failures impossible so the human review is spent only on
the judgement calls.

Two corollaries shape what gets tested first:

- **The tier gate is the highest-stakes logic in the repo.** A regression in
  `lib/content-filter.js` doesn't break a build — it ships a contemplative
  thread's pages (church-space) on every general-tier domain, the canonical
  site included, or silently empties a production edition. That module gets
  the densest regression coverage.
- **Every documented real bug becomes a test.** The layout-vs-inputPath hazard
  and the journal fallthrough were both real incidents; both are now pinned in
  `test/classify-content.test.js` so they cannot recur unnoticed.

## Layer 1 — unit tests (`test/`, `node:test`, no dependencies)

Run all: `node --test test/*.test.js` · one suite: `node --test test/content-filter.test.js`

- **`test/content-filter.test.js`** pins the narrowing/tier-gate truth
  tables as executable statements of the two rules: *ordinary content is
  included unless a filter narrows it out; a tier-gated thread is excluded on
  every build below its tier whatever the filter says, and is ordinary content
  at or above it.* It covers the no-filter build at each tier (selected through
  the real `EDITION` resolution), narrowed builds that do and don't name
  church-space, the proof that naming it no longer opens the gate below its
  tier, season-membership exclusion, the signature-tag tripwire, and the
  `relatedUrls` bio-link walk (run against the real `src/characters` corpus).
- **`test/classify-content.test.js`** pins `classifyContentPath`,
  `isRelatedTopicPageIncluded` and `isContentIncluded`
  (`lib/classify-content.js`, extracted verbatim from `.eleventy.js` on
  2026-08-24 precisely so they could be tested without booting Eleventy),
  including the two regression tests above and the proof that `relatedUrls` is
  not a backdoor around the tier gate.

- **`test/markdown-containers.test.js`** (added 2026-08-27) pins the
  scene/POV rendering, above all the **fence-length rule**: a 5-colon
  `::::: scene` wrapper must not be closed early by a nested 3-colon
  `::: pov` block's closing fence. That behaviour lives in
  markdown-it-container, not in this repo's code, so a dependency bump that
  changed it would silently corrupt scene splitting for every chapter —
  `src/_data/scenePovPages.js` parses the same token stream. Also pinned:
  the emitted `data-scene`/`data-pov`/`aria-label` attributes,
  HTML-escaping of the info strings, standalone pov blocks (the implicit
  single scene), and that an invalid info string renders as plain text.
- **`test/storyline-threads.test.js`** (added 2026-08-27) pins
  `threadForSeason` (every registered season to its thread, the
  `UNSORTED_THREAD` fallback for unclaimed seasons, numeric matching for
  string input) and the registry invariants the tier gate assumes:
  no season claimed by two threads, unique thread ids, no thread carrying the
  retired `private` flag, and every tier-gated thread naming a tier on the
  ladder and a `homeDomain` distinct from the default reference domain.
- **`test/image-size.test.js`** (added 2026-08-27) pins the JPEG/PNG header
  parser's "null rather than guess" contract with hand-built buffers:
  dimensions read from a PNG IHDR and from a JPEG SOF behind a skipped
  APP0 segment, and null for truncated files, malformed segment lengths,
  missing SOF markers, zero dimensions, non-images, unreadable paths —
  plus the by-path memoisation.
- **`test/archive-backlinks.test.js`** (added 2026-10-02) pins `lib/archive-backlinks.js`, the derivation behind the chapter layout's "In the Archive" block: a page is listed for exactly three reasons (a link to the chapter's URL, a link to its `/c/` alias, or a `revealed_by` / `revised_by` naming it), matching ignores the site prefix because the source is scanned rather than the output, and the order is section then title so the block is stable across builds. A regression here would silently drop the record's own commentary from under a chapter, which nothing structural would notice.
- **`test/archive-companions.test.js`** (added 2026-10-05) pins `lib/archive-companions.js`, the derivation behind the chapter layout's "From the Archive" aside: an entry accompanies a chapter for exactly two reasons (its `revealed_by` names the chapter, or the chapter's `related:` names its title), a title resolves glossary-first against the pages this build carries and drops silently when none does, the text shown is the entry's own `short` or `description` with the `plain:` line taking over on the children's tier, and the order is section then title. A regression here would either show a placeholder's entry on a narrowed edition or quietly empty the aside, and neither is a structural failure anything else would catch.
- **`test/related-terms.test.js`** (added 2026-10-04) pins `lib/related-terms.js`,
  the resolver behind the glossary layout's Related Terms list: a `related:`
  term resolves by exact title against the collections this build carries,
  glossary first, then lore, and a miss is **null, never the glossary index**.
  The regression it guards: on a narrowed edition the collections are already
  filtered, so an excluded page's term used to fall back to `/glossary/`, and
  undercover-pets.com's one glossary entry (Smart Pet) linked all five of its
  related terms to an index none of them was on. The layout now renders only
  the terms that resolve and omits the aside when none do.
- **`test/status-key.test.js`** (added 2026-09-06) pins `lib/status-key.js`,
  the class-name key for a character's status badge: the head clause before
  an em dash, colon, semicolon, comma or parenthesis, slugified. It holds the
  invariant that the single-word statuses key exactly as the old lowercase
  did (so no badge rule silently unmatches), that "At large" hyphenates, and
  that a qualified status such as Ilse Korvain's keys as `contained`.
- **`test/character-status.test.js`** (added 2026-09-11) pins `CHARACTER_STATUSES`
  and `characterStatusProblem` in `lib/content-schema.js`: the character
  `status` vocabulary is exactly the five the corpus uses, each label keys to
  its own entry under `statusKey`, a qualified value is accepted on its head
  clause, absence is accepted (the field is optional), and anything outside
  the five is refused with a message naming them. `validate-content.js`
  applies the check to every character page; this pins the rule itself.

The filter tests deliberately use the **real** `lib/storyline-threads.js`
registry, not fixtures: church-space being the only tier-gated thread is itself a
documented decision, and a registry change that breaks these expectations
should be noticed, not absorbed (the registry-invariant suite above makes the
same point structurally).

## Layer 2 — structural gates (`npm test`)

In order after the unit suite:

| Gate | Catches |
| --- | --- |
| `scripts/check-changelog.js` | released sections missing/rewritten (two release records were destroyed this way once) |
| `scripts/check-changelog-coverage.js` | **warns only, never fails** — content pages the changelog never mentions by path, slug or title. The mirror image of the gate above: that one catches history being destroyed, this one catches history never being written. Deliberately not a gate — see below |
| `scripts/validate-content.js` | front-matter schema violations, id/filename mismatches, duplicate `comment_id`s, the image bookkeeping (missing targets, unreferenced files, byte-identical duplicates, layout-emitted URLs), each edition's hero cast |
| `scripts/check-internal-links.js` | a cross-link to a page renamed or never written — schema and dry run both pass on those; since 2026-10-09 also a `#fragment` that lands on no heading id or literal `id="…"` of the target page, resolved through the build's own markdown renderer |
| `scripts/check-related-terms.js` | a `related:` term that silently falls back to `/glossary/`; warns (without failing) on duplicated page titles |
| `scripts/check-children-glossary.js` | a page a children's-tier edition carries, or that edition's own copy in `lib/editions.js`, linking a glossary entry the edition renders as a placeholder, or one with no `plain:` line; an entry the tier carries without one. Warns on an entry the tier carries that nothing on it links. A carried entry's own onward links are not enforced (one hop from the story, never the closure); their count is printed (since 2026-10-05; the rule is in CLAUDE.md) |
| `scripts/sync-version.js --check` | README/package.json version drift |
| `scripts/sync-story-so-far.js --check` | README's story-so-far table not regenerated at the current version (its stamp names the version it was last written at; counts themselves are refreshed per release, not per chapter, by the `version` hook) |
| `eleventy --dryrun` | template and build errors, without writing `_site/` |

The gates don't subdivide — `validate-content.js` always scans everything. To
iterate on one content file, use `npm run start` and visit the page.

### Why changelog coverage warns instead of failing

Added 2026-09-01, after an audit of all 674 first-parent commits on `main`
found **24 content pages that had shipped without ever being mentioned in the
changelog** — eight glossary entries, eight timeline entries, four codex, three
lore, one journal. `scripts/`, `lib/` and `test/` were fully covered, which
says something about the shape of the failure: engine work is usually the point
of its PR, while a supporting glossary or timeline entry rides along with
whatever the PR was really about, and it is the passenger that gets forgotten.

It could have been a gate, and deliberately isn't. **Whether a change deserves
a changelog line is a judgement**, and the authority boundary in `CLAUDE.md`
keeps judgement out of what a gate may decide — the toolchain can prove a page
is well-formed, not that it is worth a reader's attention. And the obvious gate
— *a PR touching `src/` must touch `CHANGELOG.md`* — is **satisfiable by a junk
line**, which would manufacture the appearance of coverage without the
substance. That is the same failure this project already names in
`check-changelog.js`'s own header: a check that passes for the wrong reason is
worse than no check.

**The condition for keeping it: the count normally reads zero.** The backlog was
filed as a changelog entry *before* the script was wired into `npm test`,
because a warning that never reaches zero is noise people learn to skip past. If
it is ever allowed to sit at a permanent nonzero number, retire it rather than
tolerating it — the same rule `sync-version.js` states about its own anchor.

## Layer 3 — CI-only gates (`.github/workflows/ci.yml`)

- **Theme sync and contrast**: `generate-themes` → `git diff --exit-code
  src/css` (a hand-edited `theme-*.css` fails; `main.css` is the source of
  truth) → `check-contrast.js` (WCAG 2.2 AA on the pairs `main.css` actually
  composes; `solarized` exempt, stated in the script). This lives in CI rather
  than `npm test` because it is only correct *after* regeneration, and CI can
  guarantee that ordering where a local convention can't.
- **Shared-scripts identity**: diffs `deploy-lib.sh`, `mail-lib.sh`,
  `ensure-node.sh` and `cpanel-autopull.sh` against
  `dermot-cochran-photography`'s `main`. Pre-existing drift fails; a PR that is
  itself changing a shared script warns only, since the identical edit lands in
  the sibling as its own PR and one of the two has to merge first. (Its first
  run caught real drift: the 15 August gap-alert default had never reached the
  sibling.)
- **ShellCheck** (`--severity=warning`) over all five deploy scripts.

## Deliberately not automated

- Anything requiring judgement about the world: canon consistency, house
  voice, tone. `scripts/list-canon-facts.js` exists as an *informational* aid
  for the spoiler test — never a gate.
- The Windows-only `.ps1` image tools.

## Extending

- **New content-bearing field or page type** → check whether it must
  participate in the `isXIncluded` predicates (`lib/content-filter.js`) and
  `classifyContentPath` (`lib/classify-content.js`), *and add the truth-table
  rows to `test/content-filter.test.js` in the same change* — otherwise it
  silently always/never ships under a narrowed deploy.
- **New checker script** → decide its home by ordering dependencies: no
  prerequisites → `npm test`; depends on another script having run →
  CI, sequenced in one step, per the contrast precedent.
- **A bug found in production or review** → its regression test lands in the
  same PR as the fix.

### README files inside `src/`

Every subdirectory carries a `README.md` for people (added 2026-09-06). They
are not content and not pages: `.eleventyignore` excludes `src/**/README.md`
from rendering, the five passthrough copies in `.eleventy.js` filter the file
out so no domain serves `/css/README.md`, and each walker that treats `.md` as
content (`validate-content.js`, `check-changelog-coverage.js`,
`check-related-terms.js`, `list-canon-facts.js`, `src/_data/latestLore.js`)
skips the name. A new walker over `src/` should do the same, or a README in
`src/characters/` will fail schema validation as a character with no `id`.

## Known open items

- "Commissioned Standing" is a duplicated page title (`src/glossary/` and
  `src/lore/`); `check-related-terms.js` warns on it every run until one page
  is retitled — a content decision, not a tooling one.
