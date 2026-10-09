# Domain strategy and the duplicate-content reports

**Status: DECIDED, 20 August 2026, in three passes.** Google Search Console warned about
shared or duplicate content across the sites. Dermot's direction that day:
**each tier family picks one site to rank**, there are **four families, one per
reading tier** (not the three accidental TLD groupings this file first
described), and **each independent deployment inside a family gets a slight
variation or specialisation** — ideally a different faction, with the four
Fellowship of Light domains fronting different **chapter houses**.

What is settled is the shape. What still needs him is named in *Still open* at
the end — chiefly the fourth chapter house, which does not exist in canon.

**This file answers which domain ranks; `edition-reader-profiles.md` answers
who reads it.** The two were one question while a family's members differed only
in name and palette, and separated on 21 August 2026 when each edition gained a
*presentation mode* — a posture, independent of both identity and palette. The
consolidation decisions here are unaffected by it: a mode moves type and
spacing, never the page set, so it cannot make two domains any more or less
duplicate than the filters already do.

## First, the reassurance

**There is no duplicate content penalty.** Google acts on duplication only
where it is deceptive — scraped, spun, built to mislead. None of this is. The
Search Console report is a *coverage* report: it lists URLs that did not make
the index and why.

What it costs is not ranking but **choice**. Where two URLs carry the same
content, Google indexes one and drops the other. Everything below is about
picking the survivor ourselves.

## Reading the report

Four distinct statuses, and only two want anything from us. Check which wording
the report used before acting.

| Status | Meaning | Verdict |
|---|---|---|
| **Page with redirect** | A 301'd URL | Working as intended — ignore |
| **Alternate page with proper canonical tag** | Duplicate found, our canonical honoured | Working as intended — ignore |
| **Duplicate without user-selected canonical** | No canonical tag; Google guessed | Real gap |
| **Duplicate, Google chose different canonical than user** | We self-canonicalised and Google **overruled us** | Real, and what the families produce |

`CHANGELOG.md`'s 8 August 2026 entry records the third of these on
fianilchruinne.com, fixed with the force-HTTPS 301 in `src/static/.htaccess`.

## What is already correct and needs nothing

The **seven alias domains** in `lib/editions.js` share their target's document
root, so they serve HTML built with the *target's* `SITE_DOMAIN`. A page at
`star-rangers.space` already carries a canonical naming `sciencefiction.site`.
That is the anti-squatting pattern working, and the reasoning for keeping them
out of any `domains` array still holds.

## The governing principle

**A registration defends the name; a build has to earn its keep.** Adopted
20 August 2026, and it is what the rest of this file follows from. Several
domains were defensive registrations that had been promoted to full builds
without having anything of their own to serve — which is precisely how a
duplicate is manufactured out of an anti-squatting measure. Promote a TLD to a
build when it has a face of its own to show. Until then an alias already does
the job, and does it better: an alias *cannot* become a duplicate, because it
never had its own `SITE_DOMAIN` to self-canonicalise to.

## The test a build has to pass

**A registration defends the name; a build has to earn its keep.** The sharp
version, settled 20 August 2026 — an independent build is justified when all
three hold:

1. **Its own page set.** It includes or excludes pages differently from its
   family's ranking domain. Framing alone fails: a name, a tagline and a palette
   are what a reader sees, not what a crawler indexes or a bookmark is worth.
2. **Its own reason to be looked for.** Somebody would search for this thing by
   name. *Fellowship of Light* passes; *fellowshipoflight.space* does not.
3. **It only ever subtracts.** It asserts nothing the central record does not
   already say — the rule `CUSTOM_LORE_FILE` was deprecated for breaking.

Applying it honestly cost four builds. Eleven hostnames now resolve to **seven
builds and eleven aliases**.

## Families

- A **tier** is a *readership* — children → young adult → general →
  contemplative.
- A **family** is a set of domains *serving the same pages*, which must
  consolidate on one ranking host.

They coincide wherever a tier has one brand. The contemplative tier holds two
institutions, so it has two families.

**The tiers nest (3 September 2026, Dermot's direction — `intake-2026-09-03.md`).**
Each reading tier's edition carries everything the tier below it carries:
children ⊂ young adult ⊂ general ⊂ contemplative, defined once in
`lib/editions.js` and asserted by `validateEditions`. The family test still
passes — each tier's page set is a strict superset of the one below, so no two
families serve the same pages — and the two contemplative families go on
serving identical page sets as they already did, with `ranksAt` doing its job
there. The canonical site is at the general tier, unfiltered.

| Family | Tier | Builds | Aliases | Ranks at |
|---|---|---|---|---|
| children | children | undercover-pets.com | — | itself |
| young adult | young adult | starquest.site | starquest.online | itself |
| **Young Star Rangers** | young adult | young.fianilchruinne.com (registered 3 Sept 2026; live 7 Sept 2026) | — | itself |
| **The Told** | children | told.fianilchruinne.com (registered and live 7 Sept 2026) | — | itself |
| general | general | sciencefiction.site | — | itself |
| **Fellowship of Light** | contemplative | fellowshipoflight.org, fellowshipoflight.site | .online, .space | **fellowshipoflight.org** |
| **Communion of the Called** | contemplative | church-space.site | church-space.online | itself |

`fianilchruinne.com` (with GitHub Pages) is not in a family — it holds
everything and self-canonicalises, unchanged.

**The split is by institution, not by TLD.** That is the justification and the
test for any third family. `fellowshipoflight.org` and `church-space.site` are
two orders that exist separately in the fiction; `.org` and `.site` are two
spellings of one name. Consolidating the second is obvious; consolidating the
first would tell search engines the Communion is a copy of the Fellowship, which
the record does not say. The door is open for a third — the **Monasteries of
Mars** are the tier's third order, currently one tagged page and no domain.

## Codex sites: the shape that passes the test

Dermot's direction, 20 August: spare domains become codex sites owned by
factions. `fellowshipoflight.site` is the first instance, and it works where the
chapter-house framing it replaces did not.

**Why it clears condition (1).** The union problem bit the chapter houses
because they were narrowing *within* a thread, and adding a topic to a thread
can only widen. A codex site wants **no thread at all** — just a tag — which is
exactly the shape `topics` was built for and what the pets edition has always
done. Measured: **59 indexable pages, 6 codex entries and 3 lore entries of the
Fellowship's own**, against **0** for any chapter-house framing.

**Why it is canon-safe by construction rather than by care.** The Codex is
*already* valid-for-its-author: `author` is required on every entry and entries
carry no `canon_facts`. A domain branded as one institution's archive is the
most honest presentation that material can get — it does in framing what the
central site has to do in prose. The hard limit is condition (3): a codex site
is a **filtered view** of the central codex and never a domain with entries of
its own. The moment it carries a page `fianilchruinne.com` does not, this is
per-domain canon again.

**Dock Seven is the argument for more of them.** Four entries, four owners, one
event — Farline's loss adjuster, the Institute's fold-dynamics section, the
Threshold night watch, the maintenance log. A reader could read that incident
from one institution's side, cross to another domain, and find it told
differently by someone with a different stake. That is *who gets to name the
truth* built into the domain structure rather than described in a lore entry.

### Subdomains first, registrations second

Kept here because the codex-site idea otherwise reads as an argument for buying
domains, and mostly it is not. **A subdomain of a domain already held costs
nothing**, needs no registrar, gets its own cPanel document root, is covered by
AutoSSL, and can be an `ALT_DOMAINS` build the same afternoon. Verified against
the machinery: a subdomain host resolves cleanly and matches no parent entry by
accident, so it simply needs its own entry in `lib/editions.js` like any other
build.

**Where they are created, since the interface moved.** cPanel retired its
separate *Subdomains* and *Addon Domains* pages and folded both into one
**Domains** interface, so a subdomain is no longer a distinct thing to make:
Domains → Create A New Domain, type the full hostname, leave "share document
root" unchecked, and set `ALT_<id>_DIR` to whatever path it creates. Full
version, including the DNS case, in `TECHNICAL-README.md`'s `ALT_DOMAINS`
section. Worth writing down twice because "there is no Subdomains page" reads
like the feature is gone rather than renamed.

Two limits, and both matter before anyone gets attached to the idea.

**A codex subdomain will not rank, by construction.** It serves a subset of its
parent's pages, so by the family rule it is in the parent's family and
canonicals there. What it buys is a short memorable door into a body of material
and a shareable address — not a search position. That is a real thing to want
and it is not the thing a registration buys.

The exception is the same test that split the contemplative tier: **is this
institution separate in the fiction, or inside the one the parent already
represents?** The Communion of the Called earned its own family because it is a
different order from the Fellowship. The Survey Archive is *inside* the Star
Rangers, so `archive.fianilchruinne.com` is a door into the canonical record
rather than a rival to it.

**A subdomain is not a defensive registration.** It protects nothing — anyone can
still take the matching domain. So it complements the anti-squatting
registrations rather than replacing them, and the question "do I need to own this
name?" is untouched by anything below.

### Candidate subdomains

Measured 2026-08-20 by building each filter. Codex/lore/character counts are the
material each would actually front; the rest of each figure is the navigational
shell every build carries.

| Subdomain | `topics:` | Indexable | Codex | Lore | Characters |
|---|---|---|---|---|---|
| `eden.fianilchruinne.com` | `eden` | 89 | 7 | 6 | 21 |
| `union.fianilchruinne.com` | `celtic-union` | 86 | 7 | 14 | 15 |
| `threshold.fianilchruinne.com` | `threshold-station` | 77 | 12 | 3 | 8 |
| `compact.fianilchruinne.com` | `orbital-habitats-compact` | 69 | 2 | 6 | 13 |
| `msc.fianilchruinne.com` | `msc` | 66 | 3 | 6 | 4 |
| `governance.fianilchruinne.com` | `governance` | 65 | 6 | 10 | 2 |
| `archive.fianilchruinne.com` | `survey-archive` | 55 | 8 | 2 | 2 |
| `institute.fianilchruinne.com` | `the-institute` | 50 | 3 | 3 | 1 |

`farline` (47 indexable, 2 codex, 1 lore) is below the line — that is the
shell and a rounding error, the chapter-house failure again.

Note what the top of that table is: `eden` and `celtic-union` are
character-heavy rather than codex-heavy, so they would be *place* doors rather
than archive doors — a different and possibly better thing than the faction-codex
idea that prompted the list. `threshold-station` at 12 codex entries is the
strongest true archive candidate after the Fellowship's.

**Utility subdomains**, which have nothing to do with any of the above and are
worth having anyway. `SITE_NOINDEX=true` already exists for exactly this and is
documented as being for "testing/staging (sub)domains" — so the machinery is
waiting:

| Subdomain | Purpose |
|---|---|
| `staging.fianilchruinne.com` | A real cPanel deploy of a branch before it reaches a live domain, `SITE_NOINDEX=true` so it never competes. The one thing this session could not do was verify against a live server. |
| `c.fianilchruinne.com` | If the permanent `/c/<comment_id>/` citation form ever wants an address short enough to print. Currently a path, and fine as one. |

None of these is registered, proposed or decided. The list exists so that the
next time a faction wants a home, the first question is which subdomain rather
than which registrar.

### Which factions could carry one

Own pages beyond the shared navigational shell, measured:

| `topics:` | Own pages | Codex entries | Viable? |
|---|---|---|---|
| `governance` (AI Governance Commission) | 19 | 6 | yes |
| `fellowship-of-light`, `arilon` | 12 | 6 | **built** |
| `survey-archive` | 9 | 8 | yes |
| `the-institute` | 4 | 3 | marginal |
| `farline` | 1 | 2 | no |

Below roughly four or five own pages a faction site is the shell and a rounding
error — the chapter-house failure wearing a different hat.

**The whole church-space side is ineligible, on a different ground.** Every
Communion and Cnoc na mBeach page is **private-thread material**, so it appears
only on a build that *names* the thread and can never be selected by tag. There
is no filter that would give `church-space.online` a page set, which is why the
planned Cnoc na mBeach codex site does not exist and that domain is an alias.

**The existing spares mostly do not fit.** `fellowshipoflight.space` branded as
the Survey Archive would be absurd. This idea argues for **new registrations
named for the factions**, not for repurposing what is already held — with
`fellowshipoflight.site` the one honest exception, since the Fellowship's own
archive belongs on a Fellowship domain.

### The demotions need a cPanel change the merge cannot make

Worth stating plainly, because the merge looks like the whole job and is not.
Removing a domain from `lib/editions.js` does not make it an alias — that is a
cPanel operation, pointing the addon domain at its target's document root. Until
it is done, a demoted domain whose `ALT_DOMAINS` build is still configured
resolves as unregistered, and if `deploy.conf` leaves its keys unset it builds
the **full unfiltered site**: 566 indexable pages instead of 62, unbranded,
self-canonicalling, with a 443-URL sitemap. Four of those would be four new
duplicates of the canonical domain — the exact failure this file exists to
close. (No privacy consequence: an unfiltered build still excludes the private
thread, which is what `private: true` is for.)

Since 2026-08-20 `scripts/cpanel-deploy.sh` handles that gap itself, and the
second version of the handling is the one that matters. It first *refused* the
build, which is safe and useless: the domain keeps serving whatever full build
was last rsynced there, so the duplicate survives until somebody opens cPanel.
It now **deploys a three-file redirect instead** — an `.htaccess` 301ing the
whole namespace to the target with path and query preserved, an `index.html`
with a canonical and a meta refresh for hosts without `mod_rewrite`, and a
`robots.txt` that pointedly does not `Disallow`, since a crawler must be able to
fetch the URLs to see the redirect at all. It runs with `--delete`, so the old
build goes.

The consequence worth having: **the consolidation is real from the first
deploy**, and the cPanel repoint becomes tidying rather than a prerequisite.

**The check keys off a registered alias, not off "this domain is unknown to
us"** — corrected the same day, on Dermot's point, after the first version got
it wrong. `lib/editions.js` now carries an `ALIASES` map and the deploy refuses
a host *named* there. The earlier version refused any domain that neither the
registry nor `deploy.conf` had configured, which would have made an independent
deployment impossible without adopting our registry: a third-party fork on its
own domain resolves no edition here and never will, and the two-key minimum
`deploy.conf` is a path `FORKING.md` promises. Silence about a domain has to
mean no opinion, not refusal. The narrower rule also catches the case better,
since it can name the alias and its target in the error.

### What was demoted, and why

| Domain | Was | Failed on |
|---|---|---|
| starquest.online | a build | no page set — one task force, one chapter |
| fellowshipoflight.online | the abbey on the tidal river | no page set — framing only |
| fellowshipoflight.space | the house on the green hill | no page set — framing only |
| church-space.online | Cnoc na mBeach | no page set *possible* — private-thread material |

The two unnamed chapter houses remain canon and remain unnamed; they simply do
not have domains any more. If either accumulates its own material, the entry to
restore is in this file's history and the test above is what it has to pass.

## What a specialisation can and cannot be

**Framing only, and that is a property of the filter rather than a lack of
ambition.** `lib/content-filter.js` **unions** characters, topics and threads —
a page is in if it matches *any* of them — so a tag cannot subdivide a thread.
Measured 20 August:

| Filter on church-space.site | Indexable |
|---|---|
| `threads: [church-space]` | 62 |
| `threads: [church-space]` + `topics: [communion-of-the-called]` | **62** — a topic cannot narrow |
| `topics: [communion-of-the-called]` alone | **46** — the bare shell; Season 8 and the private opt-in gone |

So each domain's face is its name, title, tagline, palette and audio, and that
is where this correction bites: an **earlier draft of this file claimed the
church-space pair could be "filled for real today" because the Communion and
Cnoc na mBeach carry their own tags. They do, and it changes nothing** — those
pages are already inside the thread. Nothing in the tier can be content-narrowed
without gutting it.

`heroCharacterIds` is nearly as constrained: a contemplative build renders
exactly **one** character page as real content (Brother Fintan), so only
church-space.online can set a meaningful hero cast.

Framing is enough to give a reader arriving at church-space.online a hermitage
rather than a generic contemplative site. It is *not* enough to make the page a
crawler sees any less of a duplicate — which is why `ranksAt` exists and why all
six point at one host.

**So "four chapter houses" is a writing programme, not a configuration change.**
The sequence: consolidate ranking and framing now (done); let each house
accumulate pages of its own; then narrow that entry and relax its canonical,
one domain at a time. The config is ready for it either way.

## The mechanism, implemented

`ranksAt` on an edition names the host in its family that carries the ranking
signal. Empty (the default) means self-canonical, which is right for a family
of one.

It names a **host, not a page**: any build whose `SITE_DOMAIN` differs emits a
cross-domain canonical at the same path, and the named host compares equal and
keeps its self-canonical. One value per family, read correctly by every member —
which is what let the family split into six entries with no change to the
mechanism, exactly as the field was designed for.

Threaded registry → `resolve-edition.js` → `cpanel-deploy.sh` → `SITE_RANKS_AT`
→ `site.js` → `base.njk`. Two deliberate consequences:

- **A non-ranking domain drops its sitemap entries and its robots.txt Sitemap
  line.** Advertising URLs we have just told Google not to index is
  contradictory, and Google's guidance is to keep non-canonical URLs out of
  sitemaps.
- **`og:url` stays self-referential** and now diverges from `rel=canonical`.
  They answer different questions: the canonical tells a crawler which copy to
  index, `og:url` is what a reader hands a friend. Someone sharing a
  church-space page should be sharing a church-space link. Consolidating the
  search signal was the decision; rebranding the reader's own share was not.

### The invariant, and it is load-bearing

**The ranking domain must include every page its siblings include.** A
cross-domain canonical pointing at a URL the target renders as a `noindex`
placeholder would send Google to a dead end and lose the content altogether.
**Narrow the siblings, never the one that ranks.**

Both halves are now enforced in `validateEditions`, which fails the build on a
`ranksAt` naming a host no edition claims (a typo, or an entry deleted out from
under it — every page would canonical to a host nothing builds, while the deploy
logged success), and on a ranking domain whose filters are not a superset of a
sibling's.

Verified on built output as well as asserted — all **62** indexable pages on
`fellowshipoflight.site` canonical to `fellowshipoflight.org`, and all 62 targets
are indexable there. 0 violations. (45 further canonicals on that build are the
`/c/…/` citation-alias stubs from `chapter-aliases.njk`, which hand-write their
own head and stay host-relative. They are `noindex`, and their canonical chains
through the sibling's real page to the ranking domain, so they are correct as
they stand.)

## Nothing open

All four questions raised on 20 August are answered. The last of them — whether
framing-only specialisation justified six contemplative builds — was answered by
writing the test down and applying it: **no**, and four domains became aliases.

What is left is not a decision but work: **the writing programme.** Each demoted
domain can come back as a build the moment it has pages of its own, and each
qualifying faction can have a codex site as soon as a domain is registered for
it. The config is ready for both.

## What could not be checked from here

- **Live verification.** The session's network policy refused outbound
  connections to all eleven domains, so everything above is from the repo and
  the built output, not from what the servers answer. Worth running:

  ```
  curl -sI https://fellowshipoflight.space/
  curl -s  https://fellowshipoflight.space/ | grep canonical
  curl -s  https://fellowshipoflight.space/version.txt
  ```

- **`deploy.conf` is untracked** and lives on the cPanel account, so whether a
  live clone overrides `SITE_NAME`/`SITE_TITLE` per TLD is not visible here.
  `deploy.conf` wins over the registry wherever it sets a value — but *not* for
  `ranksAt`, which is deliberately registry-only: which domain carries a
  family's ranking signal is a decision about live sites, and belongs in a file
  that gets reviewed in a pull request.

## Side finding, unrelated to the decision

Listing pages are **not deterministic between builds**. Of four builds, three
produced an identical `/codex/` card order and the fourth differed — same card
set, different order (sorting both lists makes the difference vanish);
`/lore/` and `/official/` moved with it. Not domain-dependent: two builds of
the same domain can disagree, which points at async data-file resolution order.
Harmless for readers, annoying for anyone diffing two deploys. Worth an issue if
it gets in the way.
