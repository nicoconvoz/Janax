"""sumar_paso.py <casa> <archivo> <pasos antes>: her alphabet gains one step (WY_STEPS grew by one at its end). In her
ways ("caminos") a letter up to <pasos antes> is a step and one above it is a way of hers, so every letter above it
moves one up; her steps' silhouettes ("siluetas", 48 bytes a step) gain an empty one. Nothing is thrown away: both files
as they were are kept in <archivo>. Run it only while she sleeps, once, before she is born with the new step."""
import os, struct, sys

casa, archivo, antes = sys.argv[1], sys.argv[2], int(sys.argv[3])
os.makedirs(archivo, exist_ok=True)
lab = lambda s: os.path.join(casa, s.encode().hex())

p = lab("caminos")
if os.path.exists(p):
    b = open(p, "rb").read()
    open(os.path.join(archivo, "caminos-antes"), "wb").write(b)
    q = list(struct.unpack("<%dq" % (len(b) // 8), b[:len(b) // 8 * 8]))
    n_, s_, an, vn = q[:4]
    i = 4

    def word():
        """a word: its length, then its letters; the ways among them move one up"""
        global i
        n = q[i]; i += 1
        for k in range(n):
            if q[i + k] > antes:
                q[i + k] += 1
        i += n

    for _ in range(vn):
        word()
    word()                              # her way
    for _ in range(an):
        i += 1                          # why it lost
        word()
    assert i == len(q), "caminos: se leyeron %d de %d palabras" % (i, len(q))
    open(p, "wb").write(struct.pack("<%dq" % len(q), *q))
    print("caminos: %d caminos suyos, %d guardados; letras corridas" % (vn, an))
p = lab("siluetas")
if os.path.exists(p):
    b = open(p, "rb").read()
    open(os.path.join(archivo, "siluetas-antes"), "wb").write(b)
    if len(b) == 48 * antes:
        open(p, "wb").write(b + bytes(48))
        print("siluetas: un paso vacio mas (%d -> %d bytes)" % (len(b), len(b) + 48))
    else:
        print("siluetas: %d bytes, no son %d pasos: se deja como esta" % (len(b), antes))
open(os.path.join(archivo, "LEEME.txt"), "w", encoding="utf-8").write(
    "Su abecedario de pasos ganó uno (de %d a %d). Sus caminos y sus siluetas, como estaban antes de correr las letras:\n"
    "caminos-antes, siluetas-antes.\n" % (antes, antes + 1))
