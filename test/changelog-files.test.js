// Pins lib/changelog-files.js and scripts/check-changelog-length.js. The
// changelog became CHANGELOG.md plus an archive in changelog/ on 2026-10-15;
// the part a regression would break silently is the read order (newest first
// across every file, which check-changelog.js's ordering check relies on) and
// which entries the length warning reads (only [Unreleased], never a released
// section, which is immutable).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { archiveFiles, changelogFiles, readChangelog, MAIN } = require("../lib/changelog-files");
const { longEntries } = require("../scripts/check-changelog-length");

test("archive files sort newest range first and skip anything not named for a range", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "changelog-"));
  for (const f of ["1.0-1.9.md", "1.20-1.29.md", "README.md", "1.10-1.19.md", "2.0-2.9.md", "notes.txt"]) {
    fs.writeFileSync(path.join(dir, f), "");
  }
  assert.deepEqual(
    archiveFiles(dir).map((f) => path.basename(f)),
    ["2.0-2.9.md", "1.20-1.29.md", "1.10-1.19.md", "1.0-1.9.md"],
  );
  assert.deepEqual(archiveFiles(path.join(dir, "missing")), []);
});

test("the changelog opens with CHANGELOG.md and reads released headings newest first", () => {
  assert.equal(changelogFiles()[0], MAIN);
  const versions = [...readChangelog().matchAll(/^## \[(\d+)\.(\d+)\.(\d+)\]/gm)].map((m) =>
    m.slice(1).map(Number),
  );
  assert.ok(versions.length > 5);
  for (let i = 1; i < versions.length; i++) {
    const [a, b] = [versions[i - 1], versions[i]];
    assert.ok((a[0] - b[0] || a[1] - b[1] || a[2] - b[2]) > 0, `${a} before ${b}`);
  }
});

const words = (n) => Array.from({ length: n }, (_, i) => `w${i}`).join(" ");

test("only [Unreleased] entries past the limit are listed, continuation lines included", () => {
  const text = [
    "# Changelog",
    "",
    "## [Unreleased]",
    "",
    `- ${words(50)}`,
    "",
    `- ${words(100)}`,
    `  ${words(30)}`,
    "",
    "### Fixed",
    "",
    `- ${words(121)}`,
    "",
    "## [1.0.0] - 2026-07-09",
    "",
    `- ${words(500)}`,
    "",
  ].join("\n");
  const long = longEntries(text, 120);
  assert.deepEqual(long.map((e) => e.count), [130, 121]);
  assert.equal(long[0].opening, words(10));
});

test("a link's target does not count as words", () => {
  const text = `## [Unreleased]\n\n- [one two](src/a/very/long/path.md) ${words(119)}\n`;
  assert.deepEqual(longEntries(text, 120).map((e) => e.count), [121]);
});

test("no [Unreleased] section reads as nothing checked, not as all clear", () => {
  assert.equal(longEntries("## [1.0.0]\n\n- x\n"), null);
});
