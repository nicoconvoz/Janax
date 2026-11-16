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
import os, re, types

AQUI = os.path.dirname(os.path.abspath(__file__))
COMER_SRC = os.path.join(AQUI, "gen_comer.py")
VIDA_SRC = os.path.join(AQUI, "gen_vida.py")

FW, FH = 160, 100            # the forms' own screen (gen_formas: 4 x 2 rooms of 40 x 50)
ZOOM = 2                     # criterion: drawn at twice its size, so it is as tall as the creatures' world
SW, SH = FW * ZOOM + 320, 200   # the shared screen: the forms (320 x 200) beside the creatures' world (320 x 200)
WX0 = FW * ZOOM              # where the creatures' world starts
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
    g["ROOM"] = (scloud + 28 + SW * SH // 8 + 3 * SW * SH + 0xFFFF) & ~0xFFFF

def more_vars(g):
    hi = max(g["G"].values())
    assert hi < OFF + 0x200, hex(hi)       # the forms' and the meals' variables stay under the creatures' region
    for k in ("XCANB", "LHB", "BLB"):
        assert g[k] + 0x40 <= OFF + 0x200, k

def init(g):
    g["J"]("jcall v_init                  ; the creatures' world: its list, what they learned, who was eaten")

def routines(g):
    L = g["L"]
    n0 = len(L)
    cfg = {"off": OFF, "sw": SW, "sh": SH, "wx0": WX0, "cloud": ST["scloud"], "init_tail": init_tail, "routines": vida_routines}
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
    L.extend(out)
    print("luma: %d lines of the creatures, %d labels renamed v_..." % (len(out), len(names)))

# ---- written inside gen_vida's namespace (its helpers, its variables), with the forms' and the meals' addresses
def fg(name):
    return ST["g"]["G"][name]

def init_tail(v):
    o, J, ld, st, li, rec, num, incg = v["o"], v["J"], v["ld"], v["st"], v["li"], v["rec"], v["num"], v["incg"]
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

def vida_routines(v):
    o, J, ld, st, li, rec, num, incg, setg = v["o"], v["J"], v["ld"], v["st"], v["li"], v["rec"], v["num"], v["incg"], v["setg"]
    FRAME_MS, EV = v["FRAME_MS"], v["EV"]
    g = ST["g"]
    o("; ---- the creatures inside Luma: a frame, the shared picture, alive or not, the calm, an event, a meal")
    o("v_frame:")
    ld("j1", "N"); J("jjz j1, vf_ret")
    incg("FRAMES")
    v["frame_body"]()
    ld("j1", "WALK"); J("jjz j1, vf_ret", "jldi j10, 1", "jsub j1, j1, j10"); st("j1", "WALK")
    o("vf_ret:")
    J("jret")
    o("v_show:                         ; the ground, her forms at twice their size on the left, the creatures on the right")
    J("jcall r_fill")
    li("j1", g["RGB"]); li("j2", v["RGB"]); J("jldi j3, %d" % FH)
    o("vs_row:")
    J("jldi j4, %d" % FW, "jadd j5, j2, j14")
    o("vs_cell:")
    J("jldb j6, j1, 0", "jldb j7, j1, 1", "jldb j8, j1, 2")
    for dy in range(ZOOM):
        for dx in range(ZOOM):
            at = 3 * (dy * SW + dx)
            J("jstb j6, j5, %d" % at, "jstb j7, j5, %d" % (at + 1), "jstb j8, j5, %d" % (at + 2))
    J("jldi j10, 3", "jadd j1, j1, j10", "jldi j10, %d" % (3 * ZOOM), "jadd j5, j5, j10", "jldi j10, 1", "jsub j4, j4, j10", "jjnz j4, vs_cell")
    li("j10", 3 * SW * ZOOM); J("jadd j2, j2, j10", "jldi j10, 1", "jsub j3, j3, j10", "jjnz j3, vs_row")
    ld("j1", "N"); J("jjz j1, vs_show", "jcall r_draw", "jcall r_draw_packets")
    o("vs_show:")
    J("jldi j10, 40"); li("j11", v["CLOUD"]); li("j12", v["TOTAL"]); J("jcall r_tocar", "jret")
    o("v_alive:                        ; j0 = nonzero while the creatures have something new")
    J("jldi j0, 0"); ld("j1", "N"); J("jjz j1, va_ret")
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

SAVE, MBMP, NLBL = 0x5000, 0x5E00, 0x5F80   # free room 0 above the creatures' region: a saved state, a body, a label
SAVES = ((0x200, 0x800), (0x1A00, 0x1F80))  # the forms' and the meals' variables, kept while a body is remembered

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
    at = SAVE
    for i, (a0, a1) in enumerate(SAVES):
        copyq(a0, at, a1 - a0, "vr_sv%d" % i); at += a1 - a0
    copyq(g["DBMP"], at, 512, "vr_svb")
    o("  ; the recipe she kept, grown and drawn as its form (the drawing that judged the meal)")
    ld("j9", "TI"); J("jld j1, j9, %d" % C_REC); li("j3", TMPP); J("jcall r_get_rec")
    li("j1", TMPP); o("  jst j1, j14, %s" % num(g["G"]["GREC"])); J("jcall r_fit_cost")
    copyq(g["DBMP"], MBMP, 400, "vr_cpb")
    at = SAVE
    for i, (a0, a1) in enumerate(SAVES):
        copyq(at, a0, a1 - a0, "vr_rs%d" % i); at += a1 - a0
    copyq(at, g["DBMP"], 512, "vr_rsb")
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

LUMA = types.SimpleNamespace(layout=layout, more_vars=more_vars, init=init, routines=routines, out="luma.jsm")
exec(compile(open(COMER_SRC, encoding="utf-8").read(), COMER_SRC, "exec"),
     {"__file__": COMER_SRC, "__name__": "gen_comer_en_luma", "LUMA": LUMA})
