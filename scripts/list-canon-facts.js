#!/usr/bin/env node
// Aggregates every chapter's `canon_facts` into one readable list, in story
// order, with the declaring chapter beside each fact.
//
// Why this exists: the story bible's publication test asks "does this tell a
// reader something the story hasn't told them yet?" — and nothing showed what
// the story *has* told them. `canon_facts` is already the per-chapter record
// of revelation; this script is the aggregate view. It is deliberately
// derived from the corpus on every run rather than maintained as a ledger,
// because this repo's status documents have a recorded habit of going stale.
//
// Because canon is centralised and deploy filtering only subtracts pages,
// the full corpus scanned here is the *maximal* reader — checking a spoiler
// against this list is automatically conservative for every edition.
//
// Usage:
//   node scripts/list-canon-facts.js            # full list, story order
//   node scripts/list-canon-facts.js <term>...  # only facts matching every
//                                               # term (case-insensitive)
//
// Always exits 0 when the scan succeeds (it is informational, not a gate);
// exits 1 only if a chapter file cannot be parsed.

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SEASONS_DIR = path.join(__dirname, "..", "src", "seasons");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md") out.push(full);
  }
  return out;
}

const terms = process.argv.slice(2).map((t) => t.toLowerCase());

let parseFailures = 0;
const chapters = [];

for (const file of walk(SEASONS_DIR)) {
  let data;
  try {
    data = matter(fs.readFileSync(file, "utf8")).data;
  } catch (err) {
    console.error(`PARSE ERROR: ${path.relative(process.cwd(), file)}: ${err.message}`);
    parseFailures++;
    continue;
  }
  // Chapters carry season/episode/chapter numbers; episode and season
  // index pages don't, and have no canon_facts to report.
  if (typeof data.season !== "number" || typeof data.chapter !== "number") continue;
  chapters.push({
    id: data.id || path.basename(file, ".md"),
    title: data.title || "(untitled)",
    season: data.season,
    episode: data.episode || 0,
    chapter: data.chapter,
    facts: Array.isArray(data.canon_facts) ? data.canon_facts : [],
  });
}

chapters.sort(
  (a, b) => a.season - b.season || a.episode - b.episode || a.chapter - b.chapter
);

let factCount = 0;
let shownCount = 0;
let bareChapters = 0;

for (const ch of chapters) {
  factCount += ch.facts.length;
  if (ch.facts.length === 0) {
    bareChapters++;
    continue;
  }
  const shown = terms.length
    ? ch.facts.filter((f) => terms.every((t) => f.toLowerCase().includes(t)))
    : ch.facts;
  if (shown.length === 0) continue;
  console.log(`\n${ch.id} — ${ch.title}`);
  for (const fact of shown) {
    console.log(`  - ${fact}`);
    shownCount++;
  }
}

console.log(
  `\nCanon facts: ${factCount} across ${chapters.length} chapters` +
    (bareChapters ? ` (${bareChapters} chapters declare none)` : "") +
    (terms.length ? `; ${shownCount} matching "${terms.join(" ")}"` : "") +
    "."
);

if (terms.length && shownCount === 0) {
  console.log(
    "No published chapter asserts a canon fact matching that term — but prose can reveal what it never declares, so grep src/ before treating this as proof."
  );
}

process.exit(parseFailures ? 1 : 0);
