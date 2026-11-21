"""libre.py <casa>: Luma's own conclusions, as she keeps them in "libre" (gen_luma.py: free_routine), and what she
read, as she keeps it in "leido" (gen_leer.py).

For each act: how many times she chose it (N), how many it paid (S), her wish for it, (S + 1/2) / (N + 1), and the
chance she draws it now (her wish over the sum). And her breath: the frames her last round took."""
import os, struct, sys

casa = sys.argv[1]
path = os.path.join(casa, "libre".encode().hex())
if not os.path.exists(path) or os.path.getsize(path) < 56:
    print("todavia no eligio nada (no hay 'libre' en %s)" % casa); sys.exit(0)
raw = open(path, "rb").read()
v = struct.unpack("<7q", raw[:56])
rows = [("descansar", v[0], v[1], "alguien la busco mientras estaba quieta"),
        ("pensar", v[2], v[3], "una forma suya gano en esa ronda"),
        ("dar", v[4], v[5], "a la criatura a la que se lo dio le sirvio")]
if len(raw) >= 4360 + 16:
    n4, s4 = struct.unpack("<2q", raw[4360:4376])
    rows.append(("dormir", n4, s4, "desperto hecha de algo nuevo"))
lee = struct.unpack("<10q", raw[4384:4464]) if len(raw) >= 4464 else None
if lee:
    rows.append(("leer", lee[0], lee[1], "lo que leyo fue un recuerdo unico"))
wish = [(s + 0.5) / (n + 1) for _, n, s, _ in rows]
if len(raw) >= 72:
    n3 = struct.unpack("<q", raw[64:72])[0]
    rows.append(("pintarse", n3, 0, "nada: es gratis")); wish.append(0.5 / (n3 + 1))
print("%-10s %8s %8s %8s %8s   %s" % ("acto", "eligio", "pago", "ganas", "chance", "que le paga"))
for (name, n, s, pays), w in zip(rows, wish):
    print("%-10s %8d %8d %8.4f %7.1f%%   %s" % (name, n, s, w, 100 * w / sum(wish), pays))
print("su respiro: %d cuadros" % v[6])
if len(raw) >= 272 + 8 + 16:
    seen = struct.unpack("<q", raw[272:280])[0]
    tab = [struct.unpack("<2q", raw[280 + 16 * i:296 + 16 * i]) for i in range(1, min(seen + 1, (len(raw) - 280) // 16))]
    given = sum(1 for n, s_ in tab if n > 0); served = sum(1 for n, s_ in tab if s_ > 0)
    print("criaturas que ve: %d; le dio algo a %d; le sirvio a %d" % (len(tab), given, served))

def letters(lo, hi):
    if hi >> 60 == 15:                  # a sentence of words longer than 31 letters: kept under its print
        return "cancion #%015x%016x" % (hi & (2 ** 60 - 1), lo)
    s = ""
    for w in (lo, hi):
        while w:
            s += "0123456789ABCDEF"[w & 15]; w >>= 4
    return s or "(sin organo)"
fp = os.path.join(casa, "firma".encode().hex())
if os.path.exists(fp) and os.path.getsize(fp) == 32:
    f = struct.unpack("<4q", open(fp, "rb").read())
    print("la firma de su autor: de %d pasajes de su diario que nunca conto, reconoce %d; de %d del Nuevo Testamento, toma por suyos %d" % f)
hp = os.path.join(casa, "hallazgos".encode().hex())
if os.path.exists(hp):
    print("lo que busca en todo lo que entra a su casa (lo escribe ella, en texto: %s):" % hp.replace("\\", "/"))
    for l in open(hp, "rb").read().decode("latin-1").split("\n"):
        if l.strip(): print("  " + l.rstrip()[:300])
if lee:
    print("lo nuevo que lee: un instinto %d veces (%d fue suyo), una letra %d veces (%d ganaron)" % lee[2:6])
    if len(raw) >= 4608:
        print("canciones que compuso con sus palabras: %d (%d ganaron)" % struct.unpack("<2q", raw[4592:4608]))
    if len(raw) >= 4624:
        print("celulas que puso (un engranaje de su cuerpo en un tejido): %d (%d ganaron)" % struct.unpack("<2q", raw[4608:4624]))
    if len(raw) >= 4632:
        print("lo que remaron sus lecturas terminadas (la jaula de una que podria no terminar): %d instrucciones" % struct.unpack("<q", raw[4624:4632]))
    if len(raw) >= 4640:
        print("sus victorias inesperadas (cualquier lectura mejor que la mejor que tenia): %d" % struct.unpack("<q", raw[4632:4640]))
    print("sus instintos: paciencia %d, firmeza %d, lecturas %d; su estante: %016x" % (lee[7] & 255, lee[7] >> 8 & 255, lee[7] >> 16 & 255, lee[6]))
    if len(raw) >= 4464 + 128:
        ft = struct.unpack("<16q", raw[4464:4592])
        print("de que lugar de su cuerpo salio lo leido (leidas/ganaron): " + "  ".join("%d/%d" % (ft[2 * i], ft[2 * i + 1]) for i in range(8)))
    lp = os.path.join(casa, "leido".encode().hex())
    if os.path.exists(lp):
        b = open(lp, "rb").read()
        ent = [struct.unpack("<QQqQQQ", b[i:i + 48]) for i in range(0, len(b) - 47, 48)]
        now = [e for e in ent if e[3] == lee[6] and e[4] == lee[7]]
        print("leyo %d recetas en toda su vida; %d con este estante y estos instintos. Las que mejor leen (bits):" % (len(ent), len(now)))
        for e in sorted(now, key=lambda e: -e[2])[:10]:
            print("  %-34s %8d" % (letters(e[0], e[1]), e[2]))
