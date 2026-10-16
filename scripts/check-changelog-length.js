#!/usr/bin/env node
/**
 * Lists every entry under `## [Unreleased]` in CHANGELOG.md that runs past
 * about 120 words, with its opening words and its count.
 *
 * WHY THIS EXISTS: CLAUDE.md's rule that changelog entries are *plain and
 * complete, not 200-word essays* (agreed 2026-08-16, amended 2026-08-31) had
 * nothing behind it but the paragraph, and the file drifted the way a rule
 * nobody measures drifts. Measured on 2026-10-15: 1,162 entries, median 121
 * words, 90th percentile 242, longest 601, and CHANGELOG.md at 1.24 MB - past
 * the 1 MB GitHub's contents API will serve, and three times the size the
 * rule was written to prevent, since a large append-at-top file is exactly
 * what conflicts and gets clobbered. The archive in changelog/ fixed the size;
 * this is for the cause.
 *
 * WHY THIS IS A WARNING AND NOT A GATE, for the same reasons as
 * check-changelog-coverage.js next door. How long an entry should be is a
 * judgement, and the rule allows a sentence of why where it helps; a word
 * limit as a gate would be met by cutting words that mattered, or by
 * splitting one change into two entries to dodge it. So this prints and moves
 * on, and the fix for a flagged entry is the rule's own: say what changed and
 * where, and move the reasoning to a journal entry if it deserves prose.
 *
 * ONLY [Unreleased] IS READ. Released sections are immutable (CLAUDE.md), so
 * flagging them would list entries nobody may shorten. An entry can still be
 * trimmed while it is unreleased, which is the only time a warning helps.
 *
 * What counts: an entry is a top-level `- ` bullet and everything under it
 * until the next top-level bullet or heading. Words are whitespace-separated
 * after a Markdown link's target is dropped, so a long path in `(...)` counts
 * as nothing and the link text counts as written.
 */

const fs = require("fs");
const { MAIN } = require("../lib/changelog-files");

const LIMIT = 120;

function unreleasedSection(text) {
  const start = text.search(/^## \[Unreleased\]/m);
  if (start === -1) return null;
  const rest = text.slice(start).split(/\r?\n/).slice(1);
  const end = rest.findIndex((l) => /^## /.test(l));
  return end === -1 ? rest : rest.slice(0, end);
}

function entries(lines) {
  const out = [];
  let cur = null;
  for (const line of lines) {
    if (/^- /.test(line)) {
      cur = [line.slice(2)];
      out.push(cur);
    } else if (/^#/.test(line)) {
      cur = null;
    } else if (cur) {
      cur.push(line);
    }
  }
  return out.map((l) => l.join(" "));
}

function words(entry) {
  return entry
    .replace(/\]\([^)]*\)/g, "]")
    .split(/\s+/)
    .filter(Boolean);
}

function longEntries(text, limit = LIMIT) {
  const section = unreleasedSection(text);
  if (!section) return null;
  return entries(section)
    .map((e) => ({ words: words(e) }))
    .map((e) => ({ count: e.words.length, opening: e.words.slice(0, 10).join(" ") }))
    .filter((e) => e.count > limit);
}

module.exports = { longEntries, LIMIT };

if (require.main === module) {
  const long = longEntries(fs.readFileSync(MAIN, "utf8"));
  if (long === null) {
    console.log("Changelog length: no [Unreleased] section found, nothing checked.");
  } else if (long.length === 0) {
    console.log(`Changelog length: every [Unreleased] entry is within about ${LIMIT} words.`);
  } else {
    console.log(
      `Changelog length: ${long.length} [Unreleased] ${long.length === 1 ? "entry runs" : "entries run"} ` +
        `past about ${LIMIT} words.`,
    );
    for (const e of long) console.log(`  ${String(e.count).padStart(4)}  ${e.opening} ...`);
    console.log(
      "  Not a failure. CLAUDE.md: entries are plain and complete, not 200-word essays - " +
        "say what changed and where, and give the reasoning a journal entry if it deserves prose.",
    );
  }
}
