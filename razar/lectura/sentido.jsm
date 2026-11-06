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
; The meaning of a core is the skeletons it fills and on which side ("isaac: padre de jacob, hijo de abraham"). The
; sense is the skeleton's relation over its cores, and from the properties it deduces what the book does not say: a
; skeleton that turns gives the turned fact, one that chains gives the chain (the grandfather), each with its why.
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
S_BCHAIN = 3C0h
S_NOBOOK = 400h
S_NOMEM = 440h
S_SKTOP = 480h
S_TURN  = 4C0h
S_FLIPS = 4C0h
S_FULL  = 500h
S_LIMS  = 540h

SMASK = 1900h                   ; places of each table, minus 1
ROOMPT = 1908h                  ; the facts: {key, skeleton, A, B, denied} (40 bytes)
ROOMMI = 1910h                  ; the skeletons: {key, pairs, a place it is said, its length, chains, symmetric, denied,
ROOMBP = 1918h                  ; contradictions} (64); by pair: {key of A B, skeleton} (24, a key may have many); by
ROOMLF = 1920h                  ; skeleton and left core: {key} (8); between skeletons: {key, m, m', turned, pairs} (40)
ROOMMM = 1928h
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
FE    = 1988h                   ; a fact walked, an index, how many left
FI    = 1990h
FL    = 1998h
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
NMM   = 19F0h                   ; entries between skeletons, entries by pair, a table filled (1)
NBP   = 19F8h
FULL  = 1A00h
FI5   = 1A08h
BPT   = 1A10h                   ; best_partner: turned or not
MB1   = 1A18h                   ; two middles, piece by piece (three each), and how many in the second
MB2   = 1A30h
MN2   = 1A48h
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

jldi j1, 0                      ; its tables: places for every window of the book (three per unit), twice over
jld j2, j1, NTOK
jldi j3, 4
jmul j2, j2, j3
jcall pow2
jldi j4, 1
jsub j4, j3, j4
jst j4, j1, SMASK
jldi j4, 40
jmul j11, j3, j4
jcall room
jldi j1, 0
jst j13, j1, ROOMPT
jld j3, j1, SMASK
jldi j4, 1
jadd j3, j3, j4
jldi j4, 64
jmul j11, j3, j4
jcall room
jldi j1, 0
jst j13, j1, ROOMMI
jld j3, j1, SMASK
jldi j4, 1
jadd j3, j3, j4
jldi j4, 24
jmul j11, j3, j4
jcall room
jldi j1, 0
jst j13, j1, ROOMBP
jld j3, j1, SMASK
jldi j4, 1
jadd j3, j3, j4
jldi j4, 3
jshl j11, j3, j4
jcall room
jldi j1, 0
jst j13, j1, ROOMLF
jld j3, j1, SMASK
jldi j4, 1
jadd j3, j3, j4
jldi j4, 40
jmul j11, j3, j4
jcall room
jldi j1, 0
jst j13, j1, ROOMMM

jcall gather                    ; the facts, each skeleton with its pairs
jcall prove                     ; what each skeleton means, proved

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
jld j2, j1, FULL
jjz j2, h_ok
jldi j1, S_FULL
jcall puts
h_ok:
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
  jcall f_add
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

; The fact WA WK WB (WN: denied) once: new in the facts, and its skeleton counts one pair (or one denied) more. Uses
; j1-j8.
f_add:
  jldi j1, 0
  jld j2, j1, WK
  jld j3, j1, WA
  jcall hw
  jld j3, j1, WB
  jcall hw
  jld j3, j1, WN
  jcall hw
  jjnz j2, fa_k
  jldi j2, 1
fa_k:
  jadd j5, j2, j1
  jld j2, j1, ROOMPT
  jldi j3, 40
  jcall s_find
  jld j6, j4, 0
  jjnz j6, fa_done              ; said before
  jst j5, j4, 0
  jld j6, j1, WK
  jst j6, j4, 8
  jld j6, j1, WA
  jst j6, j4, 16
  jld j6, j1, WB
  jst j6, j4, 24
  jld j6, j1, WN
  jst j6, j4, 32
  jld j5, j1, WK                ; its skeleton
  jld j2, j1, ROOMMI
  jldi j3, 64
  jcall s_find
  jld j6, j4, 0
  jjnz j6, fa_old
  jst j5, j4, 0
  jld j6, j1, WP
  jst j6, j4, 16
  jld j6, j1, WM
  jst j6, j4, 24
  jld j6, j1, NSK
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j1, NSK
fa_old:
  jld j6, j1, WN
  jjnz j6, fa_neg
  jld j6, j4, 8
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j4, 8
  jld j6, j1, NPR
  jadd j6, j6, j7
  jst j6, j1, NPR
  jret
fa_neg:
  jld j6, j4, 48
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j4, 48
  jld j6, j1, NNG
  jadd j6, j6, j7
  jst j6, j1, NNG
fa_done:
  jret

; The place of key j5 in the table at j2, j3 bytes a place -> j4 (empty if the key is not there). Uses j1, j4, j6-j8.
s_find:
  jldi j1, 0
  jldi j6, 32
  jshr j6, j5, j6
  jxor j6, j6, j5
  jld j7, j1, SMASK
  jand j6, j6, j7
  jldi j8, 1
  jwhile j8
    jmul j4, j6, j3
    jadd j4, j4, j2
    jld j7, j4, 0
    jsub j8, j7, j5
    jjnz j7, sf_full
    jldi j8, 0
  sf_full:
    jldi j7, 1
    jadd j6, j6, j7
    jld j7, j1, SMASK
    jand j6, j6, j7
  jwend
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

; What each skeleton means, proved over its affirmed facts: first every pair is filed (by pair, and by skeleton and
; left core); then each fact looks for its turned pair in the same skeleton (symmetric), for a fact of the same
; skeleton starting where it ends (it chains), for other skeletons with the same pair turned or the same (turns, the
; same), and a denied fact for the same fact affirmed (a contradiction). Uses j1-j14.
prove:
  jldi j2, 1
  jcall p_walk
  jldi j2, 2
  jcall p_walk
  jret

; Every fact of the table: mode j2 1 files it, 2 proves with it. Uses j1-j14.
p_walk:
  jldi j1, 0
  jst j2, j1, TOPN2
  jst j1, j1, FI
  jld j2, j1, SMASK
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, FL
  jwhile j2
    jldi j1, 0
    jld j3, j1, FI
    jldi j4, 40
    jmul j3, j3, j4
    jld j4, j1, ROOMPT
    jadd j3, j3, j4
    jld j4, j3, 0
    jjz j4, pw_next
    jst j3, j1, FE
    jld j2, j1, TOPN2
    jldi j4, 1
    jsub j2, j2, j4
    jjnz j2, pw_prove
    jld j4, j3, 32              ; filing: affirmed facts only
    jjnz j4, pw_next
    jld j2, j3, 16              ; by pair
    jld j3, j3, 24
    jcall k_pair
    jld j2, j1, ROOMBP
    jldi j3, 24
    jcall bp_add
    jld j3, j1, FE              ; by skeleton and left core
    jld j2, j3, 8
    jld j3, j3, 16
    jcall k_pair
    jld j2, j1, ROOMLF
    jldi j3, 8
    jcall s_find
    jst j5, j4, 0
    jjmp pw_next
  pw_prove:
    jcall p_fact
  pw_next:
    jldi j1, 0
    jld j2, j1, FI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FI
    jld j2, j1, FL
    jsub j2, j2, j3
    jst j2, j1, FL
  jwend
  jret

; The pair key j5 filed with the skeleton of the fact FE, in the table at j2 (a key may have many; a skeleton once).
; Uses j1-j8.
bp_add:
  jldi j1, 0
  jldi j6, 32
  jshr j6, j5, j6
  jxor j6, j6, j5
  jld j7, j1, SMASK
  jand j6, j6, j7
  jld j3, j1, FE
  jld j3, j3, 8
  jldi j8, 1
  jwhile j8
    jldi j7, 24
    jmul j4, j6, j7
    jadd j4, j4, j2
    jld j7, j4, 0
    jjz j7, ba_put
    jsub j7, j7, j5
    jjnz j7, ba_next
    jld j7, j4, 8
    jsub j7, j7, j3
    jjz j7, ba_done
  ba_next:
    jldi j7, 1
    jadd j6, j6, j7
    jld j7, j1, SMASK
    jand j6, j6, j7
  jwend
ba_put:
  jld j6, j1, NBP               ; (full at half its places: said, and stopped)
  jld j7, j1, SMASK
  jldi j8, 1
  jshr j7, j7, j8
  jsub j7, j6, j7
  jldi j8, 63
  jsar j7, j7, j8
  jjnz j7, ba_room
  jldi j6, 1
  jst j6, j1, FULL
  jret
ba_room:
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j1, NBP
  jst j5, j4, 0
  jst j3, j4, 8
ba_done:
  jret

; The proofs of the fact FE. Uses j1-j14.
p_fact:
  jldi j1, 0
  jld j9, j1, FE
  jld j2, j9, 32
  jjnz j2, pf_denied
  jld j5, j9, 8                 ; its skeleton
  jld j2, j1, ROOMMI
  jldi j3, 64
  jcall s_find
  jst j4, j1, WP                ; (its skeleton's place)
  jldi j1, 0                    ; symmetric: B m A affirmed too
  jld j9, j1, FE
  jld j2, j9, 8
  jld j3, j9, 24
  jld j4, j9, 16
  jcall f_key
  jld j2, j1, ROOMPT
  jldi j3, 40
  jcall s_find
  jld j6, j4, 0
  jjz j6, pf_chain
  jld j4, j1, WP
  jld j6, j4, 40
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j4, 40
pf_chain:
  jldi j1, 0                    ; it chains: a fact of the same skeleton starts at B
  jld j9, j1, FE
  jld j2, j9, 8
  jld j3, j9, 24
  jcall k_pair
  jld j2, j1, ROOMLF
  jldi j3, 8
  jcall s_find
  jld j6, j4, 0
  jjz j6, pf_others
  jld j4, j1, WP
  jld j6, j4, 32
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j4, 32
pf_others:
  jldi j1, 0                    ; turned: other skeletons with B A; the same: other skeletons with A B
  jld j9, j1, FE
  jld j2, j9, 24
  jld j3, j9, 16
  jldi j12, 1
  jcall pf_partners
  jldi j1, 0
  jld j9, j1, FE
  jld j2, j9, 16
  jld j3, j9, 24
  jldi j12, 0
  jcall pf_partners
  jret
pf_denied:
  jld j2, j9, 8                 ; denied: is the same fact affirmed? a contradiction
  jld j3, j9, 16
  jld j4, j9, 24
  jcall f_key
  jld j2, j1, ROOMPT
  jldi j3, 40
  jcall s_find
  jld j6, j4, 0
  jjz j6, pf_done
  jld j9, j1, FE
  jld j5, j9, 8
  jld j2, j1, ROOMMI
  jldi j3, 64
  jcall s_find
  jld j6, j4, 56
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j4, 56
pf_done:
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

; Every other skeleton filed with the pair j2 j3: one pair more between the fact FE's skeleton and it, turned j12.
; Uses j1-j14.
pf_partners:
  jcall k_pair
  jst j5, j1, FI2
  jldi j6, 32
  jshr j6, j5, j6
  jxor j6, j6, j5
  jld j7, j1, SMASK
  jand j6, j6, j7
  jldi j13, 1
  jwhile j13
    jldi j1, 0
    jldi j7, 24
    jmul j4, j6, j7
    jld j7, j1, ROOMBP
    jadd j4, j4, j7
    jld j7, j4, 0
    jjz j7, pp_done
    jld j8, j1, FI2
    jsub j7, j7, j8
    jjnz j7, pp_next
    jld j10, j4, 8              ; the other skeleton
    jld j9, j1, FE
    jld j11, j9, 8
    jsub j7, j10, j11
    jjz j7, pp_next
    jst j6, j1, FI3
    jcall mm_add
    jldi j1, 0
    jld j6, j1, FI3
  pp_next:
    jldi j7, 1
    jadd j6, j6, j7
    jld j7, j1, SMASK
    jand j6, j6, j7
    jldi j13, 1
  jwend
pp_done:
  jret

; One pair more between skeletons j11 and j10, turned j12. Uses j1-j8.
mm_add:
  jldi j1, 0
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
  jld j2, j1, ROOMMM
  jldi j3, 40
  jcall s_find
  jld j6, j4, 0
  jjnz j6, ma_old
  jld j6, j1, NMM               ; a table full is said, never searched without end: at half its places it stops
  jld j7, j1, SMASK
  jldi j8, 1
  jshr j7, j7, j8
  jsub j7, j6, j7
  jldi j8, 63
  jsar j7, j7, j8
  jjnz j7, ma_room
  jldi j6, 1
  jst j6, j1, FULL
  jret
ma_room:
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j1, NMM
  jst j5, j4, 0
  jst j11, j4, 8
  jst j10, j4, 16
  jst j12, j4, 24
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
    jld j10, j1, SMASK
    jldi j2, 1
    jadd j10, j10, j2
    jwhile j10
      jldi j3, 64
      jmul j3, j9, j3
      jld j2, j1, ROOMMI
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
  jld j10, j1, SMASK
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j3, 40
    jmul j3, j9, j3
    jld j2, j1, ROOMMM
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
    jld j2, j1, ROOMMM
    jldi j3, 40
    jcall s_find
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
  jld j2, j1, ROOMMI
  jldi j3, 64
  jcall s_find
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
    jldi j1, 0
    jld j2, j1, QSI
    jldi j3, 3
    jshl j2, j2, j3
    jld j2, j2, QBUF
    jldi j3, 1                  ; a word it knows (not a hole, not unknown, not the end)
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, co_next
    jst j2, j1, QCW
    jcall core_one
    jcall flush
  co_next:
    jldi j1, 0
    jld j2, j1, QSI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QSI
    jld j3, j1, QN
    jsub j2, j3, j2
  jwend
  jret

; The core QCW: every affirmed fact it is in, of a skeleton with two pairs or more, and what follows from it. Uses
; j1-j14.
core_one:
  jldi j1, S_CORE
  jcall puts
  jld j2, j1, QCW
  jcall putword
  jldi j2, 10
  jcall putch
  jldi j1, 0
  jst j1, j1, FI
  jld j2, j1, SMASK
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, FL
  jwhile j2
    jldi j1, 0
    jld j3, j1, FI
    jldi j4, 40
    jmul j3, j3, j4
    jld j4, j1, ROOMPT
    jadd j3, j3, j4
    jld j4, j3, 0
    jjz j4, cn_next
    jld j4, j3, 32
    jjnz j4, cn_next
    jld j4, j1, QCW
    jld j5, j3, 16
    jsub j5, j5, j4
    jjz j5, cn_in
    jld j5, j3, 24
    jsub j5, j5, j4
    jjnz j5, cn_next
  cn_in:
    jst j3, j1, WA              ; (the fact)
    jld j5, j3, 8               ; its skeleton: two pairs or more
    jld j2, j1, ROOMMI
    jldi j3, 64
    jcall s_find
    jld j6, j4, 8
    jldi j7, 63
    jsar j7, j6, j7             ; (written skeletons keep their pairs negative)
    jjz j7, cn_pos
    jldi j7, 0
    jsub j6, j7, j6
  cn_pos:
    jldi j7, 2
    jsub j6, j6, j7
    jldi j7, 63
    jsar j6, j6, j7
    jjnz j6, cn_next
    jst j4, j1, WB              ; (its skeleton)
    jldi j2, 32
    jcall putch
    jldi j2, 32
    jcall putch
    jld j3, j1, WA
    jld j2, j3, 16
    jadd j12, j2, j1
    jcall mix
    jcall putword
    jldi j2, 32
    jcall putch
    jld j12, j1, WB
    jcall put_mid
    jld j3, j1, WA
    jld j2, j3, 24
    jcall putword
    jldi j2, 10
    jcall putch
    jcall c_deduce
    jcall flush
  cn_next:
    jldi j1, 0
    jld j2, j1, FI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FI
    jld j2, j1, FL
    jsub j2, j2, j3
    jst j2, j1, FL
  jwend
  jret

; What follows from the fact WA (skeleton at WB): if its skeleton turns (a partner with two pairs or more, turned),
; the turned fact, when the book does not say it; with its why. Uses j1-j14.
c_deduce:
  jldi j1, 0
  jld j2, j1, WB
  jst j2, j1, FE
  jld j2, j1, FI
  jst j2, j1, FI5
  jldi j12, 1
  jcall best_partner
  jldi j1, 0
  jld j2, j1, FI5
  jst j2, j1, FI
  jld j2, j1, TBEST
  jjz j2, cd_done
  jld j2, j1, TBEST              ; said already? (the turned skeleton, B, A)
  jld j3, j1, WA
  jld j4, j3, 16
  jld j3, j3, 24
  jcall f_key
  jld j2, j1, ROOMPT
  jldi j3, 40
  jcall s_find
  jld j6, j4, 0
  jjnz j6, cd_done
  jldi j1, S_DED
  jcall puts
  jld j3, j1, WA
  jld j2, j3, 24
  jcall putword
  jldi j2, 32
  jcall putch
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jld j3, j1, WA
  jld j2, j3, 16
  jcall putword
  jldi j1, S_BEC
  jcall puts
  jld j12, j1, WB
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
cd_done:
  jret

; j2 written, and into j0. Uses j1-j4, j12-j14.
putmix:
  jldi j1, 0
  jadd j12, j2, j1
  jcall mix
  jjmp putnum

include 'casa.inc'
include 'pulso.inc'
include 'negacion.inc'
include 'lectura.inc'
