// Which character portraits belong to a season, for the season index pages.
//
// Added 2026-10-07 at Dermot's direction to take up the open question of
// 5 September (story-bible/open-questions.md, "Tissadelle's portraits", shape
// 2, his *Maybe*): a principal character's season portraits, filed on the
// character page as a captioned gallery, surface on the season page too.
//
// The key is on the character, not the season. Two optional front-matter
// fields say which season a frame shows:
//
//   image_season: 5          - the header portrait (`image:`) is the Season 5 frame
//   image_caption: "Season 5 — Line Captain"
//                            - its standing, worded as a gallery item's caption is
//                              (added 2026-10-07, Dermot: *Add a caption field for
//                              the header portrait too*, so the two kinds of frame
//                              read the same on a season page)
//   gallery:
//     - image: season-1-cadet.jpg
//       caption: "Season 1 — Cadet"
//       season: 1            - this gallery frame is the Season 1 frame
//
// A season page asks for its own number and gets back every frame keyed to
// it across the characters the BUILD INCLUDES - the caller passes
// `collections.characters`, which is already narrowed by the edition's
// filter and the tier gate, so an excluded character's portrait never
// appears on a season page any more than their page does. Nothing is
// derived from captions, chapter casts or `povs:`: a frame is on a season
// page because its author keyed it there, which keeps the strip authored
// rather than inferred, the same rule the emblem cards' epithets follow.
//
// Frames whose file is a PLACEHOLDER-stamped PENDING card are dropped by the
// optional `isPlaceholder` predicate, as the homepage slideshow drops them
// (`withImages` in .eleventy.js): a season page shows finished portraits or
// nothing. The predicate is injected so this module stays free of the
// filesystem and the test can pin the rule without image files.

const CHARACTER_IMAGE_PREFIX = "/star-rangers/images/characters/";

function isBlank(v) {
  return v === undefined || v === null || String(v).trim() === "";
}

// A season number is stored as a number in front matter and as a string in
// the season pages' `{% set seasonNumber = "1" %}`; compare them as numbers,
// and treat anything non-numeric as "no season".
function normaliseSeason(value) {
  if (isBlank(value)) return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

/**
 * @param {Array<{data: object, url?: string}>} characters - the build's
 *   character collection (Eleventy items, or anything with `.data`/`.url`)
 * @param {number|string} seasonNumber
 * @param {{isPlaceholder?: (relPathBelowCharacters: string) => boolean}} [options]
 * @returns {Array<{id: string, title: string, url: string, src: string, alt: string, caption: string|null}>}
 */
function seasonPortraits(characters, seasonNumber, options = {}) {
  const want = normaliseSeason(seasonNumber);
  if (want === null) return [];
  const isPlaceholder = typeof options.isPlaceholder === "function" ? options.isPlaceholder : () => false;

  const out = [];
  for (const item of characters || []) {
    const data = item && item.data;
    if (!data || isBlank(data.id)) continue;
    const id = String(data.id);
    const title = isBlank(data.title) ? id : String(data.title);
    const url = item.url || `/characters/${id}/`;

    if (!isBlank(data.image) && normaliseSeason(data.image_season) === want) {
      const rel = String(data.image);
      if (!isPlaceholder(rel)) {
        out.push({
          id, title, url,
          src: CHARACTER_IMAGE_PREFIX + rel,
          alt: isBlank(data.image_alt) ? title : String(data.image_alt),
          caption: isBlank(data.image_caption) ? null : String(data.image_caption)
        });
      }
    }

    for (const frame of Array.isArray(data.gallery) ? data.gallery : []) {
      if (!frame || isBlank(frame.image) || normaliseSeason(frame.season) !== want) continue;
      const rel = `${id}/${frame.image}`;
      if (isPlaceholder(rel)) continue;
      out.push({
        id, title, url,
        src: CHARACTER_IMAGE_PREFIX + rel,
        alt: isBlank(frame.image_alt) ? title : String(frame.image_alt),
        caption: isBlank(frame.caption) ? null : String(frame.caption)
      });
    }
  }

  // Deterministic whatever order the collection arrives in: by character id,
  // then header frame before gallery frames, then gallery file name.
  out.sort((a, b) => a.id.localeCompare(b.id) || a.src.localeCompare(b.src));
  return out;
}

module.exports = { seasonPortraits, normaliseSeason, CHARACTER_IMAGE_PREFIX };
