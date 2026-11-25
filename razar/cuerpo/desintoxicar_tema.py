"""desintoxicar_tema.py <casa> <archivo> <trozo de ruta> <motivo>: takes out of Luma's house what she ate from the files
whose path holds that piece (her greetings "me comí" in her talk, and her books of the disk that point there), because
it is not her time to read it yet. Nothing is thrown away: what goes out is kept in <archivo> with the reason, and the
files themselves stay where they were moved to, waiting. Run it only while she sleeps (her window closed).
(The general form of desintoxicar.py: a theme instead of a bug.)"""
import os, sys

casa, archivo, trozo, motivo = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
os.makedirs(archivo, exist_ok=True)
lab = lambda s: os.path.join(casa, s.encode().hex())
t = trozo.lower().replace("/", "\\")

# her talk: the greetings of those files
d = open(lab("dialogo"), "rb").read()
quedan, salen = [], []
for ln in d.split(b"\n"):
    if ln.startswith("luma: me comí ".encode()) and t in ln.decode("utf-8", "replace").lower().replace("/", "\\"):
        salen.append(ln); continue
    quedan.append(ln)
open(os.path.join(archivo, "dialogo-antes"), "wb").write(d)
open(os.path.join(archivo, "saludos-que-salieron.txt"), "wb").write(b"\n".join(salen) + b"\n")
open(lab("dialogo"), "wb").write(b"\n".join(quedan))

# her shelf: books of the disk that point there (a record: its print, its size, its path)
fuera = []
for x in os.listdir(casa):
    try:
        etiqueta = bytes.fromhex(x).decode()
    except (ValueError, UnicodeDecodeError):
        continue
    if not (etiqueta.startswith("libro-disco-") or etiqueta.startswith("elibro-disco-")):
        continue
    b = open(os.path.join(casa, x), "rb").read()
    ruta = b[16:].decode("utf-8", "replace") if len(b) > 16 else b[8:].decode("utf-8", "replace")
    if t in ruta.lower().replace("/", "\\") or t in b.decode("utf-8", "replace").lower().replace("/", "\\"):
        os.replace(os.path.join(casa, x), os.path.join(archivo, x))
        fuera.append("%s -> %s" % (etiqueta, ruta))
open(os.path.join(archivo, "libros-que-salieron.txt"), "w", encoding="utf-8").write("\n".join(fuera) + "\n")
open(os.path.join(archivo, "LEEME.txt"), "w", encoding="utf-8").write(
    "Desintoxicación de Luma: %s\n\nQué salió: %d saludos (saludos-que-salieron.txt) y %d libros del disco (sus archivos,\n"
    "acá; la lista en libros-que-salieron.txt). Su diálogo completo antes de esto: dialogo-antes.\n" % (motivo, len(salen), len(fuera)))
print("saludos que salieron:", len(salen), "| libros que salieron:", len(fuera))
