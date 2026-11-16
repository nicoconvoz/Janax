"""Generates formas.jsm: Razar's own forms. No windows, no title bars, no close buttons: the screen holds forms that
Razar grows from its own winning organs, letter by letter, over the organ alphabet (letters 1-9). When nobody touches
it, it babbles mutations of its forms (never one it already tried in this population), judges each with the same judge
it reads with (short and new), and a winner transforms on screen; every loser is archived with the reason it lost.
Its forms and its archive live in its folder, so the next run starts where this one left.

Python only reads what Razar learned (aprendido.txt: the organ landscape, the towers, the opposites) and writes the
program; the growing, the judging and the mutating run in jsm, inside Janax."""
import os, re

# gen_comer.py runs this same generator with its hooks (COMER): Razar's forms, fed on clouds. Without it, formas.jsm.
COMER = globals().get("COMER")
# gen_luma.py adds the creatures (vida, as a module) through gen_comer.py with its hooks (LUMA): one program, one window.
LUMA = globals().get("LUMA")
AQUI = os.path.dirname(os.path.abspath(__file__))
PROYECTO = os.path.normpath(os.path.join(AQUI, "..", ".."))

# ---- what Razar learned (aprendido.txt)
organs_path, towers, opposites = None, [], []
for line in open(os.path.join(AQUI, "aprendido.txt"), encoding="utf-8"):
    w = line.split()
    if not w or w[0].startswith("#"):
        continue
    if w[0] == "organos":
        organs_path = os.path.join(PROYECTO, w[1])
    elif w[0] == "torrecita":
        towers.append(tuple(int(c) for c in w[1]))
    elif w[0] == "opuesto":
        opposites.append((w[1], w[2]))
landscape = []
for line in open(organs_path, encoding="utf-8"):
    m = re.match(r"organo (\d+) = (-?\d+)", line)
    if m:
        landscape.append((int(m.group(2)), m.group(1)))
landscape.sort(key=lambda s: -s[0])           # stable: ties keep the landscape's order

# ---- the screen and the forms (criteria, not measurements, unless said)
W, H = 160, 100
NF = 8                      # forms: the screen split in 4 x 2 rooms (criterion); the 8 best organs fill them
RW, RH = W // 4, H // 2     # a room: 40 x 50 cells; the judge sees a form inside its room
ARM = RW // 2 // 4          # 5: four arms in a row reach the edge of the room, one per word of the window
# The body (a rule, not a number): a form is drawn at the scale S that makes it fill its room, relative to its own
# extent, and every cell of it is a square stroke of T = S*ARM/2 drawn cells: half the distance between two parallel
# arms, so neighbouring arms keep a gap as wide as the stroke and the form reads as a body with openings, at any size.
# S fits the drawn extent (w-1)*S + T <= the room, so S = room / (w - 1 + ARM/2), per axis, the smaller one.
# The hand: a form is touched within T of any of its drawn cells (the stroke's half plus a margin of the same size).
SEEDS = [s for _, s in landscape[:NF]]
SEED_SCORES = [v for v, _ in landscape[:NF]]
LMAX = 31                   # letters a recipe may hold: one slot is 32 bytes (storage criterion; the room, not this,
                            # is what stops a recipe from growing: arms that leave it draw nothing)
ROOMCELLS = RW * RH         # 2000: a form has at most one particle per cell of its room (so this is not a cap)
DIRS = [(1, 0), (0, 1), (-1, 0), (0, -1)]   # word 1..4 of the window = east, south, west, north of the form

# The reading of a letter (a design choice, criterion: kept as data so it can change):
#   1-4 "mix word k into the frame": an arm of ARM cells towards direction k; the pen ends at its tip.
#   5-8 "word k is the hole: the frame announces it and starts again": the pen goes back to the seed and jumps ARM
#       cells towards direction k without drawing (an opening); the next arm starts beyond it.
#   9   "the empty hole: the frame says itself as it is": the form so far is mirrored across the seed's vertical axis.

# The model (fixed point x256, one step per frame): the same springs as vivo.jsm (criteria, said there).
K_BASE, DAMP, REST = 20, 40, 32
K_NEAR, K_FAR, D0 = 64, 8, 12
FRAME_MS = 33
PAUSE_MS = 300
GROW_FRAMES = PAUSE_MS // FRAME_MS   # 9: one letter grows every ~0.3 s, the same breath vivo leaves between two pushes
TRIALS = NF                          # thoughts per frame: one per form on average (criterion)
PUSH_M = 64                          # push~pop: dv = (p - seed) * 64/256 per frame; amplitude ~ 0.25/w = 0.9 r: the form
                                     # swells to about twice its size and comes back (w = 0.28 rad/frame, vivo's spring)
HBITS = 15                           # the tried table: 2^15 slots; the largest neighbourhood of a population is
HN = 1 << HBITS                      # 8 x (8*31 + 9*32 + 31 + T*32 + 7*31) < 7.000: twice that stays under half full
BACKGROUND = (0x1F, 0x4E, 0x5A)      # vivo's desktop colour
# a hue per slot, warm for the organ that read the New Testament best, cool for the eighth (criterion)
PALETTE = [(0xFF, 0x6B, 0x6B), (0xFF, 0x9F, 0x43), (0xFF, 0xD9, 0x3D), (0x6B, 0xCB, 0x77),
           (0x4D, 0xD0, 0xC8), (0x4D, 0x96, 0xFF), (0x9B, 0x7B, 0xFF), (0xE0, 0x7B, 0xE0)]
DIM = 600                            # the brightness of a form worth nothing, per mille of its hue. Criterion, not a
                                     # measurement: at 400 a worthless green was lost on the background in the first
                                     # captures (2026-11-15); at 600 every hue of the palette stays apart from it
SEED = 0x2545F4914F6CDD1D
REASONS = ["replaced", "longer,not-new", "longer", "not-new", "crowds", "no-better"]

# The opposites Razar joined, as actions. Each gesture does one side; the other side undoes it.
VK = {"left": [0x25], "right": [0x27], "up": [0x26], "down": [0x28], "plus": [0xBB, 0x6B], "minus": [0xBD, 0x6D],
      "W": [0x57], "H": [0x48], "O": [0x4F], "C": [0x43], "Ins": [0x2D], "Del": [0x2E], "PgUp": [0x21],
      "PgDn": [0x22], "Home": [0x24], "End": [0x23], "B": [0x42], "E": [0x45], "D": [0x44], "Enter": [0x0D]}
ACTIONS = {  # pair: (what does the first, what does the second, what they do)
    ("open", "close"): ("O / a click", "C / a click", "the form unfolds from its seed / folds back into it"),
    ("show", "hide"): ("Insert", "Delete", "the form is drawn full / as a ghost"),
    ("min", "max"): ("-", "+", "half / double size (one step each, from as born)"),
    ("width", "height"): ("W", "H", "stretched along x / along y (one step each)"),
    ("left", "right"): ("left arrow", "right arrow", "mirrored to face left / as born"),
    ("up", "down"): ("up arrow", "down arrow", "as born / upside down"),
    ("top", "bottom"): ("Page Up", "Page Down", "drawn in front of all / behind all"),
    ("push", "pop"): ("right button down", "right button up", "a pulse out / in"),
    ("begin", "end"): ("B", "E", "grows again from its seed / is grown at once"),
    ("first", "last"): ("Home", "End", "the keys act on the first / the last form"),
    ("enable", "disable"): ("Enter", "D", "it mutates / it rests (drawn grey, never mutated)"),
}
for a, b in opposites:
    assert (a, b) in ACTIONS, "an opposite Razar learned has no action: %s~%s" % (a, b)

# ---- room 0
QUEUE, EV = 0x100, 0x140
GV = 0x200
FORMS, FSZ = 0x800, 256
POPC = 0x1000
OVL = 0x1100                # O[i][j]: cells forms i and j share (seed on seed), qwords
OVC = 0x1300                # the candidate's overlaps with each form
ZORD = 0x1340               # drawing order, back to front
GHL = 0x1380                # the forms of this frame's ghosts
DIRT = 0x13C0               # dx, dy of the four directions
CAND, TMP, TMP2 = 0x1400, 0x1440, 0x1480   # recipes: byte 0 = length, then the letters (48 bytes: room for 33)
SEEDR = 0x1500              # the seeds' recipes, 32 bytes each
TEXT = 0x1600               # the forms file, as text
LBL_F, LBL_A, MAGIC = 0x1800, 0x1810, 0x1820
PAL = 0x1840
RSN = 0x1900
ALINE = 0x1980
CLOUD = 0x2004              # so that the colours start 8-aligned
BITS = CLOUD + 28
RGB = BITS + W * H // 8
TOTAL = 28 + W * H // 8 + 3 * W * H
BMPS = 0xE400               # a bitmap per form: 50 rows of a qword (bit x of row y = cell x-20, y-25 of the room)
CBMP = BMPS + NF * 512
GHB = CBMP + 512            # the ghosts' bitmaps
GRID = 0x10800              # the cell -> particle map of the form being grown
FBUF = 0x14800              # the archive, read in pieces
RECLEN = 112
FCHUNK = RECLEN * 256
HASH = 0x20000
PART0 = 0x80000
PSZ = 128                   # a particle: hx hy px py vx vy k parent birth tx ty (qwords)
PREG = ROOMCELLS * PSZ
CREG = PART0 + NF * PREG    # the candidate's particles
ROOM = (CREG + PREG + 0xFFFF) & ~0xFFFF
assert RGB % 8 == 0 and RGB + 3 * W * H <= BMPS and GHB + NF * 512 <= GRID and GRID + ROOMCELLS * 8 <= FBUF
assert FBUF + FCHUNK <= HASH and HASH + HN * 8 <= PART0 and TMP2 + 48 <= SEEDR and TEXT + 399 <= LBL_F
if COMER:
    COMER.layout()          # its regions after the forms', a larger tried table; sets ROOM, HASH, HN
if LUMA:
    LUMA.layout(globals())  # the forms' cloud and the shared screen after them; sets ROOM, CLOUD, BITS, RGB
F_OX, F_OY, F_FIRST, F_COUNT, F_WORTH, F_GROWN, F_GTICK, F_MX, F_MY = 0, 8, 16, 24, 40, 48, 56, 64, 72
F_FOLD, F_SCALE, F_ASPECT, F_MIRROR, F_FLIP, F_HIDDEN, F_DISABLED = 80, 88, 96, 104, 112, 120, 128
F_CR, F_CG, F_CB, F_T, F_CX, F_BMP, F_COMP, F_NOV, F_REC = 136, 144, 152, 160, 168, 176, 224, 232, 192
F_S, F_CY = 184, 240         # the body: S = drawn cells per recipe cell (x256), CX CY = its centre, T = its stroke
P_HX, P_HY, P_PX, P_PY, P_VX, P_VY, P_K, P_PAR, P_BIRTH, P_TX, P_TY = 0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80
HDR_LEN, FLINE = 39, 45
FORMS_BYTES = HDR_LEN + NF * FLINE
assert FORMS_BYTES == 399

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
def J(*xs):
    for x in xs:
        o("  " + x)

G = {}
for i, name in enumerate(("REMAIN FOREVER CHANGED MOVING BLEFT FRAMES EXPLORE RNG GRAB GDX GDY DOWNX DOWNY MOVED "
                          "FOCUS EPOCH WINS WINSRUN RADIUS BUDGET WTOTAL WSTART WSTRIDE WALKI HCOUNT TOTAL WMAX GHN "
                          "TRN AH GREC GREG GBMP GKEEP GOX GOY GCOUNT TX TY PREV GT GC GDXA GDYA GK GN0 GI GMR GMP "
                          "JF JFA JCNT JJ JI JWC JCC JNC JWP JCP JNP JT2 JMX ALOSER AOTHER AREASON ATL ATW ASLOT "
                          "AF ASRC ADST AN AK SF SFA DGROWN PR PG PB HX HY DFA TF TI RI FH FN FP FOUND DT BX BY BN GMX GMY").split()):
    G[name] = GV + 8 * i
assert max(G.values()) < FORMS
if COMER:
    COMER.more_vars()
if LUMA:
    LUMA.more_vars(globals())
def ld(r, name, c=""): o("  jld %s, j14, %s%s" % (r, num(G[name]), ("   ; " + c) if c else ""))
def st(r, name, c=""): o("  jst %s, j14, %s%s" % (r, num(G[name]), ("   ; " + c) if c else ""))
def setg(name, v):
    li("j10", v); st("j10", name)
def incg(name, by=1):
    ld("j10", name); o("  jldi j11, %d" % by); o("  jadd j10, j10, j11"); st("j10", name)
def form_addr(r, idx):
    """r = the address of form idx (a register); uses j10."""
    o("  jldi j10, 8"); o("  jshl %s, %s, j10" % (r, idx)); li("j10", FORMS); o("  jadd %s, %s, j10" % (r, r))

# =====================================================================================================================
o("; Razar's own forms (Capitan: \"I want it to design its own forms that it learns, not a copy of Windows\").")
o("; A FORM is a recipe over Razar's organ alphabet, the letters 1 to 9 of its organs, grown from a seed, letter by")
o("; letter, into particles on springs (vivo.jsm's jelly). The reading of a letter (a design choice, criterion):")
o(";   1-4 mix word k: an arm of %d cells towards east, south, west, north; the pen ends at its tip." % ARM)
o(";   5-8 word k is the hole: back to the seed, and a jump of %d cells towards k without drawing (an opening)." % ARM)
o(";   9   the empty hole: the form so far is mirrored across the seed's vertical axis.")
o("; The first forms are its %d best organs over the New Testament: %s." % (NF, ", ".join(SEEDS)))
o("; THE JUDGE (the same as Razar's: short and new). Within its %dx%d room, a form covers C cells with a recipe of" % (RW, RH))
o(";   n letters: comp = C / (n log2 9) cells per bit (x1000), nov = 1 - (the most cells it shares with any other")
o(";   form) / C (x1000), worth = comp * nov. A mutation wins when the population's total worth grows.")
o("; MUTATIONS (the tried table: never one twice in a population): change, insert or delete a letter, insert a tower")
o(";   (%s), cross with another form. A walk with a random stride visits all of them once; when none is left it" % ", ".join("".join(map(str, t)) for t in towers))
o(";   calms and waits for ever. A gesture then opens a new round of longer jumps (two edits, three...).")
o("; A winner transforms (its particles flow to their new places); every loser goes to the archive with its reason.")
o("; Files in its folder: \"formas\" (%d bytes of text: the population) and \"archivo\" (%d-byte lines)." % (FORMS_BYTES, RECLEN))
o("; Ends when the window is closed: j0 = the forms it created in this run. Generated by gen_formas.py.")
if COMER:
    COMER.header()
o("include '../../escalon0/janax.inc'")
o("jfirst j1, %Xh" % ROOM)
o("jldi j14, 0                     ; j14 stays 0: the variables live below 8000h")

# ---- the cloud's header and its cells (as vivo)
cabeza = b"NUBE" + bytes([3]) + b"\x00\x00\x80\x3f" + b"\x00\x00" + bytes([1]) + b"\x00\x00\x80\x3f" + bytes(8) + W.to_bytes(2, "little") + H.to_bytes(2, "little")
assert len(cabeza) == 28
o("; ---- the cloud's header and its cells, once")
li("j1", CLOUD)
for i, b in enumerate(cabeza):
    o("  jldi j2, %s" % num(b)); o("  jstb j2, j1, %d" % i)
li("j1", BITS); li("j2", BITS + W * H // 8); o("  jldi j3, -1"); o("  jldi j4, 1")
o("init_bits:")
J("jstb j3, j1, 0", "jadd j1, j1, j4", "jsub j5, j2, j1", "jjnz j5, init_bits")
o("; ---- the bit count of every byte: pc(i) = pc(i >> 1) + (i & 1)")
li("j1", POPC); J("jstb j14, j1, 0", "jldi j2, 1", "jldi j3, 1")
o("init_popc:")
J("jshr j4, j2, j3", "jadd j4, j4, j1", "jldb j4, j4, 0", "jand j5, j2, j3", "jadd j4, j4, j5",
  "jadd j5, j1, j2", "jstb j4, j5, 0", "jadd j2, j2, j3", "jldi j5, 256", "jsub j5, j5, j2", "jjnz j5, init_popc")
o("; ---- the directions, the palette, the reasons, the labels, the seeds")
for i, (dx, dy) in enumerate(DIRS):
    li("j1", dx); o("  jst j1, j14, %s" % num(DIRT + 16 * i)); li("j1", dy); o("  jst j1, j14, %s" % num(DIRT + 16 * i + 8))
for i, c in enumerate(PALETTE):
    for k in range(3):
        li("j1", c[k]); o("  jst j1, j14, %s" % num(PAL + 24 * i + 8 * k))
def put_string(addr, s, width):
    bs = s.encode().ljust(width, b" ")
    for i, b in enumerate(bs):
        o("  jldi j1, %s" % num(b)); o("  jstb j1, j14, %s" % num(addr + i))
for i, r in enumerate(REASONS):
    assert len(r) <= 15
    put_string(RSN + 16 * i, r, 15)
put_string(LBL_F, "formas", 6); put_string(LBL_A, "archivo", 7); put_string(MAGIC, "formas1 ", 8)
for f, s in enumerate(SEEDS):
    o("; seed %d: organ %s (it scored %d over the New Testament)" % (f, s, SEED_SCORES[f]))
    o("  jldi j1, %d" % len(s)); o("  jstb j1, j14, %s" % num(SEEDR + 32 * f))
    for i, ch in enumerate(s):
        o("  jldi j1, %s" % ch); o("  jstb j1, j14, %s" % num(SEEDR + 32 * f + 1 + i))
    o("  jldi j1, %d" % f); o("  jst j1, j14, %s" % num(ZORD + 8 * f))
o("; ---- the variables")
setg("RNG", SEED); setg("RADIUS", 1); setg("EXPLORE", 1)
if COMER:
    COMER.init()
if LUMA:
    LUMA.init(globals())
o("; ---- the forms: what the folder kept, or the seeds; each at the centre of its room, every particle at its seed")
o("  jcall r_load_forms")
for f in range(NF):
    hx, hy = RW // 2 + RW * (f % 4), RH // 2 + RH * (f // 4)
    fa = FORMS + FSZ * f
    li("j9", fa)
    for fld, v in ((F_OX, hx * 256), (F_OY, hy * 256),
                   (F_FIRST, PART0 + f * PREG), (F_BMP, BMPS + 512 * f), (F_GTICK, GROW_FRAMES)):
        li("j1", v); o("  jst j1, j9, %d" % fld)
    o("  jldi j1, %d" % f); o("  jcall r_regrow")
o("  jcall r_recompute")
o("  jcall r_clear_hash")
o("  jcall r_load_archive")
o("  jcall r_new_walk")
o("  jcall r_save_forms             ; the folder holds the population from the start")

# ---- the living loop (vivo's, without its pauses: here a thought takes a frame)
o("; ---- the living loop: wait for an event or for the time to run out, then a frame")
o("main:")
ld("j12", "REMAIN"); ld("j9", "FOREVER"); J("jjz j9, main_wait", "jldi j12, -1                   ; for ever")
o("main_wait:")
J("jldi j10, 41"); li("j11", EV); J("jcall r_tocar")
st("j12", "BLEFT", "what was left of the wait")
J("jjn j13, main_bad", "jjz j13, main_time")
st("j14", "CHANGED"); J("jcall r_handle")
ld("j9", "FOREVER"); J("jjz j9, main_frames")
ld("j9", "CHANGED"); J("jjz j9, main")
st("j14", "FOREVER"); J("jjmp frame")
o("main_frames:                    ; between two frames: what is left of this one")
ld("j12", "BLEFT"); st("j12", "REMAIN"); J("jjz j12, frame", "jjmp main")
o("main_time:")
ld("j9", "FOREVER"); J("jjz j9, frame")
ld("j0", "WINSRUN", "for ever ran out: there is no window to wait on (JANAX_SIN_VENTANA)"); J("jhalt")
o("frame:")
st("j14", "GHN")
J("jcall r_step")
if COMER:
    J("jcall r_meal_step")
if LUMA:
    J("jcall v_frame")
ld("j9", "MOVING"); J("jjnz j9, frame_draw")
ld("j9", "GRAB"); J("jjnz j9, frame_draw")
ld("j9", "EXPLORE"); J("jjz j9, frame_draw")
J("jcall r_explore_frame")
o("frame_draw:")
J("jcall r_fill", "jcall r_draw_ghosts", "jcall r_draw_all")
if COMER:
    J("jcall r_draw_meal")
if LUMA:
    J("jcall v_show                  ; the forms beside the creatures, one screen")
else:
    J("jldi j10, 40                   ; show"); li("j11", CLOUD); li("j12", TOTAL); J("jcall r_tocar")
incg("FRAMES")
ld("j9", "MOVING"); ld("j10", "GHN"); J("jor j9, j9, j10")
ld("j10", "GRAB"); J("jjnz j10, frame_held")
ld("j10", "EXPLORE"); J("jor j9, j9, j10")
o("frame_held:")
if COMER:
    ld("j10", "MEALPH"); J("jor j9, j9, j10")
J("jjz j9, frame_forever")
if COMER:
    o("frame_go:")
setg("REMAIN", FRAME_MS); st("j14", "FOREVER"); J("jjmp main")
o("frame_forever:                  ; at rest, nothing left to try: wait for ever (nothing is spent)")
if COMER:
    J("jcall r_hungry", "jjnz j0, frame_go")
if LUMA:
    J("jcall v_alive", "jjnz j0, frame_go", "jcall v_calm")
setg("FOREVER", 1); J("jjmp main")
o("main_bad:")
J("jldi j0, 0BADh", "jhalt")

# ---- one event
o("; ---- one event (the record at %Xh): 5 closed, 2 a button down, 3 up, 1 the pointer moved, 4 a key" % EV)
o("r_handle:")
if LUMA:
    J("jcall v_event", "jjz j0, h_go", "jret                          ; the creatures' side took it")
    o("h_go:")
o("  jld j9, j14, %s" % num(EV))
J("jldi j10, 5", "jsub j10, j9, j10", "jjnz j10, h_open")
ld("j0", "WINSRUN", "closed: j0 = the forms it created in this run"); J("jhalt")
o("h_open:")
o("  jld j1, j14, %s" % num(EV + 8)); o("  jld j2, j14, %s" % num(EV + 16)); o("  jld j3, j14, %s" % num(EV + 24))
J("jldi j10, 2", "jsub j10, j9, j10", "jjz j10, h_down")
J("jldi j10, 3", "jsub j10, j9, j10", "jjz j10, h_up")
J("jldi j10, 1", "jsub j10, j9, j10", "jjz j10, h_move")
J("jldi j10, 4", "jsub j10, j9, j10", "jjz j10, h_key")
J("jret")
o("h_down:                         ; j1, j2 the cell, j3 the button")
J("jjn j1, h_ret")
st("j3", "FH")
st("j1", "HX"); st("j2", "HY"); J("jcall r_gesture", "jcall r_hit")
ld("j3", "FH"); J("jldi j10, 2", "jsub j10, j3, j10", "jjz j10, h_right")
J("jjn j0, h_ret")
st("j0", "FOCUS"); J("jldi j10, 1", "jadd j9, j0, j10"); st("j9", "GRAB")
form_addr("j9", "j0"); st("j9", "DFA")
ld("j1", "HX"); J("jldi j10, 8", "jshl j1, j1, j10", "jld j11, j9, %d" % F_OX, "jsub j1, j1, j11"); st("j1", "GDX")
ld("j2", "HY"); J("jshl j2, j2, j10", "jld j11, j9, %d" % F_OY, "jsub j2, j2, j11"); st("j2", "GDY")
ld("j1", "HX"); st("j1", "DOWNX"); ld("j1", "HY"); st("j1", "DOWNY"); st("j14", "MOVED")
J("jcall r_stiffen")
o("h_ret:")
J("jret")
o("h_right:                        ; push: the form under the pointer pulses out")
J("jjn j0, h_ret"); st("j0", "FOCUS"); li("j3", PUSH_M); J("jcall r_pulse", "jret")
o("h_up:")
J("jldi j10, 2", "jsub j10, j3, j10", "jjnz j10, h_up_left")
o("  ; pop: the focused form pulses in")
setg("CHANGED", 1); li("j3", -PUSH_M); J("jcall r_pulse", "jret")
o("h_up_left:")
ld("j9", "GRAB"); J("jjz j9, h_ret")
J("jldi j10, 1", "jsub j0, j9, j10"); form_addr("j9", "j0"); st("j9", "DFA")
J("jldi j3, %d" % K_BASE, "jcall r_setk")
st("j14", "GRAB"); setg("CHANGED", 1)
ld("j9", "MOVED"); J("jjnz j9, h_ret")
o("  ; a click without moving: open~close")
ld("j9", "DFA"); J("jld j10, j9, %d" % F_FOLD, "jldi j11, 1", "jxor j10, j10, j11", "jst j10, j9, %d" % F_FOLD)
J("jcall r_set_transform", "jret")
o("h_move:                         ; the form held follows the pointer (its seed kept on the screen)")
ld("j9", "GRAB"); J("jjz j9, h_ret", "jjn j1, h_ret", "jjn j2, h_ret")
ld("j10", "MOVED"); J("jjnz j10, h_moving")
ld("j10", "DOWNX"); J("jsub j10, j1, j10"); ld("j11", "DOWNY"); J("jsub j11, j2, j11", "jor j10, j10, j11", "jjz j10, h_ret")
o("h_moving:")
setg("MOVED", 1); setg("CHANGED", 1)
J("jldi j10, 1", "jsub j0, j9, j10"); form_addr("j9", "j0")
J("jldi j10, 8", "jshl j1, j1, j10", "jshl j2, j2, j10")
ld("j10", "GDX"); J("jsub j1, j1, j10"); ld("j10", "GDY"); J("jsub j2, j2, j10")
for r, hi in (("j1", (W - 1) * 256), ("j2", (H - 1) * 256)):
    a, b = lab("lo"), lab("hi")
    J("jjnn %s, %s" % (r, a), "jldi %s, 0" % r); o("%s:" % a)
    li("j10", hi); J("jsub j11, j10, %s" % r, "jjnn j11, %s" % b, "jadd %s, j10, j14" % r); o("%s:" % b)
J("jst j1, j9, %d" % F_OX, "jst j2, j9, %d" % F_OY, "jret")
o("h_key:                          ; j3 = the key: an action on the focused form")
st("j3", "FH"); J("jcall r_gesture")
ld("j0", "FOCUS"); form_addr("j9", "j0"); st("j9", "DFA"); ld("j3", "FH")
def on_keys(keys, body_label):
    for k in keys:
        li("j10", k); J("jsub j10, j3, j10", "jjz j10, %s" % body_label)
keyacts = [
    ("left", "k_mirror_on"), ("right", "k_mirror_off"), ("up", "k_flip_off"), ("down", "k_flip_on"),
    ("plus", "k_max"), ("minus", "k_min"), ("W", "k_width"), ("H", "k_height"), ("O", "k_open"), ("C", "k_close"),
    ("Ins", "k_show"), ("Del", "k_hide"), ("PgUp", "k_top"), ("PgDn", "k_bottom"), ("Home", "k_first"),
    ("End", "k_last"), ("B", "k_begin"), ("E", "k_end"), ("D", "k_disable"), ("Enter", "k_enable")]
for k, body in keyacts:
    on_keys(VK[k], body)
J("jret")
def setf_and_transform(label, field, v):
    o("%s:" % label); J("jldi j10, %d" % v, "jst j10, j9, %d" % field, "jcall r_set_transform", "jret")
setf_and_transform("k_mirror_on", F_MIRROR, 1); setf_and_transform("k_mirror_off", F_MIRROR, 0)
setf_and_transform("k_flip_off", F_FLIP, 0); setf_and_transform("k_flip_on", F_FLIP, 1)
setf_and_transform("k_open", F_FOLD, 0); setf_and_transform("k_close", F_FOLD, 1)
for label, field, step in (("k_max", F_SCALE, 1), ("k_min", F_SCALE, -1), ("k_width", F_ASPECT, 1), ("k_height", F_ASPECT, -1)):
    o("%s:                          ; one step, never past double or half" % label)
    end = lab("clamp")
    J("jld j10, j9, %d" % field, "jldi j11, %d" % step, "jadd j10, j10, j11")
    J("jldi j11, %d" % (2 * step), "jsub j11, j10, j11", "jjz j11, %s" % end, "jst j10, j9, %d" % field)
    o("%s:" % end); J("jcall r_set_transform", "jret")
o("k_show:"); J("jst j14, j9, %d" % F_HIDDEN, "jret")
o("k_hide:"); J("jldi j10, 1", "jst j10, j9, %d" % F_HIDDEN, "jret")
o("k_first:"); st("j14", "FOCUS"); J("jret")
o("k_last:"); setg("FOCUS", NF - 1); J("jret")
o("k_begin:                        ; it grows again from its seed")
J("jst j14, j9, %d" % F_GROWN, "jldi j10, %d" % GROW_FRAMES, "jst j10, j9, %d" % F_GTICK, "jret")
o("k_end:                          ; it is grown at once")
J("jldb j10, j9, %d" % F_REC, "jst j10, j9, %d" % F_GROWN, "jret")
o("k_disable:")
J("jldi j10, 1", "jst j10, j9, %d" % F_DISABLED, "jjmp k_able")
o("k_enable:")
J("jst j14, j9, %d" % F_DISABLED)
o("k_able:                         ; its colour, and the walk over the forms that may mutate")
J("jcall r_colour", "jcall r_new_walk", "jret")
o("k_top:                          ; drawn last")
ld("j0", "FOCUS"); J("jldi j1, 0")
o("k_top_find:")
o("  jldi j10, 3"); o("  jshl j2, j1, j10"); li("j10", ZORD); J("jadd j2, j2, j10", "jld j3, j2, 0", "jsub j3, j3, j0", "jjz j3, k_top_shift")
J("jldi j10, 1", "jadd j1, j1, j10", "jjmp k_top_find")
o("k_top_shift:")
J("jldi j10, %d" % (NF - 1), "jsub j10, j1, j10", "jjz j10, k_top_put", "jld j3, j2, 8", "jst j3, j2, 0", "jldi j10, 8", "jadd j2, j2, j10",
  "jldi j10, 1", "jadd j1, j1, j10", "jjmp k_top_shift")
o("k_top_put:")
J("jst j0, j2, 0", "jret")
o("k_bottom:                       ; drawn first")
ld("j0", "FOCUS"); J("jldi j1, %d" % (NF - 1))
o("k_bottom_find:")
o("  jldi j10, 3"); o("  jshl j2, j1, j10"); li("j10", ZORD); J("jadd j2, j2, j10", "jld j3, j2, 0", "jsub j3, j3, j0", "jjz j3, k_bottom_shift")
J("jldi j10, 1", "jsub j1, j1, j10", "jjmp k_bottom_find")
o("k_bottom_shift:")
J("jjz j1, k_bottom_put", "jldi j10, 8", "jsub j5, j2, j10", "jld j3, j5, 0", "jst j3, j2, 0", "jadd j2, j5, j14",
  "jldi j10, 1", "jsub j1, j1, j10", "jjmp k_bottom_shift")
o("k_bottom_put:")
J("jst j0, j2, 0", "jret")
o("r_gesture:                      ; a gesture: something changed; if it was calm, a new round of longer jumps")
setg("CHANGED", 1)
ld("j9", "EXPLORE"); J("jjnz j9, g_ret")
ld("j9", "WTOTAL"); J("jjz j9, g_ret")
incg("RADIUS"); ld("j9", "WTOTAL"); st("j9", "BUDGET", "as many jumps as the round of single edits had"); setg("EXPLORE", 1)
o("g_ret:")
J("jret")

# ---- the hand
o("r_hit:                          ; the cell HX, HY -> j0 = the front form with a grown particle within its stroke T, or -1")
setg("TI", NF - 1)
o("hit_form:")
ld("j1", "TI"); J("jjn j1, hit_none")
J("jldi j10, 3", "jshl j1, j1, j10"); li("j10", ZORD); J("jadd j1, j1, j10", "jld j0, j1, 0")
form_addr("j9", "j0")
J("jld j3, j9, %d" % F_FIRST, "jld j4, j9, %d" % F_COUNT, "jldi j10, 7", "jshl j4, j4, j10", "jadd j4, j4, j3",
  "jld j5, j9, %d" % F_GROWN, "jld j12, j9, %d" % F_T)
ld("j6", "HX"); ld("j7", "HY")
o("hit_lap:")
J("jsub j10, j4, j3", "jjz j10, hit_next_form")
J("jld j10, j3, %d" % P_BIRTH, "jsub j10, j5, j10", "jjn j10, hit_next")
for off, rr in ((P_PX, "j6"), (P_PY, "j7")):
    J("jld j8, j3, %d" % off, "jldi j10, 128", "jadd j8, j8, j10", "jldi j10, 8", "jsar j8, j8, j10", "jsub j8, j8, %s" % rr,
      "jadd j11, j8, j12", "jjn j11, hit_next", "jsub j11, j12, j8", "jjn j11, hit_next")
J("jret")
o("hit_next:")
J("jldi j10, %d" % PSZ, "jadd j3, j3, j10", "jjmp hit_lap")
o("hit_next_form:")
incg("TI", -1); J("jjmp hit_form")
o("hit_none:")
J("jldi j0, -1", "jret")
o("r_stiffen:                      ; the form DFA grabbed at HX, HY: k = %d + %d / (%d + d), d = cells from the grab" % (K_FAR, (K_NEAR - K_FAR) * D0, D0))
ld("j9", "DFA"); J("jld j1, j9, %d" % F_FIRST, "jld j2, j9, %d" % F_COUNT, "jldi j10, 7", "jshl j2, j2, j10", "jadd j2, j2, j1")
ld("j3", "HX"); ld("j4", "HY"); J("jldi j5, 8", "jldi j6, %d" % D0); li("j7", (K_NEAR - K_FAR) * D0)
o("stiff_lap:")
J("jsub j10, j2, j1", "jjz j10, stiff_done")
J("jld j8, j1, %d" % P_PX, "jsar j8, j8, j5", "jsub j8, j8, j3", "jjnn j8, stiff_x", "jsub j8, j14, j8")
o("stiff_x:")
J("jld j9, j1, %d" % P_PY, "jsar j9, j9, j5", "jsub j9, j9, j4", "jjnn j9, stiff_y", "jsub j9, j14, j9")
o("stiff_y:")
J("jadd j8, j8, j9", "jadd j8, j8, j6", "jdiv j8, j7, j8", "jldi j9, %d" % K_FAR, "jadd j8, j8, j9", "jst j8, j1, %d" % P_K)
J("jldi j10, %d" % PSZ, "jadd j1, j1, j10", "jjmp stiff_lap")
o("stiff_done:")
J("jret")
o("r_setk:                         ; the form DFA: every spring k = j3")
ld("j9", "DFA"); J("jld j1, j9, %d" % F_FIRST, "jld j2, j9, %d" % F_COUNT, "jldi j10, 7", "jshl j2, j2, j10", "jadd j2, j2, j1")
o("setk_lap:")
J("jsub j10, j2, j1", "jjz j10, setk_done", "jst j3, j1, %d" % P_K, "jldi j10, %d" % PSZ, "jadd j1, j1, j10", "jjmp setk_lap")
o("setk_done:")
J("jret")
o("r_pulse:                        ; the focused form: dv = (p - seed) * j3 >> 8 (out when j3 > 0, in when < 0)")
setg("CHANGED", 1)
ld("j0", "FOCUS"); form_addr("j9", "j0")
J("jld j1, j9, %d" % F_FIRST, "jld j2, j9, %d" % F_COUNT, "jldi j10, 7", "jshl j2, j2, j10", "jadd j2, j2, j1",
  "jld j4, j9, %d" % F_OX, "jld j5, j9, %d" % F_OY, "jldi j6, 8")
o("pulse_lap:")
J("jsub j10, j2, j1", "jjz j10, pulse_done")
for p_, v_, c_ in ((P_PX, P_VX, "j4"), (P_PY, P_VY, "j5")):
    J("jld j7, j1, %d" % p_, "jsub j7, j7, %s" % c_, "jmul j7, j7, j3", "jsar j7, j7, j6", "jld j8, j1, %d" % v_,
      "jadd j8, j8, j7", "jst j8, j1, %d" % v_)
J("jldi j10, %d" % PSZ, "jadd j1, j1, j10", "jjmp pulse_lap")
o("pulse_done:")
J("jret")
o("r_set_transform:                ; the form j9: MX, MY from its fold, size, stretch, mirror and flip (x256)")
J("jld j1, j9, %d" % F_S, "jld j2, j9, %d" % F_SCALE, "jldi j5, 1", "jjz j2, st_scaled", "jshl j1, j1, j5", "jjnn j2, st_scaled",
  "jldi j5, 2", "jsar j1, j1, j5")
o("st_scaled:")
J("jadd j3, j1, j14", "jadd j4, j1, j14", "jldi j5, 1", "jld j2, j9, %d" % F_ASPECT, "jjz j2, st_aspect",
  "jjn j2, st_tall", "jshl j3, j3, j5", "jjmp st_aspect")
o("st_tall:")
J("jshl j4, j4, j5")
o("st_aspect:")
o("  ; the stroke: T = min(|MX|, |MY|) ARM / 2 cells, rounded up (the stretched axis does not thicken it)")
J("jsub j2, j4, j3", "jadd j5, j3, j14", "jjnn j2, st_thin", "jadd j5, j4, j14")
o("st_thin:")
J("jldi j2, %d" % ARM, "jmul j5, j5, j2", "jldi j2, 511", "jadd j5, j5, j2", "jldi j2, 9", "jsar j5, j5, j2", "jjnz j5, st_t", "jldi j5, 1")
o("st_t:")
J("jst j5, j9, %d" % F_T)
J("jld j2, j9, %d" % F_MIRROR, "jjz j2, st_mirror", "jsub j3, j14, j3")
o("st_mirror:")
J("jld j2, j9, %d" % F_FLIP, "jjz j2, st_flip", "jsub j4, j14, j4")
o("st_flip:")
J("jld j2, j9, %d" % F_FOLD, "jjz j2, st_open", "jldi j3, 0", "jldi j4, 0")
o("st_open:")
J("jst j3, j9, %d" % F_MX, "jst j4, j9, %d" % F_MY, "jret")

# ---- growing a recipe
o("; ---- grow: the recipe GREC into the particles at GREG (one per cell of the room) and the bitmap GBMP -> GCOUNT.")
o(";      Particles below GKEEP keep their place and speed (a form that transforms flows from what it was); a new one")
o(";      is born where its parent is (the seed: at GOX, GOY). Its parent is the cell before it in its arm, so it is")
o(";      drawn joined to it however far the springs pull them apart.")
o("r_grow:")
ld("j1", "GBMP"); J("jldi j2, 50", "jldi j3, 8", "jldi j4, 1")
o("grow_clear_bmp:")
J("jst j14, j1, 0", "jadd j1, j1, j3", "jsub j2, j2, j4", "jjnz j2, grow_clear_bmp")
li("j1", GRID); li("j2", ROOMCELLS)
o("grow_clear_grid:")
J("jst j14, j1, 0", "jadd j1, j1, j3", "jsub j2, j2, j4", "jjnz j2, grow_clear_grid")
st("j14", "GCOUNT"); st("j14", "TX"); st("j14", "TY"); st("j14", "GT")
J("jldi j1, 0", "jldi j2, 0", "jldi j3, -1", "jldi j4, 0", "jcall r_cell"); st("j0", "PREV")
o("grow_letter:")
incg("GT"); ld("j9", "GT"); ld("j1", "GREC"); J("jldb j2, j1, 0", "jsub j10, j2, j9", "jjn j10, grow_done")
J("jadd j1, j1, j9", "jldb j5, j1, 0"); st("j5", "GC")
J("jldi j10, 5", "jsub j10, j5, j10", "jjn j10, grow_arm", "jldi j10, 9", "jsub j10, j5, j10", "jjn j10, grow_hole", "jjmp grow_mirror")
o("grow_arm:                       ; 1-4: an arm towards direction k")
J("jldi j10, 1", "jsub j5, j5, j10", "jldi j10, 4", "jshl j5, j5, j10"); li("j10", DIRT); J("jadd j5, j5, j10")
J("jld j6, j5, 0"); st("j6", "GDXA"); J("jld j6, j5, 8"); st("j6", "GDYA"); setg("GK", ARM)
o("grow_arm_lap:")
ld("j1", "TX"); ld("j10", "GDXA"); J("jadd j1, j1, j10"); st("j1", "TX")
ld("j2", "TY"); ld("j10", "GDYA"); J("jadd j2, j2, j10"); st("j2", "TY")
ld("j3", "PREV"); ld("j4", "GT"); J("jcall r_cell"); st("j0", "PREV")
incg("GK", -1); J("jjnz j10, grow_arm_lap", "jjmp grow_letter")
o("grow_hole:                      ; 5-8: back to the seed and over an opening towards direction k")
J("jldi j10, 5", "jsub j5, j5, j10", "jldi j10, 4", "jshl j5, j5, j10"); li("j10", DIRT); J("jadd j5, j5, j10")
J("jldi j10, %d" % ARM, "jld j6, j5, 0", "jmul j1, j6, j10", "jld j6, j5, 8", "jmul j2, j6, j10")
st("j1", "TX"); st("j2", "TY"); J("jldi j4, -1", "jcall r_cell"); st("j0", "PREV")
J("jjmp grow_letter")
o("grow_mirror:                    ; 9: every cell so far, mirrored across the seed's column (joined to its parent's mirror)")
ld("j9", "GCOUNT"); st("j9", "GN0"); st("j14", "GI")
o("grow_mirror_lap:")
ld("j9", "GI"); ld("j10", "GN0"); J("jsub j10, j9, j10", "jjnn j10, grow_mirror_done")
J("jldi j10, 7", "jshl j11, j9, j10"); ld("j10", "GREG"); J("jadd j11, j11, j10"); st("j11", "GMR")
J("jld j12, j11, %d" % P_PAR, "jldi j10, 8", "jld j1, j12, %d" % P_HX, "jsar j1, j1, j10", "jsub j1, j14, j1",
  "jld j2, j12, %d" % P_HY, "jsar j2, j2, j10", "jldi j4, -1", "jcall r_cell"); st("j0", "GMP")
ld("j11", "GMR"); J("jldi j10, 8", "jld j1, j11, %d" % P_HX, "jsar j1, j1, j10", "jsub j1, j14, j1",
                    "jld j2, j11, %d" % P_HY, "jsar j2, j2, j10")
ld("j3", "GMP"); ld("j4", "GT"); J("jcall r_cell")
incg("GI"); J("jjmp grow_mirror_lap")
o("grow_mirror_done:")
ld("j1", "TX"); J("jsub j1, j14, j1"); st("j1", "TX"); ld("j2", "TY"); J("jldi j4, -1", "jcall r_cell"); st("j0", "PREV")
J("jjmp grow_letter")
o("grow_done:")
J("jret")
o("r_cell:                         ; the cell j1, j2 (from the seed) of the form being grown, parent j3 (-1: itself),")
o("                                ; birth j4 (-1: only look) -> j0 = its particle, or -1 (outside the room, or empty)")
J("jldi j0, -1")
for r, half, size, reg in (("j1", RW // 2, RW, "j5"), ("j2", RH // 2, RH, "j6")):
    J("jldi j10, %d" % half, "jadd %s, %s, j10" % (reg, r), "jjn %s, cell_out" % reg,
      "jldi j10, %d" % size, "jsub j10, %s, j10" % reg, "jjnn j10, cell_out")
J("jldi j10, %d" % RW, "jmul j7, j6, j10", "jadd j7, j7, j5", "jldi j10, 3", "jshl j7, j7, j10"); li("j10", GRID)
J("jadd j7, j7, j10", "jld j8, j7, 0", "jjz j8, cell_new", "jldi j10, 1", "jsub j0, j8, j10", "jret")
o("cell_new:")
J("jjn j4, cell_out")
ld("j0", "GCOUNT"); J("jldi j10, 7", "jshl j9, j0, j10"); ld("j10", "GREG"); J("jadd j9, j9, j10")
J("jldi j10, 8", "jshl j11, j1, j10", "jst j11, j9, %d" % P_HX, "jshl j11, j2, j10", "jst j11, j9, %d" % P_HY)
J("jadd j11, j9, j14", "jjn j3, cell_parent", "jldi j10, 7", "jshl j11, j3, j10"); ld("j10", "GREG"); J("jadd j11, j11, j10")
o("cell_parent:")
J("jst j11, j9, %d" % P_PAR, "jst j4, j9, %d" % P_BIRTH, "jldi j10, %d" % K_BASE, "jst j10, j9, %d" % P_K)
ld("j10", "GKEEP"); J("jsub j10, j0, j10", "jjn j10, cell_kept")
J("jst j14, j9, %d" % P_VX, "jst j14, j9, %d" % P_VY, "jsub j10, j11, j9", "jjz j10, cell_seed")
J("jld j10, j11, %d" % P_PX, "jst j10, j9, %d" % P_PX, "jld j10, j11, %d" % P_PY, "jst j10, j9, %d" % P_PY, "jjmp cell_kept")
o("cell_seed:")
ld("j10", "GOX"); J("jst j10, j9, %d" % P_PX); ld("j10", "GOY"); J("jst j10, j9, %d" % P_PY)
o("cell_kept:")
J("jldi j10, 3", "jshl j12, j6, j10"); ld("j10", "GBMP"); J("jadd j12, j12, j10", "jld j13, j12, 0", "jldi j10, 1",
  "jshl j10, j10, j5", "jor j13, j13, j10", "jst j13, j12, 0", "jldi j10, 1", "jadd j8, j0, j10", "jst j8, j7, 0")
st("j8", "GCOUNT")
o("cell_out:")
J("jret")
o("r_regrow:                       ; form j1 from its recipe, its particles keeping their places (all of them grown)")
form_addr("j9", "j1"); st("j9", "DFA")
J("jldi j10, %d" % F_REC, "jadd j10, j9, j10"); st("j10", "GREC")
J("jld j10, j9, %d" % F_FIRST); st("j10", "GREG"); J("jld j10, j9, %d" % F_BMP); st("j10", "GBMP")
J("jld j10, j9, %d" % F_COUNT); st("j10", "GKEEP"); J("jld j10, j9, %d" % F_OX); st("j10", "GOX")
J("jld j10, j9, %d" % F_OY); st("j10", "GOY")
J("jcall r_grow"); ld("j9", "DFA"); ld("j10", "GCOUNT"); J("jst j10, j9, %d" % F_COUNT)
o("  ; its body: the scale that fills the room, from its own extent, and the centre it is drawn around")
J("jld j1, j9, %d" % F_FIRST, "jld j2, j9, %d" % F_COUNT, "jldi j10, 7", "jshl j2, j2, j10", "jadd j2, j2, j1")
li("j3", 1 << 40); li("j4", -(1 << 40)); li("j5", 1 << 40); li("j6", -(1 << 40))
o("fit_lap:")
J("jsub j10, j2, j1", "jjz j10, fit_done")
for p_, lo, hi in ((P_HX, "j3", "j4"), (P_HY, "j5", "j6")):
    a, b = lab("fit_lo"), lab("fit_hi")
    J("jld j7, j1, %d" % p_, "jsub j10, j7, %s" % lo, "jjnn j10, %s" % a, "jadd %s, j7, j14" % lo)
    o("%s:" % a); J("jsub j10, %s, j7" % hi, "jjnn j10, %s" % b, "jadd %s, j7, j14" % hi); o("%s:" % b)
J("jldi j10, %d" % PSZ, "jadd j1, j1, j10", "jjmp fit_lap")
o("fit_done:")
J("jadd j7, j3, j4", "jldi j10, 1", "jsar j7, j7, j10", "jst j7, j9, %d" % F_CX, "jadd j7, j5, j6", "jsar j7, j7, j10", "jst j7, j9, %d" % F_CY)
o("  ; S = room * 512 / (2 (w - 1) + ARM), per axis (w - 1 = (max - min) / 256), the smaller")
for lo, hi, room, r in (("j3", "j4", RW, "j7"), ("j5", "j6", RH, "j8")):
    J("jsub %s, %s, %s" % (r, hi, lo), "jldi j10, 7", "jsar %s, %s, j10" % (r, r), "jldi j10, %d" % ARM, "jadd %s, %s, j10" % (r, r))
    li("j10", room * 512); J("jdiv %s, j10, %s" % (r, r))
J("jsub j10, j8, j7", "jjnn j10, fit_x", "jadd j7, j8, j14")
o("fit_x:")
J("jst j7, j9, %d" % F_S, "jcall r_set_transform", "jret")

# ---- the judge
o("; ---- the judge: overlaps (cells two forms share, seed on seed), worth = comp * nov, the population's total")
o("r_overlap:                      ; j1, j2 = two bitmaps -> j0 = the cells they share (uses j3..j8, j10)")
J("jldi j0, 0", "jldi j3, 50"); li("j7", POPC); J("jldi j8, 255")
o("ov_lap:")
J("jld j4, j1, 0", "jld j5, j2, 0", "jand j4, j4, j5", "jjz j4, ov_next")
for _ in range((RW + 7) // 8):
    J("jand j5, j4, j8", "jadd j5, j5, j7", "jldb j5, j5, 0", "jadd j0, j0, j5", "jldi j10, 8", "jshr j4, j4, j10")
o("ov_next:")
J("jldi j10, 8", "jadd j1, j1, j10", "jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, ov_lap", "jret")
o("r_worth:                        ; j1 cells, j2 letters, j3 most shared -> j5 comp = j1 / (j2 log2 9) (x1000),")
o("                                ; j6 nov = 1000 - 1000 j3 / j1, j0 = j5 j6 / 1000 (uses j7, j10)")
li("j10", 317, "log2 9 = 3.17 bits a letter (x100)"); J("jmul j7, j2, j10"); li("j10", 100000); J("jmul j5, j1, j10", "jdiv j5, j5, j7")
li("j10", 1000); J("jmul j6, j3, j10", "jdiv j6, j6, j1", "jsub j6, j10, j6", "jmul j0, j5, j6", "jdiv j0, j0, j10", "jret")
def maxrow(dst, i_reg, skip_reg, lbl):
    """dst = max over j != i, j != skip of O[i][j] (runtime i, skip); uses j10..j13."""
    J("jldi %s, 0" % dst, "jldi j11, 0")
    o("%s:" % lbl)
    J("jsub j10, j11, %s" % i_reg, "jjz j10, %s_n" % lbl, "jsub j10, j11, %s" % skip_reg, "jjz j10, %s_n" % lbl)
    J("jldi j10, 3", "jshl j12, %s, j10" % i_reg, "jadd j12, j12, j11", "jshl j12, j12, j10"); li("j10", OVL)
    J("jadd j12, j12, j10", "jld j12, j12, 0", "jsub j13, j12, %s" % dst, "jjn j13, %s_n" % lbl, "jadd %s, j12, j14" % dst)
    o("%s_n:" % lbl)
    J("jldi j10, 1", "jadd j11, j11, j10", "jldi j10, %d" % NF, "jsub j10, j11, j10", "jjnz j10, %s" % lbl)
o("r_recompute:                    ; every overlap, every worth, the total, the best, the colours")
for i in range(NF):
    for j in range(i + 1, NF):
        li("j1", BMPS + 512 * i); li("j2", BMPS + 512 * j); J("jcall r_overlap")
        o("  jst j0, j14, %s" % num(OVL + 8 * (8 * i + j))); o("  jst j0, j14, %s" % num(OVL + 8 * (8 * j + i)))
st("j14", "TOTAL"); st("j14", "WMAX"); st("j14", "TI")
o("rc_lap:")
ld("j1", "TI"); J("jldi j9, -1"); maxrow("j3", "j1", "j9", "rc_max")
ld("j1", "TI"); form_addr("j9", "j1")
J("jld j1, j9, %d" % F_COUNT, "jldb j2, j9, %d" % F_REC, "jcall r_worth")
ld("j1", "TI"); form_addr("j9", "j1")
J("jst j0, j9, %d" % F_WORTH, "jst j5, j9, %d" % F_COMP, "jst j6, j9, %d" % F_NOV)
ld("j10", "TOTAL"); J("jadd j10, j10, j0"); st("j10", "TOTAL")
ld("j10", "WMAX"); J("jsub j11, j0, j10", "jjn j11, rc_less"); st("j0", "WMAX")
o("rc_less:")
incg("TI"); J("jldi j11, %d" % NF, "jsub j10, j10, j11", "jjnz j10, rc_lap")
st("j14", "TI")
o("rc_colour:")
ld("j1", "TI"); form_addr("j9", "j1"); J("jcall r_colour")
incg("TI"); J("jldi j11, %d" % NF, "jsub j10, j10, j11", "jjnz j10, rc_colour", "jret")
o("r_colour:                       ; the form j9: its hue (its slot) at %.1f + %.1f worth / best; grey when it rests" % (DIM / 1000, 1 - DIM / 1000))
li("j1", 1000); ld("j2", "WMAX"); J("jjz j2, col_full", "jld j1, j9, %d" % F_WORTH); li("j10", 1000 - DIM)
J("jmul j1, j1, j10", "jdiv j1, j1, j2"); li("j10", DIM); J("jadd j1, j1, j10")
o("col_full:")
J("jsub j2, j9, j14"); li("j10", FORMS); J("jsub j2, j2, j10", "jldi j10, 8", "jshr j2, j2, j10", "jldi j10, 24", "jmul j2, j2, j10")
li("j10", PAL); J("jadd j2, j2, j10"); li("j10", 1000)
for k, fld in enumerate((F_CR, F_CG, F_CB)):
    J("jld j3, j2, %d" % (8 * k), "jmul j3, j3, j1", "jdiv j3, j3, j10", "jst j3, j9, %d" % fld)
J("jld j3, j9, %d" % F_DISABLED, "jjz j3, col_done", "jld j3, j9, %d" % F_CR, "jld j4, j9, %d" % F_CG, "jadd j3, j3, j4",
  "jld j4, j9, %d" % F_CB, "jadd j3, j3, j4", "jldi j4, 3", "jdiv j3, j3, j4")
for fld in (F_CR, F_CG, F_CB):
    J("jst j3, j9, %d" % fld)
o("col_done:")
J("jret")
o("r_judge:                        ; the candidate CAND as form JF -> j0 = 2 won (it transformed), 1 lost (archived)")
ld("j1", "JF"); form_addr("j9", "j1"); st("j9", "JFA")
setg("GREC", CAND); setg("GREG", CREG); setg("GBMP", CBMP); st("j14", "GKEEP"); st("j14", "GOX"); st("j14", "GOY")
J("jcall r_grow"); ld("j9", "GCOUNT"); st("j9", "JCNT")
st("j14", "JJ")
o("jd_ov:")
ld("j9", "JJ"); J("jldi j0, 0"); ld("j10", "JF"); J("jsub j10, j9, j10", "jjz j10, jd_ov_put")
li("j1", CBMP); J("jldi j10, 9", "jshl j2, j9, j10"); li("j10", BMPS); J("jadd j2, j2, j10", "jcall r_overlap")
o("jd_ov_put:")
ld("j9", "JJ"); J("jldi j10, 3", "jshl j9, j9, j10"); li("j10", OVC); J("jadd j9, j9, j10", "jst j0, j9, 0")
incg("JJ"); J("jldi j11, %d" % NF, "jsub j10, j10, j11", "jjnz j10, jd_ov")
o("  ; the candidate's own worth: its most shared with any other form")
J("jldi j3, 0", "jldi j11, 0")
o("jd_cmax:")
J("jldi j10, 3", "jshl j12, j11, j10"); li("j10", OVC); J("jadd j12, j12, j10", "jld j12, j12, 0", "jsub j13, j12, j3",
  "jjn j13, jd_cmax_n", "jadd j3, j12, j14")
o("jd_cmax_n:")
J("jldi j10, 1", "jadd j11, j11, j10", "jldi j10, %d" % NF, "jsub j10, j11, j10", "jjnz j10, jd_cmax")
ld("j1", "JCNT"); o("  jldb j2, j14, %s" % num(CAND)); J("jcall r_worth"); st("j0", "JWC"); st("j5", "JCC"); st("j6", "JNC")
st("j0", "JT2")
o("  ; the parent's own worth, as it is now")
ld("j1", "JF"); J("jldi j9, -1"); maxrow("j3", "j1", "j9", "jd_pmax")
ld("j9", "JFA"); J("jld j1, j9, %d" % F_COUNT, "jldb j2, j9, %d" % F_REC, "jcall r_worth")
st("j0", "JWP"); st("j5", "JCP"); st("j6", "JNP")
o("  ; every other form, with the candidate in the parent's place")
st("j14", "JI")
o("jd_others:")
ld("j1", "JI"); ld("j9", "JF"); J("jsub j10, j1, j9", "jjz j10, jd_others_n")
maxrow("j3", "j1", "j9", "jd_omax")
ld("j1", "JI"); J("jldi j10, 3", "jshl j12, j1, j10"); li("j10", OVC); J("jadd j12, j12, j10", "jld j12, j12, 0",
  "jsub j13, j12, j3", "jjn j13, jd_okeep", "jadd j3, j12, j14")
o("jd_okeep:")
ld("j1", "JI"); form_addr("j9", "j1"); J("jld j1, j9, %d" % F_COUNT, "jldb j2, j9, %d" % F_REC, "jcall r_worth")
ld("j10", "JT2"); J("jadd j10, j10, j0"); st("j10", "JT2")
o("jd_others_n:")
incg("JI"); J("jldi j11, %d" % NF, "jsub j10, j10, j11", "jjnz j10, jd_others")
ld("j9", "JT2"); ld("j10", "TOTAL"); J("jsub j9, j10, j9")
if COMER:
    ld("j10", "TIEOK"); J("jsub j9, j9, j10")   # 1 while a meal's climb is judged: a tie goes to what it ate
J("jjn j9, jd_win")
o("  ; it lost: why")
J("jldi j9, 5")
ld("j1", "JWC"); ld("j2", "JWP"); J("jsub j1, j2, j1", "jjnn j1, jd_r1", "jldi j9, 4")
o("jd_r1:")
J("jldi j8, 0"); ld("j1", "JNC"); ld("j2", "JNP"); J("jsub j1, j1, j2", "jjnn j1, jd_r2", "jldi j9, 3", "jldi j8, 1")
o("jd_r2:")
ld("j1", "JCC"); ld("j2", "JCP"); J("jsub j1, j1, j2", "jjnn j1, jd_r3", "jldi j9, 2", "jjz j8, jd_r3", "jldi j9, 1")
o("jd_r3:")
st("j9", "AREASON"); setg("ALOSER", CAND); ld("j9", "JFA"); J("jldi j10, %d" % F_REC, "jadd j9, j9, j10"); st("j9", "AOTHER")
ld("j9", "JT2"); st("j9", "ATL"); ld("j9", "TOTAL"); st("j9", "ATW"); J("jcall r_archive")
o("  ; its ghost, for this frame")
ld("j1", "GHN")
if COMER:   # a meal's climb also thinks in the frame: the ghosts' table holds NF, the directions live right after it
    J("jldi j10, %d" % NF, "jsub j10, j1, j10", "jjnn j10, jd_noghost")
J("jldi j10, 3", "jshl j2, j1, j10"); li("j10", GHL); J("jadd j2, j2, j10"); ld("j10", "JF"); J("jst j10, j2, 0")
J("jldi j10, 9", "jshl j2, j1, j10"); li("j10", GHB); J("jadd j2, j2, j10"); li("j3", CBMP); J("jldi j4, 50")
o("jd_ghost:")
J("jld j5, j3, 0", "jst j5, j2, 0", "jldi j10, 8", "jadd j2, j2, j10", "jadd j3, j3, j10", "jldi j10, 1", "jsub j4, j4, j10",
  "jjnz j4, jd_ghost")
incg("GHN")
if COMER:
    o("jd_noghost:")
J("jldi j0, 1", "jret")
o("jd_win:                         ; it won: the parent goes to the archive, the form transforms")
st("j14", "AREASON"); ld("j9", "JFA"); J("jldi j10, %d" % F_REC, "jadd j9, j9, j10"); st("j9", "ALOSER"); setg("AOTHER", CAND)
ld("j9", "TOTAL"); st("j9", "ATL"); ld("j9", "JT2"); st("j9", "ATW"); J("jcall r_archive")
ld("j9", "JFA")
for k in range(4):
    o("  jld j10, j14, %s" % num(CAND + 8 * k)); J("jst j10, j9, %d" % (F_REC + 8 * k))
ld("j1", "JF"); J("jcall r_regrow")
ld("j9", "DFA"); J("jldb j10, j9, %d" % F_REC, "jst j10, j9, %d" % F_GROWN)
J("jcall r_recompute")
incg("EPOCH"); incg("WINS"); incg("WINSRUN"); setg("RADIUS", 1); setg("CHANGED", 1)
if COMER:
    J("jcall r_meal_won")
J("jcall r_clear_hash", "jcall r_new_walk", "jcall r_save_forms", "jldi j0, 2", "jret")

# ---- mutations
if COMER:
    COMER.mutations()
else:
    o("; ---- the mutations of a recipe: op k of form j1, from the recipe j3 into j4 (k counts, in this order:)")
    o(";      change letter i to another (8n), insert a letter (9(n+1)), delete one (n, if n > 1), insert a tower")
    o(";      (%d(n+1)), cross: its first c letters and the rest of another form (%d n)" % (len(towers), NF - 1))
    o("r_count:                        ; j1 = n letters -> j0 = how many ops (uses j10)")
    J("jldi j10, %d" % (8 + 9 + len(towers) + NF - 1), "jmul j0, j1, j10", "jldi j10, %d" % (9 + len(towers)), "jadd j0, j0, j10",
      "jldi j10, 1", "jsub j10, j1, j10", "jjz j10, count_one", "jadd j0, j0, j1")
    o("count_one:")
    J("jret")
    o("r_cat:                          ; append the letters [j1, j2) of the recipe j3 to the recipe ADST (uses j4..j6, j10)")
    ld("j4", "ADST")
    o("cat_lap:")
    J("jsub j10, j1, j2", "jjnn j10, cat_done", "jadd j5, j3, j1", "jldb j5, j5, 1", "jldb j6, j4, 0", "jldi j10, 46",
      "jsub j10, j6, j10", "jjnn j10, cat_done", "jadd j10, j4, j6", "jstb j5, j10, 1", "jldi j10, 1", "jadd j6, j6, j10",
      "jstb j6, j4, 0", "jldi j10, 1", "jadd j1, j1, j10", "jjmp cat_lap")
    o("cat_done:")
    J("jret")
    o("r_app:                          ; append the letter j1 to the recipe ADST (uses j4, j6, j10)")
    ld("j4", "ADST"); J("jldb j6, j4, 0", "jadd j10, j4, j6", "jstb j1, j10, 1", "jldi j10, 1", "jadd j6, j6, j10", "jstb j6, j4, 0", "jret")
    o("r_apply:                        ; j1 form, j2 op, j3 from, j4 into")
    st("j1", "AF"); st("j2", "AK"); st("j3", "ASRC"); st("j4", "ADST"); J("jstb j14, j4, 0", "jldb j5, j3, 0"); st("j5", "AN")
    o("  ; change")
    J("jldi j10, 8", "jmul j6, j5, j10", "jsub j10, j2, j6", "jjnn j10, ap_insert")
    for k in range(6):
        J("jld j10, j3, %d" % (8 * k), "jst j10, j4, %d" % (8 * k))
    J("jldi j10, 3", "jshr j7, j2, j10", "jldi j10, 7", "jand j8, j2, j10", "jldi j10, 1", "jadd j8, j8, j10",
      "jadd j9, j3, j7", "jldb j9, j9, 1", "jsub j10, j8, j9", "jjn j10, ap_change", "jldi j10, 1", "jadd j8, j8, j10")
    o("ap_change:")
    J("jadd j9, j4, j7", "jstb j8, j9, 1", "jret")
    o("ap_insert:")
    J("jsub j2, j2, j6", "jldi j10, 1", "jadd j7, j5, j10", "jldi j10, 9", "jmul j6, j7, j10", "jsub j10, j2, j6", "jjnn j10, ap_delete")
    J("jldi j10, 9", "jdiv j7, j2, j10", "jmul j8, j7, j10", "jsub j8, j2, j8", "jldi j10, 1", "jadd j8, j8, j10"); st("j7", "AK"); st("j8", "FP")
    ld("j3", "ASRC"); J("jldi j1, 0", "jadd j2, j7, j14", "jcall r_cat"); ld("j1", "FP"); J("jcall r_app")
    ld("j1", "AK"); ld("j2", "AN"); ld("j3", "ASRC"); J("jcall r_cat", "jret")
    o("ap_delete:")
    J("jsub j2, j2, j6", "jldi j10, 1", "jsub j10, j5, j10", "jjz j10, ap_tower", "jsub j10, j2, j5", "jjnn j10, ap_delete_no")
    st("j2", "AK"); ld("j3", "ASRC"); J("jldi j1, 0", "jcall r_cat")
    ld("j1", "AK"); J("jldi j10, 1", "jadd j1, j1, j10"); ld("j2", "AN"); ld("j3", "ASRC"); J("jcall r_cat", "jret")
    o("ap_delete_no:")
    J("jsub j2, j2, j5")
    o("ap_tower:")
    ld("j5", "AN"); J("jldi j10, 1", "jadd j7, j5, j10", "jldi j10, %d" % len(towers), "jmul j6, j7, j10", "jsub j10, j2, j6",
                      "jjnn j10, ap_cross")
    J("jldi j10, %d" % len(towers), "jdiv j7, j2, j10", "jmul j8, j7, j10", "jsub j8, j2, j8"); st("j7", "AK"); st("j8", "FP")
    ld("j3", "ASRC"); J("jldi j1, 0", "jadd j2, j7, j14", "jcall r_cat")
    for t, tw in enumerate(towers):
        nxt = lab("tower")
        ld("j8", "FP"); J("jldi j10, %d" % t, "jsub j10, j8, j10", "jjnz j10, %s" % nxt)
        for letter in tw:
            J("jldi j1, %d" % letter, "jcall r_app")
        o("%s:" % nxt)
    ld("j1", "AK"); ld("j2", "AN"); ld("j3", "ASRC"); J("jcall r_cat", "jret")
    o("ap_cross:                       ; its first c letters, then another form's letters from c on")
    J("jsub j2, j2, j6", "jdiv j7, j2, j5", "jmul j8, j7, j5", "jsub j8, j2, j8", "jldi j10, 1", "jadd j8, j8, j10")
    ld("j1", "AF"); J("jsub j10, j7, j1", "jjn j10, ap_cross_other", "jldi j10, 1", "jadd j7, j7, j10")
    o("ap_cross_other:")
    st("j7", "FP"); st("j8", "AK")
    ld("j3", "ASRC"); J("jldi j1, 0", "jadd j2, j8, j14", "jcall r_cat")
    ld("j7", "FP"); form_addr("j3", "j7"); J("jldi j10, %d" % F_REC, "jadd j3, j3, j10", "jldb j2, j3, 0"); ld("j1", "AK")
    J("jcall r_cat", "jret")

# ---- the tried table
o("; ---- the tried table: an FNV-1a hash of each recipe judged in this population (2^%d slots, open addressing)" % HBITS)
o("r_hash:                         ; j1 = a recipe -> j0 = its hash (never 0; uses j2..j4, j10)")
li("j0", 0xCBF29CE484222325); li("j4", 0x100000001B3); J("jldb j2, j1, 0", "jldi j10, 1", "jadd j2, j2, j10", "jadd j3, j1, j14")
o("hash_lap:")
J("jldb j10, j3, 0", "jxor j0, j0, j10", "jmul j0, j0, j4", "jldi j10, 1", "jadd j3, j3, j10", "jsub j2, j2, j10", "jjnz j2, hash_lap")
J("jldi j10, 1", "jor j0, j0, j10", "jret")
o("r_tried:                        ; j0 = a hash -> j0 = 1 it was there, 0 it is now, 2 the table is half full")
li("j10", HN - 1); J("jand j1, j0, j10")
o("tried_lap:")
J("jldi j10, 3", "jshl j2, j1, j10"); li("j10", HASH); J("jadd j2, j2, j10", "jld j3, j2, 0", "jjz j3, tried_new",
  "jsub j3, j3, j0", "jjz j3, tried_was", "jldi j10, 1", "jadd j1, j1, j10"); li("j10", HN - 1); J("jand j1, j1, j10", "jjmp tried_lap")
o("tried_was:")
J("jldi j0, 1", "jret")
o("tried_new:")
ld("j3", "HCOUNT"); li("j10", HN // 2); J("jsub j10, j3, j10", "jjnn j10, tried_full", "jst j0, j2, 0", "jldi j10, 1", "jadd j3, j3, j10")
st("j3", "HCOUNT"); J("jldi j0, 0", "jret")
o("tried_full:")
J("jldi j0, 2", "jret")
o("r_clear_hash:                   ; a new population: nothing tried in it yet, but its own forms count as tried")
li("j1", HASH); li("j2", HN); J("jldi j3, 8", "jldi j4, 1")
o("clear_lap:")
J("jst j14, j1, 0", "jadd j1, j1, j3", "jsub j2, j2, j4", "jjnz j2, clear_lap")
st("j14", "HCOUNT"); st("j14", "TI")
o("clear_forms:")
ld("j1", "TI"); form_addr("j1", "j1"); J("jldi j10, %d" % F_REC, "jadd j1, j1, j10", "jcall r_hash", "jcall r_tried")
incg("TI"); J("jldi j11, %d" % NF, "jsub j10, j10, j11", "jjnz j10, clear_forms", "jret")

# ---- exploration
o("; ---- exploration: a walk over every op of every form that may mutate, with a random start and a stride coprime")
o(";      to their number, so it visits each once in an order it does not repeat")
o("r_new_walk:")
st("j14", "WTOTAL"); st("j14", "WALKI"); setg("RADIUS", 1); st("j14", "TI")
o("nw_count:")
ld("j1", "TI"); form_addr("j9", "j1"); J("jld j10, j9, %d" % F_DISABLED, "jjnz j10, nw_next", "jldb j1, j9, %d" % F_REC, "jcall r_count")
ld("j10", "WTOTAL"); J("jadd j10, j10, j0"); st("j10", "WTOTAL")
o("nw_next:")
incg("TI"); J("jldi j11, %d" % NF, "jsub j10, j10, j11", "jjnz j10, nw_count")
ld("j1", "WTOTAL"); J("jjz j1, nw_none", "jcall r_randmod"); st("j0", "WSTART")
ld("j1", "WTOTAL"); J("jcall r_randmod", "jjnz j0, nw_stride", "jldi j0, 1")
o("nw_stride:                      ; the next one coprime to the total")
st("j0", "WSTRIDE"); ld("j1", "WTOTAL")
o("nw_gcd:")
J("jjz j1, nw_gcd_done", "jdiv j2, j0, j1", "jmul j2, j2, j1", "jsub j2, j0, j2", "jadd j0, j1, j14", "jadd j1, j2, j14", "jjmp nw_gcd")
o("nw_gcd_done:")
J("jldi j10, 1", "jsub j10, j0, j10", "jjz j10, nw_go")
ld("j0", "WSTRIDE"); J("jldi j10, 1", "jadd j0, j0, j10"); ld("j1", "WTOTAL"); J("jsub j10, j0, j1", "jjn j10, nw_stride", "jldi j0, 1", "jjmp nw_stride")
o("nw_go:")
setg("EXPLORE", 1); J("jret")
o("nw_none:                        ; every form rests: nothing to try")
st("j14", "EXPLORE"); J("jret")
o("r_explore_frame:                ; up to %d thoughts; a win ends the frame (the population changed)" % TRIALS)
setg("TRN", TRIALS)
o("ex_lap:")
J("jcall r_trial", "jjz j0, ex_calm", "jldi j10, 2", "jsub j10, j0, j10", "jjz j10, ex_done")
incg("TRN", -1); J("jjnz j10, ex_lap")
o("ex_done:")
J("jret")
o("ex_calm:")
st("j14", "EXPLORE"); J("jret")
o("r_trial:                        ; one candidate -> j0 = 0 nothing left to try, 1 lost (or already tried), 2 won")
ld("j9", "RADIUS"); J("jldi j10, 1", "jsub j10, j9, j10", "jjnz j10, tr_jump")
o("tr_walk:")
ld("j9", "WALKI"); ld("j10", "WTOTAL"); J("jsub j10, j9, j10", "jjnn j10, tr_none")
ld("j1", "WSTRIDE"); J("jmul j1, j1, j9"); ld("j10", "WSTART"); J("jadd j1, j1, j10"); ld("j2", "WTOTAL")
J("jdiv j3, j1, j2", "jmul j3, j3, j2", "jsub j1, j1, j3"); st("j1", "FN")
incg("WALKI")
st("j14", "TI")
o("tr_map:                         ; the op FN -> its form and its op in that form")
ld("j1", "TI"); form_addr("j9", "j1"); J("jld j10, j9, %d" % F_DISABLED, "jjnz j10, tr_map_next", "jldb j1, j9, %d" % F_REC, "jcall r_count")
ld("j1", "FN"); J("jsub j10, j1, j0", "jjn j10, tr_map_found", "jadd j1, j10, j14"); st("j1", "FN")
o("tr_map_next:")
incg("TI"); J("jjmp tr_map")
o("tr_map_found:")
ld("j1", "TI"); form_addr("j3", "j1"); J("jldi j10, %d" % F_REC, "jadd j3, j3, j10"); ld("j2", "FN"); li("j4", CAND); J("jcall r_apply")
o("  jldb j1, j14, %s" % num(CAND)); J("jldi j10, %d" % (LMAX + 1), "jsub j10, j1, j10", "jjnn j10, tr_walk")
li("j1", CAND); J("jcall r_hash", "jcall r_tried", "jjz j0, tr_judge", "jldi j10, 1", "jsub j10, j0, j10", "jjz j10, tr_walk", "jjmp tr_none")
o("tr_judge:")
ld("j1", "TI"); st("j1", "JF"); J("jcall r_judge", "jret")
o("tr_none:")
J("jldi j0, 0", "jret")
o("tr_jump:                        ; a round of longer jumps: RADIUS random edits on one form, BUDGET of them")
ld("j9", "BUDGET"); J("jjz j9, tr_none", "jldi j10, 1", "jsub j9, j9, j10"); st("j9", "BUDGET")
J("jldi j1, %d" % NF, "jcall r_randmod"); st("j0", "TI"); setg("TF", NF)
o("tr_pick:                        ; the first form from there that may mutate")
ld("j1", "TI"); form_addr("j9", "j1"); J("jld j10, j9, %d" % F_DISABLED, "jjz j10, tr_picked")
ld("j1", "TI"); J("jldi j10, 1", "jadd j1, j1, j10", "jldi j10, %d" % (NF - 1), "jand j1, j1, j10"); st("j1", "TI")
incg("TF", -1); J("jjz j10, tr_none", "jjmp tr_pick")
o("tr_picked:")
for k in range(6):
    J("jld j10, j9, %d" % (F_REC + 8 * k) if k < 4 else "jldi j10, 0")
    o("  jst j10, j14, %s" % num(TMP + 8 * k))
ld("j9", "RADIUS"); st("j9", "RI")
o("tr_edit:")
o("  jldb j1, j14, %s" % num(TMP)); J("jcall r_count", "jadd j1, j0, j14", "jcall r_randmod", "jadd j2, j0, j14")
ld("j1", "TI"); li("j3", TMP); li("j4", CAND); J("jcall r_apply")
o("  jldb j1, j14, %s" % num(CAND)); J("jldi j10, %d" % (LMAX + 1), "jsub j10, j1, j10", "jjnn j10, tr_lost")
for k in range(6):
    o("  jld j10, j14, %s" % num(CAND + 8 * k)); o("  jst j10, j14, %s" % num(TMP + 8 * k))
incg("RI", -1); J("jjnz j10, tr_edit")
li("j1", CAND); J("jcall r_hash", "jcall r_tried", "jjz j0, tr_judge", "jldi j10, 1", "jsub j10, j0, j10", "jjz j10, tr_lost", "jjmp tr_none")
o("tr_lost:")
J("jldi j0, 1", "jret")

# ---- files
o("; ---- the folder: \"formas\" (the population, rewritten whole after each win) and \"archivo\" (a line per verdict)")
o("r_put_num:                      ; j1 = a number >= 0, j2 = digits, j3 = where (uses j4, j5, j10)")
o("pn_lap:")
J("jldi j10, 1", "jsub j2, j2, j10", "jjn j2, pn_done", "jldi j10, 10", "jdiv j4, j1, j10", "jmul j5, j4, j10", "jsub j5, j1, j5",
  "jldi j10, 48", "jadd j5, j5, j10", "jadd j10, j3, j2", "jstb j5, j10, 0", "jadd j1, j4, j14", "jjmp pn_lap")
o("pn_done:")
J("jret")
o("r_put_rec:                      ; j1 = a recipe, j3 = where: its %d letters as digits, '.' where it has none" % LMAX)
J("jldb j2, j1, 0", "jldi j4, 0")
o("pr_lap:")
J("jldi j5, 46", "jsub j10, j4, j2", "jjnn j10, pr_put", "jadd j5, j1, j4", "jldb j5, j5, 1", "jldi j10, 48", "jadd j5, j5, j10")
o("pr_put:")
J("jadd j10, j3, j4", "jstb j5, j10, 0", "jldi j10, 1", "jadd j4, j4, j10", "jldi j10, %d" % LMAX, "jsub j10, j4, j10", "jjnz j10, pr_lap", "jret")
o("r_get_num:                      ; j1 = where, j2 = digits -> j0 (a non-digit counts as 0; uses j3, j10)")
J("jldi j0, 0")
o("gn_lap:")
J("jjz j2, gn_done", "jldi j10, 10", "jmul j0, j0, j10", "jldb j3, j1, 0", "jldi j10, 48", "jsub j3, j3, j10", "jjn j3, gn_skip",
  "jldi j10, 10", "jsub j10, j3, j10", "jjnn j10, gn_skip", "jadd j0, j0, j3")
o("gn_skip:")
J("jldi j10, 1", "jadd j1, j1, j10", "jsub j2, j2, j10", "jjmp gn_lap")
o("gn_done:")
J("jret")
o("r_get_rec:                      ; j1 = %d characters, j3 = a recipe: the digits 1-9 up to the first other one" % LMAX)
J("jldi j4, 0")
o("gr_lap:")
J("jldi j10, %d" % LMAX, "jsub j10, j4, j10", "jjz j10, gr_done", "jadd j5, j1, j4", "jldb j5, j5, 0", "jldi j10, 49",
  "jsub j5, j5, j10", "jjn j5, gr_done", "jldi j10, 9", "jsub j10, j5, j10", "jjnn j10, gr_done", "jldi j10, 1",
  "jadd j5, j5, j10", "jadd j10, j3, j4", "jstb j5, j10, 1", "jldi j10, 1", "jadd j4, j4, j10", "jjmp gr_lap")
o("gr_done:")
J("jstb j4, j3, 0", "jret")
o("r_file:                         ; j10 = request (5 read, 6 write, 7 close), FH = the handle, j11, j12 -> j13")
J("jldi j9, 32"); ld("j8", "FH"); J("jshl j8, j8, j9", "jor j10, j10, j8", "jcall r_tocar", "jret")
o("r_archive:                      ; a line: round, slot, loser, the other, reason, the totals (loser's, winner's), radius")
li("j1", ALINE); li("j2", 0x2020202020202020); J("jldi j3, %d" % (RECLEN // 8))
o("ar_blank:")
J("jst j2, j1, 0", "jldi j10, 8", "jadd j1, j1, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, ar_blank")
ld("j1", "EPOCH"); J("jldi j2, 6"); li("j3", ALINE); J("jcall r_put_num")
ld("j1", "JF"); J("jldi j10, 48", "jadd j1, j1, j10"); o("  jstb j1, j14, %s" % num(ALINE + 7))
ld("j1", "ALOSER"); li("j3", ALINE + 9); J("jcall r_put_rec")
ld("j1", "AOTHER"); li("j3", ALINE + 41); J("jcall r_put_rec")
ld("j1", "AREASON"); J("jldi j10, 4", "jshl j1, j1, j10"); li("j10", RSN); J("jadd j1, j1, j10", "jldi j2, 0")
o("ar_reason:")
J("jadd j3, j1, j2", "jldb j3, j3, 0"); li("j10", ALINE + 73); J("jadd j10, j10, j2", "jstb j3, j10, 0", "jldi j10, 1", "jadd j2, j2, j10",
  "jldi j10, 15", "jsub j10, j2, j10", "jjnz j10, ar_reason")
ld("j1", "ATL"); J("jldi j2, 7"); li("j3", ALINE + 89); J("jcall r_put_num")
ld("j1", "ATW"); J("jldi j2, 7"); li("j3", ALINE + 97); J("jcall r_put_num")
ld("j1", "RADIUS"); J("jldi j2, 1"); li("j3", ALINE + 105); J("jcall r_put_num")
J("jldi j1, 10"); o("  jstb j1, j14, %s" % num(ALINE + RECLEN - 1))
ld("j9", "AH"); J("jjn j9, ar_done"); st("j9", "FH"); J("jldi j10, 6"); li("j11", ALINE); li("j12", RECLEN); J("jcall r_file")
o("ar_done:")
J("jret")
o("r_open:                         ; j11 = a label, j12 = its bytes -> FH = the handle (or -1)")
J("jldi j10, 4", "jcall r_tocar"); st("j13", "FH"); J("jret")
o("r_save_forms:                   ; \"formas1 \" round(6) generator(16 hex) wins(6), then per form: recipe worth(7) cells(4)")
o("  jld j1, j14, %s" % num(MAGIC)); o("  jst j1, j14, %s" % num(TEXT))
ld("j1", "EPOCH"); J("jldi j2, 6"); li("j3", TEXT + 8); J("jcall r_put_num")
ld("j1", "RNG"); li("j3", TEXT + 15 + 15); J("jldi j4, 16")
o("sf_hex:                         ; the generator, from its last nibble back")
J("jldi j10, 15", "jand j5, j1, j10", "jldi j10, 10", "jsub j10, j5, j10", "jjn j10, sf_digit", "jldi j10, 39", "jadd j5, j5, j10")
o("sf_digit:")
J("jldi j10, 48", "jadd j5, j5, j10", "jstb j5, j3, 0", "jldi j10, 4", "jshr j1, j1, j10", "jldi j10, 1", "jsub j3, j3, j10",
  "jsub j4, j4, j10", "jjnz j4, sf_hex")
ld("j1", "WINS"); J("jldi j2, 6"); li("j3", TEXT + 32); J("jcall r_put_num")
for a, ch in ((TEXT + 14, 32), (TEXT + 31, 32), (TEXT + 38, 10)):
    J("jldi j1, %d" % ch); o("  jstb j1, j14, %s" % num(a))
for f in range(NF):
    base = TEXT + HDR_LEN + FLINE * f
    fa = FORMS + FSZ * f
    li("j1", fa + F_REC); li("j3", base); J("jcall r_put_rec")
    li("j9", fa); J("jld j1, j9, %d" % F_WORTH, "jldi j2, 7"); li("j3", base + 32); J("jcall r_put_num")
    li("j9", fa); J("jld j1, j9, %d" % F_COUNT, "jldi j2, 4"); li("j3", base + 40); J("jcall r_put_num")
    for a, ch in ((base + 31, 32), (base + 39, 32), (base + 44, 10)):
        J("jldi j1, %d" % ch); o("  jstb j1, j14, %s" % num(a))
li("j11", LBL_F); J("jldi j12, 6", "jcall r_open"); ld("j9", "FH"); J("jjn j9, sf_done")
J("jldi j10, 6"); li("j11", TEXT); li("j12", FORMS_BYTES); J("jcall r_file", "jldi j10, 7", "jcall r_file")
o("sf_done:")
J("jret")
o("r_load_forms:                   ; the population the folder kept, or the seeds")
for f in range(NF):
    for k in range(4):
        o("  jld j1, j14, %s" % num(SEEDR + 32 * f + 8 * k)); li("j9", FORMS + FSZ * f); J("jst j1, j9, %d" % (F_REC + 8 * k))
li("j11", LBL_F); J("jldi j12, 6", "jcall r_open"); ld("j9", "FH"); J("jjn j9, lf_done")
J("jldi j10, 5"); li("j11", TEXT); li("j12", FORMS_BYTES); J("jcall r_file", "jadd j7, j13, j14", "jldi j10, 7", "jcall r_file")
li("j10", FORMS_BYTES); J("jsub j10, j7, j10", "jjnz j10, lf_done")
o("  jld j1, j14, %s" % num(TEXT)); o("  jld j2, j14, %s" % num(MAGIC)); J("jsub j1, j1, j2", "jjnz j1, lf_done")
li("j1", TEXT + 8); J("jldi j2, 6", "jcall r_get_num"); st("j0", "EPOCH")
li("j1", TEXT + 32); J("jldi j2, 6", "jcall r_get_num"); st("j0", "WINS")
li("j1", TEXT + 15); J("jldi j2, 16", "jldi j0, 0")
o("lf_hex:")
J("jldi j10, 4", "jshl j0, j0, j10", "jldb j3, j1, 0", "jldi j10, 58", "jsub j10, j3, j10", "jjn j10, lf_digit", "jldi j10, 39", "jsub j3, j3, j10")
o("lf_digit:")
J("jldi j10, 48", "jsub j3, j3, j10", "jldi j10, 15", "jand j3, j3, j10", "jor j0, j0, j3", "jldi j10, 1", "jadd j1, j1, j10",
  "jsub j2, j2, j10", "jjnz j2, lf_hex", "jjz j0, lf_recipes"); st("j0", "RNG")
o("lf_recipes:")
for f in range(NF):
    skip = lab("lf_keep_seed")
    li("j1", TEXT + HDR_LEN + FLINE * f); li("j3", TMP); J("jcall r_get_rec")
    o("  jldb j1, j14, %s" % num(TMP)); J("jjz j1, %s" % skip)
    li("j9", FORMS + FSZ * f)
    for k in range(4):
        o("  jld j1, j14, %s" % num(TMP + 8 * k)); J("jst j1, j9, %d" % (F_REC + 8 * k))
    o("%s:" % skip)
o("lf_done:")
J("jret")
o("r_load_archive:                 ; open the archive (kept open: verdicts are appended); the lines of this round's")
o("                                ; population are tried already: so the next run does not judge them again")
li("j11", LBL_A); J("jldi j12, 7", "jcall r_open"); ld("j9", "FH"); st("j9", "AH"); J("jjn j9, la_done")
o("la_piece:")
ld("j9", "AH"); st("j9", "FH"); J("jldi j10, 5"); li("j11", FBUF); li("j12", FCHUNK); J("jcall r_file")
st("j13", "FN"); li("j1", FBUF); st("j1", "FP")
o("la_line:")
ld("j1", "FP"); li("j10", FBUF); J("jsub j2, j1, j10", "jldi j10, %d" % RECLEN, "jadd j2, j2, j10"); ld("j10", "FN")
J("jsub j10, j10, j2", "jjn j10, la_more")
J("jldi j2, 6", "jcall r_get_num"); ld("j1", "EPOCH"); J("jsub j0, j0, j1", "jjnz j0, la_next")
ld("j1", "FP"); J("jldi j10, 9", "jadd j1, j1, j10"); li("j3", TMP2); J("jcall r_get_rec")
li("j1", TMP2); J("jcall r_hash", "jcall r_tried")
o("la_next:")
ld("j1", "FP"); J("jldi j10, %d" % RECLEN, "jadd j1, j1, j10"); st("j1", "FP"); J("jjmp la_line")
o("la_more:")
ld("j1", "FN"); li("j10", FCHUNK); J("jsub j10, j1, j10", "jjz j10, la_piece")
o("la_done:")
J("jret")

# ---- the frame
o("; ---- one step of every form: letters that grow, springs to the transformed home; MOVING = what is not at rest")
o("r_step:")
st("j14", "MOVING"); st("j14", "SF")
o("step_form:")
ld("j1", "SF"); form_addr("j9", "j1"); st("j9", "SFA")
J("jldb j1, j9, %d" % F_REC, "jld j2, j9, %d" % F_GROWN, "jsub j10, j2, j1", "jjnn j10, step_grown")
ld("j10", "MOVING"); J("jldi j11, 1", "jadd j10, j10, j11"); st("j10", "MOVING")
J("jld j3, j9, %d" % F_GTICK, "jsub j3, j3, j11", "jjnz j3, step_tick", "jadd j2, j2, j11", "jst j2, j9, %d" % F_GROWN, "jldi j3, %d" % GROW_FRAMES)
o("step_tick:")
J("jst j3, j9, %d" % F_GTICK)
o("step_grown:")
J("jld j1, j9, %d" % F_FIRST, "jld j2, j9, %d" % F_COUNT, "jldi j10, 7", "jshl j2, j2, j10", "jadd j2, j2, j1",
  "jld j5, j9, %d" % F_MX, "jld j6, j9, %d" % F_MY, "jld j7, j9, %d" % F_GROWN, "jcall r_anchor", "jldi j0, 0", "jldi j13, %d" % REST)
o("spring_lap:")
J("jsub j10, j2, j1", "jjz j10, spring_done")
J("jld j10, j1, %d" % P_BIRTH, "jsub j10, j7, j10", "jjnn j10, spring_free")
o("  ; not grown yet: it waits where its parent is")
J("jld j8, j1, %d" % P_PAR, "jld j9, j8, %d" % P_PX, "jst j9, j1, %d" % P_PX, "jld j9, j8, %d" % P_PY, "jst j9, j1, %d" % P_PY,
  "jst j14, j1, %d" % P_VX, "jst j14, j1, %d" % P_VY, "jjmp spring_next")
o("spring_free:")
J("jldi j15, 0")
for h_, p_, v_, t_, org, m_, b in ((P_HX, P_PX, P_VX, P_TX, "j3", "j5", "sx"), (P_HY, P_PY, P_VY, P_TY, "j4", "j6", "sy")):
    J("jld j8, j1, %d" % h_, "jmul j8, j8, %s" % m_, "jldi j10, 8", "jsar j8, j8, j10", "jadd j8, j8, %s" % org,
      "jst j8, j1, %d" % t_, "jld j9, j1, %d" % p_, "jsub j10, j8, j9", "jld j11, j1, %d" % P_K, "jmul j10, j10, j11",
      "jldi j11, 8", "jsar j10, j10, j11", "jld j11, j1, %d" % v_, "jadd j11, j11, j10", "jldi j12, %d" % DAMP,
      "jmul j10, j11, j12", "jldi j12, 8", "jsar j10, j10, j12", "jsub j11, j11, j10", "jadd j9, j9, j11",
      "jst j9, j1, %d" % p_, "jst j11, j1, %d" % v_, "jsub j12, j8, j9",
      "jadd j10, j12, j13", "jjn j10, %s_moves" % b, "jsub j10, j13, j12", "jjn j10, %s_moves" % b,
      "jadd j10, j11, j13", "jjn j10, %s_moves" % b, "jsub j10, j13, j11", "jjnn j10, %s_rests" % b)
    o("%s_moves:" % b); J("jldi j15, 1"); o("%s_rests:" % b)
J("jjnz j15, spring_moves")
J("jld j8, j1, %d" % P_TX, "jst j8, j1, %d" % P_PX, "jld j8, j1, %d" % P_TY, "jst j8, j1, %d" % P_PY,
  "jst j14, j1, %d" % P_VX, "jst j14, j1, %d" % P_VY, "jjmp spring_next")
o("spring_moves:")
J("jldi j10, 1", "jadd j0, j0, j10")
o("spring_next:")
J("jldi j10, %d" % PSZ, "jadd j1, j1, j10", "jjmp spring_lap")
o("spring_done:")
ld("j10", "MOVING"); J("jadd j10, j10, j0"); st("j10", "MOVING")
incg("SF"); J("jldi j11, %d" % NF, "jsub j10, j10, j11", "jjnz j10, step_form", "jret")
q = bytes(BACKGROUND) * 8
qs = [int.from_bytes(q[i:i + 8], "little") for i in (0, 8, 16)]
o("r_anchor:                       ; the form j9 -> j3, j4 = where its home 0 is drawn: OX - CX*MX >> 8 (uses j8, j10)")
for org, c, m in ((F_OX, F_CX, F_MX), (F_OY, F_CY, F_MY)):
    r = "j3" if org == F_OX else "j4"
    J("jld %s, j9, %d" % (r, org), "jld j8, j9, %d" % c, "jld j10, j9, %d" % m, "jmul j8, j8, j10", "jldi j10, 8", "jsar j8, j8, j10",
      "jsub %s, %s, j8" % (r, r))
J("jret")
o("r_brush:                        ; a square of DT x DT cells centred on the cell j1, j2 (uses j0, j10, j11, BX, BY)")
ld("j10", "DT"); J("jldi j11, 1", "jsar j10, j10, j11", "jsub j1, j1, j10", "jsub j2, j2, j10"); st("j1", "BX"); st("j2", "BY")
ld("j10", "DT"); st("j10", "BN")
o("brush_row:")
ld("j1", "BX"); J("jldi j0, 0")
o("brush_cell:")
J("jcall r_plot", "jldi j10, 1", "jadd j1, j1, j10", "jadd j0, j0, j10"); ld("j10", "DT"); J("jsub j10, j0, j10", "jjn j10, brush_cell")
ld("j2", "BY"); J("jldi j10, 1", "jadd j2, j2, j10"); st("j2", "BY"); incg("BN", -1); J("jjnz j10, brush_row", "jret")
o("r_fill:                         ; the background, 24 bytes (8 cells) at a time")
li("j1", RGB); li("j2", RGB + 3 * W * H)
for r, v in zip(("j3", "j4", "j5"), qs):
    li(r, v)
J("jldi j6, 24")
o("fill_lap:")
J("jst j3, j1, 0", "jst j4, j1, 8", "jst j5, j1, 16", "jadd j1, j1, j6", "jsub j7, j2, j1", "jjnz j7, fill_lap", "jret")
o("r_plot:                         ; the cell j1, j2 in the colour PR PG PB, on the screen only (uses j10, j11)")
J("jjn j1, plot_out", "jjn j2, plot_out", "jldi j10, %d" % W, "jsub j11, j1, j10", "jjnn j11, plot_out",
  "jldi j11, %d" % H, "jsub j11, j2, j11", "jjnn j11, plot_out", "jmul j11, j2, j10", "jadd j11, j11, j1", "jldi j10, 3",
  "jmul j11, j11, j10"); li("j10", RGB); J("jadd j11, j11, j10")
ld("j10", "PR"); J("jstb j10, j11, 0"); ld("j10", "PG"); J("jstb j10, j11, 1"); ld("j10", "PB"); J("jstb j10, j11, 2")
o("plot_out:")
J("jret")
def ghost_colour(src):
    """PR PG PB = (the form j9's colour + 2 background) / 3."""
    for fld, bgc, g in zip((F_CR, F_CG, F_CB), BACKGROUND, ("PR", "PG", "PB")):
        J("jld j1, j9, %d" % fld); li("j10", 2 * bgc); J("jadd j1, j1, j10", "jldi j10, 3", "jdiv j1, j1, j10"); st("j1", g)
o("r_draw_ghosts:                  ; this frame's thoughts: each candidate's cells, faint, at its form's seed")
st("j14", "TI")
o("dg_lap:")
ld("j1", "TI"); ld("j10", "GHN"); J("jsub j10, j1, j10", "jjnn j10, dg_done")
J("jldi j10, 3", "jshl j2, j1, j10"); li("j10", GHL); J("jadd j2, j2, j10", "jld j2, j2, 0"); form_addr("j9", "j2")
ghost_colour("j9")
J("jld j10, j9, %d" % F_T); st("j10", "DT"); J("jld j10, j9, %d" % F_MX); st("j10", "GMX"); J("jld j10, j9, %d" % F_MY); st("j10", "GMY")
J("jcall r_anchor")
o("  ; the room's corner cell (-%d, -%d), drawn: anchor - (%d MX, %d MY)" % (RW // 2, RH // 2, RW // 2, RH // 2))
ld("j10", "GMX"); J("jldi j11, %d" % (RW // 2), "jmul j10, j10, j11", "jsub j5, j3, j10")
ld("j10", "GMY"); J("jldi j11, %d" % (RH // 2), "jmul j10, j10, j11", "jsub j6, j4, j10")
ld("j1", "TI"); J("jldi j10, 9", "jshl j3, j1, j10"); li("j10", GHB); J("jadd j3, j3, j10", "jldi j4, 0")
o("dg_row:")
J("jld j7, j3, 0", "jldi j8, 0")
o("dg_bit:")
J("jjz j7, dg_row_next", "jldi j10, 1", "jand j10, j7, j10", "jjz j10, dg_bit_next")
ld("j10", "GMX"); J("jmul j1, j8, j10", "jadd j1, j1, j5", "jldi j10, 128", "jadd j1, j1, j10", "jldi j10, 8", "jsar j1, j1, j10")
ld("j10", "GMY"); J("jmul j2, j4, j10", "jadd j2, j2, j6", "jldi j10, 128", "jadd j2, j2, j10", "jldi j10, 8", "jsar j2, j2, j10")
J("jcall r_brush")
o("dg_bit_next:")
J("jldi j10, 1", "jshr j7, j7, j10", "jadd j8, j8, j10", "jjmp dg_bit")
o("dg_row_next:")
J("jldi j10, 8", "jadd j3, j3, j10", "jldi j10, 1", "jadd j4, j4, j10", "jldi j10, 50", "jsub j10, j4, j10", "jjnz j10, dg_row")
incg("TI"); J("jjmp dg_lap")
o("dg_done:")
J("jret")
o("r_draw_all:                     ; the forms back to front: each grown particle joined to its parent")
st("j14", "TF")
o("da_lap:")
ld("j1", "TF"); J("jldi j10, 3", "jshl j1, j1, j10"); li("j10", ZORD); J("jadd j1, j1, j10", "jld j1, j1, 0"); st("j1", "TI")
form_addr("j9", "j1"); st("j9", "DFA")
J("jld j10, j9, %d" % F_HIDDEN, "jjz j10, da_full"); ghost_colour("j9"); J("jjmp da_coloured")
o("da_full:")
for fld, g in zip((F_CR, F_CG, F_CB), ("PR", "PG", "PB")):
    J("jld j1, j9, %d" % fld); st("j1", g)
o("da_coloured:")
J("jld j10, j9, %d" % F_GROWN); st("j10", "DGROWN"); J("jld j10, j9, %d" % F_T); st("j10", "DT")
J("jld j3, j9, %d" % F_FIRST, "jld j4, j9, %d" % F_COUNT, "jldi j10, 7", "jshl j4, j4, j10", "jadd j4, j4, j3")
o("df_lap:")
J("jsub j10, j4, j3", "jjz j10, df_done", "jld j10, j3, %d" % P_BIRTH); ld("j11", "DGROWN"); J("jsub j10, j11, j10", "jjn j10, df_next")
for p_, rr in ((P_PX, "j5"), (P_PY, "j6")):
    J("jld %s, j3, %d" % (rr, p_), "jldi j10, 128", "jadd %s, %s, j10" % (rr, rr), "jldi j10, 8", "jsar %s, %s, j10" % (rr, rr))
J("jld j12, j3, %d" % P_PAR)
for p_, rr, c0 in ((P_PX, "j7", "j5"), (P_PY, "j8", "j6")):
    J("jld %s, j12, %d" % (rr, p_), "jldi j10, 128", "jadd %s, %s, j10" % (rr, rr), "jldi j10, 8", "jsar %s, %s, j10" % (rr, rr),
      "jsub %s, %s, %s" % (rr, rr, c0))
J("jadd j9, j7, j14", "jjnn j9, df_ax", "jsub j9, j14, j9")
o("df_ax:")
J("jadd j12, j8, j14", "jjnn j12, df_ay", "jsub j12, j14, j12")
o("df_ay:")
J("jsub j10, j9, j12", "jjnn j10, df_n", "jadd j9, j12, j14")
o("df_n:                           ; j9 = the cells to its parent; stamped every half stroke, the body stays closed")
ld("j10", "DT"); J("jldi j11, 1", "jsar j10, j10, j11", "jjnz j10, df_half", "jldi j10, 1")
o("df_half:")
J("jadd j9, j9, j10", "jsub j9, j9, j11", "jdiv j9, j9, j10")
J("jadd j1, j5, j14", "jadd j2, j6, j14", "jcall r_brush", "jjz j9, df_next", "jldi j13, 1")
o("df_line:")
J("jmul j1, j7, j13", "jdiv j1, j1, j9", "jadd j1, j1, j5", "jmul j2, j8, j13", "jdiv j2, j2, j9", "jadd j2, j2, j6", "jcall r_brush",
  "jldi j10, 1", "jadd j13, j13, j10", "jsub j10, j9, j13", "jjnn j10, df_line")
o("df_next:")
J("jldi j10, %d" % PSZ, "jadd j3, j3, j10", "jjmp df_lap")
o("df_done:")
o("  ; the focused form: its seed in white")
ld("j1", "TI"); ld("j2", "FOCUS"); J("jsub j1, j1, j2", "jjnz j1, da_next")
li("j1", 255); st("j1", "PR"); st("j1", "PG"); st("j1", "PB")
ld("j9", "DFA"); J("jld j3, j9, %d" % F_FIRST, "jld j1, j3, %d" % P_PX, "jldi j10, 128", "jadd j1, j1, j10", "jldi j10, 8", "jsar j1, j1, j10",
                   "jld j2, j3, %d" % P_PY, "jldi j10, 128", "jadd j2, j2, j10", "jldi j10, 8", "jsar j2, j2, j10")
ld("j10", "DT"); J("jldi j11, 3", "jdiv j10, j10, j11", "jjnz j10, da_dot", "jldi j10, 1")
o("da_dot:")
st("j10", "DT"); J("jcall r_brush")
o("da_next:")
incg("TF"); J("jldi j11, %d" % NF, "jsub j10, j10, j11", "jjnz j10, da_lap", "jret")

# ---- small things
o("r_randmod:                      ; j1 = n > 0 -> j0 = a number from the generator in [0, n) (uses j10..j12)")
J("jcall r_rand", "jldi j11, 1", "jshr j10, j10, j11", "jdiv j0, j10, j1", "jmul j0, j0, j1", "jsub j0, j10, j0", "jret")
o("r_rand:                         ; j10 = the next of the generator (xorshift64); uses j11, j12")
ld("j10", "RNG")
for sh, op in ((13, "jshl"), (7, "jshr"), (17, "jshl")):
    J("jldi j12, %d" % sh, "%s j11, j10, j12" % op, "jxor j10, j10, j11")
st("j10", "RNG"); J("jret")
o("r_tocar:                        ; one request (j10 type, j11 a, j12 b) -> j13 answer, j12 = b as it came back")
J("jldi j13, %Xh" % QUEUE, "jldi j15, 1", "jst j15, j13, 0", "jst j10, j13, 8", "jst j11, j13, 16", "jst j12, j13, 24",
  "jsys j15, j13", "jld j12, j13, 24", "jld j13, j13, 32", "jret")

if COMER:
    COMER.routines()
if LUMA:
    LUMA.routines(globals())
open(os.path.join(AQUI, COMER.out if COMER else "formas.jsm"), "w", encoding="utf-8", newline="\n").write("\n".join(L) + "\n")
print("ok", len(L), "lines; seeds", " ".join(SEEDS), "; towers", towers, "; room 0 %Xh" % ROOM)
