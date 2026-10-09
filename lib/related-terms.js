"use strict";

// Resolves a front-matter `related:` term to the page it names, by exact
// title, against the collections THIS BUILD carries - glossary first, then
// lore. Returns the page's url, or null when no included page carries the
// title.
//
// Null matters, and is the reason this is its own module (2026-10-04). The
// collections are already narrowed by lib/content-filter.js, so on a
// narrowed edition a term whose page is excluded does not resolve, and the
// older `glossaryUrl` filter in .eleventy.js papered over that by falling
// back to /glossary/: on undercover-pets.com every Related Term on the one
// glossary entry it carries (Smart Pet) linked to the glossary index, where
// none of them is. A layout that can tell a miss from a hit can leave the
// term unlinked - or out - instead. The same null is what a stale term
// (a retitled page) produces on the full build, which is what
// scripts/check-related-terms.js exists to catch before it ships.
function resolveRelatedTerm(term, glossaryCollection, loreCollection) {
  if (typeof term !== "string" || !term) return null;
  const match =
    (glossaryCollection || []).find((item) => item && item.data && item.data.title === term) ||
    (loreCollection || []).find((item) => item && item.data && item.data.title === term);
  return match && match.url ? match.url : null;
}

// The subset of a `related:` list that resolves on this build, each with
// its url, in the order the front matter gave them. A layout renders this
// and omits the aside when it is empty.
function resolvedRelatedTerms(related, glossaryCollection, loreCollection) {
  const out = [];
  for (const term of Array.isArray(related) ? related : []) {
    const url = resolveRelatedTerm(term, glossaryCollection, loreCollection);
    if (url) out.push({ term, url });
  }
  return out;
}

module.exports = { resolveRelatedTerm, resolvedRelatedTerms };
