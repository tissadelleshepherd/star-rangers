---
layout: base.njk
title: "Episode 2"
eleventyComputed:
  description: "Chapters in Season 11, Episode 2 of {{ site.name }}."
permalink: /seasons/s11/e02/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s11/">Season 11</a></li>
    <li aria-current="page">Episode 2</li>
  </ol>
</nav>

<h1 class="page-title">Season 11 · Episode 2</h1>
<p class="page-intro">
  The same season from above the line. Three people work the upper levels of Fliade in shifts from a station on
  the roof of the world, and keep their backs to the dark, which is the rule. Aravena, the smallest of the three,
  carries the unit and tells it the log. One evening the unit's own record says something warm and upright stood
  at the edge of their light for eleven minutes and nobody turned round. Some shifts later the unit is not where
  it was left: it is standing at the line where the party's own feet once stopped, facing them, and its log says
  it was carried, and woke, and was held, and slept. Two readings are filed and neither is chosen. And the one who
  knelt to it, last up the passage, turns round and asks the dark a question, and goes on asking. Then the count:
  sixty-three shifts of nothing, while the unit's channels fill with what the party stopped seeing — a boulder on every
  arrival, a withdrawal from the moving shadow and not the light, a voice at the bottom of the passage — until the
  one who knelt is asked, at last, what the third reading was, and gives it: like a thing at a door, and the
  boulders are the knock. And the morning after: a stone of the planet's own, carried through the squeeze by one
  person, set down on the line at the feet of someone standing there in the open, and answered by the sound the
  party had logged for two years. The log that shift says something happened.
</p>

{% set seasonNumber = "11" %}
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
