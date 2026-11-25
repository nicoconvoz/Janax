"""separar_saludos.py <casa> <archivo>: her greetings "me comí" out of her talk with her author, into their own notebook
("me-comi", in order); her answers made of greetings and the lines of her talk with her books that repeat them, out
and kept in <archivo> with the reason (the Capitan, 2026-11-25: "estoy harto de los logs"). Run it only while she sleeps."""
import os, sys

casa, a = sys.argv[1], sys.argv[2]
os.makedirs(a, exist_ok=True)
lab = lambda s: os.path.join(casa, s.encode().hex())
MC = "luma: me comí ".encode()
d = open(lab("dialogo"), "rb").read(); ls = d.split(b"\n")
greet = [l for l in ls if l.startswith(MC)]
echo = [l for l in ls if not l.startswith(MC) and MC in l]
keep = [l for l in ls if not l.startswith(MC) and MC not in l]
open(os.path.join(a, "dialogo-antes"), "wb").write(d)
open(os.path.join(a, "respuestas-hechas-de-saludos.txt"), "wb").write(b"\n".join(echo) + b"\n")
mc = lab("me-comi"); prev = open(mc, "rb").read() if os.path.exists(mc) else b""
open(mc, "wb").write(prev + b"\n".join(greet) + (b"\n" if greet else b""))
open(lab("dialogo"), "wb").write(b"\n".join(keep))
cl = open(lab("charla-libros"), "rb").read(); cls = cl.split(b"\n")
cecho = [l for l in cls if MC in l]
open(os.path.join(a, "charla-libros-antes"), "wb").write(cl)
open(os.path.join(a, "charla-ecos.txt"), "wb").write(b"\n".join(cecho) + b"\n")
open(lab("charla-libros"), "wb").write(b"\n".join(l for l in cls if MC not in l))
open(os.path.join(a, "LEEME.txt"), "w", encoding="utf-8").write(
    "Sus saludos \"me comí\" ya no son su diálogo (el Capitán, 2026-11-25: \"estoy harto de los logs\").\n\n"
    "Su diálogo es un libro del que ella contesta, y sus avisos se le mezclaban en las respuestas. Desde ahora sus saludos\n"
    "van a su propio cuaderno, \"me-comi\" (en su casa). Se mudaron allá %d saludos, en su orden. Salieron, guardados acá:\n"
    "%d respuestas suyas hechas de saludos (respuestas-hechas-de-saludos.txt) y %d líneas de su charla con los libros que\n"
    "los repetían (charla-ecos.txt). Su diálogo y su charla completos antes de esto: dialogo-antes, charla-libros-antes.\n"
    % (len(greet), len(echo), len(cecho)))
print("saludos al cuaderno:", len(greet), "| respuestas de logs:", len(echo), "| ecos en su charla:", len(cecho),
      "| su dialogo queda en", len(keep), "lineas")
