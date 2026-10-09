---
layout: base.njk
title: "Episode 1"
eleventyComputed:
  description: "Chapters in Season 12, Episode 1 of {{ site.name }}."
permalink: /seasons/s12/e01/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s12/">Season 12</a></li>
    <li aria-current="page">Episode 1</li>
  </ol>
</nav>

<h1 class="page-title">Season 12 · Episode 1</h1>
<p class="page-intro">
  The deep side. A year after the two stones, the smallest of the Told, born since, goes to the place where every
  telling begins and finds a shape standing in it that has no warmth. It moves no stone coming and none going, and it
  does not answer a stone moved for it, and when the telling the smallest is counting ends it is not there. By the
  people's own rules it is not a stranger and not a person, and the manners have no third case. Went-Round has a word
  for it, and says the word once. Stone-First-Who-Waited asks who was there, and keeps the rest open, because nobody was
  there for the part that would settle it, and nobody can be. Then, in the middle of an ordinary working time, a stone
  moves at the edge of the silt while Stone-First is on the line, moved well, and the ground says someone is coming, and
  nobody comes. The manners have been done, properly, by nobody. The line has three stones on it now, and the third is
  nobody's, and below, Carried-It-Sleeping keeps the small ones from going up to look and works out what the up-people
  felt for a whole season, from the inside. Then Stone-First is in the warm, telling, where everyone can hear, and a
  small one goes up to look anyway, and sees Stone-First on the line between the three stones, standing the way
  Stone-First stands, and the stone the small one moved is not answered. Went-Round goes round it, and goes up, and
  stands in Stone-First's place to see what it looks like from the other side, and it looks like Stone-First, even
  with nobody in it. Then, in the middle of a telling with the whole of the people in the warm, the amber goes out
  of the near wall and stands in the middle of them, a shape of gathered light in nobody's place. Nobody moved a stone,
  because nobody came. The small ones are not afraid of it, which is what Stone-First comes down the shelving to be
  careful about; Went-Round goes round it and finds it has a back the same as its front; it goes back into the wall
  before the telling ends. Everyone was there, so nobody can tell it, and the Told have no word for a thing that is
  beside you and in nobody's place. Then the small one who first stood beside Stone-First asks, with the manners, to
  go up the squeeze one more time, to find out whether they still fit, and the rock closes on them at the narrow the
  way it closes on everyone, and while they are held there a shape is in the crack ahead, where the crack is a hand
  wide, in the rock the way a person is in the warm, and then it is not ahead. The squeeze is the people's one way,
  and a thing has used it without needing a way. And then the one act, from the deep side: Stone-First is on the line when the
  up-people's loud comes down, and there is a shape on the line too, an arm's length beside, facing the squeeze, and
  it moved no stone coming. The small up-person comes through with the stone and the light held low, and the light
  finds Stone-First's feet, and then finds the shape, and goes round it. The up-person sets the stone down a hand
  from Stone-First's feet and not from the other's, and Stone-First answers, and the shape answers nothing. The
  up-people, who cannot hear the ground, could tell the two apart. Nobody records what was said.
</p>

{% set seasonNumber = "12" %}
{% set episodeNumber = "1" %}
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
