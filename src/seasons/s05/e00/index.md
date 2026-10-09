---
layout: base.njk
title: "Episode 0"
description: "The prologue to Season 5 — the years between Seasons 3 and 5, in which Shepherd crosses into command and the Corps assigns her the one officer who knows what the crossing costs."
permalink: /seasons/s05/e00/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s05/">Season 5</a></li>
    <li aria-current="page">Episode 0</li>
  </ol>
</nav>

<h1 class="page-title">Season 5 · Episode 0</h1>
<p class="page-intro">
  What came between Season 3 and Season 5. Three years separate the Chief Ranger who left the Hegemony's review chamber from the Line Captain who opens Season 5, and in them Shepherd crosses the hinge rank into command, where nothing can be examined and the Corps assigns a mentor instead. The officer it assigns her is the one who came to command from the other side, and who had been reading her silences for years before anyone made it a duty.
</p>

{% set seasonNumber = "5" %}
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
