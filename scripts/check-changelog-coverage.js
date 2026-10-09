#!/usr/bin/env node
/**
 * Reports content pages that exist in the repo but are never mentioned in
 * CHANGELOG.md.
 *
 * WHY THIS EXISTS: `check-changelog.js` next door catches released history
 * being *destroyed*. Nothing caught the opposite failure - a page shipping
 * without ever being written down. An audit on 2026-09-01 found 24 pages that
 * had never been mentioned in the changelog by path, slug or title: eight
 * glossary entries, eight timeline entries, four codex entries, three lore
 * entries and one journal entry. `scripts/`, `lib/` and `test/` were fully
 * covered, which fits the shape of the problem: engine work is usually the
 * point of its PR, while a glossary entry is often a supporting file added
 * alongside whatever the PR was really about, and it is the supporting file
 * that gets forgotten.
 *
 * WHY THIS IS A WARNING AND NOT A GATE. Two reasons, and both matter.
 *
 * First, whether a change deserves a changelog line is a *judgement*, and the
 * authority rules in CLAUDE.md put judgement outside what a gate may decide.
 * The toolchain can prove a page is well-formed; it cannot know whether a
 * one-line glossary stub is worth a reader's attention.
 *
 * Second, the obvious gate - "a PR touching src/ must touch CHANGELOG.md" - is
 * satisfiable by a junk line. It would manufacture the appearance of coverage
 * without the substance, which is the same failure this project already names
 * elsewhere: a check that passes for the wrong reason is worse than no check.
 *
 * So this prints and moves on. It is useful only while the count normally
 * reads zero, which is why the 2026-09-01 backlog was filed as a changelog
 * entry before this script was wired into `npm test`. If the count is allowed
 * to sit at some permanent nonzero number, this becomes noise people learn to
 * skip past, and should be retired rather than tolerated.
 *
 * MATCHING IS DELIBERATELY LOOSE, because a false alarm here costs more than a
 * miss. A page counts as mentioned if the changelog contains its path, its
 * slug, or its front-matter title with any leading article and any subtitle
 * after a colon removed. The known weak spot is `src/timeline/`, whose titles
 * are whole sentences rather than terms - an entry may discuss the event in
 * other words and still be reported here. Prefer under-reporting to nagging.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CHANGELOG = path.join(ROOT, "CHANGELOG.md");

// Content only. Engine directories are covered by their own PRs' entries and
// have never been the failure mode.
const DIRS = [
  "src/lore",
  "src/glossary",
  "src/codex",
  "src/journal",
  "src/characters",
  "src/timeline",
];

function walk(rel, out = []) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const next = `${rel}/${entry.name}`;
    if (entry.isDirectory()) walk(next, out);
    else if (entry.name.endsWith(".md") && entry.name !== "README.md") out.push(next);
  }
  return out;
}

function frontMatterTitle(rel) {
  const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!block) return null;
  const title = block[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
  return title ? title[1].trim() : null;
}

const changelog = fs.readFileSync(CHANGELOG, "utf8");
const lower = changelog.toLowerCase();

const missing = [];
let checked = 0;

for (const dir of DIRS) {
  for (const file of walk(dir)) {
    if (path.basename(file) === "index.md") continue;
    checked++;
    const slug = path.basename(file, ".md");
    if (changelog.includes(file) || changelog.includes(slug)) continue;

    let title = null;
    try {
      title = frontMatterTitle(file);
    } catch {
      // Unreadable front matter is validate-content.js's problem, not this
      // script's. Fall through and report on path/slug alone.
    }
    if (title) {
      const core = title.replace(/^(the|a|an)\s+/i, "").split(":")[0].trim();
      if (core.length > 3 && lower.includes(core.toLowerCase())) continue;
    }
    missing.push({ file, title });
  }
}

if (missing.length === 0) {
  console.log(`Changelog coverage: all ${checked} content pages are mentioned.`);
  process.exit(0);
}

const byDir = new Map();
for (const m of missing) {
  const dir = path.dirname(m.file).split("/").slice(0, 2).join("/");
  if (!byDir.has(dir)) byDir.set(dir, []);
  byDir.get(dir).push(m);
}

console.log(
  `Changelog coverage: ${missing.length} of ${checked} content pages are not ` +
    `mentioned in CHANGELOG.md.`,
);
for (const [dir, list] of [...byDir].sort()) {
  console.log(`  ${dir} (${list.length})`);
  for (const m of list.sort((a, b) => a.file.localeCompare(b.file))) {
    console.log(`    ${m.file}${m.title ? `  - "${m.title}"` : ""}`);
  }
}
console.log(
  "  Not a failure. Add an entry if the page is worth a reader knowing about, " +
    "or ignore it if it genuinely is not.",
);
