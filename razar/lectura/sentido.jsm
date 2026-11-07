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
S_SILS  = 8C0h                  ; "siluetas", and what was taken from it
S_SILT  = 900h
S_SILA  = 940h
S_COME  = 980h                  ; eating: "come", the library's label of the skeletons, what it says
S_ESQ   = 9C0h
S_ESQD  = 0A00h
S_LIBP  = 0A40h                 ; ", pairs proved in the library"
S_QAN   = 0A80h                 ; the book's questions, and those with a core in the answer next to them
S_QAM   = 0AC0h

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
SILR  = 1D98h                   ; the library's silhouettes (pistas.inc writes them): the file read, its bytes, the
SILN  = 1DA0h                   ; room's bytes, its handle; by word, 1 arrow, 2 not (0: the piece decides); words taken,
SILC  = 1DA8h                   ; arrows among them; walking; the reading's pass kept
SILH  = 1DB0h
ROOMAX = 1DB8h
SILNW = 1DC0h
SILNA = 1DC8h
SILP  = 1DD0h
SILPS = 1DD8h
EATON = 1DE0h                   ; eating a book (the address in "come"): 1 if so; the address's room and bytes; the print
EATP  = 1DE8h                   ; of its bytes; the file written, its bytes, where it writes; walking; relations kept
EATN  = 1DF0h
EATH  = 1DF8h
EOUT  = 1E00h
EOSZ  = 1E08h
EPOS  = 1E10h
EI    = 1E18h
ECNT  = 1E20h
EHND  = 1E28h
ELAB  = 1E30h
ET1   = 1E38h
ET2   = 1E40h
EBUF  = 1E48h                   ; (three pieces of a middle, then three of the other: 6 qwords)
EN2   = 1E78h                   ; the other middle's pieces; a piece walked
EK    = 1E80h
SXR   = 0B00h                   ; the library's turns: a file read whole (room, bytes, room's bytes, handle); the folder's
SXN   = 0B08h                   ; labels (room, how many, room's bytes); by two skeletons' prints {key, pairs summed, the
SXC   = 0B10h                   ; other's pieces, how many, this one's print} (a growing table); by skeleton's print its
SXH   = 0B18h                   ; best turn {print, pairs, the other's pieces, how many}; walking; a middle's pieces
LSTR  = 0B20h
LSTN  = 0B28h
LSTC  = 0B30h
LREL  = 0B40h
LBEST = 0B60h
LP    = 0B80h
LI    = 0B88h
LT1   = 0B90h
LT2   = 0B98h
LT3   = 0BA0h
LT4   = 0BA8h
LNR   = 0BB0h
LPB   = 0BB8h
LPC   = 0BC0h                   ; (three pieces)
LPP   = 0BD8h                   ; the turn's pairs
SBB   = 0BE0h                   ; the turns in bits: the stream's first byte, the bit it is at, its bytes (reading)
SBP   = 0BE8h
SBL   = 0CA8h
DTAB  = 0BF0h                   ; the pieces' dictionary: by letters {key, its index + 1} (a growing table), each
DLST  = 0C10h                   ; index's piece, how many, the bits of an index; walking; the relations, the room
DNP   = 0C18h                   ; written and its bytes, where it writes, the bit where the relations start; gamma's
DAB   = 0C20h                   ; number and its bits; the book's print unsalted; a relation {turned, pairs, the
DT1   = 0C28h                   ; pieces of each middle}
DT2   = 0C30h
DT3   = 0C38h
DT4   = 0C40h
DNR   = 0C78h
DOUT  = 0C48h
DSZ   = 0C50h
DPOS  = 0CA0h
DSV   = 0C58h
SGV   = 0C60h
SGN   = 0C68h
EATB  = 0C70h
DR0   = 0C80h
DR1   = 0C88h
DR2   = 0C90h
DR3   = 0C98h
QAS   = 0CB0h                   ; the book's questions: the building before (its start, its end, 1 if it asks), the one
QAE   = 0CB8h                   ; walked starts at, how many questions, how many with a core in the answer next to them;
QAQ   = 0CC0h                   ; walking
QAT   = 0CC8h
QAN   = 0CD0h
QAM   = 0CD8h
QAI   = 0CE0h
QAX   = 0CE8h
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

jcall eat_mode                  ; a book to eat, if "come" names one: read there, and its skeletons kept for every Razar
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
jcall sil_load                  ; over a piece read again, the library's silhouettes, if they came (the console): read
                                ; with them before a fact is learned
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
jldi j1, 0                      ; eaten: what it proved between skeletons goes to the library, and nothing is asked
jld j2, j1, EATON
jjz j2, not_eating
jcall eat_write
jjmp finish
not_eating:

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
jcall qa_count                  ; the book's own questions, and the answers next to them
jcall lib_load                  ; the turns every book proved (sentido eating), summed: what a piece cannot prove
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

; The book's own questions (Capitan, 2026-11-07: "study the questions with the structure they were made with in the
; books and infer the answer"): a building is a question when an arrow of it is closed by the arrow's own limit (both
; found in the book, none named); the building right after it is where the book answers. Counted: the questions, and
; those whose answer next to them says a core of the question again (what it can learn from). Uses j1-j14.
qa_count:
  jldi j1, 0
  jst j1, j1, QAN
  jst j1, j1, QAM
  jst j1, j1, QAQ
  jldi j2, 1
  jst j2, j1, QAT
  jldi j9, 1
  qa_lap:
    jldi j1, 0
    jld j2, j1, NTOK
    jsub j2, j9, j2
    jjz j2, qa_done
    jst j9, j1, QAI
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jjz j2, qa_next
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMCL
    jadd j3, j3, j4
    jld j3, j3, 0
    jjz j3, qa_next
    jst j2, j1, QAX             ; a limit: the building QAT to here closes with it
    jld j5, j1, QAT
    jsub j6, j9, j5
    jjz j6, qa_empty
    jld j2, j1, QAQ             ; the one before asked: this one answers it
    jjz j2, qa_ask
    jld j2, j1, QAN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QAN
    jcall qa_shared
    jldi j1, 0
    jjz j2, qa_ask
    jld j2, j1, QAM
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QAM
  qa_ask:
    jcall qa_asks               ; does this one ask?
    jldi j1, 0
    jst j2, j1, QAQ
    jld j2, j1, QAT
    jst j2, j1, QAS
    jld j2, j1, QAI
    jst j2, j1, QAE
  qa_empty:
    jldi j1, 0
    jld j2, j1, QAI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QAT
  qa_next:
    jldi j1, 0
    jld j9, j1, QAI
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qa_lap
qa_done:
  jldi j1, S_QAN
  jcall puts
  jld j2, j1, QAN
  jcall putnum
  jldi j1, S_QAM
  jcall puts
  jld j2, j1, QAM
  jcall putnum
  jldi j2, 10
  jcall putch
  jjmp flush

; j2 = 1 if the building QAT to QAI, closed by limit QAX, asks: an arrow of it whose voted limit is QAX. Uses j1-j8.
qa_asks:
  jldi j1, 0
  jld j9, j1, QAT
  qas_lap:
    jldi j1, 0
    jld j2, j1, QAI
    jsub j2, j9, j2
    jjz j2, qas_no
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jjz j2, qas_next
    jst j2, j1, PMT
    jcall is_arrow
    jldi j1, 0
    jjz j2, qas_next
    jld j2, j1, PMT
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMAR
    jadd j3, j3, j4
    jld j3, j3, 8
    jld j4, j1, QAX
    jsub j3, j3, j4
    jjnz j3, qas_next
    jldi j2, 1
    jret
  qas_next:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qas_lap
qas_no:
  jldi j1, 0
  jldi j2, 0
  jret

; j2 = 1 if a core of the building QAT to QAI (furniture) is a core of the question before it (QAS to QAE) too. Uses
; j1-j8, j9 kept.
qa_shared:
  jldi j1, 0
  jld j7, j1, QAT
  qsh_lap:
    jldi j1, 0
    jld j2, j1, QAI
    jsub j2, j7, j2
    jjz j2, qsh_no
    jldi j2, 3
    jshl j2, j7, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jst j2, j1, QWL
    jst j7, j1, QNBP
    jcall g_core
    jldi j1, 0
    jld j7, j1, QNBP
    jjz j3, qsh_next
    jld j8, j1, QAS             ; said in the question too?
    qsh_q:
      jld j2, j1, QAE
      jsub j2, j8, j2
      jjz j2, qsh_next
      jldi j2, 3
      jshl j2, j8, j2
      jld j3, j1, ROOMT
      jadd j2, j2, j3
      jld j2, j2, 0
      jld j3, j1, QWL
      jsub j2, j2, j3
      jjz j2, qsh_yes
      jldi j2, 1
      jadd j8, j8, j2
      jjmp qsh_q
  qsh_next:
    jldi j2, 1
    jadd j7, j7, j2
    jjmp qsh_lap
qsh_yes:
  jldi j1, 0
  jldi j2, 1
  jret
qsh_no:
  jldi j1, 0
  jldi j2, 0
  jret

; j2 = 1 if word j2 is an arrow: its voted limit closes most of its buildings, two at least, and not most of the book's.
; Uses j1-j6.
is_arrow:
  jldi j1, 0
  jld j3, j1, ROOMAX            ; the library's decision first, when it gave one
  jjz j3, ia_piece
  jldi j4, 3
  jshl j4, j2, j4
  jadd j3, j3, j4
  jld j3, j3, 0
  jjz j3, ia_piece
  jldi j4, 1
  jsub j3, j3, j4
  jjnz j3, ia_no
  jldi j2, 1
  jret
ia_piece:
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

; The silhouettes of reading the library left for this piece (Capitan: "the reading rules must not be lost, they must
; be enriched"): a piece read again is too little to learn to read it, so what every book eaten taught decides for the
; words it knows: the house (ROOMSD) and the arrows (ROOMAX). The file "siluetas" {its bytes, its letters padded, the
; house, an arrow} (pistas.inc), if there is one. Uses j1-j14.
sil_load:
  jldi j1, 0
  jst j1, j1, SILNW
  jst j1, j1, SILNA
  jldi j10, 4
  jldi j11, S_SILS
  jldi j12, 8
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, sl_done
  jst j13, j1, SILH
  jst j1, j1, SILN
  jldi j11, 4096
  jst j11, j1, SILC
  jcall room
  jldi j1, 0
  jst j13, j1, SILR
sl_read:
  jld j10, j1, SILH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, SILR
  jld j2, j1, SILN
  jadd j11, j11, j2
  jld j12, j1, SILC
  jsub j12, j12, j2
  jcall ask
  jldi j1, 0
  jldi j2, 1
  jsub j2, j13, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, sl_close
  jld j2, j1, SILN
  jadd j2, j2, j13
  jst j2, j1, SILN
  jld j3, j1, SILC
  jsub j3, j3, j2
  jjnz j3, sl_read
  jld j11, j1, SILC             ; full: twice the room, what it holds copied
  jadd j11, j11, j11
  jcall room
  jldi j1, 0
  jld j4, j1, SILR
  jadd j5, j13, j1
  jld j6, j1, SILN
  jwhile j6
    jld j7, j4, 0
    jst j7, j5, 0
    jldi j7, 8
    jadd j4, j4, j7
    jadd j5, j5, j7
    jsub j6, j6, j7
  jwend
  jst j13, j1, SILR
  jld j2, j1, SILC
  jadd j2, j2, j2
  jst j2, j1, SILC
  jjmp sl_read
sl_close:
  jld j10, j1, SILH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j2, j1, SILN
  jjnz j2, sl_some
  jldi j10, 12                  ; (nothing there: the empty file opening made goes)
  jldi j11, S_SILS
  jldi j12, 8
  jcall ask
  jjmp sl_done
sl_some:
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMAX
  jld j2, j1, PASS
  jst j2, j1, SILPS
  jldi j2, 2                    ; (a word looked for, never added)
  jst j2, j1, PASS
  jld j2, j1, SILR
  jst j2, j1, SILP
  sl_word:
    jldi j1, 0
    jld j9, j1, SILP
    jld j2, j1, SILR
    jsub j2, j9, j2
    jld j3, j1, SILN
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, sl_words
    jld j4, j9, 0               ; its letters, as a word being read
    jst j4, j1, WLEN
    jldi j5, 8
    jadd j5, j9, j5
    jldi j6, 0
    sl_letter:
      jsub j7, j6, j4
      jjz j7, sl_letters
      jadd j7, j5, j6
      jldb j7, j7, 0
      jstb j7, j6, WBUF
      jldi j7, 1
      jadd j6, j6, j7
      jjmp sl_letter
    sl_letters:
    jcall word_id
    jldi j1, 0
    jld j9, j1, SILP
    jld j4, j9, 0
    jldi j5, 7
    jadd j4, j4, j5
    jldi j5, -8
    jand j4, j4, j5
    jldi j5, 8
    jadd j4, j4, j5
    jadd j9, j9, j4             ; its house and its arrow
    jld j5, j9, 0
    jld j6, j9, 8
    jldi j7, 16
    jadd j7, j9, j7
    jst j7, j1, SILP
    jldi j7, 1
    jsub j7, j2, j7
    jldi j8, 63
    jsar j7, j7, j8
    jjnz j7, sl_word            ; (a word this piece never read)
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ROOMSD
    jadd j4, j4, j3
    jst j5, j4, 0
    jld j4, j1, ROOMAX
    jadd j4, j4, j3
    jldi j7, 2
    jjz j6, sl_mark
    jldi j7, 1
    jld j8, j1, SILNA
    jadd j8, j8, j7
    jst j8, j1, SILNA
  sl_mark:
    jst j7, j4, 0
    jld j8, j1, SILNW
    jldi j7, 1
    jadd j8, j8, j7
    jst j8, j1, SILNW
    jjmp sl_word
  sl_words:
  jld j2, j1, SILPS
  jst j2, j1, PASS
  jldi j1, S_SILT               ; said: how many it took, how many arrows
  jcall puts
  jld j2, j1, SILNW
  jcall putnum
  jldi j1, S_SILA
  jcall puts
  jld j2, j1, SILNA
  jcall putnum
  jldi j2, 41
  jcall putch
  jldi j2, 10
  jcall putch
  jcall flush
sl_done:
  jldi j1, 0
  jret

; Eating (Capitan, 2026-11-07: the reading rules are logical silhouettes that are enriched, never lost): the file
; "come" holds a book's address on the host. Then the book is read there (37, read only), and what it proved between
; its skeletons is kept in the library for every Razar: eat_write. Without "come" (or an empty one: the open made it,
; and it goes), nothing changes. Uses j1-j14.
eat_mode:
  jldi j1, 0
  jst j1, j1, EATON
  jldi j10, 4
  jldi j11, S_COME
  jldi j12, 4
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, em_done
  jst j13, j1, EHND
  jldi j11, 4096                ; (an address of the host: the longest is under that)
  jcall room
  jldi j1, 0
  jst j13, j1, EATP
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, EATP
  jldi j12, 4095
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jsar j2, j13, j2
  jldi j3, -1
  jxor j2, j2, j3
  jand j13, j13, j2
  jst j13, j1, EATN
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j3, j1, EATN              ; (without the line feed, spaces or controls after it)
  em_strip:
    jjz j3, em_stripped
    jld j4, j1, EATP
    jadd j4, j4, j3
    jldi j5, 1
    jsub j4, j4, j5
    jldb j5, j4, 0
    jldi j6, 33
    jsub j5, j5, j6
    jldi j6, 63
    jsar j5, j5, j6
    jjz j5, em_stripped
    jldi j4, 1
    jsub j3, j3, j4
    jjmp em_strip
em_stripped:
  jst j3, j1, EATN
  jjnz j3, em_book
  jldi j10, 12
  jldi j11, S_COME
  jldi j12, 4
  jcall ask
  jjmp em_done
em_book:
  jld j2, j1, EATP
  jst j2, j1, LABEL
  jst j3, j1, LABLEN
  jldi j2, 1
  jst j2, j1, HOSTB
  jst j2, j1, EATON
em_done:
  jldi j1, 0
  jret

; What the book proved between its skeletons (TMM: two of them said of the same pairs, turned or not), each with two
; pairs or more (the anecdote rule), into the library: "tablero/esqueletos" + the print of the book's bytes (written
; once, as its pieces: the same book anywhere is one file). Built as qwords {1, how many}, then each {turned, pairs,
; the pieces of one middle, of the other}, then their pieces, each {its bytes, its letters padded}, and written in
; bits (eb_encode); the first format's file of the same book goes. They are counts: they add up over every book.
; Uses j1-j14.
eat_write:
  jldi j1, 0                    ; the print of the book's bytes
  jld j2, j1, FNVO
  jst j2, j1, EATH
  jldi j10, 37
  jld j11, j1, EATP
  jld j12, j1, EATN
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ew_done
  jst j13, j1, EHND
  jldi j11, 1
  jshi j11, 0
  jcall room
  jldi j1, 0
  jst j13, j1, ET1
  ew_read:
    jld j10, j1, EHND
    jldi j2, 32
    jshl j10, j10, j2
    jldi j2, 5
    jor j10, j10, j2
    jld j11, j1, ET1
    jldi j12, 1
    jshi j12, 0
    jcall ask
    jldi j1, 0
    jldi j2, 1
    jsub j2, j13, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, ew_read_end
    jld j2, j1, EATH
    jld j3, j1, ET1
    jld j6, j1, FNVP
    jwhile j13
      jldb j4, j3, 0
      jxor j2, j2, j4
      jmul j2, j2, j6
      jldi j4, 1
      jadd j3, j3, j4
      jsub j13, j13, j4
    jwend
    jst j2, j1, EATH
    jjmp ew_read
ew_read_end:
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j2, j1, EATH              ; (and the format, folded in: 2, in bits)
  jst j2, j1, EATB
  jldi j3, 2
  jxor j2, j2, j3
  jld j3, j1, FNVP
  jmul j2, j2, j3
  jst j2, j1, EATH
  jst j1, j1, ECNT              ; its bytes: every relation proved twice or more, with the letters of both middles
  jldi j2, 16
  jst j2, j1, EOSZ
  jst j1, j1, EOUT
  jcall ew_walk
  jldi j1, 0
  jld j11, j1, EOSZ
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, EOUT
  jldi j2, 1
  jst j2, j13, 0
  jld j2, j1, ECNT
  jst j2, j13, 8
  jldi j2, 16
  jadd j2, j13, j2
  jst j2, j1, EPOS
  jst j1, j1, ECNT
  jcall ew_walk                 ; and written
  jcall eb_encode               ; in bits
  jldi j1, 0
  jldi j11, 64                  ; its label: "tablero/esqueletos" and sixteen hex digits
  jcall room
  jldi j1, 0
  jst j13, j1, ELAB
  jld j5, j1, EATB              ; the first format's file of this book goes: the bits say the same
  jldi j3, 1
  jxor j5, j5, j3
  jld j3, j1, FNVP
  jmul j5, j5, j3
  jcall ew_label
  jldi j10, 12
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jld j5, j1, EATH
  jcall ew_label
  jldi j10, 12
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j10, 4
  jldi j1, 0
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ew_done
  jst j13, j1, EHND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, EOUT
  jld j12, j1, EOSZ
  jcall ask
  jldi j1, 0
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, S_ESQD               ; said: how many it kept
  jcall puts
  jld j2, j1, ECNT
  jcall putnum
  jldi j2, 10
  jcall putch
ew_done:
  jldi j1, 0
  jjmp flush

; Every relation between skeletons (TMM) proved by two pairs or more: counted with its bytes (EOUT 0), or written at
; EPOS (EOUT a room). The pieces of both middles go one after the other at EBUF. Uses j1-j14.
ew_walk:
  jldi j1, 0
  jst j1, j1, EI
  ewk_lap:
    jldi j1, 0
    jld j9, j1, EI
    jld j2, j1, TMMM
    jsub j2, j2, j9
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, ewk_done           ; (past its last place)
    jldi j3, 40
    jmul j3, j9, j3
    jld j2, j1, TMM
    jadd j3, j3, j2
    jst j3, j1, ET2
    jld j2, j3, 0
    jjz j2, ewk_next
    jld j2, j3, 32
    jldi j4, 2
    jsub j2, j2, j4
    jldi j4, 63
    jsar j2, j2, j4
    jjnz j2, ewk_next
    jld j2, j3, 8               ; the first middle's pieces
    jcall find_mid
    jldi j13, EBUF
    jcall m_collect
    jldi j1, 0
    jst j2, j1, ET1
    jjz j2, ewk_next
    jld j3, j1, ET2             ; and the other's, right after
    jld j2, j3, 16
    jcall find_mid
    jldi j1, 0
    jld j13, j1, ET1
    jldi j2, 3
    jshl j13, j13, j2
    jldi j2, EBUF
    jadd j13, j13, j2
    jcall m_collect
    jldi j1, 0
    jst j2, j1, EN2
    jjz j2, ewk_next
    jld j4, j1, ECNT
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j1, ECNT
    jcall ew_entry
  ewk_next:
    jldi j1, 0
    jld j9, j1, EI
    jldi j2, 1
    jadd j9, j9, j2
    jst j9, j1, EI
    jjmp ewk_lap
ewk_done:
  jldi j1, 0
  jret

; One relation (ET2), its pieces at EBUF (ET1 of the first middle, EN2 of the other): its bytes added, or it written.
; Uses j1-j14.
ew_entry:
  jldi j1, 0
  jld j2, j1, EOUT
  jjz j2, ee_count
  jld j4, j1, EPOS              ; written: turned, pairs, how many pieces each
  jld j3, j1, ET2
  jld j2, j3, 24
  jst j2, j4, 0
  jld j2, j3, 32
  jst j2, j4, 8
  jld j2, j1, ET1
  jst j2, j4, 16
  jld j2, j1, EN2
  jst j2, j4, 24
  jldi j2, 32
  jadd j4, j4, j2
  jst j4, j1, EPOS
  jjmp ee_pieces
ee_count:
  jld j3, j1, EOSZ
  jldi j4, 32
  jadd j3, j3, j4
  jst j3, j1, EOSZ
ee_pieces:
  jst j1, j1, EK
  ee_lap:
    jldi j1, 0
    jld j5, j1, EK
    jld j6, j1, ET1
    jld j7, j1, EN2
    jadd j6, j6, j7
    jsub j6, j5, j6
    jjz j6, ee_done
    jldi j6, 3
    jshl j6, j5, j6
    jld j2, j6, EBUF
    jldi j3, 3                  ; its letters
    jshl j3, j2, j3
    jld j4, j1, ROOMI
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j5, j3, 16
    jld j3, j3, 8
    jld j4, j1, ROOMA
    jadd j3, j3, j4
    jld j2, j1, EOUT
    jjz j2, ee_size
    jld j4, j1, EPOS            ; {its bytes, its letters padded}
    jst j5, j4, 0
    jldi j6, 8
    jadd j4, j4, j6
    jadd j6, j5, j1
    jwhile j6
      jldb j7, j3, 0
      jstb j7, j4, 0
      jldi j7, 1
      jadd j3, j3, j7
      jadd j4, j4, j7
      jsub j6, j6, j7
    jwend
  ee_size:
    jldi j6, 7
    jadd j5, j5, j6
    jldi j6, -8
    jand j5, j5, j6
    jldi j6, 8
    jadd j5, j5, j6
    jld j2, j1, EOUT
    jjz j2, ee_add
    jld j4, j1, EPOS
    jadd j4, j4, j5
    jst j4, j1, EPOS
    jjmp ee_next
  ee_add:
    jld j3, j1, EOSZ
    jadd j3, j3, j5
    jst j3, j1, EOSZ
  ee_next:
    jld j5, j1, EK
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j1, EK
    jjmp ee_lap
ee_done:
  jldi j1, 0
  jret

; The label of print j5 at ELAB: "tablero/esqueletos" and sixteen hex digits. Uses j1-j8.
ew_label:
  jldi j1, 0
  jst j5, j1, DT4
  jld j2, j1, ELAB
  jldi j3, S_ESQ
  jldi j4, 18
  ew_lab:
    jldb j5, j3, 0
    jstb j5, j2, 0
    jldi j5, 1
    jadd j2, j2, j5
    jadd j3, j3, j5
    jsub j4, j4, j5
    jjnz j4, ew_lab
  jld j5, j1, DT4
  jld j3, j1, ELAB
  jldi j4, 33
  jadd j3, j3, j4
  jldi j4, 16
  ew_hex:
    jldi j6, 15
    jand j6, j5, j6
    jldi j7, 10
    jsub j7, j6, j7
    jldi j8, 63
    jsar j7, j7, j8
    jldi j8, 48
    jjnz j7, ew_digit
    jldi j8, 87
  ew_digit:
    jadd j6, j6, j8
    jstb j6, j3, 0
    jldi j6, 4
    jshr j5, j5, j6
    jldi j6, 1
    jsub j3, j3, j6
    jsub j4, j4, j6
    jjnz j4, ew_hex
  jret

; The relations written (EOUT, EOSZ bytes: {1, how many}, then each {turned, pairs, how many pieces each} and its
; pieces {bytes, letters padded}) said again in bits: qwords {2, how many, pieces, the bits of an index}, then each
; different piece once (gamma of its bytes + 1, its letters 8 bits each), then each relation: turned (1 bit), gamma
; of its pairs and of each middle's pieces, and its pieces as indexes. A piece the book says a hundred times is
; written once. EOUT and EOSZ are then the bits. Uses j1-j14.
eb_encode:
  jldi j1, 0
  jldi j2, DTAB
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jld j11, j1, EOSZ             ; (a piece takes 16 bytes at least: an index of 8 for each fits)
  jcall room
  jldi j1, 0
  jst j13, j1, DLST
  jst j1, j1, DNP
  jld j9, j1, EOUT              ; each piece, once in the dictionary
  jldi j2, 16
  jadd j9, j9, j2
  jld j2, j1, ECNT
  jst j2, j1, DT2
  ebd_rel:
    jldi j1, 0
    jld j2, j1, DT2
    jjz j2, ebd_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, DT2
    jld j2, j9, 16
    jld j3, j9, 24
    jadd j2, j2, j3
    jst j2, j1, DT3
    jldi j2, 32
    jadd j9, j9, j2
    ebd_piece:
      jldi j1, 0
      jld j2, j1, DT3
      jjz j2, ebd_rel
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, DT3
      jcall ed_key
      jldi j2, DTAB
      jcall pl_take
      jldi j1, 0
      jjz j6, ebd_old
      jld j2, j1, DNP
      jldi j3, 1
      jadd j3, j2, j3
      jst j3, j4, 8
      jst j3, j1, DNP
      jldi j3, 3
      jshl j2, j2, j3
      jld j3, j1, DLST
      jadd j2, j2, j3
      jst j9, j2, 0
    ebd_old:
      jcall ed_next
      jjmp ebd_piece
ebd_done:
  jldi j3, 1                    ; the bits of an index: the fewest that count every piece
  jld j4, j1, DNP
  ebd_ab:
    jldi j5, 1
    jshl j5, j5, j3
    jsub j5, j5, j4
    jldi j6, 63
    jsar j5, j5, j6
    jjz j5, ebd_abok
    jldi j5, 1
    jadd j3, j3, j5
    jjmp ebd_ab
ebd_abok:
  jst j3, j1, DAB
  jld j11, j1, EOSZ             ; the bits never take more than the qwords did
  jldi j2, 64
  jadd j11, j11, j2
  jst j11, j1, DSZ
  jcall room
  jldi j1, 0
  jst j13, j1, DOUT
  jld j2, j1, DSZ
  jadd j3, j13, j1
  jwhile j2
    jst j1, j3, 0
    jldi j4, 8
    jadd j3, j3, j4
    jsub j2, j2, j4
  jwend
  jldi j2, 2
  jst j2, j13, 0
  jld j2, j1, ECNT
  jst j2, j13, 8
  jld j2, j1, DNP
  jst j2, j13, 16
  jld j2, j1, DAB
  jst j2, j13, 24
  jldi j2, 32
  jadd j2, j13, j2
  jst j2, j1, SBB
  jst j1, j1, SBP
  jst j1, j1, DT2               ; the dictionary
  ebw_dict:
    jldi j1, 0
    jld j2, j1, DT2
    jld j3, j1, DNP
    jsub j3, j2, j3
    jjz j3, ebw_rels
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, DLST
    jadd j2, j2, j3
    jld j9, j2, 0
    jld j2, j9, 0
    jldi j3, 1
    jadd j2, j2, j3
    jcall sb_gamma
    jld j2, j9, 0
    jst j2, j1, DT3
    jldi j2, 8
    jadd j2, j9, j2
    jst j2, j1, DT1
    ebw_letter:
      jldi j1, 0
      jld j2, j1, DT3
      jjz j2, ebw_lettered
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, DT3
      jld j4, j1, DT1
      jldb j2, j4, 0
      jadd j4, j4, j3
      jst j4, j1, DT1
      jldi j3, 8
      jcall sb_bits
      jjmp ebw_letter
    ebw_lettered:
    jld j2, j1, DT2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, DT2
    jjmp ebw_dict
ebw_rels:
  jld j9, j1, EOUT              ; the relations
  jldi j2, 16
  jadd j9, j9, j2
  jld j2, j1, ECNT
  jst j2, j1, DT2
  ebw_rel:
    jldi j1, 0
    jld j2, j1, DT2
    jjz j2, ebw_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, DT2
    jld j2, j9, 0
    jjz j2, ebw_t
    jldi j2, 1
  ebw_t:
    jldi j3, 1
    jcall sb_bits
    jld j2, j9, 8
    jcall sb_gamma
    jld j2, j9, 16
    jcall sb_gamma
    jld j2, j9, 24
    jcall sb_gamma
    jld j2, j9, 16
    jld j3, j9, 24
    jadd j2, j2, j3
    jst j2, j1, DT3
    jldi j2, 32
    jadd j9, j9, j2
    ebw_piece:
      jldi j1, 0
      jld j2, j1, DT3
      jjz j2, ebw_rel
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, DT3
      jcall ed_key
      jldi j2, DTAB
      jcall pl_find
      jldi j1, 0
      jld j2, j4, 8
      jldi j3, 1
      jsub j2, j2, j3
      jld j3, j1, DAB
      jcall sb_bits
      jcall ed_next
      jjmp ebw_piece
ebw_done:
  jld j2, j1, SBP
  jldi j3, 7
  jadd j2, j2, j3
  jldi j3, 3
  jshr j2, j2, j3
  jldi j3, 32
  jadd j2, j2, j3
  jst j2, j1, EOSZ
  jld j2, j1, DOUT
  jst j2, j1, EOUT
  jret

; The key of the piece at j9 ({its bytes, its letters}): the print of its letters and its bytes, never 0 -> j5. Uses
; j1, j3-j8.
ed_key:
  jldi j1, 0
  jld j4, j9, 0
  jld j5, j1, FNVO
  jld j6, j1, FNVP
  jldi j3, 8
  jadd j3, j9, j3
  jadd j7, j4, j1
  jwhile j7
    jldb j8, j3, 0
    jxor j5, j5, j8
    jmul j5, j5, j6
    jldi j8, 1
    jadd j3, j3, j8
    jsub j7, j7, j8
  jwend
  jxor j5, j5, j4
  jmul j5, j5, j6
  jjnz j5, edk_done
  jldi j5, 1
edk_done:
  jret

; j9 past the piece at it ({its bytes, its letters padded}). Uses j2, j3.
ed_next:
  jld j2, j9, 0
  jldi j3, 7
  jadd j2, j2, j3
  jldi j3, -8
  jand j2, j2, j3
  jldi j3, 8
  jadd j2, j2, j3
  jadd j9, j9, j2
  jret

; The j3 low bits of j2, the lowest first, onto the stream (SBB, SBP; its bytes start at 0). Uses j1-j8.
sb_bits:
  jldi j1, 0
  sbb_lap:
    jjz j3, sbb_done
    jld j4, j1, SBP
    jldi j5, 3
    jshr j5, j4, j5
    jld j6, j1, SBB
    jadd j5, j5, j6
    jldi j6, 7
    jand j6, j4, j6
    jldi j7, 1
    jand j7, j2, j7
    jshl j7, j7, j6
    jldb j8, j5, 0
    jor j8, j8, j7
    jstb j8, j5, 0
    jldi j7, 1
    jadd j4, j4, j7
    jst j4, j1, SBP
    jshr j2, j2, j7
    jsub j3, j3, j7
    jjmp sbb_lap
sbb_done:
  jret

; j2 (1 or more) in Elias gamma onto the stream: as many 0 as its bits after the first, a 1, those bits. Uses j1-j8.
sb_gamma:
  jldi j1, 0
  jst j2, j1, SGV
  jldi j3, 0
  jldi j4, 1
  sbg_n:
    jadd j5, j3, j4
    jshr j5, j2, j5
    jjz j5, sbg_have
    jadd j3, j3, j4
    jjmp sbg_n
sbg_have:
  jst j3, j1, SGN
  jldi j2, 0
  jcall sb_bits
  jldi j2, 1
  jldi j3, 1
  jcall sb_bits
  jld j2, j1, SGV
  jld j3, j1, SGN
  jjmp sb_bits

; j3 bits of the stream (SBB, SBP; SBL bytes), the lowest first -> j2. Past its end every bit is a 1, so a gamma
; ends there. Uses j1-j8.
sr_bits:
  jldi j1, 0
  jldi j2, 0
  jldi j7, 0
  srb_lap:
    jjz j3, srb_done
    jld j4, j1, SBP
    jldi j5, 3
    jshr j5, j4, j5
    jld j6, j1, SBL
    jsub j6, j5, j6
    jldi j8, 63
    jsar j6, j6, j8
    jldi j8, 1
    jjz j6, srb_bit
    jld j6, j1, SBB
    jadd j5, j5, j6
    jldb j8, j5, 0
    jldi j6, 7
    jand j6, j4, j6
    jshr j8, j8, j6
    jldi j6, 1
    jand j8, j8, j6
  srb_bit:
    jshl j8, j8, j7
    jor j2, j2, j8
    jldi j6, 1
    jadd j7, j7, j6
    jadd j4, j4, j6
    jst j4, j1, SBP
    jsub j3, j3, j6
    jjmp srb_lap
srb_done:
  jret

; An Elias gamma of the stream -> j2. Uses j1-j8.
sr_gamma:
  jldi j1, 0
  jst j1, j1, SGN
  srg_zero:
    jldi j3, 1
    jcall sr_bits
    jjnz j2, srg_one
    jld j3, j1, SGN
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, SGN
    jjmp srg_zero
srg_one:
  jld j3, j1, SGN
  jcall sr_bits
  jld j3, j1, SGN
  jldi j4, 1
  jshl j4, j4, j3
  jor j2, j2, j4
  jret

; j2 = 1 if the stream was read past its end (a file cut or not ours). Uses j1-j3.
edd_past:
  jldi j1, 0
  jld j2, j1, SBL
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, SBP
  jsub j2, j2, j3
  jldi j3, 63
  jshr j2, j2, j3
  jret

; The file read (SXR, SXN) as ll_file reads it: the first format as it is; the bits ({2, ...}, eb_encode) said again
; as qwords in a room of their own, SXR and SXN then that room. j2 = 1, 0 if it is neither or does not hold together
; (an index past the dictionary, a letter past its end). Uses j1-j14.
ed_decode:
  jldi j1, 0
  jld j9, j1, SXR
  jld j2, j9, 0
  jldi j3, 1
  jsub j3, j2, j3
  jjz j3, edd_yes
  jldi j3, 2
  jsub j3, j2, j3
  jjnz j3, edd_bad
  jld j2, j1, SXN
  jldi j3, 32
  jsub j2, j2, j3
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, edd_bad
  jst j2, j1, SBL
  jld j2, j9, 8
  jst j2, j1, DNR
  jld j2, j9, 16
  jst j2, j1, DNP
  jld j2, j9, 24
  jst j2, j1, DAB
  jldi j2, 32
  jadd j2, j9, j2
  jst j2, j1, SBB
  jst j1, j1, SBP
  jld j2, j1, SBL               ; every piece takes a bit at least, an index 63 bits at most
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, DNP
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, edd_bad
  jld j2, j1, DAB
  jldi j3, 64
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, edd_bad
  jld j11, j1, DNP              ; the dictionary: each piece {its bytes, its letters padded}, and where each is
  jldi j2, 4
  jshl j11, j11, j2
  jld j2, j1, SXN
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, DT1
  jld j11, j1, DNP
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, DLST
  jst j1, j1, DT2
  edd_dict:
    jldi j1, 0
    jld j2, j1, DT2
    jld j3, j1, DNP
    jsub j3, j2, j3
    jjz j3, edd_dicted
    jcall sr_gamma
    jldi j3, 1
    jsub j2, j2, j3
    jldi j3, 63
    jsar j3, j2, j3
    jjnz j3, edd_bad
    jld j9, j1, DT1
    jst j2, j9, 0
    jst j2, j1, DT3
    jld j3, j1, DT2
    jldi j4, 3
    jshl j3, j3, j4
    jld j4, j1, DLST
    jadd j3, j3, j4
    jst j9, j3, 0
    jldi j3, 3                  ; its letters, inside the stream
    jshl j3, j2, j3
    jld j4, j1, SBP
    jadd j3, j3, j4
    jld j4, j1, SBL
    jldi j5, 3
    jshl j4, j4, j5
    jsub j3, j4, j3
    jldi j5, 63
    jsar j3, j3, j5
    jjnz j3, edd_bad
    jldi j3, 8
    jadd j3, j9, j3
    jst j3, j1, DT4
    edd_letter:
      jldi j1, 0
      jld j2, j1, DT3
      jjz j2, edd_lettered
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, DT3
      jldi j3, 8
      jcall sr_bits
      jld j4, j1, DT4
      jstb j2, j4, 0
      jldi j3, 1
      jadd j4, j4, j3
      jst j4, j1, DT4
      jjmp edd_letter
    edd_lettered:
    jld j9, j1, DT1
    jcall ed_next
    jst j9, j1, DT1
    jld j2, j1, DT2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, DT2
    jjmp edd_dict
edd_dicted:
  jld j2, j1, SBP               ; the relations: walked once for their bytes, then written
  jst j2, j1, DSV
  jldi j2, 16
  jst j2, j1, DSZ
  jst j1, j1, DOUT
  jcall edd_walk
  jjz j2, edd_bad
  jld j11, j1, DSZ
  jcall room
  jldi j1, 0
  jst j13, j1, DOUT
  jldi j2, 1
  jst j2, j13, 0
  jld j2, j1, DNR
  jst j2, j13, 8
  jldi j2, 16
  jadd j2, j13, j2
  jst j2, j1, DPOS
  jcall edd_walk
  jld j2, j1, DOUT
  jst j2, j1, SXR
  jld j2, j1, DSZ
  jst j2, j1, SXN
edd_yes:
  jldi j1, 0
  jldi j2, 1
  jret
edd_bad:
  jldi j1, 0
  jldi j2, 0
  jret

; The relations of the stream (from DSV, DNR of them): their bytes added to DSZ (DOUT 0), or written at DPOS, each
; {turned, pairs, how many pieces each} and its pieces copied from the dictionary. j2 = 1, 0 if one does not hold
; together. Uses j1-j9.
edd_walk:
  jldi j1, 0
  jld j2, j1, DSV
  jst j2, j1, SBP
  jld j2, j1, DNR
  jst j2, j1, DT2
  edw_rel:
    jldi j1, 0
    jld j2, j1, DT2
    jjz j2, edw_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, DT2
    jldi j3, 1
    jcall sr_bits
    jst j2, j1, DR0
    jcall sr_gamma
    jst j2, j1, DR1
    jcall sr_gamma
    jst j2, j1, DR2
    jcall sr_gamma
    jst j2, j1, DR3
    jcall edd_past
    jjnz j2, edw_bad
    jld j2, j1, DR2
    jld j3, j1, DR3
    jadd j2, j2, j3
    jst j2, j1, DT3
    jld j2, j1, DOUT
    jjz j2, edw_count
    jld j4, j1, DPOS
    jld j2, j1, DR0
    jst j2, j4, 0
    jld j2, j1, DR1
    jst j2, j4, 8
    jld j2, j1, DR2
    jst j2, j4, 16
    jld j2, j1, DR3
    jst j2, j4, 24
    jldi j2, 32
    jadd j4, j4, j2
    jst j4, j1, DPOS
    jjmp edw_piece
  edw_count:
    jld j2, j1, DSZ
    jldi j3, 32
    jadd j2, j2, j3
    jst j2, j1, DSZ
    edw_piece:
      jldi j1, 0
      jld j2, j1, DT3
      jjz j2, edw_rel
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, DT3
      jld j3, j1, DAB
      jcall sr_bits
      jld j4, j1, DNP
      jsub j3, j2, j4
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, edw_bad
      jldi j3, 3
      jshl j2, j2, j3
      jld j3, j1, DLST
      jadd j2, j2, j3
      jld j9, j2, 0
      jcall edd_past
      jjnz j2, edw_bad
      jld j2, j9, 0
      jldi j3, 7
      jadd j2, j2, j3
      jldi j3, -8
      jand j2, j2, j3
      jldi j3, 8
      jadd j2, j2, j3
      jld j3, j1, DOUT
      jjz j3, edw_add
      jld j4, j1, DPOS
      jwhile j2
        jld j5, j9, 0
        jst j5, j4, 0
        jldi j5, 8
        jadd j9, j9, j5
        jadd j4, j4, j5
        jsub j2, j2, j5
      jwend
      jst j4, j1, DPOS
      jjmp edw_piece
    edw_add:
      jld j3, j1, DSZ
      jadd j3, j3, j2
      jst j3, j1, DSZ
      jjmp edw_piece
edw_done:
  jldi j1, 0
  jldi j2, 1
  jret
edw_bad:
  jldi j1, 0
  jldi j2, 0
  jret
; The library's turn of the fact's skeleton (WSK): deduced as with TBEST, over the pairs every book proved. The core's
; side and the answer as qm_turned finds them; the fit over the turn's pieces (MB1, from lib_turn). Uses j1-j14.
qt_lib:
  jldi j1, 0
  jld j2, j1, WA
  jld j3, j1, QCW
  jsub j2, j2, j3
  jldi j4, 0
  jjnz j2, qtl_side
  jldi j4, 1
qtl_side:
  jst j4, j1, QSIDE
  jld j2, j1, WB
  jjz j4, qtl_oth
  jjmp qtl_oth2
qtl_oth:
  jld j2, j1, WA
qtl_oth2:
  jst j2, j1, QOTH
  jld j2, j1, LPB
  jcall q_fit_mb
  jjz j2, qtl_done
  jcall q_best
  jjz j2, qtl_done
  jcall q_new
  jjz j2, qtl_done
  jld j2, j1, WB                ; the sentence it deduced: the fact turned by the library's turn
  jcall putword
  jldi j2, 32
  jcall putch
  jcall put_lpcp
  jld j2, j1, WA
  jcall putword
  jldi j1, S_DEDQ
  jcall puts
  jldi j2, 10
  jcall putch
  jjmp flush
qtl_done:
  jldi j1, 0
  jret

; The middle of skeleton j12 as words of a sentence, each followed by a space. Uses j1-j11.
put_plain:
  jldi j1, 0
  jld j9, j12, 16
  jld j10, j12, 24
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
    jjnz j3, pp_skip
    jld j2, j1, PMT
    jcall put_glue
  pp_skip:
    jldi j1, 0
    jldi j2, 1
    jadd j11, j11, j2
    jsub j10, j10, j2
  jwend
  jret

; Word j2 in a sentence, a space after it; a mark goes against the word before it ("jacob, hijo de"). Uses j1-j8.
put_glue:
  jldi j1, 0
  jst j2, j1, QWL
  jcall w_mark
  jldi j1, 0
  jjz j3, pg_put
  jld j3, j1, POS
  jjz j3, pg_put
  jldi j4, 1
  jsub j3, j3, j4
  jldb j4, j3, TEXT
  jldi j5, 32
  jsub j4, j4, j5
  jjnz j4, pg_put
  jst j3, j1, POS
pg_put:
  jld j2, j1, QWL
  jcall putword
  jldi j2, 32
  jjmp putch

; The turn's pieces (LPC, LPB of them) as words of a sentence, each followed by a space. Uses j1-j9.
put_lpcp:
  jldi j1, 0
  jst j1, j1, LT4
  plp_lap:
    jldi j1, 0
    jld j2, j1, LT4
    jld j3, j1, LPB
    jsub j3, j2, j3
    jjz j3, plp_done
    jldi j3, 3
    jshl j3, j2, j3
    jld j2, j3, LPC
    jcall put_glue
  plp_next:
    jldi j1, 0
    jld j2, j1, LT4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LT4
    jjmp plp_lap
plp_done:
  jret

; j2 = 1 if the library proved a turn of the skeleton WSK: its pieces (as this reading's words) at MB1 and LPC, LPB of
; them, its pairs at LPP. Uses j1-j14.
lib_turn:
  jldi j1, 0
  jld j2, j1, LBEST
  jjz j2, lt_no
  jld j12, j1, WSK              ; the skeleton's print, by its pieces' letters
  jldi j13, LPC
  jcall m_collect
  jldi j1, 0
  jst j2, j1, LT1
  jld j5, j1, FNVO
  jst j5, j1, LT2
  jst j1, j1, LT3
  lt_print:
    jldi j1, 0
    jld j2, j1, LT3
    jld j3, j1, LT1
    jsub j3, j2, j3
    jjz j3, lt_printed
    jldi j3, 3
    jshl j3, j2, j3
    jld j2, j3, LPC
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ROOMI
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j4, j3, 16
    jld j3, j3, 8
    jld j6, j1, ROOMA
    jadd j3, j3, j6
    jcall lp_letters
    jldi j1, 0
    jld j2, j1, LT3
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LT3
    jjmp lt_print
lt_printed:
  jld j5, j1, LT2
  jjnz j5, lt_key
  jldi j5, 1
lt_key:
  jldi j2, LBEST
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, lt_no
  jld j2, j4, 8                 ; proved twice at least
  jst j2, j1, LPP
  jldi j3, 2
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, lt_no
  jld j9, j4, 16                ; its pieces: as words of this reading
  jld j2, j4, 24
  jst j2, j1, LPB
  jld j2, j1, PASS
  jst j2, j1, LT4
  jldi j2, 2
  jst j2, j1, PASS
  jst j1, j1, LT3
  lt_piece:
    jldi j1, 0
    jld j2, j1, LT3
    jld j3, j1, LPB
    jsub j3, j2, j3
    jjz j3, lt_pieces
    jst j9, j1, LT1
    jld j4, j9, 0
    jst j4, j1, WLEN
    jldi j5, 8
    jadd j5, j9, j5
    jldi j6, 0
    lt_letter:
      jsub j7, j6, j4
      jjz j7, lt_letters
      jadd j7, j5, j6
      jldb j7, j7, 0
      jstb j7, j6, WBUF
      jldi j7, 1
      jadd j6, j6, j7
      jjmp lt_letter
    lt_letters:
    jcall word_id
    jldi j1, 0
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, lt_unknown         ; (a word this reading never read: no fit is possible)
    jld j3, j1, LT3
    jldi j4, 3
    jshl j3, j3, j4
    jst j2, j3, LPC
    jst j2, j3, MB1
    jld j9, j1, LT1
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jld j2, j1, LT3
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LT3
    jjmp lt_piece
lt_pieces:
  jld j2, j1, LT4
  jst j2, j1, PASS
  jldi j2, 1
  jret
lt_unknown:
  jld j2, j1, LT4
  jst j2, j1, PASS
lt_no:
  jldi j1, 0
  jldi j2, 0
  jret

; The print LT2 goes on with j4 letters at j3, and a space after them (a middle's pieces, one after the other). Uses
; j1-j7.
lp_letters:
  jldi j1, 0
  jld j2, j1, LT2
  jld j6, j1, FNVP
  jwhile j4
    jldb j5, j3, 0
    jxor j2, j2, j5
    jmul j2, j2, j6
    jldi j5, 1
    jadd j3, j3, j5
    jsub j4, j4, j5
  jwend
  jldi j5, 32
  jxor j2, j2, j5
  jmul j2, j2, j6
  jst j2, j1, LT2
  jret

; The turns every book proved (the files "tablero/esqueletos...", sentido eating), summed by the letters of both
; skeletons, in both directions; then each skeleton's best turn (the most pairs). None: LBEST stays 0. Uses j1-j14.
lib_load:
  jldi j1, 0
  jst j1, j1, LBEST
  jst j1, j1, LNR
  jldi j2, 4096                 ; its folder's labels, all of them (while one more could be cut, twice the room)
  jst j2, j1, LSTC
  ll_list:
    jld j11, j1, LSTC
    jcall room
    jldi j1, 0
    jst j13, j1, LSTR
    jldi j10, 14
    jadd j11, j13, j1
    jld j12, j1, LSTC
    jcall ask
    jldi j1, 0
    jst j13, j1, LSTN
    jldi j2, 63
    jsar j2, j13, j2
    jjnz j2, ll_done
    jld j9, j1, LSTR
    jadd j10, j13, j1
    jwhile j10
      jld j2, j9, 0
      jldi j3, 7
      jadd j2, j2, j3
      jldi j3, -8
      jand j2, j2, j3
      jldi j3, 8
      jadd j2, j2, j3
      jadd j9, j9, j2
      jldi j2, 1
      jsub j10, j10, j2
    jwend
    jld j3, j1, LSTR
    jsub j9, j9, j3
    jld j3, j1, LSTC
    jsub j3, j3, j9
    jldi j4, 4104
    jsub j3, j3, j4
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, ll_listed
    jld j2, j1, LSTC
    jadd j2, j2, j2
    jst j2, j1, LSTC
    jjmp ll_list
ll_listed:
  jldi j2, LREL
  jldi j3, 40
  jcall pl_new
  jldi j1, 0
  jld j9, j1, LSTR
  jst j9, j1, LP
  jld j2, j1, LSTN
  jst j2, j1, LI
  ll_label:
    jldi j1, 0
    jld j2, j1, LI
    jjz j2, ll_best
    jld j9, j1, LP
    jld j2, j9, 0               ; "tablero/esqueletos" and more?
    jldi j3, 19
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, ll_next
    jldi j3, 8
    jadd j3, j9, j3
    jldi j4, S_ESQ
    jldi j5, 18
    ll_cmp:
      jldb j6, j3, 0
      jldb j7, j4, 0
      jsub j6, j6, j7
      jjnz j6, ll_next
      jldi j6, 1
      jadd j3, j3, j6
      jadd j4, j4, j6
      jsub j5, j5, j6
      jjnz j5, ll_cmp
    jldi j11, 8
    jadd j11, j9, j11
    jld j12, j9, 0
    jcall sx_read
    jldi j1, 0
    jld j2, j1, SXN
    jldi j3, 16
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, ll_next
    jcall ed_decode
    jjz j2, ll_next
    jcall ll_file
  ll_next:
    jldi j1, 0
    jld j9, j1, LP
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jst j9, j1, LP
    jld j2, j1, LI
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, LI
    jjmp ll_label
ll_best:
  jld j2, j1, LNR
  jjz j2, ll_done
  jldi j2, LBEST
  jldi j3, 32
  jcall pl_new
  jldi j1, 0
  jld j9, j1, LREL              ; each relation: the best of its skeleton
  jld j10, j1, LREL + 8
  jldi j2, 1
  jadd j10, j10, j2
  ll_rel:
    jjz j10, ll_done
    jld j2, j9, 0
    jjz j2, ll_rnext
    jst j9, j1, LT1
    jst j10, j1, LT3
    jld j5, j9, 32
    jldi j2, LBEST
    jcall pl_take
    jldi j1, 0
    jld j9, j1, LT1
    jld j10, j1, LT3
    jld j2, j9, 8
    jld j3, j4, 8
    jsub j3, j3, j2
    jldi j5, 63
    jsar j3, j3, j5
    jjz j3, ll_rnext
    jst j2, j4, 8
    jld j2, j9, 16
    jst j2, j4, 16
    jld j2, j9, 24
    jst j2, j4, 24
  ll_rnext:
    jld j2, j1, LREL + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp ll_rel
ll_done:
  jldi j1, 0
  jret

; One file read (SXR, SXN bytes): each turned relation, both ways, added to LREL by the prints of its two skeletons
; (their pieces' letters). The eating's variables are free here: ET1 turned, ET2 pairs, EI and EN2 the pieces of each,
; EOUT and EPOS where they start, EOSZ and ECNT their prints, EK the relation walked. Uses j1-j14.
ll_file:
  jldi j1, 0
  jld j9, j1, SXR
  jld j2, j9, 8
  jst j2, j1, LT4
  jldi j2, 16
  jadd j9, j9, j2
  jst j9, j1, EK
  lf_rel:
    jldi j1, 0
    jld j2, j1, LT4
    jjz j2, lf_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, LT4
    jld j9, j1, EK
    jld j2, j9, 0
    jst j2, j1, ET1
    jld j2, j9, 8
    jst j2, j1, ET2
    jld j2, j9, 16
    jst j2, j1, EI
    jld j2, j9, 24
    jst j2, j1, EN2
    jldi j2, 32
    jadd j9, j9, j2
    jst j9, j1, EOUT
    jld j10, j1, EI
    jcall lf_walk
    jldi j1, 0
    jld j2, j1, LT2
    jst j2, j1, EOSZ
    jst j9, j1, EPOS
    jld j10, j1, EN2
    jcall lf_walk
    jldi j1, 0
    jld j2, j1, LT2
    jst j2, j1, ECNT
    jst j9, j1, EK
    jld j2, j1, ET1               ; only a turn
    jjz j2, lf_rel
    jld j2, j1, EOSZ              ; one way: from the first to the other
    jld j3, j1, ECNT
    jld j5, j1, EPOS
    jld j6, j1, EN2
    jcall lf_add
    jldi j1, 0
    jld j2, j1, ECNT              ; and back
    jld j3, j1, EOSZ
    jld j5, j1, EOUT
    jld j6, j1, EI
    jcall lf_add
    jldi j1, 0
    jld j2, j1, LNR
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LNR
    jjmp lf_rel
lf_done:
  jldi j1, 0
  jret

; The pieces from j9 (j10 of them, each {its bytes, its letters padded}): their print -> LT2, and j9 past them.
; Uses j1-j10.
lf_walk:
  jldi j1, 0
  jld j2, j1, FNVO
  jst j2, j1, LT2
  lfw_lap:
    jjz j10, lfw_done
    jst j9, j1, LT1
    jst j10, j1, LT3
    jld j4, j9, 0
    jldi j3, 8
    jadd j3, j9, j3
    jcall lp_letters
    jldi j1, 0
    jld j9, j1, LT1
    jld j10, j1, LT3
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp lfw_lap
lfw_done:
  jret

; One way of a turn: from the skeleton of print j2 to the one of print j3, whose pieces are at j5 (j6 of them): its
; pairs (ET2) added. Uses j1-j14.
lf_add:
  jldi j1, 0
  jst j2, j1, LT1
  jst j5, j1, LT3
  jst j6, j1, LPB
  jld j4, j1, FNVP
  jmul j5, j2, j4
  jxor j5, j5, j3
  jmul j5, j5, j4
  jjnz j5, lfa_key
  jldi j5, 1
lfa_key:
  jldi j2, LREL
  jcall pl_take
  jldi j1, 0
  jld j2, j4, 8
  jld j3, j1, ET2
  jadd j2, j2, j3
  jst j2, j4, 8
  jld j2, j1, LT3
  jst j2, j4, 16
  jld j2, j1, LPB
  jst j2, j4, 24
  jld j2, j1, LT1
  jjnz j2, lfa_print
  jldi j2, 1
lfa_print:
  jst j2, j4, 32
  jret

; The file of the label at j11 (j12 bytes), read whole into a room that grows -> SXR, SXN (-1 if it cannot be
; opened). Uses j1-j14.
sx_read:
  jldi j1, 0
  jldi j10, 4
  jcall ask
  jldi j1, 0
  jldi j2, -1
  jst j2, j1, SXN
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, sxr_done
  jst j13, j1, SXH
  jst j1, j1, SXN
  jldi j11, 4096
  jst j11, j1, SXC
  jcall room
  jldi j1, 0
  jst j13, j1, SXR
sxr_read:
  jld j10, j1, SXH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, SXR
  jld j2, j1, SXN
  jadd j11, j11, j2
  jld j12, j1, SXC
  jsub j12, j12, j2
  jcall ask
  jldi j1, 0
  jldi j2, 1
  jsub j2, j13, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, sxr_close
  jld j2, j1, SXN
  jadd j2, j2, j13
  jst j2, j1, SXN
  jld j3, j1, SXC
  jsub j3, j3, j2
  jjnz j3, sxr_read
  jld j11, j1, SXC
  jadd j11, j11, j11
  jcall room
  jldi j1, 0
  jld j4, j1, SXR
  jadd j5, j13, j1
  jld j6, j1, SXN
  jwhile j6
    jld j7, j4, 0
    jst j7, j5, 0
    jldi j7, 8
    jadd j4, j4, j7
    jadd j5, j5, j7
    jsub j6, j6, j7
  jwend
  jst j13, j1, SXR
  jld j2, j1, SXC
  jadd j2, j2, j2
  jst j2, j1, SXC
  jjmp sxr_read
sxr_close:
  jld j10, j1, SXH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
sxr_done:
  jldi j1, 0
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
  jld j2, j1, WA                ; the answer it thought, said as a sentence: the fact
  jcall putword
  jldi j2, 32
  jcall putch
  jld j12, j1, WSK
  jcall put_plain
  jld j2, j1, WB
  jcall putword
  jldi j2, 10
  jcall putch
  jjmp flush
qm_turned:
  jcall lib_turn                ; the library's turn first: proved over every book, not over a piece
  jjnz j2, qt_lib
  jldi j1, 0
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
  jld j2, j1, WB                ; the sentence it deduced: the fact turned
  jcall putword
  jldi j2, 32
  jcall putch
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_plain
  jld j2, j1, WA
  jcall putword
  jldi j1, S_DEDQ
  jcall puts
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
q_fit_mb:                       ; (a middle's pieces already at MB1, j2 of them)
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
  jldi j1, 0                    ; (an answer the question says already is no answer: it cannot be the best either)
  jld j2, j1, QOTH
  jcall q_has
  jldi j1, 0
  jjnz j2, qb_no
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

; j2 = 1 if QOTH is a new answer: not a word of the question, and not given yet (its line begun then). Uses
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
