#!/usr/bin/env node
// LOCAL AUTHORING TOOL - not part of the build or CI (its unit test is in npm test).
//
// Builds arcs.json for the Arcs and Threads reference artefact (Dermot's
// "1 - Yes", 20 October 2026, to a board showing, for each storyline thread,
// its seasons, strands and convergences; the arcs open in it and who drives
// each; which are closed by a recognition and which are still open; and
// where the story's present sits in each). It reads these places in the
// record and nothing else:
//
//   1. lib/storyline-threads.js, for the threads, their seasons and tiers,
//      and src/threads/<id>/index.md for each thread's landing page;
//   2. src/seasons/**, for every chapter's season, episode, chapter, title,
//      timestamp, date and povs, and each season's index.md title;
//   3. src/characters/, to resolve a chapter's pov ids to character pages
//      (by filename, front-matter `id`, `pov_ids`, then the pov label), the
//      same order scripts/extract-characters.js uses;
//   4. src/lore/year-zero.md, for the story's present;
//   5. the story bible's Narrative Structure section, the treatments, the
//      Season 6-7 arc treatment, narrative-gaps-checklist.md and
//      open-questions.md, quoted by the rule tables below.
//
//     node scripts/extract-arcs.js <outfile>
//
// The artefact is a view of the record, never a second copy of it (Dermot's
// rule of 9 October 2026). Counts, date spans, viewpoint tallies, the latest
// chapter by in-world date and the chapter an arc opened in are derived.
// The hand-made part is the rule tables: which strands a season has and
// which chapters each holds, which convergence is fixed and which chapters
// carry it, which arcs the record names, who drives each, and each arc's
// state. Every reading carries a quote copied from the record, and the script
// checks each quote is still there (Markdown links and emphasis stripped). A
// missing quote, a chapter a rule names that is not on disk, a strand
// chapter none of whose viewpoints is in the strand's cast, or a thread the
// tables do not account for is a failure, so a page that changes under a rule
// is caught at the next release; fix the rule, never the data. The record
// ranks no character, and nor does this: a driver is named by a rule with its
// quote, and the only measure shown is the count of chapters a character
// narrates. Uses only Node built-ins plus gray-matter.
"use strict";
const fs = require("fs");
const path = require("path");
const { checkText, urlFor } = require("./extract-designs");

const REPO_ROOT = path.resolve(__dirname, "..");
const SUMMARY = "story-bible/story-bible-summary.md";
const GAPS = "story-bible/narrative-gaps-checklist.md";
const OPEN = "story-bible/open-questions.md";
const S67 = "story-bible/tissadelle-arc-s6-7.md";
const BTR1 = "story-bible/below-the-roof-treatment.md";
const BTR2 = "story-bible/below-the-roof-second-season-treatment.md";
const BTR3 = "story-bible/below-the-roof-third-season-treatment.md";
const FIVEO2 = "story-bible/five-o-second-season-treatment.md";
const ISLANDS = "story-bible/five-islands-treatment.md";
const YEAR_ZERO = "src/lore/year-zero.md";

// The story's present, from its own page.
const PRESENT = { year: 2826, evidence: [YEAR_ZERO, "2826 UCSD is the story's nominal present."] };

// An arc's state. Every one is a reading in ARCS with its quote.
const STATE = {
  open: "open",
  recognition: "closed by a recognition",
  paid: "paid on the page",
  reserved: "reserved",
};
// A promised beat of an arc, as narrative-gaps-checklist.md and the
// treatments record it.
const BEAT = { paid: "paid", unpaid: "not yet on the page", reserved: "reserved" };

// Pov ids with no character page by ruling, not by omission
// (story-bible/intake-2026-10-09.md, "Character pages for the POV ids without
// one"; the same three scripts/extract-characters.js names). They are still
// viewpoints and are counted under their own ids; only the warning is quiet.
const POV_IDS_WITHOUT_PAGE = ["hive-bee", "orlagh-dunne", "ferdia"];

// The order of the season words inside one UCSD year, used only to find the
// latest chapter where two share a year. Late Winter opens the year in the
// record's own sequence (Season 3 runs from Late Winter 2828 into Early
// Spring 2828; Season 2 from Deep Winter 2826 into Early Spring 2827); where
// the UCSD year turns is not settled by any page, so this is a reading aid,
// and a tie inside one season word falls to reading order.
const SEASON_WORDS = ["Late Winter", "Early Spring", "Mid-Spring", "Late Spring", "Spring", "Early Summer", "Midsummer", "Late Summer", "Summer", "Early Autumn", "Mid-Autumn", "Late Autumn", "Autumn", "Early Winter", "Deep Winter", "Winter"];
const SEASON_WORD_ORDER = ["Late Winter", "Early Spring", "Spring", "Mid-Spring", "Late Spring", "Early Summer", "Summer", "Midsummer", "Late Summer", "Early Autumn", "Autumn", "Mid-Autumn", "Late Autumn", "Early Winter", "Winter", "Deep Winter"];
const SEASON_WORD_EVIDENCE = ["src/seasons/s03/e01/s03e01c01.md", "2828 UCSD, Late Winter", "src/seasons/s03/e01/s03e01c03.md", "2828 UCSD, Early Spring"];

// Strands, by season. A strand's chapters are its `chapters` where given,
// else the season's chapters in its `episodes`, else the season's chapters
// one of whose viewpoints is in its `cast`; a convergence chapter is never
// a strand's. Every strand chapter must carry a viewpoint from the cast. A
// season of a thread with no row here has no strands in the record; a row
// with `none` quotes the record saying so.
const STRANDS = [
  {
    seasons: [1], evidence: [SUMMARY, "Season 1:"],
    strands: [
      { label: "A", name: "The Threshold Station survey team", cast: ["galahad-thorne", "syra", "rook-7"],
        chapters: ["s01e01c01", "s01e01c02", "s01e01c03", "s01e01c04", "s01e02c03", "s01e02c04"],
        evidence: [SUMMARY, "Strand A — the Threshold Station survey team (Galahad, Syra, Rook-7) investigating the forty-second chronometer discrepancy."] },
      { label: "B", name: "Elvira and Aldera at the Marsh Causeway", cast: ["elvira", "aldera"],
        chapters: ["s01e00c00", "s01e00c01", "s01e00c02", "s01e00c03", "s01e02c00"],
        evidence: [SUMMARY, "Strand B — Elvira and Aldera at the Marsh Causeway, working an Obliger feeding pattern alone."] },
    ],
  },
  { seasons: [3, 5], none: [SUMMARY, "Season 3 and Season 5, as published, each run a single dominant POV (Tissadelle) paired with one contrasting local POV (Sohrel; Órla) rather than two fully independent strands"] },
  {
    seasons: [6, 7], evidence: [GAPS, "Strand A in s06e01c02, Strand B in s06e01c01/c03, the strands meeting in s07e01c03"],
    strands: [
      { label: "A", name: "The institutional strand", cast: ["karla-wender", "sen", "rook-7", "syra"],
        chapters: ["s06e01c02", "s06e02c01", "s07e01c01"],
        evidence: [SUMMARY, "Strand A — the institutional strand (external POVs: Wender, Sen, Rook-7, Syra) working the Last Stand's aftermath from Threshold Station."] },
      { label: "B", name: "The interior strand", cast: ["tissadelle-shepherd"],
        chapters: ["s06e01c01", "s06e01c03", "s07e01c02"],
        evidence: [SUMMARY, "Strand B — the interior strand (Tissadelle's own POV, fragmented and non-chronological)."] },
    ],
  },
  {
    seasons: [10], evidence: [FIVEO2, "Two crews read the same structure and cannot see each other's reading"],
    strands: [
      { label: "A", name: "The Deputy at the wall", cast: ["iklix-varn", "zoe-smith"], evidence: [FIVEO2, "Strand A — the Deputy at the wall (human)"] },
      { label: "B", name: "The ensemble: a Chthonari crew", cast: ["tikket", "kattik", "tsikk", "tekka"], evidence: [FIVEO2, "Strand B — the ensemble (alien)", "RULED 4 September 2026 — \"option 1\": a Chthonari crew."] },
    ],
  },
  {
    seasons: [11], evidence: [BTR1, "Two peoples keep the same line from opposite sides"],
    strands: [
      { label: "A", name: "The deep side (the Told)", episodes: [1], cast: ["stone-first", "teddy", "went-round", "keeps-a-hand-on-it"], evidence: [BTR1, "Strand A — the deep side (the Told)"] },
      { label: "B", name: "The survey side (the up-people)", episodes: [2], cast: ["aravena", "nakagawa", "odile-ferrant"], evidence: [BTR1, "Strand B — the survey side (the up-people)"] },
    ],
  },
  {
    seasons: [12], evidence: [BTR2, "both peoples keep a record of what they could not settle"],
    strands: [
      { label: "A", name: "The deep side (the Told)", episodes: [1], cast: ["stone-first", "teddy", "went-round", "keeps-a-hand-on-it"], evidence: [BTR2, "Strand A — the deep side (the Told)"] },
      { label: "B", name: "The survey side (the up-people)", episodes: [2], cast: ["aravena", "nakagawa", "odile-ferrant"], evidence: [BTR2, "Strand B — the survey side (the up-people)"] },
    ],
  },
  {
    seasons: [13], evidence: [ISLANDS, "The Kingdom keeps three records of itself"],
    strands: [
      { label: "A", name: "The Infinite Castle (the court's record)", episodes: [1], cast: ["wren-pellam", "bram-tollick"], evidence: [ISLANDS, "Strand A — The Infinite Castle (the court's record)"] },
      { label: "B", name: "The Timeless Library (the Abbey's record)", episodes: [2], cast: ["oriel-fenwick", "emma-la-chapelle"], evidence: [ISLANDS, "Strand B — The Timeless Library (the Abbey's record)"] },
    ],
  },
  {
    seasons: [14], evidence: [BTR3, "The Told decide that the up-people have earned a telling"],
    strands: [
      { label: "A", name: "The deep side: whose telling, and who tells it", episodes: [1], cast: ["stone-first", "teddy", "went-round", "keeps-a-hand-on-it"], evidence: [BTR3, "Strand A — the deep side: whose telling, and who tells it"] },
      { label: "B", name: "The survey side: what keeping means", episodes: [2], cast: ["aravena", "nakagawa", "odile-ferrant"], evidence: [BTR3, "Strand B — the survey side: what keeping means"] },
    ],
  },
];

// Convergences. `fixed` is the record's (with its quote); whether one is on
// the page is derived from whether its chapters exist.
const CONVERGENCES = [
  { seasons: [1], name: "At the causeway: the question asked", fixed: true, chapters: ["s01e03c01"],
    evidence: [SUMMARY, "where Galahad brings the whole survey archive rather than the filed version and Elvira asks Aldera directly for the first time, breaking the feeding loop.", "src/seasons/s01/e03/s01e03c01.md", "someone finally asks Aldera the question she has been waiting for"] },
  { seasons: [6, 7], name: "A detail only Tissadelle could know, against the physical evidence", fixed: true, chapters: ["s07e01c03"],
    evidence: [SUMMARY, "Convergence: a Season 6 endpoint correlating a detail only Tissadelle could know against the institutional team's physical evidence, resolved in Season 7", GAPS, "the strands meeting in s07e01c03 — later than the treatment outlined, noted rather than corrected"] },
  { seasons: [10], name: "Two readings of one structure: approach mount three", fixed: true, chapters: ["s10e01c03"],
    evidence: [FIVEO2, "S10E01C03 What It Hangs From, the ruled shape realized"] },
  { seasons: [11], name: "One act, two records: a stone set down first", fixed: true, chapters: ["s11e01c05", "s11e02c03"],
    evidence: [BTR1, "The survey side ends with an up-person putting a stone down first at the line", GAPS, "written 8 September 2026 as a pair, Theirs to Move (S11E01C05, the deep side) and Something Happened (S11E02C03, from above)"] },
  { seasons: [12], name: "A shadow at the line, seen from both sides", fixed: true, chapters: ["s12e01c06", "s12e02c03"],
    evidence: [BTR2, "A shadow at the line, seen from both sides.", BTR2, "S12E01C06 The Light Went Round It and S12E02C03 Two on the Line"] },
  { seasons: [13], name: "One act, two records, and a third kept off both: a door given", fixed: true, chapters: ["s13e01c02", "s13e02c02"],
    evidence: [ISLANDS, "The convergence — one act, two records, and a third kept off both", GAPS, "the convergence drafted the same day as S13E01C02 A Door Was Given and S13E02C02 Always There"] },
  { seasons: [14], name: "The telling at the line, heard and not recorded", fixed: true, chapters: ["s14e01c04", "s14e02c03"],
    evidence: [BTR3, "convergence (1), heard and not recorded;", OPEN, "S14E02C03 Heard By (Aravena, Nakagawa, Ferrant) and S14E01C04 Been Told"] },
];

// Arcs: only those the record names. An arc is "the shape of one
// character's change over time" (the Narrative Structure section); each row
// quotes where the record names it (`source`), who drives it, its state, and
// the chapter or page that closed it. `opened` is given only where the
// record names the opening; otherwise it is derived as the earliest chapter
// by in-world date, in the arc's seasons, that one of its drivers narrates.
// `beats` are the promised beats the record lists for it.
const ARCS = [
  {
    id: "tissadelle-shepherd", name: "Tissadelle Shepherd's arc", threads: ["tissadelle-arc"], seasons: [1, 3, 5, 6, 7],
    drivers: ["tissadelle-shepherd"],
    source: [SUMMARY, "tissadelle-arc is the one thread named after an arc, because her arc is what makes those five seasons one narrative."],
    state: "open", stateEvidence: [GAPS, "The saga's last four beats — silent gradual recovery, transformation, sacrifice at the terminus, the founding — all after the published end"],
    beats: [
      { text: "Tissadelle as a Novice", state: "paid", chapter: "s01e00c06", evidence: [GAPS, "Paid 19 October 2026 by S01E00C06 The Time the Study Needs"] },
      { text: "The younger Shepherd as a Five-O guest (2826)", state: "paid", chapter: "s04e00c01", evidence: [GAPS, "used 4 October 2026 by S04E00C01 What It Did Not Say"] },
      { text: "Wender's mentorship of Shepherd", state: "paid", chapter: "s05e00c01", evidence: [GAPS, "paid 4 October 2026 by S05E00C01 Not Asked"] },
      { text: "Tissadelle at the terminus; Tobble's downgraded inner codex", state: "reserved", evidence: [GAPS, "the mechanism deliberately unwritten until its chapters"] },
      { text: "The saga's last four beats", state: "unpaid", evidence: [GAPS, "all after the published end"] },
    ],
  },
  {
    id: "karla-wender", name: "Karla Wender in Seasons 6-7: the doctrine's missing word", threads: ["tissadelle-arc"], seasons: [6, 7],
    drivers: ["karla-wender"],
    source: [S67, "Karla Wender in Seasons 6-7 — an independent arc"],
    state: "recognition", stateEvidence: [S67, "That is her doctrinal arc paid off in public and at cost"],
    closed: { file: "src/codex/wender-funeral-address.md", evidence: [S67, "she gives the eulogy having never signed the citation, and says so from the podium."] },
    beats: [
      { text: "Karla Wender, Chief Pilot to High Captain", state: "paid", chapter: "s05e00c02", evidence: [GAPS, "Karla Wender, Chief Pilot → High Captain — paid by S05E00C02 Asked Across"] },
      { text: "Whether her missing doctrinal category gets a name", state: "unpaid", evidence: [S67, "Whether Wender's missing doctrinal category ever gets a name"] },
    ],
  },
  {
    id: "sen", name: "Sen's arc: whether the archivist signs", threads: ["tissadelle-arc"], seasons: [6, 7],
    drivers: ["sen"],
    source: [S67, "That is Sen's arc and it exists whether or not Tissadelle is recoverable"],
    state: "open", stateEvidence: [S67, "Does Sen sign? Refusing is a real ending, and a bleak one."],
    beats: [],
  },
  {
    id: "sohrel", name: "Sohrel and the Sentinel–Meridian connection", threads: ["tissadelle-arc"], seasons: [3],
    drivers: ["sohrel"],
    source: [GAPS, "Sohrel and the Sentinel–Meridian connection — declined without a stated reason"],
    state: "paid", stateEvidence: [GAPS, "Paid 18 October 2026 by S03E01C04 For the Record: the declining costs her"],
    closed: { chapter: "s03e01c04", evidence: [GAPS, "Paid 18 October 2026 by S03E01C04 For the Record"] },
    beats: [],
  },
  {
    id: "zoe-smith", name: "Zoe Smith declining to speak", threads: ["young-star-rangers"], seasons: [9],
    drivers: ["zoe-smith"],
    source: [GAPS, "Zoe Smith declining to speak — paid 3 October 2026 by S09E01C05 Stand Where You Like"],
    state: "paid", stateEvidence: [GAPS, "Smith says so aloud for the first time"],
    closed: { chapter: "s09e01c05", evidence: [GAPS, "paid 3 October 2026 by S09E01C05 Stand Where You Like"] },
    beats: [],
  },
  {
    id: "lev-saunders", name: "Lev Saunders joins the Rangers when older", threads: ["undercover-pets"], seasons: [2],
    drivers: ["lev"],
    source: [GAPS, "Lev Saunders joins the Rangers when older — ruled 27 September"],
    state: "reserved", stateEvidence: [GAPS, "waits on a thread reaching about 2837."],
    beats: [],
  },
  {
    id: "keeps-a-hand-on-it", name: "The smallest one's name", threads: ["below-the-roof"], seasons: [12, 14],
    drivers: ["keeps-a-hand-on-it"],
    source: [BTR3, "The smallest one's name. It has been unsettled since S12E01C01."],
    opened: { chapter: "s12e01c01", evidence: [BTR3, "It has been unsettled since S12E01C01."] },
    state: "paid", stateEvidence: [OPEN, "the smallest one's name is Keeps-A-Hand-On-It, the phrase the small ones already use."],
    closed: { chapter: "s14e01c03", evidence: [OPEN, "Naming chapter drafted 19 October 2026: S14E01C03 Keeps a Hand on It"] },
    beats: [],
  },
  {
    id: "told-names", name: "What Stone-First's and Carried-It-Sleeping's names grow into", threads: ["below-the-roof"], seasons: [11, 12, 14],
    drivers: ["stone-first", "teddy"],
    source: [OPEN, "names are extended, not replaced; a truer thing said later is added, and the growth shows clarity and maturity."],
    state: "open", stateEvidence: [OPEN, "what Stone-First's and Carried-It-Sleeping's names grow into, which no chapter has said"],
    beats: [],
  },
  {
    id: "five-islands-keepers", name: "The young keepers learning to hold a record", threads: ["five-islands"], seasons: [13],
    drivers: ["wren-pellam", "oriel-fenwick"],
    source: [ISLANDS, "a young keeper of each of the first two is learning to hold one"],
    state: "open", stateEvidence: [ISLANDS, "whether either strand grows, whether a third strand is added, and an edition of the thread's own remain his."],
    beats: [],
  },
  {
    id: "patience-first-terminus", name: "The Patience First terminus", threads: ["founding-era"], seasons: [0],
    drivers: ["wren-okafor"],
    source: [SUMMARY, "Currently: the Patience First terminus and the 2732 recovery, both reserved for their own season."],
    state: "reserved", stateEvidence: ["CLAUDE.md", "Deliberate mysteries stay shut: the Patience First terminus and the 2732 recovery are untouchable until their own season."],
    beats: [{ text: "What the crew encountered at the terminus", state: "reserved", evidence: ["src/characters/wren-okafor.md", "What they encountered at the terminus is not part of this record."] }],
  },
  {
    id: "recovery-2732", name: "The 2732 recovery", threads: ["founding-era"], seasons: [0],
    drivers: ["wren-okafor"],
    source: [SUMMARY, "Currently: the Patience First terminus and the 2732 recovery, both reserved for their own season."],
    state: "reserved", stateEvidence: ["CLAUDE.md", "Deliberate mysteries stay shut: the Patience First terminus and the 2732 recovery are untouchable until their own season."],
    beats: [{ text: "Patience First found, the crew alive", state: "reserved", evidence: ["src/characters/wren-okafor.md", "Patience First was found in 2732 UCSD. The crew were alive."] }],
  },
];

// ---------------------------------------------------------------------------

let matter = null;
function fm(raw) {
  if (!matter) matter = require("gray-matter");
  return matter(raw);
}
function norm(s) { return checkText(s).trim(); }

// "2826 UCSD, Late Autumn, Dusk" -> { year: 2826, word: "Late Autumn" };
// a timestamp with no UCSD year (an inner-world chapter, Vellamar's survey
// count) is undated.
function parseTimestamp(ts) {
  const s = ts == null ? "" : String(ts);
  const m = s.match(/(\d{4})\s*UCSD/);
  const year = m ? Number(m[1]) : null;
  let word = null;
  for (const w of SEASON_WORDS) if (new RegExp("\\b" + w.replace("-", "\\-") + "\\b", "i").test(s)) { word = w; break; }
  return { year, word };
}
// Sort key for in-world order: year, then season word, then reading order.
function inWorldKey(ch) {
  const w = ch.word ? SEASON_WORD_ORDER.indexOf(ch.word) : -1;
  return [ch.year == null ? Infinity : ch.year, w, ch.order];
}
function cmpKey(a, b) { for (let i = 0; i < a.length; i++) { if (a[i] < b[i]) return -1; if (a[i] > b[i]) return 1; } return 0; }

function positionOf(first, last, present) {
  if (first == null || last == null) return "undated";
  if (last < present) return "before the present";
  if (first > present) return "after the present";
  return "spans the present";
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}

function build(root = REPO_ROOT, rules = {}) {
  const strandRules = rules.strands || STRANDS;
  const convRules = rules.convergences || CONVERGENCES;
  const arcRules = rules.arcs || ARCS;
  const present = rules.present || PRESENT;
  const failures = [];
  const warnings = [];
  const cache = new Map();
  const rel = p => path.relative(root, p).replace(/\\/g, "/");
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
    if (!f.text.includes(checkText(quote))) { failures.push(`${where}: quote not found in ${file}: "${quote}"`); return false; }
    return true;
  }
  // [file, quote, quote, file, quote ...]: an item that looks like a path
  // starts a new group.
  function evidence(list, where) {
    let file = null;
    const out = [];
    for (const item of list || []) {
      if (/^((src|story-bible|lib)\/.+|[A-Z-]+)\.(md|js)$/.test(item)) { file = item; continue; }
      quoteIn(file, item, where);
      out.push({ file, quote: item });
    }
    return out;
  }

  // Threads.
  const libFile = path.join(root, "lib", "storyline-threads.js");
  if (!fs.existsSync(libFile)) throw new Error("lib/storyline-threads.js not found");
  delete require.cache[require.resolve(libFile)];
  const { STORYLINE_THREADS, threadForSeason } = require(libFile);

  // Characters, and the pov resolver.
  const chars = walk(path.join(root, "src", "characters")).filter(f => f.endsWith(".md") && !/(^|[\\/])(index|README)\.md$/i.test(f)).map(f => {
    const file = rel(f);
    const d = read(file).data;
    return { id: path.basename(f, ".md"), file, title: d.title != null ? String(d.title) : path.basename(f, ".md"), fmId: d.id != null ? String(d.id) : null, povIds: Array.isArray(d.pov_ids) ? d.pov_ids.map(String) : [], url: urlFor(file, d) };
  }).sort((a, b) => a.id.localeCompare(b.id));
  const charById = new Map(chars.map(c => [c.id, c]));
  const titleIndex = chars.map(c => ({ id: c.id, re: new RegExp("(^|\\s)" + c.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=\\s|$)") }));
  function resolvePov(povId, label) {
    if (charById.has(povId)) return [povId];
    const viaFm = chars.filter(c => c.fmId === povId).map(c => c.id);
    if (viaFm.length) return viaFm;
    const viaAlias = chars.filter(c => c.povIds.includes(povId)).map(c => c.id);
    if (viaAlias.length) return viaAlias;
    if (label) {
      const name = String(label).replace(/\s*\(.*$/, "").trim();
      const hits = titleIndex.filter(t => t.re.test(name)).map(t => t.id);
      if (hits.length === 1) return hits;
    }
    return [];
  }

  // Chapters.
  const seasonsDir = path.join(root, "src", "seasons");
  const chapterFiles = walk(seasonsDir).filter(f => /[\\/]s\d+e\d+c\d+\.md$/.test(f));
  const unresolved = new Map();
  const chapters = chapterFiles.map(f => {
    const file = rel(f);
    const d = read(file).data;
    const id = d.id != null ? String(d.id) : path.basename(f, ".md");
    const povs = [];
    const povIds = [];
    for (const p of Array.isArray(d.povs) ? d.povs : []) {
      const pid = typeof p === "string" ? p : p && p.id != null ? String(p.id) : null;
      if (!pid) continue;
      povIds.push(pid);
      const r = resolvePov(pid, p && p.label);
      if (!r.length) unresolved.set(pid, (unresolved.get(pid) || []).concat(id));
      for (const c of r) if (!povs.includes(c)) povs.push(c);
    }
    const ts = d.timestamp != null ? String(d.timestamp) : null;
    const { year, word } = parseTimestamp(ts);
    return {
      id, file, season: Number(d.season), episode: Number(d.episode), chapter: Number(d.chapter),
      title: d.title != null ? String(d.title) : id, url: urlFor(file, d),
      timestamp: ts, year, word, date: d.date != null ? (d.date instanceof Date ? d.date.toISOString().slice(0, 10) : String(d.date)) : null,
      povIds, povs,
    };
  }).filter(c => Number.isFinite(c.season)).sort((a, b) => a.season - b.season || a.episode - b.episode || a.chapter - b.chapter);
  chapters.forEach((c, i) => { c.order = i; c.thread = threadForSeason(c.season).id; });
  const chapterById = new Map(chapters.map(c => [c.id, c]));
  for (const [pid, ids] of unresolved) if (!POV_IDS_WITHOUT_PAGE.includes(pid)) warnings.push(`pov id "${pid}" resolves to no character page (${ids.join(", ")}); counted under its own id`);
  // A pov with no page is still a viewpoint; count it under its own id.
  for (const c of chapters) for (const pid of c.povIds) if (unresolved.has(pid) && !c.povs.includes(pid)) c.povs.push(pid);

  function chapterRef(id) {
    const c = chapterById.get(id);
    return c ? { id: c.id, title: c.title, url: c.url, timestamp: c.timestamp, year: c.year } : null;
  }
  function needChapter(id, where) {
    if (!chapterById.has(id)) { failures.push(`${where}: chapter ${id} is not in src/seasons/`); return false; }
    return true;
  }
  function povCounts(list) {
    const n = new Map();
    for (const c of list) for (const p of c.povs) n.set(p, (n.get(p) || 0) + 1);
    return [...n].map(([id, count]) => ({ id, title: charById.has(id) ? charById.get(id).title : id, url: charById.has(id) ? charById.get(id).url : null, count }))
      .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
  }
  function latest(list) {
    const dated = list.filter(c => c.year != null);
    if (!dated.length) return null;
    return dated.slice().sort((a, b) => cmpKey(inWorldKey(b), inWorldKey(a)))[0];
  }
  function earliest(list) {
    if (!list.length) return null;
    return list.slice().sort((a, b) => cmpKey(inWorldKey(a), inWorldKey(b)))[0];
  }

  const presentEv = evidence(present.evidence, "present");
  const seasonWordEv = evidence(SEASON_WORD_EVIDENCE, "season-word order");

  // Every season of a thread is accounted for by at most one strand row.
  const strandBySeason = new Map();
  for (const r of strandRules) for (const s of r.seasons) {
    if (strandBySeason.has(s)) failures.push(`season ${s} has two strand rows`);
    strandBySeason.set(s, r);
  }
  const convBySeason = new Map();
  for (const r of convRules) for (const s of r.seasons) convBySeason.set(s, r);

  // Strands and convergences, by row.
  const strandOut = new Map();
  const convOut = new Map();
  for (const r of strandRules) {
    const where = `strands of season ${r.seasons.join("-")}`;
    const seasonChapters = chapters.filter(c => r.seasons.includes(c.season));
    if (!seasonChapters.length) failures.push(`${where}: no chapters on disk`);
    const threadIds = [...new Set(r.seasons.map(s => threadForSeason(s).id))];
    if (threadIds.length > 1) failures.push(`${where}: its seasons sit in two threads (${threadIds.join(", ")})`);
    if (r.none) { strandOut.set(r, { seasons: r.seasons, none: { evidence: evidence(r.none, where) }, strands: [], outside: [] }); continue; }
    const conv = convRules.find(c => c.seasons.join() === r.seasons.join());
    const convIds = new Set(conv ? conv.chapters : []);
    const strands = r.strands.map(s => {
      const w = `${where}, strand ${s.label}`;
      let ids;
      if (s.chapters) { ids = s.chapters.filter(id => needChapter(id, w)); }
      else ids = seasonChapters.filter(c => (s.episodes ? s.episodes.includes(c.episode) : true) && (s.episodes || !s.cast || c.povs.some(p => s.cast.includes(p)))).map(c => c.id);
      ids = ids.filter(id => !convIds.has(id));
      for (const id of s.cast || []) if (!charById.has(id)) failures.push(`${w}: cast ${id} has no character page`);
      for (const id of ids) {
        const c = chapterById.get(id);
        if (c && !r.seasons.includes(c.season)) failures.push(`${w}: ${id} is not in season ${r.seasons.join(" or ")}`);
        if (c && s.cast && !c.povs.some(p => s.cast.includes(p))) failures.push(`${w}: ${id} carries no viewpoint from the strand's cast (${c.povs.join(", ")})`);
      }
      const list = ids.map(id => chapterById.get(id)).filter(Boolean);
      return {
        label: s.label, name: s.name, cast: (s.cast || []).map(id => ({ id, title: charById.has(id) ? charById.get(id).title : id })),
        chapters: list.map(c => c.id), povs: povCounts(list), evidence: evidence(s.evidence, w),
      };
    });
    const claimed = new Set(strands.flatMap(s => s.chapters).concat([...convIds]));
    for (const s of strands) for (const id of s.chapters) if (strands.filter(x => x.chapters.includes(id)).length > 1) failures.push(`${where}: ${id} is in two strands`);
    // The season's chapters no strand or convergence holds, and which
    // strand casts their viewpoints touch.
    const outside = seasonChapters.filter(c => !claimed.has(c.id)).map(c => ({
      id: c.id, casts: r.strands.filter(s => s.cast && c.povs.some(p => s.cast.includes(p))).map(s => s.label),
    }));
    strandOut.set(r, { seasons: r.seasons, evidence: evidence(r.evidence, where), strands, outside });
  }
  for (const r of convRules) {
    const where = `convergence of season ${r.seasons.join("-")}`;
    const ev = evidence(r.evidence, where);
    const present_ = r.chapters.filter(id => chapterById.has(id));
    let state;
    if (!r.fixed) state = "open";
    else if (r.chapters.length && present_.length === r.chapters.length) state = "fixed, on the page";
    else if (!present_.length) state = "fixed, not yet on the page";
    else { state = "fixed, part on the page"; warnings.push(`${where}: ${r.chapters.filter(id => !chapterById.has(id)).join(", ")} not on disk yet`); }
    for (const id of present_) if (!r.seasons.includes(chapterById.get(id).season)) failures.push(`${where}: ${id} is not in season ${r.seasons.join(" or ")}`);
    convOut.set(r, { seasons: r.seasons, name: r.name, state, chapters: present_, owed: r.chapters.filter(id => !chapterById.has(id)), evidence: ev });
  }

  // Arcs.
  const arcIds = new Set();
  const arcs = arcRules.map(a => {
    const where = `arc ${a.id}`;
    if (arcIds.has(a.id)) failures.push(`${where}: duplicate id`);
    arcIds.add(a.id);
    if (!STATE[a.state]) failures.push(`${where}: state ${a.state} is not one of ${Object.keys(STATE).join(", ")}`);
    for (const t of a.threads) if (!STORYLINE_THREADS.some(x => x.id === t)) failures.push(`${where}: thread ${t} is not registered`);
    for (const s of a.seasons) if (!a.threads.includes(threadForSeason(s).id)) failures.push(`${where}: season ${s} is not in ${a.threads.join(" or ")}`);
    for (const d of a.drivers) if (!charById.has(d)) failures.push(`${where}: driver ${d} has no character page`);
    const closedState = a.state === "recognition" || a.state === "paid";
    if (closedState && !a.closed) failures.push(`${where}: a closed arc names what closed it`);
    if (!closedState && a.closed) failures.push(`${where}: an ${a.state} arc has no closing`);
    const inSeasons = chapters.filter(c => a.seasons.includes(c.season));
    const driven = inSeasons.filter(c => c.povs.some(p => a.drivers.includes(p)));
    let opened = null;
    if (a.opened) {
      if (needChapter(a.opened.chapter, `${where} opened`)) opened = { ...chapterRef(a.opened.chapter), by: "the record", evidence: evidence(a.opened.evidence, `${where} opened`) };
    } else {
      const e = earliest(driven);
      if (e) opened = { ...chapterRef(e.id), by: "first viewpoint", evidence: [] };
    }
    let closed = null;
    if (a.closed) {
      const ev = evidence(a.closed.evidence, `${where} closed`);
      if (a.closed.chapter) { if (needChapter(a.closed.chapter, `${where} closed`)) closed = { ...chapterRef(a.closed.chapter), evidence: ev }; }
      else if (a.closed.file) { if (!read(a.closed.file)) failures.push(`${where}: ${a.closed.file} does not exist`); const f = read(a.closed.file); closed = { file: a.closed.file, title: f && f.data.title ? String(f.data.title) : a.closed.file, url: f ? urlFor(a.closed.file, f.data) : null, evidence: ev }; }
    }
    const beats = a.beats.map((b, i) => {
      const w = `${where} beat ${i + 1}`;
      if (!BEAT[b.state]) failures.push(`${w}: state ${b.state} is not one of ${Object.keys(BEAT).join(", ")}`);
      if (b.state === "paid" && !b.chapter) failures.push(`${w}: a paid beat names its chapter`);
      if (b.chapter) needChapter(b.chapter, w);
      return { text: b.text, state: BEAT[b.state], chapter: b.chapter ? chapterRef(b.chapter) : null, evidence: evidence(b.evidence, w) };
    });
    const last = latest(driven);
    return {
      id: a.id, name: a.name, threads: a.threads, seasons: a.seasons,
      state: STATE[a.state], stateEvidence: evidence(a.stateEvidence, `${where} state`), source: evidence(a.source, `${where} source`),
      drivers: a.drivers.map(d => ({ id: d, title: charById.has(d) ? charById.get(d).title : d, url: charById.has(d) ? charById.get(d).url : null, count: driven.filter(c => c.povs.includes(d)).length })),
      viewpoints: povCounts(inSeasons), chapters: inSeasons.length, driven: driven.length,
      opened, closed, beats,
      latest: last ? { ...chapterRef(last.id), offset: last.year - present.year } : null,
    };
  });

  // Threads.
  for (const s of strandBySeason.keys()) if (!chapters.some(c => c.season === s)) failures.push(`strand row names season ${s}, which has no chapters`);
  const threads = STORYLINE_THREADS.map(t => {
    const list = chapters.filter(c => t.seasons.includes(c.season));
    const landingFile = `src/threads/${t.id}/index.md`;
    const landing = read(landingFile);
    if (!landing) warnings.push(`thread ${t.id}: no landing page at ${landingFile}`);
    const seasons = t.seasons.slice().sort((a, b) => a - b).map(n => {
      const idxFile = `src/seasons/s${String(n).padStart(2, "0")}/index.md`;
      const idx = read(idxFile);
      const sl = list.filter(c => c.season === n);
      return { season: n, title: idx && idx.data.title ? String(idx.data.title) : `Season ${n}`, chapters: sl.length, episodes: [...new Set(sl.map(c => c.episode))].length };
    });
    const dated = list.filter(c => c.year != null);
    const years = dated.map(c => c.year);
    const dates = list.map(c => c.date).filter(Boolean).sort();
    const first = earliest(dated);
    const last = latest(list);
    const rows = [...new Set(t.seasons.map(s => strandBySeason.get(s)).filter(Boolean))];
    const convs = [...new Set(t.seasons.map(s => convBySeason.get(s)).filter(Boolean))];
    const stranded = new Set(rows.flatMap(r => r.seasons));
    return {
      id: t.id, name: t.name, description: t.description, tier: t.tier || null,
      landing: landing ? { file: landingFile, title: landing.data.title ? String(landing.data.title) : t.name, url: urlFor(landingFile, landing.data) } : null,
      seasons, chapters: list.length,
      inWorld: {
        first: first ? { year: first.year, id: first.id, timestamp: first.timestamp } : null,
        last: last ? { year: last.year, id: last.id, timestamp: last.timestamp } : null,
        span: years.length ? [Math.min(...years), Math.max(...years)] : null,
        undated: list.filter(c => c.year == null).map(c => ({ id: c.id, timestamp: c.timestamp })),
      },
      realDates: dates.length ? [dates[0], dates[dates.length - 1]] : null,
      present: {
        position: positionOf(years.length ? Math.min(...years) : null, years.length ? Math.max(...years) : null, present.year),
        latest: last ? { ...chapterRef(last.id), offset: last.year - present.year } : null,
      },
      povs: povCounts(list),
      strands: rows.map(r => strandOut.get(r)),
      unstranded: t.seasons.filter(s => !stranded.has(s)).sort((a, b) => a - b),
      convergences: convs.map(r => convOut.get(r)),
      arcs: arcs.filter(a => a.threads.includes(t.id)).map(a => a.id),
    };
  });
  for (const r of strandRules) if (!threads.some(t => t.strands.includes(strandOut.get(r)))) failures.push(`strand row for season ${r.seasons.join("-")} sits in no registered thread`);

  const byState = Object.fromEntries(Object.values(STATE).map(v => [v, arcs.filter(a => a.state === v).length]));
  const data = {
    version: JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version,
    source: "lib/storyline-threads.js; src/seasons/; src/threads/; src/characters/; " + YEAR_ZERO + "; the story bible's Narrative Structure, treatments, narrative-gaps-checklist.md and open-questions.md",
    present: { year: present.year, evidence: presentEv },
    seasonWords: { order: SEASON_WORD_ORDER, evidence: seasonWordEv },
    states: Object.values(STATE),
    beatStates: Object.values(BEAT),
    counts: {
      threads: threads.length, chapters: chapters.length,
      strands: [...strandOut.values()].reduce((n, r) => n + r.strands.length, 0),
      convergences: convOut.size, arcs: arcs.length, byState,
    },
    threads,
    arcs,
    chapters: chapters.map(c => ({ id: c.id, season: c.season, episode: c.episode, chapter: c.chapter, title: c.title, url: c.url, timestamp: c.timestamp, year: c.year, date: c.date, povs: c.povs, thread: c.thread })),
  };
  return { data, failures, warnings };
}

module.exports = { parseTimestamp, inWorldKey, positionOf, build, STRANDS, CONVERGENCES, ARCS, STATE, BEAT, PRESENT, SEASON_WORD_ORDER };

if (require.main === module) {
  const outfile = process.argv[2];
  if (!outfile) { console.error("usage: node scripts/extract-arcs.js <outfile>"); process.exit(1); }
  const { data, failures, warnings } = build();
  for (const w of warnings) console.warn("warning: " + w);
  if (failures.length) {
    console.error("Extraction failed; the rule table no longer matches the record:");
    for (const f of failures) console.error("  " + f);
    process.exit(1);
  }
  fs.writeFileSync(outfile, JSON.stringify(data, null, 2) + "\n");
  console.log(`wrote ${outfile}: ${data.counts.threads} threads, ${data.counts.chapters} chapters, ${data.counts.strands} strands, ${data.counts.convergences} convergences, ${data.counts.arcs} arcs; by state ${JSON.stringify(data.counts.byState)}`);
}
