---
layout: base.njk
title: "Glossary"
eleventyComputed:
  description: "Definitions of every term, name, and concept used in {{ site.name }}."
---
<img class="page-hero-image" src="/star-rangers/images/lore/canonical-glossary-and-migration-guide.jpg" alt="A heavy bound reference volume lying open on a pale worktable in an archive reading room, its pages ruled in empty columns, a short red pencil in the gutter of the spine; beside it a small sealed cream housing with one green indicator, and behind, out of focus, shelves of identical unmarked spines." />
<h1 class="page-title">Glossary</h1>
{#- On a children's-tier build the index speaks in the tier's register: a
    plain intro, and each entry's `plain:` line in place of its `short`
    (Dermot's choice, 2026-10-05 - story-bible/intake-2026-10-05.md). The
    glossary an edition at that tier carries is the set its story pages
    link, one hop, each with a `plain:` line, which
    scripts/check-children-glossary.js enforces, so the `short` fallback below never shows on a children's
    build; it is there so a gap would show a definition rather than nothing. -#}
{%- if edition.tier == "children" %}
<p class="page-intro">
  Here is what a word means, if you meet one in the story you don't know. Press a word to read more about it.
</p>
{%- else %}
<p class="page-intro">
  Words fail first when a frontier starts to slip. This glossary fixes the terms used across the record. If a term carries rival meanings in-universe, the confirmed canonical sense appears first.
</p>
{%- endif %}

{% set terms = collections.glossary %}
{% if terms.length %}
<nav class="glossary-alpha" aria-label="Alphabetical index">
  {%- set letters = [] -%}
  {%- for term in terms -%}
    {%- set firstLetter = term.data.title | glossaryAlphaLetter -%}
    {%- if firstLetter not in letters -%}
      {%- set letters = letters.concat([firstLetter]) -%}
      <a href="#letter-{{ firstLetter }}">{{ firstLetter }}</a>
    {%- endif -%}
  {%- endfor -%}
</nav>

<dl class="glossary-list">
  {%- set currentLetter = "" -%}
  {%- for term in terms -%}
    {%- set firstLetter = term.data.title | glossaryAlphaLetter -%}
    {%- if firstLetter != currentLetter -%}
      {%- set currentLetter = firstLetter -%}
      <div class="glossary-letter-anchor" id="letter-{{ currentLetter }}">
        <h2 class="glossary-letter">{{ currentLetter }}</h2>
      </div>
    {%- endif -%}
    <div class="glossary-list__item">
      <dt class="glossary-list__term">
        <a href="/star-rangers{{ term.url }}">{{ term.data.title }}</a>
        {%- if term.data.category -%}
        <span class="character-badge" style="margin-left:0.5rem">{{ term.data.category }}</span>
        {%- endif -%}
      </dt>
      {%- if edition.tier == "children" and term.data.plain -%}
      <dd class="glossary-list__def">{{ term.data.plain }}</dd>
      {%- elif term.data.short -%}
      <dd class="glossary-list__def">{{ term.data.short }}</dd>
      {%- endif -%}
    </div>
  {%- endfor -%}
</dl>
{% else %}
<p class="page-intro">No glossary entries published yet.</p>
{% endif %}
