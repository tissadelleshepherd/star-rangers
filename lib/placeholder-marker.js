// Detects the PLACEHOLDER stamp scripts/mark-placeholder.js writes into a
// JPEG's COM segment, so that build-time code can tell a designed
// PORTRAIT/ILLUSTRATION PENDING card apart from a finished image.
//
// Extracted from scripts/mark-placeholder.js (which now requires this file)
// the day the homepage slideshow started excluding placeholder cards: two
// private copies of the marker string would drift the first time one of them
// changed, and the failure mode of drift here is exactly the one the stamp
// exists to prevent - a pending card treated as finished work.
//
// The marker lives inside the file rather than in a tracked list, so
// overwriting a card with a real image clears it automatically. Detection
// only looks at the header region: the text could occur by chance in
// entropy-coded image data, and a false positive would hide real work - or,
// for the slideshow, silently drop a finished portrait.

const fs = require("fs");

const MARKER = "STAR-RANGERS-PLACEHOLDER";

// mark-placeholder.js inserts the COM segment immediately after SOI, so the
// marker sits within the first few dozen bytes of a stamped file; 4096 is
// generous headroom for other header segments without reaching image data.
const HEADER_BYTES = 4096;

function isPlaceholderBuffer(buf) {
  return buf.slice(0, HEADER_BYTES).includes(MARKER);
}

// Memoised by absolute path, same reasoning as lib/image-size.js: a build
// asks about the same handful of hero portraits once per edition variable
// and re-reading headers per query is pure waste.
const cache = new Map();

/**
 * @param {string} absolutePath
 * @returns {boolean} true only when the file is readable and carries the
 *   stamp. An unreadable or missing file returns false - whether the file
 *   EXISTS is validate-content.js's question, not this module's.
 */
function isPlaceholderImage(absolutePath) {
  if (cache.has(absolutePath)) return cache.get(absolutePath);
  let result = false;
  try {
    const fd = fs.openSync(absolutePath, "r");
    try {
      const buf = Buffer.alloc(HEADER_BYTES);
      const bytesRead = fs.readSync(fd, buf, 0, HEADER_BYTES, 0);
      result = isPlaceholderBuffer(buf.slice(0, bytesRead));
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    result = false;
  }
  cache.set(absolutePath, result);
  return result;
}

module.exports = { MARKER, HEADER_BYTES, isPlaceholderBuffer, isPlaceholderImage };
