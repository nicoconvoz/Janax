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
        ("dar", "Razar hizo suyo el regalo"))
wish = [(v[2 * i + 1] + 0.5) / (v[2 * i] + 1) for i in range(3)]
print("%-10s %8s %8s %8s %8s   %s" % ("acto", "eligio", "pago", "ganas", "chance", "que le paga"))
for i, (name, pays) in enumerate(acts):
    print("%-10s %8d %8d %8.4f %7.1f%%   %s" % (name, v[2 * i], v[2 * i + 1], wish[i], 100 * wish[i] / sum(wish), pays))
print("su respiro: %d cuadros" % v[6])
