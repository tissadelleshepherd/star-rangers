---
layout: base.njk
title: "Episode 2"
eleventyComputed:
  description: "Chapters in Season 8, Episode 2 of {{ site.name }}."
permalink: /seasons/s08/e02/
# Season 8 is the tier-gated church-space thread; index pages have no season front
# matter of their own, so they carry the thread id explicitly (see e01).
threadId: church-space
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s08/">Season 8</a></li>
    <li aria-current="page">Episode 2</li>
  </ol>
</nav>

<h1 class="page-title">Season 8 · Episode 2</h1>
<p class="page-intro">
  The other order's vigil. Three children go missing on the high ground above a settlement, the search cannot cross the one ground they might have crossed, and the chapter house on the hill keeps a night it cannot act on. They are home before first light. The record carries the route and nothing after it; this episode carries what one person thinks, and declines to write down.
</p>

{% set seasonNumber = "8" %}
{% set episodeNumber = "2" %}
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
