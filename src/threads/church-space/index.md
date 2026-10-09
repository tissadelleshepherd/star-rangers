---
layout: base.njk
title: "Church Space"
description: "The Church Space overlay — an optional devotional commentary layer for the church-space.site/.online deployment, reading the same reality through an explicitly Christian and evangelical lens. Not canon, and not a separate storyline."
permalink: /threads/church-space/
threadId: church-space
---
<nav class="chapter-breadcrumb" aria-label="Thread location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/threads/">Threads</a></li>
    <li aria-current="page">Church Space</li>
  </ol>
</nav>

<h1 class="page-title">Church Space</h1>
<p class="page-intro">
  An optional overlay, not a separate story. Church Space reads the same reality every other edition of this site
  shows — the same Cascade, the same boundary zones, the same people — through an explicitly Christian and
  evangelical lens, concentrated on the spiritual layer of it. The events are not different events. What differs is
  what the commentary is willing to say about them.
</p>
<p class="page-intro">
  It is not canon: nothing here binds the main published story, and the main story never depends on it. Nor is it
  Codex, whose entries are each one named in-universe source's account. This is a layer laid over the whole record
  rather than a document inside it, and it belongs to the contemplative reading tier: present on the editions
  built at that tier, absent — not hidden behind a link, simply not there — on every edition below it.
  See TECHNICAL-README.md's cPanel deployment section for how a clone's tier is resolved.
</p>
<p class="page-intro">
  See also: <a href="/star-rangers/threads/church-space/faq/">Questions I Ask Myself</a>, an
  author's-note FAQ working through the hardest craft and thematic objections this thread raises.
</p>

{% set threadId = "church-space" %}
{% set allChapters = collections.chapters %}
{% set hasThreadChapters = false %}
{% set currentSeason = -1 %}
{% for chapter in allChapters %}
  {%- if (chapter.data.season | threadForSeason).id == threadId -%}
    {%- if not hasThreadChapters %}{% set hasThreadChapters = true %}{% endif -%}
    {%- if chapter.data.season != currentSeason -%}
      {%- if currentSeason != -1 %}</ul></div>{% endif -%}
      {%- set currentSeason = chapter.data.season -%}
      <div class="season-block">
        <h2 class="season-block__title">
          <a href="/star-rangers/seasons/s{{ currentSeason | zeroPad }}/">Season {{ currentSeason }}</a>
        </h2>
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
