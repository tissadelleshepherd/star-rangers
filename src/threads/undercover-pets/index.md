---
layout: base.njk
title: "Undercover Pets"
description: "The Undercover Pets Detective Agency storyline thread — Smart Pets stationed exactly where nobody looks twice, and the paperwork that hides them in plain sight."
permalink: /threads/undercover-pets/
---
<nav class="chapter-breadcrumb" aria-label="Thread location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/threads/">Threads</a></li>
    <li aria-current="page">Undercover Pets</li>
  </ol>
</nav>

<h1 class="page-title">Undercover Pets</h1>
<p class="page-intro">
  The Undercover Pets Detective Agency puts <a href="/star-rangers/glossary/smart-pet/">Smart Pets</a> where nobody looks twice: a cat asleep on a desk, a rabbit in a corner. People leave a mascot alone with the paperwork. At Eden Space Habitat, the paperwork is where the secrets are. Agent <a href="/star-rangers/characters/agent-barsik/">Barsik</a> has usually read it first. <a href="/star-rangers/characters/bubochka/">Bubochka</a>, the trainee, is learning that a missing form can say as much as a filled-in one.
</p>
<p class="page-intro">
  These are stories about small warm creatures and what they notice. Training that looks like sitting very still. A creature nobody can put a name to. Animals the agency never recruited, who noticed things anyway. The habitat has its own police, and the agency works quietly underneath them, not against them. Superintendent <a href="/star-rangers/characters/rasa-oyelaran/">Oyelaran</a>'s bureau does the official work, and on her books the agency's animals are listed as livestock. That suits the agency fine.
</p>

{% set threadId = "undercover-pets" %}
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
