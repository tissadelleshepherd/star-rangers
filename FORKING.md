# Forking this repository

This repo is built to be forked two different ways. Pick one before you start replacing content — it changes what you keep.

Forking needs no permission and is actively encouraged. The one condition, and the reasoning behind it, is in [`CONTRIBUTING.md`](./CONTRIBUTING.md): a fork must be self-contained, because this project can't take on pull requests or support forks.

## The two licences (read this part first)

- **Engine** (`.eleventy.js`, `lib/`, `src/_includes/`, `src/css/`, `src/js/`, `scripts/`): **MIT** — see [`LICENSE`](./LICENSE). Reuse it for anything, including a wholly original story with no connection to Fian Ilchruinne.
- **Story content** (`src/seasons/`, `src/threads/`, `src/characters/`, `src/timeline/`, `src/lore/`, `src/glossary/`, `src/codex/`, `story-bible/`, `prompts/`): **CC BY-NC-ND 4.0**, with an explicit **Fan Works Policy** exception for non-commercial fan fiction, fan art, and fan fiction clones of this site — see [`CONTENT-LICENSE.md`](./CONTENT-LICENSE.md) for the exact conditions.

That means:

- **Path A — an original site, different story entirely.** Keep the engine, delete/replace the content. No connection to Fian Ilchruinne is implied or required.
- **Path B — a Fian Ilchruinne fan fiction clone.** Keep the engine *and* some or all of the existing content, and add your own stories in the same universe. Must stay non-commercial and clearly labeled as unofficial fan work — see `CONTENT-LICENSE.md`'s Fan Works Policy for the full conditions.

Both paths start the same way below; they only diverge at "replace or extend the content."

## What each path may do

One principle governs every way this site reaches a domain that isn't this project's own. A **fork** may *add* content, *hide* content, and *adjust the presentation layer* — but never alter the existing record. A **deployment** (one of this project's registered domains, or an independent host using `editions.local.json` — see "Taking an edition to your own domain" below) may *filter* what's shown and *adjust presentation* — nothing else.

| | Fan-work fork (Path B) | Deployment / independent host |
|---|---|---|
| **Add content** | Yes — your own stories alongside the record, non-commercial and clearly labeled unofficial ([`CONTENT-LICENSE.md`](./CONTENT-LICENSE.md)'s Fan Works Policy). Nothing added is ever this story's canon. | No — there is deliberately no key or field that can add a page. |
| **Hide content** | Yes — omit what you don't use, or use the same filtering the engine ships with. | Yes — `CHARACTERS`/`TOPICS`/`THREADS` narrowing; excluded pages render placeholders, never 404s. |
| **Alter existing content** | No — the ND in CC BY-NC-ND: no derivatives of the record. | No — every domain serves the same record; a deployment has no lever that could change it. |
| **Adjust presentation** | Freely — the engine (layouts, CSS, JS) is MIT. | Yes — theme palette, edition branding and copy, `CUSTOM_CSS_FILE`. |
| **Enforced by** | The content licence. A fork holds the full text, so the constraint is legal, not mechanical. | The engine itself. The constraint is structural — a deployment can't break it even by mistake. |

Two notes on scope. A **Path A fork** (original story) sits outside this table: it deletes the content wholesale and keeps only the MIT engine, which is not altering the record but not using it. And "add" always means *add alongside*: fork-added stories enter as fan work — or as a chartered work, if approved — which canon binds and which never binds canon.

## What's engine vs. content

| Keep (engine) | Replace (Path A) or extend (Path B) |
|---|---|
| `.eleventy.js`, `lib/`, `scripts/` | `src/seasons/`, `src/threads/` |
| `src/_includes/` (layouts) | `src/characters/`, `src/timeline/` |
| `src/css/`, `src/js/`, `src/images/`, `src/audio/` (swap assets, keep the mechanism) | `src/lore/`, `src/glossary/`, `src/codex/` |
| `src/_data/` (mechanism; `giscus.js`'s *values* need updating — see below) | `story-bible/`, `prompts/` |

## Step by step

1. **Fork the repo**, then locally: `npm install && npm start` to confirm it builds before changing anything.
2. **Decide Path A or B**, then either delete the content directories above and write your own (Path A), or keep what you want and add to it (Path B — check `CONTENT-LICENSE.md`'s conditions as you go). Either way, use `npm run new` to scaffold each new character/lore/codex/glossary entry, chapter, or journal entry — it prompts for the right fields instead of you having to copy an example file and guess which parts matter (see TECHNICAL-README.md's "Adding content" section). `npm test` validates front matter against the same schema, so a typo'd field fails with a clear message instead of a silent bad build.
3. **Rebrand.** `SITE_NAME`/`SITE_TITLE` (env vars, or `deploy.conf` keys — see TECHNICAL-README.md's cPanel section) already cover the header logo, footer, and browser `<title>`, no code changes needed. Beyond that, search this repo for `dermot-r-cochran` and `sciencefiction.site` and replace them with your own identity — they're hardcoded in `TECHNICAL-README.md`, `src/about/index.md`, `src/index.md`, and `package.json`'s `repository`/`bugs`/`homepage` fields, since nothing about *who you are* can be inferred automatically. One `sciencefiction.site` reference is functional rather than cosmetic: `DEFAULT_REFERENCE_DOMAIN` in `lib/storyline-threads.js` is the full-site domain that a narrowed deploy's "not included in this edition" placeholder links back to — set it to your own full-site domain (and any private thread's `homeDomain` there likewise) if you run narrowed clones.
4. **Fix the path prefix, if you need to.** This project hardcodes `/star-rangers/` in absolute links throughout layouts *and* content (~200 files) because Eleventy's own `pathPrefix` stays `/` here — see the comment above `SITE_PATH_PREFIX` in `.eleventy.js` for why. Set `SITE_PATH_PREFIX` (e.g. `/my-fork/` for a differently-named GitHub Pages repo, or `/` for local preview at root or a custom domain) and every occurrence gets rewritten at build time — no manual find/replace needed, including the search box's Pagefind bundle path (see TECHNICAL-README.md's "Search" section). You don't need this for cPanel deploys; see step 6.
5. **Set up your own comments repo**, if you want giscus comments at all (see TECHNICAL-README.md's "Discussion forum (giscus)" section for the full walkthrough):
   - Create your own public `<you>/<your-comments-repo>`, enable Discussions, create the same category structure (or your own).
   - Copy `sample-giscus.local.json` to `giscus.local.json` (gitignored) and fill in your repo + category IDs. This points comments at your board on **every** build path — `npm start`, GitHub Pages, and cPanel — without editing the engine's `src/_data/giscus.js` or fighting an upstream merge. Run `GITHUB_TOKEN=ghp_xxx node scripts/fetch-giscus-ids.js --repo <you>/<your-comments-repo>` to print the five values to paste in.
   - *(Alternatives:* for a cPanel-only fork you can instead set the `GISCUS_*` keys in `deploy.conf`; or, maintaining a long-lived fork, edit `giscus.js`'s `GISCUS_PROFILES` directly and re-run the fetch with `--write`. The local file is simplest and works everywhere.*)*
6. **Deploy.**
   - **GitHub Pages**: `.github/workflows/deploy.yml` works unmodified, but **set two repository variables** (Settings → Secrets and variables → Actions → Variables) rather than editing the workflow, because its fallbacks are this project's own: `SITE_PATH_PREFIX` (`/your-repo/` for a project site, `/` for a custom domain — the workflow falls back to `/`, since this project's Pages build serves its canonical domain at the root) and **`SITE_DOMAIN`** (e.g. `you.github.io/your-repo`, no scheme or trailing slash — the workflow falls back to `fianilchruinne.com`, so left unset your `sitemap.xml`, `robots.txt`, feed and canonicals would all name this project's domain). Delete `src/CNAME`, which is this project's custom-domain file, or replace it with your own. Comments are on in the workflow; pathname-mapped giscus threads only make sense at the root of a domain, so if you serve under a `/your-repo/` subpath, add `COMMENTS_ENABLED: "false"` to the build step's `env`, and if you want comments at all set up `giscus.local.json` (step 5).
   - **Any other static host** (Netlify, Vercel, Cloudflare Pages, a plain bucket): run `npm run build` and publish `_site/`. Set `SITE_PATH_PREFIX=/` (step 4) if you serve at the domain root, and `SITE_DOMAIN=your-domain.com` at build time so the sitemap/robots/feed absolute URLs are yours, not this project's. `giscus.local.json` (step 5) is read at build the same as on any other path. None of these are tested by this project, but they use only the standard Eleventy build — no cPanel-specific machinery. For per-domain branding and copy on these hosts, see "Taking an edition to your own domain" below.
   - **cPanel**: copy `sample-deploy.conf` to `deploy.conf` and fill in your own values (see TECHNICAL-README.md's cPanel section for the full key reference) — or `sample-deploy-minimal.conf`, which is the same file cut down to `CPANEL_USER` and `DOMAIN`. Your domain won't be in `lib/editions.js`, so nothing gets resolved from that registry and the build falls back to its own defaults; set whatever you need explicitly in `deploy.conf`, or register your domain in an untracked `editions.local.json` — see "Taking an edition to your own domain" below. You don't need `SITE_PATH_PREFIX` here at all — `scripts/cpanel-deploy.sh` already rewrites the hardcoded `/star-rangers/` prefix to `/` as part of every cPanel deploy, regardless of fork, so cPanel targets just work unmodified. Need a cPanel host? This project's own domains run on [iFastNet](https://ifastnet.com/portal/aff.php?aff=29941) (referral link).

## Taking an edition to your own domain (`editions.local.json`)

[`lib/editions.js`](./lib/editions.js) is the tracked registry of this project's own domains and their per-domain identity — "editions": palette, content filter, branding, homepage copy and flourishes. An untracked `editions.local.json` in the repo root adds your own domain to that registry without editing a tracked engine file, so pulling upstream never conflicts — the same arrangement as `giscus.local.json` (step 5) and `deploy.conf`. Copy [`sample-editions.local.json`](./sample-editions.local.json) into place (the copy is gitignored) and edit; the template documents every field inline.

It supports two moves:

- **Re-point an existing edition at your own domain.** An entry whose `id` matches a tracked edition merges over it field by field, so an entry setting only `id` and `domains` inherits everything else that edition defines — tagline, hero cast, theme audio, and its `CHARACTERS`/`TOPICS`/`THREADS` content narrowing. For example, an entry with id `pets` and your own hostname in `domains` gives your domain the complete Undercover Pets edition, filter included. Note that any field you set replaces the tracked value wholesale, `domains` included — list every hostname the edition should serve, not just the one you're adding.
- **Declare a new edition outright.** A new `id` is added alongside the tracked ones. Declare only the fields you want to change; everything else falls back to the default (full-site) edition.

How your entry is picked up depends on the build path:

- **cPanel:** automatic. `scripts/cpanel-deploy.sh` resolves `deploy.conf`'s `DOMAIN` against the merged registry — tracked entries plus your local file — so once your domain resolves, the two-line `deploy.conf` (`CPANEL_USER` + `DOMAIN`) carries the whole identity, exactly as it does for this project's own registered domains.
- **Any other host (GitHub Pages, Netlify, local preview…):** there is no domain lookup at build time. Name the edition explicitly with `EDITION=<your id>` in the build environment to get its homepage copy and flourishes, and set `SITE_NAME`/`SITE_TITLE` and `CHARACTERS`/`TOPICS`/`THREADS` env vars yourself if you want its branding and narrowing — only the cPanel path derives those from the registry.

Three boundaries hold whichever move you make:

- **Reference editions by `id`, never by borrowing a domain.** Set `DOMAIN`/`SITE_DOMAIN` only to a hostname you actually serve: that value is stamped into every page's canonical URL, the sitemap and the feed, so a build claiming someone else's domain tells search engines it *is* that site (consolidating your traffic to it) and tangles pathname-mapped giscus comment threads with the real site's.
- **No field in this file can add story content, by design.** Editions carry framing only; canon is centralised and identical on every domain. That protects you as much as the record — nothing you put here can be mistaken for this story's canon.
- **The content licence still applies.** Serving the story from your own domain is use of the CC BY-NC-ND content — see [`CONTENT-LICENSE.md`](./CONTENT-LICENSE.md) — whatever the engine configuration says.
