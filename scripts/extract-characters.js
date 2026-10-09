#!/usr/bin/env node
// Derive characters-and-relationships.json from the record.
//
// Usage, from the repository root:   node extract-characters.js <outfile>
//
// Inputs (all read, none written): src/characters/*.md, src/seasons/**/*.md,
// lib/storyline-threads.js. Front matter is parsed with the repo's own
// gray-matter; nothing else outside node built-ins is required. Output is
// deterministic: every array is sorted, so re-running on an unchanged record
// yields a byte-identical file apart from `generatedAt`.
//
// Everything in the file is derived by rule from the pages. The relation
// labels on edges come from RELATION_PATTERNS below applied to the sentence
// that holds the link - never from a hand-written table of pairs - so a page
// edit changes the map on the next run without anyone copying it across.

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const matter = require(path.join(ROOT, "node_modules", "gray-matter"));
const { STORYLINE_THREADS, threadForSeason } = require(path.join(ROOT, "lib", "storyline-threads.js"));

const CHAR_DIR = path.join(ROOT, "src", "characters");
const SEASONS_DIR = path.join(ROOT, "src", "seasons");
const CHAR_LINK = /\]\((?:https?:\/\/[^/)]+)?(?:\/star-rangers)?\/characters\/([a-z0-9-]+)\/?(?:#[^)]*)?\)|href="(?:https?:\/\/[^/"]+)?(?:\/star-rangers)?\/characters\/([a-z0-9-]+)\/?(?:#[^"]*)?"/g;

// ---------------------------------------------------------------------------
// Relation word list. Each entry is a phrase (matched whole-word, case-
// insensitively, with an optional possessive in front: "her mother",
// "his mentor", "their colleague"). The label on an edge is the phrase
// nearest the link inside the link's own sentence; ties go to the earlier
// entry. A sentence with no phrase from this list labels the edge "mentions".
// Order within the list matters only for ties, so keep the specific
// multi-word forms ahead of the single words they contain.
const RELATION_PATTERNS = [
  // family and household (a bare family noun only counts with a possessive in front - see PREFIX)
  "foster-brother", "foster-sister", "foster brother", "foster sister", "foster kin", "foster mother", "foster father",
  "grandmother", "grandfather", "stepmother", "stepfather",
  "mother", "father", "sister", "brother", "daughter", "son", "parent", "parents", "family", "kin", "kinship",
  "wife", "husband", "widow", "cousin", "aunt", "uncle", "niece", "nephew", "twin",
  // plural minds
  "headmate", "headmates", "co-host", "fronter", "system-mate", "system mate",
  // training and mentorship
  "mentored by", "official mentor", "mentor", "mentee", "trainee", "apprentice", "apprenticed to", "instructor", "teacher",
  "student", "pupil", "protégé", "protege", "trained by", "trained under", "taught by",
  // chain of command and institutional ties
  "reports to", "reports through", "reporting to", "reporting through", "reports operationally", "reporting operationally",
  "answers to", "answerable to", "answering to", "attached to", "assigned to", "seconded to",
  "commanded by", "serves under", "served under", "serving under", "posted with", "posted under",
  "successor", "predecessor", "superior", "subordinate", "second-in-command", "liaison",
  // peers, allies and opponents
  "colleague", "colleagues", "partner", "partners", "pairing", "paired with", "alongside", "with whom",
  "together", "friend", "friends", "friendship", "ally", "allies", "rival", "rivals", "rivalry",
  "opponent", "opposed", "opposes", "opposing", "objection", "friction", "dispute", "disputed", "disagree", "disagrees",
  "distinct from", "not to be confused with", "mirror", "counterpart", "namesake", "shares the surname", "no kinship",
  // keeping, custody and care
  "keeper", "kept by", "owner", "custody", "recovered by", "rescued by", "carried by", "found by"
];

// Nouns that name a relation only when the link is their possessor:
// "[Oyelaran]'s roster", "[Larsen]'s task force", "[Wender]'s ship". The
// label says the direction out loud.
const POSSESSED_NOUNS = [
  ["roster", "on the roster of"], ["books", "on the books of"], ["bureau", "in the bureau of"], ["office", "in the office of"],
  ["task force", "in the task force of"], ["crew", "in the crew of"], ["complement", "in the complement of"],
  ["delegation", "in the delegation of"], ["staff", "on the staff of"], ["command", "under the command of"],
  ["ship", "aboard the ship of"], ["household", "in the household of"], ["file", "in the file of"],
  ["cat", "cat of"], ["rabbit", "rabbit of"], ["dog", "dog of"], ["pet", "pet of"], ["trainee", "trainee of"],
  ["mentor", "mentor of"], ["mother", "mother of"], ["father", "father of"], ["sister", "sister of"], ["brother", "brother of"],
  ["daughter", "daughter of"], ["son", "son of"], ["cousin", "cousin of"], ["wife", "wife of"], ["husband", "husband of"],
  ["headmate", "headmate of"], ["successor", "successor of"], ["predecessor", "predecessor of"], ["deputy", "deputy of"],
  ["second", "second of"], ["pupil", "pupil of"], ["student", "student of"], ["apprentice", "apprentice of"]
];
const POSSESSED_RE = new RegExp("^\\]\\([^)]*\\)(?:'s|')\\s+(?:(?:own|official|former|late|first|new|old|junior|senior|personal)\\s+)?(" +
  POSSESSED_NOUNS.map(([n]) => n.replace(/\s+/g, "\\s+")).join("|") + ")\\b", "i");

// A relation phrase further than this from the link is not read as naming it.
const MAX_LABEL_DISTANCE = 80;

// Possessive or determiner that may precede a relation phrase and is kept in the label.
const PREFIX = "(?:(?:her|his|their|its|own)\\s+)?";

const RELATION_REGEXES = RELATION_PATTERNS.map((phrase) => ({
  phrase,
  re: new RegExp("\\b" + PREFIX + "(" + phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "[\\s-]+") + ")(?:'s)?\\b", "gi")
}));

// ---------------------------------------------------------------------------
// Affiliation: the corps, bureau, polity or institution named in the role
// line, else in the first paragraph, else implied by a tag. First match in
// this order wins, so the specific institutions sit above the broad ones.
const AFFILIATION_PATTERNS = [
  [/undercover pets detective agency|detective agency/i, "Undercover Pets Detective Agency"],
  [/orbital five-o|governor's investigative task force/i, "Orbital Five-O"],
  [/threshold station constabulary/i, "Threshold Station Constabulary"],
  [/civil detective bureau|civil investigations unit|detective bureau|detective superintendent|detective inspector, eden/i, "Eden Civil Detective Bureau"],
  [/eden mutual assurance society/i, "Eden Mutual Assurance Society"],
  [/terrace committee/i, "Eden Terrace Committee"],
  [/welfare program/i, "Eden Space Habitat Welfare Program"],
  [/tideward sisterhood/i, "Tideward Sisterhood"],
  [/casimor watch-post|old houses|kingdom of the five islands/i, "Kingdom of the Five Islands"],
  [/communion of the called|cnoc na mbeach/i, "Communion of the Called"],
  [/fellowship of light/i, "Fellowship of Light"],
  [/cill aoife/i, "Cill Aoife"],
  [/survey archive|senior archivist/i, "Survey Archive"],
  [/the institute/i, "The Institute"],
  [/survey corps/i, "Star Rangers Survey Corps"],
  [/safety corps/i, "Star Rangers Safety Corps"],
  [/frontier corps/i, "Star Rangers Frontier Corps"],
  [/science corps/i, "Star Rangers Science Corps"],
  [/navigation corps/i, "Star Rangers Navigation Corps"],
  [/star rangers?/i, "Star Rangers"],
  [/military space command/i, "Military Space Command"],
  [/inner system defence fleet|unbroken command|belt settlements directorate|bureau of outer compliance|imperium/i, "Imperium"],
  [/cerebraun hegemony/i, "Cerebraun Hegemony"],
  [/orbital habitats compact|orbital space habitats/i, "Orbital Habitats Compact"],
  [/federation contractor crew|federation of sentient beings/i, "Federation of Sentient Beings"],
  [/fourfold accord/i, "Fourfold Accord"],
  [/joint seabed authority/i, "Joint Seabed Authority"],
  [/harmonic operations/i, "Harmonic Operations"],
  [/union land registry|celtic union/i, "Celtic Union"],
  [/ridge processor cooperative/i, "Ridge Processor Cooperative"],
  [/ynys wydrin dome engineering base/i, "Ynys Wydrin Dome Engineering Base"],
  [/independent survey and salvage/i, "Independent Survey and Salvage"],
  [/wender settlement|sheriff of wender/i, "Wender settlement"],
  // "Clan Head, Clan Dubhghlas (Aethelrock)" -> "Clan Dubhghlas (Aethelrock)": the clan is the one with the world in brackets.
  [/\bClan (?!Head\b)([^(,;]+?)\s*\(([^)]+)\)/, (m) => "Clan " + m[1].trim() + " (" + m[2].trim() + ")"],
  [/the told|deep networks/i, "The Told"],
  [/concordant/i, "The Concordant"],
  [/gleann na gcaorach/i, "Gleann na gCaorach"],
  [/eden space habitat|eden station/i, "Eden Space Habitat"],
  [/t[ií]r na n[óo]g/i, "Tír na nÓg"],
  [/\bcorps\b/i, "Star Rangers"]
];

const TAG_AFFILIATIONS = [
  ["detective-agency", "Undercover Pets Detective Agency"],
  ["orbital-five-o", "Orbital Five-O"],
  ["survey-corps", "Star Rangers Survey Corps"],
  ["survey", "Star Rangers Survey Corps"],
  ["aethelrock", "Aethelrock"],
  ["star-rangers", "Star Rangers"],
  ["fellowship-of-light", "Fellowship of Light"],
  ["communion-of-the-called", "Communion of the Called"],
  ["military-space-command", "Military Space Command"],
  ["imperium", "Imperium"],
  ["compact", "Orbital Habitats Compact"],
  ["eden", "Eden Space Habitat"]
];

// Species fallback when the front matter has neither `species` nor `people`:
// the first paragraph must state it plainly as "a <word>" / "an <word>" / "is <Word>".
const SPECIES_WORDS = ["human", "cat", "rabbit", "dog", "raven", "bumblebee", "pandoid", "chthonari", "verdani", "krenyi",
  "cerebraun", "levril", "ilveth", "vessik", "robot", "ai", "android", "gynoid"];

// ---------------------------------------------------------------------------
function readMarkdownFiles(dir) {
  const out = [];
  (function walk(d) {
    for (const name of fs.readdirSync(d).sort()) {
      const full = path.join(d, name);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(".md")) out.push(full);
    }
  })(dir);
  return out;
}

function firstParagraph(content) {
  const paras = content.replace(/\r/g, "").trim().split(/\n\s*\n/);
  for (const p of paras) {
    const t = p.trim();
    if (!t || t.startsWith("#") || t.startsWith(":::") || t.startsWith("<")) continue;
    return t.replace(/\s+/g, " ");
  }
  return "";
}

function stripLinks(text) {
  return text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
}

function affiliationFrom(text) {
  if (!text) return null;
  for (const [re, value] of AFFILIATION_PATTERNS) {
    const m = text.match(re);
    if (m) return typeof value === "function" ? value(m) : value;
  }
  return null;
}

function speciesFromBody(para) {
  const plain = stripLinks(para).toLowerCase();
  for (const w of SPECIES_WORDS) {
    if (new RegExp("\\b(?:a|an|is|the)\\s+" + w + "\\b").test(plain)) return w.charAt(0).toUpperCase() + w.slice(1);
  }
  return null;
}

// Split body text into sentence-like units: a line break (bullets, headings,
// "See also" lists) is a boundary as well as a sentence-ending mark.
// A full stop after one of these is not a sentence end ("Dr. Iona Vale").
const ABBREVIATIONS = "(?<!\\b(?:Dr|Mr|Mrs|Ms|St|Prof|Cdr|Lt|Sgt|Capt|Gen|Col|No|vs|fl|c|b|d|e\\.g|i\\.e)\\.)";
const SENTENCE_SPLITTER = new RegExp("(?<=[.!?])" + ABBREVIATIONS + "\\s+(?=[A-Z\"'*(\\u0001])");
function sentences(content) {
  const units = [];
  for (const line of content.replace(/\r/g, "").split("\n")) {
    const t = line.trim();
    if (!t) continue;
    // Hide every markdown link behind a placeholder so a full stop inside its
    // text or URL cannot split the sentence, then restore after splitting.
    const links = [];
    const hidden = t.replace(/\[[^\]]*\]\([^)]*\)/g, (l) => { links.push(l); return "\u0001" + (links.length - 1) + "\u0002"; });
    for (const s of hidden.split(SENTENCE_SPLITTER)) {
      const restored = s.replace(/\u0001(\d+)\u0002/g, (_, i) => links[Number(i)]);
      if (restored.trim()) units.push(restored.trim());
    }
  }
  return units;
}

function relationLabel(sentence, linkStart, linkEnd, hrefStart) {
  // "[Name](url)'s roster" - the link possesses a relation noun.
  const tail = sentence.slice(hrefStart);
  const pm = tail.match(POSSESSED_RE);
  if (pm) {
    const noun = pm[1].replace(/\s+/g, " ").toLowerCase();
    const hit = POSSESSED_NOUNS.find(([n]) => n === noun);
    if (hit) return hit[1];
  }
  let best = null;
  RELATION_REGEXES.forEach(({ re }, order) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(sentence))) {
      const s = m.index;
      const e = s + m[0].length;
      if (s >= linkStart && e <= linkEnd) continue; // inside the link itself
      const dist = e <= linkStart ? linkStart - e : s - linkEnd;
      if (dist > MAX_LABEL_DISTANCE) continue;
      if (!best || dist < best.dist || (dist === best.dist && order < best.order)) {
        best = { dist, order, label: m[0].replace(/'s$/i, "").replace(/\s+/g, " ").toLowerCase() };
      }
    }
  });
  return best ? best.label : "mentions";
}

function normaliseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(String);
  return String(tags).split(/[,\s]+/).filter(Boolean);
}

// ---------------------------------------------------------------------------
// 1. Characters
const characterFiles = readMarkdownFiles(CHAR_DIR).filter((f) => !/(?:^|[\\/])(?:index|README)\.md$/i.test(f));
const characters = [];
const fmIdToFile = new Map(); // front-matter id -> filename id(s)
const unclassified = [];

for (const file of characterFiles) {
  const id = path.basename(file, ".md");
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const para = firstParagraph(content);
  const tags = normaliseTags(data.tags);
  const role = data.role != null ? String(data.role) : null;
  const fmSpecies = data.species != null ? String(data.species) : data.people != null ? String(data.people) : null;
  const species = fmSpecies || speciesFromBody(para);
  const affiliation = affiliationFrom(role) || affiliationFrom(stripLinks(para)) ||
    (TAG_AFFILIATIONS.find(([t]) => tags.includes(t)) || [null, null])[1];
  if (!species || !affiliation) unclassified.push({ id, species: !!species, affiliation: !!affiliation });

  const fmId = data.id != null ? String(data.id) : null;
  if (fmId) fmIdToFile.set(fmId, (fmIdToFile.get(fmId) || []).concat(id));

  characters.push({
    id,
    frontMatterId: fmId,
    title: data.title != null ? String(data.title) : id,
    role,
    status: data.status != null ? String(data.status) : null,
    species,
    speciesSource: fmSpecies ? (data.species != null ? "front-matter:species" : "front-matter:people") : species ? "body" : null,
    affiliation,
    description: data.description != null ? String(data.description) : null,
    tags,
    image: data.image != null ? String(data.image) : null,
    aliases: Array.isArray(data.aliases) ? data.aliases.map(String) : data.aliases != null ? [String(data.aliases)] : [],
    threads: [],
    seasons: [],
    _content: content
  });
}
characters.sort((a, b) => a.id.localeCompare(b.id));
const fileIds = new Set(characters.map((c) => c.id));

// A chapter's pov id is matched to a page by filename id, then by the page's
// front-matter `id` ("wender" -> karla-wender), then - when the pov carries a
// label such as "General Maren Solveig Krast (Human, ...)" - by exactly one
// page title appearing whole in the label's name part.
const titleIndex = characters.map((c) => ({ id: c.id, re: new RegExp("(^|\\s)" + c.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=\\s|$)") }));
function resolvePovId(povId, label) {
  if (fileIds.has(povId)) return [povId];
  const viaFm = fmIdToFile.get(povId);
  if (viaFm && viaFm.length) return viaFm;
  if (label) {
    const name = String(label).replace(/\s*\(.*$/, "").trim();
    const hits = titleIndex.filter((t) => t.re.test(name)).map((t) => t.id);
    if (hits.length === 1) return hits;
  }
  return [];
}

// 2. Chapters -> seasons and shared-chapter edges
const chapterFiles = readMarkdownFiles(SEASONS_DIR);
const seasonsByChar = new Map();
const sharedPairs = new Map(); // "a|b" -> {weight, chapters}
const unmatchedPovIds = new Map();
let chapterCount = 0;

for (const file of chapterFiles) {
  const { data } = matter(fs.readFileSync(file, "utf8"));
  if (data.season == null || !Array.isArray(data.povs)) continue;
  chapterCount += 1;
  const season = Number(data.season);
  const chapterId = data.id != null ? String(data.id) : path.basename(file, ".md");
  const present = new Set();
  for (const pov of data.povs) {
    const povId = typeof pov === "string" ? pov : pov && pov.id != null ? String(pov.id) : null;
    if (!povId) continue;
    const resolved = resolvePovId(povId, pov && pov.label);
    if (!resolved.length) {
      unmatchedPovIds.set(povId, (unmatchedPovIds.get(povId) || []).concat(chapterId));
      continue;
    }
    for (const r of resolved) present.add(r);
  }
  const ids = [...present].sort();
  for (const cid of ids) {
    if (!seasonsByChar.has(cid)) seasonsByChar.set(cid, new Set());
    seasonsByChar.get(cid).add(season);
  }
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const key = ids[i] + "|" + ids[j];
      const entry = sharedPairs.get(key) || { weight: 0, chapters: [] };
      entry.weight += 1;
      entry.chapters.push(chapterId);
      sharedPairs.set(key, entry);
    }
  }
}

// 3. Threads per character: tags that equal a thread id or one of its
// signature tags, season-N tags, and the seasons of the chapters they narrate.
const threadIndex = new Map(STORYLINE_THREADS.map((t) => [t.id, t]));
for (const c of characters) {
  const seasons = seasonsByChar.get(c.id) || new Set();
  c.seasons = [...seasons].sort((a, b) => a - b);
  const threads = new Set();
  for (const tag of c.tags) {
    if (threadIndex.has(tag)) threads.add(tag);
    for (const t of STORYLINE_THREADS) if ((t.signatureTags || []).includes(tag)) threads.add(t.id);
    const m = tag.match(/^season-(\d+)$/);
    if (m) threads.add(threadForSeason(Number(m[1])).id);
  }
  for (const s of c.seasons) threads.add(threadForSeason(s).id);
  c.threads = STORYLINE_THREADS.map((t) => t.id).concat("unsorted").filter((id) => threads.has(id));
}

// 4. Edges from body links
const linkEdges = new Map(); // from|to|label -> {count, sentence}
const unresolvedLinks = [];
for (const c of characters) {
  for (const sentence of sentences(c._content)) {
    CHAR_LINK.lastIndex = 0;
    let m;
    while ((m = CHAR_LINK.exec(sentence))) {
      const target = m[1] || m[2];
      if (!fileIds.has(target)) {
        const viaFm = fmIdToFile.get(target);
        if (!viaFm || viaFm.length !== 1) { unresolvedLinks.push({ from: c.id, href: target }); continue; }
      }
      const to = fileIds.has(target) ? target : fmIdToFile.get(target)[0];
      if (to === c.id) continue;
      // locate the whole markdown link [text](url) so the label search skips its text
      const linkEnd = m.index + m[0].length;
      const linkStart = sentence.lastIndexOf("[", m.index);
      const label = relationLabel(sentence, linkStart < 0 ? m.index : linkStart, linkEnd, m.index);
      const key = c.id + "|" + to + "|" + label;
      const entry = linkEdges.get(key) || { from: c.id, to, label, count: 0, sentence: stripLinks(sentence).slice(0, 240) };
      entry.count += 1;
      linkEdges.set(key, entry);
    }
  }
  delete c._content;
}

const edges = [...linkEdges.values()].map((e) => ({ from: e.from, to: e.to, label: e.label, kind: e.label === "mentions" ? "mentions" : "relation", count: e.count, sentence: e.sentence }));
for (const [key, entry] of sharedPairs) {
  const [a, b] = key.split("|");
  edges.push({ from: a, to: b, label: "shares a chapter", kind: "shares a chapter", weight: entry.weight, chapters: entry.chapters.sort() });
}
edges.sort((x, y) => x.from.localeCompare(y.from) || x.to.localeCompare(y.to) || x.label.localeCompare(y.label));

// 5. Threads registry
const threads = STORYLINE_THREADS.map((t) => ({
  id: t.id,
  name: t.name,
  seasons: t.seasons.slice().sort((a, b) => a - b),
  tier: t.tier || null,
  description: t.description
}));

// 6. Counts and output
const byLabel = {};
for (const e of edges) byLabel[e.label] = (byLabel[e.label] || 0) + 1;
const byKind = {};
for (const e of edges) byKind[e.kind] = (byKind[e.kind] || 0) + 1;
const sortedObj = (o) => Object.fromEntries(Object.entries(o).sort((a, b) => a[0].localeCompare(b[0])));

const output = {
  version: JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).version,
  generatedAt: new Date().toISOString().slice(0, 10),
  source: { characters: path.relative(ROOT, CHAR_DIR), seasons: path.relative(ROOT, SEASONS_DIR), threads: "lib/storyline-threads.js" },
  counts: {
    characters: characters.length,
    chaptersWithPovs: chapterCount,
    edges: edges.length,
    edgesByKind: sortedObj(byKind),
    edgesByLabel: sortedObj(byLabel),
    threads: threads.length
  },
  unclassified: unclassified.sort((a, b) => a.id.localeCompare(b.id)),
  unmatchedPovIds: [...unmatchedPovIds.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([id, chapters]) => ({ id, chapters: chapters.sort() })),
  unresolvedLinks: unresolvedLinks.sort((a, b) => a.from.localeCompare(b.from) || a.href.localeCompare(b.href)),
  duplicateFrontMatterIds: [...fmIdToFile.entries()].filter(([, v]) => v.length > 1).map(([id, files]) => ({ id, files: files.sort() })),
  characters,
  edges,
  threads
};

const outfile = process.argv[2];
const json = JSON.stringify(output, null, 2) + "\n";
if (outfile) {
  fs.writeFileSync(outfile, json);
  console.log("wrote " + outfile);
} else {
  process.stdout.write(json);
}
console.log(JSON.stringify(output.counts, null, 2));
if (output.unclassified.length) console.log("unclassified: " + output.unclassified.map((u) => u.id).join(", "));
if (output.unmatchedPovIds.length) console.log("pov ids with no character page: " + output.unmatchedPovIds.map((u) => u.id).join(", "));
if (output.unresolvedLinks.length) console.log("unresolved character links: " + output.unresolvedLinks.map((u) => u.from + " -> " + u.href).join(", "));
if (output.duplicateFrontMatterIds.length) console.log("duplicate front-matter ids: " + output.duplicateFrontMatterIds.map((d) => d.id + " (" + d.files.join(", ") + ")").join("; "));
