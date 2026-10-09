---
layout: base.njk
title: "Episode 1"
eleventyComputed:
  description: "Chapters in Season 3, Episode 1 of {{ site.name }}."
permalink: /seasons/s03/e01/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s03/">Season 3</a></li>
    <li aria-current="page">Episode 1</li>
  </ol>
</nav>

<img class="page-hero-image" src="/star-rangers/images/hero/s03e01-radiotelescope.jpg" alt="Radio telescopes beneath the Milky Way at night" />
<h1 class="page-title">Season 3 · Episode 1</h1>
<p class="page-intro">
  Principal Tissadelle Shepherd works a backlog of archived Hegemony survey telemetry through the Survey Corps' standing data-exchange with the Cerebraun Hegemony — and finds, in a signal filed as noise for centuries, the one thing the classifiers were never built to listen for.
</p>

{% set seasonNumber = "3" %}
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
