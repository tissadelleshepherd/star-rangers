---
layout: base.njk
title: "Episode 7"
eleventyComputed:
  description: "Chapters in Season 2, Episode 7 of {{ site.name }}."
permalink: /seasons/s02/e07/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s02/">Season 2</a></li>
    <li aria-current="page">Episode 7</li>
  </ol>
</nav>

<h1 class="page-title">Season 2 · Episode 7</h1>
<p class="page-intro">
  A boy's cat goes missing the week his family moves out of the transfer berths, and Eden has no form for
  that. The bureau cannot take a case from an eight-year-old. An author who only watches people sends him
  to a rabbit as a joke. The rabbit takes the case, the first she has ever been given without an
  instruction, and the shuttle lifts in three hours.
</p>

{% set seasonNumber = "2" %}
{% set episodeNumber = "7" %}
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
