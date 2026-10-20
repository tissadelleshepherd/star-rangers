#!/usr/bin/env node
// LOCAL AUTHORING TOOL - not part of the build or CI (its unit test is in npm test).
//
// Builds designs.json for the station and starship designs reference artefact
// (Dermot's direction, 19 October 2026: "keep track of station and starship
// designs - make an artefact if needed"). It reads three places in the record
// and nothing else:
//
//   1. story-bible/starship-design.md: the numbered principles, the lettered
//      blueprint sheets ("### A. ..."), each sheet's "- **Label** ..." lines,
//      and the open items;
//   2. the pages that name each design (lore, characters, chapters, codex,
//      timeline), for titles, links, images and the quoted evidence below;
//   3. story-bible/images.md, for whether each picture was made against its
//      sheet, and for the photorealism audit's list of images sent through
//      the starship-design loop.
//
//     node scripts/extract-designs.js <outfile>
//
// The artefact is a view of the record, never a second copy of it (Dermot's
// rule of 9 October 2026). The hand-made part is the rule tables below: which
// designs there are, their kind, sheet, owner and era, which sheet lines carry
// which derived fact, and how each picture stands against its sheet. Every
// reading carries a quote copied from the record, and the script checks each
// quote is still there (Markdown links and emphasis stripped). A missing quote,
// a missing file, or a picture the tables do not account for is a failure, so
// a page or a sheet that changes under a rule is caught at the next release;
// fix the rule, never the data. Uses only Node built-ins plus gray-matter.
"use strict";
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const SHEET_FILE = "story-bible/starship-design.md";
const IMAGES_FILE = "story-bible/images.md";

const KINDS = ["ship", "station", "habitat", "ring", "platform", "ark"];
const STATUS = {
  agree: "sheet and image agree",
  loop: "image predates sheet / needs the starship-design loop",
  none: "no sheet yet",
  noImage: "sheet, no image yet",
};

// Which lines of each sheet carry which derived fact. A label is matched
// against the start of a line's bold text; a label no longer on its sheet is
// a failure. An empty list means the sheet says nothing on that question.
const SHEET_FACTS = {
  A: { spin: ["Weight"], power: [], heat: ["Layout"], drive: ["Drive"] },
  B: { spin: ["Shape"], power: [], heat: ["Heat"], drive: ["Fold plant"] },
  C: { spin: ["Shape"], power: [], heat: ["Shape"], drive: [] },
  D: { spin: ["Figures"], power: [], heat: [], drive: [] },
  E: { spin: ["Shape"], power: [], heat: ["Shape"], drive: [] },
  F: { spin: [], power: [], heat: [], drive: ["Launch", "Shape"] },
  G: { spin: ["Weight", "Why two"], power: ["Sun and power"], heat: ["Heat"], drive: [] },
  H: { spin: ["Weight"], power: ["Power and heat"], heat: ["Power and heat"], drive: [] },
};
const FACT_NAMES = { spin: "Spin and gravity", power: "Power and sun", heat: "Heat and radiators", drive: "Drive" };

// How a picture stands against its design's sheet:
//   agrees    made or judged against the sheet, as images.md (or the page) records;
//   predates  made before the sheet and not re-made since: the starship-design loop;
//   no-sheet  a picture of a design that has no sheet to check against;
//   interior  a view from inside that shows no hull, so nothing to check;
//   card      a designed card, not a picture of the design.
const CHECKS = ["agrees", "predates", "no-sheet", "interior", "card"];

// The designs. `sources[0]` is the main page; when `page` is true its `image:`
// is the design's image and must have a check below. `owner` and `era` carry
// a quote that must appear in one of the sources. `images` paths are relative
// to src/images/. `openItemPrinciples` attaches the open items that name
// those principles. `resolves` names the evidence that an image the photorealism
// audit sent through the starship-design loop has since been through it.
const DESIGNS = [
  {
    id: "currach-ark", name: "Currach-era generation ark (the Currach Fleet's six)", kind: "ark", sheet: "A", principles: [1, 6, 7, 10],
    owner: { text: "the Currach Fleet, founders of the Celtic Union", quote: "the Currach Fleet departed the Solar System in six generation-ark vessels" },
    era: { text: "departed about 2561 to 2589 UCSD", quote: "between approximately 2561 and 2589 UCSD" },
    sources: [["src/lore/the-generation-ark-era.md", "a sealed sublight hull on"], ["src/lore/celtic-union-of-planets.md", "one star for each of the Currach Fleet's six arks"]],
    page: true,
    images: [{ path: "lore/the-generation-ark-era.jpg", check: "agrees", evidence: [IMAGES_FILE, "the drum and the radiators read, nothing lit"], note: "Re-prompted 8 October 2026 from the principles the day after the sheet was written, and filed." }],
  },
  {
    id: "the-tally", name: "The Tally's ark, at the Mooring", kind: "ark", sheet: "A", principles: [10], extraLabels: { spin: ["The Tally's hull"] },
    owner: { text: "the Tally", quote: "a mixed-company generation ark that slipped the Imperium's patrols" },
    era: { text: "moored three centuries before the record's present", quote: "three centuries on" },
    sources: [["src/lore/the-tally.md", "failed its crossing, moored to a body it never named"]],
    page: true,
    images: [{ path: "lore/the-tally.jpg", check: "agrees", evidence: [IMAGES_FILE, "the drum on its bearing and the lines to the surface"], note: "Re-prompted 8 October 2026 against sheet A; the drum turning on a mooring bearing is one of the sheet's two open readings, which is his." }],
  },
  {
    id: "lee-class", name: "Lee-class vessel (the class)", kind: "ship", sheet: "B", principles: [4, 7, 9, 11],
    owner: { text: "the Star Rangers", quote: "is an unarmed Lee-Class vessel of the Star Rangers" },
    era: { text: "in service at the record's present", quote: "is an unarmed Lee-Class vessel of the Star Rangers" },
    sources: [["src/lore/kalypsis-dawn.md", "is an unarmed Lee-Class vessel of the Star Rangers"]],
    images: [{ path: "hero/season-05-explorers.jpg", check: "agrees", evidence: [IMAGES_FILE, "the ship through the port is a spine with two drums amidships and radiators aft, sheet B"], note: "The Season 5 hero: a ship seen through a port, guessed to be a Lee-class (the chapter does not say which hull)." }],
  },
  {
    id: "kalypsis-dawn", name: "Kalypsis Dawn", kind: "ship", sheet: "B", principles: [4, 9, 11],
    owner: { text: "the Star Rangers, under Line Captain Tissadelle Shepherd", quote: "is an unarmed Lee-Class vessel of the Star Rangers, under Line Captain Tissadelle Shepherd" },
    era: { text: "not dated on its page", quote: "is an unarmed Lee-Class vessel" },
    sources: [["src/lore/kalypsis-dawn.md", "built on the principle that a boundary zone cannot be shielded against"]],
    page: true,
    images: [{ path: "lore/kalypsis-dawn.jpg", check: "agrees", evidence: [IMAGES_FILE, "spine, two drums, radiators and bow docking all read"], note: "Held on 7 October at his spacecraft rules, re-prompted 8 October against sheet B, and filed." }],
  },
  {
    id: "hyperfold-platform", name: "Hyperfold Yield Combine rendering platform", kind: "platform", sheet: "C", principles: [8],
    owner: { text: "the Hyperfold Yield Combine, a licensed commercial concern", quote: "A licensed commercial concern that harvested boundary fauna for fold-transit stabiliser" },
    era: { text: "ended at Dock Seven, 2831 UCSD", quote: "It ended at Dock Seven in 2831" },
    sources: [["src/lore/hyperfold-yield-combine.md", "Everything about it was lawful"]],
    page: true,
    images: [{ path: "lore/hyperfold-yield-combine.jpg", check: "agrees", evidence: [IMAGES_FILE, "the radiator field dominates as the sheet says"], note: "Re-prompted 8 October 2026 from the page's process and filed." }],
  },
  {
    id: "greenward", name: "Greenward", kind: "ring", sheet: "D", principles: [6],
    owner: { text: "a human ring, with the Federation of Sentient Beings as host", quote: "one half of a reciprocal instrument with the Federation of Sentient Beings" },
    era: { text: "not dated on its page", quote: "is a single ring in a high circular orbit above Verdance" },
    sources: [["src/lore/greenward-habitat.md", "is a single ring in a high circular orbit above Verdance"]],
    page: true,
    images: [{ path: "lore/greenward-habitat.jpg", check: "agrees", evidence: [IMAGES_FILE, "the only one whose radiator stands along the hub axis"], note: "Re-made 19 October 2026 through the starship-design loop against sheet D: four spokes, a non-rotating hub, a radiator along its axis, nothing docked; filed at Dermot's pick." }],
  },
  {
    id: "guest-ring", name: "The Guest Ring", kind: "ring", sheet: "D", principles: [6],
    owner: { text: "the Federation of Sentient Beings", quote: "habitat in a high orbit above Drithane" },
    era: { text: "not dated on its page", quote: "habitat in a high orbit above Drithane" },
    sources: [["src/lore/the-guest-ring.md", "The habitat has a name in the language of the people who built it"]],
    page: true,
    images: [{ path: "lore/the-guest-ring.jpg", check: "agrees", evidence: [IMAGES_FILE, "the proportions are wrong for a human and nothing is fitted"], note: "The gallery from inside, which is the one thing sheet D says of the Guest Ring; the ring's exterior is not pictured." }],
  },
  {
    id: "single-ring", name: "A single-ring habitat (the house kind, generic)", kind: "ring", generic: true, sheet: "D", principles: [6],
    owner: { text: "none: a generic Compact ring for the Seasons index", quote: "A single-ring habitat, starship-design.md sheet D, the house kind of place" },
    era: { text: "the record's present", quote: "A single-ring habitat, starship-design.md sheet D, the house kind of place" },
    sources: [[IMAGES_FILE, "A single-ring habitat, starship-design.md sheet D, the house kind of place"]],
    images: [{ path: "hero/seasons-orbit.jpg", check: "agrees", evidence: [IMAGES_FILE, "the radiator pair rides the non-rotating hub along the spin axis, as sheet D has it"], resolves: true, note: "The Seasons index hero, filed 11 October 2026 against sheet D." }],
  },
  {
    id: "threshold-station", name: "Threshold Station (a Threshold-class boundary station)", kind: "station", sheet: "E", principles: [11],
    owner: { text: "the Star Rangers Survey Corps", quote: "a mid-grade Survey Corps post built where the Interval between two universes narrows" },
    era: { text: "built about 2813 UCSD", quote: "It was built there, about 2813 UCSD" },
    sources: [["src/lore/threshold-station.md", "a mid-grade Survey Corps post built where the Interval between two universes narrows"], ["src/codex/survey-corps-protocol.md", "Threshold-class"]],
    page: true,
    images: [
      { path: "lore/threshold-station.jpg", check: "agrees", evidence: [IMAGES_FILE, "the far end is one low dark line with three working lights, which is all the record allows"], note: "His own plate, composited 9 October 2026; sheet E leaves the shape open, and the frame keeps the station a silhouette." },
      { path: "hero/season-01.jpg", check: "interior", evidence: [IMAGES_FILE, "so the hero does not show the station from outside"], resolves: true, note: "The Season 1 hero: Dock Seven's chronometers from the watch desk." },
    ],
  },
  {
    id: "ascent-javelin", name: "Ascent javelin", kind: "ship", sheet: "F", principles: [1, 5],
    owner: { text: "civil spaceports on settled worlds", quote: "The craft rides a launch cradle to near-vertical" },
    era: { text: "in service at the record's present", quote: "The craft rides a launch cradle to near-vertical" },
    sources: [["src/lore/ascent-javelins.md", "The craft rides a launch cradle to near-vertical"]],
    page: true,
    images: [
      { path: "lore/ascent-javelins.jpg", check: "agrees", evidence: [IMAGES_FILE, "a pale winged lifting body in its air-breathing climb above cloud, from an escort aircraft, against sheet F"], resolves: true, note: "Re-made 12 October 2026 (century batch 9) against sheet F." },
      { path: "hero/home-launch.jpg", check: "agrees", evidence: [IMAGES_FILE, "the javelin high in its climb with the cradle out of shot"], resolves: true, note: "The share card, round 4 of 11 October 2026, after rounds 2 and 3 failed sheet F." },
    ],
  },
  {
    id: "antariksha", name: "Antariksha", kind: "habitat", sheet: "G", principles: [6, 7, 8],
    owner: { text: "the Orbital Habitats Compact", quote: "is one of the five self-governing habitats of the Orbital Habitats Compact" },
    era: { text: "not dated on its page", quote: "is one of the five self-governing habitats of the Orbital Habitats Compact" },
    sources: [["src/lore/antariksha.md", "is one of the five self-governing habitats of the Orbital Habitats Compact"]],
    page: true,
    images: [{ path: "lore/antariksha.jpg", check: "agrees", evidence: ["src/lore/antariksha.md", "plain dark radiator slabs stand out from the hub, and short stubs at either end carry collectors"], note: "Filed 14 October 2026 from the second round, judged against sheet G; images.md's entry still reads 'generation waits on the desktop'." }],
  },
  {
    id: "ligeia", name: "Ligeia (ex-Outer Administration Station Four)", kind: "ring", sheet: "H", principles: [6, 8],
    owner: { text: "the Titan Settlement Authority; built by the Imperium", quote: "It is the seat of the Titan Settlement Authority" },
    era: { text: "built after 2543 UCSD; handed over after 2609 UCSD", quote: "After the Tycho Accords of 2543 UCSD" },
    sources: [["src/lore/ligeia-habitat.md", "It is the seat of the Titan Settlement Authority"]],
    page: true,
    images: [{ path: "lore/ligeia-habitat.jpg", check: "agrees", evidence: [IMAGES_FILE, "generated and filed 16 October 2026 (#1261)", "a plain grey ring on six spokes around a cylindrical hub"], note: "Written against sheet H on 15 October and filed the next day." }],
  },
  {
    id: "new-london", name: "New London Space Habitat", kind: "habitat", sheet: null, principles: [6],
    owner: { text: "independent; not a Compact member", quote: "New London is not a member of the Orbital Habitats Compact" },
    era: { text: "built in the Crisis Centuries", quote: "built as a refuge for British cultural heritage during the Crisis Centuries" },
    sources: [["src/lore/new-london-space-habitat.md", "Three Stanford torus rings at Earth–Moon L5"]],
    page: true,
    images: [{ path: "lore/new-london-space-habitat.jpg", check: "interior", evidence: [IMAGES_FILE, "The new frame is taken inside a ring"], resolves: true, note: "Principle 6 quotes its canon figures (three tori of 1.5 km, a shade under 1.1 rpm); no sheet." }],
  },
  {
    id: "eden", name: "Eden Space Habitat", kind: "ring", sheet: null, principles: [6],
    owner: { text: "the Orbital Habitats Compact", quote: "including Eden Space Habitat" },
    era: { text: "commissioned 2671 UCSD", quote: "Eden Space Habitat was commissioned in 2671 UCSD" },
    sources: [["src/lore/eden-space-habitat.md", "Eden Space Habitat was commissioned in 2671 UCSD"], ["src/lore/orbital-habitats-compact.md", "including Eden Space Habitat"], ["src/lore/eden-ring-rail.md", "circumferential commuter line"]],
    page: true,
    images: [
      { path: "lore/eden-space-habitat.jpg", check: "card", evidence: ["src/lore/eden-space-habitat.md", "Designed cover for Eden Space Habitat"], note: "A designed card." },
      { path: "lore/eden-ring-rail.jpg", check: "interior", evidence: ["src/lore/eden-ring-rail.md", "A clean rail platform on the inner rim of a ring habitat"], note: "The Ring-Rail page: the inner rim." },
    ],
  },
  {
    id: "halcyon", name: "Halcyon", kind: "habitat", sheet: null, principles: [],
    owner: { text: "the Orbital Habitats Compact", quote: "Three of the five are named on the record: Eden, Halcyon, and Antariksha" },
    era: { text: "not dated", quote: "Three of the five are named on the record: Eden, Halcyon, and Antariksha" },
    sources: [["src/lore/orbital-habitats-compact.md", "Three of the five are named on the record: Eden, Halcyon, and Antariksha"]],
    images: [],
  },
  {
    id: "knarrheim", name: "Knarrheim", kind: "station", sheet: null, principles: [6, 8, 10],
    owner: { text: "the Knarr Line", quote: "the largest hauler-mothership in the Knarr Line's founding fleet" },
    era: { text: "grown over five centuries; unmoved for four", quote: "has not moved under its own power in over four centuries" },
    sources: [["src/lore/knarrheim.md", "the largest hauler-mothership in the Knarr Line's founding fleet"]],
    page: true,
    images: [{ path: "lore/knarrheim.jpg", check: "no-sheet", evidence: [IMAGES_FILE, "Derived through starship-design.md principles 6, 8 and 10"], note: "Re-made 12 October 2026 (century batch 10) from principles 6, 8 and 10; two rings, modules and berths guessed." }],
  },
  {
    id: "nordstjerne", name: "Nordstjerne", kind: "ship", sheet: null, principles: [10],
    owner: { text: "the Knarr Line's founding fleet", quote: "began as the Nordstjerne, the largest hauler-mothership in the Knarr Line's founding fleet" },
    era: { text: "a founding-fleet hull, unmoved for over four centuries", quote: "has not moved under its own power in over four centuries" },
    sources: [["src/lore/knarrheim.md", "original pressure hull is still there, load-bearing and in active use"]],
    images: [{ path: "lore/knarrheim.jpg", check: "no-sheet", evidence: ["src/lore/knarrheim.md", "a long, dark, patched ship's hull at the centre"], note: "Seen at the centre of Knarrheim's picture." }],
  },
  {
    id: "saltvik", name: "Saltvik refinery platforms", kind: "platform", sheet: null, principles: [8],
    owner: { text: "the Knarr Line", quote: "the Knarr Line's hardest-working settlement" },
    era: { text: "worked continuously since the cooperative's early years", quote: "the Line has worked continuously since the coop" },
    sources: [["src/lore/saltvik.md", "is a working cluster of six major ore-refinery platforms and dozens of smaller claim-tenders"]],
    page: true,
    images: [{ path: "lore/saltvik.jpg", check: "card", evidence: ["src/lore/saltvik.md", "Designed cover for Saltvik"], note: "A designed card." }],
  },
  {
    id: "callisto-station", name: "Callisto Station", kind: "station", sheet: null, principles: [8], takesNoSheet: [SHEET_FILE, "Callisto Station", "takes none for the same reason"],
    owner: { text: "the Star Rangers Survey Corps; first post in the Imperium's chain", quote: "an installation, not a polity, and so the Corps' own ground" },
    era: { text: "first post of the chain rebuilt after 2543 UCSD", quote: "When the outer station network was rebuilt after the Tycho Accords of 2543 UCSD, the first post in the chain went to Callisto" },
    sources: [["src/lore/callisto-station.md", "an installation, not a polity, and so the Corps' own ground"]],
    page: true,
    images: [{ path: "lore/callisto-station.jpg", check: "no-sheet", evidence: ["src/lore/callisto-station.md", "three low mounds of shielding over a buried station"], note: "Dug into the ice: what shows is shielding mounds, hatches and a buoy cradle." }],
  },
  {
    id: "stillwater-station", name: "Stillwater Station", kind: "station", sheet: null, principles: [5], takesNoSheet: [SHEET_FILE, "Stillwater is a surface station on an ice shore, not a hull, and takes no sheet"],
    owner: { text: "the Titan Settlement Authority", quote: "where the Titan Settlement Authority's charter was first signed" },
    era: { text: "the oldest surface station on Titan; the charter signed after 2289 CE (2489 UCSD)", quote: "The oldest surface station on Titan" },
    sources: [["src/lore/stillwater-station.md", "The oldest surface station on Titan"]],
    page: true,
    images: [{ path: "lore/stillwater-station.jpg", check: "no-sheet", evidence: ["src/lore/stillwater-station.md", "a cluster of low rounded sealed modules"], note: "A surface station, not a hull." }],
  },
  {
    id: "tsittak", name: "Tsittak", kind: "habitat", sheet: null, principles: [], takesNoSheet: [IMAGES_FILE, "the body is a settlement cut into rock, not a"],
    owner: { text: "the Chthonari", quote: "A Chthonari settlement cut into a lone body of nickel-iron" },
    era: { text: "found 2794 UCSD", quote: "In 2794 UCSD a Ranger survey vessel" },
    sources: [["src/lore/tsittak.md", "A Chthonari settlement cut into a lone body of nickel-iron"]],
    page: true,
    images: [{ path: "lore/tsittak.jpg", check: "no-sheet", evidence: [IMAGES_FILE, "A rock, not a hull"], note: "Cut, not built: a natural body with a recessed dock." }],
  },
  {
    id: "compute-complexes", name: "Orbital compute complexes", kind: "platform", sheet: null, principles: [8],
    owner: { text: "settled worlds (Earth, Mars, Aspenar and others)", quote: "complexes above Earth, Mars, Aspenar and other settled worlds" },
    era: { text: "in service at the record's present", quote: "classical machines without exception" },
    sources: [["src/lore/orbital-compute-complexes.md", "classical machines without exception"]],
    page: true,
    images: [{ path: "lore/orbital-compute-complexes.jpg", check: "no-sheet", evidence: [IMAGES_FILE, "Radiators, not lights."], note: "Principle 8 names this picture as the record's one image of radiators." }],
  },
  {
    id: "navigation-buoy", name: "Survey instrument buoy", kind: "platform", sheet: null, principles: [5],
    owner: { text: "the Star Rangers Navigation and Survey Corps", quote: "The station builds, calibrates and services long-baseline instrument buoys" },
    era: { text: "in service at the record's present", quote: "The station builds, calibrates and services long-baseline instrument buoys" },
    sources: [["src/lore/callisto-station.md", "The station builds, calibrates and services long-baseline instrument buoys"], ["src/lore/star-rangers-navigation-corps.md", "A small plain cylindrical buoy"]],
    images: [{ path: "lore/star-rangers-navigation-corps.jpg", check: "no-sheet", evidence: ["src/lore/star-rangers-navigation-corps.md", "A small plain cylindrical buoy with an antenna mast"], note: "The Navigation Corps page's picture; sheet H's note keeps this shape for Callisto's buoys." }],
  },
  {
    id: "landing-craft", name: "Landing craft", kind: "ship", sheet: null, principles: [1],
    owner: { text: "civil traffic on settled worlds", quote: "Descent belongs to the landing craft" },
    era: { text: "in service at the record's present", quote: "Descent belongs to the landing craft" },
    sources: [["src/lore/ascent-javelins.md", "Descent belongs to the landing craft"]],
    images: [],
  },
  {
    id: "constant-margin", name: "Constant Margin", kind: "ship", sheet: null, principles: [11],
    owner: { text: "out of Eden; Ysolde Pitch's command", quote: "the modified cargo hauler Constant Margin traversed the route" },
    era: { text: "the Eden Passage transit, 2712 UCSD", quote: "In 2712 UCSD, the modified cargo hauler Constant Margin traversed the route" },
    sources: [["src/lore/eden-space-habitat.md", "In 2712 UCSD, the modified cargo hauler Constant Margin traversed the route"], ["src/characters/ysolde-pitch.md", "Constant Margin"]],
    images: [],
  },
  {
    id: "patience-first", name: "Patience First", kind: "ship", sheet: null, principles: [11],
    owner: { text: "out of Eden, six aboard", quote: "the six-person Patience First followed" },
    era: { text: "departed 2714 UCSD; found 2732 UCSD", quote: "Patience First was found in 2732 UCSD" },
    sources: [["src/lore/eden-space-habitat.md", "the six-person Patience First followed"], ["src/timeline/2714-patience-first-departs.md", "modified survey vessel Patience First"]],
    images: [],
  },
  {
    id: "sufficient-cause", name: "Sufficient Cause", kind: "ship", sheet: null, principles: [],
    owner: { text: "the Star Rangers", quote: "off the Star Rangers vessel Sufficient Cause" },
    era: { text: "lost off Dock Seven, 2831 UCSD", quote: "2831 UCSD, Mid-Autumn" },
    sources: [["src/codex/dock-seven-loss-adjustment.md", "off the Star Rangers vessel Sufficient Cause"], ["src/seasons/s05/e02/s05e02c03.md", "2831 UCSD, Mid-Autumn"]],
    images: [],
  },
  {
    id: "fel-trohen", name: "Fel Trohen (a High Captain's command ship)", kind: "ship", sheet: null, principles: [11, 12], openItemPrinciples: [12],
    owner: { text: "the Star Rangers; High Captain Karla Wender", quote: "One is named in the record so far: the Fel Trohen" },
    era: { text: "crewed 2831 UCSD", quote: "2831 UCSD, Late Spring" },
    sources: [["src/lore/star-rangers-command-hierarchy.md", "One is named in the record so far: the Fel Trohen"], ["src/seasons/s05/e00/s05e00c02.md", "2831 UCSD, Late Spring"], ["src/characters/arashobal.md", "Fel Trohen"]],
    images: [],
  },
  {
    id: "restless-verge", name: "Restless Verge", kind: "ship", sheet: null, principles: [11],
    owner: { text: "Lorien the Wanderer, independent contractor", quote: "She flies the Restless Verge, a stripped-down long-range courier hull refitted for solo operation" },
    era: { text: "in service at the record's present", quote: "She flies the Restless Verge" },
    sources: [["src/characters/lorien-the-wanderer.md", "She flies the Restless Verge, a stripped-down long-range courier hull refitted for solo operation"]],
    images: [{ path: "characters/lorien-the-wanderer.jpg", check: "interior", evidence: ["src/characters/lorien-the-wanderer.md", "standing in the compact cabin of her courier ship"], note: "Her portrait, in the cabin." }],
  },
  {
    id: "mereton", name: "Mereton", kind: "ship", sheet: null, principles: [],
    owner: { text: "Asteria's ship (a contemplative-tier block)", quote: "He had been her First Officer for eleven years on the Mereton" },
    era: { text: "not dated; the house keeps no year for it", quote: "the house keeps no year for it" },
    sources: [["src/seasons/s08/e02/s08e02c01.md", "He had been her First Officer for eleven years on the Mereton"]],
    images: [],
  },
];

// ---------------------------------------------------------------------------

let matter = null;
function fm(raw) {
  if (!matter) matter = require("gray-matter");
  return matter(raw);
}

// Text for quote checks: Markdown links reduced to their text, emphasis and
// code marks removed, whitespace folded.
function checkText(raw) {
  return String(raw)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*`]/g, "")
    .replace(/\s+/g, " ");
}

function urlFor(file, data) {
  if (data && typeof data.permalink === "string") return data.permalink.replace(/^\/star-rangers/, "");
  const m = file.match(/^src\/(.+?)(?:\/index)?\.md$/);
  if (!m || file.startsWith("story-bible/")) return null;
  return "/" + m[1] + "/";
}

// Blueprint sheets: "### X. Title", then "- **Label** ..." lines with
// indented continuations. Returns { X: { letter, title, lines: [{label, text}] } }.
function parseSheets(text) {
  text = text.replace(/\r\n/g, "\n");
  const start = text.indexOf("\n## Blueprints");
  if (start < 0) throw new Error(SHEET_FILE + " has no '## Blueprints' section");
  const rest = text.slice(start + 1);
  const end = rest.indexOf("\n## ", 3);
  const section = end < 0 ? rest : rest.slice(0, end);
  const sheets = {};
  for (const block of section.split("\n### ").slice(1)) {
    const lines = block.split("\n");
    const head = lines[0].match(/^([A-Z])\.\s+(.*)$/);
    if (!head) continue;
    const sheet = { letter: head[1], title: head[2].trim(), lines: [] };
    let cur = null;
    for (const raw of lines.slice(1)) {
      const item = raw.match(/^- \*\*([^*]+)\*\*\s*(.*)$/);
      if (item) { cur = { label: item[1].trim(), text: item[2].trim() }; sheet.lines.push(cur); continue; }
      if (cur && /^\s+\S/.test(raw)) { cur.text += " " + raw.trim(); continue; }
      cur = null;
    }
    for (const l of sheet.lines) l.text = l.text.replace(/^:\s*/, "");
    sheets[sheet.letter] = sheet;
  }
  return sheets;
}

// Numbered principles: "N. **Bold.** text", continuations indented.
function parsePrinciples(text) {
  text = text.replace(/\r\n/g, "\n");
  const start = text.indexOf("\n## The principles");
  if (start < 0) throw new Error(SHEET_FILE + " has no '## The principles' section");
  const rest = text.slice(start + 1);
  const section = rest.slice(0, rest.indexOf("\n## ", 3));
  const out = [];
  let cur = null;
  for (const raw of section.split("\n")) {
    const m = raw.match(/^(\d+)\.\s+\*\*([^*]+)\*\*\s*(.*)$/);
    if (m) { cur = { n: Number(m[1]), title: m[2].trim().replace(/\.$/, ""), text: m[3].trim() }; out.push(cur); continue; }
    if (cur && /^\s+\S/.test(raw)) { cur.text += " " + raw.trim(); continue; }
    if (raw.trim() === "") continue;
    cur = null;
  }
  return out;
}

// "## Open items (his)": bullets, each tagged with the sheet letters it names.
function parseOpenItems(text) {
  text = text.replace(/\r\n/g, "\n");
  const start = text.indexOf("\n## Open items");
  if (start < 0) return [];
  const rest = text.slice(start + 1).split("\n").slice(1);
  const out = [];
  let cur = null;
  for (const raw of rest) {
    if (/^## /.test(raw)) break;
    const m = raw.match(/^- (.*)$/);
    if (m) { cur = { text: m[1].trim() }; out.push(cur); continue; }
    if (cur && /^\s+\S/.test(raw)) cur.text += " " + raw.trim();
  }
  // An item belongs to the sheet letters it names before its first colon
  // ("Antariksha's hub figures (G): ..."), and to the principles it names.
  for (const o of out) {
    const head = o.text.split(":")[0];
    o.sheets = Array.from(new Set((head.match(/\(([A-Z])\)/g) || []).map(s => s[1]))).sort();
    o.principles = Array.from(new Set((o.text.match(/principle (\d+)/g) || []).map(s => Number(s.split(" ")[1])))).sort((a, b) => a - b);
  }
  return out;
}

// The audits' starship-design loop: every image images.md sends through it.
// An audit list item ("- `name.jpg` — ... `starship-design` loop.") names its
// own image; elsewhere the names are the backticked ones in the sentence that
// says so ("The ships among the heroes (`a`, `b`) go through the ... loop").
function loopImages(text) {
  const names = new Set();
  const add = s => { if (s !== "starship-design") names.add(s.split("/").pop()); };
  for (const line of text.split(/\r?\n/)) {
    if (!/starship-design` loop/.test(line)) continue;
    const item = line.match(/^- `([a-z0-9/-]+?)(?:\.jpg)?`/);
    if (item) { add(item[1]); continue; }
    for (const sentence of line.split(/(?<=[.;])\s+/)) {
      if (!/starship-design` loop/.test(sentence)) continue;
      for (const m of sentence.matchAll(/`([a-z0-9/-]+?)(?:\.jpg)?`/g)) add(m[1]);
    }
  }
  return Array.from(names).sort();
}

function statusFor(design) {
  if (!design.sheet) return STATUS.none;
  const pictures = design.images.filter(i => i.check === "agrees" || i.check === "predates");
  if (pictures.some(i => i.check === "predates")) return STATUS.loop;
  if (pictures.length) return STATUS.agree;
  return STATUS.noImage;
}

function build(root = REPO_ROOT, designs = DESIGNS, sheetFacts = SHEET_FACTS) {
  const failures = [];
  const warnings = [];
  const cache = new Map();
  function read(file) {
    if (!cache.has(file)) {
      const p = path.join(root, file);
      if (!fs.existsSync(p)) { cache.set(file, null); return null; }
      let raw = fs.readFileSync(p, "utf8");
      if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
      const parsed = file.endsWith(".md") ? fm(raw) : { data: {}, content: raw };
      cache.set(file, { raw, data: parsed.data, text: checkText(raw) });
    }
    return cache.get(file);
  }
  function quoteIn(file, quote, where) {
    const f = read(file);
    if (!f) { failures.push(`${where}: ${file} does not exist`); return false; }
    if (!f.text.includes(quote.replace(/\s+/g, " "))) { failures.push(`${where}: quote not found in ${file}: "${quote}"`); return false; }
    return true;
  }

  const sheetRaw = read(SHEET_FILE);
  if (!sheetRaw) throw new Error(SHEET_FILE + " not found");
  const sheets = parseSheets(sheetRaw.raw);
  const principles = parsePrinciples(sheetRaw.raw);
  const openItems = parseOpenItems(sheetRaw.raw);
  const imagesMd = read(IMAGES_FILE);
  const loop = imagesMd ? loopImages(imagesMd.raw) : [];

  for (const [letter, map] of Object.entries(sheetFacts)) {
    const s = sheets[letter];
    if (!s) { failures.push(`SHEET_FACTS names sheet ${letter}, which is not in ${SHEET_FILE}`); continue; }
    for (const labels of Object.values(map)) for (const label of labels) {
      if (!s.lines.some(l => l.label.startsWith(label))) failures.push(`SHEET_FACTS: sheet ${letter} has no line '${label}'`);
    }
  }
  for (const letter of Object.keys(sheets)) if (!sheetFacts[letter]) warnings.push(`sheet ${letter} (${sheets[letter].title}) has no SHEET_FACTS row`);
  for (const letter of Object.keys(sheets)) if (!designs.some(d => d.sheet === letter)) warnings.push(`sheet ${letter} (${sheets[letter].title}) has no design in the rule table`);

  const seen = new Set();
  const out = designs.map(d => {
    const where = `design ${d.id}`;
    if (seen.has(d.id)) failures.push(`${where}: duplicate id`);
    seen.add(d.id);
    if (!KINDS.includes(d.kind)) failures.push(`${where}: kind '${d.kind}' is not one of ${KINDS.join(", ")}`);
    if (d.sheet && !sheets[d.sheet]) failures.push(`${where}: sheet ${d.sheet} is not in ${SHEET_FILE}`);
    for (const n of d.principles) if (!principles.some(p => p.n === n)) failures.push(`${where}: principle ${n} is not in ${SHEET_FILE}`);

    const sources = d.sources.map(([file, quote]) => {
      quoteIn(file, quote, where);
      const f = read(file);
      return { file, title: f && f.data.title ? String(f.data.title) : null, url: urlFor(file, f && f.data) };
    });
    const texts = d.sources.map(([file]) => file);
    for (const key of ["owner", "era"]) {
      const q = d[key].quote.replace(/\s+/g, " ");
      if (!texts.some(file => { const f = read(file); return f && f.text.includes(q); })) failures.push(`${where}: ${key} quote not found in its sources: "${d[key].quote}"`);
    }

    const images = d.images.map(img => {
      if (!CHECKS.includes(img.check)) failures.push(`${where}: image ${img.path} check '${img.check}' is not one of ${CHECKS.join(", ")}`);
      if (!d.sheet && (img.check === "agrees" || img.check === "predates")) failures.push(`${where}: image ${img.path} is '${img.check}' but the design has no sheet`);
      if (d.sheet && img.check === "no-sheet") failures.push(`${where}: image ${img.path} is 'no-sheet' but the design has sheet ${d.sheet}`);
      if (!fs.existsSync(path.join(root, "src", "images", img.path))) failures.push(`${where}: src/images/${img.path} does not exist`);
      const [efile, ...quotes] = img.evidence;
      for (const q of quotes) quoteIn(efile, q, `${where} image ${img.path}`);
      const base = path.basename(img.path, ".jpg");
      const inLoop = loop.includes(base);
      if (inLoop && !img.resolves && img.check !== "predates") failures.push(`${where}: images.md sends ${img.path} through the starship-design loop; mark it 'predates' or give the evidence that resolves it`);
      const page = d.page && sources[0] ? read(d.sources[0][0]) : null;
      const alt = page && page.data.image && img.path.endsWith("/" + page.data.image) ? String(page.data.image_alt || "") : null;
      return {
        path: "src/images/" + img.path,
        check: img.check,
        checkedAgainstSheet: d.sheet ? (img.check === "agrees" ? true : img.check === "predates" ? false : null) : null,
        auditLoop: inLoop,
        evidence: { file: efile, quotes },
        note: img.note || "",
        alt,
      };
    });
    if (d.page) {
      const page = read(d.sources[0][0]);
      const img = page && page.data.image ? String(page.data.image) : null;
      const dir = d.sources[0][0].startsWith("src/characters/") ? "characters/" : "lore/";
      if (!img) warnings.push(`${where}: ${d.sources[0][0]} has no image:`);
      else if (!d.images.some(i => i.path === dir + img)) failures.push(`${where}: the page's image ${dir}${img} has no check in the rule table`);
    }
    if (d.takesNoSheet) { const [file, ...quotes] = d.takesNoSheet; for (const q of quotes) quoteIn(file, q, `${where} takesNoSheet`); }

    const facts = {};
    for (const key of Object.keys(FACT_NAMES)) {
      const labels = d.sheet && sheetFacts[d.sheet] ? sheetFacts[d.sheet][key].concat((d.extraLabels && d.extraLabels[key]) || []) : [];
      facts[key] = d.sheet && sheets[d.sheet] ? sheets[d.sheet].lines.filter(l => labels.some(lb => l.label.startsWith(lb))).map(l => ({ label: l.label, text: l.text })) : [];
    }
    const design = {
      id: d.id,
      name: d.name,
      kind: d.kind,
      generic: !!d.generic,
      sheet: d.sheet || null,
      sheetTitle: d.sheet && sheets[d.sheet] ? sheets[d.sheet].title : null,
      takesNoSheet: d.takesNoSheet ? { file: d.takesNoSheet[0], quote: d.takesNoSheet.slice(1).join(" … ") } : null,
      principles: d.principles.slice().sort((a, b) => a - b),
      owner: d.owner.text,
      era: d.era.text,
      sources,
      images,
      facts,
      openItems: openItems.filter(o => (d.sheet && o.sheets.includes(d.sheet)) || o.principles.some(n => (d.openItemPrinciples || []).includes(n))).map(o => o.text),
    };
    design.status = statusFor({ sheet: design.sheet, images: design.images });
    return design;
  });

  // Every image the audits send through the loop, and still on disk, is
  // accounted for by a design; a retired picture owes nothing.
  const onDisk = name => ["lore", "hero", "lore/planets", "characters"].some(dir => fs.existsSync(path.join(root, "src", "images", dir, name + ".jpg")));
  for (const name of loop) {
    if (onDisk(name) && !out.some(d => d.images.some(i => path.basename(i.path, ".jpg") === name))) warnings.push(`images.md sends ${name} through the starship-design loop, and no design in the rule table carries it`);
  }

  const count = (key, values) => Object.fromEntries(values.map(v => [v, out.filter(d => d[key] === v).length]));
  const data = {
    version: JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version,
    source: `${SHEET_FILE}; ${IMAGES_FILE}; the pages each design cites`,
    statuses: [STATUS.agree, STATUS.loop, STATUS.none, STATUS.noImage],
    kinds: KINDS,
    factNames: FACT_NAMES,
    counts: { designs: out.length, byKind: count("kind", KINDS), byStatus: count("status", Object.values(STATUS)) },
    auditLoop: loop,
    principles,
    sheets: Object.values(sheets).map(s => ({ letter: s.letter, title: s.title, lines: s.lines })),
    openItems,
    designs: out,
  };
  return { data, failures, warnings };
}

module.exports = { parseSheets, parsePrinciples, parseOpenItems, loopImages, statusFor, checkText, urlFor, build, DESIGNS, SHEET_FACTS, STATUS, KINDS };

if (require.main === module) {
  const outfile = process.argv[2];
  if (!outfile) { console.error("usage: node scripts/extract-designs.js <outfile>"); process.exit(1); }
  const { data, failures, warnings } = build();
  for (const w of warnings) console.warn("warning: " + w);
  if (failures.length) {
    console.error("Extraction failed; the rule tables no longer match the record:");
    for (const f of failures) console.error("  " + f);
    process.exit(1);
  }
  fs.writeFileSync(outfile, JSON.stringify(data, null, 2) + "\n");
  console.log(`wrote ${outfile}: ${data.counts.designs} designs; by kind ${JSON.stringify(data.counts.byKind)}; by status ${JSON.stringify(data.counts.byStatus)}`);
}
