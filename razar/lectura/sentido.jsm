; The meaning (Capitan, 2026-11-06: "first separate the skeleton and give it a meaning, and give the core or cores a
; meaning, and then see which structural meaning gives sense to the core meaning"; "artificial reasoning, not
; statistical"). Razar reasons, it does not vote.
;
; A skeleton is the structure between two cores: "A , padre de B", "A de B", "A y B" (one to three pieces in the middle,
; the two ends words, no marks). Its meaning is not counted: it is proved, from the pairs of cores the book says with
; it, and each property holds when two different pairs at least show it (the anecdote rule), with its proof:
;   it chains:        A m B and B m C (padre de padre);
;   it is symmetric:  A m B and B m A said both;
;   it turns:         another skeleton says the same pairs turned (padre de <-> hijo de);
;   it is the same:   another skeleton says the same pairs the same way;
;   it is denied:     the book says it with the switch too (the no of negacion.inc), and said and denied at once is a
;                     contradiction, shown.
; Silhouettes, not data (Capitan: "a human memory would fill up; keep silhouettes and recognize them on the fly"). What
; is kept is the skeletons and what they prove, and between two cores only the last form they were seen in: every fact
; is met with that form as it is read, proves what it proves, and is forgotten. The cores asked are answered in a
; second reading, recognizing the silhouettes as the text goes by: the meaning of a core is the facts it is in, and a
; skeleton that turns gives the turned fact the book does not say, with its why. The tables grow to what they hold.
; The cores asked about are the words of the file "q", one per line. Its counts go into j0.
S_LIBRO = 0
S_P     = 10h
S_Q     = 18h
S_HEAD  = 40h
S_PAIRS = 80h
S_NEGS  = 0C0h
S_PAIRW = 100h
S_CHAIN = 140h
S_SYM   = 180h
S_DENY  = 1C0h
S_TURNS = 200h
S_SAME  = 240h
S_CONTRA = 280h
S_CORE  = 2C0h
S_DED   = 300h
S_BEC   = 340h
S_BTURN = 380h
S_NOBOOK = 400h
S_NOMEM = 440h
S_SKTOP = 480h
S_TURN  = 4C0h                  ; (the pulses write it too)
S_FLIPS = 4C0h
S_MEM   = 500h
S_LIMS  = 540h
S_WAIT  = 580h
S_NOT   = 5C0h
S_TILL  = 600h
S_OPEN  = 640h
S_GOES  = 680h
S_OTHER = 6C0h
S_ASKQ  = 700h                  ; a question: its line, an answer, said by the book, deduced, no relation fits
S_ANS   = 740h
S_SAIDQ = 780h
S_DEDQ  = 7C0h
S_NOFIT = 800h
S_ARROW = 840h                  ; the arrows found

NSK   = 1930h                   ; skeletons, pairs, denied pairs
NPR   = 1938h
NNG   = 1940h
WJ    = 1948h                   ; walking: the unit, the middle's length, units left
WM    = 1950h
WL    = 1958h
WA    = 1960h                   ; the fact being built: its ends, its skeleton, denied, the middle's start
WB    = 1968h
WK    = 1970h
WN    = 1978h
WP    = 1980h
FE    = 1988h                   ; a skeleton looked at
TBEST = 19A0h                   ; the best partner of a skeleton: which, how many pairs
TBN   = 19A8h
QSI   = 19B0h                   ; the cores asked: where, the one asked
QCW   = 19B8h
TOPN2 = 19C0h
FI2   = 19C8h                   ; (temporaries)
FI3   = 19D0h
FI4   = 19D8h
KPT   = 19E0h
PMT   = 19E8h
BPT   = 1A10h                   ; best_partner: turned or not
MB1   = 1A18h                   ; two middles, piece by piece (three each), and how many in the second
MB2   = 1A30h
MN2   = 1A48h
TMI   = 1C10h                   ; the tables, each {its place, places minus 1, entries, bytes a place}: the skeletons
TMIM  = 1C18h                   ; {key, pairs, a place it is said, its length, chains, symmetric, denied,
TMIN  = 1C20h                   ; contradictions} (64)
TPM   = 1C30h                   ; the last form of each two cores: {key of the two, skeleton, left core, denied} (32)
TPMM  = 1C38h
TPMN  = 1C40h
TLF   = 1C50h                   ; where each skeleton starts and ends: {key of skeleton, core, side} (8)
TLFM  = 1C58h
TLFN  = 1C60h
TMM   = 1C70h                   ; between skeletons: {key, m, m', turned, pairs} (40)
TMMM  = 1C78h
TMMN  = 1C80h
TSN   = 1C90h                   ; what was said of the core asked: {key} (8), one table each
TSNM  = 1C98h
GMODE = 1CB0h                   ; what a window is for: 1 learn, 2 the meaning of the core asked, 3 its deductions,
                                ; 4 and 5 the same for a core of a question, only what fits it
QQS   = 1A50h                   ; a question: its first unit, past its last, where its core is, how many answers
QQE   = 1A58h
QP    = 1A60h
QNA   = 1A68h
QSIDE = 1A70h                   ; fitting: the core's side in the fact (0 left, 1 right), the other core
QOTH  = 1A78h
QU    = 1A80h                   ; a piece of the question being matched
QCV   = 1A88h                   ; how much of the question a fit explains (its core and the middle's words), the pass
QPASS = 1A90h                   ; (0 finds the most any relation explains, 1 says the ones that explain that much), and
QBEST = 1A98h                   ; the most
ROOMAR = 1AA0h                  ; by word {buildings it is in, the limit most of them close with (voted), how many}
ROOMCN = 1AA8h                  ; by limit: how many buildings close with it; and all the buildings
NBLD  = 1AB0h
AST   = 1AB8h                   ; walking the buildings: where the one walked starts, and the pass (1 vote, 2 count)
AMODE = 1AC0h
QBC   = 1D50h                   ; hooks: the middle's word next to the core, the one next to the other core, a place
QBA   = 1D58h                   ; walked in the question, its neighbour, a word looked for, a side
QPOS  = 1D60h
QNB   = 1D68h
QWL   = 1D70h
QDIR  = 1D78h
QNBD  = 1D80h                   ; q_nb: its side, the place it is at, the word there
QNBP  = 1D88h
QNBW  = 1D90h
FLS   = 1CB8h                   ; learning: the skeleton's place, the pair's, turned
FLP   = 1CC0h
FLT   = 1CC8h
KST   = 1CD0h                   ; a side
MA1   = 1CD8h                   ; mm_add: m, m', turned
MA2   = 1CE0h
MA3   = 1CE8h
WSK   = 1CF0h                   ; the skeleton of the window met
ROOMGN = 1D18h                  ; by word: its gender and the genders seen next to it (see genders)
GNG   = 1D20h                   ; finding them: a gender, the word, the words left
GNW   = 1D28h
GNL   = 1D30h
GST   = 1D38h                   ; a deduction by gender: 0 holds, 1 waits, 2 falls; the core and the piece that decided
GFC   = 1D40h
GFP   = 1D48h
include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j0, 0
jcall read_book
jldi j1, 0                      ; the whole book, none kept apart; the house (which are cores), the switch
jldi j2, 0
jshi j2, 4000h
jshi j2, 0
jshi j2, 0
jshi j2, 0
jst j2, j1, PK
jcall learn_pulses
jcall house_decide
jcall distill_no
jcall limits                    ; where each building ends, found in the book
jcall genders                   ; the gender of each word, from its twins

jldi j2, TMI                    ; its tables, empty: they grow to what they hold
jldi j3, 64
jcall pl_new
jldi j2, TPM
jldi j3, 32
jcall pl_new
jldi j2, TLF
jldi j3, 8
jcall pl_new
jldi j2, TMM
jldi j3, 40
jcall pl_new
jldi j1, 0                      ; the book read once: every fact proves what it proves, and is forgotten
jldi j2, 1
jst j2, j1, GMODE
jcall gather

jldi j1, S_HEAD
jcall puts
jld j2, j1, NSK
jcall putmix
jldi j1, S_PAIRS
jcall puts
jld j2, j1, NPR
jcall putmix
jldi j1, S_NEGS
jcall puts
jld j2, j1, NNG
jcall putmix
jldi j1, S_MEM                  ; what the silhouettes take, in bytes
jcall puts
jldi j11, 0
jldi j2, TMI
jcall pl_bytes
jldi j2, TPM
jcall pl_bytes
jldi j2, TLF
jcall pl_bytes
jldi j2, TMM
jcall pl_bytes
jadd j2, j11, j1
jcall putnum
jldi j2, 10
jcall putch
jcall flush
jldi j1, S_LIMS                 ; the limits found: the marks that close a building
jcall puts
jldi j9, 1
jld j10, j1, NV
jldi j2, 1
jsub j10, j10, j2
jwhile j10
  jldi j1, 0
  jldi j3, 24
  jmul j3, j9, j3
  jld j4, j1, ROOMCL
  jadd j3, j3, j4
  jld j3, j3, 0
  jjz j3, lm2_next
  jldi j2, 32
  jcall putch
  jadd j2, j9, j1
  jcall putword
lm2_next:
  jldi j1, 0
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jldi j2, 10
jcall putch
jcall flush
jcall arrows                    ; the words that live in a limit most buildings do not close: what a question asks
jcall sk_report
jcall cores
jjmp finish


; Every window of the book: two words at the ends, one to three pieces between, each window a fact of its skeleton.
; The switch in the middle is taken out and the fact is a denied one. Uses j1-j14.
gather:
  jldi j1, 0
  jst j1, j1, WJ
  jld j2, j1, NTOK
  jst j2, j1, WL
  jwhile j2
    jldi j1, 0
    jldi j2, 1
    jst j2, j1, WM
    ga_len:
      jldi j1, 0
      jld j2, j1, WM
      jldi j3, 4
      jsub j3, j2, j3
      jjz j3, ga_next
      jcall g_window
      jldi j1, 0
      jld j2, j1, WM
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, WM
      jjmp ga_len
  ga_next:
    jldi j1, 0
    jld j2, j1, WJ
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, WJ
    jld j2, j1, WL
    jsub j2, j2, j3
    jst j2, j1, WL
  jwend
  jret

; The window at WJ with WM pieces between: a fact, if its ends are words (not marks, not the switch) and it is all
; pieces. Uses j1-j14.
g_window:
  jldi j1, 0
  jld j9, j1, WJ                ; past the row?
  jld j2, j1, WM
  jadd j9, j9, j2
  jldi j2, 1
  jadd j9, j9, j2
  jld j2, j1, NTOK
  jsub j2, j9, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, gw_none
  jld j2, j1, WJ
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ROOMT
  jadd j10, j2, j3              ; where it starts
  jld j2, j10, 0
  jst j2, j1, WA
  jcall g_core
  jjz j3, gw_none
  jld j2, j1, WM
  jldi j3, 1
  jadd j2, j2, j3
  jldi j3, 3
  jshl j2, j2, j3
  jadd j2, j2, j10
  jld j2, j2, 0
  jst j2, j1, WB
  jcall g_core
  jjz j3, gw_none
  jldi j1, 0                    ; the middle: all pieces; the switch out (denied); its key
  jst j1, j1, WN
  jld j2, j1, FNVO
  jst j2, j1, WK
  jld j11, j1, WM
  jldi j12, 8
  jadd j12, j12, j10
  jldi j13, 0                   ; pieces kept
  jwhile j11
    jldi j1, 0
    jld j2, j12, 0
    jjz j2, gw_none
    jst j2, j1, FE              ; a piece that closes a building: the window crosses into another, no fact
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMCL
    jadd j3, j3, j4
    jld j3, j3, 0
    jjnz j3, gw_none
    jld j2, j1, FE
    jst j2, j1, FE
    jcall n_flags
    jldi j4, 1
    jand j3, j3, j4
    jjz j3, gw_keep
    jldi j1, 0
    jldi j2, 1
    jst j2, j1, WN
    jjmp gw_step
  gw_keep:
    jldi j1, 0
    jld j2, j1, WK
    jld j3, j1, FE
    jcall hw
    jst j2, j1, WK
    jldi j2, 1
    jadd j13, j13, j2
  gw_step:
    jldi j2, 8
    jadd j12, j12, j2
    jldi j2, 1
    jsub j11, j11, j2
  jwend
  jjz j13, gw_none              ; nothing but the switch between
  jldi j1, 0
  jld j2, j1, WK
  jadd j3, j13, j1
  jcall hw
  jjnz j2, gw_k
  jldi j2, 1
gw_k:
  jst j2, j1, WK
  jld j2, j1, WJ
  jst j2, j1, WP
  jld j2, j1, GMODE             ; learned, or met by the core asked
  jldi j3, 1
  jsub j3, j2, j3
  jjnz j3, gw_meet
  jjmp f_learn
gw_meet:
  jjmp f_meet
gw_none:
  jret

; j3 = 1 if the piece j2 can be a core: a word, not a mark, not the switch, not a foundation of the house (the
; skeleton separated first: the cores are what the house left as furniture, or did not decide). Uses j1-j5.
g_core:
  jldi j1, 0
  jjz j2, gc_no
  jst j2, j1, PMT
  jcall w_mark
  jjnz j3, gc_no
  jldi j1, 0
  jld j2, j1, PMT
  jcall n_flags
  jldi j4, 1
  jand j3, j3, j4
  jjnz j3, gc_no
  jldi j1, 0
  jld j2, j1, PMT
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMSD
  jadd j3, j3, j4
  jld j3, j3, 0
  jldi j4, 63
  jsar j4, j3, j4
  jjnz j4, gc_yes
  jjnz j3, gc_no
gc_yes:
  jldi j3, 1
  jret
gc_no:
  jldi j3, 0
  jret
; The fact WA WK WB (WN: denied) as it is read. Its skeleton counts it, and it is met with the last form its two cores
; were seen in, the only thing kept of them: the same skeleton the other way is symmetric, the same said and denied a
; contradiction, another skeleton one pair more between the two (turned or not). Said again the same way it is nothing
; new. Then it is kept as their last form, and an affirmed one looks for its chain. Uses j1-j14.
f_learn:
  jldi j1, 0
  jld j5, j1, WK                ; its skeleton
  jldi j2, TMI
  jcall pl_take
  jjz j6, fl_sk
  jld j7, j1, WP
  jst j7, j4, 16
  jld j7, j1, WM
  jst j7, j4, 24
  jld j7, j1, NSK
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j1, NSK
fl_sk:
  jst j4, j1, FLS               ; (its place: no skeleton is put in before it is counted)
  jld j2, j1, WA                ; the two cores, whichever way: their key
  jld j3, j1, WB
  jsub j4, j3, j2
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, fl_ord
  jadd j4, j2, j1
  jadd j2, j3, j1
  jadd j3, j4, j1
fl_ord:
  jcall k_pair
  jldi j2, TPM
  jcall pl_take
  jst j4, j1, FLP
  jjnz j6, fl_keep
  jld j7, j4, 8                 ; met with their last form
  jld j8, j1, WK
  jsub j7, j7, j8
  jjnz j7, fl_other
  jld j7, j4, 16
  jld j8, j1, WA
  jsub j7, j7, j8
  jjnz j7, fl_sym
  jld j7, j4, 24                ; the same, the same way: said again, or said and denied
  jld j8, j1, WN
  jsub j7, j7, j8
  jjz j7, fl_done
  jld j3, j1, FLS
  jld j7, j3, 56
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j3, 56
  jjmp fl_keep
fl_sym:
  jld j7, j4, 24                ; the same skeleton the other way, both affirmed
  jld j8, j1, WN
  jor j7, j7, j8
  jjnz j7, fl_keep
  jld j3, j1, FLS
  jld j7, j3, 40
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j3, 40
  jjmp fl_keep
fl_other:
  jld j7, j4, 24                ; another skeleton, both affirmed: one pair more between the two, both ways
  jld j8, j1, WN
  jor j7, j7, j8
  jjnz j7, fl_keep
  jld j7, j4, 16
  jld j8, j1, WA
  jsub j12, j7, j8
  jjz j12, fl_t
  jldi j12, 1
fl_t:
  jst j12, j1, FLT
  jld j11, j1, WK
  jld j10, j4, 8
  jcall mm_add
  jldi j1, 0
  jld j4, j1, FLP
  jld j11, j4, 8
  jld j10, j1, WK
  jld j12, j1, FLT
  jcall mm_add
fl_keep:
  jldi j1, 0                    ; kept as their last form, and counted
  jld j4, j1, FLP
  jld j7, j1, WK
  jst j7, j4, 8
  jld j7, j1, WA
  jst j7, j4, 16
  jld j7, j1, WN
  jst j7, j4, 24
  jld j3, j1, FLS
  jldi j8, 1
  jjnz j7, fl_neg
  jld j7, j3, 8
  jadd j7, j7, j8
  jst j7, j3, 8
  jld j7, j1, NPR
  jadd j7, j7, j8
  jst j7, j1, NPR
  jjmp fl_chain
fl_neg:
  jld j7, j3, 48
  jadd j7, j7, j8
  jst j7, j3, 48
  jld j7, j1, NNG
  jadd j7, j7, j8
  jst j7, j1, NNG
fl_done:
  jret

; It chains: a fact of the same skeleton starts where this one ends, or ends where it starts. Then this one's start
; and end are kept. Uses j1-j14.
fl_chain:
  jld j2, j1, WK
  jld j3, j1, WB
  jldi j4, 1
  jcall k_side
  jldi j2, TLF
  jcall pl_find
  jld j7, j4, 0
  jjz j7, fc_end
  jcall fc_one
fc_end:
  jld j2, j1, WK
  jld j3, j1, WA
  jldi j4, 2
  jcall k_side
  jldi j2, TLF
  jcall pl_find
  jld j7, j4, 0
  jjz j7, fc_keep
  jcall fc_one
fc_keep:
  jld j2, j1, WK
  jld j3, j1, WA
  jldi j4, 1
  jcall k_side
  jldi j2, TLF
  jcall pl_take
  jldi j1, 0
  jld j2, j1, WK
  jld j3, j1, WB
  jldi j4, 2
  jcall k_side
  jldi j2, TLF
  jjmp pl_take

; One chain more for the skeleton learned. Uses j1, j3, j7, j8.
fc_one:
  jldi j1, 0
  jld j3, j1, FLS
  jld j7, j3, 32
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j3, 32
  jret

; The key of skeleton j2, core j3, side j4 -> j5. Uses j1-j4.
k_side:
  jldi j1, 0
  jst j3, j1, KPT
  jst j4, j1, KST
  jadd j3, j2, j1
  jld j2, j1, FNVO
  jcall hw
  jld j3, j1, KPT
  jcall hw
  jld j3, j1, KST
  jcall hw
  jjnz j2, ks_k
  jldi j2, 1
ks_k:
  jadd j5, j2, j1
  jret

; The key of the pair j2 j3 (in that order) -> j5. Uses j1-j4.
k_pair:
  jldi j1, 0
  jadd j4, j3, j1
  jadd j3, j2, j1
  jld j2, j1, FNVO
  jst j4, j1, KPT
  jcall hw
  jld j3, j1, KPT
  jcall hw
  jjnz j2, kp_k
  jldi j2, 1
kp_k:
  jadd j5, j2, j1
  jret

; The key of the affirmed fact j3 (skeleton key j2) j4 -> j5, as f_add makes it. Uses j1-j4.
f_key:
  jldi j1, 0
  jst j4, j1, FI2
  jcall hw
  jld j3, j1, FI2
  jcall hw
  jldi j3, 0
  jcall hw
  jjnz j2, fk_k
  jldi j2, 1
fk_k:
  jadd j5, j2, j1
  jret

; One pair more between skeletons j11 and j10, turned j12. Uses j1-j14.
mm_add:
  jldi j1, 0
  jst j11, j1, MA1
  jst j10, j1, MA2
  jst j12, j1, MA3
  jld j2, j1, FNVO
  jadd j3, j11, j1
  jcall hw
  jadd j3, j10, j1
  jcall hw
  jadd j3, j12, j1
  jcall hw
  jjnz j2, ma_k
  jldi j2, 1
ma_k:
  jadd j5, j2, j1
  jldi j2, TMM
  jcall pl_take
  jjz j6, ma_old
  jld j7, j1, MA1
  jst j7, j4, 8
  jld j7, j1, MA2
  jst j7, j4, 16
  jld j7, j1, MA3
  jst j7, j4, 24
ma_old:
  jld j6, j4, 32
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j4, 32
  jret

; The skeletons with the most pairs (two or more), each with what it means: its pairs and every property it proved
; (two cases or more). Uses j1-j14.
sk_report:
  jldi j1, S_SKTOP
  jcall puts
  jldi j2, 30
  jst j2, j1, TOPN2
  jwhile j2
    jldi j1, 0                  ; the most pairs left
    jldi j11, 1
    jldi j12, 0
    jldi j9, 0
    jld j10, j1, TMIM
    jldi j2, 1
    jadd j10, j10, j2
    jwhile j10
      jldi j3, 64
      jmul j3, j9, j3
      jld j2, j1, TMI
      jadd j3, j3, j2
      jld j2, j3, 0
      jjz j2, sr_next
      jld j2, j3, 8
      jsub j4, j11, j2
      jldi j5, 63
      jsar j4, j4, j5
      jjz j4, sr_next
      jadd j11, j2, j1
      jadd j12, j3, j1
    sr_next:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j12, sr_done
    jst j12, j1, FE
    jcall sk_line
    jldi j1, 0
    jld j12, j1, FE
    jldi j2, 0                  ; written: out of the count (its pairs kept negative)
    jld j3, j12, 8
    jsub j2, j2, j3
    jst j2, j12, 8
    jcall flush
    jldi j1, 0
    jld j2, j1, TOPN2
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, TOPN2
  jwend
sr_done:
  jret

; The line of the skeleton at FE: «its middle» n pairs | and each property proved. Uses j1-j14.
sk_line:
  jldi j2, 32
  jcall putch
  jldi j2, 32
  jcall putch
  jld j12, j1, FE
  jcall put_mid
  jld j12, j1, FE
  jld j2, j12, 8
  jcall putmix
  jldi j1, S_PAIRW
  jcall puts
  jld j12, j1, FE               ; it chains
  jld j2, j12, 32
  jldi j1, S_CHAIN
  jcall put_prop
  jld j12, j1, FE               ; symmetric
  jld j2, j12, 40
  jldi j1, S_SYM
  jcall put_prop
  jld j12, j1, FE               ; denied
  jld j2, j12, 48
  jldi j1, S_DENY
  jcall put_prop
  jld j12, j1, FE               ; said and denied at once
  jld j2, j12, 56
  jldi j1, S_CONTRA
  jcall put_prop
  jldi j12, 1                   ; turned: the skeleton that says its pairs turned
  jcall best_partner
  jld j2, j1, TBEST
  jjz j2, sl_same
  jldi j1, S_TURNS
  jcall puts
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jldi j2, 40
  jcall putch
  jld j2, j1, TBN
  jcall putmix
  jldi j2, 41
  jcall putch
sl_same:
  jldi j12, 0                   ; the same: the skeleton that says its pairs the same way
  jcall best_partner
  jld j2, j1, TBEST
  jjz j2, sl_end
  jldi j1, S_SAME
  jcall puts
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jldi j2, 40
  jcall putch
  jld j2, j1, TBN
  jcall putmix
  jldi j2, 41
  jcall putch
sl_end:
  jldi j2, 10
  jjmp putch

; A property proved (j2 cases, two or more) written with its text j1 and its cases. Uses j1-j4.
put_prop:
  jldi j3, 2
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, pp2_no
  jldi j4, 0
  jst j2, j4, PMT
  jcall puts
  jld j2, j1, PMT
  jcall putmix
  jldi j2, 41
  jjmp putch
pp2_no:
  jldi j1, 0
  jret

; The skeleton that shares the most pairs (two or more) with the skeleton at FE, turned j12 -> TBEST (its key, 0:
; none) and TBN. Uses j1-j14.
best_partner:
  jldi j1, 0
  jst j12, j1, BPT
  jst j1, j1, TBEST
  jldi j2, 1
  jst j2, j1, TBN
  jld j11, j1, FE
  jld j11, j11, 0               ; its key
  jldi j9, 0
  jld j10, j1, TMMM
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j3, 40
    jmul j3, j9, j3
    jld j2, j1, TMM
    jadd j3, j3, j2
    jld j2, j3, 0
    jjz j2, bp2_next
    jld j2, j3, 8
    jsub j2, j2, j11
    jjnz j2, bp2_next
    jld j2, j3, 24
    jld j4, j1, BPT
    jsub j2, j2, j4
    jjnz j2, bp2_next
    jld j2, j3, 32
    jld j4, j1, TBN
    jsub j4, j4, j2
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, bp2_next
    jst j3, j1, FI3             ; a counterexample (a pair shared the other way) and it is no such partner
    jst j2, j1, FI4
    jld j2, j1, FNVO
    jadd j3, j11, j1
    jcall hw
    jld j3, j1, FI3
    jld j3, j3, 16
    jcall hw
    jldi j3, 1
    jld j4, j1, BPT
    jsub j3, j3, j4
    jcall hw
    jjnz j2, bp2_k
    jldi j2, 1
  bp2_k:
    jadd j5, j2, j1
    jldi j2, TMM
    jcall pl_find
    jld j6, j4, 0
    jld j3, j1, FI3
    jjnz j6, bp2_next
    jld j2, j3, 16              ; a door is the same skeleton with one difference: else no partner
    jcall find_mid
    jcall one_diff
    jldi j1, 0
    jld j3, j1, FI3
    jjz j2, bp2_next
    jld j2, j1, FI4
    jst j2, j1, TBN
    jld j2, j3, 16
    jst j2, j1, TBEST
  bp2_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret


; j2 = 1 if the skeleton at j12 is the one at FE with one difference: as many pieces (the switch out, two or more:
; something the same) and exactly one of them other (the same structure, one piece changed: padre de / hijo de).
; Uses j1-j8, j13.
one_diff:
  jldi j13, MB2
  jcall m_collect
  jldi j1, 0
  jst j2, j1, MN2
  jld j12, j1, FE
  jldi j13, MB1
  jcall m_collect
  jldi j1, 0
  jld j3, j1, MN2
  jsub j3, j2, j3
  jjnz j3, od_no
  jldi j3, 2                    ; and something the same, for the difference to be one: two pieces or more
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, od_no
  jldi j5, 0                    ; how many differ
  jldi j6, 0
  jwhile j2
    jldi j3, 3
    jshl j3, j6, j3
    jld j4, j3, MB1
    jld j3, j3, MB2
    jsub j4, j4, j3
    jjz j4, od_same
    jldi j4, 1
    jadd j5, j5, j4
  od_same:
    jldi j4, 1
    jadd j6, j6, j4
    jsub j2, j2, j4
  jwend
  jldi j4, 1
  jsub j5, j5, j4
  jjnz j5, od_no
  jldi j2, 1
  jret
od_no:
  jldi j2, 0
  jret

; The pieces of the middle of the skeleton at j12 (the switch out) to the buffer j13 -> j2 how many. Uses j1-j8.
m_collect:
  jldi j1, 0
  jld j7, j12, 16
  jld j8, j12, 24
  jldi j6, 0
  jwhile j8
    jldi j1, 0
    jldi j2, 1
    jadd j7, j7, j2
    jldi j2, 3
    jshl j2, j7, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jst j2, j1, PMT
    jcall n_flags
    jldi j4, 1
    jand j3, j3, j4
    jjnz j3, mc_skip
    jld j2, j1, PMT
    jldi j3, 3
    jshl j3, j6, j3
    jadd j3, j3, j13
    jst j2, j3, 0
    jldi j3, 1
    jadd j6, j6, j3
  mc_skip:
    jldi j2, 1
    jsub j8, j8, j2
  jwend
  jadd j2, j6, j1
  jret

; The skeleton of key j2 -> j12 at its place. Uses j1-j8.
find_mid:
  jadd j5, j2, j1
  jldi j2, TMI
  jcall pl_find
  jadd j12, j4, j1
  jret

; The middle of the skeleton at j12, written between quotes (its pieces where it is said, the switch out). Uses j1-j9.
put_mid:
  jldi j1, 0
  jld j9, j12, 16
  jld j10, j12, 24
  jldi j2, 34
  jcall putch
  jldi j2, 95
  jcall putch
  jldi j1, 0
  jldi j11, 1
  jwhile j10
    jldi j1, 0
    jadd j2, j9, j11
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jst j2, j1, PMT
    jcall n_flags
    jldi j4, 1
    jand j3, j3, j4
    jjnz j3, pm_skip
    jldi j2, 32
    jcall putch
    jld j2, j1, PMT
    jcall putword
  pm_skip:
    jldi j1, 0
    jldi j2, 1
    jadd j11, j11, j2
    jsub j10, j10, j2
  jwend
  jldi j2, 32
  jcall putch
  jldi j2, 95
  jcall putch
  jldi j2, 34
  jcall putch
  jldi j2, 32
  jjmp putch

; The cores asked (the words of "q", one per line): each one's meaning (the skeletons it fills, with two pairs or
; more, and its partner there), and what it deduces from the skeletons that turn or chain. Uses j1-j14.
cores:
  jldi j1, 0
  jldi j2, S_Q
  jst j2, j1, LABEL
  jldi j2, 1
  jst j2, j1, LABLEN
  jldi j2, 2
  jst j2, j1, PASS
  jst j1, j1, QN
  jcall scan
  jldi j1, 0
  jst j1, j1, QSI
  jld j2, j1, QN
  jwhile j2
    jldi j1, 0                  ; a line: to the 0 that ends it
    jld j9, j1, QSI
    jst j9, j1, QQS
  co_end:
    jld j2, j1, QN
    jsub j2, j9, j2
    jjz j2, co_line
    jldi j2, 3
    jshl j2, j9, j2
    jld j2, j2, QBUF
    jjz j2, co_line
    jldi j2, 1
    jadd j9, j9, j2
    jjmp co_end
  co_line:
    jst j9, j1, QQE
    jld j2, j1, QQS
    jsub j3, j9, j2
    jjz j3, co_next
    jldi j4, 1                  ; one piece: a core, its meaning; more: a question (Capitan: "the furniture and the
    jsub j3, j3, j4             ; logical relation that fits the question")
    jjnz j3, co_question
    jldi j3, 3
    jshl j2, j2, j3
    jld j2, j2, QBUF
    jldi j3, 1                  ; a word it knows (not a hole, not unknown)
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, co_next
    jst j2, j1, QCW
    jcall core_one
    jcall flush
    jjmp co_next
  co_question:
    jcall question_one
    jcall flush
  co_next:
    jldi j1, 0
    jld j9, j1, QQE
    jldi j2, 1
    jadd j9, j9, j2
    jst j9, j1, QSI
    jld j3, j1, QN
    jsub j2, j3, j9
    jldi j3, 63
    jsar j3, j2, j3
    jjz j3, co_more
    jldi j2, 0
  co_more:
  jwend
  jret
; The core QCW, read again as the text goes by: first its meaning (every affirmed fact it is in, once, written when its
; skeleton has two pairs or more), then what follows from it (the turned fact of a skeleton that turns, when the
; book never said it). What was said is kept only for the core asked. Uses j1-j14.
core_one:
  jldi j1, S_CORE
  jcall puts
  jld j2, j1, QCW
  jcall putword
  jldi j2, 10
  jcall putch
  jldi j2, TSN
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jldi j2, 2
  jst j2, j1, GMODE
  jcall gather
  jldi j1, 0
  jldi j2, 3
  jst j2, j1, GMODE
  jcall gather
  jjmp flush

; The window WA WK WB met by the core asked: its meaning (GMODE 2) or what it deduces (3). Uses j1-j14.
f_meet:
  jldi j1, 0
  jld j6, j1, WN                ; affirmed, and the core asked at one end
  jjnz j6, fm_done
  jld j6, j1, QCW
  jld j7, j1, WA
  jsub j7, j7, j6
  jjz j7, fm_in
  jld j7, j1, WB
  jsub j7, j7, j6
  jjnz j7, fm_done
fm_in:
  jld j5, j1, WK                ; its silhouette
  jldi j2, TMI
  jcall pl_find
  jst j4, j1, WSK
  jld j2, j1, GMODE
  jldi j3, 4
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, q_meet
  jld j2, j1, GMODE
  jldi j3, 2
  jsub j3, j2, j3
  jjnz j3, fm_deduce
  jld j2, j1, WK                ; its meaning: said, once
  jld j3, j1, WA
  jld j4, j1, WB
  jcall f_key
  jldi j2, TSN
  jcall pl_take
  jjz j6, fm_done
  jcall fm_two
  jjz j6, fm_done
  jldi j2, 32
  jcall putch
  jldi j2, 32
  jcall putch
  jld j2, j1, WA
  jadd j12, j2, j1
  jcall mix
  jcall putword
  jldi j2, 32
  jcall putch
  jld j12, j1, WSK
  jcall put_mid
  jld j2, j1, WB
  jcall putword
  jldi j2, 10
  jcall putch
  jjmp flush
fm_deduce:
  jcall fm_two
  jjz j6, fm_done
  jld j2, j1, WSK               ; a skeleton that turns
  jst j2, j1, FE
  jldi j12, 1
  jcall best_partner
  jldi j1, 0
  jld j2, j1, TBEST
  jjz j2, fm_done
  jld j3, j1, WB                ; the turned fact: not said in the book, and deduced once
  jld j4, j1, WA
  jcall f_key
  jldi j2, TSN
  jcall pl_take
  jjz j6, fm_done
  jcall fm_gender               ; its two cores where it puts them: of the gender of what is next to them?
  jldi j1, 0
  jld j2, j1, GST
  jldi j1, S_DED
  jjz j2, fm_say
  jldi j3, 1
  jsub j3, j2, j3
  jldi j1, S_WAIT
  jjz j3, fm_say
  jldi j1, S_NOT
fm_say:
  jcall puts
  jld j2, j1, WB
  jcall putword
  jldi j2, 32
  jcall putch
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jld j2, j1, WA
  jcall putword
  jldi j1, S_BEC
  jcall puts
  jld j12, j1, WSK
  jcall put_mid
  jldi j1, S_BTURN
  jcall puts
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jldi j2, 41
  jcall putch
  jld j2, j1, GST               ; and what it waits for, or why it fell
  jjz j2, fm_end
  jldi j3, 1
  jsub j3, j2, j3
  jldi j1, S_TILL
  jjz j3, fm_why
  jldi j1, S_OPEN
fm_why:
  jcall puts
  jld j2, j1, GFC
  jcall putword
  jld j2, j1, GST
  jldi j3, 1
  jsub j3, j2, j3
  jldi j1, S_GOES
  jjz j3, fm_piece
  jldi j1, S_OTHER
fm_piece:
  jcall puts
  jld j2, j1, GFP
  jcall putword
  jldi j2, 41
  jcall putch
fm_end:
  jldi j2, 10
  jcall putch
  jjmp flush
fm_done:
  jret

; The turned fact WB «TBEST» WA puts WB before the first piece of TBEST and WA after its last: a piece with a gender
; asks the core next to it to have been seen next to that gender (on that side). GST: 0 it is, 1 not known yet (the
; request waits), 2 seen only with the other; GFC and GFP the core and the piece that decided. Uses j1-j14.
fm_gender:
  jldi j1, 0
  jst j1, j1, GST
  jld j2, j1, TBEST
  jcall find_mid
  jldi j13, MB1
  jcall m_collect
  jldi j1, 0
  jjz j2, fg_done
  jldi j3, 1
  jsub j2, j2, j3
  jldi j3, 3
  jshl j2, j2, j3
  jld j2, j2, MB1               ; the last piece, before WA
  jld j3, j1, WA
  jldi j4, 4
  jcall fg_one
  jldi j1, 0
  jld j2, j1, MB1               ; the first, after WB
  jld j3, j1, WB
  jldi j4, 16
  jjmp fg_one
fg_done:
  jret

; The piece j2 next to the core j3 on the side j4 (4 before, 16 after): GST raised if it asks a gender the core was
; not seen with. Uses j1-j8.
fg_one:
  jldi j1, 0
  jldi j5, 3
  jshl j5, j2, j5
  jld j6, j1, ROOMGN
  jadd j5, j5, j6
  jld j5, j5, 0
  jldi j6, 3
  jand j5, j5, j6               ; its gender
  jjz j5, fo_done
  jldi j6, 3
  jshl j6, j3, j6
  jld j7, j1, ROOMGN
  jadd j6, j6, j7
  jld j6, j6, 0                 ; what the core was seen next to
  jmul j7, j5, j4
  jand j7, j6, j7
  jjnz j7, fo_done
  jldi j7, 3
  jsub j7, j7, j5
  jmul j7, j7, j4
  jand j7, j6, j7
  jldi j8, 1                    ; not known: it waits; seen only with the other: it falls
  jjz j7, fo_raise
  jldi j8, 2
fo_raise:
  jld j7, j1, GST
  jsub j7, j7, j8
  jldi j6, 63
  jsar j7, j7, j6
  jjz j7, fo_done
  jst j8, j1, GST
  jst j3, j1, GFC
  jst j2, j1, GFP
fo_done:
  jret

; The gender of every word (the twins' first difference, a/o): a word of two letters or more ending in a or o, whose
; twin with the other ending is in the book, is of that gender (1 a, 2 o); else of none. By word {its gender, and the
; genders seen next to it as a core: 4 before a, 8 before o, 16 after a, 32 after o} (8 bytes). Uses j1-j14.
genders:
  jldi j1, 0
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMGN
  jldi j2, 2                    ; (a word looked up, never added)
  jst j2, j1, PASS
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ROOMI
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j5, j3, 16
    jld j3, j3, 8
    jld j4, j1, ROOMA
    jadd j3, j3, j4
    jst j5, j1, WLEN
    jldi j6, 2                  ; two letters or more: something the same
    jsub j6, j5, j6
    jldi j7, 63
    jsar j6, j6, j7
    jjnz j6, gn_next
    jadd j6, j3, j5
    jldi j7, 1
    jsub j6, j6, j7
    jldb j6, j6, 0
    jldi j7, 97
    jsub j7, j6, j7
    jldi j8, 1
    jjz j7, gn_end
    jldi j7, 111
    jsub j7, j6, j7
    jldi j8, 2
    jjnz j7, gn_next
  gn_end:
    jst j8, j1, GNG
    jldi j4, 0                  ; its twin: the same, the other ending
    jadd j7, j5, j1
    jwhile j7
      jldb j6, j3, 0
      jstb j6, j4, WBUF
      jldi j6, 1
      jadd j3, j3, j6
      jadd j4, j4, j6
      jsub j7, j7, j6
    jwend
    jldi j6, 1
    jsub j4, j4, j6
    jldb j7, j4, WBUF
    jldi j6, 208
    jsub j6, j6, j7
    jstb j6, j4, WBUF
    jst j9, j1, GNW
    jst j10, j1, GNL
    jcall word_id
    jldi j1, 0
    jld j9, j1, GNW
    jld j10, j1, GNL
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, gn_next
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ROOMGN
    jadd j3, j3, j4
    jld j4, j1, GNG
    jst j4, j3, 0
  gn_next:
    jldi j1, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret

; What the fact WA … WB has next to its cores: the gender of the piece after WA and of the one before WB, marked on
; them. Uses j1-j8.
fl_gender:
  jldi j1, 0
  jld j2, j1, WJ
  jldi j3, 1
  jadd j2, j2, j3
  jld j3, j1, WA
  jldi j4, 16
  jcall fg_mark
  jldi j1, 0
  jld j2, j1, WJ
  jld j3, j1, WM
  jadd j2, j2, j3
  jld j3, j1, WB
  jldi j4, 4
  jjmp fg_mark

; The piece at unit j2 next to the core j3 on side j4: its gender, if it has one, marked on the core. Uses j1-j8.
fg_mark:
  jldi j1, 0
  jldi j5, 3
  jshl j5, j2, j5
  jld j6, j1, ROOMT
  jadd j5, j5, j6
  jld j5, j5, 0
  jldi j6, 3
  jshl j5, j5, j6
  jld j6, j1, ROOMGN
  jadd j5, j5, j6
  jld j5, j5, 0
  jldi j6, 3
  jand j5, j5, j6
  jjz j5, fk2_done
  jmul j5, j5, j4
  jldi j6, 3
  jshl j6, j3, j6
  jld j7, j1, ROOMGN
  jadd j6, j6, j7
  jld j7, j6, 0
  jor j7, j7, j5
  jst j7, j6, 0
fk2_done:
  jret

; j6 = 1 if the skeleton at WSK has two pairs or more (a written one keeps them negative). Uses j1, j6, j7.
fm_two:
  jldi j1, 0
  jld j7, j1, WSK
  jld j6, j7, 8
  jldi j7, 63
  jsar j7, j6, j7
  jjz j7, ft_pos
  jldi j7, 0
  jsub j6, j7, j6
ft_pos:
  jldi j7, 2
  jsub j6, j6, j7
  jldi j7, 63
  jsar j6, j6, j7
  jldi j7, 1
  jadd j6, j6, j7
  jret

; j2 written, and into j0. Uses j1-j4, j12-j14.
putmix:
  jldi j1, 0
  jadd j12, j2, j1
  jcall mix
  jjmp putnum

; The arrows (Capitan, 2026-11-07: the logical silhouette "quién" = "=>"; and "let it discover it"). Every word is
; looked at in the buildings it is in (the text between two limits, the limits the book showed): the limit most of its
; buildings close with is voted (Boyer-Moore: one pass), then counted. A word is an arrow of that limit when the limit
; closes most of the word's buildings, two at least (the anecdote rule), and does not close most of the book's: the
; word lives where the book rarely is. No limit and no word is named: the question words come out of the book. Uses
; j1-j14.
arrows:
  jldi j1, 0
  jld j11, j1, NV
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMAR
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMCN
  jst j1, j1, NBLD
  jldi j2, 1
  jst j2, j1, AMODE
  jcall ar_walk
  jldi j1, 0                    ; the voted limit, now counted
  jld j10, j1, NV
  jld j9, j1, ROOMAR
  jwhile j10
    jst j1, j9, 16
    jldi j2, 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j2, 2
  jst j2, j1, AMODE
  jcall ar_walk
  jldi j1, S_ARROW              ; written, the most said first
  jcall puts
  jldi j2, 0
  jst j2, j1, FI2
  ar_print:
    jldi j1, 0
    jldi j11, 0                 ; the arrow not written yet that is said the most
    jldi j12, 0
    jldi j9, 1
    jld j10, j1, NV
    jldi j2, 1
    jsub j10, j10, j2
    jwhile j10
      jldi j1, 0
      jadd j2, j9, j1
      jst j9, j1, FI3
      jst j10, j1, FI4
      jcall is_arrow
      jldi j1, 0
      jld j9, j1, FI3
      jld j10, j1, FI4
      jjz j2, arp_next
      jldi j3, 24
      jmul j3, j9, j3
      jld j4, j1, ROOMAR
      jadd j3, j3, j4
      jld j4, j3, 16
      jsub j5, j11, j4
      jldi j6, 63
      jsar j5, j5, j6
      jjz j5, arp_next
      jadd j11, j4, j1
      jadd j12, j9, j1
    arp_next:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j12, arp_done
    jldi j3, 24                 ; written: the word, its limit, how many of its buildings
    jmul j3, j12, j3
    jld j4, j1, ROOMAR
    jadd j3, j3, j4
    jst j3, j1, FI4
    jldi j2, 32
    jcall putch
    jadd j2, j12, j1
    jcall putword
    jldi j2, 40
    jcall putch
    jld j3, j1, FI4
    jld j2, j3, 8
    jcall putword
    jldi j2, 32
    jcall putch
    jld j3, j1, FI4
    jld j2, j3, 16
    jcall putnum
    jldi j2, 47
    jcall putch
    jld j3, j1, FI4
    jld j2, j3, 0
    jcall putnum
    jldi j2, 41
    jcall putch
    jldi j1, 0
    jld j3, j1, FI4             ; (not again: its count goes negative, it is no arrow while it is written)
    jld j2, j3, 16
    jldi j4, 0
    jsub j2, j4, j2
    jst j2, j3, 16
    jld j2, j1, FI2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FI2
    jldi j3, 20                 ; (twenty written: criterion, the report's size; the rest stay arrows)
    jsub j2, j2, j3
    jjnz j2, ar_print
arp_done:
  jldi j1, 0                    ; the written ones back to their count
  jld j10, j1, NV
  jld j9, j1, ROOMAR
  jwhile j10
    jld j2, j9, 16
    jldi j3, 63
    jsar j3, j2, j3
    jjz j3, arb_next
    jldi j3, 0
    jsub j2, j3, j2
    jst j2, j9, 16
  arb_next:
    jldi j2, 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j2, 10
  jcall putch
  jjmp flush

; Every building of the book (its units from a limit to the next one; a renglon's end is no limit), each word in it
; with the limit that closes it: voted (AMODE 1, and the buildings and each limit's counted), or counted when it is
; the word's voted limit (2). Uses j1-j14.
ar_walk:
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, AST
  jldi j9, 1
  jld j10, j1, NTOK
  jldi j2, 1
  jsub j10, j10, j2
  jldi j3, 63                   ; (fewer units than one: nothing to walk)
  jsar j3, j10, j3
  jldi j4, -1
  jxor j3, j3, j4
  jand j10, j10, j3
  jwhile j10
    jldi j1, 0
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jjz j2, aw_next
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMCL
    jadd j3, j3, j4
    jld j3, j3, 0
    jjz j3, aw_next
    jst j9, j1, FI3             ; a limit: the building before it closes with it
    jst j10, j1, FI4
    jst j2, j1, KPT
    jld j5, j1, AST
    jsub j6, j9, j5
    jjz j6, aw_closed
    jld j6, j1, AMODE
    jldi j7, 1
    jsub j6, j6, j7
    jjnz j6, aw_words
    jld j6, j1, NBLD
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j1, NBLD
    jldi j6, 3
    jshl j6, j2, j6
    jld j7, j1, ROOMCN
    jadd j6, j6, j7
    jld j7, j6, 0
    jldi j8, 1
    jadd j7, j7, j8
    jst j7, j6, 0
  aw_words:
    jldi j1, 0
    jld j5, j1, AST
    jld j9, j1, FI3
    jsub j6, j9, j5
    jjz j6, aw_closed
    jldi j2, 3
    jshl j2, j5, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jldi j3, 1
    jadd j5, j5, j3
    jst j5, j1, AST
    jjz j2, aw_words
    jst j2, j1, PMT
    jcall w_mark                ; (a word: the marks are no arrows)
    jjnz j3, aw_words
    jldi j1, 0
    jld j2, j1, PMT
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMAR
    jadd j3, j3, j4
    jld j4, j1, KPT
    jld j5, j1, AMODE
    jldi j6, 1
    jsub j5, j5, j6
    jjnz j5, aw_count
    jld j6, j3, 0               ; voted: one building more, and the vote
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j3, 0
    jld j6, j3, 16
    jjnz j6, aw_vote
    jst j4, j3, 8
    jst j7, j3, 16
    jjmp aw_words
  aw_vote:
    jld j8, j3, 8
    jsub j8, j8, j4
    jjnz j8, aw_against
    jadd j6, j6, j7
    jst j6, j3, 16
    jjmp aw_words
  aw_against:
    jsub j6, j6, j7
    jst j6, j3, 16
    jjmp aw_words
  aw_count:
    jld j6, j3, 8
    jsub j6, j6, j4
    jjnz j6, aw_words
    jld j6, j3, 16
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j3, 16
    jjmp aw_words
  aw_closed:
    jldi j1, 0
    jld j9, j1, FI3
    jld j10, j1, FI4
    jldi j2, 1
    jadd j2, j9, j2
    jst j2, j1, AST
  aw_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret

; j2 = 1 if word j2 is an arrow: its voted limit closes most of its buildings, two at least, and not most of the book's.
; Uses j1-j6.
is_arrow:
  jldi j1, 0
  jld j3, j1, ROOMAR
  jjz j3, ia_no
  jldi j4, 24
  jmul j4, j2, j4
  jadd j3, j3, j4
  jld j4, j3, 16                ; how many of its buildings close with it
  jldi j5, 2
  jsub j5, j4, j5
  jldi j6, 63
  jsar j5, j5, j6
  jjnz j5, ia_no
  jadd j5, j4, j4
  jld j6, j3, 0
  jsub j5, j6, j5
  jldi j6, 63
  jsar j5, j5, j6
  jjz j5, ia_no
  jld j4, j3, 8                 ; and the limit closes fewer than half the book's buildings
  jldi j5, 3
  jshl j4, j4, j5
  jld j5, j1, ROOMCN
  jadd j4, j4, j5
  jld j4, j4, 0
  jadd j4, j4, j4
  jld j5, j1, NBLD
  jsub j4, j4, j5
  jldi j6, 63
  jsar j4, j4, j6
  jjz j4, ia_no
  jldi j2, 1
  jret
ia_no:
  jldi j2, 0
  jret

; A question (QQS to QQE in QBUF): every core in it (a word the house left as furniture, as the cores of the facts)
; asked the facts it is in, and of those only the ones whose relation fits the question: the middle of the fact's
; skeleton is said in the question right next to the core, on the side the fact has it (its marks aside). The answer
; is the fact's other core, if the question does not say it already: said so by the book (4), or deduced from a
; skeleton that turns (5), with its why. Nothing tells it which word asks: the question's own furniture and the
; relations the book proved decide. Uses j1-j14.
question_one:
  jldi j1, S_ASKQ
  jcall puts
  jld j9, j1, QQS
  qo_put:
    jldi j1, 0
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, qo_said
    jldi j2, 3
    jshl j2, j9, j2
    jld j2, j2, QBUF
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, qo_skip
    jst j9, j1, QP
    jcall putword
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j9, j1, QP
  qo_skip:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qo_put
  qo_said:
  jldi j2, 10
  jcall putch
  jldi j1, 0
  jst j1, j1, QNA
  jst j1, j1, QBEST
  jst j1, j1, QPASS
qo_pass:
  jldi j2, TSN                  ; (each answer once)
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jld j9, j1, QQS
  qo_core:
    jldi j1, 0
    jst j9, j1, QP
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, qo_cores
    jldi j2, 3
    jshl j2, j9, j2
    jld j2, j2, QBUF
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, qo_ncore
    jst j2, j1, QCW
    jcall g_core
    jjz j3, qo_ncore
    jldi j1, 0                  ; an arrow is no furniture: it points at what is asked
    jld j2, j1, QCW
    jcall is_arrow
    jjnz j2, qo_ncore
    jldi j1, 0
    jldi j2, 4
    jst j2, j1, GMODE
    jcall gather
    jldi j1, 0
    jldi j2, 5
    jst j2, j1, GMODE
    jcall gather
  qo_ncore:
    jldi j1, 0
    jld j9, j1, QP
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qo_core
  qo_cores:
  jld j2, j1, QPASS             ; the relation that fits it best is the one that explains the most of it (Capitan:
  jjnz j2, qo_said2             ; "the logical relation that fits the question"): first how much that is, then those
  jldi j2, 1
  jst j2, j1, QPASS
  jjmp qo_pass
qo_said2:
  jld j2, j1, QNA
  jjnz j2, qo_done
  jldi j1, S_NOFIT
  jcall puts
qo_done:
  jldi j1, 0
  jret

; The window WA WK WB met by a core of a question (GMODE 4: what the book says; 5: what it deduces). Uses j1-j14.
q_meet:
  jcall fm_two
  jldi j1, 0
  jjz j6, qm_done
  jld j2, j1, GMODE
  jldi j3, 4
  jsub j3, j2, j3
  jjnz j3, qm_turned
  jld j12, j1, WSK              ; said: the core at its end of the fact
  jld j2, j1, WB
  jld j3, j1, QCW
  jsub j2, j2, j3
  jldi j4, 0
  jjnz j2, qm_side
  jldi j4, 1
qm_side:
  jst j4, j1, QSIDE
  jld j2, j1, WA
  jjz j4, qm_oth
  jjmp qm_oth2
qm_oth:
  jld j2, j1, WB
qm_oth2:
  jst j2, j1, QOTH
  jcall q_fit
  jjz j2, qm_done
  jcall q_best
  jjz j2, qm_done
  jcall q_new
  jjz j2, qm_done
  jldi j1, S_SAIDQ
  jcall puts
  jld j2, j1, WA
  jcall putword
  jldi j2, 32
  jcall putch
  jld j12, j1, WSK
  jcall put_mid
  jld j2, j1, WB
  jcall putword
  jldi j2, 41
  jcall putch
  jldi j2, 10
  jcall putch
  jjmp flush
qm_turned:
  jld j2, j1, WSK               ; deduced: the skeleton that turns, its fact turned (WB «TBEST» WA)
  jst j2, j1, FE
  jldi j12, 1
  jcall best_partner
  jldi j1, 0
  jld j2, j1, TBEST
  jjz j2, qm_done
  jcall find_mid
  jldi j1, 0
  jld j2, j1, WA                ; the core's side in the turned fact
  jld j3, j1, QCW
  jsub j2, j2, j3
  jldi j4, 0
  jjnz j2, qt_side
  jldi j4, 1
qt_side:
  jst j4, j1, QSIDE
  jld j2, j1, WB
  jjz j4, qt_oth
  jjmp qt_oth2
qt_oth:
  jld j2, j1, WA
qt_oth2:
  jst j2, j1, QOTH
  jcall q_fit
  jjz j2, qm_done
  jcall q_best
  jjz j2, qm_done
  jcall q_new
  jjz j2, qm_done
  jldi j1, S_DEDQ
  jcall puts
  jld j2, j1, WB
  jcall putword
  jldi j2, 32
  jcall putch
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jld j2, j1, WA
  jcall putword
  jldi j1, S_BEC
  jcall puts
  jld j12, j1, WSK
  jcall put_mid
  jldi j1, S_BTURN
  jcall puts
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jldi j2, 41
  jcall putch
  jldi j2, 10
  jcall putch
  jjmp flush
qm_done:
  jret

; j2 = 1 if the fact's relation fits the question as instructions (Capitan, 2026-11-07: "the words are hidden
; instructions: solve the order with logic"). Each word of the middle says what it hooks to, and the order is not
; asked, the hooks are: every word of the middle (its marks aside) is in the question; the one next to the core in the
; fact is next to the core in the question, on either side; and the one next to the other core has, on a side, a free
; place: an arrow, the question's edge, or a piece that is no furniture. A middle with an arrow in it answers nothing:
; it says the question again. QCV: the core and the middle's words. Uses j1-j14.
q_fit:
  jldi j13, MB1
  jcall m_collect
  jldi j1, 0                    ; the middle's words, the marks out (in place)
  jst j2, j1, FI3
  jst j1, j1, FI2
  jst j1, j1, FI4
  qf_words:
    jldi j1, 0
    jld j2, j1, FI4
    jld j3, j1, FI3
    jsub j3, j2, j3
    jjz j3, qf_counted
    jldi j3, 3
    jshl j3, j2, j3
    jld j2, j3, MB1
    jst j2, j1, QWL
    jcall w_mark
    jldi j1, 0
    jjnz j3, qf_wnext
    jld j2, j1, QWL
    jcall is_arrow
    jjnz j2, qf_no
    jld j2, j1, FI2
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, QWL
    jst j4, j3, MB1
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FI2
  qf_wnext:
    jld j2, j1, FI4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FI4
    jjmp qf_words
qf_counted:
  jld j2, j1, FI2
  jjz j2, qf_no                 ; (marks alone hook nothing)
  jldi j3, 1
  jadd j3, j2, j3
  jst j3, j1, QCV
  jst j1, j1, FI4               ; every word of the middle in the question
  qf_each:
    jldi j1, 0
    jld j2, j1, FI4
    jld j3, j1, FI2
    jsub j3, j2, j3
    jjz j3, qf_hooks
    jldi j3, 3
    jshl j3, j2, j3
    jld j2, j3, MB1
    jcall q_has
    jjz j2, qf_no
    jldi j1, 0
    jld j2, j1, FI4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FI4
    jjmp qf_each
qf_hooks:
  jld j2, j1, FI2               ; the words next to each core in the fact: the core's on its side, the other's opposite
  jldi j3, 1
  jsub j2, j2, j3
  jldi j3, 3
  jshl j2, j2, j3
  jld j4, j2, MB1               ; (the last)
  jld j5, j1, MB1               ; (the first)
  jld j6, j1, QSIDE
  jjz j6, qf_left
  jst j4, j1, QBC               ; the core on the right: the last word hooks to it, the first to the other
  jst j5, j1, QBA
  jjmp qf_core
qf_left:
  jst j5, j1, QBC
  jst j4, j1, QBA
qf_core:
  jld j2, j1, QP                ; the core's hook: next to it in the question, either side
  jldi j3, -1
  jcall q_nb
  jjz j2, qf_cright
  jldi j1, 0
  jld j3, j1, QBC
  jsub j2, j2, j3
  jjz j2, qf_other
qf_cright:
  jldi j1, 0
  jld j2, j1, QP
  jldi j3, 1
  jcall q_nb
  jjz j2, qf_no
  jldi j1, 0
  jld j3, j1, QBC
  jsub j2, j2, j3
  jjnz j2, qf_no
qf_other:
  jldi j1, 0                    ; the other's hook: a place of it in the question with a free side
  jld j2, j1, QQS
  jst j2, j1, QPOS
  qf_place:
    jldi j1, 0
    jld j9, j1, QPOS
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, qf_no
    jldi j2, 3
    jshl j2, j9, j2
    jld j2, j2, QBUF
    jld j3, j1, QBA
    jsub j2, j2, j3
    jjnz j2, qf_pnext
    jld j3, j1, QP
    jsub j3, j9, j3
    jjz j3, qf_pnext
    jldi j2, -1
    jst j2, j1, QDIR
    qf_side:
      jldi j1, 0
      jld j2, j1, QPOS
      jld j3, j1, QDIR
      jcall q_nb
      jldi j1, 0
      jjz j2, qf_yes            ; (the edge: free)
      jst j2, j1, QNB
      jld j3, j1, QP            ; (the core's own place is not free)
      jld j4, j1, QNBP
      jsub j3, j3, j4
      jjz j3, qf_snext
      jld j2, j1, QNB
      jcall is_arrow
      jjnz j2, qf_yes
      jldi j1, 0
      jld j2, j1, QNB
      jcall g_core
      jjz j3, qf_yes            ; (no furniture: free)
    qf_snext:
      jldi j1, 0
      jld j2, j1, QDIR
      jldi j3, 1
      jsub j3, j2, j3
      jjz j3, qf_pnext
      jldi j2, 1
      jst j2, j1, QDIR
      jjmp qf_side
  qf_pnext:
    jldi j1, 0
    jld j9, j1, QPOS
    jldi j2, 1
    jadd j9, j9, j2
    jst j9, j1, QPOS
    jjmp qf_place
qf_yes:
  jldi j1, 0
  jldi j2, 1
  jret
qf_no:
  jldi j1, 0
  jldi j2, 0
  jret

; From the question's place j2, the nearest piece on side j3 (-1 before, 1 after) that is a word (no mark, no hole)
; -> j2 its word (its place at QNBP), 0 at the question's edge. Uses j1-j8.
q_nb:
  jldi j1, 0
  jst j3, j1, QNBD
  qnb_lap:
    jldi j1, 0
    jld j3, j1, QNBD
    jadd j2, j2, j3
    jld j4, j1, QQS
    jsub j4, j2, j4
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, qnb_edge
    jld j4, j1, QQE
    jsub j4, j2, j4
    jjz j4, qnb_edge
    jst j2, j1, QNBP
    jldi j3, 3
    jshl j3, j2, j3
    jld j3, j3, QBUF
    jldi j4, 1
    jsub j4, j3, j4
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, qnb_skip
    jst j3, j1, QNBW
    jadd j2, j3, j1
    jcall w_mark
    jldi j1, 0
    jjnz j3, qnb_skip2
    jld j2, j1, QNBW
    jret
  qnb_skip2:
    jld j2, j1, QNBP
    jjmp qnb_lap
  qnb_skip:
    jld j2, j1, QNBP
    jjmp qnb_lap
qnb_edge:
  jldi j1, 0
  jldi j2, 0
  jret

; j2 = 1 if the word j2 is said in the question. Uses j1-j5.
q_has:
  jldi j1, 0
  jld j3, j1, QQS
  qh_lap:
    jld j4, j1, QQE
    jsub j4, j3, j4
    jjz j4, qh_no
    jldi j4, 3
    jshl j4, j3, j4
    jld j4, j4, QBUF
    jsub j4, j4, j2
    jjz j4, qh_yes
    jldi j4, 1
    jadd j3, j3, j4
    jjmp qh_lap
qh_yes:
  jldi j2, 1
  jret
qh_no:
  jldi j2, 0
  jret

; j2 = 1 if the fit just found (QCV) is to be said: in the first pass it only raises the most (QBEST) and is not said;
; in the second, it is said when it explains that much. Uses j1-j3.
q_best:
  jldi j1, 0
  jld j2, j1, QCV
  jld j3, j1, QPASS
  jjnz j3, qb_say
  jld j3, j1, QBEST
  jsub j3, j3, j2
  jldi j1, 63
  jsar j3, j3, j1
  jldi j1, 0
  jjz j3, qb_no
  jst j2, j1, QBEST
qb_no:
  jldi j2, 0
  jret
qb_say:
  jld j3, j1, QBEST
  jsub j2, j2, j3
  jldi j3, 1
  jjz j2, qb_yes
  jldi j3, 0
qb_yes:
  jadd j2, j3, j1
  jret

; j2 = 1 if QOTH is a new answer: not a word of the question, and not given yet (written then: "  -> " and it). Uses
; j1-j14.
q_new:
  jldi j1, 0
  jld j9, j1, QQS
  qn_lap:
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, qn_new
    jldi j2, 3
    jshl j2, j9, j2
    jld j2, j2, QBUF
    jld j3, j1, QOTH
    jsub j2, j2, j3
    jjz j2, qn_no
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qn_lap
qn_new:
  jld j5, j1, QOTH
  jjz j5, qn_no
  jldi j2, TSN
  jcall pl_take
  jjz j6, qn_no
  jldi j1, 0
  jld j2, j1, QNA
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, QNA
  jldi j1, S_ANS
  jcall puts
  jld j2, j1, QOTH
  jcall putword
  jldi j1, 0
  jldi j2, 1
  jret
qn_no:
  jldi j1, 0
  jldi j2, 0
  jret

include 'crece.inc'
include 'casa.inc'
include 'pulso.inc'
include 'organo.inc'
include 'negacion.inc'
include 'lectura.inc'
