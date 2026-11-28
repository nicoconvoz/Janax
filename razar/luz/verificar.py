"""verificar.py <su casa> <carpeta de cuadros>: what was read from her light, against what she wrote in her house (her forms' trials ring).
For each step of text read from a saved picture: the best fit among her last lines (any 26-byte piece, any turn),
and the same against her lines with their bytes shuffled (what luck alone reaches)."""
import glob, os, sys, numpy as np
from PIL import Image
import lluvia_ocr as L, lluvia_texto as X
CASA, CUADROS = sys.argv[1], sys.argv[2]
r = open(os.path.join(CASA, "archivo".encode().hex()), "rb").read()      # her forms' trials ring (chapter 10, §10.13)
K, cuenta = int(r[8:17]), int(r[18:30])
lin = [r[160 + (i % K) * 112: 160 + (i % K) * 112 + 112] for i in range(max(0, cuenta - 1500), cuenta)]
A = np.frombuffer(b''.join(lin), np.uint8).reshape(len(lin), 112).astype(int)
rng = np.random.default_rng(1); B = np.array([rng.permutation(r) for r in A])
P = None                                     # (fitted on the first picture)
def mejor(M, k, v):
    best = 0
    for o in (0, 26, 52, 78, 104):
        n = min(26, 112 - o)
        for R in range(n):
            idx = o + (k + R) % n
            best = max(best, int((M[:, idx] == v).sum(1).max()))
    return best
tot = ok = ok_azar = 0; ejemplos = []
for f in sorted(glob.glob(os.path.join(CUADROS, 'texto_*.png')))[::3]:
    img = np.array(Image.open(f))
    if P is None: P = L.ajustar(img)[1]
    d, c = L.leer(img, P)
    for j, fila in X.pasos(d, c):
        if not X.es_texto(fila): continue
        k = np.array([i for i, b in enumerate(fila) if b is not None]); v = np.array([b for b in fila if b is not None])
        if len(k) < 5: continue
        m, m0 = mejor(A, k, v), mejor(B, k, v)
        tot += len(k); ok += m; ok_azar += m0
        if len(ejemplos) < 6: ejemplos.append((''.join('·' if b is None else chr(b) if 32 <= b < 127 else '~' for b in fila), m, m0, len(k)))
print('bytes leidos de su luz: %d; coinciden con sus lineas: %d (%.0f%%); con sus lineas mezcladas (azar): %d (%.0f%%)'
      % (tot, ok, 100 * ok / tot, ok_azar, 100 * ok_azar / tot))
for e in ejemplos: print('  %s  %d/%d (azar %d)' % (e[0], e[1], e[3], e[2]))
