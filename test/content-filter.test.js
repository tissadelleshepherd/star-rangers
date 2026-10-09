// Unit tests for lib/content-filter.js - the CHARACTERS/TOPICS/THREADS
// narrowing predicates and the tier gate on storyline threads. This is the
// one module where a logic regression ships content to the wrong readership
// (church-space, gated to the contemplative tier, appearing on every
// general-tier domain, the canonical site included), so the governing rules
// get pinned here as executable truth tables:
//
//   ordinary content is INCLUDED unless a filter narrows it out;
//   a tier-gated thread is EXCLUDED on every build below its tier, whatever
//   the filter says, and is ordinary content on a build at or above it.
//
// Until 2026-09-04 the second line read "private content is excluded unless
// a build names it in" - `private: true`, opt-in by naming. Dermot ruled that
// day that tier gating replace it (story-bible/intake-2026-09-04.md), and the
// tests below pin the replacement: the same domains see the same pages, and
// the "excluded unless named in" case is gone.
//
// The tests run against the real lib/storyline-threads.js registry rather
// than a fixture one, deliberately: church-space being the only gated thread
// is itself a documented decision (CLAUDE.md), and a registry change that
// broke these expectations should be noticed, not absorbed. The build's tier
// comes from the real lib/editions.js registry too, selected by EDITION.
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseFilterList,
  getContentFilter,
  hasMatchingTag,
  hasMatchingPov,
  isSeasonInIncludedThread,
  isThreadIncluded,
  gatedThreadForPage,
  isTierExcluded,
  isCharacterIncluded,
  isChapterIncluded,
  isTopicPageIncluded,
  isCharacterPovIncluded,
  checkGatedThreadSignatureTags,
  getRelatedContentUrls
} = require("../lib/content-filter");

const FILTER_VARS = ["CHARACTERS", "TOPICS", "THREADS", "EDITION"];

// One registered edition per tier, so a test can ask for a build tier by
// name and get it through the real EDITION resolution path. The default
// edition (EDITION unset) is the general tier - the canonical site, GitHub
// Pages, local dev and every third-party fork.
const EDITION_AT = {
  children: "pets",
  "young-adult": "starquest",
  general: undefined,
  contemplative: "fellowship"
};

// Builds a filter through the real env-var parse path, then restores the
// environment, so tests exercise getContentFilter itself rather than a
// hand-built object that could drift from the production shape.
function filterFor({ characters, topics, threads, tier } = {}) {
  const saved = FILTER_VARS.map((k) => [k, process.env[k]]);
  try {
    if (characters === undefined) delete process.env.CHARACTERS;
    else process.env.CHARACTERS = characters;
    if (topics === undefined) delete process.env.TOPICS;
    else process.env.TOPICS = topics;
    if (threads === undefined) delete process.env.THREADS;
    else process.env.THREADS = threads;
    const edition = tier === undefined ? undefined : EDITION_AT[tier];
    if (edition === undefined) delete process.env.EDITION;
    else process.env.EDITION = edition;
    return getContentFilter();
  } finally {
    for (const [k, v] of saved) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

test("parseFilterList: empty, undefined and whitespace inputs give an empty list", () => {
  assert.deepEqual(parseFilterList(undefined), []);
  assert.deepEqual(parseFilterList(""), []);
  assert.deepEqual(parseFilterList(" , ,, "), []);
});

test("parseFilterList: trims, lowercases and drops empty segments", () => {
  assert.deepEqual(parseFilterList(" Tissadelle, ALDERA ,rook-7,"), ["tissadelle", "aldera", "rook-7"]);
});

test("getContentFilter: no env vars means an inactive filter at the general tier", () => {
  const filter = filterFor({});
  assert.equal(filter.active, false);
  assert.equal(filter.tagMatches.size, 0);
  assert.equal(filter.tier, "general");
});

test("getContentFilter: any of the three vars activates the filter and all three feed tagMatches", () => {
  const filter = filterFor({ characters: "tissadelle", topics: "eden", threads: "founding-era" });
  assert.equal(filter.active, true);
  for (const t of ["tissadelle", "eden", "founding-era"]) {
    assert.ok(filter.tagMatches.has(t), `tagMatches should contain ${t}`);
  }
});

test("getContentFilter: the build's tier is its edition's tier, and EDITION_AT covers every rung", () => {
  for (const tier of ["children", "young-adult", "general", "contemplative"]) {
    assert.equal(filterFor({ tier }).tier, tier);
  }
});

// ---------------------------------------------------------------------------
// Rule one: ordinary content on the unfiltered full-site build.
// ---------------------------------------------------------------------------

test("no filter: an ordinary character, chapter and topic page all ship", () => {
  const filter = filterFor({});
  assert.equal(isCharacterIncluded({ id: "aldera", tags: ["star-rangers"] }, filter), true);
  assert.equal(isChapterIncluded({ season: 1, povs: [{ id: "tissadelle" }] }, filter), true);
  assert.equal(isTopicPageIncluded({ tags: ["cosmology"] }, filter), true);
});

// ---------------------------------------------------------------------------
// Rule two: the tier gate. church-space is the registry's one gated thread
// (season 8, contemplative).
// ---------------------------------------------------------------------------

test("general tier, no filter: a church-space-tagged page is excluded - the canonical site and every fork", () => {
  const filter = filterFor({});
  assert.equal(isTopicPageIncluded({ tags: ["church-space", "lore"] }, filter), false);
  assert.equal(isCharacterIncluded({ id: "brother-daire", tags: ["church-space"] }, filter), false);
  assert.equal(isThreadIncluded("church-space", filter), false);
});

test("general tier, no filter: a season-8 chapter is excluded by season membership alone, no tag needed", () => {
  assert.equal(isChapterIncluded({ season: 8 }, filterFor({})), false);
});

test("the gate holds on every tier below the thread's, and opens at and above it", () => {
  for (const tier of ["children", "young-adult", "general"]) {
    const filter = filterFor({ tier });
    assert.equal(isTierExcluded({ season: 8 }, filter), true, tier);
    assert.equal(isThreadIncluded("church-space", filter), false, tier);
  }
  const contemplative = filterFor({ tier: "contemplative" });
  assert.equal(isTierExcluded({ season: 8 }, contemplative), false);
  assert.equal(isThreadIncluded("church-space", contemplative), true);
});

test("naming church-space in a filter does NOT open the gate below its tier - there is no opt-in any more", () => {
  for (const key of ["characters", "topics", "threads"]) {
    const filter = filterFor({ [key]: "church-space" });
    assert.equal(isTierExcluded({ tags: ["church-space"] }, filter), true, `via ${key} at the general tier`);
    assert.equal(isChapterIncluded({ season: 8 }, filter), false, `via ${key} at the general tier`);
  }
});

test("at the contemplative tier the thread is ordinary content: an unfiltered build ships it", () => {
  const filter = filterFor({ tier: "contemplative" });
  assert.equal(isTopicPageIncluded({ tags: ["church-space"] }, filter), true);
  assert.equal(isChapterIncluded({ season: 8 }, filter), true);
  assert.equal(isCharacterIncluded({ id: "brother-daire", tags: ["church-space"] }, filter), true);
});

test("at the contemplative tier the thread is ordinary content: a filter that names it narrows TO it, one that doesn't narrows it OUT", () => {
  const named = filterFor({ tier: "contemplative", threads: "church-space" });
  assert.equal(isChapterIncluded({ season: 8 }, named), true);
  assert.equal(isTopicPageIncluded({ tags: ["church-space"] }, named), true);
  assert.equal(isThreadIncluded("church-space", named), true);

  // The archive codex site's shape: contemplative tier, narrowed by topics
  // that are not the thread's - the thread's pages fall out like any other
  // narrowed page, not because of any gate.
  const elsewhere = filterFor({ tier: "contemplative", topics: "fellowship-of-light" });
  assert.equal(isChapterIncluded({ season: 8 }, elsewhere), false);
  assert.equal(isTopicPageIncluded({ tags: ["church-space"] }, elsewhere), false);
  assert.equal(isTopicPageIncluded({ tags: ["church-space", "fellowship-of-light"] }, elsewhere), true);
});

test("a narrowed general-tier build that never names church-space keeps it hidden", () => {
  const filter = filterFor({ characters: "tissadelle", topics: "eden" });
  assert.equal(isTopicPageIncluded({ tags: ["church-space", "eden"] }, filter), false);
  assert.equal(isChapterIncluded({ season: 8, povs: [{ id: "tissadelle" }] }, filter), false);
});

test("isThreadIncluded: an ungated thread is included on every build and every tier, named or not", () => {
  assert.equal(isThreadIncluded("founding-era", filterFor({})), true);
  assert.equal(isThreadIncluded("founding-era", filterFor({ threads: "tissadelle-arc" })), true);
  assert.equal(isThreadIncluded("founding-era", filterFor({ tier: "children" })), true);
  // An unknown thread id is not gated, so it passes through too.
  assert.equal(isThreadIncluded("no-such-thread", filterFor({})), true);
});

test("gatedThreadForPage: resolves by season, tag, category and threadId; null for ordinary pages", () => {
  assert.equal(gatedThreadForPage({ season: 8 }).id, "church-space");
  assert.equal(gatedThreadForPage({ tags: ["Church-Space"] }).id, "church-space");
  assert.equal(gatedThreadForPage({ category: "church-space" }).id, "church-space");
  assert.equal(gatedThreadForPage({ threadId: "church-space" }).id, "church-space");
  assert.equal(gatedThreadForPage({ season: 1, tags: ["star-rangers"] }), null);
  assert.equal(gatedThreadForPage({}), null);
});

test("threadForPage: one membership walk behind both per-thread properties (tier, comments board)", () => {
  const { threadForPage } = require("../lib/content-filter");
  const byBoard = (t) => Boolean(t.giscusProfile);
  // The church-space thread carries both properties, so the same pages
  // resolve to it whichever one is asked about - by season, tag, threadId.
  assert.equal(threadForPage({ season: 8 }, byBoard).id, "church-space");
  assert.equal(threadForPage({ tags: ["church-space"] }, byBoard).giscusProfile, "church-space");
  assert.equal(threadForPage({ threadId: "church-space" }, byBoard).id, "church-space");
  // A main-sequence chapter belongs to a thread with no board of its own.
  assert.equal(threadForPage({ season: 1 }, byBoard), null);
  assert.equal(threadForPage({ season: 1 }, () => true).id, "tissadelle-arc");
  assert.equal(threadForPage({}, () => true), null);
});

test("gatedThreadForPage is filter-independent: it answers which thread, not whether to hide", () => {
  // Even a build at the thread's tier still resolves it (excluded.njk uses
  // this to point at the thread's homeDomain).
  assert.equal(gatedThreadForPage({ season: 8 }).homeDomain, "church-space.site");
  assert.equal(gatedThreadForPage({ season: 8 }).tier, "contemplative");
});

// ---------------------------------------------------------------------------
// Ordinary narrowing.
// ---------------------------------------------------------------------------

test("CHARACTERS narrows characters by id or tag, case-insensitively", () => {
  const filter = filterFor({ characters: "Tissadelle" });
  assert.equal(isCharacterIncluded({ id: "TISSADELLE" }, filter), true);
  assert.equal(isCharacterIncluded({ id: "aldera", tags: ["tissadelle"] }, filter), true);
  assert.equal(isCharacterIncluded({ id: "aldera", tags: ["cascade"] }, filter), false);
});

test("chapters earn inclusion by POV, tag, or thread membership - and by nothing else", () => {
  const byPov = filterFor({ characters: "tissadelle" });
  assert.equal(isChapterIncluded({ season: 1, povs: [{ id: "tissadelle" }] }, byPov), true);
  assert.equal(isChapterIncluded({ season: 1, povs: [{ id: "aldera" }] }, byPov), false);

  const byThread = filterFor({ threads: "tissadelle-arc" });
  assert.equal(isChapterIncluded({ season: 5, povs: [] }, byThread), true);
  assert.equal(isChapterIncluded({ season: 2, povs: [] }, byThread), false);

  const byTag = filterFor({ topics: "eden" });
  assert.equal(isChapterIncluded({ season: 2, tags: ["eden"] }, byTag), true);
});

test("hasMatchingTag matches tags and category; inactive filter matches nothing", () => {
  const filter = filterFor({ topics: "eden" });
  assert.equal(hasMatchingTag({ tags: ["EDEN"] }, filter), true);
  assert.equal(hasMatchingTag({ category: "Eden" }, filter), true);
  assert.equal(hasMatchingTag({ tags: ["mara"] }, filter), false);
  assert.equal(hasMatchingTag({ tags: ["eden"] }, filterFor({})), false);
});

test("hasMatchingPov tolerates malformed povs entries", () => {
  const filter = filterFor({ characters: "tissadelle" });
  assert.equal(hasMatchingPov({ povs: [null, {}, { id: "TISSADELLE" }] }, filter), true);
  assert.equal(hasMatchingPov({ povs: "not-a-list" }, filter), false);
});

test("isSeasonInIncludedThread: THREADS only, via the season's registered thread", () => {
  const filter = filterFor({ threads: "undercover-pets" });
  assert.equal(isSeasonInIncludedThread({ season: 2 }, filter), true);
  assert.equal(isSeasonInIncludedThread({ season: 3 }, filter), false);
  assert.equal(isSeasonInIncludedThread({ season: 2 }, filterFor({ characters: "barsik" })), false);
});

// The POV page follows the CHARACTER, not the chapter. `characterData` is
// passed explicitly here so the truth table does not depend on what the
// live corpus happens to tag; `null` means "no character page at all".
test("isCharacterPovIncluded: a witness the build carries still gets no page for a chapter the build excludes", () => {
  const pets = filterFor({ topics: "undercover-pets.com", threads: "undercover-pets" });
  const aldera = { tags: ["cat", "undercover-pets.com"] };
  const seasonOne = { season: 1, tags: ["prequel", "aldera"], povs: [{ id: "aldera" }] };
  const seasonTwo = { season: 2, tags: ["eden"], povs: [{ id: "aldera" }] };
  assert.equal(isCharacterPovIncluded("aldera", pets, seasonTwo, aldera), true);
  assert.equal(isCharacterPovIncluded("aldera", pets, seasonOne, aldera), false);
  // CHARACTERS names the witness AND the chapter's povs, so the chapter is included too.
  assert.equal(isCharacterPovIncluded("aldera", filterFor({ characters: "aldera" }), seasonOne, aldera), true);
});

test("isCharacterPovIncluded: CHARACTERS grants a POV page outright", () => {
  assert.equal(isCharacterPovIncluded("tissadelle", filterFor({ characters: "tissadelle" }), undefined, null), true);
  assert.equal(isCharacterPovIncluded("aldera", filterFor({ characters: "tissadelle" }), undefined, null), false);
  assert.equal(isCharacterPovIncluded("anyone", filterFor({}), undefined, null), true);
});

test("isCharacterPovIncluded: a TOPICS/THREADS build grants a POV page when the character's OWN page is included", () => {
  const pets = filterFor({ topics: "undercover-pets.com", threads: "undercover-pets" });
  const barsik = { id: "barsik", tags: ["cat", "undercover-pets.com"] };
  const larsen = { id: "larsen", tags: ["human", "orbital-five-o"] };
  assert.equal(isCharacterPovIncluded("barsik", pets, undefined, barsik), true);
  assert.equal(isCharacterPovIncluded("larsen", pets, undefined, larsen), false);
  // The chapter's tags never stand in for the witness's: no character page,
  // no POV page, however the chapter itself is included.
  assert.equal(isCharacterPovIncluded("tissadelle", filterFor({ topics: "tissadelle" }), undefined, null), false);
});

test("isCharacterPovIncluded looks the character up by id when no data is passed (Aldera regression)", () => {
  // Aldera's page was tagged `pets` rather than `undercover-pets.com` until
  // 2026-09-02, so her Season 1 chapters shipped on the children's domain
  // while her page and every "View from Aldera" button dead-ended.
  const pets = filterFor({ topics: "undercover-pets.com", threads: "undercover-pets" });
  assert.equal(isCharacterPovIncluded("aldera", pets), true);
  assert.equal(isCharacterPovIncluded("no-such-character", pets), false);
});

test("isCharacterPovIncluded applies the tier gate through the chapter's data", () => {
  const filter = filterFor({ characters: "tissadelle" });
  assert.equal(isCharacterPovIncluded("tissadelle", filter, { season: 8 }), false);
  const contemplative = filterFor({ tier: "contemplative", characters: "tissadelle" });
  assert.equal(isCharacterPovIncluded("tissadelle", contemplative, { season: 8 }), true);
});

// ---------------------------------------------------------------------------
// The signature-tag tripwire and the related-content walk.
// ---------------------------------------------------------------------------

test("checkGatedThreadSignatureTags flags a signature tag missing its thread tag", () => {
  const problems = checkGatedThreadSignatureTags({ tags: ["cnoc-na-mbeach", "lore"] });
  assert.equal(problems.length, 1);
  assert.deepEqual(problems[0], { threadId: "church-space", signatureTag: "cnoc-na-mbeach" });
});

test("checkGatedThreadSignatureTags stays quiet when the thread tag is present, or there are no tags", () => {
  assert.deepEqual(checkGatedThreadSignatureTags({ tags: ["cnoc-na-mbeach", "church-space"] }), []);
  assert.deepEqual(checkGatedThreadSignatureTags({ tags: [] }), []);
  assert.deepEqual(checkGatedThreadSignatureTags({}), []);
});

test("getRelatedContentUrls: empty without an active CHARACTERS filter", () => {
  assert.equal(getRelatedContentUrls(filterFor({})).size, 0);
  assert.equal(getRelatedContentUrls(filterFor({ topics: "eden" })).size, 0);
});

test("getRelatedContentUrls: an included character's bio links come along, site-relative", () => {
  // Integration against the real src/characters corpus: Tissadelle's page
  // links its background, so a tissadelle-narrowed deploy carries it.
  const urls = getRelatedContentUrls(filterFor({ characters: "tissadelle" }));
  assert.ok(urls.size > 0, "expected at least one related URL from the bio");
  for (const url of urls) {
    assert.ok(!url.startsWith("/star-rangers/"), `URL should be site-relative: ${url}`);
    assert.match(url, /^\/(lore|timeline|glossary)\//);
  }
});
