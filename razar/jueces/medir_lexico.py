"""What the self-adjusting segmenter learned: its invented words, measured against real instructions.

Usage: python -I medir_lexico.py <file.exe> <listing.lst>
Reuses reading and segmentar() from segmentar_mdl.py unchanged. "Inside" is measured only over
bytes covered by verified listing instructions; bytes in .text that are data, strings or padding
have no instruction and are reported apart.
"""
import collections, os, re, sys
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'segmentar_mdl.py'), encoding='utf-8').read()
exec(src.split('def f1(p, v):')[0])
ins = []
for l in open(lst, encoding='latin1'):
    m = re.match(r'^([0-9A-F]{8}): ((?:[0-9A-F]{2} )+)\s*(\S*)', l)
    if m:
        off = int(m.group(1), 16) - base; bs = bytes(int(x, 16) for x in m.group(2).split())
        if 0 <= off < len(cod) and cod[off:off + len(bs)] == bs: ins.append((off, len(bs), m.group(3).lower()))
de = {}
for k, (o, L, mn) in enumerate(ins):
    for j in range(o, o + L): de[j] = k
_, toks = segmentar(cod, 'REAL')
pos, occ = 0, collections.defaultdict(list)
for w in toks:
    if len(w) > 1: occ[w].append(pos)
    pos += len(w)
print('bytes covered by verified instructions: %d of %d = %.1f %%' % (len(de), len(cod), 100 * len(de) / len(cod)))
cub = [(w, p) for w, ps in occ.items() for p in ps if p in de and p + len(w) - 1 in de]
den = sum(1 for w, p in cub if de[p] == de[p + len(w) - 1])
print('invented words: %d distinct, %d occurrences' % (len(occ), sum(len(v) for v in occ.values())))
print('over covered bytes: %d of %d occurrences inside one instruction = %.1f %%' % (den, len(cub), 100 * den / len(cub)))
print('word lengths:', dict(sorted(collections.Counter(len(w) for w in occ).items())))
print()
print('%-18s %6s %8s %9s  %s' % ('word', 'times', 'inside', 'at start', 'instruction'))
for w, ps in sorted(occ.items(), key=lambda x: -len(x[1]))[:20]:
    c = [p for p in ps if p in de and p + len(w) - 1 in de]
    a = sum(1 for p in c if de[p] == de[p + len(w) - 1])
    ini = sum(1 for p in ps if p in verdad)
    mn = collections.Counter(ins[de[p]][2] for p in ps if p in de).most_common(2)
    print('%-18s %6d %7.0f%% %8.0f%%  %s' % (w.hex(' '), len(ps), 100 * a / max(1, len(c)), 100 * ini / len(ps),
          ', '.join('%s %d%%' % (x, 100 * n // len(ps)) for x, n in mn)))
