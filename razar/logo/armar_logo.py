"""armar_logo.py: the logo of Luma and of any Razar, drawn from Junin, Mendoza: the sun coming up behind the Andes,
over the rows of a vineyard. An original drawing (not the coat of arms of the town). Writes logo.png (1024),
logo.ico (16 to 256) and logo-chico.png (the 32 one, enlarged, to see how it reads small)."""
import os
from PIL import Image, ImageDraw, ImageFilter

AQUI = os.path.dirname(os.path.abspath(__file__))
N = 2048                                # drawn large and reduced: smooth edges
P = lambda x, y: (x * N, y * N)

NOCHE, VINO = (11, 16, 38), (58, 20, 66)          # the sky before dawn, down to the colour of wine
SOL, HALO = (255, 200, 70), (255, 150, 60)
ROCA, ROCA2, NIEVE = (38, 44, 78), (26, 30, 58), (240, 246, 255)
TIERRA, HILERA = (20, 58, 40), (120, 200, 90)

# the sky
cielo = Image.new("RGB", (N, N))
d = ImageDraw.Draw(cielo)
for y in range(N):
    t = y / (N - 1)
    d.line([(0, y), (N, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(NOCHE, VINO)))

# the sun and its light
luz = Image.new("RGBA", (N, N), (0, 0, 0, 0))
dl = ImageDraw.Draw(luz)
cx, cy, r = 0.5, 0.43, 0.2
dl.ellipse([*P(cx - r * 1.45, cy - r * 1.45), *P(cx + r * 1.45, cy + r * 1.45)], fill=HALO + (120,))
luz = luz.filter(ImageFilter.GaussianBlur(N * 0.05))
dl = ImageDraw.Draw(luz)
dl.ellipse([*P(cx - r, cy - r), *P(cx + r, cy + r)], fill=SOL + (255,))
img = Image.alpha_composite(cielo.convert("RGBA"), luz)
d = ImageDraw.Draw(img)

# the Andes: a far range and a near one, snow on the peaks
d.polygon([P(0, .70), P(.14, .52), P(.24, .60), P(.38, .44), P(.50, .58), P(.60, .50), P(.74, .40), P(.88, .56), P(1, .48), P(1, .78), P(0, .78)], fill=ROCA)
d.polygon([P(.38, .44), P(.33, .50), P(.37, .49), P(.40, .52), P(.43, .495)], fill=NIEVE)
d.polygon([P(.74, .40), P(.68, .47), P(.72, .46), P(.755, .50), P(.80, .465)], fill=NIEVE)
d.polygon([P(0, .78), P(.20, .62), P(.34, .72), P(.52, .60), P(.70, .73), P(.86, .64), P(1, .74), P(1, .80), P(0, .80)], fill=ROCA2)

# the vineyard: rows that meet at the foot of the mountains
d.rectangle([*P(0, .775), *P(1, 1)], fill=TIERRA)
for k in range(-6, 7):
    x0 = 0.5 + k * 0.035
    x1 = 0.5 + k * 0.21
    w = 0.012
    d.polygon([P(x0 - w * .25, .775), P(x0 + w * .25, .775), P(x1 + w * 2.2, 1.0), P(x1 - w * 2.2, 1.0)], fill=HILERA)

# the tile: round corners
masc = Image.new("L", (N, N), 0)
ImageDraw.Draw(masc).rounded_rectangle([0, 0, N - 1, N - 1], radius=int(N * 0.2), fill=255)
img.putalpha(masc)

g = img.resize((1024, 1024), Image.LANCZOS)
g.save(os.path.join(AQUI, "logo.png"))
g.save(os.path.join(AQUI, "logo.ico"), sizes=[(s, s) for s in (16, 24, 32, 48, 64, 128, 256)])
img.resize((32, 32), Image.LANCZOS).resize((256, 256), Image.NEAREST).save(os.path.join(AQUI, "logo-chico.png"))
print("ok")
