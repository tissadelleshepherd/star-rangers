---
layout: base.njk
title: "Atlas"
eleventyComputed:
  description: "A hierarchical map of every documented galaxy, star system, and world in {{ site.name }} canon."
---
<img class="page-hero-image" src="/star-rangers/images/hero/atlas-chart.jpg" alt="A vintage deep-space navigational atlas in gold ink on blue paper, spread across a chart table with sextant, compass, and drafting dividers under lamplight" />
<h1 class="page-title">Atlas</h1>
<p class="page-intro">
  Not every place mentioned in the record has been surveyed closely enough to map. This atlas shows the galaxies, star systems, and worlds that have — grouped by where they actually sit, not by when they were written down.
</p>

{% set locationEntries = collections.lore %}
{% set galaxies = [] %}
{% for entry in locationEntries %}
{% if entry.data.category == "Locations" and entry.data.galaxy %}
{% if entry.data.galaxy not in galaxies %}
{% set galaxies = galaxies.concat([entry.data.galaxy]) %}
{% endif %}
{% endif %}
{% endfor %}

{% if galaxies.length %}
{% for galaxy in galaxies %}
<section class="lore-category-section" aria-labelledby="atlas-galaxy-{{ galaxy | lower | replace(' ', '-') }}">
<h2 class="season-block__title" id="atlas-galaxy-{{ galaxy | lower | replace(' ', '-') }}">{{ galaxy }}</h2>

{% set systems = [] %}
{% for entry in locationEntries %}
{% if entry.data.category == "Locations" and entry.data.galaxy == galaxy and entry.data.system %}
{% if entry.data.system not in systems %}
{% set systems = systems.concat([entry.data.system]) %}
{% endif %}
{% endif %}
{% endfor %}

{% for system in systems %}
<div class="atlas-system">
<h3>{{ system }}</h3>
<div class="codex-grid">
{% for entry in locationEntries %}
{% if entry.data.category == "Locations" and entry.data.galaxy == galaxy and entry.data.system == system %}
<a class="codex-card" href="/star-rangers{{ entry.url }}">
{% if entry.data.image %}
<img class="codex-card__thumb" src="/star-rangers/images/lore/{{ entry.data.image }}" alt="{{ entry.data.image_alt | default(entry.data.title) }}" />
{% endif %}
<p class="codex-card__category">{{ entry.data.locationType | default("Location") }}</p>
<h3 class="codex-card__title">{{ entry.data.title }}</h3>
</a>
{% endif %}
{% endfor %}
</div>
{% if system == "Sol System" %}
<p class="page-intro">Also in this system, referenced but not yet individually documented: Earth, Titan, the Belt, and the Marsh Causeway.</p>
{% endif %}
</div>
{% endfor %}
</section>
{% endfor %}
{% else %}
<p class="page-intro">No locations mapped yet.</p>
{% endif %}

<p class="page-intro">
  Six worlds hold charter membership in the <a href="/star-rangers/lore/celtic-union-of-planets/">Celtic Union of Planets</a>; only three — Tír na nÓg, Ynys Wydrin, and Aethelrock — have confirmed system placements so far. The rest, including Kernowek Reach, are known by name only.
</p>
