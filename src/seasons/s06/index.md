---
layout: base.njk
title: "Season 6"
eleventyComputed:
  description: "Episodes and chapters in Season 6 of {{ site.name }}."
permalink: /seasons/s06/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 6</li>
  </ol>
</nav>

<h1 class="page-title">Season 6</h1>
<p class="page-intro">
  Threshold Station is trying to close a file on the event the whole Corps already calls the Last Stand. The Oversight Council wants a clean incident report and a citation to go with it. High Captain Wender wants the version that would survive its own subject's review. Season 6 follows what closes a file, and what refuses to.
</p>
<p class="page-intro">
  This is the aftermath season, and it spoils Season 5 by existing — read that first. Beyond the premise above, this page keeps the file shut: expect the series' questions about evidence and testimony turned up to their full weight, and the station's instruments registering exactly one thing more than the official report has room for.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (6 | threadForSeason).id }}/">{{ (6 | threadForSeason).name }}</a></p>

{% set seasonNumber = "6" %}
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
          <a href="/star-rangers/seasons/s06/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
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
