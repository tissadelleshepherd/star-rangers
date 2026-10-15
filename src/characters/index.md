---
layout: base.njk
title: "Characters"
eleventyComputed:
  description: "Profiles of every named character, being, and entity in {{ site.name }}."
---
{#- An edition may name its own hero for this page (lib/editions.js
    `sectionHeroes.characters`); the site-wide default is Dermot's own photograph
    *Watching the Sunrise* (Great South Wall, Dublin, March 2026), cropped to a banner. -#}
{% set sectionHero = edition.sectionHeroes.characters if edition.sectionHeroes else null %}
{% if sectionHero %}
<img class="page-hero-image" src="/star-rangers/images/hero/{{ sectionHero.image }}" alt="{{ sectionHero.alt }}" />
{% else %}
<img class="page-hero-image" src="/star-rangers/images/hero/characters-poolbeg-watchers.jpg" alt="Three people in dark silhouette walking along a sea wall towards a low orange sunrise, the sun a bright disc above the horizon on the right and Poolbeg lighthouse standing dark against the sky behind them, calm sea and two small buoys to the left" />
{% endif %}
<h1 class="page-title">Characters</h1>
<p class="page-intro">
  These are the named lives inside the record: officers, civilians, constructs, beings, and entities whose choices keep the frontier functioning or force it to change. Species labels reflect canonical classification—not how characters name themselves or one another.
</p>

{% set chars = collections.characters %}
{% if chars.length %}
<div class="codex-grid">
  {%- for char in chars -%}
  <a class="codex-card" href="/star-rangers{{ char.url }}">
    {%- if char.data.image -%}
    <img class="codex-card__thumb" src="/star-rangers/images/characters/{{ char.data.image }}" alt="{{ char.data.image_alt | default(char.data.title) }}" />
    {%- endif -%}
    <p class="codex-card__category">{{ char.data.species | default("Unknown") }}{% if char.data.role %} · {{ char.data.role }}{% endif %}</p>
    <h2 class="codex-card__title">{{ char.data.title }}</h2>
    {%- if char.data.aliases and char.data.aliases.length -%}
    <p style="font-size:0.8rem;color:var(--color-text-muted);margin-top:0.25rem;font-family:var(--font-ui)">
      aka {{ char.data.aliases | join(", ") }}
    </p>
    {%- endif -%}
  </a>
  {%- endfor -%}
</div>
{% else %}
<p class="page-intro">No character profiles published yet.</p>
{% endif %}
