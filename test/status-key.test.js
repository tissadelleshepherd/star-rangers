// Pins lib/status-key.js: the head clause of a character's status, slugified,
// is the badge's class-name key. The three shapes the corpus actually uses -
// one word, two words, a clause with a qualification after an em dash - and
// the invariant that the single-word statuses keep the class names they had
// before the helper existed, so no existing badge rule silently unmatches.
const test = require("node:test");
const assert = require("node:assert/strict");
const { statusKey } = require("../lib/status-key");

test("single-word statuses keep their old lowercase class key", () => {
  for (const s of ["Active", "Historical", "Retired", "Unknown"]) {
    assert.equal(statusKey(s), s.toLowerCase());
  }
});

test("a two-word status is hyphenated", () => {
  assert.equal(statusKey("At large"), "at-large");
});

test("a qualified status keys on its head clause only", () => {
  assert.equal(
    statusKey("Contained — Survey Corps custody, jurisdiction formally disputed"),
    "contained"
  );
  assert.equal(statusKey("Contained: pending"), "contained");
  assert.equal(statusKey("Missing (presumed)"), "missing");
  assert.equal(statusKey("Retired; reserve list"), "retired");
});

test("stray punctuation and case never leak into the key", () => {
  assert.equal(statusKey("  At  Large!  "), "at-large");
  assert.equal(statusKey(""), "");
  assert.equal(statusKey(undefined), "");
});
