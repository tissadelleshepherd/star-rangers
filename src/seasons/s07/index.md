---
layout: base.njk
title: "Season 7"
eleventyComputed:
  description: "Episodes and chapters in Season 7 of {{ site.name }}."
permalink: /seasons/s07/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 7</li>
  </ol>
</nav>

<h1 class="page-title">Season 7</h1>
<p class="page-intro">
  The file Season 6 could not close comes due. The climax is not a fight, and this page will not tell you what it is instead — only that precision, not force, is the instrument everything turns on. Season 7 follows what help looks like when nobody is allowed to decide what a person's story means except her.
</p>
<p class="page-intro">
  The final published season, and the one this site works hardest not to spoil: read Seasons 5 and 6 first, and ideally Season 1 before those. Expect every register the series has used — procedural, testimonial, and something older — asked to hold together at once, and an ending that keeps the record's first promise: one history, many witnesses, and nobody's meaning assigned for them.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (7 | threadForSeason).id }}/">{{ (7 | threadForSeason).name }}</a></p>

{% set seasonNumber = "7" %}
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
          <a href="/star-rangers/seasons/s07/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
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
