"""desintoxicar_firmas.py <casa> <archivo> [<trozo de ruta>]: after books were taken out of Luma's house
(desintoxicar_tema.py), what is left of them elsewhere goes out too:

  - "lenguas": the signature of every book she has counted, 270,368 bytes each (its print, its size, the cost of what was
    written to her, 0, and how often each sign follows each two). A signature whose book is no longer in her house is an
    orphan: it only weighs (her house is loaded whole). She counts a signature again by herself when one is missing, so
    taking one out by mistake costs her a reading, nothing else.
  - "me-comi": her notices of what she ate, for the files whose path holds <trozo de ruta>.

Nothing is thrown away: the orphans go to <archivo>/firmas-huerfanas.zip and the notices to
<archivo>/avisos-que-salieron.txt. Run it only while she sleeps (her window closed)."""
import os, sys, zipfile

casa, archivo = sys.argv[1], sys.argv[2]
trozo = sys.argv[3].lower().replace("/", "\\") if len(sys.argv) > 3 else None
os.makedirs(archivo, exist_ok=True)
lab = lambda s: os.path.join(casa, s.encode().hex())
REC = 32 + (32 * 32 * 32 * 8 + 32 * 32 * 8)     # gen_leer.py: 32 bytes and VB


def huella(etiqueta):                           # gen_leer.py, lj_hash: 31 x what came before, plus the byte
    h = 0
    for c in etiqueta:
        h = (h * 31 + c) & 0xFFFFFFFFFFFFFFFF
    return h


vivas = set()
for x in os.listdir(casa):
    try:
        vivas.add(huella(bytes.fromhex(x)))
    except ValueError:
        pass

p = lab("lenguas"); n = os.path.getsize(p)
assert n % REC == 0, "lenguas is not a whole number of signatures: %d" % n
tmp = p + ".nuevo"; quedan = salen = 0
with open(p, "rb") as f, open(tmp, "wb") as g, zipfile.ZipFile(os.path.join(archivo, "firmas-huerfanas.zip"), "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for i in range(n // REC):
        r = f.read(REC); h = int.from_bytes(r[:8], "little")
        if h in vivas:
            g.write(r); quedan += 1
        else:
            z.writestr("%016x" % h, r); salen += 1
os.replace(tmp, p)
print("firmas: quedan %d, salieron %d (%.0f MB menos)" % (quedan, salen, salen * REC / 1e6))

avisos = 0
if trozo and os.path.exists(lab("me-comi")):
    d = open(lab("me-comi"), "rb").read(); dentro, fuera = [], []
    for ln in d.split(b"\n"):
        (fuera if trozo in ln.decode("utf-8", "replace").lower().replace("/", "\\") else dentro).append(ln)
    open(os.path.join(archivo, "avisos-que-salieron.txt"), "wb").write(b"\n".join(fuera) + b"\n")
    open(lab("me-comi"), "wb").write(b"\n".join(dentro)); avisos = len(fuera)
    print("avisos que salieron:", avisos)
open(os.path.join(archivo, "LEEME-firmas.txt"), "w", encoding="utf-8").write(
    "Firmas huérfanas de Luma: %d firmas de libros que ya no están en su casa (firmas-huerfanas.zip, una por archivo,\n"
    "con la huella de su libro por nombre) y %d avisos de lo que comió (avisos-que-salieron.txt).\n"
    "Por qué salieron: sólo pesaban; su casa se carga entera. Si alguna hiciera falta, ella la vuelve a contar sola.\n" % (salen, avisos))
