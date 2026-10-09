#!/usr/bin/env node
//
// LOCAL AUTHORING TOOL - not part of the build, `npm test`, or CI.
//
// Links reference entries to each other, section by section. For every
// entry under src/glossary/ and every entry under src/lore/ (recursively),
// finds the first mention of each *other* entry's title in the same section
// that the body does not already link to, and reports it (default) or
// rewrites the file with that mention wrapped in a link to the entry
// (`--write`). A glossary entry is linked to glossary entries, a lore entry
// to lore entries; the two sections share several titles, and an entry that
// already links either page of that slug is left alone.
//
// Why a tool rather than a one-off edit: these are the sections whose pages
// name each other constantly - a tier names the tiers above and below it,
// a planet names its system's other worlds - and a new entry arrives with
// its mentions unlinked, in both directions. Run this after adding or
// retitling an entry; the report is the review and `--write` is the edit.
// The rules (case-sensitive whole-word match on the title and a few
// mechanical variants, longest term first, nothing inside an existing
// link/heading/code/HTML, one link per target at its earliest mention) live
// in lib/glossary-crosslinks.js and are pinned by
// test/glossary-crosslinks.test.js.
//
// The links it writes are ordinary markdown links, so they are checked by
// scripts/check-internal-links.js like any hand-written one.
//
// Usage:
//   node scripts/link-glossary-terms.js                   # report, change nothing
//   node scripts/link-glossary-terms.js --write           # rewrite the files
//   node scripts/link-glossary-terms.js --section lore    # one section only
//
// Exit status is 0 either way; unlinked mentions are a chore, not a fault.

const fs = require("fs");
const path = require("path");
const {
  splitFrontMatter,
  titleFromFrontMatter,
  planCrossLinks,
  applyLinks,
} = require("../lib/glossary-crosslinks");

const ROOT = path.resolve(__dirname, "..");
const SECTIONS = {
  glossary: { dir: "src/glossary", layout: "glossary-entry.njk" },
  lore: { dir: "src/lore", layout: "lore-entry.njk" },
};

const args = process.argv.slice(2);
const write = args.includes("--write");
const sectionArg = args[args.indexOf("--section") + 1];
const sections = args.includes("--section") ? [sectionArg] : Object.keys(SECTIONS);
for (const s of sections) {
  if (!SECTIONS[s]) {
    console.error(`link-glossary-terms: unknown section "${s}" (one of: ${Object.keys(SECTIONS).join(", ")})`);
    process.exit(2);
  }
}

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

function loadSection(name) {
  const { dir, layout } = SECTIONS[name];
  const abs = path.join(ROOT, dir);
  const entries = [];
  for (const file of walk(abs)) {
    const raw = fs.readFileSync(file, "utf8");
    const split = splitFrontMatter(raw);
    if (!split) continue;
    if (!new RegExp(`^layout:\\s*${layout}\\s*$`, "m").test(split.frontMatter)) continue;
    const title = titleFromFrontMatter(split.frontMatter);
    if (!title) continue;
    const rel = path.relative(abs, file).replace(/\\/g, "/").replace(/\.md$/, "");
    entries.push({
      file,
      slug: path.basename(rel),
      url: `/star-rangers/${path.basename(dir)}/${rel}/`,
      title,
      ...split,
    });
  }
  return entries;
}

let total = 0;
let filesTouched = 0;
for (const name of sections) {
  const planned = planCrossLinks(loadSection(name));
  for (const entry of planned) {
    if (entry.links.length === 0) continue;
    filesTouched += 1;
    total += entry.links.length;
    console.log(path.relative(ROOT, entry.file));
    for (const link of entry.links) {
      const line = entry.body.slice(0, link.index).split("\n").length;
      console.log(`  line ${line}: "${link.text}" -> ${link.url}`);
    }
    if (write) {
      const body = applyLinks(entry.body, entry.links);
      fs.writeFileSync(entry.file, `---\n${entry.frontMatter}\n---\n${body}`);
    }
  }
}

if (total === 0) {
  console.log(`link-glossary-terms: every cross-mention in ${sections.join(" and ")} is already linked.`);
} else {
  console.log(
    `link-glossary-terms: ${total} unlinked mention(s) in ${filesTouched} entr${filesTouched === 1 ? "y" : "ies"}` +
      (write ? " - written." : " - run with --write to link them.")
  );
}
