# Edition reader profiles and style guide

Unpublished authorial note. One profile per edition in `lib/editions.js`: who
arrives at that domain, what they came for, and what the page owes them —
palette, posture, copy, cast and sound.

**Why this exists.** The registry records *what* each edition is set to and,
generously, *why* each setting was chosen. It does not record who the setting
is for. That gap showed up as a real question the day the codex site was
registered: `fellowshipoflight.site` took the Fellowship's palette because it
is the Fellowship's archive, and then read like a novel because palette was the
only axis there was. The reader it was built for came looking for a document.
Nothing in the file could say so, so nothing in the build did anything about
it.

**What it decides, and what it must not.** Everything here is *framing* — the
same constraint that governs the registry itself, and for the same reason.
**Nothing an edition carries may assert a fact about the world.** Canon is
centralised: `src/seasons/`, `src/lore/` and `src/glossary/` are identical on
every domain, filtering only ever subtracts, and an excluded page still builds
at its own URL as a placeholder. A reader profile can change what a domain
looks like, what it says about itself, and what it puts in front of a reader
first. It cannot change what is true. If a difference between two editions
would let a reader come away with two incompatible beliefs about the setting,
it is not a presentation decision and does not belong here.

**Where this sits among the other notes.** `domain-strategy-and-duplicate-content.md`
answers *which domain ranks* and why the families are drawn where they are;
`story-bible-summary.md`'s audience-tier table answers *how long a POV block
should be* for each readership; `images.md` and `music-prompts.md` answer how
the pictures and the audio get made. This one answers *who is reading, and how
the page should meet them*. Read the registry itself for the settings — it is
authoritative, this is the intent behind it.

---

## The three axes

A build's face is decided by three independent things. They were two until
2026-08-21, and the third was extracted from the second for the same reason
`edition` was once extracted from `theme`: one variable was answering two
questions, and the day two domains wanted the same answer to one and different
answers to the other, it could not.

| Axis | Question | Lives in | Values |
|---|---|---|---|
| **Edition** | Who is this domain? | `lib/editions.js` | `default`, `sciencefiction`, `fellowship`, `fellowship-archive`, `starquest`, `pets`, `church-space` |
| **Theme** | What colour is it? | `scripts/generate-themes.js` → `src/css/theme-*.css` | 4 narrative palettes + `light`, `sepia`, `high-contrast`, `solarized` |
| **Presentation** | How does it want to be read? | `PRESENTATION_MODES` → `src/css/main.css` | `story`, `primer`, `archive`, `contemplative` |

They compose rather than multiply: a mode moves only custom properties, so
`generate-themes.js` carries all four modes into all nine palettes by copying
main.css verbatim outside `:root`. `EDITION=fellowship-archive THEME=sepia` is
a sentence you can write, and it gets archive density in parchment colours.

**A mode is a posture, not a tier.** The audience tiers (children → young adult
→ general → contemplative) are about register and block length. A posture is
about what the reader's hands and eyes are doing: reading a story straight
through, being helped to finish a block, sitting with a page, or looking
something up. That is why the young-adult and general tiers share `story` —
same posture, different prose — and why the codex site is `archive` despite
sharing the fellowship's tier *and* its palette.

---

## The house floor

True on every edition, and not negotiable per domain:

1. **Framing only.** Nothing an edition carries may assert a fact about the
   world. A domain that needs a page of its own gets a non-canonical one.
2. **4.5:1 minimum on text.** WCAG 2.2 AA, checked by
   `node scripts/check-contrast.js` over every palette, on the pairs main.css
   actually composes — including hover states and the two-steps-darker
   `--color-surface-2` that badges and labels sit on. One exemption, recorded
   in the script: `solarized`, which is a faithful reproduction of a published
   palette and is nobody's edition default.
3. **Legible with nothing switched on.** No edition may depend on JavaScript,
   audio, or images to be readable. The POV controls, the search box and the
   hero slideshow are all enhancements; the audio is `preload="none"` behind a
   play button and nobody hears it who did not ask.
4. **Unsettling, never horror** — the standing tone rule, and it governs
   pictures and palettes as much as prose.
5. **No link ever 404s.** A narrowed edition renders excluded pages as
   placeholders pointing at the domain that carries them.
6. **One body face per palette.** Two are in use: Georgia (the default,
   starquest, pets) and Palatino (fellowship, church-space, sepia). A third
   would be a decision, not a tweak.

---

## How to read a profile

Each one answers the same seven questions, in the same order. **Arrives**: how
this reader got here and what they already know. **Wants**: what they came for.
**Loses them**: what makes them close the tab — the most useful line, and the
one that decides most of the rest. **Posture, palette, voice**: what the build
does about it. **Never**: the thing this edition specifically must not do.

Page counts are *pages that render as themselves* rather than as an
`excluded.njk` placeholder, out of 638 built — measured 2026-08-21 against a
build of each edition with its registry filters applied. They include the
navigational shell every edition carries, so they are larger than the
"indexable pages" figures recorded in `lib/editions.js` on 2026-08-20, which
counted a narrower thing. Both go stale; re-measure rather than cite.

---

## `default` — fianilchruinne.com (and GitHub Pages)

**638 of 638 pages, less 20 private-thread placeholders. Theme `default`
(deep blue/indigo, Georgia). Posture `story`. No filters.**

**Arrives** by the work's own name, or from anything that links the project as
a whole. Increasingly this is somebody who was sent here from one of the other
six and wants to know what the whole thing is.

**Wants** the record entire, and proof that there is one. This is the domain
that answers "is this a coherent world or six marketing sites?"

**Loses them** by looking like a portal. If the front page reads as a
disambiguation page for the other domains, the reader concludes there is no
centre and leaves for whichever door looked most specific.

**Also wants**, since 14 September 2026 (Dermot's direction,
`intake-2026-09-14.md`, tier-wide and shared with sciencefiction.site): the
middle of a working life on the page — mid-life crisis and the career
questions beside it, carried by the middle-aged body the ladder already puts
in this tier's room, written as scenes in the register of duty and memory
and never as a diagnosis. The general reader is the one who recognises the
posting that stopped meaning what it did.

**Posture** `story` — the site's default and, historically, its only one. The
72ch measure, 18px root and 1.7 leading are what every other mode is a
departure from.

**Palette** the house dark: `#0d0f1a` page, `#7c9ef5` accent, `#ffd54f` for
canon facts. The only palette designed first rather than derived, and the one
the others are recognisably variations of.

**Voice** the neutral register — the forty-seconds-wrong tagline in its
unmodified form, naming the Five Layers, the Grand Ensemble Multiverse and the
Star Rangers without pitching any of them. **Cast:** Tissadelle, Aldera, Iona,
Galahad, Rook, Syra — the arc's protagonist first, which she was not until
2026-08-21. She replaced Elvira, who has no portrait and was therefore being
dropped from the slideshow, so the domain that holds everything was showing
five slides and missing the one person the main sequence is about.
Sound: Celtic ambient.

**Never** narrow it. It holds everything, which is what lets every other
edition be a subset of something rather than a fragment of nothing. The one
standing exception is the church-space thread, gated to the contemplative
tier while this edition sits at the general one — the twenty placeholders
above are that, working as designed.

---

## `sciencefiction` — sciencefiction.site

**114 pages. Theme `default`. Posture `story`. Threads: founding-era,
tissadelle-arc.**

**Arrives** looking for science fiction, generically — the domain name is the
genre. Least likely of the seven to know anything about this world in advance.

**Wants** a good story in a setting that holds together. Cares about the
premise, not the archive.

**Loses them** with apparatus. A first-time reader who lands on a glossary
entry about the Cosmic Cascade before they have met anyone has been given the
appendix instead of the book. The general tier's narrowing does most of this
work already by keeping the contemplative and specialist threads off the
domain.

**Posture** `story`. Identical to the default edition's, deliberately: this
reader is doing exactly what the default reader is doing, with less of the
record around them.

**Palette and voice** the house dark and the unmodified tagline — this edition
registers no copy overrides at all, so it looks like the canonical site and
carries a subset of it. That is the correct relationship: it is the front door
to the main sequence, not a different building.

**Cast** (its own since 2026-08-21): Tissadelle, Galahad, Rook, Aldera, Syra,
Wender — deliberately not the default six. This domain fronts the founding era
and the Tissadelle arc specifically, so Galahad and Tissadelle lead on ten
chapters each, and **Wender is here where the canonical domain has Iona**: the
Chief Pilot who becomes High Captain is a founding-era face, and the domain that
holds everything can afford to be even-handed where this one should not be.

Until that day the domain carried **no character page at all** — characters are
matched by id or tag and never by season the way chapters are, so narrowing by
thread shipped every chapter and dropped all 74 of the people in them. Dermot's
ruling was to give the edition a `characters: [...]` list of every POV id its
own seasons use: **114 shown pages → 244**, 0 character pages → 16.

**Never** let this be the domain that fixes a missing general-tier thread by
accident. `THREADS` cannot express "everything except", so every future
general-tier thread has to be added by hand when it is registered, or it
silently will not ship here. *Since 3 September 2026 the place to add it is
`GENERAL_TIER` in `lib/editions.js`, once — this entry and both contemplative
families inherit it by construction (see "The tier ladder" at the end of this
file).*

---

## `starquest` — starquest.site

**71 pages. Theme `starquest` (near-black, cyan `#35e0c9`). Posture `story`.
Thread: orbital-five-o. Brand: Orbital Five-O.**

**Arrives** for the procedural: a task force, a jurisdiction, cases. The
young-adult tier.

**Wants** pace. Something happens, someone is responsible, the boundary is
somebody's beat.

**Loses them** by slowing down to explain. This is the one edition where the
lore apparatus is most at risk of reading as homework, and the palette is doing
a promise the prose has to keep.

**Posture** `story`, and this is the deliberate case of a tier *not* getting a
mode of its own. Young-adult and general readers are doing the same thing with
their hands; the difference is register and complexity, which live in the prose
and the length targets, not in the measure. If Five-O ever grows a genuinely
different reading behaviour — a case-file index, say, browsed rather than read —
that is when it earns `archive` or something new, and not before.

**Palette** the most saturated on the site: `#060714` page, cyan accent at
12:1, amber canon facts. It reads as instrumentation, which is the point.

**Voice** the only tagline that is a hook rather than a description — *"forty
seconds of drift, eleven years unexplained… that's not a rounding error, it's a
warning."* Sound: sci-fi ambient.

**Cast** (its own since 2026-08-21): Larsen, Albercombe, Voss, Calloway, Jeeves
— a jurisdiction seen top to bottom, which is what the procedural is actually
about. Larsen leads because the task force is the show; Jeeves is last because
the joke lands better once the hierarchy has been established. These five are
also the entire pool this domain carries with a portrait, which is luck rather
than design, and it is the right five regardless. *Since 3 September 2026 the
thread is to gain a young viewpoint — a raw Deputy or trainee inside the task
force, the reader's proxy (Dermot's ruling, `intake-2026-09-03.md`); when that
character exists and has a portrait, they belong in this cast, probably
second, between the commander and the hierarchy.*

**Never** let the palette write cheques the tone rule will not honour. Neon and
procedural pace can slide toward threat; unsettling, never horror, holds here
exactly as elsewhere.

---

## `young-star-rangers` — young.fianilchruinne.com

**Registered 3 September 2026; first chapter *Nothing to Report* (S09E01C01)
13 September 2026; live at young.fianilchruinne.com since 7 September 2026. Theme `starquest` for now. Posture `story`. Threads: the young-adult floor
(undercover-pets, orbital-five-o) plus young-star-rangers. Brand: Young Star
Rangers.**

**Arrives** wanting to be a Star Ranger, or to read about someone their own
age becoming one. The young-adult tier's second reader: not the procedural's,
but the Corps'.

**Wants** the first posting — a kit list, a corridor, a Field Officer who has
seen it all before, and a year in which the rank starts to mean what people
think it means. Pace as Five-O's; the difference is that the reader is inside
the service.

**Loses them** the same way Five-O does — by slowing down to explain — and one
more way: by making the Deputy a chosen one. The Corps hands its rawest
Deputies to Zoe Smith because they are raw, not because they are special, and
the reader's proxy has to stay one of fourteen.

**Also wants**, since 14 September 2026 (Dermot's direction,
`intake-2026-09-14.md`, tier-wide and shared with starquest): the
awkwardness, flirting, signalling and misread cues between younger
characters, written with the signal and its reading both on the page. The
Deputy's year is also the year of getting that wrong, and the tier is where
the record says so.

**Posture** `story`, shared with starquest for the reason given there.

**Palette** borrowed from starquest; the first chapter now exists, so a face of
its own is design work behind the contrast gate, and open.

**Cast** Zoe Smith, alone, until the Deputy exists — and then the Deputy
first, because this site is theirs. The Deputy exists in the thread since 13
September 2026 (Iklix Varn, *Nothing to Report*), and cast first the same
evening at Dermot's *Recommendations accepted* — `heroCharacterIds` is Varn,
then Smith. Cadet Shepherd may
guest (2826 lines up) but is not cast: her page carries her whole arc.

**Reading Plan** its own since 13 September 2026 (Dermot's decision,
`intake-2026-09-13.md`): the Corps' register, because Sen's note named a
spine the edition does not carry and its link fell back to a pets chapter. It
started on Orbital Five-O for the hours Season 9 had no chapter and starts on
*Nothing to Report* since the same evening. The same day six of
the Corps' own lore pages — the founding, the chain of command, rank and
uniform, the Academy, decision doctrine, proverbs — were tagged for the
thread, so the reader inside the service has the Corps' shelf.

**Never** put the thread on starquest.site: that domain is a procedural's
brand, and a Corps story under it would read as a spin-off of the wrong show.
The general tier carries both by construction, which is where a reader who
wants both goes.

---

## `the-told` — told.fianilchruinne.com

**Registered 7 September 2026 at Dermot's ruling *new subdomain edition*,
named the same day at his *door's name is told*; live the same afternoon.
Theme `pets` for now. Posture `primer`. Threads: the children's floor
(undercover-pets) plus below-the-roof. Brand: The Told — the door is named
for the people; the thread is *Below the Roof* (ruled 8 September 2026,
*Shape (b) agreed*). The season is complete as of 8 September: eight
chapters in two strands, Episode 1 the deep side (five) and Episode 2 the
survey side (three), converging on one act, two records.**

**Arrives** the same age as the pets reader, or is read to at the same age —
and wants a different thing: not a case, but a people. The child who would
rather be under the roof with the Told than at the bureau with the badge.

**Wants** the warm dark. Short scenes, plain words, a world that is strange in
its facts (a roof that is the surface, a record kept by saying it) and never
strange in its feelings; the pleasure of knowing something the up-people do
not, which is the thread's whole engine.

**Loses them** by explaining the survey. The up-people are strangers who do
not look up and do not ask, and the reader must never be told what they are
thinking — the moment a chapter steps above the margin to make the survey
sensible, the child is reading the wrong book. The survey-side strand, when it
exists, is read the same way from its own side.

**Posture** `primer`, shared with the pets edition for the reason given there:
completability.

**Palette** borrowed from the pets edition; a face of its own is design work
behind the contrast gate. The theme audio is the
sci-fi ambient track rather than the agency's ukulele, and a brief of its own
is open in `music-prompts.md`.

**Cast** Teddy, since his portrait was filed 7 September (#732). Stone-First
and the survey side wait on portraits. *(Earlier text, kept for the reason:)*
nobody yet — the three Told with pages have no portrait, and the
validator refuses a cast it cannot render, so the homepage uses the static
hero. Teddy first, when his portrait is filed; then Stone-First.

**Never** put the thread on undercover-pets.com: that door is the agency's
face, and a teddy bear beside the badge is not that edition. The general tier
carries both by construction, which is where a reader who wants both goes.

---

## `pets` — undercover-pets.com

**109 pages. Theme `pets` (cream `#fdf6ec`, rust `#a34726`). Posture `primer`.
Thread: undercover-pets. Topic: undercover-pets.com. Brand: Undercover Pets
Detective Agency.**

**Arrives** as a child, or as an adult reading to one. The only edition with a
second reader in the room.

**Wants** to finish a block and click the next one. The tier note's word for
what this domain optimises is **completability**, and it is the whole design.

**Loses them** with a wall of text, a line too long to track, or a button too
small for a thumb on a tablet. Losing this reader takes one paragraph, and they
do not come back to check whether it got easier.

**Posture** `primer`, and the one edition where the mode is doing accessibility
work rather than atmosphere: 20px root, ~58ch measure (nine or ten words a
line, which is where a developing reader stops losing their place), 1.75
leading, more air between paragraphs, and POV buttons padded to a real tap
target. The measure is the load-bearing value.

**Palette** warm and light, and — until 2026-08-21 — the worst contrast on the
site: the old coral accent measured **2.32:1** on badges against a 4.5 floor,
on the domain where legibility matters most and the last one anyone would have
checked. Now rust `#a34726` at 4.66:1 or better everywhere, with a darker
hover. It reads slightly deeper than the old coral and still warm.

**Voice** its own since 2026-09-01, and measured. Until then this domain
fronted a lightly reworded copy of the adult tagline (this note said
"unmodified"; `lib/editions.js` disagreed, and both were adult register
either way) — the station clock, the Five Layers, "multiple Concordants", at
Flesch-Kincaid grade 14 with thirty-word sentences, naming no animal, and its
only link going to a glossary page this edition's filter excludes. The tier's
own prose, Season 2's pet-POV blocks, measures at **grade 7.2** and sixteen
words a sentence; the new tagline reads at grade 6.3. The same measurement
found every other door harder than the room: the Reading Plan at 9.9 (and
opening on "Start with the spine"), the season intro at 12.1, the thread page
at 14.4. So this edition is also the first to carry a **`readingPlan`** in
`lib/editions.js` — a plain-register "Where to Start" that replaces Sen's note
on `/start/`, reading at grade 5.3, opening on S02E01C01, and listing only the
shelves this build carries (no lore, no atlas). Sen's note stays everywhere
else: its register is irony, which is the one thing a developing reader
cannot parse. The season, episode and thread intros followed the same day at
Dermot's direction (grade 5.8–7.6, every fact and link kept) — they are content
pages shown on every domain, and the main site reads them too; the season
intro's aside to the adult in the room stays, in plainer words. The
Characters page hero is Dermot's own *Rock Hyrax on the Coffee Machine* via
`sectionHeroes` (same day) — the only domain with one; the rest still show the
pending card. Its "Not included" placeholder is plain register with no link to
the adult site (`excludedNotice`, 2 September) — a child cannot judge that
link, so the page says it is not here and points back to the story. Same day,
the scene-POV rule was fixed so an animal's "View from" page is real here (all
57 had been placeholders), and Aldera and Sorcha joined the domain's cast by
tag; the Season 1 companions and the Five-O cast stay out by Dermot's choice.
**Season 1 itself came off the domain on 13 September 2026** (Dermot's
decision, `intake-2026-09-13.md`): ten Season 1 chapters had carried the pets
tag and rendered here under a *Tissadelle Shepherd's Arc* heading above
Season 2, in the general register; the tag came off, so the domain's Seasons
page is Season 2 alone, opened by a plain-register intro of its own
(`seasonsIntro`). The same day the header stopped listing Lore and Atlas here,
which were empty, and the Reading Plan's *More stories* line was reworded to
say the other stories are on the grown-ups' site (it no longer renders here
in any case, there being no other chapters to list).
**The About page became the tier's own on 14 September 2026** (Dermot's
decisions, `intake-2026-09-14.md`): until then the domain served the adult
About verbatim — job title, build tooling, fan-fiction policy and a live link
to the comments board this tier had switched off — and offered a parent or
teacher no way to reach the author. Now `about` on `CHILDREN_TIER` in
`lib/editions.js` (so The Told serves the same page) gives four plain
paragraphs for the child and a *For grown-ups* block naming the discussion
board and two Grok safari games. Not a redirect, by his ruling.
**The glossary follows the links since 5 October 2026** (Dermot's choice,
`intake-2026-10-05.md`): asked whether almost all glossary entries should
reach this edition, he chose the reachability rule on `CHILDREN_TIER` — an
entry joins when a page the tier carries links it and it carries a `plain:`
line — over opening all 83, whose index would have been eighty adult-register
`short`s the pets prose never leads to. Five entries here now (Smart Pet,
Cyborg, Plural Minds, UCSD, Boundary Zone), and the index shows their `plain:`
lines under a plain intro, not the `short`s; `check-children-glossary.js` is
the gate.
**The Timeline left the domain the same evening** (Dermot's ruling,
*Option 1 now*, same intake): its two events were Season 1's, carried by a
tag that had outlived Season 1's removal, with the failed ritual and the
Obliger in one summary and every onward link but two a placeholder. The
tag came off both; the shelf is empty here and the header, card and
Reading Plan hide it. **Season 2's own entries followed the same evening**
(his *Recommendations approved* on the proposal): five, each on a public
document of the pets year and holding only what the chapters' canon facts
fix, each with a `plain:` line the index shows in place of `summary` under
a plain intro, grade 4.6 to 7.1. The Timeline is back in the header.
**Cast:** Barsik, Bubochka, the Eden warden,
Nessa, Rasa Oyelaran — unchanged on 2026-08-21 when every other edition got one,
because this was the only edition that had ever had a cast of its own and it is
already right: three animals, the habitat's AI, and the one adult who outranks
everybody. Sound: playful ukulele.

**Never** file a child-facing page that depends on an adult block to make
sense. A child reading only the pet POVs must be able to follow what happened —
which is also just "each POV withholds what the others supply" doing its job.

---

## `fellowship` — fellowshipoflight.org

**77 pages. Theme `fellowship` (parchment, Palatino, gold `#7a5a0c`). Posture
`contemplative`. Thread: church-space (contemplative-tier, carried). Topics:
fellowship-of-light, arilon. Ranks for its family. Brand: Fellowship of Light.**

**Arrives** having been told this is the quiet one, or by the order's name.
Contemplative tier.

**Wants** to sit with a page. Reading speed is not a virtue here and length is
earned by reflective work — this is the 800–1,200-word band.

**Loses them** with clutter and urgency. Anything that reads as a call to
action, a badge, or a thing competing for attention breaks the register this
edition exists to hold.

**Also wants**, since 14 September 2026 (Dermot's direction,
`intake-2026-09-14.md`, tier-wide and shared with the other contemplative
editions): legacy and the meaning of life on the page — what survives after
death, and what it all means — carried by the oldest body in the room and
the cast in their later years, with the Archive's narrow mechanism and the
traditions' wider claim both present and neither ruled on. The
contemplative reader is the one who has already asked the question and is
not here to be given the answer.

**Posture** `contemplative`: the slowest setting on the site. 19px root, 1.9
leading — the longest on any edition — a 62ch measure, wide paragraph spacing,
and **titles in the body colour rather than the accent**, so nothing on the
page is shouting. The accent is left to do only what accents must: links,
focus, the POV rail.

**Palette** parchment and gold with a blue used for canon facts. Palatino,
shared with church-space and sepia: the reading-for-its-own-sake face.

**Voice** the tagline that reaches furthest back — *"long before any charter
named them Rangers, an older order kept vigil at boundaries like this one"* —
and the only one that recasts the corps as inheritors rather than protagonists.
Sound: orchestral fantasy.

**Cast:** Asteria and Brother Fintan — two portraits, the calmest crossfade on
the site. Both are Rangers who finished a career and traded it for a
contemplative one, from two different orders, which states the tier's whole
theme without a caption. They are also the only two characters this domain
carries with a portrait. Asteria alone would be the identity-purist choice, she
being the Fellowship's own Sage where Fintan keeps a Communion house; this entry
is "the order entire" and carries the contemplative thread whole, so it holds
both.

**Never** narrow this domain. It ranks for its family, and the invariant is
that a ranking domain must include every page its siblings include, or a
sibling's canonical points at a placeholder and the page leaves the index
entirely. Narrow the siblings; never the one that ranks.

---

## `fellowship-archive` — fellowshipoflight.site

**60 pages. Theme `fellowship`. Posture `archive`. No threads. Topics:
fellowship-of-light, arilon. Ranks at fellowshipoflight.org. Brand: The
Comparative Archive.**

**Arrives** looking for a document — often from a link, a search for a specific
term, or a cross-reference in another entry. Knows the world; wants a page of it.

**Wants** to find the thing, then read around it. Arrival is likely to be
mid-archive rather than at the front door.

**Loses them** with ceremony. A landing page that withholds the index for the
sake of atmosphere is a reference site refusing to be referred to.

**Posture** `archive`, and **the edition that forced presentation to become its
own axis**: same palette as its ranking sibling, opposite posture. 17px root,
1.6 leading, a 78ch measure — the widest on the site, because reference prose
is scanned in a way narrative prose is not — a tighter paragraph gap, a shorter
hero, and a homepage that opens **left-aligned**, like a desk rather than a
poster. Everything below the hero on every other page is already left-aligned;
this is the front page falling into line.

**Palette** identical to `fellowship`, on purpose. Two faces of one institution
should look like one institution.

**Voice** the only tagline that describes a *filing* rather than a story —
independent accounts of one thing, filed under Arilon because no tradition can
be credited with them, each valid for the hand that wrote it and none of it the
last word. That sentence is the Codex's own canon status said in front-of-house
language, which is what makes this edition honest.

**Cast:** Asteria, alone and still. One slide is not a degraded slideshow here —
`main.css`'s `:first-child` rule renders it as a plain portrait — and a file of
documents does not need a parade. She is also the only character this filter
carries with an image.

**Never** let it carry a page the central site does not. A codex site is a
filtered view of the central codex; the moment it has an entry of its own, this
is per-domain canon by another route, which is exactly the failure
`CUSTOM_LORE_FILE` was deprecated for.

---

## `church-space` — church-space.site

**63 pages. Theme `church-space` (candlelit stone, deep red `#7a1f2b`,
Palatino). Posture `contemplative`. Thread: church-space (contemplative-tier). Topics:
communion-of-the-called, cnoc-na-mbeach. Brand: The Communion of the Called.**

**Arrives** knowing this is the devotional layer, and usually having been given
the address rather than having found it. The tier gate means this thread
exists only on the contemplative editions; nobody arrives by accident.

**Wants** the overlay read as an overlay — a declared reading of the same
events, not a competing record.

**Loses them** in either direction, and this edition is the one that can fail
two ways. Too neutral and the reading has no register of its own; too devout
and it starts to read as the story asserting a cosmology it deliberately does
not assert.

**Posture** `contemplative`, shared with `fellowship`. The night-office
chapters of Season 8 are what the mode's leading and measure were set against.

**Palette** the darkest accent on any light theme — `#7a1f2b` at 9:1 — against
candlelit parchment. Stone and stained glass rather than warmth.

**Voice** the tagline that names the institution's whole distinctive claim in
one clause: *a High Captain and a Cadet sit in the same station chapel on the
same footing, because its only qualification for belonging is showing up.*
Sound: the Rotational Hum — the one m4a among five wav files, and the model for
new audio.

**Cast:** Brother Fintan, alone and still — the Communion's own keeper, and the
most this front page should say. He is also the only character this domain
carries with a portrait; the two facts agreeing is luck, but the answer would be
the same with a larger pool. Worth knowing before anyone reuses it: his image is
a designed title card rather than a photographic portrait, so this hero reads
more like a codex card than the others do.

**Never** let the overlay become load-bearing. Its chapters carry no
`canon_facts`, establish nothing, and the main story must never come to depend
on them. Presentation may make a devotional reading beautiful; it may not make
it binding.

---

## The modes, in numbers

Every value below is a custom property in `src/css/main.css`. A mode that is not
listed for a token inherits the `story` value.

| Token | `story` | `primer` | `archive` | `contemplative` | What it does |
|---|---|---|---|---|---|
| `--font-size-root` | 18px | 20px | 17px | 19px | Everything else is in `rem`, so this is the whole UI scale |
| `--font-size-root-sm` | 16px | 17px | 16px | 16px | Same at ≤640px |
| `--line-height-prose` | 1.7 | 1.75 | 1.6 | 1.9 | |
| `--max-prose` | 72ch | 58ch | 78ch | 62ch | The measure — the value that most decides how a page feels |
| `--measure-ui` | 70ch | 60ch | 76ch | 62ch | Intros and section descriptions |
| `--prose-gap` | 1rem | 1.15rem | 0.85rem | 1.3rem | Space between paragraphs |
| `--hero-height` | 320px | 280px | 200px | 260px | Hero image and slideshow |
| `--color-title` | accent | accent | accent | body text | Quiet headings, contemplative only |

Three structural rules exist because no property could carry them: `primer` pads
the POV buttons to a finger-sized target (padding is in px and would not scale
with the root size), `archive` left-aligns the homepage hero, and (5 October
2026) the chapter's *From the Archive* aside sits beside the prose in a margin
column in `archive` and `contemplative` at the wide breakpoint and under it in
`story` and `primer` — placement is not a value a token holds, and the posture
that reads a story straight through is the one that meets the Archive under the
text.

**Adding a mode is a design decision, not configuration.** It has to be a
posture no existing mode serves, and it costs a block in main.css that all nine
palettes then carry. Wanting a domain to *feel* different is what the palette
and the copy are for.

---

## What is measured, and what is not

Measured, and re-measurable: contrast (`scripts/check-contrast.js`), pages
served per edition (build each edition with its filters and count placeholders),
POV-block word counts against the tier bands, image dimensions
(`validate-content.js`).

Not measured, and this is the honest limit of a style guide: whether a page
*feels* like the institution it claims to be, whether a tagline earns its
sentence, whether a palette is doing the tone rule's work or quietly undoing it.
Those stay judgement, which is why edition copy and new imagery are proposals
for Dermot rather than merges.

---

## Open

Added to `open-questions.md` in the same pass.

- ~~**A reader-side presentation switcher.**~~ **Built 21 August 2026.** The
  header carries a "Reading" control offering this domain's own setting plus the
  other three modes; the choice is one `localStorage` key, client-local and
  per-origin, and it is gone entirely without JS. What it changed here: the modes
  now carry **two names each** — an engine name that says what a mode is *for*
  (`primer`, and it is for the children's tier) and a reader-facing label that
  says only what it *does* (**Large print**). A reader is choosing a type size,
  not declaring an allegiance to another edition, and offering them
  "Contemplative" on the general-tier domain would have asked them to do the
  second in order to get the first. Reader labels: Standard, Large print,
  Compact, Spacious.
- **`starquest` has no mode of its own**, on the argument above that a tier is
  not a posture. Worth revisiting if the Five-O material grows an index-like
  reading behaviour.
- ~~**Five of seven editions ship the default hero cast.**~~ **Cast per edition,
  21 August 2026** — and the measurement that came with it was worse than the
  question implied. The default cast is filtered out on every narrowed domain, so
  **five of seven editions were rendering no slideshow at all**, falling back to
  the static hero image. Six of seven now show a real one, and
  `validate-content.js` fails the build on a cast an edition cannot render.
  The one that could not be fixed with a cast — **sciencefiction carried no
  character page at all** — was ruled the same day: it gets a `characters: [...]`
  list of every POV id its own seasons use, so all seven editions now render a
  hero. What is left is the structural version of that fix (tag character pages
  with their thread ids and no edition needs a list at all) and two POV ids that
  look like drift; both are in `open-questions.md`.
- **`solarized` fails the contrast floor on eleven pairs** and is exempt as a
  faithful reproduction. It stays safe only while no edition ships it; that is a
  standing condition, not a one-off.
- **No edition sets a `light`, `sepia` or `high-contrast` palette**, so those
  three exist only for someone hosting independently. Whether a reader should be
  able to reach them is the same question as the switcher above.

---

## The tier ladder — 3 September 2026

Dermot's direction, verbatim: *"the child reader tier is visible from the young
adult tier, both are visible from the general reader tier and all are visible
from the contemplative edition which may have additional POV scenes for any
chapter."* All four readings in `intake-2026-09-03.md` confirmed the same day,
and the canonical site placed at the general tier.

**The tiers nest.** Each reading edition carries everything the tier below it
carries, plus its own material: children ⊂ young adult ⊂ general ⊂
contemplative. `lib/editions.js` defines each tier once (`CHILDREN_TIER`,
`YOUNG_ADULT_TIER`, `GENERAL_TIER`, `CONTEMPLATIVE_TIER`) and spreads it into
the entries; `validateEditions` asserts the chain and refuses an entry that
narrows below its tier. So the page counts in the profile headers above are
history: measured on the day, content pages the filter includes (before the
relatedUrls fallback and index pages) went **pets 47 (unchanged) · starquest
16 → 53 · sciencefiction 64 → 102 · fellowship 27 → 126 · church-space 12 →
114**. The archive codex site is a shelf, not a reading edition, and stands
outside the ladder by design at its own 15.

**What it changes for each profile.** The young-adult reader now also has the
pet story on their site; the general reader has all four public threads and
the pet and Five-O casts; the two contemplative readers have the whole main
sequence and Season 8. The canonical site is unfiltered and at the general
tier: its tier is what hides the church-space thread, so the contemplative
editions are the only complete view, and that is intended.

**The overlay rule.** A contemplative-tier POV scene may be added to any
chapter of any thread and renders only on contemplative builds — an overlay
the tiers below never see (`::: pov <id> tier=contemplative`, gated by the
build's edition tier in `lib/markdown-containers.js`, mirrored by `tier:` on
the `povs:` entry so the buttons follow). The
children's self-containment rule climbs the ladder with it: every tier's
reading of a chapter must be complete without the blocks the tier above adds.

**Still open** (indexed in `open-questions.md`): re-hanging the doors — hero
casts and the pets `readingPlan` were chosen against narrow page sets, and the
widened editions may want different ones. Framing, and Dermot's taste each
time.
