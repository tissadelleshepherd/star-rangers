# Fian Ilchruinne — technical README

The operational documentation for this repository: comments infrastructure, the release process, local development, search, feeds, content scaffolding, and the multi-domain cPanel deployment reference. For what the project *is* — the story, the site sections, and the licensing — see [`README.md`](./README.md); for running your own fork, see [`FORKING.md`](./FORKING.md).

## Discussion forum (giscus)

Every character, lore, glossary, codex, episode, chapter/scene, and journal page carries a comment thread powered by [giscus](https://giscus.app), which stores each thread as a GitHub Discussion rather than a third-party comment service. Comments live in a separate, dedicated **`Star-Rangers/sciencefiction-site-comments`** repo — not this one — so reader/fan discussion never mixes with this repo's own dev-facing Discussions, and the comment history stays put across any future rename, fork, or transfer of this source repo. That repo must be public (giscus reads it unauthenticated) and needs no content of its own beyond Discussions being enabled. Config lives in `src/_data/giscus.js`; the embed itself is in `src/_includes/base.njk`, gated on the `comments`/`commentsCategory` front matter that `character.njk`, `lore-entry.njk`, `codex.njk`, `glossary-entry.njk`, `chapter.njk`, `scene-pov.njk`, and `journal-entry.njk` each set (listing/index pages don't opt in, so they stay comment-free).

Four of the comments repo's Discussion categories are mapped to page types (giscus creates one discussion per page, lazily, the first time someone comments):

| Category | Format | Pages |
| --- | --- | --- |
| **Characters** | Announcement (locked) | `/characters/*` |
| **Lore & Worldbuilding** | Announcement (locked) | `/lore/*`, `/glossary/*`, `/codex/*` |
| **Episodes Discussion** | Announcement (locked) | `/seasons/**` (chapters and per-POV scenes) |
| **Journal** | Announcement (locked) | `/journal/*` |

Characters/lore/glossary/codex/journal pages map by `pathname` — their URL never changes once created, so pathname is a safe permanent identity. Chapters and per-POV scene pages don't have that guarantee: episodes get renumbered in place to keep story chronology in order (see `CHANGELOG.md`'s "renumbered" entries), which reassigns a URL like `/seasons/s00/e02/s00e02c01/` to different content entirely. Mapping those by pathname would silently attach an existing discussion to whatever content now lives at that URL, losing the original page's comment context. Chapters instead map by `data-mapping="specific"` on a permanent `comment_id` front-matter field (required — see `lib/content-schema.js`), independent of the `id`/URL derived from season/episode/chapter; scene pages derive their own term from their parent chapter's `comment_id` plus scene/character (`src/scene-pov.njk`'s `eleventyComputed`). `comment_id` is set once (`npm run new -- chapter` generates it from the title) and must never be regenerated — if a chapter is renumbered, its `comment_id` moves with it so its discussion thread stays attached to the same content, while whatever content takes over the vacated slot gets its own fresh `comment_id`. `scripts/validate-content.js` fails the build if two chapters ever collide on the same `comment_id`.

Locking these to "Announcement" format means only the giscus GitHub App can start new discussions in them, so they only ever fill up with real page threads instead of off-topic posts. Five more categories exist for open community discussion, unrelated to any specific page:

| Category | Format |
| --- | --- |
| **Announcements** | Announcement |
| **General** | Open discussion |
| **Q&A** | Question / Answer |
| **Theories & Predictions** | Open discussion |
| **Fan Creations** | Open discussion |

**Fan Creations** is for links and discussion, not hosting: full fan fiction belongs on [AO3](https://archiveofourown.org/) or [Wattpad](https://www.wattpad.com/), not in this repo or its Discussions — see the About page's "Fan fiction" section for the pointer given to readers.

### A second, separate forum for one domain

`src/_data/giscus.js`'s repo/repoId/category IDs are all overridable per cPanel clone via `GISCUS_REPO`, `GISCUS_REPO_ID`, and `GISCUS_CATEGORY_CHARACTERS_ID`/`GISCUS_CATEGORY_LORE_ID`/`GISCUS_CATEGORY_EPISODES_ID`/`GISCUS_CATEGORY_JOURNAL_ID` in that clone's `deploy.conf` (or `ALT_<id>_GISCUS_*` for an `ALT_DOMAINS` entry) — see the keys table below. This is for a domain whose readers shouldn't share a Discussions board with the main site's, not routine customization: every clone left unset shares the one default repo above, which is what keeps community discussion in one place. **The board is picked per page, not only per build** (Dermot's ruling, 2026-09-04): a page in a thread that names a `giscusProfile` in `lib/storyline-threads.js` posts to that thread's board on whatever domain renders it, and every other page posts to the build's board. The Church Space thread is the current example — its pages use the Communion's own **`Star-Rangers/churchspace-site-comments`** repo on fellowshipoflight.org and church-space.site alike, while the main-sequence chapters those contemplative domains also carry post to the shared pool like every other domain, so one chapter has one conversation everywhere it appears. The Communion's repo was set up exactly like the default one:

1. Create the public `Star-Rangers/churchspace-site-comments` repo and enable Discussions on it, the same as step 1-2 above.
2. Create the same 9 categories in it (Characters, Lore & Worldbuilding, Episodes Discussion, Journal, Announcements, General, Q&A, Theories & Predictions, Fan Creations).
3. Install the [giscus app](https://github.com/apps/giscus) on it.
4. Fetch its IDs with `GITHUB_TOKEN=ghp_xxx node scripts/fetch-giscus-ids.js --repo Star-Rangers/churchspace-site-comments` — `--repo` targets a non-default comments repo and only ever prints (never `--write`, since that patches `src/_data/giscus.js`'s own default). These five values are already registered as the **`church-space`** profile in `giscus.js`'s `GISCUS_PROFILES`, and the Church Space thread names that profile in `lib/storyline-threads.js` — so no deploy sets `GISCUS_PROFILE` for it at all: the thread's pages reach the Communion's board on every domain by themselves. A contemplative clone's `deploy.conf` must **not** set `GISCUS_PROFILE=church-space` (a stale line from before 2026-09-04 would put the whole build, main sequence included, back on the Communion's board, since `deploy.conf` wins over the registry). If the repo is ever rotated, re-fetch and update that profile's IDs in `giscus.js`.

**Third-party forks** that just want their own board (not one of the project's registered profiles) don't need to touch `giscus.js` or `deploy.conf` at all: copy `sample-giscus.local.json` to `giscus.local.json` (gitignored) and fill in your repo + category IDs. It's read at build time and becomes your fork's default board on every build path — `npm start`, GitHub Pages, and any cPanel deploy that doesn't select a `GISCUS_PROFILE`. A registered `GISCUS_PROFILE`, and individual `GISCUS_*` env vars, still take precedence over it, so per-domain overrides keep working. Because it's gitignored, your comment-repo settings never conflict with an upstream merge.

### One-time setup

1. Create the public `Star-Rangers/sciencefiction-site-comments` repo (README-only is fine — it exists purely to host Discussions).
2. In that repo's Settings → General → Features, enable **Discussions**.
3. In its Discussions tab, use the categories gear icon to create the 9 categories above (GitHub seeds a few defaults like "Ideas"/"Polls" — rename or delete those rather than leaving stragglers).
4. Install the [giscus app](https://github.com/apps/giscus) on that repo (not this one).
5. Get the repo ID and the four category IDs one of two ways:
   - **Script** (fetches all five in one call): `GITHUB_TOKEN=ghp_xxx npm run fetch-giscus-ids -- --write`, using a [personal access token](https://github.com/settings/tokens) (classic, no scopes needed to read a public repo's Discussions). This patches `src/_data/giscus.js` directly — see `scripts/fetch-giscus-ids.js`'s header comment for options. Drop `--write` to just print the values first.
   - **giscus.app wizard**: visit [giscus.app](https://giscus.app), enter `Star-Rangers/sciencefiction-site-comments`, choose **pathname** as the page ↔ discussion mapping, and select **Characters** as the category — the generated snippet includes a `data-repo-id` (same for every category) and a `data-category-id` (specific to Characters). Repeat just the category-selection step for **Lore & Worldbuilding**, **Episodes Discussion**, and **Journal** to get their category IDs too, then paste all five values into `src/_data/giscus.js` by hand, replacing the `REPLACE_WITH_*` placeholders.

Until step 5 is done, the comment widgets render but won't load (giscus rejects placeholder IDs), so it's safe to ship the templates ahead of finishing setup.

### Turning comments off for a specific build

`COMMENTS_ENABLED` (read via `process.env` in `.eleventy.js`, defaulting to `true`) suppresses the widget on every page for that build, regardless of the per-page `comments`/`commentsCategory` front matter above. Two builds set it explicitly:

- **GitHub Pages** (`.github/workflows/deploy.yml`) sets it `false` — Pages serves under `/star-rangers/`, unlike the root-served cPanel domains giscus's pathname mapping actually targets, so leaving it on there would just create a second, disconnected set of discussions for the same pages.
- Any cPanel clone can opt out the same way with the `COMMENTS_ENABLED` (or `ALT_<id>_COMMENTS_ENABLED`) `deploy.conf` key above — useful for a staging/preview domain that shouldn't collect public comments at all.

## Cutting a release

The "Current version" line in `README.md` went stale twice by hand (it read `1.5.0` through both the 1.6.0 and 1.7.0 releases) and then again through 1.11.0, 1.12.0 and 1.13.0, despite this list previously calling it out as "the step that gets missed". **It is no longer a step** — `scripts/sync-version.js` writes it from `package.json`, and `npm test` fails if the two disagree. What remains:

1. Bump the version with `npm version X.Y.Z --no-git-tag-version`. This updates `package.json`, **both `version` fields in `package-lock.json`**, and — via the `version` lifecycle hook — the "Current version" line in `README.md` and, since 2026-10-08, its "The story so far" table (`scripts/sync-story-so-far.js`: threads and seasons from `lib/storyline-threads.js`, chapter counts from `src/seasons/`, the "What it is" column kept as authored; a new thread gets the first sentence of its registry description, to be edited by hand afterwards). Dermot's direction, 2026-10-08: the table is refreshed with each release, not with each chapter, so `npm test` checks only that it was regenerated at the current version. Editing `package.json` by hand skips all of that; it is how the lockfile sat at `1.8.0` through the 1.9.0 release.
2. In `CHANGELOG.md`, rename `[Unreleased]` to `[X.Y.Z] - YYYY-MM-DD`, add a short summary paragraph, and open a fresh empty `[Unreleased]` above it.
3. Merge, then **tag from a local clone** at the release's merge commit: `git tag vX.Y.Z <sha> && git push origin --tags`. The GitHub-automation path used for most changes here cannot publish `refs/tags/*`, so tagging is always a local step.
4. **Regenerate the derived artefacts** (since 1.36.0, 2026-10-09): `node scripts/extract-timeline.js`, `node scripts/extract-places-and-peoples.js` and `node scripts/extract-characters.js`, each with an outfile under `F:\CLAUDE\_artifacts\star-rangers\data\`, then republish the three private Claude artefacts to their existing URLs with the new data files. Each script prints any rule whose phrase is no longer on its page; fix the script, never the data. The artefacts are views of the record and are not linked from it.

If the README is ever restructured so the "Current version" line no longer matches `Current version: **X.Y.Z**`, `sync-version.js` **fails loudly in both modes** rather than passing on a line it can no longer find — a check that silently succeeds once its anchor moves is worse than no check. Retire the script and its two `package.json` hooks together, or restore the line.

`MINOR` covers backward-compatible additions (a new chapter, lore or glossary entry, a new `deploy.conf` key, a new theme); `PATCH` covers fixes with no new surface area. Nothing has yet required a `MAJOR` bump.

## Local development

```bash
npm install
npm run start
```

## Search

Full-text search across every page is powered by [Pagefind](https://pagefind.app/), which indexes the built `_site/` output — `npm run build` runs `eleventy && pagefind --site _site`, so search only works after a real build, not under `npm start`'s dev server (the search box just does nothing there, since there's no index yet). The search box lives in the header (`src/_includes/base.njk`); its logic is a small hand-rolled script, `src/js/search.js`, using Pagefind's JS API directly rather than its prebuilt `pagefind-ui` widget, so it could be styled to match the site's own dark theme (see `main.css`'s `/* --- Search --- */` section) instead of overriding another package's bundled CSS.

Only `<main data-pagefind-body>`'s content is indexed — breadcrumbs, "back to X" footers, pagination, and the comments widget all carry `data-pagefind-ignore` so they don't pollute every single page's indexed text with the same nav boilerplate. `data-pagefind-bundle` on the search widget carries the same `/star-rangers/` prefix as every other internal link (see `SITE_PATH_PREFIX` in `.eleventy.js`), so it's rewritten automatically for cPanel and for forks.

## RSS/Atom feed and social previews

`src/feed.njk` renders an Atom feed at `/feed/feed.xml`, autodiscoverable via a `<link rel="alternate">` tag in `base.njk`'s `<head>`. It lists the 20 most recently *published* chapters (newest first) from the `recentChapters` collection — a real-world `date` (`YYYY-MM-DD`) front-matter field, distinct from a chapter's in-universe `timestamp` string, since a feed reader needs to know when something was actually released, not when its story events occur. `npm run new -- chapter` sets `date` automatically to the day the file is created; the 13 chapters that predate this feature were backfilled from each file's own first git commit date.

Every page also carries Open Graph and Twitter Card meta tags (`base.njk`'s `<head>`), so links shared on Discord/Reddit/etc. get a title, description, and image preview instead of a bare URL. The image is computed per page type (`.eleventy.js`'s `eleventyComputed.ogImage`) from the same `image` field each layout's own `<img>` tag already uses — no second field to maintain — falling back to the homepage's hero image for chapters and listing pages, which have no single obvious picture of their own.

## Adding content

`npm run new` scaffolds a new character, lore entry, codex entry, glossary entry, chapter, or journal entry — it prompts for each type's required fields and writes the file with the correct front-matter shape, so you don't need to memorize a layout's exact fields by hand:

```bash
npm run new                # prompts for which type too
npm run new -- character    # skips straight to that type's prompts
```

(Timeline entries aren't covered — they use `layout: base.njk` with hand-written HTML in the body rather than a dedicated layout, so there's no single shape to scaffold; copy an existing one instead.)

`npm run test` (see below) runs `scripts/validate-content.js` first, which checks every content file's front matter against `lib/content-schema.js` — the same schema `npm run new` scaffolds from — and fails with a clear per-file message (missing field, non-numeric season/episode/chapter, a chapter's `id` disagreeing with its filename, etc.) instead of a blank page or a cryptic Nunjucks error surfacing later.

It also carries the image bookkeeping, which is not front matter and could not be caught by a schema: an `image:` naming a file that does not exist, an image under `src/images/` that no page, template or script references, a slug named in `story-bible/images.md` that is no longer on disk, and — since 2026-08-15 — **byte-identical image files under different names**. That last one is deliberately a failure rather than a warning: sharing one picture between two pages needs one file and two references, never two files, so a duplicate is always avoidable and always hides something (a page that looks illustrated and has no image of its own).

## Build and validation

```bash
npm run build
npm run test
```

## cPanel deployment config for local clones

The cPanel deployment recipe (`.cpanel.yml`, via `scripts/cpanel-deploy.sh`) can read optional per-clone settings from an untracked `deploy.conf` file in the repo root. The script's site-agnostic machinery (log capture, the deploy-log notification emails, `deploy-logs/` persistence) lives in `scripts/deploy-lib.sh`, which is kept byte-identical with the same file in the `dermot-cochran-photography` repository (like `scripts/mail-lib.sh` and `scripts/ensure-node.sh`) — change it in one repo, copy it verbatim to the other. The mail transport itself sits one level down in `scripts/mail-lib.sh`, so `cpanel-autopull.sh` can reach `ADMIN_EMAIL` for its own failures — the ones that happen before `deploy-lib.sh` is ever sourced — without a second copy of the same `mail(1)`/`sendmail` fallback. This repo deploys to several production domains from separate cPanel Git Version Control clones (one clone per domain, all pulling the same branch) — `deploy.conf` is how one clone tells the shared build/deploy script which domain, theme, and content scope it's responsible for.

These production domains are hosted on [iFastNet](https://ifastnet.com/portal/aff.php?aff=29941) cPanel hosting — if you're setting up your own fork's cPanel deploy and don't already have a host, that's a referral link for this project.

### Setup

1. In your local clone, copy one of the two tracked templates into place (the copy is untracked/gitignored, since it's specific to one clone/domain — never commit a real `deploy.conf`):
   - `cp sample-deploy-minimal.conf deploy.conf` — the two-line form: `CPANEL_USER` and `DOMAIN`. For a domain registered in [`lib/editions.js`](./lib/editions.js) that's the whole configuration, since everything that makes up the domain's identity (`THEME`/`EDITION`, `CHARACTERS`/`TOPICS`/`THREADS`, `SITE_NAME`/`SITE_TITLE`, `COMMENTS_ENABLED`, `GISCUS_PROFILE`) is resolved from that registry by domain for any key the file leaves unset.
   - `cp sample-deploy.conf deploy.conf` — the full template, documenting every key inline. Copy this one if the clone needs the keys that stay machine-side and are never resolved from the registry (`ADMIN_EMAIL`, the raw `GISCUS_*_ID` values, `CUSTOM_CSS_FILE`, `DEPLOY_PRIMARY`, and `ALT_DOMAINS` with its `ALT_<id>_*` keys), or needs to override what the registry would otherwise fill in.

   For a domain **not** registered in `lib/editions.js` (an independent host, or a fork), the lookup resolves nothing and every unset key falls back to the plain defaults below — so set what the clone needs explicitly in `deploy.conf`. `EDITION=<id>` alone borrows a registered edition's homepage copy and flourishes, but nothing else: branding (`SITE_NAME`/`SITE_TITLE`) and the content filter (`CHARACTERS`/`TOPICS`/`THREADS`) are filled from the registry only when the *domain* resolves, so set those keys too if you want them. The cleaner route is registering the domain in an untracked `editions.local.json`, which re-points an existing edition (or declares a new one) so the two-line form works for your domain exactly as it does for a registered one — [`FORKING.md`](./FORKING.md)'s "Taking an edition to your own domain" section is the walkthrough.
2. Edit `deploy.conf` with values for that clone. Every key but `DOMAIN` is optional; a commented-out or missing key falls back to its default, while a missing `DOMAIN` fails the deploy before anything is built. Example, showing every key at once:

```bash
CPANEL_USER=sciencef
THEME=default
DOMAIN=fianilchruinne.com
SITE_NAME=Fian Ilchruinne
SITE_TITLE=Fian-ilchruinne
CHARACTERS=aldera,elvira
TOPICS=boundary,detective-agency
THREADS=tissadelle-arc
ADMIN_EMAIL=admin@example.com
CUSTOM_LORE_FILE=/home/sciencef/custom-lore/exclusive-entry.md
CUSTOM_CSS_FILE=/home/sciencef/custom-lore/tweaks.css
COMMENTS_ENABLED=true
```

3. Push to that clone's branch as normal (or trigger cPanel's deploy) — `scripts/cpanel-deploy.sh` sources `deploy.conf` on every run, so no separate reload step is needed.

### Keys

| Key | Default | Purpose |
|---|---|---|
| `CPANEL_USER` | `sciencef` | Deployment destination: `/home/<CPANEL_USER>/public_html/`. |
| `THEME` | `default` | CSS theme — see "Available themes" below. |
| `DOMAIN` | `fianilchruinne.com` | Bare domain this clone serves (no scheme, no path, no trailing slash — e.g. `undercover-pets.com`). |
| `SITE_NAME` | `Fian Ilchruinne` | Brand name shown in the header logo, footer, and homepage heading. |
| `SITE_TITLE` | `Fian-ilchruinne` | Text used in every page's browser `<title>` tag. |
| `CHARACTERS` | *(unset — full site)* | Comma-separated character `id`s that narrow the deployed content. |
| `TOPICS` | *(unset — full site)* | Comma-separated tag/category values that narrow the deployed content. |
| `THREADS` | *(unset — full site)* | Comma-separated storyline thread `id`s (see [`lib/storyline-threads.js`](./lib/storyline-threads.js)) that narrow the deployed content to the seasons those threads cover. |
| `ADMIN_EMAIL` | `admin@<DOMAIN>` | Address notified after every deploy attempt, success or failure. **The defaulted address must actually exist on the server** (cPanel forwarder or mailbox) — the local MTA accepts mail for a hosted domain and silently discards it if the address doesn't exist, which is undetectable from the script, so a wrong guess means failures go unreported. When changing a clone's `DOMAIN`, create the forwarder for the new `admin@` first or set `ADMIN_EMAIL` explicitly. The deploy log warns when the default is in use; full logs always persist in `deploy-logs/` regardless. |
| `NOTIFY_ON` | `always` | Which outcomes `ADMIN_EMAIL` is mailed about. Failures always; `always` also mails every success, `warnings` mails a success only when its log carries a `WARN` line from the deploy scripts, `failure` never mails a success. See [`ADMIN_EMAIL`](#admin_email) below. |
| `CUSTOM_LORE_FILE` | *(unset — no extra page)* | Path to a clone-exclusive lore markdown file. |
| `CUSTOM_CSS_FILE` | *(unset — no extra CSS)* | Path to a clone-exclusive CSS file, appended after the theme. |
| `COMMENTS_ENABLED` | `true` | Set `false` to build this clone with the [giscus comment widget](#discussion-forum-giscus) turned off entirely (e.g. a staging/preview domain). |
| `SITE_NOINDEX` | `false` | Set `true` to build a **non-indexed testing/staging domain**: robots.txt becomes `Disallow: /`, every page carries a `noindex, nofollow` meta, and canonicals are suppressed — so a test (sub)domain serving the full site can't compete with the canonical domain in search. A throwaway test subdomain is three keys: `DOMAIN=<test subdomain>`, `SITE_NOINDEX=true`, `COMMENTS_ENABLED=false`, plus an `ADMIN_EMAIL` that really exists. deploy.conf-only on purpose — testing domains don't belong in `lib/editions.js`. |
| `GISCUS_PROFILE` | *(unset — `default` profile)* | Select one of the project's own registered comment repos (`GISCUS_PROFILES` in `src/_data/giscus.js`) as this build's board with one key instead of the six below: `default` (the shared pool) or `church-space` (the Communion's board). **Leave it unset on every one of the project's own domains, the contemplative ones included**: since 2026-09-04 the board is picked per page, and the Church Space thread reaches the Communion's board by itself (`giscusProfile` on the thread in `lib/storyline-threads.js`), so setting it here would put a contemplative domain's whole build on that board and split every shared chapter's conversation. An unknown name fails the build. |
| `GISCUS_REPO` | *(unset — profile's repo)* | Third-party escape hatch: point this clone's comment widget at a repo that isn't a registered profile — see [A second, separate forum for one domain](#a-second-separate-forum-for-one-domain). Overrides just this field of the selected profile. |
| `GISCUS_REPO_ID` | *(unset — profile's repo ID)* | That repo's numeric ID, from `fetch-giscus-ids.js --repo` or the giscus.app wizard. Required if `GISCUS_REPO` is set. |
| `GISCUS_CATEGORY_CHARACTERS_ID` | *(unset — shared default's ID)* | That repo's "Characters" category ID. Required if `GISCUS_REPO` is set. |
| `GISCUS_CATEGORY_LORE_ID` | *(unset — shared default's ID)* | That repo's "Lore & Worldbuilding" category ID. Required if `GISCUS_REPO` is set. |
| `GISCUS_CATEGORY_EPISODES_ID` | *(unset — shared default's ID)* | That repo's "Episodes Discussion" category ID. Required if `GISCUS_REPO` is set. |
| `GISCUS_CATEGORY_JOURNAL_ID` | *(unset — shared default's ID)* | That repo's "Journal" category ID. Required if `GISCUS_REPO` is set. |
| `DEPLOY_PRIMARY` | `true` | Set `false` to skip deploying to `/home/<CPANEL_USER>/public_html/` entirely — for an account whose `public_html` is reserved for something else (or left parked) and should only serve one or more `ALT_DOMAINS` below. |

`DOMAIN` has no default: a missing `deploy.conf`, or one without that line, fails the deploy before anything is built (since 2026-10-09, after two clones that fell back to the canonical domain served the canonical site under their own names). Every other key falls back to its default above — that's `CPANEL_USER=sciencef`, `THEME=default`, `SITE_NAME=Fian Ilchruinne`/`SITE_TITLE=Fian-ilchruinne`, the full unfiltered site (no `CHARACTERS`/`TOPICS`/`THREADS` narrowing), a deploy-log email to `admin@fianilchruinne.com`, no custom lore/CSS, comments on, and the shared default giscus repo.

### `ALT_DOMAINS` — deploying more than one domain from one clone

The keys above describe one clone's *primary* domain, deployed to `/home/<CPANEL_USER>/public_html/`. A clone can optionally also deploy additional domains from that same checkout — useful when those domains share the same cPanel account as the primary domain (e.g. addon domains), instead of needing a whole separate clone per domain the way the "several production domains from separate clones" model above does.

Each alt domain deploys to a sibling folder under the same `$HOME`, at the same level as `public_html/` — typically that domain's own document root, which has to exist in cPanel before it's added here.

**Creating one, and where the interface went.** cPanel used to have separate *Subdomains* and *Addon Domains* pages. Both were retired and folded into a single **Domains** interface (around cPanel v100–v102), so neither icon exists any more and a subdomain is no longer a distinct kind of thing to create. The action, which is what to remember rather than the label:

1. **Domains → Create A New Domain**, and type the full hostname — `archive.fianilchruinne.com` for a subdomain, `example.com` for a separate domain. cPanel works out which it is from whether the account already owns the parent.
2. **Leave "share document root with…" unchecked.** A shared root is how you make an alias; a separate root is what an `ALT_DOMAINS` build needs. Newer cPanel defaults a new domain's root *outside* `public_html` (`/home/<user>/archive.fianilchruinne.com`), which is fine — just set `ALT_<id>_DIR` to whatever it actually created, since that path is the one thing here that has to match exactly.
3. **DNS**, if it isn't cPanel's. Where the nameservers are the host's, the record is made for you. Where DNS lives at the registrar, add an `A` record for the subdomain pointing at the account's IP, or nothing resolves however correct the cPanel side is.
4. **AutoSSL** picks the new host up on its next run.

That page is also where an existing domain's document root is *re-pointed*, which is how a domain in `lib/editions.js`'s `ALIASES` finally becomes a real alias.

Given this interface has already moved once, treat any icon name here as the perishable part. The durable version is: create the host, give it its own document root unless you want an alias, make sure DNS resolves.

```bash
ALT_DOMAINS="altsite1 altsite2 altsite3 altsite4"

ALT_altsite1_DIR=altsite1_html
ALT_altsite1_DOMAIN=altsite1.example
ALT_altsite1_THEME=pets
ALT_altsite1_SITE_NAME=Alt Site One
ALT_altsite1_CHARACTERS=aldera,elvira
ALT_altsite1_THREADS=tissadelle-arc
ALT_altsite1_ADMIN_EMAIL=admin@altsite1.example

ALT_altsite2_DIR=altsite2_html
ALT_altsite2_DOMAIN=altsite2.example
ALT_altsite2_THEME=default
```

(rename/duplicate the block per domain — placeholder ids, not tied to any real production domain)

| Key | Default | Purpose |
|---|---|---|
| `ALT_DOMAINS` | *(unset — primary domain only)* | Space-separated list of short ids (letters/digits/underscore, can't start with a digit). Each id needs its own `ALT_<id>_*` keys below. |
| `ALT_<id>_DIR` | *(required)* | Sibling folder name under `$HOME` this domain deploys to — `/home/<CPANEL_USER>/<ALT_<id>_DIR>/`. Must already exist. |
| `ALT_<id>_DOMAIN` | *(required)* | Same purpose as `DOMAIN` above, for this domain. |
| `ALT_<id>_THEME` | `default` | Same as `THEME` above, for this domain. |
| `ALT_<id>_CHARACTERS` | *(unset — full site)* | Same as `CHARACTERS` above, for this domain. |
| `ALT_<id>_TOPICS` | *(unset — full site)* | Same as `TOPICS` above, for this domain. |
| `ALT_<id>_THREADS` | *(unset — full site)* | Same as `THREADS` above, for this domain. |
| `ALT_<id>_SITE_NAME` | `Star Rangers` | Same as `SITE_NAME` above, for this domain. |
| `ALT_<id>_SITE_TITLE` | `Star Rangers` | Same as `SITE_TITLE` above, for this domain. |
| `ALT_<id>_ADMIN_EMAIL` | `admin@<ALT_<id>_DOMAIN>` | Same as `ADMIN_EMAIL` above, for this domain — added to the one deploy-log email's recipient list, alongside `ADMIN_EMAIL`, rather than sent separately. |
| `ALT_<id>_CUSTOM_LORE_FILE` | *(unset — no extra page)* | Same as `CUSTOM_LORE_FILE` above, for this domain. |
| `ALT_<id>_CUSTOM_CSS_FILE` | *(unset — no extra CSS)* | Same as `CUSTOM_CSS_FILE` above, for this domain. |
| `ALT_<id>_COMMENTS_ENABLED` | `true` | Same as `COMMENTS_ENABLED` above, for this domain. |
| `ALT_<id>_GISCUS_REPO` | *(unset — shared default repo)* | Same as `GISCUS_REPO` above, for this domain. |
| `ALT_<id>_GISCUS_REPO_ID` | *(unset — shared default's ID)* | Same as `GISCUS_REPO_ID` above, for this domain. |
| `ALT_<id>_GISCUS_CATEGORY_CHARACTERS_ID` | *(unset — shared default's ID)* | Same as `GISCUS_CATEGORY_CHARACTERS_ID` above, for this domain. |
| `ALT_<id>_GISCUS_CATEGORY_LORE_ID` | *(unset — shared default's ID)* | Same as `GISCUS_CATEGORY_LORE_ID` above, for this domain. |
| `ALT_<id>_GISCUS_CATEGORY_EPISODES_ID` | *(unset — shared default's ID)* | Same as `GISCUS_CATEGORY_EPISODES_ID` above, for this domain. |

`DIR` and `DOMAIN` are the only two required per-domain keys — every other `ALT_<id>_*` key is optional and defaults exactly the way its unprefixed counterpart does. `scripts/cpanel-deploy.sh` runs one complete, independent Eleventy build + rsync per domain (the primary domain, then each `ALT_DOMAINS` entry in turn), sharing only the one `npm ci`-installed `node_modules/` — each domain gets its own theme, content filter, and branding even though they all come from one checkout, the same as separate clones would.

A listed alt domain that's misconfigured — an invalid id, a missing `ALT_<id>_DIR`/`ALT_<id>_DOMAIN`, or an `ALT_<id>_DIR` folder that doesn't actually exist yet — fails loudly for that domain (a `FAIL` line in the log, and the run's overall exit status), the same philosophy `CUSTOM_LORE_FILE`/`CUSTOM_CSS_FILE` already use elsewhere in this file, rather than silently skipping it. That failure does **not** stop the primary domain, or any other `ALT_DOMAINS` entry in the same run, from still deploying — every domain gets its own independent attempt, and the run's final per-domain results are listed at the end of the deploy log.

If this account's `public_html` shouldn't get a copy of the site at all — only the addon domain(s) listed in `ALT_DOMAINS` — set `DEPLOY_PRIMARY=false`. That combination (`DEPLOY_PRIMARY=false` with `ALT_DOMAINS` also unset/empty) fails the run loudly rather than quietly deploying nothing, since it would otherwise look like a successful deploy that did nothing at all.

### Automatic deployment from cron

**Merging to the deploy branch does not update any production domain by itself.** Nothing connects the two: cPanel does not poll GitHub, and GitHub cannot push into cPanel. A merge updates each clone's *remote* and none of their *checkouts* until something on the server pulls. Until that happens the merge is real, CI is green, and every live domain is still serving the previous build.

[`scripts/cpanel-autopull.sh`](./scripts/cpanel-autopull.sh) is that something. It fast-forwards the checkout and, only when that moves the commit this clone has *successfully deployed*, hands off to `scripts/cpanel-deploy.sh`. Like `deploy-lib.sh`, `mail-lib.sh` and `ensure-node.sh` it is kept **byte-identical** with the copy in the `dermot-cochran-photography` repository — change it in one repo and copy it verbatim to the other. (It was *not* identical until 13 August 2026: one copy's install comment said "README" and the other's said "TECHNICAL-README.md", which is precisely how two files that must match come apart. Nothing in it may name one repo's own filenames.)

> **Forking wouldn't have solved this.** A GitHub fork does not auto-sync from upstream either — "Sync fork" is a manual button, or a scripted `gh repo sync` — and a cPanel clone pulls from whatever URL it was given without subscribing to anything at either end. Setting the cPanel repositories up as forks would have added a hop, each hop needing its own trigger, rather than removing one.

#### Install

One crontab line per **clone**, per cPanel account — every account that hosts a clone needs its own, since each account's cron only sees its own `$HOME`. In cPanel → *Advanced* → *Cron Jobs*:

```bash
*/10 * * * * /bin/bash "$HOME/repositories/star-rangers/scripts/cpanel-autopull.sh"
```

cPanel's Cron Jobs form takes the schedule in its own fields, so the **command** box gets only the `/bin/bash "…"` part.

These accounts keep their Git Version Control checkouts under `~/repositories/`. Confirm the last path segment against the **Repository Path** cPanel shows for that clone — it isn't always the repo name, and an account holding clones of both this repo and `dermot-cochran-photography` needs one line each.

**Use `$HOME` rather than a hardcoded `/home/<user>/`.** cron sets `HOME` from the account's `/etc/passwd` entry and runs the command through `sh`, so it expands correctly — and it means the *same line* is pasted into every account's crontab with nothing to hand-edit per account, which is the whole point when there are four of them. Keep the double quotes; single quotes would stop the expansion. (This is a different question from `deploy.conf`'s `CPANEL_USER`, which names the deploy *destination* — not necessarily the account running the script, and with `ALT_DOMAINS` there can be several. The cron line only needs to answer "where am I".)

A wrong path announces itself on the first run rather than failing quietly: bash exits with `No such file or directory`, cron mails it, and nothing deploys.

##### Don't prefix it with a pull

The natural instinct is to write the crontab line as the familiar one-liner plus the script:

```bash
# WRONG - do not do this
cd ~/repositories/star-rangers && git pull --ff-only && bash scripts/cpanel-autopull.sh
```

That reintroduces the exact fault the script exists to prevent. **The bare `git pull` runs outside the lock.** A full deploy — `npm ci` plus one Eleventy build per domain — routinely outlasts a ten-minute interval, so runs overlap; when they do, that unlocked pull advances HEAD while a build is already reading the tree, and the build ships a mixture of two commits. The script's own pull happens *inside* the lock, which is the whole reason it's there.

Two lesser problems with the chained form: `cd` is redundant (the script resolves its own checkout from its own location, deliberately, because cron runs from `$HOME`), and the `&&` chain swallows the script's exit codes — a transient network failure during the leading `git pull` breaks the chain, so you get raw git noise instead of a clean exit 3 and a decision-log line, and the script never runs at all.

The unguarded form without the script is different but also wrong for a schedule:

```bash
cd ~/repositories/star-rangers && git pull --ff-only && bash scripts/cpanel-deploy.sh
```

That works when typed by hand, which is where it comes from. On a timer it rebuilds and re-rsyncs every domain on **every** run whether anything changed or not, and emails a deploy log each time. `cpanel-autopull.sh` is that same sequence plus the guards below.

Ten minutes is a starting point, not a requirement. The script exits in well under a second when there is nothing new, so a shorter interval costs almost nothing; a longer one just means the site lags further behind a merge.

#### What it does and doesn't do

- **Silent when idle, and loud when it fails.** Cron mails any output a job produces, and a job this frequent must not mail on every run — so it prints nothing unless it deploys or fails. Add `--verbose` to a manual run to see every decision.

  Silence used to be ambiguous, which was the real problem: a run that did nothing and a run that *failed* looked identical from a mailbox, because `err()` writes to stderr and cron delivers stderr to the account's own system mailbox — not to `ADMIN_EMAIL`, and not anywhere anyone reads. Deploy outcomes were always mailed properly; the blind spot was exactly the window before the handoff. Since 13 August 2026 a run that fires and fails mails `ADMIN_EMAIL` directly (via `scripts/mail-lib.sh`), so silence means one thing only: nothing needed doing.

  | outcome | mailed? |
  | --- | --- |
  | exit 0, nothing to do | no — this is the point |
  | exit 1, unusable environment | **yes** |
  | exit 2, another run holds the lock | no — a long deploy is normal, not a fault |
  | exit 3, pull failed | **yes** |
  | the deploy itself failed | **yes**, by `cpanel-deploy.sh` as it always has |

  Exit 2 is deliberately quiet. On a ten-minute cron a full multi-domain deploy routinely outlasts the interval, so a held lock is the *expected* state rather than a fault; mailing it would train the alert to be ignored, which is the exact failure this change exists to prevent. A failed send never changes an exit code either — a fault that couldn't be emailed is still that fault, with its own status.
- **Knows when it last ran, not just what it last deployed.** Every run stamps `$HOME/.cpanel-autopull/<clone>.lastrun`, including runs that find nothing and runs that exit on a held lock — "is cron still firing?" is a different question from "what is deployed?", and only the first tells you the schedule itself has stopped. `--status` prints both.

  Setting `AUTOPULL_MAX_GAP_HOURS` in `deploy.conf` mails an alert when the previous run was longer ago than that. Unset by default and deliberately so: the interval lives in cPanel → Cron Jobs, not in this repo, so the repo has no basis for guessing one. **It can only report a gap on the next run that actually happens** — a cron that stops firing altogether cannot report its own absence, and no code here can change that.
- **Deploys only on a real change.** It compares HEAD against the last commit it deployed *successfully*, recorded under `$HOME/.cpanel-autopull/`. Comparing HEAD before and after the pull would be the obvious test and is wrong: if a pull succeeds and the deploy after it fails, HEAD is already advanced, so the next run would see "nothing new" and never retry — leaving the site stale behind a cron job that looks healthy. Tracking last-*deployed* instead means a failed deploy is retried every run until it succeeds.
- **`--force`** deploys regardless. Use it after editing `deploy.conf`, which is untracked and so never moves HEAD, but does change what gets built.
- **`--status`** prints the branch, HEAD, last-deployed commit, when it last ran (and how long ago), the resolved notification address, the gap threshold and the lock state — and changes nothing.
- **Locks.** A full deploy (`npm ci` plus one Eleventy build per domain) can outlast the cron interval, and two overlapping runs would rsync the same document root at once. A lock whose owning process is gone — killed mid-flight, or a reboot — is reclaimed rather than blocking forever.
- **`--ff-only`, deliberately.** A deployment checkout is never a place work is done, so anything that can't fast-forward is a fault to report, not a merge to resolve. A modified *tracked* file is the usual cause; `deploy.conf` and the other per-clone files are untracked and gitignored, so they never interfere.
- **It adds no logging of its own to the deploy.** `scripts/cpanel-deploy.sh` already emails its full log to `ADMIN_EMAIL` and persists it under `deploy-logs/`. This script keeps only a small pull/skip/deploy decision log at `$HOME/.cpanel-autopull/<clone>.log`, pruned to the last 500 lines, so "why did the site not update" is answerable without a mailbox.

Exit codes: `0` nothing to do or deployed, `1` unusable environment, `2` another run holds the lock, `3` the pull failed, anything else is `cpanel-deploy.sh`'s own status.

#### Verifying an install

Run it by hand once from SSH before trusting cron:

```bash
bash "$HOME/repositories/star-rangers/scripts/cpanel-autopull.sh" --status
```

That touches nothing. Then `--verbose --force` once to confirm a real deploy works end to end from this path, and check the domain. After that, cron's silence is the success signal.

#### Checking what's live

Every deploy stamps what it shipped — `git describe --tags --always --dirty`, e.g. `v1.16.0-3-gb4b56f4`: the release, how many commits past it, and the exact commit. `--dirty` marks a checkout with modified *tracked* files; the untracked per-clone files (`deploy.conf` and friends) never trip it.

It lands in three places:

- **The deploy email subject** — `[star-rangers deploy] SUCCESS - sciencef - v1.16.0-3-gb4b56f4 - 2026-08-10 18:21:05Z`, so the notification you already receive says what it shipped.
- **`/version.txt`** on every domain, which is the one check that tests the whole chain rather than one link in it:

  ```bash
  curl -s https://fianilchruinne.com/version.txt
  ```

- **`<meta name="site-version">`** in every page's `<head>`, for when you're already looking at the page.

A green cron job only proves the script ran. It does not prove the build succeeded on *this* domain, or that the rsync landed — and with several domains across several cPanel accounts, one silently stale domain is the failure that otherwise goes unnoticed longest. Curling `/version.txt` on each is the cheap sweep:

```bash
for d in fianilchruinne.com starquest.site church-space.site; do printf '%-24s %s\n' "$d" "$(curl -fsS "https://$d/version.txt" | head -1)"; done
```

`version: dev` means that build did not come through the cPanel deploy path at all — a local build, or GitHub Pages. On a production domain that is itself the finding.

#### `THEME` and available themes

`THEME=default` keeps `src/css/main.css` as-is. Any other value uses `src/css/theme-<THEME>.css` when that file exists in the repo; otherwise deployment falls back to `src/css/main.css`. Every theme file is generated from `main.css` by `scripts/generate-themes.js` (`npm run generate-themes`), which swaps in only that theme's palette (`:root` custom properties, the five `.pov-block--<character>` colors, and `.character-badge--status-active`) and keeps everything else byte-for-byte in sync with `main.css` — run it after any structural change to `main.css` to re-propagate that change to every theme, and edit that script's `THEMES` registry to add a new theme or adjust an existing palette.

| Theme | Kind | Description |
|---|---|---|
| `fellowship` | domain re-skin | Warm, luminous gold/parchment palette (fellowshipoflight.org). |
| `pets` | domain re-skin | Warm, friendly orange/cream palette (undercover-pets.com). |
| `starquest` | domain re-skin | Deep-space navy with neon teal accents (starquest.site/.online). |
| `church-space` | domain re-skin | Candlelit stone and stained-glass palette (church-space.site/.online). |
| `light` | standard | Light/day mode — the site's only non-dark option. |
| `high-contrast` | standard | Maximal-contrast black/white/yellow, for low-vision accessibility. |
| `sepia` | standard | Warm parchment/e-reader tone for long reading sessions. |
| `solarized` | standard | Ethan Schoonover's Solarized Dark palette. |

Every palette is checked against WCAG 2.2 AA contrast for normal text (4.5:1) by `node scripts/check-contrast.js`, on the pairs `main.css` actually composes — including hover states, and the two-steps-darker `--color-surface-2` that badges and chapter labels sit on, where a colour chosen against the page background is often a third under the floor. Run it after editing any palette in `scripts/generate-themes.js` (and after `npm run generate-themes`, since it reads the generated files). It exits non-zero on a failure and is not part of `npm test` for that reason. `solarized` is exempt and says why in the script: it is a faithful reproduction of a published palette, opt-in only, and no edition ships it.

#### Presentation modes — the third axis

A palette answers *what colour is this domain*; a presentation mode answers *how does it want to be read*. They were one axis until August 2026 and separated when the Fellowship's codex site needed the Fellowship's palette and an index's density — a thing `THEME` cannot express.

The mode is a property of the **edition**, not of a clone: it is set in `lib/editions.js` and there is deliberately **no `deploy.conf` key for it**. It also needs no deploy plumbing at all, unlike `THEME` — the deploy copies a *stylesheet* over `main.css`, whereas a mode is a `data-presentation` attribute `src/_includes/base.njk` writes onto `<html>` from the edition record the build already resolved through `EDITION`.

| Mode | Editions | What it changes |
|---|---|---|
| `story` | default, sciencefiction, starquest | The site's own values: 18px root, 1.7 leading, 72ch measure. Every other mode is a departure from it. |
| `primer` | pets | 20px root, 58ch measure, more space between paragraphs, finger-sized POV buttons — the children's domain, optimised for finishing a block. |
| `archive` | fellowship-archive | 17px root, 1.6 leading, 78ch measure, tighter spacing, short hero, left-aligned homepage — a filed record, browsed rather than read. |
| `contemplative` | fellowship, church-space | 19px root, 1.9 leading, 62ch measure, wide paragraph spacing, headings in the body colour rather than the accent. |

**Readers can override the mode for themselves** (2026-08-21). The header carries a "Reading" disclosure offering the edition's own setting plus the other three modes under reader-facing names — Standard, Large print, Compact, Spacious — and the choice is kept in `localStorage` under `fi:presentation-mode`. It is client-local and nothing else: per-origin, never sent anywhere, never shared between domains or devices, and it degrades to the edition's mode whenever storage is unavailable. `src/js/presentation.js` builds and drives the control; the **restore** is a small inline script in `base.njk`'s `<head>`, which a deferred file cannot do — the page would paint in the edition's mode and visibly jump. With JS off the control is never revealed at all, rather than appearing and doing nothing.

A mode moves only `:root` custom properties (with two documented exceptions where no property could carry the change), which is what lets the axes compose: `scripts/generate-themes.js` copies everything outside `:root` verbatim, so all four modes ship inside all nine palettes and `EDITION=fellowship-archive THEME=sepia` gets archive density in parchment colours. Registered modes live in `PRESENTATION_MODES` in [`lib/editions.js`](./lib/editions.js), and the build fails on an edition naming a mode that isn't registered, or on a registered mode `main.css` never implements — both otherwise serve the default posture while looking perfectly healthy. The per-edition reasoning is in `story-bible/edition-reader-profiles.md`.

#### `CHARACTERS`, `TOPICS`, and `THREADS`

Comma-separated, case-insensitive lists that narrow the deployed site to content related to the listed characters, topics, and/or storyline threads:

- `CHARACTERS` matches character page `id`s and chapter POV character `id`s.
- `TOPICS` matches page `tags` (and `category`, where present), across every content type including character pages.
- `THREADS` matches a storyline thread `id` from the registry in [`lib/storyline-threads.js`](./lib/storyline-threads.js) — currently `founding-era`, `tissadelle-arc`, and `church-space` (see the site's own [Threads](src/threads/) section, which groups seasons the same way). A chapter is included if its `season` front matter falls under a listed thread's seasons; a thread `id` also participates in tag matching, so a lore/timeline/glossary/codex entry can opt in by carrying the thread `id` as a tag.
- A thread registered with a `tier` (currently just `church-space`, at `contemplative`) is the exception to "leaving all three unset deploys the full, unfiltered site" below: it is **gated to a reading tier**, and stays hidden — its chapters, any character/lore/codex/glossary/timeline entry tagged with its id, its own `/threads/<id>/` landing page, and its entry in the `/threads/` listing — on every build whose edition sits below that tier, the unfiltered one included. The build's tier is its edition's `tier` in `lib/editions.js`, resolved by domain; there is no `deploy.conf` key for it, and naming the thread in `CHARACTERS`/`TOPICS`/`THREADS` does not open it. On a build at or above the tier the thread is ordinary content, narrowed like any other. `church-space` carries explicit Christian and evangelical themes not part of the main published canon and belongs to the contemplative readership, so it appears on fellowshipoflight.org and church-space.site and never on fianilchruinne.com, sciencefiction.site, GitHub Pages, or any clone at a lower tier (see `sample-deploy.conf`'s church-space example block). A gated thread also carries a `homeDomain` (e.g. `church-space.site`) naming a domain at its tier — used only by the "not included" placeholder below, so an excluded gated-thread page links to a domain that actually has it rather than back to the reference domain (a general-tier site, which hides it too). Until 2026-09-04 this was `private: true`, opt-in by naming; the tier gate replaced it at Dermot's ruling with no change to any domain's page set, and the old public→private link check went with it — a lower-tier page may link into the thread and gets the ordinary placeholder.
- `CHARACTERS` also participates in tag matching, since tags conventionally embed character slugs (e.g. a timeline entry tagged `aldera`) — so a page is included if it matches `CHARACTERS`, `TOPICS`, or `THREADS` by any of the above.
- `CHARACTERS` also pulls in any lore, timeline, or glossary entry that an included character's own bio links to directly, even if nothing tags it for that character — a character's bio is already the site's record of which background matters for understanding them, so a `CHARACTERS`-filtered deploy carries that background along automatically instead of requiring every relevant entry to be tagged by hand.
- Excluded pages still build at their normal URL as a minimal "not included in this edition" placeholder, instead of being omitted, so links to them never 404. The placeholder links the reader to the same path on the domain that actually has the page: the full-site reference domain (`fianilchruinne.com`, the `DEFAULT_REFERENCE_DOMAIN` in [`lib/storyline-threads.js`](./lib/storyline-threads.js)) for ordinary excluded pages, or a private thread's own `homeDomain` for its pages — since the reference domain excludes a private thread too, and linking there would just loop back to another placeholder.
- Section index/listing pages (Characters, Lore, Codex, Glossary, Timeline, Seasons/Episodes, Threads) always build, just with fewer items listed.
- Leaving all three unset/empty deploys the full, unfiltered site (the default).

#### `DOMAIN`

The bare domain this clone actually serves. It's exported as `SITE_DOMAIN` for the Eleventy build and consumed by `src/_data/site.js`, which `src/robots.njk` and `src/sitemap.njk` use to render `robots.txt`'s `Sitemap:` line and every `<loc>` in `sitemap.xml` with that clone's own domain — both files are generated at build time rather than copied statically, specifically so each of this repo's several production domains gets a correct, working sitemap reference instead of all of them sharing one hardcoded host. The GitHub Pages build never sets `SITE_DOMAIN`, so it falls back to the GH Pages URL itself.

#### `SITE_NAME` and `SITE_TITLE`

Let a clone brand itself independently of the shared repo default (`Star Rangers`):

- `SITE_NAME` is exported for the Eleventy build and consumed by `src/_data/site.js`, which `src/_includes/base.njk` uses for the header logo text and the footer's site name.
- `SITE_TITLE` is likewise consumed by `src/_data/site.js`, and used by `src/_includes/base.njk` for every page's browser `<title>` tag (as the `<title> | <SITE_TITLE>` suffix, or standalone on the home page).
- Kept as two separate keys, rather than one, so a clone can put a different string in the tab title than in its on-page branding — most clones will just set both to the same value.

#### Domains this project has registered as aliases

`lib/editions.js` carries an `ALIASES` map — hosts that belong to another domain
and must not have the site built on them. Rather than skipping or failing them,
`cpanel-deploy.sh` gives such a host a **three-file redirect deployment**:

- `.htaccess` — a `301` for the whole namespace to the target, path and query
  preserved, so a deep link lands on its counterpart rather than the front page.
  `/.well-known/` is exempt so AutoSSL's plain-http check still works.
- `index.html` — a short notice carrying `rel=canonical` and a meta refresh, for
  hosts where `mod_rewrite` is unavailable. Two mechanisms for one move, the same
  pairing the in-site rename stubs use.
- `robots.txt` — which deliberately does **not** `Disallow`. A crawler has to be
  able to fetch these URLs to see the `301` and consolidate them; blocking it
  strands the redirect unseen and leaves the old URLs indexed.

It runs `rsync --delete`, so whatever build was last deployed there is removed —
otherwise the redirect would sit on top of a site still serving its own pages to
anything reaching them without passing through `.htaccess`. No Node, no Eleventy,
no build: three files.

The point is that **the consolidation is real from the first deploy**. Repointing
the domain at its target's document root in cPanel is then tidying rather than a
prerequisite, and the deploy log says so on every run until it is done. Templates
are in `scripts/alias-notice/` with `__TARGET__` and `__DOMAIN__` substituted at
deploy time — edit those, never a deployed copy.

**This is not a domain allow-list, and an independent deployment is unaffected.**
A fork on its own domain resolves no edition here and never will — the registry
is this project's, not a list of permitted hosts — so an unknown domain deploys
the full site exactly as it always has, including with the two-key minimum
`deploy.conf`. Only a host *named* in `ALIASES` gets the redirect treatment.
Silence about a domain means no opinion.

A domain nobody has configured anywhere gets a `WARN` line in the deploy log and
deploys anyway: correct for an independent fork, usually a mistake for a clone of
this project, and not something to fail a deploy over either way.

#### `ADMIN_EMAIL`

An email is sent to it after **every** deployment attempt — success or failure — with a `SUCCESS`/`FAILURE` subject (including the cPanel account, the version being shipped and a timestamp) and the full build+deploy log as the body, so failures are visible without having to check cPanel's own UI. Sent via local `mail`(1), falling back to `/usr/sbin/sendmail` if `mail` isn't installed. If not set explicitly, it defaults to `admin@<DOMAIN>` (e.g. `admin@sciencefiction.site`) rather than hardcoding a real address in this public repo. This is best-effort only: if no mail command is available, or sending itself fails, the deployment's own outcome is unaffected.

**`NOTIFY_ON`** (since 2026-09-14) narrows which outcomes are mailed. Failures are mailed whatever it says; it decides what a *successful* run does. `always` (the default, and the only behaviour before the key existed) mails every success. `warnings` mails a success only when its log carries a warning from the deploy scripts themselves — a domain with no identity in `lib/editions.js`, a defaulted `ADMIN_EMAIL` — and the subject then reads `SUCCESS WITH WARNINGS`; a clean success is not mailed. `failure` never mails a success. The match is on the scripts' own `WARN [label]:` / `--- WARNING:` / `=== WARNING:` line shapes at the start of a line, so `npm WARN deprecated` and Eleventy's own warnings don't count. Two things a routine success email was quietly doing, and nothing here replaces: it was the one regular proof that `ADMIN_EMAIL` actually delivers (see the table row above for why a wrong address is undetectable), and it said what a domain had shipped — for which `/version.txt` on the domain is now the check (see [Checking what's live](#checking-whats-live)). An unrecognised value is treated as `always`, since the safe direction for a typo in an alerting setting is more mail. The full log still persists under `deploy-logs/` on every run, mailed or not.

#### `CUSTOM_LORE_FILE` and `CUSTOM_CSS_FILE`

Let one clone carry a small amount of domain-exclusive content without touching the shared repo:

- `CUSTOM_LORE_FILE` is a path to a clone-local, untracked markdown file with valid lore-entry front matter (`layout: lore-entry.njk`, `title`, `category`, etc. — see any file under `src/lore/` for the shape). If set, `scripts/cpanel-deploy.sh` copies it into `src/lore/custom/` before the build, so it becomes one extra lore page unique to this clone (builds at `/lore/custom/<filename-without-extension>/`), then removes it again once the build has read it — the clone's working tree never carries leftover untracked content between deploys, and nothing is ever committed to the shared repo. Because it inherits `lore-entry.njk`'s layout like any other lore page, it gets giscus comments the same way too, in the shared "Lore & Worldbuilding" pool (see [Discussion forum (giscus)](#discussion-forum-giscus)) — keyed by its own `/lore/custom/<filename>/` path, so give each clone's `CUSTOM_LORE_FILE` a domain-unique basename (as `sample-deploy.conf`'s examples already do) unless you'd actually want two clones' exclusive entries sharing one comment thread.
- `CUSTOM_CSS_FILE` is a path to a clone-local, untracked CSS file. If set, its contents are appended to the deployed `css/main.css` after the `THEME` stylesheet, so a clone can tweak a handful of things — a color, a font — without needing a whole new `theme-<name>.css` in the shared repo. Because it loads last, its rules can override the theme's.
- Both fail the deploy loudly (not silently) if set to a path that doesn't exist, so a typo can't ship a build silently missing the content the clone owner expected.

## Creative tooling

- Repository-aligned master prompt: [`prompts/star-rangers-universe-engine.md`](./prompts/star-rangers-universe-engine.md)
