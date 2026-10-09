---
layout: base.njk
title: "Episode 1"
eleventyComputed:
  description: "Chapters in Season 6, Episode 1 of {{ site.name }}."
permalink: /seasons/s06/e01/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s06/">Season 6</a></li>
    <li aria-current="page">Episode 1</li>
  </ol>
</nav>

<h1 class="page-title">Season 6 · Episode 1</h1>
<p class="page-intro">
  What Closes the File. The interior chapters read almost like homecoming before the recursions start showing — the same conversation resolving two ways, a detail from the Hollow that could not be there. The exterior chapters watch an archivist, a robot, and a High Captain decline to agree the file is closed. Neither side yet knows the other is real.
</p>

{% set seasonNumber = "6" %}
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
