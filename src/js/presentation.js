/**
 * Fian Ilchruinne — reader-side presentation switcher.
 *
 * Lets a reader override this domain's PRESENTATION MODE (lib/editions.js's
 * PRESENTATION_MODES: story / primer / archive / contemplative) for themselves.
 * The mode is a `data-presentation` attribute on <html>; src/css/main.css keys
 * its type, measure and spacing tokens off it. Nothing else changes — the mode
 * is presentation only, so a reader who switches sees the same pages, the same
 * text and the same palette, set differently.
 *
 * WHY THIS IS SAFE ON A SITE WITH NO ACCOUNTS. The site is static and stays
 * that way: this is client-local state and nothing else. localStorage is
 * per-origin, so a preference set on one domain never reaches another, never
 * reaches another device, and never reaches the server. Reading it can throw
 * outright (Safari's private mode, storage blocked, a file:// URL), which is
 * why every access here is wrapped and why a failure is silent: the reader
 * simply gets the edition's own mode, which is a perfectly good page.
 *
 * PROGRESSIVE ENHANCEMENT, and the exact shape of it matters. The control is
 * rendered `hidden` by base.njk and unhidden here. With JS off, no control
 * appears at all — deliberately, rather than showing a dead set of buttons.
 * The page is fully readable either way; what is lost without JS is the
 * *choice*, not the reading.
 *
 * The FIRST-PAINT half lives in an inline <head> script in base.njk, not here.
 * A deferred file cannot prevent the flash: the page would paint in the
 * edition's mode and then jump to the reader's, which is a worse experience
 * than not offering the choice. This file only builds the control and handles
 * clicks; the attribute is already correct before anything below renders.
 */

(function () {
  "use strict";

  // Kept in sync with base.njk's inline head script, which reads the same key
  // before first paint. Changing one means changing both.
  var KEY = "fi:presentation-mode";

  function read() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (err) {
      return null;
    }
  }

  function write(value) {
    try {
      if (value === null) window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, value);
    } catch (err) {
      // Storage unavailable or full. The mode still applies to this page — the
      // reader just gets it for this visit rather than the next one, which is
      // the right way round to fail.
    }
  }

  function init() {
    var control = document.querySelector("[data-presentation-switcher]");
    if (!control) return;

    var root = document.documentElement;
    // The edition's own mode, so "Site default" has something to go back to.
    // Read from the control rather than from <html>, which may already be
    // carrying the reader's override by the time this runs.
    var siteDefault = control.getAttribute("data-site-default") || "story";
    var buttons = Array.prototype.slice.call(
      control.querySelectorAll("[data-presentation-mode]")
    );
    if (!buttons.length) return;

    var valid = buttons.map(function (btn) {
      return btn.getAttribute("data-presentation-mode");
    });
    var details = control.closest ? control.closest("details") : null;

    function apply(mode, persist) {
      var chosen = mode === "" || valid.indexOf(mode) === -1 ? "" : mode;
      root.setAttribute("data-presentation", chosen || siteDefault);
      if (persist) write(chosen || null);
      buttons.forEach(function (btn) {
        var isCurrent = btn.getAttribute("data-presentation-mode") === chosen;
        btn.setAttribute("aria-pressed", isCurrent ? "true" : "false");
      });
    }

    control.addEventListener("click", function (event) {
      var btn = event.target.closest
        ? event.target.closest("[data-presentation-mode]")
        : null;
      if (!btn || !control.contains(btn)) return;
      apply(btn.getAttribute("data-presentation-mode"), true);
      // Close the disclosure so the reader sees the page they just changed,
      // rather than the panel covering it.
      if (details) details.open = false;
    });

    // Dismissal, matching src/js/search.js so the two popovers in this header
    // behave identically: click anywhere else, or press Escape. <details> gives
    // us the open/close toggle and the keyboard semantics for free but neither
    // of these, and a panel that can only be closed by finding the summary
    // again is a papercut on a control most readers will use once.
    if (details) {
      document.addEventListener("click", function (event) {
        if (!details.contains(event.target)) details.open = false;
      });
      document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape" || !details.open) return;
        details.open = false;
        var summary = details.querySelector("summary");
        // Focus would otherwise be left on a button inside a panel that is no
        // longer visible, which strands a keyboard reader.
        if (summary) summary.focus();
      });
    }

    // Another tab on this origin changing the preference. Cheap to honour and
    // odd not to: the two tabs are the same reader.
    window.addEventListener("storage", function (event) {
      if (event.key === KEY) apply(event.newValue || "", false);
    });

    // Reflect whatever the head script already applied, then reveal. Revealing
    // last means a reader never sees the control in an unset state.
    apply(read() || "", false);
    control.hidden = false;
    var wrapper = control.closest ? control.closest("[data-presentation-ui]") : null;
    if (wrapper) wrapper.hidden = false;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
