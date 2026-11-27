"""armar_icono.py: from the logo (logo.png, the author's own image of the Vendimia), what Luma's launcher carries inside:
its icon, one file a size (as FASM's icon macro takes them), and the picture it shows large before she wakes
(a bitmap on black, as her window is black)."""
import os
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
SAL = os.path.join(AQUI, "..", "instalador")
LADO = 720                              # (criterion, not a measure: the largest that fits whole in a screen 768 high)

im = Image.open(os.path.join(AQUI, "logo.png")).convert("RGBA")
for n in (16, 32, 48, 256):
    im.resize((n, n), Image.LANCZOS).save(os.path.join(SAL, "luma-%d.ico" % n), sizes=[(n, n)], bitmap_format="bmp")
fondo = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 255))
fondo.alpha_composite(im.resize((LADO, LADO), Image.LANCZOS))
fondo.convert("RGB").save(os.path.join(SAL, "luma-logo.bmp"))
im.save(os.path.join(AQUI, "logo.ico"), sizes=[(n, n) for n in (16, 24, 32, 48, 64, 128, 256)])
print("ok")
