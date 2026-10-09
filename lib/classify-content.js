// Path-based content classification and the whole-page inclusion decision,
// extracted verbatim from .eleventy.js so the logic is unit-testable
// (test/classify-content.test.js) without booting Eleventy. .eleventy.js
// remains the only production consumer.
const {
  isCharacterIncluded,
  isChapterIncluded,
  isTopicPageIncluded,
  isThreadIncluded,
  isTierExcluded
} = require("./content-filter");

// Classifies a content file by where it LIVES (its inputPath), not by its
// `layout` front-matter field. `layout` is itself one of the eleventyComputed
// keys overridden in .eleventy.js, so reading `data.layout` from inside a
// computed field's own evaluator is unsafe: Eleventy's computed-data
// resolution doesn't guarantee `layout` has already settled to its ORIGINAL
// value by the time some other field (title, description, ogImage, ...) asks
// for it - it can just as easily see the ALREADY-REWRITTEN "excluded.njk",
// which matches none of the checks below and silently falls through to the
// final `return true`. That mismatch let an excluded page's real title/
// description/image leak into its meta tags even while its body correctly
// showed the placeholder (layout itself, resolved first, was fine - every
// OTHER field reading data.layout afterward wasn't). inputPath is never
// touched by the computed overrides, so it can't suffer the same hazard.
// Every content dir's own top-level (and per-season/per-episode) `index.md`
// listing page uses `layout: base.njk`, not a content layout, so those are
// excluded here the same way the timeline check already excluded its own.
function classifyContentPath(inputPath) {
  if (!inputPath || inputPath.endsWith("/index.md")) return null;
  if (inputPath.includes("/characters/")) return "character";
  if (inputPath.includes("/seasons/")) return "chapter";
  if (inputPath.includes("/lore/")) return "lore";
  if (inputPath.includes("/glossary/")) return "glossary";
  if (inputPath.includes("/codex/")) return "codex";
  if (inputPath.includes("/timeline/")) return "timeline";
  if (inputPath.includes("/journal/")) return "journal";
  return null;
}

// Whether a lore/timeline/glossary page earns inclusion either the normal
// way (tag/category match) or because some included character's own bio
// links to it directly - see getRelatedContentUrls's own comment for why
// that second path exists: a character page is already the record of what
// background matters for understanding them.
function isRelatedTopicPageIncluded(data, filter, url) {
  // The relatedUrls fallback below exists to pull in background an INCLUDED
  // character's own bio links to (see getRelatedContentUrls); it must not
  // become a backdoor around a thread's tier gate, so that's checked
  // first and short-circuits the whole thing regardless of relatedUrls.
  if (isTierExcluded(data, filter)) return false;
  return isTopicPageIncluded(data, filter) || filter.relatedUrls.has(url);
}

// Drives .eleventy.js's eleventyComputed override: decides whether a
// standalone content-leaf page renders its real content or a placeholder.
// Anything outside the 6 filterable content types plus a thread's own
// landing page (nav/index/structural pages) always passes through.
// Deliberately does NOT short-circuit on `!filter.active` the way it used
// to - a tier-gated thread (lib/storyline-threads.js's `tier`) must stay
// hidden on the unfiltered full-site build too when that build sits below
// the tier, and each isXIncluded call below already applies that gate
// before its own `!filter.active` check, so delegating unconditionally is
// what makes that work.
function isContentIncluded(data, filter) {
  const inputPath = data.page && data.page.inputPath;
  const url = data.page && data.page.url;
  const kind = classifyContentPath(inputPath);
  if (kind === "character") return isCharacterIncluded(data, filter);
  if (kind === "chapter") return isChapterIncluded(data, filter);
  if (kind === "lore" || kind === "glossary" || kind === "timeline") {
    return isRelatedTopicPageIncluded(data, filter, url);
  }
  if (kind === "codex") return isTopicPageIncluded(data, filter);
  // Journal entries are out-of-character author notes about making the work,
  // not the work. They were falling through to the unconditional `return true`
  // below, so every branded edition published them regardless of its filters -
  // which meant a search for the book's own name could land a reader on the
  // Fellowship of Light or Undercover Pets framing of an essay about naming
  // decisions. Filtered like codex: on a narrowed edition an entry appears only
  // if its tags match, and on the unbranded full site `filter.active` is false
  // so all of them still appear.
  if (kind === "journal") return isTopicPageIncluded(data, filter);
  // A thread's own standalone landing page (src/threads/<id>/index.md)
  // opts into this system via a `threadId` front-matter field, since it's
  // otherwise just a hand-written base.njk page outside the content dirs
  // above - see src/threads/founding-era/index.md for the shape without it.
  if (data.threadId) return isThreadIncluded(data.threadId, filter);
  return true;
}

module.exports = { classifyContentPath, isRelatedTopicPageIncluded, isContentIncluded };
