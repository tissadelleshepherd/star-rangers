#!/usr/bin/env node
//
// Checks every content file's front matter against lib/content-schema.js
// and fails loudly, file-by-file, instead of letting a missing/malformed
// field surface later as a blank page, a broken sort order, or a cryptic
// Nunjucks error mid-build. Run via `npm test` (before the Eleventy dry
// run) so CI catches it on every pull request.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const matter = require("gray-matter");
const { CONTENT_TYPES, TIMELINE_TYPE, CHAPTER_ID_PATTERN, isTimelineEntry, chapterIdFor, characterStatusProblem } = require("../lib/content-schema");
const { checkGatedThreadSignatureTags } = require("../lib/content-filter");
const { isPlaceholderImage } = require("../lib/placeholder-marker");
const { TIER_ORDER } = require("../lib/editions");

const SRC_DIR = path.join(__dirname, "..", "src");

const TYPES_BY_LAYOUT = new Map(Object.values(CONTENT_TYPES).map((type) => [type.layout, type]));

// Chapters normally need at least 2 POVs (see checkChapterConsistency
// below) - this one chapter predates the rule and is a deliberate
// single-POV scene, not an oversight, so it's grandfathered rather than
// rewritten. (A companion rule requiring a "major-character"-tagged POV
// per chapter was retired 2026-08-03 along with the character-tier tags
// themselves - prominence is thread-relative and no longer a taxonomy.)
const GRANDFATHERED_SINGLE_POV_CHAPTERS = new Set([
  path.join("src", "seasons", "s01", "e00", "s01e00c02.md")
]);

function findMarkdownFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
      // A README.md documents the directory for people (2026-09-06); it is
      // not a content file, has no front matter, and .eleventyignore keeps
      // Eleventy from rendering it. Every walker that treats .md as content
      // skips it the same way.
      results.push(fullPath);
    }
  }
  return results;
}

function findFilesByExtension(dir, extensions) {
  if (!fs.existsSync(dir)) return [];
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "_site") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(findFilesByExtension(fullPath, extensions));
    else if (extensions.some((ext) => entry.name.endsWith(ext))) results.push(fullPath);
  }
  return results;
}

function isBlank(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

// Returns a list of human-readable problem strings for one file - empty
// if it's clean. Takes the already-parsed front matter data plus which
// schema (a CONTENT_TYPES entry, or the standalone TIMELINE_TYPE) applies.
function checkAgainstSchema(data, schema) {
  const problems = [];

  for (const field of schema.required) {
    if (isBlank(data[field])) {
      problems.push(`missing required field "${field}"`);
    }
  }

  // A glossary entry's `irish_gloss` explains its `irish` term, so one
  // without the other would render a literal sense of nothing.
  if (!isBlank(data.irish_gloss) && isBlank(data.irish)) {
    problems.push(`"irish_gloss" is set but "irish" is not - the gloss explains a term that is missing`);
  }
  for (const field of ["irish", "irish_gloss"]) {
    if (!isBlank(data[field]) && typeof data[field] !== "string") {
      problems.push(`field "${field}" must be a string, got ${JSON.stringify(data[field])}`);
    }
  }

  for (const field of schema.numeric || []) {
    if (!isBlank(data[field]) && !Number.isFinite(Number(data[field]))) {
      problems.push(`field "${field}" must be a number, got ${JSON.stringify(data[field])}`);
    }
  }

  return problems;
}

function checkChapterConsistency(inputPath, data, relativePath) {
  const problems = [];
  if (isBlank(data.season) || isBlank(data.episode) || isBlank(data.chapter)) return problems;

  const expectedId = chapterIdFor(data.season, data.episode, data.chapter);
  if (!isBlank(data.id) && data.id !== expectedId) {
    problems.push(`"id" is "${data.id}" but season/episode/chapter (${data.season}/${data.episode}/${data.chapter}) imply "${expectedId}"`);
  }

  const filenameMatch = path.basename(inputPath, ".md").match(CHAPTER_ID_PATTERN);
  if (filenameMatch && expectedId !== path.basename(inputPath, ".md")) {
    problems.push(`filename implies "${path.basename(inputPath, ".md")}" but front matter season/episode/chapter imply "${expectedId}" - one of them is wrong`);
  }

  if (Array.isArray(data.povs)) {
    data.povs.forEach((pov, index) => {
      if (!pov || isBlank(pov.id) || isBlank(pov.label)) {
        problems.push(`povs[${index}] needs both an "id" and a "label"`);
      }
      // A tier-gated block (`::: pov <id> tier=<tier>` in the body) is
      // mirrored here so the "View from" buttons can be gated the same way.
      // An unknown tier would render the block everywhere while hiding its
      // button nowhere, silently - so it fails here instead.
      if (pov && pov.tier !== undefined && !TIER_ORDER.includes(String(pov.tier))) {
        problems.push(`povs[${index}] names tier "${pov.tier}", which is not one of ${TIER_ORDER.join(", ")}`);
      }
      // The label convention (2026-10-07, Dermot's choice among three shapes
      // after the 85 distinct labels were found carrying four kinds of thing
      // in four orders): `<rank as held in this chapter> <name> (<frame>[, <one
      // qualifier>])` - the frame first (species, with the augmentation the
      // record marks: Smart Pet, Cyber-Enhanced, plural, unaugmented), then at
      // most one qualifier the chapter needs, commas only, nothing after the
      // name outside the bracket. A warning rather than a failure: the label
      // is presentation, not canon, and a chapter with a bare name still
      // builds; what the warning catches is the drift that put "Human - the
      // eldest survivor" and "Órla Shepherd, as remembered (Human)" beside
      // "Human, the eldest survivor" and "(Human, as remembered)".
      if (pov && !isBlank(pov.label)) {
        const label = String(pov.label);
        const bracket = label.match(/^(.*\S)\s+\(([^()]+)\)$/);
        if (!bracket) {
          console.warn(`WARN: ${relativePath}: povs[${index}] label "${label}" has no bracket - the convention is "<rank> <name> (<frame>[, <qualifier>])"`);
        } else if (/[—–;]/.test(bracket[2]) || /,\s*(as remembered|[A-Z])/.test(bracket[1])) {
          console.warn(`WARN: ${relativePath}: povs[${index}] label "${label}" - the bracket takes commas only, and anything after the name goes inside it`);
        }
      }
    });

    if (data.povs.length < 2 && !GRANDFATHERED_SINGLE_POV_CHAPTERS.has(relativePath)) {
      problems.push(`needs at least 2 "povs" entries, found ${data.povs.length}`);
    }
  }

  return problems;
}

// Filename slugs (basename without .md) of every actual codex entry, so a
// character's `known_codex` list can be checked for typos/dead references.
function loadCodexSlugs() {
  const codexDir = path.join(SRC_DIR, "codex");
  return new Set(
    findMarkdownFiles(codexDir)
      .map((filePath) => path.basename(filePath, ".md"))
      .filter((slug) => slug !== "index")
  );
}

// Version chains: a locked page is superseded rather than edited, and each
// version keeps its own permanent URL so a citation resolves to the text that
// was cited (policy, 12 August 2026).
//
// Two ways a chain can be wrong, both silent without a check. A `superseded_by`
// or `version_of` pointing at a page that does not exist leaves a reader on a
// dead forward link — worse than no note, because the note promises there is
// somewhere to go. And two current versions in one chain (both declaring
// `version_of`, neither superseded) means somebody forgot a forward note, and
// src/version-latest.njk's `/latest/` alias would then be a coin toss between
// them rather than an answer.
function checkVersionChain(data, urlSet) {
  const problems = [];
  for (const field of ["superseded_by", "version_of"]) {
    if (isBlank(data[field])) continue;
    const target = String(data[field]);
    if (!target.startsWith("/") || !target.endsWith("/")) {
      problems.push(`${field} "${target}" must be a site-absolute path with a trailing slash, e.g. "/lore/foo/"`);
    } else if (!urlSet.has(target)) {
      problems.push(`${field} points at "${target}", which is not a page on this site`);
    }
  }
  if (!isBlank(data.superseded_by) && isBlank(data.superseded_on)) {
    problems.push(`superseded_by is set but superseded_on is missing - the note tells a reader when, or it tells them nothing`);
  }
  return problems;
}

function checkKnownCodex(data, codexSlugs) {
  const problems = [];
  for (const slug of data.known_codex || []) {
    if (!codexSlugs.has(slug)) {
      problems.push(`known_codex entry "${slug}" doesn't match any file in src/codex/`);
    }
  }
  return problems;
}

// The site-relative URL a content file builds to (matching Eleventy's own
// item.url, no /star-rangers prefix): an explicit `permalink` if the file
// sets one, else derived from its path under src/ the way Eleventy derives
// it by default (drop .md, collapse a trailing /index to the dir).
function urlForContentFile(filePath, data) {
  if (data.permalink) {
    const p = String(data.permalink);
    return p.startsWith("/") ? p : `/${p}`;
  }
  let rel = "/" + path.relative(SRC_DIR, filePath).split(path.sep).join("/");
  rel = rel.replace(/\.md$/, "").replace(/\/index$/, "/");
  if (!rel.endsWith("/")) rel += "/";
  return rel;
}

// The public -> private link boundary that used to live here was retired on
// 2026-09-04 with `private: true` itself (lib/storyline-threads.js, HISTORY).
// A general-tier page that links into a thread gated to the contemplative
// tier now gets what any narrowed link gets: the excluded.njk placeholder,
// pointing at the thread's homeDomain. That is the ordinary contract of this
// site ("no link ever 404s"), and a reader-facing page that describes the
// tier ladder has every reason to point at the tier above it.

// ---------------------------------------------------------------------------
// Image bookkeeping
//
// Added 2026-08-12 after an audit found story-bible/images.md describing the
// image set as it was months earlier: it still listed `dagny-voss` among the
// stock headshots after that file had been deleted, and still listed
// `dorian-calloway` after it had been replaced. Neither was a review-frequency
// problem - both were changes that landed without the note changing with them,
// which is exactly the kind of drift a machine should catch and a human should
// not have to remember. The semantic half (an image listed as stock that is now
// generated) is not checkable here; the existence half is.
// ---------------------------------------------------------------------------

const IMAGES_DIR = path.join(SRC_DIR, "images");
const STORY_BIBLE_IMAGES = path.join(__dirname, "..", "story-bible", "images.md");

// Backticked tokens in images.md that look like image slugs but deliberately
// name no file: motif families, glob patterns, and prose. Add to this rather
// than loosening the pattern, so the check stays sharp.
const NON_IMAGE_TOKENS = new Set([
  "story-bible", "image_alt", "firefly-prompts", "make-codex-cover",
  "validate-content", "content-schema", "storyline-threads", "content-filter",
  "latest-lore", "scene-pov", "lore-entry", "character-njk"
]);

// Images that exist on purpose without being referenced. Both were produced as
// part of a standard favicon set; the head template wires up 16, 32, 180 and the
// SVG, and 48 and 512 are the sizes a web manifest would use if this site had
// one. Kept rather than deleted so the set stays complete if a manifest is ever
// added - but listed here so "unreferenced" stays a real signal for everything
// else.
const KNOWN_UNREFERENCED_IMAGES = new Set([
  "icons/favicon-48.png",
  "icons/favicon-512.png"
]);

function findImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(findImageFiles(fullPath));
    else if (/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(entry.name)) results.push(fullPath);
  }
  return results;
}

// Every image on disk, keyed both by bare basename ("sen") and by its path
// below src/images/ ("characters/sen.jpg"), because images.md refers to them
// both ways depending on how ambiguous the name is.
function indexImages(imagePaths) {
  const byBasename = new Map();
  const byRelPath = new Set();
  for (const p of imagePaths) {
    const rel = path.relative(IMAGES_DIR, p).split(path.sep).join("/");
    byRelPath.add(rel);
    const base = path.basename(p).replace(/\.[^.]+$/, "");
    if (!byBasename.has(base)) byBasename.set(base, []);
    byBasename.get(base).push(rel);
  }
  return { byBasename, byRelPath };
}

// A page's `image:` must actually exist. A missing one renders as a broken
// image rather than failing the build, so nothing else catches it.
function checkFrontMatterImageExists(data, relativePath, index) {
  if (isBlank(data.image)) return [];
  const value = String(data.image).replace(/^\/+/, "");
  if (index.byRelPath.has(value)) return [];
  // Front matter usually gives a partial path ("universes/si-gaoithe.jpg") or a
  // bare filename, with the layout supplying the category directory. Match on
  // the final path segment, not the whole string.
  const bare = path.basename(value).replace(/\.[^.]+$/, "");
  if (index.byBasename.has(bare)) return [];
  return [`image "${data.image}" does not exist under src/images/`];
}

// The check above proves the FILE exists somewhere under src/images/. This one
// proves the URL the layout emits actually resolves, which is not the same
// question and is the one a reader experiences.
//
// Found 2026-08-21 by a broken image on a live page. src/lore/planets/drithane.md
// carried `image: "drithane.jpg"` and the file was the only one in the corpus
// sitting in src/images/lore/planets/ rather than flat in src/images/lore/ with
// every other planet's. lore-entry.njk hardcodes /images/lore/ and appends the
// front-matter value, so the page requested /images/lore/drithane.jpg and got a
// 404 - while the check above passed, because it falls back to matching the
// BASENAME anywhere under src/images/ and found the file one directory over.
//
// That fallback is not a bug and is deliberately left alone: front matter
// legitimately carries a partial path ("universes/si-gaoithe.jpg") that the
// layout completes, so the basename match is what lets one check serve every
// content type. What was missing is the stricter question underneath it, asked
// per type: layout directory + front-matter value, exactly as the template
// builds it.
//
// The map mirrors the five layouts that hardcode a category directory
// (character.njk, codex.njk, lore-entry.njk, glossary-entry.njk, chapter.njk).
// Two of them - glossary and chapters - have no page carrying an `image:`
// today, so those rows are dormant rather than dead: they cost nothing and the
// first such page gets checked instead of quietly 404ing.
const IMAGE_DIR_BY_SECTION = {
  characters: "characters",
  codex: "codex",
  lore: "lore",
  glossary: "glossary",
  seasons: "chapters"
};

function checkFrontMatterImageUrlResolves(data, relativePath, index) {
  if (isBlank(data.image)) return [];
  const section = relativePath.split(/[/\\]/)[1]; // "src/lore/planets/x.md" -> "lore"
  const dir = IMAGE_DIR_BY_SECTION[section];
  if (!dir) return [];
  const value = String(data.image).replace(/^\/+/, "");
  const rel = `${dir}/${value}`;
  if (index.byRelPath.has(rel)) return [];
  const elsewhere = index.byBasename.get(path.basename(value).replace(/\.[^.]+$/, "")) || [];
  return [
    `image "${data.image}" resolves to /star-rangers/images/${rel}, which does not exist` +
    (elsewhere.length ? ` - the file is at src/images/${elsewhere.join(", src/images/")}` : "") +
    ". The layout supplies the directory, so the front-matter value is the path BELOW it."
  ];
}

// A character's gallery and season keys. Added 2026-10-07 with the season
// pages' portrait strip (lib/season-portraits.js). Three things a page can
// get wrong that nothing else sees:
//
//   1. A gallery item's `image` names no file under src/images/characters/<id>/.
//      character.njk hardcodes that directory, so a frame filed one level up
//      passes the orphan check (the file IS referenced) and 404s on the page -
//      the drithane.jpg failure, for galleries.
//   2. `image_season` or an item's `season` is not a whole number, so the
//      strip's number comparison never matches and the frame silently never
//      surfaces on any season page.
//   3. The key names a season with no index page (src/seasons/sNN/index.md),
//      so there is no page for the frame to surface on. A typo'd 15 for 5
//      would otherwise look exactly like a frame nobody had keyed.
const SEASONS_DIR = path.join(SRC_DIR, "seasons");
function existingSeasonNumbers() {
  if (!fs.existsSync(SEASONS_DIR)) return new Set();
  return new Set(
    fs.readdirSync(SEASONS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && /^s\d{2}$/.test(d.name) && fs.existsSync(path.join(SEASONS_DIR, d.name, "index.md")))
      .map((d) => Number(d.name.slice(1)))
  );
}

function seasonKeyProblem(value, label, seasons) {
  if (isBlank(value)) return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    return `${label} "${value}" is not a whole season number - the season pages compare it as a number, so this frame would surface nowhere`;
  }
  if (!seasons.has(n)) {
    return `${label} ${n} names no season page (no src/seasons/s${String(n).padStart(2, "0")}/index.md), so there is nowhere for the frame to surface`;
  }
  return null;
}

function checkCharacterGallery(data, index, seasons) {
  const problems = [];
  const headerProblem = seasonKeyProblem(data.image_season, "image_season", seasons);
  if (headerProblem) problems.push(headerProblem);
  if (!isBlank(data.image_season) && isBlank(data.image)) {
    problems.push("image_season is set but the page has no image: to key");
  }
  if (!isBlank(data.image_caption) && isBlank(data.image)) {
    problems.push("image_caption is set but the page has no image: to caption");
  }
  if (data.gallery === undefined || data.gallery === null) return problems;
  if (!Array.isArray(data.gallery)) return problems.concat("gallery must be a list of {image, caption?, image_alt?, season?} items");
  data.gallery.forEach((item, i) => {
    const where = `gallery[${i}]`;
    if (!item || typeof item !== "object" || isBlank(item.image)) {
      problems.push(`${where} has no image`);
      return;
    }
    const rel = `characters/${data.id}/${String(item.image).replace(/^\/+/, "")}`;
    if (!index.byRelPath.has(rel)) {
      const elsewhere = index.byBasename.get(path.basename(String(item.image)).replace(/\.[^.]+$/, "")) || [];
      problems.push(
        `${where} image "${item.image}" resolves to /star-rangers/images/${rel}, which does not exist` +
        (elsewhere.length ? ` - the file is at src/images/${elsewhere.join(", src/images/")}` : "") +
        ". character.njk supplies images/characters/<id>/, so the value is the file name below it."
      );
    }
    const seasonProblem = seasonKeyProblem(item.season, `${where} season`, seasons);
    if (seasonProblem) problems.push(seasonProblem);
  });
  return problems;
}

// Every edition's hero cast has to be able to RENDER on that edition. Four
// ways it silently cannot, the first three found live on 2026-08-21:
//
//   1. The id names no character page at all.
//   2. The page exists but has no `image:`. src/index.md drops it (the
//      withImages filter), and before that filter existed it emitted an <img>
//      pointing at the characters directory. Elvira was in the DEFAULT cast.
//   3. The page exists and has a portrait, but this edition's own filter
//      excludes it - so the slide is not there on the domain that asked for it.
//   4. The portrait file is a PLACEHOLDER-stamped PENDING card (added
//      2026-08-29, when the withImages filter started dropping those so the
//      slideshow only ever shows finished portraits). The page validates, the
//      file exists, and the slide silently vanishes on every domain casting it.
//
// (3) is the one that had eaten the site. Four of the seven editions listed a
// cast made entirely of characters their own CHARACTERS/TOPICS/THREADS filtered
// out, so heroCharacters resolved empty and the homepage quietly fell back to
// the static hero image. Five of seven domains had no slideshow and nothing
// anywhere said so: the fallback is deliberate, correct, and indistinguishable
// from a design decision.
//
// Nothing else can catch this. lib/editions.js knows the cast but not the
// corpus; validate-content.js knows the corpus but had no reason to look at the
// registry; the build renders a perfectly valid page either way. It is exactly
// the shape of failure this file exists for, so it lives here rather than in a
// local tool - a cast that cannot render should fail CI.
//
// A WARNING, not an error, for an edition whose whole pool is empty: that is a
// statement about what the domain carries rather than a mistake in the cast,
// and the fix is a decision about the domain (widen it, or accept the static
// hero) rather than an edit to this list.
function checkEditionHeroCasts(characterPages) {
  const { DEFAULT_EDITION, allEditions, editionFor } = require("../lib/editions");
  const { getContentFilter, isCharacterIncluded } = require("../lib/content-filter");

  const byId = new Map();
  for (const { data, relativePath } of characterPages) {
    if (!isBlank(data.id)) byId.set(String(data.id).toLowerCase(), { data, relativePath });
  }

  // getContentFilter() reads the three env vars and caches nothing, so setting
  // them around the call is the honest way to ask "what would this edition's
  // build see?" without duplicating the filter's own union logic here - which
  // would then be a second copy to keep in step with lib/content-filter.js.
  function filterFor(edition) {
    const saved = {
      CHARACTERS: process.env.CHARACTERS,
      TOPICS: process.env.TOPICS,
      THREADS: process.env.THREADS
    };
    try {
      process.env.CHARACTERS = (edition.characters || []).join(",");
      process.env.TOPICS = (edition.topics || []).join(",");
      process.env.THREADS = (edition.threads || []).join(",");
      const filter = getContentFilter();
      // The build's tier is the edition's own (lib/editions.js), not the
      // tier of whatever EDITION this validation happens to run under -
      // without this, Brother Fintan (church-space) fails the fellowship
      // cast on a general-tier run, which is not what that domain sees.
      filter.tier = edition.tier;
      return filter;
    } finally {
      for (const [key, value] of Object.entries(saved)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  }

  const problems = [];
  for (const entry of [DEFAULT_EDITION, ...allEditions()]) {
    const edition = editionFor(entry.id);
    const filter = filterFor(edition);
    const ids = edition.heroCharacterIds || [];
    const renderable = [];

    for (const rawId of ids) {
      const id = String(rawId).toLowerCase();
      const page = byId.get(id);
      if (!page) {
        problems.push(`edition "${edition.id}" casts "${rawId}", which is not a character id`);
        continue;
      }
      if (isBlank(page.data.image)) {
        problems.push(
          `edition "${edition.id}" casts "${rawId}", whose page has no image: - the slideshow drops it`
        );
        continue;
      }
      if (isPlaceholderImage(path.join(SRC_DIR, "images", "characters", String(page.data.image)))) {
        problems.push(
          `edition "${edition.id}" casts "${rawId}", whose portrait is a PLACEHOLDER-stamped pending card - ` +
          "the slideshow only shows finished portraits, so the slide never renders; " +
          "replace the card with a real portrait or recast the edition"
        );
        continue;
      }
      if (!isCharacterIncluded(page.data, filter)) {
        problems.push(
          `edition "${edition.id}" casts "${rawId}", which its own filter excludes - the slide never renders on that domain`
        );
        continue;
      }
      renderable.push(id);
    }

    // An edition with a pool of zero cannot be fixed from this list, so say so
    // once and do not fail: the static hero is a legitimate front page.
    if (!renderable.length && ids.length) {
      const pool = [...byId.values()].filter(
        (p) => !isBlank(p.data.image) &&
          !isPlaceholderImage(path.join(SRC_DIR, "images", "characters", String(p.data.image))) &&
          isCharacterIncluded(p.data, filter)
      ).length;
      console.warn(
        `WARN: edition "${edition.id}" renders no hero slideshow - ` +
        (pool
          ? `none of its cast survives its own filter (${pool} character(s) with a portrait do).`
          : "it carries no character page with a portrait at all, so the homepage uses the static hero image.")
      );
    }
  }

  return problems.length
    ? [{ relativePath: "lib/editions.js", label: "hero casts", problems }]
    : [];
}

// An image no page references is either a leftover from a deleted entry or a
// file whose reference was renamed - both silent, both worth knowing about.
function checkOrphanImages(index, corpus) {
  const problems = [];
  for (const rel of index.byRelPath) {
    if (KNOWN_UNREFERENCED_IMAGES.has(rel)) continue;
    const base = path.basename(rel);
    const bare = base.replace(/\.[^.]+$/, "");
    if (corpus.includes(base) || corpus.includes(rel) || corpus.includes(`"${bare}"`)) continue;
    problems.push(`src/images/${rel} is not referenced by any page, template or script`);
  }
  return problems.length
    ? [{ relativePath: path.join("src", "images"), label: "unreferenced images", problems }]
    : [];
}

// Byte-identical image files under different names. Added 2026-08-15 after a
// manual MD5 sweep found three pairs - six files, three pictures - none of
// which any existing check could see: checkOrphanImages only asks whether a
// file is referenced, and both halves of a duplicate pair are.
//
// The cost is not the wasted bytes. A duplicate hides that a page has no image
// of its own: `frontier-transformation-protocols.jpg` looked like a bespoke
// illustration and was a second copy of the command-hierarchy photo, so the
// gap never appeared in any queue. story-bible/images.md had recorded two of
// the three pairs and gone stale on the rest, which is exactly the job to give
// a gate rather than a note.
//
// There is deliberately no allowlist, because a duplicate is always avoidable.
// Sharing one picture across two pages is expressible with ONE file and two
// references - `image:` for pages in the same directory, or an explicit
// <img src="/star-rangers/images/..."> in a page body for pages that are not,
// since lore-entry.njk hardcodes /images/lore/ and an `image:` field cannot
// reach across into hero/. If a second copy ever looks necessary, that
// asymmetry is the thing to reach for first.
function checkDuplicateImages(imagePaths) {
  const byHash = new Map();
  for (const p of imagePaths) {
    const hash = crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex");
    const rel = path.relative(IMAGES_DIR, p).split(path.sep).join("/");
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash).push(rel);
  }
  const problems = [];
  for (const group of byHash.values()) {
    if (group.length < 2) continue;
    const sorted = group.slice().sort();
    problems.push(
      `${sorted.length} byte-identical copies of one image: ${sorted.map((r) => `src/images/${r}`).join(", ")}` +
        ` - keep one file and point every reference at it, or replace all but one with a different picture`
    );
  }
  return problems.length
    ? [{ relativePath: path.join("src", "images"), label: "duplicate images", problems }]
    : [];
}

// Slugs named in story-bible/images.md that no longer exist on disk. This is
// the check that would have caught `dagny-voss`.
//
// It is OFF by default and opted into per section, because images.md names
// non-existent images legitimately and often: whole sections exist to list
// portraits and lore illustrations that have *not been made yet*, and section 6
// lists images slated for removal, some of which are already gone. Checking the
// file as a whole produced ~50 findings, nearly all of them noise, which is the
// fastest way to teach someone to ignore a check.
//
// So a section asserts that its images exist by opting in:
//
//   <!-- validate-images: on -->    ... checked from here
//   <!-- validate-images: off -->   ... and not past here
//
// An `on` block also ends at the next `##` heading, so forgetting the closing
// marker fails safe rather than swallowing the rest of the document.
function checkStoryBibleImageRefs(index) {
  if (!fs.existsSync(STORY_BIBLE_IMAGES)) return [];
  const text = fs.readFileSync(STORY_BIBLE_IMAGES, "utf8");
  const problems = [];
  const seen = new Set();

  // Reduce the document to only the opted-in regions before looking for slugs.
  let checking = false;
  const activeLines = [];
  for (const line of text.split(/\r?\n/)) {
    if (/<!--\s*validate-images:\s*on\s*-->/.test(line)) { checking = true; continue; }
    if (/<!--\s*validate-images:\s*off\s*-->/.test(line)) { checking = false; continue; }
    if (/^##\s/.test(line)) checking = false;
    if (checking) activeLines.push(line);
  }
  const active = activeLines.join("\n");
  if (!active.trim()) return [];

  for (const match of active.matchAll(/`([^`\n]+)`/g)) {
    const token = match[1].trim();
    if (seen.has(token) || NON_IMAGE_TOKENS.has(token)) continue;

    // A path-shaped reference below src/images/, e.g. `lore/the-imperium.jpg`
    // or `src/images/lore/new-london-space-habitat.jpg`.
    const asPath = token.replace(/^src\/images\//, "");
    if (/^[a-z0-9][a-z0-9/-]*\.(jpe?g|png|webp|gif|avif|svg)$/i.test(asPath)) {
      seen.add(token);
      if (!index.byRelPath.has(asPath)) {
        problems.push(`names image "${token}", which does not exist under src/images/`);
      }
      continue;
    }

    // A bare hyphenated slug, e.g. `dagny-voss`. Requiring a hyphen and no
    // punctuation keeps prose, flags and globs out of scope.
    if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(token) && !token.includes("*")) {
      seen.add(token);
      if (!index.byBasename.has(token)) {
        problems.push(`names "${token}", which matches no image under src/images/ - deleted or renamed since this note was written?`);
      }
    }
  }

  return problems.length
    ? [{ relativePath: path.relative(process.cwd(), STORY_BIBLE_IMAGES), label: "story bible image references", problems }]
    : [];
}

function main() {
  const files = findMarkdownFiles(SRC_DIR);
  const fileProblems = [];
  // comment_id -> relativePath of the first chapter seen with it - a
  // collision means two chapters would share one giscus discussion thread,
  // silently mixing their comments (see comment_id's own doc in
  // lib/content-schema.js for why it must stay unique and permanent).
  const commentIdOwners = new Map();
  // character id -> relativePath of the first character page seen with it.
  // A chapter's `povs:` and the editions' hero casts name a character by this
  // id (.eleventy.js resolves `c.data.id`), so two pages sharing one id would
  // both answer to it and the wrong portrait or viewpoint could render. Found
  // 2026-10-09 by scripts/extract-characters.js: sorcha.md and
  // sorcha-shepherd.md both carried `id: sorcha`.
  const characterIdOwners = new Map();
  const codexSlugs = loadCodexSlugs();
  // Every URL the site builds, so a version chain's forward and backward links
  // can be checked against something real rather than assumed.
  const urlSet = new Set(files.map((f) => {
    const { data } = matter(fs.readFileSync(f, "utf8"));
    return urlForContentFile(f, data);
  }));
  // Chains must have exactly one current version: chain base -> count of pages
  // declaring it that nothing supersedes.
  const chainCurrent = new Map();
  const imageFiles = findImageFiles(IMAGES_DIR);
  const imageIndex = indexImages(imageFiles);
  const seasonNumbers = existingSeasonNumbers();
  // Collected on the way past, for the hero-cast check below.
  const characterPages = [];

  for (const filePath of files) {
    const relativePath = path.relative(process.cwd(), filePath);
    const { data } = matter(fs.readFileSync(filePath, "utf8"));

    let schema = TYPES_BY_LAYOUT.get(data.layout);
    let isChapter = schema === CONTENT_TYPES.chapter;

    if (!schema && isTimelineEntry(filePath)) {
      schema = TIMELINE_TYPE;
    }

    if (!schema) continue; // Not a recognized content-leaf type - nothing to check.

    const problems = checkAgainstSchema(data, schema);
    if (isChapter) problems.push(...checkChapterConsistency(filePath, data, relativePath));
    if (schema === CONTENT_TYPES.character) {
      problems.push(...checkKnownCodex(data, codexSlugs));
      problems.push(...checkCharacterGallery(data, imageIndex, seasonNumbers));
      const statusProblem = characterStatusProblem(data.status);
      if (statusProblem) problems.push(statusProblem);
      characterPages.push({ data, relativePath });
    }
    problems.push(...checkVersionChain(data, urlSet));
    if (!isBlank(data.version_of) && isBlank(data.superseded_by)) {
      const base = String(data.version_of);
      chainCurrent.set(base, (chainCurrent.get(base) || []).concat(relativePath));
    }
    problems.push(...checkFrontMatterImageExists(data, relativePath, imageIndex));
    problems.push(...checkFrontMatterImageUrlResolves(data, relativePath, imageIndex));
    for (const { threadId, signatureTag } of checkGatedThreadSignatureTags(data)) {
      problems.push(
        `tagged "${signatureTag}" (a "${threadId}" signature tag - see lib/storyline-threads.js) but missing ` +
        `the "${threadId}" tag itself - likely meant for that tier-gated thread, and about to ship on every domain below its tier`
      );
    }

    if (isChapter && !isBlank(data.comment_id)) {
      const owner = commentIdOwners.get(data.comment_id);
      if (owner) {
        problems.push(`comment_id "${data.comment_id}" is already used by ${owner} - each chapter needs its own`);
      } else {
        commentIdOwners.set(data.comment_id, relativePath);
      }
    }

    if (schema === CONTENT_TYPES.character && !isBlank(data.id)) {
      const owner = characterIdOwners.get(String(data.id));
      if (owner) {
        problems.push(`id "${data.id}" is already used by ${owner} - a chapter's povs: and an edition's hero cast name a character by id, so each page needs its own`);
      } else {
        characterIdOwners.set(String(data.id), relativePath);
      }
    }

    if (problems.length) {
      fileProblems.push({ relativePath, label: schema.label, problems });
    }
  }

  for (const [base, pages] of chainCurrent) {
    if (pages.length > 1) {
      fileProblems.push({
        relativePath: pages.join(", "),
        label: "version chain",
        problems: [
          `${pages.length} pages claim to be the current version of ${base} - exactly one must have no "superseded_by", ` +
          `or the /latest/ alias has no answer and a reader following the chain forward hits a fork`
        ],
      });
    }
  }

  // One corpus of everything that could reference an image, so the orphan
  // check is a set of substring tests rather than a scan per image.
  // Everything that could name an image, including repo-root files: the OG
  // fallback lives in .eleventy.js and the favicons are named in the web
  // manifest, so a corpus limited to src/ and lib/ reports both as orphans.
  const REPO_ROOT = path.join(__dirname, "..");
  const TEXT_EXTS = [".md", ".njk", ".js", ".json", ".html", ".webmanifest", ".xml", ".yml", ".yaml", ".txt"];
  const referencingFiles = [
    ...findFilesByExtension(SRC_DIR, TEXT_EXTS),
    ...findFilesByExtension(path.join(REPO_ROOT, "lib"), TEXT_EXTS),
    ...findFilesByExtension(path.join(REPO_ROOT, "scripts"), TEXT_EXTS),
    ...fs.readdirSync(REPO_ROOT, { withFileTypes: true })
      .filter((e) => e.isFile() && TEXT_EXTS.some((ext) => e.name.endsWith(ext)))
      .map((e) => path.join(REPO_ROOT, e.name))
  ];
  const corpus = referencingFiles.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  fileProblems.push(...checkOrphanImages(imageIndex, corpus));
  fileProblems.push(...checkDuplicateImages(imageFiles));
  fileProblems.push(...checkStoryBibleImageRefs(imageIndex));
  fileProblems.push(...checkEditionHeroCasts(characterPages));

  if (fileProblems.length === 0) {
    console.log(`Content validation passed (${files.length} files, ${imageIndex.byRelPath.size} images checked).`);
    return;
  }

  console.error(`Content validation failed in ${fileProblems.length} file(s):\n`);
  for (const { relativePath, label, problems } of fileProblems) {
    console.error(`${relativePath} (${label}):`);
    for (const problem of problems) {
      console.error(`  - ${problem}`);
    }
  }
  process.exitCode = 1;
}

main();
