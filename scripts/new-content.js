#!/usr/bin/env node
//
// Interactive scaffold for the 5 layout-driven content types (see
// lib/content-schema.js) - prompts for each type's required fields plus a
// couple of common optional ones, then writes a correctly-shaped file so a
// non-engineer contributor never has to memorize a layout's exact
// front-matter shape by hand. Timeline entries aren't covered - they use
// layout: base.njk with hand-written HTML in the body rather than a
// dedicated layout, so there's no single shape to scaffold (copy an
// existing one instead - see FORKING.md).
//
// Usage:
//   npm run new                # prompts for which type too
//   npm run new -- character   # skips straight to that type's prompts

const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");
const { CONTENT_TYPES, CHARACTER_STATUSES, chapterIdFor } = require("../lib/content-schema");

const SRC_DIR = path.join(__dirname, "..", "src");

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toYamlString(value) {
  return JSON.stringify(String(value));
}

function toYamlList(commaSeparated) {
  const items = commaSeparated
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length ? `[${items.map((item) => toYamlString(item)).join(", ")}]` : null;
}

async function promptRequired(rl, label) {
  let value = "";
  while (!value.trim()) {
    value = await rl.question(`${label} (required): `);
  }
  return value.trim();
}

async function promptOptional(rl, label) {
  const value = await rl.question(`${label} (optional, Enter to skip): `);
  return value.trim();
}

function buildFrontMatter(layout, fields) {
  const lines = ["---", `layout: ${layout}`];
  for (const [key, value] of fields) {
    if (value === null || value === undefined) continue;
    lines.push(`${key}: ${value}`);
  }
  lines.push("---");
  return lines.join("\n");
}

function writeFile(filePath, frontMatter, title) {
  if (fs.existsSync(filePath)) {
    throw new Error(`Refusing to overwrite existing file: ${path.relative(process.cwd(), filePath)}`);
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const body = `${frontMatter}\n\nTODO: write ${title}.\n`;
  fs.writeFileSync(filePath, body);
  console.log(`\nCreated ${path.relative(process.cwd(), filePath)}`);
  console.log(`Fill in the body, then \`npm start\` to preview it.`);
}

async function scaffoldSimple(rl, typeKey) {
  const type = CONTENT_TYPES[typeKey];
  const title = await promptRequired(rl, "Title");
  const fields = [["title", toYamlString(title)]];

  if (typeKey === "character") {
    const id = await promptRequired(rl, "id (short slug used to cross-reference this character elsewhere, e.g. in a chapter's povs list)");
    fields.push(["id", toYamlString(id)]);
  }

  // Anything else the schema marks required (currently a codex entry's
  // `author`) - prompted the same way, so adding a required field to the
  // registry can't produce a scaffold that fails validation on creation.
  const alreadyPrompted = new Set(["title", ...(typeKey === "character" ? ["id"] : [])]);
  for (const field of type.required) {
    if (alreadyPrompted.has(field)) continue;
    const label = field === "author"
      ? "author (the in-universe source this document is attributed to - a codex entry is that source's account, not settled fact)"
      : field;
    fields.push([field, toYamlString(await promptRequired(rl, label))]);
  }

  if (typeKey === "journal") {
    // Real-world publish date, same convention as a chapter's own `date` -
    // today is exactly right for an entry being scaffolded right now, and
    // it's what journalEntries is sorted and listed by (see .eleventy.js).
    const today = new Date().toISOString().slice(0, 10);
    fields.push(["date", toYamlString(today)]);
  }

  for (const field of type.optionalFields) {
    if (typeKey === "character" && field === "id") continue; // already asked above, required
    const isListField = ["tags", "aliases", "related"].includes(field);
    // A character's status is a five-value vocabulary (CHARACTER_STATUSES);
    // show the values so the scaffold can't invent a sixth.
    const label = typeKey === "character" && field === "status"
      ? `status (${Object.values(CHARACTER_STATUSES).map((s) => s.label).join(" / ")})`
      : field;
    const raw = await promptOptional(rl, label);
    if (!raw) continue;
    fields.push([field, isListField ? toYamlList(raw) : toYamlString(raw)]);
  }

  const slug = slugify(title);
  const filePath = path.join(SRC_DIR, type.dir.replace(/^src\//, ""), `${slug}.md`);
  writeFile(filePath, buildFrontMatter(type.layout, fields), title);
}

async function scaffoldChapter(rl) {
  const type = CONTENT_TYPES.chapter;
  const season = await promptRequired(rl, "Season number");
  const episode = await promptRequired(rl, "Episode number");
  const chapter = await promptRequired(rl, "Chapter number");
  const title = await promptRequired(rl, "Title");
  const id = chapterIdFor(season, episode, chapter);

  const today = new Date().toISOString().slice(0, 10);
  const fields = [
    ["season", season],
    ["episode", episode],
    ["chapter", chapter],
    ["id", toYamlString(id)],
    ["title", toYamlString(title)],
    // Real-world publish date for the Atom feed (src/feed.njk) - distinct
    // from the in-universe "timestamp" prompted for below. Today is
    // exactly right for a chapter being scaffolded right now.
    ["date", toYamlString(today)],
    // Permanent giscus discussion identity, separate from `id` above - see
    // its doc in lib/content-schema.js. A brand-new chapter has no prior
    // identity to preserve, so a fresh title slug is exactly right; if this
    // chapter is ever renumbered later, carry this same value forward by
    // hand rather than regenerating it.
    ["comment_id", toYamlString(slugify(title))]
  ];

  for (const field of ["timestamp", "location", "description"]) {
    const raw = await promptOptional(rl, field);
    if (raw) fields.push([field, toYamlString(raw)]);
  }
  const tags = await promptOptional(rl, "tags (comma-separated)");
  if (tags) fields.push(["tags", toYamlList(tags)]);

  console.log(`\n"canon_facts" and "povs" are structured lists best edited directly in the file - added as empty placeholders below.`);
  fields.push(["canon_facts", "[]"]);
  fields.push(["povs", "[]"]);

  const seasonDir = `s${String(season).padStart(2, "0")}`;
  const episodeDir = `e${String(episode).padStart(2, "0")}`;
  const filePath = path.join(SRC_DIR, "seasons", seasonDir, episodeDir, `${id}.md`);
  writeFile(filePath, buildFrontMatter(type.layout, fields), title);
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    let typeKey = process.argv[2];
    if (!typeKey) {
      console.log(`Content types: ${Object.keys(CONTENT_TYPES).join(", ")}`);
      typeKey = await promptRequired(rl, "Which type?");
    }
    if (!CONTENT_TYPES[typeKey]) {
      throw new Error(`Unknown type "${typeKey}". Choose one of: ${Object.keys(CONTENT_TYPES).join(", ")}`);
    }

    if (typeKey === "chapter") {
      await scaffoldChapter(rl);
    } else {
      await scaffoldSimple(rl, typeKey);
    }
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
