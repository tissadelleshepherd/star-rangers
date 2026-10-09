"use strict";

// Pins lib/archive-backlinks.js: the derivation behind the chapter layout's
// "In the Archive" block. The contract worth guarding is that a page is
// listed for exactly three reasons (a link to the chapter's URL, a link to
// its /c/ alias, or a revealed_by / revised_by naming it), that matching is
// prefix-agnostic, and that the order is section then title so the block
// reads the same on every build.

const test = require("node:test");
const assert = require("node:assert/strict");
const { chapterLinkTargets, citesChapter, findArchiveBacklinks } = require("../lib/archive-backlinks");

const chapter = { id: "s07e01c02", comment_id: "shown-not-healed" };

test("chapterLinkTargets derives the season URL from the id and the alias from comment_id", () => {
  assert.deepEqual(chapterLinkTargets(chapter), ["/seasons/s07/e01/s07e01c02/", "/c/shown-not-healed/"]);
});

test("chapterLinkTargets yields nothing for a malformed id and no alias without a comment_id", () => {
  assert.deepEqual(chapterLinkTargets({ id: "chapter-two" }), []);
  assert.deepEqual(chapterLinkTargets({ id: "s01e01c01" }), ["/seasons/s01/e01/s01e01c01/"]);
  assert.deepEqual(chapterLinkTargets(null), []);
});

test("citesChapter matches whatever prefix the source carries, and never a non-string", () => {
  const targets = chapterLinkTargets(chapter);
  assert.equal(citesChapter("see [x](/star-rangers/seasons/s07/e01/s07e01c02/)", targets), true);
  assert.equal(citesChapter("see [x](/other-prefix/seasons/s07/e01/s07e01c02/)", targets), true);
  assert.equal(citesChapter("cite /c/shown-not-healed/ here", targets), true);
  assert.equal(citesChapter("see /seasons/s07/e01/s07e01c03/", targets), false);
  assert.equal(citesChapter(undefined, targets), false);
  assert.equal(citesChapter("anything", []), false);
});

test("findArchiveBacklinks lists citing pages in section order then title order, with the relation named", () => {
  const pages = [
    { title: "Zeta", url: "/codex/zeta/", section: "codex", raw: "links /star-rangers/seasons/s07/e01/s07e01c02/" },
    { title: "Alpha", url: "/codex/alpha/", section: "codex", raw: "links /c/shown-not-healed/" },
    { title: "Saint Aoife", url: "/lore/saint-aoife/", section: "lore", raw: "links /star-rangers/seasons/s07/e01/s07e01c02/" },
    { title: "Unrelated", url: "/lore/unrelated/", section: "lore", raw: "links /star-rangers/seasons/s07/e01/s07e01c03/" },
    { title: "Revealed", url: "/glossary/revealed/", section: "glossary", raw: "", revealedBy: "s07e01c02" },
    { title: "Revised", url: "/glossary/revised/", section: "glossary", raw: "", revisedBy: ["s01e01c01", "s07e01c02"] },
    { title: "Craft", url: "/journal/craft/", section: "journal", raw: "on /star-rangers/seasons/s07/e01/s07e01c02/" },
    { title: "A chapter", url: "/seasons/s07/e01/s07e01c03/", section: "chapter", raw: "/seasons/s07/e01/s07e01c02/" },
  ];
  const out = findArchiveBacklinks(chapter, pages);
  assert.deepEqual(out.map((p) => [p.section, p.title, p.relation]), [
    ["lore", "Saint Aoife", "cites"],
    ["glossary", "Revealed", "revealed"],
    ["glossary", "Revised", "revised"],
    ["codex", "Alpha", "cites"],
    ["codex", "Zeta", "cites"],
    ["journal", "Craft", "cites"],
  ]);
  assert.equal(out[0].label, "Lore");
});

test("findArchiveBacklinks returns nothing for a chapter with no targets or an empty page set", () => {
  assert.deepEqual(findArchiveBacklinks({ id: "bad" }, [{ title: "x", url: "/lore/x/", section: "lore", raw: "/seasons/" }]), []);
  assert.deepEqual(findArchiveBacklinks(chapter, []), []);
  assert.deepEqual(findArchiveBacklinks(chapter, undefined), []);
});
