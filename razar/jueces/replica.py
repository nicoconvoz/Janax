"""replica.py <imaginado> <libro_fuente> <validador_1> <validador_2>: an outside judge. Does a mechanism that beats its
own "without" in one book beat it in another one too? Each atom's score against its 'a' votes, in each validator
apart (its own confirmed / said otherwise there): the atoms clearly up in the first (z > 3), and what they do in the
second. If it was the mechanism, it repeats; if it was chance, the second is a coin."""
import collections, math, re, sys
imf, src, v1, v2 = sys.argv[1:5]; tok = re.compile(r'[^\W\d_]+')
srcw = [tok.findall(l[3:].lower()) for l in open(src, encoding='utf-8', errors='replace')]
V = []
for l in open(imf, encoding='utf-8', errors='replace'):
    p = l.rstrip('\n').split(' | ', 1)
    if len(p) != 2 or ' # ' not in p[1]: continue
    t, m = p[1].split(' # ', 1); k = p[0].split(); w = tok.findall(t.lower())
    if len(k) < 5 or len(w) < 3 or len(w) > 5: continue
    V.append((k[4], m.split(' ', 1)[1] if ' ' in m else m, w[0], tuple(w[1:-1]), w[-1]))
need = {(z, r) for _, _, z, r, _ in V}
def index(lines):
    said = collections.defaultdict(set)
    for w in lines:
        for i in range(len(w)):
            for n in (1, 2, 3):
                j = i + n + 1
                if j >= len(w): break
                key = (w[i], tuple(w[i + 1:j]))
                if key in need: said[key].add(w[j])
    return said
S0 = index(srcw); A = index(tok.findall(l.lower()) for l in open(v1, encoding='utf-8', errors='replace'))
B = index(tok.findall(l.lower()) for l in open(v2, encoding='utf-8', errors='replace'))
T = {n: collections.defaultdict(lambda: [0, 0, 0, 0]) for n in 'AB'}
for kind, mech, z, r, b in V:
    if b in S0.get((z, r), ()): continue
    for n, s in (('A', A), ('B', B)):
        x = s.get((z, r))
        if not x: continue
        off = 0 if kind == 'i' else 2
        T[n][mech][off] += b in x; T[n][mech][off + 1] += b not in x
def zz(t):
    n1, n2 = t[0] + t[1], t[2] + t[3]
    if n1 < 20 or n2 < 20: return None
    pp = (t[0] + t[2]) / (n1 + n2); se = math.sqrt(pp * (1 - pp) * (1 / n1 + 1 / n2)) or 1
    return (t[0] / n1 - t[2] / n2) / se
both = [(zz(T['A'][m]), zz(T['B'][m]), m) for m in T['A'] if zz(T['A'][m]) is not None and zz(T['B'][m]) is not None]
up = [x for x in both if x[0] > 3]; dn = [x for x in both if x[0] < -3]
print('mecanismos medidos en los dos: %d' % len(both))
print('arriba claro en el primero: %d; en el segundo arriba %d, abajo %d, z mediano %.1f' % (len(up), sum(1 for a, b, m in up if b > 0), sum(1 for a, b, m in up if b < 0), sorted(b for a, b, m in up)[len(up) // 2] if up else 0))
print('abajo claro en el primero: %d; en el segundo abajo %d, arriba %d' % (len(dn), sum(1 for a, b, m in dn if b < 0), sum(1 for a, b, m in dn if b > 0)))
ab = [(a + b, a, b, m) for a, b, m in both if a > 3 and b > 3]; ab.sort(reverse=True)
print('arriba claro en LOS DOS (z > 3 y z > 3): %d | %s' % (len(ab), ', '.join('%s (%.1f, %.1f)' % (m, a, b) for s, a, b, m in ab[:15])))
n = len(both); ma = sum(a for a, b, m in both) / n; mb = sum(b for a, b, m in both) / n
cv = sum((a - ma) * (b - mb) for a, b, m in both); va = math.sqrt(sum((a - ma) ** 2 for a, b, m in both) * sum((b - mb) ** 2 for a, b, m in both))
print('correlacion entre los dos libros: %.2f' % (cv / va))
