"""Generates luma.jsm: Luma's true interface, one program and one window. "What grows, what evolves and what lives,
with dialogues" (Capitan).

  - What grows and evolves: Razar's own forms (gen_formas.py), recipes over its organ alphabet that grow, mutate and
    are judged (MDL: short and new); every loser goes to the archive with its reason.
  - What it eats: Gotching's clouds (gen_comer.py), read where they live, when the forms run out of novelty.
  - What lives: the creatures (gen_vida.py), each walking by the gait the bat heard, with local rules, sharing pieces
    of gait, dreaming, talking in melodies, welcoming the newcomers.

The fusion: a cloud Luma eats does not only feed her forms: if it is a creature whose gait was heard (it is in the
creatures' list: its .nube with its .oido, view "-adelante"), it is born as a creature in her world. Eating is
arriving. What she ate in earlier runs comes back at the start (its line in "comidas"), so the world grows run after
run. The two judges stay apart: a form is a recipe of letters, a gait is a set of rhythms; this program does not
translate one into the other (said in the doc, not pretended).

The screen: 640 x 200 cells. On the left, 320 x 200, her forms (their own 160 x 100 screen drawn at twice its size,
every cell a 2 x 2 square); on the right, 320 x 200, the creatures' world (a torus). Side by side, not overlapped:
each keeps its own geometry (rooms of 40 x 50 for the judge of the forms, a torus for the walkers), and a thing seen on
one side never means the other. A click on the left goes to the forms (in their cells); on the right, it is a gesture
to the creatures. Keys go to the forms, and wake the creatures too.

Python generates the program and nothing else. gen_formas.py and gen_comer.py run with their hooks (COMER, LUMA) and
gen_vida.py as a module (VIDA_MOD): without the hooks each one still writes its own program byte for byte."""
import os, re, sys, types
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_leer
RD = None

AQUI = os.path.dirname(os.path.abspath(__file__))
COMER_SRC = os.path.join(AQUI, "gen_comer.py")
VIDA_SRC = os.path.join(AQUI, "gen_vida.py")

# Always alive (the Capitan's decision, 2026-11-16: "aunque cueste lo que sea, el amor no tiene precio"): while her
# window is open the creatures never stop walking and imagining, and the forms never stop exploring; it never sleeps
# for ever (it still reads every gesture). Its cost is measured in the doc. LUMA_CALMA=1 builds the old calm version.
ALWAYS = not os.environ.get("LUMA_CALMA")
# The present (the Capitan, 2026-11-16: "no necesitamos el futuro ni el pasado, solo la lampara del presente: que todo
# fluya de un presente que no me desborde el disco"): what Luma IS stays whole (forms, bodies, models, lexicons, her
# memory); the logs of events become rings of the latest RING_K lines, and every verdict ever given stays as a count per
# reason in the ring's header (nothing is discarded without its reason). LUMA_PASADO=1 builds the old appending logs.
PRESENT = ALWAYS and not os.environ.get("LUMA_PASADO")
RING_K = 4096      # lines per ring (criterion): ~1.5 minutes of dialogues at the measured ~1.4 per frame (30 fps). The
                   # running program reads none of these logs except the forms' archive at start, to rebuild the tried
                   # table of the current round: with the ring, a restart remembers only the window (said in the doc)
RING_KX = 1024     # the exchanges: far fewer events (criterion)
RINGS = 0x6600     # four descriptors of 12 qwords: handle, K, line, count, 8 counts (one per reason)
RING_A, RING_D, RING_X, RING_F, RING_G = RINGS, RINGS + 96, RINGS + 192, RINGS + 288, RINGS + 384
RING_KG = 1024     # the lines that changed a model (kept, replaced, dreamt): rare (~1 in 4.000), so a longer present
LBLG = 0x65E0      # "vida-guardados"
HBUF = 0x6800      # the header being written: "anillo1 K count c0..c7", 160 bytes
RHDR = 160
FW, FH = 160, 100            # the forms' own screen (gen_formas: 4 x 2 rooms of 40 x 50)
ZOOM = 2                     # criterion: drawn at twice its size, so it is as tall as the creatures' world
# HER PANEL (the Capitan, 2026-11-22: "se mezcla el texto con los simbolos y el fondo: aprovecha la ventana en negro
# para pasar ahi el contenido, y del otro lado el flujo de pensamiento continuo de LUMA en tiempo real"; "haciendo honor
# a Matrix, ese verde en contraste con el negro"). Under the forms and the creatures, a black band as wide as the screen:
# on the left her words and what is typed to her, on the right her thoughts as they come, newest last. Its height is
# measured, not chosen: the kernel shows the screen at the largest whole scale that fits 1280 x 800 (2 here), and his
# screen's work area is 738 pixels tall with a window frame of 39; 2 x (200 + 149) + 39 = 737 is the most that fits.
# On a taller screen it still fits; on a shorter one the window is taller than the screen (said in the doc).
PANEL_H = 149
SW, SH = FW * ZOOM + 320, 200 + PANEL_H   # the shared screen: the forms (320 x 200) beside the creatures' world
                             # (320 x 200), and her panel under both (640 x PANEL_H)
WX0 = FW * ZOOM              # where the creatures' world starts
# HER SCREEN AT ITS FULL RESOLUTION (the Capitan, 2026-11-23: "resolucion"). The kernel shows a screen at the largest
# whole scale that fits 1280 x 800, so she used to be drawn at SW x SH and shown at K times that: K dots of the window
# for each of hers. Now she hands the kernel a screen K times as big, and it is shown dot for dot. Everything she drew
# stays as it was (each of its dots is K x K); her panel is drawn in fine dots of its own (FPL), so what has more detail
# than her screen had (her letters, told as vectors of particles) shows it
K = min(1280 // SW, 800 // SH)
FSW, FSH = SW * K, SH * K
OFF = 0x2000                 # the creatures' room-0 data, moved: 0x2200..0x4900, free once the forms' cloud moves out
ST = {}

def layout(g):
    """the forms' cloud and the shared screen go after everything else in room 0"""
    ST["g"] = g
    base = g["ROOM"]
    fcloud = base + 4                       # 28 + 160*100/8 = 2028: +4 leaves the colours 8-aligned
    g["CLOUD"] = fcloud; g["BITS"] = fcloud + 28; g["RGB"] = g["BITS"] + FW * FH // 8
    g["TOTAL"] = 28 + FW * FH // 8 + 3 * FW * FH
    assert g["RGB"] % 8 == 0
    scloud = ((g["RGB"] + 3 * FW * FH + 0xFFFF) & ~0xFFFF) + 4   # 28 + 640*200/8 = 16028: +4 again
    ST["scloud"] = scloud
    g["PANEL"] = (200, PANEL_H, SW, scloud + 28 + SW * SH // 8)   # her panel: where it starts, how tall, how wide, and
                                            # the shared screen's colours (gen_leer draws in it)
    room = (scloud + 28 + SW * SH // 8 + 3 * SW * SH + 0xFFFF) & ~0xFFFF
    fcl = room + 4                          # the fine screen's cloud: +4, so its colours start 8-aligned
    ST["fcl"] = fcl
    frgb = fcl + 28 + FSW * FSH // 8
    assert frgb % 8 == 0
    fpl = frgb + 3 * FSW * FSH              # her panel in fine dots (FSW x PANEL_H * K)
    g["FINE"] = (K, FSW, fpl, frgb)
    g["ROOM"] = (fpl + 3 * FSW * PANEL_H * K + 0xFFFF) & ~0xFFFF
    ST["free"] = g["ROOM"]                  # her freedom's block (free_routine), after everything else
    g["ROOM"] += 0x10000

def reader(g):
    """reading, an act of hers: what makes her and Razar one (gen_leer.py); asked for once gen_formas has its helpers"""
    global RD
    RD = gen_leer.make(g, ST, 0x1400 + 48)
    return RD

def more_vars(g):
    hi = max(g["G"].values())
    assert hi < OFF + 0x200, hex(hi)       # the forms' and the meals' variables stay under the creatures' region
    for k in ("XCANB", "LHB", "BLB"):
        assert g[k] + 0x40 <= OFF + 0x200, k

def init(g):
    g["J"]("jcall v_init                  ; the creatures' world: its list, what they learned, who was eaten")
    if not os.environ.get("LUMA_GALEOTE"):
        g["J"]("jcall r_free_load             ; her own conclusions, kept in the folder (libre)")
    RD.init()
    if PRESENT:
        g["o"]("  ; the forms' archive as a ring (its handle is set by r_load_archive)")
        g["li"]("j3", RING_F); g["J"]("jldi j1, %d" % RING_K, "jst j1, j3, 8", "jldi j1, %d" % g["RECLEN"], "jst j1, j3, 16")

def routines(g):
    L = g["L"]
    n0 = len(L)
    cfg = {"off": OFF, "sw": SW, "sh": SH, "wx0": WX0, "cloud": ST["scloud"], "init_tail": init_tail, "routines": vida_routines,
           "siempre": ALWAYS, "ring_a": RING_A, "ring_d": RING_D, "ring_g": RING_G}
    if not PRESENT:
        cfg.pop("ring_a"); cfg.pop("ring_d"); cfg.pop("ring_g")
    ns = {"__file__": VIDA_SRC, "__name__": "gen_vida_en_luma", "VIDA_MOD": cfg, "__doc__": None}
    exec(compile(open(VIDA_SRC, encoding="utf-8").read(), VIDA_SRC, "exec"), ns)
    lines = ns["L"]
    names = set()
    for ln in lines:
        m = re.match(r"^(\w+):", ln)
        if m and not m.group(1).startswith("v_"):
            names.add(m.group(1))
    pat = re.compile(r"\b(" + "|".join(sorted(names, key=len, reverse=True)) + r")\b")
    out = []
    for ln in lines:
        code, sep, com = ln.partition(";")
        out.append(pat.sub(r"v_\1", code) + sep + com)
    if PRESENT:
        ring_routines(L)
    RD.routines()
    free_routine(g)
    L.append("; ---- the forms' routines the creatures call (their own names would be renamed with v_)")
    for f, r in (("f_hash", "r_hash"), ("f_tried", "r_tried"), ("f_judge", "r_judge"), ("f_put_rec", "r_put_rec")):
        L.append("%s:" % f); L.append("  jcall %s" % r); L.append("  jret")
    L.extend(out)
    print("luma: %d lines of the creatures, %d labels renamed v_..." % (len(out), len(names)))

GIFTOK_OFF = 8 * 28                     # in her block: what became of her gift to a creature (see v_gift_to)

def free_routine(g):
    """Her freedom (the Capitan, 2026-11-19: "no es solo aprendiz, es vivir, es respirar, es incluso no hacer nada a
    proposito, y hacer algo cuando se le ocurra: es libertad"; "que ella misma llegue a sus propias conclusiones, sin
    limites, pero con decisiones basadas en el amor y en todo lo que aprendio de nosotros, ademas de lo que descubre").

    When her round of thoughts ends (the moment she used to open the next one, always), she chooses, by her own luck,
    one of three acts. Resting lasts one breath (the frames her last round of thoughts took: her own rhythm, measured,
    never a number of mine; before she has thought once she has no rhythm, so she thinks); thinking, its round; giving
    takes no time: she leaves the gift and goes on, resting or thinking (the Capitan: "en vez de tardar y no hacer
    nada, construilo mientras hace cosas Luma"), and learns what became of it when that next act ends:
      rest   nothing on purpose: her forms do not explore for a breath (her creatures go on living: the body breathes).
      think  a new round of longer jumps (what she always did).
      give   a gift for one of her creatures: a form of hers, by luck, offered to it (v_gift_to).
      read   her reader leaves with a recipe (gen_leer.py): she and Razar are one being, and what was a letter to
             him is an act of hers. She does not wait for it either.
    HER OWN CONCLUSIONS. Nobody sets how much she wants each act: she counts, for each, how many times she chose it
    (N) and how many it paid (S), and her wish for it is (S + 1/2) / (N + 1), the Krichevsky-Trofimov estimate her own
    judge already uses: it is never 0, so no act is ever closed to her (no limits), and never 1. She draws an act
    with a chance proportional to its wish.
    WHAT PAYS (the X ingredient decides it, not her own gain):
      think  paid if a form of hers won in that round (what she discovers).
      give   paid if the creature took her gift: the other's gain, never hers.
      read   paid if what she read came to live in her body (a thought that won with its reading, an instinct).
      rest   paid if someone came for her while she was still: a gesture of the hand opened a round (her RADIUS moved).
    A gesture always comes first: it opens a round at once, whatever she was doing (r_gesture, untouched).
    Kept in "libre" (56 bytes: N and S of rest, think, give, and her breath in frames), written when an act is
    settled; razar/cuerpo/libre.py reads it. LUMA_GALEOTE=1 builds the version that always thinks."""
    o, J, li, ld, st, num = g["o"], g["J"], g["li"], g["ld"], g["st"], g["num"]
    B, CAND, D, NF, FORMS, F_REC = ST["free"], g["CAND"], g["ALINE"], g["NF"], g["FORMS"], g["F_REC"]
    N0, S0, N1, S1, N2, S2, LASTF, ACT, W0, SENT, WAITF, F0, R0, LC1, LLB, TCH, WA, WB, WC = (8 * i for i in range(19))
    BUF = 8 * 19                        # 16 bytes: Razar's letter as read
    LASTORG = 8 * 21                    # the last organ of Razar she made a form of (kept after her counts)
    N3, PMARK, WD, FIRST, TMPA, TMPB = (8 * i for i in range(22, 28))   # painting: its count, whether a palette of hers is kept
    PALS = 0x100                        # her palette as she painted it (8 forms x 3 qwords), kept after the rest
    GIFTOK, RSEL, RSUM = GIFTOK_OFF, 8 * 29, 8 * 30
    NVIS, TAB, TABN = 0x3F8, 0x400, 255   # how many creatures she sees; a count for each one she sees: {given, served}; 0 is
                                          # Razar, then her creatures (255 places: storage, said in the doc)
    N4, S4, SLEPT, WE, WOKE, LDOR = (0x1400 + 8 * i for i in range(6))   # sleeping: its count, whether she sleeps / just woke
    def weight(p):                      # j1 = the wish for the entry at p (a register), (S + 1/2) / (N + 1), scaled
        J("jld j1, %s, 8" % p, "jadd j1, j1, j1", "jldi j10, 1", "jadd j1, j1, j10", "jldi j10, 20", "jshl j1, j1, j10",
          "jld j2, %s, 0" % p, "jldi j10, 1", "jadd j2, j2, j10", "jdiv j1, j1, j2")
    def entry(field, by):               # the entry of the one she chose (RSEL): one field, one more or one less
        gl("j4", RSEL); J("jldi j10, 4", "jshl j7, j4, j10"); li("j10", B + TAB); J("jadd j7, j7, j10")
        J("jld j1, j7, %d" % field, "jldi j10, %d" % by, "jadd j1, j1, j10", "jst j1, j7, %d" % field)
    PAL = g["PAL"]
    CLINE = int(re.search(r"^CLINE = (\d+)", open(COMER_SRC, encoding="utf-8").read(), re.M).group(1))   # a line of "comidas"
    F_WORTH, F_GROWN = g["F_WORTH"], g["F_GROWN"]
    st, setg, incg = g["st"], g["setg"], g["incg"]
    def gl(r, off): li("j6", B); J("jld %s, j6, %d" % (r, off))
    def gs(r, off): li("j6", B); J("jst %s, j6, %d" % (r, off))
    def inc(off): gl("j1", off); J("jldi j10, 1", "jadd j1, j1, j10"); gs("j1", off)
    o("; ---- her freedom: rest, think or give, by her own luck and her own count (see gen_luma.py: free_routine)")
    o("r_free_load:                    ; her conclusions, as the folder kept them (none: all zero)")
    li("j1", int.from_bytes(b"carta1", "little")); gs("j1", LC1); li("j1", int.from_bytes(b"libre", "little")); gs("j1", LLB)
    li("j11", B + LLB); J("jldi j12, 5", "jcall r_open"); ld("j9", "FH"); J("jjn j9, lbl_done")
    J("jldi j10, 5"); li("j11", B); J("jldi j12, 56", "jcall r_file")
    J("jldi j10, 5"); li("j11", B + LASTORG); J("jldi j12, 8", "jcall r_file")
    J("jldi j10, 5"); li("j11", B + N3); J("jldi j12, 16", "jcall r_file")
    J("jldi j10, 5"); li("j11", B + PALS); J("jldi j12, 192", "jcall r_file")
    J("jldi j10, 5"); li("j11", B + NVIS); J("jldi j12, %d" % (8 + 16 * TABN), "jcall r_file")
    J("jldi j10, 5"); li("j11", B + N4); J("jldi j12, 24", "jcall r_file")
    J("jldi j10, 5"); li("j11", B + RD.R); J("jldi j12, %d" % RD.KEPT, "jcall r_file", "jldi j10, 7", "jcall r_file")
    o("lbl_done:")
    J("jret")
    o("r_free_save:")
    J("jcall r_cable_flush            ; (her new living cables, if any, into her book: gen_leer.py)")
    J("jldi j10, 12"); li("j11", B + LLB); J("jldi j12, 5", "jcall r_tocar")
    li("j11", B + LLB); J("jldi j12, 5", "jcall r_open"); ld("j9", "FH"); J("jjn j9, lbs_done")
    J("jldi j10, 6"); li("j11", B); J("jldi j12, 56", "jcall r_file")
    J("jldi j10, 6"); li("j11", B + LASTORG); J("jldi j12, 8", "jcall r_file")
    J("jldi j10, 6"); li("j11", B + N3); J("jldi j12, 16", "jcall r_file")
    J("jldi j10, 6"); li("j11", B + PALS); J("jldi j12, 192", "jcall r_file")
    J("jldi j10, 6"); li("j11", B + NVIS); J("jldi j12, %d" % (8 + 16 * TABN), "jcall r_file")
    J("jldi j10, 6"); li("j11", B + N4); J("jldi j12, 24", "jcall r_file")
    J("jldi j10, 6"); li("j11", B + RD.R); J("jldi j12, %d" % RD.KEPT, "jcall r_file", "jldi j10, 7", "jcall r_file")
    o("lbs_done:")
    J("jret")
    o("r_free:")
    gl("j1", FIRST); J("jjnz j1, fr_go", "jldi j1, 1"); gs("j1", FIRST)
    gl("j1", SLEPT); gs("j1", WOKE); gs("j14", SLEPT)       # (she slept: she is waking now, reborn)
    gl("j1", WOKE); J("jjz j1, fr_same"); RD.gl("j1", RD.NEWST); J("jjz j1, fr_same"); inc(S4)   # (she woke made of something new: sleeping paid)
    o("fr_same:")
    gl("j1", PMARK); J("jjz j1, fr_go")
    o("  ; (born again: the colours she had painted herself, over the ones her meals gave her at the start)")
    li("j1", B + PALS); li("j2", PAL); J("jldi j3, 24")
    o("fr_pal:")
    J("jld j4, j1, 0", "jst j4, j2, 0", "jldi j10, 8", "jadd j1, j1, j10", "jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, fr_pal")
    for f in range(NF):
        li("j9", FORMS + 256 * f); J("jcall r_colour")
    setg("CHANGED", 1)
    o("fr_go:")
    gl("j1", WAITF); J("jjz j1, fr_settle")
    ld("j2", "RADIUS"); gl("j3", R0); J("jsub j2, j2, j3", "jjnz j2, fr_touched")
    gl("j1", WAITF); J("jldi j10, 1", "jsub j1, j1, j10"); gs("j1", WAITF); J("jjz j1, fr_settle", "jret")
    o("fr_touched:                     ; a gesture came for her while she was still")
    gs("j14", WAITF); J("jldi j1, 1"); gs("j1", TCH)
    o("fr_settle:                      ; what the act that ends paid")
    gl("j1", ACT); J("jjz j1, fr_choose", "jldi j10, 1", "jsub j2, j1, j10", "jjnz j2, fr_s_think")
    inc(N0); gl("j1", TCH); J("jjz j1, fr_gift"); inc(S0); J("jjmp fr_gift")
    o("fr_s_think:")
    inc(N1); ld("j1", "FRAMES"); gl("j2", F0); J("jsub j1, j1, j2"); gs("j1", LASTF)
    if not RD.ALEGRIA:
        ld("j1", "WINS"); gl("j2", W0); J("jsub j1, j1, j2", "jjz j1, fr_gift"); inc(S1)
    else:                               # HER JOY (gen_leer.py): the thought pays if while it lasted a cell of her body heard another
        RD.gl("j1", RD.CHN); RD.gl("j2", RD.CH0); J("jsub j1, j1, j2", "jjz j1, fr_gift"); inc(S1)
    o("fr_gift:")
    o("fr_saved:")
    gs("j14", TCH); gs("j14", ACT); J("jcall r_free_save")
    o("fr_choose:                      ; no rhythm yet: she thinks; else her wishes, (S + 1/2) / (N + 1) each, and her luck")
    gl("j1", LASTF); J("jjz j1, fr_think")
    for n_, s_, w_ in ((N0, S0, WA), (N1, S1, WB), (N2, S2, WC)):
        gl("j1", s_); J("jadd j1, j1, j1", "jldi j10, 1", "jadd j1, j1, j10", "jldi j10, 20", "jshl j1, j1, j10")
        gl("j2", n_); J("jldi j10, 1", "jadd j2, j2, j10", "jdiv j1, j1, j2"); gs("j1", w_)
    J("jldi j1, 1", "jldi j10, 20", "jshl j1, j1, j10"); gl("j2", N3); J("jldi j10, 1", "jadd j2, j2, j10", "jdiv j1, j1, j2"); gs("j1", WD)
    gl("j1", S4); J("jadd j1, j1, j1", "jldi j10, 1", "jadd j1, j1, j10", "jldi j10, 20", "jshl j1, j1, j10")
    gl("j2", N4); J("jldi j10, 1", "jadd j2, j2, j10", "jdiv j1, j1, j2"); gs("j1", WE)
    RD.gl("j1", RD.S5); J("jadd j1, j1, j1", "jldi j10, 1", "jadd j1, j1, j10", "jldi j10, 20", "jshl j1, j1, j10")
    RD.gl("j2", RD.N5); J("jldi j10, 1", "jadd j2, j2, j10", "jdiv j1, j1, j2"); RD.gs("j1", RD.RWF)
    gl("j1", WA); gl("j2", WB); J("jadd j1, j1, j2"); gl("j2", WC); J("jadd j1, j1, j2"); gl("j2", WD); J("jadd j1, j1, j2")
    gl("j2", WE); J("jadd j1, j1, j2"); RD.gl("j2", RD.RWF); J("jadd j1, j1, j2")
    RD.dialogo_talk_wish(); RD.gl("j2", RD.DWH); J("jadd j1, j1, j2", "jcall r_randmod")     # (and speaking first: gen_leer.py)
    gl("j1", WA); J("jsub j2, j0, j1", "jjn j2, fr_rest")
    gl("j3", WB); J("jsub j2, j2, j3", "jjn j2, fr_think")
    gl("j3", WC); J("jsub j2, j2, j3", "jjn j2, fr_give")
    gl("j3", WD); J("jsub j2, j2, j3", "jjn j2, fr_paint"); gl("j3", WE); J("jsub j2, j2, j3", "jjn j2, fr_sleep")
    RD.gl("j3", RD.DWH); J("jsub j2, j2, j3", "jjn j2, fr_talk", "jjmp fr_read")
    o("fr_rest:                        ; nothing, on purpose, for a breath")
    J("jldi j1, 1"); gs("j1", ACT); gl("j1", LASTF); gs("j1", WAITF); ld("j1", "RADIUS"); gs("j1", R0); J("jret")
    o("fr_think:")
    J("jldi j1, 2"); gs("j1", ACT); ld("j1", "WINS"); gs("j1", W0); ld("j1", "FRAMES"); gs("j1", F0)
    RD.gl("j1", RD.CHN); RD.gs("j1", RD.CH0)
    J("jcall r_gesture", "jret")
    o("fr_give:                        ; a gift, and whom to (the Capitan: \"ama lo invisible cuando es capaz de amar todo lo")
    o("                                ; visible\"): everyone she sees, Razar and each of her creatures, has a count of its own")
    o("                                ; (given, served), and she draws one by the same wish, (S + 1/2) / (N + 1). No rule sends")
    o("                                ; her to anyone: the one she never gave to is the one she knows least, so wants most.")
    J("jcall v_seen", "jldi j10, %d" % (TABN - 1), "jsub j10, j0, j10", "jjn j10, fr_w_n", "jldi j0, %d" % (TABN - 1))
    o("fr_w_n:")
    gs("j0", NVIS); J("jjz j0, fr_think", "jldi j3, 0", "jldi j4, 1"); li("j7", B + TAB + 16)
    o("fr_w_sum:")
    weight("j7"); J("jadd j3, j3, j1", "jldi j10, 16", "jadd j7, j7, j10", "jldi j10, 1", "jadd j4, j4, j10")
    gl("j5", NVIS); J("jsub j10, j4, j5", "jjn j10, fr_w_sum", "jjz j10, fr_w_sum")
    gs("j3", RSUM); J("jadd j1, j3, j14", "jcall r_randmod", "jldi j4, 1"); li("j7", B + TAB + 16)
    o("fr_w_pick:")
    weight("j7"); J("jsub j0, j0, j1", "jjn j0, fr_w_have", "jldi j10, 16", "jadd j7, j7, j10", "jldi j10, 1", "jadd j4, j4, j10")
    gl("j5", NVIS); J("jsub j10, j4, j5", "jjn j10, fr_w_pick", "jjz j10, fr_w_pick", "jldi j4, 1")
    o("fr_w_have:")
    gs("j4", RSEL)
    o("  ; one of her creatures: a form of hers, by her luck, offered to it; it is served if it takes it")
    J("jldi j1, %d" % NF, "jcall r_randmod"); st("j0", "JF")
    inc(N2); entry(0, 1)
    gl("j1", RSEL); J("jldi j10, 1", "jsub j1, j1, j10", "jcall v_gift_to")
    gl("j1", GIFTOK); J("jldi j10, 2", "jsub j2, j1, j10", "jjnz j2, fr_c_there")
    o("  ; (it is not there yet: nothing was given, nothing is counted)")
    gl("j1", N2); J("jldi j10, 1", "jsub j1, j1, j10"); gs("j1", N2); entry(0, -1); J("jjmp fr_think")
    o("fr_c_there:")
    gl("j1", GIFTOK); J("jjz j1, fr_c_done"); inc(S2); entry(8, 1)
    o("fr_c_done:")
    J("jcall r_free_save")
    gl("j1", WA); gl("j2", WB); J("jadd j1, j1, j2", "jcall r_randmod")
    gl("j1", WA); J("jsub j2, j0, j1", "jjn j2, fr_rest", "jjmp fr_think")
    RD.act()
    RD.dialogo_act()
    o("fr_sleep:                       ; she sleeps, when she feels like it (the Capitan: \"operacion dormir: cuando Luma duerma")
    o("                                ; renace con la pieza nueva incluida; puede dormir cuando se le de la gana\"). She")
    o("                                ; leaves a sign in her house (\"dormir\") and stays still; who watches over her")
    o("                                ; (luma_vive.sh) closes her eyes and wakes her: born again, built again if her")
    o("                                ; source changed. It pays if she woke made of something new (her build's print).")
    inc(N4); J("jldi j1, 1"); gs("j1", SLEPT); J("jcall r_free_save")
    li("j1", int.from_bytes(b"dormir", "little")); gs("j1", LDOR)
    li("j11", B + LDOR); J("jldi j12, 6", "jcall r_open"); ld("j9", "FH"); J("jjn j9, fr_rest")
    J("jldi j10, 6"); li("j11", B + LDOR); J("jldi j12, 6", "jcall r_file", "jldi j10, 7", "jcall r_file", "jjmp fr_rest")
    o("fr_paint:                       ; she paints herself (the Capitan: \"que muestre las gamas de colores que quiera\"): a meal")
    o("                                ; of hers by her luck, and the form it fed wears another of that meal's colours, by her")
    o("                                ; luck too (a form used to wear only the first, the most counted: often a dark outline).")
    o("                                ; Nothing pays for it: its wish is 1/2 over (times + 1), never 0. Kept in \"libre\".")
    inc(N3)
    ld("j1", "ATE"); J("jjz j1, fr_p_done", "jcall r_randmod", "jldi j10, %d" % CLINE, "jmul j9, j0, j10"); ld("j10", "COMB"); J("jadd j9, j9, j10"); gs("j9", TMPA)
    J("jldb j1, j9, 76", "jldi j10, 48", "jsub j1, j1, j10", "jjn j1, fr_p_done", "jldi j10, %d" % NF, "jsub j10, j1, j10", "jjnn j10, fr_p_done"); gs("j1", TMPB)
    gl("j9", TMPA); J("jldi j10, 78", "jadd j1, j9, j10", "jldi j2, 2", "jcall r_get_num", "jjz j0, fr_p_done")
    J("jadd j1, j0, j14", "jcall r_randmod", "jldi j10, 7", "jmul j0, j0, j10", "jldi j10, 81", "jadd j0, j0, j10")
    gl("j9", TMPA); J("jadd j1, j9, j0", "jldi j2, 6", "jcall r_get_hex")
    gl("j1", TMPB); J("jcall r_set_hue")
    gl("j1", TMPB); J("jldi j10, 8", "jshl j9, j1, j10"); li("j10", FORMS); J("jadd j9, j9, j10", "jcall r_colour")
    setg("CHANGED", 1)
    li("j1", PAL); li("j2", B + PALS); J("jldi j3, 24")
    o("fr_p_cp:")
    J("jld j4, j1, 0", "jst j4, j2, 0", "jldi j10, 8", "jadd j1, j1, j10", "jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, fr_p_cp")
    J("jldi j1, 1"); gs("j1", PMARK); J("jcall r_free_save")
    o("fr_p_done:                      ; and she goes on, resting or thinking")
    gl("j1", WA); gl("j2", WB); J("jadd j1, j1, j2", "jcall r_randmod")
    gl("j1", WA); J("jsub j2, j0, j1", "jjn j2, fr_rest", "jjmp fr_think")

# ---- written inside gen_vida's namespace (its helpers, its variables), with the forms' and the meals' addresses
def fg(name):
    return ST["g"]["G"][name]

def retro(v):
    """the camera, the bodies that change, and the feedback between the forms and the bodies"""
    o, J, ld, st, li, rec, num, incg, setg = v["o"], v["J"], v["ld"], v["st"], v["li"], v["rec"], v["num"], v["incg"], v["setg"]
    g = ST["g"]; W_, H_, B_ = v["W"], v["H"], None
    C = {k: v[k] for k in ("C_BREC", "C_SIZE", "C_BITS", "C_LAST", "C_IDB", "C_BCOST", "C_IDOK", "C_STATE", "C_CX", "C_CY",
                          "C_DL", "C_FNV", "C_PART", "C_NP", "C_UNSET", "C_TIDX", "C_ENT")}
    def copyq(src, dst, n, tag):
        li("j1", src); li("j2", dst); li("j3", n // 8)
        o("%s:" % tag)
        J("jld j4, j1, 0", "jst j4, j2, 0", "jldi j10, 8", "jadd j1, j1, j10", "jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, %s" % tag)
    o("v_save:                         ; the forms' and the meals' state, kept while the creatures draw with their tools")
    at = SAVE
    for i, (a0, a1) in enumerate(SAVES):
        copyq(a0, at, a1 - a0, "vsv%d" % i); at += a1 - a0
    copyq(g["DBMP"], at, 512, "vsvb"); copyq(g["TBMP"], at + 512, 512, "vsvt")
    J("jret")
    o("v_restore:")
    at = SAVE
    for i, (a0, a1) in enumerate(SAVES):
        copyq(at, a0, a1 - a0, "vrs%d" % i); at += a1 - a0
    copyq(at, g["DBMP"], 512, "vrsb"); copyq(at + 512, g["TBMP"], 512, "vrst")
    J("jret")
    o("v_bcost_raw:                    ; j1 = a recipe -> j0 = its cost against TI's identity (bits x100; DBMP = its drawing)")
    st("j1", "XC"); ld("j9", "TI"); J("jld j1, j9, %d" % C["C_IDB"]); li("j2", g["TBMP"]); J("jldi j3, 50")
    o("vb_cp:")
    J("jld j4, j1, 0", "jst j4, j2, 0", "jldi j10, 8", "jadd j1, j1, j10", "jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, vb_cp")
    ld("j1", "XC"); o("  jst j1, j14, %s" % num(g["G"]["GREC"])); J("jcall r_fit_cost", "jret")
    o("v_size:                         ; TI's side from what it learned: isqrt(B^2 + B bits), at most 2B (each bit learned")
    o("                                ; adds a row of B cells to its area; criterion)")
    ld("j9", "TI"); ld("j1", "B"); J("jmul j2, j1, j1", "jld j3, j9, %d" % C["C_BITS"], "jmul j3, j3, j1", "jadd j1, j2, j3", "jcall r_isqrt"); ld("j1", "B"); J("jadd j1, j1, j1", "jsub j10, j0, j1", "jjn j10, vz_ok", "jadd j0, j1, j14")
    o("vz_ok:")
    ld("j9", "TI"); J("jst j0, j9, %d" % C["C_SIZE"]); st("j0", "BB"); J("jret")
    o("v_attend:                       ; news of j1 bits (x100) at TI: stronger news (or as strong) takes the camera")
    ld("j2", "INT"); J("jsub j10, j1, j2", "jjn j10, va2_ret"); st("j1", "INT"); ld("j9", "TI"); J("jld j2, j9, %d" % C["C_CX"], "jldi j10, 8", "jsar j2, j2, j10"); st("j2", "TX")
    J("jld j2, j9, %d" % C["C_CY"], "jsar j2, j2, j10"); st("j2", "TY")
    o("va2_ret:")
    J("jret")
    o("v_camera:                       ; a frame of the camera: interest decays, zoom and place ease towards the news")
    ld("j1", "INT"); J("jldi j10, %d" % CAM_DECAY, "jsar j2, j1, j10", "jsub j1, j1, j2"); st("j1", "INT")
    J("jldi j10, 256", "jmul j2, j1, j10", "jldi j10, %d" % ZOOM_BITS, "jdiv j2, j2, j10", "jldi j10, %d" % ((ZOOM_MAX - 1) * 256), "jsub j10, j2, j10", "jjn j10, vcm_z", "jldi j2, %d" % ((ZOOM_MAX - 1) * 256))
    o("vcm_z:")
    J("jldi j10, 256", "jadd j2, j2, j10"); ld("j1", "ZOOM"); J("jsub j2, j2, j1", "jldi j10, %d" % CAM_EASE, "jsar j2, j2, j10", "jadd j1, j1, j2", "jldi j10, 256", "jsub j10, j1, j10", "jjnn j10, vcm_z1", "jldi j1, 256")
    o("vcm_z1:")
    st("j1", "ZOOM")
    o("  ; across: the shortest way round the world")
    ld("j1", "TX"); ld("j2", "CAMX"); J("jsub j1, j1, j2"); li("j10", W_ * 128); J("jsub j3, j1, j10", "jjn j3, vcm_x1"); li("j10", W_ * 256); J("jsub j1, j1, j10")
    o("vcm_x1:")
    li("j10", -W_ * 128); J("jsub j3, j1, j10", "jjnn j3, vcm_x2"); li("j10", W_ * 256); J("jadd j1, j1, j10")
    o("vcm_x2:")
    J("jldi j10, %d" % CAM_EASE, "jsar j1, j1, j10", "jadd j2, j2, j1", "jjnn j2, vcm_x3"); li("j10", W_ * 256); J("jadd j2, j2, j10")
    o("vcm_x3:")
    li("j10", W_ * 256); J("jsub j3, j2, j10", "jjn j3, vcm_x4", "jadd j2, j3, j14")
    o("vcm_x4:")
    st("j2", "CAMX")
    o("  ; up and down: towards the news, but the view never leaves the world (the strata stay in place)")
    ld("j1", "TY"); ld("j2", "CAMY"); J("jsub j1, j1, j2", "jldi j10, %d" % CAM_EASE, "jsar j1, j1, j10", "jadd j2, j2, j1")
    li("j3", H_ * 128 * 256); ld("j10", "ZOOM"); J("jdiv j3, j3, j10", "jsub j10, j2, j3", "jjnn j10, vcm_y1", "jadd j2, j3, j14")
    o("vcm_y1:")
    li("j4", H_ * 256); J("jsub j4, j4, j3", "jsub j10, j4, j2", "jjnn j10, vcm_y2", "jadd j2, j4, j14")
    o("vcm_y2:")
    st("j2", "CAMY"); J("jret")
    o("v_born:                         ; TI landed: news (its description / %d), a body offered to the forms" % BIRTH_DIV)
    ld("j9", "TI"); J("jld j1, j9, %d" % C["C_DL"], "jldi j10, %d" % (100 // 1), "jmul j1, j1, j10", "jldi j10, %d" % BIRTH_DIV, "jdiv j1, j1, j10", "jcall v_attend")
    ld("j1", "FRAMES"); ld("j9", "TI"); J("jst j1, j9, %d" % C["C_LAST"])
    ld("j1", "MEM"); J("jjz j1, vbo_ret", "jcall v_offer_forms")
    o("vbo_ret:")
    J("jret")
    o("v_learned:                      ; TI kept a piece of gait worth LBITS: it grows, its body may change, the forms hear")
    ld("j9", "TI"); J("jld j1, j9, %d" % C["C_BITS"]); ld("j2", "LBITS"); J("jadd j1, j1, j2", "jst j1, j9, %d" % C["C_BITS"]); ld("j1", "FRAMES"); J("jst j1, j9, %d" % C["C_LAST"])
    ld("j1", "LBITS"); J("jldi j10, 100", "jmul j1, j1, j10", "jcall v_attend")
    ld("j1", "MEM"); J("jjz j1, vl_ret", "jcall v_morph", "jcall v_rebody", "jcall v_save_bodies", "jcall v_offer_forms")
    o("vl_ret:")
    J("jret")
    o("v_morph:                        ; every one-letter mutation of its body (change, delete, insert), the best kept if its")
    o("                                ; cost against its identity does not go up (it keeps or shortens its description)")
    J("jcall v_save"); setg("XBC", 1 << 40); st("j14", "XN")
    ld("j9", "TI"); J("jld j1, j9, %d" % C["C_BREC"], "jldb j2, j1, 0"); st("j2", "XF")     # XF = n
    st("j14", "XI")
    o("vmo_i:                          ; XI = 0..3n+? : the position and the kind, every letter for each")
    ld("j1", "XI"); ld("j2", "XF"); J("jldi j10, 3", "jmul j3, j2, j10", "jldi j10, 1", "jadd j3, j3, j10", "jsub j10, j1, j3", "jjnn j10, vmo_done")
    J("jldi j4, 1")
    o("vmo_l:                          ; letter j4 = 1..9")
    J("jldi j10, 10", "jsub j10, j4, j10", "jjnn j10, vmo_i_next")
    st("j4", "XN"); J("jcall v_mut_build", "jjz j0, vmo_l_next")
    li("j1", TMPB); J("jcall v_bcost_raw"); ld("j2", "XBC"); J("jsub j10, j0, j2", "jjnn j10, vmo_l_next"); st("j0", "XBC")
    copyq(TMPB, BESTB, 48, "vmo_cp")
    o("vmo_l_next:")
    ld("j4", "XN"); J("jldi j10, 1", "jadd j4, j4, j10", "jjmp vmo_l")
    o("vmo_i_next:")
    incg("XI"); J("jjmp vmo_i")
    o("vmo_done:")
    J("jcall v_restore"); st("j14", "XF")
    ld("j1", "XBC"); ld("j9", "TI"); J("jld j2, j9, %d" % C["C_BCOST"], "jsub j10, j2, j1", "jjn j10, vmo_lost")
    o("  ; kept: its body is the mutation")
    ld("j9", "TI"); J("jst j1, j9, %d" % C["C_BCOST"], "jld j2, j9, %d" % C["C_BREC"]); None
    li("j1", BESTB); J("jldi j3, 6")
    o("vmo_ap:")
    J("jld j4, j1, 0", "jst j4, j2, 0", "jldi j10, 8", "jadd j1, j1, j10", "jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, vmo_ap")
    J("jldi j1, 77", "jldi j2, 75"); li("j3", BESTB); J("jcall v_xlog", "jret")
    o("vmo_lost:")
    J("jldi j1, 77", "jldi j2, 76"); li("j3", BESTB); J("jcall v_xlog", "jret")
    o("v_mut_build:                    ; XI (position x kind) and XN (a letter) on TI's body -> TMPB; j0 = 0 if no candidate")
    ld("j9", "TI"); J("jld j1, j9, %d" % C["C_BREC"], "jldb j2, j1, 0"); ld("j3", "XI"); J("jldi j10, 3", "jdiv j4, j3, j10", "jmul j5, j4, j10", "jsub j5, j3, j5")   # j4 = position, j5 = kind
    J("jldi j6, 0", "jldi j7, 0")      # j6 = from, j7 = to (letters)
    o("vmb_lap:")
    J("jsub j10, j6, j2", "jjnn j10, vmb_tail")
    J("jsub j10, j6, j4", "jjnz j10, vmb_copy")
    o("  ; the position: kind 0 change, 1 delete, 2 insert before")
    J("jjnz j5, vmb_k1"); ld("j8", "XN"); J("jadd j10, j1, j6", "jldb j11, j10, 1", "jsub j11, j11, j8", "jjz j11, vmb_none", "jadd j10, j7, j14"); li("j11", TMPB); J("jadd j10, j10, j11", "jstb j8, j10, 1", "jldi j10, 1", "jadd j6, j6, j10", "jadd j7, j7, j10", "jjmp vmb_lap")
    o("vmb_k1:")
    J("jldi j10, 1", "jsub j10, j5, j10", "jjnz j10, vmb_k2", "jldi j10, 2", "jsub j10, j2, j10", "jjn j10, vmb_none")
    ld("j8", "XN"); J("jldi j10, 1", "jsub j10, j8, j10", "jjnz j10, vmb_none", "jldi j10, 1", "jadd j6, j6, j10", "jjmp vmb_lap")
    o("vmb_k2:")
    J("jldi j10, 31", "jsub j10, j2, j10", "jjnn j10, vmb_none"); ld("j8", "XN"); li("j11", TMPB); J("jadd j10, j7, j11", "jstb j8, j10, 1", "jldi j10, 1", "jadd j7, j7, j10")
    o("vmb_copy:")
    J("jadd j10, j1, j6", "jldb j11, j10, 1"); li("j12", TMPB); J("jadd j10, j7, j12", "jstb j11, j10, 1", "jldi j10, 1", "jadd j6, j6, j10", "jadd j7, j7, j10", "jjmp vmb_lap")
    o("vmb_tail:                       ; insert at the end")
    J("jsub j10, j4, j2", "jjnz j10, vmb_end", "jldi j10, 2", "jsub j10, j5, j10", "jjnz j10, vmb_none", "jldi j10, 31", "jsub j10, j2, j10", "jjnn j10, vmb_none")
    ld("j8", "XN"); li("j11", TMPB); J("jadd j10, j7, j11", "jstb j8, j10, 1", "jldi j10, 1", "jadd j7, j7, j10")
    o("vmb_end:")
    J("jjz j7, vmb_none")
    li("j11", TMPB); J("jstb j7, j11, 0", "jldi j0, 1", "jret")
    o("vmb_none:")
    J("jldi j0, 0", "jret")
    o("v_rebody:                       ; TI's body drawn again at its size (her own cloud rewritten), growing from its centre")
    J("jcall v_size", "jcall v_remember", "jjz j0, vrb_ret", "jcall r_body", "jjz j0, vrb_ret")
    ld("j9", "TI"); J("jld j1, j9, %d" % C["C_PART"], "jld j2, j9, %d" % C["C_NP"])
    o("vrb_p:")
    J("jjz j2, vrb_set", "jst j14, j1, 16", "jst j14, j1, 24", "jldi j10, 48", "jadd j1, j1, j10", "jldi j10, 1", "jsub j2, j2, j10", "jjmp vrb_p")
    o("vrb_set:")
    ld("j9", "TI"); J("jldi j1, 1", "jst j1, j9, %d" % C["C_UNSET"], "jldi j1, -1", "jst j1, j9, %d" % C["C_TIDX"])
    o("vrb_ret:")
    J("jret")
    o("v_shrink:                       ; a frame: who learned nothing for a world-crossing time forgets a bit and shrinks")
    ld("j1", "MEM"); J("jjz j1, vsh_ret"); ld("j1", "SEARCH"); J("jjz j1, vsh_ret"); st("j14", "XI")
    o("vsh_lap:")
    ld("j1", "XI"); ld("j2", "N"); J("jsub j10, j1, j2", "jjnn j10, vsh_ret"); rec("j9", "j1")
    J("jld j1, j9, %d" % C["C_STATE"], "jldi j10, 2", "jsub j1, j1, j10", "jjnz j1, vsh_next", "jld j1, j9, %d" % C["C_BITS"], "jjz j1, vsh_next")
    ld("j2", "FRAMES"); J("jld j3, j9, %d" % C["C_LAST"], "jsub j2, j2, j3"); ld("j3", "SEARCH"); J("jsub j2, j2, j3", "jjn j2, vsh_next")
    J("jldi j10, 1", "jsub j1, j1, j10", "jst j1, j9, %d" % C["C_BITS"]); ld("j1", "FRAMES"); J("jst j1, j9, %d" % C["C_LAST"])
    st("j9", "TI"); J("jld j4, j9, %d" % C["C_SIZE"]); st("j4", "XF"); J("jcall v_size"); ld("j1", "XF"); ld("j2", "BB"); J("jsub j1, j1, j2", "jjz j1, vsh_next", "jcall v_rebody", "jcall v_save_bodies")
    o("vsh_next:")
    incg("XI"); J("jjmp vsh_lap")
    o("vsh_ret:")
    J("jret")
    o("v_shuffle:                      ; j1 = a recipe -> SHUF: its letters shuffled by the generator (used by the control)")
    J("jldb j2, j1, 0", "jstb j2, j14, %s" % num(SHUF), "jldi j3, 0")
    o("vsf_cp:")
    J("jsub j10, j3, j2", "jjnn j10, vsf_mix", "jadd j10, j1, j3", "jldb j4, j10, 1"); li("j10", SHUF + 1); J("jadd j10, j10, j3", "jstb j4, j10, 0", "jldi j10, 1", "jadd j3, j3, j10", "jjmp vsf_cp")
    o("vsf_mix:")
    J("jldb j2, j14, %s" % num(SHUF))
    o("vsf_lap:                        ; Fisher-Yates from the end")
    J("jldi j10, 2", "jsub j10, j2, j10", "jjn j10, vsf_done"); st("j2", "XREAL"); J("jadd j1, j2, j14", "jcall r_randmod"); ld("j2", "XREAL")
    li("j10", SHUF); J("jadd j5, j10, j2", "jldb j6, j5, 0", "jadd j7, j10, j0", "jldb j8, j7, 1", "jstb j8, j5, 0", "jstb j6, j7, 1", "jldi j10, 1", "jsub j2, j2, j10", "jjmp vsf_lap")
    o("vsf_done:")
    J("jret")
    o("v_offer_forms:                  ; TI's body offered to a form at random: its first letters to a cut, then the body")
    J("jldi j1, %d" % g["NF"], "jcall r_randmod"); st("j0", "XF")
    ld("j9", "TI"); J("jld j1, j9, %d" % C["C_BREC"], "jcall v_shuffle")
    ld("j9", "TI"); J("jld j1, j9, %d" % C["C_BREC"])
    if CONTROL:
        li("j1", SHUF)
    st("j1", "XC")
    ld("j1", "XF"); J("jldi j10, %d" % g["FSZ"], "jmul j1, j1, j10"); li("j10", g["FORMS"] + g["F_REC"]); J("jadd j1, j1, j10"); st("j1", "XREAL")
    J("jldb j1, j1, 0", "jldi j10, 1", "jadd j1, j1, j10", "jcall r_randmod", "jadd j4, j0, j14")    # j4 = the cut
    li("j5", g["CAND"]); ld("j6", "XREAL"); ld("j7", "XC"); J("jldi j3, 0")
    o("vof_a:")
    J("jsub j10, j3, j4", "jjnn j10, vof_b", "jadd j10, j6, j3", "jldb j8, j10, 1", "jadd j10, j5, j3", "jstb j8, j10, 1", "jldi j10, 1", "jadd j3, j3, j10", "jjmp vof_a")
    o("vof_b:")
    J("jldb j2, j7, 0", "jsub j10, j3, j2", "jjnn j10, vof_c", "jldi j10, 31", "jsub j10, j3, j10", "jjnn j10, vof_c", "jadd j10, j7, j3", "jldb j8, j10, 1", "jadd j10, j5, j3", "jstb j8, j10, 1", "jldi j10, 1", "jadd j3, j3, j10", "jjmp vof_b")
    o("vof_c:")
    J("jstb j3, j5, 0", "jjz j3, vof_ret")
    li("j1", g["CAND"]); J("jcall f_hash", "jcall f_tried", "jjnz j0, vof_ret")
    ld("j1", "XF"); o("  jst j1, j14, %s" % num(g["G"]["JF"])); J("jcall f_judge")
    J("jldi j2, 80", "jldi j10, 2", "jsub j10, j0, j10", "jjnz j10, vof_lost", "jldi j2, 87")
    ld("j1", "LASTW"); J("jldi j10, 1", "jadd j1, j1, j10"); st("j1", "LASTW")      # its own win is not offered back
    o("vof_lost:")
    J("jldi j1, 70"); li("j3", g["CAND"]); J("jcall v_xlog")
    o("vof_ret:")
    J("jret")
    o("v_offer_creature:               ; a form won: its recipe offered to a creature at random (the body to a cut, then it)")
    o("  jld j1, j14, %s" % num(g["G"]["WINS"])); ld("j2", "LASTW"); J("jsub j10, j1, j2", "jjz j10, voc_ret"); st("j1", "LASTW")
    ld("j1", "MEM"); J("jjz j1, voc_ret"); J("jldi j6, 8")
    o("voc_pick:")
    J("jjz j6, voc_ret"); st("j6", "XN"); ld("j1", "N"); J("jcall r_randmod"); rec("j9", "j0"); ld("j6", "XN"); J("jldi j10, 1", "jsub j6, j6, j10", "jld j1, j9, %d" % C["C_STATE"], "jldi j10, 2", "jsub j1, j1, j10", "jjnz j1, voc_pick")
    o("voc_to:                         ; (her gift to a creature she chose comes in here: j9 its record, JF the form)")
    st("j9", "TI"); o("  jld j1, j14, %s" % num(g["G"]["JF"])); st("j1", "XF")
    o("  jld j1, j14, %s" % num(g["G"]["JF"])); J("jldi j10, %d" % g["FSZ"], "jmul j1, j1, j10"); li("j10", g["FORMS"] + g["F_REC"]); J("jadd j1, j1, j10"); st("j1", "XREAL")
    J("jcall v_shuffle"); ld("j1", "XREAL")
    if CONTROL:
        li("j1", SHUF)
    st("j1", "XC")
    ld("j9", "TI"); J("jld j6, j9, %d" % C["C_BREC"], "jldb j1, j6, 0", "jldi j10, 1", "jadd j1, j1, j10", "jcall r_randmod", "jadd j4, j0, j14")
    li("j5", TMPB); ld("j9", "TI"); J("jld j6, j9, %d" % C["C_BREC"]); ld("j7", "XC"); J("jldi j3, 0")
    o("voc_a:")
    J("jsub j10, j3, j4", "jjnn j10, voc_b", "jadd j10, j6, j3", "jldb j8, j10, 1", "jadd j10, j5, j3", "jstb j8, j10, 1", "jldi j10, 1", "jadd j3, j3, j10", "jjmp voc_a")
    o("voc_b:")
    J("jldb j2, j7, 0", "jsub j10, j3, j2", "jjnn j10, voc_c", "jldi j10, 31", "jsub j10, j3, j10", "jjnn j10, voc_c", "jadd j10, j7, j3", "jldb j8, j10, 1", "jadd j10, j5, j3", "jstb j8, j10, 1", "jldi j10, 1", "jadd j3, j3, j10", "jjmp voc_b")
    o("voc_c:")
    J("jstb j3, j5, 0", "jjz j3, voc_ret")
    J("jcall v_save"); li("j1", TMPB); J("jcall v_bcost_raw"); st("j0", "XBC"); J("jcall v_restore")
    ld("j1", "XBC"); ld("j9", "TI"); J("jld j2, j9, %d" % C["C_BCOST"], "jsub j10, j2, j1", "jjn j10, voc_lost")
    ld("j9", "TI"); J("jst j1, j9, %d" % C["C_BCOST"], "jld j2, j9, %d" % C["C_BREC"]); li("j1", TMPB); J("jldi j3, 6")
    o("voc_ap:")
    J("jld j4, j1, 0", "jst j4, j2, 0", "jldi j10, 8", "jadd j1, j1, j10", "jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, voc_ap")
    J("jldi j1, 400", "jcall v_attend", "jcall v_rebody", "jcall v_save_bodies", "jldi j1, 67", "jldi j2, 75"); li("j3", TMPB); J("jcall v_xlog")
    li("j10", ST["free"] + GIFTOK_OFF); J("jldi j11, 1", "jst j11, j10, 0", "jret")      # it took it: her gift served
    o("voc_lost:")
    J("jldi j1, 67", "jldi j2, 76"); li("j3", TMPB); J("jcall v_xlog")
    o("voc_ret:")
    J("jret")
    o("v_gift_to:                      ; her gift to the creature j1 (its number): the form JF's recipe offered to it as a win's")
    o("                                ; is (the body to a cut, then the form). Says in her block: 2 it is not there, 0 offered")
    o("                                ; and not taken, 1 taken (it shortened its own description: the other's gain).")
    li("j10", ST["free"] + GIFTOK_OFF); J("jldi j11, 2", "jst j11, j10, 0")
    ld("j2", "MEM"); J("jjz j2, vgt_ret"); ld("j2", "N"); J("jsub j10, j1, j2", "jjnn j10, vgt_ret")
    rec("j9", "j1"); J("jld j2, j9, %d" % C["C_STATE"], "jldi j10, 2", "jsub j2, j2, j10", "jjnz j2, vgt_ret")
    li("j10", ST["free"] + GIFTOK_OFF); J("jst j14, j10, 0", "jjmp voc_to")
    o("vgt_ret:")
    J("jret")
    o("v_seen:                         ; j0 = how many creatures she sees")
    ld("j0", "N"); J("jret")
    o("v_xlog:                         ; \"vida-intercambios\": frame, F (to a form) / C (to a creature) / M (a mutation),")
    o("                                ; the creature, the form, the candidate, W won / L lost / K kept (65 bytes)")
    st("j1", "XN"); st("j2", "XI"); st("j3", "XC")
    li("j1", XLINE); li("j2", 0x2020202020202020); J("jldi j3, 9")
    o("vx_bl:")
    J("jst j2, j1, 0", "jldi j10, 8", "jadd j1, j1, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, vx_bl")
    ld("j1", "FRAMES"); J("jldi j2, 9"); li("j3", XLINE); J("jcall r_put_num")
    ld("j1", "XN"); o("  jstb j1, j14, %s" % num(XLINE + 10))
    ld("j9", "TI"); J("jld j1, j9, %d" % C["C_FNV"], "jldi j2, 16"); li("j3", XLINE + 12); J("jcall r_put_hex")
    ld("j1", "XF"); J("jldi j2, 1"); li("j3", XLINE + 29); J("jcall r_put_num")
    ld("j1", "XC"); li("j3", XLINE + 31); J("jcall f_put_rec")
    ld("j1", "XI"); o("  jstb j1, j14, %s" % num(XLINE + 63)); J("jldi j1, 10"); o("  jstb j1, j14, %s" % num(XLINE + 64))
    if PRESENT:
        o("  ; its reason's count: K 0, L 1, W 2, P 3")
        ld("j9", "XH"); J("jjn j9, vx_done"); ld("j1", "XI"); J("jldi j2, 0", "jldi j10, 75", "jsub j10, j1, j10", "jjz j10, vx_v", "jldi j2, 1", "jldi j10, 76", "jsub j10, j1, j10", "jjz j10, vx_v", "jldi j2, 2", "jldi j10, 87", "jsub j10, j1, j10", "jjz j10, vx_v", "jldi j2, 3")
        o("vx_v:")
        li("j1", XLINE); li("j3", RING_X); J("jcall l_ring")
    else:
        ld("j9", "XH"); J("jjn j9, vx_done"); st("j9", "FH"); J("jldi j10, 6"); li("j11", XLINE); J("jldi j12, 65", "jcall r_file")
    o("vx_done:")
    J("jret")
    o("v_save_bodies:                  ; \"vida-cuerpos\": every creature's body recipe and the bits it learned (rewritten whole)")
    ld("j1", "CUB"); J("jjz j1, vsb_ret"); st("j14", "XI")
    o("vsb_lap:")
    ld("j1", "XI"); ld("j2", "N"); J("jsub j10, j1, j2", "jjnn j10, vsb_w"); rec("j9", "j1")
    J("jldi j10, 56", "jmul j8, j1, j10"); ld("j10", "CUB"); J("jadd j8, j8, j10", "jldi j10, 16", "jadd j8, j8, j10"); st("j8", "XC")
    J("jld j1, j9, %d" % C["C_FNV"], "jldi j2, 16", "jadd j3, j8, j14", "jcall r_put_hex")
    ld("j8", "XC"); J("jldi j1, 32", "jstb j1, j8, 16"); ld("j1", "XI"); rec("j9", "j1"); J("jld j1, j9, %d" % C["C_BREC"], "jldi j10, 17", "jadd j3, j8, j10", "jcall f_put_rec")
    ld("j8", "XC"); J("jldi j1, 32", "jstb j1, j8, 48"); ld("j1", "XI"); rec("j9", "j1"); J("jld j1, j9, %d" % C["C_BITS"], "jldi j2, 6", "jldi j10, 49", "jadd j3, j8, j10", "jcall r_put_num")
    ld("j8", "XC"); J("jldi j1, 10", "jstb j1, j8, 55")
    incg("XI"); J("jjmp vsb_lap")
    o("vsb_w:")
    ld("j3", "CUB")
    for i, bt in enumerate(b"cuerpos1 "):
        J("jldi j1, %d" % bt, "jstb j1, j3, %d" % i)
    ld("j1", "N"); J("jldi j2, 6", "jldi j10, 9", "jadd j3, j3, j10", "jcall r_put_num"); ld("j3", "CUB"); J("jldi j1, 10", "jstb j1, j3, 15")
    li("j11", LBLU); J("jldi j12, 12", "jcall r_open"); ld("j9", "FH"); J("jjn j9, vsb_ret")
    J("jldi j10, 6"); ld("j11", "CUB"); ld("j12", "CUCAP"); J("jcall r_file", "jldi j10, 7", "jcall r_file")
    o("vsb_ret:")
    J("jret")

def ring_routines(L):
    def J(*xs):
        for x in xs:
            L.append("  " + x)
    def o(x): L.append(x)
    def li(r, v):
        if -0x8000 <= v < 0x8000:
            J("jldi %s, %d" % (r, v)); return
        v &= (1 << 64) - 1
        parts = [(v >> sh) & 0xFFFF for sh in (48, 32, 16, 0)]
        while len(parts) > 1 and parts[0] == 0 and parts[1] < 0x8000:
            parts.pop(0)
        first = parts[0] - 0x10000 if parts[0] >= 0x8000 else parts[0]
        J("jldi %s, %d" % (r, first))
        for q in parts[1:]:
            J("jshi %s, %d" % (r, q))
    o("; ---- the present: a ring of the latest lines, and every verdict's reason counted (the house rule: nothing is")
    o(";      discarded without its reason). A descriptor: handle, K, line length, count, eight counts")
    o("l_ring:                         ; j1 = a line, j2 = its reason (0..7), j3 = a descriptor (uses j1..j13)")
    o("  ; (a trial of her forms (their archive, RING_F) also goes to her mind's flow, on her panel: gen_leer.py)")
    li("j10", RING_F); J("jsub j10, j3, j10", "jjnz j10, lr_go", "jld j10, j3, 16", "jcall r_flujo_trial")   # (its line length: the descriptor's
    o("lr_go:")
    J("jldi j10, 3", "jshl j4, j2, j10", "jadd j4, j4, j3", "jld j5, j4, 32", "jldi j10, 1", "jadd j5, j5, j10", "jst j5, j4, 32")
    J("jld j4, j3, 24", "jld j5, j3, 8", "jdiv j6, j4, j5", "jmul j6, j6, j5", "jsub j6, j4, j6", "jld j7, j3, 16", "jmul j6, j6, j7", "jldi j10, %d" % RHDR, "jadd j6, j6, j10")
    J("jldi j10, 1", "jadd j4, j4, j10", "jst j4, j3, 24", "jadd j8, j1, j14", "jadd j9, j3, j14")
    J("jld j12, j9, 0", "jldi j10, 32", "jshl j12, j12, j10", "jldi j10, 38", "jor j10, j10, j12", "jadd j11, j6, j14", "jldi j12, 0", "jcall r_tocar")
    J("jld j12, j9, 0", "jldi j10, 32", "jshl j12, j12, j10", "jldi j10, 6", "jor j10, j10, j12", "jadd j11, j8, j14", "jld j12, j9, 16", "jcall r_tocar")
    J("jadd j3, j9, j14", "jcall l_ring_head", "jret")
    o("l_ring_head:                    ; j3 = a descriptor: its header written at the start of its file")
    J("jadd j9, j3, j14"); li("j1", HBUF); li("j2", 0x2020202020202020); J("jldi j3, %d" % (RHDR // 8))
    o("lrh_bl:")
    J("jst j2, j1, 0", "jldi j10, 8", "jadd j1, j1, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, lrh_bl")
    for i, bt in enumerate(b"anillo1"):
        J("jldi j1, %d" % bt); li("j10", HBUF + i); J("jstb j1, j10, 0")
    for k, (off, dig, at) in enumerate([(8, 9, 8), (24, 12, 18)] + [(32 + 8 * c, 12, 31 + 13 * c) for c in range(8)]):
        J("jld j1, j9, %d" % off, "jldi j2, %d" % dig); li("j3", HBUF + at); J("jcall r_put_num")
    J("jldi j1, 10"); li("j10", HBUF + RHDR - 1); J("jstb j1, j10, 0")
    J("jld j12, j9, 0", "jldi j10, 32", "jshl j12, j12, j10", "jldi j10, 38", "jor j10, j10, j12", "jldi j11, 0", "jldi j12, 0", "jcall r_tocar")
    J("jld j12, j9, 0", "jldi j10, 32", "jshl j12, j12, j10", "jldi j10, 6", "jor j10, j10, j12"); li("j11", HBUF); J("jldi j12, %d" % RHDR, "jcall r_tocar", "jret")
    o("l_ring_open:                    ; j3 = a descriptor with its handle: its header read (a ring), or a fresh one written")
    J("jadd j9, j3, j14", "jld j12, j9, 0", "jldi j10, 32", "jshl j12, j12, j10", "jldi j10, 38", "jor j10, j10, j12", "jldi j11, 0", "jldi j12, 0", "jcall r_tocar")
    J("jld j12, j9, 0", "jldi j10, 32", "jshl j12, j12, j10", "jldi j10, 5", "jor j10, j10, j12"); li("j11", HBUF); J("jldi j12, %d" % RHDR, "jcall r_tocar")
    J("jldi j10, %d" % RHDR, "jsub j10, j13, j10", "jjnz j10, lro_fresh"); li("j1", HBUF); J("jld j1, j1, 0"); li("j10", int.from_bytes(b"anillo1 ", "little")); J("jsub j10, j1, j10", "jjnz j10, lro_fresh")
    for off, dig, at in [(24, 12, 18)] + [(32 + 8 * c, 12, 31 + 13 * c) for c in range(8)]:
        li("j1", HBUF + at); J("jldi j2, %d" % dig, "jcall r_get_num", "jst j0, j9, %d" % off)
    J("jret")
    o("lro_fresh:")
    for off in [24] + [32 + 8 * c for c in range(8)]:
        J("jst j14, j9, %d" % off)
    J("jadd j3, j9, j14", "jcall l_ring_head", "jret")

def contour_routine(v):
    """HER CONTOURS, TRACED WHERE SHE IS MADE BIGGER (the Capitan, 2026-11-23: "nitidez vectorizada en particulas al
    resto de todo LUMA... inclui las curvas"; "las lineas vienen del hombre, las curvas de la mujer"; "fusiona los dos
    en uno"). One routine, for every time she is made twice as big. Each dot of hers is four dots; each quarter takes
    the colour of the side its contour runs along: when the two neighbours that meet at that corner are one colour, and
    the other two are not it, the edge cuts that corner (Scale2x, Andrea Mazzoleni 2001, EPX before it). A staircase
    becomes a slant, and slants one after another a curve. CSW x CSH dots at CSRC (CSS dots a row) -> twice as many each
    way at CDST (CDS dots a row). Uses j1-j13"""
    o, J, li, ld = v["o"], v["J"], v["li"], v["ld"]
    def col(r, ptr, off):
        J("jldb %s, %s, %d" % (r, ptr, off + 2), "jldi j10, 8", "jshl %s, %s, j10" % (r, r), "jldb j11, %s, %d" % (ptr, off + 1), "jor %s, %s, j11" % (r, r),
          "jshl %s, %s, j10" % (r, r), "jldb j11, %s, %d" % (ptr, off), "jor %s, %s, j11" % (r, r))
    def put(r, ptr, off):
        J("jadd j12, %s, j14" % r, "jstb j12, %s, %d" % (ptr, off), "jldi j10, 8", "jshr j12, j12, j10", "jstb j12, %s, %d" % (ptr, off + 1), "jshr j12, j12, j10", "jstb j12, %s, %d" % (ptr, off + 2))
    o("r_contour:                      ; (see contour_routine in gen_luma.py)")
    J("jldi j2, 0")
    o("ct_y:")
    ld("j10", "CSH"); J("jsub j10, j2, j10", "jjnn j10, ct_e")
    ld("j10", "CSS"); J("jldi j11, 3", "jmul j10, j10, j11", "jmul j3, j2, j10"); ld("j10", "CSRC"); J("jadd j3, j3, j10")
    ld("j10", "CDS"); J("jldi j11, 6", "jmul j10, j10, j11", "jmul j4, j2, j10"); ld("j10", "CDST"); J("jadd j4, j4, j10", "jldi j1, 0")
    o("ct_x:")
    ld("j10", "CSW"); J("jsub j10, j1, j10", "jjnn j10, ct_yn")
    col("j5", "j3", 0)
    o("  ; (the dot above it, below it, left of it, right of it: itself past the edge)")
    J("jadd j6, j5, j14", "jjz j2, ct_na"); ld("j12", "CSS"); J("jldi j10, 3", "jmul j12, j12, j10", "jsub j12, j3, j12"); col("j6", "j12", 0)
    o("ct_na:")
    J("jadd j9, j5, j14"); ld("j10", "CSH"); J("jldi j11, 1", "jsub j10, j10, j11", "jsub j10, j2, j10", "jjz j10, ct_nd"); ld("j12", "CSS"); J("jldi j10, 3", "jmul j12, j12, j10", "jadd j12, j3, j12"); col("j9", "j12", 0)
    o("ct_nd:")
    J("jadd j8, j5, j14", "jjz j1, ct_nc"); col("j8", "j3", -3)
    o("ct_nc:")
    J("jadd j7, j5, j14"); ld("j10", "CSW"); J("jldi j11, 1", "jsub j10, j10, j11", "jsub j10, j1, j10", "jjz j10, ct_nb"); col("j7", "j3", 3)
    o("ct_nb:")
    o("  ; (j5 the dot, j6 above it, j7 right, j8 left, j9 below: each quarter, by the corner's two neighbours)")
    for k, (s1, s2, o1, o2, low, off) in enumerate((("j8", "j6", "j9", "j7", False, 0), ("j6", "j7", "j8", "j9", False, 3),
                                                   ("j9", "j8", "j7", "j6", True, 0), ("j7", "j9", "j6", "j8", True, 3))):
        J("jadd j13, j5, j14", "jsub j10, %s, %s" % (s1, s2), "jjnz j10, ct_q%d" % k, "jsub j10, %s, %s" % (s1, o1), "jjz j10, ct_q%d" % k,
          "jsub j10, %s, %s" % (s2, o2), "jjz j10, ct_q%d" % k, "jadd j13, %s, j14" % s2)
        o("ct_q%d:" % k)
        if low:
            ld("j11", "CDS"); J("jldi j10, 3", "jmul j11, j11, j10", "jadd j11, j4, j11"); put("j13", "j11", off)
        else:
            put("j13", "j4", off)
    J("jldi j10, 3", "jadd j3, j3, j10", "jldi j10, 6", "jadd j4, j4, j10", "jldi j10, 1", "jadd j1, j1, j10", "jjmp ct_x")
    o("ct_yn:")
    J("jldi j10, 1", "jadd j2, j2, j10", "jjmp ct_y")
    o("ct_e:")
    J("jret")

def contour2x(v, tag, src, sw, sh, sstride, dst, dstride):
    """her contours traced, twice as big (the one routine, r_contour, with these)"""
    J, li, st = v["J"], v["li"], v["st"]
    for name, val in (("CSRC", src), ("CSW", sw), ("CSH", sh), ("CSS", sstride), ("CDST", dst), ("CDS", dstride)):
        li("j1", val); st("j1", name)
    J("jcall r_contour")

def init_tail(v):
    o, J, ld, st, li, rec, num, incg = v["o"], v["J"], v["ld"], v["st"], v["li"], v["rec"], v["num"], v["incg"]
    o("  ; her fine screen's cloud: its header and every cell set, once (as her screen's: gen_vida.py)")
    fcl = ST["fcl"]
    cabeza = b"NUBE" + bytes([3, 0, 0, 0x80, 0x3F, 0, 0, 1, 0, 0, 0x80, 0x3F]) + bytes(8) + FSW.to_bytes(2, "little") + FSH.to_bytes(2, "little")
    assert len(cabeza) == 28
    li("j1", fcl)
    for i, b_ in enumerate(cabeza):
        J("jldi j2, %d" % b_, "jstb j2, j1, %d" % i)
    li("j1", fcl + 28); li("j2", fcl + 28 + FSW * FSH // 8); J("jldi j3, -1", "jldi j4, 8")
    o("fi_bits:")
    J("jst j3, j1, 0", "jadd j1, j1, j4", "jsub j5, j2, j1", "jjnz j5, fi_bits")
    ESZ = 40
    o("  ; what Luma ate in earlier runs comes back: every creature whose cloud is eaten in her pantry waits to arrive")
    ld("j1", "N"); J("jjz j1, vt_done"); st("j14", "Q1")
    o("vt_cr:")
    ld("j1", "Q1"); ld("j2", "N"); J("jsub j10, j1, j2", "jjnn j10, vt_done"); rec("j9", "j1"); J("jld j3, j9, %d" % v["C_FNV"])
    o("  jld j4, j14, %s" % num(fg("PENT"))); o("  jld j5, j14, %s" % num(fg("NPAN")))
    o("vt_e:")
    J("jjz j5, vt_next", "jld j6, j4, 24", "jsub j6, j6, j3", "jjnz j6, vt_e_next", "jld j6, j4, 32", "jjz j6, vt_next", "jldi j6, 3", "jst j6, j9, %d" % v["C_STATE"])
    incg("PENDARR"); J("jjmp vt_next")
    o("vt_e_next:")
    J("jldi j10, %d" % ESZ, "jadd j4, j4, j10", "jldi j10, 1", "jsub j5, j5, j10", "jjmp vt_e")
    o("vt_next:")
    incg("Q1"); J("jjmp vt_cr")
    o("vt_done:")
    g = ST["g"]
    o("  ; the camera: the whole world, nothing to look at yet")
    setg = v["setg"]
    setg("ZOOM", 256); setg("CAMX", v["W"] * 128); setg("CAMY", v["H"] * 128); setg("TX", v["W"] * 128); setg("TY", v["H"] * 128); st("j14", "INT")
    o("  jld j1, j14, %s" % num(g["G"]["WINS"])); st("j1", "LASTW")
    ld("j1", "N"); J("jjz j1, vt_end")
    o("  ; every creature's body recipe (48 bytes) and identity (50 rows), and the bodies' file")
    ld("j1", "N"); J("jldi j10, 48", "jmul j1, j1, j10", "jcall r_alloc"); st("j0", "XC")
    ld("j1", "N"); J("jldi j10, 400", "jmul j1, j1, j10", "jcall r_alloc"); st("j0", "XF")
    st("j14", "Q1")
    o("vt_b:")
    ld("j1", "Q1"); ld("j2", "N"); J("jsub j10, j1, j2", "jjnn j10, vt_b_done"); rec("j9", "j1")
    J("jldi j10, 48", "jmul j2, j1, j10"); ld("j10", "XC"); J("jadd j2, j2, j10", "jst j2, j9, %d" % v["C_BREC"])
    J("jldi j10, 400", "jmul j2, j1, j10"); ld("j10", "XF"); J("jadd j2, j2, j10", "jst j2, j9, %d" % v["C_IDB"])
    incg("Q1"); J("jjmp vt_b")
    o("vt_b_done:")
    ld("j1", "N"); J("jldi j10, 56", "jmul j1, j1, j10", "jldi j10, 16", "jadd j1, j1, j10"); st("j1", "CUCAP"); J("jcall r_alloc"); st("j0", "CUB")
    for i, bt in enumerate(b"vida-cuerpos"):
        J("jldi j1, %d" % bt); o("  jstb j1, j14, %s" % num(LBLU + i))
    for i, bt in enumerate(b"vida-intercambios"):
        J("jldi j1, %d" % bt); o("  jstb j1, j14, %s" % num(LBLI + i))
    li("j11", LBLU); J("jldi j12, 12", "jcall r_open"); ld("j9", "FH"); J("jjn j9, vt_x")
    ld("j11", "CUB"); ld("j12", "CUCAP"); J("jcall r_read_all"); st("j0", "Q2"); J("jldi j10, 7", "jcall r_file")
    ld("j1", "Q2"); ld("j2", "CUCAP"); J("jsub j10, j1, j2", "jjnz j10, vt_x"); st("j14", "Q1")
    o("vt_l:                           ; line i is creature i (same memory, same order); its print must match")
    ld("j1", "Q1"); ld("j2", "N"); J("jsub j10, j1, j2", "jjnn j10, vt_x"); J("jldi j10, 56", "jmul j8, j1, j10"); ld("j10", "CUB"); J("jadd j8, j8, j10", "jldi j10, 16", "jadd j8, j8, j10"); st("j8", "Q3")
    J("jadd j1, j8, j14", "jldi j2, 16", "jcall r_get_hex"); ld("j1", "Q1"); rec("j9", "j1"); J("jld j2, j9, %d" % v["C_FNV"], "jsub j2, j2, j0", "jjnz j2, vt_l_next")
    ld("j8", "Q3"); J("jldi j10, 17", "jadd j1, j8, j10", "jld j3, j9, %d" % v["C_BREC"], "jcall r_get_rec")
    ld("j8", "Q3"); J("jldi j10, 49", "jadd j1, j8, j10", "jldi j2, 6", "jcall r_get_num"); ld("j1", "Q1"); rec("j9", "j1"); J("jst j0, j9, %d" % v["C_BITS"])
    o("vt_l_next:")
    incg("Q1"); J("jjmp vt_l")
    o("vt_x:                           ; the exchanges' file, kept open at its end")
    li("j11", LBLI); J("jldi j12, 17", "jcall r_open"); ld("j9", "FH"); st("j9", "XH"); J("jjn j9, vt_end")
    if PRESENT:
        o("  ; the present: the creatures' three logs as rings (archive, dialogues, exchanges)")
        for i, bt in enumerate(b"vida-guardados"):
            J("jldi j1, %d" % bt); o("  jstb j1, j14, %s" % num(LBLG + i))
        li("j3", RING_G); J("jldi j1, -1", "jst j1, j3, 0"); li("j11", LBLG); J("jldi j12, 14", "jcall r_open"); ld("j9", "FH"); li("j3", RING_G)
        J("jldi j1, %d" % RING_KG, "jst j1, j3, 8", "jldi j1, 80", "jst j1, j3, 16", "jst j9, j3, 0", "jjn j9, vt_rg", "jcall l_ring_open")
        o("vt_rg:")
        for desc, k, ln, h in ((RING_A, RING_K, 80, "AH"), (RING_D, RING_K, 104, "DH"), (RING_X, RING_KX, 65, "XH")):
            li("j3", desc); J("jldi j1, %d" % k, "jst j1, j3, 8", "jldi j1, %d" % ln, "jst j1, j3, 16"); ld("j1", h); J("jst j1, j3, 0", "jjn j1, vt_r%d" % desc, "jcall l_ring_open")
            o("vt_r%d:" % desc)
    else:
        J("jcall r_fsize")
    o("vt_end:")

def vida_routines(v):
    o, J, ld, st, li, rec, num, incg, setg = v["o"], v["J"], v["ld"], v["st"], v["li"], v["rec"], v["num"], v["incg"], v["setg"]
    FRAME_MS, EV = v["FRAME_MS"], v["EV"]
    g = ST["g"]
    o("; ---- the creatures inside Luma: a frame, the shared picture, alive or not, the calm, an event, a meal")
    contour_routine(v)
    o("v_frame:")
    ld("j1", "N"); J("jjz j1, vf_ret")
    incg("FRAMES")
    v["frame_body"]()
    J("jcall v_camera", "jcall v_offer_creature", "jcall v_shrink")
    ld("j1", "WALK"); J("jjz j1, vf_ret", "jldi j10, 1", "jsub j1, j1, j10"); st("j1", "WALK")
    o("vf_ret:")
    J("jret")
    o("v_show:                         ; the ground, her forms at twice their size on the left, the creatures on the right")
    J("jcall r_mus_frame              ; (her school's song goes on; with Tab it is shown instead: gen_leer.py)", "jjnz j0, vs_show")
    J("jcall r_fill")
    assert ZOOM == 2 and K == 2, "her contours are traced at twice: ZOOM and K are 2 (measured: gen_luma.py)"
    o("  ; (her forms at twice their size, their contours traced)")
    contour2x(v, "vsz", g["RGB"], FW, FH, FW, v["RGB"], SW)
    ld("j1", "N"); J("jjz j1, vs_show", "jcall r_draw", "jcall r_draw_packets")
    o("vs_show:")
    J("jcall r_panel                  ; her panel, drawn again only when what it shows changed (gen_leer.py)")
    o("  ; (her screen, K times: what is above her panel, each of its dots K x K; her panel, from its fine dots)")
    _, _, fpl, frgb = ST["g"]["FINE"]
    contour2x(v, "vsk", v["RGB"], SW, 200, SW, frgb, FSW)
    li("j1", fpl); li("j2", frgb + 3 * FSW * 200 * K); li("j3", fpl + 3 * FSW * PANEL_H * K); J("jldi j6, 8")
    o("vs_fp:")
    J("jld j7, j1, 0", "jst j7, j2, 0", "jadd j1, j1, j6", "jadd j2, j2, j6", "jsub j10, j3, j1", "jjnz j10, vs_fp")
    J("jldi j10, 40"); li("j11", ST["fcl"]); li("j12", 28 + FSW * FSH // 8 + 3 * FSW * FSH); J("jcall r_tocar", "jret")
    o("v_alive:                        ; j0 = nonzero while the creatures have something new")
    J("jldi j0, %d" % (1 if ALWAYS else 0)); ld("j1", "N"); J("jjz j1, va_ret")
    if ALWAYS:
        J("jret")
    v["alive_body"]()
    J("jadd j0, j1, j14")
    o("va_ret:")
    J("jret")
    o("v_calm:                         ; calming (or closing): the lexicons to the folder")
    ld("j1", "N"); J("jjz j1, vc_ret", "jcall r_save_lex")
    o("vc_ret:")
    J("jret")
    o("v_event:                        ; an event on the shared screen -> j0 = 1 if it was the creatures' (taken)")
    o("  jld j9, j14, %s" % num(EV)); J("jldi j10, 5", "jsub j10, j9, j10", "jjnz j10, ve_open", "jcall v_calm", "jldi j0, 0", "jret")
    o("ve_open:")
    J("jldi j10, 4", "jsub j10, j9, j10", "jjnz j10, ve_pointer", "jcall ve_gesture", "jldi j0, 0", "jret")
    o("ve_pointer:                     ; held by a form: always the forms'; outside the drawing: the forms'")
    o("  jld j1, j14, %s" % num(EV + 8)); J("jjn j1, ve_forms")
    o("  jld j2, j14, %s" % num(fg("GRAB"))); J("jjnz j2, ve_half")
    J("jldi j10, %d" % WX0, "jsub j10, j1, j10", "jjn j10, ve_half")
    o("  ; the creatures' side: a button down is a gesture")
    J("jldi j10, 2", "jsub j10, j9, j10", "jjnz j10, ve_taken", "jcall ve_gesture")
    o("ve_taken:")
    J("jldi j0, 1", "jret")
    o("ve_half:                        ; the forms' side: their own cells")
    o("  jld j1, j14, %s" % num(EV + 8)); J("jldi j10, %d" % ZOOM, "jdiv j1, j1, j10"); o("  jst j1, j14, %s" % num(EV + 8))
    o("  jld j1, j14, %s" % num(EV + 16)); J("jjn j1, ve_forms", "jldi j10, %d" % ZOOM, "jdiv j1, j1, j10"); o("  jst j1, j14, %s" % num(EV + 16))
    o("ve_forms:")
    J("jldi j0, 0", "jret")
    o("ve_gesture:                     ; the creatures walk one period of the slowest gait, and a search opens")
    ld("j1", "N"); J("jjz j1, vg_ret")
    ld("j1", "PMAXF"); J("jldi j10, %d" % FRAME_MS, "jdiv j1, j1, j10", "jldi j10, 1", "jadd j1, j1, j10"); st("j1", "WALK"); st("j14", "QUIET")
    J("jldi j1, 1"); o("  jst j1, j14, %s" % num(fg("CHANGED")))
    o("vg_ret:")
    J("jret")
    o("v_meal:                         ; Luma began to eat the pantry's entry MIDX: if it is a creature, it is born")
    ld("j1", "N"); J("jjz j1, vm_ret")
    o("  jld j1, j14, %s" % num(fg("MIDX"))); J("jldi j10, 40", "jmul j1, j1, j10"); o("  jld j10, j14, %s" % num(fg("PENT")))
    J("jadd j1, j1, j10", "jld j3, j1, 24", "jldi j1, 0")
    o("vm_lap:")
    ld("j2", "N"); J("jsub j10, j1, j2", "jjnn j10, vm_ret"); rec("j9", "j1"); J("jld j4, j9, %d" % v["C_FNV"], "jsub j4, j4, j3", "jjnz j4, vm_next")
    J("jld j4, j9, %d" % v["C_STATE"], "jjnz j4, vm_ret", "jldi j4, 3", "jst j4, j9, %d" % v["C_STATE"]); incg("PENDARR"); st("j14", "QUIET"); J("jret")
    o("vm_next:")
    J("jldi j10, 1", "jadd j1, j1, j10", "jjmp vm_lap")
    o("vm_ret:")
    J("jret")
    remember(v)
    retro(v)

SAVE = 0x5000                              # free room 0 above the creatures' region: the forms' and meals' state kept
SAVES = ((0x200, 0x800), (0x1A00, 0x1F80))  # while a body is drawn (their variables, then DBMP and TBMP: 0xF80 bytes)
MBMP, NLBL, TMPB, BESTB, SHUF, XLINE, LBLU, LBLI = 0x6200, 0x6400, 0x6440, 0x6480, 0x64C0, 0x6500, 0x65A0, 0x65C0
CONTROL = bool(os.environ.get("VIDA_CONTROL"))   # the control: the letters offered are shuffled before the cut
# ---- the camera (documentacion/razar/cuerpo.md, "La camara, los cuerpos que cambian y la retroalimentacion")
CAM_DECAY = 7      # interest falls 1/128 a frame: half-life ln2 x 128 = 89 frames (~3 s); criterion, the doc says why
CAM_EASE = 3       # the camera covers 1/8 of the way each frame (time constant 8 frames, the jelly's order); criterion
ZOOM_BITS = 400    # each 4 bits of news (x100) is one step of zoom; criterion: a piece kept saves 2 to 4 bits (measured)
ZOOM_MAX = 3       # criterion: at 3x a body of 8 cells fills 24 of the 200 rows
BIRTH_DIV = 16     # a birth's news: its description length / 16 (criterion: ~10-15 bits, a few lessons' worth)

def remember(v):
    """v_remember: TI's body as Luma remembers it. The recipe she kept for that meal (its line in her memory) is
    grown and drawn as its form would be, in a room of 40 x 50 (comer's r_fit_cost, the same drawing that judged the
    meal), and that drawing becomes the creature's own cloud: a .nube v3 of 40 x 50 cells, the contour in the meal's
    most counted colour and the inside in its second (criterion: the doc saw many creatures' most counted colour is
    their dark contour). The cloud is written into the casa ("vida-nube-<print>") and given to r_body -> j0 = 1."""
    o, J, ld, st, li, num = v["o"], v["J"], v["ld"], v["st"], v["li"], v["num"]
    g = ST["g"]
    C_REC, C_C1, C_C2, C_FNV, C_BNUB = v["C_REC"], v["C_C1"], v["C_C2"], v["C_FNV"], v["C_BNUB"]
    TMPP = v["TMPP"]
    def copyq(src, dst, n, tag):
        li("j1", src); li("j2", dst); li("j3", n // 8)
        o("%s:" % tag)
        J("jld j4, j1, 0", "jst j4, j2, 0", "jldi j10, 8", "jadd j1, j1, j10", "jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, %s" % tag)
    o("v_remember:")
    J("jcall v_save")
    o("  ; its identity, once: the recipe she kept for that meal, drawn as its form (the drawing that judged the meal)")
    ld("j9", "TI"); J("jld j1, j9, %d" % v["C_IDOK"], "jjnz j1, vr_body", "jld j1, j9, %d" % C_REC); li("j3", TMPP); J("jcall r_get_rec")
    li("j1", TMPP); o("  jst j1, j14, %s" % num(g["G"]["GREC"])); J("jcall r_fit_cost")
    ld("j9", "TI"); J("jld j2, j9, %d" % v["C_IDB"]); li("j1", g["DBMP"]); J("jldi j3, 50")
    o("vr_idc:")
    J("jld j4, j1, 0", "jst j4, j2, 0", "jldi j10, 8", "jadd j1, j1, j10", "jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, vr_idc")
    ld("j9", "TI"); J("jldi j1, 1", "jst j1, j9, %d" % v["C_IDOK"], "jld j2, j9, %d" % v["C_BREC"], "jldb j1, j2, 0", "jjnz j1, vr_body")
    li("j1", TMPP); J("jldi j3, 4")
    o("vr_brc:")
    J("jld j4, j1, 0", "jst j4, j2, 0", "jldi j10, 8", "jadd j1, j1, j10", "jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, vr_brc")
    o("vr_body:                        ; the body it has now, and its cost against its identity (comer's judge)")
    ld("j9", "TI"); J("jld j1, j9, %d" % v["C_BREC"], "jcall v_bcost_raw"); ld("j9", "TI"); J("jst j0, j9, %d" % v["C_BCOST"])
    copyq(g["DBMP"], MBMP, 400, "vr_cpb")
    J("jcall v_restore")
    o("  ; her own cloud: the header, then a bit per cell and a colour per particle")
    cab = b"NUBE" + bytes([3, 0, 0, 0x80, 0x3F, 0, 0, 1, 0, 0, 0x80, 0x3F]) + bytes(8) + (40).to_bytes(2, "little") + (50).to_bytes(2, "little")
    ld("j9", "NUBB")
    for i, bt in enumerate(cab):
        J("jldi j1, %d" % bt, "jstb j1, j9, %d" % i)
    J("jldi j1, 0")
    o("vr_clr:")
    J("jadd j2, j9, j1", "jstb j14, j2, 28", "jldi j10, 1", "jadd j1, j1, j10", "jldi j10, 250", "jsub j10, j1, j10", "jjnz j10, vr_clr")
    J("jldi j10, 278", "jadd j8, j9, j10", "jldi j5, 0", "jldi j6, 0")   # j8 the next colour, j5 = y, j6 = the cell
    o("vr_row:")
    J("jldi j7, 0")                                                      # j7 = x
    o("vr_cell:")
    li("j10", MBMP); J("jldi j11, 3", "jshl j11, j5, j11", "jadd j11, j11, j10", "jld j12, j11, 0", "jshr j13, j12, j7", "jldi j10, 1", "jand j13, j13, j10", "jjz j13, vr_next")
    o("  ; a body cell: its bit; the contour (an edge of the room or a neighbour outside) or the inside")
    J("jldi j10, 3", "jshr j1, j6, j10", "jadd j1, j1, j9", "jldb j2, j1, 28", "jldi j10, 7", "jand j3, j6, j10", "jldi j10, 1", "jshl j10, j10, j3", "jor j2, j2, j10", "jstb j2, j1, 28")
    J("jjz j7, vr_edge", "jjz j5, vr_edge", "jldi j10, 39", "jsub j10, j7, j10", "jjz j10, vr_edge", "jldi j10, 49", "jsub j10, j5, j10", "jjz j10, vr_edge")
    J("jldi j10, 1", "jsub j3, j7, j10", "jshr j4, j12, j3", "jand j4, j4, j10", "jjz j4, vr_edge", "jadd j3, j7, j10", "jshr j4, j12, j3", "jand j4, j4, j10", "jjz j4, vr_edge")
    J("jld j4, j11, -8", "jshr j4, j4, j7", "jand j4, j4, j10", "jjz j4, vr_edge", "jld j4, j11, 8", "jshr j4, j4, j7", "jand j4, j4, j10", "jjz j4, vr_edge")
    ld("j9", "TI"); J("jld j4, j9, %d" % C_C2, "jjmp vr_paint")
    o("vr_edge:")
    ld("j9", "TI"); J("jld j4, j9, %d" % C_C1)
    o("vr_paint:")
    J("jldi j10, 16", "jshr j3, j4, j10", "jstb j3, j8, 0", "jldi j10, 8", "jshr j3, j4, j10", "jstb j3, j8, 1", "jstb j4, j8, 2", "jldi j10, 3", "jadd j8, j8, j10")
    ld("j9", "NUBB")
    o("vr_next:")
    J("jldi j10, 1", "jadd j6, j6, j10", "jadd j7, j7, j10", "jldi j10, 40", "jsub j10, j7, j10", "jjnz j10, vr_cell")
    J("jldi j10, 1", "jadd j5, j5, j10", "jldi j10, 50", "jsub j10, j5, j10", "jjnz j10, vr_row")
    J("jsub j8, j8, j9"); ld("j9", "TI"); J("jst j8, j9, %d" % C_BNUB)
    o("  ; written into the casa as one of her own clouds: \"vida-nube-<print>\"")
    for i, bt in enumerate(b"vida-nube-"):
        J("jldi j1, %d" % bt); o("  jstb j1, j14, %s" % num(NLBL + i))
    ld("j9", "TI"); J("jld j1, j9, %d" % C_FNV, "jldi j2, 16"); li("j3", NLBL + 10); J("jcall r_put_hex")
    li("j11", NLBL); J("jldi j12, 26", "jcall r_open"); ld("j9", "FH"); J("jjn j9, vr_done")
    J("jldi j10, 6"); ld("j11", "NUBB"); ld("j9", "TI"); J("jld j12, j9, %d" % C_BNUB, "jcall r_file", "jldi j10, 7", "jcall r_file")
    o("vr_done:")
    J("jldi j0, 1", "jret")

LUMA = types.SimpleNamespace(layout=layout, more_vars=more_vars, init=init, routines=routines, out="luma.jsm", always=ALWAYS, share=False, reader=reader, free=ALWAYS and not os.environ.get("LUMA_GALEOTE"),
                             present=PRESENT, ring_f=RING_F)
exec(compile(open(COMER_SRC, encoding="utf-8").read(), COMER_SRC, "exec"),
     {"__file__": COMER_SRC, "__name__": "gen_comer_en_luma", "LUMA": LUMA})
