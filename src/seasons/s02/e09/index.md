---
layout: base.njk
title: "Episode 9"
eleventyComputed:
  description: "Chapters in Season 2, Episode 9 of {{ site.name }}."
permalink: /seasons/s02/e09/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s02/">Season 2</a></li>
    <li aria-current="page">Episode 9</li>
  </ol>
</nav>

<h1 class="page-title">Season 2 · Episode 9</h1>
<p class="page-intro">
  Eden's compliance framework has been twelve requirements and counting, and in late summer it counts. The
  thirteenth changes what a floor is, the tidying robot starts filing the bureau's evidence as litter, and
  lost property lets go of what nobody claims after fourteen days. The cat read the new rule the day it
  arrived. The trainee's exercise this time is to watch what he does about it, and when.
</p>

{% set seasonNumber = "2" %}
{% set episodeNumber = "9" %}
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
