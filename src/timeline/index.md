---
layout: base.njk
title: "Timeline"
eleventyComputed:
  description: "The canonical sequence of events in {{ site.name }} — one fixed history."
---
<img class="page-hero-image" src="/star-rangers/images/hero/timeline-clock.jpg" alt="A vintage clock face" />
<h1 class="page-title">Timeline</h1>
{#- On a children's-tier build the index speaks in the tier's register: a
    plain intro, and each entry's `plain:` line in place of its `summary`
    (the same shape src/glossary/index.md took on 2026-10-05). Keyed off the
    edition's tier, not the presentation mode, because the register is the
    tier's and a reader can switch the posture. The `summary` fallback below
    is for an entry on the tier without a `plain:` line; the Season 2 entries
    all carry one. -#}
{%- if edition.tier == "children" %}
<p class="page-intro">
  Here is what happened in the story, in order. Only things that are written down somewhere on the record are on this list. Press one to read more.
</p>
{%- else %}
<p class="page-intro">
  This is the official sequence: what happened, when it happened, and where the record still holds. Chapters may dispute motive, memory, or meaning. This timeline keeps to confirmed fact first.
</p>
{%- endif %}

{% set events = collections.timelineEvents %}
{% if events.length %}
<div class="timeline" role="list" aria-label="Canonical timeline">
  {%- for event in events -%}
  <div class="timeline-event" role="listitem">
    <span class="timeline-event__time">{{ event.data.timestamp | default("Unknown") }}</span>
    <div class="timeline-event__content">
      <h2 class="timeline-event__title">
        <a href="/star-rangers{{ event.url }}" style="color:inherit;text-decoration:none;">{{ event.data.title }}</a>
      </h2>
      {%- if edition.tier == "children" and event.data.plain -%}
      <p class="timeline-event__desc">{{ event.data.plain }}</p>
      {%- elif event.data.summary -%}
      <p class="timeline-event__desc">{{ event.data.summary }}</p>
      {%- endif -%}
    </div>
  </div>
  {%- endfor -%}
</div>
{% else %}
<p class="page-intro">No timeline events recorded yet.</p>
{% endif %}
