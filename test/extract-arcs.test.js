// Pins scripts/extract-arcs.js, the extractor behind the Arcs and Threads
// reference artefact: how it reads a timestamp's year and season word, where
// a thread sits against the story's present, how a strand's chapters follow
// from its episodes, its cast or its list, how a convergence's state follows
// from whether its chapters exist, how an arc opens and closes, and that a
// rule whose quote has left the record, or that names a chapter not on disk,
// is reported rather than written into the data. The build runs against a
// small fixture record in a temporary folder, never the real one, so a
// content change elsewhere cannot fail this suite; the release run is where
// the rule tables meet the record.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { parseTimestamp, positionOf, build, STRANDS, CONVERGENCES, ARCS, STATE } = require("../scripts/extract-arcs");

test("a timestamp gives its UCSD year and season word, or is undated", () => {
  assert.deepEqual(parseTimestamp("2826 UCSD, Late Autumn, Dusk"), { year: 2826, word: "Late Autumn" });
  assert.deepEqual(parseTimestamp("2831 UCSD, Mid-Autumn — Dock Seven, the Last Stand"), { year: 2831, word: "Mid-Autumn" });
  assert.deepEqual(parseTimestamp("2828 UCSD, Spring — the twelfth day"), { year: 2828, word: "Spring" });
  assert.deepEqual(parseTimestamp("2826 UCSD, Deep Winter — a crossing night"), { year: 2826, word: "Deep Winter" });
  assert.deepEqual(parseTimestamp("Indeterminate. She has stopped trusting the count."), { year: null, word: null });
  assert.deepEqual(parseTimestamp("The survey's third year on Vellamar, by the Archive's reckoning"), { year: null, word: null });
  assert.deepEqual(parseTimestamp(undefined), { year: null, word: null });
});

test("a thread's span sits before, across or after the present", () => {
  assert.equal(positionOf(2712, 2723, 2826), "before the present");
  assert.equal(positionOf(2788, 2831, 2826), "spans the present");
  assert.equal(positionOf(2826, 2826, 2826), "spans the present");
  assert.equal(positionOf(2832, 2834, 2826), "after the present");
  assert.equal(positionOf(null, null, 2826), "undated");
});

test("the rule tables are well formed", () => {
  const seasons = new Set();
  for (const r of STRANDS) {
    for (const s of r.seasons) { assert.ok(!seasons.has(s), `season ${s} in two strand rows`); seasons.add(s); }
    if (r.none) { assert.ok(!r.strands && r.none.length >= 2); continue; }
    assert.ok(r.strands.length >= 2, `seasons ${r.seasons}: a strand row has two or more strands`);
    for (const s of r.strands) {
      assert.ok(s.evidence && s.evidence.length >= 2, `${r.seasons} ${s.label}: a strand carries a quote`);
      assert.ok(s.chapters || s.episodes || s.cast, `${r.seasons} ${s.label}: chapters come from a list, episodes or a cast`);
    }
    assert.ok(CONVERGENCES.some(c => c.seasons.join() === r.seasons.join()), `seasons ${r.seasons}: strands meet at a convergence`);
  }
  for (const c of CONVERGENCES) assert.ok(c.evidence.length >= 2 && typeof c.fixed === "boolean", c.name);
  const ids = new Set();
  for (const a of ARCS) {
    assert.ok(!ids.has(a.id), a.id); ids.add(a.id);
    assert.ok(STATE[a.state], `${a.id}: state`);
    assert.ok(a.source.length >= 2 && a.stateEvidence.length >= 2, `${a.id}: source and state each carry a quote`);
    assert.ok(a.drivers.length >= 1, `${a.id}: an arc names who drives it`);
    const closedState = a.state === "recognition" || a.state === "paid";
    assert.equal(!!a.closed, closedState, `${a.id}: only a closed arc names what closed it`);
    assert.ok(!/major|minor|supporting/i.test(JSON.stringify(a)), `${a.id}: the record ranks no character`);
  }
  for (const id of ["patience-first-terminus", "recovery-2732"]) assert.equal(ARCS.find(a => a.id === id).state, "reserved", `${id} stays shut until its own season`);
});

function chapter(id, s, e, c, title, timestamp, date, povs, extra = "") {
  return `---\nseason: ${s}\nepisode: ${e}\nchapter: ${c}\nid: ${id}\ntitle: "${title}"\ndate: "${date}"\ntimestamp: "${timestamp}"\n${extra}povs:\n${povs.map(p => `  - id: "${p}"\n    label: "${p}"`).join("\n")}\n---\nText.\n`;
}
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "arcs-"));
  const w = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s); };
  w("package.json", JSON.stringify({ version: "9.9.9" }));
  w("lib/storyline-threads.js", `const STORYLINE_THREADS = [
    { id: "spine", name: "The Spine", description: "x", seasons: [1, 3] },
    { id: "deep", name: "Deep", description: "y", seasons: [2] },
  ];
  function threadForSeason(n) { return STORYLINE_THREADS.find(t => t.seasons.includes(Number(n))) || { id: "unsorted" }; }
  module.exports = { STORYLINE_THREADS, threadForSeason };`);
  w("src/lore/year-zero.md", "---\ntitle: \"Year Zero\"\n---\n2826 UCSD is the story's nominal present.\n");
  w("src/threads/spine/index.md", "---\ntitle: \"The Spine\"\npermalink: /threads/spine/\n---\n");
  w("src/seasons/s01/index.md", "---\ntitle: \"Season 1\"\n---\n");
  w("src/seasons/s03/e01/s03e01c01.md", chapter("s03e01c01", 3, 1, 1, "Late Winter", "2828 UCSD, Late Winter", "2026-07-09", ["ann"]));
  w("src/seasons/s03/e01/s03e01c03.md", chapter("s03e01c03", 3, 1, 3, "Early Spring", "2828 UCSD, Early Spring", "2026-08-29", ["ann"]));
  w("src/seasons/s01/e01/s01e01c01.md", chapter("s01e01c01", 1, 1, 1, "Arrival", "2826 UCSD, Early Autumn, Dawn", "2026-07-04", ["ann", "bo"]));
  w("src/seasons/s01/e01/s01e01c02.md", chapter("s01e01c02", 1, 1, 2, "The Gate", "2826 UCSD, Late Autumn, Dusk", "2026-07-05", ["cat"]));
  w("src/seasons/s01/e02/s01e02c01.md", chapter("s01e02c01", 1, 2, 1, "The Question", "2826 UCSD, Early Winter", "2026-07-06", ["ann", "cat"]));
  w("src/seasons/s01/e00/s01e00c01.md", chapter("s01e00c01", 1, 0, 1, "Before", "2814 UCSD, Late Autumn", "2026-10-05", ["bo"]));
  w("src/seasons/s02/e01/s02e01c01.md", chapter("s02e01c01", 2, 1, 1, "Below", "2832 UCSD, the second year", "2026-09-06", ["dee"]));
  w("src/seasons/s02/e02/s02e02c01.md", chapter("s02e02c01", 2, 2, 1, "Above", "Indeterminate", "2026-09-08", ["eve"]));
  w("src/characters/ann-shepherd.md", "---\ntitle: \"Ann Shepherd\"\nid: ann\n---\n");
  w("src/characters/bo.md", "---\ntitle: \"Bo\"\n---\n");
  w("src/characters/cat.md", "---\ntitle: \"Cat\"\n---\n");
  w("src/characters/dee.md", "---\ntitle: \"Dee\"\n---\n");
  w("src/characters/eve.md", "---\ntitle: \"Eve\"\npov_ids: [eve]\n---\n");
  w("story-bible/plan.md", "Strand A — the survey team. Strand B — the cat alone. Convergence: they meet at the question. Ann's arc is the spine. Still open. Bo's arc closed when the stone was set down, paid off at cost. Paid by S01E02C01.\n");
  return root;
}
const P = "story-bible/plan.md";
const RULES = {
  strands: [
    { seasons: [1], evidence: [P, "Strand A"], strands: [
      { label: "A", name: "The survey team", cast: ["ann-shepherd", "bo"], chapters: ["s01e01c01"], evidence: [P, "Strand A — the survey team."] },
      { label: "B", name: "The cat alone", cast: ["cat"], evidence: [P, "Strand B — the cat alone."] },
    ] },
    { seasons: [2], evidence: [P, "Strand A"], strands: [
      { label: "A", name: "Below", episodes: [1], cast: ["dee"], evidence: [P, "Strand A"] },
      { label: "B", name: "Above", episodes: [2], cast: ["eve"], evidence: [P, "Strand B"] },
    ] },
  ],
  convergences: [
    { seasons: [1], name: "The question", fixed: true, chapters: ["s01e02c01"], evidence: [P, "Convergence: they meet at the question."] },
    { seasons: [2], name: "Not yet", fixed: true, chapters: ["s02e01c09"], evidence: [P, "Convergence"] },
  ],
  arcs: [
    { id: "ann", name: "Ann's arc", threads: ["spine"], seasons: [1, 3], drivers: ["ann-shepherd"], source: [P, "Ann's arc is the spine."], state: "open", stateEvidence: [P, "Still open."], beats: [] },
    { id: "bo", name: "Bo's arc", threads: ["spine"], seasons: [1], drivers: ["bo"], source: [P, "Bo's arc"], state: "recognition", stateEvidence: [P, "paid off at cost"],
      closed: { chapter: "s01e02c01", evidence: [P, "Paid by S01E02C01."] },
      beats: [{ text: "The stone", state: "paid", chapter: "s01e02c01", evidence: [P, "the stone was set down"] }] },
  ],
};

test("threads carry their chapters, spans, viewpoint counts and where the present sits", () => {
  const { data, failures, warnings } = build(fixture(), RULES);
  assert.deepEqual(failures, []);
  assert.deepEqual(warnings, ["thread deep: no landing page at src/threads/deep/index.md"]);
  const spine = data.threads[0];
  assert.equal(spine.chapters, 6);
  assert.deepEqual(spine.inWorld.span, [2814, 2828]);
  assert.deepEqual(spine.realDates, ["2026-07-04", "2026-10-05"]);
  assert.equal(spine.present.position, "spans the present");
  assert.equal(spine.present.latest.id, "s03e01c03", "Early Spring falls after Late Winter in one year");
  assert.equal(spine.present.latest.offset, 2);
  assert.equal(spine.povs[0].id, "ann-shepherd", "a pov id resolves through the page's front-matter id");
  assert.equal(spine.povs[0].count, 4);
  assert.equal(spine.landing.url, "/threads/spine/");
  assert.deepEqual(spine.unstranded, [3]);
  const deep = data.threads[1];
  assert.equal(deep.present.position, "after the present");
  assert.deepEqual(deep.inWorld.undated.map(u => u.id), ["s02e02c01"]);
  assert.equal(deep.landing, null);
});

test("strands follow their list, cast or episodes, and the rest of the season is shown outside them", () => {
  const { data } = build(fixture(), RULES);
  const s1 = data.threads[0].strands[0];
  assert.deepEqual(s1.strands[0].chapters, ["s01e01c01"]);
  assert.deepEqual(s1.strands[1].chapters, ["s01e01c02"], "by cast, never the convergence chapter");
  assert.deepEqual(s1.outside, [{ id: "s01e00c01", casts: ["A"] }]);
  const s2 = data.threads[1].strands[0];
  assert.deepEqual(s2.strands.map(s => s.chapters), [["s02e01c01"], ["s02e02c01"]]);
  assert.equal(data.threads[0].convergences[0].state, "fixed, on the page");
  assert.equal(data.threads[1].convergences[0].state, "fixed, not yet on the page");
  assert.deepEqual(data.threads[1].convergences[0].owed, ["s02e01c09"]);
});

test("an arc opens at its drivers' first chapter by in-world date unless the record names one, and closes where its rule says", () => {
  const { data } = build(fixture(), RULES);
  const [ann, bo] = data.arcs;
  assert.equal(ann.state, STATE.open);
  assert.equal(ann.opened.id, "s01e01c01");
  assert.equal(ann.opened.by, "first viewpoint");
  assert.equal(ann.closed, null);
  assert.equal(ann.latest.id, "s03e01c03");
  assert.equal(ann.drivers[0].count, 4);
  assert.equal(bo.opened.id, "s01e00c01", "2814 comes before 2826 whatever the reading order");
  assert.equal(bo.state, STATE.recognition);
  assert.equal(bo.closed.id, "s01e02c01");
  assert.equal(bo.beats[0].chapter.title, "The Question");
  assert.equal(data.counts.byState[STATE.open], 1);
});

test("the same record builds the same data twice", () => {
  const root = fixture();
  assert.deepEqual(build(root, RULES).data, build(root, RULES).data);
});

test("a missing quote, a chapter not on disk, a strand chapter outside its cast or an arc without its closing is a failure", () => {
  const root = fixture();
  const gone = { ...RULES, arcs: [{ ...RULES.arcs[0], stateEvidence: [P, "Long since closed."] }] };
  assert.ok(build(root, gone).failures.some(f => /quote not found in story-bible\/plan.md: "Long since closed."/.test(f)));
  const missing = { ...RULES, arcs: [{ ...RULES.arcs[1], closed: { chapter: "s01e09c09", evidence: [P, "Paid by S01E02C01."] } }] };
  assert.ok(build(root, missing).failures.some(f => /chapter s01e09c09 is not in src\/seasons/.test(f)));
  const wrongCast = { ...RULES, strands: [{ ...RULES.strands[0], strands: [{ ...RULES.strands[0].strands[0], chapters: ["s01e01c02"] }, RULES.strands[0].strands[1]] }, RULES.strands[1]] };
  assert.ok(build(root, wrongCast).failures.some(f => /s01e01c02 carries no viewpoint from the strand's cast/.test(f)));
  const unclosed = { ...RULES, arcs: [{ ...RULES.arcs[1], closed: undefined }] };
  assert.ok(build(root, unclosed).failures.some(f => /a closed arc names what closed it/.test(f)));
  const noDriver = { ...RULES, arcs: [{ ...RULES.arcs[0], drivers: ["nobody"] }] };
  assert.ok(build(root, noDriver).failures.some(f => /driver nobody has no character page/.test(f)));
});
