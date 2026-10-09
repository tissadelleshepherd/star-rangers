# Starship design — the principles the record already holds, and the blueprints the prompts quote

Planning note; not rendered on the site. Written 7 October 2026 at Dermot's
three directions of that evening, verbatim: *"Derive spaceship images from
design principles and detailed blueprints where possible."*, *"How would that
generation ark rotate to provide centrifugal gravity while still moving
forward or did it provide enough thrust to simulate earth like gravity?"*, and
*"Add story bible notes, lore pages or an artefact if needed for the detailed
starship designs and blueprints."* The fourth sibling of `species-design.md`,
`mind-design.md` and `language-design.md`: what the published record already
forces about every hull, station and platform in it, worked into numbers a
prompt can quote, with the open items marked as his. Nothing here is canon
until a lore page says it; everything here is derived from pages that are.

**Verify before trusting.** Each principle cites the page it comes from. A
blueprint figure not cited is a derivation from real physics and is marked
*derived*; a figure a page states is marked *canon*.

---

## The principles, from the record

1. **Real physics, with one licensed deviation** (`CLAUDE.md`, *Hard science
   fiction by default*). Nothing about a hull may need magic. Weight comes
   from spin or from thrust; heat has to go somewhere; a drive that burns for
   years is not a drive the record has.

2. **Two lawful channels, both slow in their way** (`src/lore/ftl-mechanics.md`,
   canon). Harmonic corridors advance a vessel about a light-year a day and
   need a corridor; folds are long-range and staged, from a low-gradient site
   (L4 or L5 for choice), with a scaffold generated and a hull and a route
   each certified before anything moves. *So:* a fold-capable hull carries a
   scaffold generator and spends its time waiting, and there is no "jump".

3. **The hull and the route are certified by different bodies**
   (`src/lore/fold-transit-catastrophic-failure.md`, canon): the Safety Corps
   certifies the hull against aperture tolerances, the Navigation Corps the
   route. *So:* a hull is built to a standard that can be inspected; its
   margins are its design.

4. **No faster-than-light communication** (`src/lore/weather-on-other-worlds.md`,
   canon). *So:* every ship is on its own once it has gone, and endurance is a
   design figure: the Lee-class carries **eighteen months without resupply**
   (`src/lore/kalypsis-dawn.md`, canon).

5. **Technology does not announce itself** (`src/lore/what-the-record-refuses.md`
   and `the-honest-dark.md`, canon): matte displays, grey-box plant, nothing
   that glows for effect. *So:* a hull is dull, patched where it has been
   repaired, and lit almost nowhere. A lit flank is the stock image and is
   wrong on this principle alone.

6. **Weight is spun** where people live long. The record's worked example is
   New London (`src/lore/new-london-space-habitat.md`, canon): three Stanford
   tori of **1.5 km diameter**, **a shade under 1.1 rpm** for Earth-standard
   weight at the rim, docking and zero-g work at a **non-rotating hub**. Eden's
   residential decking is on **the inner rim of its spin ring**
   (`src/lore/eden-ring-rail.md`, canon). The formula a prompt can use:
   *g = ω² r*; for 1 g, r (metres) ≈ 895 / rpm². One rpm needs 895 m radius;
   two rpm, 224 m; three rpm, 99 m. Below about 2 rpm most people adapt; above
   4 rpm few do. *So:* a small ring spins fast and runs under a full g, a
   large one spins slowly, and a ship's drum is short-radius and fast.

7. **Spin and thrust do not fight.** A spinning hull can thrust along its spin
   axis: the floor stays the outer wall and the thrust adds a slight tilt to
   "down", aft. Arks and liners spin about their line of travel. A vessel that
   must point instruments precisely counter-rotates two drums so the whole
   ship carries no net angular momentum.

8. **Heat goes to radiators**, which are large, flat, plain and the most
   visible thing on any working hull (`src/lore/orbital-compute-complexes.md`'s
   image is the record's one picture of them). A platform that renders
   anything (`src/lore/hyperfold-yield-combine.md`) is mostly radiator.

9. **Mixed biologies are a design brief, not a refit** (`src/lore/kalypsis-dawn.md`,
   canon): the Lee-class habitat section has a pressurised aquatic corridor
   with controls that work wet, and reconfigures between missions.

10. **A hull outlives its voyage** (`src/lore/knarrheim.md`, `the-tally.md`,
    canon): the *Nordstjerne*'s pressure hull is load-bearing at the centre of
    a station five centuries on; the Tally's ark is moored to an ice body and
    is still their home. *So:* an old hull in a picture is a kept thing, not a
    wreck.

---

## Blueprints

Each sheet is what a prompt quotes. Canon figures cite their page; derived
figures follow from the principles and real physics and are his to change.

### A. A generation ark of the Currach era (pre-fold, sublight)

- **Purpose** (canon, `the-generation-ark-era.md`): a sealed sublight hull on a
  crossing of generations; what decided survival was provisioning and the
  durability of the company, not the drive; the Currach Fleet's six all
  arrived.
- **Drive** (derived): low continuous thrust for years, far below a
  hundredth of a g, then a long coast, then the same again to slow. Nothing
  about it lights the hull. Thrust weight is never the crew's weight.
- **Weight** (derived): the hull is a **drum spun about its long axis**, the
  axis along the line of travel (principle 7). A working figure: **200 m
  diameter, 3 rpm, about 1 g at the inner wall**; a smaller company might run
  0.6 g at 2.5 rpm on 140 m. Length is what provisioning needs, not what
  weight needs: **one to two kilometres** for a company of thousands with
  farms, stores and a century's spares.
- **Layout** (derived): a non-rotating spine runs the length, carrying the
  drive aft, tankage and shielding forward (the crossing is the radiation
  hazard), and docking at the forward end; the spun drum is the middle
  two-thirds; radiators are fixed to the spine fore and aft of the drum,
  flat panels edge-on to the sun of departure.
- **Surface** (canon by principle 5; `the-tally.md` for the patching): dull,
  patched in many greys, no markings, **no window band**. A few small ports
  at most, and nothing lit from inside that need not be.
- **The Tally's hull** (open): moored by lines and struts to an ice body, it
  cannot spin. Either the company lives in near-weightlessness and has for
  three centuries, or the mooring is at the spin axis and the drum still
  turns. The page is silent; this is his.

### B. A Lee-class vessel (the *Kalypsis Dawn*)

- **Purpose** (canon, `kalypsis-dawn.md`): unarmed; carries delegates,
  evacuees and survey teams through environmentally dangerous places; crew of
  forty to sixty; eighteen months' endurance; fold-capable with both
  certificates; several independent reference sets that share no design or
  supply chain; a habitat section built for different biologies, reconfigured
  between missions, with a pressurised aquatic corridor.
- **Shape** (derived): a **spine** with **two short counter-rotating drums**
  amidships (principle 7, so the reference sets sit on a hull with no net
  spin): each about **60 m diameter at 4 rpm for about 0.5 g**, or 90 m at
  3 rpm for 0.9 g; one drum carries the mixed-biology habitat including the
  aquatic corridor, the other the ordinary quarters and stores. The reference
  sets sit on the spine, as far apart as the hull allows, in sealed plain
  housings.
- **Fold plant** (derived from `ftl-mechanics.md`): a scaffold generator
  forward of the drums on the spine, and nothing that fires or glows; the
  ship spends its fold time waiting at a staging site.
- **Heat** (derived): radiator panels aft, between the drums and the drive,
  the largest surfaces on the ship.
- **Surface**: dull, unmarked, no glazed nose. Docking at the spine's
  forward end. Length (derived) **250 to 350 m**.

### C. An industrial rendering platform (Hyperfold Yield Combine)

- **Purpose** (canon, `hyperfold-yield-combine.md`): lawful, orderly, intact,
  unremarkable; it ended at Dock Seven, but the picture is the plant working.
- **Shape** (derived): a truss carrying **tank clusters**, **transfer booms**
  and **docking cradles** (canon list), and, because rendering is heat work,
  **radiators larger than everything else combined**, deployed as flat
  fields. A small spun section for the crew, or none if shifts are short.
  No windows, no lights but the docking cradle's, nothing painted.

### D. A single-ring habitat (Greenward, the Guest Ring)

- **Purpose** (canon, `greenward-habitat.md`): one ring, two hundred and forty
  people, high orbit, most of them never going down.
- **Figures** (derived): for 240 people, **a ring 300 to 400 m in diameter at
  2 to 2.5 rpm, 0.7 to 1 g**; a hub with docking; spokes; the ring small and
  exact against the world below (the picture's distance is the clause).
- **The Guest Ring** (canon, `the-guest-ring.md`): built by the Federation for
  non-human occupants; a gallery added by the yard crews, oriented for the
  drithle run. Proportions wrong for a human, nothing strange on purpose.

### E. A Threshold-class boundary station

- **Purpose** (canon, `boundary-zones.md`, `survey-corps-protocol.md`): fixed
  post at a boundary zone; instruments first; a Starwarden's command.
- **Shape** (open): the record gives no shape. A derived default until he
  rules: a non-rotating instrument spine kept still for the boundary work,
  a small spun section for the crew, radiators, and the rack of sealed
  housings the chapters describe. Put as a choice before any picture.

---

## How a prompt uses this

1. Name the class and the page; quote the canon figures; pick the derived
   ones from the sheet or state new ones here first.
2. Say where the weight comes from and where the heat goes, in the frame:
   a drum or ring that could turn, radiators that could radiate.
3. Light almost nothing. No glazed nose, no window band, no lit flank, no
   engine glow at coast. The sun lights it from one side.
4. Keep the standing negative, and add: *glazed cockpit, window band, engine
   glow, lit flank, sleek hull, fins, wings, antenna forest, painted name*.
5. Record the picture against its sheet in `images.md`: which figures it
   used, which it guessed.

## Open items (his)

- Ark drum figures (A), and whether the Currach hulls were one drum or two.
- Whether the Lee-class counter-rotates or carries one drum (B).
- The Tally's weight at the Mooring (A).
- The Threshold-class shape (E).
- Whether any ship in the record has windows at all beyond ports.
- Whether these sheets become a lore page (*Hulls of the Record*, Technology)
  once he has ruled on the open items; until then they are planning.
