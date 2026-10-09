---
layout: journal-entry.njk
title: "A Name You Have to Argue With"
date: "2026-07-29"
description: "Two renames in one sitting — Dynarch to Mediarch, and Starwarden First Officer to Archwarden — and the tell they had in common: both entries carried a paragraph explaining what the name didn't mean."
tags: [worldbuilding, editorial, naming, terminology, cosmology, ranks]
---

I renamed two things this week that had nothing to do with each other. One is a tier of the Cosmic Cascade several strata above anything with a body. The other is a rung on the Star Rangers' rank ladder. They came from opposite ends of the setting, I made the calls a day apart, and they turned out to be the same mistake twice.

Here is the tell I should have noticed years ago. Both entries contained a paragraph whose entire job was explaining what the name did **not** mean.

The rank was the blatant one. Its bullet in [Rank and the Chain of Command](/star-rangers/lore/star-rangers-command-hierarchy/) used to open by admitting the problem outright — that the name misled more people than any other on the ladder, so read it carefully. *Starwarden First Officer* names a vessel's second-in-command. *First Officer* is the post: first officer **of a ship**. It never meant first officer *to* a Starwarden. But that is how it reads, to essentially everyone, on first contact, and the two ranks are consecutive rungs rather than a commander and an assistant. I had written a small essay in defence of a job title. That should have been the end of the argument rather than the shape of it.

The cosmological one was subtler because the paragraph was doing real work. *Dynarch*, from *dynamis*, force: the tier that encapsulates and governs Gravity, Electromagnetics, Nature. Fine, except the tier's own first listed constraint has always been that it governs the *operation* of a force and not its design. The rule-sets belong to the Worldwright. No Dynarch could ever rewrite a zone's physics. I had named an office after the one thing it is least able to alter, and then spent a section explaining the gap.

## The name lagged a settlement I had already made

What actually made the cosmology rename obvious was something I settled three days earlier and didn't follow through: **a Mediarch is a proxy [Telearch](/star-rangers/glossary/telearch/)**. The Telearch line is native to no universe and supervises from outside; a force has to be administered from *within* the thing it runs through; this tier is how that reach happens, one force-domain at a time.

That settlement relocated the whole tier. It stopped being *the force beings* and became *the standing-between* — the office that exists because a continuity branch native to nowhere needs a way inside. Every property I had previously asserted about the tier fell out of it as a consequence rather than a rule: why continuity prevails on conflict, why it counts as co-created, why the dual obligation isn't a divided loyalty.

And the name still said *force*. So [Mediarch](/star-rangers/glossary/mediarch/), from *medius*, the middle. Now "a Mediarch is a proxy Telearch" unpacks the name instead of arriving from somewhere else.

The pleasing part is that the devotional word was right the whole time. Provincial and contemplative records have always said **Exarch** — a governor holding a province on delegated authority from a distant throne — which is a description of mediation and always was. The formal register had the worse name. I've left *Exarch* co-canonical, because it isn't a legacy term to be swept; it's the same office named accurately by people who never had the mechanism explained to them.

For the rank I took the same move and stopped trying to salvage the old words. **Archwarden.** Senior warden. That's the rank. It needs no paragraph.

## What I didn't expect: they needed different machinery

I assumed I was doing one job twice. I wasn't, and the difference is worth writing down, because I nearly got it wrong.

*Dynarch → Mediarch* is **the Archive correcting its own vocabulary.** No in-universe register ever used the word — devotional sources say *Exarch* — so once it's retired, *Dynarch* names nothing at all. There is no period in which it was right. Migrate on sight, everywhere, no exceptions.

*Starwarden First Officer → Archwarden* is **an institution renaming its own rank**, which is a completely different act. The Corps restyled it in 2833 UCSD. That means both names are correct — each for its period — and a record from 2831 that says *Starwarden First Officer* is not an error to be fixed. It's a document with a date.

Which decided something I'd otherwise have blundered into: [the Dock Seven chapter](/star-rangers/seasons/s05/e02/s05e02c03/) stays exactly as published. Shepherd convenes her Field Triumvirate in 2831 and the officer who goes out on the last shuttle is her Starwarden First Officer, because in 2831 that is what he was. I dated the restyling after every chapter I've published on purpose, so the rename cost me no prose. This site has done that once before, with the Solar System Concordant becoming [the Solar System Concord](/star-rangers/lore/solar-system-concord/) in 2790 — the 2723 charter preamble still carries the founding name and is quoted as written.

Both migration rows went into the [canonical glossary](/star-rangers/lore/glossary/canonical-glossary-and-migration-guide/), and they now sit next to each other saying opposite things about the past, which is correct. One row has a dating rule. The other can't have one.

There's a small archaeological joke in the cosmology row: that tier has now been renamed twice. It was *higher celestials* before it was *Dynarch*. So the row has to point a legacy reading at the current name rather than at the intermediate one, or a reader migrating carefully lands one stop short.

## The engine part, briefly

Renaming a page moves its URL, and a moved URL is a broken link on four production domains. The old address gets a redirect stub — canonical link, `noindex`, meta refresh, one sentence saying what moved — the same pattern the Concord rename used. I also left `dynarch` in the entry's tags beside `mediarch`, because a couple of the deploys narrow content by topic and the config files that do it aren't in this repository.

The check that actually mattered was the boring one. Front-matter `related:` terms resolve by page **title**, and on a miss they fall back to the glossary index instead of failing. So a stale term after a rename doesn't break the build — it silently sends readers somewhere plausible and wrong, which is worse. I wrote a script for that specific failure a while ago and it earned its keep twice this week.

## The rule

If an entry needs a paragraph explaining what its own name doesn't mean, the name is the thing to fix, not the paragraph. I had two of those sitting in plain sight, one of them flagging itself in its opening clause, and I read past both for months because the explanation was *good*. A well-argued defence of a bad name is a decent piece of writing and a small permanent tax on every reader who arrives after it.

Name things for what they are, not for what they're standing next to.

---

*Postscript, 29 September 2026.* Dermot has since directed that the chapter say *Archwarden* after all, and it now does. The reasoning above still holds for documents: a 2831 log quoted as written keeps its own style, and the restyling of 2833 stands as history. What changed is where the line sits. The Archive's narration is the record's present voice, the one that already turns every date into UCSD, and a present voice uses the present name. I had drawn the line at the chapter, and it belonged at the quotation mark.
