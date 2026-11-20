"""digiere.py <luma.bin> <code text>: the instrument that checks how she digests foreign code (gen_leer.py: r_gears).

The Capitan (2026-11-20): "que lo haga como hace siempre, que los saque por contexto y por el lugar que ocupan";
"dale de comer kolibrios y que LUMA entienda los mecanismos y se autocompile, no como una copia sino como alimento".

Nobody tells her what a foreign word does. She knows what her own instructions do, and where each one stands: with
which constants it is said (a jldi's own; for the others, the constant a jldi just before hands them). In the text,
a line "WORD name , number" puts WORD in the place of that number. A foreign word is taken as the instruction of
hers whose places it shares most (the part of each one's uses that falls in the same constants: the sum, over the
constants, of the smaller of the two shares). Then every line "WORD name , number" or "WORD name , name" whose word
she placed is said in her language, its names as registers; any other line ends the piece (an empty line or a
comment is passed over). What comes out is not KolibriOS: it is what she understood of it, and it goes with her own
code to be taken apart into gears by the one rule.

Prints her dictionary and how many instructions she made of the text; --palabras writes them (32-bit words, a 0
between pieces) to compare with hers."""
import collections, re, struct, sys

OPS = [0x01, 0x02, 0x03, 0x04, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B]
NAMES = {0x01: "jldi", 0x02: "jadd", 0x03: "jsub", 0x04: "jmul", 0x06: "jshl", 0x07: "jshr", 0x08: "jsar", 0x09: "jand", 0x0A: "jor", 0x0B: "jxor"}

def is_name_start(c): return c in b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_"
def is_name(c): return is_name_start(c) or c in b"0123456789"

def parse(line):
    """a line (bytes, no end of line) -> None (it says nothing), False (it ends the piece), or (word, name, number or
    None, second name or None)"""
    i = 0; n = len(line)
    def ws():
        nonlocal i
        while i < n and line[i] in b" \t\r": i += 1
    def name():
        nonlocal i
        a = i
        if i < n and is_name_start(line[i]):
            while i < n and is_name(line[i]): i += 1
        return line[a:i]
    ws()
    if i == n or line[i] in b";": return None
    w = name()
    if not w or i == n or line[i] not in b" \t": return False
    ws(); a = name()
    if not a: return False
    ws()
    if i == n or line[i] != ord(","): return False
    i += 1; ws()
    num = None; b = None
    if i < n and (line[i] in b"0123456789" or (line[i] == ord("-") and i + 1 < n and line[i + 1] in b"0123456789")):
        neg = line[i] == ord("-"); i += neg; a0 = i
        while i < n and (line[i] in b"0123456789abcdefABCDEFxXhH"): i += 1
        t = line[a0:i].lower()
        try:
            if t.startswith(b"0x"): v = int(t[2:], 16)
            elif t.endswith(b"h"): v = int(t[:-1], 16)
            else: v = int(t, 10)
        except ValueError:
            return False
        v = -v if neg else v
        if not -0x8000 <= v < 0x8000: return False
        num = v
    else:
        b = name()
        if not b: return False
    ws()
    if i < n and line[i] not in b";": return False
    return (w, a, num, b)

def hers(words):
    H = collections.defaultdict(collections.Counter)
    prev = 0
    for w in words:
        op = w & 255
        if op == 1:
            c = w >> 16; H[1][c - 0x10000 if c >= 0x8000 else c] += 1
        elif op in OPS and prev & 255 == 1 and (prev >> 8 & 15) == (w >> 16 & 15):
            c = prev >> 16; H[op][c - 0x10000 if c >= 0x8000 else c] += 1
        prev = w
    return H

def dictionary(H, lines):
    F = collections.defaultdict(collections.Counter)
    for l in lines:
        p = parse(l)
        if p and p[2] is not None: F[p[0]][p[2]] += 1
    d = {}
    for w, f in F.items():
        nw = sum(f.values()); best = None
        for op in OPS:
            nj = sum(H[op].values())
            if not nj: continue
            s = sum(min((H[op][c] << 20) // nj, (k << 20) // nw) for c, k in f.items())      # (20 bits of fraction, as hers)
            if s > 0 and (best is None or s > best[0]): best = (s, op)
        if best: d[w] = best[1]
    return d, F

def digest(d, lines):
    out = []; names = {}; run = False
    def reg(x):
        if x not in names: names[x] = len(names)
        return names[x]
    def end():
        nonlocal run
        if run: out.append(0)
        names.clear(); run = False
    for n, l in enumerate(lines):
        p = parse(l)
        if p is None: continue
        if p is False or p[0] not in d: end(); continue
        w, a, num, b = p; op = d[w]; ins = []
        if num is not None:
            if op == 1: need = [a]
            else: need = [a, ("t", n)]
        else:
            if op == 1: end(); continue
            need = [a, b]
        if len(set(names) | set(need)) > 16: end()
        if num is not None:
            if op == 1: ins = [1 | reg(a) << 8 | (num & 0xFFFF) << 16]
            else:
                ra = reg(a); t = reg(("t", n)); ins = [1 | t << 8 | (num & 0xFFFF) << 16, op | ra << 8 | ra << 12 | t << 16]
        else:
            ra = reg(a); rb = reg(b); ins = [op | ra << 8 | ra << 12 | rb << 16]
        out.extend(ins); run = True
    end()
    return out

def main():
    data = open(sys.argv[1], "rb").read(); words = struct.unpack("<%dI" % (len(data) // 4), data[:len(data) // 4 * 4])
    lines = open(sys.argv[2], "rb").read().split(b"\n")
    H = hers(words); d, F = dictionary(H, lines); out = digest(d, lines)
    print("palabras ajenas que puso en un lugar suyo: %d" % len(d))
    for w, f in sorted(F.items(), key=lambda kv: -sum(kv[1].values()))[:24]:
        if w in d: print("  %-10s %6d veces -> %s" % (w.decode("latin-1"), sum(f.values()), NAMES[d[w]]))
    print("instrucciones que hizo del texto: %d (en %d piezas)" % (sum(1 for x in out if x), sum(1 for x in out if not x)))
    if "--palabras" in sys.argv:
        open(sys.argv[sys.argv.index("--palabras") + 1], "wb").write(struct.pack("<%dI" % len(out), *out))

if __name__ == "__main__":
    main()
