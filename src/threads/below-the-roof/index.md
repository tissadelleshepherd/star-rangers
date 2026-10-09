---
layout: base.njk
title: "Below the Roof"
description: "The Below the Roof storyline thread — the Pandoids of Fliade from inside the deep networks, written for the child reader."
permalink: /threads/below-the-roof/
---
<nav class="chapter-breadcrumb" aria-label="Thread location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/threads/">Threads</a></li>
    <li aria-current="page">Below the Roof</li>
  </ol>
</nav>

<h1 class="page-title">Below the Roof</h1>
<p class="page-intro">
  <a href="/star-rangers/lore/planets/fliade/">Fliade</a> is a cold world whose life lives underground, and the deep networks belong to the Pandoids: a people who do not travel in space and keep their record by speaking it. Everything the survey holds about them was learned by watching. This thread is the other side of that: the deep from inside, in the warm fungus-light, from the people it belongs to.
</p>
<p class="page-intro">
  Written for the child reader, in short scenes and plain words, and complete in itself. Readers of the survey record will recognise the world; the record will, for once, be the one being watched.
</p>

{% set threadId = "below-the-roof" %}
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
