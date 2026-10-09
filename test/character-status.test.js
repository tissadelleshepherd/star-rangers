// Pins the character `status` vocabulary in lib/content-schema.js: the five
// statuses the corpus uses, keyed the way the badge keys them (head clause,
// slugified - lib/status-key.js), so a qualified value is accepted on its
// head clause and anything outside the five is refused by name. The field
// stays optional, so absence is not a problem.
const test = require("node:test");
const assert = require("node:assert/strict");
const { CHARACTER_STATUSES, characterStatusProblem } = require("../lib/content-schema");
const { statusKey } = require("../lib/status-key");

test("the vocabulary is exactly the five statuses, keyed by their own head clause", () => {
  assert.deepEqual(Object.keys(CHARACTER_STATUSES).sort(), ["active", "at-large", "contained", "historical", "retired"]);
  for (const [key, { label, meaning }] of Object.entries(CHARACTER_STATUSES)) {
    assert.equal(statusKey(label), key, `${label} must key to ${key}`);
    assert.ok(meaning && meaning.length > 10, `${label} needs a stated meaning`);
  }
});

test("each plain label is accepted, as is a qualified one on its head clause", () => {
  for (const { label } of Object.values(CHARACTER_STATUSES)) {
    assert.equal(characterStatusProblem(label), null);
  }
  assert.equal(characterStatusProblem("Contained — Survey Corps custody, jurisdiction formally disputed"), null);
  assert.equal(characterStatusProblem("Retired; reserve list"), null);
});

test("an absent status is not a problem - the field is optional", () => {
  assert.equal(characterStatusProblem(undefined), null);
  assert.equal(characterStatusProblem(null), null);
  assert.equal(characterStatusProblem(""), null);
});

test("a value outside the five is refused and the message names them", () => {
  for (const bad of ["Unknown", "Missing (presumed)", "Deceased", "active service"]) {
    const problem = characterStatusProblem(bad);
    assert.ok(problem, `${bad} should be refused`);
    assert.match(problem, /"Active", "Historical", "Retired", "At large", "Contained"/);
  }
});
