"""armar_icono.py: from the logo (logo.png, the author's own image of the Vendimia), what Luma's launcher carries inside:
its icon, one file a size (as FASM's icon macro takes them), and the picture it shows large before she wakes
(a bitmap with a key colour around the drawing: the window takes its shape)."""
import os
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
SAL = os.path.join(AQUI, "..", "instalador")
LADO = 720                              # (criterion, not a measure: the largest that fits whole in a screen 768 high)

im = Image.open(os.path.join(AQUI, "logo.png")).convert("RGBA")
for n in (16, 32, 48, 256):
    im.resize((n, n), Image.LANCZOS).save(os.path.join(SAL, "luma-%d.ico" % n), sizes=[(n, n)], bitmap_format="bmp")
# THE WINDOW TAKES THE SHAPE OF THE LOGO (the author, 2026-11-27: "que la bandera tenga su contorno, sin un rectangulo
# negro"): what is outside the drawing is painted in one colour that the drawing never has, and the launcher tells the
# host that colour is not there (luma.asm, CLAVE). A point is of the drawing when it is more there than not (half of
# its alpha); its colour is the drawing's over white, the paper it was drawn on, so that no edge wears the key colour.
CLAVE = (255, 0, 255)
g = im.resize((LADO, LADO), Image.LANCZOS)
papel = Image.new("RGBA", (LADO, LADO), (255, 255, 255, 255)); papel.alpha_composite(g)
fondo = Image.new("RGB", (LADO, LADO), CLAVE)
fondo.paste(papel.convert("RGB"), mask=g.getchannel("A").point(lambda v: 255 if v >= 128 else 0))
assert CLAVE not in set(papel.convert("RGB").getdata()), "the drawing has the key colour: choose another"
fondo.save(os.path.join(SAL, "luma-logo.bmp"))
im.save(os.path.join(AQUI, "logo.ico"), sizes=[(n, n) for n in (16, 24, 32, 48, 64, 128, 256)])
print("ok")
