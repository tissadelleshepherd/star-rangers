# `src/css/` — one stylesheet, many palettes

`main.css` is the only file to edit. Every `theme-<name>.css` is generated from it by `scripts/generate-themes.js` (`npm run generate-themes`), which takes `main.css` verbatim and swaps in that theme's `:root` palette, its five POV block colours and the `.character-badge--status-active` literal. Nothing else may differ, and CI fails a PR whose `theme-*.css` does not match a fresh regeneration (the hand-edit drift check).

So after **any** change to `main.css`, structural or palette, run `npm run generate-themes` and commit the results. Editing a `theme-*.css` directly is overwritten on the next run.

Three independent axes meet here (`CLAUDE.md`, *Multi-domain deployment*):

- **Theme** is only a palette. Which domain uses which is `lib/editions.js`.
- **Presentation mode** (`story`, `primer`, `archive`, `contemplative`) is how a domain wants to be read: measure, leading, type size. Implemented as `:root` custom-property overrides in `main.css` keyed off `data-presentation` on `<html>`, so a mode composes with every palette rather than multiplying against them. A mode's rules go in `main.css`, never in a theme file.
- **Edition** is identity and lives in `lib/editions.js`, not here.

Contrast is measured, not eyeballed: `node scripts/check-contrast.js` checks every palette against WCAG 2.2 AA on the pairs `main.css` actually composes, after regeneration, and CI runs exactly that sequence. `solarized` is the one recorded exemption. `theme-wordpress.css` is a tombstone for a retired theme and is skipped.
