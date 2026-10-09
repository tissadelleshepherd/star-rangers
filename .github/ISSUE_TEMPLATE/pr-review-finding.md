---
name: PR review finding
about: A finding deferred out of a pull request review (story-bible/pr-review.md)
title: ""
labels: ""
---

<!--
This template IS the output contract from story-bible/pr-review.md.

USE THIS ONLY FOR A FINDING THAT DID NOT BLOCK THE MERGE. If it blocked, it
was fixed on the branch and there is nothing to file. If it has no done-state,
it is a note in the PR body, not an issue.

Apply two labels before saving:
  priority — P1-must-fix / P2-should-fix / P3-could-fix / P4-would-fix
  kind     — technical-debt / literacy-debt / creative-entropy

A P1 here is normal and is not a reproach to the PR. Priority says when it gets
fixed; it never says the merge should have waited.

THE KIND DECIDES WHAT HAPPENS NEXT:
  technical / literacy  — if the repair is obvious, draft it rather than only
                          filing this. An issue is for what is not obvious.
  creative entropy      — do NOT resolve it. It is Dermot's call, because only
                          the author can tell entropy from intention, and
                          entropy is sometimes the good kind. Bring a
                          recommendation and a cheapest repair so answering is
                          a yes, a no, or a redirect.

SPOILERS: this tracker is PUBLIC to read. Never name reserved or unwritten
material here — the Patience First terminus, the 2732 recovery, anything from
the S6-7 arc. Those belong in story-bible/, which is permanently unpublished.
-->

## Where it came from

<!-- The PR number, and whether the finding is IN the diff or merely visible from it. -->

**Found reviewing:** #
**In the diff / visible from it:**

## What it is

<!-- Quote the lines with paths. Evidence, not assertion. -->

## Kind and priority

<!-- e.g. technical debt · P2. A kind and a band, nothing else. -->

**Kind:**
**Priority:**

## Why it did not block

<!-- The blocker test is: would merging have made the repo worse than not
     opening the PR at all? Say why the answer was no. "Adjacent to the diff"
     is a complete answer. -->

## What breaks if untouched

<!-- The actual consequence, or "nothing, and that is why this is P3". -->

## Cheapest repair

<!-- Concrete enough to act on. Additive beats corrective; corrective beats
     structural. For creative entropy, this is a proposal and not a decision —
     say what you would do and leave the door open. -->

## What the repair costs

<!-- Including the cost of NOT doing it. -->
