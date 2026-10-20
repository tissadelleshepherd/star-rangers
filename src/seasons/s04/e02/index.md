---
layout: base.njk
title: "Episode 2"
eleventyComputed:
  description: "Chapters in Season 4, Episode 2 of {{ site.name }}."
permalink: /seasons/s04/e02/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s04/">Season 4</a></li>
    <li aria-current="page">Episode 2</li>
  </ol>
</nav>

<h1 class="page-title">Season 4 · Episode 2</h1>
<p class="page-intro">
  A theft is charged on the deck it happened on, and the audit behind it leaves six crossings the thief's
  method cannot account for. Five resolve. The sixth is a sealed cradle two sound instruments disagree
  about — and the tidy thing to do with it is to call it the Star Rangers'.
  Then the file comes down to Eden, where both of the Commissioner's offices get the same paragraph,
  the Mayor keeps a sentence she could have spent, and the only line the habitat ever files is about two presses.
</p>

{% set seasonNumber = "4" %}
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
