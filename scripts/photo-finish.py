"""photo-finish.py - finish a generated image toward Dermot's own photographs.

LOCAL AUTHORING TOOL - not part of the build, not run by `npm test`, not
touched by CI. Needs Python 3 with numpy and pillow
(pip install numpy pillow). import-image.ps1 calls it by default.

    python scripts/photo-finish.py IN OUT [--max-edge N] [--strength 1] [--quality 85]
    python scripts/photo-finish.py --measure IMAGE [IMAGE ...]
    python scripts/photo-finish.py --profile-from DIR [--write scripts/photo-profile.json]

WHY THIS EXISTS. Dermot, 7 October 2026: "the base image generator has
inherent limitations regardless of the prompt itself so post-processing is
needed or some way to align it with the tone and style of real photographs,
especially my own photos. The image generator looks like it was training on
stock photos." Measured the same day against the 217 photographs on his site,
the generated images crushed their blacks, carried half the grain and had half
again as much smooth gradient area. A prompt cannot change a renderer's
finish; this does, by a measured amount. The look wanted is a photograph taken
in the 29th century by an imperfect camera (story-bible/images.md), and a
photograph has a shadow floor, grain, a lens and some untidiness.

WHAT IT DOES, in order, each step only as far as the image is short of the
profile in scripts/photo-profile.json (the site's medians):
  1. black floor: a toe that lifts the 1st percentile to the profile's, so no
     pixel sits at pure black unless the image already clears the floor;
  2. saturation: eased toward the profile's mean saturation, never by more
     than a fifth, and only downward;
  3. optics: a light gaussian softening at output size, the lens rather than
     the renderer;
  4. grain: luminance noise added only to the shortfall against the profile's
     flat-area noise (noise adds in quadrature), lighter in the highlights,
     with a quarter as much chroma noise.
Strength 1 (Dermot's default, "Strength 1 as default please", 7 Oct 2026) is
the measured match. Strength 2 adds a highlight roll-off, more grain, a
vignette and a slight lateral colour fringe, and on a dark frame it goes too
far; use it on purpose, per image. Strength 0 resizes and encodes only, for
designed cards, emblems and Dermot's own plates, which are photographs
already and are never finished.

--measure prints each image's figures beside the profile, for the pick: when
two variations are otherwise close, the one nearer the profile is the one
that reads as a photograph. --profile-from rebuilds the profile from a
sibling checkout of dermot-cochran-photography (its src/images/photos/).
"""
import glob, json, os, sys
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
PROFILE = os.path.join(HERE, "photo-profile.json")
MEASURE_WIDTH = 1200
LAPLACE = ImageFilter.Kernel((3, 3), [0, 1, 0, 1, -4, 1, 0, 1, 0], scale=1)


def measure(im):
    """Figures at a fixed 1200 px width so images of any size compare."""
    w = MEASURE_WIDTH
    s = im.convert("RGB").resize((w, max(1, int(w * im.height / im.width))), Image.LANCZOS)
    hsv = np.asarray(s.convert("HSV"), dtype=np.float32) / 255.0
    g = np.asarray(s.convert("L"), dtype=np.float32)
    lap = np.asarray(s.convert("L").filter(LAPLACE), dtype=np.float32)
    gx = np.abs(np.diff(g, axis=1))[:-1, :]
    gy = np.abs(np.diff(g, axis=0))[:, :-1]
    flat = (gx + gy) < 4
    noise = float(lap[:-1, :-1][flat].std()) if flat.sum() > 1000 else float("nan")
    return {
        "sat": float(hsv[:, :, 1].mean()),
        "p1": float(np.percentile(g, 1)),
        "p50": float(np.median(g)),
        "p995": float(np.percentile(g, 99.5)),
        "clipb": float((g < 5).mean() * 100),
        "noise": noise,
        "flat": float(flat.mean() * 100),
    }


def fmt(m):
    return "sat %.2f  black %3.0f  mid %3.0f  ceiling %3.0f  at-black %.2f%%  grain %4.1f  flat %2.0f%%" % (
        m["sat"], m["p1"], m["p50"], m["p995"], m["clipb"], m["noise"], m["flat"])


def load_profile(path=PROFILE):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def finish(im, strength, profile, seed=1):
    """Return the finished image. im is already at output size."""
    if strength <= 0:
        return im.convert("RGB")
    rng = np.random.default_rng(seed)
    target = profile["median"]
    m = measure(im)
    a = np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0
    # 1 black floor, as a luminance toe so colour is not greyed by the lift
    floor = target["p1"] + (6 if strength >= 2 else 0)
    if m["p1"] < floor:
        b = (floor - m["p1"]) / 255.0
        a = b + (1 - b) * a
    # 2 saturation, eased downward only
    if m["sat"] > target["sat"]:
        k = max(0.8, target["sat"] / m["sat"])
        L = a.mean(axis=2, keepdims=True)
        a = L + (a - L) * k
    # strength 2: a highlight roll-off, the look of a sensor near its ceiling
    if strength >= 2:
        k = 0.8
        a = np.where(a > k, k + (1 - k) * (1 - np.exp(-(a - k) / (1 - k))), a)
    # 3 optics
    soft = 0.6 if strength == 1 else 1.0
    im2 = Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8)).filter(ImageFilter.GaussianBlur(soft))
    a = np.asarray(im2, dtype=np.float32) / 255.0
    h, w, _ = a.shape
    if strength >= 2:
        # a slight lateral colour fringe and a vignette
        def scaled(ch, s):
            p = Image.fromarray((ch * 255).astype(np.uint8))
            q = p.resize((int(w * s), int(h * s)), Image.BILINEAR)
            x = (q.width - w) // 2; y = (q.height - h) // 2
            return np.asarray(q.crop((x, y, x + w, y + h)), dtype=np.float32) / 255.0
        a = np.stack([scaled(a[:, :, 0], 1.0015), a[:, :, 1], scaled(a[:, :, 2], 0.9985)], axis=2)
        yy, xx = np.mgrid[0:h, 0:w]
        r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
        a = a * (1 - 0.18 * np.clip(r - 0.6, 0, 1) ** 2)[:, :, None]
    # 4 grain, only the shortfall; the figure is measured at 1200 wide, so scale sigma with the output width
    want = target["noise"] * (1.0 if strength == 1 else 1.4)
    have = m["noise"] if m["noise"] == m["noise"] else 0.0
    need = max(0.0, want ** 2 - have ** 2) ** 0.5
    if need > 0:
        sigma = need * 0.75 / 255.0 * (w / MEASURE_WIDTH) ** 0.5
        lum = rng.normal(0, sigma, (h, w, 1)) * (1 - 0.4 * a.mean(axis=2, keepdims=True))
        chr = rng.normal(0, sigma / 3, (h, w, 3))
        a = np.clip(a + lum + chr, 0, 1)
    return Image.fromarray((a * 255 + 0.5).astype(np.uint8))


def resize(im, max_edge):
    if max_edge and max(im.size) > max_edge:
        s = max_edge / max(im.size)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    return im


def build_profile(src_dir):
    files = sorted(glob.glob(os.path.join(src_dir, "*.jpg")))
    rows = [measure(Image.open(f)) for f in files]
    keys = list(rows[0].keys())
    stat = lambda q: {k: round(float(np.nanpercentile([r[k] for r in rows], q)), 3) for k in keys}
    return {
        "about": "Medians (and quartiles) of Dermot's published photographs at 1200 px wide, measured by scripts/photo-finish.py; the target a generated image is finished toward.",
        "source": os.path.abspath(src_dir),
        "count": len(rows),
        "median": stat(50), "p25": stat(25), "p75": stat(75),
    }


def main(argv):
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__); return 2
    if argv[0] == "--measure":
        prof = load_profile()
        print("profile  " + fmt(prof["median"]) + f"   ({prof['count']} photographs)")
        for p in argv[1:]:
            print("%-8s " % "" + fmt(measure(Image.open(p))) + "   " + os.path.basename(p))
        return 0
    if argv[0] == "--profile-from":
        out = PROFILE
        if "--write" in argv:
            out = argv[argv.index("--write") + 1]
        prof = build_profile(argv[1])
        with open(out, "w", encoding="utf-8") as f:
            json.dump(prof, f, indent=2)
        print(f"profile from {prof['count']} photographs written to {out}")
        print("median   " + fmt(prof["median"]))
        return 0
    src, out = argv[0], argv[1]
    opts = {"--max-edge": 0, "--strength": 1, "--quality": 85, "--seed": 1}
    rest = argv[2:]
    for i in range(0, len(rest), 2):
        if rest[i] not in opts:
            print("unknown option", rest[i]); return 2
        opts[rest[i]] = int(rest[i + 1])
    im = resize(Image.open(src).convert("RGB"), opts["--max-edge"])
    before = measure(im)
    result = finish(im, opts["--strength"], load_profile(), opts["--seed"])
    result.save(out, "JPEG", quality=opts["--quality"], optimize=True)
    after = measure(Image.open(out))
    print(f"{os.path.basename(out)}: {im.width}x{im.height}, strength {opts['--strength']}, {os.path.getsize(out) // 1024} KB")
    print("  before   " + fmt(before))
    print("  after    " + fmt(after))
    print("  profile  " + fmt(load_profile()["median"]))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
