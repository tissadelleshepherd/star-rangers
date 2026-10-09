"use strict";

// Pins lib/archive-companions.js: the derivation behind the chapter layout's
// "From the Archive" aside. The contract worth guarding is that an entry
// accompanies a chapter for exactly two reasons (its revealed_by names the
// chapter, or the chapter's related: names its title), that a title resolves
// glossary-first against the pages this build carries and silently drops
// when none does, that the text shown is the entry's own short or
// description with the plain line taking over on the children's tier, and
// that the order is section then title so the aside is stable across builds.

const test = require("node:test");
const assert = require("node:assert/strict");
const { companionText, findArchiveCompanions } = require("../lib/archive-companions");

const chapter = { id: "s03e02c02" };

const pages = [
  { title: "Counterpane Archecluster", url: "/lore/counterpane-archecluster/", section: "lore", category: "Cosmology", description: "The surveyed membrane.", plain: "A place the survey visits.", revealedBy: "s03e02c02" },
  { title: "Etheric", url: "/glossary/etheric/", section: "glossary", category: "Cosmology", short: "A mode of constraint, not a place.", plain: "A kind of rule, not a room." },
  { title: "Krenyi", url: "/glossary/krenyi/", section: "glossary", category: "Species", short: "The people who keep their own calendar." },
  { title: "Krenyi", url: "/lore/krenyi/", section: "lore", category: "Species", description: "The lore page on the Krenyi." },
  { title: "What Was Carried", url: "/codex/what-was-carried/", section: "codex", category: "Cultural Record", description: "A continuation of the Life.", revealedBy: ["s03e02c02", "s07e01c02"] },
  { title: "Standing Claims", url: "/codex/standing-claims/", section: "codex", description: "Sen's gradings.", revealedBy: "s05e02c02" },
];

test("a page accompanies a chapter when its revealed_by names it, as a string or in a list", () => {
  const out = findArchiveCompanions(chapter, undefined, pages);
  assert.deepEqual(out.map((e) => [e.title, e.relation]), [
    ["Counterpane Archecluster", "revealed"],
    ["What Was Carried", "revealed"],
  ]);
});

test("a related: title resolves glossary-first, then lore, then codex, and an unknown title drops silently", () => {
  const out = findArchiveCompanions(chapter, ["Krenyi", "Etheric", "No Such Page", "Standing Claims"], pages);
  assert.deepEqual(out.map((e) => [e.title, e.url, e.relation]), [
    ["Etheric", "/glossary/etheric/", "named"],
    ["Krenyi", "/glossary/krenyi/", "named"],
    ["Counterpane Archecluster", "/lore/counterpane-archecluster/", "revealed"],
    ["Standing Claims", "/codex/standing-claims/", "named"],
    ["What Was Carried", "/codex/what-was-carried/", "revealed"],
  ]);
});

test("a page both revealed by and named in the chapter is listed once, as revealed", () => {
  const out = findArchiveCompanions(chapter, ["Counterpane Archecluster"], pages);
  assert.equal(out.filter((e) => e.title === "Counterpane Archecluster").length, 1);
  assert.equal(out[0].relation, "revealed");
});

test("the text is the entry's own short or description, and the plain line on the children's tier", () => {
  const general = findArchiveCompanions(chapter, ["Etheric"], pages);
  assert.equal(general.find((e) => e.title === "Etheric").text, "A mode of constraint, not a place.");
  assert.equal(general.find((e) => e.title === "Counterpane Archecluster").text, "The surveyed membrane.");
  const children = findArchiveCompanions(chapter, ["Etheric", "Krenyi"], pages, { tier: "children" });
  assert.equal(children.find((e) => e.title === "Etheric").text, "A kind of rule, not a room.");
  assert.equal(children.find((e) => e.title === "Counterpane Archecluster").text, "A place the survey visits.");
  // No plain line: the children's tier falls back to the entry's own text
  // rather than showing nothing.
  assert.equal(children.find((e) => e.title === "Krenyi").text, "The people who keep their own calendar.");
  assert.equal(companionText({ short: "  ", description: "d", plain: "" }, undefined), "d");
  assert.equal(companionText({}, "children"), "");
});

test("nothing accompanies a chapter with no id, no related and no revealed_by naming it", () => {
  assert.deepEqual(findArchiveCompanions({ id: "s09e09c09" }, [], pages), []);
  assert.deepEqual(findArchiveCompanions(null, ["Etheric"], []), []);
  assert.deepEqual(findArchiveCompanions(null, null, null), []);
});

test("a page outside the three Archive sections, or without a title or url, is never listed", () => {
  const stray = [
    { title: "A Journal Entry", url: "/journal/x/", section: "journal", revealedBy: "s03e02c02" },
    { url: "/lore/untitled/", section: "lore", revealedBy: "s03e02c02" },
    { title: "No URL", section: "lore", revealedBy: "s03e02c02" },
  ];
  assert.deepEqual(findArchiveCompanions(chapter, ["A Journal Entry"], stray), []);
});
