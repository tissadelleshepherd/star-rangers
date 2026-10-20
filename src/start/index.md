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
<img class="page-hero-image" src="/star-rangers/images/hero/s01e03-archive.jpg" alt="Shelves packed with worn paper files and folders standing on end, a row of labelled archive files on the shelf below" />
<h1 class="page-title">The Reading Plan</h1>
<p class="page-intro">
  <em>An archivist's note — which is to say: unofficial, signed, and permitted an opinion. I keep the record you are about to read reconciled, and this note is what I tell people who ask my desk where to start, written down so I can stop repeating it. The record is one history attested by many witnesses, and the shelf around it is reference, not homework — you need none of it before you begin. If you would rather browse than be guided, <a href="/star-rangers/seasons/">Seasons &amp; Episodes</a> lists everything, and my feelings will survive.</em>
</p>

{#- "Begin here" opens on the spine's first numbered episode, not on
    Episode 0. Story order puts the Season 1 prequels (S01E00) first, and
    until 2026-10-09 the page sent a new reader to a cat on the road to an
    abbey when the homepage had just promised a station clock; Dermot's
    Option A that day: open on the clock, offer the prequels one line later.
    `preludeFirst` is the first Season 1 Episode 0 chapter, if the build
    carries one; the sentence under it describes that episode, so it is
    pinned to Season 1 rather than to whichever season the spine opens on. -#}
{% set spineFirst = null %}
{% set preludeFirst = null %}
{% for chapter in allChapters %}
  {%- if (chapter.data.season | threadForSeason).id == "tissadelle-arc" -%}
    {%- if not spineFirst and chapter.data.episode > 0 -%}
      {%- set spineFirst = chapter -%}
    {%- endif -%}
  {%- endif -%}
{% endfor %}
{% if spineFirst %}
  {%- for chapter in allChapters -%}
    {%- if not preludeFirst and spineFirst.data.season == 1 and chapter.data.season == 1 and chapter.data.episode == 0 -%}
      {%- set preludeFirst = chapter -%}
    {%- endif -%}
  {%- endfor -%}
{% endif %}
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
  {%- if preludeFirst -%}
  <p class="thread-section__description">
    The same season also keeps an <a href="/star-rangers{{ preludeFirst.url | replace(preludeFirst.fileSlug + "/", "") }}">Episode 0</a> of prequels — a household cat, three machines on a wrecked ship, a boundary analyst's three words — which the <em>Next</em> link will not hand you on this path. Read them after the station, when you know what they were before.
  </p>
  {%- endif -%}
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

<section class="thread-section" aria-labelledby="plan-arranged">
  <h2 class="thread-section__title" id="plan-arranged">How the record is arranged</h2>
  <p class="thread-section__description">
    Outside Sen's note, and in plain terms: the record is published at four reading tiers that nest, each carrying
    everything inside it and adding storylines of its own, and nothing read on an inner tier is withdrawn or
    contradicted on an outer one. Every address you can read it at is an <em>edition</em> on one of those tiers.
    Inside any storyline the units get smaller in the same order everywhere.
  </p>
  <figure class="lore-diagram">
<svg viewBox="0 0 640 394" role="img" aria-labelledby="arranged-title arranged-desc">
<title id="arranged-title">How the record is arranged</title>
<desc id="arranged-desc">Four nested boxes show the reading tiers. Children, which reads interesting and playful, is innermost; young adult, sensual and romantic, exploring, contains it; general, deeper, mysterious and strategic, contains that; and contemplative, free to question everything, contains them all. Each tier carries everything inside it and adds its own storylines.{% if edition.tier %} This edition sits at the {{ edition.tier | replace("-", " ") }} tier.{% endif %} Below, a row of six boxes shows the units inside a storyline, largest to smallest: thread, season, episode, chapter, scene, and viewpoint. A note under the season box says a season may run as two or more strands, parallel storylines that meet at a fixed point.</desc>
<text x="20" y="28" class="sm mute">One record at four reading tiers: each carries everything inside it, and adds its own storylines</text>
<rect x="20" y="44" width="600" height="196" rx="6" class="{% if edition.tier == "contemplative" %}box-1{% else %}box-2{% endif %}"/>
<text x="34" y="66">Contemplative{% if edition.tier == "contemplative" %}<tspan class="sm fill-1"> · this edition</tspan>{% endif %}</text>
<text x="606" y="66" text-anchor="end" class="sm mute">free to question everything</text>
<rect x="40" y="78" width="560" height="148" rx="6" class="{% if edition.tier == "general" %}box-1{% else %}box-2{% endif %}"/>
<text x="54" y="100">General{% if edition.tier == "general" %}<tspan class="sm fill-1"> · this edition</tspan>{% endif %}</text>
<text x="586" y="100" text-anchor="end" class="sm mute">deeper, mysterious and strategic</text>
<rect x="60" y="112" width="520" height="100" rx="6" class="{% if edition.tier == "young-adult" %}box-1{% else %}box-2{% endif %}"/>
<text x="74" y="134">Young adult{% if edition.tier == "young-adult" %}<tspan class="sm fill-1"> · this edition</tspan>{% endif %}</text>
<text x="566" y="134" text-anchor="end" class="sm mute">sensual and romantic, exploring</text>
<rect x="80" y="146" width="480" height="52" rx="6" class="{% if edition.tier == "children" %}box-1{% else %}box-2{% endif %}"/>
<text x="94" y="168">Children{% if edition.tier == "children" %}<tspan class="sm fill-1"> · this edition</tspan>{% endif %}</text>
<text x="546" y="168" text-anchor="end" class="sm mute">interesting and playful</text>
<rect x="20.0" y="288" width="86" height="44" rx="5" class="box-2"/>
<text x="63.0" y="315" text-anchor="middle">Thread</text>
<path d="M109.0 310 h10.8 m-4 -4 l4 4 l-4 4" class="line-0"/>
<rect x="122.8" y="288" width="86" height="44" rx="5" class="box-2"/>
<text x="165.8" y="315" text-anchor="middle">Season</text>
<path d="M211.8 310 h10.8 m-4 -4 l4 4 l-4 4" class="line-0"/>
<rect x="225.6" y="288" width="86" height="44" rx="5" class="box-2"/>
<text x="268.6" y="315" text-anchor="middle">Episode</text>
<path d="M314.6 310 h10.8 m-4 -4 l4 4 l-4 4" class="line-0"/>
<rect x="328.4" y="288" width="86" height="44" rx="5" class="box-2"/>
<text x="371.4" y="315" text-anchor="middle">Chapter</text>
<path d="M417.4 310 h10.8 m-4 -4 l4 4 l-4 4" class="line-0"/>
<rect x="431.2" y="288" width="86" height="44" rx="5" class="box-2"/>
<text x="474.2" y="315" text-anchor="middle">Scene</text>
<path d="M520.2 310 h10.8 m-4 -4 l4 4 l-4 4" class="line-0"/>
<rect x="534.0" y="288" width="86" height="44" rx="5" class="box-2"/>
<text x="577.0" y="315" text-anchor="middle">Viewpoint</text>
<text x="20" y="276" class="sm mute">Inside every storyline, largest to smallest</text>
<path d="M165.8 334 v14 h8" class="line-0 dash"/>
<text x="179" y="352" class="sm mute">a season may run as two or more strands that meet at a fixed point</text>
<text x="20" y="380" class="sm mute">A chapter is made of scenes, and each scene is seen from more than one viewpoint</text>
</svg>
<figcaption>The reading tiers nest; the edition you are reading is marked. Inside a storyline, a thread holds whole seasons, a season holds episodes (and may run as two or more strands, parallel storylines that meet at a point fixed in advance), an episode holds chapters, a chapter holds scenes, and each scene is told from more than one viewpoint. <a href="/star-rangers/tiers/">Reading Tiers</a> says which storylines each tier carries and where to read it.</figcaption>
  </figure>
</section>

<section class="thread-section" aria-label="Beyond the record">
  <p class="thread-section__description">
    Beyond the record's own shelves: the <a href="/star-rangers/story-engine/">Story Engine</a> collects out-of-world craft notes on how the work is built, and new chapters arrive on the <a href="{{ '/feed/feed.xml' | absoluteUrl(site.url) }}">Atom feed</a>.
  </p>
</section>
{% endif %}
