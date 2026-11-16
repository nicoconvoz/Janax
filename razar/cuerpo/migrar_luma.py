"""migrar_luma.py <fed casa> <new casa> [report file]: turns a casa Luma has already fed (luma.jsm with the clouds and the gaits on
the host) into a self-contained one, without starting from scratch: everything she grew, ate, learned and archived is
copied as it is, and what she still read from the host becomes her own record.

  - "vida-memoria" (new): for each creature she ate, what she kept of it: the recipe of that meal (her language, the
    line of "comidas"), its two most counted colours, and its gait (the text of its .oido, read once, here, and kept).
    At run time luma.jsm draws each body from the recipe and writes it as her own cloud ("vida-nube-<print>").
  - "despensa": every entry keeps its print, not its path ("#<print 16 hex>"): every meal is already eaten, nothing is
    opened on the host again.
  - "vida-lista" (the paths) is not copied.

It reads the host only here, once, and only what the fed casa points at. It also measures how recognisable the
remembered bodies are: for each creature, the cells where the drawing of its recipe and the silhouette of its cloud
differ (k, the number Luma herself kept when she ate it), against the silhouette's size."""
import os, sys, shutil

def lab(name):
    return name.encode().hex()

def rd(casa, name):
    p = os.path.join(casa, lab(name))
    return open(p, "rb").read() if os.path.exists(p) else b""

def fnv(s):
    h = 0xCBF29CE484222325
    for b in s.encode():
        h = ((h ^ b) * 0x100000001B3) & ((1 << 64) - 1)
    return h | 1

RW, RH = 40, 50
NMAX = 8192                      # her own cloud: 28 + 250 + 3 x 2000 bytes at most

def silhouette(path):
    """the meal's silhouette in a room, as comer's r_meal_cells makes it (fitted relative to its own size, never above
    1, centred; a cell is body when at least half of what it covers is particle)"""
    b = open(path, "rb").read()
    bones = b[9] | b[10] << 8
    at = 11 + 42 * bones + 17
    nw, nh = b[at - 4] | b[at - 3] << 8, b[at - 2] | b[at - 1] << 8
    bits = b[at:]
    if RW * nh <= RH * nw:       # the program: j8 - j7 = RH*NW - RW*NH; >= 0 fits the width
        sn, sd = RW, nw
    else:
        sn, sd = RH, nh
    if sd < sn:
        sn, sd = 1, 1
    ox, oy = (RW - nw * sn // sd) >> 1, (RH - nh * sn // sd) >> 1
    area, part = {}, {}
    for y in range(nh):
        ry = y * sn // sd + oy
        for x in range(nw):
            j = y * nw + x
            c = (x * sn // sd + ox, ry)
            area[c] = area.get(c, 0) + 1
            if bits[j >> 3] >> (j & 7) & 1:
                part[c] = part.get(c, 0) + 1
    return {c for c, a in area.items() if 2 * part.get(c, 0) >= a and a > 0}

def main():
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    lista = rd(src, "vida-lista").decode()
    if not lista:
        sys.exit("no vida-lista in %s: is it a fed casa?" % src)
    meals = {}
    for ln in rd(src, "comidas").decode().split("\n"):
        if len(ln) < 81:
            continue
        rec = ln[22:53].rstrip(".")
        if not rec or ln[76] == "-":
            continue
        n = int(ln[78:80])
        cols = [ln[81 + 7 * i:81 + 7 * i + 6] for i in range(n)]
        meals[int(ln[5:21], 16)] = (ln[22:53], cols, int(ln[62:66]))
    out, omax, report = [], 8, []
    for ln in lista.split("\n")[1:]:
        if not ln.strip():
            continue
        nube, oido = ln[20:].split("\t")
        p = fnv(nube)
        if p not in meals:
            continue
        rec, cols, k = meals[p]
        c1 = cols[0] if cols else "808080"
        c2 = cols[1] if len(cols) > 1 else c1
        gait = open(oido, "rb").read()
        omax = max(omax, len(gait))
        out.append(b"%016x %s %s %s %09d\n" % (p, rec.encode(), c1.encode(), c2.encode(), len(gait)) + gait)
        s = silhouette(nube)
        report.append((os.path.basename(nube)[:-5], k, len(s)))
    text = b"".join(out)
    head = b"lista2 %06d %09d %09d %09d\n" % (len(out), NMAX, omax, len(text))
    assert len(head) == 44
    for f in os.listdir(src):
        if f in (lab("vida-lista"), lab("despensa")):
            continue
        shutil.copy2(os.path.join(src, f), os.path.join(dst, f))
    open(os.path.join(dst, lab("vida-memoria")), "wb").write(head + text)
    # the pantry: prints instead of paths
    desp = rd(src, "despensa").decode().split("\n")
    lines = []
    for ln in desp[1:]:
        if ln.strip():
            lines.append("%09d #%016x\n" % (8, fnv(ln[10:])))
    body = "".join(lines).encode()
    open(os.path.join(dst, lab("despensa")), "wb").write(b"despensa1 %06d %09d %09d\n" % (len(lines), 8, len(body)) + body)
    # how recognisable: k (cells that differ) over the silhouette's cells, and over the room
    rel = sorted(k / max(1, s) for _, k, s in report)
    agree = sorted(1 - k / (RW * RH) for _, k, _ in report)
    n = len(report)
    print("creatures kept in her memory:", n, "of", len([l for l in lista.split("\n")[1:] if l.strip()]))
    print("cells that differ from the silhouette, per silhouette cell: median %.2f, best %.2f, worst %.2f" % (rel[n // 2], rel[0], rel[-1]))
    print("cells that agree over the room (2000): median %.3f, worst %.3f" % (agree[n // 2], agree[0]))
    worst = max(report, key=lambda r: r[1] / max(1, r[2]))
    print("worst:", worst[0], "k", worst[1], "silhouette", worst[2])
    with open(sys.argv[3] if len(sys.argv) > 3 else os.devnull, "w", encoding="utf-8") as f:
        for name, k, s in sorted(report):
            f.write("%s %d %d\n" % (name, k, s))

main()
