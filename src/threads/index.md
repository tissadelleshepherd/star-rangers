---
layout: base.njk
title: "Storyline Threads"
eleventyComputed:
  description: "The independent storylines that group {{ site.name }}'s seasons — each thread is its own narrative, told in parallel with the others."
permalink: /threads/
---
<img class="page-hero-image" src="/star-rangers/images/hero/timeline-clock.jpg" alt="A vintage clock face" />
<h1 class="page-title">Storyline Threads</h1>
<p class="page-intro">
  A season number marks a position in the setting's timeline, not a shared protagonist. <em>{{ site.name }}</em> runs independent storylines in parallel — each thread below is a self-contained narrative with its own cast, gathering the seasons that carry it. See <a href="/star-rangers/seasons/">Seasons &amp; Episodes</a> to read chapter by chapter within a thread.
</p>

{% set threads = storylineThreads %}
{% if threads.length %}
<div class="codex-grid">
  {%- for thread in threads -%}
  <a class="codex-card" href="/star-rangers/threads/{{ thread.id }}/">
    <p class="codex-card__category">
      {%- for season in thread.seasons %}Season {{ season }}{% if not loop.last %}, {% endif %}{% endfor -%}
    </p>
    <h2 class="codex-card__title">{{ thread.name }}</h2>
    <p style="font-size:0.9rem;color:var(--color-text-muted);margin-top:0.5rem;font-family:var(--font-ui)">
      {{ thread.description }}
    </p>
  </a>
  {%- endfor -%}
</div>
{#- Season 8 is the church-space thread, carried only by the contemplative
    tier; on every lower tier it is absent rather than a placeholder
    (CLAUDE.md, the tier gate). On the general tier that leaves a numbered
    list with a gap in it, which a 2026-10-09 site review read as a slip.
    The Official Editions page already names church-space.site, so saying
    where the season lives gives nothing away; Dermot ruled the line in the
    same day. Only the general tier shows it: a narrowed edition is missing
    other seasons too, and the line would single one out. -#}
{%- if edition.tier == "general" %}
<p class="page-intro">
  Season 8 is not missing. It belongs to a thread carried only by the contemplative edition, listed on the <a href="/star-rangers/official/">Official Editions</a> page.
</p>
{%- endif %}
{% else %}
<p class="page-intro">No storyline threads defined yet.</p>
{% endif %}
