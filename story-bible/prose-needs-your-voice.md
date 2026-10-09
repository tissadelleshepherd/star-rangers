# Pages needing your own prose

> **Voice and style approved 2026-07-25 (Dermot's decision):** no longer a
> voice-review queue. After reading the narrative scenes — particularly the
> multi-POV scene structure, which he singled out for the mystery it
> creates — Dermot approved the **voice and style** of all existing prose
> in the repository, including everything listed below. Nothing here is
> waiting on a tone pass or a rewrite for register.
>
> Three things that approval is *not*:
>
> - ~~**Not a canon ruling.**~~ **Superseded the same day:** Dermot's
>   follow-up — "no reason why all seasons would not now be taken as
>   canon" — ratifies the content too. Every published chapter in every
>   season, including the six Season 6–7 files below, is canon. Nothing in
>   `src/seasons/` is provisional any more.
> - **Not, in itself, the drafting permission.** That came separately and
>   later the same day: Dermot granted **standing permission to write new
>   scenes** without being asked, retiring the old "Dermot writes every
>   narrative first draft" rule. `CLAUDE.md`'s prose-authorship bullet
>   carries the operative version and its constraints (write to the gaps,
>   leave deliberate mysteries and reserved seasons alone, match the
>   scene/POV structure, report what was written). This list stays
>   accurate under that permission — it just stops being a reproach and
>   becomes a map of where his own hand is absent.
> - **Not the end of this list.** It is kept as a **provenance record**: it
>   still answers "which pages has Dermot never personally written a word
>   of," which matters for attribution and for knowing where his own voice
>   is and isn't the base layer.
>
> What it *does* establish: the prose in this repository is the reference
> for the house voice. Draft new work to match it rather than to some
> other register.

Planning note (not built into the site — lives in `story-bible/` like the
other authorial notes). Built 2026-07-23 from git history: every content
file under `src/{seasons,lore,characters,codex,glossary,timeline}/` whose
**entire authorship history has no commit from Dermot Cochran** — i.e.
every word currently on the page was written by an AI tool
(the original Copilot bootstrap, or a later Claude Code session), and you
have never personally written or revised it.

This is the front-to-back list. A shorter, separate list —
`prose-needs-review.md` — covers pages you *did* write, that AI has since
edited and which may need a tone check.

## Resolved: the Season 6–7 chapters

`src/seasons/s06/` and `src/seasons/s07/` contain drafted chapters
(`s06e01c01/c02/c03.md`, `s07e01c01/c02/c03.md`, dated 2026-07-21) — entirely
AI-authored, and written *after* `story-bible/narrative-gaps-checklist.md`
last claimed "zero chapters exist anywhere in `src/seasons/`" for
Season 6–7 (that checklist was corrected on 2026-07-24 and now lists all
six files by name). This flag originally
asked for a direct look, since Season 6–7 is the climax ("The Last Stand")
and these chapters had appeared without one.

**Status 2026-07-25 — closed.** Voice and style approved, and then the
content ratified with every other season: these six chapters are canon.
Their `canon_facts` bind, and the arc they describe — Dock Seven, the
stalled noöseed, the levril at the warm edge, the contested public
record — is the story's, not a proposal.

Ratification made one arithmetic error load-bearing, so it was fixed the
same day: `s06e01c02` twice called Threshold's chronometer discrepancy
"eleven years" old, which is its age in 2826 (S1), not 2831 (S6). Now
sixteen. Expect more of this — five seasons of drafts written while the
back half was provisional will have absorbed other numbers that only
matter once they bind.

## Season chapters (actual narrative prose — highest priority)

- Season 0 (Founding Era): all of `s00/e01`, `s00/e02`, `s00/e03` (indexes + 6 chapters)
- Season 1: `s01/e00` (4 chapters, Elvira/Aldera prequel), `s01/e01` (2 ch),
  `s01/e02` (5 ch), `s01/e03/s01e03c01.md`
- Season 2: `s02/e01` (index + 3 chapters) — per the gaps checklist this
  season is "deliberately open," so confirm this drafted content is meant
  to exist at all
- Season 3: `s03/e01` (index + 2 chapters)
- Season 5: `s05/e02` (index + 2 chapters)
- Season 6: `s06/e01` (index + 3 chapters) — see flag above
- Season 7: `s07/e01` (index + 3 chapters) — see flag above
- Section indexes: `src/seasons/index.md`, and the `s00`/`s01` season indexes

## Characters (34 files + index)

`agent-barsik`, `bertram-ashcombe`, `brother-daire`, `brother-fintan`,
`bubochka`, `cormac-dubhghlas`, `dagny-voss`, `demelza-trevithick`,
`dorian-calloway`, `fergus-aonghas`, `idris-bryneth`, `ilsabet-marrowtide`,
`ilse-korvain`, `imogen-petrakis`, `isren-farrowkin`, `jeeves`, `kai-larsen`,
`lorien-the-wanderer`, `maren-solveig-krast`, `mira-of-brine`, `nessa`,
`niamh-o-ceallaigh`, `orla-shepherd`, `petra-voss`, `qiren-tal`,
`rhian-gwynne`, `rhiannon-ceridwen`, `rook-7`, `saint-aoife`, `sen`, `sohrel`,
`wendell-albercombe`, `zara-wayland`, plus `characters/index.md`.

Note the overlap with the image audit: `ilse-korvain`, `orla-shepherd`,
`maren-solveig-krast` also had wrong-content portraits flagged there — these
three characters have never had either their prose or their image
touched/chosen by you.

## Lore (36 files + index)

`arilon`, `boundary-zones`, `cerebraun`, `chthonari`, `cnoc-na-mbeach`,
`concordant-membranes`, `dryadic-trees`, `eden-ring-rail`,
`ensemble-multiverse`, `federation-of-sentient-beings`, `five-layers`,
`formation-of-star-rangers`, `frontier-transformation-protocols`,
`galactic-stardate`, `membrane-shadows`, `military-space-command`,
`mnemari`, `monasteries-of-mars`, `planetary-liaisons-and-recruiters`,
`planets/prismere`, `planets/saltmere`, `planets/sentinel`,
`planets/verdance`, `post-eleven-dimensional-manifold`,
`post-teleport-ascension-stress-disorder`, `prismeri`,
`quantum-space-harmonics`, `saint-aoife`, `solar-time-and-local-calendars`,
`star-rangers-command-hierarchy`, `star-rangers-science-corps`,
`teleportation-limitations`, `universal-cosmic-stardate`,
`universes/tir-tairngire`, `year-zero`, plus `lore/index.md`.

Three of these (`five-layers`, `formation-of-star-rangers`,
`frontier-transformation-protocols`) are also the three lore pages with the
scrambled image/alt-text bug from the image audit — worth tackling image and
prose together on those three.

## Glossary (21 terms + index)

`boundary-zone`, `concordant`, `constraint-literacy`, `cyborg`, `frenar`,
`higher-dimensional-folding`, `hyperomnium`, `instrument-drift`,
`intermembrane-bleed`, `krenyi`, `membrane-shadow`, `metafold`,
`noogenic-protouniverse`, `overfold`, `plural-minds`,
`quantum-space-harmonic-wave`, `slipwave`, `smart-pet`, `universe-overlap`,
`virtual-reality`, plus `glossary/index.md`.

## Codex (4 files + index)

`baby-universe-ballad`, `cosmic-limitation-on-evil` (also the stray/broken
image from the audit), `telling-the-bees-at-cnoc-na-mbeach`,
`the-warm-edge-correlation`, plus `codex/index.md`.

## Timeline (7 files + index)

`2712-eden-fold-route`, `2714-patience-first-departs`,
`2719-outer-stations-consolidation-hearing`,
`year-0-causeway-convergence`, `year-minus-2-aethelrock-rotation-dispute`,
`year-minus-3-aldera-reaches-causeway`, plus `timeline/index.md`.
