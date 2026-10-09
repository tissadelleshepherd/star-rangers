---
layout: base.njk
title: "Episode 2"
eleventyComputed:
  description: "Chapters in Season 12, Episode 2 of {{ site.name }}."
permalink: /seasons/s12/e02/
---
<nav class="chapter-breadcrumb" aria-label="Episode location">
  <ol class="breadcrumb" role="list">
    <li><a href="/star-rangers/seasons/">Seasons</a></li>
    <li><a href="/star-rangers/seasons/s12/">Season 12</a></li>
    <li aria-current="page">Episode 2</li>
  </ol>
</nav>

<h1 class="page-title">Season 12 · Episode 2</h1>
<p class="page-intro">
  The same season from above the line. The party knocks every shift now, and is answered every shift, and works
  after. Then the imager's playback shows a shape at the mouth of the third passage with an edge the light goes
  round and nothing on any other channel: no warmth, no sound, no mass. Egede files an imager fault and
  recalibrates, and it comes back, and the spare sees it too, and for seven weeks the log says the instrument is
  broken. Aravena, asked at last, says where it stands: where the small one stood for eleven minutes, the first
  year. Nakagawa strikes the word fault, writes down what the imager saw and not what it was, and asks the Corps
  for the one colleague whose page this is. In a rack at the station, something the survey does not own goes on
  logging what the survey does not read. Then the colleague comes, on the supply run, and reads the file in the wind,
  and asks about the third shelf of the rack. Odile Ferrant breaks a seal that is hers to break and reads two years
  of a log that said nominal every day and meant inside the band. She watches the knock from the junction, asks for a
  handheld to go with the stone, and is told not today. She files her reading at its grade in her own file, under the
  name of the page she reads for a living, writes one line in the survey's log, and will not say what the feature is.
  The station had known for two years, in a language nobody on it could read. And then the one act, from above:
  Nakagawa has slept on it and the answer is today. Aravena takes the stone through, and on the chest strap, pointed
  where the light points, Ferrant's handheld. The light finds the one on the line, and beside it, an arm's length to
  the side, a second shape the light goes round. The handheld sees two upright shapes and one thermal return. Aravena
  does the thing anyway, a hand from the warm one's feet, and is answered by the sound the party has known for a year,
  and the other answers nothing. The log that shift says what happened and not one thing more.
</p>

{% set seasonNumber = "12" %}
{% set episodeNumber = "2" %}
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
