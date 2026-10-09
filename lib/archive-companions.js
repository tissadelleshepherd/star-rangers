"use strict";

// lib/archive-companions.js — which Archive entries accompany a chapter.
//
// The chapter layout's "From the Archive" aside (src/_includes/chapter.njk,
// since 2026-10-05) is the Archive accompanying the narrative: the entries
// for the terms a chapter meets, each shown with the entry's own one-line
// account, in the Archive's voice, where the reader is reading. Dermot's
// direction (story-bible/intake-2026-10-05.md, last section): the Archive as
// the in-story equivalent of the Book in the Hitchhiker's Guide television
// series, "in which the glossary accompanies the narrative" — the device,
// not the register.
//
// An entry accompanies a chapter for exactly two reasons, and both are
// authored, because the measurement that preceded this module found the
// prose and the Archive do not share vocabulary at the headword level (9
// glossary titles named across 16 of 94 chapters, by the case-sensitive rule
// lib/glossary-crosslinks.js runs on): a Book derived by headword would fire
// on fewer than one entry a chapter.
//
//   1. The page's `revealed_by` names the chapter: a page the chapter first
//      establishes belongs beside it by definition. Derived from the field
//      the 2026-09-20 revelation ruling added, so nothing is re-declared.
//   2. The chapter's own `related:` list names the page by title, resolved
//      the way every other `related:` list is (lib/related-terms.js): exact
//      title, glossary before lore, against the collections THIS BUILD
//      carries, so an entry a narrowed edition excludes drops out instead of
//      pointing at a placeholder. scripts/check-related-terms.js catches a
//      stale title on the full build.
//
// The text shown is the entry's own: a glossary entry's `short`, which
// stands alone by the 2026-10-02 rule; a lore or codex page's
// `description`. On a children's-tier build the `plain:` line takes its
// place where one exists, as it does on the glossary index.

const SECTION_ORDER = ["glossary", "lore", "codex"];
const SECTION_LABELS = { glossary: "Glossary", lore: "Lore", codex: "Codex" };

function namesChapter(value, chapterId) {
  if (!chapterId) return false;
  if (typeof value === "string") return value === chapterId;
  if (Array.isArray(value)) return value.includes(chapterId);
  return false;
}

// The one-line account an entry shows beside the chapter.
function companionText(page, tier) {
  const plain = typeof page.plain === "string" ? page.plain.trim() : "";
  if (tier === "children" && plain) return plain;
  const own = typeof page.short === "string" && page.short.trim()
    ? page.short.trim()
    : (typeof page.description === "string" ? page.description.trim() : "");
  return own || plain;
}

// pages: [{ title, url, section, category, short, description, plain, revealedBy }]
// related: the chapter's `related:` front matter (titles), or undefined
// returns: [{ title, url, section, label, category, text, relation }],
// relation one of "revealed" | "named", deduplicated by url, in section
// order then title order so the aside reads the same on every build.
function findArchiveCompanions(chapterData, related, pages, options) {
  const tier = options && options.tier;
  const chapterId = chapterData && typeof chapterData.id === "string" ? chapterData.id : null;
  const usable = (pages || []).filter((p) =>
    p && SECTION_ORDER.includes(p.section) && typeof p.title === "string" && typeof p.url === "string");

  const byUrl = new Map();
  const add = (page, relation) => {
    if (byUrl.has(page.url)) return;
    byUrl.set(page.url, {
      title: page.title,
      url: page.url,
      section: page.section,
      label: SECTION_LABELS[page.section],
      category: typeof page.category === "string" ? page.category : "",
      text: companionText(page, tier),
      relation,
    });
  };

  for (const page of usable) {
    if (namesChapter(page.revealedBy, chapterId)) add(page, "revealed");
  }

  // A `related:` title resolves glossary-first, then lore, then codex, the
  // same precedence lib/related-terms.js uses for the two it knows.
  for (const term of Array.isArray(related) ? related : []) {
    if (typeof term !== "string" || !term) continue;
    const match = SECTION_ORDER
      .map((section) => usable.find((p) => p.section === section && p.title === term))
      .find(Boolean);
    if (match) add(match, "named");
  }

  return Array.from(byUrl.values()).sort((a, b) =>
    SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section) ||
    a.title.localeCompare(b.title, "en", { sensitivity: "base" })
  );
}

module.exports = { SECTION_ORDER, SECTION_LABELS, companionText, findArchiveCompanions };
