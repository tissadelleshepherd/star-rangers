---
layout: base.njk
title: "Seasons"
eleventyComputed:
  description: "All seasons and episodes of {{ site.name }}, grouped by storyline thread."
permalink: /seasons/
---
<img class="page-hero-image" src="/star-rangers/images/hero/seasons-orbit.jpg" alt="A space station orbiting a planet against the backdrop of the universe" />
<h1 class="page-title">Seasons &amp; Episodes</h1>
{%- if edition.seasonsIntro -%}
{%- for para in edition.seasonsIntro -%}
<p class="page-intro">{{ para | safe }}</p>
{%- endfor -%}
{%- else -%}
<p class="page-intro">
  Begin with the record: one history, many witnesses. Read a chapter in any available character's point of view, then switch inside the chapter to see how duty, fear, and memory reshape the same event.
</p>
<p class="page-intro">
  The story's present is 2826 UCSD: Threshold Station has carried an unresolved instrument discrepancy for eleven years, while the Marsh Causeway has endured three years of independent boundary monitoring. The earliest thread opens more than a century before that, in 2712 UCSD, with the Founding Era.
</p>
<p class="page-intro">
  Seasons are grouped below by <a href="/star-rangers/threads/">storyline thread</a> — each thread is an independent narrative, not a strict release order. See the <a href="/star-rangers/threads/">Threads</a> page for what each one covers. First visit? The <a href="/star-rangers/start/">reading plan</a> lays out a guided path.
</p>
{%- endif -%}

{% set allChapters = collections.chapters %}
{% if allChapters.length %}
  {%- for thread in storylineThreads -%}
    {%- set hasChapters = false -%}
    {%- for chapter in allChapters -%}
      {%- if (chapter.data.season | threadForSeason).id == thread.id %}{% set hasChapters = true %}{% endif -%}
    {%- endfor -%}
    {%- if hasChapters -%}
    <section class="thread-section" aria-labelledby="thread-{{ thread.id }}">
      <h2 class="thread-section__title" id="thread-{{ thread.id }}">
        <a href="/star-rangers/threads/{{ thread.id }}/">{{ thread.name }}</a>
      </h2>
      <p class="thread-section__description">{{ thread.description }}</p>
      {%- set multiSeason = (allChapters | seasonsInThread(thread.id) | length) > 1 -%}
      {%- set currentSeason = -1 -%}
      {%- for chapter in allChapters -%}
        {%- if (chapter.data.season | threadForSeason).id == thread.id -%}
          {%- if chapter.data.season != currentSeason -%}
            {%- if currentSeason != -1 %}</ul></div>{% endif -%}
            {%- set currentSeason = chapter.data.season -%}
            <div class="season-block">
              {%- if multiSeason -%}
              <h3 class="season-block__title">
                <a href="/star-rangers/seasons/s{{ currentSeason | zeroPad }}/">{{ currentSeason | seasonLabel }}</a>
              </h3>
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
      {%- endfor -%}
      </ul></div>
    </section>
    {%- endif -%}
  {% endfor %}

  {% set hasUnsorted = false %}
  {%- for chapter in allChapters -%}
    {%- if (chapter.data.season | threadForSeason).id == "unsorted" %}{% set hasUnsorted = true %}{% endif -%}
  {%- endfor -%}
  {%- if hasUnsorted -%}
  <section class="thread-section" aria-labelledby="thread-unsorted">
    <h2 class="thread-section__title" id="thread-unsorted">Unsorted</h2>
    <p class="thread-section__description">Seasons published before being assigned to a storyline thread.</p>
    {%- set multiSeason = (allChapters | seasonsInThread("unsorted") | length) > 1 -%}
    {%- set currentSeason = -1 -%}
    {%- for chapter in allChapters -%}
      {%- if (chapter.data.season | threadForSeason).id == "unsorted" -%}
        {%- if chapter.data.season != currentSeason -%}
          {%- if currentSeason != -1 %}</ul></div>{% endif -%}
          {%- set currentSeason = chapter.data.season -%}
          <div class="season-block">
            {%- if multiSeason -%}
            <h3 class="season-block__title">
              <a href="/star-rangers/seasons/s{{ currentSeason | zeroPad }}/">{{ currentSeason | seasonLabel }}</a>
            </h3>
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
    {%- endfor -%}
    </ul></div>
  </section>
  {%- endif -%}
{% else %}
  <p class="page-intro">No chapters published yet.</p>
{% endif %}
