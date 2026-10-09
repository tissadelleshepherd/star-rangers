// Cross-linking within a section of reference entries (the glossary, the
// lore): finds, in one entry's body, the first mention of every *other* entry
// in the same section that the body does not already link to, and wraps it in
// a link to that entry. Consumed by scripts/link-glossary-terms.js (report or
// rewrite) and pinned by test/glossary-crosslinks.test.js.
//
// The rules, each of which exists because of a case a survey turned up:
//
// - A mention is matched by the entry's title or one of a few mechanical
//   variants of it: the title without its trailing "(ABC)" acronym or
//   parenthetical, the parenthetical on its own, the head of a "Head:
//   Subtitle" title, the title without a leading "The ", an "s"/"es" plural,
//   and a singular for a title that is itself plural. Matching is
//   case-sensitive and whole-word: "the Interval" capitalised is the term,
//   "an interval" in running prose is not.
// - Longest term first, and every match (the entry's own title included) is
//   masked before shorter terms are tried, so "Celestials" is never linked
//   inside "High Celestials", nor "Concordant" inside "Concordant Principal".
//   An occurrence followed by a space and a capital letter is taken as the
//   head of a longer proper noun and passed over, and a short list of
//   phrases that contain a title without being it ("New Venice" is not
//   Venice) is masked outright.
// - Nothing inside an existing link, a heading, inline or fenced code, an
//   HTML tag or comment is a candidate.
// - One link per target per entry, at the earliest mention; an entry that
//   already links to a page of that slug anywhere in its body - in this
//   section or the other one, since the lore and the glossary share several
//   titles - is left alone.

// Titles whose mechanical variants would be wrong or useless, with the forms
// actually used in prose instead.
const TITLE_ALIASES = {
  "Champions / Heroes (Heros)": ["Champions", "Champion", "Heroes", "Hero"],
};

// Phrases that contain an entry's title without being a mention of it.
// Masked before any term is matched, longest first like the terms.
const NOT_A_MENTION = ["New Venice"];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function singular(v) {
  if (/ies$/.test(v)) return v.replace(/ies$/, "y");
  if (/(?:x|s|ch|sh)es$/.test(v)) return v.replace(/es$/, "");
  if (/[^s]s$/.test(v)) return v.replace(/s$/, "");
  return null;
}

function titleVariants(title) {
  if (TITLE_ALIASES[title]) return TITLE_ALIASES[title].slice();
  const out = new Set([title]);
  const paren = title.match(/^(.*?)\s*\(([^)]+)\)$/);
  if (paren) {
    out.add(paren[1]);
    // "(IWD)" and "(Quiet-Built)" are names; "(the Held)" is a gloss, and a
    // gloss matched on its own links inside phrases that merely reuse it.
    if (/^[A-Z0-9]/.test(paren[2])) out.add(paren[2]);
  }
  const colon = title.match(/^([^:]+):\s+\S/);
  if (colon) out.add(colon[1]);
  for (const v of Array.from(out)) {
    if (/^The\s+/.test(v)) out.add(v.replace(/^The\s+/, ""));
  }
  for (const v of Array.from(out)) {
    const s = singular(v);
    if (s) out.add(s);
  }
  return Array.from(out).filter((v) => v.length > 1);
}

// Splits a markdown file into front matter and body. Returns null when the
// file carries no front matter block.
function splitFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  return m ? { frontMatter: m[1], body: m[2] } : null;
}

function titleFromFrontMatter(frontMatter) {
  const m = frontMatter.match(/^title:\s*(.*?)\s*$/m);
  if (!m) return null;
  return m[1].replace(/^(["'])(.*)\1$/, "$2");
}

// Overwrites every character of a region with spaces so offsets are kept
// while the region can no longer match anything.
function blank(text, re) {
  return text.replace(re, (m) => " ".repeat(m.length));
}

function maskNonCandidates(body) {
  let masked = body;
  masked = blank(masked, /```[\s\S]*?```/g);
  masked = blank(masked, /`[^`\n]*`/g);
  masked = blank(masked, /^#{1,6}[ \t].*$/gm);
  masked = blank(masked, /!?\[[^\]]*\]\([^)]*\)/g);
  masked = blank(masked, /<!--[\s\S]*?-->/g);
  masked = blank(masked, /<[^>\n]+>/g);
  for (const phrase of NOT_A_MENTION) {
    masked = blank(masked, new RegExp(`(?<![\\w-])${escapeRegExp(phrase)}(?![\\w-])`, "g"));
  }
  return masked;
}

// Whole-word, case-sensitive, optional plural. An occurrence followed by a
// space and a capital is the head of a longer proper noun ("Quantum Space
// Harmonic Wave" is not a mention of Quantum Space Harmonics) and is passed
// over for the next one.
function termRegExp(variant) {
  return new RegExp(`(?<![\\w-])${escapeRegExp(variant)}(?:s|es)?(?![\\w-])(?! [A-Z])`, "g");
}

// entries: [{ slug, title, url, body }], all from one section. Returns the
// same list with, for each entry, `links`: [{ index, length, text, slug,
// title, url }] sorted by index - the edits that would link each unlinked
// first mention.
function planCrossLinks(entries) {
  const terms = [];
  for (const entry of entries) {
    for (const variant of titleVariants(entry.title)) {
      terms.push({ variant, entry, re: termRegExp(variant) });
    }
  }
  terms.sort((a, b) => b.variant.length - a.variant.length || a.variant.localeCompare(b.variant));

  return entries.map((entry) => {
    let masked = maskNonCandidates(entry.body);
    const alreadyLinked = new Set(
      Array.from(entry.body.matchAll(/\]\(\/star-rangers\/(?:glossary|lore)\/(?:[^)#]*\/)?([^)#/]+)\/\)/g)).map(
        (m) => m[1]
      )
    );
    const best = new Map();
    for (const term of terms) {
      const matches = Array.from(masked.matchAll(term.re));
      if (matches.length === 0) continue;
      // Mask every occurrence - including the entry's own title and terms it
      // already links to - so nothing shorter can match inside them.
      masked = blank(masked, term.re);
      if (term.entry === entry || alreadyLinked.has(term.entry.slug)) continue;
      const first = matches[0];
      const current = best.get(term.entry.slug);
      if (!current || first.index < current.index) {
        best.set(term.entry.slug, {
          index: first.index,
          length: first[0].length,
          text: first[0],
          slug: term.entry.slug,
          title: term.entry.title,
          url: term.entry.url,
        });
      }
    }
    const links = Array.from(best.values()).sort((a, b) => a.index - b.index);
    return { ...entry, links };
  });
}

function applyLinks(body, links) {
  let out = body;
  for (const link of links.slice().sort((a, b) => b.index - a.index)) {
    const before = out.slice(0, link.index);
    const after = out.slice(link.index + link.length);
    out = `${before}[${link.text}](${link.url})${after}`;
  }
  return out;
}

module.exports = {
  titleVariants,
  splitFrontMatter,
  titleFromFrontMatter,
  maskNonCandidates,
  planCrossLinks,
  applyLinks,
};
