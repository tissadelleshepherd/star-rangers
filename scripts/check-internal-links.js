#!/usr/bin/env node
//
// Checks that every internal /star-rangers/... link in src/ and lib/ resolves
// to a real page or asset. Catches the failure mode `npm test` doesn't:
// front-matter validation and the Eleventy dry run both pass happily while a
// cross-link points at a page that was renamed or never written.
//
// Run directly:
//     node scripts/check-internal-links.js
//
// Part of `npm test` since 2026-08-24. It exits non-zero on failure.
//
// Since 2026-10-09 a link's #fragment is checked too, against the ids the
// target page actually exposes: the heading ids the build's own markdown
// renderer assigns (lib/markdown-containers.js, markdown-it-anchor) plus any
// literal id="..." written in the page's source, which is how the License
// section of the homepage and the Union Irish anchor of the canonical guide
// are addressed. Until then every fragment in the corpus was dead - headings
// had no ids - and this script passed them because it checked the path alone.
// The ids come from the same renderer the build uses rather than from a copy
// of its slug rule, so the two cannot drift. A same-page "](#fragment)" in a
// markdown file is checked against that file; the same shape in a layout
// (base.njk's skip link) addresses an id the layout itself supplies and is
// counted as skipped rather than guessed at.
//
// Nunjucks-templated hrefs (containing "{{") are skipped: they are computed at
// build time and cannot be resolved statically.

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { createMarkdownRenderer } = require("../lib/markdown-containers");

const REPO = path.join(__dirname, "..");
const PREFIX = "/star-rangers/";

// The canonical site's tier, so a heading inside a contemplative-only block
// is not counted as a target the general-tier build would expose.
const md = createMarkdownRenderer();

// Both roots that hold authored content with links in it. src/ is the obvious
// one; lib/ earns its place because per-domain copy lives in lib/editions.js -
// the homepage hero taglines, which used to sit inline in src/index.md and
// silently left this script's coverage when they moved.
//
// Scanning by ROOT rather than keeping a hand-list of exceptions is the point.
// The first version of this fix was exactly that list, and a list of
// exceptions is a thing that goes stale: the next file with authored links
// outside src/ would not have been added to it, and nobody would have noticed,
// which is the same failure this whole script exists to catch.
const SCAN_ROOTS = ["src", "lib"];

// `.js` is included so lib/editions.js is covered. Verified safe rather than
// assumed: src/js/pov.js and src/js/search.js contain no /star-rangers/
// strings at all, and lib/content-filter.js's three occurrences are in
// comments and a regex literal - none of them href/src/markdown-link shaped,
// so linkRe cannot match them.
//
// One consequence worth knowing: an ILLUSTRATIVE url written as href="..." in
// a code comment now gets checked like a real one. That is arguably a feature -
// it caught a made-up example in lib/editions.js's own comments the day this
// landed - but if a comment genuinely needs a fake path, describe it in prose
// rather than quoting it in attribute form.
const SCAN_EXT = /\.(md|njk|html|js)$/;

const ASSET_DIRS = ["images/", "audio/", "video/", "css/", "js/", "static/"];
const ASSET_EXT = /\.(jpg|jpeg|png|gif|svg|webp|ico|m4a|wav|mp3|mp4|webm|css|js|xml|json|pdf|txt)$/i;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// Two distinct file lists, and keeping them apart matters. `srcFiles` is what
// the set of real PAGES is derived from, and only src/ produces pages - a
// path.relative(SRC, ...) on a lib/ file would yield "../lib/..." and invent a
// page that does not exist. `scanFiles` is what gets READ for links, across
// every root.
const SRC = path.join(REPO, "src");
const srcFiles = walk(SRC);
const scanFiles = SCAN_ROOTS.flatMap((root) => walk(path.join(REPO, root)));

// Every URL Eleventy will emit from a markdown file:
//   src/lore/foo.md        -> /star-rangers/lore/foo/
//   src/lore/index.md      -> /star-rangers/lore/
//   src/index.md           -> /star-rangers/
const pages = new Set();
const pageSource = new Map(); // url -> the markdown file that renders it
for (const file of srcFiles) {
  if (!file.endsWith(".md")) continue;
  let rel = path.relative(SRC, file).replace(/\\/g, "/").replace(/\.md$/, "");
  if (rel === "index") rel = "";
  else if (rel.endsWith("/index")) rel = rel.slice(0, -"/index".length);
  const url = PREFIX + (rel ? rel + "/" : "");
  pages.add(url);
  pageSource.set(url, file);
}

// The ids a markdown page exposes, computed once per file: every heading id
// the renderer assigns to its body, plus every literal id="..." in its
// source (HTML the page carries, which markdown-it passes through).
const idCache = new Map();
function idsOf(file) {
  if (idCache.has(file)) return idCache.get(file);
  const ids = new Set();
  const { content } = matter(fs.readFileSync(file, "utf8"));
  for (const token of md.parse(content, {})) {
    if (token.type === "heading_open") {
      const id = token.attrGet("id");
      if (id) ids.add(id);
    }
  }
  const idRe = /\bid="([^"]+)"/g;
  let m;
  while ((m = idRe.exec(content)) !== null) ids.add(m[1]);
  idCache.set(file, ids);
  return ids;
}

function fragmentOf(url) {
  const hash = url.indexOf("#");
  if (hash === -1) return "";
  try {
    return decodeURIComponent(url.slice(hash + 1));
  } catch {
    return url.slice(hash + 1);
  }
}

const linkRe = /\]\((\/star-rangers\/[^)\s]*)\)|(?:href|src)="(\/star-rangers\/[^"]*)"/g;
const samePageRe = /\]\((#[^)\s]+)\)|href="(#[^"]+)"/g;

const problems = [];
let checked = 0;
let fragments = 0;
let skipped = 0;

let filesScanned = 0;

for (const file of scanFiles) {
  if (!SCAN_EXT.test(file)) continue;
  filesScanned++;
  const text = fs.readFileSync(file, "utf8");
  const where = path.relative(REPO, file).replace(/\\/g, "/");
  let m;

  // Same-page fragments. Only a markdown page under src/ can be resolved:
  // its ids are its own. A layout's same-page link points at an id the
  // layout (or the page it wraps) supplies, which this script cannot see.
  while ((m = samePageRe.exec(text)) !== null) {
    const raw = m[1] || m[2];
    if (raw.includes("{{") || raw.includes("{%")) { skipped++; continue; }
    if (!file.endsWith(".md") || !file.startsWith(SRC)) { skipped++; continue; }
    fragments++;
    const fragment = fragmentOf(raw);
    if (!idsOf(file).has(fragment)) {
      problems.push(`${where} -> missing fragment #${fragment} on the same page`);
    }
  }

  while ((m = linkRe.exec(text)) !== null) {
    const full = (m[1] || m[2]).trim();
    if (full.includes("{{") || full.includes("{%")) { skipped++; continue; }
    const fragment = fragmentOf(full);
    const url = full.split("#")[0].split("?")[0];
    if (!url) continue;
    checked++;

    const rel = url.slice(PREFIX.length);
    const isAsset = ASSET_DIRS.some((d) => rel.startsWith(d)) || ASSET_EXT.test(url);
    if (isAsset) {
      if (!fs.existsSync(path.join(SRC, rel))) {
        problems.push(`${where} -> missing asset ${url}`);
      }
      continue;
    }

    const normalized = url.endsWith("/") ? url : url + "/";
    if (!pages.has(normalized)) {
      problems.push(`${where} -> missing page ${url}`);
      continue;
    }

    if (fragment) {
      fragments++;
      const source = pageSource.get(normalized);
      if (!source) { skipped++; continue; } // a page a template paginates; no source to read
      if (!idsOf(source).has(fragment)) {
        problems.push(`${where} -> missing fragment #${fragment} on ${normalized}`);
      }
    }
  }
}

// Counts files actually READ, not files walked. The previous wording divided by
// every file under src/, images and audio included, so the figure was always
// larger than the number of files that could contain a link in the first place.
console.log(
  `Internal link check: ${checked} links across ${filesScanned} scanned files ` +
  `in ${SCAN_ROOTS.join("/, ")}/ (${fragments} fragments resolved, ${skipped} templated or unresolvable links skipped).`
);

if (problems.length) {
  console.error(`\n${problems.length} broken link(s):\n`);
  for (const p of problems) console.error("  " + p);
  process.exitCode = 1;
} else {
  console.log("All internal links resolve.");
}
