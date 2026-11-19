"""Reading, as an act of hers: what makes Luma and Razar one being (the Capitan, 2026-11-19: "uni todo: razar y luma
son una sola cosa... no dos separadas"; "unilo bien, sin parches, sin pasos, una sola operacion que una").

Before, they were two programs that wrote letters to each other: Luma (a window, her forms, a judge of the drawing)
and Razar (pulso.jsm awake in her house, his organ, a judge of the reading). Now there is one program, luma.bin:

  ONE LIFE. luma.bin holds both codes. Born, it looks at its own initial data: none (word 20h is 0) and she is the
    body; a candidate's data (pulso.datos with its four words) and she is her own reader: Razar's exam, untouched
    (pulso.jsm from its first order on, the same text, included here). Razar always sat his exams by launching a child
    of himself; she does the same: her reader is herself, launched by her (request 16), rowing in the gaps (42).
  ONE MEMORY. A recipe of letters is at once a form (what it draws) and an organ (how it reads). Nothing is copied
    from one side to another: no "carta1", no "carta2". What a recipe read is kept once, in "leido".
  ONE JUDGE, in bits (MDL), with nothing weighed by hand:
        worth of the being = sum over her forms [ L(new cells) - letters * log2 15 ]  +  the BEST reading among them
    L(k) = log2 C(N, k): what it costs to say which k of the room's N cells are drawn, without the recipe (the
    enumerative code of a k-subset); new cells = the form's cells minus the most it shares with another form (what
    another already says). The recipe costs log2 15 bits a letter. The reading is the exam's own score, bits saved
    over the lines kept apart (pulso.jsm: ev_gain). The book is said once, so the reading enters as a maximum, not a
    sum: one form reads, the others stay different by what they draw. A recipe never read has no reading (no exam,
    no credit); the reading with no organ at all is the floor.
  ONE WILL. Reading is an act she chooses with the same count as resting, thinking, giving, painting and sleeping
    (Krichevsky-Trofimov, never 0). It pays when what she read came to live in her body.

WHAT SHE READS, in this order (a rule, not a list of cases: first what her judge needs to be exact, then what is new):
  the reading with no organ, if this shelf does not have it; a form of hers never read; what Razar wore when they
  became one (his last letter, once: nothing he learned is lost); then something new, by her luck between two ways
  she counts apart: a recipe of hers with one letter put in, taken out or changed (any of the fifteen), or one of
  her three instincts a step up or down (patience, firmness, readings: the genome of pulso.jsm), read with the form
  that reads best. From which of her forms the letter is changed she also counts, place by place (a count of
  recipes read from it and of the ones that won), so the place whose thoughts read well is asked more. A recipe is read once for a shelf, an instinct and an alphabet ("leido" remembers).
WHEN IT COMES BACK (her doorbell wakes her: no clock): a thought is judged, with its reading, in the place of the form
  it came from, by the judge above; an instinct that reads better than hers with the same recipe becomes hers.
She never waits for her reader: the frames go on. Closing her window ends it (nothing is kept of a reading cut)."""
import hashlib, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))
LECTURA = os.path.join(os.path.dirname(AQUI), "lectura")
READER = ("pulso.jsm", "crece.inc", "casa.inc", "pulso.inc", "organo.inc", "negacion.inc", "lectura.inc")

def fnv(b):
    h = 0xCBF29CE484222325
    for c in b:
        h = ((h ^ c) * 0x100000001B3) & (2 ** 64 - 1)
    return h

# what the letters mean (a reading is of an alphabet), and what she is made of (her build)
ALPHA = fnv(open(os.path.join(LECTURA, "organo.inc"), "rb").read().replace(b"\r\n", b"\n")) >> 1
def build_stamp():
    h = hashlib.sha256()
    for d, names in ((AQUI, ("gen_luma.py", "gen_leer.py", "gen_formas.py", "gen_comer.py", "gen_vida.py")), (LECTURA, READER)):
        for n in names:
            h.update(open(os.path.join(d, n), "rb").read().replace(b"\r\n", b"\n"))
    return int.from_bytes(h.digest()[:8], "little") >> 2 | 1

UNK = 1 << 63                # no reading
BAD = -(1 << 62)             # a reading that broke (its reader said nothing): known, and the worst
LOG15 = 3907                 # log2 15 = 3.90689 bits a letter, in thousandths of a bit
GENOME0 = 0x010208           # the instincts she is born with where there is no letter of Razar's: the ones his own
                             # evolution reached in her house (patience 8, firmness 2, readings 1; nido1)
GOLD = 0x9E3779B97F4A7C15
# her block (gen_luma.py: ST["free"], 64 KB): kept in "libre" (80 bytes), then what lives only while she does
R = 0x1500
N5, S5, NI, SI, NO, SO, SHELF, GENOME, STAMP, RBUD = (R + 8 * i for i in range(10))
FT = R + 80                  # a count for each place of her body: {recipes read that came from it, the ones that won}
KEPT = 80 + 16 * 8
V = 0x1600
(RKID, RGOT, RW1, RW2, RLO, RHI, RGEN, RKIND, RJF, RTAB, RTN, RTC, RLEN, T0, T1, T2, T3, T4, NEWST, RARM, RENDED,
 BEST, HAVE, BESTF, RWF, RSC, RSH, WO, WI) = (V + 8 * i for i in range(29))
RREC = 0x1700                # the recipe being read (32 bytes)
LRD, LMOLD, LBIN, LDAT, LCAR = 0x1740, 0x1750, 0x1770, 0x1790, 0x17B0
WBUF, EBUF = 0x17C0, 0x17E0
PBUF = 0x2000                # what waits for her signature (4096)
LTAB = 0x4000                # L(k), k = 0..N, thousandths of a bit
DBUF = 0x8000                # her reader's initial data (8192)
ENT = 48                     # a line of "leido": lo, hi, score, shelf, genome, alphabet
S_MOLD, S_BIN, S_DAT = b"luma/lectora.molde", b"luma/lectora.bin", b"luma/lectora.datos"

def make(g, ST, free):
    """the hooks gen_formas.py and gen_luma.py call; g = gen_formas' globals"""
    o, J, li, ld, st, num, form_addr = g["o"], g["J"], g["li"], g["ld"], g["st"], g["num"], g["form_addr"]
    B = ST["free"]
    NF, FORMS, F_REC, F_WORTH, CAND, NCELLS = g["NF"], g["FORMS"], g["F_REC"], g["F_WORTH"], g["CAND"], g["ROOMCELLS"]
    F_READ = 248
    assert LTAB + 8 * (NCELLS + 1) <= DBUF and DBUF + 8192 <= 0x10000 and free <= R and R + KEPT <= V and V + 8 * 29 <= RREC and EBUF + ENT <= PBUF and NF == 8
    def gl(r, off): li("j6", B); J("jld %s, j6, %s" % (r, num(off)))
    def gs(r, off): li("j6", B); J("jst %s, j6, %s" % (r, num(off)))
    def inc(off): gl("j1", off); J("jldi j10, 1", "jadd j1, j1, j10"); gs("j1", off)
    def text(off, s):
        li("j6", B)
        for i, c in enumerate(s):
            J("jldi j1, %d" % c, "jstb j1, j6, %s" % num(off + i))
    def wish(s_, n_, to):               # (S + 1/2) / (N + 1), scaled as hers (gen_luma.py: free_routine)
        gl("j1", s_); J("jadd j1, j1, j1", "jldi j10, 1", "jadd j1, j1, j10", "jldi j10, 20", "jshl j1, j1, j10")
        gl("j2", n_); J("jldi j10, 1", "jadd j2, j2, j10", "jdiv j1, j1, j2"); gs("j1", to)
    def probe(tag, found, empty):
        """j1 lo, j2 hi, j3 genome -> at `found` j8 = its slot, at `empty` j8 = the free slot it would take; j4 = the
        table (0: none, to `empty` with j8 0). Uses j5, j7, j10, j11."""
        J("jldi j8, 0"); gl("j4", RTAB); J("jjz j4, %s" % empty)
        J("jldi j10, 1", "jshl j5, j2, j10", "jxor j5, j5, j1", "jldi j10, 3", "jshl j7, j3, j10", "jxor j5, j5, j7"); li("j10", GOLD)
        J("jmul j5, j5, j10", "jldi j10, 29", "jshr j5, j5, j10"); gl("j7", RTN); J("jldi j10, 1", "jsub j7, j7, j10")
        o("%s:" % tag)
        J("jand j5, j5, j7", "jldi j10, 5", "jshl j8, j5, j10", "jadd j8, j8, j4", "jld j10, j8, 24"); li("j11", UNK)
        J("jsub j11, j10, j11", "jjz j11, %s" % empty)
        for k, r in ((0, "j1"), (8, "j2"), (16, "j3")):
            J("jld j11, j8, %d" % k, "jsub j11, j11, %s" % r, "jjnz j11, %s_n" % tag)
        J("jjmp %s" % found)
        o("%s_n:" % tag)
        J("jldi j10, 1", "jadd j5, j5, j10", "jjmp %s" % tag)
    def fold():                         # j0 = a reading: the best so far (BEST, HAVE) takes it if it is one and better
        a = g["lab"]("fold")
        li("j10", UNK); J("jsub j10, j0, j10", "jjz j10, %s" % a); gl("j1", HAVE); J("jjz j1, %s_t" % a)
        gl("j1", BEST); J("jsub j1, j0, j1", "jjn j1, %s" % a, "jjz j1, %s" % a)
        o("%s_t:" % a); gs("j0", BEST); J("jldi j1, 1"); gs("j1", HAVE); J("jldi j1, 1"); gs("j1", T4)
        o("%s:" % a)
    def place(field):                   # the count of the place the thought came from (RJF): one more
        gl("j4", RJF); J("jldi j10, 4", "jshl j7, j4, j10"); li("j10", B + FT); J("jadd j7, j7, j10")
        J("jld j1, j7, %d" % field, "jldi j10, 1", "jadd j1, j1, j10", "jst j1, j7, %d" % field)
    def pwish():                        # j1 = the wish for the place at j7, as hers (uses j2, j10)
        J("jld j1, j7, 8", "jadd j1, j1, j1", "jldi j10, 1", "jadd j1, j1, j10", "jldi j10, 20", "jshl j1, j1, j10",
          "jld j2, j7, 0", "jldi j10, 1", "jadd j2, j2, j10", "jdiv j1, j1, j2")
    def go_on():                        # she goes on, resting or thinking, by her wishes for those two
        WA, WB = 8 * 16, 8 * 17
        gl("j1", WA); gl("j2", WB); J("jadd j1, j1, j2", "jcall r_randmod")
        gl("j1", WA); J("jsub j2, j0, j1", "jjn j2, fr_rest", "jjmp fr_think")

    def birth():
        o("; ONE BEING (gen_leer.py): this program is Luma and Razar. THE ONE JUDGE, in bits, replaces the one above:")
        o(";   worth of the being = sum over her forms [ log2 C(%d, new cells) - letters * log2 15 ] + the best reading" % NCELLS)
        o(";   among her forms (the exam of pulso.jsm, included at the end: her reader is herself, launched by her).")
        o("; ---- who she is: no initial data, the body; a candidate's (ORGK, 20h), her own reader")
        J("jld j2, j14, 20h", "jjz j2, soy_cuerpo", "jldi j2, 0", "jjmp lectora")
        o("soy_cuerpo:")

    def init():
        J("jcall r_read_init              ; her readings, her instincts, the table of the judge (gen_leer.py)")

    def worth():
        """inside r_worth: j1 cells, j2 letters, j3 most shared -> j0 = L(j1 - j3) - j2 log2 15, thousandths of a bit"""
        J("jsub j7, j1, j3", "jldi j10, 3", "jshl j7, j7, j10"); li("j10", B + LTAB); J("jadd j7, j7, j10", "jld j0, j7, 0")
        li("j10", LOG15); J("jmul j7, j2, j10", "jsub j0, j0, j7")

    def routines():
        o("; ---- reading, an act of hers: the one being (see gen_leer.py)")
        o("r_ltab:                         ; L(k) = log2 C(N, k) = L(k - 1) + log2(N - k + 1) - log2(k), N = %d cells" % NCELLS)
        o("                                ; (r_log2 is the meals': 16 bits of fraction)")
        li("j6", B + LTAB); J("jst j14, j6, 0", "jldi j7, 0", "jldi j8, 1")
        o("lt_lap:")
        li("j1", NCELLS + 1); J("jsub j1, j1, j8", "jcall r_log2", "jadd j7, j7, j0", "jadd j1, j8, j14", "jcall r_log2", "jsub j7, j7, j0")
        li("j10", 1000); J("jmul j9, j7, j10", "jldi j10, 16", "jsar j9, j9, j10", "jldi j10, 3", "jshl j11, j8, j10"); li("j10", B + LTAB)
        J("jadd j11, j11, j10", "jst j9, j11, 0", "jldi j10, 1", "jadd j8, j8, j10"); li("j10", NCELLS + 1)
        J("jsub j10, j8, j10", "jjnz j10, lt_lap", "jret")

        o("r_rec_org:                      ; j9 = a recipe -> j1, j2 = it as an organ: four bits a letter from the lowest,")
        o("                                ; sixteen letters a word (uses j3..j5, j10, j11)")
        J("jldi j1, 0", "jldi j2, 0", "jldb j3, j9, 0", "jldi j4, 0")
        o("ro_lap:")
        J("jsub j10, j4, j3", "jjz j10, ro_done", "jadd j5, j9, j4", "jldb j5, j5, 1", "jldi j10, 16", "jsub j10, j4, j10", "jjnn j10, ro_hi")
        J("jldi j10, 2", "jshl j10, j4, j10", "jshl j5, j5, j10", "jor j1, j1, j5", "jjmp ro_next")
        o("ro_hi:")
        J("jldi j11, 2", "jshl j10, j10, j11", "jshl j5, j5, j10", "jor j2, j2, j5")
        o("ro_next:")
        J("jldi j10, 1", "jadd j4, j4, j10", "jjmp ro_lap")
        o("ro_done:")
        J("jret")
        o("r_org_rec:                      ; j1, j2 = an organ -> the recipe at j9 (32 bytes; uses j4, j5, j7, j10)")
        J("jst j14, j9, 0", "jst j14, j9, 8", "jst j14, j9, 16", "jst j14, j9, 24", "jldi j4, 0")
        o("or_lap:")
        J("jldi j10, 15", "jand j5, j1, j10", "jjz j5, or_hi", "jadd j7, j9, j4", "jstb j5, j7, 1", "jldi j10, 4", "jshr j1, j1, j10",
          "jldi j10, 1", "jadd j4, j4, j10", "jjmp or_lap")
        o("or_hi:")
        J("jjz j2, or_done", "jadd j1, j2, j14", "jldi j2, 0", "jjmp or_lap")
        o("or_done:")
        J("jstb j4, j9, 0", "jret")

        o("r_read_get:                     ; j1, j2 = an organ, j3 = the instincts -> j0 = what it read on this shelf, or")
        o("                                ; %Xh: never read (uses j4..j8, j10, j11)" % UNK)
        probe("rg_lap", "rg_found", "rg_none")
        o("rg_found:")
        J("jld j0, j8, 24", "jret")
        o("rg_none:")
        li("j0", UNK); J("jret")
        o("r_read_put:                     ; j1, j2, j3 as above, j9 = its reading: kept (in her memory; the file is")
        o("                                ; r_read_add's)")
        probe("rq_lap", "rq_found", "rq_new")
        o("rq_new:")
        J("jjz j8, rq_done"); gl("j10", RTC); J("jldi j11, 1", "jadd j10, j10, j11"); gs("j10", RTC)
        o("rq_found:")
        J("jst j1, j8, 0", "jst j2, j8, 8", "jst j3, j8, 16", "jst j9, j8, 24")
        o("rq_done:")
        J("jret")

        o("r_reads_load:                   ; \"leido\" into her memory: the readings of this shelf and this alphabet, in a")
        o("                                ; table four times as large as what the file holds (it is made again, larger,")
        o("                                ; when it is half full: r_read_add). Plastic: it grows with what she read.")
        gs("j14", T0)
        li("j11", B + LRD); J("jldi j12, 5", "jcall r_open"); ld("j9", "FH"); J("jjn j9, rl_size")
        o("rl_count:")
        J("jldi j10, 5"); li("j11", B + EBUF); J("jldi j12, %d" % ENT, "jcall r_file", "jldi j10, %d" % ENT, "jsub j10, j13, j10", "jjnz j10, rl_counted")
        inc(T0); J("jjmp rl_count")
        o("rl_counted:")
        J("jldi j10, 7", "jcall r_file")
        o("rl_size:")
        gl("j1", T0); J("jldi j10, 64", "jadd j1, j1, j10", "jldi j10, 2", "jshl j1, j1, j10", "jldi j2, 256")
        o("rl_pow:")
        J("jsub j10, j2, j1", "jjnn j10, rl_have", "jadd j2, j2, j2", "jjmp rl_pow")
        o("rl_have:")
        gs("j2", RTN); J("jldi j10, 5", "jshl j1, j2, j10", "jcall r_alloc"); gs("j0", RTAB); gs("j14", RTC)
        gl("j2", RTN); li("j3", UNK)
        o("rl_blank:")
        J("jst j3, j0, 24", "jldi j10, 32", "jadd j0, j0, j10", "jldi j10, 1", "jsub j2, j2, j10", "jjnz j2, rl_blank")
        li("j11", B + LRD); J("jldi j12, 5", "jcall r_open"); ld("j9", "FH"); J("jjn j9, rl_done")
        o("rl_lap:")
        J("jldi j10, 5"); li("j11", B + EBUF); J("jldi j12, %d" % ENT, "jcall r_file", "jldi j10, %d" % ENT, "jsub j10, j13, j10", "jjnz j10, rl_end")
        gl("j1", EBUF + 24); gl("j2", SHELF); J("jsub j1, j1, j2", "jjnz j1, rl_lap")
        gl("j1", EBUF + 40); li("j2", ALPHA); J("jsub j1, j1, j2", "jjnz j1, rl_lap")
        gl("j1", EBUF); gl("j2", EBUF + 8); gl("j3", EBUF + 32); gl("j9", EBUF + 16); J("jcall r_read_put", "jjmp rl_lap")
        o("rl_end:")
        J("jldi j10, 7", "jcall r_file")
        o("rl_done:")
        J("jret")
        o("r_read_add:                     ; the line at EBUF: written at the end of \"leido\" (nothing of it is ever")
        o("                                ; rewritten), and into her memory")
        li("j11", B + LRD); J("jldi j12, 5", "jcall r_open"); ld("j9", "FH"); J("jjn j9, ra2_mem")
        J("jldi j10, 38", "jldi j11, -1", "jldi j12, 0", "jcall r_file")
        J("jldi j10, 6"); li("j11", B + EBUF); J("jldi j12, %d" % ENT, "jcall r_file", "jldi j10, 7", "jcall r_file")
        o("ra2_mem:")
        gl("j1", T3); J("jjnz j1, ra2_load")                # (another shelf: her memory is of that one now)
        gl("j1", EBUF); gl("j2", EBUF + 8); gl("j3", EBUF + 32); gl("j9", EBUF + 16); J("jcall r_read_put")
        gl("j1", RTC); J("jadd j1, j1, j1"); gl("j2", RTN); J("jsub j1, j2, j1", "jjn j1, ra2_load", "jret")
        o("ra2_load:")
        J("jcall r_reads_load", "jret")

        o("r_read_init:")
        text(LRD, b"leido"); text(LMOLD, S_MOLD); text(LBIN, S_BIN); text(LDAT, S_DAT); text(LCAR, b"carta1")
        gl("j1", STAMP); li("j2", build_stamp()); J("jsub j3, j1, j2", "jjz j3, ri_same"); gs("j2", STAMP); J("jldi j1, 1"); gs("j1", NEWST)
        o("ri_same:                        ; (made of the same as when she slept: nothing new in her)")
        J("jcall r_ltab")
        gl("j1", GENOME); J("jjnz j1, ri_gen")
        o("  ; her instincts: Razar's, from the last letter he left (they are one now), or the ones she is born with")
        li("j6", B); J("jst j14, j6, %s" % num(EBUF), "jst j14, j6, %s" % num(EBUF + 8))
        li("j11", B + LCAR); J("jldi j12, 6", "jcall r_open"); ld("j9", "FH"); J("jjn j9, ri_gen0")
        J("jldi j10, 5"); li("j11", B + EBUF); J("jldi j12, 16", "jcall r_file", "jldi j10, 7", "jcall r_file")
        o("ri_gen0:")
        gl("j1", EBUF); J("jjnz j1, ri_gen1"); li("j1", GENOME0)
        o("ri_gen1:")
        gs("j1", GENOME)
        o("ri_gen:")
        J("jcall r_reads_load", "jret")

        o("r_read_max:                     ; -> j0 = the best reading among her forms and with no organ at all, in")
        o("                                ; thousandths of a bit (0 if nothing was read yet); each form's own is kept in")
        o("                                ; it (%Xh: never read), BESTF = which form reads best (-1: none does)" % UNK)
        gs("j14", HAVE); gs("j14", BEST); J("jldi j1, -1"); gs("j1", BESTF)
        J("jldi j1, 0", "jldi j2, 0"); gl("j3", GENOME); J("jcall r_read_get"); fold()
        gs("j14", T0)
        o("rm_lap:")
        gl("j1", T0); form_addr("j9", "j1"); J("jldi j10, %d" % F_REC, "jadd j9, j9, j10", "jcall r_rec_org"); gl("j3", GENOME); J("jcall r_read_get")
        gl("j1", T0); form_addr("j9", "j1"); J("jst j0, j9, %d" % F_READ)
        gs("j14", T4); fold(); gl("j1", T4); J("jjz j1, rm_next"); gl("j1", T0); gs("j1", BESTF)
        o("rm_next:")
        inc(T0); J("jldi j10, %d" % NF, "jsub j10, j1, j10", "jjnz j10, rm_lap")
        o("rm_out:")
        J("jldi j0, 0"); gl("j1", HAVE); J("jjz j1, rm_ret"); gl("j0", BEST); li("j10", 1000); J("jmul j0, j0, j10")
        o("rm_ret:")
        J("jret")
        o("r_read_cand:                    ; the same with the candidate CAND in the place of form JF (r_judge)")
        gs("j14", HAVE); gs("j14", BEST)
        J("jldi j1, 0", "jldi j2, 0"); gl("j3", GENOME); J("jcall r_read_get"); fold()
        li("j9", CAND); J("jcall r_rec_org"); gl("j3", GENOME); J("jcall r_read_get"); fold()
        gs("j14", T0)
        o("rc2_lap:")
        gl("j1", T0); ld("j2", "JF"); J("jsub j2, j1, j2", "jjz j2, rc2_next"); form_addr("j9", "j1"); J("jld j0, j9, %d" % F_READ); fold()
        o("rc2_next:")
        inc(T0); J("jldi j10, %d" % NF, "jsub j10, j1, j10", "jjnz j10, rc2_lap", "jjmp rm_out")

        o("r_read_pick:                    ; what she reads now -> j0 = 1 (RLO, RHI the organ, RGEN the instincts, RKIND 0 a")
        o("                                ; form of hers or no organ, 1 a thought, 2 an instinct), or 0: nothing new")
        gs("j14", RARM); gs("j14", RKIND); gl("j1", GENOME); gs("j1", RGEN)
        J("jldi j1, 0", "jldi j2, 0"); gl("j3", GENOME); J("jcall r_read_get"); li("j10", UNK); J("jsub j10, j0, j10", "jjnz j10, rp_forms")
        gs("j14", RLO); gs("j14", RHI); J("jldi j0, 1", "jret")
        o("rp_forms:")
        gs("j14", T0)
        o("rp_f_lap:")
        gl("j1", T0); form_addr("j9", "j1"); J("jldi j10, %d" % F_REC, "jadd j9, j9, j10", "jcall r_rec_org"); gs("j1", RLO); gs("j2", RHI)
        gl("j3", GENOME); J("jcall r_read_get"); li("j10", UNK); J("jsub j10, j0, j10", "jjnz j10, rp_f_next", "jldi j0, 1", "jret")
        o("rp_f_next:")
        inc(T0); J("jldi j10, %d" % NF, "jsub j10, j1, j10", "jjnz j10, rp_f_lap")
        o("  ; what Razar wore when they became one: his last letter, once (as a thought of hers, judged like any)")
        li("j6", B); J("jst j14, j6, %s" % num(EBUF), "jst j14, j6, %s" % num(EBUF + 8))
        li("j11", B + LCAR); J("jldi j12, 6", "jcall r_open"); ld("j9", "FH"); J("jjn j9, rp_arm")
        J("jldi j10, 5"); li("j11", B + EBUF); J("jldi j12, 16", "jcall r_file", "jldi j10, 7", "jcall r_file")
        gl("j1", EBUF + 8); J("jjz j1, rp_arm"); gs("j1", RLO); gs("j14", RHI)
        J("jldi j2, 0"); gl("j3", GENOME); J("jcall r_read_get"); li("j10", UNK); J("jsub j10, j0, j10", "jjnz j10, rp_arm")
        gl("j1", RLO); J("jldi j2, 0"); li("j9", B + RREC); J("jcall r_org_rec")
        J("jldi j2, 0", "jldi j3, 0"); li("j9", FORMS); J("jld j5, j9, %d" % F_WORTH)
        o("rp_min:                         ; in the place of the form her judge values least")
        J("jldi j10, 1", "jadd j2, j2, j10", "jldi j10, %d" % NF, "jsub j10, j2, j10", "jjz j10, rp_min_d")
        J("jldi j10, 8", "jshl j7, j2, j10"); li("j10", FORMS); J("jadd j7, j7, j10", "jld j8, j7, %d" % F_WORTH, "jsub j10, j8, j5", "jjnn j10, rp_min",
                                                                   "jadd j5, j8, j14", "jadd j3, j2, j14", "jjmp rp_min")
        o("rp_min_d:")
        gs("j3", RJF); J("jldi j1, 1"); gs("j1", RKIND); J("jldi j0, 1", "jret")
        o("rp_arm:                         ; something new: a letter or an instinct, by her count of each")
        wish(SO, NO, WO); wish(SI, NI, WI)
        gl("j1", WO); gl("j2", WI); J("jadd j1, j1, j2", "jcall r_randmod"); gl("j1", WO); J("jsub j2, j0, j1", "jjn j2, rp_org")
        o("  ; an instinct a step up or down, inside its range (patience 1-8, firmness 1-4, readings 1-3: pulso.jsm)")
        J("jldi j1, 3", "jcall r_randmod"); gs("j0", T0); J("jldi j1, 2", "jcall r_randmod", "jadd j0, j0, j0", "jldi j10, 1", "jsub j4, j0, j10")
        gl("j3", T0); J("jldi j8, 8", "jjz j3, rp_i_top", "jldi j8, 4", "jldi j10, 1", "jsub j10, j3, j10", "jjz j10, rp_i_top", "jldi j8, 3")
        o("rp_i_top:")
        J("jldi j10, 3", "jshl j5, j3, j10"); gl("j1", GENOME); J("jshr j7, j1, j5", "jldi j10, 255", "jand j7, j7, j10", "jadd j2, j7, j4")
        o("  ; (at a wall: the other way)")
        J("jjz j2, rp_i_turn", "jsub j10, j8, j2", "jjnn j10, rp_i_put")
        o("rp_i_turn:")
        J("jsub j2, j7, j4", "jjz j2, rp_org", "jsub j10, j8, j2", "jjn j10, rp_org")
        o("rp_i_put:")
        J("jldi j10, 255", "jshl j10, j10, j5", "jldi j11, -1", "jxor j10, j10, j11", "jand j1, j1, j10", "jshl j2, j2, j5", "jor j1, j1, j2"); gs("j1", RGEN)
        J("jcall r_read_max"); gs("j14", RLO); gs("j14", RHI); gl("j1", BESTF); J("jjn j1, rp_i_org")
        form_addr("j9", "j1"); J("jldi j10, %d" % F_REC, "jadd j9, j9, j10", "jcall r_rec_org"); gs("j1", RLO); gs("j2", RHI)
        o("rp_i_org:")
        gl("j1", RLO); gl("j2", RHI); gl("j3", RGEN); J("jcall r_read_get"); li("j10", UNK); J("jsub j10, j0, j10", "jjnz j10, rp_org")
        J("jldi j1, 2"); gs("j1", RKIND); gs("j1", RARM); J("jldi j0, 1", "jret")
        o("rp_org:                         ; a recipe of hers, by luck, with a letter changed, put in or taken out (any of")
        o("                                ; the fifteen): 64 tries at one she never read (criterion: a round of luck, not a")
        o("                                ; search; none found and she reads nothing this time)")
        gl("j1", GENOME); gs("j1", RGEN); J("jldi j1, 64"); gs("j1", T1)
        o("rp_o_lap:")
        o("  ; from which place of her body: by her count of each (the one whose thoughts won is asked more; none is closed)")
        J("jldi j3, 0", "jldi j4, 0"); li("j7", B + FT)
        o("rp_w_sum:")
        pwish(); J("jadd j3, j3, j1", "jldi j10, 16", "jadd j7, j7, j10", "jldi j10, 1", "jadd j4, j4, j10", "jldi j10, %d" % NF, "jsub j10, j4, j10", "jjnz j10, rp_w_sum")
        J("jadd j1, j3, j14", "jcall r_randmod", "jldi j4, 0"); li("j7", B + FT)
        o("rp_w_pick:")
        pwish(); J("jsub j0, j0, j1", "jjn j0, rp_w_have", "jldi j10, 16", "jadd j7, j7, j10", "jldi j10, 1", "jadd j4, j4, j10", "jldi j10, %d" % NF, "jsub j10, j4, j10",
                   "jjnz j10, rp_w_pick", "jldi j4, %d" % (NF - 1))
        o("rp_w_have:")
        gs("j4", RJF); form_addr("j9", "j4"); li("j7", B + RREC)
        for k in range(4):
            J("jld j10, j9, %d" % (F_REC + 8 * k), "jst j10, j7, %d" % (8 * k))
        J("jldi j1, 3", "jcall r_randmod"); gs("j0", T2)
        li("j7", B + RREC); J("jldb j3, j7, 0", "jjz j3, rp_o_next")
        gl("j0", T2); J("jjz j0, rp_o_chg", "jldi j10, 1", "jsub j10, j0, j10", "jjz j10, rp_o_ins")
        o("  ; taken out (never the last one)")
        J("jldi j10, 1", "jsub j10, j3, j10", "jjz j10, rp_o_chg", "jadd j1, j3, j14", "jcall r_randmod"); li("j7", B + RREC); J("jldb j3, j7, 0")
        o("rp_o_del:")
        J("jldi j10, 1", "jadd j4, j0, j10", "jsub j10, j4, j3", "jjz j10, rp_o_del_d", "jadd j5, j7, j4", "jldb j1, j5, 1", "jstb j1, j5, 0",
          "jadd j0, j4, j14", "jjmp rp_o_del")
        o("rp_o_del_d:")
        J("jadd j5, j7, j3", "jstb j14, j5, 0", "jldi j10, 1", "jsub j3, j3, j10", "jstb j3, j7, 0", "jjmp rp_o_try")
        o("rp_o_ins:                       ; put in (a recipe has room for 31)")
        J("jldi j10, 31", "jsub j10, j3, j10", "jjnn j10, rp_o_chg", "jldi j10, 1", "jadd j1, j3, j10", "jcall r_randmod"); gs("j0", T3)
        J("jldi j1, 15", "jcall r_randmod", "jldi j10, 1", "jadd j2, j0, j10"); gl("j0", T3); li("j7", B + RREC); J("jldb j3, j7, 0", "jadd j4, j3, j14")
        o("rp_o_up:")
        J("jsub j10, j4, j0", "jjz j10, rp_o_up_d", "jadd j5, j7, j4", "jldb j1, j5, 0", "jstb j1, j5, 1", "jldi j10, 1", "jsub j4, j4, j10", "jjmp rp_o_up")
        o("rp_o_up_d:")
        J("jadd j5, j7, j0", "jstb j2, j5, 1", "jldi j10, 1", "jadd j3, j3, j10", "jstb j3, j7, 0", "jjmp rp_o_try")
        o("rp_o_chg:")
        J("jadd j1, j3, j14", "jcall r_randmod"); gs("j0", T3); J("jldi j1, 15", "jcall r_randmod", "jldi j10, 1", "jadd j2, j0, j10")
        gl("j0", T3); li("j7", B + RREC); J("jadd j5, j7, j0", "jstb j2, j5, 1")
        o("rp_o_try:")
        li("j9", B + RREC); J("jcall r_rec_org"); gs("j1", RLO); gs("j2", RHI); gl("j3", GENOME); J("jcall r_read_get")
        li("j10", UNK); J("jsub j10, j0, j10", "jjnz j10, rp_o_next")
        J("jldi j1, 1"); gs("j1", RKIND); gs("j1", RARM); J("jldi j0, 1", "jret")
        o("rp_o_next:")
        gl("j1", T1); J("jldi j10, 1", "jsub j1, j1, j10"); gs("j1", T1); J("jjnz j1, rp_o_lap", "jldi j0, 0", "jret")

        o("r_read_launch:                  ; her reader: herself, with the recipe in its initial data (pulso.datos with the")
        o("                                ; candidate's words: 18h and 30h its letters, 20h that it is one, 28h the instincts),")
        o("                                ; rowing in the gaps (42). No cage (34): any string of letters is an organ and none")
        o("                                ; can hang, and what ends it is her window closing -> j0 = 1")
        li("j11", B + LMOLD); J("jldi j12, %d" % len(S_MOLD), "jcall r_open"); ld("j9", "FH"); J("jjn j9, rn_no")
        J("jldi j10, 5"); li("j11", B + DBUF); li("j12", 8192); J("jcall r_file"); gs("j13", RLEN); J("jldi j10, 7", "jcall r_file")
        gl("j1", RLEN); J("jldi j10, 64", "jsub j1, j1, j10", "jjn j1, rn_no")
        li("j9", B + DBUF); gl("j1", RHI); J("jst j1, j9, 18h", "jldi j1, 1", "jst j1, j9, 20h"); gl("j1", RGEN); J("jst j1, j9, 28h")
        gl("j1", RLO); J("jst j1, j9, 30h", "jst j14, j9, 38h")
        J("jldi j10, 12"); li("j11", B + LDAT); J("jldi j12, %d" % len(S_DAT), "jcall r_tocar")
        li("j11", B + LDAT); J("jldi j12, %d" % len(S_DAT), "jcall r_open"); ld("j9", "FH"); J("jjn j9, rn_no")
        J("jldi j10, 6"); li("j11", B + DBUF); gl("j12", RLEN); J("jcall r_file", "jldi j10, 7", "jcall r_file")
        li("j10", 16 | (14 << 32)); li("j11", B + LBIN); J("jldi j12, %d" % len(S_BIN), "jcall r_tocar", "jjn j13, rn_no")
        J("jldi j10, 1", "jadd j1, j13, j10"); gs("j1", RKID); gs("j14", RGOT)
        J("jldi j10, 42", "jadd j11, j13, j14", "jldi j12, 1", "jcall r_tocar")
        J("jldi j0, 1", "jret")
        o("rn_no:")
        J("jldi j0, 0", "jret")
        o("r_read_end:                     ; her window closes: her reader ends with her (33)")
        gl("j1", RKID); J("jjz j1, re_done", "jldi j10, 33", "jldi j11, 1", "jsub j11, j1, j11", "jldi j12, 0", "jcall r_tocar"); gs("j14", RKID)
        o("re_done:")
        J("jret")

        o("r_read_poll:                    ; her doorbell (her reader asks for a signature, says a word or ends), or a frame")
        o("                                ; while it reads: what waits is signed, its words are heard (the shelf it read,")
        o("                                ; then its score), and when it ended what it read is settled")
        gl("j1", RKID); J("jjnz j1, pl_go", "jret")
        o("pl_go:")
        J("jldi j10, 19", "jldi j11, 1", "jsub j11, j1, j11", "jldi j12, 0", "jcall r_tocar"); gs("j13", RENDED)
        J("jldi j10, 18"); li("j11", B + PBUF); li("j12", 4096); J("jcall r_tocar", "jadd j8, j13, j14", "jjn j8, pl_words", "jjz j8, pl_words")
        gs("j8", T0); li("j9", B + PBUF); gs("j9", T1)
        o("pl_sign:")
        gl("j9", T1); J("jldi j10, 17", "jld j11, j9, 0", "jldi j12, 1", "jcall r_tocar")
        gl("j9", T1); J("jldi j10, 24", "jadd j9, j9, j10"); gs("j9", T1); gl("j8", T0); J("jldi j10, 1", "jsub j8, j8, j10"); gs("j8", T0); J("jjnz j8, pl_sign")
        o("pl_words:")
        J("jldi j10, 31"); li("j11", B + WBUF); J("jldi j12, 0", "jcall r_tocar", "jldi j10, 1", "jsub j10, j13, j10", "jjnz j10, pl_state")
        gl("j1", WBUF); gl("j2", RKID); J("jldi j10, 1", "jsub j2, j2, j10", "jsub j1, j1, j2", "jjnz j1, pl_words")
        gl("j1", RW2); gs("j1", RW1); gl("j1", WBUF + 8); gs("j1", RW2); inc(RGOT); J("jjmp pl_words")
        o("pl_state:")
        gl("j1", RENDED); J("jldi j10, 1", "jadd j1, j1, j10", "jjnz j1, r_read_done", "jret")
        o("r_read_done:                    ; it ended: its line in \"leido\", and what it changes in her")
        gl("j11", RKID); J("jldi j10, 1", "jsub j11, j11, j10"); gs("j14", RKID); gs("j14", T3)
        gl("j1", SHELF); gs("j1", RSH); li("j1", BAD); gs("j1", RSC)
        gl("j1", RGOT); J("jldi j10, 2", "jsub j1, j1, j10", "jjn j1, rd_line")
        gl("j1", RW2); gs("j1", RSC); gl("j1", RW1); gs("j1", RSH)
        o("rd_line:")
        gl("j1", RSH); gl("j2", SHELF); J("jsub j2, j1, j2", "jjz j2, rd_same"); gs("j1", SHELF); J("jldi j2, 1"); gs("j2", T3)
        o("rd_same:")
        for off, src in ((0, RLO), (8, RHI), (16, RSC), (24, RSH), (32, RGEN)):
            gl("j1", src); gs("j1", EBUF + off)
        li("j1", ALPHA); gs("j1", EBUF + 40)
        J("jcall r_read_add")
        gl("j1", RSC); li("j2", BAD); J("jsub j1, j1, j2", "jjz j1, rd_plain")
        gl("j1", RKIND); J("jjz j1, rd_plain", "jldi j10, 1", "jsub j10, j1, j10", "jjz j10, rd_thought")
        o("  ; an instinct: hers if the same recipe reads better with it")
        gl("j1", RLO); gl("j2", RHI); gl("j3", GENOME); J("jcall r_read_get"); li("j10", UNK); J("jsub j10, j0, j10", "jjz j10, rd_plain")
        gl("j1", RSC); J("jsub j1, j1, j0", "jjn j1, rd_plain", "jjz j1, rd_plain")
        gl("j1", RGEN); gs("j1", GENOME); inc(SI); inc(S5); J("jjmp rd_plain")
        o("rd_thought:                     ; a thought: judged with its reading, in the place of the form it came from")
        J("jcall r_recompute")
        li("j7", B + RREC)
        for k in range(4):
            J("jld j10, j7, %d" % (8 * k)); o("  jst j10, j14, %s" % num(CAND + 8 * k))
        gl("j1", RJF); st("j1", "JF"); J("jcall r_judge", "jldi j10, 2", "jsub j10, j0, j10", "jjnz j10, rd_saved")
        inc(S5); gl("j1", RARM); J("jjz j1, rd_saved"); inc(SO); place(8); J("jjmp rd_saved")
        o("rd_plain:")
        J("jcall r_recompute"); g["setg"]("CHANGED", 1)
        o("rd_saved:")
        J("jcall r_free_save", "jret")

    def act():
        """inside r_free: the act of reading (fr_read). She does not wait for it: she goes on."""
        o("fr_read:                        ; she reads (gen_leer.py): her reader leaves with a recipe, and she goes on;")
        o("                                ; while one reads she does not send another")
        gl("j1", RKID); J("jjnz j1, fr_r_on", "jcall r_read_pick", "jjz j0, fr_think", "jcall r_read_launch", "jjz j0, fr_think")
        gl("j1", RKIND); J("jjz j1, fr_r_on"); inc(N5)
        gl("j1", RARM); J("jjz j1, fr_r_cnt", "jldi j10, 1", "jsub j10, j1, j10", "jjnz j10, fr_r_ins"); inc(NO); place(0); J("jjmp fr_r_cnt")
        o("fr_r_ins:")
        inc(NI)
        o("fr_r_cnt:")
        J("jcall r_free_save")
        o("fr_r_on:")
        go_on()

    def finish(L):
        """the reader's text after hers: pulso.jsm as it is, from its first order on (hers already gave the room), its
        names kept; a label of hers with the same name as one of its gets "b_" (the body's), whatever it is."""
        src = open(os.path.join(LECTURA, "pulso.jsm"), encoding="utf-8").read().replace("\r\n", "\n").split("\n")
        i_inc = next(i for i, l in enumerate(src) if l.startswith("include '../../escalon0/janax.inc'"))
        assert src[i_inc + 1].startswith("jfirst j1, 10000h")
        names = set()
        for n in READER:
            for l in open(os.path.join(LECTURA, n), encoding="utf-8"):
                m = re.match(r"\s*([A-Za-z_][\w.]*)\s*(:|=)", l.split(";")[0])
                if m: names.add(m.group(1))
        mine = set()
        for l in L:
            m = re.match(r"\s*([A-Za-z_][\w.]*)\s*:", l.split(";")[0])
            if m: mine.add(m.group(1))
        both = sorted(names & mine, key=len, reverse=True)
        assert "lectora" not in names and "soy_cuerpo" not in names
        if both:
            pat = re.compile(r"\b(" + "|".join(both) + r")\b")
            for i, l in enumerate(L):
                code, sep, com = l.partition(";")
                L[i] = pat.sub(r"b_\1", code) + sep + com
        L.append("; ==== her reader: pulso.jsm (razar/lectura), included whole by gen_leer.py; only its first order is hers")
        L.extend(src[:i_inc])
        L.append("lectora:")
        for l in src[i_inc + 2:]:
            m = re.match(r"include '([\w.]+)'", l)
            L.append("include '../lectura/%s'" % m.group(1) if m else l)
        while L and not L[-1]:
            L.pop()
        print("luma: su lectora adentro (%d lineas de pulso.jsm), %d nombres del cuerpo con b_: %s" % (len(src) - 2, len(both), " ".join(both)))

    import types
    return types.SimpleNamespace(birth=birth, init=init, worth=worth, routines=routines, act=act, finish=finish, B=B,
                                 gl=gl, gs=gs, inc=inc, N5=N5, S5=S5, RWF=RWF, NEWST=NEWST, R=R, KEPT=KEPT, F_READ=F_READ)
