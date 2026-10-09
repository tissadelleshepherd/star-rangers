// Shared markdown-it setup for the :::pov and ::::: scene custom containers
// used in chapter content. Used both by .eleventy.js (for the normal
// chapter-page render) and src/_data/scenePovPages.js (which needs the raw
// token stream to split a chapter's body into individual scene/POV pages).
//
// Chapter authors must write a scene wrapper with *more* colons than any
// :::pov block nested inside it (5 is the convention here; any count above
// 3 works) - NOT via markdown-it-container's `marker` option, which sets
// the repeating marker *character/string unit* rather than how many colons
// are required (`marker: ":".repeat(5)` was tried here first and actually
// required 15 colons - 3 reps of a 5-char unit - not 5). The real
// mechanism: each container instance's required closing-fence length is
// however many colons its own opening line actually used (at least 3), so
// a plain "::::: scene 1" / ":::::" pair (still the ':' marker both rules
// share) naturally can't be closed early by a nested "::: pov ... :::"
// block, since 3 < 5. Existing chapters with no scene wrapper at all are
// treated as one implicit scene - see extractScenes() in scenePovPages.js.
//
// TIER-GATED POV BLOCKS (Dermot's direction, 2026-09-03, confirmed the same
// day - story-bible/intake-2026-09-03.md): the reading tiers nest, and "the
// contemplative edition may have additional POV scenes for any chapter". A
// block written as
//
//   ::: pov brother-fintan tier=contemplative
//
// renders only on a build whose edition sits at that tier or above
// (lib/editions.js TIER_ORDER); on every lower tier it is dropped from the
// token stream before rendering - absent, not a placeholder - so a chapter
// reads as if it were never there. That is the overlay rule: every tier's
// reading of a chapter must be complete without the blocks the tier above
// adds, the children's self-containment rule climbing the ladder. A block
// with no tier= is visible everywhere, which is every block written before
// this existed. The build's own tier comes from its edition (`getEdition().tier`,
// resolved from EDITION/THEME); an unfiltered local build with no edition
// resolves to the default edition, which Dermot placed at the general tier,
// so a contemplative block never leaks into a build that did not ask for it.
const markdownIt = require("markdown-it");
const container = require("markdown-it-container");
const anchor = require("markdown-it-anchor");
const { tierVisible } = require("./editions");

// The id a heading gets, so a fragment link can land on it. Until 2026-10-09
// headings carried no id at all, and every "#the-name" in the corpus was a
// dead link that scripts/check-internal-links.js passed because it checked
// only the path. The shape is the one the existing fragments were written
// to, which is GitHub's: lowercase; drop punctuation (the colon and comma in
// "In the Corps: Rare, and Valued", the apostrophe in "Doesn't Hold", an
// em-dash) rather than turning it into a hyphen; keep letters and digits in
// any script, so an Irish fada survives; keep hyphens already in the words;
// and run each stretch of whitespace into one hyphen. A heading repeated on
// one page gets "-1", "-2" from markdown-it-anchor. check-internal-links.js
// resolves fragments through the renderer, not through this function, so
// the checker and the build cannot disagree.
function headingSlug(text) {
  return String(text)
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

const POV_INFO = /^pov\s+(\S+)(?:\s+tier=(\S+))?\s*$/;

function parseInfo(pattern, info) {
  const match = info.trim().match(pattern);
  return match ? match[1] : "";
}

// { id, tier } from a pov container's info string, or null if it is not a
// well-formed pov opener. Shared with scenePovPages.js so the two parsers
// cannot disagree about what a block's tier is.
function parsePovInfo(info) {
  const match = String(info || "").trim().match(POV_INFO);
  if (!match) return null;
  return { id: match[1], tier: match[2] || null };
}

// A block is visible on a build when it names no tier, or names one at or
// below the build's own - lib/editions.js's tierVisible, the one predicate
// shared with the thread gate in lib/content-filter.js (since 2026-09-04), so
// a POV block and a whole thread can never disagree about what "at or below"
// means. Kept under this name because it is what the renderer and .eleventy.js
// call; it IS tierVisible.
const povTierVisible = tierVisible;

// Removes every tier-gated pov block the build may not show, opener to closer
// inclusive. Runs as a core rule after block parsing, so both the normal
// chapter render and scenePovPages' walk over md.parse() see the same stream.
function tierGateRule(buildTier) {
  return function tierGate(state) {
    const out = [];
    let dropping = false;
    for (const token of state.tokens) {
      if (!dropping && token.type === "container_pov_open") {
        const info = parsePovInfo(token.info);
        if (info && !povTierVisible(info.tier, buildTier)) {
          dropping = true;
          continue;
        }
      }
      if (dropping) {
        if (token.type === "container_pov_close") dropping = false;
        continue;
      }
      out.push(token);
    }
    state.tokens = out;
  };
}

// The human-readable name for a pov block, from the chapter's own `povs`
// front matter when the renderer is handed it. Eleventy passes the page's
// data cascade to markdown-it as `env`, so on a chapter page `env.povs` is
// the list the layout's buttons are built from and the header can carry the
// same label server-side - "Line Captain Tissadelle Shepherd (Human)" rather
// than "tissadelle". Until 2026-09-30 the header held the raw id and
// src/js/pov.js rewrote it on load, which left every reader that never runs
// the script (a screen reader on a no-JS build, the OS read-aloud of a reader
// view, the LLM export) hearing a slug. Falls back to the id where no label
// is known, which is what the unit tests and scenePovPages' bare env get.
function povLabel(env, id) {
  const povs = env && Array.isArray(env.povs) ? env.povs : [];
  const wanted = String(id).toLowerCase();
  const hit = povs.find((p) => p && String(p.id).toLowerCase() === wanted && p.label);
  return hit ? String(hit.label) : id;
}

function createMarkdownRenderer(options = {}) {
  const buildTier = options.buildTier || "general";
  const md = markdownIt({ html: true });

  // Rendering is synchronous, so a depth counter is enough to know whether a
  // pov header sits inside a scene (h3, under the scene's h2) or in a chapter
  // with no scene wrapper (h2, straight under the title). Both the scene
  // heading and the pov heading exist for readers that navigate or listen
  // by headings, and both are visible: the scene label was hidden for a day
  // because the body had never shown scene numbers, until Dermot ruled it
  // visible so that readers speaking visible text only (Edge's Read Aloud)
  // announce a scene change too; the pov name is the visible header it always
  // was, now a heading rather than a span.
  let sceneDepth = 0;

  md.use(container, "scene", {
    validate: (params) => /^scene\s+(\S.*)$/.test(params.trim()),
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        sceneDepth += 1;
        const num = md.utils.escapeHtml(parseInfo(/^scene\s+(\S.*)$/, tokens[idx].info));
        return (
          `<section class="scene" data-scene="${num}" aria-label="Scene ${num}">\n` +
          `<h2 class="scene__label">Scene ${num}</h2>\n`
        );
      }
      sceneDepth = Math.max(0, sceneDepth - 1);
      return "</section>\n";
    }
  });

  md.use(container, "pov", {
    validate: (params) => POV_INFO.test(params.trim()),
    render(tokens, idx, _opts, env) {
      if (tokens[idx].nesting === 1) {
        const info = parsePovInfo(tokens[idx].info) || { id: "", tier: null };
        const id = md.utils.escapeHtml(info.id);
        const label = md.utils.escapeHtml(povLabel(env, info.id));
        const tierAttr = info.tier ? ` data-tier="${md.utils.escapeHtml(info.tier)}"` : "";
        const h = sceneDepth > 0 ? "h3" : "h2";
        return (
          `<section class="pov-block" data-pov="${id}"${tierAttr} aria-label="POV: ${label}">\n` +
          `<header class="pov-header"><${h} class="pov-header__name">${label}</${h}></header>\n`
        );
      }
      return "</section>\n";
    }
  });

  md.core.ruler.push("tier_gate", tierGateRule(buildTier));

  // Heading ids, after the tier gate so a heading inside a dropped block
  // neither gets an id nor costs a visible duplicate its plain slug. No
  // permalink markup and no tabindex: the id is all a fragment link needs,
  // and the headings' HTML otherwise stays as it was. The scene and pov
  // headers above are rendered as strings, not heading tokens, so they are
  // untouched. scenePovPages.js walks md.parse() of the whole chapter, so a
  // POV page's headings carry the ids the chapter page gave them.
  md.use(anchor, { slugify: headingSlug, tabIndex: false });

  return md;
}

module.exports = { createMarkdownRenderer, headingSlug, parsePovInfo, povTierVisible };
