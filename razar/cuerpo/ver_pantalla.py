"""Draws a .nube (Gotching's particle cloud, version 3) as a PNG, outside Godot.

Usage: python -I ver_pantalla.py <file.nube> <out.png> [scale]
Layout (little-endian, as Gotching's exportarnube writes it and NubeViva.cs reads it): "NUBE", u8 version 3,
f32 fine step, u16 bones, 42 bytes per bone, u8 levels; per level f32 step, i32 k0x, i32 k0y, u16 width,
u16 height, ceil(w*h/8) bits LSB-first (a set bit is a particle), then 3 bytes RGB per particle in reading
order. Only the first (finest) level is drawn; particles are placed at their rest position (no skeleton).
"""
import struct, sys
from PIL import Image
b = open(sys.argv[1], 'rb').read(); escala = int(sys.argv[3]) if len(sys.argv) > 3 else 5
assert b[:4] == b'NUBE' and b[4] == 3, 'not a .nube v3'
huesos = struct.unpack_from('<H', b, 9)[0]; p = 11 + 42 * huesos
niveles = b[p]; p += 1
paso, k0x, k0y, w, h = struct.unpack_from('<fiiHH', b, p); p += 16
nb = (w * h + 7) // 8; bits = b[p:p + nb]; p += nb
img = Image.new('RGB', (w, h)); n = 0
for j in range(w * h):
    if bits[j >> 3] >> (j & 7) & 1:
        img.putpixel((j % w, j // w), tuple(b[p + 3 * n:p + 3 * n + 3])); n += 1
img.resize((w * escala, h * escala), Image.NEAREST).save(sys.argv[2])
print('%dx%d, %d particulas, %d huesos, %d niveles' % (w, h, n, huesos, niveles))
