#!/usr/bin/env node
/**
 * Regenerates README.md's "The story so far" table from the repository
 * itself, so the table is right at every release instead of whenever
 * somebody remembers it.
 *
 * The table listed four threads with July's chapter counts until 8 October
 * 2026, when Dermot asked whether it should include the latest seasons. His
 * direction the same day - "update the seasons directory with each new
 * release version" - makes the refresh part of the version bump: the
 * `version` lifecycle hook runs this script after sync-version.js, so
 * `npm version X.Y.Z` (step 1 of the release checklist) rewrites the table
 * as a side effect, the same way it rewrites the "Current version" line.
 *
 *   node scripts/sync-story-so-far.js           rewrite the table from src/seasons/ and lib/storyline-threads.js
 *   node scripts/sync-story-so-far.js --check   exit non-zero if the table's stamp disagrees with package.json
 *
 * What is derived and what is authored. The thread list, its order and each
 * thread's seasons come from lib/storyline-threads.js, the single registry.
 * Chapter counts come from the chapter files under src/seasons/ (one
 * sNNeNNcNN.md per chapter). The "What it is" column is authored: the
 * script keeps whatever the table already says for a thread, by name, and
 * only for a thread with no row yet falls back to the first sentence of the
 * registry's description, so a new thread appears at the next bump with a
 * line that can then be edited by hand and will be kept.
 *
 * The check mode is deliberately narrow. It does not compare counts with the
 * working tree, because a chapter merged between releases would then fail
 * every PR until the next bump, and the direction was per release, not per
 * chapter. It checks that the table was regenerated at the current version
 * (the stamp line names it) and that the anchors are still there. As with
 * sync-version.js, a missing anchor fails loudly in both modes rather than
 * passing on a block the script can no longer find.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { STORYLINE_THREADS } = require("../lib/storyline-threads");

const ROOT = path.join(__dirname, "..");
const README = path.join(ROOT, "README.md");
const SEASONS_DIR = path.join(ROOT, "src", "seasons");

const BEGIN = "<!-- story-so-far:begin -->";
const END = "<!-- story-so-far:end -->";
const CHAPTER_FILE = /^s(\d\d)e\d\dc\d\d\.md$/;
const SEASON_DIR = /^s(\d\d)$/;
const STAMP_LINE = /^Chapter counts as of .+? \(version (\d+\.\d+\.\d+)\)/m;

function fail(message) {
  console.error(`sync-story-so-far: ${message}`);
  process.exit(1);
}

// Chapter files per season number, counted from the tree: a chapter is one
// sNNeNNcNN.md under src/seasons/sNN/, whatever episode it sits in.
function countChapters(seasonsDir = SEASONS_DIR) {
  const counts = new Map();
  if (!fs.existsSync(seasonsDir)) return counts;
  for (const season of fs.readdirSync(seasonsDir)) {
    const m = season.match(SEASON_DIR);
    if (!m) continue;
    const n = Number(m[1]);
    let count = 0;
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (CHAPTER_FILE.test(entry.name)) count += 1;
      }
    };
    walk(path.join(seasonsDir, season));
    counts.set(n, count);
  }
  return counts;
}

// [1, 3, 5, 6, 7] -> "1, 3, 5–7": consecutive runs of three or more collapse
// to a range; a pair stays as two numbers.
function formatSeasons(seasons) {
  const sorted = [...seasons].sort((a, b) => a - b);
  const parts = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j += 1;
    if (j - i >= 2) parts.push(`${sorted[i]}–${sorted[j]}`);
    else for (let k = i; k <= j; k += 1) parts.push(String(sorted[k]));
    i = j + 1;
  }
  return parts.join(", ");
}

function firstSentence(text) {
  const m = String(text).match(/^(.+?[.!?])(\s|$)/);
  return (m ? m[1] : String(text)).trim();
}

// The authored column, read back from the table as it stands, keyed by the
// bold thread name in the first cell.
function existingDescriptions(block) {
  const out = new Map();
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|[^|]*\|[^|]*\|\s*(.+?)\s*\|\s*$/);
    if (m) out.set(m[1], m[2]);
  }
  return out;
}

function fallbackDescription(thread) {
  let line = firstSentence(thread.description || "");
  if (thread.tier) {
    line += ` An overlay for the ${thread.tier} reading tier, absent from the general-tier site.`;
  }
  return line;
}

function renderRows(threads, counts, descriptions) {
  const rows = threads.map((t) => {
    const chapters = t.seasons.reduce((sum, s) => sum + (counts.get(s) || 0), 0);
    const what = descriptions.get(t.name) || fallbackDescription(t);
    return `| **${t.name}** | ${formatSeasons(t.seasons)} | ${chapters} | ${what} |`;
  });
  return ["| Thread | Seasons | Chapters | What it is |", "|---|---|---|---|", ...rows].join("\n");
}

function stampLine(version, date) {
  return `Chapter counts as of ${date} (version ${version}); regenerated by \`scripts/sync-story-so-far.js\` at every version bump, and the seasons index on the site is always current.`;
}

function render(threads, counts, descriptions, version, date) {
  return `${BEGIN}\n${renderRows(threads, counts, descriptions)}\n\n${stampLine(version, date)}\n${END}`;
}

function longDate(d = new Date()) {
  return d.toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" });
}

function main() {
  const check = process.argv.includes("--check");
  const { version } = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  if (!version) fail("package.json has no version field.");

  const readme = fs.readFileSync(README, "utf8");
  const begin = readme.indexOf(BEGIN);
  const end = readme.indexOf(END);
  if (begin < 0 || end < 0 || end < begin) {
    fail(
      `README.md has no ${BEGIN} ... ${END} block.\n` +
        "  Either restore the anchors around the story-so-far table, or delete this\n" +
        "  script and its npm hooks together - do not leave the check in place with\n" +
        "  nothing to check."
    );
  }
  const block = readme.slice(begin, end + END.length);

  if (check) {
    const m = block.match(STAMP_LINE);
    if (!m) fail("the story-so-far block has no 'Chapter counts as of ... (version X.Y.Z)' line.");
    if (m[1] !== version) {
      fail(
        `the story-so-far table was last regenerated at ${m[1]}, package.json says ${version}.\n` +
          "  Run: node scripts/sync-story-so-far.js\n" +
          "  (or bump with `npm version X.Y.Z --no-git-tag-version`, which runs it for you)"
      );
    }
    console.log(`Story-so-far check passed (table regenerated at ${version}).`);
    return;
  }

  const next = render(STORYLINE_THREADS, countChapters(), existingDescriptions(block), version, longDate());
  if (next === block) {
    console.log("README.md story-so-far table already current; nothing to do.");
    return;
  }
  fs.writeFileSync(README, readme.slice(0, begin) + next + readme.slice(end + END.length));
  console.log(`README.md: story-so-far table regenerated at ${version}.`);
}

if (require.main === module) main();

module.exports = { countChapters, formatSeasons, firstSentence, existingDescriptions, renderRows, render, BEGIN, END };
