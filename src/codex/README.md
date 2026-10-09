# `src/codex/` — primary sources

In-universe documents: logs, reports, proposals, ballads, doctrine, working papers. Rendered by `_includes/codex.njk`, listed by `category`, and each fronted by a designed title card in `src/images/codex/` (from `scripts/make-codex-cover.ps1`; a generator cannot spell, so the words are set by the tool). Story content under CC BY-NC-ND 4.0.

*Revelation:* an entry may carry `revealed_by` and `revised_by` like a lore page (rule in `CLAUDE.md`, 2026-09-20); nothing is hidden by them.

**The Codex is not canon; each entry is canon-for-its-author.** `author` is required on every entry for that reason (`lib/content-schema.js`): an entry with nobody behind it has no point of view to be valid from and silently becomes Archive-voice fact. Codex entries carry no `canon_facts`. Optional front matter: `category`, `library`, `institution`, `location`, `tags`, `image`, `image_alt`.

Two tests govern what goes here:

- *Could this person have known this, and would they have written it this way?* — not *is this true?* An entry may be partial, self-serving, devotional or wrong in its author's voice, but never arbitrary.
- **Flavour and debate, never doubt about canon** (2026-08-21). After reading, is canon less settled than before? If yes, the entry has overstepped. State the record's own position where one exists; let a tradition keep its language without conceding the thing it names is open.

A third test binds entries written for the spiritual edition — those tagged `church-space`, `communion-of-the-called` or `cnoc-na-mbeach` (Dermot's ruling, 2026-09-06, on the physics rule's pattern): *could a mainstream Christian in this world, knowing what canon lore has established, have written this?* Mainstream means the creedal consensus; canon lore is the only licence to depart from it, and where lore supersedes, the entry shows the yielding in its author's voice. Entries the edition inherits from other traditions are not bound by it.

This is where contested readings **move to** when lore or the glossary is found arguing with itself, and it is one of exactly three homes for an answered prayer or a heard voice (with a POV block and the church-space overlay); the Archive never claims one in its own voice.

`character.njk` renders a character's `known_codex` list as links here, resolved by filename slug; the validator checks each slug names a real file.
