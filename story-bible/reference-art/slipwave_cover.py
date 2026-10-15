"""Remake a Slipwave codex cover in the set's look from the Anthem cover.
py slipwave_cover.py OUT "LINE 1" ["LINE 2"]"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE = 'src/images/codex/star-rangers-anthem.jpg'
out, lines = sys.argv[1], sys.argv[2:]
im = Image.open(BASE).convert('RGB')
a = np.asarray(im).astype(np.float32)
H, W, _ = a.shape
y0, y1 = 965, 1460          # the text block under the gold rule
xl, xr = 140, 1460          # clean margins either side of it
# start from a per-row interpolation between the clean margins
for y in range(y0, y1):
    left = a[y, xl - 20:xl].mean(axis=0)
    right = a[y, xr:xr + 20].mean(axis=0)
    tt = np.linspace(0, 1, xr - xl)[:, None]
    a[y, xl:xr] = left * (1 - tt) + right * tt
# then let the surrounding pixels diffuse in (a harmonic fill follows the vignette)
Y0, Y1, X0, X1 = y0 - 40, y1 + 40, xl - 40, xr + 40
r = 12
for _ in range(400):
    sub = a[Y0:Y1, X0:X1]
    c = np.cumsum(np.cumsum(np.pad(sub, ((r + 1, r), (r + 1, r), (0, 0)), mode='edge'), 0), 1)
    k = 2 * r + 1
    box = (c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]) / (k * k)
    a[y0:y1, xl:xr] = box[y0 - Y0:y1 - Y0, xl - X0:xr - X0]
rng = np.random.default_rng(3)
a[y0:y1] += rng.normal(0, 1.2, a[y0:y1].shape)
im = Image.fromarray(a.clip(0, 255).astype(np.uint8))
d = ImageDraw.Draw(im)

gold = (247, 205, 74)
pale = (206, 212, 236)
muted = (140, 146, 190)
title_font = ImageFont.truetype('georgia.ttf', 96)
sub_font = ImageFont.truetype('georgia.ttf', 40)
sub2_font = ImageFont.truetype('georgia.ttf', 32)
mono = ImageFont.truetype('consola.ttf', 25)

def spaced(text, font, tracking):
    w = sum(d.textlength(c, font=font) for c in text) + tracking * (len(text) - 1)
    return w

def draw_tracked(y, text, font, fill, tracking):
    w = spaced(text, font, tracking)
    x = (W - w) / 2
    for c in text:
        d.text((x, y), c, font=font, fill=fill)
        x += d.textlength(c, font=font) + tracking

y = 985
for ln in lines:
    draw_tracked(y, ln, title_font, gold, 8)
    y += 108
y += 22
draw_tracked(y, 'Slipwave · lineup not stated', sub_font, pale, 1)
y += 58
draw_tracked(y, 'Eden Space Habitat Collections', sub2_font, muted, 1)
y += 82
draw_tracked(y, 'RECOVERED RECORDING · VIDEOCAST', mono, muted, 9)
im.save(out, quality=92)
print('wrote', out)
