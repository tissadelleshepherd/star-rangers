#!/bin/bash
#
# scripts/cpanel-deploy.sh
#
# Single entry point for the cPanel Git Version Control deployment. All of
# the logic previously spread across 5 separate .cpanel.yml tasks lives
# here now, because cPanel aborts every remaining task the instant one
# exits non-zero - that made it impossible to guarantee a deployment-log
# notification email fires on failure (e.g. ensure-node.sh failing to
# download Node mid-build used to just silently stop the deploy, with only
# cPanel's own UI log as a record). Centralizing into one task/script means
# we control our own success/failure handling and can always notify.
#
# Shell: bash (not POSIX sh, unlike ensure-node.sh, which is *sourced* and
# so must work under any caller shell). This script is *executed* with its
# own interpreter, invoked explicitly as `bash scripts/cpanel-deploy.sh`
# from .cpanel.yml (see that file), so the interpreter choice here is
# independent of cPanel's task-runner shell. bash's `${PIPESTATUS[0]}` is
# what makes the "capture full log AND keep it live in cPanel's own UI AND
# know the real exit code" combination simple and race-free (see `main`
# invocation below); a portable POSIX equivalent exists but is meaningfully
# more fragile for a marginal portability gain, since cPanel/WHM hosts
# universally ship /bin/bash (cPanel's own stack depends on it).
#
# Multi-domain: one clone can now deploy the primary site (public_html)
# AND any number of optional "alt domains" - each a sibling folder under
# the same $HOME, at the same level as public_html (e.g. an addon domain's
# own document root), with its own DOMAIN/THEME/CHARACTERS/etc, declared in
# this same clone's deploy.conf via ALT_DOMAINS. See that file's header
# comment for the full key reference. build_and_deploy() below runs one
# full build+deploy pass per domain; main() calls it once for the primary
# and once per ALT_DOMAINS entry, all reusing the one npm-installed
# node_modules/ that main() sets up before the first call.
#
# DEPLOY_PRIMARY=false skips the public_html pass entirely, for a clone
# whose cPanel account only exists to serve one or more addon domains -
# public_html on that account may be reserved for something else, or
# deliberately left parked, and this account's ALT_DOMAINS entries
# shouldn't also duplicate the site there. See that key's own check in
# main() below for what happens if it's false with no ALT_DOMAINS set.

set -u

REPOSITORY_ROOT="${REPOSITORY_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
cd "$REPOSITORY_ROOT" || exit 1

# ---------------------------------------------------------------------------
# Shared machinery (LOG_FILE, notification list + mailer, log persistence)
# comes from scripts/deploy-lib.sh - a file kept byte-identical between this
# repo and dermot-cochran-photography (like ensure-node.sh); see its header
# for the sourcing contract. Everything below this point is site-specific.
# ---------------------------------------------------------------------------
# shellcheck source=scripts/deploy-lib.sh
. "$REPOSITORY_ROOT/scripts/deploy-lib.sh" \
  || { echo "FAIL: could not source scripts/deploy-lib.sh" >&2; exit 1; }
# shellcheck disable=SC2034  # consumed by deploy-lib.sh's deploy_lib_notify()
DEPLOY_SUBJECT_PREFIX="[star-rangers deploy]"

# ---------------------------------------------------------------------------
# Source deploy.conf ONCE. This script *is* the single .cpanel.yml task now,
# so - unlike the old 5-task version, where each task ran in its own shell
# and had to re-source deploy.conf independently - there's no cross-task
# persistence problem; one sourcing point is enough. These are the PRIMARY
# domain's (public_html's) settings; ALT_DOMAINS entries read their own
# settings via ALT_<id>_* keys, fetched with alt_get() below rather than
# fixed variable names, since the set of alt domains is dynamic.
# ---------------------------------------------------------------------------
CPANEL_USER="sciencef"
# Empty, not "default", since 2026-07-30: these keys can now be filled in from
# lib/editions.js by domain, and that requires being able to tell "this clone
# did not set it" from "this clone set it to the default value". Normalised to
# their real defaults after resolution, further down.
THEME=""
# Optional explicit override. Normally left unset and resolved from DOMAIN via
# lib/editions.js; set it when a domain should take an edition that isn't the
# one registered for it, or to preview a branded edition from an unregistered
# host. Independent of THEME on purpose - see lib/editions.js.
EDITION=""
CHARACTERS=""
TOPICS=""
THREADS=""
ADMIN_EMAIL=""
# No default, since 2026-10-09. Until then a conf-less clone, or a deploy.conf
# with no DOMAIN line, silently claimed fianilchruinne.com: it built the
# canonical full site, branded as the canonical, with every page's canonical
# tag and the whole sitemap naming fianilchruinne.com, and rsynced that onto
# whatever domain the account actually serves. sciencefiction.site and
# starquest.site ran that way for weeks, reported as SUCCESS, and Google kept
# two pages of each. The deploy now refuses to run without a DOMAIN (checked
# right after deploy.conf is sourced); the canonical domain names itself in
# its own deploy.conf like any other.
DOMAIN=""
SITE_NAME=""
SITE_TITLE=""
# SITE_NOINDEX=true builds a domain that asks not to be indexed at all:
# robots.txt becomes Disallow: /, every page carries a noindex,nofollow
# robots meta, and no canonicals are emitted. For testing/staging
# (sub)domains, which would otherwise serve the full site, self-canonicalise
# and compete with fianilchruinne.com in search. deploy.conf-only on
# purpose - a testing domain is exactly the kind that should NOT be
# registered in lib/editions.js.
SITE_NOINDEX=""
CUSTOM_LORE_FILE=""
CUSTOM_CSS_FILE=""
# Empty for the same reason as THEME above; normalised to "true" after
# resolution.
COMMENTS_ENABLED=""
GISCUS_PROFILE=""
GISCUS_REPO=""
GISCUS_REPO_ID=""
GISCUS_CATEGORY_CHARACTERS_ID=""
GISCUS_CATEGORY_LORE_ID=""
GISCUS_CATEGORY_EPISODES_ID=""
GISCUS_CATEGORY_JOURNAL_ID=""
ALT_DOMAINS=""
DEPLOY_PRIMARY="true"
# shellcheck disable=SC1091
[ -f "$REPOSITORY_ROOT/deploy.conf" ] && . "$REPOSITORY_ROOT/deploy.conf"

# DOMAIN is the one key with no safe default - see its declaration above. An
# inline `exit 1` is right here: nothing has been built, no log file is open
# yet, and cPanel's own deploy log and cpanel-autopull.sh's failure mail both
# carry stderr.
if [ -z "$DOMAIN" ]; then
  echo "FAIL: deploy.conf sets no DOMAIN (or there is no deploy.conf). The domain" >&2
  echo "FAIL:   decides the edition, the canonical tags, the sitemap and the branding," >&2
  echo "FAIL:   so a missing value cannot be guessed. Put DOMAIN=<host> in deploy.conf" >&2
  echo "FAIL:   (sample-deploy-minimal.conf is the two-line form)." >&2
  exit 1
fi
# ADMIN_EMAIL defaults to admin@<DOMAIN> rather than staying unset, so every
# clone gets a deploy-log notification out of the box without needing its
# own deploy.conf entry. The flag feeds a loud warning inside main()'s
# logged output: a defaulted address only works if it actually EXISTS on
# the server (cPanel forwarder or mailbox), and a guessed address that
# doesn't is the one failure mode this script's notifications cannot
# detect - `mail` hands the message to the local MTA successfully and the
# MTA quietly discards it. That is exactly how a failed deploy on a
# freshly-canonicalised domain went unexplained on 2026-08-03: ADMIN_EMAIL
# defaulted to admin@<new domain>, no forwarder existed yet, and the
# FAILURE email carrying the log went nowhere. (The log itself was still
# in deploy-logs/, as always.)
ADMIN_EMAIL_DEFAULTED=""
[ -z "$ADMIN_EMAIL" ] && { ADMIN_EMAIL="admin@$DOMAIN"; ADMIN_EMAIL_DEFAULTED="yes"; }

# ---------------------------------------------------------------------------
# resolve_edition(): fills in whatever deploy.conf left unset, from
# lib/editions.js, keyed by domain. Added 2026-07-30 so a minimum viable
# deploy.conf is CPANEL_USER + DOMAIN (+ ALT_DOMAINS) and nothing else.
#
# PRECEDENCE IS DELIBERATE AND ONE WAY: deploy.conf wins wherever it set a
# value, and the registry only fills gaps. Two reasons. It means this change
# cannot alter any existing clone's behaviour - deploy.conf is untracked and
# lives on this account, so live configs cannot be migrated from the repo, and
# a registry that overrode them would silently re-skin a live domain. And the
# registry's own alt-domain entries were inferred from sample-deploy.conf's
# commented examples rather than read from the real thing, so they are the less
# trustworthy source until confirmed.
#
# Every filled key is logged with its provenance for exactly that reason. Read
# the [edition] lines on the first deploy after this lands and check them
# against what each domain actually sets; correct lib/editions.js, not this.
#
# Usage: resolve_edition <domain> <var-prefix>
#   Reads the registry for <domain> and, for each key, sets <prefix>_<KEY> only
#   if it is currently empty. Echoes one provenance line per key.
# ---------------------------------------------------------------------------
resolve_edition() {
  # Scratch vars are local; the RESOLVED_* ones deliberately are not, since the
  # caller reads them straight after.
  local re_domain re_label re_output
  re_domain="$1"; re_label="$2"
  # Clear EVERY resolved key, not just the id. main() calls this once per
  # domain in a loop, so a value left over from the previous domain would be
  # filled into this one - and if that previous domain was registered and this
  # one is not, it would inherit a theme and a THREADS filter belonging to
  # somebody else. Same class of leak the custom-lore RETURN trap guards
  # against further down, and it was a live bug before this line existed.
  RESOLVED_EDITION=""
  RESOLVED_THEME=""
  RESOLVED_THREADS=""
  RESOLVED_CHARACTERS=""
  RESOLVED_TOPICS=""
  RESOLVED_SITE_NAME=""
  RESOLVED_SITE_TITLE=""
  RESOLVED_GISCUS_PROFILE=""
  RESOLVED_COMMENTS_ENABLED=""
  RESOLVED_RANKS_AT=""
  RESOLVED_ALIAS_OF=""
  RESOLVED_ALIASES=""
  # An unreadable or malformed registry must not take the deploy down: the
  # build itself validates lib/editions.js (see validateEditions in it), so a
  # failure here means something is wrong with node or the file, and the right
  # response is to carry on with deploy.conf's own values and say so.
  re_output=$(node "$REPOSITORY_ROOT/scripts/resolve-edition.js" --domain "$re_domain" 2>/dev/null) || {
    echo "--- [$re_label] edition: registry lookup failed, using deploy.conf values only ---"
    return 0
  }
  eval "$re_output"
  if [ -z "$RESOLVED_EDITION" ]; then
    echo "--- [$re_label] edition: '$re_domain' is not registered in lib/editions.js; using deploy.conf values only ---"
    return 0
  fi
  echo "--- [$re_label] edition: '$re_domain' -> '$RESOLVED_EDITION' (lib/editions.js) ---"
}

# ---------------------------------------------------------------------------
# append_alias_redirects(): one host-conditional 301 block at the end of the
# built site's .htaccess, forwarding every PARKED alias of this domain to it.
#
# deploy_alias_notice() above handles an alias that has a document root of its
# own. A parked alias has none: cPanel points it at its target's docroot, so
# until now it served a full copy of the site under its own name - correct for
# Google only because every page carries a cross-domain canonical, and still
# crawled in full (the 9 October 2026 Search Console sweep found 885 URLs known
# on star-rangers.site, a domain registered purely to defend the name). The
# ALIAS DOMAINS block in lib/editions.js already says an alias is a 301, never
# a second build; this makes that true for the parked ones too.
#
# The list comes from resolve-edition.js (RESOLVED_ALIASES, the inverse of
# RESOLVED_ALIAS_OF), so the registry stays the only place an alias is named.
# Each condition matches the bare host and its www. form; /.well-known/ is
# exempt for AutoSSL, as in src/static/.htaccess. Path and query are preserved
# so a deep link lands on its counterpart. Appended after the static file's
# HTTPS block, so a plain-http request to an alias takes two hops; acceptable.
# ---------------------------------------------------------------------------
append_alias_redirects() {
  local aar_label aar_domain aar_aliases aar_file aar_alias aar_escaped aar_conds
  local -a aar_list
  aar_label="$1"; aar_domain="$2"; aar_aliases="$3"; aar_file="$4"
  [ -n "$aar_aliases" ] || return 0
  test -f "$aar_file" \
    || { echo "FAIL [$aar_label]: $aar_file missing, cannot append alias redirects" >&2; return 1; }
  read -r -a aar_list <<< "$aar_aliases"
  aar_conds=""
  for aar_alias in "${aar_list[@]}"; do
    aar_escaped=$(printf '%s' "$aar_alias" | sed 's/\./\\./g')
    aar_conds="${aar_conds}  RewriteCond %{HTTP_HOST} ^(www\\.)?${aar_escaped}\$ [NC,OR]
"
  done
  # The last condition must not carry OR, or it would OR with nothing.
  aar_conds=$(printf '%s' "$aar_conds" | sed '$ s/ \[NC,OR\]$/ [NC]/')
  {
    printf '\n# Parked aliases of %s: 301 to the domain they defend. Generated by\n' "$aar_domain"
    printf '# scripts/cpanel-deploy.sh from the ALIASES map in lib/editions.js - edit that,\n'
    printf '# not this file. Hosts not listed here never match, so the block is inert on\n'
    printf '# the domain itself.\n'
    printf '<IfModule mod_rewrite.c>\n'
    printf '  RewriteEngine On\n'
    printf '  RewriteCond %%{REQUEST_URI} !^/\\.well-known/\n'
    printf '%s\n' "$aar_conds"
    printf '  RewriteRule ^(.*)$ https://%s/$1 [R=301,L]\n' "$aar_domain"
    printf '</IfModule>\n'
  } >> "$aar_file" \
    || { echo "FAIL [$aar_label]: could not append alias redirects to $aar_file" >&2; return 1; }
  echo "---   [$aar_label] alias redirects appended to .htaccess: $aar_aliases -> $aar_domain"
}

# ---------------------------------------------------------------------------
# check_custom_css_powers(): warns when a CUSTOM_CSS_FILE uses CSS for more
# than styling. Never fails the deploy.
#
# WHY THIS EXISTS. This key was documented as "cosmetic" and as unable to
# "assert a fact". That was wrong. CSS here can inject text (`content:` on a
# pseudo-element is prose delivered by stylesheet), hide the codex non-canon
# notice, hide the licence attribution, reorder what a human reads relative to
# the DOM, and pull in third-party hosts. Nothing restrains it: there is no CSP
# on the site, and this file is appended LAST so it overrides the theme.
#
# WHY IT WARNS RATHER THAN FAILING. Two reasons. `content: ""` is ordinary
# pseudo-element decoration, so a hard failure would block legitimate CSS on a
# false positive - and a blocked deploy is worse than a log line. And the
# realistic risk is not sabotage but forgetting: hiding one of these boxes
# months from now while tidying up something you no longer recognise. A warning
# names the thing you forgot; it does not need to stop you.
#
# What limits the damage in every case is that these affect RENDERING only. The
# DOM is untouched, so crawlers, chatbots, screen readers, reader mode, the Atom
# feed and llms.txt all still get the real content. The canon rule therefore
# holds structurally and leaks only perceptually, for a sighted human on one
# domain.
# ---------------------------------------------------------------------------
check_custom_css_powers() {
  local ccp_file ccp_label ccp_hits
  ccp_file="$1"; ccp_label="$2"
  ccp_hits=0

  # `content:` with something other than an empty string. Matches content: "x"
  # or content: 'x'; deliberately does not match content: "" or content: ''.
  if grep -Eqi "content[[:space:]]*:[[:space:]]*[\"'][^\"']" "$ccp_file"; then
    echo "WARN [$ccp_label]: CUSTOM_CSS_FILE uses content: with a non-empty string - CSS can inject prose onto a page." >&2
    ccp_hits=$((ccp_hits + 1))
  fi

  # Hiding something that carries canon status, provenance or the licence.
  # Matched loosely on the selector appearing anywhere alongside a hiding
  # declaration, because properly parsing CSS in shell is not worth it for a
  # warning - a false positive here costs one log line.
  if grep -Eqi "(display[[:space:]]*:[[:space:]]*none|visibility[[:space:]]*:[[:space:]]*hidden)" "$ccp_file"; then
    # Report only the elements actually mentioned. A warning that explains
    # something you did not do is a warning that gets skimmed next time.
    local ccp_sel ccp_named=0
    for ccp_sel in \
      "codex-entry__status:the 'this is not canon, cite it as an account' notice on every codex entry" \
      "canon-facts:a chapter's canon-facts box" \
      "site-footer:the CC BY-NC-ND attribution and licence link" \
      "excluded-notice:the 'not included in this edition' placeholder and its link to the domain that has the page"
    do
      if grep -qi "${ccp_sel%%:*}" "$ccp_file"; then
        if [ "$ccp_named" -eq 0 ]; then
          echo "WARN [$ccp_label]: CUSTOM_CSS_FILE hides something and mentions:" >&2
          ccp_named=1
        fi
        echo "WARN [$ccp_label]:   .${ccp_sel%%:*} - ${ccp_sel#*:}. Check you meant to." >&2
      fi
    done
    [ "$ccp_named" -eq 1 ] && ccp_hits=$((ccp_hits + 1))
  fi

  # Third-party fetches. No CSP exists to stop these.
  if grep -Eqi "@import|url\([[:space:]]*[\"']?(https?:)?//" "$ccp_file"; then
    echo "WARN [$ccp_label]: CUSTOM_CSS_FILE reaches an external host (@import or an absolute url()) - a privacy and availability dependency." >&2
    ccp_hits=$((ccp_hits + 1))
  fi

  if [ "$ccp_hits" -gt 0 ]; then
    echo "WARN [$ccp_label]:   These change what a human sees, never the record - the DOM is untouched, so crawlers," >&2
    echo "WARN [$ccp_label]:   chatbots, screen readers and the feed still get the real content. Not blocking the deploy." >&2
  fi
  return 0
}

# fill_from_registry <var-name> <resolved-value> <label> <key-name>
# Sets <var-name> to <resolved-value> only when it is currently empty, and says
# which source won either way.
fill_from_registry() {
  # Assigns into the CALLER's variable by name. Works for both the top-level
  # globals (THEME) and main()'s own locals (alt_theme) because bash scoping is
  # dynamic: a local in a calling function is visible, and assignable, here.
  local ffr_var ffr_value ffr_label ffr_key ffr_current
  ffr_var="$1"; ffr_value="$2"; ffr_label="$3"; ffr_key="$4"
  eval "ffr_current=\${$ffr_var}"
  if [ -n "$ffr_current" ]; then
    echo "---   [$ffr_label] $ffr_key='$ffr_current' (deploy.conf)"
  elif [ -n "$ffr_value" ]; then
    eval "$ffr_var=\$ffr_value"
    echo "---   [$ffr_label] $ffr_key='$ffr_value' (edition)"
  fi
}

# ---------------------------------------------------------------------------
# deploy_alias_notice(): serve a one-page redirect from a domain registered as
# an alias, instead of building the site there.
#
# WHY THIS RATHER THAN REFUSING. Removing a domain from an edition's `domains`
# does not make it an alias - that is a cPanel operation, pointing the addon
# domain at its target's document root, and the merge that removes it cannot
# perform that step. An earlier version of this code failed the deploy in that
# gap. Failing is safe but does nothing useful: the domain keeps serving
# whatever full build was last rsynced there, which is precisely the duplicate
# the demotion was meant to end, and it stays that way until somebody logs into
# cPanel.
#
# So the gap gets a deployment of its own: an .htaccess that 301s the whole
# namespace to the target with path and query preserved, an index.html carrying
# a canonical and a meta refresh for hosts where mod_rewrite is unavailable, and
# a robots.txt. Three files, no Node, no Eleventy, no build. The consolidation
# is real from the first deploy and the cPanel repoint becomes tidying rather
# than a prerequisite.
#
# The robots.txt deliberately does NOT disallow. A crawler has to be able to
# fetch these URLs to see the 301 and consolidate them; blocking it would strand
# the redirect unseen and leave the old URLs indexed, which is the outcome the
# redirect exists to prevent.
#
# Templates live in scripts/alias-notice/ with __TARGET__ and __DOMAIN__
# substituted here. Returns 0 on success, 1 on failure, matching
# build_and_deploy so main() can aggregate either the same way.
deploy_alias_notice() {
  local dan_label dan_domain dan_target dan_dest dan_src dan_tmp dan_file
  dan_label="$1"; dan_domain="$2"; dan_target="$3"; dan_dest="$4"
  dan_src="$REPOSITORY_ROOT/scripts/alias-notice"

  echo "=== [$dan_label] $dan_domain is an alias of $dan_target - deploying redirect notice ==="

  for dan_file in index.html .htaccess robots.txt; do
    if [ ! -f "$dan_src/$dan_file" ]; then
      echo "FAIL [$dan_label]: alias-notice template $dan_src/$dan_file is missing" >&2
      return 1
    fi
  done

  if [ ! -d "$dan_dest" ]; then
    echo "FAIL [$dan_label]: destination $dan_dest does not exist" >&2
    return 1
  fi

  dan_tmp=$(mktemp -d) || { echo "FAIL [$dan_label]: could not create a temp dir" >&2; return 1; }
  # mktemp -d creates the directory 0700, and `rsync -a "$dan_tmp/" "$dan_dest"`
  # copies the SOURCE directory's mode onto the destination document root.
  # Apache then cannot enter the docroot and answers 403 to everything
  # ("Server unable to read htaccess file, denying access to be safe") - which
  # is what starquest.online, church-space.online, fellowshipoflight.online and
  # fellowshipoflight.space served for weeks, found 2026-10-09 in Search Console.
  # The full-site deploy below never hit this because _site/ is created 0755.
  chmod 755 "$dan_tmp" || { echo "FAIL [$dan_label]: could not chmod the temp dir" >&2; rm -rf "$dan_tmp"; return 1; }

  for dan_file in index.html .htaccess robots.txt; do
    # The target is a hostname validated by lib/editions.js (it must be a domain
    # some edition actually serves), so it cannot carry a sed delimiter.
    sed -e "s|__TARGET__|$dan_target|g" -e "s|__DOMAIN__|$dan_domain|g" \
      "$dan_src/$dan_file" > "$dan_tmp/$dan_file" || {
        echo "FAIL [$dan_label]: could not render $dan_file" >&2
        rm -rf "$dan_tmp"; return 1
      }
  done

  # --delete on purpose: whatever full build was last deployed here has to go,
  # or the redirect sits on top of a site that is still serving its own pages to
  # anything that reaches them without passing through .htaccess.
  if ! rsync -a --delete "$dan_tmp/" "$dan_dest"; then
    echo "FAIL [$dan_label]: rsync to $dan_dest failed" >&2
    rm -rf "$dan_tmp"; return 1
  fi
  rm -rf "$dan_tmp"

  for dan_file in index.html .htaccess robots.txt; do
    if [ ! -f "$dan_dest$dan_file" ]; then
      echo "FAIL [$dan_label]: post-deploy check - $dan_dest$dan_file missing" >&2
      return 1
    fi
  done
  if ! grep -q "$dan_target" "$dan_dest.htaccess"; then
    echo "FAIL [$dan_label]: post-deploy check - .htaccess does not name $dan_target" >&2
    return 1
  fi

  echo "=== [$dan_label] redirect notice deployed to $dan_dest (301 -> $dan_target) ==="
  echo "---   [$dan_label] To retire this: point $dan_domain at $dan_target's document root"
  echo "---   [$dan_label] (cPanel: Domains -> $dan_domain -> document root), then remove it from"
  echo "---   [$dan_label] ALT_DOMAINS. Until then this redirect does the same job."
  return 0
}

# warn_no_identity(): says so, and carries on.
#
# The case the alias check deliberately does not cover: a domain nobody has
# configured anywhere. For a third-party fork that is normal and correct - the
# full site is what they want - so this must never fail a deploy. For this
# project it is usually an accident, and one that has actually happened: an
# editing slip dropped the `starquest` and `pets` entries on 2026-08-20 and both
# domains silently resolved as unregistered. A line in the deploy log, which
# ADMIN_EMAIL receives, is the right weight for something that is routine for one
# audience and a mistake for the other.
warn_no_identity() {
  local wni_label wni_domain wni_edition wni_theme wni_site_name wni_filters
  wni_label="$1"; wni_domain="$2"; wni_edition="$3"; wni_theme="$4"; wni_site_name="$5"; wni_filters="$6"

  [ -n "$wni_edition$wni_theme$wni_site_name$wni_filters" ] && return 0

  echo "WARN [$wni_label]: '$wni_domain' has no identity from either source - not in" >&2
  echo "WARN [$wni_label]:   lib/editions.js, and deploy.conf sets no THEME, SITE_NAME," >&2
  echo "WARN [$wni_label]:   CHARACTERS, TOPICS or THREADS. Deploying the FULL unfiltered" >&2
  echo "WARN [$wni_label]:   site, unbranded. That is correct for an independent fork and" >&2
  echo "WARN [$wni_label]:   is probably a mistake for a clone of this project." >&2
  return 0
}

resolve_edition "$DOMAIN" "primary"
fill_from_registry EDITION "$RESOLVED_EDITION" primary EDITION
fill_from_registry THEME "$RESOLVED_THEME" primary THEME
fill_from_registry THREADS "$RESOLVED_THREADS" primary THREADS
fill_from_registry CHARACTERS "$RESOLVED_CHARACTERS" primary CHARACTERS
fill_from_registry TOPICS "$RESOLVED_TOPICS" primary TOPICS
fill_from_registry SITE_NAME "$RESOLVED_SITE_NAME" primary SITE_NAME
fill_from_registry SITE_TITLE "$RESOLVED_SITE_TITLE" primary SITE_TITLE
fill_from_registry GISCUS_PROFILE "$RESOLVED_GISCUS_PROFILE" primary GISCUS_PROFILE
fill_from_registry COMMENTS_ENABLED "$RESOLVED_COMMENTS_ENABLED" primary COMMENTS_ENABLED

# ranksAt is registry-only and has no deploy.conf key, so it takes no
# fill_from_registry pass - which side of the server/repo seam it falls on is
# the whole point. Which domain in a family carries the ranking signal is a
# decision about live sites, reviewable in a pull request; it is exactly the
# class of thing lib/editions.js exists to hold and an untracked file on a
# cPanel account must not be able to override quietly.
#
# Captured here rather than read at the call site because the ALT_DOMAINS loop
# below calls resolve_edition again per domain, overwriting every RESOLVED_*
# global. The primary build runs first today and would read the right value by
# luck; this does not depend on that ordering.
PRIMARY_RANKS_AT="$RESOLVED_RANKS_AT"
PRIMARY_ALIASES="$RESOLVED_ALIASES"

# Checked BEFORE the THEME default below, which is what makes the check possible
# at all: once THEME is "default" there is no way to tell a domain that chose the
# main palette from one nobody configured.
PRIMARY_ALIAS_OF="$RESOLVED_ALIAS_OF"
warn_no_identity primary "$DOMAIN" "$EDITION" "$THEME" "$SITE_NAME" "$CHARACTERS$TOPICS$THREADS"

# Normalise the two keys whose pre-set defaults had to become empty above, so
# everything downstream sees exactly the values it always saw.
THEME="${THEME:-default}"
COMMENTS_ENABLED="${COMMENTS_ENABLED:-true}"

# ---------------------------------------------------------------------------
# alt_id_valid() / alt_get(): helpers for reading ALT_<id>_<suffix> keys out
# of deploy.conf via bash indirect expansion (e.g. `alt_get site2 THEME`
# reads $ALT_site2_THEME). alt_id_valid() restricts ALT_DOMAINS entries to
# valid bash identifier characters up front, since an id like "site-2"
# would silently build a variable name (ALT_site-2_THEME) that can never
# match anything a human wrote in deploy.conf - better to reject it loudly
# than have it look "supported" while quietly reading nothing. alt_get()
# guards with `[ -v ... ]` rather than a bare `${!var}` because indirect
# expansion of a wholly-unset variable is unreliable across bash versions
# under `set -u`; testing existence first sidesteps that entirely.
# ---------------------------------------------------------------------------
alt_id_valid() {
  [[ "$1" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]
}

alt_get() {
  local var="ALT_${1}_${2}"
  if [ -v "$var" ]; then
    printf '%s' "${!var}"
  fi
}

# ---------------------------------------------------------------------------
# Notification list: every address that should get this run's deploy-log
# email, computed once up front from deploy.conf alone (ADMIN_EMAIL plus
# each valid ALT_DOMAINS entry's own ADMIN_EMAIL, defaulting the same way
# ADMIN_EMAIL itself does - admin@<that domain> - when unset). This has to
# happen here, before main() runs - see deploy-lib.sh's NOTIFY_EMAILS
# comment for why the list can't be built inside main() itself.
# ---------------------------------------------------------------------------
deploy_lib_add_notify_email "$ADMIN_EMAIL"
for _alt_id in $ALT_DOMAINS; do
  if alt_id_valid "$_alt_id"; then
    _alt_email=$(alt_get "$_alt_id" ADMIN_EMAIL)
    if [ -z "$_alt_email" ]; then
      _alt_domain_for_default=$(alt_get "$_alt_id" DOMAIN)
      [ -n "$_alt_domain_for_default" ] && _alt_email="admin@$_alt_domain_for_default"
    fi
    deploy_lib_add_notify_email "$_alt_email"
  fi
done
unset _alt_id _alt_email _alt_domain_for_default

{
  printf '=== cPanel deploy started: %s (user=%s theme=%s domain=%s site_name=%s site_title=%s custom_lore=%s custom_css=%s comments_enabled=%s giscus_repo=%s deploy_primary=%s alt_domains=%s) ===\n' \
    "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$CPANEL_USER" "$THEME" "$DOMAIN" \
    "${SITE_NAME:-default}" "${SITE_TITLE:-default}" \
    "${CUSTOM_LORE_FILE:-none}" "${CUSTOM_CSS_FILE:-none}" "$COMMENTS_ENABLED" "${GISCUS_REPO:-default}" "$DEPLOY_PRIMARY" "${ALT_DOMAINS:-none}"
} | tee -a "$LOG_FILE"

# ---------------------------------------------------------------------------
# build_and_deploy(): runs one full eleventy build + rsync deploy for a
# single domain (the primary public_html, or one ALT_DOMAINS entry), given
# that domain's own settings. Called once for the primary and once per
# ALT_DOMAINS entry from main() below - every step here (build, prefix
# rewrite, theme/CSS select, rsync, post-deploy checks) is unchanged in
# substance from the pre-multi-domain version, just parameterized and
# scoped to run more than once per invocation.
#
# Returns 0 on success, 1 on failure - a failure here must NOT raise (exit)
# out of main(), since one broken alt domain (e.g. its folder not actually
# provisioned yet) shouldn't block the primary site, or any other alt
# domain, from getting its own update. main() aggregates every call's
# result into one overall pass/fail instead.
# ---------------------------------------------------------------------------
build_and_deploy() {
  local label="$1" dest="$2" b_theme="$3" b_characters="$4" b_topics="$5" b_threads="$6" \
        b_site_name="$7" b_site_title="$8" b_site_domain="$9" \
        b_custom_lore_file="${10}" b_custom_css_file="${11}"
  shift 11

  # Anything left in "$@" past the 11 fixed positions above is a trailing
  # NAME=value toggle (COMMENTS_ENABLED, and the GISCUS_* keys: GISCUS_PROFILE
  # plus the 6 repo/category overrides) rather than its own numbered
  # parameter - a plain setting added later only needs a `local`/case arm here
  # plus one more "NAME=$value" string at each call site below, not a new
  # position threaded through this whole function (and both callers) in order.
  # Unrecognized names fail loudly rather than being exported blindly, same
  # spirit as the CUSTOM_LORE_FILE/CUSTOM_CSS_FILE "missing file" checks
  # further down.
  local COMMENTS_ENABLED="true" SITE_NOINDEX="" SITE_RANKS_AT="" SITE_ALIASES=""
  # EDITION must be threaded through and exported separately from THEME, not
  # derived from it. lib/editions.js falls back to THEME when EDITION is unset,
  # which covers a clone that predates the registry - but the entire point of
  # the registry is that the two are now independent axes. A domain whose
  # edition id differs from its palette (EDITION=my-site THEME=sepia) would
  # otherwise have its copy resolved as editionFor("sepia"), find nothing, and
  # silently ship the default tagline.
  local EDITION=""
  local GISCUS_PROFILE="" GISCUS_REPO="" GISCUS_REPO_ID="" GISCUS_CATEGORY_CHARACTERS_ID="" \
        GISCUS_CATEGORY_LORE_ID="" GISCUS_CATEGORY_EPISODES_ID="" GISCUS_CATEGORY_JOURNAL_ID=""
  local b_kv b_kv_name b_kv_value
  for b_kv in "$@"; do
    b_kv_name="${b_kv%%=*}"
    b_kv_value="${b_kv#*=}"
    case "$b_kv_name" in
      COMMENTS_ENABLED) COMMENTS_ENABLED="$b_kv_value" ;;
      SITE_NOINDEX) SITE_NOINDEX="$b_kv_value" ;;
      SITE_RANKS_AT) SITE_RANKS_AT="$b_kv_value" ;;
      SITE_ALIASES) SITE_ALIASES="$b_kv_value" ;;
      EDITION) EDITION="$b_kv_value" ;;
      GISCUS_PROFILE) GISCUS_PROFILE="$b_kv_value" ;;
      GISCUS_REPO) GISCUS_REPO="$b_kv_value" ;;
      GISCUS_REPO_ID) GISCUS_REPO_ID="$b_kv_value" ;;
      GISCUS_CATEGORY_CHARACTERS_ID) GISCUS_CATEGORY_CHARACTERS_ID="$b_kv_value" ;;
      GISCUS_CATEGORY_LORE_ID) GISCUS_CATEGORY_LORE_ID="$b_kv_value" ;;
      GISCUS_CATEGORY_EPISODES_ID) GISCUS_CATEGORY_EPISODES_ID="$b_kv_value" ;;
      GISCUS_CATEGORY_JOURNAL_ID) GISCUS_CATEGORY_JOURNAL_ID="$b_kv_value" ;;
      *) echo "FAIL [$label]: unknown build_and_deploy toggle '$b_kv_name'" >&2; return 1 ;;
    esac
  done

  # CHARACTERS/TOPICS/THREADS/THEME/SITE_NAME/SITE_TITLE/SITE_DOMAIN/
  # COMMENTS_ENABLED are read via `process.env` inside the Eleventy Node
  # build below, which runs as a *child process* - local shell variables
  # alone aren't visible to it, so they must be `export`ed. Declaring them
  # `local` first (COMMENTS_ENABLED already was, above) scopes both the
  # value AND the export to this function call only: once build_and_deploy
  # returns, the next call's (next domain's) values can't leak into a
  # later build via the inherited process environment. DOMAIN is exported
  # as SITE_DOMAIN (not DOMAIN) since that env var name is generic enough
  # to risk colliding with something host-level; src/_data/site.js reads
  # SITE_DOMAIN specifically. CPANEL_USER/CUSTOM_LORE_FILE/CUSTOM_CSS_FILE
  # are never exported: CPANEL_USER is only used to build `dest` (already
  # done by the caller), and the latter two are copied into place on disk
  # (src/lore/custom/, _site/css/main.css) before Node ever runs, so
  # Eleventy just discovers them as ordinary files.
  local CHARACTERS="$b_characters" TOPICS="$b_topics" THREADS="$b_threads" THEME="$b_theme" \
        SITE_NAME="$b_site_name" SITE_TITLE="$b_site_title" SITE_DOMAIN="$b_site_domain"
  export EDITION
  export CHARACTERS TOPICS THREADS THEME SITE_NAME SITE_TITLE SITE_DOMAIN COMMENTS_ENABLED \
    SITE_NOINDEX SITE_RANKS_AT \
    GISCUS_PROFILE GISCUS_REPO GISCUS_REPO_ID GISCUS_CATEGORY_CHARACTERS_ID GISCUS_CATEGORY_LORE_ID \
    GISCUS_CATEGORY_EPISODES_ID GISCUS_CATEGORY_JOURNAL_ID

  echo "=== [$label] build + deploy starting (dest=$dest theme=$b_theme domain=$b_site_domain comments_enabled=$COMMENTS_ENABLED) ==="

  # _site/ is NOT cleaned by Eleventy between runs - it only writes/
  # overwrites, so a file this domain's build doesn't happen to produce
  # (e.g. the PREVIOUS domain's CUSTOM_LORE_FILE page, or content excluded
  # only by THIS domain's CHARACTERS/TOPICS filter) would otherwise survive
  # from the prior domain's build in this same checkout and get rsynced
  # into this domain's DEST too. Wiping _site/ before every domain's build
  # is what makes it safe to reuse one clone/checkout across multiple
  # domains at all - without it, deploying domain B after domain A would
  # leak A's build artifacts into B.
  rm -rf "${REPOSITORY_ROOT:?}/_site" \
    || { echo "FAIL [$label]: could not clear _site/ before build" >&2; return 1; }

  local lore_dest=""
  # RETURN (not EXIT) trap: this function is called once per domain and
  # returns once per call, so each call's own CUSTOM_LORE_FILE copy - if
  # any - must be cleaned up at the end of THAT call, not deferred to the
  # whole script's exit (which would leave every earlier domain's custom
  # lore file sitting in src/lore/custom/ during every later domain's
  # build). A trap set inside a function fires on every return path out of
  # it, success or `return 1`, which covers every FAIL branch below.
  #
  # `trap - RETURN` as the trap's OWN last action is deliberate, not
  # redundant: bash's RETURN trap is shell-global, not scoped to this one
  # function call - left armed, it would fire AGAIN when the next function
  # to return does (main()'s own final `return`, once the whole domain
  # loop finishes), referencing this call's already-popped `lore_dest`
  # local under `set -u` ("unbound variable"), aborting the run after
  # every domain had already finished. Disarming it immediately after it
  # fires once confines it to this call; the next build_and_deploy() call
  # re-arms it fresh on its own next line.
  trap '[ -n "$lore_dest" ] && rm -f "$lore_dest"; trap - RETURN' RETURN

  echo "--- [$label 1/6] custom lore injection (CUSTOM_LORE_FILE=${b_custom_lore_file:-none}) ---"
  if [ -n "$b_custom_lore_file" ]; then
    # DEPRECATED 2026-07-30. Still honoured, deliberately: deploy.conf is
    # untracked and lives on this account, so a live domain relying on this
    # key cannot be migrated from the repo, and failing the build here would
    # silently drop that domain's page. It warns instead.
    #
    # Two reasons it is going away, and the second is the binding one:
    #   1. It puts story prose OUTSIDE the repo - unversioned, unreviewable,
    #      invisible to npm test, check-internal-links.js and
    #      check-related-terms.js, outside the CC BY-NC-ND scope
    #      CONTENT-LICENSE.md describes, and gone if this account is lost.
    #   2. It injects into src/lore/, and lore is CANON. Per-domain canon is
    #      exactly what the settled policy forbids: canon is centralised, and
    #      any per-domain variation is non-canonical. This key is the only
    #      mechanism in the whole system that could make two domains disagree
    #      about a fact rather than merely show different subsets of one
    #      record - CHARACTERS/TOPICS/THREADS only ever subtract.
    #
    # Replacement: lib/editions.js for per-domain copy and flourishes (in
    # repo, versioned, non-canonical by construction). CUSTOM_CSS_FILE is
    # unaffected and not deprecated: it cannot change the RECORD, only what a
    # human sees rendered. That is a narrower claim than "it is cosmetic", which
    # is what this comment used to say and is not true - see
    # check_custom_css_powers() above.
    echo "WARN [$label]: CUSTOM_LORE_FILE is DEPRECATED and will be removed." >&2
    echo "WARN [$label]:   It writes into src/lore/, which is canon, and canon is centralised -" >&2
    echo "WARN [$label]:   per-domain variants must be non-canonical. Move this content to" >&2
    echo "WARN [$label]:   lib/editions.js (in-repo, versioned) and unset CUSTOM_LORE_FILE." >&2
    echo "WARN [$label]:   See lib/editions.js and sample-deploy.conf for the migration." >&2
    if [ -f "$b_custom_lore_file" ]; then
      mkdir -p "$REPOSITORY_ROOT/src/lore/custom" \
        || { echo "FAIL [$label]: could not create src/lore/custom/" >&2; return 1; }
      lore_dest="$REPOSITORY_ROOT/src/lore/custom/$(basename "$b_custom_lore_file")"
      cp "$b_custom_lore_file" "$lore_dest" \
        || { echo "FAIL [$label]: could not copy CUSTOM_LORE_FILE ($b_custom_lore_file)" >&2; return 1; }
    else
      echo "FAIL [$label]: CUSTOM_LORE_FILE is set but not found: $b_custom_lore_file" >&2
      return 1
    fi
  fi

  echo "--- [$label 2/6] eleventy build (CHARACTERS=$CHARACTERS TOPICS=$TOPICS THREADS=$THREADS SITE_DOMAIN=$SITE_DOMAIN) ---"
  "$REPOSITORY_ROOT/node_modules/.bin/eleventy" \
    || { echo "FAIL [$label]: eleventy build" >&2; return 1; }

  echo "--- [$label 3/6] verify _site/ exists ---"
  test -d "$REPOSITORY_ROOT/_site" \
    || { echo "FAIL [$label]: _site/ was not produced by eleventy" >&2; return 1; }

  # Only rewrites /star-rangers/ where it is a ROOT-RELATIVE path - that is,
  # where it is preceded by a quote or an opening paren, which is every place a
  # link, src, srcset or CSS url() begins. The pattern used to be an unanchored
  # s#/star-rangers/#/#g, and that was a real bug on the live site: it also
  # rewrote the substring inside ABSOLUTE urls, so the About page's link to
  # https://dermot-r-cochran.github.io/star-rangers/ was served as
  # https://dermot-r-cochran.github.io/ - a broken link to the wrong place,
  # created by the deploy rather than present in the source.
  #
  # Anchoring on the delimiter is what distinguishes the two cases: a
  # root-relative path always begins right after " ' or (, while in an absolute
  # url the character before /star-rangers/ is part of the host. Deliberately
  # does NOT match bare occurrences in prose, which is the safe direction to
  # fail - rewriting a path a reader is meant to see as text would be worse than
  # leaving it.
  echo "--- [$label 4/6] rewrite /star-rangers/ prefix ---"
  find "$REPOSITORY_ROOT/_site" -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) \
    -exec sed -i 's#\(["'"'"'(]\)/star-rangers/#\1/#g' {} + \
    || { echo "FAIL [$label]: prefix rewrite (sed)" >&2; return 1; }
  if [ -n "$SITE_ALIASES" ]; then
    append_alias_redirects "$label" "$b_site_domain" "$SITE_ALIASES" "$REPOSITORY_ROOT/_site/.htaccess" \
      || return 1
  fi

  # Runs the same pagefind indexing step as `npm run build` (package.json's
  # "build" script). Without this, the search box in base.njk renders fine
  # (data-pagefind-bundle + search.js are static) but has no index to query,
  # so it silently returns nothing on every search - a working-looking UI
  # backed by an index that was simply never generated for this domain. Runs
  # after the prefix rewrite (not before) so it indexes the same
  # root-hosted URLs this domain actually serves, rather than baking in
  # /star-rangers/-prefixed paths that only make sense on GitHub Pages.
  echo "--- [$label 5/6] pagefind search index ---"
  "$REPOSITORY_ROOT/node_modules/.bin/pagefind" --site "$REPOSITORY_ROOT/_site" \
    || { echo "FAIL [$label]: pagefind indexing" >&2; return 1; }

  echo "--- [$label 6/6] theme select + custom CSS + rsync deploy + verify ---"
  local src_css="$REPOSITORY_ROOT/src/css/main.css"
  if [ "$b_theme" != "default" ] && [ -f "$REPOSITORY_ROOT/src/css/theme-$b_theme.css" ]; then
    src_css="$REPOSITORY_ROOT/src/css/theme-$b_theme.css"
  fi
  cp "$src_css" "$REPOSITORY_ROOT/_site/css/main.css" \
    || { echo "FAIL [$label]: theme CSS copy ($src_css)" >&2; return 1; }
  # CUSTOM_CSS_FILE is a clone-local, untracked stylesheet appended after
  # the theme's own CSS, so its rules load (and can override) last - lets
  # one domain tweak a handful of things without a whole new
  # theme-<name>.css living in the shared repo.
  if [ -n "$b_custom_css_file" ]; then
    if [ -f "$b_custom_css_file" ]; then
      check_custom_css_powers "$b_custom_css_file" "$label"
      { printf '\n/* --- CUSTOM_CSS_FILE: %s --- */\n' "$b_custom_css_file"; cat "$b_custom_css_file"; } \
        >> "$REPOSITORY_ROOT/_site/css/main.css" \
        || { echo "FAIL [$label]: could not append CUSTOM_CSS_FILE ($b_custom_css_file)" >&2; return 1; }
    else
      echo "FAIL [$label]: CUSTOM_CSS_FILE is set but not found: $b_custom_css_file" >&2
      return 1
    fi
  fi
  # --exclude keeps AutoSSL/Let's Encrypt's domain-validation directory out
  # of rsync's view entirely - it's never part of the Eleventy build, so
  # without this, --delete-delay would remove it (and any in-progress
  # certificate challenge) on every single deploy.
  rsync -av --delete-delay --exclude=.well-known/acme-challenge/ "$REPOSITORY_ROOT/_site/" "$dest" \
    || { echo "FAIL [$label]: rsync to $dest" >&2; return 1; }
  test -f "${dest}index.html" \
    || { echo "FAIL [$label]: post-deploy check - ${dest}index.html missing" >&2; return 1; }
  # cPanel is Apache-hosted, unlike GitHub Pages, so it's the only target
  # that actually reads .htaccess - a missing file here silently deploys
  # with none of its security headers (CSP, X-Frame-Options, etc.) instead
  # of failing loudly, so it gets the same fail-the-deploy treatment as
  # index.html above rather than being left to a manual spot-check.
  test -f "${dest}.htaccess" \
    || { echo "FAIL [$label]: post-deploy check - ${dest}.htaccess missing" >&2; return 1; }
  test -f "${dest}.well-known/security.txt" \
    || { echo "FAIL [$label]: post-deploy check - ${dest}.well-known/security.txt missing" >&2; return 1; }

  echo "=== [$label] build + deploy completed successfully ==="
}

# ---------------------------------------------------------------------------
# main(): shared setup once (Node + npm ci), then one build_and_deploy()
# call for the primary domain and one per ALT_DOMAINS entry, aggregating
# every call's pass/fail into a single overall result instead of stopping
# at the first failure - see build_and_deploy()'s own header comment for
# why. An inline `exit 1` (as opposed to `return 1`) is still used for the
# two shared-setup steps below: those aren't per-domain, so a failure there
# means no domain can build at all, and the whole run should stop rather
# than attempt - and report on - domains that have no chance of succeeding.
# Recall this whole function runs as the left side of a pipe
# (`main | tee ...`), so `exit 1` here only terminates this function's own
# pipeline subshell, letting the rest of the script still run notify() and
# log cleanup below.
# ---------------------------------------------------------------------------
main() {
  if [ -n "$ADMIN_EMAIL_DEFAULTED" ]; then
    echo "--- notifications: ADMIN_EMAIL not set in deploy.conf; defaulted to $ADMIN_EMAIL ---"
    echo "--- WARNING: that address must actually exist on this server (cPanel forwarder or mailbox)."
    echo "---          If it does not, success AND failure emails silently go nowhere - set ADMIN_EMAIL"
    echo "---          explicitly, or create the forwarder. Full logs always persist in deploy-logs/. ---"
  fi
  echo "--- shared setup: ensure-node + npm ci ---"
  # shellcheck disable=SC1091
  . "$REPOSITORY_ROOT/scripts/ensure-node.sh" \
    || { echo "FAIL: scripts/ensure-node.sh (Node.js install/verify)" >&2; exit 1; }
  npm ci --no-audit --no-fund \
    || { echo "FAIL: npm ci" >&2; exit 1; }

  local alt_count=0 id
  for id in $ALT_DOMAINS; do alt_count=$((alt_count + 1)); done

  # DEPLOY_PRIMARY=false with no ALT_DOMAINS configured would deploy
  # nothing at all - almost certainly a deploy.conf mistake (an addon-only
  # account that hasn't listed its addon domains yet, or a stray
  # DEPLOY_PRIMARY=false left over from copying another clone's config)
  # rather than an intentional no-op run. This is a whole-run misconfig,
  # not a single domain's problem, so it uses `exit 1` rather than
  # `return 1` - same reasoning as the shared-setup checks above (no domain
  # here has any chance of succeeding either).
  if [ "$DEPLOY_PRIMARY" != "true" ] && [ "$alt_count" -eq 0 ]; then
    echo "FAIL: DEPLOY_PRIMARY=false and ALT_DOMAINS is empty - this run would deploy nothing" >&2
    exit 1
  fi

  echo "=== Deploying $( [ "$DEPLOY_PRIMARY" = "true" ] && echo "primary + " )${alt_count} alt domain(s): ${ALT_DOMAINS:-none} (deploy_primary=$DEPLOY_PRIMARY) ==="

  local overall_status=0
  local -a result_lines=()

  if [ "$DEPLOY_PRIMARY" = "true" ] && [ -n "$PRIMARY_ALIAS_OF" ]; then
    # A clone whose PRIMARY domain is an alias is an odd configuration and not
    # one to guess about - it gets the same redirect notice as an alt, so the
    # behaviour is the same wherever the alias turns up.
    if deploy_alias_notice "primary" "$DOMAIN" "$PRIMARY_ALIAS_OF" "/home/$CPANEL_USER/public_html/"; then
      result_lines+=("OK   primary -> /home/$CPANEL_USER/public_html/ ($DOMAIN 301 -> $PRIMARY_ALIAS_OF)")
    else
      overall_status=1
      result_lines+=("FAIL primary -> /home/$CPANEL_USER/public_html/ ($DOMAIN redirect notice)")
    fi
  elif [ "$DEPLOY_PRIMARY" = "true" ]; then
    if build_and_deploy "primary" "/home/$CPANEL_USER/public_html/" \
         "$THEME" "$CHARACTERS" "$TOPICS" "$THREADS" "$SITE_NAME" "$SITE_TITLE" "$DOMAIN" \
         "$CUSTOM_LORE_FILE" "$CUSTOM_CSS_FILE" "COMMENTS_ENABLED=$COMMENTS_ENABLED" \
         "SITE_NOINDEX=$SITE_NOINDEX" \
         "SITE_RANKS_AT=$PRIMARY_RANKS_AT" \
         "SITE_ALIASES=$PRIMARY_ALIASES" \
         "EDITION=$EDITION" \
         "GISCUS_PROFILE=$GISCUS_PROFILE" \
         "GISCUS_REPO=$GISCUS_REPO" "GISCUS_REPO_ID=$GISCUS_REPO_ID" \
         "GISCUS_CATEGORY_CHARACTERS_ID=$GISCUS_CATEGORY_CHARACTERS_ID" \
         "GISCUS_CATEGORY_LORE_ID=$GISCUS_CATEGORY_LORE_ID" \
         "GISCUS_CATEGORY_EPISODES_ID=$GISCUS_CATEGORY_EPISODES_ID" \
         "GISCUS_CATEGORY_JOURNAL_ID=$GISCUS_CATEGORY_JOURNAL_ID"; then
      result_lines+=("OK   primary -> /home/$CPANEL_USER/public_html/ ($DOMAIN)")
    else
      overall_status=1
      result_lines+=("FAIL primary -> /home/$CPANEL_USER/public_html/ ($DOMAIN)")
    fi
  else
    echo "=== [primary] skipped (DEPLOY_PRIMARY=false) - public_html left untouched ==="
    result_lines+=("SKIP primary -> /home/$CPANEL_USER/public_html/ (DEPLOY_PRIMARY=false)")
  fi

  for id in $ALT_DOMAINS; do
    if ! alt_id_valid "$id"; then
      echo "FAIL [$id]: not a valid ALT_DOMAINS identifier (letters/digits/underscore, not starting with a digit)" >&2
      overall_status=1
      result_lines+=("FAIL $id (invalid ALT_DOMAINS identifier)")
      continue
    fi

    local alt_dir alt_domain alt_dest
    alt_dir=$(alt_get "$id" DIR)
    alt_domain=$(alt_get "$id" DOMAIN)

    # DIR and DOMAIN are the two fields every alt domain must set
    # explicitly - unlike THEME/CHARACTERS/etc, there's no sensible
    # default sibling-folder name or public domain to fall back to, and
    # guessing either wrong risks silently deploying to (or claiming to
    # be) the wrong place on a live account.
    if [ -z "$alt_dir" ]; then
      echo "FAIL [$id]: ALT_${id}_DIR is not set (required)" >&2
      overall_status=1
      result_lines+=("FAIL $id (ALT_${id}_DIR not set)")
      continue
    fi
    if [ -z "$alt_domain" ]; then
      echo "FAIL [$id]: ALT_${id}_DOMAIN is not set (required)" >&2
      overall_status=1
      result_lines+=("FAIL $id (ALT_${id}_DOMAIN not set)")
      continue
    fi

    alt_dest="/home/$CPANEL_USER/$alt_dir/"
    # Mirrors CUSTOM_LORE_FILE/CUSTOM_CSS_FILE's own philosophy elsewhere
    # in this script: fail loudly on a listed-but-broken alt domain rather
    # than silently skipping it, since a typo'd ALT_<id>_DIR or an addon
    # domain whose document root hasn't been created yet should surface as
    # a clear per-domain FAIL line (and notification), not a deploy that
    # quietly does nothing for that domain.
    if [ ! -d "$alt_dest" ]; then
      echo "FAIL [$id]: ALT_${id}_DIR target does not exist: $alt_dest" >&2
      echo "FAIL [$id]:   Create the domain first (cPanel: Domains -> Create A New Domain," >&2
      echo "FAIL [$id]:   which covers subdomains too - the separate Subdomains and Addon" >&2
      echo "FAIL [$id]:   Domains pages were retired), give it its OWN document root rather" >&2
      echo "FAIL [$id]:   than sharing one, and set ALT_${id}_DIR to the path it created." >&2
      overall_status=1
      result_lines+=("FAIL $id -> $alt_dest (directory missing)")
      continue
    fi

    local alt_edition alt_theme alt_characters alt_topics alt_threads alt_site_name alt_site_title \
          alt_custom_lore alt_custom_css alt_comments_enabled alt_site_noindex \
          alt_giscus_repo alt_giscus_repo_id alt_giscus_cat_characters alt_giscus_cat_lore alt_giscus_cat_episodes \
          alt_giscus_cat_journal
    # Read deploy.conf's ALT_<id>_* values first, WITHOUT defaulting - the
    # ${:-default} that used to be on THEME here would have made every alt
    # domain look like it had set THEME explicitly, and the registry would
    # never have filled anything in. Defaults are applied after resolution.
    alt_edition=$(alt_get "$id" EDITION)
    alt_theme=$(alt_get "$id" THEME)
    alt_characters=$(alt_get "$id" CHARACTERS)
    alt_topics=$(alt_get "$id" TOPICS)
    alt_threads=$(alt_get "$id" THREADS)
    alt_site_name=$(alt_get "$id" SITE_NAME)
    alt_site_title=$(alt_get "$id" SITE_TITLE)
    alt_custom_lore=$(alt_get "$id" CUSTOM_LORE_FILE)
    alt_custom_css=$(alt_get "$id" CUSTOM_CSS_FILE)
    alt_comments_enabled=$(alt_get "$id" COMMENTS_ENABLED)
    alt_site_noindex=$(alt_get "$id" SITE_NOINDEX)
    alt_giscus_profile=$(alt_get "$id" GISCUS_PROFILE)
    alt_giscus_repo=$(alt_get "$id" GISCUS_REPO)
    alt_giscus_repo_id=$(alt_get "$id" GISCUS_REPO_ID)
    alt_giscus_cat_characters=$(alt_get "$id" GISCUS_CATEGORY_CHARACTERS_ID)
    alt_giscus_cat_lore=$(alt_get "$id" GISCUS_CATEGORY_LORE_ID)
    alt_giscus_cat_episodes=$(alt_get "$id" GISCUS_CATEGORY_EPISODES_ID)
    alt_giscus_cat_journal=$(alt_get "$id" GISCUS_CATEGORY_JOURNAL_ID)

    # Fill the gaps from lib/editions.js, keyed by this alt domain's own DOMAIN,
    # then apply the same defaults the pre-registry version applied inline.
    resolve_edition "$alt_domain" "$id"
    fill_from_registry alt_edition "$RESOLVED_EDITION" "$id" EDITION
    fill_from_registry alt_theme "$RESOLVED_THEME" "$id" THEME
    fill_from_registry alt_threads "$RESOLVED_THREADS" "$id" THREADS
    fill_from_registry alt_characters "$RESOLVED_CHARACTERS" "$id" CHARACTERS
    fill_from_registry alt_topics "$RESOLVED_TOPICS" "$id" TOPICS
    fill_from_registry alt_site_name "$RESOLVED_SITE_NAME" "$id" SITE_NAME
    fill_from_registry alt_site_title "$RESOLVED_SITE_TITLE" "$id" SITE_TITLE
    fill_from_registry alt_giscus_profile "$RESOLVED_GISCUS_PROFILE" "$id" GISCUS_PROFILE
    fill_from_registry alt_comments_enabled "$RESOLVED_COMMENTS_ENABLED" "$id" COMMENTS_ENABLED
    if [ -n "$RESOLVED_ALIAS_OF" ]; then
      if deploy_alias_notice "$id" "$alt_domain" "$RESOLVED_ALIAS_OF" "$alt_dest"; then
        result_lines+=("OK   $id -> $alt_dest ($alt_domain 301 -> $RESOLVED_ALIAS_OF)")
      else
        overall_status=1
        result_lines+=("FAIL $id -> $alt_dest ($alt_domain redirect notice)")
      fi
      continue
    fi
    warn_no_identity "$id" "$alt_domain" "$alt_edition" "$alt_theme" "$alt_site_name" \
      "$alt_characters$alt_topics$alt_threads"
    alt_theme="${alt_theme:-default}"
    alt_comments_enabled="${alt_comments_enabled:-true}"

    if build_and_deploy "$id" "$alt_dest" "$alt_theme" "$alt_characters" "$alt_topics" "$alt_threads" \
         "$alt_site_name" "$alt_site_title" "$alt_domain" "$alt_custom_lore" "$alt_custom_css" \
         "COMMENTS_ENABLED=$alt_comments_enabled" \
         "SITE_NOINDEX=$alt_site_noindex" \
         "SITE_RANKS_AT=$RESOLVED_RANKS_AT" \
         "SITE_ALIASES=$RESOLVED_ALIASES" \
         "EDITION=$alt_edition" \
         "GISCUS_PROFILE=$alt_giscus_profile" \
         "GISCUS_REPO=$alt_giscus_repo" "GISCUS_REPO_ID=$alt_giscus_repo_id" \
         "GISCUS_CATEGORY_CHARACTERS_ID=$alt_giscus_cat_characters" \
         "GISCUS_CATEGORY_LORE_ID=$alt_giscus_cat_lore" \
         "GISCUS_CATEGORY_EPISODES_ID=$alt_giscus_cat_episodes" \
         "GISCUS_CATEGORY_JOURNAL_ID=$alt_giscus_cat_journal"; then
      result_lines+=("OK   $id -> $alt_dest ($alt_domain)")
    else
      overall_status=1
      result_lines+=("FAIL $id -> $alt_dest ($alt_domain)")
    fi
  done

  echo "=== Per-domain results ==="
  printf '%s\n' "${result_lines[@]}"

  if [ "$overall_status" -eq 0 ]; then
    echo "=== Build + deploy completed successfully for all domains ==="
  else
    echo "=== One or more domains FAILED - see per-domain results and FAIL lines above ===" >&2
  fi

  return "$overall_status"
}

# Foreground pipe (NOT `exec > >(tee ...)`): the shell blocks until both
# main() and tee have fully finished, so LOG_FILE is guaranteed complete
# and flushed by the time we read it below - no race with the notify step.
main 2>&1 | tee -a "$LOG_FILE"
STATUS=${PIPESTATUS[0]}

# Notify every NOTIFY_EMAILS address (the email body is the same full run
# log for every recipient - there's one run, one log, so there's no
# per-domain log to split out even when a recipient is one alt domain's
# ADMIN_EMAIL rather than the primary's), persist + prune deploy-logs/, and
# exit with main()'s real status - all shared machinery; see deploy-lib.sh.
deploy_lib_finish "$STATUS"
