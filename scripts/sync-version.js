#!/usr/bin/env node
/**
 * Keeps README.md's "Current version" line in step with package.json.
 *
 * That line has gone stale four times now (it read 1.5.0 through both the
 * 1.6.0 and 1.7.0 releases, and 1.10.0 through 1.11.0, 1.12.0 and 1.13.0),
 * despite the release checklist calling it out as "the step that gets
 * missed". A checklist item that has been missed that often is not a
 * discipline problem, so this replaces the manual step:
 *
 *   node scripts/sync-version.js           rewrite README to match package.json
 *   node scripts/sync-version.js --check   exit non-zero if they disagree
 *
 * The write mode runs automatically from npm's `version` lifecycle hook, so
 * `npm version X.Y.Z` (step 1 of the release checklist) updates the README
 * as a side effect. The check mode runs from `npm test`, so a version edited
 * by hand - bypassing `npm version` entirely - still fails CI rather than
 * shipping a stale line.
 *
 * Deliberately NOT a VERSION.md: nothing in the repo reads a version file,
 * and a dedicated one would be a third copy of a number that already lives
 * in package.json and CHANGELOG.md (whose archive in changelog/ holds only
 * released versions, never the current one). The fix for a duplicated value is to
 * stop duplicating it by hand, not to add somewhere else for it to drift.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const README = path.join(ROOT, "README.md");

// Matches: Current version: **1.13.0**.
// The bolded number is the only capture; everything after it is left alone.
const VERSION_LINE = /^(Current version: \*\*)(\d+\.\d+\.\d+)(\*\*)/m;

function fail(message) {
  console.error(`sync-version: ${message}`);
  process.exit(1);
}

const check = process.argv.includes("--check");

const { version } = JSON.parse(
  fs.readFileSync(path.join(ROOT, "package.json"), "utf8")
);
if (!version) fail("package.json has no version field.");

const readme = fs.readFileSync(README, "utf8");
const match = readme.match(VERSION_LINE);

// A check that silently passes when its anchor disappears is worse than no
// check, because the failure is invisible. If the line has been reworded or
// removed, say so and fail in both modes rather than assuming it's fine.
if (!match) {
  fail(
    'README.md has no "Current version: **X.Y.Z**" line.\n' +
      "  Either restore it, or delete this script and its npm hooks together —\n" +
      "  do not leave the check in place with nothing to check."
  );
}

const readmeVersion = match[2];

if (check) {
  if (readmeVersion !== version) {
    fail(
      `README.md says ${readmeVersion}, package.json says ${version}.\n` +
        "  Run: node scripts/sync-version.js\n" +
        "  (or bump with `npm version X.Y.Z --no-git-tag-version`, which runs it for you)"
    );
  }
  console.log(`Version check passed (README and package.json both ${version}).`);
  process.exit(0);
}

if (readmeVersion === version) {
  console.log(`README.md already at ${version}; nothing to do.`);
  process.exit(0);
}

fs.writeFileSync(README, readme.replace(VERSION_LINE, `$1${version}$3`));
console.log(`README.md: ${readmeVersion} -> ${version}`);
