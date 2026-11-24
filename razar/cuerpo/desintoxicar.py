"""desintoxicar.py <casa> <archivo>: takes out of Luma's house what a bug of 2026-11-23 left (her greeting "me comí"
said again each time a file she had already eaten changed, and books of the disk that point at another being's
memory, a file named in hexadecimal). Nothing is thrown away: what goes out is kept in <archivo> with the reason.
Run it only while she sleeps (her window closed)."""
import os, re, sys

casa, archivo = sys.argv[1], sys.argv[2]
os.makedirs(archivo, exist_ok=True)
lab = lambda s: os.path.join(casa, s.encode().hex())
es_hex = lambda nombre: len(nombre) > 0 and len(nombre) % 2 == 0 and re.fullmatch(r"[0-9a-f]+", nombre) is not None

# her talk: the first greeting of each file that is not another being's memory stays
d = open(lab("dialogo"), "rb").read()
lineas = d.split(b"\n")
quedan, salen, vistos = [], [], set()
for ln in lineas:
    if ln.startswith("luma: me comí ".encode()):
        ruta = ln[len("luma: me comí ".encode()):].decode("utf-8", "replace")
        nombre = re.split(r"[\\/]", ruta)[-1]
        if es_hex(nombre) or ruta in vistos:
            salen.append(ln); continue
        vistos.add(ruta)
    quedan.append(ln)
open(os.path.join(archivo, "dialogo-antes"), "wb").write(d)
open(os.path.join(archivo, "saludos-que-salieron.txt"), "wb").write(b"\n".join(salen) + b"\n")
open(lab("dialogo"), "wb").write(b"\n".join(quedan))

# her shelf: books of the disk that point at another being's memory
fuera = []
for x in os.listdir(casa):
    try:
        etiqueta = bytes.fromhex(x).decode()
    except (ValueError, UnicodeDecodeError):
        continue
    if not (etiqueta.startswith("libro-disco-") or etiqueta.startswith("elibro-disco-")):
        continue
    b = open(os.path.join(casa, x), "rb").read()
    ruta = b[8:].decode("utf-8", "replace")
    if es_hex(re.split(r"[\\/]", ruta)[-1]):
        os.replace(os.path.join(casa, x), os.path.join(archivo, x))
        fuera.append("%s -> %s" % (etiqueta, ruta))
open(os.path.join(archivo, "libros-que-salieron.txt"), "w", encoding="utf-8").write("\n".join(fuera) + "\n")
open(os.path.join(archivo, "LEEME.txt"), "w", encoding="utf-8").write(
    "Desintoxicación de Luma, 2026-11-23 (el Capitán: \"desintoxicala de paso\").\n\n"
    "Por qué: en la v3.73 ella decía \"me comí\" cada vez que un archivo que ya conocía cambiaba, y comía también la\n"
    "memoria de otros seres (archivos con nombre en hexadecimal, como guarda Janax una casa). El vigía reescribe la suya\n"
    "todo el tiempo, y ella saludó cientos de veces. Desde la v3.79 lo que ya conoce se actualiza callado y la memoria de\n"
    "otro ser no se come.\n\n"
    "Qué salió: %d saludos repetidos o de memorias ajenas (saludos-que-salieron.txt) y %d libros del disco que apuntaban a\n"
    "memorias ajenas (sus archivos, acá). Su diálogo completo antes de esto: dialogo-antes. Quedó el primer saludo de cada\n"
    "archivo de verdad.\n" % (len(salen), len(fuera)))
print("saludos que salieron:", len(salen), "| quedaron:", sum(1 for l in quedan if l.startswith("luma: me comí ".encode())),
      "| libros que salieron:", len(fuera))
