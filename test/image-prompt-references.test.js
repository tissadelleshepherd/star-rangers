// Pins the `References:` line scripts/image-prompts.js reads from
// story-bible/images.md: how it is parsed, how paths resolve, and that a
// reference which does not exist stops the entry instead of generating
// without it. The parser is the one place images.md's shape is interpreted,
// so a regression here silently changes what the model is asked to make.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { parseEntries, parseReferenceList, loadReferences, MAX_REFERENCES } = require("../scripts/image-prompts");

const REPO_ROOT = path.resolve(__dirname, "..");

const md = [
  "## Open work",
  "### 5. Missing lore illustrations",
  "",
  "- **`quern.jpg`** — a settlement on a cold world.",
  "  References: `story-bible/reference-art/tissadelle-headmate-2026-08-24.jpg`, `" + path.resolve(os.tmpdir(), "plate.jpg") + "`",
  "  > A cold upland at dusk. Landscape orientation.",
  "",
  "- **`plain.jpg`** — nothing attached.",
  "  > A bare plain. Landscape orientation.",
  "",
  "- **`card.jpg`** — no blockquote, so not image-model work.",
].join("\n");

test("a References: line is parsed and resolved against the repo root", () => {
  const entries = parseEntries(md);
  assert.equal(entries.length, 2);
  const [quern, plain] = entries;
  assert.deepEqual(quern.references, [
    path.resolve(REPO_ROOT, "story-bible/reference-art/tissadelle-headmate-2026-08-24.jpg"),
    path.resolve(os.tmpdir(), "plate.jpg"),
  ]);
  assert.deepEqual(plain.references, []);
  assert.equal(quern.prompt, "A cold upland at dusk. Landscape orientation.");
});

test("bare comma lists work when there are no backticks", () => {
  const refs = parseReferenceList("a.jpg, b.png");
  assert.deepEqual(refs.map((r) => path.basename(r)), ["a.jpg", "b.png"]);
});

test("a missing reference file fails the entry loudly", () => {
  const entry = { references: [path.join(os.tmpdir(), "no-such-reference-file.jpg")] };
  assert.throws(() => loadReferences(entry), /file not found/);
});

test("an unsupported reference type is refused", () => {
  const entry = { references: [path.join(os.tmpdir(), "reference.tif")] };
  assert.throws(() => loadReferences(entry), /not a JPEG, PNG or WebP/);
});

test("more than the model's cap is refused before any file is read", () => {
  const entry = { references: Array.from({ length: MAX_REFERENCES + 1 }, (_, i) => `ref-${i}.jpg`) };
  assert.throws(() => loadReferences(entry), /at most/);
});

test("a real file becomes a base64 image part", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "image-prompt-refs-"));
  const file = path.join(dir, "plate.png");
  fs.writeFileSync(file, Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  const [part] = loadReferences({ references: [file] });
  assert.equal(part.type, "image");
  assert.equal(part.mime_type, "image/png");
  assert.equal(Buffer.from(part.data, "base64").length, 4);
});
