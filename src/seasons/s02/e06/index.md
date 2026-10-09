---
layout: base.njk
title: "Episode 6"
eleventyComputed:
  description: "Chapters in Season 2, Episode 6 of {{ site.name }}."
permalink: /seasons/s02/e06/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s02/">Season 2</a></li>
    <li aria-current="page">Episode 6</li>
  </ol>
</nav>

<h1 class="page-title">Season 2 · Episode 6</h1>
<p class="page-intro">
  Small things keep going missing from the bureau floor and turning up where only a cat could put them, and
  Eden has exactly one cat on its books. A welfare form with the wrong box ticked threatens the one thing
  Agent Barsik's badge cannot protect. He cannot be seen solving it, so the trainee whose whole training is
  being overlooked has to work out how to be looked at instead.
</p>

{% set seasonNumber = "2" %}
{% set episodeNumber = "6" %}
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
