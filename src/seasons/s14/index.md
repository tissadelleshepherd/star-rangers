---
layout: base.njk
title: "Season 14"
eleventyComputed:
  description: "Episodes and chapters in Season 14 of {{ site.name }}."
permalink: /seasons/s14/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 14</li>
  </ol>
</nav>

<h1 class="page-title">Season 14</h1>
<p class="page-intro">
  <strong>Unofficial fan work.</strong> Season 14 exists only on this fork. It holds the Fan Tales thread: short scenes written by a fan, not by the author of Fian Ilchruinne, and not endorsed by him. Nothing here is canon, and no scene carries canon facts.
</p>
<p class="page-intro">
  Each scene stands alone: no prior reading required, and nothing in the main story depends on any of them.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (14 | threadForSeason).id }}/">{{ (14 | threadForSeason).name }}</a></p>

{% set seasonNumber = "14" %}
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
          <a href="/star-rangers/seasons/s14/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
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
