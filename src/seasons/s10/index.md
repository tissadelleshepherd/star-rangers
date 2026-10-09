---
layout: base.njk
title: "Season 10"
eleventyComputed:
  description: "Episodes and chapters in Season 10 of {{ site.name }}."
permalink: /seasons/s10/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 10</li>
  </ol>
</nav>

<h1 class="page-title">Season 10</h1>
<p class="page-intro">
  Orbital Five-O's second season, carried by the young cast of Season 9 — a Deputy's first posting is the reader's way in — and the first told in two strands that never share a room. On Eden's fold-approach side, a Deputy on a first posting is sent to fetch a contractor's log. Under the dock ring, a crew of four who hear the habitat through the deck have already written in it something the certification did not ask for. Between them stands the one structure both jurisdictions touch, reporting itself sound.
</p>
<p class="page-intro">
  Season 4's case turned on the difference between a machine that works and one that only holds still. This season's turns on the difference between a structure that is certified and a structure that is heard — and on who, out of three parties with no standing to report to each other, carries one account into the other room. Read the two strands in order; they are complete apart, and they meet once.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (10 | threadForSeason).id }}/">{{ (10 | threadForSeason).name }}</a></p>

{% set seasonNumber = "10" %}
{% include "season-portraits.njk" %}
{% set hasSeasonChapters = false %}
{% set currentEpisode = "" %}
{% for chapter in collections.chapters %}
  {%- if (chapter.data.season ~ "") == seasonNumber -%}
    {%- if not hasSeasonChapters %}{% set hasSeasonChapters = true %}{% endif -%}
    {%- set episodeValue = chapter.data.episode ~ "" -%}
    {%- if episodeValue != currentEpisode -%}
      {%- if currentEpisode %}</ul></div>{% endif -%}
      {%- set currentEpisode = episodeValue -%}
      <div class="season-block">
        <h2 class="season-block__title">
          <a href="/star-rangers/seasons/s10/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
        </h2>
        <ul class="chapter-list" role="list">
    {%- endif -%}
          <li class="chapter-list__item">
            <a href="/star-rangers{{ chapter.url }}">
              <span class="chapter-list__code">{{ chapter.data.id | upper }}</span>
              <span class="chapter-list__title">{{ chapter.data.title }}</span>
              {%- if chapter.data.location -%}
              <span class="chapter-list__loc">{{ chapter.data.location }}</span>
              {%- endif -%}
            </a>
          </li>
  {%- endif -%}
{% endfor %}
{% if hasSeasonChapters %}
  </ul></div>
{% else %}
  <p class="page-intro">No chapters published yet for this season.</p>
{% endif %}
