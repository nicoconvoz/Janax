"""moldes.py <texto_original> <bytes>: an outside judge, never shown to Razar. Do names of people from different parts
of the book share moulds ("_ nació en _": the form, and which side the word is on), where they never share a pair?
Names: words written with a capital inside a sentence 90 % of the times or more (the original text's capitals, which
Razar never sees). Parts: 100 KB each, as hilos' pieces. For pairs of names from different parts, and pairs of a name
and a word that is not one, of the same frequency: how often they share a mould, and which moulds join names most."""
import collections, random, re, sys
txt = open(sys.argv[1], encoding='utf-8', errors='replace').read()[:int(sys.argv[2])]
tok = re.compile(r'[^\W\d_]+'); random.seed(5)
cap = collections.Counter(); low = collections.Counter(); part = {}
lines = [l for l in txt.split('\n') if l.strip()]
pos = 0; W = []
for l in lines:
    ws = tok.findall(l)
    for i, w in enumerate(ws):
        if i > 0 and not re.search(r'[.!?]\s*$', l[:l.find(w)] if False else ''):
            (cap if w[0].isupper() else low)[w.lower()] += 1
    W.append((pos // 100000, [w.lower() for w in ws])); pos += len(l) + 1
names = {w for w in cap if cap[w] >= 3 and cap[w] >= 9 * low[w] and len(w) > 2}
M = collections.defaultdict(set); P = collections.defaultdict(set); F = collections.Counter(); home = collections.defaultdict(collections.Counter)
for p, ws in W:
    for i, w in enumerate(ws):
        F[w] += 1; home[w][p] += 1
        for n in (1, 2, 3):
            if i + n + 1 < len(ws): M[w].add(('A', tuple(ws[i + 1:i + n + 1]))); P[w].add(('A', tuple(ws[i + 1:i + n + 2])))
            if i - n - 1 >= 0: M[w].add(('B', tuple(ws[i - n:i]))); P[w].add(('B', tuple(ws[i - n - 1:i])))
part_of = {w: h.most_common(1)[0][0] for w, h in home.items()}
nm = [w for w in names if F[w] >= 3]; other = [w for w in F if w not in names and F[w] >= 3]
byf = collections.defaultdict(list)
for w in other: byf[min(F[w], 50)].append(w)
top = {w for w, _ in F.most_common(int(sys.argv[3]) if len(sys.argv) > 3 else 0)}
for w in M: M[w] = {x for x in M[w] if not set(x[1]) <= top}
def share(a, b): return len(M[a] & M[b])
nn = []; no = []; why = collections.Counter()
for _ in range(20000):
    a, b = random.sample(nm, 2)
    if part_of[a] == part_of[b]: continue
    s = M[a] & M[b]; nn.append(len(s))
    for x in s: why[x] += 1
    c = random.choice(byf.get(min(F[b], 50)) or other); no.append(share(a, c))
mean = lambda v: sum(v) / len(v)
print('nombres %d (por las mayusculas del original) | otras palabras %d' % (len(nm), len(other)))
print('nombre con nombre de otra parte: comparten molde %.0f%%, moldes en comun %.1f' % (100 * mean([x > 0 for x in nn]), mean(nn)))
print('nombre con otra palabra de la misma frecuencia: %.0f%%, %.1f' % (100 * mean([x > 0 for x in no]), mean(no)))
print('moldes que mas juntan nombres:', ', '.join('%s %s _' % ('_' if s == 'B' else '', ' '.join(f)) if s == 'B' else '_ %s' % ' '.join(f) for (s, f), k in why.most_common(25)))
# sharpening (Capitan: "it becomes sharper until more information confirms it"): the moulds names hold (seen with two
# names or more: "places of people", found from the names, not given), and for every word, how many of them it holds;
# of the words holding k of them, how many are names. If the picture sharpens, the share of names grows with k.
hold = collections.Counter(x for w in nm for x in M[w])
pp = {x for x, c in hold.items() if c >= 2}
byk = collections.defaultdict(lambda: [0, 0]); ex = collections.defaultdict(list)
for w in list(F):
    if F[w] < 3: continue
    k = len(M[w] & pp)
    if k == 0: continue
    k = min(k, 8); byk[k][0] += w in names; byk[k][1] += 1
    if w not in names and len(ex[k]) < 6: ex[k].append(w)
print('lugares de persona (moldes que tienen dos nombres o mas): %d' % len(pp))
for k in sorted(byk):
    a, b = byk[k]; print('  comparte %s%d: %4d palabras, nombres %3.0f%% | las que no son nombre: %s' % ('>=' if k == 8 else '', k, b, 100 * a / b, ', '.join(ex[k])))
