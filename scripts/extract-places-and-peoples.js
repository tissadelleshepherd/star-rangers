#!/usr/bin/env node
// extract-places-and-peoples.js
//
// Builds places-and-peoples.json for the reference page from the lore pages
// under src/lore/. Run from the repository root:
//
//     node scripts/extract-places-and-peoples.js <outfile>
//
// Uses only Node built-ins plus the repository's own gray-matter. Output is
// deterministic: every list is sorted by slug, and `generatedAt` honours
// SOURCE_DATE_EPOCH when set so a release build can pin it.
//
// Every string in the output is copied from a page's front matter or body.
// The only hand-made part is the rule tables below (POLITY_PAGES, PLACE_RULES,
// PEOPLE_RULES, EXTRA_PEOPLE_PAGES), which record a reading of each page's
// text: which polity it belongs to, which peoples live there, a homeworld, a
// body frame. Each reading carries one or more `evidence` quotes copied from
// the page. At run time the script checks that every quote still appears in
// the page (after stripping Markdown links and emphasis); a missing quote is
// a hard failure, so a page that changes under a rule is caught at the next
// release rather than silently re-described by stale data.
//
// Classification values for `polity` are drawn from this closed list:
//   Solar System Concord / Orbital Habitats Compact, Celtic Union of Planets,
//   Federation of Sentient Beings, Cerebraun Hegemony, Kingdom of the Five
//   Islands, Knarr Line, independent, unknown
// `polity_pages` names the polity page(s) under which a place is listed in
// the "polities" section; it may differ from `polity` where a place is held
// or watched by an institution (the Star Rangers) that is not a polity, or
// chartered by one that no longer exists (the Imperium).

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();
const LORE_ROOT = path.join(REPO_ROOT, 'src', 'lore');
const matter = require(path.join(REPO_ROOT, 'node_modules', 'gray-matter'));

// ---------------------------------------------------------------------------
// Rule tables
// ---------------------------------------------------------------------------

// The polity pages of section 3, keyed by slug (file path under src/lore
// without extension). `name` is the closed-list value the place rules use.
const POLITY_PAGES = [
  { slug: 'solar-system-concord', name: 'Solar System Concord / Orbital Habitats Compact' },
  { slug: 'orbital-habitats-compact', name: 'Solar System Concord / Orbital Habitats Compact' },
  { slug: 'celtic-union-of-planets', name: 'Celtic Union of Planets' },
  { slug: 'federation-of-sentient-beings', name: 'Federation of Sentient Beings' },
  { slug: 'cerebraun-hegemony', name: 'Cerebraun Hegemony' },
  { slug: 'planets/kingdom-of-the-five-islands', name: 'Kingdom of the Five Islands' },
  { slug: 'knarr-line', name: 'Knarr Line' },
  { slug: 'knarrheim', name: 'Knarr Line' },
  { slug: 'the-imperium', name: null },
  { slug: 'military-space-command', name: null },
  { slug: 'formation-of-star-rangers', name: null }
];

// One entry per place page (category "Locations", or a `system:`/`galaxy:`
// field). `evidence` quotes are checked against the page text.
const PLACE_RULES = {
  'eden-space-habitat': {
    polity: 'Solar System Concord / Orbital Habitats Compact',
    polity_pages: ['solar-system-concord', 'orbital-habitats-compact'],
    peoples: [],
    evidence: ["Eden's ordinary civil administration and policing runs on a separate, parallel chain — the Orbital Habitats Compact"]
  },
  'greenward-habitat': {
    polity: 'Federation of Sentient Beings',
    polity_pages: ['federation-of-sentient-beings'],
    peoples: ['Humans'],
    evidence: ['a human ring above Verdance, home world of the Verdani, with the Federation as host']
  },
  'knarrheim': {
    polity: 'Knarr Line',
    polity_pages: ['knarr-line'],
    peoples: [],
    evidence: ["the largest hauler-mothership in the Knarr Line's founding fleet"]
  },
  'new-cotswolds': {
    polity: 'unknown',
    polity_pages: [],
    peoples: ['Humans'],
    evidence: ['The founding party came out of the New London Space Habitat', 'a human settlement exists in another galaxy']
  },
  'new-london-space-habitat': {
    polity: 'independent',
    polity_pages: [],
    peoples: [],
    evidence: ['it puts a sovereign polity outside the Compact in permanent proximity', 'New London is not a member of the Orbital Habitats Compact']
  },
  'planets/aethelrock': {
    polity: 'Celtic Union of Planets',
    polity_pages: ['celtic-union-of-planets'],
    peoples: [],
    evidence: ['the third documented charter world of the Celtic Union of Planets']
  },
  'planets/aspenar': {
    polity: 'Federation of Sentient Beings',
    polity_pages: ['federation-of-sentient-beings'],
    peoples: ['Humans', 'Doreth'],
    evidence: ['a charter member world of the Federation of Sentient Beings', 'Human domes run filtered, dimmed daylight', 'most numerously the Doreth, a heavy-built, radiation-tolerant people']
  },
  'planets/cirrane': {
    polity: 'Federation of Sentient Beings',
    polity_pages: ['federation-of-sentient-beings'],
    peoples: ['Ollune'],
    evidence: ['It is a member world of the Federation of Sentient Beings', 'the whole of the Ollune civilisation is inside it']
  },
  'planets/corryn': {
    polity: 'independent',
    polity_pages: ['the-imperium'],
    peoples: ['Spiralites', 'Humans'],
    evidence: ['it holds a valid charter from a government that no longer exists', 'The settlement is a remnant of the Old Imperium', 'The indigenous people are the Spiralites', 'interfere with human equipment']
  },
  'planets/drithane': {
    polity: 'Celtic Union of Planets',
    polity_pages: ['celtic-union-of-planets'],
    peoples: [],
    evidence: ['Drithane holds full Union charter membership']
  },
  'planets/fliade': {
    polity: 'independent',
    polity_pages: [],
    peoples: ['Pandoids'],
    evidence: ['There is no settlement authorisation and none has been sought.', 'The deep networks belong to the Pandoids, and they are a people.']
  },
  'planets/kernowek-reach': {
    polity: 'Celtic Union of Planets',
    polity_pages: ['celtic-union-of-planets'],
    peoples: ['Humans'],
    evidence: ["Kernowek Reach's charter membership was never in question", 'the visible edge of the world humans can stand on without support']
  },
  'planets/kingdom-of-the-five-islands': {
    polity: 'Kingdom of the Five Islands',
    polity_pages: ['planets/kingdom-of-the-five-islands'],
    peoples: ['Humans'],
    evidence: ['The world itself has no charter, no Union membership, and no Solar System designation', 'a hereditary monarchy holding the single temperate archipelago']
  },
  'planets/mars': {
    polity: 'Solar System Concord / Orbital Habitats Compact',
    polity_pages: ['solar-system-concord'],
    peoples: [],
    evidence: ["the only one that has been the seat of interplanetary authority under all four of the Solar System's successive governments"]
  },
  'planets/meridian': {
    polity: 'Cerebraun Hegemony',
    polity_pages: ['cerebraun-hegemony'],
    peoples: ['Meridian sapients', 'Cerebraun'],
    evidence: ['a subject world of the Cerebraun Hegemony', 'Meridian sapients communicate primarily through', 'a resident Administrator-Voice holds final authority']
  },
  'planets/prismere': {
    polity: 'Federation of Sentient Beings',
    polity_pages: ['federation-of-sentient-beings'],
    peoples: ['Prismeri'],
    evidence: ['a charter member world of the Federation of Sentient Beings', 'Prismere is the homeworld of the Prismeri']
  },
  'planets/quern': {
    polity: 'independent',
    polity_pages: [],
    peoples: [],
    evidence: ['Quern holds no charter and belongs to no polity.']
  },
  'planets/saltmere': {
    polity: 'independent',
    polity_pages: [],
    peoples: [],
    evidence: ['Saltmere holds no Solar System charter, no membership in the Celtic Union of Planets or the Federation of Sentient Beings']
  },
  'planets/sentinel': {
    polity: 'Cerebraun Hegemony',
    polity_pages: ['cerebraun-hegemony'],
    peoples: [],
    evidence: ['By every metric the Cerebraun Hegemony uses to prioritise a world, the Sentinel does not matter.', 'No atmosphere, no native life']
  },
  'planets/thalassa': {
    polity: 'Solar System Concord / Orbital Habitats Compact',
    polity_pages: ['solar-system-concord'],
    peoples: [],
    evidence: ['Thalassa remains a Solar System Defence Command charter world']
  },
  'planets/tir-na-nog': {
    polity: 'Celtic Union of Planets',
    polity_pages: ['celtic-union-of-planets'],
    peoples: ['Humans'],
    evidence: ['the flagship and most populous world of the Celtic Union of Planets', 'naturally human-compatible']
  },
  'planets/trigrian': {
    polity: 'unknown',
    polity_pages: ['formation-of-star-rangers'],
    peoples: [],
    evidence: ['No settlement authorisation exists, and none has been requested', 'The only human presence is a rotating station on the northern plateau']
  },
  'planets/verdance': {
    polity: 'Federation of Sentient Beings',
    polity_pages: ['federation-of-sentient-beings'],
    peoples: ['Verdani'],
    evidence: ['Verdance holds full membership in the Federation of Sentient Beings', 'the home world of the Verdani']
  },
  'planets/winterbourne': {
    polity: 'independent',
    polity_pages: [],
    peoples: [],
    evidence: ['Winterbourne is not a member of the Celtic Union of Planets', 'It holds no Solar System charter either']
  },
  'planets/ynys-wydrin': {
    polity: 'Celtic Union of Planets',
    polity_pages: ['celtic-union-of-planets'],
    peoples: ['Humans'],
    evidence: ['the second-settled charter world of the Celtic Union of Planets', 'Earth-descended humans']
  },
  'saltvik': {
    polity: 'Knarr Line',
    polity_pages: ['knarr-line'],
    peoples: [],
    evidence: ["it is the Line's largest single source of refined ore"]
  },
  'the-guest-ring': {
    polity: 'Federation of Sentient Beings',
    polity_pages: ['federation-of-sentient-beings'],
    peoples: [],
    evidence: ['A Federation of Sentient Beings habitat in a high orbit above Drithane']
  },
  'threshold-station': {
    polity: 'unknown',
    polity_pages: ['formation-of-star-rangers'],
    peoples: ['Krenyi'],
    evidence: ['a Survey Corps post with a Starwarden answering for it and a crew drawn from several peoples', 'the second Krenyi in the record to serve at Threshold']
  },
  'umbral-moon': {
    polity: 'unknown',
    polity_pages: [],
    peoples: [],
    evidence: ['It occupies the Earth–Moon L5 point']
  },
  'undersong-belt': {
    polity: 'Federation of Sentient Beings',
    polity_pages: ['federation-of-sentient-beings'],
    peoples: ['Chthonari'],
    evidence: ['a documented Federation of Sentient Beings member territory for generations', 'The reason is the Chthonari']
  },
  'venice': {
    polity: 'Solar System Concord / Orbital Habitats Compact',
    polity_pages: ['solar-system-concord'],
    peoples: [],
    evidence: ['its day-to-day governance is a civic matter rather than a Concord one', 'maintains Earth\'s wildlife preserves under Solar System Defence Command']
  }
};

// Pages outside category "Species" whose title names a people.
const EXTRA_PEOPLE_PAGES = ['the-tally', 'levrils'];

// One entry per people page. `homeworld_slug` names the place page when one
// exists. `frame` is given only where the page states it (a tag counts as the
// page stating it, and is cited as "tag: ...").
const PEOPLE_RULES = {
  'cerebraun': {
    homeworld: null, homeworld_slug: null,
    polity: 'Cerebraun Hegemony', frame: 'cephalopod-descended',
    evidence: ['cephalopod-descended, sapient people', 'the founding people of the Cerebraun Hegemony']
  },
  'chthonari': {
    homeworld: 'Undersong Belt', homeworld_slug: 'undersong-belt',
    polity: 'Federation of Sentient Beings', frame: 'six-limbed, exoskeletal',
    evidence: ['a sapient, insectoid people native to the Undersong Belt', 'six-limbed, exoskeletal', 'interact easily with other Federation species in shared facilities', 'tag: federation-of-sentient-beings']
  },
  'ilveth': {
    homeworld: 'Sardain', homeworld_slug: null,
    polity: null, frame: 'not humanoid',
    evidence: ['The Ilveth come from Sardain', 'They are not humanoid']
  },
  'krenyi': {
    homeworld: null, homeworld_slug: null,
    polity: null, frame: 'humanoid',
    evidence: ['a long-lived humanoid people', 'The cross-species record carries no Krenyi homeworld.']
  },
  'levrils': {
    homeworld: null, homeworld_slug: null,
    polity: null, frame: null,
    evidence: ['Levrils are sapient meta-dimensional beings', 'A Levril has no form a time-bound observer could receive directly']
  },
  'mnemari': {
    homeworld: 'Ilenne', homeworld_slug: null,
    polity: 'Federation of Sentient Beings', frame: 'humanoid',
    evidence: ['a sapient, humanoid people native to Ilenne', 'every other catalogued Federation species', 'tag: federation-of-sentient-beings']
  },
  'ollune': {
    homeworld: 'Cirrane', homeworld_slug: 'planets/cirrane',
    polity: 'Federation of Sentient Beings', frame: null,
    evidence: ['a sapient people native to the upper atmosphere of Cirrane', "Cirrane's membership is the Federation's founding sentence tested at full strength."]
  },
  'ovruhn': {
    homeworld: 'Thavren', homeworld_slug: null,
    polity: 'Federation of Sentient Beings', frame: 'not humanoid',
    evidence: ['The Ovruhn come from Thavren', 'They are not humanoid', 'Thavren is a Federation member world.']
  },
  'pelagene-littoral': {
    homeworld: 'Nerath', homeworld_slug: null,
    polity: null, frame: 'non-humanoid',
    evidence: ['The Pelagene Littoral come from Nerath', 'tag: non-humanoid']
  },
  'prismeri': {
    homeworld: 'Prismere', homeworld_slug: 'planets/prismere',
    polity: 'Federation of Sentient Beings', frame: "a flier's",
    evidence: ['a sapient people native to Prismere', "The frame is a flier's", 'every other catalogued Federation species', 'tag: federation-of-sentient-beings']
  },
  'serephine-dunekin': {
    homeworld: 'Kharis Belt IV', homeworld_slug: null,
    polity: null, frame: 'non-humanoid',
    evidence: ['The Serephine Dunekin come from Kharis Belt IV', 'tag: non-humanoid']
  },
  'the-tally': {
    homeworld: null, homeworld_slug: null,
    polity: 'independent', frame: 'human',
    evidence: ['They are chartered to nobody.', 'a dark icy object of the scattered disc, and moored', 'Every human people on the record can point at an older one behind it.']
  },
  'verdani': {
    homeworld: 'Verdance', homeworld_slug: 'planets/verdance',
    polity: 'Federation of Sentient Beings', frame: 'not humanoid',
    evidence: ['a sapient people native to Verdance', 'A Verdani is not humanoid', 'a Federation seat']
  },
  'veyr-basaltborn': {
    homeworld: 'Veyr-3', homeworld_slug: null,
    polity: null, frame: 'lattice',
    evidence: ['The Veyr Basaltborn come from Veyr-3', 'A Veyr is built as a truss, not a frame.', 'lattice-framed people']
  }
};

// ---------------------------------------------------------------------------
// Reading the pages
// ---------------------------------------------------------------------------

function walk(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function readPage(file) {
  let raw = fs.readFileSync(file, 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const parsed = matter(raw);
  const rel = path.relative(LORE_ROOT, file).split(path.sep).join('/');
  const slug = rel.replace(/\.md$/, '');
  return { slug, file: 'src/lore/' + rel, data: parsed.data, body: parsed.content };
}

function urlFor(page) {
  if (typeof page.data.permalink === 'string') return page.data.permalink;
  if (page.slug === 'index') return '/lore/';
  return '/lore/' + page.slug + '/';
}

// Text used for evidence checks: body, description, and tags, with Markdown
// links reduced to their text and emphasis markers removed, whitespace folded.
function checkText(page) {
  const parts = [page.body, page.data.description || '', page.data.plain || ''];
  const tags = Array.isArray(page.data.tags) ? page.data.tags : [];
  let text = parts.join('\n')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ');
  text += ' ' + tags.map(t => 'tag: ' + t).join(' ');
  return text;
}

function verifyEvidence(page, quotes, failures) {
  const text = checkText(page);
  for (const q of quotes) {
    const needle = q.replace(/\s+/g, ' ');
    if (!text.includes(needle)) failures.push(`${page.file}: evidence not found: "${q}"`);
  }
}

function str(v) { return typeof v === 'string' ? v : null; }
function list(v) { return Array.isArray(v) ? v.map(String) : []; }

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

function build() {
  const pages = walk(LORE_ROOT).map(readPage)
    .filter(p => p.slug !== 'README' && !p.data.eleventyExcludeFromCollections)
    .sort((a, b) => a.slug.localeCompare(b.slug, 'en'));
  const bySlug = new Map(pages.map(p => [p.slug, p]));
  const failures = [];
  const warnings = [];

  const categories = Array.from(new Set(pages.map(p => str(p.data.category)).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, 'en'));
  const byCategory = {};
  for (const c of categories) byCategory[c] = pages.filter(p => p.data.category === c).length;

  // 1. places
  const placePages = pages.filter(p => p.data.category === 'Locations' || p.data.system != null || p.data.galaxy != null);
  const places = placePages.map(p => {
    const rule = PLACE_RULES[p.slug];
    if (!rule) warnings.push(`${p.file}: place has no rule; polity set to "unknown"`);
    else verifyEvidence(p, rule.evidence, failures);
    return {
      slug: urlFor(p),
      file: p.file,
      title: str(p.data.title),
      locationType: str(p.data.locationType),
      galaxy: str(p.data.galaxy),
      system: str(p.data.system),
      description: str(p.data.description),
      image: str(p.data.image),
      tags: list(p.data.tags),
      revealed_by: str(p.data.revealed_by),
      polity: rule ? rule.polity : 'unknown',
      polity_pages: rule ? rule.polity_pages.map(s => '/lore/' + s + '/') : [],
      peoples: rule ? rule.peoples.slice() : [],
      evidence: rule ? rule.evidence.slice() : []
    };
  });
  for (const slug of Object.keys(PLACE_RULES)) {
    if (!placePages.some(p => p.slug === slug)) failures.push(`PLACE_RULES names ${slug}, which is not a place page`);
  }

  // 2. peoples
  const peoplePages = pages.filter(p => p.data.category === 'Species' || EXTRA_PEOPLE_PAGES.includes(p.slug));
  const peoples = peoplePages.map(p => {
    const rule = PEOPLE_RULES[p.slug];
    if (!rule) warnings.push(`${p.file}: people page has no rule`);
    else verifyEvidence(p, rule.evidence, failures);
    const home = rule && rule.homeworld_slug ? bySlug.get(rule.homeworld_slug) : null;
    if (rule && rule.homeworld_slug && !home) failures.push(`${p.file}: homeworld_slug ${rule.homeworld_slug} has no page`);
    return {
      slug: urlFor(p),
      file: p.file,
      title: str(p.data.title),
      category: str(p.data.category),
      description: str(p.data.description),
      tags: list(p.data.tags),
      image: str(p.data.image),
      revealed_by: str(p.data.revealed_by),
      homeworld: rule ? rule.homeworld : null,
      homeworld_slug: home ? urlFor(home) : null,
      polity: rule ? rule.polity : null,
      frame: rule ? rule.frame : null,
      evidence: rule ? rule.evidence.slice() : []
    };
  });
  for (const slug of Object.keys(PEOPLE_RULES)) {
    if (!peoplePages.some(p => p.slug === slug)) failures.push(`PEOPLE_RULES names ${slug}, which is not a people page`);
  }

  // Peoples named on place pages that have no page of their own.
  const peopleTitles = new Set(peoples.flatMap(pp => [pp.title, ...pp.tags]));
  const peoplesWithoutPages = Array.from(new Set(places.flatMap(pl => pl.peoples)))
    .filter(name => !peoples.some(pp => pp.title === name || pp.title.includes(name) || peopleTitles.has(name.toLowerCase())))
    .sort((a, b) => a.localeCompare(b, 'en'));

  // 3. polities
  const polities = POLITY_PAGES.map(({ slug, name }) => {
    const p = bySlug.get(slug);
    if (!p) { failures.push(`POLITY_PAGES names ${slug}, which has no page`); return null; }
    const url = '/lore/' + slug + '/';
    const worlds = places.filter(pl => pl.polity_pages.includes(url)).map(pl => pl.slug);
    return {
      slug: url,
      file: p.file,
      title: str(p.data.title),
      category: str(p.data.category),
      polity_name: name,
      description: str(p.data.description),
      image: str(p.data.image),
      tags: list(p.data.tags),
      worlds
    };
  }).filter(Boolean).sort((a, b) => a.slug.localeCompare(b.slug, 'en'));

  if (failures.length) {
    console.error('Extraction failed; the rule tables no longer match the record:');
    for (const f of failures) console.error('  ' + f);
    process.exit(1);
  }
  for (const w of warnings) console.error('warning: ' + w);

  const epoch = process.env.SOURCE_DATE_EPOCH ? Number(process.env.SOURCE_DATE_EPOCH) * 1000 : Date.now();
  const out = {
    version: JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8")).version,
    generatedAt: new Date(epoch).toISOString().slice(0, 10),
    source: 'src/lore',
    categories,
    counts: {
      lorePages: pages.length,
      places: places.length,
      peoples: peoples.length,
      polities: polities.length,
      peoplesWithoutPages: peoplesWithoutPages.length,
      byCategory
    },
    polityValues: ['Solar System Concord / Orbital Habitats Compact', 'Celtic Union of Planets', 'Federation of Sentient Beings', 'Cerebraun Hegemony', 'Kingdom of the Five Islands', 'Knarr Line', 'independent', 'unknown'],
    places: places.sort((a, b) => a.slug.localeCompare(b.slug, 'en')),
    peoples: peoples.sort((a, b) => a.slug.localeCompare(b.slug, 'en')),
    peoplesWithoutPages,
    polities
  };
  return out;
}

const outfile = process.argv[2];
if (!outfile) {
  console.error('usage: node extract-places-and-peoples.js <outfile>');
  process.exit(2);
}
const result = build();
fs.writeFileSync(outfile, JSON.stringify(result, null, 2) + '\n');
console.log(`wrote ${outfile}`);
console.log('counts: ' + JSON.stringify(result.counts));
console.log('categories: ' + result.categories.join(', '));
