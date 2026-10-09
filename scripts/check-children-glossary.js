#!/usr/bin/env node
//
// THE CHILDREN'S GLOSSARY RULE (Dermot's choice, 2026-10-05 - "Option 1, on
// CHILDREN_TIER", among three shapes put to him at his question whether almost
// all glossary entries should reach the Undercover Pets edition;
// story-bible/intake-2026-10-05.md):
//
//   a glossary entry joins the children's tier when a page the tier carries
//   links it, and it carries a `plain:` line.
//
// It joins by taking the tier's topic tag (`undercover-pets.com`, the one
// CHILDREN_TIER names in lib/editions.js, which every children's edition
// inherits), so the filter needs nothing new. What this script checks is the
// two halves of the rule that the filter cannot see:
//
//   1. REACH. A page a children's-tier edition carries - a chapter, a cast
//      page, a timeline, lore, codex or journal page, or the edition's own
//      copy in lib/editions.js (hero tagline, reading plan, about) - may
//      not link a glossary entry that edition renders as the "Not on this
//      site" placeholder. The link checker cannot catch this, because the
//      placeholder is a real page; it was exactly how the old pets tagline
//      came to point at /glossary/concordant/ for a month.
//
//      ONE HOP, NOT A CLOSURE. A carried glossary entry's own links to other
//      entries are deliberately NOT enforced: they stop at the tier's edge,
//      where the child meets the plain-register placeholder, which is that
//      edition's designed behaviour for the edge of its set. The first run
//      of this script enforced them and found that Boundary Zone, reached
//      from one timeline entry, links six cosmology entries, each of which
//      links more - the whole cosmology web, which is the "almost all" shape
//      Dermot declined. An entry one onward link reaches MAY still join on
//      that link (UCSD did, from Cyborg), but the gate does not require it.
//      The per-edition summary line counts those edge links so the number is
//      visible without being a warning anyone learns to skip.
//   2. REGISTER. Every glossary entry a children's-tier edition carries has
//      a `plain:` line, because the children's glossary index shows that
//      line in place of the adult-register `short` (src/glossary/index.md),
//      and an entry without one would show nothing there.
//
// Both fail the run. A third finding only warns: an entry the tier carries
// that nothing on the tier links. The rule says reach is the criterion, so
// an unlinked entry has stopped following it - but whether to untag it or
// to link it is a judgement, which is what a warning is for.
//
// Runs once per edition whose tier is "children" (undercover-pets.com and
// told.fianilchruinne.com today), each with its own filter, since the Told
// edition extends the floor's threads and so carries pages the pets edition
// does not. Index pages (src/**/index.md) are not scanned: they are
// navigation, and an excluded season's index is not a page the tier carries
// in the sense this rule means.
//
// Part of `npm test` since 2026-10-05. No arguments.

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const { allEditions } = require("../lib/editions");
const { isContentIncluded } = require("../lib/classify-content");
const { getRelatedContentUrls } = require("../lib/content-filter");

const REPO = path.join(__dirname, "..");
const SRC = path.join(REPO, "src");
const GLOSSARY_DIR = path.join(SRC, "glossary");
const CONTENT_DIRS = ["characters", "seasons", "lore", "glossary", "codex", "timeline", "journal"];
const GLOSSARY_LINK = /\/star-rangers\/glossary\/([a-z0-9-]+)\//g;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".md") && entry.name !== "README.md" && entry.name !== "index.md") out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(REPO, file).split(path.sep).join("/");
}

// Mirrors scripts/validate-content.js's urlForContentFile: the site-relative
// URL Eleventy gives a content file, which isRelatedTopicPageIncluded keys on.
function urlFor(file, data) {
  if (data.permalink) {
    const p = String(data.permalink);
    return p.startsWith("/") ? p : `/${p}`;
  }
  let url = "/" + path.relative(SRC, file).split(path.sep).join("/");
  url = url.replace(/\.md$/, "");
  if (!url.endsWith("/")) url += "/";
  return url;
}

// The same shape lib/content-filter.js's getContentFilter builds from the
// env, built here from the edition's own lists instead, so the check sees
// what a deploy of that edition sees.
function filterFor(edition) {
  const lower = (list) => (Array.isArray(list) ? list : []).map((s) => String(s).trim().toLowerCase()).filter(Boolean);
  const characters = lower(edition.characters);
  const topics = lower(edition.topics);
  const threads = lower(edition.threads);
  const filter = {
    characters,
    topics,
    threads,
    tagMatches: new Set([...characters, ...topics, ...threads]),
    active: characters.length > 0 || topics.length > 0 || threads.length > 0,
    tier: edition.tier
  };
  // .eleventy.js attaches this the same way: the background pages an
  // included character's own bio links to, which a CHARACTERS-narrowed
  // build carries along (empty unless the edition names characters).
  filter.relatedUrls = getRelatedContentUrls(filter);
  return filter;
}

function linksIn(text) {
  const out = new Set();
  for (const m of String(text).matchAll(GLOSSARY_LINK)) out.add(m[1]);
  return out;
}

function main() {
  const failures = [];
  const warnings = [];

  const pages = CONTENT_DIRS.flatMap((d) => walk(path.join(SRC, d))).map((file) => {
    const { data, content } = matter(fs.readFileSync(file, "utf8"));
    return { file, data, content, url: urlFor(file, data) };
  });
  const glossaryBySlug = new Map(
    pages
      .filter((p) => path.dirname(p.file) === GLOSSARY_DIR)
      .map((p) => [path.basename(p.file, ".md"), p])
  );

  const editions = allEditions().filter((e) => e.tier === "children");
  if (!editions.length) {
    console.log("check-children-glossary: no edition sits at the children's tier; nothing to check.");
    return;
  }

  for (const edition of editions) {
    const label = `${edition.id} (${(edition.domains || []).join(", ")})`;
    const filter = filterFor(edition);
    const included = pages.filter((p) =>
      isContentIncluded({ ...p.data, page: { inputPath: "./" + rel(p.file), url: p.url } }, filter)
    );
    const carried = new Set(
      included.filter((p) => glossaryBySlug.has(path.basename(p.file, ".md")) && path.dirname(p.file) === GLOSSARY_DIR)
        .map((p) => path.basename(p.file, ".md"))
    );

    // Where each glossary link on this edition comes from. A source that is
    // itself a glossary entry counts for REACH (its links can bring an entry
    // in) but is not enforced (see ONE HOP above).
    const sources = [];
    for (const p of included) {
      sources.push({ name: rel(p.file), slugs: linksIn(p.content), glossary: path.dirname(p.file) === GLOSSARY_DIR });
    }
    sources.push({ name: `lib/editions.js (${edition.id} copy)`, slugs: linksIn(JSON.stringify(edition)), glossary: false });

    const linked = new Set();
    let edgeLinks = 0;
    for (const { name, slugs, glossary } of sources) {
      for (const slug of slugs) {
        linked.add(slug);
        const target = glossaryBySlug.get(slug);
        if (!target) continue; // check-internal-links.js owns a link to nothing
        if (!carried.has(slug)) {
          if (glossary) {
            edgeLinks += 1;
            continue;
          }
          failures.push(
            `${label}: ${name} links /glossary/${slug}/, which this edition renders as a placeholder. ` +
              `Tag the entry into the tier (CHILDREN_TIER's topic, \`undercover-pets.com\`) and give it a \`plain:\` line, or drop the link.`
          );
        }
      }
    }

    for (const slug of [...carried].sort()) {
      const entry = glossaryBySlug.get(slug);
      if (!String(entry.data.plain || "").trim()) {
        failures.push(
          `${label}: src/glossary/${slug}.md is on this edition and has no \`plain:\` line; the children's glossary index shows that line in place of \`short\`.`
        );
      }
      if (!linked.has(slug)) {
        warnings.push(
          `${label}: src/glossary/${slug}.md is on this edition but nothing the edition carries links it. The rule is that reach is the criterion: link it, or take the tag off.`
        );
      }
    }

    console.log(
      `check-children-glossary: ${label} carries ${carried.size} glossary entries (${[...carried].sort().join(", ") || "none"}); ` +
        `${included.length} pages scanned; ${edgeLinks} onward link(s) inside those entries stop at the tier's edge.`
    );
  }

  for (const w of warnings) console.warn(`WARN  ${w}`);
  for (const f of failures) console.error(`FAIL  ${f}`);
  if (failures.length) {
    console.error(`check-children-glossary: ${failures.length} problem(s).`);
    process.exitCode = 1;
  } else {
    console.log("check-children-glossary: OK");
  }
}

main();
