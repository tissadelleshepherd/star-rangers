#!/usr/bin/env node
// LOCAL AUTHORING TOOL - not part of the build or CI (its unit test is in npm test).
//
// Builds peoples.json for the Peoples and Bodies reference artefact (Dermot's
// "Yes please", 20 October 2026, to a board showing, for every people in the
// record, the body plan, the frame and the colours, whether a body design
// exists in story-bible/species-design.md, which characters have portraits,
// and whether each portrait matches the design). It reads four places in the
// record and nothing else:
//
//   1. the people pages: every lore page in category "Species", the extra
//      people pages scripts/extract-places-and-peoples.js names, and the
//      peoples the place pages name without a page of their own;
//   2. src/lore/cross-biosphere-taxonomy.md's frames table, for each people's
//      frame (or the people's own page, where it states one the table lacks);
//   3. story-bible/species-design.md, for whether a people has a body section,
//      its heading and date, and a body-plan line and a colour line taken
//      from that section by anchor phrase;
//   4. src/characters/, for every character whose `species:` front matter
//      names the people, its `image:` and `image_alt`; and story-bible/
//      images.md where a portrait's standing against the design is recorded.
//
//     node scripts/extract-peoples.js <outfile>
//
// The artefact is a view of the record, never a second copy of it (Dermot's
// rule of 9 October 2026). The hand-made part is the rule table below: which
// peoples there are, which section of the design note is each one's body,
// which phrase in it carries the body plan and which the colour, and how each
// portrait stands against the design. Every reading carries a quote copied
// from the record, and the script checks each quote is still there (Markdown
// links and emphasis stripped). A missing quote, a missing heading, a
// portrait the table does not account for, or a people page the table lacks
// is a failure, so a page or a design that changes under a rule is caught at
// the next release; fix the rule, never the data. Uses only Node built-ins
// plus gray-matter.
"use strict";
const fs = require("fs");
const path = require("path");
const { checkText, urlFor } = require("./extract-designs");
const { PEOPLE_RULES, EXTRA_PEOPLE_PAGES } = require("./extract-places-and-peoples");

const REPO_ROOT = path.resolve(__dirname, "..");
const DESIGN_FILE = "story-bible/species-design.md";
const TAXONOMY_FILE = "src/lore/cross-biosphere-taxonomy.md";
const IMAGES_FILE = "story-bible/images.md";

const STATUS = {
  done: "design and portraits",
  pending: "design, portraits pending",
  undesigned: "portraits without a design",
  none: "no design yet",
  notRelevant: "body not relevant",
};

// How a portrait stands against its people's design:
//   agrees        made or judged against the design, as the record says;
//   kept          filed before the design and kept by his direction;
//   predates      made before the design and not re-made since;
//   no-design     a portrait of a people with no body section to check against;
//   not-relevant  a people whose body the record says is not relevant;
//   none          the character has no portrait.
const CHECKS = ["agrees", "kept", "predates", "no-design", "not-relevant", "none"];

// Species strings on character pages that name no people: humans (the
// reader's own frame; the record's human peoples are not designed bodies),
// machine minds, Earth animals and the meta-dimensional. A species that
// matches neither a people below nor this list is reported.
const NOT_A_PEOPLE = ["Human", "AI ", "Robot", "Cat", "Cyber-Enhanced Cat", "Rabbit", "Raven", "Bumblebee", "Vessik", "Meta-dimensional", "Person, kind not established"];

// The 13 August note's five sections are what the record already forced
// about a body; the later sections are body sheets. `scope` says which.
const FORCED = "what the record already forces about the body (the 13 August note)";

// The peoples. `page` is the people's own page where it has one, else the
// page that names it. `places` names the people's slug in
// extract-places-and-peoples.js where it has one (every one there must be
// here). `frame` is given only where the taxonomy table does not carry the
// people; the table is read for the rest. `design.heading` is matched
// against the start of a "## " or "### " heading in species-design.md (the
// first match); `body` and `colour` are anchor phrases inside that section,
// and the sentence holding each is the line shown. `pageBody` is a sentence
// from a page that carries the body itself. `portraits` gives each
// character's check against the design, with a quote from the record.
const PEOPLES = [
  {
    id: "cerebraun", name: "Cerebraun", page: "src/lore/cerebraun.md", places: "cerebraun", species: ["Cerebraun"],
    design: {
      heading: "Cerebraun — the body behind the likeness", scope: "body sheet",
      date: { text: "drafted 13 October 2026; ruled 13 October 2026", quote: "Status: ruled 13 October 2026" },
      body: "Proposed: eight in two tiers of four", colour: "colour at rest quiet and uniform",
    },
    pageBody: ["src/lore/cerebraun.md", "eight primary limbs carries its own semi-autonomous ganglion"],
    portraits: {
      sohrel: { check: "agrees", evidence: [IMAGES_FILE, "There is no cephalopod in it."], note: "Filed 13 October 2026, the night the body was ruled." },
      tavesh: { check: "agrees", evidence: ["src/characters/tavesh.md", "small dark eyes set along the limbs"], note: "Briefed from the species page and Sohrel's entry, point for point." },
    },
  },
  {
    id: "chthonari", name: "Chthonari", page: "src/lore/chthonari.md", places: "chthonari", species: ["Chthonari"],
    design: {
      heading: "Vessik and the Chthonari — the Undersong Belt", scope: FORCED,
      date: { text: "13 August 2026", quote: "Started 13 August 2026" },
      body: "the Chthonari are already committed", colour: null,
    },
    pageBody: ["src/lore/chthonari.md", "six-limbed, exoskeletal, and built low and dense"],
    portraits: {
      kattik: { check: "agrees", evidence: ["src/characters/kattik.md", "a small six-legged Chthonari"], note: "Filed 11 October 2026 with Tekka, Tsikk and Tikket as one set." },
      kettsa: { check: "agrees", evidence: ["src/characters/kettsa.md", "a small six-legged Chthonari"], note: "Filed 19 October 2026 from the two filed Chthonari frames as references." },
      tekka: { check: "agrees", evidence: ["src/characters/tekka.md", "a small six-legged Chthonari"], note: "" },
      tikket: { check: "agrees", evidence: ["src/characters/tikket.md", "a small six-legged Chthonari"], note: "" },
      tsikk: { check: "agrees", evidence: ["src/characters/tsikk.md", "a small six-legged Chthonari"], note: "" },
    },
  },
  {
    id: "ilveth", name: "Ilveth", page: "src/lore/ilveth.md", places: "ilveth", species: ["Ilveth"],
    frame: null, design: null,
    designNote: ["The species note records the people as designed by its method straight onto the lore page", "Designed by this file's method"],
    pageBody: ["src/lore/ilveth.md", "An Ilveth is long and low"],
    portraits: {},
  },
  {
    id: "krenyi", name: "Krenyi (Quiet-Built)", page: "src/lore/krenyi.md", places: "krenyi", species: ["Krenyi"],
    design: null,
    designNote: ["The Krenyi are the pattern the other bodies follow, on the one other human frame; the note has no body section for them", "gets a lore page on the pattern of Krenyi"],
    pageBody: ["src/lore/krenyi.md", "The Krenyi are the only other people the record holds built on the human frame"],
    portraits: {
      syra: { note: "Her portrait settled the Krenyi look on 14 October 2026; the others carry it as reference." },
    },
  },
  {
    id: "levrils", name: "Levrils", page: "src/lore/levrils.md", places: "levrils", species: ["Levril"],
    design: null,
    bodyNotRelevant: { reason: "A Levril has no form an observer could receive; what is seen is a manifestation.", evidence: ["src/lore/levrils.md", "A Levril has no form a time-bound observer could receive directly"] },
    portraits: {},
  },
  {
    id: "mnemari", name: "Mnemari", page: "src/lore/mnemari.md", places: "mnemari", species: ["Mnemari"],
    frame: { name: "Endoskelia", evidence: ["src/lore/mnemari.md", "is filed in the frame Endoskelia, and is not on the human frame"] },
    design: {
      heading: "Mnemari — a body from Ilenne", scope: "body sheet, re-made",
      date: { text: "19 October 2026; the body re-made 20 October 2026", quote: "The body (re-made 20 October 2026; proposed unless marked)" },
      body: "Three legs, so it stands on a stable triangle whatever the ground", colour: "deep ochre and russet across the body",
      note: ["The tripod with a slung body and a head on a long neck replaced the six-limbed walker of 19 October", "Dermot rejected it after three rounds"],
    },
    portraits: {
      ulessa: { check: "agrees", evidence: ["src/characters/ulessa.md", "standing on three tall arched legs that meet at a hub above her"], note: "Filed 20 October 2026 in the re-made body, after nine rounds." },
    },
  },
  {
    id: "ollune", name: "Ollune (the Held)", page: "src/lore/ollune.md", places: "ollune", species: ["Ollune"],
    frame: null, design: null,
    pageBody: ["src/lore/ollune.md", "Lift is not a property an Ollune has; it is a bill an Ollune pays."],
    portraits: {},
  },
  {
    id: "ovruhn", name: "Ovruhn (Deep-Sung)", page: "src/lore/ovruhn.md", places: "ovruhn", species: ["Ovruhn"],
    frame: null, design: null,
    designNote: ["The species note records the people as designed by its method straight onto the lore page", "Designed by this file's method, and a direct continuation"],
    pageBody: ["src/lore/ovruhn.md", "An Ovruhn is among the largest bodies in Corps service"],
    portraits: {},
  },
  {
    id: "pelagene-littoral", name: "Pelagene Littoral", page: "src/lore/pelagene-littoral.md", places: "pelagene-littoral", species: ["Pelagene Littoral"],
    design: {
      heading: "Pelagene Littoral — an ocean world", scope: FORCED,
      date: { text: "13 August 2026", quote: "Started 13 August 2026" },
      body: "Buoyancy control implies a dedicated organ", colour: null,
    },
    pageBody: ["src/lore/pelagene-littoral.md", "A Pelagene body is accordingly radially symmetrical about a vertical axis"],
    portraits: {
      "mira-of-brine": { check: "agrees", evidence: [IMAGES_FILE, "a rounded radial body with vertical folds"], note: "Filed 13 October 2026, replacing a humanoid emblem card." },
    },
  },
  {
    id: "prismeri", name: "Prismeri", page: "src/lore/prismeri.md", places: "prismeri", species: ["Prismeri"],
    frameNote: ["The page gives the Prismeri a shell: the taxonomy table files them in Endoskelia", "src/lore/prismeri.md", "hardened, gold-and-blue chitin plating replaces the soft grey-violet exoskeleton"],
    design: {
      heading: "Prismeri — Prismere", scope: "body sheet",
      date: { text: "derived 3 September 2026; body sheet 14 October 2026", quote: "The body sheet: flight, shell, neck and tail against Prismere's physics (drafted 14 October 2026)" },
      body: "wings as forelimbs, not as an addition to arms", colour: "soft grey-violet in First Wings",
    },
    pageBody: ["src/lore/prismeri.md", "The frame is a flier's"],
    portraits: {},
  },
  {
    id: "serephine-dunekin", name: "Serephine Dunekin", page: "src/lore/serephine-dunekin.md", places: "serephine-dunekin", species: ["Serephine Dunekin"],
    design: {
      heading: "Serephine Dunekin — Kharis Belt IV", scope: FORCED,
      date: { text: "13 August 2026", quote: "Started 13 August 2026" },
      body: "gas exchange at low partial pressure wants surface area", colour: "High UV argues for an opaque, reflective or actively shielding integument",
    },
    pageBody: ["src/lore/serephine-dunekin.md", "The body is closed for most of the day"],
    portraits: {
      "sethka-ru": { check: "agrees", evidence: ["src/characters/sethka-ru.md", "a low pale sealed carapace held clear of the ground on six slender radial limbs"], note: "" },
    },
  },
  {
    id: "the-tally", name: "The Tally", page: "src/lore/the-tally.md", places: "the-tally", species: [],
    frame: { name: "Endoskelia", evidence: [TAXONOMY_FILE, "Endoskelia contains humans and Krenyi"] },
    design: null,
    bodyNotRelevant: { reason: "A human people, on the reader's own frame: there is no body to design.", evidence: ["src/lore/the-tally.md", "Every human people on the record can point at an older one behind it."] },
    portraits: {},
  },
  {
    id: "verdani", name: "Verdani", page: "src/lore/verdani.md", places: "verdani", species: ["Verdani"],
    design: {
      heading: "Verdani — Verdance", scope: FORCED,
      date: { text: "13 August 2026", quote: "Started 13 August 2026" },
      body: "a body that presents area to the sky", colour: null,
    },
    pageBody: ["src/lore/verdani.md", "A Verdani is not humanoid, and the reason is arithmetic rather than aesthetics."],
    portraits: {
      "isren-farrowkin": { check: "agrees", evidence: ["src/characters/isren-farrowkin.md", "with no head and no face"], note: "Filed 12 October 2026 (century batch 6)." },
    },
  },
  {
    id: "veyr-basaltborn", name: "Veyr Basaltborn", page: "src/lore/veyr-basaltborn.md", places: "veyr-basaltborn", species: ["Veyr Basaltborn"],
    design: {
      heading: "Veyr Basaltborn — Veyr-3", scope: FORCED,
      date: { text: "13 August 2026", quote: "Started 13 August 2026" },
      body: "High gravity favours low, broad, short-limbed, heavily braced", colour: null,
    },
    pageBody: ["src/lore/veyr-basaltborn.md", "The load-bearing structure is an external lattice of fine chitinous members"],
    portraits: {
      "qiren-tal": { check: "agrees", evidence: ["src/characters/qiren-tal.md", "The body is an open lattice of fine dark iridescent struts with no solid trunk", IMAGES_FILE, "Keep the filed portrait for now"], note: "The body matches; the filed frame is kept with a recorded gap, since every round since 10 October drew the lattice as a rendered spider." },
    },
  },
  {
    id: "the-told", name: "The Told (Pandoids of Fliade)", page: "src/glossary/the-told.md", places: null, species: ["Pandoid"],
    frame: { name: "Endoskelia", evidence: ["src/lore/planets/fliade.md", "they fall in Endoskelia"] },
    design: {
      heading: "The Told — a second warm's body", scope: "a second warm only: the body for Pandoids of another community",
      date: { text: "19 October 2026", quote: "The Told — a second warm's body (19 October 2026" },
      body: "A blunt face with very small eyes nearly hidden in the fur", colour: "thick fur that reads as grey against the stone",
      note: ["The design is for a second warm; the four filed Told frames are the first warm's and are kept as they are", "keeps the four filed Told frames as they are"],
    },
    pageBody: ["src/lore/planets/fliade.md", "They are large, powerfully built and upright, with thick fur that reads as grey against the stone"],
    portraits: {
      "stone-first": { check: "kept", evidence: [DESIGN_FILE, "keeps the four filed Told frames as they are"], note: "The first warm, filed before the second-warm design; kept by his direction of 19 October." },
      teddy: { check: "kept", evidence: [DESIGN_FILE, "keeps the four filed Told frames as they are"], note: "The first warm; kept by his direction of 19 October." },
      "went-round": { check: "kept", evidence: [DESIGN_FILE, "keeps the four filed Told frames as they are"], note: "The first warm; kept by his direction of 19 October." },
      "keeps-a-hand-on-it": { check: "kept", evidence: [DESIGN_FILE, "keeps the four filed Told frames as they are"], note: "The first warm; kept by his direction of 19 October." },
    },
  },
  {
    id: "meridian-sapients", name: "Meridian sapients", page: "src/lore/planets/meridian.md", places: null, species: ["Meridian sapient"],
    frame: null, design: null,
    pageBody: ["src/lore/planets/meridian.md", "The most advanced of Meridian's native crustacean lines are themselves sapient"],
    portraits: {
      "sixth-course": { note: "Briefed from the planet page alone, since the record has no species page for Meridian's people." },
    },
  },
  {
    id: "spiralites", name: "Spiralites", page: "src/lore/planets/corryn.md", places: null, species: ["Spiralite"],
    frame: null, design: null,
    pageBody: ["src/lore/planets/corryn.md", "The indigenous people are the Spiralites: semi-translucent, with bioluminescent"],
    portraits: {},
  },
  {
    id: "doreth", name: "Doreth", page: "src/lore/planets/aspenar.md", places: null, species: ["Doreth"],
    frame: null, design: null,
    pageBody: ["src/lore/planets/aspenar.md", "the Doreth, a heavy-built, radiation-tolerant people"],
    portraits: {},
  },
];

// ---------------------------------------------------------------------------

let matter = null;
function fm(raw) {
  if (!matter) matter = require("gray-matter");
  return matter(raw);
}

// Headings of the design note: "## " and "### ", each with the text up to the
// next heading of the same or a higher level (so a "## " section carries its
// "### " subsections), and the "## " heading it sits under.
function parseSections(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const heads = [];
  lines.forEach((l, i) => { const m = l.match(/^(#{2,3})\s+(.*)$/); if (m) heads.push({ level: m[1].length, heading: m[2].trim(), line: i }); });
  let parent = null;
  return heads.map((h, k) => {
    if (h.level === 2) parent = h.heading;
    let end = lines.length;
    for (let j = k + 1; j < heads.length; j++) if (heads[j].level <= h.level) { end = heads[j].line; break; }
    return { level: h.level, heading: h.heading, parent: h.level === 2 ? null : parent, line: h.line + 1, text: lines.slice(h.line + 1, end).join("\n") };
  });
}

// The frames table: "| **Frame** | strategy | members |", members split on
// ";" with each one's link (if any) kept.
function parseFrames(text) {
  const out = [];
  for (const l of text.replace(/\r\n/g, "\n").split("\n")) {
    const m = l.match(/^\|\s*\*\*([A-Z][a-z]+)\*\*\s*\|\s*([^|]+)\|\s*([^|]+)\|/);
    if (!m) continue;
    const members = m[3].split(";").map(s => s.trim()).filter(Boolean).map(s => {
      const link = s.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      return link ? { text: link[1], url: link[2] } : { text: s, url: null };
    });
    out.push({ frame: m[1], structure: m[2].trim(), members });
  }
  return out;
}

// The sentence of `text` (already through checkText) that holds `anchor`,
// or null. A sentence runs from the last ". ", "? ", "! " or bullet before
// the anchor to the first ". " after it.
function sentenceAt(text, anchor) {
  const idx = text.indexOf(anchor);
  if (idx < 0) return null;
  let start = 0;
  for (const mark of [". ", "? ", "! ", " - ", "| "]) {
    const k = text.lastIndexOf(mark, idx);
    if (k >= 0 && k + mark.length > start) start = k + mark.length;
  }
  if (/[.?!]$/.test(anchor)) return trimLine(text.slice(start, idx + anchor.length));
  const tail = text.slice(idx + anchor.length);
  const stop = tail.search(/[.?!](\s|$)|\s-\s|\s\|/);
  let end = stop < 0 ? text.length : idx + anchor.length + stop + (/[.?!]/.test(tail[stop]) ? 1 : 0);
  return trimLine(text.slice(start, end));
}
function trimLine(s) {
  s = s.trim();
  if (s.length > 420) s = s.slice(0, 417).replace(/\s+\S*$/, "") + "…";
  return s;
}

// Text a line is cut from: headings dropped (they would run into the
// sentence after them once whitespace is folded) and words a line wrap
// hyphenated across a line break ("level-" then "spined") joined again.
function proseText(raw) {
  return checkText(String(raw).replace(/^#+\s.*$/gm, "").replace(/(\w)-\r?\n\s*(\w)/g, "$1-$2"));
}

function statusFor(p) {
  if (p.bodyNotRelevant) return STATUS.notRelevant;
  const pictured = p.characters.filter(c => c.check !== "none");
  if (p.design) {
    if (p.characters.length && p.characters.every(c => c.check === "agrees" || c.check === "kept")) return STATUS.done;
    return STATUS.pending;
  }
  return pictured.length ? STATUS.undesigned : STATUS.none;
}

function build(root = REPO_ROOT, peoples = PEOPLES, opts = {}) {
  const placesRules = opts.placesRules || PEOPLE_RULES;
  const extraPages = opts.extraPages || EXTRA_PEOPLE_PAGES;
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
  function evidence(list, where) {
    // [file, quote, file, quote ...] or [file, quote, quote]: a quote that is
    // a path to an existing-looking file starts a new group.
    let file = null;
    const out = [];
    for (const item of list) {
      if (/^(src|story-bible)\/.+\.md$/.test(item)) { file = item; continue; }
      quoteIn(file, item, where);
      out.push({ file, quote: item });
    }
    return out;
  }

  const design = read(DESIGN_FILE);
  if (!design) throw new Error(DESIGN_FILE + " not found");
  const sections = parseSections(design.raw);
  const tax = read(TAXONOMY_FILE);
  if (!tax) throw new Error(TAXONOMY_FILE + " not found");
  const frames = parseFrames(tax.raw);

  // Every people page the places extractor knows, and every Species lore
  // page, has a row here.
  for (const slug of Object.keys(placesRules)) if (!peoples.some(p => p.places === slug)) failures.push(`extract-places-and-peoples.js names the people ${slug}, which has no row in PEOPLES`);
  const loreDir = path.join(root, "src", "lore");
  if (fs.existsSync(loreDir)) {
    for (const name of fs.readdirSync(loreDir)) {
      if (!name.endsWith(".md")) continue;
      const f = read("src/lore/" + name);
      const slug = name.replace(/\.md$/, "");
      if (f && (f.data.category === "Species" || extraPages.includes(slug)) && !peoples.some(p => p.page === "src/lore/" + name)) failures.push(`src/lore/${name} is a people page with no row in PEOPLES`);
    }
  }

  // Characters, by species.
  const charDir = path.join(root, "src", "characters");
  const chars = fs.existsSync(charDir) ? fs.readdirSync(charDir).filter(n => n.endsWith(".md") && n !== "index.md").sort().map(n => {
    const file = "src/characters/" + n;
    const f = read(file);
    return { id: n.replace(/\.md$/, ""), file, data: f.data, species: f.data.species == null ? "" : String(f.data.species) };
  }) : [];
  const claimed = new Set();

  const seen = new Set();
  const out = peoples.map(r => {
    const where = `people ${r.id}`;
    if (seen.has(r.id)) failures.push(`${where}: duplicate id`);
    seen.add(r.id);
    const page = read(r.page);
    if (!page) failures.push(`${where}: ${r.page} does not exist`);
    if (r.places && !placesRules[r.places]) failures.push(`${where}: places slug ${r.places} is not in extract-places-and-peoples.js`);
    const pageUrl = urlFor(r.page, page && page.data);

    // Frame: the rule's, checked against its quote, else the table's row
    // whose members link this page.
    let frame = null;
    const row = frames.find(fr => fr.members.some(m => m.url && pageUrl && m.url.replace(/^\/star-rangers/, "") === pageUrl));
    if (r.frame) {
      const ev = evidence(r.frame.evidence, `${where} frame`);
      const fr = frames.find(x => x.frame === r.frame.name);
      if (!fr) failures.push(`${where}: frame ${r.frame.name} is not in the taxonomy table`);
      if (row && row.frame !== r.frame.name) failures.push(`${where}: the rule says ${r.frame.name}, the taxonomy table ${row.frame}`);
      frame = { name: r.frame.name, structure: fr ? fr.structure : null, source: ev[0] ? ev[0].file : null, quote: ev[0] ? ev[0].quote : null };
    } else if (row) {
      frame = { name: row.frame, structure: row.structure, source: TAXONOMY_FILE, quote: null };
    }
    const frameNote = r.frameNote ? { text: r.frameNote[0], evidence: evidence(r.frameNote.slice(1), `${where} frameNote`) } : null;

    // The design section.
    let des = null;
    if (r.design) {
      const s = sections.find(x => x.heading.startsWith(r.design.heading));
      if (!s) failures.push(`${where}: no heading starting "${r.design.heading}" in ${DESIGN_FILE}`);
      else {
        const text = proseText(s.text);
        quoteIn(DESIGN_FILE, r.design.date.quote, `${where} date`);
        const line = (anchor, key) => {
          if (!anchor) return null;
          const got = sentenceAt(text, anchor.replace(/\s+/g, " "));
          if (!got) failures.push(`${where}: ${key} anchor not found in its section "${s.heading}": "${anchor}"`);
          return got;
        };
        des = {
          heading: checkText(s.heading).trim(), parent: s.parent, line: s.line, scope: r.design.scope, date: r.design.date.text,
          body: line(r.design.body, "body"), colour: line(r.design.colour, "colour"),
          note: r.design.note ? { text: r.design.note[0], evidence: evidence([DESIGN_FILE, r.design.note[1]], `${where} design note`) } : null,
        };
      }
    }
    const designNote = r.designNote ? { text: r.designNote[0], evidence: evidence([DESIGN_FILE, r.designNote[1]], `${where} designNote`) } : null;
    let pageBody = null;
    if (r.pageBody) {
      const [file, anchor] = r.pageBody;
      const f = read(file);
      if (quoteIn(file, anchor, `${where} pageBody`)) pageBody = { file, text: sentenceAt(proseText(f.data && f.raw ? fm(f.raw).content : f.raw), anchor) };
    }
    const bnr = r.bodyNotRelevant ? { reason: r.bodyNotRelevant.reason, evidence: evidence(r.bodyNotRelevant.evidence, `${where} bodyNotRelevant`) } : null;

    // Characters of this people.
    const mine = chars.filter(c => r.species.some(s => c.species === s || c.species.startsWith(s + " ") || c.species.startsWith(s + " (")));
    for (const c of mine) claimed.add(c.id);
    for (const id of Object.keys(r.portraits)) if (!mine.some(c => c.id === id)) failures.push(`${where}: portrait rule names ${id}, which is not a character of this people`);
    const characters = mine.map(c => {
      const rule = r.portraits[c.id] || {};
      const image = c.data.image ? String(c.data.image) : null;
      let check;
      if (!image) check = "none";
      else if (bnr) check = "not-relevant";
      else if (!des) check = "no-design";
      else check = rule.check;
      if (image && des && !rule.check) failures.push(`${where}: the portrait of ${c.id} has no check in the rule table`);
      if (rule.check && rule.check !== check) failures.push(`${where}: ${c.id} is '${rule.check}' in the rule table but '${check}' by the record`);
      if (check && !CHECKS.includes(check)) failures.push(`${where}: ${c.id} check '${check}' is not one of ${CHECKS.join(", ")}`);
      if (image && !fs.existsSync(path.join(root, "src", "images", "characters", image))) failures.push(`${where}: src/images/characters/${image} does not exist`);
      const ev = rule.evidence ? evidence(rule.evidence, `${where} portrait ${c.id}`) : [];
      return {
        id: c.id, title: c.data.title ? String(c.data.title) : c.id, url: urlFor(c.file, c.data), species: c.species,
        image: image ? "src/images/characters/" + image : null, alt: c.data.image_alt ? String(c.data.image_alt) : null,
        check, evidence: ev, note: rule.note || "",
      };
    });

    let picture = null;
    if (page && page.data.image && page.data.category === "Species") {
      const img = String(page.data.image);
      const found = ["lore", "lore/planets", "glossary"].map(d => "src/images/" + d + "/" + img).find(p => fs.existsSync(path.join(root, p)));
      if (found) picture = { path: found, alt: page.data.image_alt ? String(page.data.image_alt) : null };
      else warnings.push(`${where}: ${r.page}'s image ${img} is not on disk`);
    }
    const people = {
      id: r.id, name: r.name,
      page: { file: r.page, title: page && page.data.title ? String(page.data.title) : null, url: pageUrl, picture },
      frame, frameNote, design: des, designNote, pageBody, bodyNotRelevant: bnr, characters,
    };
    people.status = statusFor(people);
    return people;
  });

  for (const c of chars) {
    if (claimed.has(c.id) || !c.species) continue;
    if (NOT_A_PEOPLE.some(s => c.species.startsWith(s))) continue;
    warnings.push(`${c.file}: species "${c.species}" names no people in the table`);
  }

  const count = Object.fromEntries(Object.values(STATUS).map(v => [v, out.filter(p => p.status === v).length]));
  const data = {
    version: JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version,
    source: `${DESIGN_FILE}; ${TAXONOMY_FILE}; the people pages; src/characters/; ${IMAGES_FILE}`,
    statuses: Object.values(STATUS),
    checks: CHECKS,
    counts: { peoples: out.length, characters: out.reduce((n, p) => n + p.characters.length, 0), portraits: out.reduce((n, p) => n + p.characters.filter(c => c.image).length, 0), byStatus: count },
    frames: frames.map(f => ({ frame: f.frame, structure: f.structure, members: f.members.map(m => m.text) })),
    peoples: out,
  };
  return { data, failures, warnings };
}

module.exports = { parseSections, parseFrames, sentenceAt, proseText, statusFor, build, PEOPLES, STATUS, CHECKS };

if (require.main === module) {
  const outfile = process.argv[2];
  if (!outfile) { console.error("usage: node scripts/extract-peoples.js <outfile>"); process.exit(1); }
  const { data, failures, warnings } = build();
  for (const w of warnings) console.warn("warning: " + w);
  if (failures.length) {
    console.error("Extraction failed; the rule table no longer matches the record:");
    for (const f of failures) console.error("  " + f);
    process.exit(1);
  }
  fs.writeFileSync(outfile, JSON.stringify(data, null, 2) + "\n");
  console.log(`wrote ${outfile}: ${data.counts.peoples} peoples, ${data.counts.characters} characters, ${data.counts.portraits} portraits; by status ${JSON.stringify(data.counts.byStatus)}`);
}
