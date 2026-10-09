# `src/seasons/` — the chapters

The canon narrative, story content under CC BY-NC-ND 4.0. **Every published chapter is canon** (ratified 2026-07-25): each `canon_facts` entry binds, and new prose must be consistent with the whole corpus including the ending.

## Layout

```
s<NN>/index.md                 season index page
s<NN>/e<NN>/index.md           episode index page
s<NN>/e<NN>/s<NN>e<NN>c<NN>.md chapter
```

Season and episode indexes use `layout: base.njk` with hand-written HTML. Chapters use `chapter.njk` and are scaffolded with `npm run new -- chapter`, which sets `date` and generates `comment_id`.

## Chapter front matter (`lib/content-schema.js`)

Required: `title`, `season`, `episode`, `chapter`, `id`, `date`, `comment_id`. Optional: `timestamp`, `location`, `description`, `tags`, `canon_facts`, `povs`, `image`, `image_alt`, `related`.

- `id` (`s<NN>e<NN>c<NN>`) is derived from the three numbers and must match the filename; the validator fails the build otherwise.
- `comment_id` is permanent and moves with the content. It identifies the giscus discussion and the citation URL `/c/<comment_id>/`. Chapters get renumbered to keep chronology, which reassigns URLs; the `comment_id` never changes. Never copy or regenerate one.
- `date` is the real-world publication date and drives the Atom feed. `timestamp` is in-universe free text.
- `povs` lists the viewpoints present, `[{id, label}]`, kept in sync with the blocks in the body. An entry may carry `tier: contemplative` to mirror a gated block.
- `related` names, by exact title, the glossary, lore or codex entries that accompany the chapter in its *From the Archive* aside (since 2026-10-05), beside any page whose `revealed_by` already names the chapter. A title that matches no page drops out silently on the build and fails `scripts/check-related-terms.js`.
- `canon_facts` bind. One rule the toolchain cannot check: no entry may assert that a prayer was answered; the experience is the fact.

## Body structure

Two markdown-it containers from `lib/markdown-containers.js`:

```
::::: scene 1
::: pov elvira
…
:::
::: pov galahad tier=contemplative
…
:::
:::::
```

The scene wrapper uses more colons than any nested POV block, or markdown-it closes the scene early. A chapter with no scene wrapper is one implicit scene. A block marked `tier=contemplative` is dropped from the token stream on every build below that tier, and every tier's reading of a chapter must be complete without the blocks the tier above adds.

## Which thread a season belongs to

`lib/storyline-threads.js` maps season numbers to threads; `threadForSeason` is the only lookup. Seasons 2 (Undercover Pets) and 4 (Orbital Five-O) run storylines that do not pass through Tissadelle. Deliberate mysteries stay shut until their own season. `story-bible/narrative-gaps-checklist.md` is the work list, re-derived from this directory before trusting it.
