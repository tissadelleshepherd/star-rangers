// Pins lib/editions.js's readingPlan contract. The failure it guards is
// quiet: src/start/index.md resolves `startThreadId` against the build's own
// filtered chapters, so a plan naming a thread the edition excludes renders
// "Begin here" with nothing under it and the page merely looks unfinished.
// validateEditions refuses that at config time; these tests pin the rule
// with hand-built editions rather than the live registry, so a registry
// change can't make the guard vacuous.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const {
  DEFAULT_EDITION,
  allEditions,
  validateEditions,
  validateReadingPlan,
  validateSectionHeroes
} = require("../lib/editions");

const REPO = path.join(__dirname, "..");
const HERO_DIR = path.join(REPO, "src", "images", "hero");

const goodPlan = () => ({
  startThreadId: "undercover-pets",
  intro: "Start here.",
  begin: "Press Next.",
  howToRead: "Read it straight through.",
  shelves: { characters: "Who everyone is." },
  more: "Other stories."
});

const edition = (overrides) => ({ ...DEFAULT_EDITION, id: "test", ...overrides });

test("the live registry validates, including every readingPlan and sectionHeroes it carries", () => {
  validateEditions({ audioDir: path.join(REPO, "src", "audio"), cssDir: path.join(REPO, "src", "css"), heroDir: HERO_DIR });
});

test("the default edition carries no readingPlan - Sen's note is the site-wide plan", () => {
  assert.equal(DEFAULT_EDITION.readingPlan, null);
});

test("a null or absent readingPlan is fine", () => {
  validateReadingPlan(edition({ readingPlan: null }));
  validateReadingPlan(edition({}));
});

test("an unfiltered edition may start on any registered thread", () => {
  validateReadingPlan(edition({ readingPlan: goodPlan() }));
});

test("a narrowed edition must name its start thread in its own threads", () => {
  validateReadingPlan(edition({ threads: ["undercover-pets"], readingPlan: goodPlan() }));
  assert.throws(
    () => validateReadingPlan(edition({ threads: ["orbital-five-o"], readingPlan: goodPlan() })),
    /not in this edition's own threads/
  );
  // Topic-only narrowing is still narrowing: a chapter is included by season
  // membership, and a topic tag can't stand in for that.
  assert.throws(
    () => validateReadingPlan(edition({ topics: ["undercover-pets.com"], readingPlan: goodPlan() })),
    /not in this edition's own threads/
  );
});

test("an unregistered start thread is refused", () => {
  assert.throws(
    () => validateReadingPlan(edition({ readingPlan: { ...goodPlan(), startThreadId: "no-such-thread" } })),
    /not a registered thread/
  );
});

test("every text field must be a non-empty string", () => {
  for (const field of ["intro", "begin", "howToRead", "more"]) {
    assert.throws(
      () => validateReadingPlan(edition({ readingPlan: { ...goodPlan(), [field]: "  " } })),
      new RegExp(`readingPlan\\.${field} must be a non-empty string`),
      field
    );
  }
});

test("shelves are keyed by the sections /start/ renders, nothing else", () => {
  assert.throws(
    () => validateReadingPlan(edition({ readingPlan: { ...goodPlan(), shelves: { journal: "x" } } })),
    /unknown section "journal"/
  );
  assert.throws(
    () => validateReadingPlan(edition({ readingPlan: { ...goodPlan(), shelves: ["x"] } })),
    /shelves must be an object/
  );
  assert.throws(
    () => validateReadingPlan(edition({ readingPlan: { ...goodPlan(), shelves: { lore: "" } } })),
    /shelves\.lore must be a non-empty string/
  );
});

test("the pets edition is the one that carries a plan today, and it starts on its own thread", () => {
  const pets = allEditions().find((e) => e.id === "pets");
  assert.ok(pets && pets.readingPlan, "pets edition has a readingPlan");
  assert.equal(pets.readingPlan.startThreadId, "undercover-pets");
  assert.ok(pets.threads.includes("undercover-pets"));
});

// ---- sectionHeroes -------------------------------------------------------

test("a null or absent sectionHeroes is fine", () => {
  validateSectionHeroes(edition({ sectionHeroes: null }), HERO_DIR);
  validateSectionHeroes(edition({}), HERO_DIR);
});

test("a section hero needs a known section, a bare filename and an alt", () => {
  const good = { characters: { image: "characters-hyrax.jpg", alt: "A hyrax on a machine." } };
  validateSectionHeroes(edition({ sectionHeroes: good }), HERO_DIR);
  assert.throws(
    () => validateSectionHeroes(edition({ sectionHeroes: { lore: good.characters } }), HERO_DIR),
    /unknown section "lore"/
  );
  assert.throws(
    () => validateSectionHeroes(edition({ sectionHeroes: { characters: { image: "hero/x.jpg", alt: "x" } } })),
    /bare filename/
  );
  assert.throws(
    () => validateSectionHeroes(edition({ sectionHeroes: { characters: { image: "characters-hyrax.jpg", alt: " " } } })),
    /alt must be a non-empty/
  );
});

test("a section hero must exist on disk and must not be the pending card", () => {
  assert.throws(
    () => validateSectionHeroes(edition({ sectionHeroes: { characters: { image: "no-such-file.jpg", alt: "x" } } }), HERO_DIR),
    /is not in/
  );
  // characters-concourse.jpg is the PLACEHOLDER-stamped card the field exists
  // to get past; naming it as an override is refused.
  assert.throws(
    () => validateSectionHeroes(edition({ sectionHeroes: { characters: { image: "characters-concourse.jpg", alt: "x" } } }), HERO_DIR),
    /PLACEHOLDER-stamped/
  );
});

test("the pets edition names a real, unstamped Characters hero", () => {
  const pets = allEditions().find((e) => e.id === "pets");
  assert.ok(pets.sectionHeroes && pets.sectionHeroes.characters);
  validateSectionHeroes({ ...DEFAULT_EDITION, ...pets }, HERO_DIR);
});

// ---- excludedNotice ------------------------------------------------------

const { validateExcludedNotice } = require("../lib/editions");

test("a null or absent excludedNotice is fine", () => {
  validateExcludedNotice(edition({ excludedNotice: null }));
  validateExcludedNotice(edition({}));
});

test("an excludedNotice needs title, intro and back, and nothing else", () => {
  const good = { title: "Not on this site", intro: "It isn't here.", back: "Back" };
  validateExcludedNotice(edition({ excludedNotice: good }));
  for (const field of ["title", "intro", "back"]) {
    assert.throws(
      () => validateExcludedNotice(edition({ excludedNotice: { ...good, [field]: " " } })),
      new RegExp(`excludedNotice\\.${field} must be a non-empty string`),
      field
    );
  }
  assert.throws(
    () => validateExcludedNotice(edition({ excludedNotice: { ...good, link: "https://x" } })),
    /unknown field "link"/
  );
});

test("the pets edition carries a plain-register notice", () => {
  const pets = allEditions().find((e) => e.id === "pets");
  assert.ok(pets.excludedNotice);
  validateExcludedNotice({ ...DEFAULT_EDITION, ...pets });
});

// THE TIER'S ABOUT PAGE (2026-09-14): a plain-register About a tier carries
// in place of the site-wide page, checked the way excludedNotice is.
const { validateAbout } = require("../lib/editions");

test("a null or absent about is fine", () => {
  validateAbout(edition({ about: null }));
  validateAbout(edition({}));
});

test("an about needs its two titles and two paragraph arrays, and nothing else", () => {
  const good = { title: "About", intro: ["Who made it."], grownUpsTitle: "For grown-ups", grownUps: ["How to reach him."] };
  validateAbout(edition({ about: good }));
  for (const field of ["title", "grownUpsTitle"]) {
    assert.throws(
      () => validateAbout(edition({ about: { ...good, [field]: " " } })),
      new RegExp(`about\\.${field} must be a non-empty string`),
      field
    );
  }
  for (const field of ["intro", "grownUps"]) {
    assert.throws(
      () => validateAbout(edition({ about: { ...good, [field]: [] } })),
      new RegExp(`about\\.${field} must be a non-empty array`),
      field
    );
    assert.throws(
      () => validateAbout(edition({ about: { ...good, [field]: ["ok", " "] } })),
      new RegExp(`about\\.${field}\\[1\\] must be a non-empty string`),
      field
    );
  }
  assert.throws(() => validateAbout(edition({ about: { ...good, email: "x" } })), /unknown field "email"/);
});

test("every children's-tier edition carries the tier's About, and no other tier does", () => {
  const children = allEditions().filter((e) => e.tier === "children");
  assert.ok(children.length >= 2, "two children's doors were registered by 2026-09-07");
  for (const e of children) {
    assert.strictEqual(e.about, TIERS.children.about, `${e.id} carries the tier's About, not a copy`);
    validateAbout({ ...DEFAULT_EDITION, ...e });
  }
  for (const e of allEditions().filter((e) => e.tier !== "children")) {
    assert.equal(e.about, undefined, `${e.id} serves the site-wide About`);
  }
});

// THE TIER LADDER (2026-09-03): children ⊂ young adult ⊂ general ⊂
// contemplative. The registry defines each tier once and spreads it; these pin
// that the chain nests, that every reading edition carries its tier whole, and
// what the ladder's predicate refuses.
const { TIER_ORDER, TIERS, editionFor } = require("../lib/editions");

const unionOf = (x) => new Set([...(x.threads || []), ...(x.characters || []), ...(x.topics || [])]);

test("the four tiers are in ascending order and each contains the one below", () => {
  assert.deepEqual(TIER_ORDER, ["children", "young-adult", "general", "contemplative"]);
  for (let i = 1; i < TIER_ORDER.length; i++) {
    const lower = unionOf(TIERS[TIER_ORDER[i - 1]]);
    const upper = unionOf(TIERS[TIER_ORDER[i]]);
    for (const v of lower) assert.ok(upper.has(v), `${TIER_ORDER[i]} lacks ${v}`);
    assert.ok(upper.size > lower.size, `${TIER_ORDER[i]} adds nothing over ${TIER_ORDER[i - 1]}`);
  }
});

test("the reading editions sit on their tiers and carry them whole", () => {
  const expect = { pets: "children", "the-told": "children", starquest: "young-adult", "young-star-rangers": "young-adult", sciencefiction: "general", fellowship: "contemplative", "church-space": "contemplative" };
  for (const [id, tier] of Object.entries(expect)) {
    const e = editionFor(id);
    assert.equal(e.tier, tier, id);
    const own = unionOf(e);
    for (const v of unionOf(TIERS[tier])) assert.ok(own.has(v), `${id} lacks ${v}`);
  }
  assert.ok(editionFor("starquest").threads.includes("undercover-pets"));
  assert.ok(["undercover-pets", "orbital-five-o"].every((t) => editionFor("sciencefiction").threads.includes(t)));
  assert.ok(
    ["undercover-pets", "orbital-five-o", "founding-era", "tissadelle-arc", "church-space"].every((t) =>
      editionFor("fellowship").threads.includes(t)
    )
  );
});

test("the canonical site is unfiltered and at the general tier; the codex site stands outside the ladder", () => {
  assert.equal(DEFAULT_EDITION.tier, "general");
  assert.equal(unionOf(DEFAULT_EDITION).size, 0);
  const archive = editionFor("fellowship-archive");
  assert.equal(archive.tier, "contemplative");
  assert.equal(archive.codexSite, true);
  assert.deepEqual(archive.threads, []);
});

test("an edition that narrows below its tier is what the ladder predicate refuses", () => {
  // validateEditions checks the live registry (which passes above); the rule
  // it applies is pinned here on a deliberately broken copy of an entry.
  const broken = { ...editionFor("starquest"), threads: ["orbital-five-o"] };
  const missing = [...unionOf(TIERS[broken.tier])].filter((v) => !unionOf(broken).has(v));
  assert.deepEqual(missing, ["undercover-pets"]);
});

test("a tier constant is a floor: young-star-rangers extends the young-adult tier and the general tier carries the extension", () => {
  const ysr = editionFor("young-star-rangers");
  const sq = editionFor("starquest");
  assert.ok(ysr.threads.includes("young-star-rangers"));
  assert.ok(!sq.threads.includes("young-star-rangers"), "starquest.site keeps the procedural's own page set");
  for (const t of sq.threads) assert.ok(ysr.threads.includes(t), `young-star-rangers lacks ${t}`);
  assert.ok(TIERS.general.threads.includes("young-star-rangers"), "the general tier must carry what any young-adult edition shows");
  assert.deepEqual(ysr.domains, ["young.fianilchruinne.com"]);
});

test("a tier constant is a floor: the-told extends the children's tier and the general tier carries the extension", () => {
  const btr = editionFor("the-told");
  const pets = editionFor("pets");
  assert.ok(btr.threads.includes("below-the-roof"));
  assert.ok(!pets.threads.includes("below-the-roof"), "undercover-pets.com keeps the agency's own page set");
  for (const t of pets.threads) assert.ok(btr.threads.includes(t), `the-told lacks ${t}`);
  assert.ok(TIERS.general.threads.includes("below-the-roof"), "the general tier must carry what any children's edition shows");
  assert.deepEqual(btr.domains, ["told.fianilchruinne.com"]);
  assert.equal(btr.presentation, "primer");
  assert.equal(btr.commentsEnabled, false);
});


test("aliasesOf inverts the ALIASES map: every parked alias of a domain, sorted, nothing for a domain nothing points at", () => {
  const { ALIASES, aliasesOf } = require("../lib/editions");
  assert.deepEqual(aliasesOf("starquest.site"), ["star-rangers.site", "starquest.online"]);
  assert.deepEqual(aliasesOf("https://www.fianilchruinne.com/"), [
    "fian-ilchruinne.com",
    "fianilchruinne.net",
    "fianilchruinne.online",
    "fianilchruinne.site",
    "fianilchruinne.space"
  ]);
  assert.deepEqual(aliasesOf("undercover-pets.com"), []);
  assert.deepEqual(aliasesOf(""), []);
  for (const alias of Object.keys(ALIASES)) {
    assert.ok(aliasesOf(ALIASES[alias]).includes(alias), `${alias} missing from aliasesOf(${ALIASES[alias]})`);
  }
});
