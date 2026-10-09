# `src/js/` — progressive enhancement only

Three scripts, engine code under MIT. Every page is fully readable without any of them; that is a rule, not a courtesy (`CLAUDE.md`: the site stays static, no accounts, no logins, reader state is client-local or nothing).

| File | Adds |
|---|---|
| `pov.js` | The POV filter buttons on a chapter and the collapsible canon-facts panel |
| `presentation.js` | The header's "Reading" control, a per-reader override of the domain's presentation mode kept in one `localStorage` key and falling back to the edition's own mode whenever storage throws. `base.njk` also carries an inline restore script in `<head>` so the page does not paint in one mode and jump to another |
| `search.js` | Wires the header search box to the Pagefind index that `npm run build` generates after Eleventy. Loaded via dynamic import, so under `npm run start`, which does not run Pagefind, search silently does nothing |

`scripts/check-internal-links.js` scans these files for `/star-rangers/` links, so a path written into a script is checked like a link in a page.
