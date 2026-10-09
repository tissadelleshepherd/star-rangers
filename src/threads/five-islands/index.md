---
layout: base.njk
title: "The Infinite Castle and the Timeless Library"
description: "The Five Islands storyline thread — the Kingdom of the Five Islands from inside its own records, a castle no generation has finished and a library that does not age, with a young keeper of each learning to hold one."
permalink: /threads/five-islands/
---
<nav class="chapter-breadcrumb" aria-label="Thread location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/threads/">Threads</a></li>
    <li aria-current="page">The Infinite Castle and the Timeless Library</li>
  </ol>
</nav>

<h1 class="page-title">The Infinite Castle and the Timeless Library</h1>
<p class="page-intro">
  The <a href="/star-rangers/lore/planets/kingdom-of-the-five-islands/">Kingdom of the Five Islands</a> keeps three records of itself. The court's chronicle of descent and deed is recited under a tree and cross-checked at every coronation. The Abbey's Long Accounting is written in a hand that has never changed, since a date nobody outside the order can confirm. And the Castle's people are written in light. This thread follows a young keeper of each of the first two learning to hold one, while the <a href="/star-rangers/characters/emma-la-chapelle/">survey's own young officer</a> works the same shelf, writes down each answer as given, and never says which record is right.
</p>
<p class="page-intro">
  The record's first epic-fantasy thread, written for the young-adult reader: a reading, never a mechanism. A castle no generation has finished and a library that does not age are what the Kingdom's records say; what the instruments say is filed where instruments are quoted and nowhere else. It stands alone; readers of the Kingdom's page will know the Abbess, and may know the terraces.
</p>

{% set threadId = "five-islands" %}
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
