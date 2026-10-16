// The changelog is CHANGELOG.md plus its archive in changelog/, and every
// reader that means "the changelog" means all of it. Released sections older
// than the newest few were moved into changelog/ on 2026-10-15, verbatim, when
// CHANGELOG.md passed 1 MB and stopped fitting GitHub's contents API; a reader
// that went on opening CHANGELOG.md alone would silently lose sight of them,
// which for check-changelog.js would mean every archived tag reading as a
// destroyed section. So the list of files lives here, once.
//
// Order is newest first across the whole set: CHANGELOG.md, then the archive
// files by the highest version range they cover (`1.30-1.39.md` before
// `1.20-1.29.md`), so concatenating them in this order reads as one file.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MAIN = path.join(ROOT, "CHANGELOG.md");
const ARCHIVE_DIR = path.join(ROOT, "changelog");

// `1.30-1.39.md` -> [1, 30]. README.md and anything else not named for a
// range is not part of the record.
const RANGE = /^(\d+)\.(\d+)-\d+\.\d+\.md$/;

function archiveFiles(dir = ARCHIVE_DIR) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .map((name) => ({ name, m: name.match(RANGE) }))
    .filter((f) => f.m)
    .sort((a, b) => b.m[1] - a.m[1] || b.m[2] - a.m[2])
    .map((f) => path.join(dir, f.name));
}

function changelogFiles() {
  return [MAIN, ...archiveFiles()];
}

// Every file's text, joined in order. Each file ends with a newline, so the
// join needs no separator to keep a heading at the start of its line.
function readChangelog() {
  return changelogFiles()
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("");
}

module.exports = { MAIN, ARCHIVE_DIR, archiveFiles, changelogFiles, readChangelog };
