---
layout: base.njk
title: "Young Star Rangers"
description: "The Young Star Rangers storyline thread — Cadets and Deputies in their first field postings, and the Field Officers the Corps hands them to."
permalink: /threads/young-star-rangers/
---
<nav class="chapter-breadcrumb" aria-label="Thread location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/threads/">Threads</a></li>
    <li aria-current="page">Young Star Rangers</li>
  </ol>
</nav>

<h1 class="page-title">Young Star Rangers</h1>
<p class="page-intro">
  Every Star Ranger in the record was a <a href="/star-rangers/lore/star-rangers-command-hierarchy/">Deputy</a> once: the first rank that carries a field posting, served under a Field Officer's supervision, where the qualities that will matter most later are not yet rewarded in proportion. This thread follows that year — the first watch, the first corridor, the first time the rank has to mean what civilians think it means — beside <a href="/star-rangers/characters/zoe-smith/">the officer</a> the Corps quietly hands its rawest Deputies to first.
</p>
<p class="page-intro">
  A Corps thread, not a task-force one: the same habitats and the same boundary as <a href="/star-rangers/threads/orbital-five-o/">Orbital Five-O</a>, seen from inside the service rather than from a Governor's warrant. It stands alone; readers of Season 1 will recognise the year, and may recognise a cadet.
</p>

{% set threadId = "young-star-rangers" %}
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
