---
layout: base.njk
title: "Tissadelle Shepherd's Arc"
description: "The Tissadelle Shepherd's Arc storyline thread — the chronological spine of the published series."
permalink: /threads/tissadelle-arc/
---
<nav class="chapter-breadcrumb" aria-label="Thread location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/threads/">Threads</a></li>
    <li aria-current="page">Tissadelle Shepherd's Arc</li>
  </ol>
</nav>

<img class="page-hero-image" src="/star-rangers/images/hero/season-01.jpg" alt="A space station in Earth orbit" />
<h1 class="page-title">Tissadelle Shepherd's Arc</h1>
<p class="page-intro">
  The chronological spine of the published series — Cadet to Principal to Line Captain to the Last Stand, and what the Last Stand leaves behind — carried across Seasons 1, 3, 5, 6, and 7. Seasons 2 and 4 are carried by other threads, the Undercover Pets and Orbital Five-O, whose storylines don't run through her.
</p>

{% set threadId = "tissadelle-arc" %}
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
