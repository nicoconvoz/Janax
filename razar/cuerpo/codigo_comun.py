"""codigo_comun.py <casa>: the common code of Luma's creatures, learned from everything Razar learned, by the judge of
the little towers (razar/jueces/torrecitas.py): merge the most frequent neighbouring pair while the description length
of the whole corpus goes down. Pre-registered in documentacion/razar/datos/vida-codigo-preregistro.txt.

One alphabet, the characters; each source as the text it is (no invented translation):
  OIDO   what the bat heard: every piece of every gait in the casa's "vida-memoria", written "PPPP QQ SS";
  VISTA  what she saw eating: every recipe in "comidas" (letters 1-9) and its colours (rrggbb);
  LIBRO  what it read in the New Testament: its organs that beat the base, repeated by how much (the towers' corpus),
         and the towers;
  CODIGO what it read in GEM's and Godot's code: the opposites, as words.
A separator between two items is never merged. Every single character stays in the code, so anything can be said.
Writes into the casa "vida-codigo" (the bricks luma.jsm reads) and "vida-codigo-fuentes" (each brick, its uses per
source in the learned corpus), and prints the summary."""
import collections, math, os, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
PROYECTO = os.path.normpath(os.path.join(AQUI, "..", ".."))
_explorar = "--explorar" in sys.argv
# the fifth source (documentacion/razar/datos/libro-ayudante-preregistro.txt): the book the helper wrote for Luma,
# razar/libro/*.txt, a line per item; --libro-barajado: the same lines, each one's letters shuffled (seed 2026)
_libro = "--libro" in sys.argv or "--libro-barajado" in sys.argv
_barajado = "--libro-barajado" in sys.argv
# the sixth source (documentacion/razar/datos/corazon-preregistro.txt): her heart, the Capitan's diary
# (razar/corazon/diario.txt); --corazon-barajado: the same lines, each one's letters shuffled (seed 2026)
_corazon = "--corazon" in sys.argv or "--corazon-barajado" in sys.argv
_cbarajado = "--corazon-barajado" in sys.argv
sys.argv, casa = [sys.argv[0], sys.argv[1], "--desde-cero", "--luma"], sys.argv[1]
_src = open(os.path.join(AQUI, "repaso_vida.py"), encoding="utf-8").read().replace("\nmain()\n", "\n")
exec(_src)                       # parse(): the gait read exactly as luma.jsm reads it
BMAX = 16                        # a brick's storage: 16 characters (criterion: the longest piece text is 10)
SOURCES = ["OIDO", "VISTA", "LIBRO", "CODIGO", "AYUDANTE", "CORAZON"]

def piece_text(p):
    return "%04d %02d %02d" % p

def corpus():
    items = []
    mem = read(casa, "memoria")
    n, at = int(mem[7:13]), 44
    for _ in range(n):
        olen = int(mem[at + 63:at + 72])
        for p in parse(mem[at + 73:at + 73 + olen].decode("utf-8")):
            items.append(("OIDO", piece_text(p)))
        at += 73 + olen
    comidas = os.path.join(casa, "comidas".encode().hex())     # a file of the forms' side: no "vida-" prefix
    for ln in (open(comidas, "rb").read().decode() if os.path.exists(comidas) else "").split("\n"):
        if len(ln) < 81 or ln[76] == "-":
            continue
        rec = ln[22:53].rstrip(".")
        if rec:
            items.append(("VISTA", rec))
        for i in range(int(ln[78:80])):
            items.append(("VISTA", ln[81 + 7 * i:81 + 7 * i + 6]))
    towers, opp, organs_path = [], [], None
    for line in open(os.path.join(AQUI, "aprendido.txt"), encoding="utf-8"):
        w = line.split()
        if not w or w[0].startswith("#"):
            continue
        if w[0] == "organos":
            organs_path = os.path.join(PROYECTO, w[1])
        elif w[0] == "torrecita":
            towers.append(w[1])
        elif w[0] == "opuesto":
            opp += [w[1], w[2]]
    nota, base = {}, None
    for l in open(organs_path, encoding="utf-8", errors="replace"):
        m = re.match(r"organo (\S+) = (-?\d+) \(sin (-?\d+)\)", l)
        if m:
            nota[m.group(1)] = int(m.group(2)); base = int(m.group(3))
    for o, sc in sorted(nota.items()):
        for _ in range(round((sc - base) / 100) if sc > base else 0):
            items.append(("LIBRO", o))
    for t in towers:
        items.append(("LIBRO", t))
    for w in opp:
        items.append(("CODIGO", w))
    if _libro:
        import glob, random
        rnd = random.Random(2026)
        for f in sorted(glob.glob(os.path.join(PROYECTO, "razar", "libro", "*.txt"))):
            for ln in open(f, encoding="ascii").read().splitlines():
                ln = ln.strip()
                if not ln:
                    continue
                if _barajado:
                    cs = list(ln); rnd.shuffle(cs); ln = "".join(cs)
                items.append(("AYUDANTE", ln))
    if _corazon:
        import random
        rnd = random.Random(2026)
        for ln in open(os.path.join(PROYECTO, "razar", "corazon", "diario.txt"), encoding="ascii").read().splitlines():
            ln = ln.strip()
            if not ln:
                continue
            if _cbarajado:
                cs = list(ln); rnd.shuffle(cs); ln = "".join(cs)
            items.append(("CORAZON", ln))
    return items

def cost(seqs, alpha):
    toks = [t for s in seqs for t in s] + ["|"] * len(seqs)
    N = len(toks); C = collections.Counter(toks)
    return -sum(c * math.log2(c / N) for c in C.values()) + sum(len(w) * math.log2(alpha) + math.log2(N) for w in C if len(w) > 1)

def f2(c):
    return c * math.log2(c) if c > 0 else 0.0

class Book:
    """the corpus' counts, so a merge's description length is computed from the counts (the same cost() as above,
    fast enough for the diary's half a million letters)"""
    def __init__(self, seqs, alpha):
        self.seqs, self.lalpha = seqs, math.log2(alpha)
        self.C = collections.Counter(t for s in seqs for t in s); self.C["|"] += len(seqs)
        self.N = sum(self.C.values())
        self.S = sum(f2(c) for c in self.C.values())
        self.D = sum(len(w) * self.lalpha for w in self.C if len(w) > 1)
        self.nW = sum(1 for w in self.C if len(w) > 1)
    def cost(self, N=None, S=None, D=None, nW=None):
        N = self.N if N is None else N; S = self.S if S is None else S
        D = self.D if D is None else D; nW = self.nW if nW is None else nW
        return N * math.log2(N) - S + D + nW * math.log2(N)
    def merges(self, a, b):
        if a != b:
            return None
        m = 0
        for s in self.seqs:
            i = 0
            while i + 1 < len(s):
                if s[i] == a and s[i + 1] == b:
                    m += 1; i += 2
                else:
                    i += 1
        return m
    def try_cost(self, a, b, fr):
        m = self.merges(a, b)
        m = fr if m is None else m
        C, ab = self.C, a + b
        S, D, nW = self.S, self.D, self.nW
        ch = collections.Counter()
        ch[a] -= m; ch[b] -= m; ch[ab] += m
        for w, d in ch.items():
            old, new = C.get(w, 0), C.get(w, 0) + d
            S += f2(new) - f2(old)
            if len(w) > 1:
                if old == 0 and new > 0:
                    D += len(w) * self.lalpha; nW += 1
                elif old > 0 and new == 0:
                    D -= len(w) * self.lalpha; nW -= 1
        return self.cost(self.N - m, S, D, nW)
    def apply(self, a, b):
        new = []
        for s in self.seqs:
            out, i = [], 0
            while i < len(s):
                if i + 1 < len(s) and s[i] == a and s[i + 1] == b:
                    out.append(a + b); i += 2
                else:
                    out.append(s[i]); i += 1
            new.append(out)
        self.__init__(new, 2 ** self.lalpha)

def pairs_of(seqs):
    return collections.Counter(p for s in seqs for p in zip(s, s[1:]) if len(p[0]) + len(p[1]) <= BMAX)

def learn(items):
    seqs = [list(t) for _, t in items]
    alpha = len({c for s in seqs for c in s})
    bk = Book(seqs, alpha); now, learned = bk.cost(), []
    while True:
        pairs = pairs_of(bk.seqs)
        if not pairs:
            break
        (a, b), fr = pairs.most_common(1)[0]
        if fr < 2:
            break
        k = bk.try_cost(a, b, fr)
        if k >= now:
            break
        bk.apply(a, b); now = bk.cost(); learned.append(a + b)
    return learned, bk.seqs, alpha, now

def explore(items):
    """the same judge with a wider search (the pair whose merge shortens the description most, among the 40 most
    frequent, up to 120 bricks); Luma does not use it"""
    seqs = [list(t) for _, t in items]
    alpha = len({c for s in seqs for c in s})
    bk = Book(seqs, alpha); now, learned = bk.cost(), []
    while len(learned) < 120:
        best = None
        for (a, b), fr in pairs_of(bk.seqs).most_common(40):
            if fr < 2:
                break
            k = bk.try_cost(a, b, fr)
            if k < now and (best is None or k < best[0]):
                best = (k, a, b)
        if best is None:
            break
        bk.apply(best[1], best[2]); now = bk.cost(); learned.append(best[1] + best[2])
    seqs = bk.seqs
    uses = collections.defaultdict(collections.Counter)
    for (src, _), s in zip(items, seqs):
        for t in s:
            if len(t) > 1:
                uses[t][src] += 1
    print("exploratory (not used by Luma): %d bricks by best gain" % len(learned))
    conv = [b for b in learned if sum(1 for x in SOURCES if uses[b][x]) >= 2]
    print("  used by two sources or more: %d; of them with the helper's book and another source: %d  %s" % (
        len(conv), sum(1 for b in conv if uses[b]["AYUDANTE"]), [b for b in conv if uses[b]["AYUDANTE"]][:12]))
    print("  learned from the book (used by it): %d" % sum(1 for b in learned if uses[b]["AYUDANTE"]))
    print("  learned from the heart (used by it): %d" % sum(1 for b in learned if uses[b]["CORAZON"]))
    hb = [b for b in learned if uses[b]["CORAZON"] and uses[b]["AYUDANTE"]]
    ho = [b for b in learned if uses[b]["CORAZON"] and any(uses[b][x] for x in ("OIDO", "VISTA", "LIBRO", "CODIGO"))]
    print("  heart and book: %d %s" % (len(hb), hb[:15]))
    print("  heart and OIDO/VISTA/LIBRO/CODIGO: %d %s" % (len(ho), ho[:15]))
    for b in learned:
        print("   %-14r %s" % (b, " ".join("%s=%d" % (s, uses[b][s]) for s in SOURCES if uses[b][s])))

def main():
    items = corpus()
    learned, seqs, alpha, bits = learn(items)
    chars = sorted({c for _, t in items for c in t})
    code = chars + learned
    uses = {b: collections.Counter() for b in code}
    for (src, _), s in zip(items, seqs):
        for t in s:
            uses[t][src] += 1
    byte = lambda s: s.encode("latin-1")
    body = b"".join(b"%02d %s\n" % (len(b), byte(b).ljust(16, b"~")) for b in code)
    open(os.path.join(casa, "vida-codigo".encode().hex()), "wb").write(b"codigo1 %06d\n" % len(code) + body)
    with open(os.path.join(casa, "vida-codigo-fuentes".encode().hex()), "w", encoding="utf-8") as f:
        f.write("codigo comun: %d ladrillos (%d caracteres + %d aprendidos), corpus %.0f bits al final\n" % (len(code), len(chars), len(learned), bits))
        for b in code:
            f.write("%-18r %s\n" % (b, " ".join("%s=%d" % (s, uses[b][s]) for s in SOURCES)))
    per = collections.Counter(src for src, _ in items)
    print("items per source:", dict(per))
    print("code: %d single characters + %d learned bricks" % (len(chars), len(learned)))
    for src in SOURCES:
        own = [b for b in learned if uses[b][src] > 0]
        print("  learned bricks used by %-6s: %d" % (src, len(own)))
    shared = [b for b in learned if sum(1 for s in SOURCES if uses[b][s]) >= 2]
    print("  learned bricks used by two sources or more: %d  e.g. %s" % (len(shared), shared[:10]))
    if _explorar:
        explore(items)

main()
