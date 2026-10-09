// Pins lib/glossary-crosslinks.js, the planner behind
// scripts/link-glossary-terms.js. The cases are the ones the first runs over
// src/glossary/ and src/lore/ turned up: a shorter title inside a longer one
// ("Celestials" in "High Celestials"), an entry's own title, mentions already
// inside a link or a heading, the mechanical title variants, a title at the
// head of a longer proper noun, and one link per target at the earliest
// mention.
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  titleVariants,
  splitFrontMatter,
  titleFromFrontMatter,
  planCrossLinks,
  applyLinks,
} = require("../lib/glossary-crosslinks");

// Fixture entries are { slug, title, body }; the planner also wants the url.
function withUrls(entries, section = "glossary") {
  return entries.map((e) => ({ url: `/star-rangers/${section}/${e.slug}/`, ...e }));
}

function plan(entries, section) {
  const out = {};
  for (const e of planCrossLinks(withUrls(entries, section))) {
    out[e.slug] = e.links.map((l) => [l.text, l.slug]);
  }
  return out;
}

test("titleVariants: acronym, article and plural forms", () => {
  assert.deepEqual(
    titleVariants("Inner World Depth (IWD)").sort(),
    ["IWD", "Inner World Depth", "Inner World Depth (IWD)"].sort()
  );
  assert.deepEqual(titleVariants("The Interval").sort(), ["Interval", "The Interval"].sort());
  assert.deepEqual(titleVariants("Celestials").sort(), ["Celestial", "Celestials"].sort());
  assert.ok(titleVariants("Worldwright Design Philosophies").includes("Worldwright Design Philosophy"));
  assert.ok(titleVariants("Orbital Compute Complexes").includes("Orbital Compute Complex"));
  // A title ending in "ss" is not a plural.
  assert.deepEqual(titleVariants("Glass"), ["Glass"]);
  // The head of a "Head: Subtitle" title is how prose names the page.
  assert.ok(titleVariants("Deadwater: The Silent Membrane").includes("Deadwater"));
  // A capitalised parenthetical is a name; a lower-case one is a gloss.
  assert.ok(titleVariants("Krenyi (Quiet-Built)").includes("Quiet-Built"));
  assert.deepEqual(titleVariants("Ollune (the Held)"), ["Ollune (the Held)", "Ollune"]);
  // The one hand-aliased title.
  assert.ok(titleVariants("Champions / Heroes (Heros)").includes("Hero"));
  assert.ok(!titleVariants("Champions / Heroes (Heros)").includes("Champions / Heroes (Heros)"));
});

test("front matter split and title parsing", () => {
  const raw = '---\nlayout: glossary-entry.njk\ntitle: "The Told"\n---\nBody.\n';
  const split = splitFrontMatter(raw);
  assert.equal(split.body, "Body.\n");
  assert.equal(titleFromFrontMatter(split.frontMatter), "The Told");
  assert.equal(titleFromFrontMatter("title: Plain Title"), "Plain Title");
  assert.equal(splitFrontMatter("no front matter"), null);
});

test("links the earliest unlinked mention of each other entry, once", () => {
  const entries = [
    { slug: "etheric", title: "Etheric", body: "**Etheric** is a layer.\n" },
    {
      slug: "zone",
      title: "Zone",
      body: "A zone has Etheric conditions. Etheric again. The Etheric layer.\n",
    },
  ];
  const out = plan(entries);
  assert.deepEqual(out.etheric, []);
  assert.deepEqual(out.zone, [["Etheric", "etheric"]]);
  const zone = planCrossLinks(withUrls(entries))[1];
  assert.equal(zone.links[0].index, "A zone has ".length);
});

test("never links an entry to itself, and matches whole words case-sensitively", () => {
  const entries = [
    { slug: "interval", title: "The Interval", body: "**The Interval** separates membranes.\n" },
    {
      slug: "other",
      title: "Other",
      body: "Any interval in time is not it, nor an Intervalometer; the Interval is.\n",
    },
  ];
  const out = plan(entries);
  assert.deepEqual(out.interval, []);
  assert.deepEqual(out.other, [["Interval", "interval"]]);
});

test("a shorter title inside a longer one is not a mention of the shorter", () => {
  const entries = [
    { slug: "celestials", title: "Celestials", body: "The tier.\n" },
    {
      slug: "high-celestials",
      title: "High Celestials",
      body: "**High Celestials** rank above. High Celestials never act alone.\n",
    },
    { slug: "concordant", title: "Concordant", body: "A zone.\n" },
    { slug: "concordant-principal", title: "Concordant Principal", body: "A mind.\n" },
    {
      slug: "mediarch",
      title: "Mediarch",
      body: "Mediarchs rank between Concordant Principals and Celestials.\n",
    },
  ];
  const out = plan(entries);
  assert.deepEqual(out["high-celestials"], []);
  assert.deepEqual(out.mediarch, [
    ["Concordant Principals", "concordant-principal"],
    ["Celestials", "celestials"],
  ]);
});

test("mentions inside existing links, headings, code and HTML are not candidates", () => {
  const entries = [
    { slug: "kieme", title: "Kieme", body: "Tier two.\n" },
    { slug: "levril", title: "Levril", body: "Tier low.\n" },
    {
      slug: "a",
      title: "A",
      body: [
        "## Kieme and the rest",
        "",
        "See [Kieme itself](/star-rangers/lore/cosmic-cascade/) and `Levril` in code.",
        '<span title="Levril">x</span>',
        "Then Kieme plainly, and Levrils plainly.",
        "",
      ].join("\n"),
    },
    {
      slug: "b",
      title: "B",
      body: "Already [Kieme](/star-rangers/glossary/kieme/) linked; Kieme again stays bare.\n",
    },
  ];
  const out = plan(entries);
  assert.deepEqual(out.a, [
    ["Kieme", "kieme"],
    ["Levrils", "levril"],
  ]);
  const a = planCrossLinks(withUrls(entries))[2];
  assert.ok(a.links[0].index > a.body.indexOf("Then"));
  assert.deepEqual(out.b, []);
});

test("a title at the head of a longer proper noun is passed over for the next mention", () => {
  const entries = [
    { slug: "quantum-space-harmonics", title: "Quantum Space Harmonics", body: "Waves.\n" },
    { slug: "venice", title: "Venice", body: "A city.\n" },
    {
      slug: "a",
      title: "A",
      body: "The Quantum Space Harmonic Wave is fast; Quantum Space Harmonics explains why.\n",
    },
    { slug: "b", title: "B", body: "Only the Quantum Space Harmonic Wave is named here.\n" },
    { slug: "c", title: "C", body: "New Venice was built from Venice's plans.\n" },
  ];
  const out = plan(entries, "lore");
  assert.deepEqual(out.a, [["Quantum Space Harmonics", "quantum-space-harmonics"]]);
  assert.deepEqual(out.b, []);
  assert.deepEqual(out.c, [["Venice", "venice"]]);
  const c = planCrossLinks(withUrls(entries, "lore"))[4];
  assert.equal(c.links[0].index, "New Venice was built from ".length);
});

test("a link to the same slug in the other section counts as already linked", () => {
  const entries = [
    { slug: "cosmic-cascade", title: "The Cosmic Cascade", body: "The spine.\n" },
    {
      slug: "d",
      title: "D",
      body: "See [the Cascade](/star-rangers/glossary/cosmic-cascade/); the Cosmic Cascade again.\n",
    },
  ];
  assert.deepEqual(plan(entries, "lore").d, []);
});

test("links carry the entry's own url, so a lore entry in a subdirectory resolves", () => {
  const entries = [
    { slug: "mars", title: "Mars", url: "/star-rangers/lore/planets/mars/", body: "Red.\n" },
    { slug: "e", title: "E", url: "/star-rangers/lore/e/", body: "Solar Command on Mars.\n" },
  ];
  const e = planCrossLinks(entries)[1];
  assert.equal(applyLinks(e.body, e.links), "Solar Command on [Mars](/star-rangers/lore/planets/mars/).\n");
});

test("applyLinks wraps each planned mention and keeps the surrounding text", () => {
  const entries = [
    { slug: "frenar", title: "Frenar", body: "Legacy.\n" },
    { slug: "levril", title: "Levril", body: "Low.\n" },
    {
      slug: "c",
      title: "C",
      body: "Sits below Celestials (**Frenar**) and above Levrils, a Levril's peers.\n",
    },
  ];
  const c = planCrossLinks(withUrls(entries))[2];
  assert.equal(
    applyLinks(c.body, c.links),
    "Sits below Celestials (**[Frenar](/star-rangers/glossary/frenar/)**) and above " +
      "[Levrils](/star-rangers/glossary/levril/), a Levril's peers.\n"
  );
});
