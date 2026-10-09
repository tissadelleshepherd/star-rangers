---
layout: base.njk
title: "Codex"
eleventyComputed:
  description: "In-universe documents, edicts, logs, and annotated records from {{ site.name }}."
---
<img class="page-hero-image" src="/star-rangers/images/hero/codex-documents.jpg" alt="A stack of official documents in files" />
<h1 class="page-title">Codex</h1>
<p class="page-intro">
  A logbook, an edict, a clipped archive note—this is where the world speaks in its own paperwork. These are primary sources. Read them closely, because some are incomplete, biased, or built to mislead.
</p>

<p class="page-intro">
  The record keeps its documents where the world keeps them. Entries below are shelved by holding collection — from the Survey Archive's binders to the recordings that survive only by being passed post to post — and each entry's own page records its precise shelf-mark.
</p>

{% set codexEntries = collections.codex %}
{% set libraries = [
  { name: "Survey Archive, Threshold Station", blurb: "The record's own working library, kept under Senior Archivist Sen — general holdings, the doctrinal working-paper series, the verification case files, and the reconciliation binders beside the Dock Seven incident file." },
  { name: "Threshold Station Offices", blurb: "The station's other filings: the Records Vault, the Maintenance Division, the Operations Annex, and the ceremonial record." },
  { name: "Eden Space Habitat Collections", blurb: "The habitat's library shelf and audio stock, and the chapter house's own correspondence." },
  { name: "Compact Administration", blurb: "The Orbital Habitats Compact's registry of standing instruments — the documents five habitats govern themselves by, posted in every member habitat's civic office." },
  { name: "Earth Institutional Archives", blurb: "The homeworld's institutions: the AI Governance Commission, the Police Department Central Archive, the Survey Corps Standards Office." },
  { name: "Celtic Union Archives", blurb: "Union cultural holdings — the Cultural Archive on Tír na nÓg and the Ceridwen Archive on Aethelrock." },
  { name: "Cnoc na mBeach", blurb: "The Keeper's own pages, and the hill's circulating records." }
] %}
{% set namedLibraries = [] %}
{% for lib in libraries %}{% set namedLibraries = (namedLibraries.push(lib.name), namedLibraries) %}{% endfor %}

{% if codexEntries.length %}
{% for lib in libraries %}
  {%- set hasEntries = false -%}
  {%- for entry in codexEntries %}{% if entry.data.library == lib.name %}{% set hasEntries = true %}{% endif %}{% endfor -%}
  {%- if hasEntries -%}
  <section class="thread-section" aria-labelledby="library-{{ lib.name | slugify }}">
    <h2 class="thread-section__title" id="library-{{ lib.name | slugify }}">{{ lib.name }}</h2>
    <p class="page-intro">{{ lib.blurb }}</p>
    <div class="codex-grid">
    {%- for entry in codexEntries %}{% if entry.data.library == lib.name -%}
    <a class="codex-card" href="/star-rangers{{ entry.url }}">
    {%- if entry.data.image -%}
    <img class="codex-card__thumb" src="/star-rangers/images/codex/{{ entry.data.image }}" alt="{{ entry.data.image_alt | default(entry.data.title) }}" />
    {%- endif -%}
    {%- if entry.data.category -%}
    <p class="codex-card__category">{{ entry.data.category }}</p>
    {%- endif -%}
    <h2 class="codex-card__title">{{ entry.data.title }}</h2>
    {%- if entry.data.institution -%}
    <p class="codex-card__institution">{{ entry.data.institution }}</p>
    {%- endif -%}
    </a>
    {%- endif %}{% endfor -%}
    </div>
  </section>
  {%- endif -%}
{% endfor %}

{% set hasScattered = false %}
{% for entry in codexEntries %}{% if (not entry.data.library) or (entry.data.library not in namedLibraries) %}{% set hasScattered = true %}{% endif %}{% endfor %}
{% if hasScattered %}
<section class="thread-section" aria-labelledby="library-scattered">
  <h2 class="thread-section__title" id="library-scattered">Circulating &amp; Scattered Holdings</h2>
  <p class="page-intro">Documents with no single archival master — recordings passed post to post, oral variants that disagree on purpose, and papers circulated open. What survives of these survives by being carried.</p>
  <div class="codex-grid">
  {%- for entry in codexEntries %}{% if (not entry.data.library) or (entry.data.library not in namedLibraries) -%}
  <a class="codex-card" href="/star-rangers{{ entry.url }}">
  {%- if entry.data.image -%}
  <img class="codex-card__thumb" src="/star-rangers/images/codex/{{ entry.data.image }}" alt="{{ entry.data.image_alt | default(entry.data.title) }}" />
  {%- endif -%}
  {%- if entry.data.category -%}
  <p class="codex-card__category">{{ entry.data.category }}</p>
  {%- endif -%}
  <h2 class="codex-card__title">{{ entry.data.title }}</h2>
  {%- if entry.data.institution -%}
  <p class="codex-card__institution">{{ entry.data.institution }}</p>
  {%- endif -%}
  </a>
  {%- endif %}{% endfor -%}
  </div>
</section>
{% endif %}
{% else %}
<p class="page-intro">No codex entries published yet.</p>
{% endif %}
