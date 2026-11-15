"""Generates vivo.jsm: a living desktop. Every piece of gen_pantalla's screen is a cloud of particles on springs,
rebuilt into a .nube v3 cloud and shown (request 40) every frame while something moves; the user's clicks and drags
come from request 41 (wait for an event), and when nobody does anything Razar explores its own body (motor babbling),
never the same push twice, until it has tried them all and rests, waiting for ever."""
W, H = 160, 100
CLOUD = 0x1004                    # so that the colours start 8-aligned: they are cleared with 8-byte stores
BITS = CLOUD + 28
RGB = BITS + W * H // 8
TOTAL = 28 + W * H // 8 + 3 * W * H
assert RGB % 8 == 0 and RGB + 3 * W * H < 0x10000
QUEUE, EV = 0x100, 0x140          # the request queue; the event record (kind, x, y, extra)
PARTICLES = 0x10000               # 64 bytes each: hx, hy, px, py, vx, vy, k (qwords), r g b, group, out (bytes)
PIECE, PIECE_SIZE = 0x400, 128    # ox, oy, first, end, state, home ox, home oy (qwords)
OX, OY, FIRST, END, STATE, HOX, HOY = 0, 8, 16, 24, 32, 40, 48
PARTS, PART_SIZE = 0x600, 64      # piece, group, cx, cy, m small, m big, shove (qwords)
TRIED = 0x800                     # one byte per combination: 1 = tried in this round
ROOM = 0x100000
BACKGROUND = (0x1F, 0x4E, 0x5A)

# The model, fixed point x256 (a cell is 256), one step per frame. Constants are criteria, not measurements:
K_BASE = 20      # spring k (/256 per frame^2): w = sqrt(20/256) = 0.28 rad/frame, a period of ~22 frames (~0.7 s at 30 fps)
DAMP = 40        # damping (/256 per frame): damping ratio d/(2w) ~0.28, a jelly that wobbles twice and settles
K_NEAR, K_FAR, D0 = 64, 8, 12   # grabbed: k = K_FAR + (K_NEAR-K_FAR)*D0/(D0+d), d = cells from the grab point
REST = 32        # 1/8 cell: below it in distance and in speed a particle snaps to its place (it is still drawn there;
                 # the integer damping cannot kill speeds under 256/DAMP = 6.4 and residual cycles stay < 7/w = 25)
FRAME_MS = 33    # one frame while something moves (~30 fps)
PAUSE_MS = 300   # a breath between two explorations, so each one reads alone
S_SMALL, S_BIG, S_SHOVE = 102, 205, 154   # exploration: edge speed 0.4 and 0.8 cell/frame (amplitude ~1.4, ~2.9
                                          # cells = speed / w), a shove of 0.6 cell/frame
S_KICK, S_START = 384, 256        # a clicked tower: 1.5 cells/frame at its edge (~5 cells); the start button: 1
EXPLODE_SHIFT = 4                 # a closed window: speed = (distance from its centre) / 16, plus 1 cell/frame outwards
SEED = 0x2545F4914F6CDD1D

# The pieces, as rectangles relative to their origin (gen_pantalla's scene); later ones cover earlier ones.
# (x0, y0, x1, y1, (r, g, b), group): group 1 and 2 are Razar's little towers, 3 the start button.
RAZAR = [(3, 3, 93, 69, (0x10, 0x2A, 0x30), 0), (0, 0, 90, 66, (0x22, 0x22, 0x2A), 0),
         (1, 8, 89, 65, (0xF4, 0xEC, 0xE0), 0), (1, 1, 89, 8, (0x2F, 0x5F, 0xA8), 0),
         (81, 2, 87, 7, (0xD0, 0x40, 0x40), 0), (74, 2, 80, 7, (0xE0, 0xB0, 0x30), 0),
         (8, 16, 16, 24, (0xFF, 0x6B, 0x6B), 1), (16, 16, 24, 24, (0x4D, 0x96, 0xFF), 1),
         (32, 16, 40, 24, (0xFF, 0xD9, 0x3D), 2), (40, 16, 48, 24, (0x6B, 0xCB, 0x77), 2),
         (8, 52, 38, 60, (0xC8, 0xC8, 0xD0), 0)]
LUMA = [(3, 3, 63, 49, (0x10, 0x2A, 0x30), 0), (0, 0, 60, 46, (0x22, 0x22, 0x2A), 0),
        (1, 7, 59, 45, (0xE8, 0xF4, 0xEC), 0), (1, 1, 59, 7, (0x3A, 0x9A, 0x5A), 0),
        (52, 2, 57, 6, (0xD0, 0x40, 0x40), 0)]
TASKBAR = [(0, 0, 160, 6, (0x2A, 0x2A, 0x33), 0), (2, 1, 18, 5, (0x6B, 0xCB, 0x77), 3)]
#           name, rects, home origin, hit width, height, title rows, close button (x0, y0, x1, y1)
PIECES = [("Razar's window", RAZAR, (20, 10), 90, 66, 8, (81, 2, 87, 7)),
          ("Luma's window", LUMA, (90, 44), 60, 46, 7, (52, 2, 57, 6)),
          ("the taskbar", TASKBAR, (0, 94), 160, 6, 0, None)]
TOWERS = [(1, (8, 16, 24, 24)), (2, (32, 16, 48, 24))]   # Razar's, by group
START = (2, 1, 18, 5)                                    # on the taskbar

def cells(rects):
    m = {}
    for x0, y0, x1, y1, c, g in rects:
        for y in range(y0, y1):
            for x in range(x0, x1):
                m[(x, y)] = (c, g)
    return m

def boxes(m):
    """The cell map as few rectangles: runs of one colour per row, stacked while the next row repeats them."""
    runs = {}
    for (x, y), v in m.items():
        runs.setdefault(y, {})[x] = v
    rows = []
    for y in sorted(runs):
        r, xs = [], sorted(runs[y])
        i = 0
        while i < len(xs):
            j = i
            while j + 1 < len(xs) and xs[j + 1] == xs[j] + 1 and runs[y][xs[j + 1]] == runs[y][xs[i]]:
                j += 1
            r.append((xs[i], xs[j] + 1, runs[y][xs[i]]))
            i = j + 1
        rows.append((y, r))
    out, open_ = [], {}
    for y, r in rows:
        now = {}
        for x0, x1, v in r:
            k = (x0, x1, v)
            if k in open_ and open_[k][1] == y:
                now[k] = (open_[k][0], y + 1)
            else:
                now[k] = (y, y + 1)
        for k, (ya, yb) in open_.items():
            if k not in now or now[k][0] != ya:
                out.append((k[0], ya, k[1], yb, k[2]))
        open_ = now
    for k, (ya, yb) in open_.items():
        out.append((k[0], ya, k[1], yb, k[2]))
    assert sum((x1 - x0) * (y1 - y0) for x0, y0, x1, y1, _ in out) == len(m)
    return out

L = []; o = L.append
n_label = [0]
def lab(s):
    n_label[0] += 1
    return "%s_%d" % (s, n_label[0])
def num(v):
    return ("0%Xh" % v) if v >= 10 else str(v)
def li(r, v, c=""):
    """r = any 64-bit constant, the shortest way: jldi takes 16 bits with sign, jshi shifts 16 in."""
    c = ("   ; " + c) if c else ""
    if -0x8000 <= v < 0x8000:
        o("  jldi %s, %s%s" % (r, str(v) if v < 0 else num(v), c)); return
    v &= (1 << 64) - 1
    parts = [(v >> s) & 0xFFFF for s in (48, 32, 16, 0)]
    while len(parts) > 1 and parts[0] == 0 and parts[1] < 0x8000:
        parts.pop(0)
    while len(parts) > 1 and parts[0] == 0xFFFF and parts[1] >= 0x8000:
        parts.pop(0)
    first = parts[0] - 0x10000 if parts[0] >= 0x8000 else parts[0]
    o("  jldi %s, %s%s" % (r, str(first) if first < 0 else num(first), c))
    for p in parts[1:]:
        o("  jshi %s, %s" % (r, num(p)))
def ld(r, a, c=""): o("  jld %s, j14, %s%s" % (r, num(a), ("   ; " + c) if c else ""))
def st(r, a, c=""): o("  jst %s, j14, %s%s" % (r, num(a), ("   ; " + c) if c else ""))
def addi(r, v, t="j10"):
    li(t, v); o("  jadd %s, %s, %s" % (r, r, t))
def piece(p, f): return PIECE + p * PIECE_SIZE + f

G = {}
for i, name in enumerate("REMAIN FOREVER PAUSING CHANGED MOVING GRAB GDX GDY EXPLORE RNG Z0 Z1 PEND BLEFT FRAMES "
                         "PFIRST PEND2 PG PCX PCY A00 A01 A10 A11 C0 C1".split()):
    G[name] = 0x200 + 8 * i

# ---- the particles, planned here (only their rectangles go into the program)
plan, parts, n = [], [], 0
for name, rects, (hx, hy), w, h, tb, close in PIECES:
    m = cells(rects)
    plan.append((name, boxes(m), n, n + len(m)))
    n += len(m)
assert PARTICLES + n * 64 <= ROOM, n
def part_geom(p, g):
    ms = [xy for xy, (c, gg) in cells(PIECES[p][1]).items() if g == 0 or gg == g]
    xs, ys = [x for x, y in ms], [y for x, y in ms]
    cx, cy = (min(xs) + max(xs) + 1) * 128, (min(ys) + max(ys) + 1) * 128
    r = max(max(xs) + 1 - min(xs), max(ys) + 1 - min(ys)) * 128    # half the longer side
    return cx, cy, r
PART_LIST = [("Razar's window", 0, 0), ("Luma's window", 1, 0), ("the first little tower", 0, 1),
             ("the second little tower", 0, 2), ("the taskbar", 2, 0), ("the start button", 2, 3)]
KINDS = ["shove", "pulse", "twist", "shear"]
COMBOS = len(PART_LIST) * len(KINDS) * 4
assert COMBOS == 96

o("; Janax's living desktop (Capitan: \"the loop has life: it always explores, but it is never the repetition of the same\").")
o("; Every piece of the screen is a cloud of particles: Razar's window, Luma's window, the taskbar (%d particles)." % n)
o("; Each particle has its home cell in its piece, a position and a speed (x256), and a spring to its home:")
o(";   v += k*(home - p) >> 8;  v -= v*%d >> 8;  p += v      (k = %d: a period of ~22 frames; damping ratio ~0.28)" % (DAMP, K_BASE))
o("; Each frame the cloud (.nube v3, one level, %dx%d, every cell set) is rebuilt and shown (request 40); between" % (W, H))
o("; frames Janax waits for an event (request 41): %d ms while anything moves, for ever when everything rests." % FRAME_MS)
o("; - A title bar dragged moves its window; near the grab point the springs are stiffer, so it stretches like jelly.")
o("; - A close button: the window flies apart. The start button: the closed windows fly back. A little tower: a kick.")
o(";   A click on a window brings it to the front.")
o("; - Nobody doing anything: Razar explores its own body, one small push at a time, among the %d combinations of" % COMBOS)
o(";   piece (%d) x push (shove, pulse, twist, shear) x direction/strength (4) it has not tried in this round;" % len(PART_LIST))
o(";   a seeded generator picks among the untried ones, so it never repeats one. When all are tried it rests and waits")
o(";   for ever (nothing is spent). Any click opens a new round: the table of the tried ones is cleared.")
o("; Ends when the window is closed: j0 = the frames drawn. Generated by gen_vivo.py.")
o("; Room 0: %Xh the queue, %Xh the event, %Xh the variables, %Xh the pieces, %Xh the parts, %Xh the tried ones," % (QUEUE, EV, 0x200, PIECE, PARTS, TRIED))
o("; %Xh the cloud (28 + %d + %d bytes), %Xh the particles (64 bytes each)." % (CLOUD, W * H // 8, 3 * W * H, PARTICLES))
o("include '../../escalon0/janax.inc'")
o("jfirst j1, %Xh" % ROOM)
o("jldi j14, 0                     ; j14 stays 0: the variables live below 8000h")
o("; ---- the cloud's header and its cells, once")
cabeza = b"NUBE" + bytes([3]) + b"\x00\x00\x80\x3f" + b"\x00\x00" + bytes([1]) + b"\x00\x00\x80\x3f" + bytes(8) + W.to_bytes(2, "little") + H.to_bytes(2, "little")
assert len(cabeza) == 28
li("j1", CLOUD)
for i, b in enumerate(cabeza):
    o("  jldi j2, %s" % num(b)); o("  jstb j2, j1, %d" % i)
li("j1", BITS); li("j2", BITS + W * H // 8); o("  jldi j3, -1"); o("  jldi j4, 1")
o("bits:                           ; every cell holds a particle")
o("  jstb j3, j1, 0"); o("  jadd j1, j1, j4"); o("  jsub j5, j2, j1"); o("  jjnz j5, bits")
o("; ---- the variables")
li("j1", SEED); st("j1", G["RNG"], "the generator's seed")
li("j1", PARTICLES); st("j1", G["PEND"], "where the next particle goes")
o("  jldi j1, 1"); st("j1", G["EXPLORE"], "it explores from birth"); st("j1", G["Z1"], "Luma's window in front")
o("; ---- the pieces: their particles, born scattered over the screen (they fly home at once)")
for p, (name, bx, a, b) in enumerate(plan):
    hx, hy = PIECES[p][2]
    o("; %s: %d particles from %d rectangles, home at (%d, %d)" % (name, b - a, len(bx), hx, hy))
    li("j1", hx * 256); st("j1", piece(p, OX)); st("j1", piece(p, HOX))
    li("j1", hy * 256); st("j1", piece(p, OY)); st("j1", piece(p, HOY))
    o("  jldi j1, 1"); st("j1", piece(p, STATE), "alive")
    ld("j1", G["PEND"]); st("j1", piece(p, FIRST))
    for x0, y0, x1, y1, ((r, g, b_), grp) in bx:
        o("  jldi j1, %d" % x0); o("  jldi j2, %d" % y0); o("  jldi j3, %d" % x1); o("  jldi j4, %d" % y1)
        o("  jldi j5, %s" % num(r)); o("  jldi j6, %s" % num(g)); o("  jldi j7, %s" % num(b_)); o("  jldi j8, %d" % grp)
        o("  jcall born")
    ld("j1", G["PEND"]); st("j1", piece(p, END))
o("; ---- the parts it explores: piece, group, centre (x256), the pulse's m for both strengths, the shove")
for i, (name, p, g) in enumerate(PART_LIST):
    cx, cy, r = part_geom(p, g)
    base = PARTS + i * PART_SIZE
    o("; %d %s: centre (%d, %d), half its longer side %d" % (i, name, cx, cy, r))
    for off, v in ((0, p), (8, g), (16, cx), (24, cy), (32, S_SMALL * 256 // r), (40, S_BIG * 256 // r), (48, S_SHOVE)):
        li("j1", v); st("j1", base + off)

o("; ---- the living loop: wait for an event or for the time to run out, then a frame")
o("main:")
ld("j12", G["REMAIN"]); ld("j9", G["FOREVER"]); o("  jjz j9, main_wait"); o("  jldi j12, -1                   ; for ever")
o("main_wait:")
o("  jldi j10, 41"); li("j11", EV); o("  jcall tocar")
st("j12", G["BLEFT"], "what was left of the wait")
o("  jjn j13, main_bad"); o("  jjz j13, main_time")
st("j14", G["CHANGED"]); o("  jcall handle")
ld("j9", G["FOREVER"]); ld("j10", G["PAUSING"]); o("  jor j9, j9, j10"); o("  jjz j9, main_frames")
ld("j9", G["CHANGED"]); o("  jjnz j9, main_wake")
ld("j12", G["BLEFT"]); st("j12", G["REMAIN"], "nothing changed: the same wait goes on"); o("  jjmp main")
o("main_wake:                      ; something changed while it rested: frames again")
st("j14", G["FOREVER"]); st("j14", G["PAUSING"]); o("  jjmp frame")
o("main_frames:                    ; between two frames: what is left of this one")
ld("j12", G["BLEFT"]); st("j12", G["REMAIN"]); o("  jjz j12, frame"); o("  jjmp main")
o("main_time:")
ld("j9", G["FOREVER"]); o("  jjz j9, main_timed")
ld("j0", G["FRAMES"], "for ever ran out: there is no window to wait on (JANAX_SIN_VENTANA)"); o("  jhalt")
o("main_timed:")
ld("j9", G["PAUSING"]); o("  jjz j9, frame")
st("j14", G["PAUSING"]); o("  jcall explore                  ; the pause is over: one more exploration")
o("frame:")
o("  jcall step"); o("  jcall fill")
for z in ("Z0", "Z1"):
    o("  ; the window at %s" % z)
    ld("j9", G[z]); o("  jldi j10, %d" % PIECE_SIZE); o("  jmul j10, j9, j10"); li("j11", PIECE); o("  jadd j10, j10, j11")
    o("  jld j11, j10, %d" % STATE); o("  jldi j12, 2"); o("  jsub j12, j11, j12"); skip = lab("gone")
    o("  jjz j12, %s" % skip); o("  jld j1, j10, %d" % FIRST); o("  jld j2, j10, %d" % END); o("  jcall draw")
    o("%s:" % skip)
o("  ; the taskbar, always in front")
ld("j1", piece(2, FIRST)); ld("j2", piece(2, END)); o("  jcall draw")
o("  jldi j10, 40                   ; show")
li("j11", CLOUD); li("j12", TOTAL); o("  jcall tocar")
ld("j9", G["FRAMES"]); o("  jldi j10, 1"); o("  jadd j9, j9, j10"); st("j9", G["FRAMES"])
ld("j9", G["MOVING"]); o("  jjz j9, frame_rest")
o("  jldi j9, %d" % FRAME_MS); st("j9", G["REMAIN"], "something moves: the next frame"); st("j14", G["FOREVER"]); o("  jjmp main")
o("frame_rest:")
ld("j9", G["GRAB"]); o("  jjnz j9, frame_forever")
ld("j9", G["EXPLORE"]); o("  jjz j9, frame_forever")
o("  jldi j9, %d" % PAUSE_MS); st("j9", G["REMAIN"], "at rest, still exploring: a pause, then the next push")
o("  jldi j9, 1"); st("j9", G["PAUSING"]); st("j14", G["FOREVER"]); o("  jjmp main")
o("frame_forever:                  ; at rest and nothing left to explore: wait for ever (nothing is spent)")
o("  jldi j9, 1"); st("j9", G["FOREVER"]); o("  jjmp main")
o("main_bad:")
o("  jldi j0, 0BADh"); o("  jhalt")

# ---- one event
o("; ---- one event (the record at %Xh): 5 the window closed, 2 a button down, 3 up, 1 the pointer moved" % EV)
o("handle:")
ld("j9", EV)
o("  jldi j10, 5"); o("  jsub j10, j9, j10"); o("  jjnz j10, handle_open")
ld("j0", G["FRAMES"], "closed: j0 = the frames drawn"); o("  jhalt")
o("handle_open:")
ld("j1", EV + 8); ld("j2", EV + 16)
o("  jldi j10, 2"); o("  jsub j10, j9, j10"); o("  jjz j10, down")
o("  jldi j10, 3"); o("  jsub j10, j9, j10"); o("  jjz j10, up")
o("  jldi j10, 1"); o("  jsub j10, j9, j10"); o("  jjz j10, move")
o("  jret")
o("down:                           ; j1, j2 = the cell")
ld("j9", EV + 24); o("  jldi j10, 1"); o("  jsub j10, j9, j10"); o("  jjnz j10, down_out   ; only the left button")
o("  jjn j1, down_out")
o("  jldi j9, 1"); st("j9", G["CHANGED"])
o("  jcall novelty                  ; a click: a new round of novelty")
o("  ; the taskbar first (it is in front): the start button brings the closed windows back")
o("  jldi j10, 94"); o("  jsub j10, j2, j10"); o("  jjn j10, down_windows")
x0, y0, x1, y1 = START
for r, lo, hi in (("j1", x0, x1), ("j2", y0 + 94, y1 + 94)):
    o("  jldi j10, %d" % lo); o("  jsub j10, %s, j10" % r); o("  jjn j10, down_out")
    o("  jldi j10, %d" % hi); o("  jsub j10, %s, j10" % r); o("  jjnn j10, down_out")
o("  jcall revive")
cx, cy, r = part_geom(2, 3)
o("  jldi j1, 3                     ; and the start button itself pulses")
o("  jldi j2, 2"); li("j3", cx); li("j4", cy); li("j5", S_START * 256 // r); o("  jcall kick")
o("  jret")
o("down_windows:                   ; the windows, front to back")
ld("j9", G["Z1"]); o("  jcall hit"); o("  jjnz j0, down_out")
ld("j9", G["Z0"]); o("  jcall hit")
o("down_out:")
o("  jret")
o("hit:                            ; the window j9 at the cell j1, j2: j0 = 1 if it was hit (and what it did)")
o("  jjnz j9, hit_1"); o("  jjmp hit_0")
for p in (0, 1):
    name, rects, (hx, hy), w, h, tb, close = PIECES[p]
    o("hit_%d:                          ; %s" % (p, name))
    o("  jldi j0, 0")
    ld("j9", piece(p, STATE)); o("  jldi j10, 1"); o("  jsub j10, j9, j10"); o("  jjnz j10, hit_%d_no" % p)
    ld("j9", piece(p, OX)); o("  jldi j10, 8"); o("  jsar j9, j9, j10"); ld("j11", piece(p, OY)); o("  jsar j11, j11, j10")
    o("  jsub j3, j1, j9               ; the cell in the window"); o("  jsub j4, j2, j11")
    o("  jjn j3, hit_%d_no" % p); o("  jjn j4, hit_%d_no" % p)
    o("  jldi j10, %d" % w); o("  jsub j10, j3, j10"); o("  jjnn j10, hit_%d_no" % p)
    o("  jldi j10, %d" % h); o("  jsub j10, j4, j10"); o("  jjnn j10, hit_%d_no" % p)
    o("  jldi j0, 1")
    o("  ; to the front"); ld("j9", G["Z1"]); o("  jldi j10, %d" % p); o("  jsub j10, j9, j10"); fr = lab("front")
    o("  jjz j10, %s" % fr); st("j9", G["Z0"]); o("  jldi j10, %d" % p); st("j10", G["Z1"])
    o("%s:" % fr)
    def inrect(rect, miss):
        a0, b0, a1, b1 = rect
        for rr, lo, hi in (("j3", a0, a1), ("j4", b0, b1)):
            o("  jldi j10, %d" % lo); o("  jsub j10, %s, j10" % rr); o("  jjn j10, %s" % miss)
            o("  jldi j10, %d" % hi); o("  jsub j10, %s, j10" % rr); o("  jjnn j10, %s" % miss)
    miss = lab("not_close"); o("  ; the close button: it flies apart"); inrect(close, miss)
    ld("j1", piece(p, FIRST)); ld("j2", piece(p, END))
    li("j3", w * 128); li("j4", h * 128); o("  jcall explode")
    o("  jldi j9, 0"); st("j9", piece(p, STATE), "flying")
    ld("j9", G["GRAB"]); o("  jldi j10, %d" % (p + 1)); o("  jsub j10, j9, j10"); keep = lab("held")
    o("  jjnz j10, %s" % keep); st("j14", G["GRAB"]); o("%s:" % keep)
    o("  jldi j0, 1"); o("  jret")
    o("%s:" % miss)
    if p == 0:
        for grp, rect in TOWERS:
            miss = lab("not_tower"); o("  ; little tower %d: a kick" % grp); inrect(rect, miss)
            cx, cy, r = part_geom(0, grp)
            o("  jldi j1, %d" % grp); o("  jldi j2, 0"); li("j3", cx); li("j4", cy); li("j5", S_KICK * 256 // r)
            o("  jcall kick"); o("  jldi j0, 1"); o("  jret")
            o("%s:" % miss)
    o("  ; the title bar: grabbed")
    o("  jldi j10, %d" % tb); o("  jsub j10, j4, j10"); o("  jjnn j10, hit_%d_no" % p)
    o("  jldi j9, %d" % (p + 1)); st("j9", G["GRAB"]); st("j3", G["GDX"]); st("j4", G["GDY"])
    ld("j1", piece(p, FIRST)); ld("j2", piece(p, END)); o("  jcall stiffen")
    o("  jldi j0, 1")
    o("hit_%d_no:" % p)
    o("  jret")
o("up:                             ; a window held is let go: every spring as it was")
ld("j9", G["GRAB"]); o("  jjz j9, up_out")
o("  jldi j10, 1"); o("  jsub j9, j9, j10"); o("  jldi j10, %d" % PIECE_SIZE); o("  jmul j10, j9, j10"); li("j11", PIECE)
o("  jadd j10, j10, j11"); o("  jld j1, j10, %d" % FIRST); o("  jld j2, j10, %d" % END); o("  jldi j3, %d" % K_BASE)
o("  jcall setk"); st("j14", G["GRAB"]); o("  jldi j9, 1"); st("j9", G["CHANGED"])
o("up_out:")
o("  jret")
o("move:                           ; the window held follows the pointer (its origin, kept on the screen)")
ld("j9", G["GRAB"]); o("  jjz j9, move_out"); o("  jjn j1, move_out"); o("  jjn j2, move_out")
o("  jldi j10, 1"); o("  jsub j10, j9, j10"); o("  jjnz j10, move_1")
for p in (0, 1):
    name, rects, (hx, hy), w, h, tb, close = PIECES[p]
    o("move_%d:" % p)
    ld("j9", G["GDX"]); o("  jsub j3, j1, j9"); ld("j9", G["GDY"]); o("  jsub j4, j2, j9")
    for rr, lo, hi in (("j3", -(w - 12), W - 12), ("j4", 0, 94 - tb)):
        a, b = lab("low"), lab("high")
        li("j10", lo); o("  jsub j11, %s, j10" % rr); o("  jjnn j11, %s" % a); o("  jadd %s, j10, j14" % rr); o("%s:" % a)
        li("j10", hi); o("  jsub j11, j10, %s" % rr); o("  jjnn j11, %s" % b); o("  jadd %s, j10, j14" % rr); o("%s:" % b)
    o("  jldi j10, 8"); o("  jshl j3, j3, j10"); o("  jshl j4, j4, j10"); st("j3", piece(p, OX)); st("j4", piece(p, OY))
    o("  jldi j9, 1"); st("j9", G["CHANGED"]); o("  jret")
o("move_out:")
o("  jret")

# ---- the body's own exploration
o("; ---- exploration: one push it has not tried, among those whose piece is alive; none left: it rests")
o("explore:")
o("  jldi j2, 0                     ; how many it may still try")
o("  jldi j1, 0")
o("explore_count:")
o("  jcall untried"); o("  jadd j2, j2, j9"); o("  jldi j9, 1"); o("  jadd j1, j1, j9"); o("  jldi j9, %d" % COMBOS)
o("  jsub j9, j1, j9"); o("  jjnz j9, explore_count")
o("  jjnz j2, explore_pick")
st("j14", G["EXPLORE"], "all tried: it rests"); o("  jret")
o("explore_pick:                   ; the r-th untried one, r from the generator")
o("  jcall rand"); o("  jldi j9, 1"); o("  jshr j10, j10, j9"); o("  jdiv j11, j10, j2"); o("  jmul j11, j11, j2")
o("  jsub j3, j10, j11")
o("  jldi j1, 0")
o("explore_find:")
o("  jcall untried"); o("  jjz j9, explore_next"); o("  jjz j3, explore_found"); o("  jldi j9, 1"); o("  jsub j3, j3, j9")
o("explore_next:")
o("  jldi j9, 1"); o("  jadd j1, j1, j9"); o("  jjmp explore_find")
o("explore_found:")
li("j9", TRIED); o("  jadd j9, j9, j1"); o("  jldi j10, 1"); o("  jstb j10, j9, 0   ; never again in this round")
o("  ; combination j1: part = j1 >> 4, push = (j1 >> 2) & 3, variant = j1 & 3")
o("  jldi j9, 4"); o("  jshr j4, j1, j9"); o("  jldi j9, 6"); o("  jshl j4, j4, j9"); li("j9", PARTS); o("  jadd j4, j4, j9")
o("  jld j5, j4, 0"); o("  jldi j9, 7"); o("  jshl j5, j5, j9"); li("j9", PIECE); o("  jadd j5, j5, j9")
o("  jld j9, j5, %d" % FIRST); st("j9", G["PFIRST"]); o("  jld j9, j5, %d" % END); st("j9", G["PEND2"])
o("  jld j9, j4, 8"); st("j9", G["PG"]); o("  jld j9, j4, 16"); st("j9", G["PCX"]); o("  jld j9, j4, 24"); st("j9", G["PCY"])
for a in ("A00", "A01", "A10", "A11", "C0", "C1"):
    st("j14", G[a])
o("  jldi j9, 2"); o("  jshr j6, j1, j9"); o("  jldi j9, 3"); o("  jand j6, j6, j9"); o("  jand j7, j1, j9")
o("  jldi j9, 1"); o("  jand j8, j7, j9                ; strength (or sign, for a shear)")
o("  jld j3, j4, 32"); o("  jjz j8, explore_m"); o("  jld j3, j4, 40")
o("explore_m:")
o("  jldi j9, 2"); o("  jand j8, j7, j9"); o("  jjz j8, explore_sign"); o("  jsub j3, j14, j3    ; the other way")
o("explore_sign:")
o("  jjnz j6, explore_not_shove")
o("  ; shove: one of four directions")
o("  jld j3, j4, 48"); o("  jldi j9, 2"); o("  jand j8, j7, j9"); o("  jjz j8, explore_shove"); o("  jsub j3, j14, j3")
o("explore_shove:")
o("  jldi j9, 1"); o("  jand j8, j7, j9"); o("  jjnz j8, explore_down")
st("j3", G["C0"]); o("  jjmp explore_push")
o("explore_down:")
st("j3", G["C1"]); o("  jjmp explore_push")
o("explore_not_shove:")
o("  jldi j9, 1"); o("  jsub j9, j6, j9"); o("  jjnz j9, explore_not_pulse")
o("  ; pulse: out or in, small or big"); st("j3", G["A00"]); st("j3", G["A11"]); o("  jjmp explore_push")
o("explore_not_pulse:")
o("  jldi j9, 2"); o("  jsub j9, j6, j9"); o("  jjnz j9, explore_shear")
o("  ; twist: one way or the other, small or big"); o("  jsub j9, j14, j3"); st("j9", G["A01"]); st("j3", G["A10"])
o("  jjmp explore_push")
o("explore_shear:                  ; shear: across (x by y) or along (y by x), one way or the other")
o("  jld j3, j4, 40"); o("  jldi j9, 1"); o("  jand j8, j7, j9"); o("  jjz j8, explore_shear_sign"); o("  jsub j3, j14, j3")
o("explore_shear_sign:")
o("  jldi j9, 2"); o("  jand j8, j7, j9"); o("  jjnz j8, explore_along"); st("j3", G["A01"]); o("  jjmp explore_push")
o("explore_along:")
st("j3", G["A10"])
o("explore_push:")
o("  jcall push"); o("  jret")
o("untried:                        ; j1 = a combination -> j9 = 1 if it was not tried and its piece is alive")
li("j9", TRIED); o("  jadd j9, j9, j1"); o("  jldb j9, j9, 0"); o("  jjnz j9, untried_no")
o("  jldi j9, 4"); o("  jshr j10, j1, j9"); o("  jldi j9, 6"); o("  jshl j10, j10, j9"); li("j9", PARTS); o("  jadd j10, j10, j9")
o("  jld j10, j10, 0"); o("  jldi j9, 7"); o("  jshl j10, j10, j9"); li("j9", PIECE + STATE); o("  jadd j10, j10, j9")
o("  jld j10, j10, 0"); o("  jldi j9, 1"); o("  jsub j9, j10, j9"); o("  jjnz j9, untried_no")
o("  jldi j9, 1"); o("  jret")
o("untried_no:")
o("  jldi j9, 0"); o("  jret")
o("novelty:                        ; a new round: nothing tried yet")
li("j9", TRIED); li("j10", TRIED + COMBOS); o("  jldi j11, 1")
o("novelty_lap:")
o("  jstb j14, j9, 0"); o("  jadd j9, j9, j11"); o("  jsub j12, j10, j9"); o("  jjnz j12, novelty_lap")
o("  jldi j9, 1"); st("j9", G["EXPLORE"]); o("  jret")
o("kick:                           ; a pulse on group j1 of piece j2 around j3, j4 with m = j5")
o("  jldi j10, %d" % PIECE_SIZE); o("  jmul j10, j2, j10"); li("j11", PIECE); o("  jadd j10, j10, j11")
o("  jld j9, j10, %d" % FIRST); st("j9", G["PFIRST"]); o("  jld j9, j10, %d" % END); st("j9", G["PEND2"])
st("j1", G["PG"]); st("j3", G["PCX"]); st("j4", G["PCY"]); st("j5", G["A00"]); st("j5", G["A11"])
for a in ("A01", "A10", "C0", "C1"):
    st("j14", G[a])
o("  jcall push"); o("  jret")
o("push:                           ; dv = A (home - centre) >> 8 + C, on the particles of the group (0: all)")
ld("j1", G["PFIRST"]); ld("j2", G["PEND2"]); ld("j3", G["PG"]); ld("j4", G["PCX"]); ld("j5", G["PCY"])
o("  jldi j13, 64"); o("  jldi j15, 8")
o("push_lap:")
o("  jjz j3, push_it"); o("  jldb j9, j1, 60"); o("  jsub j9, j9, j3"); o("  jjnz j9, push_next")
o("push_it:")
o("  jld j6, j1, 0"); o("  jsub j6, j6, j4"); o("  jld j7, j1, 8"); o("  jsub j7, j7, j5")
for a, b, c, off in (("A00", "A01", "C0", 32), ("A10", "A11", "C1", 40)):
    ld("j8", G[a]); o("  jmul j8, j8, j6"); ld("j9", G[b]); o("  jmul j9, j9, j7"); o("  jadd j8, j8, j9")
    o("  jsar j8, j8, j15"); ld("j9", G[c]); o("  jadd j8, j8, j9")
    o("  jld j9, j1, %d" % off); o("  jadd j9, j9, j8"); o("  jst j9, j1, %d" % off)
o("push_next:")
o("  jadd j1, j1, j13"); o("  jsub j9, j2, j1"); o("  jjnz j9, push_lap")
o("  jret")
o("revive:                         ; the windows that flew apart come back: alive, home, still, springs as born")
for p in (0, 1):
    nxt = lab("alive")
    ld("j9", piece(p, STATE)); o("  jldi j10, 1"); o("  jsub j10, j9, j10"); o("  jjz j10, %s" % nxt)
    o("  jldi j9, 1"); st("j9", piece(p, STATE))
    ld("j9", piece(p, HOX)); st("j9", piece(p, OX)); ld("j9", piece(p, HOY)); st("j9", piece(p, OY))
    ld("j1", piece(p, FIRST)); ld("j2", piece(p, END)); o("  jcall still")
    o("%s:" % nxt)
o("  jret")
o("still:                          ; j1..j2: in, still, k as born")
o("  jldi j13, 64"); o("  jldi j3, %d" % K_BASE)
o("still_lap:")
o("  jstb j14, j1, 61"); o("  jst j14, j1, 32"); o("  jst j14, j1, 40"); o("  jst j3, j1, 48")
o("  jadd j1, j1, j13"); o("  jsub j9, j2, j1"); o("  jjnz j9, still_lap")
o("  jret")
o("setk:                           ; j1..j2: every spring k = j3")
o("  jldi j13, 64")
o("setk_lap:")
o("  jst j3, j1, 48"); o("  jadd j1, j1, j13"); o("  jsub j9, j2, j1"); o("  jjnz j9, setk_lap")
o("  jret")
o("stiffen:                        ; j1..j2 grabbed at the cell j3, j4 of its window: k = %d + %d / (%d + d)" % (K_FAR, (K_NEAR - K_FAR) * D0, D0))
o("  jldi j5, 8"); o("  jldi j6, %d" % D0); li("j7", (K_NEAR - K_FAR) * D0); o("  jldi j13, 64")
o("stiffen_lap:")
o("  jld j8, j1, 0"); o("  jsar j8, j8, j5"); o("  jsub j8, j8, j3"); o("  jjnn j8, stiffen_x"); o("  jsub j8, j14, j8")
o("stiffen_x:")
o("  jld j9, j1, 8"); o("  jsar j9, j9, j5"); o("  jsub j9, j9, j4"); o("  jjnn j9, stiffen_y"); o("  jsub j9, j14, j9")
o("stiffen_y:")
o("  jadd j8, j8, j9"); o("  jadd j8, j8, j6"); o("  jdiv j8, j7, j8"); o("  jldi j9, %d" % K_FAR); o("  jadd j8, j8, j9")
o("  jst j8, j1, 48"); o("  jadd j1, j1, j13"); o("  jsub j9, j2, j1"); o("  jjnz j9, stiffen_lap")
o("  jret")
o("explode:                        ; j1..j2 fly apart from the centre j3, j4: v = r / %d + noise, at least 1 cell/frame" % (1 << EXPLODE_SHIFT))
o("  jldi j13, 64")
o("explode_lap:")
for off, voff, r in ((0, 32, "j3"), (8, 40, "j4")):
    neg, ok = lab("inwards"), lab("away")
    o("  jld j8, j1, %d" % off); o("  jsub j8, j8, %s" % r); o("  jldi j0, %d" % EXPLODE_SHIFT); o("  jsar j8, j8, j0")
    o("  jcall rand"); o("  jldi j0, 511"); o("  jand j10, j10, j0"); o("  jadd j8, j8, j10"); o("  jldi j0, 256"); o("  jsub j8, j8, j0")
    o("  jjn j8, %s" % neg); o("  jadd j8, j8, j0"); o("  jjmp %s" % ok)
    o("%s:" % neg); o("  jsub j8, j8, j0")
    o("%s:" % ok); o("  jst j8, j1, %d" % voff)
o("  jadd j1, j1, j13"); o("  jsub j9, j2, j1"); o("  jjnz j9, explode_lap")
o("  jret")

# ---- the frame
o("; ---- one step of every piece: springs for the living, flight for the closed; MOVING = the ones not at rest")
o("step:")
st("j14", G["MOVING"])
for p in range(3):
    fly, done = lab("fly"), lab("stepped")
    ld("j9", piece(p, STATE)); o("  jldi j10, 1"); o("  jsub j10, j9, j10"); o("  jjnz j10, %s" % fly)
    ld("j1", piece(p, FIRST)); ld("j2", piece(p, END)); ld("j3", piece(p, OX)); ld("j4", piece(p, OY))
    o("  jcall spring"); o("  jjmp %s" % done)
    o("%s:" % fly)
    o("  jjnz j9, %s                ; (2: all of it gone)" % done)
    ld("j1", piece(p, FIRST)); ld("j2", piece(p, END)); o("  jcall fly"); o("  jjnz j0, %s" % done)
    o("  jldi j9, 2"); st("j9", piece(p, STATE), "every particle left the screen")
    o("%s:" % done)
o("  jret")
o("spring:                         ; j1..j2 towards the origin j3, j4")
o("  jldi j0, 0"); o("  jldi j6, %d" % DAMP); o("  jldi j7, 8"); o("  jldi j13, %d" % REST)
o("spring_lap:")
o("  jld j5, j1, 48                 ; k")
for axis, (h, pp, v, a, b) in (("x", (0, 16, 32, "j3", "spring_x")), ("y", (8, 24, 40, "j4", "spring_y"))):
    o("  jld j8, j1, %d" % h); o("  jadd j8, j8, %s           ; its home" % a); o("  jld j9, j1, %d" % pp)
    o("  jsub j10, j8, j9"); o("  jmul j10, j10, j5"); o("  jsar j10, j10, j7")
    o("  jld j11, j1, %d" % v); o("  jadd j11, j11, j10"); o("  jmul j10, j11, j6"); o("  jsar j10, j10, j7")
    o("  jsub j11, j11, j10"); o("  jadd j9, j9, j11"); o("  jst j9, j1, %d" % pp); o("  jst j11, j1, %d" % v)
    if axis == "x":
        o("  jldi j15, 0                   ; at rest? (distance and speed under %d)" % REST)
    o("  jsub j12, j8, j9")
    o("  jadd j10, j12, j13"); o("  jjn j10, %s_moves" % b); o("  jsub j10, j13, j12"); o("  jjn j10, %s_moves" % b)
    o("  jadd j10, j11, j13"); o("  jjn j10, %s_moves" % b); o("  jsub j10, j13, j11"); o("  jjnn j10, %s_rests" % b)
    o("%s_moves:" % b); o("  jldi j15, 1"); o("%s_rests:" % b)
o("  jjnz j15, spring_moves")
o("  jld j8, j1, 0                 ; at rest: exactly home, still"); o("  jadd j8, j8, j3"); o("  jst j8, j1, 16")
o("  jld j8, j1, 8"); o("  jadd j8, j8, j4"); o("  jst j8, j1, 24"); o("  jst j14, j1, 32"); o("  jst j14, j1, 40")
o("  jjmp spring_next")
o("spring_moves:")
o("  jldi j10, 1"); o("  jadd j0, j0, j10")
o("spring_next:")
o("  jldi j10, 64"); o("  jadd j1, j1, j10"); o("  jsub j10, j2, j1"); o("  jjnz j10, spring_lap")
ld("j10", G["MOVING"]); o("  jadd j10, j10, j0"); st("j10", G["MOVING"])
o("  jret")
o("fly:                            ; j1..j2 fly straight on; one that leaves the screen is out -> j0 = those still in")
o("  jldi j0, 0"); o("  jldi j3, 256"); li("j4", (W + 1) * 256); li("j5", (H + 1) * 256); o("  jldi j13, 64")
o("fly_lap:")
o("  jldb j9, j1, 61"); o("  jjnz j9, fly_next")
o("  jld j9, j1, 16"); o("  jld j10, j1, 32"); o("  jadd j9, j9, j10"); o("  jst j9, j1, 16")
o("  jld j11, j1, 24"); o("  jld j10, j1, 40"); o("  jadd j11, j11, j10"); o("  jst j11, j1, 24")
o("  jadd j10, j9, j3"); o("  jjn j10, fly_out"); o("  jsub j10, j9, j4"); o("  jjnn j10, fly_out")
o("  jadd j10, j11, j3"); o("  jjn j10, fly_out"); o("  jsub j10, j11, j5"); o("  jjnn j10, fly_out")
o("  jldi j10, 1"); o("  jadd j0, j0, j10"); o("  jjmp fly_next")
o("fly_out:")
o("  jldi j10, 1"); o("  jstb j10, j1, 61")
o("fly_next:")
o("  jadd j1, j1, j13"); o("  jsub j10, j2, j1"); o("  jjnz j10, fly_lap")
ld("j10", G["MOVING"]); o("  jadd j10, j10, j0"); st("j10", G["MOVING"])
o("  jret")
q = bytes(BACKGROUND) * 8
qs = [int.from_bytes(q[i:i + 8], "little") for i in (0, 8, 16)]
o("fill:                           ; the desktop's colour, 24 bytes (8 cells) at a time")
li("j1", RGB); li("j2", RGB + 3 * W * H)
for r, v in zip(("j3", "j4", "j5"), qs):
    li(r, v)
o("  jldi j6, 24")
o("fill_lap:")
o("  jst j3, j1, 0"); o("  jst j4, j1, 8"); o("  jst j5, j1, 16"); o("  jadd j1, j1, j6"); o("  jsub j7, j2, j1"); o("  jjnz j7, fill_lap")
o("  jret")
o("draw:                           ; j1..j2 at their rounded cells, on the screen only")
o("  jldi j3, 128"); o("  jldi j4, 8"); o("  jldi j5, %d" % W); o("  jldi j6, %d" % H); o("  jldi j7, 3"); li("j8", RGB); o("  jldi j13, 64")
o("draw_lap:")
o("  jldb j9, j1, 61"); o("  jjnz j9, draw_next")
o("  jld j9, j1, 16"); o("  jadd j9, j9, j3"); o("  jsar j9, j9, j4"); o("  jjn j9, draw_next"); o("  jsub j10, j9, j5"); o("  jjnn j10, draw_next")
o("  jld j10, j1, 24"); o("  jadd j10, j10, j3"); o("  jsar j10, j10, j4"); o("  jjn j10, draw_next"); o("  jsub j11, j10, j6"); o("  jjnn j11, draw_next")
o("  jmul j11, j10, j5"); o("  jadd j11, j11, j9"); o("  jmul j11, j11, j7"); o("  jadd j11, j11, j8")
o("  jldb j12, j1, 56"); o("  jstb j12, j11, 0"); o("  jldb j12, j1, 57"); o("  jstb j12, j11, 1"); o("  jldb j12, j1, 58"); o("  jstb j12, j11, 2")
o("draw_next:")
o("  jadd j1, j1, j13"); o("  jsub j9, j2, j1"); o("  jjnz j9, draw_lap")
o("  jret")
o("born:                           ; one particle per cell of x j1..j3, y j2..j4 (exclusive) of the piece being built,")
o("                                ; colour j5 j6 j7, group j8; it is born somewhere on the screen")
o("  jadd j9, j2, j14")
o("born_row:")
o("  jadd j13, j1, j14")
o("born_cell:")
ld("j15", G["PEND"])
o("  jldi j0, 8"); o("  jshl j10, j13, j0"); o("  jst j10, j15, 0"); o("  jshl j10, j9, j0"); o("  jst j10, j15, 8")
o("  jcall rand"); li("j0", 0xFFFF); o("  jand j10, j10, j0"); o("  jldi j0, %d" % W); o("  jmul j10, j10, j0"); o("  jldi j0, 8"); o("  jshr j10, j10, j0"); o("  jst j10, j15, 16")
o("  jcall rand"); li("j0", 0xFFFF); o("  jand j10, j10, j0"); o("  jldi j0, %d" % H); o("  jmul j10, j10, j0"); o("  jldi j0, 8"); o("  jshr j10, j10, j0"); o("  jst j10, j15, 24")
o("  jst j14, j15, 32"); o("  jst j14, j15, 40"); o("  jldi j0, %d" % K_BASE); o("  jst j0, j15, 48")
o("  jst j14, j15, 56               ; (colour, group and out, cleared)")
o("  jstb j5, j15, 56"); o("  jstb j6, j15, 57"); o("  jstb j7, j15, 58"); o("  jstb j8, j15, 60")
o("  jldi j0, 64"); o("  jadd j15, j15, j0"); st("j15", G["PEND"])
o("  jldi j0, 1"); o("  jadd j13, j13, j0"); o("  jsub j0, j3, j13"); o("  jjnz j0, born_cell")
o("  jldi j0, 1"); o("  jadd j9, j9, j0"); o("  jsub j0, j4, j9"); o("  jjnz j0, born_row")
o("  jret")
o("rand:                           ; j10 = the next of the generator (xorshift64); uses j11, j12")
ld("j10", G["RNG"])
for sh, op in ((13, "jshl"), (7, "jshr"), (17, "jshl")):
    o("  jldi j12, %d" % sh); o("  %s j11, j10, j12" % op); o("  jxor j10, j10, j11")
st("j10", G["RNG"]); o("  jret")
o("tocar:                          ; one request (j10 type, j11 a, j12 b) -> j13 answer, j12 = b as it came back")
o("  jldi j13, %Xh" % QUEUE); o("  jldi j15, 1"); o("  jst j15, j13, 0"); o("  jst j10, j13, 8"); o("  jst j11, j13, 16")
o("  jst j12, j13, 24"); o("  jsys j15, j13"); o("  jld j12, j13, 24"); o("  jld j13, j13, 32"); o("  jret")
open(r"E:\Janax\razar\cuerpo\vivo.jsm", "w", encoding="utf-8", newline="\n").write("\n".join(L) + "\n")
print("ok", len(L), "lines,", n, "particles,", sum(len(b) for _, b, _, _ in plan), "rectangles")
