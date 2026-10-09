// Pins lib/season-portraits.js, the season pages' portrait strip. The rules
// worth pinning: a frame is on a season page only because its author keyed
// it there (`image_season` on the header, `season` on a gallery item); the
// strip is built from the collection it is handed, so an excluded character
// cannot leak a portrait onto a season page; placeholder cards are dropped;
// and the order is deterministic.
const test = require("node:test");
const assert = require("node:assert/strict");

const { seasonPortraits, normaliseSeason } = require("../lib/season-portraits");

const tissadelle = {
  url: "/characters/tissadelle-shepherd/",
  data: {
    id: "tissadelle",
    title: "Tissadelle Shepherd",
    image: "tissadelle-shepherd.jpg",
    image_alt: "Header alt",
    image_season: 5,
    image_caption: "Season 5 — Line Captain",
    gallery: [
      { image: "season-1-cadet.jpg", caption: "Season 1 — Cadet", season: 1, image_alt: "Cadet alt" },
      { image: "field-01.jpg" } // uncaptioned, unkeyed: never on a season page
    ]
  }
};

const aldera = {
  url: "/characters/aldera/",
  data: { id: "aldera", title: "Aldera", image: "aldera.jpg", gallery: [{ image: "field-photo-01.jpg" }] }
};

test("a header portrait keyed with image_season appears on that season only", () => {
  const s5 = seasonPortraits([tissadelle, aldera], 5);
  assert.deepEqual(s5, [{
    id: "tissadelle",
    title: "Tissadelle Shepherd",
    url: "/characters/tissadelle-shepherd/",
    src: "/star-rangers/images/characters/tissadelle-shepherd.jpg",
    alt: "Header alt",
    caption: "Season 5 — Line Captain"
  }]);
  assert.deepEqual(seasonPortraits([tissadelle, aldera], 3), []);
});

test("a gallery frame keyed with season appears on that season, with its caption, under the character's directory", () => {
  const s1 = seasonPortraits([tissadelle, aldera], "1"); // season pages pass a string
  assert.equal(s1.length, 1);
  assert.equal(s1[0].src, "/star-rangers/images/characters/tissadelle/season-1-cadet.jpg");
  assert.equal(s1[0].caption, "Season 1 — Cadet");
  assert.equal(s1[0].alt, "Cadet alt");
});

test("unkeyed frames never surface, however many a character carries", () => {
  for (const season of [0, 1, 2, 5, 13]) {
    assert.equal(seasonPortraits([aldera], season).length, 0);
  }
});

test("the strip is built only from the characters it is handed", () => {
  // The caller passes the build's own narrowed collection; a character the
  // edition excludes is simply not in it, and so cannot leak a portrait.
  assert.deepEqual(seasonPortraits([aldera], 5), []);
  assert.deepEqual(seasonPortraits([], 5), []);
  assert.deepEqual(seasonPortraits(undefined, 5), []);
});

test("placeholder cards are dropped by the injected predicate, header and gallery alike", () => {
  const isPlaceholder = (rel) => rel === "tissadelle-shepherd.jpg" || rel === "tissadelle/season-1-cadet.jpg";
  assert.deepEqual(seasonPortraits([tissadelle], 5, { isPlaceholder }), []);
  assert.deepEqual(seasonPortraits([tissadelle], 1, { isPlaceholder }), []);
  // The predicate sees the path below images/characters/, so it can be
  // joined onto the real directory by the caller.
  const seen = [];
  seasonPortraits([tissadelle], 1, { isPlaceholder: (rel) => { seen.push(rel); return false; } });
  assert.deepEqual(seen, ["tissadelle/season-1-cadet.jpg"]);
});

test("a nonsense season number yields nothing rather than everything", () => {
  assert.deepEqual(seasonPortraits([tissadelle], "all"), []);
  assert.deepEqual(seasonPortraits([tissadelle], -1), []);
  assert.deepEqual(seasonPortraits([tissadelle], undefined), []);
  assert.equal(normaliseSeason("05"), 5);
  assert.equal(normaliseSeason(""), null);
  assert.equal(normaliseSeason("1.5"), null);
});

test("order is by character id, then header before gallery, whatever order the collection arrives in", () => {
  const b = { url: "/characters/b/", data: { id: "b", title: "B", image: "b.jpg", image_season: 2,
    gallery: [{ image: "z.jpg", season: 2 }, { image: "a.jpg", season: 2 }] } };
  const a = { url: "/characters/a/", data: { id: "a", title: "A", image: "a.jpg", image_season: 2 } };
  const srcs = seasonPortraits([b, a], 2).map((p) => p.src.replace("/star-rangers/images/characters/", ""));
  assert.deepEqual(srcs, ["a.jpg", "b.jpg", "b/a.jpg", "b/z.jpg"]);
});

test("a header portrait with no image_caption carries a null caption, not the role or anything derived", () => {
  const c = { url: "/characters/c/", data: { id: "c", title: "Cee", role: "Line Captain", image: "c.jpg", image_season: 2 } };
  assert.equal(seasonPortraits([c], 2)[0].caption, null);
});

test("a frame with no alt falls back to the character's title", () => {
  const c = { url: "/characters/c/", data: { id: "c", title: "Cee", image: "c.jpg", image_season: 1,
    gallery: [{ image: "g.jpg", season: 1 }] } };
  assert.deepEqual(seasonPortraits([c], 1).map((p) => p.alt), ["Cee", "Cee"]);
});
