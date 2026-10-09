// Pins the palette parser in scripts/check-contrast.js against the one input
// difference between CI and a Windows checkout: line endings. This repo has
// no .gitattributes, so under core.autocrlf=true main.css arrives as CRLF
// while the generated theme-*.css files (written by generate-themes.js with
// "\n") stay LF. On 2026-09-04 the local run reported the default palette as
// "status badge: missing --status-active" while CI, checking the same commit
// with the same two commands, was green: the status-badge regex required a
// bare "\n" after the brace and never saw one. A check that passes in CI and
// fails on the machine where main.css is edited is a check people learn to
// ignore, so the parser now normalises on read, and this test keeps it so.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const { paletteOf, PAIRS, contrast } = require("../scripts/check-contrast");

const MAIN_CSS = path.join(__dirname, "..", "src", "css", "main.css");

// A minimal stylesheet with everything paletteOf looks for: a :root block and
// the status-badge rule whose colour is a literal rather than a token.
const SAMPLE_LF = [
  "/* banner */",
  ":root {",
  "  --color-bg: #101418;",
  "  --color-surface-2: #22282e;",
  "  --color-text: #f0f0f0;",
  "}",
  ".character-badge--status-active {",
  "  color: #9ef5a0;",
  "  border-color: #9ef5a0;",
  "}",
  ""
].join("\n");

const SAMPLE_CRLF = SAMPLE_LF.replace(/\n/g, "\r\n");

test("the same palette is read from LF and CRLF input", () => {
  const lf = paletteOf(SAMPLE_LF);
  const crlf = paletteOf(SAMPLE_CRLF);
  assert.deepEqual(lf, {
    "--color-bg": "#101418",
    "--color-surface-2": "#22282e",
    "--color-text": "#f0f0f0",
    "--status-active": "#9ef5a0"
  });
  assert.deepEqual(crlf, lf);
});

test("the status-badge literal is found whichever ending the checkout uses", () => {
  // The real file, forced to each ending in turn, so the test does not depend
  // on how git happened to check it out on this machine.
  const raw = fs.readFileSync(MAIN_CSS, "utf8");
  const asLf = raw.replace(/\r\n/g, "\n");
  const asCrlf = asLf.replace(/\n/g, "\r\n");
  for (const [label, css] of [["LF", asLf], ["CRLF", asCrlf]]) {
    const palette = paletteOf(css);
    assert.ok(palette, `${label}: no :root block found`);
    assert.match(palette["--status-active"] || "", /^#[0-9a-fA-F]{3,6}$/, `${label}: --status-active missing`);
    for (const [, fg, bg] of PAIRS) {
      assert.ok(palette[fg], `${label}: ${fg} missing from :root`);
      assert.ok(palette[bg], `${label}: ${bg} missing from :root`);
    }
  }
  assert.deepEqual(paletteOf(asCrlf), paletteOf(asLf));
});

test("a stylesheet with no :root block is reported as not a palette", () => {
  assert.equal(paletteOf("/* retired theme */\n"), null);
});

test("contrast is symmetric and black on white is the WCAG maximum", () => {
  assert.equal(contrast("#000", "#fff").toFixed(0), "21");
  assert.equal(contrast("#fff", "#000"), contrast("#000", "#fff"));
});
