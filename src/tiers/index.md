---
layout: base.njk
title: "Reading Tiers"
description: "The four reading tiers of Fian Ilchruinne — children, young adult, general and contemplative — what each carries, how they nest, and which address serves each."
---
{#- The tier this build sits at comes from lib/editions.js (`tier`), so the
    sentence below is true on every official domain without a per-domain
    copy. A third-party fork resolves the default edition and reads as the
    general tier, which is what an unfiltered build is. -#}
{% set tierLabel = {
  "children": "children's",
  "young-adult": "young-adult",
  "general": "general",
  "contemplative": "contemplative"
} %}
<h1 class="page-title">Reading Tiers</h1>
<p class="page-intro">
  <em>Fian Ilchruinne</em> is one record published at four depths. A reading tier is a
  readership — who the pages are for, which storylines they carry, and how much of the
  record they show. The tiers nest: each carries everything the one below it carries, and
  adds its own. Nothing read on a lower rung is withdrawn or contradicted on a higher one.
  This page says what each tier holds and where to find it.
</p>
{% if edition.tier and tierLabel[edition.tier] %}
<p>
  The edition you are reading, <strong>{{ edition.siteName or site.name }}</strong>, is built at the
  <strong>{{ tierLabel[edition.tier] | safe }} tier</strong>.
</p>
{% endif %}

<h2>Threads, tiers and editions</h2>
<p>
  Three words do the work on this site, and they nest the way the tiers do.
</p>
<ul>
  <li>
    <strong>A thread is a storyline.</strong> It is a set of whole seasons that read as one
    story, and every season belongs to exactly one thread. Eight are registered — the
    Founding Era, Tissadelle Shepherd's Arc, Undercover Pets, Orbital Five-O, Young Star
    Rangers, Below the Roof, The Infinite Castle and the Timeless Library, and Church Space — and the <a href="/star-rangers/threads/">Threads</a> page
    lists the ones the address you are on can see.
  </li>
  <li>
    <strong>A tier is a readership,</strong> and it is defined by which threads it
    carries. The children's tier carries two; each rung above carries everything below it
    and adds its own. A tier is a floor, not a ceiling: an edition on it may show more
    than the tier's threads, never fewer. The rungs order reading level, protagonists
    and depth, and nothing else: no tier is a rating, and none ranks a reader, a people
    or a mind.
  </li>
  <li>
    <strong>An edition is one address with a face of its own</strong> — a name, a palette,
    a tagline, a cast on the front page, a sound. Every edition sits on one tier and
    carries at least that tier's threads. A tier may hold more than one edition: the
    young-adult tier has two, and the contemplative tier has one for each of its orders.
    Editions can be added within a tier whenever a face, a page set or an institution
    warrants one, on a subdomain if the domains run out. The tiers are four, and are not
    expected to grow.
  </li>
</ul>
<p>
  Inside a thread the units get smaller. A thread is made of seasons, a season of
  episodes, an episode of chapters, and a chapter of scenes seen from more than one
  viewpoint. Within a single season the story may also run as two or more <strong>strands</strong>:
  parallel storylines with separate casts and no shared scenes, each complete on its own,
  meeting at a point fixed before either was written. Season 1 is the model — the
  Threshold Station survey team on one strand, the Marsh Causeway on the other, and the
  two converging at the causeway. A strand is a way of reading a season, not a setting on
  the site: no address shows one strand without the other. And a character's <em>arc</em>
  — Tissadelle Shepherd's, say — is a trajectory through many seasons, not a reading path
  of its own. The thread called <a href="/star-rangers/threads/tissadelle-arc/">Tissadelle
  Shepherd's Arc</a> borrows its name from hers because her career is what puts its five
  seasons in order; the thread is the reading path, and the arc is still hers.
</p>

<h2>The ladder</h2>
<p>
  Four rungs, bottom to top. Each one names the reader it is for, how it reads, the
  storylines it adds to the rung below, and the address that serves it. The registers
  escalate in permission rather than in seriousness: a playful rung is not a shallow one,
  and a questioning rung is not a grim one. Every reader has a body their own
  size in the room: an animal for the child, a raw Deputy for the young adult, the
  middle-aged and the aliens for the general reader, and the oldest — and the cast in
  their later years — for the contemplative one.
</p>

<section class="thread-section" aria-labelledby="tier-children">
  <h3 class="thread-section__title" id="tier-children">1 · Children</h3>
  <p class="thread-section__description">
    <strong>How it reads:</strong> interesting and playful. Short scenes, plain words, and a
    story to be enjoyed rather than decoded.
  </p>
  <p class="thread-section__description">
    <a href="/star-rangers/threads/undercover-pets/">Undercover Pets</a>, Season 2: the
    Undercover Pets Detective Agency and the animals around it, written in short scenes and
    plain words. The bottom of the ladder, and complete in itself.
  </p>
  <p class="thread-section__description">
    Beside it on this rung: <a href="/star-rangers/threads/below-the-roof/">Below
    the Roof</a>, Seasons 11 and 12 — the Pandoids of Fliade from inside their own deep networks, the
    record's first storyline carried by a non-human cast. Two complete seasons, each told in
    two strands.
  </p>
  <p class="thread-section__description">
    <strong>Where:</strong> two doors, each its own face, both in large type with a reading
    plan of their own. <strong>undercover-pets.com</strong> carries the agency.
    <strong>told.fianilchruinne.com</strong> carries Below the Roof beside it, and opens with
    that thread's first chapter. The tier carries both storylines; each door shows the one
    it is named for.
  </p>
</section>

<section class="thread-section" aria-labelledby="tier-young-adult">
  <h3 class="thread-section__title" id="tier-young-adult">2 · Young adult</h3>
  <p class="thread-section__description">
    <strong>How it reads:</strong> more mysterious, with a sense of exploration and
    adventure. The reader goes out into the record and finds things.
  </p>
  <p class="thread-section__description">
    Adds <a href="/star-rangers/threads/orbital-five-o/">Orbital Five-O</a>, Seasons 4 and 10 —
    the Governor's Investigative Task Force — and
    <a href="/star-rangers/threads/young-star-rangers/">Young Star Rangers</a>, Season 9 —
    Cadets and Deputies in their first field postings. The young-adult reader's proxy is a
    raw Deputy or trainee; older characters appear here as the people who have seen it
    all before, unless the chronology makes them young at the right time, as it does for
    Tissadelle Shepherd's cadet year.
  </p>
  <p class="thread-section__description">
    Beside them on this rung: <a href="/star-rangers/threads/five-islands/">The Infinite
    Castle and the Timeless Library</a>, Season 13 — the Kingdom of the Five Islands from
    inside its own records, with a young keeper of each learning to hold one. One season,
    told in two strands.
  </p>
  <p class="thread-section__description">
    <strong>Where:</strong> two doors, each its own face. <strong>starquest.site</strong>
    carries Orbital Five-O and the pets. <strong>young.fianilchruinne.com</strong> carries
    Young Star Rangers beside them, and opens with that thread's first chapter. Each door
    shows the storyline it is named for. The Infinite Castle and the Timeless Library has
    no door of its own yet, and is read on the general addresses, which carry everything
    on the rungs below them.
  </p>
</section>

<section class="thread-section" aria-labelledby="tier-general">
  <h3 class="thread-section__title" id="tier-general">3 · General</h3>
  <p class="thread-section__description">
    <strong>How it reads:</strong> deeper. The same record with its reasons under it — the
    institutions, the cost of a decision, and the Lore and Codex standing behind a chapter.
  </p>
  <p class="thread-section__description">
    Adds the main sequence: the <a href="/star-rangers/threads/founding-era/">Founding
    Era</a>, Season 0, and <a href="/star-rangers/threads/tissadelle-arc/">Tissadelle
    Shepherd's Arc</a>, Seasons 1, 3, 5, 6 and 7 — Cadet to Line Captain to the Last Stand
    — together with the Lore, the Codex, the Atlas and the Timeline that sit behind it.
    The middle-aged carry this tier, and so do the aliens.
  </p>
  <p class="thread-section__description">
    <strong>Where:</strong> <strong>fianilchruinne.com</strong>, the canonical address,
    which shows every public page of the record; and
    <strong>sciencefiction.site</strong>, the same tier at its original address.
  </p>
</section>

<section class="thread-section" aria-labelledby="tier-contemplative">
  <h3 class="thread-section__title" id="tier-contemplative">4 · Contemplative</h3>
  <p class="thread-section__description">
    <strong>How it reads:</strong> free to question everything, the record's own premises
    included. Questioning is not contradicting: a question asked on this rung takes nothing
    back from the ones below it.
  </p>
  <p class="thread-section__description">
    Adds <a href="https://church-space.site/threads/church-space/">Church Space</a>, Season 8 —
    devotional reading kept beside the shared record — and the pages of the orders that
    keep it. This is the only tier that holds the whole record. It may also carry
    additional viewpoint scenes in any chapter of any storyline: a character sitting with
    an event after it has happened. Those scenes are simply absent on every lower tier,
    and no chapter depends on them. The oldest characters belong here, and the existing
    cast in their later years.
  </p>
  <p class="thread-section__description">
    <strong>Where:</strong> two orders, two addresses. <strong>fellowshipoflight.org</strong>
    is the Fellowship of Light's edition; <strong>church-space.site</strong> is the
    Communion of the Called's. Both are set for slow reading. A third address,
    <strong>fellowshipoflight.site</strong>, is the Fellowship's comparative archive: a
    shelf at this tier rather than a reading edition, and it stands outside the ladder on
    purpose.
  </p>
</section>

<h2>What nesting means</h2>
<ul>
  <li>
    <strong>Climbing loses nothing.</strong> A reader who moves up a rung keeps every
    chapter they had and gains the ones above. The pets are on the young-adult sites; the
    pets and the task force are on the general sites; all of it is on the contemplative
    ones.
  </li>
  <li>
    <strong>Every chapter is complete at every tier.</strong> A scene the contemplative
    tier adds may deepen a chapter, reflect on it or witness it, but the plot never
    depends on it. The "View from" buttons on a chapter show only the viewpoints the
    tier you are reading carries, so the buttons and the page always agree.
  </li>
  <li>
    <strong>The canonical site is at the general tier.</strong> It shows everything public
    and keeps the Church Space thread aside by design, so the contemplative editions are
    the one complete view, and that is intended.
  </li>
  <li>
    <strong>A tier is not a page style.</strong> The <em>Reading</em> control in the header
    changes type size, measure and density, and you can set it on any address. The tier
    decides what is on the shelf; the control decides how the shelf is lit.
  </li>
</ul>

<h2>What does not change</h2>
<p>
  The canon is identical on every address. A tier narrows what a domain shows, or adds
  reading to it, and an edition frames it — a name, a palette, a tagline, a cast on the
  front page — but no edition can assert anything the others deny. A page a tier does
  not carry still exists at its own address as a placeholder that points at the edition
  which does, so no link from any tier ever leads nowhere. The full list of official
  addresses, including aliases, is on the
  <a href="/star-rangers/official/">Official Editions</a> page.
</p>

<h2>Choosing a rung</h2>
<p>
  There is no wrong door. Start at the tier that fits the reader in the chair, and climb
  when you want more of the record than that rung shows — nothing you have read will be
  taken back. The <a href="/star-rangers/start/">Reading Plan</a> on any address says
  where its own first chapter is, and the <a href="/star-rangers/threads/">Threads</a>
  page lists every storyline the address you are on can see.
</p>
