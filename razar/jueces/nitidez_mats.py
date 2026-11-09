"""nitidez_mats.py <corpus> <mats_es>: an outside judge. Sharpness on MATS's pairs: for each pair (x, y), the places
("moulds": the form around the word and its side, not made only of the corpus' 200 words said most, criterion) x and y
share in the corpus; chance: y replaced by the answer of the next pair of the same relation. By family: how often
the true pair shares more than the chance pair (ties apart), and the share by k (the gradient)."""
import collections, os, re, sys
cf, mats = sys.argv[1:3]; tok = re.compile(r'[^\W\d_]+')
P = []
for fam in sorted(os.listdir(mats)):
    for rel in sorted(os.listdir(os.path.join(mats, fam))):
        ps = []
        for l in open(os.path.join(mats, fam, rel), encoding='utf-8'):
            f = l.strip().split('\t')
            if len(f) == 2: ps.append((f[0].lower(), [y.lower() for y in f[1].split('/')]))
        for i, (x, ys) in enumerate(ps): P.append((fam[0], rel[:3], x, ys, ps[(i + 1) % len(ps)][1]))
need = {x for _, _, x, ys, ns in P} | {y for _, _, x, ys, ns in P for y in ys + ns}
F = collections.Counter(); lines = []
for l in open(cf, encoding='utf-8', errors='replace'):
    w = tok.findall(l.lower()); F.update(w); lines.append(w)
top = {w for w, _ in F.most_common(200)}
M = collections.defaultdict(set)
for ws in lines:
    for i, w in enumerate(ws):
        if w not in need: continue
        for n in (1, 2, 3):
            if i + n < len(ws):
                f = tuple(ws[i + 1:i + n + 1])
                if not set(f) <= top: M[w].add(('A', f))
            if i - n >= 0:
                f = tuple(ws[i - n:i])
                if not set(f) <= top: M[w].add(('B', f))
def k(a, b): return len(M[a] & M[b])
W = collections.defaultdict(lambda: [0, 0, 0]); G = collections.defaultdict(lambda: [0, 0]); ex = collections.defaultdict(list)
for fam, rel, x, ys, ns in P:
    ys = [y for y in ys if y in M and y != x]; ns = [y for y in ns if y in M and y != x]
    if x not in M or not ys or not ns: continue
    kt = max(k(x, y) for y in ys); kc = max(k(x, y) for y in ns)
    W[fam][0 if kt > kc else 1 if kt < kc else 2] += 1; W[rel][0 if kt > kc else 1 if kt < kc else 2] += 1
    for kk, real in ((kt, 1), (kc, 0)):
        b = min(kk, 20); b = 0 if b == 0 else 1 if b <= 2 else 2 if b <= 5 else 3 if b <= 10 else 4
        G[(fam, b, real)][0] += 1
    if kt > kc and len(ex[rel]) < 4: ex[rel].append('%s~%s(%d vs %d)' % (x, max(ys, key=lambda y: k(x, y)), kt, kc))
print('familia/relacion\tpar real comparte mas\tel azar mas\tempate\tejemplos')
for key in sorted(W, key=lambda s: (len(s), s)):
    a, b, c = W[key]; print('%s\t%d\t%d\t%d\t%s' % (key, a, b, c, ' '.join(ex.get(key, [])) if len(key) > 1 else ''))
