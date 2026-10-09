// Pins lib/image-size.js, the hand-rolled JPEG/PNG header parser behind
// og:image:width/height. Its contract is "null rather than guess": a wrong
// dimension makes a social platform reserve the wrong box, so every
// unreadable, unrecognised or nonsensical input must come back null. The
// fixtures are tiny hand-built buffers - real headers, no image files.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { imageSize } = require("../lib/image-size");

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "image-size-test-"));
let fileCounter = 0;

// imageSize memoises by absolute path, so every fixture gets a fresh name.
function write(buf) {
  const p = path.join(dir, `fixture-${fileCounter++}`);
  fs.writeFileSync(p, buf);
  return p;
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function pngWithIhdr(width, height) {
  const ihdr = Buffer.alloc(16);
  ihdr.writeUInt32BE(13, 0); // IHDR chunk length
  ihdr.write("IHDR", 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  return Buffer.concat([PNG_SIGNATURE, ihdr]);
}

// SOI, a non-SOF APP0 segment first (so the marker walk is exercised), then
// an SOF0 carrying the dimensions.
function jpegWithSof(width, height) {
  const soi = Buffer.from([0xff, 0xd8]);
  const app0 = Buffer.concat([
    Buffer.from([0xff, 0xe0, 0x00, 0x10]), // marker + length 16
    Buffer.alloc(14)
  ]);
  const sof = Buffer.alloc(11);
  sof[0] = 0xff;
  sof[1] = 0xc0;
  sof.writeUInt16BE(0x0011, 2); // segment length
  sof[4] = 0x08; // precision
  sof.writeUInt16BE(height, 5);
  sof.writeUInt16BE(width, 7);
  return Buffer.concat([soi, app0, sof, Buffer.alloc(4)]);
}

test("reads a PNG's dimensions from its IHDR chunk", () => {
  assert.deepEqual(imageSize(write(pngWithIhdr(1600, 900))), { width: 1600, height: 900 });
});

test("reads a JPEG's dimensions from its SOF marker, skipping earlier segments", () => {
  assert.deepEqual(imageSize(write(jpegWithSof(1200, 1600))), { width: 1200, height: 1600 });
});

test("a truncated PNG returns null rather than a guess", () => {
  assert.equal(imageSize(write(PNG_SIGNATURE)), null);
});

test("a JPEG with a malformed segment length refuses rather than looping", () => {
  const soi = Buffer.from([0xff, 0xd8]);
  const bad = Buffer.concat([soi, Buffer.from([0xff, 0xe0, 0x00, 0x01]), Buffer.alloc(8)]);
  assert.equal(imageSize(write(bad)), null);
});

test("a JPEG with no SOF marker returns null", () => {
  const soi = Buffer.from([0xff, 0xd8]);
  const app0 = Buffer.concat([Buffer.from([0xff, 0xe0, 0x00, 0x10]), Buffer.alloc(14)]);
  assert.equal(imageSize(write(Buffer.concat([soi, app0, Buffer.alloc(8)]))), null);
});

test("a zero dimension is treated as a failed parse", () => {
  assert.equal(imageSize(write(pngWithIhdr(0, 900))), null);
});

test("a non-image file returns null", () => {
  assert.equal(imageSize(write(Buffer.from("not an image at all"))), null);
});

test("an unreadable path returns null", () => {
  assert.equal(imageSize(path.join(dir, "does-not-exist")), null);
});

test("results are memoised by absolute path", () => {
  const p = write(pngWithIhdr(800, 600));
  const first = imageSize(p);
  // A different image at the same path is served from the cache - the build
  // reads each file once, which is the point of the memo.
  fs.writeFileSync(p, pngWithIhdr(1, 1));
  assert.equal(imageSize(p), first);
});
