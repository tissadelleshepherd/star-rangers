---
layout: base.njk
title: "Season 9"
eleventyComputed:
  description: "Episodes and chapters in Season 9 of {{ site.name }}."
permalink: /seasons/s09/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 9</li>
  </ol>
</nav>

<h1 class="page-title">Season 9</h1>
<p class="page-intro">
  The Corps from the bottom rung. Season 9 is the Young Star Rangers thread: a raw Deputy's first field posting under a Field Officer who has supervised fourteen of them, on the boundary watch that most civilians mean when they say a Star Ranger came.
</p>
<p class="page-intro">
  A season that stands alone, set in 2828 UCSD, two years after the main line's present: no prior reading required, and readers of Season 1 will know the habitat, if not the hatch.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (9 | threadForSeason).id }}/">{{ (9 | threadForSeason).name }}</a></p>

{% set seasonNumber = "9" %}
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
          <a href="/star-rangers/seasons/s09/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
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
