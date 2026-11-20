"""engranajes.py <program.bin> [how many] [--puros]: takes a Janax program apart into its gears (the Capitan,
2026-11-20: "lo importante no es comer el programa antes sino desarticularlo en engranajes que sean legos para que
Luma arme su propio software a medida").

A program eaten whole teaches little, and pieces cut blindly do nothing (measured in v0.59: legos.py azar). A gear is
a piece the program itself repeats: said once and named, it saves bits. That is her own judge (MDL), with nothing set
by hand:

    a piece of L instructions said n times saves   n * (L - 1) - L   instructions
    (each time it is said costs one name instead of L; saying what it is costs L, once)

How a piece is recognised as the same one:
  - only instructions that follow one another: a jump, a call, a return, a request or a halt ends the piece (a gear
    has one way in and one way out, so gears can be put one after another: that is what makes them legos);
  - the registers are named by the order in which the piece uses them (r0, r1, ...): the same work done with other
    registers is the same gear; constants and offsets are part of it.
Pieces of 2 to 8 instructions (criterion: longer ones were not seen repeated enough to pay, and the search is
quadratic in it). The gears are taken greedily, the one that saves most first; an instruction belongs to one gear.

--puros: only gears that touch no memory (registers and constants): the ones a small machine can run anywhere without
being able to break anything (and no division: there is nothing to divide by when a register is 0).
--tabla <file>: also writes those gears as her reader takes them (organo.inc: ORGGT): 80h bytes each, how many
instructions and then each one as a word of the Janax language with its registers named 0, 1, 2... A gear with more
than sixteen registers is left out (her little machine has sixteen). Prints each gear with what it saves, how many
times it is said, and its code."""
import collections, os, struct, sys

NAMES = {0x01: "jldi", 0x02: "jadd", 0x03: "jsub", 0x04: "jmul", 0x05: "jdiv", 0x06: "jshl", 0x07: "jshr", 0x08: "jsar",
         0x09: "jand", 0x0A: "jor", 0x0B: "jxor", 0x0F: "jshi", 0x10: "jld", 0x11: "jst", 0x12: "jldb", 0x13: "jstb",
         0x1A: "jldadd", 0x1B: "jldx"}
THREE = {0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x1B}      # rd, ra, rb
MEMORY = {0x10, 0x11, 0x12, 0x13, 0x1A, 0x1B}
LMIN, LMAX = 2, 8

def fields(w):
    op, rd, ra, imm = w & 255, w >> 8 & 15, w >> 12 & 15, w >> 16
    return op, rd, ra, imm

def canon(words):
    """the piece with its registers named by order of use -> (a key, its text)"""
    names = {}; key = []; text = []
    def r(x):
        if x not in names: names[x] = len(names)
        return names[x]
    for w in words:
        op, rd, ra, imm = fields(w)
        if op in (0x01, 0x0F):
            s = imm - 0x10000 if imm >= 0x8000 and op == 0x01 else imm
            k = (op, r(rd), s); t = "%s r%d, %d" % (NAMES[op], k[1], s)
        elif op in THREE:
            a, b = r(ra), r(imm & 15); k = (op, r(rd), a, b); t = "%s r%d, r%d, r%d" % (NAMES[op], k[1], a, b)
        else:
            a = r(ra); s = imm - 0x10000 if imm >= 0x8000 else imm
            k = (op, r(rd), a, s); t = "%s r%d, r%d, %d" % (NAMES[op], k[1], a, s)
        key.append(k); text.append(t)
    return tuple(key), text

def main():
    argv = list(sys.argv[1:]); table = None
    if "--tabla" in argv:
        i = argv.index("--tabla"); table = argv[i + 1]; del argv[i:i + 2]
    args = [a for a in argv if not a.startswith("--")]; pure = "--puros" in argv or table is not None
    data = open(args[0], "rb").read(); top = int(args[1]) if len(args) > 1 else 12
    words = struct.unpack("<%dI" % (len(data) // 4), data[:len(data) // 4 * 4])
    ok = lambda w: (w & 255) in NAMES and not (pure and ((w & 255) in MEMORY or (w & 255) == 0x05))
    runs = []; start = None
    for i, w in enumerate(words + (0,)):
        if i < len(words) and ok(w):
            if start is None: start = i
        elif start is not None:
            if i - start >= LMIN: runs.append((start, i))
            start = None
    where = collections.defaultdict(list); text = {}
    for a, b in runs:
        for i in range(a, b):
            for L in range(LMIN, min(LMAX, b - i) + 1):
                k, t = canon(words[i:i + L]); where[k].append(i); text[k] = t
    used = bytearray(len(words)); gears = []; total = 0
    def count(k, mark=False):
        n = 0; last = -1; L = len(k)
        for i in where[k]:
            if i > last and not any(used[i:i + L]):
                n += 1; last = i + L - 1
                if mark: used[i:i + L] = b"\x01" * L
        return n
    regs = lambda k: 1 + max(max(x[1:3]) if x[0] in (0x01, 0x0F) else max(x[1:4]) if x[0] in THREE else max(x[1:3]) for x in k)
    cand = {k: len(v) for k, v in where.items() if len(v) >= 2 and not (table and regs(k) > 16)}
    while len(gears) < top and cand:
        best = None
        for k in sorted(cand, key=lambda k: -(cand[k] * (len(k) - 1) - len(k)))[:400]:    # (counts only fall: the true best is among the highest)
            n = count(k); cand[k] = n; s = n * (len(k) - 1) - len(k)
            if n < 2 or s <= 0: del cand[k]; continue
            if best is None or s > best[0]: best = (s, n, k)
        if best is None: break
        s, n, k = best; count(k, mark=True); del cand[k]; gears.append((s, n, k)); total += s
    inside = sum(b - a for a, b in runs)
    if table: sys.stdout = open(os.devnull, "w") if "--callado" in argv else sys.stdout
    print("# %s: %d instrucciones, %d en tramos sin saltos%s" % (args[0].replace("\\", "/").split("/")[-1], len(words), inside, " ni memoria" if pure else ""))
    print("# %d engranajes ahorran %d instrucciones (%.1f %% del programa)" % (len(gears), total, 100.0 * total / len(words)))
    for i, (s, n, k) in enumerate(gears):
        print("engranaje %d: ahorra %d, dicho %d veces, %d instrucciones" % (i + 1, s, n, len(k)))
        for t in text[k]: print("    " + t)

    if table:
        out = bytearray()
        for s_, n, k in gears:
            g = bytearray(128); struct.pack_into("<Q", g, 0, len(k))
            for i, x in enumerate(k):
                op = x[0]
                w = op | x[1] << 8 | ((x[2] & 0xFFFF) << 16 if op in (0x01, 0x0F) else x[2] << 12 | x[3] << 16)
                struct.pack_into("<Q", g, 8 + 8 * i, w)
            out += g
        open(table, "wb").write(out)

if __name__ == "__main__":
    main()
