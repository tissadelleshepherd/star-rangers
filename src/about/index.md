---
layout: base.njk
eleventyComputed:
  title: "{% if edition.about %}{{ edition.about.title }}{% else %}About the Author{% endif %}"
  description: "{% if edition.about %}Who made {{ site.name }}, and how a grown-up can reach him.{% else %}About Dermot R. Cochran, creator of Fian Ilchruinne.{% endif %}"
---
{%- if edition.about -%}
{#- ======================================================================
    The plain-register About. A tier opts into this by carrying `about` in
    lib/editions.js (today: the children's tier, on CHILDREN_TIER, so both
    children's doors serve the same page). The registry supplies the
    sentences; this template supplies the markup. No hero on this register. The child-facing
    paragraphs name the main site in words and never link it (the 2
    September ruling on excludedNotice); the grown-ups block carries the
    page's only links, all to adult destinations. The hero below is
    Dermot's own frame, Dublin Bay from the Hills (8 October 2026).
    ====================================================================== -#}
<h1 class="page-title">{{ edition.about.title }}</h1>
{%- for para in edition.about.intro %}
<p class="page-intro">{{ para | safe }}</p>
{%- endfor %}

<h2 id="grown-ups">{{ edition.about.grownUpsTitle }}</h2>
{%- for para in edition.about.grownUps %}
<p>{{ para | safe }}</p>
{%- endfor %}
{%- else -%}
<img class="page-hero-image" src="/star-rangers/images/hero/about-writer.jpg" alt="Dublin seen from high ground to the south on a hazy November afternoon: the office blocks of Sandyford across the foot of the frame, the city beyond, the red-and-white banded Poolbeg chimneys over the docks, and the bay running out to Howth on the far shore" />
<h1 class="page-title">About the Author</h1>
<p class="page-intro">
  <em>Fian Ilchruinne</em> is a world that no one really understands but everyone tries to
  explain in their own way.
</p>
<p class="page-intro">
  Dermot R. Cochran is a senior software engineer working in applied AI, based in Dublin,
  Ireland. His work spans engineering, photography, and fiction, with a growing focus on
  engineering intelligence, human-AI systems, and the role of intelligent tools in
  creativity and decision-making.
</p>

<h2>How this site is built</h2>
<p>
  Fian Ilchruinne is a static site built with <a href="https://www.11ty.dev/">Eleventy</a>
  from Markdown and Nunjucks templates, checked by a test suite and a dry-run build on
  every pull request before anything is published. The commands, the content schema and
  the deployment path are in the repository's README and technical README.
</p>

<h2>How this site is written</h2>
<p>
  The words on this site have been drafted and edited with the help of more than one tool over
  time, and the split is worth naming honestly. The early version of the site leaned on
  <a href="https://github.com/features/copilot">GitHub Copilot</a> and Microsoft 365 Copilot for
  scaffolding and template work; some of the Codex's in-universe documentary passages were refined in
  <a href="https://www.sudowrite.com/">Sudowrite</a>. That last part became a problem once a
  Sudowrite draft and the committed file drifted out of sync and neither could be trusted as
  authoritative — so the repository is now the single source of truth, and everything reconciles to
  it. <a href="https://claude.com/claude-code">Claude Code</a> does most of the current editing and
  organizing work directly against the repository, running the schema validation and dry-run build
  before anything is committed and helping keep the lore, Codex, glossary, and story bible consistent
  with each other. There's a fuller account of how that came to be in the
  <a href="/star-rangers/journal/two-copies-forty-seconds-apart/">Journal</a>.
</p>

<h2>How this site is illustrated</h2>
<p>
  The pictures are illustrations, not the work. Most are generated, some are made from the
  author's own photographs, and a few are those photographs as they stand; every one of them is
  recorded with what made it. Where a picture and an entry disagree, the entry is right. The
  author's photography has a home of its own at
  <a href="https://dermotcochran.com/">dermotcochran.com</a>, and nothing made for this site
  goes there.
</p>

<h2>The engineering behind the record</h2>
<p>
  Three of the author's public engineering projects ask, in code, the questions this story asks in
  fiction — and the resemblance is lineage, not coincidence.
  <a href="https://github.com/dermot-r-cochran/swarm">EPISTEME (swarm)</a> is an epistemic
  architecture in which beliefs are explicit objects with confidence and lifecycle state, evidence
  is validated before it may influence them, and every revision is kept in an auditable history —
  the same discipline this site practices as its canon statuses, its Codex of sourced accounts,
  and its Survey Archive of reconciliation binders.
  <a href="https://github.com/dermot-r-cochran/Voting">Voting</a> is a deterministic,
  invariant-preserving allocation engine whose creed — exact arithmetic, conservation asserted at
  every phase boundary, a loud stop preferred to a silent error — is also the creed of this
  repository's validators.
  And the <a href="https://github.com/dermot-r-cochran/architecture-definition-model">Architecture
  Definition Model (ADM)</a> is a framework for keeping the architecture of generative-AI systems
  explicit, human-owned, and auditable; the working agreement that governs how this site is
  written and reviewed is a live instance of it, and appears in that repository as a case study.
</p>

<h2 id="fan-works">Fan fiction</h2>
<p>
  Want to write your own stories in the Fian Ilchruinne universe? Post them on
  <a href="https://archiveofourown.org/">Archive of Our Own</a> or
  <a href="https://www.wattpad.com/">Wattpad</a> rather than here — tag them
  something like "Fian Ilchruinne (Dermot R. Cochran)" so other readers can find
  them, and feel free to link your work in the
  <a href="https://github.com/Star-Rangers/sciencefiction-site-comments/discussions">comments</a>'
  Fan Creations category.
</p>
<p>
  <strong>Translations count as fan works too.</strong> English is the canonical text, so a
  translation into another language is a derivative reading rather than authoritative canon —
  which makes it exactly the kind of non-commercial fan work the licence's Fan Works Policy
  welcomes, not something the main site can vouch for line by line. Post one the same way
  (AO3 or Wattpad, tagged and clearly marked an unofficial translation) and link it in the
  Fan Creations category so readers in that language can find it. One note for translators:
  the story's coined in-universe terms — names and technical vocabulary like <em>Kieme</em> —
  are canon as spelled, not ordinary words to render, so a faithful translation leaves them
  intact. For a casual read in another
  language, your browser's built-in translate feature works on every page — automatically, and
  just as unofficially.
</p>
<p>
  Prefer to run your own site instead of posting to an existing platform? Fan fiction clones
  of this site are explicitly allowed and supported, non-commercially and clearly labeled as
  unofficial — see the <a href="/star-rangers/#license">Licence section</a>'s Fan Works Policy
  and the <a href="/star-rangers/forking/">Forking This Site</a> guide for how to fork this
  repository and reuse some or all of the existing content.
</p>
<p id="noted-fan-works">
  <strong>Noted.</strong> Fan works the site knows of and points at are listed on the licence's
  standing formula — <em>referenced, not endorsed</em>: a link is a pointer, not approval, and
  being listed here confers no official status. One is noted so far:
  <a href="https://github.com/tissadelleshepherd/star-rangers">tissadelleshepherd/star-rangers</a>,
  a fan fork of this repository whose one addition is an uncaptioned, AI-generated picture of a
  red-haired woman walking a beach at sunset. Between the account's name and the likeness, the
  intent is plain enough — <a href="/star-rangers/characters/tissadelle-shepherd/">Tissadelle
  Shepherd</a>, off duty — but the identification is the maker's, not the record's. In
  circulation, and noted.
</p>

<h2>How this site is deployed</h2>
<p>
  Two deployments run from this repository. A GitHub Actions workflow builds the site
  with Eleventy on every push to <code>main</code> and publishes the result to
  <a href="https://dermot-r-cochran.github.io/star-rangers/">GitHub Pages</a>. Separately,
  cPanel-hosted clones of the site pull updates via cPanel's Git Version Control feature,
  driven by <code>.cpanel.yml</code> and <code>scripts/cpanel-deploy.sh</code>, which build
  the site with Eleventy and copy it into <code>public_html</code>. Each clone's identity —
  its palette, its wording, and whether it narrows the content to a subset — is resolved
  from a registry in the repository by domain name, so a clone's own untracked
  <code>deploy.conf</code> need only name the account and the domain. What that registry
  may hold is deliberately limited: it carries framing, never facts. The lore, the
  glossary and the chapters are identical on every domain, and a narrowed clone shows a
  subset of one record rather than a variant of it.
</p>
{%- endif -%}
