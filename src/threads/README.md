# `src/threads/` — storyline landing pages

One directory per storyline thread, each holding an `index.md` with `layout: base.njk`, a hand-written HTML body and an explicit `permalink`. `index.md` at this level lists the threads from `_data/storylineThreads.js`. Story content under CC BY-NC-ND 4.0.

A **thread** is the macro concept and the only narrative unit with engine consequences: it groups whole seasons and is registered in `lib/storyline-threads.js` (`STORYLINE_THREADS`), which is the single source for this section, for `threadForSeason`, for `deploy.conf`'s `THREADS` narrowing and for the tier gate. A page here is the thread's public face; the registry is what the engine reads. Adding a thread means a registry entry, a season assignment, and a landing page here, in that order.

A thread that names a `tier` in the registry is absent on every build below that tier and ordinary content at or above it. `church-space` is the only gated thread and is meant to stay so; gating a second one is a design decision, not configuration. A landing page acquires the gate through its `threadId`.

Within a season, two parallel storylines are **strands**, and a character's trajectory is an **arc**; neither has a page, an id or a registry (`story-bible/story-bible-summary.md`, *Narrative Structure*). Do not write "Thread A" for a within-season storyline.
