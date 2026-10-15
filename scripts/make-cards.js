// Cross-platform port of make-emblem-card.ps1 and make-codex-cover.ps1's
// designed-card mode (no -Underlay support), for sessions without Windows.
// The codex layout follows the .ps1 as redesigned on 2026-10-11.
//
// LOCAL AUTHORING TOOL — not part of the build and not in package.json;
// only its pure codex layout is pinned, by test/make-cards.test.js. It
// needs sharp, installed locally with `npm install --no-save sharp`. Text
// is set by the font engine, so titles are typed rather than drawn and
// correct by construction — the same reason the .ps1 tools exist.
//
// Fidelity notes, stated so nobody hunts a nonexistent bug:
//   - Fonts: each text element names the .ps1's face first and falls back.
//     Codex cards: Georgia, else DejaVu Serif, else Liberation Serif, for the
//     title, subtitle and institution; Bahnschrift SemiBold, else DejaVu Sans
//     Condensed at weight 600, else Liberation Sans Narrow, for the category,
//     stamp and author. Emblem cards use the same serif stack. A Linux runner
//     has neither Georgia nor Bahnschrift, so there the card comes out in the
//     fallbacks: it matches the .ps1 layout, not its letterforms.
//   - Widths are estimated, not measured (librsvg cannot measure text before
//     drawing it), so shrink-to-fit and the stamp's box can land a step or
//     two away from the .ps1's for the same text.
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

// Font stacks: the .ps1 faces first, so a machine that has them uses them,
// then the Linux fallbacks (see the fidelity notes above).
const SERIF = "Georgia, 'DejaVu Serif', 'Liberation Serif', serif";
const SANS = "'Bahnschrift SemiBold', Bahnschrift, 'DejaVu Sans Condensed', 'Liberation Sans Narrow', sans-serif";
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
// 1600x1600, mirrors make-codex-cover.ps1's designed mode as redesigned on
// 2026-10-11 (PR #1120): fixed navy palette, top bar, Bahnschrift-style
// tracked capitals for the category, stamp and author lines, Georgia for the
// title, subtitle and institution; each small line shrinks to fit its width;
// the stamp moves left rather than off the edge; the lower block is measured
// first and set so it ends 92 px above the foot, rising above the old 1042 px
// divider only as far as its content needs (never above 780).
//
// librsvg cannot measure text before drawing it, so widths are ESTIMATED from
// per-character advance factors (estWidth below), set for Georgia and
// Bahnschrift SemiBold and a little generous (checked 2026-10-11 against
// lines the .ps1 drew: 0-6% wider than the real width), so a line that fits
// here should fit in the .ps1 too. Positions are the .ps1's; GDI+ places text by the top
// of its cell and SVG by the baseline, so each y adds ASCENT * px.

const ASCENT = 0.9; // cell top -> baseline, as a fraction of the font size

// Average advances (em) for the two faces. A space is 0.40em because the
// .ps1's Measure-Tracked and Draw-Tracked advance a space by size * 0.40;
// SVG word-spacing adds the difference from the face's own space.
const ADV = {
  serif: { upper: 0.68, lower: 0.5, digit: 0.6, narrow: 0.3, other: 0.55 },
  sans: { upper: 0.62, lower: 0.52, digit: 0.56, narrow: 0.28, other: 0.5 },
};
const NATURAL_SPACE = 0.25; // em, roughly, in both faces

function estWidth(t, px, tracking, face) {
  const a = ADV[face];
  let w = 0;
  for (const ch of t) {
    let f;
    if (ch === ' ') f = 0.4;
    else if (/[.,:;'!|·-]/.test(ch)) f = a.narrow;
    else if (/[0-9]/.test(ch)) f = a.digit;
    else if (ch !== ch.toLowerCase()) f = a.upper;
    else if (ch !== ch.toUpperCase()) f = a.lower;
    else f = a.other;
    w += f * px + tracking;
  }
  return t.length ? w - tracking : 0;
}

// Largest size from startPx down to minPx (step 2) at which t fits maxW,
// as Fit-Font in the .ps1.
function fitPx(t, startPx, minPx, tracking, maxW, face) {
  let p = startPx;
  while (t && p > minPx && estWidth(t, p, tracking, face) > maxW) p -= 2;
  return p;
}

// Pure layout: every size and position the card uses, in card pixels.
// Exported so test/make-cards.test.js can pin it without sharp installed.
function codexLayout({ titleLines, category, subtitle = '', institution = '', author = '', stamp = '' }) {
  const W = 1600;
  const L = { W, cx: W / 2 };

  L.category = { px: fitPx(category, 50, 36, 4, 1000, 'sans'), y: 78, tracking: 4 };

  if (stamp) {
    const px = 40;
    const halfW = estWidth(stamp, px, 3, 'sans') / 2 + 24;
    // Keep the tilted box inside the card: a long stamp moves left.
    L.stamp = { px, halfW, x: Math.min(1368, W - 60 - halfW * 0.995), y: 206, tracking: 3 };
  }

  let px = 104;
  const widest = () => Math.max(...titleLines.map((l) => estWidth(l, px, 4, 'serif')));
  while (px > 40 && widest() > 1330) px -= 2;

  const instText = institution.replace(/ - /g, ' · ');
  const subPx = fitPx(subtitle, 62, 40, 0.5, 1400, 'serif');
  const instPx = fitPx(instText, 52, 40, 0.5, 1480, 'serif');
  const authPx = fitPx(author, 40, 30, 3, 1360, 'sans');

  const gapTitle = 54;
  const titleH = px * 1.16 * titleLines.length + px * 0.06;
  const subH = subtitle ? 20 + subPx * 1.24 : 0;
  const instH = institution ? 4 + instPx * 1.3 : 0;
  const authH = author ? 30 + authPx * 1.2 : 0;
  L.blockH = gapTitle + titleH + subH + instH + authH;
  L.divY = Math.max(780, Math.min(1042, W - 92 - L.blockH));

  let y = L.divY + gapTitle;
  const lines = titleLines.map((text) => {
    const ln = { text, y };
    y += px * 1.16;
    return ln;
  });
  L.title = { px, tracking: 4, lines };
  y += px * 0.06;
  if (subtitle) { y += 20; L.subtitle = { text: subtitle, px: subPx, y, tracking: 0.5 }; y += subPx * 1.24; }
  if (institution) { y += 4; L.institution = { text: instText, px: instPx, y, tracking: 0.5 }; y += instPx * 1.3; }
  if (author) { y += 30; L.author = { text: author, px: authPx, y, tracking: 3 }; y += authPx * 1.2; }
  L.bottom = y;
  return L;
}

function codexMotif(kind) {
  const cx = 800;
  if (kind === 'none') return '';
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

// A text element with the .ps1's space width (see ADV above).
function codexText(t, x, top, family, px, fill, tracking, weight) {
  const ws = ((0.4 - NATURAL_SPACE) * px).toFixed(2);
  const w = weight ? ` font-weight="${weight}"` : '';
  return `<text x="${x}" y="${top + px * ASCENT}" font-family="${family}"${w} font-size="${px}" fill="${fill}" letter-spacing="${tracking}" word-spacing="${ws}" text-anchor="middle">${esc(t)}</text>`;
}

function codexSvg(card) {
  const L = codexLayout(card);
  const { W, cx } = L;
  const serif = (t, y, px, tracking, fill) => codexText(t, cx, y, SERIF, px, fill, tracking);
  const sans = (t, x, y, px, tracking, fill) => codexText(t, x, y, SANS, px, fill, tracking, 600);
  const parts = [
    `<defs>
       <linearGradient id="bg" x1="0" y1="0" x2="${Math.cos((50 * Math.PI) / 180)}" y2="${Math.sin((50 * Math.PI) / 180)}">
         <stop offset="0" stop-color="rgb(26,32,46)"/><stop offset="1" stop-color="rgb(8,10,16)"/>
       </linearGradient>
       <radialGradient id="wash"><stop offset="0" stop-color="rgb(92,124,190)" stop-opacity="${46 / 255}"/>
         <stop offset="1" stop-color="rgb(10,12,20)" stop-opacity="0"/></radialGradient>
       <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0" stop-color="rgb(74,104,164)"/><stop offset="1" stop-color="rgb(128,158,216)"/>
       </linearGradient>
     </defs>`,
    `<rect width="${W}" height="${W}" fill="url(#bg)"/>`,
    `<ellipse cx="${-500 + 1100}" cy="${-700 + 950}" rx="1100" ry="950" fill="url(#wash)"/>`,
    `<rect width="${W}" height="7" fill="url(#bar)"/>`,
    sans(card.category, cx, L.category.y, L.category.px, L.category.tracking, 'rgb(176,198,238)'),
    codexMotif(card.motif || 'rules'),
  ];
  if (L.stamp) {
    const s = L.stamp;
    parts.push(`<g transform="translate(${s.x},${s.y}) rotate(-8)">
      <rect x="${-s.halfW}" y="-40" width="${2 * s.halfW}" height="80" fill="none" stroke="rgb(160,186,238)" stroke-opacity="${235 / 255}" stroke-width="3.5"/>
      ${sans(card.stamp, 0, -24, s.px, s.tracking, 'rgb(184,206,246)')}</g>`);
  }
  parts.push(
    `<line x1="${cx - 112}" y1="${L.divY}" x2="${cx + 112}" y2="${L.divY}" stroke="rgb(160,186,232)" stroke-opacity="${140 / 255}" stroke-width="1.8"/>`,
    `<line x1="${cx - 94}" y1="${L.divY}" x2="${cx + 94}" y2="${L.divY}" stroke="rgb(150,175,225)" stroke-opacity="${40 / 255}" stroke-width="5"/>`
  );
  for (const ln of L.title.lines) parts.push(serif(ln.text, ln.y, L.title.px, L.title.tracking, 'rgb(218,225,242)'));
  if (L.subtitle) parts.push(serif(L.subtitle.text, L.subtitle.y, L.subtitle.px, L.subtitle.tracking, 'rgb(200,210,232)'));
  if (L.institution) parts.push(serif(L.institution.text, L.institution.y, L.institution.px, L.institution.tracking, 'rgb(174,188,218)'));
  if (L.author) parts.push(sans(L.author.text, cx, L.author.y, L.author.px, L.author.tracking, 'rgb(164,180,214)'));
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
  // Required here, not at the top, so test/make-cards.test.js can load the
  // layout without sharp installed.
  const sharp = require('sharp');
  const only = process.argv.slice(2);
  for (const card of CARDS) {
    if (only.length && !only.includes(card.name)) continue;
    const svg = card.kind === 'emblem' ? emblemSvg(card) : codexSvg(card);
    const outPath = path.join(__dirname, '..', card.out);
    await sharp(Buffer.from(svg)).jpeg({ quality: card.kind === 'codex' ? 94 : 92 }).toFile(outPath);
    console.log(`drew  ${card.out}`);
  }
}

module.exports = { codexLayout, codexSvg, estWidth, CARDS };

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
