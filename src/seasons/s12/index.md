---
layout: base.njk
title: "Season 12"
eleventyComputed:
  description: "Episodes and chapters in Season 12 of {{ site.name }}."
permalink: /seasons/s12/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 12</li>
  </ol>
</nav>

<h1 class="page-title">Season 12</h1>
<p class="page-intro">
  Below the roof, a year on. Season 12 is the second season of the Below the Roof thread: the Told of <a href="/star-rangers/lore/planets/fliade/">Fliade</a> in the warm deep, in the survey's third year on the ground, meeting shapes that have no warmth and move no stone. Not murders, just shadows. Written for the child reader.
</p>
<p class="page-intro">
  A season that stands alone: no prior reading required, though a reader of <a href="/star-rangers/seasons/s11/">Season 11</a> will know the line, the two stones on it, and the rule that a telling is settled by who was there.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (12 | threadForSeason).id }}/">{{ (12 | threadForSeason).name }}</a></p>

{% set seasonNumber = "12" %}
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
          <a href="/star-rangers/seasons/s12/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
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
