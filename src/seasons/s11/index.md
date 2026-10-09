---
layout: base.njk
title: "Season 11"
eleventyComputed:
  description: "Episodes and chapters in Season 11 of {{ site.name }}."
permalink: /seasons/s11/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 11</li>
  </ol>
</nav>

<h1 class="page-title">Season 11</h1>
<p class="page-intro">
  Below the roof. Season 11 is the first season of the Below the Roof thread: the Pandoids of <a href="/star-rangers/lore/planets/fliade/">Fliade</a> on their own ground, in the warm deep beneath a frozen surface, met from inside for the first time and written for the child reader.
</p>
<p class="page-intro">
  A season that stands alone: no prior reading required. Readers of the survey record will recognise the world and may recognise one of its people.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (11 | threadForSeason).id }}/">{{ (11 | threadForSeason).name }}</a></p>

{% set seasonNumber = "11" %}
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
          <a href="/star-rangers/seasons/s11/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
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
