"""puntaje_mec.py <imaginado> <libro_fuente> <validador>...: an outside judge, never shown to Razar. The score of
each mechanism by itself (Capitan: "only refutation silences it, and only there"; "from the atom to the planet"):
every imagined "z <relation> b # <key> <instruction>" the source book does not say, looked for in other texts,
confirmed / said otherwise (the text says "z <relation> X", other X's, never b) / waiting. At each level of the tree:
the atom (the instruction), the molecule (the instruction on its relation), the planet (all). Each with its own
"without the mechanism" (its 'a' votes: the same pieces, b from another pair) beside it. Score = confirmed /
(confirmed + said otherwise); shown with how many were decided, so a score of two votes is not read as one of a
thousand."""
import collections, re, sys
imf, src = sys.argv[1:3]; vals = sys.argv[3:]; tok = re.compile(r'[^\W\d_]+')
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
src_said = index(srcw)
vs = [index(tok.findall(l.lower()) for l in open(f, encoding='utf-8', errors='replace')) for f in vals]
L = {'atomo': collections.defaultdict(lambda: [0] * 6), 'molecula': collections.defaultdict(lambda: [0] * 6),
     'planeta': collections.defaultdict(lambda: [0] * 6)}
EJ = collections.defaultdict(list)
for kind, mech, z, r, b in V:
    if b in src_said.get((z, r), ()): continue
    c = any(b in s.get((z, r), ()) for s in vs); o = not c and any(s.get((z, r)) for s in vs)
    off = 0 if kind == 'i' else 3
    for lvl, key in (('atomo', mech), ('molecula', mech + ' sobre ' + ' '.join(r)), ('planeta', 'todo')):
        t = L[lvl][key]; t[off] += c; t[off + 1] += o; t[off + 2] += not c and not o
    if c and kind == 'i' and len(EJ[mech]) < 6: EJ[mech].append('%s %s %s' % (z, ' '.join(r), b))
def sc(c, o): return (100 * c / (c + o)) if c + o else float('nan')
for lvl in ('planeta', 'atomo', 'molecula'):
    rows = [(k, t) for k, t in L[lvl].items() if t[0] + t[1] >= 20]
    rows.sort(key=lambda x: -(sc(x[1][0], x[1][1]) - sc(x[1][3], x[1][4])))
    print('== %s (%d con 20 decididos o mas, de %d)' % (lvl, len(rows), len(L[lvl])))
    print('mecanismo\tcon: conf/decididos\tpuntaje\tsin: conf/decididos\tpuntaje\ten_espera')
    show = rows if lvl == 'planeta' else rows[:12] + [('...', None)] + rows[-5:]
    for k, t in show:
        if t is None: print('...'); continue
        print('%s\t%d/%d\t%.1f%%\t%d/%d\t%.1f%%\t%d\t%s' % (k[:40], t[0], t[0] + t[1], sc(t[0], t[1]), t[3], t[3] + t[4],
              sc(t[3], t[4]), t[2], ' / '.join(EJ.get(k, [])[:4]) if lvl == 'atomo' else ''))
# how many mechanisms beat their own "without" clearly, and how many lose clearly (if both tails are alike, the tops
# are what so many comparisons give by chance): two proportions, |z| > 3
import math
for lvl in ('atomo', 'molecula'):
    up = dn = 0; tops = []
    for k, t in L[lvl].items():
        n1, n2 = t[0] + t[1], t[3] + t[4]
        if n1 < 20 or n2 < 20: continue
        p1, p2 = t[0] / n1, t[3] / n2; pp = (t[0] + t[3]) / (n1 + n2)
        se = math.sqrt(pp * (1 - pp) * (1 / n1 + 1 / n2)) or 1
        z = (p1 - p2) / se
        if z > 3: up += 1; tops.append((z, k))
        if z < -3: dn += 1
    tops.sort(reverse=True)
    print('%s: le ganan claro a su sin-mecanismo %d, pierden claro %d | %s' % (lvl, up, dn, ', '.join('%s (z %.1f)' % (k, z) for z, k in tops[:10])))
