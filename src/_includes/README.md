# `src/_includes/` — layouts

Nunjucks layouts, engine code under MIT. `base.njk` is the outer shell every page renders through; the others are one per content type and each sets the `comments`/`commentsCategory` front matter that decides whether `base.njk` embeds the giscus widget.

| Layout | Used by |
|---|---|
| `base.njk` | Everything: header, navigation, search box, the reading-mode control, footer audio, giscus embed, Open Graph meta, the `data-presentation` attribute the presentation modes key off |
| `chapter.njk` | Chapters: breadcrumb, POV buttons (filtered by tier via `povsForTier`), canon-facts toggle |
| `scene-pov.njk` | Scene-POV pages from `src/scene-pov.njk` |
| `character.njk` | Character pages: badge row, portrait, gallery, known codex documents. The status badge's class comes from `lib/status-key.js` |
| `lore-entry.njk`, `glossary-entry.njk`, `codex.njk`, `journal-entry.njk` | Their content types |
| `excluded.njk` | The placeholder a narrowed or tier-gated build renders at a page's normal URL instead of the page, so no link ever 404s |
| `superseded-note.njk` | The forward note on a locked page that has been replaced by a newer version |
| `season-portraits.njk` | The *Portraits from this season* strip every `src/seasons/sNN/index.md` includes: the character frames keyed to that season (`lib/season-portraits.js`), rendering nothing when none is |

Two things worth knowing before editing a layout. Inclusion is decided in `.eleventy.js`'s `eleventyComputed` by input path, not by `layout` (see the long comment at the top of that file: `layout` is itself one of the overridden fields). And each layout hardcodes the `/images/<category>/` prefix it prepends to a page's `image:` value; `scripts/validate-content.js` checks the URL a layout will actually emit, so keep that prefix and the schema's `dir` in step.
