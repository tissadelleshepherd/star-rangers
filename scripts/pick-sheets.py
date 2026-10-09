"""pick-sheets.py - contact sheets of the variations in image-out/, for the pick.

LOCAL AUTHORING TOOL - not part of the build, not run by `npm test`, not
touched by CI. Needs pillow (pip install pillow).

    python scripts/pick-sheets.py OUTDIR [--per-sheet 4] [--only key1,key2]

Reads image-out/manifest.json (written by image-prompts.js --generate) and,
for every generated entry (its `outputs`, paths relative to image-out/), lays its variations side by side on one row with
the key at the left, and stacks PER-SHEET rows to a sheet. Writes
OUTDIR/sheet-NN.jpg and prints which keys are on each sheet, so the pick can
be made from the sheets and recorded as image-file.ps1 -Pick "<key>=<n>".

WHY THIS EXISTS: a run of fifty prompts at two variations is a hundred files
in fifty folders, and the one job the pipeline leaves to a person is choosing
between each pair. Looking at them as pairs, several pairs to a page, is the
only way that job stays a judgement rather than a chore.
"""
import json, os, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
OUT = os.path.join(REPO, "image-out")


def main(argv):
    if not argv:
        print(__doc__); return 2
    outdir = argv[0]
    per = 4
    only = None
    i = 1
    while i < len(argv):
        if argv[i] == "--per-sheet":
            per = int(argv[i + 1]); i += 2
        elif argv[i] == "--only":
            only = set(argv[i + 1].split(",")); i += 2
        else:
            print("unknown option", argv[i]); return 2
    os.makedirs(outdir, exist_ok=True)
    man = json.load(open(os.path.join(OUT, "manifest.json"), encoding="utf-8"))
    entries = [g for g in man.get("generated", []) if not g.get("error") and g.get("outputs")]
    if only:
        entries = [g for g in entries if g.get("key") in only]
    rows = []
    W = 760
    for g in entries:
        # outputs[].file is relative to image-out/
        files = [os.path.join(OUT, o["file"]) for o in g["outputs"]]
        tiles = []
        for n, f in enumerate(files, 1):
            if not os.path.exists(f):
                continue
            im = Image.open(f).convert("RGB")
            im = im.resize((W, int(W * im.height / im.width)), Image.LANCZOS)
            d = ImageDraw.Draw(im)
            d.rectangle((0, 0, 28, 20), fill=(0, 0, 0)); d.text((8, 4), str(n), fill=(255, 255, 0))
            tiles.append(im)
        if not tiles:
            continue
        h = max(t.height for t in tiles)
        row = Image.new("RGB", (220 + len(tiles) * (W + 10), h), (40, 40, 40))
        d = ImageDraw.Draw(row)
        key = g.get("key", "")
        d.text((8, 8), key[:34], fill=(255, 255, 0))
        if len(key) > 34:
            d.text((8, 24), key[34:68], fill=(255, 255, 0))
        for n, t in enumerate(tiles):
            row.paste(t, (220 + n * (W + 10), 0))
        rows.append((key, row))
    sheets = [rows[k:k + per] for k in range(0, len(rows), per)]
    for s, chunk in enumerate(sheets, 1):
        width = max(r.width for _, r in chunk)
        sheet = Image.new("RGB", (width, sum(r.height for _, r in chunk) + 12 * (len(chunk) - 1)), (40, 40, 40))
        y = 0
        for _, r in chunk:
            sheet.paste(r, (0, y)); y += r.height + 12
        p = os.path.join(outdir, f"sheet-{s:02d}.jpg")
        sheet.save(p, quality=86)
        print(f"{os.path.basename(p)}: " + ", ".join(k for k, _ in chunk))
    print(f"{len(rows)} entries on {len(sheets)} sheet(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
