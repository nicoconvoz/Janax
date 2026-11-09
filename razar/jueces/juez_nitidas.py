"""juez_nitidas.py <nitidas> <mats_es>: an outside judge, never shown to Razar. Razar's own sharpness ("nitidas": two
words and the places they share, by piece, summed): a MATS pair counts when its real pair is sharper than its chance
pair (the answer of the next pair of the same relation), ties apart; and how many pairs Razar has at all."""
import collections, os, sys
K = collections.Counter()
for l in open(sys.argv[1], encoding='utf-8', errors='replace'):
    f = l.split()
    if len(f) == 3: K[tuple(sorted(f[:2]))] += int(f[2])
    elif len(f) == 4: K[tuple(sorted(f[2:]))] += int(f[1])
def k(a, b): return K.get(tuple(sorted((a, b))), 0)
mats = sys.argv[2]; T = collections.defaultdict(lambda: [0, 0, 0]); ex = collections.defaultdict(list)
for fam in sorted(os.listdir(mats)):
    for rel in sorted(os.listdir(os.path.join(mats, fam))):
        ps = []
        for l in open(os.path.join(mats, fam, rel), encoding='utf-8'):
            f = l.strip().split('\t')
            if len(f) == 2: ps.append((f[0].lower(), [y.lower() for y in f[1].split('/')]))
        for i, (x, ys) in enumerate(ps):
            kt = max(k(x, y) for y in ys); kc = max(k(x, y) for y in ps[(i + 1) % len(ps)][1])
            if kt == kc == 0: continue
            for key in (fam[0], rel[:3]):
                T[key][0 if kt > kc else 1 if kt < kc else 2] += 1
            if kt > kc and len(ex[fam[0]]) < 14: ex[fam[0]].append('%s~%s(%d)' % (x, max(ys, key=lambda y: k(x, y)), kt))
print('parejas nitidas %d' % len(K))
for key in sorted(T, key=lambda s: (len(s), s)):
    a, b, c = T[key]
    if len(key) == 1 or a + b >= 3: print('%s\treal %d\tazar %d\tempate %d\t%s' % (key, a, b, c, ' '.join(ex.get(key, [])) if len(key) == 1 else ''))
