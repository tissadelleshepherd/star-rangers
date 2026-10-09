---
layout: base.njk
title: "Season 3"
eleventyComputed:
  description: "Episodes and chapters in Season 3 of {{ site.name }}."
permalink: /seasons/s03/
---
<nav class="chapter-breadcrumb" aria-label="Season location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li aria-current="page">Season 3</li>
  </ol>
</nav>

<img class="page-hero-image" src="/star-rangers/images/hero/season-03-datacentre.jpg" alt="A glowing data centre interface" />
<h1 class="page-title">Season 3</h1>
<p class="page-intro">
  Two years into her service, Shepherd is a Principal working through an archive backlog nobody else wanted — routine review, unglamorous by design. Season 3 follows what she finds in it, and what it costs to be believed about it.
</p>
<p class="page-intro">
  A quiet season on purpose: archives, verification, and the long discipline of being right slowly. The stakes are the records themselves — what gets filed, what gets read, and who decides the difference. New readers can begin at Season 1; returning ones will recognise every habit Threshold taught her being put to work.
</p>
<p class="page-intro">
  Episode 2 brings her back to Threshold on general operations, where a transit window is hers to state and the Chief Pilot is in the room more often than the rooms require, and then, a Chief Ranger, through the fold to Counterpane, where every instrument asked one question answers as it does at home and the one difference is a thing no ear can hear.
</p>
<p class="thread-badge">Part of <a href="/star-rangers/threads/{{ (3 | threadForSeason).id }}/">{{ (3 | threadForSeason).name }}</a></p>

{% set seasonNumber = "3" %}
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
          <a href="/star-rangers/seasons/s03/e{{ chapter.data.episode | zeroPad }}/">Episode {{ chapter.data.episode }}</a>
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
