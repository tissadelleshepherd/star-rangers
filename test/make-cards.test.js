// Pins the codex layout of scripts/make-cards.js, the Node port of
// make-codex-cover.ps1, to the .ps1's redesign of 2026-10-11: the lower block
// ends 92 px above the foot and never rises above 780, a long title shrinks
// to fit, a long stamp moves left rather than off the card, and every small
// line stays inside its width. Only the pure layout is loaded, so sharp (a
// local --no-save install) is not needed here.
const test = require("node:test");
const assert = require("node:assert/strict");

const { codexLayout, codexSvg, estWidth } = require("../scripts/make-cards");

const base = {
  titleLines: ["REDLINE PROTOCOL"],
  category: "OFFICIAL DOCUMENTS",
  subtitle: "Variability Governance",
  institution: "AI Governance Commission - Doctrine Office",
  author: "DR. KWAME REYES-OSEI",
  stamp: "OFFICIAL",
  motif: "rules",
};

test("a short card keeps the 104 px title and the old 1042 px divider", () => {
  const L = codexLayout({ ...base, subtitle: "", institution: "", author: "" });
  assert.equal(L.title.px, 104);
  assert.equal(L.divY, 1042);
});

test("the lower block ends 92 px above the foot when it has to rise", () => {
  const L = codexLayout({ ...base, titleLines: ["BOUNDARY", "MONITORING", "PROTOCOL"] });
  assert.ok(L.divY < 1042 && L.divY >= 780);
  assert.ok(Math.abs(L.divY + L.blockH - (1600 - 92)) < 1e-6);
  assert.ok(L.bottom <= 1600 - 92 + 1e-6);
});

test("the divider never rises above 780", () => {
  const L = codexLayout({ ...base, titleLines: ["ONE", "TWO", "THREE", "FOUR", "FIVE"] });
  assert.equal(L.divY, 780);
});

test("a long title shrinks until its widest line fits 1330 px", () => {
  const L = codexLayout({ ...base, titleLines: ["THE TWO SONGS OF THE LOUD PEOPLE"] });
  assert.ok(L.title.px < 104);
  assert.ok(estWidth("THE TWO SONGS OF THE LOUD PEOPLE", L.title.px, 4, "serif") <= 1330);
});

test("small lines shrink to fit, down to their floors", () => {
  const long = "Rendered from Chorus-Keeping - Archive Translation Desk, Second Annex - Long Shelf";
  const L = codexLayout({ ...base, institution: long, author: "THE BRANCH SCHOOL, TEACHING STAFF" });
  assert.ok(L.institution.px >= 40 && L.institution.px <= 52);
  assert.ok(L.institution.px === 40 || estWidth(L.institution.text, L.institution.px, 0.5, "serif") <= 1480);
  assert.ok(L.author.px >= 30 && L.author.px <= 40);
  assert.ok(estWidth(L.author.text, L.author.px, 3, "sans") <= 1360);
  assert.equal(L.institution.text.includes(" · "), true);
});

test("a long stamp moves left and its box stays inside the card", () => {
  const short = codexLayout(base).stamp;
  assert.equal(short.x, 1368);
  const long = codexLayout({ ...base, stamp: "FILED AS RECEIVED" }).stamp;
  assert.ok(long.x < 1368);
  assert.ok(long.x + long.halfW * 0.995 <= 1600 - 60 + 1e-6);
});

test("the SVG escapes text and names the .ps1 faces first", () => {
  const svg = codexSvg({ ...base, subtitle: "Ships & <Stations>" });
  assert.match(svg, /Ships &amp; &lt;Stations&gt;/);
  assert.match(svg, /font-family="Georgia,/);
  assert.match(svg, /font-family="'Bahnschrift SemiBold',/);
});
