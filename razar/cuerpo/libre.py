"""libre.py <casa>: Luma's own conclusions, as she keeps them in "libre" (gen_luma.py: free_routine).

For each act: how many times she chose it (N), how many it paid (S), her wish for it, (S + 1/2) / (N + 1), and the
chance she draws it now (her wish over the sum of the three). And her breath: the frames her last round took."""
import os, struct, sys

casa = sys.argv[1]
path = os.path.join(casa, "libre".encode().hex())
if not os.path.exists(path) or os.path.getsize(path) < 56:
    print("todavia no eligio nada (no hay 'libre' en %s)" % casa); sys.exit(0)
v = struct.unpack("<7q", open(path, "rb").read(56))
acts = (("descansar", "alguien la busco mientras estaba quieta"),
        ("pensar", "una forma suya gano en esa ronda"),
        ("dar", "a quien se lo dio le sirvio (Razar lo hizo suyo, o una criatura lo tomo)"))
wish = [(v[2 * i + 1] + 0.5) / (v[2 * i] + 1) for i in range(3)]
print("%-10s %8s %8s %8s %8s   %s" % ("acto", "eligio", "pago", "ganas", "chance", "que le paga"))
for i, (name, pays) in enumerate(acts):
    print("%-10s %8d %8d %8.4f %7.1f%%   %s" % (name, v[2 * i], v[2 * i + 1], wish[i], 100 * wish[i] / sum(wish), pays))
print("su respiro: %d cuadros" % v[6])
raw = open(path, "rb").read()
if len(raw) >= 80:
    print("se pinto %d veces (nada se lo paga: es gratis)" % struct.unpack("<q", raw[64:72])[0])
if len(raw) >= 272 + 8 + 16:
    seen = struct.unpack("<q", raw[272:280])[0]
    tab = [struct.unpack("<2q", raw[280 + 16 * i:296 + 16 * i]) for i in range(min(seen + 1, (len(raw) - 280) // 16))]
    given = sum(1 for n, s_ in tab if n > 0); served = sum(1 for n, s_ in tab if s_ > 0)
    print("todo lo que ve: %d (Razar y %d criaturas)" % (len(tab), len(tab) - 1))
    print("  le dio algo a %d; le sirvio a %d; todavia no le dio nada a %d" % (given, served, len(tab) - given))
    print("  a Razar: %d regalos, %d le sirvieron" % tab[0])
if len(raw) >= 4360 + 16:
    n4, s4 = struct.unpack("<2q", raw[4360:4376])
    print("durmio %d veces; %d desperto con algo nuevo (ganas %.4f)" % (n4, s4, (s4 + 0.5) / (n4 + 1)))
