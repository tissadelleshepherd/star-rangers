#!/usr/bin/env node
// The revelation ledger: which Archive pages the prose has revealed, and
// which it has not yet.
//
// Why this exists (Dermot's ruling, 2026-09-20 — `story-bible/intake-2026-09-20.md`):
// the Archive (lore, glossary, codex) stays fully open; it knows only what
// the record's own institutions could know at the record's present; and
// progressive revelation is tracked as revision, not as hidden pages.
// "Eventually all lore will be revealed by the prose." So every Archive
// page may declare `revealed_by` — the chapter id (s<NN>e<NN>c<NN>) whose
// prose first establishes its subject for the reader — and `revised_by`,
// the chapter ids after which the entry was revised because the record
// learned more. The pages with no `revealed_by` are the prose's worklist.
//
// Like list-canon-facts.js, this is derived from the corpus on every run
// rather than maintained as a document, because status documents in this
// repository have a recorded habit of going stale. Beside the declared
// chapter it prints the first chapter whose body mentions the page's title
// — informational, so a declaration can be checked against the prose and
// a page can be found that the prose already names without declaring it.
//
// Usage:
//   node scripts/revelation-ledger.js            # the ledger, story order
//   node scripts/revelation-ledger.js --check    # only the gate: every
//                                                # declared id names a real chapter
//   node scripts/revelation-ledger.js --unrevealed
//                                                # only the worklist
//
// Exit 1 only when a declared chapter id does not exist or a file fails to
// parse; everything else is information, never a gate.

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const ROOT = path.join(__dirname, "..");
const SEASONS_DIR = path.join(ROOT, "src", "seasons");
const ARCHIVE = [
  { label: "Lore", dir: path.join(ROOT, "src", "lore") },
  { label: "Glossary", dir: path.join(ROOT, "src", "glossary") },
  { label: "Codex", dir: path.join(ROOT, "src", "codex") },
];

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
const unrevealedOnly = args.has("--unrevealed");

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md" && entry.name !== "index.md") out.push(full);
  }
  return out;
}

let failures = 0;
const rel = (f) => path.relative(ROOT, f).replace(/\\/g, "/");

// chapters, in story order, with their bodies for the mention scan
const chapters = [];
for (const file of walk(SEASONS_DIR)) {
  let parsed;
  try { parsed = matter(fs.readFileSync(file, "utf8")); }
  catch (err) { console.error(`PARSE ERROR: ${rel(file)}: ${err.message}`); failures++; continue; }
  const d = parsed.data;
  if (typeof d.season !== "number" || typeof d.chapter !== "number") continue;
  chapters.push({
    id: d.id || path.basename(file, ".md"), title: d.title || "(untitled)",
    season: d.season, episode: d.episode || 0, chapter: d.chapter,
    body: parsed.content.toLowerCase(),
  });
}
chapters.sort((a, b) => a.season - b.season || a.episode - b.episode || a.chapter - b.chapter);
const order = new Map(chapters.map((c, i) => [c.id, i]));

function firstMention(title) {
  const t = String(title || "").toLowerCase().replace(/[^a-z0-9' -]/g, " ").trim();
  if (t.length < 4) return null;
  const re = new RegExp("(^|[^a-z0-9])" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z0-9]|$)");
  for (const c of chapters) if (re.test(c.body)) return c.id;
  return null;
}

const pages = [];
for (const section of ARCHIVE) {
  for (const file of walk(section.dir)) {
    let d;
    try { d = matter(fs.readFileSync(file, "utf8")).data; }
    catch (err) { console.error(`PARSE ERROR: ${rel(file)}: ${err.message}`); failures++; continue; }
    const revealed = d.revealed_by == null ? null : String(d.revealed_by);
    const revised = Array.isArray(d.revised_by) ? d.revised_by.map(String) : d.revised_by == null ? [] : [String(d.revised_by)];
    for (const id of [revealed, ...revised].filter(Boolean)) {
      if (!order.has(id)) { console.error(`${rel(file)}: ${revealed === id ? "revealed_by" : "revised_by"} names ${id}, which is not a published chapter`); failures++; }
    }
    pages.push({ section: section.label, file: rel(file), title: d.title || path.basename(file, ".md"), revealed, revised });
  }
}

if (checkOnly) {
  console.log(failures ? `revelation ledger: ${failures} problem(s)` : `revelation ledger: every declared chapter exists (${pages.filter((p) => p.revealed).length} of ${pages.length} Archive pages revealed).`);
  process.exit(failures ? 1 : 0);
}

const revealedPages = pages.filter((p) => p.revealed && order.has(p.revealed)).sort((a, b) => order.get(a.revealed) - order.get(b.revealed) || a.title.localeCompare(b.title));
const unrevealed = pages.filter((p) => !p.revealed);

if (!unrevealedOnly) {
  console.log("REVEALED — in story order (declared chapter · first chapter that names the title)");
  let current = null;
  for (const p of revealedPages) {
    if (p.revealed !== current) { current = p.revealed; const c = chapters[order.get(current)]; console.log(`\n${c.id} — ${c.title}`); }
    const m = firstMention(p.title);
    const note = m && order.get(m) < order.get(p.revealed) ? ` · named earlier in ${m}` : m && m !== p.revealed ? ` · first named in ${m}` : m ? "" : " · never named in prose";
    console.log(`  - ${p.section}: ${p.title}${p.revised.length ? ` · revised after ${p.revised.join(", ")}` : ""}${note}`);
  }
}

console.log(`\nUNREVEALED — the prose's worklist (${unrevealed.length} pages; · first chapter that names the title, if any)`);
for (const section of ARCHIVE) {
  const list = unrevealed.filter((p) => p.section === section.label).sort((a, b) => a.title.localeCompare(b.title));
  if (!list.length) continue;
  console.log(`\n${section.label} (${list.length})`);
  for (const p of list) { const m = firstMention(p.title); console.log(`  - ${p.title}${m ? ` · named in ${m}` : ""}`); }
}

console.log(`\nArchive pages: ${pages.length}; revealed ${revealedPages.length}, unrevealed ${unrevealed.length}; chapters ${chapters.length}.`);
process.exit(failures ? 1 : 0);
