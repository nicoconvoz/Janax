"""Self-adjusting segmentation of machine code by two-part MDL (no rule about boundaries).

Usage: python -I segmentar_mdl.py <file.exe> <listing.lst>
Every byte starts as a word; each round merges the most frequent adjacent pair only if total
description length (data + dictionary) goes down, and stops by itself when it does not.
Boundaries are scored against the instruction starts of a FASM listing (see the doc for how
to build it). Nulls: the same method on shuffled bytes (seed 2026), and random boundaries at
the same rate.
"""
import collections, math, random, re, struct, sys
exe, lst = sys.argv[1], sys.argv[2]
b = open(exe, 'rb').read(); pe = struct.unpack_from('<I', b, 0x3C)[0]
n = struct.unpack_from('<H', b, pe + 6)[0]; t = pe + 24 + struct.unpack_from('<H', b, pe + 20)[0]
for i in range(n):
    o = t + 40 * i; vs, va, rs, rp = struct.unpack_from('<IIII', b, o + 8)
    if struct.unpack_from('<I', b, o + 36)[0] & 0x20000000: cod = b[rp:rp + min(rs, vs or rs)]; base = rp
verdad = set()
for l in open(lst, encoding='latin1'):
    m = re.match(r'^([0-9A-F]{8}): ((?:[0-9A-F]{2} )+)', l)
    if m:
        off = int(m.group(1), 16) - base; bs = bytes(int(x, 16) for x in m.group(2).split())
        if 0 <= off < len(cod) and cod[off:off + len(bs)] == bs: verdad.add(off)
def costo(toks):
    N = len(toks); C = collections.Counter(toks)
    datos = -sum(c * math.log2(c / N) for c in C.values())
    dicc = sum(8 * len(w) + math.log2(N) for w in C if len(w) > 1)   # solo las palabras inventadas pagan su entrada
    return datos + dicc
def segmentar(c, etiqueta):
    toks = [bytes([x]) for x in c]; actual = costo(toks); vueltas = 0
    while True:
        pares = collections.Counter(zip(toks, toks[1:]))
        if not pares: break
        (a, bb), fr = pares.most_common(1)[0]
        if fr < 2: break
        nuevo, i = [], 0
        while i < len(toks):
            if i + 1 < len(toks) and toks[i] == a and toks[i + 1] == bb: nuevo.append(a + bb); i += 2
            else: nuevo.append(toks[i]); i += 1
        k = costo(nuevo)
        if k >= actual: break
        toks, actual, vueltas = nuevo, k, vueltas + 1
    pos, bordes = 0, set()
    for w in toks: bordes.add(pos); pos += len(w)
    print('%s: %d vueltas, %d palabras distintas, %d palabras en el chorro, %.4f bits por byte' %
          (etiqueta, vueltas, len(set(toks)), len(toks), actual / len(c)))
    return bordes, toks
def f1(p, v):
    tp = len(p & v); pr = tp / len(p); rc = tp / len(v); return pr, rc, 2 * pr * rc / (pr + rc)
v = verdad
p, toks = segmentar(cod, 'REAL'); pr, rc, f = f1(p, v)
print('   REAL     precision %.3f recall %.3f F1 %.3f' % (pr, rc, f))
print('   palabras mas usadas:', ' | '.join(w.hex(' ') for w, _ in collections.Counter(toks).most_common(12) if len(w) > 1))
bar = bytearray(cod); random.Random(2026).shuffle(bar); p2, _ = segmentar(bytes(bar), 'BARAJADO'); pr, rc, f = f1(p2, v)
print('   BARAJADO precision %.3f recall %.3f F1 %.3f' % (pr, rc, f))
tasa = len(p) / len(cod); rnd = random.Random(7); p3 = {0} | {i for i in range(1, len(cod)) if rnd.random() < tasa}; pr, rc, f = f1(p3, v)
print('   AZAR (misma cantidad de bordes que el real) precision %.3f recall %.3f F1 %.3f' % (pr, rc, f))
