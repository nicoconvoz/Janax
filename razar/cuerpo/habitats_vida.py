"""habitats_vida.py <casa> [marcha folder]: checks and measures the creatures' habitats in luma.jsm.

  - recomputes every creature's mode from its gait in "vida-memoria" (Gotching's rule on the limbs as luma.jsm reads
    them) and compares it with what luma.jsm wrote ("vida-habitat");
  - with the game's .marcha files (only to score, never used by Luma), the agreement with the mode the game gave, and
    the same for the rule on the raw values (razar/jueces/marcha_regla.py);
  - how readable the bodies are over their stratum: the fraction of each body's cells (her own cloud, "vida-nube-...")
    whose brightness differs from the stratum's by at least 40 of 255 (criterion), against the old flat ground."""
import os, sys, collections, importlib.util

AQUI = os.path.dirname(os.path.abspath(__file__))
casa = sys.argv[1]
marchas = sys.argv[2] if len(sys.argv) > 2 else None
sys.argv = [sys.argv[0], casa, "--desde-cero", "--luma"]
exec(open(os.path.join(AQUI, "repaso_vida.py"), encoding="utf-8").read().replace("\nmain()\n", "\n"))
spec = importlib.util.spec_from_file_location("regla", os.path.join(AQUI, "..", "jueces", "marcha_regla.py"))
regla_mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(regla_mod)
AMPT = [round(2 ** (q / 2)) for q in range(64)]
NAMES = ["Volar", "Caminar", "Reptar"]
STRATA = [(27, 22, 45), (38, 75, 127), (53, 101, 59), (38, 104, 100)]   # gen_vida.STRATA: universe, sky, land, low
OLD = (0x14, 0x22, 0x26)

def limbs_with_feet(text):
    feet = []
    for ln in text.split("\n")[1:]:
        w = ln.split()
        if w and w[0] == "miembro" and w[4] != "quieto":
            feet.append(w[3] == "1")
    return list(zip(parse(text), feet))

def mode(lf):
    sums = {True: 0, False: 0}
    for (p, q, s), f in lf:
        sums[f] += AMPT[q]
    floor = sums[True] > sums[False]
    g = [(p, q, s) for (p, q, s), f in lf if f == floor]
    best = None
    for i in range(len(g)):
        for j in range(len(g)):
            if i == j:
                continue
            pa, pb = g[i][0], g[j][0]
            if 10 * abs(pa - pb) > max(pa, pb):
                continue
            a, b = max(g[i][1], g[j][1]), min(g[i][1], g[j][1])
            if best is None or (a, b) > best[0]:
                best = ((a, b), i, j)
    if best is None:
        return 2
    d = (g[best[1]][2] - g[best[2]][2]) & 15
    if d > 8:
        d = 16 - d
    together = d < 3
    if not floor and together:
        return 0
    if floor and not together:
        return 1
    return 2

def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]

mem = read(casa, "memoria"); n = int(mem[7:13]); at = 44
hab = {}
for ln in open(os.path.join(casa, "vida-habitat".encode().hex()), encoding="utf-8"):
    w = ln.split()
    if len(w) == 2:
        hab[int(w[0], 16)] = int(w[1])
diff = 0; count = collections.Counter(); agree = collections.Counter(); agree_raw = 0; total_game = 0
conf = collections.defaultdict(collections.Counter)
read_new, read_old = [], []
for _ in range(n):
    p = int(mem[at:at + 16], 16); olen = int(mem[at + 63:at + 72])
    text = mem[at + 73:at + 73 + olen].decode("utf-8")
    at += 73 + olen
    m = mode(limbs_with_feet(text))
    count[m] += 1
    if hab.get(p) != m:
        diff += 1
    slug, view = text.split()[1], text.split()[2]
    if marchas:
        f = os.path.join(marchas, "%s-%s.marcha" % (slug, view))
        if not os.path.exists(f):
            f = os.path.join(marchas, "monstruos-%s-%s.marcha" % (slug, view))
        if os.path.exists(f):
            game = open(f, encoding="utf-8").readline().split()[3]
            total_game += 1
            conf[game][NAMES[m]] += 1
            agree[game == NAMES[m]] += 1
            raw = regla_mod.regla([{"pata": l.split()[3] == "1", "p": float(l.split()[5]), "amp": float(l.split()[7]), "fase": float(l.split()[9])}
                                   for l in text.split("\n") if l.startswith("miembro") and "periodo" in l])
            agree_raw += raw == game
    nube = os.path.join(casa, ("vida-nube-%016x" % p).encode().hex())
    if os.path.exists(nube):
        b = open(nube, "rb").read()
        cells = sum(bin(x).count("1") for x in b[28:278])
        cols = [tuple(b[278 + 3 * i:281 + 3 * i]) for i in range(cells)]
        bg = STRATA[1 + m]
        read_new.append(sum(1 for c in cols if abs(lum(c) - lum(bg)) >= 40) / max(1, cells))
        read_old.append(sum(1 for c in cols if abs(lum(c) - lum(OLD)) >= 40) / max(1, cells))
print("creatures %d: flies %d, walks %d, crawls %d; differ from luma.jsm: %d" % (n, count[0], count[1], count[2], diff))
if total_game:
    print("agreement with the game's mode: %d of %d (%.1f %%); the rule on the raw values: %d (%.1f %%)" % (agree[True], total_game, 100 * agree[True] / total_game, agree_raw, 100 * agree_raw / total_game))
    for g in NAMES:
        print("   game %-8s -> %s" % (g, dict(conf[g])))
def med(v):
    v = sorted(v); return v[len(v) // 2] if v else 0
print("readable cells over their stratum: median %.2f (worst %.2f); over the old flat ground: median %.2f (worst %.2f)" % (med(read_new), min(read_new or [0]), med(read_old), min(read_old or [0])))
