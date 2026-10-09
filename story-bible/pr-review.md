# The PR Review

A process for reviewing a pull request **without holding it up**. Sibling to [the Benevolent Critic](./benevolent-critic.md), same three debts, same priority bands, opposite default.

It exists because the critic's habits, applied to a diff, produce the wrong behaviour. The critic asks *"is this right?"* of a corpus that is already published and in no hurry. A PR is not that. A PR is inventory: work that is finished, tested, and doing nobody any good until it lands. Reviewing it with the same instincts turns every observation into a reason to wait.

## The default is merge

**Two things, and only two things, stop a pull request:**

1. **A major critical flaw in the PR itself** — the change is wrong, breaks something load-bearing, or makes the corpus worse than not merging it.
2. **A red CI check.**

Everything else a review turns up is **raised as an issue and does not hold the merge**. Not "raised as an issue if it is minor" — raised as an issue, full stop, including findings that are real, serious, and worth fixing this week.

The test for the first blocker is deliberately narrow. Ask: *if this merges as it stands, is the repo worse than if it had never been opened?* If the answer is no, it is not a blocker, however much you would like it fixed first.

### Why the bar is there

Three reasons, and the third is the one that matters.

- **An open PR is inventory**, and inventory is a cost paid every day it sits. A change that is 95 % right and merged beats a change that is 100 % right and open.
- **A finding parked in a PR conversation is a finding nobody can find.** It has no label, no priority, no done-state, and it disappears the moment the branch is deleted. In the tracker it is searchable and it survives. See the *Issues* test in [where work items live] — anything with a done-state belongs there.
- **Blocking teaches the wrong lesson.** A review that gates on adjacent problems trains the next PR to be bigger, because splitting work stops being safe. Small PRs are only cheap if small PRs merge.

## What a review still owes

Not blocking is not the same as not reading. The review is worth running precisely because a diff is the moment when a change is most legible — the author's reasoning is fresh, the surface is bounded, and the surrounding code is open. A review that shrugs is as useless as one that gates.

So: read it properly, say what you found, sort it honestly, and merge.

The critic's two prohibitions carry over unchanged. **Do not manufacture findings** to look useful; a clean review is a legitimate result and should be said plainly. And **do not hedge a real problem** into vagueness to keep things moving — a P1 raised as an issue is still a P1, and softening the diagnosis to justify the merge is the failure mode this process is most likely to develop.

## Sorting: the only decision

Every finding lands in exactly one of three places.

| | where it goes | what it does to the merge |
|---|---|---|
| **Blocker** | fix on the branch | holds it |
| **Finding** | new issue, labelled | nothing |
| **Note** | a sentence in the PR body | nothing |

A **note** is something true and worth recording that has no done-state — why an approach was chosen, a fact discovered while reviewing, a constraint the next person should know. It is not a soft finding. If it has a done-state it is an issue; if it does not, it is a note, and the PR body is the right place because that is what the squash commit preserves.

**Worked example, PR #454.** The review found three things. The document really did contradict the issue template — that was the change, and it merged. The recommended repair had already been half-made in #433 five hours after the issue was filed — a note, since nothing remained to do. And `interaction-limits` reported no restriction while the config asserted one, which looked like a live defect and had a done-state: not a blocker, because merging the reword left the repo better either way, so it went to the backlog as a question. It turned out the API was the unreliable witness, which is exactly the outcome that would have been embarrassing had it blocked a good change for a day.

## The three debts, and the priorities

**Identical to the Benevolent Critic's, deliberately.** Full definitions live in [benevolent-critic.md](./benevolent-critic.md#kind); do not restate them here and let the two drift apart.

- **technical debt** — engine, tooling, scripts, build, deploy, schema, links, image handling
- **literacy debt** — what the work owes a reader trying to get in and stay in
- **creative entropy** — the drift a growing invented world accumulates

They are the same three because the axis is not *what kind of problem* but **who repays it** — an engineer, an editor, or the author. That is as true of something spotted in a diff as of something spotted in the corpus, the labels already exist on the tracker, and a finding deferred out of a PR should not need re-classifying on the way.

Priorities are the same four bands, `P1-must-fix` through `P4-would-fix`, with the same amendment: P4 means *would be fixed given time*, not *rejected*.

### The debt decides the remedy, not just the label

Sorting a finding into a debt is not bookkeeping. It says **what to do next**, and the three answers are different (Dermot, 17 August 2026):

- **Technical debt — draft the fix if it is obvious.** Don't file an issue that says "the script is missing its executable bit" and stop there. Fix it, or open the PR that fixes it. An issue is for what is *not* obvious.
- **Literacy debt — the same.** Missing alt text, a `plain:` summary that reads like the entry, a broken reading path: if the repair is clear, write it. These have a correct answer that does not need the author's taste to find.
- **Creative entropy — raise it, and bring it to him.** Never quietly resolve it.

The asymmetry is the whole point, and the critic already gives its reason: *"only the author can tell entropy from intention."* A name that has multiplied might be drift, or it might be a world where institutions rename themselves and that is the texture. A thread left half-answered might be a loose end, or it might be Sen's marked absence doing its job. **Creative entropy can be good.** The other two never are, which is why they can be repaired on sight and this one cannot.

**But raising it is not handing over a blank page.** He wants to *influence and guide, not micro-manage* — so a creative-entropy finding arrives with the evidence, a recommendation, and the cheapest repair already worked out, so that answering it is a yes, a no, or a redirect rather than a design session. Come with a proposal and a door left open, not a question.

The failure mode on each side is worth naming. Under-consulting looks like a tidy corpus that has quietly lost a deliberate roughness. Over-consulting looks like a queue of decisions that could have been made by reading the existing pages — which is its own kind of cost, and the reason the first two debts do not come to him at all.

**A P1 finding still does not block.** This is the counter-intuitive part and it is correct: priority says *when it gets fixed*, the blocker test says *whether this particular change should wait*. A P1 in an adjacent file is urgent and unrelated. Only a P1 **in the diff** is a blocker.

## The tests

Run in order. Most PRs stop at 2.

1. **Is CI green?** If not, that is the review. Nothing else is worth reading yet.
2. **Would merging make the repo worse?** If no — and it is almost always no — the merge is decided. Everything from here is sorting, not gating.
3. **Is this finding in the diff, or merely visible from it?** Visible-from-it is an issue, always. A PR is not a licence to fix the neighbourhood.
4. **Does it have a done-state?** Yes → issue. No → note in the PR body.
5. **Which debt, and which band?** Same three, same four. If a finding does not fit a debt, it is probably a note.
6. **Is the change reversible?** A merged commit can be reverted; a published prose page that readers have linked cannot be un-published, and a release tag cannot be recut. Reversibility is what makes a low bar safe — where it is absent, the bar rises to the author's judgement rather than this process's.

## What does not change

This process governs **what counts as a reason to wait**. It does not touch **who decides**. CLAUDE.md's draft-and-stop list still holds: canon, narrative prose, character portraits, policy and licence documents, and edition entries are proposals whatever a review says about them. A clean review of a `CONTRIBUTING.md` change means it is ready for Dermot, not that it is ready to merge.

## When to run it

On any PR that touches more than one file, changes behaviour, or adds content. Not on a one-line typo fix — the CI check is the review there, and saying so is faster than a report nobody needed.

[where work items live]: ./benevolent-critic.md#the-output-contract
