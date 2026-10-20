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
  <em>Fian Ilchruinne</em> is hard science fiction with a hopeful heart. Real physics holds
  where people live, and the one invented thing is the shape of reality above it: five
  layers, a multiverse of membranes, and boundary zones where instruments disagree lawfully.
  The Star Rangers work those edges, and they guard the public record as carefully as they
  guard people.
</p>
<p class="page-intro">
  It's a story where decency is real and costly. Its officers won't claim more than the
  evidence supports, won't sign a comforting lie, and won't accept a rescue that pretends a
  wound is healed. Evil exists, but it can't outlast the purpose it borrowed. Across many
  viewpoints and timelines, from a station clock that's been forty seconds wrong for years
  to a cat detective agency and a people who keep their history by speaking it, the series
  asks what it means to keep faith with the truth and with each other.
</p>
<p class="page-intro">
  Rigorous like hard SF, hopeful like the old epics.
</p>
<p class="page-intro">
  Dermot R. Cochran is a senior software engineer working in applied AI, based in Dublin,
  Ireland. His work spans engineering, photography, and fiction, with a growing focus on
  engineering intelligence, human-AI systems, and the role of intelligent tools in
  creativity and decision-making.
</p>

<h2 id="how-this-site-is-built">How this site is built</h2>
<p>
  Fian Ilchruinne is a static site built with <a href="https://www.11ty.dev/">Eleventy</a>
  from Markdown and Nunjucks templates, checked by a test suite and a dry-run build on
  every pull request before anything is published. The commands, the content schema and
  the deployment path are in the repository's README and technical README.
</p>

<h2 id="how-this-site-is-written">How this site is written</h2>
<p>
  All characters and story ideas are original to the author. The narrative prose is either his
  own or written by Claude Fable under his direction and following his ideas, including some
  prose carried over from Copilot or Sudowrite drafts that were also written from his prompts.
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

<h2 id="how-this-site-is-illustrated">How this site is illustrated</h2>
<p>
  The pictures are illustrations, not the work. Most are generated, some are made from the
  author's own photographs, and a few are those photographs as they stand; every one of them is
  recorded with what made it. Where a picture and an entry disagree, the entry is right. The
  author's photography has a home of its own at
  <a href="https://dermotcochran.com/">dermotcochran.com</a>, and nothing made for this site
  goes there. One picture is neither: the nebula behind the
  <a href="/star-rangers/lore/noogenic-seeding-system/">Noögenic Seeding System</a> entry is the
  James Webb Space Telescope's image of the "Cosmic Cliffs" in the Carina Nebula, credit NASA,
  ESA, CSA and STScI, with a small motif added.
</p>

<h2 id="the-engineering-behind-the-record">The engineering behind the record</h2>
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
<p>
  All three go back to the author's PhD,
  <a href="https://researcher.itu.dk/ws/portalfiles/portal/109063637/130422_FINAL_for_PRINT_BOOK_FORMAT_dermotcochran_phd_dissertation_post_defense.pdf"><em>Formal
  Specification and Analysis of Danish and Irish Ballot Counting Algorithms</em></a> (IT University
  of Copenhagen, 2013), which followed a bachelor's degree in Mathematical Science (Trinity College
  Dublin, 1992), a master's in Industrial Engineering (University College Dublin, 2003) and an MSc
  in Advanced Software Engineering (University College Dublin, 2007). The thesis applied automated reasoning, the symbolic branch of artificial
  intelligence, to software design. The Danish and Irish counting rules were specified in Alloy,
  whose analyser hands a design to a SAT solver and asks it for a counterexample, and the Java
  implementation was written against JML contracts, checked both statically, by automated provers
  before the code ran, and at runtime, as assertions while it ran. The JML-annotated sources are
  public as <a href="https://github.com/FreeAndFair/Votail">Votail</a>, from work within ITU's
  <a href="https://demtech.dk">DemTech</a> research project, and the Alloy models are printed in
  the thesis's appendices. Voting, above, is a fresh engine built on the same discipline. The lesson it taught
  is that software looks correct until a machine finds the case where it is not, and that is the
  problem generative AI has since made everyone's: a model can propose code, and specifications,
  invariants and automated checks decide what ships. The author works as a software engineer,
  latterly specialising in applied AI, which is where that problem now lives. The journal entry
  <a href="/star-rangers/journal/the-external-codex/">The External Codex</a> says what this
  record took from the thesis, and why the record itself never cites it. The author's publications
  are listed on <a href="https://scholar.google.com/citations?user=LgLsr40AAAAJ">Google Scholar</a>.
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
  <strong>Noted.</strong> Fan works the site knows of and points at are listed here on the
  licence's standing formula — <em>referenced, not endorsed</em>: a link is a pointer, not
  approval, and being listed here confers no official status. None is noted at present.
</p>

<h2 id="how-this-site-is-deployed">How this site is deployed</h2>
<p>
  Two deployments run from this repository. The canonical site,
  <a href="https://fianilchruinne.com/">fianilchruinne.com</a>, is served by
  GitHub Pages: a GitHub Actions workflow builds it with Eleventy on every push to
  <code>main</code> and publishes the result, so a change merged there is live within
  minutes. Every other edition is a cPanel-hosted clone of the repository. Each clone
  pulls from <code>main</code> on a schedule, usually overnight, and rebuilds only when
  that pull brings something new, using <code>scripts/cpanel-deploy.sh</code> to build
  the site with Eleventy and copy it into <code>public_html</code>. So a change reaches
  the canonical site first and the other editions the following morning.
</p>
<p>
  Each clone's identity — its palette, its wording, and whether it narrows the content
  to a subset — is resolved from a registry in the repository by domain name, so a
  clone's own untracked <code>deploy.conf</code> need only name the account and the
  domain. What that registry may hold is deliberately limited: it carries framing, never
  facts. The lore, the glossary and the chapters are identical on every domain, and a
  narrowed clone shows a subset of one record rather than a variant of it.
</p>
{%- endif -%}
