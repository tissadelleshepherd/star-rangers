#!/usr/bin/env node
//
// scripts/mark-placeholder.js
//
// Stamps a JPEG as a PLACEHOLDER so the image queue stops counting it as
// finished work.
//
// LOCAL AUTHORING TOOL - not part of the build, not run by `npm test`, not
// touched by CI. Dependency-free on purpose: it writes a JPEG COM segment by
// hand rather than pulling in an image library, because this repo has no image
// dependency and should not gain one for a stamping job.
//
// The marker string and its detection live in lib/placeholder-marker.js -
// shared with the build (the homepage slideshow excludes stamped cards) and
// with validate-content.js's hero-cast check. This script keeps only the
// writing/removal half.
//
// THE PROBLEM IT FIXES
//
// image-prompts.js decides an entry is `done` when its target file exists.
// That was true until 12 August 2026, when twenty-eight images that were
// photographs of real people, or otherwise unusable, were replaced with
// designed PORTRAIT PENDING / ILLUSTRATION PENDING cards. Every one of those
// gaps is still a job - but the file exists, so the queue reported itself
// complete and `--list` showed 0 pending. Filling the holes hid them.
//
// A list of placeholder paths would drift the first time someone replaced one
// and forgot to update it. The marker instead lives inside the file, so
// overwriting the card with a real image removes it automatically and nothing
// has to be kept in step.
//
// HOW
//
// A JPEG is a sequence of segments after the two-byte SOI (FF D8). A COM
// segment - FF FE, two-byte big-endian length, then the text - may appear
// anywhere among them and is ignored by every decoder. This inserts one
// immediately after SOI. Re-running is safe: an already-marked file is left
// alone.
//
// USAGE
//   node scripts/mark-placeholder.js src/images/lore/mnemari.jpg [...]
//   node scripts/mark-placeholder.js --check src/images/lore/mnemari.jpg
//   node scripts/mark-placeholder.js --unmark src/images/lore/mnemari.jpg

'use strict';

const fs = require('fs');
const path = require('path');

const { MARKER, isPlaceholderBuffer: isMarked } = require('../lib/placeholder-marker');
const REPO_ROOT = path.resolve(__dirname, '..');

function mark(file) {
  const buf = fs.readFileSync(file);
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('not a JPEG (no SOI)');
  if (isMarked(buf)) return 'already marked';

  const text = Buffer.from(MARKER, 'ascii');
  const len = text.length + 2; // the length field counts itself
  if (len > 0xffff) throw new Error('marker too long');
  const seg = Buffer.alloc(4 + text.length);
  seg[0] = 0xff; seg[1] = 0xfe;
  seg.writeUInt16BE(len, 2);
  text.copy(seg, 4);

  fs.writeFileSync(file, Buffer.concat([buf.slice(0, 2), seg, buf.slice(2)]));
  return 'marked';
}

function unmark(file) {
  const buf = fs.readFileSync(file);
  const at = buf.indexOf(MARKER);
  if (at === -1 || !isMarked(buf)) return 'not marked';
  const segStart = at - 4;
  if (buf[segStart] !== 0xff || buf[segStart + 1] !== 0xfe) throw new Error('marker is not in a COM segment; refusing to edit');
  const segLen = buf.readUInt16BE(segStart + 2) + 2;
  fs.writeFileSync(file, Buffer.concat([buf.slice(0, segStart), buf.slice(segStart + segLen)]));
  return 'unmarked';
}

const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const UNMARK = args.includes('--unmark');
const files = args.filter((a) => !a.startsWith('--'));

if (!files.length) {
  console.error('usage: node scripts/mark-placeholder.js [--check|--unmark] <file.jpg> [...]');
  process.exit(1);
}

let failed = 0;
for (const f of files) {
  const abs = path.isAbsolute(f) ? f : path.join(REPO_ROOT, f);
  const rel = path.relative(REPO_ROOT, abs).split(path.sep).join('/');
  try {
    if (CHECK) console.log(`${isMarked(fs.readFileSync(abs)) ? 'placeholder' : 'real      '}  ${rel}`);
    else console.log(`${UNMARK ? unmark(abs) : mark(abs)}  ${rel}`);
  } catch (err) {
    console.error(`error       ${rel}: ${err.message}`);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
