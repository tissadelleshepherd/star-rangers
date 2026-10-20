// Pins scripts/extract-peoples.js, the extractor behind the Peoples and
// Bodies reference artefact: how it reads species-design.md's sections, the
// taxonomy's frames table, a body-plan or colour line by its anchor phrase,
// how a people's status follows from its design and its portraits, and that a
// rule whose quote has left the record is reported rather than written into
// the data. The fixture texts below are quoted from the record (the design
// note, the taxonomy, the Mnemari and Told sections), but the build runs
// against a small fixture record in a temporary folder, never the real one, so
// a content change elsewhere cannot fail this suite; the release run is where
// the rule table meets the record.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { parseSections, parseFrames, sentenceAt, proseText, statusFor, build, PEOPLES, STATUS, CHECKS } = require("../scripts/extract-peoples");

const DESIGN = [
  "# Designing the species — what is already forced, and what is open",
  "",
  "Started 13 August 2026, after the ruling that **the Krenyi are the only other",
  "sapient humanoids**.",
  "",
  "## The good news: most of it is already written",
  "",
  "### Veyr Basaltborn — Veyr-3",
  "",
  "The gravity is the loudest constraint in the whole set and it is unforgiving:",
  "**a tall bipedal frame is not available.** High gravity favours low, broad,",
  "short-limbed, heavily braced — weight close to the ground, load paths short,",
  "probably more than four points of contact. Dense mineral aerosols argue for",
  "sealed or filtering respiration.",
  "",
  "## Mnemari — a body from Ilenne (19 October 2026, Dermot's *\"1 A\"*)",
  "",
  "### The body (re-made 20 October 2026; proposed unless marked)",
  "",
  "1. **What the world did to it.** A large walker. **Three legs**, so it stands on a",
  "   stable triangle whatever the ground: three tall, thick, jointed legs rise",
  "   from broad soft padded feet.",
  "",
  "**Covering** (proposed, re-made): a warm, rich hide, as an animal of a world",
  "under an old orange sun would wear: deep ochre and russet across the body,",
  "legs and neck. Not grey.",
  "",
  "## The Told — a second warm's body (19 October 2026, Dermot's *\"Alternative body design for Pandoids?\"*)",
  "",
  "**Why.** Dermot's direction keeps the four filed Told frames as they are (Stone-First, Teddy, Went-Round, Keeps-A-Hand-On-It) and gives any Pandoid of another community a body designed from structure instead.",
  "",
  "- **B, the whiskered face.** A blunt face with very small eyes nearly hidden in the fur and a fan of long pale sensory whiskers, a body that feels its way in the dark.",
  "",
].join("\n");

const TAXONOMY = [
  "## Frames: Structure, and No Claim of Ancestry",
  "",
  "| Frame | Structural strategy | Members |",
  "| --- | --- | --- |",
  "| **Trabeculata** | Open lattice. Load carried through many slender braced members with no solid trunk | [Veyr Basaltborn](/star-rangers/lore/veyr-basaltborn/) |",
  "| **Endoskelia** | Internal skeleton | Humans; [Krenyi](/star-rangers/lore/krenyi/); [Prismeri](/star-rangers/lore/prismeri/) |",
  "",
].join("\n");

test("sections carry their subsections and know the ## heading above them", () => {
  const s = parseSections(DESIGN);
  assert.deepEqual(s.map(x => x.level), [2, 3, 2, 3, 2]);
  const veyr = s.find(x => x.heading.startsWith("Veyr Basaltborn"));
  assert.equal(veyr.parent, "The good news: most of it is already written");
  const mnemari = s.find(x => x.heading.startsWith("Mnemari — a body from Ilenne"));
  assert.match(mnemari.text, /Three legs/, "a ## section includes its ### subsections");
  assert.doesNotMatch(mnemari.text, /second warm/, "and stops at the next ## heading");
});

test("the frames table gives each frame its members and their links", () => {
  const f = parseFrames(TAXONOMY);
  assert.deepEqual(f.map(x => x.frame), ["Trabeculata", "Endoskelia"]);
  assert.deepEqual(f[1].members.map(m => m.text), ["Humans", "Krenyi", "Prismeri"]);
  assert.equal(f[1].members[0].url, null);
  assert.equal(f[1].members[1].url, "/star-rangers/lore/krenyi/");
});

test("an anchor yields the whole sentence that holds it, headings and line-wrap hyphens dropped", () => {
  const s = parseSections(DESIGN);
  const veyr = proseText(s.find(x => x.heading.startsWith("Veyr")).text);
  assert.equal(sentenceAt(veyr, "High gravity favours low, broad"),
    "High gravity favours low, broad, short-limbed, heavily braced — weight close to the ground, load paths short, probably more than four points of contact.");
  const mnemari = proseText(s.find(x => x.heading.startsWith("Mnemari")).text);
  assert.equal(sentenceAt(mnemari, "deep ochre and russet across the body"),
    "Covering (proposed, re-made): a warm, rich hide, as an animal of a world under an old orange sun would wear: deep ochre and russet across the body, legs and neck.");
  assert.doesNotMatch(mnemari, /The body \(re-made/, "the ### heading is not part of the prose");
  assert.equal(sentenceAt(proseText("a light, long, level-\n   spined frame; wings as forelimbs."), "level-spined"), "a light, long, level-spined frame; wings as forelimbs.");
  assert.equal(sentenceAt(proseText("A Veyr is built as a truss, not a frame. The load-bearing structure is a lattice."), "A Veyr is built as a truss, not a frame."), "A Veyr is built as a truss, not a frame.");
  assert.equal(sentenceAt(veyr, "a phrase that is not there"), null);
});

test("status follows the design and the portraits", () => {
  const c = check => ({ check });
  assert.equal(statusFor({ bodyNotRelevant: { reason: "x" }, design: null, characters: [c("not-relevant")] }), STATUS.notRelevant);
  assert.equal(statusFor({ design: { heading: "x" }, characters: [c("agrees"), c("kept")] }), STATUS.done);
  assert.equal(statusFor({ design: { heading: "x" }, characters: [c("agrees"), c("none")] }), STATUS.pending, "a character without a portrait is pending");
  assert.equal(statusFor({ design: { heading: "x" }, characters: [c("predates")] }), STATUS.pending, "a portrait made before the design is pending");
  assert.equal(statusFor({ design: { heading: "x" }, characters: [] }), STATUS.pending, "a design with nobody pictured yet is pending");
  assert.equal(statusFor({ design: null, characters: [c("no-design")] }), STATUS.undesigned);
  assert.equal(statusFor({ design: null, characters: [c("none")] }), STATUS.none);
  assert.equal(statusFor({ design: null, characters: [] }), STATUS.none);
});

test("the rule table is well formed", () => {
  const ids = new Set();
  for (const p of PEOPLES) {
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`); ids.add(p.id);
    assert.match(p.page, /^src\/(lore|glossary)\/.+\.md$/, p.id);
    assert.ok(Array.isArray(p.species), p.id);
    if (p.design) {
      assert.ok(p.design.heading && p.design.body && p.design.date && p.design.date.quote, p.id);
      assert.ok(!p.bodyNotRelevant, `${p.id}: a designed body is relevant`);
    }
    for (const [id, r] of Object.entries(p.portraits)) {
      if (r.check) assert.ok(CHECKS.includes(r.check), `${p.id} ${id}`);
      if (r.check) assert.ok(r.evidence && r.evidence.length >= 2, `${p.id} ${id}: a check carries a quote`);
      if (!p.design) assert.ok(!r.check, `${p.id} ${id}: no design, so the check is derived`);
    }
  }
  const told = PEOPLES.find(p => p.id === "the-told");
  assert.ok(Object.values(told.portraits).every(r => r.check === "kept"), "the first warm's four frames are kept, not judged against the second warm's design");
});

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "peoples-"));
  const w = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s); };
  w("package.json", JSON.stringify({ version: "9.9.9" }));
  w("story-bible/species-design.md", DESIGN);
  w("story-bible/images.md", "- **`ulessa.jpg`** — filed 20 October 2026 in the re-made body.\n");
  w("src/lore/cross-biosphere-taxonomy.md", "---\ntitle: \"Taxonomy\"\n---\n" + TAXONOMY);
  w("src/lore/mnemari.md", "---\ntitle: \"Mnemari\"\ncategory: \"Species\"\nimage: \"mnemari.jpg\"\nimage_alt: \"A card\"\n---\nThat body is filed in the [frame](/star-rangers/lore/cross-biosphere-taxonomy/) Endoskelia, and is not on the human frame.\n");
  w("src/lore/krenyi.md", "---\ntitle: \"Krenyi (Quiet-Built)\"\ncategory: \"Species\"\n---\nThe Krenyi are the only other people the record holds built on the human frame.\n");
  w("src/images/lore/mnemari.jpg", "");
  w("src/characters/ulessa.md", "---\ntitle: \"Ulessa\"\nspecies: Mnemari\nimage: \"ulessa.jpg\"\nimage_alt: \"Ulessa, standing on three tall arched legs that meet at a hub above her\"\n---\n");
  w("src/characters/syra.md", "---\ntitle: \"Syra\"\nspecies: Krenyi (Quiet-Built)\nimage: \"syra.jpg\"\n---\n");
  w("src/characters/toval.md", "---\ntitle: \"Toval\"\nspecies: Krenyi (Quiet-Built)\n---\n");
  w("src/characters/someone.md", "---\ntitle: \"Someone\"\nspecies: Human\nimage: \"someone.jpg\"\n---\n");
  w("src/images/characters/ulessa.jpg", "");
  w("src/images/characters/syra.jpg", "");
  return root;
}
const MNEMARI = {
  id: "mnemari", name: "Mnemari", page: "src/lore/mnemari.md", places: "mnemari", species: ["Mnemari"],
  frame: { name: "Endoskelia", evidence: ["src/lore/mnemari.md", "is filed in the frame Endoskelia, and is not on the human frame"] },
  design: {
    heading: "Mnemari — a body from Ilenne", scope: "body sheet",
    date: { text: "20 October 2026", quote: "The body (re-made 20 October 2026; proposed unless marked)" },
    body: "Three legs, so it stands on a stable triangle whatever the ground", colour: "deep ochre and russet across the body",
  },
  portraits: { ulessa: { check: "agrees", evidence: ["src/characters/ulessa.md", "standing on three tall arched legs that meet at a hub above her"] } },
};
const KRENYI = { id: "krenyi", name: "Krenyi", page: "src/lore/krenyi.md", places: "krenyi", species: ["Krenyi"], design: null, portraits: {} };
const OPTS = { placesRules: { mnemari: {}, krenyi: {} }, extraPages: [] };

test("a people is built from its design section, its frame and its characters", () => {
  const { data, failures, warnings } = build(fixture(), [MNEMARI, KRENYI], OPTS);
  assert.deepEqual(failures, []);
  assert.deepEqual(warnings, []);
  const m = data.peoples[0];
  assert.equal(m.status, STATUS.done);
  assert.equal(m.frame.name, "Endoskelia");
  assert.equal(m.design.body, "Three legs, so it stands on a stable triangle whatever the ground: three tall, thick, jointed legs rise from broad soft padded feet.");
  assert.match(m.design.colour, /deep ochre and russet/);
  assert.equal(m.characters[0].check, "agrees");
  assert.equal(m.characters[0].url, "/characters/ulessa/");
  assert.equal(m.page.picture.path, "src/images/lore/mnemari.jpg");
  const k = data.peoples[1];
  assert.equal(k.frame.name, "Endoskelia", "read from the taxonomy table by the page's link");
  assert.equal(k.status, STATUS.undesigned);
  assert.deepEqual(k.characters.map(c => [c.id, c.check]), [["syra", "no-design"], ["toval", "none"]]);
  assert.equal(data.counts.byStatus[STATUS.done], 1);
});

test("the same record builds the same data twice", () => {
  const root = fixture();
  assert.deepEqual(build(root, [MNEMARI, KRENYI], OPTS).data, build(root, [MNEMARI, KRENYI], OPTS).data);
});

test("a missing anchor, a missing heading, an unchecked portrait or an unlisted people is a failure", () => {
  const root = fixture();
  const gone = { ...MNEMARI, design: { ...MNEMARI.design, colour: "dun-grey felted hide" } };
  assert.ok(build(root, [gone, KRENYI], OPTS).failures.some(f => /colour anchor not found/.test(f)));
  const moved = { ...MNEMARI, design: { ...MNEMARI.design, heading: "Mnemari — a level-backed walker" } };
  assert.ok(build(root, [moved, KRENYI], OPTS).failures.some(f => /no heading starting/.test(f)));
  const unchecked = { ...MNEMARI, portraits: {} };
  assert.ok(build(root, [unchecked, KRENYI], OPTS).failures.some(f => /ulessa has no check in the rule table/.test(f)));
  assert.ok(build(root, [MNEMARI], OPTS).failures.some(f => /krenyi/.test(f)), "a people page with no row fails");
  const wrongFrame = { ...MNEMARI, page: "src/lore/krenyi.md", species: [], portraits: {}, design: null, frame: { name: "Trabeculata", evidence: ["src/lore/krenyi.md", "built on the human frame"] } };
  assert.ok(build(root, [wrongFrame, { ...KRENYI, id: "k2" }], OPTS).failures.some(f => /the taxonomy table Endoskelia/.test(f)));
});
