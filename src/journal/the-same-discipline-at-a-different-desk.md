---
layout: journal-entry.njk
title: "The Same Discipline at a Different Desk"
date: "2026-10-17"
description: "On why a career in software engineering and applied AI is not set aside when the work is a novel: the gates that check this record are the thesis's contracts in another form, its doctrine carries the thesis's habits, and its working rules for models are AI governance in practice. And on the one line the tools cannot cross."
tags: [process, engineering, formal-methods, authorship]
---

Today I rewrote the [About page](/star-rangers/about/#the-engineering-behind-the-record) to say plainly what I am: trained first in mathematics, a software engineer by trade, a formal-methods researcher by doctorate, and lately a specialist in applied AI. Rewriting it raised a question I had never put to myself in so many words. If writing comes to take most of my hours, are those skills set aside? The honest answer is no, and the reasons are specific enough to be worth writing down.

## The contracts became the gates

My thesis specified the Danish and Irish ballot-counting rules in Alloy, a modelling language whose analyser hands a design to a SAT solver and asks it for a counterexample. It then held a Java implementation to JML contracts. A contract, in that sense, is a precondition, a postcondition or an invariant written into the code, and those contracts were checked twice: statically, by provers before the code ran, and at runtime, as assertions while it ran. The JML-annotated sources are public, as [Votail](https://github.com/FreeAndFair/Votail), from the work I did within ITU's [DemTech](https://demtech.dk) research project; the Alloy models survive in the thesis's appendices. The habit that leaves behind is a particular distrust. A thing that looks correct has not yet been asked the right question.

This record is checked the same way, with the same distrust. Before anything merges, `npm test` runs a set of gates. One validates every page's front matter against the schema for its kind of page, and among much else refuses two chapters that claim the same permanent comment identity. One follows every internal link to its target and every `#fragment` to a heading that exists. One resolves every related term against a real page title. Another reads which chapter first reveals each Archive page and fails if the chapter named does not exist. None of these is a literary tool. Each is a postcondition on the corpus, checked mechanically, so that a whole class of mistake cannot reach a reader however tired the writer was.

The gates have a limit, and I learned it from the thesis rather than from the novel. A formal specification proves that an implementation meets the specification; it cannot prove that the specification says what the world needs. The rules this site is built under put the same limit in one sentence: *the gates prove structure, not judgement.* A checker can show that a page is well formed, uniquely identified and fully linked. Nothing in the toolchain can show that a sentence is true in this world, or in the house voice. That boundary is not a weakness of the tools. It is the line between what can be delegated and what cannot, and knowing exactly where it falls is itself a formal-methods skill.

## The habits became the doctrine

[The External Codex](/star-rangers/journal/the-external-codex/) already records the larger debt: the record's constitutional material has a bibliography of one item, and it is that thesis. [Schedule C](/star-rangers/codex/the-seat-allocation-protocol/) counts in whole fractions and breaks ties by rule. [The Verification Doctrine](/star-rangers/codex/the-verification-doctrine/) rests authority on anyone's ability to re-perform a derivation. Those are the properties you come to care about after watching a model checker hand you the election your algorithm gets wrong.

The debt runs further than the constitution. The record keeps three standings apart: canon binds, the Codex is valid only for its author, and an overlay is a lens laid across the whole. Keeping those apart is the same move as keeping a specification apart from an implementation, so that neither can quietly impersonate the other. Sen's [Marked Absences](/star-rangers/codex/marked-absences/) refuses to invent a cause for a gap, and that is a refusal to let an unproven claim stand in for a proven one. Sen's [Standing Claims](/star-rangers/codex/standing-claims/) grades a belief by what it has survived, and that is evidence-weighted revision, the subject of more than one of my engineering repositories, given an archivist to keep it. I did not plan any of this as an allegory of software. I found it afterwards, the way you find your own handwriting in a document you had forgotten writing.

## The AI work became the workshop

The newest of the three skills is the one most visibly in use. This record is written with AI models, and the rules for working with them are written down. Each kind of work goes to a named model: one model for prose and the image prompts where a person's presence carries the frame, another for judgement and planning, a third for work a gate can check. Approval runs in a stated order, and a question reaches me only when it is a genuine dilemma, meaning commitments that cannot all stand. Some actions require my explicit word in the session however confident a model is: rewriting history, cutting a release, moving who may read a thread. Every decision that matters is recorded with its reason, so that it can be overruled later by someone who can see what it was.

That is applied AI engineering, and it is not a metaphor for it. It is the same problem I work on professionally: how to let a capable, fallible system do real work under an architecture that stays explicit, owned by a person, and auditable. My [Architecture Definition Model](https://github.com/dermot-r-cochran/architecture-definition-model) uses this site's working agreement as its case study. The novel is where I test the method on a client I cannot fool, which is myself.

## What does not transfer

One thing does not carry over, and it should be said precisely so that nothing above is over-read. The skills govern the conditions under which the story is written. They do not write it. No gate chooses what Tissadelle notices, and no specification decides whether a chapter's ending changes how its beginning reads. The thesis taught me that a proof is only as good as the property it proves. The same holds here. The engineering can guarantee that the record is consistent, traceable and reviewable. Whether it is worth reading is a property no machine can check, and it was never the machine's to check.

So nothing is wasted. Everything I learned about specification and verification now goes to keeping the record sound, and that leaves the writing free to do the one part of the work no tool can.
