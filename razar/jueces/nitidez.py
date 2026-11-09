"""nitidez.py <imaginado> <libro_fuente> <validador>...: an outside judge, never shown to Razar. Sharpening applied to
every vote (Capitan: "it narrows down, becomes sharper, until more information confirms it"): an imagined "z <relation>
b" says b holds the role that the words the book gives z there hold. Its sharpness k: the places ("moulds": the form
around a word, and its side; not made only of the 200 words said most, criterion) b shares with the one of those words
it shares most with. By k: confirmed / (confirmed + living along) in the other texts, with the mechanism and without
it (the same pieces, b from another pair). A sample of the votes."""
import collections, random, re, sys
imf, src = sys.argv[1:3]; vals = sys.argv[3:]; tok = re.compile(r'[^\W\d_]+'); random.seed(3)
srcw = [tok.findall(l[3:].lower()) for l in open(src, encoding='utf-8', errors='replace')]
F = collections.Counter(w for l in srcw for w in l); top = {w for w, _ in F.most_common(200)}
M = collections.defaultdict(set)
for ws in srcw:
    for i, w in enumerate(ws):
        for n in (1, 2, 3):
            if i + n < len(ws):
                f = tuple(ws[i + 1:i + n + 1])
                if not set(f) <= top: M[w].add(('A', f))
            if i - n >= 0:
                f = tuple(ws[i - n:i])
                if not set(f) <= top: M[w].add(('B', f))
V = []
for l in open(imf, encoding='utf-8', errors='replace'):
    if random.random() > 0.2: continue
    p = l.rstrip('\n').split(' | ', 1)
    if len(p) != 2: continue
    t = p[1].split(' # ', 1)[0]; k = p[0].split(); w = tok.findall(t.lower())
    if len(k) < 5 or len(w) < 3 or len(w) > 5: continue
    V.append((k[4], w[0], tuple(w[1:-1]), w[-1]))
need = {(z, r) for _, z, r, _ in V}
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
S0 = index(srcw); vs = [index(tok.findall(l.lower()) for l in open(f, encoding='utf-8', errors='replace')) for f in vals]
R = collections.defaultdict(lambda: [0, 0]); EX = collections.defaultdict(list)
for kind, z, r, b in V:
    mem = S0.get((z, r), set())
    if b in mem or not mem: continue
    k = max(len(M[b] & M[m]) for m in mem); k = min(k, 10)
    c = any(b in s.get((z, r), ()) for s in vs); o = not c and any(s.get((z, r)) for s in vs)
    if not (c or o): continue
    R[(kind, k)][0] += c; R[(kind, k)][1] += 1
    if c and kind == 'i' and len(EX[k]) < 5: EX[k].append('%s %s %s' % (z, ' '.join(r), b))
print('nitidez\tcon mecanismo: conf/decididos\t%\tsin mecanismo\t%\tejemplos')
T = {'i': [0, 0], 'a': [0, 0]}
for k in range(11):
    a, b = R[('i', k)], R[('a', k)]
    for kind, x in (('i', a), ('a', b)): T[kind][0] += x[0]; T[kind][1] += x[1]
    if a[1] + b[1] == 0: continue
    print('%s%d\t%d/%d\t%.2f%%\t%d/%d\t%.2f%%\t%s' % ('>=' if k == 10 else '', k, a[0], a[1], 100 * a[0] / max(a[1], 1), b[0], b[1], 100 * b[0] / max(b[1], 1), ' / '.join(EX[k])))
for kind in 'ia': print('todo %s: %d/%d = %.2f%%' % ('con' if kind == 'i' else 'sin', T[kind][0], T[kind][1], 100 * T[kind][0] / T[kind][1]))
