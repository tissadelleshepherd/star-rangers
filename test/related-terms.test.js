// Pins lib/related-terms.js, the resolver behind the glossary layout's
// Related Terms list. Its contract is "null rather than the index": a
// `related:` term resolves by exact title against the collections THIS
// BUILD carries, glossary first, then lore, and a term whose page is not
// in them (excluded on a narrowed edition, or retitled on the full one)
// comes back null, so the layout can leave it out instead of linking every
// miss to /glossary/ - which is what undercover-pets.com's one glossary
// entry did for all five of its related terms until 2026-10-04.
const test = require("node:test");
const assert = require("node:assert/strict");

const { resolveRelatedTerm, resolvedRelatedTerms } = require("../lib/related-terms");

const page = (title, url) => ({ data: { title }, url });

const glossary = [page("Smart Pet", "/glossary/smart-pet/"), page("Cyborg", "/glossary/cyborg/")];
const lore = [page("The AI Safety Kernel", "/lore/ai-safety-kernel/")];

test("resolves a glossary title to its page url", () => {
  assert.equal(resolveRelatedTerm("Cyborg", glossary, lore), "/glossary/cyborg/");
});

test("falls through to lore when the glossary has no such title", () => {
  assert.equal(resolveRelatedTerm("The AI Safety Kernel", glossary, lore), "/lore/ai-safety-kernel/");
});

test("glossary wins when both collections carry the title", () => {
  const twice = [page("Cyborg", "/lore/cyborg/")];
  assert.equal(resolveRelatedTerm("Cyborg", glossary, twice), "/glossary/cyborg/");
});

test("a term with no page on this build is null, never the glossary index", () => {
  assert.equal(resolveRelatedTerm("Krenyi", glossary, lore), null);
});

test("matching is exact: case, punctuation and leading articles included", () => {
  assert.equal(resolveRelatedTerm("cyborg", glossary, lore), null);
  assert.equal(resolveRelatedTerm("AI Safety Kernel", glossary, lore), null);
});

test("empty, missing or malformed inputs are null, not a crash", () => {
  assert.equal(resolveRelatedTerm("", glossary, lore), null);
  assert.equal(resolveRelatedTerm(undefined, glossary, lore), null);
  assert.equal(resolveRelatedTerm("Cyborg", undefined, undefined), null);
  assert.equal(resolveRelatedTerm("Cyborg", [null, {}], [{ data: {} }]), null);
});

test("a narrowed build drops the excluded terms and keeps the order of the rest", () => {
  // undercover-pets.com carries Smart Pet and nothing else from the glossary
  // or lore: every related term on it used to link to /glossary/.
  const narrowedGlossary = [page("Smart Pet", "/glossary/smart-pet/")];
  const related = ["The AI Safety Kernel", "Kernel-Compliant", "Cyborg", "Krenyi", "Heritable Modification Protocols"];
  assert.deepEqual(resolvedRelatedTerms(related, narrowedGlossary, []), []);

  const fuller = [...narrowedGlossary, page("Krenyi", "/lore/krenyi/"), page("Cyborg", "/glossary/cyborg/")];
  assert.deepEqual(resolvedRelatedTerms(related, fuller, []), [
    { term: "Cyborg", url: "/glossary/cyborg/" },
    { term: "Krenyi", url: "/lore/krenyi/" }
  ]);
});

test("resolvedRelatedTerms tolerates a missing related list", () => {
  assert.deepEqual(resolvedRelatedTerms(undefined, glossary, lore), []);
  assert.deepEqual(resolvedRelatedTerms("Cyborg", glossary, lore), []);
});
