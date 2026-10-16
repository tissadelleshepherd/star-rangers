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

11. **A crew is sized by the people-work, never the machine-work** (Dermot,
    11 October 2026, on *"Star Trek and Andromeda tend to have much larger crews
    than an advanced starship would actually need"*, choosing to record it as a
    principle). Derived from what the record already holds: the *Constant
    Margin* flew with three, *Patience First* with six, Threshold Station runs
    with twenty, a Chthonari contractor crew is four, and the largest crew in
    the record, the Lee-class's forty to sixty, is there for delegates,
    evacuees, a multispecies trauma ward, xenobiology and xenolinguistics,
    because a ship's mind offers candidate readings and never decides what
    anything means (`kalypsis-dawn.md`). *So:* a ship runs with a few; it
    carries more only for what people must do (judgement, care, contact, the
    passengers' needs). No crowd of hands on a bridge, no deck of people turning
    valves a machine would turn.

12. **A High Captain's command ship is a mobile headquarters** (Dermot,
    11 October 2026, verbatim: *"A High Captain's command ship is more like a
    mobile headquarters than a normal starship."*). A High Captain holds flag
    authority over a whole region or theatre (`star-rangers-command-hierarchy.md`),
    and with no faster-than-light communication (principle 4) a theatre's
    headquarters has to travel with its commander: orders, records and the
    people who weigh them cannot outrun the hull that carries them. *So:*
    the ship is sized by its headquarters work under principle 11, staff,
    records, liaison and the business of the region, not by flying it; it
    reads as a working headquarters that moves, closer to a station than a
    cruiser, unarmed like every Ranger hull. Every High Captain has one, and
    sessions of the Council of High Captains and the Triumvirate are hosted
    aboard one (Dermot, same day, verbatim: *"Every High Captain needs a command
    ship especially for hosting a High Triumvirate or High Council session."*;
    read as the record's Triumvirate and Council of High Captains, since *High
    Council* is the Imperium's chamber). Now on the command hierarchy page.
    It is usually slower to arrive than a Line Captain's ship or a Star
    Captain's flagship (Dermot, same day, verbatim: *"Command Ships are often
    slower to arrive than a Line Ship or Star Captain's Flagship"*), which
    also puts a Star Captain's flagship in the record. Class, size and the
    reason for the slower arrival beyond what a headquarters hull is built for
    are his (open items).

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

### F. An ascent javelin (surface to orbit)

Added 11 October 2026 for the site's default share card (`hero/home-launch.jpg`),
which showed a Space Shuttle; the 10 October rule names ascent by javelin
(`CLAUDE.md`, *No orbital towers*).

- **Purpose** (canon, `src/lore/ascent-javelins.md`): passengers and cargo
  from surface to a stable parking orbit; the journey down is a landing
  craft's. Standard javelins are chemical-cycle, rated to about 1 g;
  fusion-thermal variants climb heavier worlds.
- **Launch** (canon): *thrown, not taken off*: the craft rides a **launch
  cradle to near-vertical**, fires a hard boost off it, then climbs through
  three regimes: ballistic boost, **air-breathing aerodynamic climb** through
  the middle atmosphere, closed-cycle rocket flight for insertion. Ninety
  seconds of boost, eleven minutes of climb. A spaceport *looks from a
  distance like a missile battery interleaved with a runway*.
- **Shape** (derived): one slender **winged** body, because the middle regime
  is aerodynamic: short swept wings or strakes, a blunt heat-shielded nose,
  air intakes along the underside for the air-breathing climb, the rocket
  nozzles at the tail. **One body, no stack**: no external tank, no strap-on
  boosters, no orbiter riding on anything; the cradle is a ground rail frame
  that stays behind. Length (derived, awaiting him) **40 to 60 m** for a
  passenger javelin.
- **Crew and layout** (Dermot, 11 October 2026, verbatim: *"Ascent Javelin
  would have a pilot, co-pilot and passengers although highly automated"*):
  a **flight deck forward** for a pilot and a co-pilot, and a **passenger
  cabin** behind it. Flight is highly automated: the crew certify, monitor
  and take over when they must; they do not hand-fly the ascent. This
  replaces the first draft's guess of no cockpit.
- **Surface** (principle 5): dull, unmarked, a plain pale thermal skin with
  the honest seams of its panels, no painted name. The flight deck shows as a
  short row of narrow ports at the nose, never a glazed bubble canopy; no
  window band along the cabin, at most a few small passenger ports.
- **What is lit** (real physics): during the boost, the exhaust plume and the
  cloud it raises, which is the one bright thing a launch has; nothing on
  the hull is lit.
- **Not military** (`CLAUDE.md`, the Rangers are not military; and the
  spaceport is civil traffic): the missile resemblance is the page's simile
  and stays one. No markings, no ordnance, no launch vehicle on a truck.

### G. Antariksha (a counter-rotating pair, the Compact's foundry habitat)

Added 14 October 2026 for the lore page's owed illustration (`intake-2026-10-10.md`,
*An Indian habitat*, approved by him 11 October *"Approved as drafted"*). The
page carries more worked figures than any other habitat in the record, so most
of this sheet is canon.

- **Purpose** (canon, `src/lore/antariksha.md`): built to make what can only be
  made where nothing weighs anything; the non-rotating hub is a foundry (drawn
  glass fibre, crystal growth, large lattices) and the habitat around it houses
  the people who run it. High Earth orbit; a Compact member; about 150,000
  residents at a busy city's density.
- **Weight** (canon): **two cylinders, each about 2 km long and 1,200 m
  across**, turning in opposite directions on a common axis, **about 1.2 rpm**
  for Earth-standard weight at the floor, **about 77 m/s** at the floor; about
  fifteen square kilometres of floor between them. The formula checks: 895 /
  1.2² ≈ 620 m, the cylinder's radius within rounding. Below 2 rpm, so
  residents born there need no adaptation, as the page says.
- **Why two** (canon): counter-rotation leaves the pair with no net angular
  momentum, so turning the whole habitat to face the sun costs almost nothing;
  one cylinder of that size would fight every turn like a gyroscope.
  Principle 7's counter-rotating case at habitat scale.
- **Layout** (derived): the two drums lie **end to end on one axis** with the
  **hub between their inner ends**, a shorter non-rotating drum of smaller
  diameter (a working figure: **300 m across, 400 m long**) on bearings to
  both, so the foundry sits at the centre of mass and the weightless work is
  reached from either cylinder without leaving the axis. **Docking** is on the
  hub's rim, in the annular gap between the two drums' end caps, where a craft
  can hold station against something that does not turn. A non-rotating spine
  runs the axis through both drums and stands out as a short stub at each
  end (derived, awaiting him: the page says only that the hub does not rotate).
- **Sun and power** (derived from the canon turning): the axis is kept pointed
  at the sun. The sunward stub carries a flat dark field of collectors; the
  drums are lit from inside and keep a day by their own lighting, which is why
  the hub can work round the clock and the cylinders need no window strips. In
  high orbit the hull is the radiation shield, and a window band would be a
  gap in it (principle 5 and real physics agree here).
- **Heat** (derived, principle 8): a foundry is heat work. Large flat plain
  radiator panels stand out radially from the hub, edge-on to the sun, and
  more sit on the shadow-end stub in the hull's own shadow. They are the most
  visible thing on the habitat after the drums themselves.
- **Surface** (principle 5; the 11 October *well kept* rule): dull matte
  composite in greys, the honest seams of its panels, unmarked, unlit but for a
  few steady points at the docking cradles. Clean and maintained; a kept thing.
- **What a picture shows** (for `images.md`): two enormous plain drums, a
  narrower hub between them with cradles and radiator fins, a stub at each
  end, one with the collector field; the sun lighting it from one side and the
  far side black; Earth a disc behind it, not filling the frame, because the
  orbit is high. A ring, a torus, spokes or a single cylinder fails the sheet;
  so does a window stripe down either drum.

### H. Ligeia (a single ring at full weight, ex-Outer Administration Station Four)

Added 15 October 2026 for the lore page's owed illustration (`images.md` § 5h,
written on Fable with the Titan and Stillwater prompts). The page fixes less
than Antariksha's does, so most of this sheet is derived and his to change;
it is here because step 1 below says to state new derived figures here first.
Stillwater is a surface station on an ice shore, not a hull, and takes no
sheet: principle 5 (dull, unmarked, lit almost nowhere) and the 11 October
*well kept* rule reach it, and its page gives its construction (insulated,
not pressurised; sealed modules; resealed and recorded). Callisto Station
(`images.md` § 5i, written later the same day) takes none for the same
reason: it is dug into the moon's ice, so what shows at the surface is
shielding mounds, sealed hatches and a buoy cradle, and nothing on it spins
or coasts. Its one derived figure, three flat radiator slabs on the ice for
the fusion plant's heat (principle 8), is named in the prompt's entry as a
guess and is his to strike; the buoy keeps the shape the Navigation Corps
page already pictured, a small plain unmarked cylinder.

- **Purpose** (canon, `src/lore/ligeia-habitat.md`): an Imperium
  administrative and patrol post set in high orbit around Titan after 2543
  UCSD, built to **full spin gravity** because its crews rotated in from the
  inner system; handed to Titan's civil government after 2609 UCSD; now the
  seat of the Titan Settlement Authority and the home of the surface crews'
  families, who keep their weight there and rotate down. The record calls it
  a ring. Travel to and from the surface is by ascent javelin and landing
  craft (canon, both pages): nothing joins it to the ground.
- **Weight** (derived): one ring, **about 800 m across at 1.5 rpm for 1 g at
  the rim** (895 / 1.5² ≈ 398 m radius), below the 2 rpm most people adapt
  to, which a habitat raising children needs; a smaller post at 2 rpm on 450
  m would also give a full g and is the alternative. The rim is a deep drum,
  the floor on its inner wall, with no window band, since in orbit the hull
  is the shield.
- **Layout** (derived): a short **non-rotating hub** on the axis with docking
  cradles on its rim, where a craft holds station against something that does
  not turn; **spokes** from hub to rim, a few and plain; the ring alone, no
  second ring and no cylinder.
- **Power and heat** (derived from canon on the Titan page): sunlight at
  Saturn is about a hundredth of Earth's and *there is no solar power worth
  the name*, so the habitat runs on fusion like the stations below and
  carries **no collector field**; its radiators are large flat plain slabs
  standing out from the hub along the axis, the most visible thing after the
  ring (principle 8).
- **Surface** (principle 5; the *well kept* rule): dull matte composite in
  greys, the honest seams of its panels, unmarked, two centuries old and kept;
  nothing lit but a few steady points at the cradles and the small ports a
  home has. Not a warship and not a glossy thing: a civil post built by an
  authoritarian government and lived in by civilians.
- **What a picture shows** (for `images.md`): the ring whole and small
  against Titan's featureless orange globe, the gap between them empty, the
  hub still with its cradles and radiators, hard thin sunlight from one side;
  Saturn, if it appears, far off and with its rings edge-on, since Titan
  orbits in Saturn's ring plane. A tether, a tower, a window band, a second
  ring, a cylinder or a collector field fails the sheet.

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
- Antariksha's hub figures (G): its diameter and length, whether a spine runs the full axis, and where docking sits; the page fixes the drums and the hub's purpose and nothing else.
- Ligeia's ring figures (H): its diameter and spin rate, how many spokes, how many people it holds, and whether its hub carries the Authority's docks alone or a landing-craft yard as well; the page fixes full spin gravity, high orbit around Titan and the ring, and nothing else.
- The High Captain's command ship (principle 12): its class name, its size, how a session is hosted (whose ship, by rotation or by the Triumvirate's), and whether it gets a sheet (G) before any page or picture needs it.
- Whether these sheets become a lore page (*Hulls of the Record*, Technology)
  once he has ruled on the open items; until then they are planning.
