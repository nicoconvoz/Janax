"""lluvia_ocr.py: reads Luma's rain off a picture of her window, with her own letters (FONT in gen_leer.py).

The window shows her screen stretched by a factor that is not a whole number, so where each of her points lands is
fitted, not assumed: cell (c, r) of the rain starts at her point (322 + 6c, 2 + 9r) (chapter 10, §10.4.1); on the
window that is x = ox + sx * (6c + i + 0.5), y = oy + sy * (9r + j + 0.5) for her point (i, j) inside the letter. The
fit is the one under which the most cells read as one of her 16 digits exactly.
Returns per cell: the digit (or ' ' empty, '?' unread) and its class: 0 white (the drop), 1 bright, 2 trail.
"""
import os
import numpy as np

t = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "cuerpo", "gen_leer.py"), encoding="utf-8").read()
i = t.index("FONT = {"); FONT = eval(t[i + 7: t.index("}", i) + 1])
HEX = "0123456789ABCDEF"
TPL = np.array([[c == "#" for c in FONT[ch][:35].ljust(35, ".")] for ch in HEX])      # 16 x 35
COLS, ROWS = 52, 38


def muestras(lit, ox, oy, sx, sy):
    c = np.arange(COLS); r = np.arange(ROWS); ii = np.arange(5); jj = np.arange(7)
    X = np.round(ox + sx * (322 + 6 * c[None, :, None, None] + ii[None, None, None, :] + 0.5) - 0.5).astype(int)
    Y = np.round(oy + sy * (2 + 9 * r[:, None, None, None] + jj[None, None, :, None] + 0.5) - 0.5).astype(int)
    X = np.broadcast_to(X, (ROWS, COLS, 7, 5)); Y = np.broadcast_to(Y, (ROWS, COLS, 7, 5))
    ok = (X >= 0) & (X < lit.shape[1]) & (Y >= 0) & (Y < lit.shape[0])
    v = np.zeros((ROWS, COLS, 7, 5), bool); v[ok] = lit[Y[ok], X[ok]]
    return v.reshape(ROWS, COLS, 35), X, Y


def puntaje(lit, p):
    v, _, _ = muestras(lit, *p)
    return (v[:, :, None, :] == TPL[None, None]).all(3).any(2).sum()


def ajustar(img):
    lit = img.max(2) > 60
    best = None
    for sx in np.arange(2.00, 2.10, 0.005):
        for ox in np.arange(-30, 45, 1.0):
            p = (ox, 0.0, sx, sx)
            s = puntaje(lit, p)
            if best is None or s > best[0]: best = (s, p)
    s, (ox, _, sx, _) = best
    for sy in np.arange(sx - 0.03, sx + 0.031, 0.005):
        for oy in np.arange(-6, 6, 0.5):
            for ox2 in (ox - 0.5, ox, ox + 0.5):
                p = (ox2, oy, sx, sy); s2 = puntaje(lit, p)
                if s2 > best[0]: best = (s2, p)
    return best


def leer(img, p):
    lit = img.max(2) > 60
    v, X, Y = muestras(lit, *p)
    dist = (v[:, :, None, :] != TPL[None, None]).sum(3)          # how many of her 35 points disagree, per digit
    o = np.sort(dist, 2)
    dig = np.full((ROWS, COLS), "?", dtype="<U1")
    hit = (o[:, :, 0] <= 4) & (o[:, :, 1] > o[:, :, 0])          # (close to one digit, and closer to it than to any other)
    dig[hit] = np.array(list(HEX))[dist.argmin(2)[hit]]
    dig[~v.any(2)] = " "
    # class by the colour of its lit points: white = all three high; bright green = green ~255; trail = green ~143
    cls = np.full((ROWS, COLS), -1)
    for r in range(ROWS):
        for c in range(COLS):
            m = v[r, c]
            if not m.any(): continue
            px = img[Y[r, c].reshape(-1)[m], X[r, c].reshape(-1)[m]].astype(int).mean(0)
            cls[r, c] = 0 if px[0] > 180 and px[2] > 180 else (1 if px[1] > 200 else 2)
    return dig, cls
