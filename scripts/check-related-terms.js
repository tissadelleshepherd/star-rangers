#!/usr/bin/env node
//
// Checks that every `related:` term in front matter resolves to a real page.
//
// Catches a failure mode neither `npm test` nor check-internal-links.js can
// see. The `glossaryUrl` filter (.eleventy.js) resolves a related term by
// matching it against page *titles*:
//
//     (glossary).find((item) => item.data.title === term) ||
//     (lore).find((item) => item.data.title === term)
//     -> `/star-rangers${match ? match.url : "/glossary/"}`
//
// On a miss it falls back to the glossary index rather than erroring. So a
// term that no longer matches any title still renders as a perfectly valid
// link - it just quietly points at /glossary/ instead of the entry it names.
// Schema validation passes (related terms are free text), the Eleventy build
// passes, and check-internal-links.js passes (the emitted URL is real). The
// page is simply wrong, and nothing says so.
//
// The usual cause is renaming a page: retitling one lore entry silently
// degrades every `related:` list that named it. Matching is exact, including
// case, punctuation and leading articles - "The Interval" and "Interval" are
// not the same term.
//
// Cross-platform. Run directly:
//     node scripts/check-related-terms.js
//
// Not wired into `npm test`. Exits non-zero on failure, so it can be added to
// the test script or CI if you want a stale related term to break the build.
//
// Scope note: this checks the unfiltered "full site" case, which is the one
// that matters while authoring. Both collections additionally drop pages a
// narrowed deploy.conf excludes, so a term naming an excluded page falls back
// to /glossary/ on that clone even though it resolves here.

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const REPO = path.join(__dirname, "..");
const SRC = path.join(REPO, "src");

// Mirrors the two collections glossaryUrl searches, in its order. Both are
// defined by layout rather than directory (see .eleventy.js), which is why
// this walks all of src/ instead of just src/glossary and src/lore.
const RESOLVABLE_LAYOUTS = ["glossary-entry.njk", "lore-entry.njk"];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (full.endsWith(".md") && entry.name !== "README.md") out.push(full);
  }
  return out;
}

const files = walk(SRC);
const parsed = [];

for (const file of files) {
  try {
    parsed.push({ file, data: matter.read(file).data || {} });
  } catch (err) {
    console.error(`Could not parse front matter: ${path.relative(REPO, file)} (${err.message})`);
    process.exitCode = 1;
  }
}

// Titles glossaryUrl can actually match against.
const titles = new Map();
for (const { file, data } of parsed) {
  if (!RESOLVABLE_LAYOUTS.includes(data.layout)) continue;
  if (!data.title) continue;
  if (!titles.has(data.title)) titles.set(data.title, []);
  titles.get(data.title).push(path.relative(REPO, file).replace(/\\/g, "/"));
}

// A duplicated title isn't broken - glossaryUrl just always picks the first
// match - but it means one of the two pages is unreachable via related terms,
// which is nearly always an accident worth seeing.
const duplicates = [...titles.entries()].filter(([, paths]) => paths.length > 1);

const problems = [];
let checked = 0;

for (const { file, data } of parsed) {
  const related = data.related;
  if (!Array.isArray(related)) continue;
  const where = path.relative(REPO, file).replace(/\\/g, "/");

  const seen = new Set();
  for (const term of related) {
    checked++;
    if (typeof term !== "string") {
      problems.push(`${where} -> non-string related term ${JSON.stringify(term)}`);
      continue;
    }
    if (seen.has(term)) {
      problems.push(`${where} -> duplicate related term "${term}"`);
      continue;
    }
    seen.add(term);

    if (titles.has(term)) continue;

    // Near-miss hints, since the cause is almost always a small drift:
    // an article, a case change, or a title that gained a parenthetical.
    const loose = (s) => s.toLowerCase().replace(/^the\s+/, "").replace(/[^a-z0-9]/g, "");
    const target = loose(term);
    const near = [...titles.keys()].filter((t) => {
      const candidate = loose(t);
      return candidate === target || candidate.startsWith(target) || target.startsWith(candidate);
    });

    problems.push(
      `${where} -> "${term}" matches no page title (link falls back to /glossary/)` +
      (near.length ? `\n      did you mean: ${near.map((n) => `"${n}"`).join(", ")}` : "")
    );
  }
}

console.log(`Related-term check: ${checked} terms across ${files.length} files.`);

if (duplicates.length) {
  console.warn(`\n${duplicates.length} duplicated page title(s) - only the first is reachable:\n`);
  for (const [title, paths] of duplicates) {
    console.warn(`  "${title}"\n      ${paths.join("\n      ")}`);
  }
}

if (problems.length) {
  console.error(`\n${problems.length} unresolved related term(s):\n`);
  for (const p of problems) console.error("  " + p);
  process.exitCode = 1;
} else {
  console.log("All related terms resolve.");
}
