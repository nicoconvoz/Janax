"""Turns any picture into a .nube v3 particle cloud (Gotching's format): food for Razar.

Usage: python -I imagen_a_nube.py <picture> <out.nube> [longest_side]
One level, no bones. The picture is scaled so its longest side is `longest_side` cells (default 256: the
order of Gotching's own clouds). A cell holds a particle where the picture is lighter than the background,
the background being split off by Otsu's threshold on luminance (the cut that best separates the picture's
own two populations of light: nothing fixed by eye). Each particle keeps its exact colour.
"""
import struct, sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); lado = int(sys.argv[3]) if len(sys.argv) > 3 else 256
k = lado / max(im.size); im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
w, h = im.size; px = list(im.getdata())
lum = [(299 * r + 587 * g + 114 * b) // 1000 for r, g, b in px]
hist = [0] * 256
for v in lum: hist[v] += 1
total, suma = len(lum), sum(i * c for i, c in enumerate(hist)); sb = wb = 0; mejor, corte = -1, 0
for t in range(256):                       # Otsu: the cut with the largest between-class variance
    wb += hist[t]
    if wb == 0 or wb == total: continue
    sb += t * hist[t]; mb = sb / wb; mf = (suma - sb) / (total - wb)
    v = wb * (total - wb) * (mb - mf) ** 2
    if v > mejor: mejor, corte = v, t
bits = bytearray((w * h + 7) // 8); rgb = bytearray(); n = 0
for j, v in enumerate(lum):
    if v > corte:
        bits[j >> 3] |= 1 << (j & 7); rgb += bytes(px[j]); n += 1
cab = b'NUBE' + bytes([3]) + struct.pack('<fHB', 1.0, 0, 1) + struct.pack('<fiiHH', 1.0, 0, 0, w, h)
open(sys.argv[2], 'wb').write(cab + bits + rgb)
print('%dx%d celdas, corte de luz %d (Otsu), %d particulas' % (w, h, corte, n))
