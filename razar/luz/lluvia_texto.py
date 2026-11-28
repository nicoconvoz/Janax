"""lluvia_texto.py: from a read grid of her rain, the bytes of each step, read ACROSS (chapter 10, §10.4.3).

In one step every column that has a drop writes at its drop's row; the pair of columns 2k, 2k+1 writes the byte
chunk[(k + RAINN) mod n] of that step's 26-byte chunk. A drop moves one row per step, so the cell j rows above each
column's drop was written j steps ago. Reading across, at the same j, gives that step's chunk, turned by RAINN, with
holes where a pair's two drops are not both seen. Consecutive steps of one push are consecutive chunks of its text,
each turned one more.
"""
import numpy as np
import lluvia_ocr as L


def pasos(d, c):
    """[(j, [byte or None] * 26)] for the steps that can be seen, j = steps ago."""
    head = {}
    for col in range(L.COLS):
        w = [r for r in range(L.ROWS) if c[r, col] == 0]
        if len(w) == 1: head[col] = w[0]; continue
        # a drop below the last row cannot be seen, but its bright stretch can: the rows d-9 .. d-1 are bright
        b = [r for r in range(L.ROWS) if c[r, col] == 1]
        if b and b[-1] == L.ROWS - 1 and b == list(range(b[0], L.ROWS)) and b[0] + 9 >= L.ROWS: head[col] = b[0] + 9
    out = []
    for j in range(L.ROWS + 10):
        fila = []
        for k in range(26):
            a, b = 2 * k, 2 * k + 1
            if a in head and b in head and 0 <= head[a] - j < L.ROWS and 0 <= head[b] - j < L.ROWS:
                x, y = d[head[a] - j, a], d[head[b] - j, b]
                fila.append(int(x + y, 16) if x in L.HEX and y in L.HEX else None)
            else:
                fila.append(None)
        if any(v is not None for v in fila): out.append((j, fila))
    return out


def es_texto(fila):
    v = [b for b in fila if b is not None]
    return len(v) >= 4 and sum(32 <= b < 127 or b >= 0xC2 for b in v) >= 0.8 * len(v)


def armar(steps):
    """The text of consecutive text steps (oldest first), choosing the one turn that reads best: the turn of step i is
    R + i. '·' marks a byte that could not be seen."""
    steps = sorted(steps, key=lambda s: -s[0])                   # oldest (largest j) first
    def texto(R):
        s = ""
        for i, (j, fila) in enumerate(steps):
            ring = [None] * 26
            for k, v in enumerate(fila): ring[(k + R + i) % 26] = v
            s += "".join("·" if v is None else (chr(v) if 32 <= v < 127 else "~") for v in ring)
        return s
    def lee(s):                                                  # pairs of neighbours that look like writing
        return sum(1 for a, b in zip(s, s[1:]) if (a.isalpha() and b.isalpha()) or (a.isalpha() and b == " ") or (a == " " and b.isalpha()))
    return max((texto(R) for R in range(26)), key=lee)
