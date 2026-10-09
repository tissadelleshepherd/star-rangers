# Fian Ilchruinne

The stars call us forward with hope: protect what is good, and learn what is true.

*Fian Ilchruinne* is a world that no one really understands but everyone tries to explain in their own way: an Eleventy-powered multi-viewpoint hard-science-fiction novel with one licensed deviation. It begins with a station clock that has held a false reading for eleven years. From there, the project opens into a contested history of memory, duty, institutions, and the fragile civic lights that survive at the edge of the known world.

## Synopsis

Threshold Station keeps logging the same impossible discrepancy: two wall chronometers forty seconds apart, and they have stayed apart for eleven years. Nobody senior will file about it. In 2826 UCSD, three transfers arrive on the same day and discover they are now a survey team — Sir Galahad Thorne, who has learned to read the station's wrongness before his instruments do; Syra, a Krenyi observer who reads a place rather than scanning it; and Rook-7, an analytical robot whose first log entry already asks whether the administration's silence is incompetence or a decision. What they find reframes the problem: the drift is not a malfunction but a condition. The station sits where the boundary between two Concordants has thinned, and the clocks disagree because the time genuinely differs.

There is no magic in this record. What looks supernatural — the thing Elvira has spent three years trying to shut out at the Marsh Causeway, the adaptive presence the cyber-enhanced cat Aldera has been shadowing for her Detective Agency — is boundary interference and Etheric structure expressing through ordinary physics, and it can be measured, named, and survived by people willing to be precise. The real fight is institutional: what the public record is allowed to say, and who would rather file a hazard under noise than admit it isn't understood.

The chronological spine of the series belongs to Tissadelle Shepherd. As a newly-made Principal at the Halyx Relay Station she hears musical structure in an EM pulse that three centuries of classifiers filed as an automated hazard beacon — and learns that getting a reclassification approved is the harder problem. As a Line Captain she carries a data exchange home to Tír na nÓg and finds the boundary she was trained to name waiting in her mother's back hollow, on a planet where the Star Rangers hold no jurisdiction at all. Under the 2723 Charter the Rangers act only by invitation, for the matter the invitation covers — so every season turns on the same pressure: keeping the record true inside institutions that own the ground, the archives, and the right to refuse. Her arc runs from those first postings to what the record calls the Last Stand, and to what the Last Stand leaves behind.

Around that spine run the other storylines. The Founding Era looks back to the years under Military Space Command rule that made the Star Rangers both necessary and possible — before the Charter, and before Threshold's drift had a name. Undercover Pets follows the Undercover Pets Detective Agency and the animals around it: Agent Barsik's working file, trainee Bubochka's exercises, and the specimen the record still cannot classify. Orbital Five-O rides with Commander Kai Larsen's Governor's Investigative Task Force, closing the jurisdictional gap none of the five self-governing Compact habitats could close alone. Young Star Rangers takes the Corps from the bottom rung, a raw Deputy's first year. Below the Roof goes down into Fliade's deep networks with the Pandoids, a people who keep their record by speaking it, written for the child reader. Five Islands reads a human kingdom from inside its own three records, the chronicle told, the Accounting written, and the Castle's people written in light.

The story moves across stations, causeways, archives, and boundary zones in the long afterlight of empire, and every chapter can be reread from another witness's point of view. As the viewpoints converge, the question sharpens: who gets to name the truth when history itself has started to slip?

## Site sections

- **Seasons & Episodes** (`/seasons/`) — Read the canon in story order, grouped by storyline thread, then shift POV within chapters to watch one event survive conflicting witnesses.
- **Threads** (`/threads/`) — Browse the independent storylines that group the seasons — each thread is a self-contained narrative with its own cast.
- **Characters** (`/characters/`) — Track the people, beings, constructs, and entities carrying the story forward.
- **Timeline** (`/timeline/`) — Follow the confirmed order of events apart from when the narrative chooses to reveal them.
- **Lore** (`/lore/`) — Step outside the story for the cosmology, institutions, and systems that shape the setting.
- **Glossary** (`/glossary/`) — Fix the meaning of in-universe terms, titles, and concepts when language itself is contested.
- **Codex** (`/codex/`) — Read the primary sources: logs, reports, directives, and records that may clarify the truth or bury it.
- **Journal** (`/journal/`) — Out-of-character: Dermot R. Cochran's own notes on the reasoning, wrong turns, and small decisions behind the story, kept alongside About as the site's two non-diegetic sections.

## The story so far

Grouped by storyline thread — see [Site sections](#site-sections) and [`lib/storyline-threads.js`](./lib/storyline-threads.js) for what a thread is. The full chapter list lives on the site itself, under [Seasons & Episodes](./src/seasons/) and [Threads](./src/threads/); this summary is deliberately thread-level so it doesn't go stale chapter by chapter.

<!-- story-so-far:begin -->
| Thread | Seasons | Chapters | What it is |
|---|---|---|---|
| **Founding Era** | 0 | 6 | The years that made the Star Rangers both necessary and possible, under the last stretch of Military Space Command rule — before the Charter, and before Threshold Station's drift had a name. |
| **Tissadelle Shepherd's Arc** | 1, 3, 5–7 | 36 | The chronological spine of the published series — Cadet to Principal to Line Captain to the Last Stand, and what the Last Stand leaves behind. |
| **Undercover Pets** | 2 | 15 | The Undercover Pets Detective Agency and the animals around it — Agent Barsik's working file, trainee Bubochka's exercises, and the specimen the record still cannot classify. |
| **Orbital Five-O** | 4, 10 | 9 | The Governor's Investigative Task Force — Commander Kai Larsen closing the jurisdictional gap none of the five self-governing Compact habitats could close alone. |
| **Young Star Rangers** | 9 | 5 | The Corps from the bottom rung — Cadets and Deputies in their first field postings, and the year in which a raw Deputy learns what the rank means. |
| **Below the Roof** | 11, 12 | 17 | The Pandoids of Fliade from inside the deep networks — a people who keep their record by speaking it, met on their own ground rather than the survey's; written for the child reader. |
| **The Infinite Castle and the Timeless Library** | 13 | 4 | The Kingdom of the Five Islands from inside its own records — the court's chronicle recited under a tree, the Abbey's Accounting in a hand that has never changed, and the Castle's people written in light. The record's first epic-fantasy thread, a reading never a mechanism. |
| **Church Space** | 8 | 2 | An overlay for the contemplative reading tier, served on its own editions: the same events read through an explicitly Christian lens. Commentary, not canon; absent from the general-tier site. |

Chapter counts as of 9 October 2026 (version 1.36.0); regenerated by `scripts/sync-story-so-far.js` at every version bump, and the seasons index on the site is always current.
<!-- story-so-far:end -->

## Release notes

Current version: **1.36.0**. See [`CHANGELOG.md`](./CHANGELOG.md) for the full version history — lore/canon changes, deployment features, and fixes are all tracked there under [Semantic Versioning](https://semver.org/). The release process is documented in [`TECHNICAL-README.md`](./TECHNICAL-README.md#cutting-a-release). (The "Current version" line and the story-so-far table stay in this file: `scripts/sync-version.js` and `scripts/sync-story-so-far.js` anchor on them here, rewrite them on `npm version`, and fail `npm test` if they move.)

## License

This repository carries two separate licences, so the engine can be freely forked without implying any rights over the story itself:

- **Code** (`.eleventy.js`, `lib/`, `src/_includes/`, `src/css/`, `src/js/`, `scripts/`, and everything else not listed below): **MIT** — see [`LICENSE`](./LICENSE). Fork it, run it for your own site, adapt it freely.
- **Story content** (`src/seasons/`, `src/threads/`, `src/characters/`, `src/timeline/`, `src/lore/`, `src/glossary/`, `src/codex/`, `story-bible/`, `prompts/`): **CC BY-NC-ND 4.0** — see [`CONTENT-LICENSE.md`](./CONTENT-LICENSE.md). Share it non-commercially with attribution, but don't redistribute adapted/derivative versions of *Star Rangers* itself — **except** non-commercial fan works (fan fiction, fan art, and fan fiction clones of this repo), which `CONTENT-LICENSE.md`'s Fan Works Policy explicitly permits.

If you fork this repo to run your own **original** multi-viewpoint fiction site, replace everything under the content paths above with your own writing before publishing. If you're forking it as a **Star Rangers fan work** instead, see the Fan Works Policy — you can keep some or all of the existing content, non-commercially and clearly labeled as unofficial.

See **[`FORKING.md`](./FORKING.md)** for the full step-by-step guide either way — rebranding, the `/star-rangers/` path prefix, setting up your own comments repo, and deployment.

## Contributing and support

Forks are welcome and need no permission; **third-party pull requests aren't accepted**, and forks are unsupported. Reader and fan questions are welcome in the [discussion forum](./TECHNICAL-README.md#discussion-forum-giscus), triaged as time allows. See **[`CONTRIBUTING.md`](./CONTRIBUTING.md)** for the reasoning and the details.

## Technical documentation

Everything operational lives in [`TECHNICAL-README.md`](./TECHNICAL-README.md): local development, build and validation, content scaffolding (`npm run new`), full-text search, the Atom feed and social previews, the giscus discussion-forum setup, the release process, and the complete cPanel multi-domain deployment reference (`deploy.conf` keys, `ALT_DOMAINS`, themes, content filtering, and cron auto-deploy). For running a fork of the engine on your own domain, start with [`FORKING.md`](./FORKING.md).
