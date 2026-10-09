---
layout: base.njk
title: "Episode 5"
eleventyComputed:
  description: "Chapters in Season 2, Episode 5 of {{ site.name }}."
permalink: /seasons/s02/e05/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s02/">Season 2</a></li>
    <li aria-current="page">Episode 5</li>
  </ol>
</nav>

<h1 class="page-title">Season 2 · Episode 5</h1>
<p class="page-intro">
  Back on Eden, the smallest case of the season. Flour has been going missing for eleven days, and the
  steward's story keeps getting shorter. Two helpers solve it without ever agreeing to help: a writer who
  only watches people, and a rabbit with a perfect record in the one thing she has ever claimed to be good at.
</p>

{% set seasonNumber = "2" %}
{% set episodeNumber = "5" %}
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
