#!/usr/bin/env node
//
// scripts/image-prompts.js
//
// Works through the image prompts already written in story-bible/images.md,
// either by generating them (Gemini API) or by serving them one at a time to
// the clipboard for pasting into an image app by hand.
//
// LOCAL AUTHORING TOOL - not part of the build, not run by `npm test`, not
// touched by CI. Same standing as scripts/make-lore-cards.ps1.
//
// images.md STAYS THE SOURCE OF TRUTH. This script parses it and never writes
// to it. There is deliberately no separate queue file to drift out of sync -
// edit a prompt there and re-run.
//
// TWO BACKENDS, ONE PARSER
//
//   --generate   Calls the Gemini API and writes the images. Unattended: all
//                twenty-three in one command. Needs GEMINI_API_KEY.
//   --next       Puts the next pending prompt on the clipboard for pasting
//                into an image app by hand, and records what it served.
//
// WHY BOTH. The first version of this script called Adobe's Firefly Services
// API. That path is closed: Firefly Services is an enterprise contract, and
// the Developer Console disables the API outright without the entitlement
// ("Your organization does not have a license to access this API"). The
// Firefly app bundled with Creative Cloud is a different product with no
// multi-prompt batch mode, so the clipboard loop was the fallback. Gemini
// sells the same class of model self-serve - and Nano Banana is one of the
// models the Firefly app itself offers - so --generate restores the
// unattended path the entitlement wall took away. The clipboard loop stays,
// because an app in a browser will always beat an API for the one image you
// want to nudge by hand.
//
// THE GENERATE LOOP
//   export GEMINI_API_KEY=...          (or scripts/gemini.local.json)
//   node scripts/image-prompts.js --generate --only arilon    # try one first
//   node scripts/image-prompts.js --generate                  # the rest
//   .\scripts\image-file.ps1 -WhatIf                          # then file them
//
// THE CLIPBOARD LOOP
//   node scripts/image-prompts.js --next
//   <paste, generate, download>  … repeat
//   .\scripts\image-file.ps1 -From "$env:USERPROFILE\Downloads" -WhatIf
//
// BEFORE GENERATING, CHECK WHAT HE ALREADY HAS
//   node scripts/build-photo-catalogue.js         # once, and after a shoot
//   node scripts/image-prompts.js --catalogue     # own photos matching pending
//
// USAGE
//   node scripts/image-prompts.js [--list]        # status of every entry
//   node scripts/image-prompts.js --catalogue     # own-photography candidates
//   node scripts/image-prompts.js --generate      # generate all pending
//   node scripts/image-prompts.js --next          # serve one to the clipboard
//   node scripts/image-prompts.js --only arilon   # restrict either mode to one
//   node scripts/image-prompts.js --all           # print every prompt, change nothing
//   node scripts/image-prompts.js --reset [name]  # un-serve one, or all
//
//   REFERENCE IMAGES. An entry may carry a `References:` line among its prose,
//   before the blockquote, naming image files in backticks:
//
//     References: `story-bible/reference-art/tissadelle-headmate-2026-08-24.jpg`
//
//   Paths are repo-relative or absolute (Dermot's own frames on F:\ qualify -
//   standing permission of 11 August 2026, recorded in images.md). --generate
//   sends them as image parts after the prompt; --next and --only print them
//   so the clipboard loop can attach them by hand. A named file that does not
//   exist fails that entry loudly rather than generating without it, because a
//   reference silently dropped changes the picture. The manifest records which
//   files were sent, and images.md's provenance rule still applies: say which
//   plates were used.
//
//   --variations N   images per prompt when generating (default 2, max 4)
//   --model ID       default gemini-3.1-flash-image (Nano Banana 2)
//   --size 1K|2K|4K  default 2K - import-image.ps1 resizes to 1200/1600 on the
//                    way in, so 2K is already generous and 4K only costs more
//   --no-clipboard   print instead of copying
//
// An entry counts as DONE when its target file exists under src/images/, so
// the queue empties itself as work lands and needs no marking.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const IMAGES_MD = path.join(REPO_ROOT, 'story-bible', 'images.md');
const IMAGES_DIR = path.join(REPO_ROOT, 'src', 'images');
const OUT_DIR = path.join(REPO_ROOT, 'image-out');
const PROGRESS = path.join(OUT_DIR, 'progress.json');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const DEFAULT_MODEL = 'gemini-3.1-flash-image';

// Aspect ratio is a request field, not something prompt text controls - the
// same trap as the Firefly app's dropdown, where "Portrait orientation." at
// the end of a prompt does nothing and Auto quietly returns landscape.
//
// BOTH ARE 16:9, AND THE CHARACTER ONE IS NOT A TYPO. The rendered slot
// decides this, not the word at the end of the prompt:
//
//   .character-portrait  aspect-ratio: 16 / 9; object-fit: cover;
//                        object-position: center 30%; max-width: 420px
//   .page-hero-image     height: 320px; object-fit: cover (wide)
//
// So a 3:4 portrait delivered into a 16:9 slot is cropped to a horizontal
// band through the upper third and most of the frame is thrown away. That is
// a defect the corpus already carries - the surviving 512x1024 and 768x1022
// files are being sliced exactly that way, which is part of why they read
// badly - and it was recorded on 28 July 2026 after someone checked the CSS
// (originally in story-bible/firefly-prompts.md, since retired - the rule now
// lives in images.md). Generating at 3:4 would have reproduced
// it twelve more times.
//
// Character portraits therefore deliver 1200x675, which is what
// import-image.ps1 -MaxEdge 1200 produces from a 16:9 source.
const ASPECT = { Portrait: '16:9', Landscape: '16:9' };

const SECTION_TARGETS = [
  { match: /^###\s*\d+\.\s*Missing portraits/i, dir: 'characters' },
  // `\d+[a-z]?` because images.md numbers sub-sections 5a/5b, and the twelve
  // Prismere prompts under 5a were invisible to a bare-number match (found
  // 3 September 2026 when the set was finally regenerated).
  // `(?:Missing|Outstanding)` because 5b is headed "Outstanding lore
  // illustrations" and its 52 prompts of 19 August were invisible to every
  // mode until 5 October 2026, when the two added that day did not show up
  // either - which is how it was found. --list reported 0 pending for seven
  // weeks while 5b said "none generated; all proposals".
  { match: /^###\s*\d+[a-z]?\.\s*(?:Missing|Outstanding) lore illustrations/i, dir: 'lore' },
  // Codex art (Dermot's rulings of 18 August and 3 September 2026): an
  // in-world artist's impression that lives in a codex entry's body, the
  // entry's own header staying a designed card. Filed under src/images/codex/
  // beside the cards; landscape like every other body image.
  { match: /^###\s*\d+\.\s*Codex art/i, dir: 'codex' },
];

function parseArgs(argv) {
  const o = {
    mode: 'list', only: null, reset: undefined, clipboard: true,
    variations: 2, model: DEFAULT_MODEL, size: '2K',
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--list') o.mode = 'list';
    else if (a === '--catalogue' || a === '--catalog') o.mode = 'catalogue';
    else if (a === '--next') o.mode = 'next';
    else if (a === '--generate') o.mode = 'generate';
    else if (a === '--all') o.mode = 'all';
    else if (a === '--only') o.only = String(argv[++i] || '').split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--reset') { o.mode = 'reset'; o.reset = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : null; }
    else if (a === '--reject') { o.mode = 'reject'; o.reject = String(argv[++i] || '').split(',').map((s) => s.trim()).filter(Boolean); }
    else if (a === '--variations') o.variations = parseInt(argv[++i], 10);
    else if (a === '--model') o.model = String(argv[++i] || '').trim();
    else if (a === '--size') o.size = String(argv[++i] || '').trim();
    else if (a === '--no-clipboard') o.clipboard = false;
    else if (a === '--help' || a === '-h') { printUsage(); process.exit(0); }
    else { console.error(`unknown option: ${a}\n`); printUsage(); process.exit(1); }
  }
  if (o.only && o.only.length && o.mode === 'list') o.mode = 'only';
  if (!Number.isInteger(o.variations) || o.variations < 1 || o.variations > 4) {
    console.error('--variations must be an integer 1-4'); process.exit(1);
  }
  if (!['512px', '1K', '2K', '4K'].includes(o.size)) {
    console.error('--size must be one of 512px, 1K, 2K, 4K'); process.exit(1);
  }
  return o;
}

function printUsage() {
  const src = fs.readFileSync(__filename, 'utf8');
  console.log(src.slice(src.indexOf('// USAGE'), src.indexOf('// An entry counts as DONE')).replace(/^\/\/ ?/gm, ''));
}

// ---------------------------------------------------------------------------
// Parsing images.md. The shape every entry already uses, and the only shape
// recognised:
//
//   - **`naomi-kestrel.jpg`** - prose description, possibly several lines
//     > The prompt, one blockquote, ending with an orientation sentence.
//
// A bullet with no blockquote is not image-model work - that is how the nine
// generator title cards exclude themselves without being listed anywhere,
// since make-lore-cards.ps1 letters those with a font engine and an image
// model cannot spell.
// ---------------------------------------------------------------------------
function parseEntries(markdown) {
  const lines = markdown.split(/\r?\n/);
  const entries = [];
  let currentDir = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^###\s/.test(line)) {
      const hit = SECTION_TARGETS.find((s) => s.match.test(line));
      currentDir = hit ? hit.dir : null;
      continue;
    }
    if (/^##\s/.test(line)) { currentDir = null; continue; }
    if (!currentDir) continue;

    const m = line.match(/^\s*[-*]\s+\*\*`([^`]+\.jpg)`\*\*/);
    if (!m) continue;
    const file = m[1];

    let prompt = null;
    const references = [];
    for (let j = i + 1; j < lines.length; j++) {
      const l = lines[j];
      if (/^\s*[-*]\s+\*\*`/.test(l)) break;
      if (/^#{2,}\s/.test(l)) break;
      const refLine = l.match(/^\s*(?:\*\*)?References?(?:\*\*)?:\s*(.+)$/i);
      if (refLine) { references.push(...parseReferenceList(refLine[1])); continue; }
      const q = l.match(/^\s*>\s?(.+)$/);
      if (q) {
        const parts = [q[1].trim()];
        for (let k = j + 1; k < lines.length; k++) {
          const cont = lines[k].match(/^\s*>\s?(.*)$/);
          if (!cont) break;
          if (cont[1].trim()) parts.push(cont[1].trim());
        }
        prompt = parts.join(' ');
        break;
      }
    }
    if (!prompt) continue;

    const orientation = /portrait orientation/i.test(prompt) ? 'Portrait'
      : /landscape orientation/i.test(prompt) ? 'Landscape'
      : currentDir === 'characters' ? 'Portrait' : 'Landscape';

    // `file` may carry a subdirectory - three lore entries are filed under
    // universes/ and planets/. `rel` keeps that; `key` flattens it into one
    // collision-free identifier used by the manifest and image-file.ps1.
    const rel = file.replace(/\.jpg$/i, '');
    entries.push({
      file, rel,
      base: path.posix.basename(rel),
      key: `${currentDir}-${rel}`.replace(/[/\\]/g, '-'),
      dir: currentDir, prompt, orientation, references,
      target: path.join(IMAGES_DIR, currentDir, file),
      targetRel: `src/images/${currentDir}/${file}`.replace(/\\/g, '/'),
      maxEdge: currentDir === 'characters' ? 1200 : 1600,
    });
  }
  return entries;
}

// A `References:` line names files in backticks, or as a bare comma-separated
// list when there are no backticks. Repo-relative paths resolve against the
// repo root; absolute paths (a JPEG in one of the F:\ camera folders, say)
// are kept as written. Nothing is checked for existence here - that happens at
// the moment of sending, where a missing file is an error worth stopping for.
function parseReferenceList(text) {
  const ticked = [...String(text).matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
  const raw = ticked.length ? ticked : String(text).split(',').map((t) => t.trim());
  return raw.filter(Boolean).map((r) => (path.isAbsolute(r) ? r : path.resolve(REPO_ROOT, r)));
}

const REFERENCE_MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

// Gemini 3.1 Flash Image accepts up to 14 reference images in one request
// (checked against ai.google.dev/gemini-api/docs/image-generation, 2 Sept
// 2026); other models take fewer. The API enforces its own cap, so this only
// turns a cryptic 400 into a sentence.
const MAX_REFERENCES = 14;

function loadReferences(entry) {
  const refs = entry.references || [];
  if (!refs.length) return [];
  if (refs.length > MAX_REFERENCES) {
    throw new Error(`${refs.length} reference images; the model accepts at most ${MAX_REFERENCES}`);
  }
  return refs.map((file) => {
    const mime = REFERENCE_MIME[path.extname(file).toLowerCase()];
    if (!mime) throw new Error(`reference ${file}: not a JPEG, PNG or WebP`);
    if (!fs.existsSync(file)) throw new Error(`reference ${file}: file not found`);
    return { type: 'image', mime_type: mime, data: fs.readFileSync(file).toString('base64') };
  });
}

// ---------------------------------------------------------------------------
// --catalogue: offer Dermot's own photographs before anything is generated
//
// images.md (Open work 6 tier 3) argues his own photography should carry far
// more of this site than it does - an Irish upland standing in for an alien
// world is his own work and claims nothing false. But `pending` had exactly one
// route out of it, generate, so the recommendation had no way to act on itself.
// This adds the missing step: for each pending prompt, what does he already
// have?
//
// It suggests and never decides. Matching a photograph to "a dome world with
// thin air and permafrost" is a judgement; scoring words is only a way of
// putting the plausible candidates in front of the person making it.
// ---------------------------------------------------------------------------

const CATALOGUE = path.join(REPO_ROOT, 'story-bible', 'own-photography.json');

// Words that appear in nearly every prompt in images.md, or carry no subject
// meaning. Left in, they make every photograph match every prompt equally.
const PROMPT_NOISE = new Set(`a an and the of in on at to for with without any anywhere
cinematic portrait landscape orientation upper body expression lighting lit palette muted
desaturated professional science fiction sciencefiction science-fiction setting scene shot
image photo photograph no not readable text signage insignia lettering written characters
frame anywhere glamour styling styled realistic detailed high quality resolution
foreground background midground composition wide close soft warm cool tone toned`
  .split(/\s+/).filter(Boolean));

// Subject words worth treating as equivalent. Deliberately short: this is here
// to bridge in-world vocabulary to plain English, not to be a thesaurus.
const SYNONYMS = [
  ['upland', 'highland', 'mountain', 'mountains', 'hill', 'hills', 'moor', 'moorland', 'fell'],
  ['coast', 'coastal', 'shore', 'shoreline', 'sea', 'ocean', 'maritime', 'tide', 'estuary'],
  ['forest', 'woodland', 'wood', 'woods', 'trees', 'tree', 'canopy', 'grove'],
  ['wetland', 'marsh', 'bog', 'fen', 'pond', 'lake', 'lough', 'water'],
  ['desert', 'arid', 'dust', 'dune', 'savanna', 'savannah', 'plain', 'plains', 'grassland'],
  ['volcanic', 'lava', 'basalt', 'strata', 'rock', 'stone', 'geology', 'cliff'],
  ['bird', 'birds', 'gull', 'gulls', 'heron', 'raptor', 'eagle', 'vulture', 'stork', 'crane'],
  ['ice', 'snow', 'frost', 'permafrost', 'glacier', 'frozen'],
  ['cloud', 'clouds', 'mist', 'fog', 'haze', 'overcast'],
  ['city', 'urban', 'architecture', 'building', 'buildings', 'skyline'],
  ['flower', 'flowers', 'bloom', 'blossom', 'petal', 'botanical', 'plant'],
  ['dusk', 'dawn', 'sunset', 'sunrise', 'twilight', 'goldenhour'],
];

function expand(token) {
  const group = SYNONYMS.find((g) => g.includes(token));
  return group ? group : [token];
}

function tokenise(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((w) => w.length > 3 && !PROMPT_NOISE.has(w));
}

function loadCatalogue() {
  if (!fs.existsSync(CATALOGUE)) return null;
  try { return JSON.parse(fs.readFileSync(CATALOGUE, 'utf8')); }
  catch (err) { console.error(`catalogue unreadable: ${err.message}`); return null; }
}

function scoreCandidates(prompt, catalogue) {
  const wanted = new Set();
  for (const t of tokenise(prompt)) for (const s of expand(t)) wanted.add(s);
  if (!wanted.size) return { photos: [], folders: [] };

  const rank = (haystack) => {
    const have = new Set();
    for (const t of tokenise(haystack)) for (const s of expand(t)) have.add(s);
    let hits = 0;
    const matched = [];
    for (const w of wanted) if (have.has(w)) { hits++; matched.push(w); }
    return { hits, matched };
  };

  // Three overlapping subject words, not two. Two is met by coincidence often
  // enough that the output stops being worth reading.
  const photos = (catalogue.publishedPhotos || [])
    .map((p) => ({ p, ...rank(`${p.title} ${p.category} ${p.location} ${p.album} ${p.alt}`) }))
    .filter((r) => r.hits >= 3)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 3);

  const folders = (catalogue.rawFolders || [])
    .map((f) => ({ f, ...rank(f.description) }))
    .filter((r) => r.hits >= 3)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 2);

  return { photos, folders };
}

function runCatalogue(todo) {
  const catalogue = loadCatalogue();
  if (!catalogue) {
    console.log('No catalogue yet. Build one first:\n  node scripts/build-photo-catalogue.js');
    return;
  }

  // Character portraits are excluded, and not as a threshold problem. Dermot
  // photographs places and wildlife, and the one category of photograph he will
  // not publish is a recognisable person - so there is no frame in this
  // catalogue that could stand in for a face. Offering "Zebra in the Morning
  // Dust" against a portrait prompt because both mention dust is noise, and
  // noise is how a suggestion tool gets ignored.
  const skipped = todo.filter((e) => e.dir === 'characters').length;
  todo = todo.filter((e) => e.dir !== 'characters');

  if (!todo.length) {
    console.log(`Nothing to match.${skipped ? ` (${skipped} character portrait(s) skipped — see the note in this script.)` : ''}`);
    return;
  }
  if (skipped) console.log(`Skipping ${skipped} character portrait(s): no photograph here can stand in for a face.\n`);

  console.log(`Matching ${todo.length} pending prompt(s) against ${catalogue.publishedPhotos.length} published photographs and ${catalogue.rawFolders.length} raw folders.`);
  console.log('Suggestions only. The catalogue is a snapshot — rebuild it with scripts/build-photo-catalogue.js.\n');

  let withIdeas = 0;
  for (const e of todo) {
    const { photos, folders } = scoreCandidates(e.prompt, catalogue);
    if (!photos.length && !folders.length) continue;
    withIdeas++;
    console.log(`### ${e.targetRel}`);
    for (const r of photos) {
      const where = [r.p.location, r.p.year].filter(Boolean).join(', ');
      console.log(`   photo   ${r.p.title}${where ? ` — ${where}` : ''}  [${r.matched.slice(0, 4).join(' ')}]`);
    }
    for (const r of folders) {
      console.log(`   raws    ${r.f.folder} — ${r.f.description.slice(0, 90)}  [${r.matched.slice(0, 4).join(' ')}]`);
    }
    console.log('');
  }

  console.log(`${withIdeas} of ${todo.length} pending prompt(s) have a plausible candidate in your own work.`);
  if (withIdeas) console.log('Look at the actual frames before deciding — a title is not a photograph.');
}

// A placeholder card counts as work still to do, not as a finished image.
// Without this, filling twenty-eight gaps with PORTRAIT PENDING cards on
// 12 August 2026 emptied the queue while creating twenty-eight new jobs -
// status() decides `done` from the file existing, and a placeholder is a file.
// The marker is written into the JPEG itself by scripts/mark-placeholder.js,
// so replacing a card with a real image clears it with no list to maintain.
const PLACEHOLDER_MARKER = 'STAR-RANGERS-PLACEHOLDER';

function isPlaceholder(file) {
  try {
    const fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(4096);
    const read = fs.readSync(fd, buf, 0, 4096, 0);
    fs.closeSync(fd);
    return buf.slice(0, read).includes(PLACEHOLDER_MARKER);
  } catch { return false; }
}

// A manifest row records its target but not its orientation label, so recover
// which ASPECT entry governs it from the directory it is bound for - the same
// rule parseEntries applies.
function entryOrientation(g) {
  return String(g.target || '').includes('/characters/') ? 'Portrait' : 'Landscape';
}

function readJson(p, fallback) {
  if (!fs.existsSync(p)) return fallback;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (err) { console.error(`could not parse ${p}: ${err.message}`); process.exit(1); }
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

// Best-effort: no clipboard tool is not a failure, since the prompt is printed
// either way and pasting from the terminal still works.
function toClipboard(text) {
  const candidates = process.platform === 'win32'
    ? [['clip.exe', []], ['clip', []]]
    : process.platform === 'darwin' ? [['pbcopy', []]]
      : [['xclip', ['-selection', 'clipboard']], ['xsel', ['--clipboard', '--input']]];
  for (const [cmd, args] of candidates) {
    const r = spawnSync(cmd, args, { input: text });
    if (!r.error && r.status === 0) return cmd;
  }
  return null;
}

function loadApiKey() {
  let key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  if (!key) {
    const local = path.join(__dirname, 'gemini.local.json');
    if (fs.existsSync(local)) key = (readJson(local, {}).apiKey || '').trim();
  }
  if (!key) {
    throw new Error(
      'no Gemini API key.\n' +
      '  Either export GEMINI_API_KEY, or copy scripts/gemini.local.json.sample\n' +
      '  to scripts/gemini.local.json and put it there. That file is gitignored -\n' +
      '  this repository is public and must never contain a key.\n' +
      '  Get one, self-serve, at https://aistudio.google.com/apikey'
    );
  }
  return key;
}

async function generateOne(key, opts, entry, referenceParts) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      model: opts.model,
      // Text first, then the reference images - the order the documented
      // image-editing examples use.
      input: [{ type: 'text', text: entry.prompt }, ...(referenceParts || [])],
      response_format: {
        type: 'image',
        mime_type: 'image/jpeg',
        aspect_ratio: ASPECT[entry.orientation],
        image_size: opts.size,
      },
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    // Printed whole rather than summarised: Google's 4xx bodies name the
    // offending field - a bad model id, an unsupported aspect ratio, a prompt
    // tripping a safety filter - and that detail is the value of the failure.
    throw new Error(`Gemini returned ${res.status}:\n${text}`);
  }
  let json;
  try { json = JSON.parse(text); } catch { throw new Error(`Gemini returned non-JSON:\n${text}`); }

  const images = extractImages(json);
  if (!images.length) throw new Error(`response carried no image (raw response written beside the output)`);
  return { images, raw: json };
}

// Documented Interactions shape is
//   { steps: [ { content: [ { type: 'image', data: <base64>, mime_type } ] } ] }
// The generateContent fallback covers the older
//   { candidates: [ { content: { parts: [ { inlineData: { data, mimeType } } ] } } ] }
// so a shape change degrades to "still found the bytes" rather than crashing.
// The raw response is written next to the images either way.
function extractImages(json) {
  const out = [];
  for (const step of (json && json.steps) || []) {
    for (const c of (step && step.content) || []) {
      if (c && c.data && (c.type === 'image' || /^image\//.test(c.mime_type || ''))) {
        out.push({ b64: c.data, mime: c.mime_type || 'image/jpeg' });
      }
    }
  }
  if (out.length) return out;
  for (const cand of (json && json.candidates) || []) {
    for (const part of ((cand.content && cand.content.parts) || [])) {
      const d = part && (part.inlineData || part.inline_data);
      if (d && d.data) out.push({ b64: d.data, mime: d.mimeType || d.mime_type || 'image/jpeg' });
    }
  }
  return out;
}

async function runGenerate(entries, opts) {
  const key = loadApiKey();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Model ${opts.model}, ${opts.size}, ${opts.variations} variation(s) each.`);
  console.log(`Output: ${OUT_DIR}\n`);

  const manifest = readJson(MANIFEST, { generated: [] });
  const byKey = new Map(manifest.generated.map((g) => [g.key, g]));
  let failures = 0;

  for (const entry of entries) {
    const dir = path.join(OUT_DIR, entry.key);
    fs.mkdirSync(dir, { recursive: true });
    const refNote = entry.references.length ? ` +${entry.references.length} ref` : '';
    process.stdout.write(`${entry.targetRel}  [${ASPECT[entry.orientation]}${refNote}] … `);

    const saved = [];
    let lastRaw = null;
    try {
      // Read once per entry, not once per variation - a 4K reference is a
      // few megabytes of base64 and the variations share it.
      const referenceParts = loadReferences(entry);
      for (let v = 0; v < opts.variations; v++) {
        const { images, raw } = await generateOne(key, opts, entry, referenceParts);
        lastRaw = raw;
        images.forEach((img, idx) => {
          const n = saved.length + 1;
          const dest = path.join(dir, `${entry.base}-${n}.jpg`);
          fs.writeFileSync(dest, Buffer.from(img.b64, 'base64'));
          saved.push({ file: path.relative(OUT_DIR, dest).replace(/\\/g, '/'), bytes: fs.statSync(dest).size });
          void idx;
        });
      }
      console.log(`${saved.length} image(s)`);
      byKey.set(entry.key, {
        key: entry.key, file: entry.file, target: entry.targetRel,
        maxEdge: entry.maxEdge, aspect: ASPECT[entry.orientation],
        model: opts.model, size: opts.size, prompt: entry.prompt,
        references: entry.references.map((r) => path.relative(REPO_ROOT, r).replace(/\\/g, '/')),
        outputs: saved,
      });
    } catch (err) {
      failures++;
      console.log('FAILED');
      console.error(`  ${err.message}\n`);
      if (lastRaw) fs.writeFileSync(path.join(dir, 'response.json'), JSON.stringify(lastRaw, null, 2));
      byKey.set(entry.key, { key: entry.key, file: entry.file, error: String(err.message) });
    }
  }

  writeJson(MANIFEST, { generated: [...byKey.values()] });
  console.log(`\nManifest: ${MANIFEST}`);
  console.log('Next:  .\\scripts\\image-file.ps1 -WhatIf');
  if (failures) { console.error(`\n${failures} of ${entries.length} failed.`); process.exitCode = 1; }
}

function serve(entry, opts, progress) {
  console.log(`\n${entry.targetRel}`);
  console.log(`  Aspect ratio: set it to ${ASPECT[entry.orientation]} — the prompt alone will not`);
  if (entry.dir === 'characters') {
    console.log('                (16:9 even though the prompt says "Portrait orientation" —');
    console.log('                 .character-portrait crops to 16:9, so a tall frame loses its edges)');
  }
  console.log(`  Filed at:     ${entry.maxEdge}px long edge — generate large, this resizes on the way in`);
  if (entry.references.length) {
    console.log(`  References:   attach these in the app before generating (${entry.references.length}):`);
    for (const r of entry.references) console.log(`                ${r}${fs.existsSync(r) ? '' : '   <-- NOT FOUND'}`);
  }
  console.log('');
  console.log(entry.prompt);
  console.log('');

  if (opts.clipboard) {
    const via = toClipboard(entry.prompt);
    console.log(via ? `Copied to clipboard (${via}). Paste, generate, download.`
      : 'No clipboard tool found — copy the prompt above by hand.');
  }
  if (!progress.served.includes(entry.key)) {
    progress.served.push(entry.key);
    writeJson(PROGRESS, progress);
  }
  const n = progress.served.indexOf(entry.key) + 1;
  const ord = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
  console.log(`Served #${n}. image-file.ps1 pairs your ${n}${ord}-oldest download with this.`);
}

function findOne(entries, name) {
  const want = String(name).replace(/\.jpg$/i, '');
  const hit = entries.find((e) => [e.rel, e.base, e.key].includes(want));
  if (!hit) { console.error(`no prompt matching '${name}'. Try --list.`); process.exit(1); }
  return hit;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(IMAGES_MD)) { console.error(`missing ${IMAGES_MD}`); process.exit(1); }

  const entries = parseEntries(fs.readFileSync(IMAGES_MD, 'utf8'));
  if (!entries.length) {
    console.error('parsed no prompts from story-bible/images.md — the format may have changed.');
    process.exit(1);
  }

  const progress = readJson(PROGRESS, { served: [] });
  if (!Array.isArray(progress.served)) progress.served = [];
  const manifest = readJson(MANIFEST, { generated: [] });

  // An entry counts as generated only if it was generated at the aspect ratio
  // currently in force. Anything produced under a different one is stale by
  // definition - it will be cropped to fit the slot it is destined for - so it
  // drops back to pending and the next --generate picks it up without anyone
  // having to work out which files to delete.
  //
  // This is not hypothetical: the first full run put all twelve character
  // portraits out at 3:4 before the CSS was checked and ASPECT corrected to
  // 16:9. Rather than hunt them down by hand, the run simply became partly
  // stale and re-ran itself.
  const generatedKeys = new Set(
    manifest.generated
      .filter((g) => !g.error && g.aspect && g.aspect === ASPECT[entryOrientation(g)])
      .map((g) => g.key)
  );

  const status = (e) => fs.existsSync(e.target) ? (isPlaceholder(e.target) ? 'placeholder' : 'done')
    : generatedKeys.has(e.key) ? 'generated'
    : progress.served.includes(e.key) ? 'served'
    : 'pending';

  // --reject: the affordance the first real run turned out to need. An image
  // that came back unusable sits in the manifest as "generated", which is a
  // record that it exists - not a claim that it is any good - and that status
  // makes --generate skip it forever. Rejecting drops its manifest row and any
  // files under it, so the entry returns to pending and the next run redoes it.
  // Use it after editing the prompt, which is usually why an image was
  // rejected in the first place.
  if (opts.mode === 'reject') {
    const hits = opts.reject.map((n) => findOne(entries, n));
    const keys = new Set(hits.map((e) => e.key));
    const before = manifest.generated.length;
    manifest.generated = manifest.generated.filter((g) => !keys.has(g.key));
    writeJson(MANIFEST, manifest);
    for (const e of hits) {
      const dir = path.join(OUT_DIR, e.key);
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
      progress.served = progress.served.filter((k) => k !== e.key);
      console.log(`rejected ${e.key}${fs.existsSync(e.target) ? '  (note: its target file still exists, so it reads as done — delete it too if you mean to replace it)' : ''}`);
    }
    writeJson(PROGRESS, progress);
    console.log(`\n${before - manifest.generated.length} manifest row(s) dropped. Re-run --generate to redo them.`);
    return;
  }

  if (opts.mode === 'reset') {
    if (opts.reset === null) {
      progress.served = [];
      writeJson(PROGRESS, progress);
      console.log('Cleared the whole served list.');
    } else {
      const hit = findOne(entries, opts.reset);
      const before = progress.served.length;
      progress.served = progress.served.filter((k) => k !== hit.key);
      writeJson(PROGRESS, progress);
      console.log(progress.served.length < before ? `Un-served ${hit.key}.` : `${hit.key} was not served.`);
      console.log('Note: this shifts the pairing order for everything after it — re-check with image-file.ps1 -WhatIf.');
    }
    return;
  }

  if (opts.mode === 'all') {
    for (const e of entries) {
      const refs = e.references.length ? `\nReferences: ${e.references.join(', ')}\n` : '';
      console.log(`\n### ${e.targetRel}  [${e.maxEdge}px]\n${refs}\n${e.prompt}`);
    }
    console.log(`\n${entries.length} prompt(s). Nothing changed.`);
    return;
  }

  if (opts.mode === 'catalogue') {
    // Anything without a filed image, not just `pending`. An entry sitting at
    // `generated` has candidate output in image-out/ but nothing chosen yet, so
    // it is exactly the moment to ask whether a real photograph would do
    // better - after that decision it is too late to be worth asking.
    const todo = opts.only ? opts.only.map((n) => findOne(entries, n)) : entries.filter((e) => status(e) !== 'done');
    runCatalogue(todo);
    return;
  }

  if (opts.mode === 'generate') {
    let todo = opts.only ? opts.only.map((n) => findOne(entries, n)) : entries.filter((e) => ['pending', 'served', 'placeholder'].includes(status(e)));
    if (!todo.length) { console.log('Nothing pending. Everything is generated or already filed.'); return; }
    await runGenerate(todo, opts);
    return;
  }

  if (opts.mode === 'only') { for (const n of opts.only) serve(findOne(entries, n), opts, progress); return; }

  if (opts.mode === 'next') {
    const next = entries.find((e) => status(e) === 'pending');
    if (!next) {
      const waiting = entries.filter((e) => ['served', 'generated'].includes(status(e))).length;
      console.log('Nothing pending.');
      if (waiting) console.log(`${waiting} waiting to be filed — run .\\scripts\\image-file.ps1 -WhatIf`);
      return;
    }
    serve(next, opts, progress);
    return;
  }

  const counts = { done: 0, generated: 0, served: 0, pending: 0, placeholder: 0 };
  console.log(`${entries.length} prompt(s) in story-bible/images.md\n`);
  for (const e of entries) {
    const s = status(e);
    counts[s]++;
    const mark = { done: '[done]     ', generated: '[generated]', served: '[served]   ', pending: '[pending]  ', placeholder: '[placeholder]' }[s];
    console.log(`  ${mark} ${e.targetRel}`);
  }
  console.log(`\n${counts.done} done, ${counts.generated} generated, ${counts.served} served, ${counts.pending} pending, ${counts.placeholder} placeholder.`);
  if (counts.placeholder) console.log('A placeholder is a standing card, not a finished image — those entries still need work.');
  if (counts.pending) console.log('Next: node scripts/image-prompts.js --generate   (or --next for the clipboard loop)');
  else if (counts.generated || counts.served) console.log('Next: .\\scripts\\image-file.ps1 -WhatIf');
}

module.exports = { parseEntries, parseReferenceList, loadReferences, MAX_REFERENCES };

if (require.main === module) {
  main().catch((err) => {
    console.error(`\nimage-prompts: ${err.message}`);
    process.exit(1);
  });
}
