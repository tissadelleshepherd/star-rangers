---
layout: base.njk
title: "Home"
description: "Fian Ilchruinne — a multi-viewpoint hard-science-fiction novel with one licensed deviation. One canonical history across the Five Layers, multiple Concordants, and multiple points of view."
---
{%- set heroCharacters = collections.characters | charactersByIds(edition.heroCharacterIds) | withImages -%}
<section class="home-hero">
  {#- The slideshow is per-edition (lib/editions.js) AND per-deploy: its cast is
      resolved against the FILTERED characters collection, so a narrowed clone
      (deploy.conf's CHARACTERS/TOPICS/THREADS) can drop some hero characters -
      or, if none of the edition's ids survive its filter, all of them. That
      last case used to render nothing at all, leaving the one page every reader
      lands on first with no image on it. The site's own fallback hero stands in
      instead; it is the same file this page already advertises as its
      og:image, so a card and the page now agree.

      `withImages` is what makes the count below honest, and it matters for
      more than tidiness: a hero character with no `image:` used to render an
      empty <img> requesting the characters DIRECTORY, and it counted toward
      --nN all the same, so the crossfade timed a slot for a slide that was
      never going to appear. Filtering before the count fixes both at once.

      Since 2026-08-29 the same filter also drops PLACEHOLDER-stamped
      portraits (the designed PORTRAIT PENDING cards), so the slideshow only
      ever shows finished images - on every domain. -#}
  {%- if heroCharacters.length %}
  <div class="home-hero__slideshow home-hero__slideshow--n{{ heroCharacters.length }}" aria-hidden="true">{% for character in heroCharacters %}
    <img class="home-hero__slide" src="/star-rangers/images/characters/{{ character.data.image }}" alt="" />{% endfor %}
  </div>
  {%- else %}
  <img class="page-hero-image" src="/star-rangers{{ ogImage }}" alt="{{ ogImageAlt }}" />
  {%- endif %}
  <h1 class="home-hero__title">✦ {{ site.name }}</h1>
  <p class="home-hero__subtitle">{{ edition.heroSubtitle | safe }}</p>
  {#- The newest entry used to be appended to the subtitle above, title and
      full excerpt both. `latestLore.excerpt` is the whole first paragraph of
      the entry, uncapped, and the Lore card below renders the same string - so
      the homepage carried it twice and the hero ran to 162 words, of which 105
      were the duplicate. The pitch was buried and the one call to action was
      stranded under it. The entry keeps its place in the hero as the second
      door instead: the paragraph sells the newest thing in the record and the
      only button used to send a reader to chapter one, which is a mismatch a
      second button fixes better than a sentence did. Two doors, not a menu -
      the six section cards below are the menu. -#}
  <div class="home-hero__ctas">
    <a class="home-hero__cta" href="/star-rangers/start/">Begin Reading</a>
    {%- if latestLore %}
    <a class="home-hero__cta home-hero__cta--secondary" href="/star-rangers{{ latestLore.url }}">Newest: {{ latestLore.title }}</a>
    {%- endif %}
  </div>
</section>

<section aria-label="Site sections">
  {#- A card is a promise that the section behind it has something on it. On
      a narrowed edition that is not guaranteed: undercover-pets.com carries
      no lore at all and one glossary entry, and until 2026-09-01 its homepage
      offered "Map the layers of reality..." over a page that said "No lore
      articles published yet." Reference cards are shown only when the
      filtered collection behind them is non-empty; Seasons and Characters
      always are, since every edition fronts chapters and a cast. -#}
  <div class="home-sections">
    <a class="home-card" href="/star-rangers/seasons/">
      <span class="home-card__icon" aria-hidden="true">📖</span>
      <h2 class="home-card__title">Seasons &amp; Episodes</h2>
      <p class="home-card__desc">Start with the chapters, then switch viewpoints to see how one canon event is remembered, defended, or denied.</p>
    </a>
    <a class="home-card" href="/star-rangers/characters/">
      <span class="home-card__icon" aria-hidden="true">🧑‍🚀</span>
      <h2 class="home-card__title">Characters</h2>
      <p class="home-card__desc">Meet the officers, constructs, and beings—human and otherwise—whose loyalties keep the frontier intact—or break it.</p>
    </a>
    {%- if collections.timelineEvents.length -%}
    <a class="home-card" href="/star-rangers/timeline/">
      <span class="home-card__icon" aria-hidden="true">🕰</span>
      <h2 class="home-card__title">Timeline</h2>
      <p class="home-card__desc">Read the fixed sequence of events first. Then trace how later testimony argues over what those events mean.</p>
    </a>
    {%- endif -%}
    {%- if collections.lore.length -%}
    <a class="home-card" href="/star-rangers/lore/">
      <span class="home-card__icon" aria-hidden="true">🌌</span>
      <h2 class="home-card__title">Lore</h2>
      <p class="home-card__desc">{% if latestLore %}{{ latestLore.excerpt }}{% else %}Map the layers of reality, from history and factions to species, technology, and the cosmology behind them all.{% endif %}</p>
    </a>
    {%- endif -%}
    {%- if collections.glossary.length -%}
    <a class="home-card" href="/star-rangers/glossary/">
      <span class="home-card__icon" aria-hidden="true">📚</span>
      <h2 class="home-card__title">Glossary</h2>
      <p class="home-card__desc">Fix the terms before the arguments begin: institutions, phenomena, titles, and names from across the record.</p>
    </a>
    {%- endif -%}
    {%- if collections.codex.length -%}
    <a class="home-card" href="/star-rangers/codex/">
      <span class="home-card__icon" aria-hidden="true">🗂</span>
      <h2 class="home-card__title">Codex</h2>
      <p class="home-card__desc">Open the raw paperwork—logs, directives, and archive notes—where memory and authority collide line by line.</p>
    </a>
    {%- endif -%}
  </div>
</section>

<section id="license" aria-label="License">
  <h2>Licence</h2>
  <p>Copyright © {{ build.copyrightYears }} Dermot R. Cochran. Some rights reserved.</p>
  <p>
    The text and world-building content of <em>Fian Ilchruinne</em> is licensed under the
    <strong>Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International</strong>
    (<strong>CC BY-NC-ND 4.0</strong>) licence. You are free to share this material — copy and
    redistribute it in any medium or format — for non-commercial purposes only, provided you give
    appropriate credit to Dermot R. Cochran, indicate if any changes were made, and do not
    distribute adapted or derivative versions of the work — with one standing exception:
    non-commercial fan works (fan fiction, fan art, and fan fiction clones of this site) are
    explicitly welcome. See the <a href="/star-rangers/about/">About page</a> and the
    repository's <code>CONTENT-LICENSE.md</code> for the details and conditions.
  </p>
  <p>
    The Eleventy site engine and deployment tooling behind this site are licensed separately,
    under the permissive <strong>MIT</strong> licence — see the
    <a href="https://github.com/dermot-r-cochran/star-rangers">GitHub repository</a> for details.
  </p>
  <p>
    The full text of the licence is on its own page: <a href="/star-rangers/licence/">Licence</a>.
  </p>
</section>
