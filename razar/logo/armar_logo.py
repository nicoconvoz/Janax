"""armar_logo.py: the logo of Luma and of any Razar, drawn from Junin, Mendoza, in the manner of the Fiesta de la
Vendimia: a bunch of grapes with its leaf, golden rays behind as on a festival night, the Andes below and sparks of
fireworks. An original drawing (not the coat of arms of the town, nor any poster of the festival). Writes logo.png
(1024), logo.ico (16 to 256) and logo-chico.png (the 32 one, enlarged, to see how it reads small).
The first drawing (sunrise over a vineyard) is kept in the history of this file."""
import math, os
from PIL import Image, ImageDraw, ImageFilter

AQUI = os.path.dirname(os.path.abspath(__file__))
N = 2048                                # drawn large and reduced: smooth edges
P = lambda x, y: (x * N, y * N)

VINO, VINO2 = (120, 16, 48), (52, 6, 30)            # the wine, from the centre outwards
ORO, ORO2 = (255, 205, 80), (255, 236, 170)
UVA, UVA2, BRILLO = (104, 38, 150), (62, 16, 100), (214, 170, 255)
HOJA, HOJA2, NERVIO = (84, 170, 60), (46, 110, 40), (190, 235, 140)
ROCA, NIEVE = (40, 8, 30), (255, 244, 236)

# the night of the festival: wine, lighter at the centre
img = Image.new("RGBA", (N, N), VINO2 + (255,))
luz = Image.new("RGBA", (N, N), (0, 0, 0, 0))
ImageDraw.Draw(luz).ellipse([*P(.08, .02), *P(.92, .86)], fill=VINO + (255,))
img = Image.alpha_composite(img, luz.filter(ImageFilter.GaussianBlur(N * 0.09)))

# golden rays, as the lights of the stage
ray = Image.new("RGBA", (N, N), (0, 0, 0, 0))
dr = ImageDraw.Draw(ray)
cx, cy = 0.5, 0.50
for k in range(16):
    a = 2 * math.pi * k / 16
    w = math.pi / 110
    d1, d2 = 1.2, 0.2
    dr.polygon([P(cx + d2 * math.cos(a - w), cy + d2 * math.sin(a - w)), P(cx + d2 * math.cos(a + w), cy + d2 * math.sin(a + w)),
                P(cx + d1 * math.cos(a + w * 2.4), cy + d1 * math.sin(a + w * 2.4)), P(cx + d1 * math.cos(a - w * 2.4), cy + d1 * math.sin(a - w * 2.4))], fill=ORO + (105,))
img = Image.alpha_composite(img, ray)
d = ImageDraw.Draw(img)

# the Andes at the foot, snow on the peaks
d.polygon([P(0, .93), P(.10, .84), P(.17, .89), P(.26, .80), P(.38, .92), P(.62, .92), P(.76, .79), P(.87, .89), P(1, .83), P(1, 1), P(0, 1)], fill=ROCA)
d.polygon([P(.26, .80), P(.215, .845), P(.25, .838), P(.275, .862), P(.305, .845)], fill=NIEVE)
d.polygon([P(.76, .79), P(.71, .838), P(.745, .83), P(.775, .858), P(.81, .838)], fill=NIEVE)

# sparks of the fireworks
def chispa(x, y, r):
    for k in range(8):
        a = math.pi * k / 4
        d.line([P(x + r * .35 * math.cos(a), y + r * .35 * math.sin(a)), P(x + r * math.cos(a), y + r * math.sin(a))], fill=ORO2, width=int(N * 0.008))
    d.ellipse([*P(x - r * .16, y - r * .16), *P(x + r * .16, y + r * .16)], fill=ORO2)
chispa(.17, .20, .07); chispa(.85, .27, .055); chispa(.80, .12, .035)

# the bunch: rows of grapes, each with its shine
def uva(x, y, r):
    d.ellipse([*P(x - r, y - r), *P(x + r, y + r)], fill=UVA2)
    d.ellipse([*P(x - r * .9, y - r * .94), *P(x + r * .84, y + r * .8)], fill=UVA)
    d.ellipse([*P(x - r * .5, y - r * .58), *P(x - r * .05, y - r * .13)], fill=BRILLO)
r = 0.068
for fila, n in enumerate((4, 3, 2, 1)):
    for k in range(n):
        uva(0.5 + (k - (n - 1) / 2) * r * 1.9, 0.43 + fila * r * 1.62, r)

# its stem and its leaf
d.line([P(.5, .37), P(.5, .25), P(.56, .19)], fill=HOJA2, width=int(N * 0.022), joint="curve")
hoja = [(.50, .33), (.44, .27), (.36, .29), (.33, .22), (.25, .21), (.29, .15), (.24, .09), (.33, .10), (.37, .04), (.43, .10), (.50, .08), (.49, .17), (.55, .22)]
d.polygon([P(x, y) for x, y in hoja], fill=HOJA)
d.line([P(.50, .33), P(.37, .16)], fill=NERVIO, width=int(N * 0.008))
d.line([P(.44, .25), P(.31, .23)], fill=NERVIO, width=int(N * 0.006))
d.line([P(.41, .21), P(.42, .10)], fill=NERVIO, width=int(N * 0.006))

# the tile: round corners
masc = Image.new("L", (N, N), 0)
ImageDraw.Draw(masc).rounded_rectangle([0, 0, N - 1, N - 1], radius=int(N * 0.2), fill=255)
img.putalpha(masc)

g = img.resize((1024, 1024), Image.LANCZOS)
g.save(os.path.join(AQUI, "logo.png"))
g.save(os.path.join(AQUI, "logo.ico"), sizes=[(s, s) for s in (16, 24, 32, 48, 64, 128, 256)])
img.resize((32, 32), Image.LANCZOS).resize((256, 256), Image.NEAREST).save(os.path.join(AQUI, "logo-chico.png"))
print("ok")
