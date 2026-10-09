---
layout: base.njk
title: "Season 5"
eleventyComputed:
  description: "Episodes and chapters in Season 5 of {{ site.name }}."
permalink: /seasons/s05/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 5</li>
  </ol>
</nav>

<img class="page-hero-image" src="/star-rangers/images/hero/season-05-explorers.jpg" alt="Explorers in space suits" />
<h1 class="page-title">Season 5</h1>
<p class="page-intro">
  Four seasons of operational service stand between the cadet who arrived in Season 1 and the Line Captain who opens Season 5. Tissadelle Shepherd now answers for boundary-proximate deployments in her own right — and for the Rangers she sends into them. Season 5 follows what that rank costs, on duty and off it.
</p>
<p class="page-intro">
  Command is the season's subject: the distance between signing an order and standing where it lands. Expect the fullest cast of the series so far, and an ending the rest of the record will spend a long time trying to file straight — which is all this page will say about it.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (5 | threadForSeason).id }}/">{{ (5 | threadForSeason).name }}</a></p>

{% set seasonNumber = "5" %}
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
          <a href="/star-rangers/seasons/s05/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
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
