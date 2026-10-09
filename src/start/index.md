---
layout: base.njk
title: "Reading Plan"
eleventyComputed:
  description: "{% if edition.readingPlan %}Where to start reading {{ site.name }}, and how a chapter works.{% else %}A guided path through {{ site.name }}, written as an archivist's note from the Survey Archive — where to begin, how testimony works, and what the shelf will and won't vouch for.{% endif %}"
permalink: /start/
---
{#- Which reference shelves THIS build actually carries. A narrowed edition
    (deploy.conf / lib/editions.js) can filter a whole section down to nothing -
    undercover-pets.com carries no lore and no atlas locations - and a shelf
    recommended here that opens on "No lore articles published yet" is a
    promise the page cannot keep. So each shelf is listed only when it has
    something on it. Characters is always present: every edition fronts a
    cast. The atlas is a view over lore entries with a galaxy, the same test
    src/atlas/index.md applies. -#}
{% set atlasCount = 0 %}
{% for entry in collections.lore %}
  {%- if entry.data.category == "Locations" and entry.data.galaxy %}{% set atlasCount = atlasCount + 1 %}{% endif -%}
{% endfor %}
{% set shelfHas = {
  characters: true,
  glossary: collections.glossary.length > 0,
  timeline: collections.timelineEvents.length > 0,
  codex: collections.codex.length > 0,
  lore: collections.lore.length > 0,
  atlas: atlasCount > 0
} %}
{% set shelfUrl = {
  characters: "/star-rangers/characters/",
  glossary: "/star-rangers/glossary/",
  timeline: "/star-rangers/timeline/",
  codex: "/star-rangers/codex/",
  lore: "/star-rangers/lore/",
  atlas: "/star-rangers/atlas/"
} %}
{% set shelfName = {
  characters: "Characters",
  glossary: "Glossary",
  timeline: "Timeline",
  codex: "Codex",
  lore: "Lore",
  atlas: "Atlas"
} %}

{% set allChapters = collections.chapters %}
{% set markedAbsencesIncluded = false %}
{% for entry in collections.codex %}
  {%- if entry.url == "/codex/marked-absences/" %}{% set markedAbsencesIncluded = true %}{% endif -%}
{% endfor %}

{% if edition.readingPlan %}
{#- ======================================================================
    The plain-register plan. An edition opts into this by carrying a
    `readingPlan` in lib/editions.js (today: pets, the children's tier). The
    registry supplies the sentences; this template supplies the headings, the
    first chapter, and which shelves exist. Every string is trusted HTML, as
    heroSubtitle is.
    ====================================================================== -#}
{% set plan = edition.readingPlan %}
{% set planFirst = null %}
{% for chapter in allChapters %}
  {%- if not planFirst and (chapter.data.season | threadForSeason).id == plan.startThreadId -%}
    {%- set planFirst = chapter -%}
  {%- endif -%}
{% endfor %}

<h1 class="page-title">Where to Start</h1>
<p class="page-intro">{{ plan.intro | safe }}</p>

<section class="thread-section" aria-labelledby="plan-step-1">
  <h2 class="thread-section__title" id="plan-step-1">1 · Begin here</h2>
  <p class="thread-section__description">{{ plan.begin | safe }}</p>
  {%- if planFirst -%}
  <ul class="chapter-list" role="list">
    <li class="chapter-list__item">
      <a href="/star-rangers{{ planFirst.url }}">
        <span class="chapter-list__code">{{ planFirst.data.id | upper }}</span>
        <span class="chapter-list__title">{{ planFirst.data.title }}</span>
        {%- if planFirst.data.location -%}
        <span class="chapter-list__loc">{{ planFirst.data.location }}</span>
        {%- endif -%}
      </a>
    </li>
  </ul>
  {%- else -%}
  <p class="thread-section__description">No chapters published yet. <a href="/star-rangers/seasons/">Seasons &amp; Episodes</a> will show them when they arrive.</p>
  {%- endif -%}
</section>

<section class="thread-section" aria-labelledby="plan-step-2">
  <h2 class="thread-section__title" id="plan-step-2">2 · How to read a chapter</h2>
  <p class="thread-section__description">{{ plan.howToRead | safe }}</p>
</section>

<section class="thread-section" aria-labelledby="plan-step-3">
  <h2 class="thread-section__title" id="plan-step-3">3 · Where to look things up</h2>
  <ul class="thread-section__description">
    {%- for key in ["characters", "glossary", "timeline", "codex", "lore", "atlas"] -%}
    {%- if shelfHas[key] and plan.shelves[key] -%}
    <li><a href="{{ shelfUrl[key] }}">{{ shelfName[key] }}</a> — {{ plan.shelves[key] | safe }}</li>
    {%- endif -%}
    {%- endfor -%}
  </ul>
</section>

{% set otherThreads = [] %}
{% for thread in storylineThreads %}
  {%- if thread.id != plan.startThreadId -%}
    {%- set firstInThread = null -%}
    {%- for chapter in allChapters -%}
      {%- if not firstInThread and (chapter.data.season | threadForSeason).id == thread.id -%}
        {%- set firstInThread = chapter -%}
      {%- endif -%}
    {%- endfor -%}
    {%- if firstInThread -%}
      {%- set otherThreads = (otherThreads.push({ thread: thread, first: firstInThread }), otherThreads) -%}
    {%- endif -%}
  {%- endif -%}
{% endfor %}
{% if otherThreads.length %}
<section class="thread-section" aria-labelledby="plan-step-4">
  <h2 class="thread-section__title" id="plan-step-4">4 · More stories</h2>
  <p class="thread-section__description">{{ plan.more | safe }}</p>
  {%- for branch in otherThreads -%}
  <div class="season-block">
    <h3 class="season-block__title">
      <a href="/star-rangers/threads/{{ branch.thread.id }}/">{{ branch.thread.name }}</a>
    </h3>
    <ul class="chapter-list" role="list">
      <li class="chapter-list__item">
        <a href="/star-rangers{{ branch.first.url }}">
          <span class="chapter-list__code">{{ branch.first.data.id | upper }}</span>
          <span class="chapter-list__title">{{ branch.first.data.title }}</span>
          {%- if branch.first.data.location -%}
          <span class="chapter-list__loc">{{ branch.first.data.location }}</span>
          {%- endif -%}
        </a>
      </li>
    </ul>
  </div>
  {%- endfor -%}
</section>
{% endif %}

{% else %}
{#- ======================================================================
    The site-wide plan: Sen's archivist's note.
    ====================================================================== -#}
<img class="page-hero-image" src="/star-rangers/images/hero/s01e03-archive.jpg" alt="An old archive shelf of records" />
<h1 class="page-title">The Reading Plan</h1>
<p class="page-intro">
  <em>An archivist's note — which is to say: unofficial, signed, and permitted an opinion. I keep the record you are about to read reconciled, and this note is what I tell people who ask my desk where to start, written down so I can stop repeating it. The record is one history attested by many witnesses, and the shelf around it is reference, not homework — you need none of it before you begin. If you would rather browse than be guided, <a href="/star-rangers/seasons/">Seasons &amp; Episodes</a> lists everything, and my feelings will survive.</em>
</p>

{% set spineFirst = null %}
{% for chapter in allChapters %}
  {%- if not spineFirst and (chapter.data.season | threadForSeason).id == "tissadelle-arc" -%}
    {%- set spineFirst = chapter -%}
  {%- endif -%}
{% endfor %}
{% if not spineFirst and allChapters.length %}{% set spineFirst = allChapters[0] %}{% endif %}

<section class="thread-section" aria-labelledby="plan-step-1">
  <h2 class="thread-section__title" id="plan-step-1">1 · Start with the spine</h2>
  <p class="thread-section__description">
    Every archive has a spine — the sequence the rest of the shelf leans against. Ours is the <a href="/star-rangers/threads/tissadelle-arc/">Tissadelle Shepherd's Arc</a>: Cadet to Principal to Line Captain to the Last Stand, and what the Last Stand leaves behind. Everything else in the collection either runs parallel to it or exists to be consulted while reading it, which is the polite way of saying it is the right first read.
  </p>
  {%- if spineFirst -%}
  <p class="thread-section__description">
    Begin here. The <em>Next</em> link at the foot of each chapter walks the whole record in season order, which can hand you sideways into the parallel storylines where their seasons fall and back to the spine after each. That is not a filing error; it is how the shelf is ordered. If you want the spine unbroken, read down <a href="/star-rangers/threads/tissadelle-arc/">its thread page's chapter list</a> instead. Both paths arrive, and neither spoils the other.
  </p>
  <ul class="chapter-list" role="list">
    <li class="chapter-list__item">
      <a href="/star-rangers{{ spineFirst.url }}">
        <span class="chapter-list__code">{{ spineFirst.data.id | upper }}</span>
        <span class="chapter-list__title">{{ spineFirst.data.title }}</span>
        {%- if spineFirst.data.location -%}
        <span class="chapter-list__loc">{{ spineFirst.data.location }}</span>
        {%- endif -%}
      </a>
    </li>
  </ul>
  {%- else -%}
  <p class="thread-section__description">
    This edition of the record carries no chapters from the spine. <a href="/star-rangers/seasons/">Seasons &amp; Episodes</a> will tell you what it does hold — pick up the path there, and rejoin this note at step 4.
  </p>
  {%- endif -%}
</section>

<section class="thread-section" aria-labelledby="plan-step-2">
  <h2 class="thread-section__title" id="plan-step-2">2 · Read a chapter the way it was taken down</h2>
  <p class="thread-section__description">
    A chapter is not a story with a narrator; it is testimony — several witnesses to one event, each account withholding what the next supplies. Read it straight through the first time: nothing is hidden from a straight read. Then, when a passage bothers you — and a good record should occasionally bother you — use the <em>View from</em> buttons at the top of the chapter to hold one witness to their own account, or the <em>Read scene-by-scene</em> list at the bottom to hold one scene still and walk every witness through it in turn. That second exercise is most of my job. I commend it.
  </p>
</section>

<section class="thread-section" aria-labelledby="plan-step-3">
  <h2 class="thread-section__title" id="plan-step-3">3 · Know what the shelf will vouch for</h2>
  <p class="thread-section__description">
    When a term, a place, or a name stops you, the shelf answers without telling you what happens next. But not every section carries the same authority, and I would be a poor archivist if I let you assume otherwise:
  </p>
  <ul class="thread-section__description">
    {%- if shelfHas.glossary %}<li><a href="/star-rangers/glossary/">Glossary</a> — terms, fixed before the arguments begin. The fastest answer to "what is that?"</li>{% endif -%}
    {%- if shelfHas.lore %}<li><a href="/star-rangers/lore/">Lore</a> — the settled record: what the Archive will state flatly and stand behind. History, factions, species, technology, and the cosmology under all of it.</li>{% endif -%}
    <li><a href="/star-rangers/characters/">Characters</a> — who's who, and whose eyes you have been reading through.</li>
    {%- if shelfHas.atlas %}<li><a href="/star-rangers/atlas/">Atlas</a> — where everything is.</li>{% endif -%}
    {%- if shelfHas.codex %}<li><a href="/star-rangers/codex/">Codex</a> — the paperwork itself: primary sources with named authors, some incomplete, some biased, one or two built to mislead. Unlike lore, a codex entry can be wrong. I keep those shelves too, and I say this with affection: read them the way I file them, with the author's name held firmly in view.</li>{% endif -%}
  </ul>
</section>

{% set branchThreads = [] %}
{% for thread in storylineThreads %}
  {%- if thread.id != "tissadelle-arc" -%}
    {%- set firstInThread = null -%}
    {%- for chapter in allChapters -%}
      {%- if not firstInThread and (chapter.data.season | threadForSeason).id == thread.id -%}
        {%- set firstInThread = chapter -%}
      {%- endif -%}
    {%- endfor -%}
    {%- if firstInThread -%}
      {%- set branchThreads = (branchThreads.push({ thread: thread, first: firstInThread }), branchThreads) -%}
    {%- endif -%}
  {%- endif -%}
{% endfor %}
{% if branchThreads.length %}
<section class="thread-section" aria-labelledby="plan-step-4">
  <h2 class="thread-section__title" id="plan-step-4">4 · Branch out by storyline</h2>
  <p class="thread-section__description">
    A season number marks a position in the setting's timeline, not a claim on your attention. The other <a href="/star-rangers/threads/">storyline threads</a> run parallel to the spine, each self-contained, each with its own cast. Take them in any order, between seasons of the spine or after it — the record does not mind.
  </p>
  {%- for branch in branchThreads -%}
  <div class="season-block">
    <h3 class="season-block__title">
      <a href="/star-rangers/threads/{{ branch.thread.id }}/">{{ branch.thread.name }}</a>
    </h3>
    <p class="thread-section__description">{{ branch.thread.description }}{% if branch.thread.id == "founding-era" %} As the prequel, it reads just as well before the spine as after its opening season.{% endif %}</p>
    <ul class="chapter-list" role="list">
      <li class="chapter-list__item">
        <a href="/star-rangers{{ branch.first.url }}">
          <span class="chapter-list__code">{{ branch.first.data.id | upper }}</span>
          <span class="chapter-list__title">{{ branch.first.data.title }}</span>
          {%- if branch.first.data.location -%}
          <span class="chapter-list__loc">{{ branch.first.data.location }}</span>
          {%- endif -%}
        </a>
      </li>
    </ul>
  </div>
  {%- endfor -%}
</section>
{% endif %}

<section class="thread-section" aria-labelledby="plan-step-5">
  <h2 class="thread-section__title" id="plan-step-5">5 · Let the record argue with itself</h2>
  <p class="thread-section__description">
    Once the story has hold of you, go where the record disagrees. {% if shelfHas.timeline %}The <a href="/star-rangers/timeline/">Timeline</a> keeps the official sequence — confirmed fact first, while the chapters dispute motive, memory, and meaning. {% endif %}{% if shelfHas.codex %}The <a href="/star-rangers/codex/">Codex</a> is where those disputes leave paperwork. {% endif %}And you will find gaps: some are records not yet reconciled, some are files sealed by authorities whose reasons are on file even where their contents are not, and a few are absences the record has marked deliberately, because a marked absence is itself information.{% if markedAbsencesIncluded %} I keep a working list — <a href="/star-rangers/codex/marked-absences/">Marked Absences</a> — so that no reader mistakes a gap for an oversight.{% endif %}
  </p>
  <p class="thread-section__description">
    <em>— Sen, Senior Archivist, Survey Archive, Threshold Station. Filed as a reading aid, not as doctrine; comments to the usual shelf.</em>
  </p>
</section>

<section class="thread-section" aria-label="Beyond the record">
  <p class="thread-section__description">
    Beyond the record's own shelves: the <a href="/star-rangers/story-engine/">Story Engine</a> collects out-of-world craft notes on how the work is built, and new chapters arrive on the <a href="{{ '/feed/feed.xml' | absoluteUrl(site.url) }}">Atom feed</a>.
  </p>
</section>
{% endif %}
