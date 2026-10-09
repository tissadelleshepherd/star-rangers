---
layout: base.njk
title: "Lore"
eleventyComputed:
  description: "World-building articles about the Five Layers, the Cosmic Cascade, factions, and the rules of {{ site.name }}."
comments: true
commentsCategory: lore
---
<img class="page-hero-image" src="/star-rangers/images/hero/lore-cosmic.jpg" alt="Multicoloured cosmic art of outer space" />
<h1 class="page-title">Lore</h1>
<p class="page-intro">
  Start with the ground under the story: the laws, factions, civic systems, and cosmological pressures that make each choice matter. These articles step outside the narrative. Because of that, they may confirm truths the characters have not yet proved.
</p>

{% set loreEntries = collections.lore %}
{% if loreEntries.length %}
  {%- set categories = [] -%}
  {%- for entry in loreEntries -%}
    {%- set cat = entry.data.category | default("General") -%}
    {%- if cat not in categories -%}
      {%- set categories = categories.concat([cat]) -%}
    {%- endif -%}
  {% endfor %}

  {% for cat in categories %}
  <section class="lore-category-section" aria-labelledby="lore-cat-{{ cat | lower | replace(' ', '-') }}">
    <h2 class="season-block__title" id="lore-cat-{{ cat | lower | replace(' ', '-') }}">{{ cat }}</h2>
    <div class="codex-grid">
      {%- for entry in loreEntries -%}
        {%- if (entry.data.category | default("General")) == cat -%}
        <a class="codex-card" href="/star-rangers{{ entry.url }}">
          {%- if entry.data.image -%}
          <img class="codex-card__thumb" src="/star-rangers/images/lore/{{ entry.data.image }}" alt="{{ entry.data.image_alt | default(entry.data.title) }}" />
          {%- endif -%}
          <p class="codex-card__category">{{ entry.data.category | default("General") }}</p>
          <h3 class="codex-card__title">{{ entry.data.title }}</h3>
        </a>
        {%- endif -%}
      {%- endfor -%}
    </div>
  </section>
  {%- endfor -%}
{% else %}
<p class="page-intro">No lore articles published yet.</p>
{% endif %}
