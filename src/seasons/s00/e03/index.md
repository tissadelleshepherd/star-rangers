---
layout: base.njk
title: "Episode 3"
eleventyComputed:
  description: "Chapters in the Founding Era, Episode 3 of {{ site.name }}."
permalink: /seasons/s00/e03/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s00/">Founding Era</a></li>
    <li aria-current="page">Episode 3</li>
  </ol>
</nav>

<img class="page-hero-image" src="/star-rangers/images/hero/season-00-foundation.jpg" alt="A moody, neon-lit futuristic corridor" />
<h1 class="page-title">Founding Era · Episode 3</h1>
<p class="page-intro">
  Solar Command, Mars, 2723 UCSD. Four years after the Hearing, the Star Rangers Charter is ratified — decided not by what the new corps will be allowed to do, but by what an outer-station delegation refuses to let it become. The season's founding moment, from the inside.
</p>

{% set seasonNumber = "0" %}
{% set episodeNumber = "3" %}
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
