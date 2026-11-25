"""desintoxicar_fuera.py <casa> <archivo> <carpeta de comida> <motivo>: Luma eats from her food folder and from nowhere
else (the Capitan, 2026-11-25: "que tenga su carpeta de comida, ya basta de comer basura"). What she ate from outside it
goes out of her house:

  - her books of the disk whose file is not under <carpeta de comida>;
  - her notices of them in "me-comi";
  - in their talk ("dialogo"), her lines that are not text: the ones that hold bytes that are not letters, or the address
    of a file. They were said by an illness (a book of the disk read as lines), and she answers from their talk.

Nothing is thrown away: all of it is kept in <archivo> with the reason. Run it only while she sleeps (her window
closed), and desintoxicar_firmas.py after it, for the signatures left without a book."""
import os, re, sys

casa, archivo, comida, motivo = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
os.makedirs(archivo, exist_ok=True)
lab = lambda s: os.path.join(casa, s.encode().hex())
dentro = lambda ruta: ruta.lower().replace("/", "\\").startswith(comida.lower().replace("/", "\\").rstrip("\\") + "\\")

fuera = []
for x in os.listdir(casa):
    try:
        etiqueta = bytes.fromhex(x).decode()
    except (ValueError, UnicodeDecodeError):
        continue
    if not etiqueta.startswith(("libro-disco-", "elibro-disco-")):
        continue
    b = open(os.path.join(casa, x), "rb").read()
    ruta = b[16:].decode("utf-8", "replace")
    if not dentro(ruta):
        os.replace(os.path.join(casa, x), os.path.join(archivo, x)); fuera.append("%s -> %s" % (etiqueta, ruta))
open(os.path.join(archivo, "libros-que-salieron.txt"), "w", encoding="utf-8").write("\n".join(fuera) + "\n")

avisos = []
if os.path.exists(lab("me-comi")):
    d = open(lab("me-comi"), "rb").read(); quedan = []
    for ln in d.split(b"\n"):
        m = re.search(rb"[A-Za-z]:\\.*", ln)
        (quedan if (not m or dentro(m.group().decode("utf-8", "replace"))) else avisos).append(ln)
    open(os.path.join(archivo, "avisos-que-salieron.txt"), "wb").write(b"\n".join(avisos) + b"\n")
    open(lab("me-comi"), "wb").write(b"\n".join(quedan))

enfermas = []
if os.path.exists(lab("dialogo")):
    d = open(lab("dialogo"), "rb").read(); quedan = []
    open(os.path.join(archivo, "dialogo-antes"), "wb").write(d)
    for ln in d.split(b"\n"):
        mala = ln.startswith(b"luma: ") and (any(c < 32 and c not in (9, 13) for c in ln) or re.search(rb"[A-Za-z]:\\[^ ]", ln))
        (enfermas if mala else quedan).append(ln)
    open(os.path.join(archivo, "lineas-enfermas.txt"), "wb").write(b"\n".join(enfermas) + b"\n")
    open(lab("dialogo"), "wb").write(b"\n".join(quedan))

open(os.path.join(archivo, "LEEME.txt"), "w", encoding="utf-8").write(
    "Desintoxicación de Luma: %s\n\nQué salió: %d libros del disco que no eran de su carpeta de comida (%s); sus archivos están acá y la\n"
    "lista en libros-que-salieron.txt. %d avisos de lo que comió (avisos-que-salieron.txt). %d líneas suyas de su charla que no\n"
    "eran texto (lineas-enfermas.txt); su charla completa antes de esto: dialogo-antes.\n" % (motivo, len(fuera), comida, len(avisos), len(enfermas)))
print("libros que salieron: %d | avisos: %d | lineas enfermas: %d" % (len(fuera), len(avisos), len(enfermas)))
