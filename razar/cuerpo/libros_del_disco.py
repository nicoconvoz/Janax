"""libros_del_disco.py <casa>: brings Luma's books of the disk to their form of v3.97 (the print of the file, its size and
its address; before: the print and the address), with the print and size each file has today. Which of
them are records (the Capitan, 2026-11-24: "la estamos intoxicando con logs") is told by her body the next time each
changes (gen_luma.py he_record: what it was still there whole, and more than half of its lines with a label): from
outside, without the size it had, "it only grew at its end" cannot be seen, and a file of settings changed inside
(key: value) would be taken for one. Run it only while she sleeps (her window closed)."""
import os, re, sys

casa = sys.argv[1]

def fnv(b):
    h = 0xcbf29ce484222325
    for x in b:
        h = ((h ^ x) * 0x100000001b3) & (2 ** 64 - 1)
    return h

def es_registro(data):
    lineas = [l for l in data.decode("utf-8", "replace").splitlines() if l.strip()]
    if not lineas:
        return False
    marca = sum(1 for l in lineas if re.match(r"\s*(\d|[^\s:]+:)", l))
    return 2 * marca > len(lineas)

viejos = nuevos = registros = 0
for x in sorted(os.listdir(casa)):
    try:
        e = bytes.fromhex(x).decode()
    except (ValueError, UnicodeDecodeError):
        continue
    m = re.match(r"^(e?libro|registro)-disco-([0-9a-f]{16})$", e)
    if not m:
        continue
    b = open(os.path.join(casa, x), "rb").read()
    if re.match(rb"^[A-Za-z]:\\", b[8:11]):                  # the form before: print and address
        huella, ruta = b[:8], b[8:]
        viejos += 1
    else:
        huella, ruta = b[:8], b[16:]
    camino = ruta.decode("utf-8", "replace")
    try:
        data = open(camino, "rb").read()
    except OSError:
        data = None
    tam = len(data) if data is not None else 0
    nuevo = huella + tam.to_bytes(8, "little") + ruta
    if data is not None:                                   # (its print and size as it is today: from here her body
        nuevo = fnv(data).to_bytes(8, "little") + tam.to_bytes(8, "little") + ruta   # can tell what only grows at its end)
    if nuevo != b:
        open(os.path.join(casa, x), "wb").write(nuevo)
        nuevos += 1
print("libros del disco con la forma nueva: %d (de la forma vieja: %d)" % (nuevos, viejos))
