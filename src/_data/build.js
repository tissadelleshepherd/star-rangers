// Computed once per build (module load), so every page in a single build
// shares the same value.
const BUILD_TIME = Date.now();

module.exports = function () {
  const startYear = 2026;
  const currentYear = new Date().getFullYear();
  return {
    year: currentYear,
    copyrightYears: currentYear > startYear ? `${startYear}\u2013${currentYear}` : `${startYear}`,
    // Cache-busting token appended to same-origin CSS/JS URLs (see base.njk).
    // Changes on every build, so a rebuilt/redeployed site never serves a
    // stale main.css or JS from a browser/CDN cache - which matters here
    // because scripts/cpanel-deploy.sh rewrites _site/css/main.css (theme
    // swap + optional CUSTOM_CSS_FILE) AFTER Eleventy runs, so a build-time
    // content hash of the source file wouldn't reflect what's actually
    // served. A per-build token busts cache uniformly regardless of theme.
    assetVersion: BUILD_TIME.toString(36),
    // What this build is shipping, stamped into <meta name="site-version">
    // and /version.txt so a live domain can be checked from outside with one
    // request - the only test that covers the whole chain (merge, cron pull,
    // build, rsync) rather than trusting that a green deploy meant the files
    // actually landed. Set from `git describe` by scripts/deploy-lib.sh for
    // the cPanel clones and by .github/workflows/deploy.yml for the Pages
    // build of fianilchruinne.com. "dev" means this build did not come
    // through either deploy path - a local build - which is worth being
    // able to tell.
    version: process.env.DEPLOY_VERSION || "dev",
    builtAt: new Date(BUILD_TIME).toISOString().replace(/\.\d{3}Z$/, "Z"),
  };
};
