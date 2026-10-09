#!/usr/bin/env node
// LOCAL AUTHORING TOOL - not part of the build, npm test or CI.
//
// Emits the data behind the "Six Hundred Years" artefact (a private Claude
// page, see story-bible/intake-2026-10-09.md, "Derived artefacts"): every
// dated anchor the record holds between the present day and the record's
// present, as JSON, so the page is regenerated from the repository at each
// release rather than kept by hand. Dermot's rule, 9 October 2026: an
// artefact over the record is a derived view and never a second record.
//
// Two sources, both read from the files:
//   1. src/timeline/*.md - every entry's title and the first dated phrase in
//      its body (NNNN UCSD / CE / AD), which is how the Timeline dates itself.
//   2. LORE_ANCHORS below - dated facts that live in Lore prose and have no
//      timeline entry. Each row names the page and a phrase that must appear
//      on it; a row whose phrase is no longer on its page is reported and
//      dropped, which is the check against the record. The one-line labels
//      are editorial and live here, in the script, never in the output.
//
// Usage: node scripts/extract-timeline.js [outfile]   (default: stdout)

"use strict";
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const ROOT = path.resolve(__dirname, "..");
const OFFSET = 200;

// Lore anchors: [UCSD year, span end or null, label, page under src/, phrase that must appear on the page]
const LORE_ANCHORS = [
  [2289, null, "United Space Industry Standards take on the space mandate", "lore/star-rangers-safety-corps.md", "2089 CE"],
  [2337, null, "United Space Consortium's civil administration begins", "lore/climate-repair-and-terraforming.md", "2337 UCSD"],
  [2543, null, "Tycho Accords; the Solar System's first interplanetary governing body", "lore/solar-system-concord.md", "2543 UCSD"],
  [2561, 2589, "Currach Fleet departs, six generation arks", "lore/celtic-union-of-planets.md", "2561 and 2589 UCSD"],
  [2609, null, "The Imperium ends", "lore/the-imperium.md", "2609 UCSD"],
  [2689, null, "The Veritas Report reads the war's records", "lore/ai-safety-kernel.md", "2689 UCSD"],
  [2732, null, "Patience First found, the crew alive", "lore/eden-space-habitat.md", "2732 UCSD"],
  [2790, null, "The Concord restyled; the Federation's Council seat first filled, 2791", "lore/solar-system-concord.md", "2790 UCSD"],
  [2813, null, "Threshold Station built, about", "lore/threshold-station.md", "2813 UCSD"],
  [2831, null, "Dock Seven, the Last Stand", "lore/fold-transit-catastrophic-failure.md", "2831 UCSD"],
  [2833, null, "Archwarden restyled", "lore/star-rangers-command-hierarchy.md", "2833 UCSD"],
];

function toUcsd(n, era) {
  if (era === "UCSD") return n;
  return n + OFFSET; // CE and AD are the same count
}

function timelineEntries() {
  const dir = path.join(ROOT, "src", "timeline");
  const out = [];
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith(".md") || f === "index.md" || f === "README.md") continue;
    const fm = matter(fs.readFileSync(path.join(dir, f), "utf8"));
    const m = fm.content.match(/\b(1[0-9]{3}|2[0-9]{3}) (UCSD|CE|AD)\b/);
    if (!m) continue;
    out.push({ y: toUcsd(Number(m[1]), m[2]), span: null, t: String(fm.data.title || f), w: `Timeline: ${f.replace(/\.md$/, "")}`, k: "timeline" });
  }
  return out;
}

function loreAnchors() {
  const out = [];
  const missing = [];
  for (const [y, span, t, page, phrase] of LORE_ANCHORS) {
    const p = path.join(ROOT, "src", page);
    const ok = fs.existsSync(p) && fs.readFileSync(p, "utf8").includes(phrase);
    if (!ok) { missing.push({ page, phrase }); continue; }
    out.push({ y, span, t, w: `Lore: ${page.replace(/^lore\//, "").replace(/\.md$/, "")}`, k: "lore" });
  }
  return { out, missing };
}

function main() {
  const outfile = process.argv[2];
  const lore = loreAnchors();
  const anchors = [...timelineEntries(), ...lore.out].sort((a, b) => a.y - b.y || a.t.localeCompare(b.t));
  const data = {
    generatedAt: new Date().toISOString().slice(0, 10),
    version: JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).version,
    offset: OFFSET,
    present: 2826,
    anchors,
    dropped: lore.missing,
  };
  const json = JSON.stringify(data, null, 2) + "\n";
  if (outfile) fs.writeFileSync(outfile, json); else process.stdout.write(json);
  console.error(`extract-timeline: ${anchors.length} anchors (${lore.out.length} lore, ${anchors.length - lore.out.length} timeline)` + (lore.missing.length ? `; ${lore.missing.length} lore anchor(s) no longer on their page: ${lore.missing.map((m) => m.page).join(", ")}` : ""));
}

main();
