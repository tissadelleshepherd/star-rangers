---
layout: base.njk
title: "Episode 2"
eleventyComputed:
  description: "Chapters in Season 13, Episode 2 of {{ site.name }}."
permalink: /seasons/s13/e02/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s13/">Season 13</a></li>
    <li aria-current="page">Episode 2</li>
  </ol>
</nav>

<h1 class="page-title">Season 13 · Episode 2</h1>
<p class="page-intro">
  The Timeless Library. The Abbey's strand, from inside the Tideward Sisterhood: a novice of sixteen sits down on her first morning to learn the hand, not a hand but the hand, the one every line of the Long Accounting has been written in since a date nobody outside the order can confirm, and is set to copy a charter-era entry that counts five islands and names them, and finds she knows four of the names. The survey's young officer works the next shelf three days a week and writes down each answer as given. The Abbess answers what the Accounting states and nothing it does not, and when the novice asks when the book began, tells her. Then a court reciter comes up the steps with a new line of the chronicle, so that the Accounting can be checked against it: a door was given, on Krilzat, and one stands in it, and no name. The Abbess sets the novice to find the room, and she finds it, in the hand, dated before she was born, and it has a name. The Abbess tells the reciter it was always there. At the next shelf the Ranger's reader brings in the delegation's log from Krilzat, a figure present for exactly as long as a lamp was in the room, and she files it at the lowest band and adopts neither name.
</p>

{% set seasonNumber = "13" %}
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
