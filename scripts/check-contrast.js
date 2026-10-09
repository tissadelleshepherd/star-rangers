#!/usr/bin/env node
//
// Checks every palette in src/css/ against WCAG 2.2 AA contrast for normal
// text (4.5:1), on the specific foreground/background pairs the stylesheet
// actually puts together.
//
// WHY THIS IS A SCRIPT AND NOT A STYLE-GUIDE PARAGRAPH. The same reason
// check-related-terms.js exists: the failure is silent and looks fine to the
// person who made it. A palette is nine or ten hex values chosen against the
// page background, and every one of them then lands on --color-surface-2 as
// well, two steps darker, where a value chosen to look right on the page can
// be a third under the floor. Nothing in `npm test` can see it - the build is
// structurally perfect - and nothing in a screenshot shows it either, because
// low-contrast text is legible to the person who already knows what it says.
// It took a measurement to find that undercover-pets.com, the CHILDREN'S
// domain, had the worst contrast on the site (its accent at 2.32:1 on badges,
// against a 4.5 floor) - which is exactly the domain where it matters most and
// the last one anybody would have suspected.
//
// WHAT IT CHECKS, and why these pairs. Each is a place main.css puts a token
// colour on a token background as TEXT; decorative uses (the pov-block left
// borders, the pov-block backgrounds) are deliberately not here, since the
// 4.5:1 floor is a text rule.
//
// Run it after changing any palette in scripts/generate-themes.js:
//
//   node scripts/check-contrast.js
//
// Exits non-zero on a failure, so it can be added to `npm test` if wanted. It
// is deliberately not there yet: it reads the GENERATED theme files, which are
// only correct after `npm run generate-themes`, and a check that fails because
// you have not run another script is a check people learn to ignore.
const fs = require("fs");
const path = require("path");

const CSS_DIR = path.join(__dirname, "..", "src", "css");
const FLOOR = 4.5; // WCAG 2.2 AA, normal text.

// Solarized is a published palette with exact values (Ethan Schoonover, 2011),
// and its whole worth as an option is being that palette rather than a
// lookalike: its body text is a deliberate low-contrast grey on dark cyan, and
// "fixing" it would leave a theme named Solarized that no Solarized user
// recognises. It is offered as a general-purpose display option, is nobody's
// edition default (lib/editions.js), and no domain ships it - so the reader who
// gets it chose it. Recorded here rather than quietly skipped: an exemption
// nobody can see is indistinguishable from a bug nobody noticed.
const EXEMPT = {
  solarized:
    "faithful reproduction of Ethan Schoonover's published palette; opt-in only, no edition ships it"
};

// A one-line tombstone left behind when the theme was retired; not a palette.
const SKIP_FILES = new Set(["theme-wordpress.css"]);

// [label, foreground token, background token]. `status` is not a custom
// property - it is the literal in .character-badge--status-active, which
// generate-themes.js swaps per theme - so it is read separately below.
const PAIRS = [
  ["body text on page", "--color-text", "--color-bg"],
  ["muted text on page", "--color-text-muted", "--color-bg"],
  ["muted text on surface", "--color-text-muted", "--color-surface"],
  ["muted text on badge/label", "--color-text-muted", "--color-surface-2"],
  ["link/accent on page", "--color-accent", "--color-bg"],
  ["accent on surface", "--color-accent", "--color-surface"],
  // Hover is a state the same text is READ in, not a decoration, so it carries
  // the same floor. Worth checking rather than assuming: the fellowship
  // palette had a LIGHTER gold on hover than at rest, so pointing at a link
  // made it harder to read - 2.98:1 against 6.00 - and nothing but a
  // measurement would find it, since the person who wrote it knows what it says.
  ["accent on page, hovered", "--color-accent-hover", "--color-bg"],
  ["accent on surface, hovered", "--color-accent-hover", "--color-surface"],
  ["accent on badge/label", "--color-accent", "--color-surface-2"],
  ["canon-facts toggle", "--color-canon", "--color-surface-2"],
  // The Contained status badge is filled: page-background text on the canon
  // colour (.character-badge--status-contained). The only place that pair
  // meets, and the tightest of the badge pairs on the light palettes.
  ["contained badge", "--color-bg", "--color-canon"],
  ["skip link", "--color-skip-text", "--color-skip-bg"],
  ["active POV button", "--color-bg", "--color-pov-active"]
];

function channel(v) {
  const x = v / 255;
  return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const c = hex.replace("#", "");
  const full = c.length === 3 ? c.split("").map((ch) => ch + ch).join("") : c;
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(full.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function paletteOf(raw) {
  // Line endings normalised on the way in, for the same reason and in the
  // same way as generate-themes.js. This repo has no .gitattributes, so a
  // Windows checkout under core.autocrlf=true hands us main.css as CRLF,
  // while the theme files - written by generate-themes.js with "\n" - are LF.
  // The status-badge pattern below needs a bare "\n" after the brace, so on
  // 2026-09-04 the local run failed the default palette with "missing
  // --status-active" for a rule plainly present in main.css, while CI on
  // Linux, running the same two commands on the same commit, was green. A
  // check that fails only on the machine where main.css is edited is a check
  // people learn to ignore. test/check-contrast.test.js pins this.
  const css = raw.replace(/\r\n/g, "\n");
  const root = css.match(/:root \{[\s\S]*?\n\}/);
  if (!root) return null;
  const palette = {};
  for (const m of root[0].matchAll(/(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
    palette[m[1]] = m[2];
  }
  const status = css.match(/\.character-badge--status-active \{\n\s*color: (#[0-9a-fA-F]{3,6});/);
  if (status) palette["--status-active"] = status[1];
  return palette;
}

function main() {
  const files = fs
    .readdirSync(CSS_DIR)
    .filter((f) => f.endsWith(".css") && !SKIP_FILES.has(f))
    .sort((a, b) => (a === "main.css" ? -1 : b === "main.css" ? 1 : a.localeCompare(b)));

  let failures = 0;
  let exempted = 0;

  for (const file of files) {
    const name = file === "main.css" ? "default" : file.replace(/^theme-|\.css$/g, "");
    const palette = paletteOf(fs.readFileSync(path.join(CSS_DIR, file), "utf8"));
    if (!palette) {
      console.error(`FAIL ${file}: no :root block - not a palette?`);
      failures++;
      continue;
    }

    const checks = [...PAIRS, ["status badge", "--status-active", "--color-surface-2"]];
    const bad = [];
    for (const [label, fg, bg] of checks) {
      if (!palette[fg] || !palette[bg]) {
        bad.push(`${label}: missing ${!palette[fg] ? fg : bg}`);
        continue;
      }
      const ratio = contrast(palette[fg], palette[bg]);
      if (ratio < FLOOR) {
        bad.push(`${label}: ${palette[fg]} on ${palette[bg]} = ${ratio.toFixed(2)}:1 (floor ${FLOOR})`);
      }
    }

    if (!bad.length) {
      console.log(`ok   ${name}`);
      continue;
    }
    if (EXEMPT[name]) {
      console.log(`skip ${name}: ${bad.length} below floor - exempt (${EXEMPT[name]})`);
      exempted++;
      continue;
    }
    console.error(`FAIL ${name}`);
    for (const line of bad) console.error(`       ${line}`);
    failures += bad.length;
  }

  console.log(
    `\n${files.length} palettes checked, ${failures} failure(s), ${exempted} exempt.` +
      (failures ? "\nPalettes live in scripts/generate-themes.js; re-run `npm run generate-themes` after editing one." : "")
  );
  process.exit(failures ? 1 : 0);
}

// Exported for test/check-contrast.test.js; the check itself only runs when
// invoked directly, so requiring this file never exits the process.
module.exports = { paletteOf, contrast, PAIRS, FLOOR };

if (require.main === module) {
  main();
}
