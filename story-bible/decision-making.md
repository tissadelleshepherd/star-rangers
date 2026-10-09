# Decision-making — how a direction becomes a ruling, and how to notice a turn

Unpublished working method, the third of its kind beside `benevolent-critic.md`
(judging the work) and `pr-review.md` (judging a change). This one is about
judging **decisions**: how Dermot's directions are captured, read, put back to
him, recorded, and — the part this note exists for — checked against what he
has already decided, so that a decision that reverses an earlier one, or turns
the work in a new direction, is written down *as* a turn rather than slipped in
as a continuation. Established 4 September 2026 at his direction: *"establish
meta-decision making guidelines and highlight decisions that might seem
inconsistent or imply a change of direction."*

Nothing here is new practice. It names what the dated intakes have been doing
since July and adds one duty they were doing unevenly: the direction check.

---

## The shape of a decision

Every direction goes through the same six steps, and the intake files
(`intake-YYYY-MM-DD.md`) are the record of them.

1. **Verbatim.** The direction is quoted as he gave it, typos and all. A typo
   is read by the plain-meaning convention and the reading is noted (*"the
   chronological allows" read as "the chronology allows"*), never silently
   corrected. The verbatim quote is what a later reader checks a ruling
   against when the summary and the ruling seem to disagree.
2. **One line.** What the direction says, in a sentence. If it cannot be said
   in one, it is two directions.
3. **Measure before proposing.** What the corpus or the engine does *today*,
   with numbers where there are numbers (page counts, discussion counts, which
   entry sets which key). Half the day's questions have turned out to be
   "what does it do now?" — the children's tier already had comments on; the
   Communion board held no discussions; the church-space clone's deploy
   config set neither key. A proposal made before the measurement is a guess.
4. **Readings, flagged.** Each reading of the direction that the work would
   depend on, stated as a claim and marked **Confirm**. Struck through with
   the date when he confirms. A reading is not a question; it is the
   interpretation the work will proceed on unless he says otherwise.
5. **Shapes, put as choices.** Two or three concrete options, each with what
   it costs, a lean or a recommendation marked where one exists, and any
   option listed-not-offered said to be so and why (Dermot's direction,
   29 August: present open questions as choices).
6. **The ruling, recorded.** His words, the date, what was realized and where
   (files, PR), and what it retired. The open-questions index gets the
   strike-through the same day; `CLAUDE.md` gets a line if the ruling is a
   standing rule; the changelog gets an entry if anything published or
   tracked changed.

## What is his and what is mine

The seven kinds in `TODO.md` (spend, taste, authorship, canon, risk he is
accepting, other people, which remedy) say which decisions land on his list.
Two further rules of the day govern the *flow* of decisions rather than their
ownership:

- **Merge unless a decision is open** (Dermot, 4 September 2026: *"auto merge
  PRs unless there is an open decision for me to review first"*). A PR merges
  when CI is green — engine, content, records alike — unless it carries a
  decision that is his by the seven kinds and not yet made. Then it stops,
  and the PR body says which decision. This supersedes the older second-tier
  default in `CLAUDE.md` ("draft it and stop"), which was written when every
  draft was a proposal; now a draft is a proposal only while something in it
  is undecided. The word *open* is doing the work: a reading he has confirmed
  is not open; a judgement call flagged "for your eye" *is* open until he
  looks, so a PR that flags one waits.
- **A question is answered, not acted on.** When he asks rather than directs
  ("should the contemplative tier see the shared pool?"), the deliverable is
  the assessment with shapes put. Nothing changes until he picks one. The
  intake records the question as a message in its own right, so the ruling
  has something to point back to.

## The direction check

This is the added duty. **Before a ruling is recorded, compare it with what
has already been decided**, and if it reverses, narrows, widens or re-grounds
an earlier ruling, say so in the record — in a line headed **Direction
check:** — naming the earlier ruling, its date, and which of four things the
new one is:

- **Extension** — adds without altering what stood (the alien thread beside
  the existing threads).
- **Clarification** — says better what was already true (tiers as reading
  level, protagonists and depth: a statement of what the ladder was always
  for).
- **Re-grounding** — the decision stands, the reason changes (comments off on
  the children's tier: the rule held, the rationale moved from protection to
  participation the moment the principle arrived).
- **Reversal** — the earlier ruling no longer holds (tier gating retired
  `private: true`, which `CLAUDE.md` had said was "meant to stay that way").

The same four words the canon rule uses for published pages (25 August:
extension, clarification, genuine dilemma — with *reversal* here standing in
for the dilemma's resolution, since a decision, unlike canon, may simply be
changed). A reversal is not a fault. It is his work and he may turn it; the
fault would be a reversal recorded as a continuation, which leaves the earlier
line standing in a document somewhere for the next session to obey. So the
check has three parts:

1. **Name the turn** in the intake and, where the earlier rule is written
   down, in that document — struck through with the date, never deleted, so
   the history reads forward.
2. **Sweep the reasons.** A principle that arrives later than a mechanism
   built without it can leave the mechanism's stated *reason* wrong while the
   mechanism is right. Find the reason wherever it was written (registry
   comments, changelog entries, reader-facing copy) and re-ground it.
3. **Put the apparent inconsistency to him if it is real.** If the new
   direction and an old ruling genuinely cannot both hold and he has not said
   which wins, that is an open decision — shapes put, PR stopped.

**What does not need a direction check:** a ruling on a question he asked
that day, a reading he confirms as taken, and a choice among shapes put to
him. Those are decisions being made, not decisions being changed.

## The day this was written, checked

Applied to 4 September 2026, so the method has a worked example and so the
turns of the day are on record as turns:

| Decision | Against | Kind | Recorded where |
|---|---|---|---|
| Tier gating replaces `private: true` | *"church-space is the only private thread and is meant to stay that way"* (CLAUDE.md, July) | **Reversal** | CLAUDE.md rewritten; HISTORY note in the thread registry |
| Canonical site "holds everything" (5 August) vs "at the general tier" (3 September) | each other | **Clarification** — it holds everything *public*; the contemplative overlay was never part of "everything" | registry comment on `DEFAULT_EDITION` |
| The board is picked per page | his own description that morning, *"the contemplative tiers use church-space comments"* | **Reversal** of a description, not of a ruling — the description was of a default nobody had chosen | intake, seventh message |
| Comments off on the children's tier | the tiers-are-not-ratings principle, given two messages later | **Re-grounding** — the rule stood, the reason moved from protection to participation | registry comment and changelog reworded the same day |
| The children's edition's no-cross-domain-link rule (1 September) | the same principle | **Stands** — it was a usability claim (a child cannot judge a link), not a safety one; said so in the intake | intake, eighth message |
| Auto-merge unless a decision is open | CLAUDE.md's second tier, *"draft it and stop"* | **Reversal** of the default; the boundary of what is his is unchanged | CLAUDE.md's authority section, this note |
| "Make a new release when done", then four more rulings after 1.30.0 | the release instruction | **Extension** — later rulings sit in Unreleased until he asks again; a release is a cut, not a promise to keep cutting | changelog |

Two things this table shows. The turns of a productive day are mostly
re-groundings and clarifications, which is what it looks like when a
principle arrives after the mechanisms that needed it. And the one genuine
reversal of a written rule (`private: true`) was the right call — the
earlier line described a constraint that the tier ladder had made
unnecessary — and is only safe because the line it reversed is struck
through where it stood rather than left to be obeyed.

## Where decisions live

- **The verbatim direction and its readings:** the dated intake.
- **What is still undecided:** `open-questions.md`, one line each, struck when
  ruled.
- **Standing rules:** `CLAUDE.md`, which is what the next session reads first
  and therefore where a reversal must land or it did not happen.
- **What changed in the repo:** `CHANGELOG.md`, complete and plain.
- **What is his to decide:** `TODO-novel.md` in the working folder, by the
  seven kinds.
- **The reasoning, if it is worth prose:** a journal entry, chosen not
  complete.

A decision recorded in one of these and not the others is half-recorded, and
the half that is missing is usually the one the next session needed.
