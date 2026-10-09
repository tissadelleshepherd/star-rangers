# `test/` — the unit layer

`node --test test/*.test.js`, built-in `node:test`, no dependencies; the first thing `npm test` runs. One file per `lib/` module or script parser it pins. Run one with `node --test test/content-filter.test.js`.

`TestingStrategy.md` is the authority: what each file guards, why it is a unit test rather than a structural gate, and the rules for extending the suite. In one line each:

| File | Pins |
|---|---|
| `content-filter.test.js` | The narrowing and tier-gate truth tables; the one module where a regression ships content to the wrong readership |
| `classify-content.test.js` | Path classification and the include-or-placeholder decision, with regression cases for the two documented real bugs |
| `storyline-threads.test.js` | `threadForSeason` and the registry invariants the gate assumes |
| `editions.test.js` | The `readingPlan` contract against each edition's own filter |
| `markdown-containers.test.js` | The scene/POV fence-length rule a dependency bump could silently break |
| `image-size.test.js`, `placeholder-marker.test.js` | The two header parsers' null-rather-than-guess contracts |
| `status-key.test.js` | The status badge's class key |
| `archive-backlinks.test.js` | The three reasons a page is listed under a chapter's "In the Archive", prefix-agnostic matching, and the section-then-title order |
| `character-status.test.js` | The five-value character `status` vocabulary and its head-clause match |
| `giscus-boards.test.js` | The two-level comments-board model |
| `check-contrast.test.js` | The contrast checker's palette parser under CRLF |
| `image-prompt-references.test.js` | The `References:` line `image-prompts.js` reads from `images.md` |
| `season-portraits.test.js` | The season pages' portrait strip: a frame surfaces only where its author keyed it, the strip is built from the collection it is handed, placeholders drop, order is deterministic |

The tests use the real registries (`lib/storyline-threads.js`, `lib/editions.js`), not fixtures: a registry change that breaks an expectation should be noticed, not absorbed. A bug fix lands with its regression test.
