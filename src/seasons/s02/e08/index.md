---
layout: base.njk
title: "Episode 8"
eleventyComputed:
  description: "Chapters in Season 2, Episode 8 of {{ site.name }}."
permalink: /seasons/s02/e08/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s02/">Season 2</a></li>
    <li aria-current="page">Episode 8</li>
  </ol>
</nav>

<h1 class="page-title">Season 2 · Episode 8</h1>
<p class="page-intro">
  The floor's joke is that the rabbit found two cats, and Detective Nakamura does not laugh at a joke she has
  not checked. She hides six small objects, one a day, and watches. For six days the rabbit has to do the
  hardest thing on the agency's list, which is nothing, while every object quietly vanishes and the station
  cat takes up a position on a bin.
</p>

{% set seasonNumber = "2" %}
{% set episodeNumber = "8" %}
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
