---
layout: base.njk
title: "Season 8"
threadId: church-space
eleventyComputed:
  description: "Episodes and chapters in Season 8 of {{ site.name }}."
permalink: /seasons/s08/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 8</li>
  </ol>
</nav>

<h1 class="page-title">Season 8</h1>
<p class="page-intro">
  The same record, kept at a different hour. Season 8 is the Church Space storyline — the watchers the wider record files under other headings: keepers, vigils, and the discipline of attending to a small steady wrongness without requiring it to explain itself. The events are the events every other season shares; this is the reading kept beside them.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (8 | threadForSeason).id }}/">{{ (8 | threadForSeason).name }}</a></p>

{% set seasonNumber = "8" %}
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
          <a href="/star-rangers/seasons/s08/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
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
