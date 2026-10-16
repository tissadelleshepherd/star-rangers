#!/usr/bin/env node
/**
 * Asserts that the changelog still contains every release it is supposed to.
 * "The changelog" is CHANGELOG.md plus its archive in changelog/ (released
 * sections moved there verbatim on 2026-10-15), read through
 * lib/changelog-files.js, so a section moved into the archive still counts and
 * one lost on the way still fails.
 *
 * WHY THIS EXISTS: released sections have been silently destroyed twice. A
 * branch is cut, `main` gets a release while the branch is open, and the
 * branch's CHANGELOG.md is then written from a stale base - re-emitting the
 * released sections as they stood *before* the release and taking the newest
 * headings with them. `## [1.17.0]` and `## [1.18.0]` both went that way and
 * were only noticed weeks later, because nothing failed. The build passed, the
 * tests passed, the site rendered. A silent loss of history is the worst shape
 * a bug can take, and a paragraph in CLAUDE.md asking people to be careful had
 * already failed at it twice.
 *
 * THE ORACLE IS GIT TAGS, not another copy of the file. Tags are immutable,
 * live outside the working tree, and cannot be clobbered by a bad merge - so
 * `v1.17.0` existing while `## [1.17.0]` does not is decisive evidence, with no
 * base commit to compare against and no guessing.
 *
 * Tags are a SUBSET of releases, deliberately: 1.1.0 through 1.4.0 predate
 * tagging and have headings but no tags. So this checks one direction only -
 * every tag needs a heading. A heading with no tag is fine and always has been.
 *
 * Run from `npm test`, so a branch that loses history fails CI instead of
 * merging quietly.
 */

const path = require("path");
const { execFileSync } = require("child_process");
const { readChangelog } = require("../lib/changelog-files");

const ROOT = path.resolve(__dirname, "..");

const HEADING = /^## \[(\d+\.\d+\.\d+)\]/gm;

function fail(lines) {
  console.error("Changelog check FAILED\n");
  for (const l of lines) console.error(`  ${l}`);
  console.error("");
  process.exit(1);
}

const text = readChangelog();

const headings = [];
for (const m of text.matchAll(HEADING)) headings.push(m[1]);

if (headings.length === 0) {
  fail([
    "No `## [X.Y.Z]` headings found at all.",
    "Either the file was truncated, or the heading format changed and this",
    "check can no longer see it. Fix the file or retire the check - a check",
    "that silently passes once its anchor moves is worse than no check.",
  ]);
}

const problems = [];

// 1. Duplicate headings. Two sections claiming one version means one of them
//    is mislabelled, and the changelog stops being a record of what shipped.
const seen = new Map();
for (const v of headings) seen.set(v, (seen.get(v) || 0) + 1);
for (const [v, n] of seen) {
  if (n > 1) problems.push(`[${v}] appears ${n} times - one of them is mislabelled.`);
}

// 2. Every tag must still have a section.
let tags = [];
try {
  tags = execFileSync("git", ["tag", "--list", "v*"], { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .map((t) => t.trim().replace(/^v/, ""))
    .filter((t) => /^\d+\.\d+\.\d+$/.test(t));
} catch {
  // No git, or no tags fetched (a shallow CI clone). Not a failure: the
  // duplicate and ordering checks above and below still ran and still mean
  // something. Say so rather than passing silently.
  console.log("Changelog check: git tags unavailable, checked structure only.");
}

const missing = tags.filter((t) => !seen.has(t));
if (missing.length) {
  problems.push(
    `Tagged releases with no section: ${missing.map((v) => `[${v}]`).join(", ")}.`,
    "This is the failure this check exists for - a branch written from a stale",
    "base has dropped released history. Recover those sections from git rather",
    "than rewriting them from memory.",
  );
}

// 3. Descending order. Not fatal on its own, but a section in the wrong place
//    is how a mislabelled heading hides in plain sight.
const cmp = (a, b) => {
  const A = a.split(".").map(Number);
  const B = b.split(".").map(Number);
  return A[0] - B[0] || A[1] - B[1] || A[2] - B[2];
};
for (let i = 1; i < headings.length; i++) {
  if (cmp(headings[i - 1], headings[i]) < 0) {
    problems.push(`[${headings[i - 1]}] appears above [${headings[i]}] - newest should be first.`);
  }
}

if (problems.length) fail(problems);

console.log(
  `Changelog check passed (${headings.length} released sections, ` +
    `${tags.length} tags, newest [${headings[0]}]).`,
);
