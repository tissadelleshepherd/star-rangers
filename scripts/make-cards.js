// Cross-platform port of make-emblem-card.ps1 and make-codex-cover.ps1's
// designed-card mode (no -Underlay support), for sessions without Windows.
//
// LOCAL AUTHORING TOOL — not part of the build, not run by `npm test`, not
// touched by CI, and not in package.json: it needs sharp, installed locally
// with `npm install --no-save sharp`. Text is set by the font engine, so
// titles are typed rather than drawn and correct by construction — the same
// reason the .ps1 tools exist.
//
// Fidelity notes, stated so nobody hunts a nonexistent bug:
//   - Fonts: Georgia and Consolas are not installed on Linux runners, so
//     this port substitutes Liberation Serif and Liberation Mono. The cards
//     it draws match the .ps1 layouts, not their exact letterforms.
//   - Star fields and particle scatters are seeded and deterministic, but
//     the seed algorithm is a plain LCG, not System.Random, so the dots sit
//     in different (fixed) places than a .ps1-drawn card's.
//   A card that must match the GDI+ output byte-for-byte still comes from
//   the .ps1 on Dermot's machine; this port exists so a card can be made at
//   all from anywhere else.
//
// Usage: node scripts/make-cards.js            # draws every card in CARDS
//        node scripts/make-cards.js ovruhn     # just the named card(s)
//
// Card parameters live in the CARDS table below — the prompt-of-record for
// each card is story-bible/image-prompts.md, per the standing convention.

'use strict';
const path = require('path');
const sharp = require('sharp');

const SERIF = 'Liberation Serif';
const MONO = 'Liberation Mono';
const PT = 96 / 72; // GDI+ point -> pixel at 96dpi

// Deterministic LCG so a regeneration is not a diff (same intent as the
// .ps1's fixed System.Random seed, different algorithm).
function lcg(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff);
}

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function text(t, x, y, family, px, fill, opacity = 1, tracking = 0, anchor = 'middle') {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${px}" fill="${fill}" fill-opacity="${opacity}" letter-spacing="${tracking}" text-anchor="${anchor}">${esc(t)}</text>`;
}

// ---------------------------------------------------------------- emblem ---
// 1600x900, mirrors make-emblem-card.ps1: gradient at 60deg, seeded stars,
// glow, line device at (800,250) R=82, tracked eyebrow, rule at y=578,
// title/epithet/qualifier block.
function emblemDevice(kind, cx, cy, R, stroke) {
  const s = `stroke="${stroke}" stroke-opacity="0.82" stroke-width="2.2" fill="none"`;
  switch (kind) {
    case 'rings':
      return [1.0, 0.66, 0.34].map((f) => `<circle cx="${cx}" cy="${cy}" r="${R * f}" ${s}/>`).join('');
    case 'fold':
      return `<circle cx="${cx - R}" cy="${cy}" r="6" ${s}/><circle cx="${cx + R}" cy="${cy}" r="6" ${s}/>` +
        `<path d="M ${cx - R} ${cy} C ${cx - R * 0.3} ${cy - R * 1.1}, ${cx + R * 0.3} ${cy + R * 1.1}, ${cx + R} ${cy}" ${s}/>`;
    case 'triad':
      // three nested arcs, 200deg to 340deg, as GDI+ DrawArc draws them
      return [1.0, 0.72, 0.44].map((f) => {
        const r = R * f;
        const a0 = (200 * Math.PI) / 180, a1 = (340 * Math.PI) / 180;
        const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        return `<path d="M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}" ${s}/>`;
      }).join('');
    default:
      throw new Error(`device not ported: ${kind}`);
  }
}

function emblemSvg({ title, category, epithet, qualifier, device, tint, accent }) {
  const W = 1600, H = 900, cx = W / 2;
  const rand = lcg(20260812);
  let stars = '';
  for (let i = 0; i < 90; i++) {
    const sx = Math.floor(rand() * W), sy = Math.floor(rand() * H * 0.75);
    const sz = 1 + Math.floor(rand() * 2);
    stars += `<circle cx="${sx}" cy="${sy}" r="${sz / 2}" fill="#FFFFFF" fill-opacity="0.235"/>`;
  }
  const t = title.toUpperCase();
  const titlePt = t.length > 26 ? 30 : t.length > 18 ? 38 : 46;
  const titlePx = titlePt * PT;
  const parts = [
    `<defs>
       <linearGradient id="bg" x1="0" y1="0" x2="${Math.cos(Math.PI / 3)}" y2="${Math.sin(Math.PI / 3)}">
         <stop offset="0" stop-color="${tint}"/><stop offset="1" stop-color="#05070B"/>
       </linearGradient>
       <radialGradient id="glow"><stop offset="0" stop-color="${accent}" stop-opacity="0.27"/>
         <stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
     </defs>`,
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>`,
    stars,
    `<circle cx="${cx}" cy="250" r="230" fill="url(#glow)"/>`,
    emblemDevice(device, cx, 250, 82, accent),
    text(category.toUpperCase(), cx, 52 + 13.5 * PT * 0.82, SERIF, 13.5 * PT, accent, 0.78, 8),
    `<line x1="${cx - 100}" y1="578" x2="${cx + 100}" y2="578" stroke="${accent}" stroke-opacity="0.47" stroke-width="1.6"/>`,
    text(t, cx, 610 + titlePx * 0.82, SERIF, titlePx, '#EEF3F8', 1, 2),
  ];
  if (epithet) parts.push(text(epithet, cx, 718 + 21 * PT * 0.82, SERIF, 21 * PT, accent, 0.92));
  if (qualifier) parts.push(text(qualifier, cx, 768 + 15 * PT * 0.82, SERIF, 15 * PT, accent, 0.67));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${parts.join('\n')}</svg>`;
}

// ----------------------------------------------------------------- codex ---
// 1600x1600, mirrors make-codex-cover.ps1's designed mode: fixed navy
// palette, top bar, tracked category, dissolution or rules motif, optional
// stamp, divider at y=1042, auto-fit title block, subtitle/institution/author.
function codexMotif(kind) {
  const cx = 800;
  if (kind === 'rules') {
    let out = '', y = 300;
    const widths = [1355, 1355, 1355, 1035];
    for (let i = 0; i < 4; i++) {
      out += `<line x1="122" y1="${y}" x2="${122 + widths[i]}" y2="${y}" stroke="rgb(150,175,225)" stroke-opacity="${(46 - i * 6) / 255}" stroke-width="1.5"/>`;
      y += 52;
    }
    return out;
  }
  // dissolution: two rings fading round their circumference, plus a seeded
  // particle drift in the lower-right sector.
  let out = '';
  const my = 500;
  for (const [r, peak, pow, from, wid] of [[178, 160, 1.7, 140, 2.2], [118, 80, 2.4, 150, 1.6]]) {
    for (let i = 0; i < 240; i++) {
      const a0 = i * 1.5;
      const f = (1 + Math.cos(((a0 - from) * Math.PI) / 180)) / 2;
      const alpha = Math.floor(peak * Math.pow(f, pow));
      if (alpha <= 2) continue;
      const a0r = (a0 * Math.PI) / 180, a1r = ((a0 + 1.2) * Math.PI) / 180;
      out += `<path d="M ${cx + r * Math.cos(a0r)} ${my + r * Math.sin(a0r)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a1r)} ${my + r * Math.sin(a1r)}" stroke="rgb(150,175,228)" stroke-opacity="${alpha / 255}" stroke-width="${wid}" fill="none"/>`;
    }
  }
  const rand = lcg(7);
  for (let i = 0; i < 34; i++) {
    const ang = ((300 + rand() * 90) * Math.PI) / 180;
    const dist = 192 + rand() * 130;
    const al = 46 - i * 1.1;
    if (al <= 3) continue;
    out += `<circle cx="${cx + Math.cos(ang) * dist}" cy="${my + Math.sin(ang) * dist * 0.9}" r="${(1.6 + rand() * 2) / 2}" fill="rgb(160,185,235)" fill-opacity="${al / 255}"/>`;
  }
  return out;
}

function codexSvg({ titleLines, category, subtitle, institution, author, stamp, motif }) {
  const W = 1600, cx = 800;
  // auto-fit: Liberation Serif averages ~0.50em advance for tracked caps;
  // conservative estimate, checked visually rather than measured.
  let px = 112;
  const widest = Math.max(...titleLines.map((l) => l.length));
  while (px > 40 && widest * (px * 0.62 + 5) > 1310) px -= 2;
  const parts = [
    `<defs>
       <linearGradient id="bg" x1="0" y1="0" x2="${Math.cos((50 * Math.PI) / 180)}" y2="${Math.sin((50 * Math.PI) / 180)}">
         <stop offset="0" stop-color="rgb(26,32,46)"/><stop offset="1" stop-color="rgb(8,10,16)"/>
       </linearGradient>
       <radialGradient id="wash"><stop offset="0" stop-color="rgb(92,124,190)" stop-opacity="0.18"/>
         <stop offset="1" stop-color="rgb(92,124,190)" stop-opacity="0"/></radialGradient>
       <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0" stop-color="rgb(74,104,164)"/><stop offset="1" stop-color="rgb(128,158,216)"/>
       </linearGradient>
     </defs>`,
    `<rect width="${W}" height="${W}" fill="url(#bg)"/>`,
    `<ellipse cx="${-500 + 1100}" cy="${-700 + 950}" rx="1100" ry="950" fill="url(#wash)"/>`,
    `<rect width="${W}" height="7" fill="url(#bar)"/>`,
    text(category, cx, 92 + 26 * 0.82, MONO, 26, 'rgb(127,159,212)', 1, 9),
    codexMotif(motif),
  ];
  if (stamp) {
    const halfW = (stamp.length * (25 * 0.62 + 7)) / 2 + 22;
    parts.push(`<g transform="translate(1368,152) rotate(-8)">
      <rect x="${-halfW}" y="-33" width="${2 * halfW}" height="66" fill="none" stroke="rgb(112,142,202)" stroke-opacity="0.78" stroke-width="3"/>
      ${text(stamp, 0, -15 + 25 * 0.82, MONO, 25, 'rgb(138,166,224)', 0.84, 7)}</g>`);
  }
  parts.push(
    `<line x1="${cx - 112}" y1="1042" x2="${cx + 112}" y2="1042" stroke="rgb(150,175,225)" stroke-opacity="0.47" stroke-width="1.6"/>`,
    `<line x1="${cx - 94}" y1="1042" x2="${cx + 94}" y2="1042" stroke="rgb(150,175,225)" stroke-opacity="0.16" stroke-width="5"/>`
  );
  let ty = 1092;
  for (const ln of titleLines) {
    parts.push(text(ln, cx, ty + px * 0.82, SERIF, px, 'rgb(205,213,233)', 1, 5));
    ty += px * 1.16;
  }
  const tb = ty + px * 0.1;
  if (subtitle) parts.push(text(subtitle, cx, tb + 18 + 46 * 0.82, SERIF, 46, 'rgb(159,176,208)', 1, 1));
  if (institution)
    parts.push(text(institution.replace(/ - /g, ' · '), cx, tb + 84 + 34 * 0.82, SERIF, 34, 'rgb(124,138,168)', 1, 1));
  if (author) parts.push(text(author, cx, tb + 168 + 23 * 0.82, MONO, 23, 'rgb(107,119,144)', 1, 7));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}">${parts.join('\n')}</svg>`;
}

// ------------------------------------------------------------------ cards ---
const CARDS = [
  {
    name: 'ovruhn', kind: 'emblem', out: 'src/images/lore/ovruhn.jpg',
    title: 'The Ovruhn', category: 'Species', device: 'rings',
    tint: '#0E1E24', accent: '#8FC0B8',
    epithet: 'The Deep-Sung',
    qualifier: 'Who hear the way other peoples see',
  },
  {
    name: 'makers-shape', kind: 'emblem', out: 'src/images/lore/the-makers-shape.jpg',
    title: "The Maker's Shape", category: 'Technology', device: 'fold',
    tint: '#241A30', accent: '#BFA8D6',
    epithet: 'No Mind From Nowhere',
    qualifier: 'Every built mind is a portrait of its makers',
  },
  {
    name: 'sapience', kind: 'emblem', out: 'src/images/lore/sapience-beyond-the-human-measure.jpg',
    title: 'Sapience Beyond the Human Measure', category: 'Institutions', device: 'triad',
    tint: '#12211A', accent: '#9CC6AB',
    epithet: 'The Checklist Refused',
    qualifier: 'Recognition, per lineage, through communication',
  },
  {
    name: 'two-songs', kind: 'codex', out: 'src/images/codex/the-two-songs-of-the-loud-people.jpg',
    titleLines: ['THE TWO SONGS', 'OF THE LOUD PEOPLE'], category: 'XENOLOGY RECORD',
    subtitle: "A Keeper's Account of Humanity",
    institution: 'Rendered from Chorus-Keeping - Archive Translation Desk',
    author: 'KEEPER VHEN OF THAVREN', stamp: 'RENDERED', motif: 'dissolution',
  },
];

async function main() {
  const only = process.argv.slice(2);
  for (const card of CARDS) {
    if (only.length && !only.includes(card.name)) continue;
    const svg = card.kind === 'emblem' ? emblemSvg(card) : codexSvg(card);
    const outPath = path.join(__dirname, '..', card.out);
    await sharp(Buffer.from(svg)).jpeg({ quality: card.kind === 'codex' ? 94 : 92 }).toFile(outPath);
    console.log(`drew  ${card.out}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
