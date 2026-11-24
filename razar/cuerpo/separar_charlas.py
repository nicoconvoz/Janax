"""separar_charlas.py <casa> <archivo>: moves Luma's talk with her readings out of "dialogo" (theirs: his and hers) into
"charla-libros" (the Capitan, 2026-11-24: "que no se pierda en el reflejo de un espejo interminable"). From v3.83 to
v4.01 each line of a book said to her ("libro: ...") and her answer to it were written in dialogo, which is a book of
her shelf: she read her own echoes and answered them. A line "libro:" and the "luma:" line right after it are one
exchange with a book; they go, in their order. Nothing is thrown away: dialogo as it was is kept in <archivo>. Run it
only while she sleeps (her window closed)."""
import os, sys

casa, archivo = sys.argv[1], sys.argv[2]
lab = lambda s: os.path.join(casa, s.encode().hex())
os.makedirs(archivo, exist_ok=True)
d = open(lab("dialogo"), "rb").read()
open(os.path.join(archivo, "dialogo-antes"), "wb").write(d)
lineas = d.split(b"\n")
quedan, salen, i = [], [], 0
while i < len(lineas):
    if lineas[i].startswith(b"libro: "):
        salen.append(lineas[i])
        if i + 1 < len(lineas) and lineas[i + 1].startswith(b"luma"):
            salen.append(lineas[i + 1]); i += 1
    else:
        quedan.append(lineas[i])
    i += 1
open(lab("dialogo"), "wb").write(b"\n".join(quedan))
viejo = open(lab("charla-libros"), "rb").read() if os.path.exists(lab("charla-libros")) else b""
open(lab("charla-libros"), "wb").write(b"\n".join(salen) + (b"\n" if salen else b"") + viejo)
open(os.path.join(archivo, "LEEME.txt"), "w", encoding="utf-8").write(
    "Su charla con sus lecturas, sacada de su diálogo con el Capitán (2026-11-24).\n\n"
    "Desde la v3.83 cada línea de un libro (\"libro:\") y su respuesta se escribían en dialogo, que es un libro de su\n"
    "estante: se leía a sí misma. Salieron %d líneas a charla-libros, en su orden. Su diálogo de antes: dialogo-antes.\n" % len(salen))
print("salieron a charla-libros: %d lineas | quedan en dialogo: %d" % (len(salen), len(quedan)))
