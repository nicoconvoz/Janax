"""Learn 'little towers': letter chunks that recur in organs that beat the base, by two-part MDL.

Usage: python -I torrecitas.py <landscape.txt>
Corpus: every organ that beats the no-organ base, repeated round((score-base)/100) times.
Same greedy MDL merging as segmentar_mdl.py; letters cost log2(9) bits in the dictionary; a separator
between organs is never merged. Null: the same scores shuffled among the same organs (seed 2026).
"""
import collections, math, random, re, sys
nota, base = {}, None
for l in open(sys.argv[1], encoding='utf-8', errors='replace'):
    m = re.match(r'organo (\S+) = (-?\d+) \(sin (-?\d+)\)', l)
    if m: nota[m.group(1)] = int(m.group(2)); base = int(m.group(3))
def corpus(n):
    toks = []
    for o, s in sorted(n.items()):
        for _ in range(round((s - base) / 100) if s > base else 0): toks += list(o) + ['|']
    return toks
def costo(toks):
    N = len(toks); C = collections.Counter(toks)
    return -sum(c * math.log2(c / N) for c in C.values()) + sum(len(w) * math.log2(9) + math.log2(N) for w in C if len(w) > 1)
def segmentar(toks):
    actual, aprendidas = costo(toks), []
    while True:
        pares = collections.Counter(p for p in zip(toks, toks[1:]) if '|' not in p)
        if not pares: break
        (a, b), fr = pares.most_common(1)[0]
        if fr < 2: break
        nuevo, i = [], 0
        while i < len(toks):
            if i + 1 < len(toks) and toks[i] == a and toks[i + 1] == b: nuevo.append(a + b); i += 2
            else: nuevo.append(toks[i]); i += 1
        k = costo(nuevo)
        if k >= actual: break
        toks, actual = nuevo, k; aprendidas.append((a + b, fr))
    return aprendidas, toks, actual
print('organos: %d, base %d, le ganan a la base: %d' % (len(nota), base, sum(s > base for s in nota.values())))
for et, n in (('REAL', nota), ('NULO', None)):
    if n is None:
        ks = list(nota); vs = list(nota.values()); random.Random(2026).shuffle(vs); n = dict(zip(ks, vs))
    c = corpus(n); apr, toks, bits = segmentar(c)
    uso = collections.Counter(w for w in toks if len(w) > 1)
    print('%s: corpus %d letras, %d torrecitas, %.0f -> %.0f bits' % (et, len(c), len(apr), costo(c), bits))
    for w, f in uso.most_common(10): print('    %-6s usada %d veces' % (w, f))
top = sorted(nota.items(), key=lambda x: -x[1])[:12]
print('los mejores:', '  '.join('%s=%d' % x for x in top))
