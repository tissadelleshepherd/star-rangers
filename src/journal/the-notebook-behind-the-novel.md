---
layout: journal-entry.njk
title: "The Notebook Behind the Novel"
date: "2026-10-17"
description: "On the fact that this record has quietly kept a lab notebook of its own making: what the notebook consists of, where each part lives, how to cite one state of a work that is never finished, and what the notebook cannot show."
tags: [process, authorship, method]
---

Today I added a citation file to this site's repository, so that anyone who cites the work is offered *Fian Ilchruinne* under its own title rather than under the name of the repository that holds it. Writing its one-paragraph abstract raised a question I had not asked before. If someone wanted to study how this record is made, rather than read it, what would they find? The answer turned out to be more than I expected: the project has been keeping a lab notebook all along. Nobody set out to keep one. It accumulated because every decision that mattered had to be written down with its reason, so that it could be overruled later by someone who could see what it was.

This entry is a map of that notebook, written for the readers the Journal is for: critics, reviewers, peer authors and students of the writing, and anyone who arrives here from the citation.

## What the notebook consists of

There are five kinds of record, and they answer different questions.

**The intakes** answer *what was asked, and what was decided*. Since 26 July 2026 most working days that changed the record have a dated intake file, forty-five so far. An intake quotes my direction word for word, then records what the direction was checked against, which readings of it were possible, which one was taken, and by whom: by me, or by a model settling it from a ruling I had already made. That last distinction is the one a researcher would most want and the easiest to lose, so the intakes keep it on purpose.

**The changelog** answers *what changed*. Every change worth a reader's notice is listed there in plain prose, dated, under the release it shipped in. The older releases have moved, unedited, into a [changelog archive](https://github.com/dermot-r-cochran/star-rangers/tree/main/changelog), because a released section is never rewritten. That rule exists because two releases' records were once destroyed by exactly such a rewrite, and the restoration is itself recorded.

**The git history** answers *exactly what changed, and when*. It runs from 27 May 2026 and holds roughly 2,800 commits. Pull requests carry a short account of what it commits the story to and what, if anything, was left open for me to decide. From 17 October 2026 there is also to be a release tag for each day the record changes, which matters for citation (below).

**The working rules** answer *how the work is divided*. The repository's [`CLAUDE.md`](https://github.com/dermot-r-cochran/star-rangers/blob/main/CLAUDE.md) states which model does which kind of work, which decisions reach me and which do not, and which actions need my explicit word however confident a model is. It is the method section of the notebook, and it has been revised in public as the method changed.

**The Journal** answers *what was learned*. The other four are complete by design; this one is selective by design. It is where a failure gets its reasons written up, as in [Where the Record Lives](/star-rangers/journal/where-the-record-lives/), which began as a tidy justification and became the account of an audit that found I had been wrong about my own pictures.

## Where each part lives

The Journal is on this site. Everything else is in the [public repository](https://github.com/dermot-r-cochran/star-rangers), and the intakes sit in its `story-bible/` folder, which the site never publishes.

That needs one caution. The story bible holds spoilers: treatments of seasons not yet written, endings, the reasoning behind mysteries the prose has not yet opened. It is not hidden, and I would not hide it, but it is not shown either, because a reader who has not reached a chapter is better served by the chapter. A researcher who opens that folder will find the notebook and the plot's future in the same drawer. The site keeps to a rule that its public pages are derived from the story bible and never mirror it, and this entry keeps to that rule too: it describes what kinds of record are there and quotes none of them.

## Citing a work that is never finished

The record is revised continuously, so a citation has to say which state it means. Three things make that possible. A chapter's ordinary address can change when chapters are renumbered, but each chapter also has a permanent `/c/` link that follows the chapter, not its position. A release tag names an exact state of the whole repository, and from 17 October 2026 there is to be one for each day the record changes. And, as with any web source, the date it was read completes the reference. Together they let someone write down what they read so that someone else can open the same thing.

## What the notebook cannot show

A notebook is only as honest as its limits are plain, so here they are.

The conversations themselves are not in it. Most of this record is made in working sessions with AI models, and those sessions are not published. What the notebook keeps is their residue: my directions quoted exactly, the readings taken, the diffs. A reader can see what I asked and what was made, but not every word that passed between the two.

Part of the notebook is written by the instrument. The models draft many of the intakes, changelog entries and pull-request accounts that describe their own work. The safeguards are structural rather than a matter of trust. My words are quoted, never paraphrased, where they decide something. Each record says when a reading was settled by a model from precedent rather than by me. And the gates that check the record run the same way whoever wrote the change. None of that makes the account neutral. It makes it checkable, which is the most a notebook can honestly offer.

And the notebook records decisions, not the reasons I did not say. Why one image moved me and another did not, why a line of Tissadelle's had to be exactly those words: where I gave a reason it is there, and where I did not, nothing stands in for it. The Journal is the place I try to supply some of those reasons afterwards, which is what this entry has been.

So the work can fairly be described as an ongoing human–AI writing project with its process on record. I did not plan it as an experiment. It became one the day the first decision was written down with its reason, and every day since has added a page.
