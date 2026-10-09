"use strict";

// Un-link anchors that point at pages THIS build excludes.
//
// A narrowed edition, and the general tier under the thread gate, still
// build every page at its normal URL: an excluded page renders the
// "Not included in this edition" placeholder (src/_includes/excluded.njk) so
// no link ever 404s. Until 2026-10-09 the links themselves stayed live, so a
// reader clicking a name on Brother Fintan's page arrived at a stub that sent
// them to another domain with no idea what they had been about to read. A
// site review that day read the four such stubs reachable from inside the
// canonical site as dead ends, and Dermot chose this: the stub stays for a
// direct hit (and says what the page is - see excluded.njk), but no reader
// reaches it by clicking, because a link to an excluded page is rendered as
// plain text.
//
// Pure function so test/unlink-excluded.test.js can pin it without booting
// Eleventy. The set of excluded URLs is gathered by a collection in
// .eleventy.js (collections resolve before transforms run) and handed in.
//
// What counts as a link to an excluded page: an <a> whose href is a
// root-relative /star-rangers/ URL (the only form the corpus writes - see the
// SITE_PATH_PREFIX transform, which runs AFTER this one for the same reason)
// whose path, with any fragment or query stripped and a trailing slash
// ensured, is in the set. The anchor's inner HTML is kept verbatim inside a
// <span class="gated-link"> that carries the original path in a data
// attribute, so a stylesheet can mark it and a curious reader can still see
// where the page lives. Nothing else in the content is touched.

const ANCHOR = /<a\b([^>]*)\bhref="(\/star-rangers\/[^"]*)"([^>]*)>([\s\S]*?)<\/a>/g;

function normalisePath(href) {
  let p = String(href).split("#")[0].split("?")[0];
  if (!p.endsWith("/")) p += "/";
  return p;
}

/**
 * @param {string} html rendered page content
 * @param {Set<string>|Iterable<string>} excludedUrls URLs (with trailing slash, no prefix) of pages this build excludes
 * @param {object} [opts]
 * @param {string} [opts.prefix="/star-rangers"] the hardcoded URL prefix the corpus writes
 * @returns {string}
 */
function unlinkExcluded(html, excludedUrls, opts = {}) {
  const prefix = opts.prefix || "/star-rangers";
  const set = excludedUrls instanceof Set ? excludedUrls : new Set(excludedUrls || []);
  if (!set.size || typeof html !== "string" || !html.includes("<a")) return html;
  return html.replace(ANCHOR, (whole, before, href, after, inner) => {
    const full = normalisePath(href);
    const url = full.startsWith(prefix + "/") ? full.slice(prefix.length) : full;
    if (!set.has(url)) return whole;
    return `<span class="gated-link" data-gated-url="${url}" title="Not carried by this edition">${inner}</span>`;
  });
}

module.exports = { unlinkExcluded, normalisePath };
