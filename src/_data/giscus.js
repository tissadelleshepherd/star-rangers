const fs = require("fs");
const path = require("path");
const { STORYLINE_THREADS } = require("../../lib/storyline-threads");

// Config for the giscus comment widget (see src/_includes/base.njk), which
// stores every page's comment thread as a GitHub Discussion. Deliberately
// points at a separate, public comments-only repo rather than this source
// repo, so reader/fan discussion never mixes with dev-facing Discussions
// here and stays stable across any rename/fork/transfer of this repo.
// giscus needs the numeric repo/category IDs (not just names) - get them by
// installing the giscus app on that repo and running its config wizard at
// https://giscus.app, then paste the generated data-repo-id/data-category-id
// pairs in below. See TECHNICAL-README.md's "Discussion forum" section for the full
// category setup this maps onto.
//
// WHICH BOARD A PAGE POSTS TO - two levels, and the page's own wins:
//
//   THE BUILD'S BOARD is what this file returns at the top level (repo,
//   repoId, categories): one board for the whole build, chosen as below.
//   Every page uses it unless the page belongs to a thread with a board of
//   its own.
//
//   A THREAD'S BOARD (`boards`, keyed by thread id) comes from a
//   `giscusProfile` on the thread in lib/storyline-threads.js, and a page in
//   that thread uses it on WHICHEVER domain renders the page. This is Dermot's
//   ruling of 2026-09-04 ("pick the board per page"): the church-space thread
//   posts to the Communion's board everywhere, and everything else on a
//   contemplative edition posts to the shared pool like the general and
//   young-adult tiers do, so a shared chapter carries ONE conversation across
//   every tier that shows it. Until then the board was chosen per build
//   (`giscusProfile` on the edition), which split the conversation the day the
//   tier ladder gave the contemplative editions the main sequence. Resolved per
//   page by .eleventy.js's `giscusBoard`, which the layout reads.
//
// HOW THE BUILD'S BOARD IS CHOSEN. Two mechanisms let a cPanel clone point at
// a DIFFERENT board than the shared default:
//
//   1. GISCUS_PROFILE=<name> selects one of the project's OWN registered
//      comment repos below (GISCUS_PROFILES) with a single key - so a
//      deploy.conf doesn't have to paste all six repo/category IDs. Since the
//      per-page ruling none of the project's own domains needs it: the
//      registry leaves every edition's `giscusProfile` empty and the
//      Communion's board is reached through its thread. It remains for an
//      edition that wants a whole board of its own.
//   2. GISCUS_REPO/GISCUS_REPO_ID/GISCUS_CATEGORY_{CHARACTERS,LORE,EPISODES,
//      JOURNAL}_ID set a repo explicitly. This is the escape hatch for a
//      THIRD-PARTY FORK pointing at its OWN comments repo (one that isn't a
//      registered profile here) - each key overrides just the matching field
//      of the selected profile, so a fork can also start from a profile and
//      change only what differs.
//
// A FORK'S BOARD IS THE WHOLE STORY FOR A FORK. Thread boards name THIS
// project's repos, which are not a fork's to post into, so they apply only
// when the build's board is itself one of the registered profiles: a build
// on giscus.local.json or on explicit GISCUS_REPO* keys gets `boards: {}`
// and every page, church-space included, posts to the fork's own board.
//
// scripts/cpanel-deploy.sh exports all of these from deploy.conf the same way
// it does THEME/SITE_NAME/etc (see that script and sample-deploy.conf). Every
// clone left fully unset shares the one default board, which is what keeps
// community discussion in one place.

// The project's own official comment repos, keyed by profile name. A fork
// adding its own board can register it here too (then select it with
// GISCUS_PROFILE), or just use the explicit GISCUS_REPO/* keys above.
const GISCUS_PROFILES = {
  // The shared pool: every domain's build board since 2026-09-04 -
  // fianilchruinne.com, sciencefiction.site, starquest.site,
  // young.fianilchruinne.com, and the contemplative editions too.
  default: {
    repo: "Star-Rangers/sciencefiction-site-comments",
    repoId: "R_kgDOTXRNGg",
    categories: {
      characters: "DIC_kwDOTXRNGs4DBHee",
      lore: "DIC_kwDOTXRNGs4DBIwv",
      episodes: "DIC_kwDOTXRNGs4DBIw2",
      journal: "DIC_kwDOTXRNGs4DBMgM"
    }
  },
  // The Communion's board: every page of the church-space thread, on any
  // domain that renders it (the thread names this profile in
  // lib/storyline-threads.js). No longer any domain's build board.
  "church-space": {
    repo: "Star-Rangers/churchspace-site-comments",
    repoId: "R_kgDOTX8w3A",
    categories: {
      characters: "DIC_kwDOTX8w3M4DBNUs",
      lore: "DIC_kwDOTX8w3M4DBNU7",
      episodes: "DIC_kwDOTX8w3M4DBNU0",
      journal: "DIC_kwDOTX8w3M4DBMgc"
    }
  }
};

const CATEGORY_LABELS = {
  characters: "Characters",
  lore: "Lore & Worldbuilding",
  episodes: "Episodes Discussion",
  journal: "Journal"
};

// A THIRD-PARTY FORK can point comments at its own repo WITHOUT editing this
// (engine) file or running the fetch script that patches it: drop an untracked
// giscus.local.json in the repo root (copy sample-giscus.local.json, fill in
// your repo + IDs). It's read here if present and becomes the fork's default
// board across every build path - `npm start`, GitHub Pages, and any cPanel
// deploy that doesn't select a GISCUS_PROFILE - the same "untracked local file
// + tracked sample" pattern as deploy.conf. It's gitignored, so a fork's own
// comment-repo settings never collide with an upstream merge. Precedence:
// GISCUS_PROFILE (a registered profile) wins if set, else this local file, else
// the built-in default profile; individual GISCUS_* env vars still override
// single fields on top of whichever base is chosen.
const LOCAL_CONFIG_PATH = path.join(__dirname, "..", "..", "giscus.local.json");

function loadLocalProfile() {
  let raw;
  try {
    raw = fs.readFileSync(LOCAL_CONFIG_PATH, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") return null; // absent is the normal case
    throw err;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`giscus.js: giscus.local.json is not valid JSON - ${err.message}`);
  }
  const cats = parsed.categories || {};
  const missing = ["repo", "repoId"].filter((k) => !parsed[k])
    .concat(["characters", "lore", "episodes", "journal"].filter((k) => !cats[k]).map((k) => `categories.${k}`));
  if (missing.length) {
    throw new Error(
      `giscus.js: giscus.local.json is missing required field(s): ${missing.join(", ")}. ` +
      `See sample-giscus.local.json for the expected shape.`
    );
  }
  return {
    repo: parsed.repo,
    repoId: parsed.repoId,
    categories: {
      characters: cats.characters,
      lore: cats.lore,
      episodes: cats.episodes,
      journal: cats.journal
    }
  };
}

// The shape the layout reads: repo, repoId, and categories with their display
// names alongside the ids. `overrides` is the env for the build's board and
// empty for a thread's board - a thread's board is the registered profile
// verbatim, since the GISCUS_* keys describe the clone's own board, not the
// Communion's.
function boardFrom(profile, overrides) {
  const env = overrides || {};
  return {
    repo: env.GISCUS_REPO || profile.repo,
    repoId: env.GISCUS_REPO_ID || profile.repoId,
    categories: {
      characters: { name: CATEGORY_LABELS.characters, id: env.GISCUS_CATEGORY_CHARACTERS_ID || profile.categories.characters },
      lore: { name: CATEGORY_LABELS.lore, id: env.GISCUS_CATEGORY_LORE_ID || profile.categories.lore },
      episodes: { name: CATEGORY_LABELS.episodes, id: env.GISCUS_CATEGORY_EPISODES_ID || profile.categories.episodes },
      journal: { name: CATEGORY_LABELS.journal, id: env.GISCUS_CATEGORY_JOURNAL_ID || profile.categories.journal }
    }
  };
}

function assertRegistered(name, where) {
  if (!Object.prototype.hasOwnProperty.call(GISCUS_PROFILES, name)) {
    throw new Error(
      `giscus.js: unknown giscus profile "${name}" (${where}) - registered profiles: ` +
      `${Object.keys(GISCUS_PROFILES).join(", ")}. For a repo that isn't a registered ` +
      `profile, set GISCUS_REPO/GISCUS_REPO_ID/GISCUS_CATEGORY_*_ID explicitly instead.`
    );
  }
}

module.exports = function () {
  const profileName = process.env.GISCUS_PROFILE;
  // An unknown profile name is almost certainly a deploy.conf typo - fail the
  // build loudly rather than silently falling back to the default board (which
  // would quietly route a whole domain's comments to the wrong repo). Same
  // loud-failure spirit as cpanel-deploy.sh's other checks.
  if (profileName) assertRegistered(profileName, "GISCUS_PROFILE");
  const local = profileName ? null : loadLocalProfile();
  const profile = profileName ? GISCUS_PROFILES[profileName] : (local || GISCUS_PROFILES.default);
  const build = boardFrom(profile, process.env);

  // Thread boards apply only on a build whose own board is a registered
  // profile (see A FORK'S BOARD IS THE WHOLE STORY FOR A FORK above).
  const registeredBuild = !local && !process.env.GISCUS_REPO && !process.env.GISCUS_REPO_ID;
  const boards = {};
  if (registeredBuild) {
    for (const thread of STORYLINE_THREADS) {
      if (!thread.giscusProfile) continue;
      assertRegistered(thread.giscusProfile, `thread "${thread.id}" in lib/storyline-threads.js`);
      boards[thread.id] = boardFrom(GISCUS_PROFILES[thread.giscusProfile], null);
    }
  }

  return { ...build, boards };
};
