---
layout: base.njk
title: "Founding Era"
description: "The Founding Era storyline thread — the years that made the Star Rangers both necessary and possible."
permalink: /threads/founding-era/
---
<nav class="chapter-breadcrumb" aria-label="Thread location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/threads/">Threads</a></li>
    <li aria-current="page">Founding Era</li>
  </ol>
</nav>

<img class="page-hero-image" src="/star-rangers/images/hero/season-00-foundation.jpg" alt="A moody, neon-lit futuristic corridor" />
<h1 class="page-title">Founding Era</h1>
<p class="page-intro">
  The years that made the Star Rangers both necessary and possible, under the last stretch of Military Space Command rule — before the Charter, and before Threshold Station's drift had a name.
</p>

{% set threadId = "founding-era" %}
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
