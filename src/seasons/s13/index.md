---
layout: base.njk
title: "Season 13"
eleventyComputed:
  description: "Episodes and chapters in Season 13 of {{ site.name }}."
permalink: /seasons/s13/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 13</li>
  </ol>
</nav>

<h1 class="page-title">Season 13</h1>
<p class="page-intro">
  The Kingdom of the Five Islands, from inside its own records. Season 13 is the first season of the Infinite Castle and the Timeless Library thread: a castle no generation has finished, kept by the court's spoken chronicle, and a library that does not age, kept by the <a href="/star-rangers/lore/planets/kingdom-of-the-five-islands/">Tideward Sisterhood</a> in a hand that has never changed. Written for the young-adult reader, as a reading and never a mechanism.
</p>
<p class="page-intro">
  A season that stands alone: no prior reading required. Episode 1 is the court's strand and Episode 2 the Abbey's, each whole on its own, so a reader who reads one episode has one whole record.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (13 | threadForSeason).id }}/">{{ (13 | threadForSeason).name }}</a></p>

{% set seasonNumber = "13" %}
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
          <a href="/star-rangers/seasons/s13/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
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
