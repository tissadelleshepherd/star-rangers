---
layout: base.njk
title: "Episode 11"
eleventyComputed:
  description: "Chapters in Season 2, Episode 11 of {{ site.name }}."
permalink: /seasons/s02/e11/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s02/">Season 2</a></li>
    <li aria-current="page">Episode 11</li>
  </ol>
</nav>

<h1 class="page-title">Season 2 · Episode 11</h1>
<p class="page-intro">
  The terraces' water runs too warm for three days, and the Warden says what that probably means, with
  a number and the one time it was wrong. The committee that holds the valves decides to wait until it
  is sure. A cat sits on a notice, a boy reads what the cat is not sitting on and asks the Warden one
  question, once, and carries his strawberry home in both hands.
</p>

{% set seasonNumber = "2" %}
{% set episodeNumber = "11" %}
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
<p>No chapters have been added to this episode yet.</p>
{% endif %}
