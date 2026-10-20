---
layout: base.njk
title: "Episode 2"
eleventyComputed:
  description: "Chapters in Season 14, Episode 2 of {{ site.name }}."
permalink: /seasons/s14/e02/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s14/">Season 14</a></li>
    <li aria-current="page">Episode 2</li>
  </ol>
</nav>

<h1 class="page-title">Season 14 · Episode 2</h1>
<p class="page-intro">
  The same season from above the line. The party knocks every shift and is answered every shift, and in its fourth year on the ground the survey goes back through its own log and finds what it has been calling the one voice on the roof that was not an instrument's. Then the other half of the same finding: under every one of those entries is the answer from the line, kept for two years by an instrument the one who gave it does not know is there. The party argues what keeping means and chooses, for the length of a knock, to know less than its instrument could tell it, and to write that down. Then the one act, from above: a hand on the rock that does not move, an interval that ends with nobody coming back, a voice at the line nobody on the roof can read a word of, and a log entry that says only what was done, how long the channel was off, and who heard it.
</p>

{% set seasonNumber = "14" %}
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
