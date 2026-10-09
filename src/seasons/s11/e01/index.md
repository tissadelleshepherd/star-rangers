---
layout: base.njk
title: "Episode 1"
eleventyComputed:
  description: "Chapters in Season 11, Episode 1 of {{ site.name }}."
permalink: /seasons/s11/e01/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s11/">Season 11</a></li>
    <li aria-current="page">Episode 1</li>
  </ol>
</nav>

<h1 class="page-title">Season 11 · Episode 1</h1>
<p class="page-intro">
  Below the roof the light never changes and nobody says morning. The youngest of the people has every story by
  heart and not one that is theirs, so they go up past the margin without moving a stone first, and stand at the
  edge of the up-people's light, and nobody looks up. Stone-First keeps the margin, and has a question about that.
  Then the youngest has a question of their own — why do the up-people never ask? — and the answer is that nobody
  has told them anything, and every telling begins with a stone. The youngest carries the up-people's own humming
  stone down through the squeeze to the line where their feet once stopped, and it wakes on the way, and afterwards
  the people have a name for the one who did it. Then nothing happens, and the nothing is the trouble: the Told argue
  the manners for the first time, the youngest goes up to learn how the up-people ask, and Stone-First finishes a thought
  that was for keeping and goes to stand on the line. Then the waiting: the up-people's rising sound comes down
  through the squeeze every working time and is not answered, a small one goes up announced and stands beside
  Stone-First, and the whole of the people learn what the waiting is for. And then the light comes through the squeeze
  at the start of a working time, and the smallest of the up-people sets a stone down on the line, late, and theirs,
  and Stone-First answers the only way there is, and a name grows.
</p>

{% set seasonNumber = "11" %}
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
