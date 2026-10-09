// Pins lib/placeholder-marker.js, the shared detector for the PLACEHOLDER
// stamp scripts/mark-placeholder.js writes into a JPEG COM segment. Two
// consumers depend on opposite failure modes staying exact: the homepage
// slideshow (withImages in .eleventy.js) must never show a stamped pending
// card, and it must never drop a finished portrait on a false positive -
// which is why detection is confined to the header region.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { MARKER, HEADER_BYTES, isPlaceholderBuffer, isPlaceholderImage } = require("../lib/placeholder-marker");

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "placeholder-marker-test-"));
let fileCounter = 0;

// isPlaceholderImage memoises by absolute path, so every fixture gets a
// fresh name.
function write(buf) {
  const p = path.join(dir, `fixture-${fileCounter++}.jpg`);
  fs.writeFileSync(p, buf);
  return p;
}

// The exact layout mark-placeholder.js produces: SOI, then a COM segment
// (FF FE, big-endian length counting itself, marker text) ahead of the rest.
function stampedJpeg() {
  const soi = Buffer.from([0xff, 0xd8]);
  const text = Buffer.from(MARKER, "ascii");
  const seg = Buffer.alloc(4 + text.length);
  seg[0] = 0xff;
  seg[1] = 0xfe;
  seg.writeUInt16BE(text.length + 2, 2);
  text.copy(seg, 4);
  return Buffer.concat([soi, seg, Buffer.alloc(64)]);
}

test("a stamped file is detected", () => {
  assert.equal(isPlaceholderImage(write(stampedJpeg())), true);
});

test("an unstamped file is not a placeholder", () => {
  assert.equal(isPlaceholderImage(write(Buffer.concat([Buffer.from([0xff, 0xd8]), Buffer.alloc(64)]))), false);
});

test("the marker text beyond the header region is ignored", () => {
  // The string occurring by chance in entropy-coded image data must not
  // count - a false positive silently drops a finished portrait.
  const deep = Buffer.concat([
    Buffer.from([0xff, 0xd8]),
    Buffer.alloc(HEADER_BYTES),
    Buffer.from(MARKER, "ascii")
  ]);
  assert.equal(isPlaceholderImage(write(deep)), false);
});

test("a missing file is not a placeholder", () => {
  // Whether the file exists is validate-content.js's question; this module
  // answers only "is it stamped", and an unreadable file is not.
  assert.equal(isPlaceholderImage(path.join(dir, "does-not-exist.jpg")), false);
});

test("isPlaceholderBuffer matches isPlaceholderImage on the same bytes", () => {
  assert.equal(isPlaceholderBuffer(stampedJpeg()), true);
  assert.equal(isPlaceholderBuffer(Buffer.alloc(64)), false);
});

test("results are memoised by absolute path", () => {
  const p = write(stampedJpeg());
  assert.equal(isPlaceholderImage(p), true);
  // Overwriting the card with a real image is served from the cache within
  // one process - each build reads each file once, which is the point.
  fs.writeFileSync(p, Buffer.alloc(64));
  assert.equal(isPlaceholderImage(p), true);
});
