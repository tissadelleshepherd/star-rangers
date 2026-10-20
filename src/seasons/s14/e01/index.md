---
layout: base.njk
title: "Episode 1"
eleventyComputed:
  description: "Chapters in Season 14, Episode 1 of {{ site.name }}."
permalink: /seasons/s14/e01/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s14/">Season 14</a></li>
    <li aria-current="page">Episode 1</li>
  </ol>
</nav>

<h1 class="page-title">Season 14 · Episode 1</h1>
<p class="page-intro">
  The deep side. The small ones have made a game of the stones on the line, and the warm has a telling it has never told to anyone who was not already told. Stone-First brings that thought down and the warm argues it: which telling, who tells it, and whether the line is a place you can tell from at all. Then the last thing, how people who wait for as long as a hand can be kept for a telling, which the warm cannot go round, and which an old one finally finds in the middle of the warm, in a game, under the smallest one's hand; and the smallest one has a name. Then the one act, from the deep side: Stone-First keeps a hand on the rock, the smallest of the up-people does not go, and the telling of their own first stone is told to them from the line, while the whole warm lies still below for a stone that has not spoken.
</p>

{% set seasonNumber = "14" %}
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
