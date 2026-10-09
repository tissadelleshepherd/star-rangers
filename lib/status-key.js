// The class-name key for a character's `status` badge.
//
// character.njk renders the badge as .character-badge--status-<key>, and until
// 2026-09-06 <key> was the status lowercased, so "At large" emitted a class
// with a space in it and matched nothing. Slugifying fixed the two-word case
// but not the free-text one: Ilse Korvain's status is "Contained — Survey
// Corps custody, jurisdiction formally disputed", which a whole-string slug
// turns into a class nothing will ever be written for.
//
// So the key is the status's HEAD CLAUSE - the text before the first em dash,
// en dash, colon, semicolon, comma or parenthesis - slugified. The clause is
// the status; the rest is its qualification, and the badge still prints the
// whole string. Single-word statuses come out exactly as the old lowercase
// did, so nothing already styled moves.
function statusKey(status) {
  if (status === undefined || status === null) return "";
  const head = String(status).split(/\s*[—–:;,(]\s*/)[0];
  return head
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = { statusKey };
