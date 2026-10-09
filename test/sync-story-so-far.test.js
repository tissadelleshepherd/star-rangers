// Pins scripts/sync-story-so-far.js: the README's story-so-far table is
// regenerated from lib/storyline-threads.js and src/seasons/ at every version
// bump (Dermot's direction, 2026-10-08), and the parts a regression would
// corrupt silently are the season formatting, the authored column surviving
// a rewrite, and a new thread getting a row at all.
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  countChapters,
  formatSeasons,
  existingDescriptions,
  renderRows
} = require("../scripts/sync-story-so-far");
const { STORYLINE_THREADS } = require("../lib/storyline-threads");

test("formatSeasons collapses runs of three or more and keeps pairs apart", () => {
  assert.equal(formatSeasons([1, 3, 5, 6, 7]), "1, 3, 5–7");
  assert.equal(formatSeasons([4, 10]), "4, 10");
  assert.equal(formatSeasons([11, 12]), "11, 12");
  assert.equal(formatSeasons([0]), "0");
  assert.equal(formatSeasons([7, 5, 6]), "5–7");
});

test("every registered thread gets a row, in registry order, with its seasons' chapters summed", () => {
  const counts = new Map([[0, 6], [1, 10], [3, 5], [5, 5], [6, 4], [7, 3], [8, 2]]);
  const rows = renderRows(STORYLINE_THREADS, counts, new Map()).split("\n").slice(2);
  assert.equal(rows.length, STORYLINE_THREADS.length);
  STORYLINE_THREADS.forEach((t, i) => {
    assert.ok(rows[i].startsWith(`| **${t.name}** |`), `${t.name} is row ${i}`);
  });
  const tissadelle = rows.find((r) => r.includes("Tissadelle Shepherd's Arc"));
  assert.match(tissadelle, /\| 1, 3, 5–7 \| 27 \|/);
});

test("the authored column is kept by thread name, and a new thread falls back to the registry", () => {
  const block = [
    "| Thread | Seasons | Chapters | What it is |",
    "|---|---|---|---|",
    "| **Founding Era** | 0 | 6 | Hand-written line, kept. |"
  ].join("\n");
  const kept = existingDescriptions(block);
  assert.equal(kept.get("Founding Era"), "Hand-written line, kept.");
  const rows = renderRows(STORYLINE_THREADS, new Map(), kept).split("\n").slice(2);
  assert.match(rows[0], /\| Hand-written line, kept\. \|$/);
  const gated = STORYLINE_THREADS.find((t) => t.tier);
  if (gated) {
    const row = rows.find((r) => r.startsWith(`| **${gated.name}** |`));
    assert.match(row, new RegExp(`overlay for the ${gated.tier} reading tier`));
  }
});

test("countChapters counts only sNNeNNcNN.md files, by season", () => {
  const fs = require("node:fs");
  const os = require("node:os");
  const path = require("node:path");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seasons-"));
  fs.mkdirSync(path.join(dir, "s01", "e01"), { recursive: true });
  fs.mkdirSync(path.join(dir, "s02", "e01"), { recursive: true });
  fs.writeFileSync(path.join(dir, "s01", "index.md"), "");
  fs.writeFileSync(path.join(dir, "s01", "e01", "index.md"), "");
  fs.writeFileSync(path.join(dir, "s01", "e01", "s01e01c01.md"), "");
  fs.writeFileSync(path.join(dir, "s01", "e01", "s01e01c02.md"), "");
  fs.writeFileSync(path.join(dir, "s02", "e01", "s02e01c01.md"), "");
  fs.writeFileSync(path.join(dir, "s02", "e01", "notes.md"), "");
  const counts = countChapters(dir);
  assert.equal(counts.get(1), 2);
  assert.equal(counts.get(2), 1);
  fs.rmSync(dir, { recursive: true, force: true });
});
