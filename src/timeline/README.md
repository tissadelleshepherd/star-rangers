# `src/timeline/` — the order of events

The confirmed order of events, apart from when the narrative chooses to reveal them. Story content under CC BY-NC-ND 4.0.

Timeline entries are the one content type without a dedicated layout or scaffold: each uses `layout: base.njk` with a hand-written HTML body, and `TIMELINE_TYPE` in `lib/content-schema.js` covers validation only. `title` and `sort_order` (numeric) are required; `index.md` orders by `sort_order`. To add one, copy an existing entry's front matter and write the body by hand.

Filenames carry the date or relative position for people (`2723-star-rangers-charter.md`, `year-minus-3-elvira-arrives.md`, `pre-usc-…`); `sort_order` is what the site actually uses. The `year-minus-` filenames are permalinks and stay, but the relative *Year -N* labels they once carried in text were retired on 2026-09-06: every date in an entry is now absolute — `<year> UCSD`, and for events before the standard's adoption an AD or CE date, with the UCSD conversion beside it where the record gives one. Dates and elapsed-time figures are where contradictions hide; `story-bible/canon-consistency-audit-2026-07.md` records the last sweep, and a genuine chronology error is a fix, never diegetically excused.

A timeline page acquires the tier gate by its tags, like any topic page.

An entry may carry an optional `plain:` line (since 2026-10-05): a plain-language summary that `index.md` shows in place of `summary` on a children's-tier build, where the index also opens with a plain intro. An entry tagged into a children's edition (`undercover-pets.com`) should have one, written to the entry as published and never as a second account of it, the same rule the glossary's `plain:` lines follow.
