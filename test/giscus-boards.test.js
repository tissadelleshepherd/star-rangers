// Pins src/_data/giscus.js's two-level board model (Dermot's ruling,
// 2026-09-04: pick the comments board per page). The build's board is chosen
// as it always was - GISCUS_PROFILE, else giscus.local.json, else the default
// profile, with GISCUS_* env overrides on top - and `boards` carries one
// board per thread that names a `giscusProfile` in lib/storyline-threads.js,
// for .eleventy.js's `giscusBoard` to pick from per page. A fork's build
// (local file or explicit GISCUS_REPO*) gets no thread boards, because the
// registered profiles are this project's repos, not the fork's.
//
// Runs against the real thread registry: church-space naming the Communion's
// board is the documented decision, and a registry change that broke it
// should be noticed here.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const GISCUS_VARS = [
  "GISCUS_PROFILE", "GISCUS_REPO", "GISCUS_REPO_ID",
  "GISCUS_CATEGORY_CHARACTERS_ID", "GISCUS_CATEGORY_LORE_ID",
  "GISCUS_CATEGORY_EPISODES_ID", "GISCUS_CATEGORY_JOURNAL_ID"
];

// The data file is a function reading process.env at call time, so each test
// sets its own environment around one call and restores it after.
function giscusWith(env) {
  const saved = GISCUS_VARS.map((k) => [k, process.env[k]]);
  try {
    for (const k of GISCUS_VARS) delete process.env[k];
    for (const [k, v] of Object.entries(env || {})) process.env[k] = v;
    return require(path.join("..", "src", "_data", "giscus.js"))();
  } finally {
    for (const [k, v] of saved) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

const POOL = "Star-Rangers/sciencefiction-site-comments";
const COMMUNION = "Star-Rangers/churchspace-site-comments";

test("an unset build is the shared pool, and carries the Communion's board for the church-space thread", () => {
  const giscus = giscusWith({});
  assert.equal(giscus.repo, POOL);
  assert.deepEqual(Object.keys(giscus.boards), ["church-space"]);
  assert.equal(giscus.boards["church-space"].repo, COMMUNION);
  // Thread boards carry the same category shape the layout reads.
  assert.equal(giscus.boards["church-space"].categories.episodes.name, "Episodes Discussion");
  assert.ok(giscus.boards["church-space"].categories.episodes.id);
});

test("GISCUS_PROFILE=church-space still selects the Communion's board for the whole build", () => {
  const giscus = giscusWith({ GISCUS_PROFILE: "church-space" });
  assert.equal(giscus.repo, COMMUNION);
  // A registered build keeps its thread boards; here they coincide.
  assert.equal(giscus.boards["church-space"].repo, COMMUNION);
});

test("an unknown GISCUS_PROFILE fails the build loudly", () => {
  assert.throws(() => giscusWith({ GISCUS_PROFILE: "no-such-board" }), /unknown giscus profile "no-such-board"/);
});

test("a fork's explicit GISCUS_REPO gets no thread boards - every page posts to the fork's own board", () => {
  const giscus = giscusWith({ GISCUS_REPO: "someone/their-comments", GISCUS_REPO_ID: "R_x" });
  assert.equal(giscus.repo, "someone/their-comments");
  assert.deepEqual(giscus.boards, {});
});

test("env overrides apply to the build's board only, never to a thread's", () => {
  const giscus = giscusWith({ GISCUS_PROFILE: "default", GISCUS_CATEGORY_LORE_ID: "DIC_override" });
  assert.equal(giscus.categories.lore.id, "DIC_override");
  assert.notEqual(giscus.boards["church-space"].categories.lore.id, "DIC_override");
});
