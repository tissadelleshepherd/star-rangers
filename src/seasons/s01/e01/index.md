---
layout: base.njk
title: "Episode 1"
eleventyComputed:
  description: "Chapters in Season 1, Episode 1 of {{ site.name }}."
permalink: /seasons/s01/e01/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s01/">Season 1</a></li>
    <li aria-current="page">Episode 1</li>
  </ol>
</nav>

<img class="page-hero-image" src="/star-rangers/images/hero/s01e01-corridor.jpg" alt="A dim industrial corridor aboard an aging space station, wet scuffed decking and exposed overhead conduit, a single figure walking away under harsh strip lighting" />
<h1 class="page-title">Season 1 · Episode 1</h1>
<p class="page-intro">
  The first episode opens on arrival, inspection, and the first hard proof that something at Threshold Station refuses to settle back into order. Read every published chapter for this episode here.
</p>

{% set seasonNumber = "1" %}
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
