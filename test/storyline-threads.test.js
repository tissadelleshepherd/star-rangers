// Pins lib/storyline-threads.js: threadForSeason is the canonical
// season→thread lookup consumed by both the /threads/ site section and the
// deploy-time filter, and the registry's shape carries the tier gate's
// assumptions (a season claimed by two threads, a gated thread naming a tier
// off the ladder, or one without a homeDomain, would misroute content or
// excluded-page placeholders with no build failure).
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  STORYLINE_THREADS,
  UNSORTED_THREAD,
  DEFAULT_REFERENCE_DOMAIN,
  threadForSeason
} = require("../lib/storyline-threads");
const { TIER_ORDER } = require("../lib/editions");

test("every registered season resolves to its own thread", () => {
  for (const thread of STORYLINE_THREADS) {
    for (const season of thread.seasons) {
      assert.equal(threadForSeason(season).id, thread.id, `season ${season}`);
    }
  }
});

test("an unclaimed season falls back to the unsorted thread, not a crash", () => {
  assert.equal(threadForSeason(99).id, UNSORTED_THREAD.id);
  assert.equal(threadForSeason(-1).id, UNSORTED_THREAD.id);
  assert.equal(threadForSeason(undefined).id, UNSORTED_THREAD.id);
});

test("season numbers are matched numerically, string input included", () => {
  // Front matter and template plumbing can hand the season over as a string.
  const numeric = threadForSeason(8).id;
  assert.equal(threadForSeason("8").id, numeric);
});

test("no season is claimed by two threads", () => {
  const seen = new Map();
  for (const thread of STORYLINE_THREADS) {
    for (const season of thread.seasons) {
      assert.ok(
        !seen.has(season),
        `season ${season} claimed by both ${seen.get(season)} and ${thread.id}`
      );
      seen.set(season, thread.id);
    }
  }
});

test("thread ids are unique", () => {
  const ids = STORYLINE_THREADS.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("no thread carries the retired `private` flag - tier gating replaced it on 2026-09-04", () => {
  for (const thread of STORYLINE_THREADS) {
    assert.equal(thread.private, undefined, `${thread.id} still sets private; use tier instead`);
  }
});

test("every tier-gated thread names a tier on the ladder and a homeDomain for its excluded-page placeholder", () => {
  for (const thread of STORYLINE_THREADS) {
    if (!thread.tier) continue;
    assert.ok(TIER_ORDER.includes(thread.tier), `${thread.id} names tier "${thread.tier}", not one of ${TIER_ORDER.join(", ")}`);
    assert.ok(thread.homeDomain, `${thread.id} is tier-gated but has no homeDomain`);
    // The point of homeDomain is to escape the self-referential loop the
    // default reference domain (a general-tier build) would create - so it
    // must differ from it.
    assert.notEqual(thread.homeDomain, DEFAULT_REFERENCE_DOMAIN, thread.id);
  }
});

test("church-space is gated to the contemplative tier - the one gated thread, by documented decision", () => {
  const gated = STORYLINE_THREADS.filter((t) => t.tier);
  assert.deepEqual(gated.map((t) => t.id), ["church-space"]);
  assert.equal(gated[0].tier, "contemplative");
});
