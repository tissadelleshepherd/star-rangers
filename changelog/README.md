# Changelog archive

Released sections of [`CHANGELOG.md`](../CHANGELOG.md) that are older than the
newest five releases, moved here on 2026-10-15 when the changelog passed 1 MB
and stopped fitting GitHub's contents API.

- One file per ten minor versions (`1.30-1.39.md` holds 1.30.0 to 1.39.0), newest
  first within each file, so reading `CHANGELOG.md` and then these files from the
  highest range down gives the whole history in order.
- Every section is byte-for-byte as it was in `CHANGELOG.md`. Released sections
  are immutable: moving one here is allowed, editing one is not.
- The readers see the archive as well as `CHANGELOG.md`, through
  `lib/changelog-files.js`: `scripts/check-changelog.js` (every tag still has a
  section, no duplicates, newest first across all files) and
  `scripts/check-changelog-coverage.js` (pages never mentioned).
- Archiving is done by hand every few releases, not on every release: cut the
  oldest released sections from the bottom of `CHANGELOG.md` above the
  *Older releases* pointer, paste them unchanged at the top of the matching file
  here (start a new file when a new ten-version range begins), and update the
  version in the pointer. `npm test` fails if a section is lost or duplicated on
  the way. See *Cutting a release* in `TECHNICAL-README.md`.
