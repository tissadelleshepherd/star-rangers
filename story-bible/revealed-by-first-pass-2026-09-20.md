# The first pass of `revealed_by` — a proposal, 20 September 2026

Dermot's word on the offer, verbatim: *Yes please.* This is the mechanical
first pass the ruling of the same night allows (`CLAUDE.md`, *The Archive is
open*; `intake-2026-09-20.md`, second section): for every Archive page with
no declaration, the first chapter in story order whose prose names the
page's title, its pre-colon title, or its glossary id or filename slug as
whole words. Nothing is inferred from sense; a page is proposed only where
the prose actually names it, and the naming sentence is beside each so the
declaration can be read against the text. Comments, container fences and
link targets were stripped before matching; generic words (*interval*,
*codex*, *field log*, *archive*, *Mars*, *Meridian* and a few more) were
refused as names.

**What it is not.** A first mention is not always the chapter that
*establishes* the subject for the reader, which is what `revealed_by`
means. Each row is his to confirm or strike, and the strikes are as useful
as the confirmations: they show where the prose names a thing before it
has taught it.

27 of 308 Archive pages are named in prose; 281 are not, and they remain
the worklist (`node scripts/revelation-ledger.js --unrevealed`).

| # | Page | First named in | The sentence |
| --- | --- | --- | --- |
| 1 | Lore: Boundary Zones and Concordant Edges | s01e01c01 — *boundary zones* in Arrival at the Threshold Station | Resonance at this frequency in boundary zones has six documented prior cases; three resolved naturally, two required intervention, one is still open. Conclusion: this posting is not routine. |
| 2 | Lore: Chthonari | s02e04c01 — The Undersong of the Drithle | The second delegation was smaller than the first — three of the Survey people she already knew, one engineer she did not, and the engineer was not human, which the advance message had said plainly and the valley had s... |
| 3 | Lore: Cnoc na mBeach | s08e01c01 — The Night Office | She beat when the beating reached her, and passed it on. The night office at Cnoc na mBeach is said alone, which the Communion permits and Fintan has stopped apologising for. |
| 4 | Lore: Dryadic Trees: Etheric-Rooted Organisms and Class II Anchor Points | s01e02c02 — *Dryadic Trees* in The Grove at the Fault Line | This is within the documented range for mature dryadic trees with established Class II anchor relationships. |
| 5 | Lore: The Ring-Rail | s02e02c01 — Testing, Inspection and Certification | The doorframe sat in the bulkhead between the Deck 5 water run and the Ring-Rail bed — which is to say, in the seam. |
| 6 | Lore: Eden Space Habitat | s00e02c01 — Unauthorised, Therefore | The form letter had arrived eleven months ago, and Adaeze had read it so many times she could recite it in the specific tone she imagined the drafting officer had used, which was no tone at all: The Military Space Com... |
| 7 | Lore: The Hyperfold Yield Combine | s05e02c03 — What Came Off the Ship | The aperture is the part that will survive review." She flagged it, and then, because precision was doctrine before it was temperament, she flagged what she could not support: that she did not know what four months of... |
| 8 | Lore: Krenyi (Quiet-Built) | s01e01c01 — *krenyi* in Arrival at the Threshold Station | Her eyes moved across the dock like a hand moving over a page in the dark, feeling for the letters. Krenyi. |
| 9 | Lore: Military Space Command | s00e02c01 — Unauthorised, Therefore | The form letter had arrived eleven months ago, and Adaeze had read it so many times she could recite it in the specific tone she imagined the drafting officer had used, which was no tone at all: The Military Space Com... |
| 10 | Lore: Drithane | s02e03c01 — The Dark-Down | The Union's charter has a great deal to say about off-world delegations, and Gleann na gCaorach's arrangement with the charter was the arrangement every valley on Drithane had: the delegation could bring what it liked... |
| 11 | Lore: Fliade | s11e02c01 — Eleven Minutes | This is logged the way things are logged on Fliade: by someone who was there, into a unit that was there too, and read afterwards by someone who was not. Aravena carried the unit. |
| 12 | Lore: The Sentinel | s03e01c01 — Filed Under Noise | The Sentinel's was file four hundred and twelve. The classifier's note was three lines long: unmodulated non-repeating EM source, no protocol match across current library, consistent periodicity, catalogued as automat... |
| 13 | Lore: Tír na nÓg | s02e02c01 — Testing, Inspection and Certification | Tír na nÓg, by the vowels. |
| 14 | Glossary: Boundary Zone | s01e01c01 — Arrival at the Threshold Station | Resonance at this frequency in boundary zones has six documented prior cases; three resolved naturally, two required intervention, one is still open. Conclusion: this posting is not routine. |
| 15 | Glossary: Concordant | s01e01c02 — The Forty-Second Discrepancy | A point where the boundary between two Concordants had thinned, and the expressions of each were bleeding through into the other. |
| 16 | Glossary: Court-Fae | s01e02c01 — The Broken Causeway | Something at this site has the signature of a Court-Fae presence: it is feeding on the ambiguity of the failed rituals, on the loop of attempt-failure-attempt. |
| 17 | Glossary: Etheric | s01e02c02 — The Grove at the Fault Line | This was a predator that had put down roots — not metaphorically, but through the trees, through the Etheric fault line, through a structure so old that the people who built the causeway had known to give it space. Th... |
| 18 | Glossary: Gilded Saints | s07e01c01 — The Accurate Account | Starting with the one that costs nothing to check and would embarrass us most to have missed: our own paperwork." Wender had read the doctrine on Court-Fae and Gilded Saints the way she read everything, once for conte... |
| 19 | Glossary: Instrument Drift | s01e01c01 — Arrival at the Threshold Station | It was not a question. ARRIVAL LOG — Rook-7, Unit Classification: Investigative/Analytical Location: Threshold Station, Dock Seven Timestamp: [INSTRUMENT DRIFT DETECTED — two readings available: 06:42:17 / 06:42:57] O... |
| 20 | Glossary: The Interval | s01e01c03 — The Character of the Light | This record was not. Rook-7 held that entry unsent, which it did with roughly one entry in forty, and appended a second line to the same block. It had asked the attendant one question, on the stair, in the interval wh... |
| 21 | Glossary: Krenyi | s01e01c01 — Arrival at the Threshold Station | Her eyes moved across the dock like a hand moving over a page in the dark, feeling for the letters. Krenyi. |
| 22 | Glossary: Levril | s07e01c01 — The Accurate Account | The Union read Aoife's encounter as a Levril one. |
| 23 | Glossary: Overfold | s01e00c01 — The Garden Gate | He had a household name for it — the Fellowship called it the Overfold — and Elvira had taken the word without asking what stood behind it, because a name, even an imprecise one, was better than the alternative: stand... |
| 24 | Glossary: Quantum Space Harmonic Wave | s01e02c03 — Harmonic Debrief | "Quantum Space Harmonic Wave transit is a lock problem. |
| 25 | Glossary: Smart Pet | s02e05c01 — The Warm Patch | So she canvassed the regulars instead, morning by morning, and on the fourth morning she reached the table nearest the warm-air vent, where the author sat — the one whose books about Smart Pets got read to half the ch... |
| 26 | Glossary: Telearch | s07e01c03 — Enough Is Enough | If she completed, she would be something the setting had a name for — a protouniverse, vulnerable, held under a jurisdiction that reached down through Telearchs she would never see, no more sovereign yet than a newbor... |
| 27 | Glossary: The Told | s11e01c02 — Carried It Sleeping | The people are called the Told. |
