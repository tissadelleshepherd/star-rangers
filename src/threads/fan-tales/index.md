---
layout: base.njk
title: "Fan Tales (unofficial)"
description: "Unofficial fan fiction written on this fork of Fian Ilchruinne: small scenes alongside the record, not canon and not endorsed by its author."
permalink: /threads/fan-tales/
---
<nav class="chapter-breadcrumb" aria-label="Thread location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/threads/">Threads</a></li>
    <li aria-current="page">Fan Tales (unofficial)</li>
  </ol>
</nav>

<h1 class="page-title">Fan Tales (unofficial)</h1>
<p class="page-intro">
  <strong>Unofficial fan work.</strong> These scenes were written on this fork, not by the author of Fian Ilchruinne, and he has not endorsed them. They are offered under the original's Fan Works Policy (<code>CONTENT-LICENSE.md</code>): non-commercial, additive only, and never canon.
</p>
<p class="page-intro">
  Each one is set in a quiet corner the record leaves alone. None of them changes what the record says, gives its people new deeds, or carries canon facts, so a reader can skip the whole thread and lose nothing of the story.
</p>

{% set threadId = "fan-tales" %}
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
