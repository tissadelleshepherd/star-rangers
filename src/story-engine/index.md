---
layout: base.njk
title: "Story Engine"
# Computed so the description follows each edition's own brand (site.name)
# instead of hardcoding one name across every domain.
eleventyComputed:
  description: "How {{ site.name }} is built — the out-of-character section: the Journal's process notes, and the working vocabulary behind seasons, threads, scenes, and the Codex."
permalink: /story-engine/
---
<img class="page-hero-image" src="/star-rangers/images/hero/story-engine.jpg" alt="A brass machine with a riveted nameplate reading &quot;Story Engine&quot;, gears turning below it and steam rising from its stacks" />
<h1 class="page-title">Story Engine</h1>
<p class="page-intro">
  Everything else on this site is <em>{{ site.name }}</em>'s record of itself, written from inside its own world.
  This section is not. The Story Engine is where the machinery shows: how the story is put together, what its
  working words mean, and why particular decisions went the way they did. If you came for the story, start with
  <a href="/star-rangers/seasons/">Seasons</a> — nothing here is needed to read it. This page is about how the
  <em>story</em> works; the software that builds the site is described under
  <a href="#the-engine-behind-the-site">The engine behind the site</a>, at the foot of the page.
</p>
<p class="page-intro">
  Nothing in this section spoils anything. The planning notes that <em>would</em> — outlines, unwritten endings,
  what a given mystery turns out to be — stay unpublished by deliberate policy, and always will.
</p>

<h2>The Journal</h2>
<p>
  Dated notes from behind the story: naming decisions, worldbuilding rationale, wrong turns worth keeping, and
  the odd fragment of process that belongs in public rather than in a private notes file.
</p>

{% set entries = collections.journalEntries | reverse %}
{% if entries.length %}
<div class="codex-grid">
{% for entry in entries %}
<a class="codex-card" href="/star-rangers{{ entry.url }}">
<p class="codex-card__category">{{ entry.date | postDate }}</p>
<h3 class="codex-card__title">{{ entry.data.title }}</h3>
{% if entry.data.description %}
<p style="font-size:0.9rem;color:var(--color-text-muted);margin-top:0.5rem;font-family:var(--font-ui)">
  {{ entry.data.description }}
</p>
{% endif %}
</a>
{% endfor %}
</div>
<p><a href="/star-rangers/journal/">All journal entries →</a></p>
{% else %}
<p>No journal entries published yet.</p>
{% endif %}

<h2>How the story is put together</h2>
<p>
  A short orientation to the structural words this site uses about itself. These are craft terms, not in-universe
  ones — for the vocabulary the <em>setting</em> uses, see the
  <a href="/star-rangers/glossary/">Glossary</a>, which is a different kind of reference entirely.
</p>

<h3>Seasons, episodes, chapters</h3>
<p>
  A season number marks a position in the setting's timeline, not a release order and not a shared protagonist.
  Some season numbers are deliberately unwritten, held open for storylines that do not run through the current
  cast. Chapters nest inside episodes, and episodes inside seasons.
</p>

<h3>Storyline threads</h3>
<p>
  A <a href="/star-rangers/threads/">thread</a> is an independent storyline that gathers whole seasons — its own
  cast, its own concerns, readable start to finish without the others. The Founding Era and the present-day
  Threshold Station story are separate threads that happen to share a universe.
</p>

<h3>Scenes and points of view</h3>
<p>
  A chapter is built from scenes, and a scene is built from points of view — the same minutes written two or three
  times over, once per character present. Each version is a whole page in its own right, so a chapter can be read
  straight through, or one character at a time, or the same scene compared across everyone who was standing in it.
  What one viewpoint leaves out is usually the point.
</p>
<p>
  The versions differ in voice as well as in content. Each is written in the register of the mind holding it —
  its temperament, what it is in a position to know, and what kind of mind it is at all. A character formed by an
  institution renders the scene as a filed document, classifications and all. One with no institution behind it
  tells you the same minutes the way somebody would afterward, plainly and out of order. An intelligence built for
  measurement withholds every word that would claim more than its instruments support, and its restraint reads as
  cold until you notice what it is being careful about. None of that is decoration: <em>how</em> a viewpoint
  withholds is part of what it is withholding, and two versions of one scene set against each other are meant to
  show the difference between not knowing a thing, not being able to say it, and not having the kind of mind that
  would have noticed it.
</p>

<h3>Lore, Glossary, and Codex — three different promises</h3>
<p>
  <a href="/star-rangers/lore/">Lore</a> and the <a href="/star-rangers/glossary/">Glossary</a> state settled fact:
  the ground a reader can trust as flatly true, kept internally consistent on purpose. The
  <a href="/star-rangers/codex/">Codex</a> makes a narrower promise. Every codex document is written by a named
  person or office inside the world — an incident report, a hymn, a doctrinal working paper, a hagiography — and it
  is not canon. It is that source's account, and it may be partial, self-serving, devotional, or simply wrong. What
  it must be is <em>true to whoever wrote it</em>: something that person could have known, written the way they
  would have written it. Where the record contradicts itself, the contradiction is filed in the Codex under
  somebody's name rather than smoothed out of the Lore.
</p>

<h2 id="how-the-record-reaches-you">How the record reaches you</h2>
<p>
  The story is published at more than one address, and the addresses are not copies of one another. What differs
  between them, and what never does, is part of how the work is built.
</p>

<h3>Tiers and editions</h3>
<p>
  The record is published at four reading tiers: children, young adult, general and contemplative. They nest. Each
  carries everything the tier below it carries and adds storylines of its own, and nothing read on a lower tier is
  withdrawn or contradicted on a higher one. The tiers differ in reading level, in whose eyes the story is seen
  through and in how deep the thinking goes. None of them is a content rating.
</p>
<p>
  An <em>edition</em> is one address on one tier, with a face of its own: a name, a palette, a front page, a way of
  setting the type. Editions frame the record; they never vary it. The chapters, the Lore and the Glossary are the
  same wherever they appear, and an edition that carries less shows a part of the one record rather than a version
  of it. A page an edition leaves out still answers at its address, so no link breaks. Each edition also has its
  own reading posture (line length, type size, density), and the <strong>Reading</strong> control in the header
  lets you choose another; the choice is kept in your own browser and nowhere else.
  <a href="/star-rangers/tiers/">Reading Tiers</a> says what each tier holds and which address serves it.
</p>

<h3>The Archive beside the chapter</h3>
<p>
  A chapter can carry two panels from the Archive. Nothing in either is written for the chapter: the entries are
  the Archive's own, quoted as they stand.
</p>
<ul>
  <li>
    <strong>From the Archive</strong> lists the Glossary, Lore and Codex entries that accompany the chapter, each
    with its own one-line account. It says what a word means, never what the chapter meant. Depending on the
    edition it sits in a margin beside the prose or below it.
  </li>
  <li>
    <strong>In the Archive</strong> comes after the prose and lists the record's pages that cite the chapter. It is
    assembled every time the site is built, from the pages themselves, and never written by hand.
  </li>
</ul>
<p>
  The Archive holds only what the record's own institutions could know, so it can be read before a chapter or
  after it. It is another point of view on the story, not a key to it.
</p>

<h2 id="the-engine-behind-the-site">The engine behind the site</h2>
<p>
  The software that turns these pages into a site is described on the <a href="/star-rangers/about/">About</a>
  page:
</p>
<ul>
  <li><a href="/star-rangers/about/#how-this-site-is-built">How this site is built</a>: a static site, its tests, and where the technical detail lives.</li>
  <li><a href="/star-rangers/about/#how-this-site-is-written">How this site is written</a> and <a href="/star-rangers/about/#how-this-site-is-illustrated">how it is illustrated</a>.</li>
  <li><a href="/star-rangers/about/#how-this-site-is-deployed">How this site is deployed</a>: the separate addresses, and why they show one record.</li>
  <li><a href="/star-rangers/about/#the-engineering-behind-the-record">The engineering behind the record</a>: three engineering projects the site descends from.</li>
</ul>
<p>
  About also carries the <a href="/star-rangers/about/#fan-works">fan works policy</a> and the licence terms for
  the story and the engine behind it. To run the engine yourself, see
  <a href="/star-rangers/forking/">Forking This Site</a>.
</p>
