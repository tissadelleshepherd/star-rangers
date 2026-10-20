---
layout: base.njk
title: "Episode 0"
description: "Prequels to Season 1 — how a household cat became the Marsh Causeway's first watcher, how three machines reached a wrecked ship a generation earlier, how a boundary analyst on a newly reached membrane filed three words and declined a softer one, how a singer on Eden's dock circuit came to wear one bar, and how a Starwarden at another post with two clocks filed one more transient and nothing else, how a Federation assembly session asked a Mnemari witness for the words of the Rangers' compact as they were first said, and how a young pilot flew the one certified route into Deadwater and found the margin gone."
permalink: /seasons/s01/e00/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s01/">Season 1</a></li>
    <li aria-current="page">Episode 0</li>
  </ol>
</nav>

<img class="page-hero-image" src="/star-rangers/images/hero/s01e00-cat.jpg" alt="A black cat with amber eyes walking along a fallen branch towards the camera, rim-lit against a dark background" />
<h1 class="page-title">Season 1 · Episode 0</h1>
<p class="page-intro">
  What came before Episode 1, at different distances. Four years back: before Elvira ever took up the Marsh Causeway outpost, her household cat chose exile over a garden gate — and found, on a bare tidal rock, the first confirmation that her sensitivity to the boundary was real. Thirty-eight years back: a long-voyage ship stops answering, three machines are sent to it, and what they carry out are children. Twelve years back: the Survey Corps' first party on the membrane of what was later registered as Counterpane logs nothing wrong for ninety days, and then a routine calibration returns a residual that will not close, and a Krenyi Section Lead files what happened and nothing smaller. One year back: a singer on Eden's dock circuit has been leaving the room its own line for a year when a Music Corps Principal at a back table writes it down, and the morning after, a form with a line for prior training, a tab with one bar, and an instruction about whose the room is. The same autumn, at a post the record does not name: a dominance window runs more than twice as long as any the post has logged, a salvage hull is brought in on two clocks, and in the hour after the turn the watch logs a band the anomaly register has a name for, which the Starwarden leaves off. The summer before, on the far side of the Rangers' oldest compact: a Federation assembly session revisiting the material-support compact asks the one witness who sat at its first table for the words of the term as they were said, and gets them, in order, with the words that came after. Seventeen years back: a Survey Corps relief hull folds into Deadwater by the one certified route, a Senior on the piloting track finds the lock margin under floor with nothing wrong and launches a front the medium takes, a Star Captain aboard for no reason she would accept from anyone else countersigns a relief list under a word nobody believes, and on the home side the margin is there.
</p>

{% set seasonNumber = "1" %}
{% set episodeNumber = "0" %}
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
