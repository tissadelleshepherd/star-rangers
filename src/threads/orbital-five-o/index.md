---
layout: base.njk
title: "Orbital Five-O"
description: "The Orbital Five-O storyline thread — the Governor's Investigative Task Force, chartered to close a jurisdictional gap none of the five self-governing Compact habitats could close alone."
permalink: /threads/orbital-five-o/
---
<nav class="chapter-breadcrumb" aria-label="Thread location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/threads/">Threads</a></li>
    <li aria-current="page">Orbital Five-O</li>
  </ol>
</nav>

<h1 class="page-title">Orbital Five-O</h1>
<p class="page-intro">
  Commander <a href="/star-rangers/characters/kai-larsen/">Kai Larsen</a> resigned his Survey Corps commission over a jurisdictional wall the Rangers had no standing to cross. Governor <a href="/star-rangers/characters/petra-voss/">Petra Voss</a> hired him to take the wall down instead — commander of a standing task force answering to her directly, bypassing the <a href="/star-rangers/lore/orbital-habitats-compact/">Orbital Habitats Compact</a>'s slower consultative councils, covering all five member habitats. Everyone, including the Compact's own administration, calls it Orbital Five-O — the name does double duty, since it's also nobody's-subtle nod to a certain twentieth-century detective show set on a rather more terrestrial set of islands.
</p>
<p class="page-intro">
  This is an institutional thread — jurisdiction, investigation, and the gap between a Governor's tasking authority and a Chief Commissioner's coordination office — not a single detective's story. Most of the Compact's day-to-day policing happens well beneath Five-O's notice, at each habitat's own civil bureau: Eden's, run by Superintendent <a href="/star-rangers/characters/rasa-oyelaran/">Rasa Oyelaran</a>, carries its own supporting cast in Detective Inspector <a href="/star-rangers/characters/wendell-albercombe/">Wendell Albercombe</a> and his household intelligence <a href="/star-rangers/characters/jeeves/">Jeeves</a> — minor figures in Five-O's own remit, occasionally the desk Five-O's liaison calls first when an "ordinary" referral turns out not to be.
</p>

{% set threadId = "orbital-five-o" %}
{% set allChapters = collections.chapters %}
{% set multiSeason = (allChapters | seasonsInThread(threadId) | length) > 1 %}
{% set hasThreadChapters = false %}
{% set currentSeason = -1 %}
{% for chapter in allChapters %}
  {%- if (chapter.data.season | threadForSeason).id == threadId -%}
    {%- if not hasThreadChapters %}{% set hasThreadChapters = true %}{% endif -%}
    {%- if chapter.data.season != currentSeason -%}
      {%- if currentSeason != -1 %}</ul></div>{% endif -%}
      {%- set currentSeason = chapter.data.season -%}
      <div class="season-block">
        {%- if multiSeason -%}
        <h2 class="season-block__title">
          <a href="/star-rangers/seasons/s{{ currentSeason | zeroPad }}/">{{ currentSeason | seasonLabel }}</a>
        </h2>
        {%- endif -%}
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
{% if hasThreadChapters %}
  </ul></div>
{% else %}
  <p class="page-intro">No chapters published yet for this thread.</p>
{% endif %}
