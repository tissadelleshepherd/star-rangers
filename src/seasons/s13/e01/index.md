---
layout: base.njk
title: "Episode 1"
eleventyComputed:
  description: "Chapters in Season 13, Episode 1 of {{ site.name }}."
permalink: /seasons/s13/e01/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s13/">Season 13</a></li>
    <li aria-current="page">Episode 1</li>
  </ol>
</nav>

<h1 class="page-title">Season 13 · Episode 1</h1>
<p class="page-intro">
  The Infinite Castle. The court's strand, from inside the Kingdom: the youngest of a Knight's house is sent across
  the water to Krilzat, where the Castle stands on the windward side of Casimor and takes every storm first, to learn
  the chronicle in its rooms, the way every Old House's youngest has. The keeper's son has kept the door all his life
  and has watched the Castle's people go by at their hours without ever having a name for one. Nobody has walked to
  the end of the Castle, because it has none. At the hour, a figure made of the lamp's light walks the long hall, and
  she has its name, and he knows its way. Then the season's first calm brings a boat, a letter from the court, and a
  sealed thing from the delegation that the court has let come as far as the keeper decides, and the two of them go
  down the right side past the notches, counting doors against the chronicle, and find one standing open where every
  door is shut, with someone standing in it, and no name. Bram sets the delegation's thing down where he decides and
  cuts his first notch, and Wren carries back the only line the chronicle can make of it: a door was given.
</p>

{% set seasonNumber = "13" %}
{% set episodeNumber = "1" %}
{% set hasEpisodeChapters = false %}
<ul class="chapter-list" role="list">
{% for chapter in collections.chapters %}
  {%- if (chapter.data.season ~ "") == seasonNumber and (chapter.data.episode ~ "") == episodeNumber -%}
    {%- if not hasEpisodeChapters %}{% set hasEpisodeChapters = true %}{% endif -%}
    <li class="chapter-list__item">
      <a href="/star-rangers{{ chapter.url }}">
        <span class="chapter-list__code">{{ chapter.data.id | upper }}</span>
        <span class="chapter-list__title">{{ chapter.data.title }}</span>
        {%- if chapter.data.location -%}
        <span class="chapter-list__loc">{{ chapter.data.location }}</span>
        {%- endif -%}
        {%- if chapter.data.description -%}
        <span class="chapter-list__desc">{{ chapter.data.description }}</span>
        {%- endif -%}
      </a>
    </li>
  {%- endif -%}
{% endfor %}
</ul>
{% if not hasEpisodeChapters %}
  <p class="page-intro">No chapters published yet for this episode.</p>
{% endif %}
