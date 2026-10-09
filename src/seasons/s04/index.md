---
layout: base.njk
title: "Season 4"
eleventyComputed:
  description: "Episodes and chapters in Season 4 of {{ site.name }}."
permalink: /seasons/s04/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 4</li>
  </ol>
</nav>

<h1 class="page-title">Season 4</h1>
<p class="page-intro">
  The Compact's five habitats each police themselves competently — and any offence organised to cross a habitat line is an offence none of them can finish. Season 4 follows Commander Kai Larsen's Orbital Five-O: the Governor's task force that works the seams between five perfect ledgers, in the open, raven included.
</p>
<p class="page-intro">
  A procedural season that stands alone: notifications filed in advance, jurisdiction enforced from the inside, and cases that live in the gaps between honest records. No prior season required — though readers of the main line will recognise the habitats, and readers of Season 2 may recognise a working method from the other end of the telescope.
</p>
<p class="page-intro">
  Episode 0 is a prologue set a year before the season, in the late autumn of 2826, when Tissadelle Shepherd was a Deputy on Eden's fold-approach watch; by the season's own year she holds higher rank elsewhere, and nothing in Episode 1 onward depends on the prologue.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (4 | threadForSeason).id }}/">{{ (4 | threadForSeason).name }}</a></p>

{% set seasonNumber = "4" %}
{% include "season-portraits.njk" %}
{% set hasSeasonChapters = false %}
{% set currentEpisode = "" %}
{% for chapter in collections.chapters %}
  {%- if (chapter.data.season ~ "") == seasonNumber -%}
    {%- if not hasSeasonChapters %}{% set hasSeasonChapters = true %}{% endif -%}
    {%- set episodeValue = chapter.data.episode ~ "" -%}
    {%- if episodeValue != currentEpisode -%}
      {%- if currentEpisode %}</ul></div>{% endif -%}
      {%- set currentEpisode = episodeValue -%}
      <div class="season-block">
        <h2 class="season-block__title">
          <a href="/star-rangers/seasons/s04/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
        </h2>
        <ul class="chapter-list" role="list">
    {%- endif -%}
          <li class="chapter-list__item">
            <a href="/star-rangers{{ chapter.url }}">
              <span class="chapter-list__code">{{ chapter.data.id | upper }}</span>
              <span class="chapter-list__title">{{ chapter.data.title }}</span>
              {%- if chapter.data.location -%}
              <span class="chapter-list__loc">{{ chapter.data.location }}</span>
              {%- endif -%}
            </a>
          </li>
  {%- endif -%}
{% endfor %}
{% if hasSeasonChapters %}
  </ul></div>
{% else %}
  <p class="page-intro">No chapters published yet for this season.</p>
{% endif %}
