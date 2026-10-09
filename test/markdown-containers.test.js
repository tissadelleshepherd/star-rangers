// Pins lib/markdown-containers.js — above all the fence-length rule the
// scene/POV structure depends on: a 5-colon "::::: scene" wrapper must not be
// closed early by a nested 3-colon "::: pov" block's closing fence. That
// behaviour lives in markdown-it-container, not in our code, so a dependency
// bump that changed it would silently corrupt scene splitting for every
// chapter (src/_data/scenePovPages.js parses the same token stream). Nothing
// pinned it until now.
const test = require("node:test");
const assert = require("node:assert/strict");

const { createMarkdownRenderer, headingSlug } = require("../lib/markdown-containers");

const md = createMarkdownRenderer();

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

test("a scene wrapper survives nested pov blocks (the fence-length rule)", () => {
  const html = md.render(
    [
      "::::: scene 1",
      "::: pov aldera",
      "Text A.",
      ":::",
      "::: pov brin",
      "Text B.",
      ":::",
      ":::::",
      ""
    ].join("\n")
  );

  assert.ok(html.includes('<section class="scene" data-scene="1" aria-label="Scene 1">'));
  assert.equal(count(html, 'class="pov-block"'), 2);
  // The nested ::: closes only its own pov block: both povs render INSIDE
  // the scene, so the output ends pov-close then scene-close. If the
  // fence-length rule regressed, the first ::: would close the scene and
  // this trailing shape would break.
  assert.ok(html.trimEnd().endsWith("</section>\n</section>"));
  assert.ok(html.indexOf("Text B.") < html.lastIndexOf("</section>"));
});

test("a pov block carries its id in data-pov, aria-label and the header", () => {
  const html = md.render("::: pov aldera\nHer view.\n:::\n");
  assert.ok(html.includes('data-pov="aldera"'));
  assert.ok(html.includes('aria-label="POV: aldera"'));
  assert.ok(html.includes('class="pov-header__name">aldera</h'));
});

test("pov blocks render standalone when a chapter has no scene wrapper", () => {
  const html = md.render("::: pov aldera\nHer view.\n:::\n");
  assert.equal(count(html, 'class="pov-block"'), 1);
  assert.ok(!html.includes('class="scene"'));
});

test("the scene number and pov id are HTML-escaped into attributes", () => {
  const scene = md.render('::::: scene 1 "extra"\nBody.\n:::::\n');
  assert.ok(scene.includes('data-scene="1 &quot;extra&quot;"'));

  const pov = md.render('::: pov x"y\nBody.\n:::\n');
  assert.ok(pov.includes('data-pov="x&quot;y"'));
  assert.ok(!pov.includes('data-pov="x"y"'));
});

test("an info string that fails validation renders as plain text, not a container", () => {
  // "::: pov" with no id and ":::: sceneless" match neither validator.
  const html = md.render("::: pov\nBody.\n:::\n");
  assert.ok(!html.includes("pov-block"));

  const scene = md.render("::::: scene\nBody.\n:::::\n");
  assert.ok(!scene.includes('class="scene"'));
});

// TIER-GATED POV BLOCKS (2026-09-03): `::: pov <id> tier=contemplative`
// renders only on a build at that tier or above, and is dropped from the
// token stream everywhere else. These pin the gate on both sides, the
// default build tier, the attribute, and that an ungated block is untouched.
const { parsePovInfo, povTierVisible } = require("../lib/markdown-containers");

const gated = [
  "::::: scene 1",
  "::: pov aldera",
  "Seen by all.",
  ":::",
  "::: pov brother-fintan tier=contemplative",
  "Seen only in the night office.",
  ":::",
  ":::::",
  ""
].join("\n");

test("a contemplative block is absent on a general build, and on the children's and young-adult builds", () => {
  for (const buildTier of ["general", "young-adult", "children"]) {
    const html = createMarkdownRenderer({ buildTier }).render(gated);
    assert.equal(count(html, 'class="pov-block"'), 1, buildTier);
    assert.ok(html.includes("Seen by all."));
    assert.ok(!html.includes("Seen only in the night office."), buildTier);
    assert.ok(!html.includes("brother-fintan"), buildTier);
    // the scene wrapper still closes cleanly around what remains
    assert.ok(html.trimEnd().endsWith("</section>\n</section>"));
  }
});

test("a contemplative block renders on a contemplative build, carrying its tier", () => {
  const html = createMarkdownRenderer({ buildTier: "contemplative" }).render(gated);
  assert.equal(count(html, 'class="pov-block"'), 2);
  assert.ok(html.includes("Seen only in the night office."));
  assert.ok(html.includes('data-pov="brother-fintan" data-tier="contemplative"'));
});

test("a build with no tier is the general tier, so it does not show a contemplative block", () => {
  const html = createMarkdownRenderer().render(gated);
  assert.equal(count(html, 'class="pov-block"'), 1);
});

test("an ungated block never carries data-tier and is visible at every tier", () => {
  for (const buildTier of ["children", "young-adult", "general", "contemplative"]) {
    const html = createMarkdownRenderer({ buildTier }).render("::: pov aldera\nHer view.\n:::\n");
    assert.ok(html.includes('data-pov="aldera" aria-label'));
    assert.ok(!html.includes("data-tier"));
  }
});

test("parsePovInfo and povTierVisible are the shared predicate", () => {
  assert.deepEqual(parsePovInfo("pov aldera"), { id: "aldera", tier: null });
  assert.deepEqual(parsePovInfo("pov aldera tier=contemplative"), { id: "aldera", tier: "contemplative" });
  assert.equal(parsePovInfo("pov"), null);
  assert.equal(povTierVisible(null, "children"), true);
  assert.equal(povTierVisible("contemplative", "general"), false);
  assert.equal(povTierVisible("contemplative", "contemplative"), true);
  assert.equal(povTierVisible("children", "young-adult"), true);
  // an unknown build tier reads as general
  assert.equal(povTierVisible("contemplative", undefined), false);
  assert.equal(povTierVisible("general", undefined), true);
});

// Since 2026-09-30 the header carries the chapter's own label when Eleventy
// hands the renderer the page data as env, and headings mark both scene and
// pov boundaries for readers that navigate or listen by them. Pinned because
// the label and the heading levels are what a screen reader or an OS
// read-aloud actually says at a boundary, and nothing else checks them.
test("a pov header carries the chapter's label from env.povs, and the aria-label follows it", () => {
  const env = { povs: [{ id: "Aldera", label: "Aldera Vane (Human)" }] };
  const html = md.render(["::: pov aldera", "Text.", ":::", ""].join("\n"), env);
  assert.ok(html.includes('aria-label="POV: Aldera Vane (Human)"'));
  assert.ok(html.includes('class="pov-header__name">Aldera Vane (Human)</h'));
  assert.ok(html.includes('data-pov="aldera"'), "the id stays the machine key");
});

test("scene and pov boundaries are headings: an h2 for the scene, h3 for a pov inside it, h2 for a pov with no scene", () => {
  const inScene = md.render(["::::: scene 2", "::: pov brin", "Text.", ":::", ":::::", ""].join("\n"));
  assert.ok(inScene.includes('<h2 class="scene__label">Scene 2</h2>'));
  assert.ok(inScene.includes('<h3 class="pov-header__name">brin</h3>'));
  const noScene = md.render(["::: pov brin", "Text.", ":::", ""].join("\n"));
  assert.ok(noScene.includes('<h2 class="pov-header__name">brin</h2>'));
  assert.ok(!noScene.includes("scene__label"));
});


// Heading ids (markdown-it-anchor, since 2026-10-09). Pinned because the
// corpus's fragment links were written to this exact shape before any id
// existed, and a slugify that hyphenated punctuation instead of dropping it
// would silently break every one of them again while the build stayed green.
test("headings carry GitHub-shaped ids, and nothing else is added to them", () => {
  const html = md.render(
    [
      "## In the Corps: Rare, and Valued",
      "## An Origin the Record Doesn't Hold",
      "## Past, Present, and Future",
      "## Past, Present, and Future",
      "## The [Name](/star-rangers/)",
      ""
    ].join("\n\n")
  );
  assert.ok(html.includes('<h2 id="in-the-corps-rare-and-valued">'), "punctuation is dropped, not hyphenated");
  assert.ok(html.includes('<h2 id="an-origin-the-record-doesnt-hold">'), "an apostrophe is dropped");
  assert.ok(html.includes('<h2 id="past-present-and-future">'));
  assert.ok(html.includes('<h2 id="past-present-and-future-1">'), "a repeated heading is uniquified");
  assert.ok(html.includes('<h2 id="the-name">'), "the id comes from the heading's text, markup aside");
  assert.ok(!html.includes("tabindex"), "no tabindex");
  assert.ok(!html.includes("header-anchor"), "no permalink markup");
});

test("headingSlug keeps letters in any script and hyphens already in the words", () => {
  assert.equal(headingSlug("Quiet-Zone Tunnels: Undetected Natural Fold Conduits"), "quiet-zone-tunnels-undetected-natural-fold-conduits");
  assert.equal(headingSlug("Garda an Uachtaráin — the President's Guard"), "garda-an-uachtaráin-the-presidents-guard");
});

test("a heading inside a tier-gated block the build drops gets no id and costs no slug", () => {
  const src = [
    "::: pov asteria tier=contemplative",
    "## The Same Heading",
    ":::",
    "## The Same Heading",
    ""
  ].join("\n");
  const general = createMarkdownRenderer({ buildTier: "general" }).render(src);
  assert.ok(general.includes('<h2 id="the-same-heading">'), "the visible heading keeps the plain slug");
  assert.ok(!general.includes("the-same-heading-1"));
  const contemplative = createMarkdownRenderer({ buildTier: "contemplative" }).render(src);
  assert.ok(contemplative.includes('<h2 id="the-same-heading">') && contemplative.includes('<h2 id="the-same-heading-1">'));
});
