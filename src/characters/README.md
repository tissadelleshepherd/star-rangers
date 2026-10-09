# `src/characters/` — character pages

One Markdown file per character, being, construct or entity, rendered by `_includes/character.njk` and listed by `index.md` as a card grid. Story content under CC BY-NC-ND 4.0; a new or changed page asserts facts about the world and is second-tier work under `CLAUDE.md`'s *Authority and review boundary*.

**Front matter** (`lib/content-schema.js`): `title` and `id` are required; `species`, `role`, `status`, `aliases`, `tags`, `description`, `image`, `image_alt`, `gallery` and `known_codex` are optional. Scaffold with `npm run new -- character`.

- `id` is the key the rest of the site uses: `::: pov <id>` blocks in chapters, `povs:` front matter, `heroCharacterIds` in `lib/editions.js`, `CHARACTERS` narrowing in `deploy.conf`. It is not always the filename (`tissadelle` lives in `tissadelle-shepherd.md`).
- `status` renders as a badge. Its class key is the status's head clause, slugified (`lib/status-key.js`), so *Active*, *Historical*, *Retired*, *At large* and *Contained — …* each have a style in `main.css`; a new status value takes the default pill until one is added.
- `image` is a filename under `src/images/characters/`; portraits are generated to 1200×675 to match the 16:9 slot in `main.css`. A page may have no image (some do), or a stamped PORTRAIT PENDING card. `gallery` items live in `src/images/characters/<id>/` and may carry a `caption`.
- `known_codex` lists codex slugs the character is aware of in-universe; the validator checks each names a real file.
- `tags` drive `TOPICS` narrowing and the tier gate by membership: a character tagged into a tier-gated thread is a placeholder below that tier.

**Conventions the pages follow** (derived from the corpus, not enforced): untitled opening prose, then H2 sections, with *Character Notes* on nearly every page and *Known History* on many. No generic honorifics (*Mr., Mrs., Ms.*): full name, rank or role, or nothing. Alien pronoun systems are declared per species in `src/lore/`, never improvised per page.

A scene-POV page follows its character, not its chapter: it is real content on a narrowed build only when the witness is named in `CHARACTERS` or their own page is included by tags.
