"""repaso_vida.py <casa> [--desde-cero] [--luma]: an independent check of what vida.jsm did, written apart from it.

It reads the list of the run's folder, parses every .oido the same way the program says it does (the decimals as
integers in 1e-5, half-octave amplitude codes, sixteenths of a turn relative to the widest limb), builds each
creature's first model (greedy, from its own limbs), and replays the archive line by line: every verdict's DL (now and
with the piece) must be what this model computes, every piece must be one the teacher's body showed, and every kept
piece must be the shortest of its touch. At the end the models must be the ones in "aprendido".
Reads private files at run time only; it carries no data."""
import sys, os

def label(s):
    return s.encode().hex()

PFX = "vida-" if "--luma" in sys.argv else ""   # inside luma.jsm the creatures' files are "vida-..."

def read(casa, name):
    p = os.path.join(casa, label(PFX + name))
    return open(p, "rb").read() if os.path.exists(p) else b""

TH = [__import__("math").ceil(2 ** ((q + 0.5) / 2)) for q in range(64)]
QMAX = 63
TWO_PI_E5 = 628319

def dec(tok):
    """the decimal as the program reads it: x 1e5, five decimals, the rest skipped"""
    neg = tok.startswith("-")
    t = tok[1:] if neg else tok
    ip, _, fp = t.partition(".")
    v = int(ip or "0")
    fp = (fp + "00000")[:5]
    v = v * 100000 + int(fp)
    return -v if neg else v

def parse(text):
    raw = []
    for ln in text.split("\n")[1:]:
        w = ln.split()
        if not w or w[0] == "pares":
            if w and w[0] == "pares":
                break
            continue
        if w[0] != "miembro" or w[4] == "quieto":
            continue
        p, a, f = dec(w[5]), dec(w[7]), dec(w[9])
        raw.append(((p + 50) // 100, max(a, 1), (16 * f + TWO_PI_E5 // 2 + TWO_PI_E5 * 16) // TWO_PI_E5 % 16))
    ref, best = 0, 0
    for p, a, s in raw:
        if a > best:
            best, ref = a, s
    out = []
    for p, a, s in raw:
        q = 0
        while q < QMAX and a >= TH[q]:
            q += 1
        out.append((p, q, (s - ref) % 16))
    return out

def bl(n): return n.bit_length()
def gam(n): return 2 * bl(n + 1) - 1
def zz(d): return 2 * d if d >= 0 else -2 * d - 1
def mcost(m): return gam(m[0]) + gam(m[1]) + 4
def dist(l, m):
    ds = (l[2] - m[2]) & 15
    if ds >= 8:
        ds -= 16
    return gam(zz(l[0] - m[0])) + gam(zz(l[1] - m[1])) + gam(zz(ds))
def DL(M, Ls):
    K = len(M)
    c = gam(K) + sum(mcost(m) for m in M)
    for l in Ls:
        b = mcost(l)
        for m in M:
            b = min(b, dist(l, m))
        c += bl(K) + b
    return c
def own(Ls):
    M = []
    while True:
        base, pick = DL(M, Ls), None
        for l in Ls:
            if l in M:
                continue
            d = DL(M + [l], Ls)
            if d < base:
                base, pick = d, l
        if pick is None:
            return M
        M.append(pick)
def eff(M, Ls):
    out = []
    for l in Ls:
        b, e = mcost(l), l
        for m in M:
            d = dist(l, m)
            if d < b:
                b, e = d, m
        if e not in out:
            out.append(e)
    return out
def tryp(M, Ls, p):
    best, bm, rep = None, None, None
    if len(M) < len(Ls):
        d = DL(M + [p], Ls)
        best, bm, rep = d, M + [p], -1
    for r in range(len(M)):
        M2 = M[:r] + [p] + M[r + 1:]
        d = DL(M2, Ls)
        if best is None or d < best:
            best, bm, rep = d, M2, r
    return best, bm, rep

def fnv(s):
    h = 0xCBF29CE484222325
    for b in s.encode():
        h = ((h ^ b) * 0x100000001B3) & ((1 << 64) - 1)
    return h | 1

def main():
    casa = sys.argv[1]
    C = {}
    mem = read(casa, "memoria")
    if mem:
        # a self-contained casa: the gaits are in her own record, nothing is read from the host
        n = int(mem[7:13]); at = 44
        for _ in range(n):
            p = int(mem[at:at + 16], 16); olen = int(mem[at + 63:at + 72])
            Ls = parse(mem[at + 73:at + 73 + olen].decode("utf-8"))
            C[p] = {"name": "%016x" % p, "L": Ls, "M": own(Ls)}
            at += 73 + olen
    else:
        lista = read(casa, "lista").decode()
        for ln in lista.split("\n")[1:]:
            if not ln.strip():
                continue
            nube, oido = ln[20:].split("\t")
            Ls = parse(open(oido, encoding="utf-8").read())
            C[fnv(nube)] = {"name": os.path.basename(nube), "L": Ls, "M": own(Ls)}
    for c in C.values():
        c["E0"] = eff(c["M"], c["L"])
    if "--desde-cero" not in sys.argv:
        print("(the models start as the greedy ones: run it on a folder whose first run is this archive)")
    arch = read(casa, "archivo").decode()
    lines = [x for x in arch.split("\n") if x.strip()]
    bad = kept = other = relayed = 0
    shown = {}
    counts = {}
    for x in lines:
        w = x.split()
        pupil, teacher = C[int(w[1], 16)], C[int(w[2], 16)]
        piece = (int(w[3]), int(w[4]), int(w[5]))
        verdict, now, with_ = w[6], int(w[7]), int(w[8])
        counts[verdict] = counts.get(verdict, 0) + 1
        dl_now = DL(pupil["M"], pupil["L"])
        if dl_now != now:
            bad += 1; print("DL now differs", x, dl_now)
        if verdict == "replaced":
            if piece not in pupil["M"]:
                bad += 1; print("replaced motif not in the model", x)
            continue
        if verdict in ("dreamt", "unfit"):
            # a piece rebuilt from a melody: nobody's body showed it; it must be judged the same
            d, M2, rep = tryp(pupil["M"], pupil["L"], piece)
            if d != with_:
                bad += 1; print("DL with the dreamt piece differs", x, d)
            if verdict == "dreamt":
                if not d < now:
                    bad += 1; print("dreamt piece kept without shortening", x)
                pupil["M"] = M2; kept += 1
            elif d < now:
                bad += 1; print("unfit piece would shorten", x)
            continue
        if piece not in eff(teacher["M"], teacher["L"]):
            bad += 1; print("the teacher's body does not show that piece", x)
        d, M2, rep = tryp(pupil["M"], pupil["L"], piece)
        if d != with_:
            bad += 1; print("DL with the piece differs", x, d)
        if verdict == "kept":
            if piece not in teacher["E0"]:
                relayed += 1
            k = len([q for q in eff(teacher["M"], teacher["L"]) if q not in pupil["M"]])
            shown[k] = shown.get(k, 0) + 1
            if not d < now:
                bad += 1; print("kept without shortening", x)
            pupil["M"] = M2; kept += 1
        else:
            other += 1
            if (verdict == "longer") != (d >= now):
                bad += 1; print("wrong verdict", x, d, now)
    learned = read(casa, "aprendido").decode().split("\n")
    nlearn = int(learned[0].split()[1]) if learned and learned[0].startswith("aprendido1") else 0
    seen = 0
    for ln in learned[1:1 + nlearn]:
        w = ln.split()
        k = int(w[1])
        M = [(int(w[2 + 3 * i]), int(w[3 + 3 * i]), int(w[4 + 3 * i])) for i in range(k)]
        c = C.get(int(w[0], 16))
        seen += 1
        if c is None or c["M"] != M:
            bad += 1; print("learned model differs", ln, c and c["M"])
    print("creatures", len(C), "archive lines", len(lines), counts, "learned lines", seen, "mismatches", bad)
    print("kept pieces the teacher did not show at birth (learned from another):", relayed)
    print("pieces new to the pupil that the teacher's body showed, per kept touch:", sorted(shown.items()))

main()
