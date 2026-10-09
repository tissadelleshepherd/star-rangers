---
layout: base.njk
title: "Episode 0"
description: "Prequels to Season 1 — how a household cat became the Marsh Causeway's first watcher, how three machines reached a wrecked ship a generation earlier, and how a boundary analyst on a newly reached membrane filed three words and declined a softer one."
permalink: /seasons/s01/e00/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s01/">Season 1</a></li>
    <li aria-current="page">Episode 0</li>
  </ol>
</nav>

<img class="page-hero-image" src="/star-rangers/images/hero/s01e00-cat.jpg" alt="A black cat" />
<h1 class="page-title">Season 1 · Episode 0</h1>
<p class="page-intro">
  What came before Episode 1, at two different distances. Four years back: before Elvira ever took up the Marsh Causeway outpost, her household cat chose exile over a garden gate — and found, on a bare tidal rock, the first confirmation that her sensitivity to the boundary was real. Thirty-eight years back: a long-voyage ship stops answering, three machines are sent to it, and what they carry out are children. Twelve years back: the Survey Corps' first party on the membrane later registered as Counterpane logs nothing wrong for ninety days, and then a routine calibration returns a residual that will not close, and a Krenyi Section Lead files what happened and nothing smaller.
</p>

{% set seasonNumber = "1" %}
{% set episodeNumber = "0" %}
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
