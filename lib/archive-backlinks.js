"use strict";

// lib/archive-backlinks.js — which Archive pages read a given chapter.
//
// The chapter layout's "In the Archive" block (src/_includes/chapter.njk,
// since 2026-10-02) lists the lore, glossary, codex and journal pages that
// cite a chapter, so a reader standing on the prose can reach the record's
// own commentary on it. Nothing here is authored: a page is listed because
// its source links to the chapter's URL or its permanent /c/<comment_id>/
// alias, or because its `revealed_by` / `revised_by` names the chapter. The
// list is therefore derived on every build and cannot go stale, which is the
// 2026-09-20 ruling (the Archive is an additional point of view, revelation
// tracked as revision) made reachable from the chapter it reads.
//
// Matching is on the path *without* the site prefix (`/seasons/s07/e01/
// s07e01c02/`), because source files carry `/star-rangers/...` and a fork
// rewrites that prefix at output time (SITE_PATH_PREFIX); the source is what
// is scanned, and the source is prefix-stable.

const SECTION_ORDER = ["lore", "glossary", "codex", "journal"];
const SECTION_LABELS = { lore: "Lore", glossary: "Glossary", codex: "Codex", journal: "Journal" };

const CHAPTER_ID = /^s(\d{2})e(\d{2})c(\d{2})$/;

// The two paths a page can use to cite a chapter: its season URL and its
// permanent citation alias (src/chapter-aliases.njk). Prefix-free.
function chapterLinkTargets(chapterData) {
  const targets = [];
  if (!chapterData) return targets;
  const m = typeof chapterData.id === "string" ? CHAPTER_ID.exec(chapterData.id) : null;
  if (m) targets.push(`/seasons/s${m[1]}/e${m[2]}/${chapterData.id}/`);
  if (typeof chapterData.comment_id === "string" && chapterData.comment_id) {
    targets.push(`/c/${chapterData.comment_id}/`);
  }
  return targets;
}

function citesChapter(raw, targets) {
  if (typeof raw !== "string" || !Array.isArray(targets) || !targets.length) return false;
  return targets.some((t) => raw.includes(t));
}

function namesChapter(value, chapterId) {
  if (!chapterId) return false;
  if (typeof value === "string") return value === chapterId;
  if (Array.isArray(value)) return value.includes(chapterId);
  return false;
}

// pages: [{ title, url, section, raw, revealedBy, revisedBy }]
// returns: [{ title, url, section, label, relation }], relation one of
// "revealed" | "revised" | "cites", in section order then title order.
function findArchiveBacklinks(chapterData, pages) {
  const targets = chapterLinkTargets(chapterData);
  const chapterId = chapterData && typeof chapterData.id === "string" ? chapterData.id : null;
  const out = [];
  for (const page of pages || []) {
    if (!page || !SECTION_ORDER.includes(page.section) || typeof page.title !== "string" || typeof page.url !== "string") continue;
    let relation = null;
    if (namesChapter(page.revealedBy, chapterId)) relation = "revealed";
    else if (namesChapter(page.revisedBy, chapterId)) relation = "revised";
    else if (citesChapter(page.raw, targets)) relation = "cites";
    if (!relation) continue;
    out.push({ title: page.title, url: page.url, section: page.section, label: SECTION_LABELS[page.section], relation });
  }
  return out.sort((a, b) =>
    SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section) ||
    a.title.localeCompare(b.title, "en", { sensitivity: "base" })
  );
}

module.exports = { SECTION_ORDER, SECTION_LABELS, chapterLinkTargets, citesChapter, findArchiveBacklinks };
