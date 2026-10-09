// Flattens every chapter's :::pov blocks (grouped into scenes by the
// optional :::::scene wrapper - see lib/markdown-containers.js) into one
// entry per (chapter, scene, character), each becoming its own page via
// src/scene-pov.njk's pagination. Chapters with no :::::scene wrapper are
// treated as a single implicit scene, matching every chapter written so far.
//
// CHARACTERS filtering (see lib/content-filter.js and .cpanel.yml) is
// applied per character here, not per chapter: an excluded character still
// gets a page at their normal URL (so links from other scenes/characters
// never 404), it just renders a placeholder instead of the real POV text.
// Since 2026-09-13 the chapter has to be on the build too (isChapterIncluded
// inside isCharacterPovIncluded): a carried witness's page under an excluded
// chapter is a placeholder, not a leak of that chapter's prose.
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { createMarkdownRenderer, parsePovInfo } = require("../../lib/markdown-containers");
const { getContentFilter, isCharacterPovIncluded } = require("../../lib/content-filter");
const { getEdition } = require("../../lib/editions");

const SEASONS_DIR = path.join(__dirname, "..", "seasons");
const CHARACTERS_DIR = path.join(__dirname, "..", "characters");
const CHAPTER_FILENAME = /^s(\d\d)e(\d\d)c(\d\d)\.md$/;

// Maps character front-matter `id` (the key :::pov blocks use) to that
// character's portrait and page URL. Keyed by `id` rather than filename
// because the two differ (id "tissadelle" lives in tissadelle-shepherd.md),
// and a POV id with no character page - or a page with no portrait - simply
// yields no portrait, which the layout renders as nothing.
function loadCharacterPortraits() {
  const map = new Map();
  for (const entry of fs.readdirSync(CHARACTERS_DIR)) {
    if (!entry.endsWith(".md") || entry === "index.md") continue;
    const { data } = matter(fs.readFileSync(path.join(CHARACTERS_DIR, entry), "utf8"));
    if (!data.id) continue;
    map.set(String(data.id).toLowerCase(), {
      image: data.image || null,
      imageAlt: data.image_alt || null,
      url: `/characters/${entry.replace(/\.md$/, "")}/`
    });
  }
  return map;
}

function findChapterFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findChapterFiles(fullPath));
    } else if (CHAPTER_FILENAME.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// Walks the parsed token stream (not the rendered HTML) so each :::pov
// block's content can be re-rendered on its own via md.renderer.render().
// container_scene/pov tokens come from markdown-it-container - see that
// package's index.mjs for the container_<name>_open/_close token shape.
function extractScenes(md, body) {
  const tokens = md.parse(body, {});
  const scenes = [];
  let currentScene = null;
  let currentPov = null;

  function ensureImplicitScene() {
    if (!scenes.length || scenes[scenes.length - 1].explicit) {
      scenes.push({ number: String(scenes.length + 1), explicit: false, povs: [] });
    }
    return scenes[scenes.length - 1];
  }

  for (const token of tokens) {
    if (token.type === "container_scene_open") {
      const number = token.info.trim().match(/^scene\s+(\S.*)$/);
      currentScene = { number: number ? number[1] : String(scenes.length + 1), explicit: true, povs: [] };
    } else if (token.type === "container_scene_close") {
      if (currentScene) scenes.push(currentScene);
      currentScene = null;
    } else if (token.type === "container_pov_open") {
      // A tier-gated block the build may not show never reaches here: the
      // renderer's tier_gate core rule has already dropped it from the
      // stream md.parse() returns, so the scene simply has fewer POVs on a
      // lower tier - no page, no placeholder, no button.
      const info = parsePovInfo(token.info) || { id: "", tier: null };
      currentPov = { id: info.id, tier: info.tier, tokens: [] };
    } else if (token.type === "container_pov_close") {
      if (currentPov) {
        const html = md.renderer.render(currentPov.tokens, md.options, {});
        const scene = currentScene || ensureImplicitScene();
        scene.povs.push({ id: currentPov.id, tier: currentPov.tier, html });
      }
      currentPov = null;
    } else if (currentPov) {
      currentPov.tokens.push(token);
    }
  }

  return scenes;
}

module.exports = function() {
  // The build's own tier gates which POV blocks exist at all - see
  // lib/markdown-containers.js. Same renderer options as .eleventy.js.
  const md = createMarkdownRenderer({ buildTier: getEdition().tier });
  const filter = getContentFilter();
  const portraits = loadCharacterPortraits();
  const entries = [];

  function characterInfo(id, label) {
    const portrait = portraits.get(id.toLowerCase()) || {};
    return {
      id,
      label,
      image: portrait.image || null,
      imageAlt: portrait.imageAlt || null,
      url: portrait.url || null
    };
  }

  for (const filePath of findChapterFiles(SEASONS_DIR)) {
    const [, season, episode, chapter] = path.basename(filePath).match(CHAPTER_FILENAME);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const povLabels = new Map((data.povs || []).map((p) => [String(p.id).toLowerCase(), p.label]));
    const chapterUrl = `/seasons/s${season}/e${episode}/${data.id}/`;

    const scenes = extractScenes(md, content);
    for (const scene of scenes) {
      const sceneCharacters = scene.povs.map((p) =>
        characterInfo(p.id, povLabels.get(p.id.toLowerCase()) || p.id)
      );

      const sceneImages = data.scene_images || {};
      const sceneImageAlts = data.scene_image_alts || {};

      for (const pov of scene.povs) {
        const included = isCharacterPovIncluded(pov.id, filter, data);
        entries.push({
          chapterId: data.id,
          chapterCommentId: data.comment_id,
          chapterTitle: data.title,
          chapterUrl,
          season,
          episode,
          chapter,
          timestamp: data.timestamp,
          location: data.location,
          sceneNumber: scene.number,
          sceneCharacters,
          image: sceneImages[scene.number] || null,
          imageAlt: sceneImageAlts[scene.number] || `Scene ${scene.number} of "${data.title}"`,
          character: characterInfo(pov.id, povLabels.get(pov.id.toLowerCase()) || pov.id),
          tier: pov.tier || null,
          included,
          html: included ? pov.html : null,
          url: `/seasons/s${season}/e${episode}/${data.id}/scene-${scene.number}/${pov.id}/`
        });
      }
    }
  }

  return entries;
};
