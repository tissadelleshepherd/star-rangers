"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { unlinkExcluded, normalisePath } = require("../lib/unlink-excluded");

const excluded = new Set(["/lore/communion-of-the-called/", "/threads/church-space/"]);

test("a link to an excluded page becomes a span that keeps the text and the path", () => {
  const html = '<p>See <a href="/star-rangers/lore/communion-of-the-called/">the Communion</a> today.</p>';
  assert.equal(
    unlinkExcluded(html, excluded),
    '<p>See <span class="gated-link" data-gated-url="/lore/communion-of-the-called/" title="Not carried by this edition">the Communion</span> today.</p>'
  );
});

test("a link to an included page is left exactly as it was", () => {
  const html = '<a href="/star-rangers/lore/fellowship-of-light/" class="x">Fellowship</a>';
  assert.equal(unlinkExcluded(html, excluded), html);
});

test("fragments, queries and a missing trailing slash all resolve to the page", () => {
  for (const href of [
    "/star-rangers/threads/church-space/#faq",
    "/star-rangers/threads/church-space?x=1",
    "/star-rangers/threads/church-space",
  ]) {
    const out = unlinkExcluded(`<a href="${href}">Church Space</a>`, excluded);
    assert.match(out, /^<span class="gated-link" data-gated-url="\/threads\/church-space\/" title="Not carried by this edition">Church Space<\/span>$/, href);
  }
});

test("attributes before and after href, and markup inside the anchor, are handled", () => {
  const html = '<a class="codex-card" href="/star-rangers/threads/church-space/" rel="x"><h2>Church <em>Space</em></h2></a>';
  assert.equal(
    unlinkExcluded(html, excluded),
    '<span class="gated-link" data-gated-url="/threads/church-space/" title="Not carried by this edition"><h2>Church <em>Space</em></h2></span>'
  );
});

test("absolute and external links are never touched, even to the same path", () => {
  const html = '<a href="https://church-space.site/threads/church-space/">there</a> <a href="/other/threads/church-space/">here</a>';
  assert.equal(unlinkExcluded(html, excluded), html);
});

test("an empty set, or content with no anchors, returns the input untouched", () => {
  assert.equal(unlinkExcluded("<p>plain</p>", excluded), "<p>plain</p>");
  const html = '<a href="/star-rangers/threads/church-space/">x</a>';
  assert.equal(unlinkExcluded(html, new Set()), html);
});

test("normalisePath strips fragment and query and ensures the trailing slash", () => {
  assert.equal(normalisePath("/star-rangers/a/b#c"), "/star-rangers/a/b/");
  assert.equal(normalisePath("/star-rangers/a/b/?q"), "/star-rangers/a/b/");
});
