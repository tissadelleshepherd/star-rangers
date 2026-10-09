module.exports = function () {
  // SITE_DOMAIN is exported by scripts/cpanel-deploy.sh from deploy.conf's
  // DOMAIN key (see that script) so robots.txt and sitemap.xml carry the
  // right absolute host per cPanel clone. Left unset for local dev and the
  // GitHub Pages workflow, which both want the GH Pages URL itself.
  const domain = String(process.env.SITE_DOMAIN || "dermot-r-cochran.github.io/star-rangers").replace(/\/+$/, "");

  // SITE_NAME and SITE_TITLE are likewise exported by scripts/cpanel-deploy.sh
  // from deploy.conf's own SITE_NAME/SITE_TITLE keys, letting a clone brand
  // itself independently of the shared repo default. SITE_NAME is the short
  // brand shown in the header logo and footer; SITE_TITLE is the browser
  // <title> tag's own suffix (see src/_includes/base.njk) - kept separate so
  // a clone can put a longer/different string in the tab title than in its
  // on-page branding without needing two unrelated overrides.
  // The WORK is titled "Fian Ilchruinne"; the Star Rangers are an
  // organisation INSIDE it. Title history, in brief: "Star Rangers" was
  // retitled to "Drithane" 2026-08-01 to clear Andre Norton's 1953 novel
  // "Star Rangers" (and a 1987 comic of the same name); "Fian-ilchruinne"
  // was adopted 2026-08-03 as the setting umbrella; and on 2026-08-04
  // Dermot retired "Drithane" entirely (Google silently corrects it to
  // "Dithane", a fungicide - not unique enough), leaving Fian Ilchruinne
  // as both umbrella and work title. The corps keeps its name in the
  // fiction, and the /star-rangers/ URL paths and alias domains are
  // deliberately unchanged - only front-of-house branding has ever moved.
  // The tab, header, footer and homepage heading all carry "Fian Ilchruinne".
  // Until 2026-10-09 the tab alone kept the hyphenated umbrella spelling
  // "Fian-ilchruinne" from 2026-08-03; a site review that day found a
  // reader meeting two spellings and Dermot ruled the tab should match the
  // headings (story-bible/intake-2026-10-09.md). The hyphenated form
  // survives only in the alias domain names, which are spelling insurance
  // (lib/editions.js). Old
  // Irish fian (the warrior-band) + ilchruinne (Irish for multiverse) -
  // "the multiverse Fianna"; the fused, single-n and fiann- variants are
  // all superseded (story-bible/the-title-and-its-risk.md has the full
  // path, including Drithane's retirement and its possible in-universe
  // reuse). Front of house only: "Grand Ensemble Multiverse" remains the
  // canon in-universe name of the multiverse
  // (src/lore/ensemble-multiverse.md), which is why the description still
  // says it.
  const name = process.env.SITE_NAME || "Fian Ilchruinne";
  const title = process.env.SITE_TITLE || "Fian Ilchruinne";

  // SITE_NOINDEX=true (deploy.conf, threaded per-domain by
  // scripts/cpanel-deploy.sh) marks this build as a testing/staging domain
  // that must not be indexed: robots.txt flips to Disallow: /, every page
  // carries a noindex,nofollow meta, and canonicals are suppressed
  // (see src/robots.njk and src/_includes/base.njk).
  const noindex = String(process.env.SITE_NOINDEX || "").toLowerCase() === "true";

  // SITE_RANKS_AT names the domain in this build's tier family that carries
  // the ranking signal (lib/editions.js's `ranksAt`, threaded through by
  // scripts/cpanel-deploy.sh). Compared against this build's own domain: equal
  // or empty means self-canonical, different means every page canonicals to
  // the same path on that host. Normalised the same way `domain` is so a
  // trailing slash or a stray scheme can't make a host compare unequal to
  // itself and silently canonicalise a family's ranking domain away from
  // itself - the one failure mode here that would be invisible and total.
  const ranksAtRaw = String(process.env.SITE_RANKS_AT || "")
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
  const ranksAt = ranksAtRaw && ranksAtRaw !== domain ? ranksAtRaw : "";

  return {
    name,
    title,
    noindex,
    // Empty unless this build is a NON-ranking member of its family; the
    // ranking domain and any family of one both see "".
    ranksAt,
    canonicalBase: ranksAt ? `https://${ranksAt}/` : `https://${domain}/`,
    description: "Fian Ilchruinne is a multi-viewpoint hard-science-fiction novel of the Grand Ensemble Multiverse, with one licensed deviation: a station clock forty seconds wrong, and the Star Rangers ordered to measure the drift and guard the public record. The stars call us forward with hope; to protect what is good and to see what is true. One canonical history across the Five Layers and multiple Concordants.",
    url: `https://${domain}/`,
    author: "Fian Ilchruinne",
    language: "en",
    // Open Graph wants a full locale rather than the bare language code above.
    // en_GB rather than en_US because the prose is consistently British/Irish
    // spelling ("licence", "unauthorised", "colour"), and rather than en_IE
    // because the major scrapers' supported-locale lists reliably include
    // en_GB and do not reliably include en_IE - a locale a platform doesn't
    // recognise is worse than the nearest one it does.
    ogLocale: "en_GB"
  };
};
