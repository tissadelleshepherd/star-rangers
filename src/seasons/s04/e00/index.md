---
layout: base.njk
title: "Episode 0"
description: "The prologue to Season 4 — the year before Docked Twice, in which a notice crosses the wall between the Rangers and the Compact by carrying nothing the wall was built to stop, and the Deputy who wrote it is someone the main line already knows."
permalink: /seasons/s04/e00/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s04/">Season 4</a></li>
    <li aria-current="page">Episode 0</li>
  </ol>
</nav>

<h1 class="page-title">Season 4 · Episode 0</h1>
<p class="page-intro">
  What came before <em>Docked Twice</em>. In the late autumn of 2826, a year before Five-O works its first case entirely in the open, a Deputy in her second week on Eden's fold-approach watch finds eleven seconds in the instruments' log that nobody cleared. She knows the hour better than the watch does, from a year on the dock circuit the posting has never been in, and she writes the notice without it. On the Compact side, the notice reaches the one man who can use it, and he reads why it could be used at all. The Deputy is Tissadelle Shepherd, guesting from the main line in the one year the chronology allows.
</p>

{% set seasonNumber = "4" %}
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
