# Music prompts — generation and provenance

The prompt-of-record for every generated or commissioned piece of audio in the
repo, and the house sonic signature they all share. Kept in `story-bible/` so it
ships with the repo but stays outside `src/` and is never published to the site.
Planning note; not rendered.

**Why this file exists.** `src/audio/` already holds five files — four site theme
tracks and one in-universe recording — and **not one of them has a prompt
recorded anywhere.** That is precisely the failure `image-prompts.md` was written
to stop happening twice, and it had already happened again in a medium nobody was
watching. When a theme track needs regenerating at a different length, or a
codex recording needs a second take, there is currently nothing to regenerate
*from*.

**Rule going forward, borrowed intact from `image-prompts.md`:** no generated
audio enters the repo without an entry here.

**Undecided items from this file are indexed in
[`open-questions.md`](open-questions.md)**, so they can be found without reading
this one.

---

## The five existing files: mark the absence, do not invent one

| File | Used by | Prompt |
|---|---|---|
| `celtic-theme.wav` | default edition, "Celtic ambient" | **unrecorded** |
| `fellowship-theme.wav` | Fellowship of Light, "Orchestral fantasy" | **unrecorded** |
| `starquest-theme.wav` | Orbital Five-O, "Sci-fi ambient" | **unrecorded** |
| `pets-theme.wav` | Undercover Pets, "Playful ukulele" | **unrecorded** |
| `ballad-of-the-stars.m4a` | `src/codex/ballad-of-the-stars.md` | **unrecorded** |

Tool, date, model and seed are unknown for all five. **Do not reconstruct a
prompt for them and file it as though it were the original** — the Prismere
cluster's reconstructions are labelled as reconstructions for exactly this
reason, and an invented provenance line is worse than a blank one because it
stops anyone looking further. The prompts below are **new briefs written from
canon**, not recoveries; a regeneration under one of them produces a *different*
track, and that is a decision for Dermot, not a maintenance job.

---

## What governs

### The target

The same line the images run on (`images.md`, 12 August 2026), which already
says *"for images and audio alike"*:

> **Enigmatic and haunting, with beauty, mystery, hope and serenity woven
> through.**

The audio corollary of *"if a prompt reads like a brief for a passport photograph
it fails this"* is: **if it reads like a brief for corporate background music, it
fails this.** Competent, inoffensive, texture-only ambience clears every
prohibition below and still misses the target entirely.

**Amended 20 August 2026, Dermot's direction: *beautiful, enigmatic, haunting,
dramatic*.** *Dramatic* is the new word, and it scopes the target rather than
contradicting it — **a footer loop and a film are different jobs.** The edition
themes below play under someone reading and must not compete with the prose;
holding drama back there is correct. A piece someone chose to play, gave three
minutes to and is listening *to* — an in-universe recording, a video score — is
the opposite case, and withholding there is not restraint, just quiet. So the
briefs split: the four theme tracks stay at the quiet end deliberately, and
everything else may build, arrive somewhere, and cost something.

The horror line does not move. Dramatic means stakes and shape, never shock —
still no stingers, no risers, no sub-drops used as threat.

Video carries the same direction and its own runbook:
[`video-prompts.md`](video-prompts.md).

### The tone line

Unsettling is fine, horror is not. In audio the line falls in a specific and
easily-crossed place: **no stingers, no risers, no sub-drops used as threat.**
Those are the throat machinery of the cyber-revenant portrait — they depict the
dark fact rather than hinting at it. A held note that will not resolve is the
approved version of the same instinct.

### The rung's register (22 September 2026)

Dermot named each reading tier's register on 22 September — *the child reader
tier should be interesting and playful, the young adult tier should be more
mysterious with a sense of exploration and adventure, the general tier should go
deeper, and the contemplative tier is allowed to question everything* — and a
theme track is the one place a tier's register is heard before it is read. So
each edition brief below is checked against its rung as well as against the
signature. Children (pets, the Told): interesting and playful, delight the
measure — the hum stays but nothing in the track is sad. Young adult (Five-O,
Young Star Rangers): mysterious, exploring — forward motion permitted, the
mystery an invitation and never a weight. General (the default): deeper — the
one theme that may carry the whole signature undiluted. Contemplative
(Fellowship, Church Space): allowed to question — the held note that will not
resolve is what a question left open sounds like, and it belongs at the top of
the ladder more than anywhere else. The ladder's invariant holds in audio too:
a higher rung's theme adds, and never contradicts, what a lower rung's said.

### The canon boundary

**Music is illustrative; the prose is canon** — the same rule the images carry.
A generated track is an impression of a recording the corpus describes, not a
specification of it, and where a track and an entry disagree **the entry wins and
the track stays**.

With one asymmetry that has no image equivalent:

**The codex entry is the lyric of record.** A song's words are already published,
attributed to a named in-universe author, inside a codex entry — which makes them
*valid-for-their-author* canon in a way an image's alt text is not. So:

- A generated vocal track sings **the published lyrics verbatim**. Generators
  cheerfully invent a bridge; that bridge does not enter the repo, and a take
  that mangles a confirmed line is a defect rather than a variation.
- **A new lyric is a codex draft, not a music prompt.** If a track needs words
  the corpus does not have, that is a new codex entry with an `author`, drafted
  and stopped for review, and the audio waits for it.
- Where an entry marks part of a lyric as **reconstructed scaffolding** (the
  *Ballad of the Stars* verses outside the confirmed chorus and second verse),
  the audio inherits the marking: generating those lines and shipping the result
  quietly promotes best-guess text to a recording the entry then has to be true
  about.

### Where a track may not be generated at all

- **External recordings.** `clan-avalons-anthem.md` and `aethelrock-tir-na-nog.md`
  are filed as *linked, not archived* — real work by a real band, referenced and
  not endorsed. Generating audio for either would fabricate a third party's
  recording and file it beside their name. Never.
- **The Krenyi.** `src/lore/krenyi.md` marks their distance from human music as
  *their* absence, not the archive's, and declines to claim they have no forms of
  their own. A "Krenyi theme" would answer, in a footer player, the one question
  that entry deliberately leaves open. Don't.
- **Anything the Corps commissioned** (added 30 September 2026, after the Music
  Corps page landed on 28 September). `src/lore/star-rangers-music-corps.md`
  says twice that the Corps commissions nothing and that the Music Corps has no
  repertoire; the anthem is Slipwave's and the hymn is nobody's, and that is the
  page's whole argument. So no *Star Rangers theme* in the sense of an official
  march, no Music Corps fanfare, no commissioning music. A site theme is site
  furniture and makes no such claim; a track *filed as the Corps' own* would.
- **Speech the record holds only in translation** (same day). The Told's words,
  the Ovruhn keeper's click-speech and the Spiralites' pulse-speech have no
  recorded form — `src/glossary/the-told.md` says so outright, and the other two
  pages render everything through the translation desk. A generated voice
  *speaking* as any of them invents the one thing the record has declined to
  invent. Their textures may be rendered (below, and labelled as renderings);
  their speech may not.

---

## The house sonic signature

Every edition's palette differs; the signature underneath does not. Same
arrangement as the stylesheets — `main.css` is the structure and a theme swaps
only the palette — and for the same reason: the domains are one work wearing
different front-of-house, and a listener moving between them should hear that
before they can say why.

Three anchors, all of them already canon, none invented for the music:

1. **The hum.** A habitat rotates and it is audible; unshielded systems leak it.
   Every track sits on a low sustained tone that was never played by anybody.
2. **The drift.** *Slipwave* is named for the pitch drift habitat musicians
   learned to compensate for when that hum reached the sound system
   (`src/glossary/slipwave.md`). So the house signature is a **slow, small,
   uncorrected detune** — a few cents, wandering, never fixed. It is the setting's
   own name for itself, and it is the single most useful instruction in this file.
3. **The forty seconds.** Threshold's clock runs slow and has for eleven years.
   Wherever a track carries a pulse, **the pulse arrives a fraction late and never
   catches up.** Not a stumble — a steady, patient wrongness that a listener
   notices only on the second pass.

### Shared preamble

Paste ahead of any edition prompt below.

> Instrumental. A low sustained rotational hum under everything, like a
> habitat's structure heard through a wall. Slow harmonic movement, long held
> tones, generous space between events. A small uncorrected pitch drift across
> sustained instruments, a few cents wandering and never resolving into tune.
> Where a pulse exists it sits a fraction behind the beat and stays there.
> Recorded-in-a-real-room quality, air and noise floor audible, nothing
> perfectly quantised. Restrained, patient, unhurried. Enigmatic and haunting,
> with beauty, mystery, hope and serenity in it.

### Shared negative

> No trailer risers, no braams, no impact stingers, no horror drones, no
> dissonant stabs. No big cinematic percussion, no EDM build or drop, no glossy
> pop mastering, no sidechain pumping. No spoken word, no vocal samples, no
> lyrics. No whale song. No sitar, no shakuhachi and no theremin used as
> shorthand for "alien" or "space".

### Using these in an app with short fields

`MyTunes`, Suno, Udio and the rest all take **short fields, not paragraphs**, and
they weight the front of a box heavily. So every brief below is split into six
lines, each one short enough to paste into a field on a phone:

| Field | What goes in it |
|---|---|
| **Style** | genre and form tags, comma-separated. The one field every app has. |
| **Mood** | three or four adjectives, no sentences. |
| **Instruments** | the palette, most important first. |
| **Production** | the house signature — this is where the hum, the detune and the late pulse live. |
| **Exclude** | negative tags, if the app has a box for them. |
| **Form** | length, instrumental or vocal, loop or not. |

**If the app has only one box**, paste **Style, Mood, Instruments, Production**
in that order, comma-separated, and drop the rest. The order matters more than
the wording: what is in front gets weighted, what runs past a couple of hundred
characters tends to get thinned out. **If it has no exclude box**, do not write
"no drums" into the style field — most generators read the word and give you
drums. Re-roll instead, or say the positive version (*"beatless"*, *"unmetered"*).

Two habits worth keeping whatever the tool:

- **Generate short and loop it**, rather than asking for three minutes. A 60–90 s
  loop that never lands wrong beats a three-minute track with one bad bar in it.
- **Keep the seed and the take number.** Every entry in this file has a slot for
  them, and re-rolling a good take you cannot find again is the most avoidable
  waste there is.

### Delivery

- **Loopable**, 90–150 s, no fade in or out, ending on a tone that can meet its
  own beginning. `base.njk` sets `loop`, so a track with a produced ending will
  audibly restart forever.
- **Quiet.** Around −18 LUFS, no limiting for loudness. It is a footer flourish
  under someone reading; a track that competes with the prose has failed
  regardless of how good it is.
- **`preload="none"`** is already set, which is what makes the current 4–8 MB
  WAVs survivable. Keep new tracks well under that — see *Practical notes*.

---

## Tools

**Current tool: MyTunes (MWM), and it is a reasonable place to start.** It takes
a description, a style and optional lyrics, which maps onto the six fields above
with nothing important lost, and it is fast enough to try five ideas in an
evening. Keep it for sketching.

**What it costs, in the two places that matter here:**

- **The wrapper is not the deliverable.** MyTunes hands back an mp4: one still
  image at 854×480 with a *Made With MyTunes* badge, which is where every
  container defect in `video-prompts.md` came from. **Extract the audio** and
  treat the card as a separate decision. Nothing that ships on a domain should
  carry another product's badge.
- **No stems, no section regeneration, no loop export.** Which is exactly what
  the two live jobs need — the four themes must loop seamlessly, and the two
  unrecorded songs have *published lyrics that are canon*, so one mangled line
  is a defect rather than a variation.

**Alternatives, keyed to the job rather than ranked:**

| Job | Tool | Why |
|---|---|---|
| The four edition themes | **Stable Audio** | Built for instrumental beds and loops rather than songs, exports MIDI as of 2.5, and ships clean commercial terms. The loop requirement is the whole spec here, and song-shaped generators give you an intro and an outro that will not meet. |
| *Half-Light Causeway*, *Protectors of the Fold* | **Udio** | **Inpainting** — regenerate one section without touching the rest, so a mangled canonical line is fixed in place instead of costing the take. Stems too. Also the cleanest licensing of the song generators: Universal, Warner, Merlin and Kobalt have signed with it. |
| Anything where terms matter more than polish | **ElevenLabs Music** | Clean commercial terms, quality a step behind the leaders. |
| Best raw quality | **Suno** | Strongest vocals and coherence, cheapest, and the least settled rights position — Sony and Universal litigation was still live in mid-2026. |

**Settled 20 August 2026, Dermot's direction: this music is for the live
domains.** That turns the last column of the table from a footnote into the
deciding one, and makes two things follow rather than remaining open:

- **Udio moves from conditional to recommended** for anything with published
  lyrics. Its inpainting is what protects a canon lyric line, and its licensing
  position — Universal, Warner, Merlin and Kobalt signed — is the strongest among
  the tools that can sing.
- **MyTunes stays the sketchpad and stops being the delivery path.** A consumer
  app's terms are the wrong ground to stand on for audio served from five
  domains, and its output arrives wrapped in another product's badge. Sketch
  there; finish elsewhere; publish the audio, not the wrapper.

**Why licensing is a real question here and not boilerplate.** The story content
is published under CC BY-NC-ND on several live domains, and this project is
unusually careful about who holds what — `CONTENT-LICENSE.md`, the code/content
split, the rule that a chartered work stays outside `src/` because its rights
holder is someone else. A track in a footer player on five domains is a
different exposure from a track on a phone. Not an argument against any tool;
an argument for choosing deliberately and writing down what was chosen.

**Whatever the tool:** m4a or mp3, around −18 LUFS, seamless loop for themes, and
an entry in this file with the prompt as typed.

---

## Ready prompts — site theme audio

One per edition, keyed to the `themeAudio.label` already registered in
`lib/editions.js`, because the label ships to the reader and a track that
contradicts it makes the site wrong in public.

### Default — "Celtic ambient" (`fianilchruinne.com`, GitHub Pages)

The full record's own theme, and the one every unlabelled clone falls back to.
The Celtic here is the **Celtic Union's** — old-world roots carried into vacuum
by people several centuries and many light years from the islands the tunes came
off. Not a tourist reel.

| Field | |
|---|---|
| **Style** | celtic ambient, modal drone, spacer folk, dorian, slow, spacious |
| **Mood** | enigmatic, haunting, patient, unresolved |
| **Instruments** | low whistle, wire-strung harp, bowed drone, sparse fiddle entering late |
| **Production** | low station hum under everything, few-cent detune, one figure stated three times and never developed, no cadence that closes |
| **Exclude** | jig, reel, bodhrán, step-dance tempo, pub session, drum kit, vocals |
| **Form** | instrumental, 90 s, seamless loop, no intro or outro |

Ancient instruments in a room that is plainly not on a planet.

### Fellowship of Light — "Orchestral fantasy"

The contemplative tier. **Vigil, not liturgy** — the church-space material is an
overlay, a lens laid across the record, and music that sounds like a rite makes
a claim the overlay itself declines to make. Reverent register, no doctrine.

| Field | |
|---|---|
| **Style** | slow orchestral, hymn-adjacent, sacred minimalism, unmetered |
| **Mood** | reverent, watchful, warm, patient |
| **Instruments** | divided strings, distant wordless choir, low organ drone |
| **Production** | one phrase passed between sections, each hand-off slightly out of tune with the last, station hum underneath |
| **Exclude** | triumphant brass, hero theme, timpani, epic trailer, plainchant, church bells, percussion |
| **Form** | instrumental, 90 s, seamless loop |

Someone keeping a watch through the night, not a ceremony being performed.

### Orbital Five-O — "Sci-fi ambient"

The young-adult tier and the procedural thread. The only edition allowed real
forward motion — its tagline is *racing to decide what's true* — and the one
place the Hawaii Five-0 echo in the brand name may be heard at all.

| Field | |
|---|---|
| **Style** | sci-fi ambient, procedural, two-chord vamp, minimal, mid-tempo |
| **Mood** | taut, alert, cool, forward-leaning |
| **Instruments** | analogue arpeggio, tremolo reverb guitar, upright bass, dry rim tick |
| **Production** | arpeggio runs the whole length without resolving, guitar states its hook once and leaves, tick sits a fraction behind the beat |
| **Exclude** | brass fanfare, surf rock kit, full drum groove, sixties pastiche, orchestral hit |
| **Form** | instrumental, 90 s, seamless loop |

The Five-0 echo is a nod; a nod held longer than a moment becomes a costume.

### Undercover Pets — "Playful ukulele"

**The exempt thread**, deliberately off house style: cute, cool and clever, and
weaving melancholy through it is a category error rather than a stylistic
variation. It keeps the hum, because it is the same universe and a station hum
under a ukulele is a joke worth making — but **the drift resolves here.** The
wobble bends and lands back in tune. It is the one edition where the thing that
is wrong everywhere else comes right, and that is the gag.

| Field | |
|---|---|
| **Style** | ukulele spy jazz, light swing, caper, small combo, major key |
| **Mood** | playful, clever, bright, unbothered |
| **Instruments** | ukulele, brushed kit, walking upright bass, glockenspiel, finger snaps, muted trumpet |
| **Production** | low station hum underneath played straight-faced, any pitch bend resolves cleanly back into tune |
| **Exclude** | melancholy, minor key, ambient pads, toy piano nursery, cartoon sound effects, animal noises |
| **Form** | instrumental, 90 s, seamless loop |

Clever, not infantile — and the wobble comes right, which is the gag.

### The Told — brief written 30 September 2026; label ruled *Cavern ambient* the same day

The children's tier's second door, `told.fianilchruinne.com`, has shipped with
the Five-O "Sci-fi ambient" file since 7 September, on the reasoning that a
cavern lit by fungus is closer to Threshold than to Eden's bureau and the
ukulele is the agency's. That was a placeholder and this is the brief.

Everything in it comes from the five *Below the Roof* chapters. The people keep
their whole record by saying it out loud, in the warm, and a telling gets
*shorter the second time* when it is getting true. The up-people's survey relay
is *the humming stone*, which the youngest carried through the squeeze against
their chest and felt *in their teeth* — so the house hum here is not a station's
structure heard through a wall but a small device asleep against a body, near
and even and warm. The rung is the children's, and the thread's own comedy
(nobody looked up) is gentle, so the register is playful and curious and never
sad. And the people listen to the ground: the signature's late pulse is water,
dripping a fraction behind where the ear expects it.

| Field | |
|---|---|
| **Style** | cavern ambient, warm, low, wet-stone resonance, slow, gentle, curious |
| **Mood** | warm, curious, safe, patient, a little funny |
| **Instruments** | soft mallets on stone, low wooden flute, water drips, a small even hum close by |
| **Production** | the hum small and near rather than vast, like a device asleep against a chest; drips land a fraction late; a short figure told twice and shorter the second time; damp close reverb, not a cathedral |
| **Exclude** | ukulele, cartoon, nursery toy piano, horror cave drone, bat squeaks, choir, synth pad, sub-drop |
| **Form** | instrumental, 90 s, seamless loop |

Somewhere warm under a great deal of cold rock, and nothing in it is afraid.

**The label is *Cavern ambient*** — Dermot's ruling, 30 September 2026,
verbatim *Cavern ambient for the Told*, from three shapes put (*Cavern
ambient*, *Warm stone*, keep sharing). `themeAudio.label` ships to the reader
on the player, so the label goes into `lib/editions.js` **with the file and not
before**: a new label over the borrowed Five-O file is the half-overridden
player the registry warns against, in reverse. Until the track is generated
and filed the edition keeps *Sci-fi ambient* / `starquest-theme.wav`, and the
entry's own comment says what it is waiting for.

### Young Star Rangers — keeps sharing Five-O's track (ruled 30 September 2026)

`young.fianilchruinne.com` reuses `starquest-theme.wav` under the same label,
as it reuses the starquest palette. The kinship is real and worth keeping
audible: Five-O picks the same Deputy up nine days later from the other side
of the ring. Two shapes were put — keep sharing, or a sibling track under the
same label — and **Dermot ruled *keep sharing for Young Star Rangers*** the
same day. Nothing to do; the two young-adult doors sound like one family. The
sibling brief stays below as a record of what was offered, and is **not
queued**.

| Field | |
|---|---|
| **Style** | sci-fi ambient, minimal, slow arpeggio, watch-keeping, spacious, mysterious |
| **Mood** | curious, alert, unproven, quietly expectant |
| **Instruments** | analogue arpeggio, soft electric piano, low sustained pad, one distant ping at long intervals |
| **Production** | the same arpeggio family as the Five-O theme but slower and an octave up, a chord that keeps almost resolving, the ping never on the beat, a ring station's hum underneath |
| **Exclude** | brass, drum groove, tension stinger, hero theme, orchestral hit, alarm |
| **Form** | instrumental, 90 s, seamless loop |

A hatch on Eden's ring that nobody looks at, and someone looking at it.

### Church Space — "Ambient drone"

**Settled 20 August 2026.** It fell through to the default's Celtic ambient,
which was never a decision — and the slot was filled by a supplied track rather
than a generated one: *Rotational Hum*, named for this file's own signature
term, registered as `rotational-hum.m4a`.

Two things it establishes for the next theme, both recorded in `lib/editions.js`
beside the entry:

- **m4a, not wav.** A third of the bytes for a decorative footer element.
- **A theme may be a piece rather than a loop.** This one runs 4:02 and builds,
  which the brief above tells a loop not to do. It survives because the player
  is click-to-play — `preload="none"`, a button, no autoplay — so nobody hears it
  who did not ask to. If the loop restart ever grates, the fix is a trimmed 90 s
  cut of the same recording, not a different track.

A brief, should this domain ever want a purpose-made theme instead: vigil rather
than liturgy, as the Fellowship entry above, but slower and with no melodic
content at all.

---

## Ready prompts — in-universe recordings

These are artifacts, not themes. The brief is not "what would sound good" but
**what would this recording actually sound like**, given who recorded it, on
what, and in what room — the audio form of asking whether a codex source could
have known this and would have written it this way.

**All four are draft-and-stop.** A recording attached to a codex entry is
publication-adjacent in a way a footer flourish is not.

### *Half-Light Causeway* — the Star Rangers Anthem

`src/codex/star-rangers-anthem.md` — lyrics published, **no recording exists.**
The entry says no studio master survives and that the text is reconstructed from
three carried copies. So there are legitimately **two takes**, and the difference
between them is the entry's whole point:

**Take A — the dock recording.** Slipwave as they were: three people, one room.

| Field | |
|---|---|
| **Style** | spacer folk, acoustic, live room recording, slow 3/4 |
| **Mood** | reluctant, intimate, unpolished, quietly hopeful |
| **Instruments** | female lead vocal, one acoustic guitar, sparse hand percussion, low whistle on the chorus only |
| **Production** | single microphone in a small room, room tone and chair noise audible, low structural hum throughout, slight pitch drift on sustained notes, vocal a shade ahead of the beat |
| **Exclude** | studio polish, reverb wash, string section, drum kit, backing vocals, autotune, double-tracked vocal |
| **Form** | vocal, lyrics as published, full song |

**Take B — the cadet muster.** The same song years later, sung by people who do
not know who wrote it.

| Field | |
|---|---|
| **Style** | a cappella group singing, field recording, communal |
| **Mood** | ragged, certain, unpolished, collective |
| **Instruments** | twenty untrained voices in unison, one octave, no instruments |
| **Production** | large hard-walled room, long natural reverb, recorded from inside the group rather than in front of it, chorus louder and surer than the verses |
| **Exclude** | choir arrangement, harmony parts, soloist, instruments, studio reverb, applause |
| **Form** | vocal, same lyrics and melody as Take A |

Lyrics verbatim from the entry. The chorus must sit inside a range a room full
of non-singers can hold — that is the in-world reason it spread, and a take
that soars is a take that would not have.

### *Ballad of the Stars*

`src/codex/ballad-of-the-stars.md` — **an audio file already exists**
(`ballad-of-the-stars.m4a`), and the entry's transcriber's note claims a
listener's capture at the 1:27 mark matches the chorus and second verse line for
line.

**So this one is constrained by a published claim about it.** Regenerating it
produces a recording whose confirmed lines land somewhere else, and the entry
becomes false about its own audio. **Prefer not to regenerate.** If a second take
is wanted anyway, the entry's note is part of the work and gets reviewed in the
same pass.

Brief, if that day comes — same session and same three musicians as Take A,
changed only where the register changes:

| Field | |
|---|---|
| **Style** | spacer folk ballad, slow, elegy, live room |
| **Mood** | grieving, tender, restrained, private |
| **Instruments** | female lead vocal, acoustic guitar, one bowed string, no percussion |
| **Production** | as Take A, closer to the microphone and quieter; sung to one person rather than to a room |
| **Exclude** | swell, key change, drums, choir, orchestration |
| **Form** | vocal, lyrics as published — confirmed lines only, scaffolding verses **not** sung |

The entry's own line for the register: *usually while a ship is overdue*.

### *Baby Universe*

`src/codex/baby-universe-ballad.md` — a video exists; the entry is explicit that
the recording circulates **unattributed, hand to hand**, with no credited
performer.

| Field | |
|---|---|
| **Style** | unaccompanied ballad, amateur capture, hand-to-hand recording |
| **Mood** | plain, aching, unresolved |
| **Instruments** | one voice; at most one quiet instrument |
| **Production** | recorded on whatever was to hand, imperfect intonation, audible room, a breath before the chorus, off-centre and unmixed |
| **Exclude** | production, mixing, reverb, harmony, backing track, studio vocal |
| **Form** | vocal, lyrics as published; **verses and chorus sung differently** |

**The arrangement must not smooth the pronoun shift.** The entry says the song
opens in the third person and slips into the first for the chorus, *"so that the
plea is sung in her voice by people who were never in a position to hear it"* —
and that the shift is the whole ballad. So the chorus is a different act of
singing from the verses: closer, thinner, one voice where the verses might have
had more. A take that performs both alike has removed the song.

### *Protectors of the Fold*

`src/codex/protectors-of-the-fold.md` — lyrics published, **no recording
exists.** Ashgrove's own account of why this one is clean: *"we finally had a
mixing booth instead of a dock common room."*

| Field | |
|---|---|
| **Style** | anthem, close harmony, studio folk-rock, mid-tempo, march-adjacent |
| **Mood** | declarative, confident, institutional, warm |
| **Instruments** | two male voices in close harmony, acoustic guitar, kit percussion, low sustained pad |
| **Production** | properly mic'd and separated, controlled plate reverb, steady tempo, unmistakable downbeat, **tuning true — no drift, no late pulse** |
| **Exclude** | room noise, single-mic capture, hum, detune, hesitancy |
| **Form** | vocal, lyrics as published, full song |

**The house signature is deliberately absent here** — no drift, no late pulse,
the tuning true. Its absence is the arrangement's argument: the glossary already
says this track's diction reads *closer to doctrine than dock-circuit folk*, and
losing the wobble is what that sounds like. Two musicians who have spent decades
playing memorials and musters, recorded properly for the first time, and
something has gone out of it that nobody involved would have named.

### *Hymn of the Thin Places* — added 30 September 2026

`src/codex/hymn-of-the-thin-places.md` — lyrics published, **no recording
exists, and the entry says no single archival master can.** Two things in it
decide the brief. The refrain is *"the one element every recorded variant holds
in common, word for word"*; the verses *"vary slightly by chapter and by
world"*, and the entry prints two — one as sung at the Threshold Station
memorial in 2830, one as sung at Cadet commissionings on Eden. And it is
*deliberately singable by a room that does not share one theology*: no organ,
no chapter's acoustics, nothing that makes it one tradition's. So, like the
anthem, there are legitimately **two takes, and each sings one verse.** A take
that sings both verses as a single song has manufactured the complete version
the entry says does not exist.

**Take A — the Threshold memorial, 2830.** A room of Rangers, not a choir.

| Field | |
|---|---|
| **Style** | unaccompanied congregational singing, memorial, slow, field recording |
| **Mood** | grave, steady, shared, unshowy |
| **Instruments** | one plain voice on the verse, a room of mixed untrained voices on the refrain, no instruments |
| **Production** | the verse carried by one voice and the refrain taken up by everyone, louder and surer than the verse; a large hard-walled station room, station hum audible in the gap before the refrain; slight drift on held notes; recorded from inside the room |
| **Exclude** | organ, choir arrangement, harmony parts, plainchant, church acoustics, soloist vibrato, applause, reverb wash |
| **Form** | vocal, the Threshold verse and the refrain as published, nothing else |

**Take B — a Cadet commissioning, Eden.** The Eden verse; a brighter room,
younger voices, more of them, the refrain identical to the note.

| Field | |
|---|---|
| **Style** | as Take A |
| **Mood** | steady, expectant, plain, collective |
| **Instruments** | as Take A; a larger and younger room |
| **Production** | as Take A; a hall rather than a station room, less hum, the refrain taken up faster because this room has sung it before |
| **Exclude** | as Take A, plus fanfare, drums, anything that makes it a ceremony's music rather than a room's |
| **Form** | vocal, the Eden verse and the refrain as published, nothing else |

The refrain has to sit in a range a room of non-singers can hold, for the same
in-world reason as the anthem's chorus, and here it is doubly the case: *"the
thin place doesn't ask what you believe"* is the line that lets a mixed room
sing at all, and a soaring setting would be a chapter's claim on it. Draft and
stop, as the other recordings.

### *Baby Universe* — Take B, the ferry slip

`src/codex/two-in-the-one-currach.md` adds a second way the ballad travels:
*"A boatman had it at the ferry slip, half under his breath, the way that song
is everywhere carried — not performed, exactly; kept lit."* Winter, a river, a
man who is not singing to anyone. Everything the main brief says about the
pronoun shift stands; here the shift is simpler to hold, because only the
chorus is fully voiced at all.

| Field | |
|---|---|
| **Style** | half-hummed, half-sung, unaccompanied, outdoor field recording, fragment |
| **Mood** | private, absent-minded, tender, cold |
| **Instruments** | one voice half under the breath; river, wind on water, rope, a boat against a slip |
| **Production** | recorded at a distance and not for recording; verses mostly hummed with a word surfacing here and there, the chorus the only part fully voiced and still quiet; no reverb, winter air |
| **Exclude** | performance, band, reverb, harmony, studio vocal, a listener |
| **Form** | vocal fragment, under a minute; every audible word verbatim from the published lyric |

Words that surface are the entry's; a generator that supplies its own where the
humming should be has written a verse, and that is the codex's job, not the
track's.

---

## Textures, not themes

Material for a scene, a trailer, or a future page — never a footer player, and
never filed as "the music of species X".

### The Undersong

`src/lore/undersong-belt.md` establishes structured, sustained harmonic bands
carried through rock, felt through the body, with excavation and tuning as one
act.

| Field | |
|---|---|
| **Style** | drone, sub-bass, stone resonance, unmetered, no melody |
| **Mood** | immense, patient, unhurried, alien |
| **Instruments** | bowed metal, struck stone resonance, sustained low partials — nothing plucked |
| **Production** | several harmonic centres coexisting without conflict, partials layered as if added in different centuries, felt more than heard |
| **Exclude** | melody, beat, rhythm, synth pad, whale song, choir, percussion hits |
| **Form** | instrumental, long, no development |

Two limits. It is **architecture rather than performance** — a burrow-cluster is
judged on how it sounds the way another people judge a façade, which is not the
same as a piece of music. And a human-audible rendering is **a translation and
should be labelled as one** if it is ever published, on the same footing as any
other adaptation in the record: attributed, dated, and never mistaken for the
thing itself.

### An Ovruhn recital — added 30 September 2026

`src/lore/ovruhn.md` and `src/codex/the-two-songs-of-the-loud-people.md`
establish chorus-keeping: the keeper speaks, the chorus confirms, corrects or
withholds, and *the account is whatever survives the room*; beneath it the
under-song, infrasound that *carries for tens of kilometres* through dense air
and bedrock; and, once in the keeping, a passage the chorus confirms *in full
unison*, which the translation desk notes is rare.

| Field | |
|---|---|
| **Style** | call and confirm, click rhythm, low chorus swell, infrasonic drone brought into hearing, unmetered, no melody |
| **Mood** | patient, fair, immense, faintly amused |
| **Instruments** | layered clicks (wood, tongue, stone), many low bowed voices moving as one, a felt sub tone; nothing plucked, no words |
| **Production** | one line of clicks answered by a broad low swell, the swell sometimes withheld; one passage where every low voice moves together; dense humid air, long low reverb as if through rock |
| **Exclude** | whale song, dolphin, throat singing, human voices with words, melody, horror drone, sub-drop |
| **Form** | instrumental, long, no development |

Three limits. **No words** — the keeper's speech exists only as the desk's
rendering (see *Where a track may not be generated*). The under-song is *felt
rather than heard by most species*, so an audible rendering is a translation
and is labelled as one, exactly as the Undersong above. And the shared negative's
*no whale song* is the prohibition most at risk here, because it is the
generator's first guess for a large body's low voice; re-roll rather than accept
it.

### The Sentinel signal — scene material, never the page's

`src/lore/planets/sentinel.md` and S03E01C01 give the record's whole
description: *a pulse under the pulse, a phrase that returned eleven seconds
later almost the same and not quite, the way a chorus comes back changed by
whatever happened in the verse*; consistent periodicity; drift to catalogue.
And the page's point is what it does **not** say: *musical structure is not
proof of intelligence behind it*, origin, intent and mechanism undetermined.

| Field | |
|---|---|
| **Style** | electromagnetic signal rendered as audio, pulse train, a phrase that returns changed, sparse, dry |
| **Mood** | patient, unfiled, quietly wrong |
| **Instruments** | one filtered pulse, a second slower pulse beneath it, nothing recognisable as an instrument or a voice |
| **Production** | an eleven-second cycle, each return almost the same and not quite; a slow drift across the whole; no reverb, direct to a headset, telemetry noise floor audible |
| **Exclude** | melody, synth lead, voice, morse code, sci-fi bleeps, alarm, theremin, whale song |
| **Form** | instrumental, 60–90 s; may loop, since the return is the point |

**Limit: this may score a scene or a reading of the Season 3 chapter and may
never be embedded on the Sentinel page or in the chapter as *the signal*.** A
track in the record would settle in a footer what the Survey Corps has not
settled in three centuries, and anything that sounds like an instrument or a
voice answers a question the page keeps open. The eleven seconds are the
entry's; keep them.

### The Carillon — the hum that names itself carefully

`src/lore/planets/corryn.md`: the gas giant's rings *emit a constant
low-frequency hum … that periodically resolves into complex recurring
patterns*; the name is chosen because *a carillon is a set of tuned bells, and
naming one says the sound has a pattern without claiming anyone is ringing it*;
and its apparent sentience *is a live question and stays one*.

| Field | |
|---|---|
| **Style** | planetary drone, low-frequency hum, slow recurring pattern, vast, unmetered |
| **Mood** | immense, indifferent, patterned, unresolved |
| **Instruments** | a low hum whose partials briefly align into a pattern and slide apart; no bells |
| **Production** | long stretches of plain hum, then a pattern resolving out of it and dissolving back; the pattern recurs but never in the same place; slow electrical crackle at the edges |
| **Exclude** | bells, chimes, carillon, church bells, voice, melody, sub-drop as threat, anything that addresses the listener |
| **Form** | instrumental, long |

**Bells are the name, not the sound** — a track with a bell in it has taken the
metaphor literally and made the claim the page refuses. And the page's last
section, the *sense of address* some people in the system report, belongs to
those people and *says nothing about the Carillon*: nothing in this track
turns toward the listener. That is the horror line in its Corryn form.

### Slipwave's cross-species arrangements — not yet

The cross-species translation methodology and the "Drift Engine" adaptive rig
appear in `intake-2026-07-26.md`, **not in published canon** — and parts of that
same block were explicitly overruled (the band never reformed). `slipwave.md`
says nothing about either. Treat it as unwritten: a prompt built on it would
render a fact the corpus has not established.

---

## Supplied reference tracks — 20 August 2026

Two finished tracks were supplied the day this file was written, both as
MyTunes-style mp4s (a still image held over the audio, 854×480). **Neither is in
the repo**, neither is attached to a page, and neither has a prompt recorded —
which is the exact condition this file exists to end, now arriving in real time
rather than in hindsight.

**What is needed to close them out:** the tool, the style prompt as typed, and
whether any lyric was supplied. Paste them into the entry stubs below and they
are done. Structures were measured from waveform and spectrogram renders, not
heard, so treat the section boundaries as approximate and the character notes as
inference.

### `InnerSpaceBloom_3.mp4`

3:25, beatless, slow-moving, low-centred, with a bright sustained upper band and
no strong transients anywhere — ambient rather than scored. Fullest and brightest
from about 2:00, with the peak around 2:30–2:50 and a low tail from 3:10. Card
art is a still with **garbled lettering** on it; see `video-prompts.md`.

- **Tool:** _needed_
- **Prompt:** _needed_
- **Lyrics:** none audible in the spectrogram; confirm

### `RotationalHum_1.mp4`

4:02, and structurally the more dramatic of the two — which makes it the first
supplied piece answering the *dramatic* direction rather than predating it.
Sectioned, with clean boundaries around 0:48, 1:36, 2:08 and 2:32; a **pulse
enters at about 0:48** where the first half had none; a thinning around
2:08–2:24; then the fullest, brightest and most sustained passage from 2:32 to
about 3:52, and a short tail. It arrives somewhere, which is precisely what the
theme loops are told not to do and what a piece someone sat down for is allowed
to.

**Its title is this file's own signature term** — the low sustained rotational
hum of anchor 1 — so the brief has already produced a track named after itself.
Worth noting for the record, and worth asking whether the piece is *about* that
or merely named for it; the answer decides whether it has a home in the record or
is a good ambient track that happens to share a word.

- **Tool:** _needed_
- **Prompt:** _needed_
- **Lyrics:** none audible; confirm

### Three more, supplied the same day

Same MyTunes still-over-audio wrapper, 854×480, and the filenames do not line up
with the cards, so identify them by content rather than by name:

| File | Length | Card says | What it is |
|---|---|---|---|
| `BalladoftheStars_3.mp4` | 4:02 | *we are Slipwave — Ballad of the Stars* | **The recording already in the repo**, re-wrapped |
| `StarRangers_3.mp4` (3:49) | 3:49 | *Star Rangers — The Ballad of the Stars* | A different, previously unseen recording |
| `StarRangers_3.mp4` (1:44) | 1:44 | *Star Rangers* | A third, unrelated recording |

**The first one is not new audio.** Its soundtrack is bit-for-bit the same
performance as `src/audio/ballad-of-the-stars.m4a` — 240 s both, envelope
correlation 1.000 at zero lag. That is the good outcome: the codex entry's claim
that a listener's capture at the 1:27 mark matches the chorus and second verse
line for line **stays true**, because nothing about the performance changed. All
this file adds is a card and 8 MB.

The other two share no material with it or with each other (correlations at
noise level), so **there are two genuinely new recordings here**. Both were
identified on 20 August 2026 — see below; neither had a home before that.

**Neither has been added to `src/audio/`.** All of these would need a decision
first — which page carries it, under what attribution, and whether it is site
furniture or an in-universe recording, which is the difference between a theme
and a codex entry with a named author.

### The two new recordings, identified 20 August 2026

**Dermot: the 3:49 is Slipwave; the 1:44 is a muster piece.** That settles their
cards (`prompt-sheet.md` 1.2 and 1.3) and opens two canon questions, neither of
which a card can answer.

**The 3:49 makes a fourth Slipwave recording**, and the catalogue is already
described. `slipwave.md`: *"Slipwave never recorded a studio album. Their
surviving catalogue is a handful of habitat-circuit recordings, most of them
incomplete or badly mic'd. Two are not."* The two are the anthem and the Ballad;
*Protectors of the Fold* is a later third, cut decades on by Ashgrove and
Calloway without Shepherd. So a fourth has a natural slot — **one of the handful,
surfacing later** — and filing it that way costs the corpus nothing and gains it
a nice fact: the catalogue was never claimed to be closed.

What it cannot be, without a rewrite: a polished studio track from the band's own
era. That is the one thing the glossary rules out twice over.

**The 1:44 needs its filing to match its sound.** The audio is a dense full-band
mix with drums, bright to the codec ceiling — **a recording of a muster piece,
not a recording made at a muster.** The distinction is load-bearing here, because
the anthem's spread is explained by the opposite property: it travelled as
something a room of non-singers could hold, unaccompanied. A produced muster
piece is perfectly plausible beside it — musters are not confined to one song —
but it is a different kind of object and the entry should say which.

**And a limit worth stating plainly: I cannot transcribe either.** I have never
heard a second of this audio; every reading in this file comes from waveforms,
spectrograms and card frames. A lyric is canon-for-its-author, so if either
recording is to become a codex entry, **the words have to be supplied**. Deriving
them from a spectrogram would be inventing them, which is the exact failure this
file exists to prevent.

### The cards contradict Slipwave, and that is the part worth catching

The three band cards are handsome and none of them shows the band the corpus
describes. Flagging rather than fixing, since a recording's cover is his call:

- **The lineup is wrong on all three.** Slipwave is **three people — Shepherd on
  vocals, Perrin Ashgrove on percussion, Marlow Calloway on strings**, two of
  whom are men who later enlist and carry the musician specialization. The cards
  show a three-woman group in stage leather, a solo singer in a green metallic
  bodysuit fronting a backing band, and a five-piece with electric guitars and a
  drum kit.
- **The register is wrong.** `slipwave.md` is emphatic that this band played
  *dock-adjacent common rooms*, never recorded a studio album, and that its
  surviving catalogue is *"most of them incomplete or badly mic'd"*. The anthem
  entry says no studio master survives. Arena lighting and a crowd assert the
  opposite of the thing that makes the band's story work — the anthem spread
  because it was small and carried, not because anyone promoted it.
- **The singer is not Shepherd.** Her portrait and `image_alt` establish red hair
  and blue-green eyes; none of the three cards matches. A new depiction of an
  established character is draft-and-stop ground in any case.
- **The lettering broke again** — the Slipwave card reads *"She left us to become
  aa' Star Rrarles"*. The claim underneath it is roughly canon-true; the spelling
  is not.
- **They would break the codex cover set.** All four Slipwave-adjacent entries
  currently carry designed cards — gold serif title on a dark starfield with a
  trailing star — and each `image_alt` describes exactly that. Swapping in
  photographic band art is a convention change across the whole set plus four
  alt-text rewrites, not a per-entry choice.

A canon-correct card brief is in
[`video-prompts.md`](video-prompts.md#card-art-for-a-recording).

### Two more, and one of them touches a character

- **`HoldMeTillDawn_2.mp4`** — 3:28, a singer with a band on a blue-lit stage,
  title spelled correctly, no canon connection I can find. **But the phrase
  echoes something published**: *Baby Universe*'s chorus opens *"Hold me up, hold
  me close"*. If the two are related that is a decision worth making explicitly
  — a second song in the same voice, or a variant of the same one, changes what
  `baby-universe-ballad.md` is the record of. If they are unrelated, the near-echo
  in the title is worth avoiding for exactly that reason.
- **`AoifeofStars_3.mp4`** — 2:59, and **the closest of all the supplied cards to
  the house target**: a red-haired woman under a night sky, natural light, no
  stage, no crowd, nothing glowing. Enigmatic without straining. If any of these
  cards is the model for the rest, it is this one.

  **It is also a character depiction, and that is draft-and-stop ground.**
  `src/characters/saint-aoife.md` currently has **no portrait at all** — no
  `image:` field and no file — so this card would be the first depiction of a
  canon character, which needs Dermot rather than a merge. Two things to weigh
  first: `images.md` already carries a prepared brief for her, framed
  deliberately as *looking down at the water with no halo and no glow, because
  the page is her refusal to claim*, and this card instead has her facing the
  viewer. Both readings are defensible; they are not the same reading. And the
  song title asserts an association between Aoife and the stars that her page
  handles very carefully — she is *"never fully certain what she had seen"* —
  so a devotional title is a claim the entry itself declines to make.

### `AshOnTheDoor_3.mp4` — the lettering failure at its worst

2:44, a singer on a dark stage. The card has **lyric text burned into the
frame**, and it is the worst instance yet: *"Letting go false friends who seemed
nice seemed nice & ecke felt superical"* — a line repeated mid-phrase, a word
that is not a word, and the title caption overlapping it. Nothing about this is
fixable by re-rolling the picture; **lyric captions have to be composited or
left off**, which is the same rule the other cards keep breaking more quietly.

**On where the song might belong**, if anywhere: *letting go of false friends who
seemed kind* is not Fian Ilchruinne material on its face — it is contemporary and
personal in register — but it is precisely what `life-lessons.md` exists to
handle, under its own rule: **generalise, then fictionalise.** *"The structure
enters the work, the circumstances don't."* A song naming the experience plainly
is the un-generalised form, which is fine for a song and is the reason it would
not go straight into the record as it stands.

### `PaperGalaxies_5.mp4` — the one that already has a home

2:35, same wrapper. Its card is a singer before a large swirling painted galaxy
with a band behind her — **and the corpus has already written about this exact
artifact.** `src/codex/paper-galaxies-audit-dialogue.md` describes the recovered
fragment as *"a single held frame, a singer before a painted, swirling field of
light standing in for a galaxy. Audio: one performance, repeating"*, and audits
whether it earns novelty credit.

So this is the one supplied file whose provenance question is already answered
in-world, and the only one with a page waiting for it. Two things follow:

- **The entry embeds no player.** If this recording *is* the audited fragment,
  the entry can carry it the way `ballad-of-the-stars.md` carries its audio — and
  the degraded-transmission framing makes a lossy 854×480 artifact an asset
  rather than a defect for once. That is a content change to a live page, so it
  is a proposal.
- **The audit's own terms then apply to it**, which is the joke and the risk
  together: Sen's finding is about whether a thing that *resembles* novelty earns
  the credit. Attaching the artifact to its own audit is very good; nobody should
  do it without reading what the audit concludes.

---

## Two Slipwave recordings with pictures — 7 October 2026

Dermot supplied two finished pieces as *two codex music videos from Slipwave
band*: *Odonata: Raise Your Banners* (3:32) and *Borrow the Angle* (3:52),
1280×720 at 24 fps with genuinely moving pictures, filed the same day as
`src/video/odonata-raise-your-banners.mp4` and `src/video/borrow-the-angle.mp4`
with codex entries of the same slugs. The video side is read in
[`video-prompts.md`](video-prompts.md); this is the audio side.

- **Tool:** _needed_ · **Prompt:** _needed_ · **Lyrics:** the full sheets are
  _needed_. Each videocast carries one lyric line per section as a composited
  caption — nine and ten lines — and those are the only confirmed text; both
  entries print them in order as captions and transcribe nothing else.
- **Not heard.** The structural reading and every statement about the music
  in the entries comes from the captions and the pictures, not the audio.
- **Catalogue.** `slipwave.md` gains a paragraph: two more surfaced later,
  complete, with pictures laid over them; the session is not stated and the
  Archive has not established it. That keeps every existing sentence true
  (*most incomplete or badly mic'd, two are not*; *never recorded a studio
  album*) and leaves the lineup his. The 20 August 3:49, identified as
  Slipwave then, is still unfiled and is not either of these.

## Regeneration worklist

Every supplied file in one table, with what would need to change. **Audio and
card are separate verdicts** — most of these have a keepable track inside a
container that needs redoing, and re-rolling the music because the picture is
wrong would be the expensive mistake.

| File | Audio | Card | What to change |
|---|---|---|---|
| `RotationalHum_1` | **adopted** | **keep** | Done — `src/audio/rotational-hum.m4a`, registered as the Church Space theme ("Ambient drone"). Card needs nothing: matte object, real light, no lettering. |
| `PaperGalaxies_5` | **adopted** | **keep** | Done — audio extracted to `src/audio/paper-galaxies.m4a` and attached to its own audit entry. The card stays as the entry's designed cover. |
| `AoifeofStars_3` | keep | hold | Not a fix — a decision. First depiction of a character with no portrait, so it waits for you. |
| `InnerSpaceBloom_3` | keep | **regenerate** | Garbled lettering; and *"Live Concert Recording"* claims a provenance the file does not have. |
| `BalladoftheStars_3` | keep (it is the repo recording) | **regenerate** | Garbled caption, and the band is not Slipwave. Use the card brief in `video-prompts.md`. |
| `StarRangers_3` (3:49) | keep | **regenerate** | Girl group in stage leather; wrong lineup, wrong register. Also needs a home — it is captioned as the Ballad and is not the Ballad. |
| `StarRangers_3` (1:44) | keep | **regenerate** | Same, plus it is captioned only *Star Rangers*, so what it is has not been said. |
| `HoldMeTillDawn_2` | keep | **regenerate** | Contemporary stage look, off-house. Title decision first — see above. |
| `AshOnTheDoor_3` | keep | **regenerate** | Burned-in lyric text, garbled and repeated, overlapping the title. Composite lyric captions or leave them off. |
| `grok_video_2026-06-05` | — | **regenerate if it is meant to be canon** | Text in frame, arena register, and full gravity, which loses the only part of shuffle dance worth establishing. |

**Seven of the ten need only a new card.** That is the cheap end of the work, and
the two cards that already pass (`RotationalHum_1`, `PaperGalaxies_5`) show the
house style is reachable with the tool you are already using — a matte object or
a described artifact, real light, and no words inside the picture.

---

## Entry format

Same shape as `image-prompts.md`, one per generated file:

    ### <filename>
    - **Type:** generation | edit
    - **Tool:** name and version
    - **Date:**
    - **Used by:** edition id / codex entry path
    - **Prompt:** style prompt, verbatim
    - **Lyrics:** codex entry the words came from, or "instrumental"
    - **Negative:**
    - **Notes:** seed, length, take count, loop point, loudness, format

No entries yet. The five files in `src/audio/` predate this file and are
recorded above as absences.

---

## Practical notes

- **Location and wiring.** Audio lives in `src/audio/`, passed through by
  `.eleventy.js` to `/audio/`. A theme track is named in `lib/editions.js` as
  `themeAudio: { label, file }` and rendered by `base.njk` with `controls`,
  `loop` and `preload="none"`. `validateEditions()` throws if the named file is
  not in `src/audio/`, so a typo fails the build rather than shipping a dead
  player — the label is **not** checked against anything, which is why the
  briefs above are keyed to it.
- **`themeAudio` is replaced wholesale, never merged.** An edition override
  supplies both label and file or neither; a new track under an old label is
  exactly the half-overridden state that comment exists to prevent.
- **Nothing checks audio the way `validate-content.js` checks images.** There is
  no unreferenced-file check, no duplicate-bytes check and no stale-slug check
  for `src/audio/` or `src/video/`. An orphaned track sits in the repo
  indefinitely, and two byte-identical tracks under different names would pass
  every gate. Until that changes, **check by hand** when adding or replacing
  audio: grep `lib/editions.js` and `src/` for the filename before deleting
  anything, and after adding, confirm the file is actually named somewhere.
- **Format.** The four themes are WAV, 4–8 MB each. That is heavy for a
  decorative footer element even behind `preload="none"`, and the one file added
  later — the ballad — is m4a. **New audio should be m4a or mp3**, and
  re-encoding the four existing WAVs is a real cleanup with no content risk,
  though it is a live-domain-facing change and so Dermot's call. Logged in Open
  questions.
- **In-body players are hand-written HTML** (see `ballad-of-the-stars.md`), with
  a download link inside the element as the fallback. Copy that block rather
  than inventing a new one; `check-internal-links.js` reads those paths and will
  catch a filename that does not exist.

---

## Open questions

Mirrored into [`open-questions.md`](open-questions.md).

1. **Do the four existing themes get regenerated?** Their prompts are gone, so
   any regeneration is a new track rather than a recovery — a change to four
   live domains' front-of-house, not maintenance.
2. ~~**Does Church Space get its own theme?**~~ Ruled 20 August 2026: yes,
   *Rotational Hum*, registered as "Ambient drone" — see the edition's entry
   above.
3. **WAV → m4a/mp3 for the four themes.** Mechanical, saves ~20 MB of repo and
   bandwidth, touches live domains.
4. **Recordings for the two unrecorded anthems.** *Half-Light Causeway* and
   *Protectors of the Fold* both have published lyrics and no audio. Briefs are
   ready above; generating either is a draft-and-stop proposal.
5. **Should audio get the bookkeeping images already have?** A duplicate and
   unreferenced check over `src/audio/` and `src/video/` in
   `validate-content.js` is a small script change and would close a gap that is
   currently covered by nothing at all.
6. ~~**The Told's theme label**~~ Ruled 30 September 2026: *Cavern ambient*,
   registered with the file when the track exists. What stays open is
   generating the track.
7. ~~**Does Young Star Rangers get a sibling track?**~~ Ruled 30 September
   2026: keep sharing.
8. **A recording of *Hymn of the Thin Places*** (30 September 2026). Two takes
   briefed, one verse each; draft-and-stop like the anthems.
