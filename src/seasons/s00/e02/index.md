---
layout: base.njk
title: "Episode 2"
eleventyComputed:
  description: "Chapters in the Founding Era, Episode 2 of {{ site.name }}."
permalink: /seasons/s00/e02/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s00/">Founding Era</a></li>
    <li aria-current="page">Episode 2</li>
  </ol>
</nav>

<img class="page-hero-image" src="/star-rangers/images/hero/season-00-foundation.jpg" alt="A moody, neon-lit futuristic corridor" />
<h1 class="page-title">Founding Era · Episode 2</h1>
<p class="page-intro">
  Solar Command, Mars, 2719 UCSD. A hearing convened to ask whether the Military Space Command can still answer for the conditions it governs scheduled for three weeks, runs six months — and produces, alongside six years of unresolved findings, one honestly volunteered sentence that outruns all of them.
</p>

{% set seasonNumber = "0" %}
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
