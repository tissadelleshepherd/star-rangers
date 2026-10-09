// Shared CHARACTERS/TOPICS/THREADS content filtering (see .cpanel.yml for
// the full deploy.conf-driven explanation). Used by .eleventy.js for the
// existing whole-page inclusion checks, and by src/_data/scenePovPages.js
// for the finer-grained per-scene, per-character POV page inclusion.
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { threadForSeason, STORYLINE_THREADS } = require("./storyline-threads");
const { getEdition, tierVisible } = require("./editions");

function parseFilterList(envValue) {
  return String(envValue || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function getContentFilter() {
  const characters = parseFilterList(process.env.CHARACTERS);
  const topics = parseFilterList(process.env.TOPICS);
  const threads = parseFilterList(process.env.THREADS);
  return {
    characters,
    threads,
    // Tags conventionally embed character slugs too (e.g. a timeline entry
    // tagged "aldera"), so CHARACTERS also participates in tag matching.
    // THREADS joins the same set so a lore/timeline/glossary/codex entry
    // explicitly tagged with a thread id (e.g. "founding-era") is pulled in
    // the same way a TOPICS match would be, on top of the season-membership
    // check isSeasonInIncludedThread does below for chapters specifically.
    tagMatches: new Set([...characters, ...topics, ...threads]),
    active: characters.length > 0 || topics.length > 0 || threads.length > 0,
    // The reading tier this build sits at - its edition's `tier`
    // (lib/editions.js; the default edition, and so every third-party fork,
    // is the general tier). Not a deploy.conf key and never will be: a tier
    // is a property of the edition, resolved by domain, and the whole point
    // of gating content by it (below) is that no per-clone value can open it.
    tier: getEdition().tier
  };
}

// THE TIER GATE (Dermot's ruling, 2026-09-04, replacing `private: true`).
//
// A thread that names a `tier` in lib/storyline-threads.js is visible only
// on a build whose edition sits at that tier or above - church-space, gated
// to the contemplative tier, is absent on the children's, young-adult and
// general tiers, which includes the unfiltered canonical site, GitHub Pages,
// local dev and every third-party fork, since all of those resolve the
// default edition at the general tier. It is the same predicate the
// tier-gated `::: pov` blocks use (lib/editions.js tierVisible), applied one
// level up: a whole thread instead of one block.
//
// What this replaced, and why it is the same outcome. Privacy was OPT-IN
// inclusion - a private thread was excluded everywhere unless a build named
// its id in CHARACTERS/TOPICS/THREADS - and it existed because church-space
// "belonged to one pair of domains". Since the tier ladder (2026-09-03) the
// truer statement is that it belongs to the contemplative TIER, and the
// contemplative editions already name it in their filters, so gating by tier
// gives every domain exactly the page set it had. What changed is the shape:
// the gate is a property of the build's edition rather than of what a
// deploy.conf chose to name, and once a build is past the gate a gated
// thread is ORDINARY content - included unless a filter narrows it out, the
// same rule as everything else in this file. There is no longer an
// "excluded unless named in" case anywhere.
//
// Applied REGARDLESS of filter.active and before the normal narrowing checks,
// because the gate has to hold on the unfiltered build too - that is the
// case that matters most.
function isThreadIncluded(threadId, filter) {
  const thread = STORYLINE_THREADS.find((t) => t.id === threadId);
  if (!thread || !thread.tier) return true;
  return tierVisible(thread.tier, filter.tier);
}

// The tier-gated storyline thread a page belongs to (via its own season, its
// tags/category, or an explicit `threadId` front-matter field - the same
// membership signals isTierExcluded checks), or null if it belongs to no
// gated thread. Filter-INDEPENDENT: it answers "which gated thread is
// this?", not "should this build hide it?" - so a page on a build that sits
// at the thread's tier still resolves here. Used by .eleventy.js to point an
// excluded page's placeholder at that thread's own homeDomain, which (unlike
// the default reference domain, a general-tier build) actually has the page.
function gatedThreadForPage(data) {
  return threadForPage(data, (thread) => Boolean(thread.tier));
}

// The registered storyline thread a page belongs to that satisfies `matches`
// - by season first (chapters), then by tag/category/threadId - or null.
// The one membership walk behind both per-thread properties a page can
// inherit: the tier gate (gatedThreadForPage) and the comments board
// (.eleventy.js's `giscusBoard`, matching on `giscusProfile`). A page's
// thread is decided by the same signals whichever property is being asked
// about, which is what keeps "gated to the contemplative tier" and "posts to
// the Communion's board" true of exactly the same set of pages.
function threadForPage(data, matches) {
  const pick = (threadId) => {
    const thread = STORYLINE_THREADS.find((t) => t.id === threadId);
    return thread && matches(thread) ? thread : null;
  };
  if (data.season !== undefined && data.season !== null) {
    const bySeason = pick(threadForSeason(data.season).id);
    if (bySeason) return bySeason;
  }
  const candidates = Array.isArray(data.tags) ? data.tags.map((t) => String(t).toLowerCase()) : [];
  if (data.category) candidates.push(String(data.category).toLowerCase());
  if (data.threadId) candidates.push(String(data.threadId).toLowerCase());
  for (const c of candidates) {
    const byTag = pick(c);
    if (byTag) return byTag;
  }
  return null;
}

// True if a page belongs to a tier-gated thread this build sits below - via
// its own season (chapters, through threadForSeason), its tags/category
// (characters, lore, glossary, codex, timeline - the same fields
// hasMatchingTag reads), or an explicit `threadId` front-matter field (a
// thread's own standalone landing page under src/threads/<id>/, and the
// Season 8 index pages). Checked regardless of filter.active, and before the
// normal narrowing checks below, since the gate must hold on the unfiltered
// full-site build too, not just on a narrowed one.
function isTierExcluded(data, filter) {
  const thread = gatedThreadForPage(data);
  return thread ? !tierVisible(thread.tier, filter.tier) : false;
}

function hasMatchingTag(data, filter) {
  if (!filter.tagMatches.size) return false;
  const tags = Array.isArray(data.tags) ? data.tags.map((t) => String(t).toLowerCase()) : [];
  const category = data.category ? String(data.category).toLowerCase() : null;
  return tags.some((t) => filter.tagMatches.has(t)) || (category !== null && filter.tagMatches.has(category));
}

function hasMatchingPov(data, filter) {
  if (!filter.characters.length) return false;
  const povs = Array.isArray(data.povs) ? data.povs : [];
  return povs.some((p) => filter.characters.includes(String((p && p.id) || "").toLowerCase()));
}

const CHARACTERS_DIR = path.join(__dirname, "..", "src", "characters");

function isCharacterIncluded(data, filter) {
  if (isTierExcluded(data, filter)) return false;
  if (!filter.active) return true;
  return filter.characters.includes(String(data.id || "").toLowerCase()) || hasMatchingTag(data, filter);
}

// A chapter's own season, not its tags, is what identifies which storyline
// thread it belongs to (see lib/storyline-threads.js) - a chapter never
// needs its own `thread` front matter field, since thread membership is
// season-level, the same way title/description are season-level rather
// than repeated per chapter.
function isSeasonInIncludedThread(data, filter) {
  if (!filter.threads.length) return false;
  return filter.threads.includes(threadForSeason(data.season).id);
}

function isChapterIncluded(data, filter) {
  if (isTierExcluded(data, filter)) return false;
  if (!filter.active) return true;
  return hasMatchingPov(data, filter) || hasMatchingTag(data, filter) || isSeasonInIncludedThread(data, filter);
}

function isTopicPageIncluded(data, filter) {
  if (isTierExcluded(data, filter)) return false;
  if (!filter.active) return true;
  return hasMatchingTag(data, filter);
}

// Per-character granularity for the individual scene/POV pages: unlike
// isChapterIncluded (any matching POV pulls in the whole chapter, tags
// included), a single character's own POV page is real content only when
// THAT CHARACTER is on this build - named in CHARACTERS, or (since
// 2026-09-02) carrying a tag the build's TOPICS/THREADS match on their own
// character page, which is the same test isCharacterIncluded applies to the
// page a "View from" button sits beside. A chapter's tags still cannot grant
// a POV page: they identify the chapter, not the witness.
//
// Until 2026-09-02 only CHARACTERS could grant one, on the reasoning that a
// topic does not identify a specific character. True of the chapter's tags;
// not true of the character's own. The consequence surfaced on
// undercover-pets.com, which narrows by TOPICS and THREADS and names no
// CHARACTERS: every one of its 57 "View from" pages rendered as a "Not
// included in this edition" placeholder, Barsik's included, on the domain
// whose reader profile is built around following one animal's viewpoint.
//
// `characterData` is the character's own front matter; when omitted it is
// looked up by id from src/characters/ (cached), so the scene-POV builder
// needs no extra plumbing and tests can pass a hand-built page.
function isCharacterPovIncluded(characterId, filter, chapterData, characterData) {
  if (chapterData && isTierExcluded(chapterData, filter)) return false;
  if (!filter.active) return true;
  const id = String(characterId || "").toLowerCase();
  if (filter.characters.includes(id)) return true;
  // On the tag route the chapter has to be on this build as well (since
  // 2026-09-13): a POV page is one witness's cut of a chapter, and a witness
  // carried by tag does not carry a chapter the build excludes with them.
  // Surfaced when Season 1 came off undercover-pets.com (Dermot's decision):
  // Aldera's page stays on that domain by tag, so without this her Season 1
  // viewpoints would have rendered there under chapters that had become
  // placeholders. CHARACTERS stays an outright grant above: a chapter that
  // carries a named character's POV is included by that POV anyway.
  if (chapterData && !isChapterIncluded(chapterData, filter)) return false;
  const data = characterData === undefined ? characterDataById(id) : characterData;
  return data ? isCharacterIncluded(data, filter) : false;
}

let characterDataCache = null;

// Front matter of every character page, keyed by its `id` (the value POV
// blocks and `povs:` use), falling back to the filename slug for a page
// with no id. Read once per process: the scene-POV builder asks for every
// POV of every chapter, and the corpus does not change under a build.
function characterDataById(id) {
  if (!characterDataCache) {
    characterDataCache = new Map();
    let files = [];
    try {
      files = fs.readdirSync(CHARACTERS_DIR).filter((f) => f.endsWith(".md"));
    } catch {
      files = [];
    }
    for (const file of files) {
      const { data } = matter(fs.readFileSync(path.join(CHARACTERS_DIR, file), "utf8"));
      const key = String(data.id || file.replace(/\.md$/, "")).toLowerCase();
      if (!characterDataCache.has(key)) characterDataCache.set(key, data);
    }
  }
  return characterDataCache.get(String(id || "").toLowerCase()) || null;
}

// Matches an in-repo link target like /star-rangers/lore/planets/aspenar/
// or /star-rangers/glossary/plural-minds/ anywhere in a character's raw
// markdown body - deliberately not anchored to `[text](...)` syntax alone,
// since a stray `href="..."` would carry the same meaning.
const RELATED_LINK_PATTERN = /\/star-rangers\/(lore|timeline|glossary)\/[a-z0-9-/]+/gi;

// A character's own bio is already the site's best record of which lore,
// timeline, and glossary entries matter for understanding them - every
// character page in this repo cross-links its relevant background rather
// than restating it. So when a CHARACTERS-filtered deploy narrows the site
// to a handful of characters, this walks each included character's raw
// markdown for exactly those links and returns the set of lore/timeline/
// glossary page URLs (site-relative, no /star-rangers prefix, matching
// Eleventy's own `item.url`) that deploy should carry along even though
// nothing tagged them for that character explicitly.
function getRelatedContentUrls(filter) {
  const urls = new Set();
  if (!filter.active || !filter.characters.length) return urls;

  let files;
  try {
    files = fs.readdirSync(CHARACTERS_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return urls;
  }

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CHARACTERS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    if (!isCharacterIncluded(data, filter)) continue;

    for (const match of content.matchAll(RELATED_LINK_PATTERN)) {
      urls.add(match[0].replace(/^\/star-rangers/, ""));
    }
  }

  return urls;
}

// Flags a page that carries one of a tier-gated thread's hand-curated
// `signatureTags` (lib/storyline-threads.js) without also carrying the
// thread's own id tag - the missing-tag failure mode `isTierExcluded` can't
// detect on its own, since it only gates what's already tagged. The stake
// is no longer a privacy leak but it is still a tier leak: a page written
// for the contemplative tier that forgets its thread tag ships on every
// general-tier domain. Returns [{ threadId, signatureTag }] problems, empty
// if none. Takes a page's already-parsed front matter data; the caller
// (validate-content.js) supplies the relativePath for reporting.
function checkGatedThreadSignatureTags(data) {
  const problems = [];
  const tags = Array.isArray(data.tags) ? data.tags.map((t) => String(t).toLowerCase()) : [];
  if (!tags.length) return problems;

  for (const thread of STORYLINE_THREADS) {
    if (!thread.tier || !Array.isArray(thread.signatureTags)) continue;
    if (tags.includes(thread.id)) continue; // already correctly tagged
    for (const signature of thread.signatureTags) {
      if (tags.includes(signature)) {
        problems.push({ threadId: thread.id, signatureTag: signature });
      }
    }
  }
  return problems;
}

module.exports = {
  parseFilterList,
  getContentFilter,
  hasMatchingTag,
  hasMatchingPov,
  isSeasonInIncludedThread,
  isThreadIncluded,
  threadForPage,
  gatedThreadForPage,
  isTierExcluded,
  isCharacterIncluded,
  isChapterIncluded,
  isTopicPageIncluded,
  isCharacterPovIncluded,
  characterDataById,
  checkGatedThreadSignatureTags,
  getRelatedContentUrls
};
