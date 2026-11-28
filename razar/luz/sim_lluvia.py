"""sim_lluvia.py: her rain step (chapter 10, §10.4.3) in Python, to test the decoder against a known text."""
import numpy as np
RNLN, RQ, COLS = 38, 9, 52
class Lluvia:
    def __init__(s):
        s.grid = np.full((RNLN, COLS), ' ', dtype='<U1'); s.cls = np.full((RNLN, COLS), -1); s.gota = [255] * COLS; s.N = 0
    def push(s, data):
        p = 0
        while p < len(data):
            n = min(len(data) - p, 26); ch = data[p:p + n]
            for c in range(COLS):
                b = ch[((c >> 1) + s.N) % n]; d = s.gota[c]
                if d == 255:
                    if (b + s.N + c) & 7: continue
                    d = 0
                else:
                    d += 1
                    if d >= RNLN + RQ + 1: s.gota[c] = 255; continue
                s.gota[c] = d
                if d < RNLN: s.grid[d, c] = '%X' % ((b >> 4) if c % 2 == 0 else (b & 15)); s.cls[d, c] = 0
                if 0 <= d - 1 < RNLN: s.cls[d - 1, c] = 1
                if 0 <= d - 10 < RNLN: s.cls[d - 10, c] = 2
            p += 26; s.N += 1
