const { STORYLINE_THREADS } = require("../../lib/storyline-threads");
const { getContentFilter, isThreadIncluded } = require("../../lib/content-filter");

// A thread gated to a reading tier (`tier` in lib/storyline-threads.js) must
// not appear in the /threads/ index listing (src/threads/index.md, which
// reads this data file directly) on a build below that tier - the same gate
// lib/content-filter.js's isThreadIncluded already applies to that thread's
// own chapters/characters/lore/etc, just at the listing level too, so a
// contemplative thread's name and description don't leak onto a general-tier
// domain even though nothing links to it.
module.exports = function () {
  const filter = getContentFilter();
  return STORYLINE_THREADS.filter((thread) => isThreadIncluded(thread.id, filter));
};
