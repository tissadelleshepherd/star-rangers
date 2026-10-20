---
layout: journal-entry.njk
title: "Questions a Researcher Might Ask"
date: "2026-10-17"
description: "A companion to The Notebook Behind the Novel: the questions someone studying how this record is made is likely to bring, each answered briefly and pointed at the part of the record that holds the evidence."
tags: [process, authorship, method]
---

[The Notebook Behind the Novel](/star-rangers/journal/the-notebook-behind-the-novel/) maps the record this project keeps of its own making. A map is not much use without the questions people bring to it. I do not intend to publish every working session, which would be impractical and mostly noise. What follows instead is my best guess at what someone studying the work would want to know, with short answers and a pointer to where each answer can be checked.

## Who writes what?

**Who wrote the prose?** The ideas are mine. I put them to Claude, which drafts the prose to my guidelines, and I approve, redirect or reject what it drafts. The guidelines are written down: a house style derived from the approved prose, and the working rules in the repository's [`CLAUDE.md`](https://github.com/dermot-r-cochran/star-rangers/blob/main/CLAUDE.md), which set the tone, the trope defaults and what the world will and will not carry. Before 25 July 2026 the arrangement was more mixed, and provenance notes in the story bible record who wrote what in that period. Since then, drafting by a model to my direction has been the standing practice, and no prose becomes part of the record without my approval or a rule of mine that covers it.

**Which tools and models were used, and when?** The [About page](/star-rangers/about/#how-this-site-is-written) gives the history in brief: Copilot tools at the start, Sudowrite for a time, then Claude Code working directly in the repository. Since 3 July 2026, commits made with a model name it in a co-author line, so the git history shows which model made each change. The current division of work between models is stated in `CLAUDE.md`.

**How is a decision made?** My direction is recorded word for word in a dated intake. It is checked against what the record already holds and named as an extension, a clarification or a reversal. The possible readings are listed, and one is chosen. Each record says whether I chose it or a model settled it from a ruling of mine, so the two can be told apart afterwards.

## How reliable is the record?

**How are mistakes caught?** Structurally, by the checks that run before every change merges. These validate every page's metadata, follow every internal link, resolve every cross-reference and refuse a duplicated identity. They prove structure, not judgement: no check can tell whether a sentence is true in this world. Mistakes of judgement are caught by reading, and the larger ones are written up, as in [Where the Record Lives](/star-rangers/journal/where-the-record-lives/) and [Two Copies, Forty Seconds Apart](/star-rangers/journal/two-copies-forty-seconds-apart/).

**What has been lost?** Two things are known. Early drafts in Sudowrite drifted from the committed files until neither could be trusted, and the repository was made the single source of truth to end that. And two release sections of the changelog were once erased by a careless rewrite and later restored. Anything older than the repository's history is not recoverable.

**Where did the pictures come from?** Every generated image is registered in the story bible with the tool, the date and the complete prompt. Some illustrations are made from my own photographs, and those are recorded too. The illustrations are not the work: where a picture and an entry disagree, the entry is right.

**Can I reproduce a past state?** Yes. Each release is tagged. Clone the [repository](https://github.com/dermot-r-cochran/star-rangers) at a tag, install its locked dependencies and build it, and you have the site as it stood at that release.

## What may I do with it?

**May I quote it, analyse it, or mine it as text?** Yes. Quote it with attribution. For non-commercial research you are welcome to read, analyse and text-mine the whole record, prose and process notes alike, and to keep a copy of it as a research corpus. The content licence is CC BY-NC-ND 4.0, and commercial use needs my permission. Non-commercial fan works are already welcome under the licence's [fan-works exception](https://github.com/dermot-r-cochran/star-rangers/blob/main/CONTENT-LICENSE.md#fan-works-policy). For research, sharing processed or annotated copies of the text, whether tokenised, tagged or excerpted for analysis, is also welcome on the same non-commercial, attributed terms. Publishing a rewritten or edited version of the story as if it were the work is not.

**How do I cite it?** The repository carries a citation file, and GitHub's *Cite this repository* button produces a reference from it. Cite a chapter by its permanent `/c/` link, and give the date you read it, or the release tag if you worked from the repository.

**How do I get in touch about research?** Write to [research@fianilchruinne.com](mailto:research@fianilchruinne.com). It reaches me directly.

## Is the record complete?

**Is anything held back?** Nothing is withheld from the repository. The story bible is not published on this site, because it holds spoilers, but it is in the public repository in full. It is complete without being fully curated: it holds working notes as they were written, including readings later superseded, and nothing in it has been tidied for an outside reader.

**Is it finished?** No. The story bible is sufficient for studying how the record is made, but it is not static, and it grows as the story does. A study of it is a study of the record as it stood on a particular day, which is one more reason to cite by date or release.

**Is every ambiguity deliberate?** No. Some are intentional: the record marks what it does not know rather than inventing it, and some mysteries are meant to stay shut. Some are loose ends, which I mean to tie. And some are left open for expansion and future work. The story bible keeps these apart: deliberate mysteries are named as such, loose ends are tracked as work to do, and undecided questions are indexed in one place. A reader of the site cannot always tell which kind a gap is, and that is partly by design, but a researcher reading the story bible can.

If a question I have not anticipated turns out to matter, the address above is the place to ask it, and a good one may well earn a place on this page.
