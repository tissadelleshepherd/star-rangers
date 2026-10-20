// Pins scripts/extract-designs.js, the extractor behind the station and
// starship designs reference artefact: how it reads starship-design.md's
// principles, sheets and open items, how it finds the images the audits send
// through the starship-design loop, how a design's status follows from its
// sheet and its pictures, and that a rule whose quote has left the record is
// reported rather than written into the data. The build is run against a
// small fixture record in a temporary folder, never the real one, so a
// content change elsewhere cannot fail this suite; the release run is where
// the rule tables meet the record.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { parseSheets, parsePrinciples, parseOpenItems, loopImages, statusFor, checkText, urlFor, build, STATUS } = require("../scripts/extract-designs");

const SHEET = [
  "# Starship design",
  "",
  "## The principles, from the record",
  "",
  "1. **Real physics.** Nothing about a hull may need magic.",
  "",
  "6. **Weight is spun** where people live long. The formula",
  "   *g = ω² r*.",
  "",
  "---",
  "",
  "## Blueprints",
  "",
  "### A. A generation ark",
  "",
  "- **Purpose** (canon, `x.md`): a sealed hull.",
  "- **Weight** (derived): a drum, **200 m",
  "  diameter, 3 rpm**.",
  "- **Drive** (derived): low thrust.",
  "- **Layout** (derived): radiators on the spine.",
  "",
  "### D. A single-ring habitat",
  "",
  "- **Figures** (derived): 300 to 400 m.",
  "",
  "## How a prompt uses this",
  "",
  "1. Name the class.",
  "",
  "## Open items (his)",
  "",
  "- Ark drum figures (A), and whether one drum or two.",
  "- The command ship (principle 6): whether it gets a sheet (D) first.",
  "- Whether any ship has windows.",
  "",
].join("\n");

test("sheets are read by letter, with continuation lines joined", () => {
  const s = parseSheets(SHEET);
  assert.deepEqual(Object.keys(s), ["A", "D"]);
  assert.equal(s.A.title, "A generation ark");
  assert.deepEqual(s.A.lines.map(l => l.label), ["Purpose", "Weight", "Drive", "Layout"]);
  assert.equal(s.A.lines[1].text, "(derived): a drum, **200 m diameter, 3 rpm**.");
});

test("principles keep their numbers and their continuation lines", () => {
  const p = parsePrinciples(SHEET);
  assert.deepEqual(p.map(x => x.n), [1, 6]);
  assert.equal(p[1].title, "Weight is spun");
  assert.match(p[1].text, /The formula \*g = ω² r\*\.$/);
});

test("an open item belongs to the sheets it names before its first colon", () => {
  const o = parseOpenItems(SHEET);
  assert.equal(o.length, 3);
  assert.deepEqual(o[0].sheets, ["A"]);
  assert.deepEqual(o[1].sheets, [], "the (D) after the colon is a proposal, not the item's sheet");
  assert.deepEqual(o[1].principles, [6]);
  assert.deepEqual(o[2].sheets, []);
});

test("the loop list takes an audit item's own image and a sentence's named images only", () => {
  const md = [
    "- `habitat-threshold.jpg` — a CGI stock station. Cause 2; goes through the `starship-design` loop.",
    "- `other.jpg` — a render. Cause 2.",
    "Batch order: `aaa`, `bbb`. The ships among the heroes (`home-launch`, `seasons-orbit`) go through the `starship-design` loop, `home-launch` as a javelin.",
    "Cards: `ccc` and `ddd`. Ships in C (`new-london-space-habitat`) go through the `starship-design` loop.",
  ].join("\n");
  assert.deepEqual(loopImages(md), ["habitat-threshold", "home-launch", "new-london-space-habitat", "seasons-orbit"]);
});

test("status follows the sheet and the pictures, never a card or an interior", () => {
  assert.equal(statusFor({ sheet: null, images: [{ check: "no-sheet" }] }), STATUS.none);
  assert.equal(statusFor({ sheet: "A", images: [{ check: "agrees" }, { check: "card" }] }), STATUS.agree);
  assert.equal(statusFor({ sheet: "A", images: [{ check: "agrees" }, { check: "predates" }] }), STATUS.loop);
  assert.equal(statusFor({ sheet: "A", images: [{ check: "interior" }] }), STATUS.noImage);
});

test("quote text drops links and emphasis; URLs follow the content path", () => {
  assert.equal(checkText("the *Fel Trohen*, [Wender's](/star-rangers/x/) `ship`\n  here"), "the Fel Trohen, Wender's ship here");
  assert.equal(urlFor("src/lore/planets/titan.md", {}), "/lore/planets/titan/");
  assert.equal(urlFor("src/seasons/s05/e00/s05e00c02.md", {}), "/seasons/s05/e00/s05e00c02/");
  assert.equal(urlFor("story-bible/images.md", {}), null);
});

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "designs-"));
  const w = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s); };
  w("package.json", JSON.stringify({ version: "9.9.9" }));
  w("story-bible/starship-design.md", SHEET);
  w("story-bible/images.md", "- **`ark.jpg`** — the ark.\n  - **Delivered**: the drum and the radiators read.\n");
  w("src/lore/ark.md", "---\ntitle: \"The Ark\"\nimage: \"ark.jpg\"\nimage_alt: \"An ark\"\n---\nThe *Ark* left in 2561 UCSD, crewed by [the Fleet](/star-rangers/lore/fleet/).\n");
  w("src/images/lore/ark.jpg", "");
  return root;
}
const FACTS = { A: { spin: ["Weight"], power: [], heat: ["Layout"], drive: ["Drive"] }, D: { spin: ["Figures"], power: [], heat: [], drive: [] } };
const ARK = {
  id: "ark", name: "The Ark", kind: "ark", sheet: "A", principles: [6],
  owner: { text: "the Fleet", quote: "crewed by the Fleet" },
  era: { text: "2561 UCSD", quote: "The Ark left in 2561 UCSD" },
  sources: [["src/lore/ark.md", "The Ark left in 2561 UCSD"]],
  page: true,
  images: [{ path: "lore/ark.jpg", check: "agrees", evidence: ["story-bible/images.md", "the drum and the radiators read"] }],
};

test("a design is built from its sheet, its page and its picture", () => {
  const { data, failures } = build(fixture(), [ARK], FACTS);
  assert.deepEqual(failures, []);
  const d = data.designs[0];
  assert.equal(d.status, STATUS.agree);
  assert.deepEqual(d.facts.spin.map(f => f.label), ["Weight"]);
  assert.deepEqual(d.facts.drive.map(f => f.label), ["Drive"]);
  assert.deepEqual(d.facts.heat.map(f => f.label), ["Layout"]);
  assert.deepEqual(d.facts.power, []);
  assert.deepEqual(d.openItems, ["Ark drum figures (A), and whether one drum or two."]);
  assert.equal(d.sources[0].url, "/lore/ark/");
  assert.equal(d.images[0].alt, "An ark");
  assert.equal(d.images[0].checkedAgainstSheet, true);
  assert.equal(data.counts.byKind.ark, 1);
});

test("the same record builds the same data twice", () => {
  const root = fixture();
  assert.deepEqual(build(root, [ARK], FACTS).data, build(root, [ARK], FACTS).data);
});

test("a quote that has left the record, or a page image with no check, is a failure", () => {
  const root = fixture();
  const gone = { ...ARK, era: { text: "2561 UCSD", quote: "The Ark left in 2562 UCSD" } };
  assert.ok(build(root, [gone], FACTS).failures.some(f => /era quote not found/.test(f)));
  const unchecked = { ...ARK, images: [] };
  assert.ok(build(root, [unchecked], FACTS).failures.some(f => /has no check in the rule table/.test(f)));
  const wrong = { ...ARK, sheet: null };
  assert.ok(build(root, [wrong], FACTS).failures.some(f => /but the design has no sheet/.test(f)));
});
