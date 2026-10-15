#!/usr/bin/env node
// LOCAL AUTHORING TOOL - not part of the build, npm test or CI.
//
// Builds wardrobe.json for the Wardrobe reference artefact from two places in
// the record, and nothing else:
//
//   1. the "## Dress by place" section of story-bible/civilian-dress.md, one
//      "### <Place>" block per setting, each line "- **<Label>:** <text>", and
//      one "*Tags:* `tag`, `tag`" line naming the character tags whose
//      portraits illustrate the place;
//   2. the character pages under src/characters/, for the portraits: title,
//      image, image_alt, for every human or Krenyi page carrying one of those
//      tags.
//
//     node scripts/extract-wardrobe.js <outfile>
//
// Every string in the output is copied from one of those two sources. The
// artefact is a view of the record, never a second copy of it (Dermot's rule
// of 9 October 2026), so a dress line is changed in civilian-dress.md and this
// script re-run, never edited in the JSON. Uses only Node built-ins plus the
// repository's own gray-matter.
"use strict";
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const REPO_ROOT = path.resolve(__dirname, "..");
const NOTE = path.join(REPO_ROOT, "story-bible", "civilian-dress.md");
const CHAR_DIR = path.join(REPO_ROOT, "src", "characters");

// The board shows civilian dress in the record's present, so it leaves out
// the uniformed services and figures of the past. A rule table, not an edit
// to the data: change it here if the board should show them.
const EXCLUDE_TAGS = ["star-rangers", "survey-corps", "orbital-five-o"];
const EXCLUDE_STATUS = /^Historical/;
const EXCLUDE_ROLE = /(Ranger|Survey Team|Survey Corps|Safety Officer|Five-O)/;

function readPlaces() {
  const text = fs.readFileSync(NOTE, "utf8").replace(/\r\n/g, "\n");
  const start = text.indexOf("\n## Dress by place");
  if (start < 0) throw new Error("civilian-dress.md has no '## Dress by place' section");
  const rest = text.slice(start + 1);
  const end = rest.indexOf("\n## ", 3);
  const section = end < 0 ? rest : rest.slice(0, end);
  const intro = section.split("\n### ")[0].split("\n").slice(1).join(" ").replace(/\s+/g, " ").trim();
  const places = [];
  for (const block of section.split("\n### ").slice(1)) {
    const lines = block.split("\n");
    const name = lines[0].trim();
    const place = { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), tags: [], lines: [] };
    let current = null;
    for (const raw of lines.slice(1)) {
      const tagLine = raw.match(/^\*Tags:\*\s*(.*)$/);
      if (tagLine) { place.tags = (tagLine[1].match(/`([^`]+)`/g) || []).map(s => s.slice(1, -1)); place.noTags = /none on record/.test(tagLine[1]); current = null; continue; }
      const item = raw.match(/^- \*\*([^*]+?):\*\*\s*(.*)$/);
      if (item) { current = { label: item[1].trim(), text: item[2].trim() }; place.lines.push(current); continue; }
      if (current && /^\s+\S/.test(raw)) { current.text += " " + raw.trim(); continue; }
      current = null;
    }
    places.push(place);
  }
  return { intro, places };
}

function readCharacters() {
  const out = [];
  for (const file of fs.readdirSync(CHAR_DIR)) {
    if (!file.endsWith(".md")) continue;
    const { data } = matter(fs.readFileSync(path.join(CHAR_DIR, file), "utf8"));
    const species = String(data.species || "");
    if (!/^(Human|Krenyi)/.test(species) || !data.image) continue;
    if (EXCLUDE_STATUS.test(String(data.status || ""))) continue;
    if ((data.tags || []).some(t => EXCLUDE_TAGS.includes(t))) continue;
    if (EXCLUDE_ROLE.test(String(data.role || ""))) continue;
    out.push({
      slug: file.replace(/\.md$/, ""),
      title: data.title,
      role: data.role || "",
      tags: data.tags || [],
      image: `src/images/characters/${data.image}`,
      alt: data.image_alt || "",
    });
  }
  return out.sort((a, b) => a.title.localeCompare(b.title));
}

function build() {
  const { intro, places } = readPlaces();
  const chars = readCharacters();
  const warnings = [];
  for (const place of places) {
    place.characters = chars.filter(c => place.tags.some(t => c.tags.includes(t)))
      .map(({ slug, title, role, image, alt }) => ({ slug, title, role, image, alt }));
    if (!place.tags.length && !place.noTags) warnings.push(`${place.name}: no *Tags:* line`);
    for (const t of place.tags) if (!chars.some(c => c.tags.includes(t))) warnings.push(`${place.name}: tag '${t}' matches no human portrait`);
    if (!place.lines.length) warnings.push(`${place.name}: no dress lines`);
    delete place.noTags;
  }
  for (const w of warnings) console.warn("warning: " + w);
  return {
    version: JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8")).version,
    source: "story-bible/civilian-dress.md, Dress by place; src/characters/",
    intro,
    places,
  };
}

const outfile = process.argv[2];
if (!outfile) { console.error("usage: node scripts/extract-wardrobe.js <outfile>"); process.exit(1); }
const data = build();
fs.writeFileSync(outfile, JSON.stringify(data, null, 2) + "\n");
console.log(`wrote ${outfile}: ${data.places.length} places, ${data.places.reduce((n, p) => n + p.characters.length, 0)} portraits`);
