; The pulse (Capitan, 2026-11-06). One rule for the twins, the switch of the no and the doors: everything is the same
; with one difference. What is common is kept once; the difference that repeats between many pairs becomes a piece of
; its own. And nothing is searched for: each thing read leaves a request asleep, hung on what it has in common with
; others (the key: the thing with one hole); when the text brings something that fills the same hole, the pulse wakes
; and the pair "the same with one difference" exists. Only what the text brings works, and only when it brings it.
;
; Three floors, the difference always one piece of the floor below:
;   gemelos: a word with one letter as the hole ("hij_"); what fills it is the letter. Over the words read.
;   interruptores and asociados: four words in a row with one of the middle two taken out, and three in a row as
;     said (the hole empty). Filled by nothing against filled by a word: that word can be taken out and the rest is
;     still said (a switch, as the no). Filled by two words: they stand in the same place (associates).
;   puertas: two words with two between them ("isaac padre de jacob"), the pair without its order as the key; what
;     fills it is the two between and which side went first. Two fillings: the same pair, another way (turned or not).
; A request keeps what filled it first and whether it was said empty; a form counts once (the same filling at the same
; key again wakes nothing). The difference of a pulse is the two fillings, without their order (and for a door whether
; it turned).
;
; It wakes requests only from the renglones it learns from (lectura.inc: one in K kept apart), and only from the words
; read there for the twins. Then the judge of harmony (D39: the same said with less): a difference is a piece when its
; pairs, said as one piece, cost fewer bits than said apart, the piece's own name paid. On its floor, with N pulses, U
; different fillings and c(f) the pulses filling f took part in, n pairs of the difference (a, b) save
;   n * log2(2N * n / (c(a) * c(b)))   bits (what knowing a says of b, per pair),
; and naming the piece costs 2 * log2(U) (two fillings out of U). It is a piece when the first is more. Nothing is set
; by hand: a filling that does other work (in many pulses) is worth less as a piece, and one pair alone rarely pays.
; Then, without writing anything, the renglones kept apart (and the words only they have) knock on the requests: every
; pulse there is checked against the pieces, and so is a blind pulse beside it (the same waiting filling against the
; filling that arrived just before on that floor): pieces that tell structure explain the real ones more than the blind.
; For each kind it writes its pulses, differences and pieces, how many pulses woke in what it never read and how many
; of them a piece explains, the same for the blind ones, and its ten pieces that save the most bits. Its counts go into
; j0.
S_LIBRO = 0
S_P     = 10h
S_HEAD  = 40h
S_DIST  = 80h
S_LINES = 0C0h
S_TEST  = 100h
S_POSTS = 140h
S_KIND  = 180h                  ; the four names, 40h apart
S_PUL   = 280h
S_DIF   = 2C0h
S_TPUL  = 300h
S_TPCE  = 340h
S_TURN  = 380h
S_NOBOOK = 3C0h
S_NOMEM = 400h
S_PCS   = 440h
S_BLIND = 480h
S_BITS  = 4C0h
S_PAIRS = 500h

ROOMC = 1200h                   ; how often each word was read where it learns, by number
ROOMR = 1208h                   ; the requests: {key, what filled it first, said empty} per place (24 bytes)
ROOMS = 1210h                   ; the forms already seen: {hash of key and filling} per place
ROOMD = 1218h                   ; the differences: {key, low, high, floor | turned << 8, pairs, bits saved (in 2^-16)}
                                ; per place (48 bytes)
RMASK = 1220h                   ; places of each of the three, minus 1
TESTING = 1228h                 ; 1: knocking with what it never read (nothing is written)
FLOOR = 1230h                   ; 1 gemelos, 2 interruptores and asociados, 3 puertas
JJ    = 1238h                   ; the unit being walked, how many are left, its place
JLEFT = 1240h
WAT   = 1248h
KEY   = 1250h                   ; the request being made
PAY   = 1258h
RENT  = 1260h
DLO   = 1268h                   ; the difference of a pulse
DHI   = 1270h
DKT   = 1278h
CAT   = 1280h                   ; its kind: 1 gemelos, 2 interruptores, 3 asociados, 4 puertas
LPTR  = 1288h                   ; the word whose letters are being hung: where, how many, the hole
LLEN  = 1290h
WI    = 1298h
WID   = 12A0h
NREQ  = 12A8h                   ; requests hung
TOPN  = 12B0h
ROOMF = 12B8h                   ; the fillings: {key, pulses it took part in} per place
PA    = 12C0h                   ; the pulse: its waiting filling and the one that arrived; its kind
PB    = 12C8h
RC    = 12D0h
GE    = 12D8h                   ; the judge: the difference judged, and its bits
GS    = 12E0h
GN    = 12E8h
NPULC = 1300h                   ; by kind (8 bytes each, from kind 0): pulses, differences, pulses in what it never
NDIFC = 1340h                   ; read and how many of them a piece explains
TPULC = 1380h
TPCEC = 13C0h
NFL   = 1400h                   ; by floor: pulses, and different fillings
UFL   = 1420h
NADC  = 1440h                   ; by kind: pieces; blind pulses, and how many of them a piece explains
TBLN  = 1480h
TBLC  = 14C0h
PREVX = 1500h                   ; by floor: the filling that arrived last (knocking)
include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j0, 0                      ; the fingerprint
jcall read_book

jldi j1, 0                      ; the words read where it learns
jld j11, j1, NUNITS
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMC
jst j1, j1, LINE
jst j1, j1, JJ
jld j2, j1, NTOK
jst j2, j1, JLEFT
jwhile j2
  jldi j1, 0
  jld j9, j1, JJ
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, ROOMT
  jadd j3, j3, j4
  jld j10, j3, 0
  jjnz j10, rc_word
  jjz j9, rc_next
  jld j4, j1, LINE
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j1, LINE
  jjmp rc_next
rc_word:
  jcall is_train
  jjz j2, rc_next
  jldi j1, 0
  jldi j3, 3
  jshl j3, j10, j3
  jld j4, j1, ROOMC
  jadd j3, j3, j4
  jld j4, j3, 0
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j3, 0
rc_next:
  jldi j1, 0
  jld j9, j1, JJ
  jldi j3, 1
  jadd j9, j9, j3
  jst j9, j1, JJ
  jld j2, j1, JLEFT
  jsub j2, j2, j3
  jst j2, j1, JLEFT
jwend

jldi j1, 0                      ; its three tables: places for every request it could ever hang (the letters of every
jld j2, j1, ARPOS               ; word, and four per unit), twice over
jld j3, j1, NTOK
jldi j4, 2
jshl j3, j3, j4
jadd j2, j2, j3
jadd j2, j2, j2
jcall pow2
jldi j4, 1
jsub j4, j3, j4
jst j4, j1, RMASK
jldi j4, 24
jmul j11, j3, j4
jcall room
jldi j1, 0
jst j13, j1, ROOMR
jld j3, j1, RMASK
jldi j4, 1
jadd j3, j3, j4
jldi j4, 3
jshl j11, j3, j4
jcall room
jldi j1, 0
jst j13, j1, ROOMS
jld j3, j1, RMASK
jldi j4, 1
jadd j3, j3, j4
jldi j4, 4
jshl j11, j3, j4
jcall room
jldi j1, 0
jst j13, j1, ROOMF
jld j3, j1, RMASK
jldi j4, 1
jadd j3, j3, j4
jldi j4, 48
jmul j11, j3, j4
jcall room

jldi j1, 0                      ; awake: what it learns from hangs its requests, and the pulses are born
jst j13, j1, ROOMD
jst j1, j1, TESTING
jcall all_floors
jcall judge
jldi j1, 0                      ; then what it never read knocks
jldi j2, 1
jst j2, j1, TESTING
jcall all_floors

jldi j1, S_HEAD                 ; how it went
jcall puts
jld j2, j1, NTOK
jld j3, j1, NLINES
jsub j2, j2, j3
jldi j3, 1
jsub j2, j2, j3
jcall putnum
jldi j1, S_DIST
jcall puts
jld j2, j1, NV
jldi j3, 1
jsub j2, j2, j3
jcall putnum
jldi j1, S_LINES
jcall puts
jld j2, j1, NLINES
jcall putnum
jldi j1, S_TEST
jcall puts
jld j2, j1, PK
jcall putnum
jldi j1, S_POSTS
jcall puts
jld j2, j1, NREQ
jcall putnum
jldi j2, 10
jcall putch
jldi j2, 1
jst j2, j1, CAT
jldi j2, 4
jst j2, j1, JLEFT
jwhile j2
  jcall kind_report
  jldi j1, 0
  jld j2, j1, CAT
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, CAT
  jld j2, j1, JLEFT
  jsub j2, j2, j3
  jst j2, j1, JLEFT
jwend
jjmp finish

; The three floors, awake (TESTING 0) or knocking (1). Uses j1-j12.
all_floors:
  jldi j1, 0                    ; gemelos: the words read where it learns, or the ones only what it never read has
  jldi j2, 1
  jst j2, j1, FLOOR
  jst j2, j1, WID
  jld j2, j1, NV
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, JLEFT
  jwhile j2
    jldi j1, 0
    jld j2, j1, WID
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ROOMC
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j4, j1, TESTING
    jjz j3, af_unread
    jjnz j4, af_next
    jjmp af_hang
  af_unread:
    jjz j4, af_next
  af_hang:
    jcall letters
  af_next:
    jldi j1, 0
    jld j2, j1, WID
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, WID
    jld j2, j1, JLEFT
    jsub j2, j2, j3
    jst j2, j1, JLEFT
  jwend
  jcall windows
  jret

; The word WID hangs one request per letter: the word with that letter as the hole, filled by the letter. Uses j1-j12.
letters:
  jldi j1, 0
  jld j2, j1, WID
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j4, j3, 16
  jst j4, j1, LLEN
  jld j3, j3, 8
  jld j4, j1, ROOMA
  jadd j3, j3, j4
  jst j3, j1, LPTR
  jst j1, j1, WI
  jld j12, j1, LLEN
  jwhile j12
    jldi j1, 0
    jld j2, j1, FNVO
    jldi j3, 1
    jcall hw
    jld j3, j1, LLEN
    jcall hw
    jldi j9, 0
    jld j10, j1, LLEN
    jld j11, j1, LPTR
    jwhile j10
      jldb j3, j11, 0
      jld j5, j1, WI
      jsub j5, j5, j9
      jjnz j5, le_keep
      jldi j3, 0
    le_keep:
      jcall hw
      jldi j5, 1
      jadd j9, j9, j5
      jadd j11, j11, j5
      jsub j10, j10, j5
    jwend
    jld j3, j1, LPTR
    jld j5, j1, WI
    jadd j3, j3, j5
    jldb j3, j3, 0
    jcall post
    jldi j1, 0
    jld j2, j1, WI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, WI
    jld j12, j1, LLEN
    jsub j12, j12, j2
  jwend
  jret

; Every three and four words in a row, inside a renglon (a window with the renglon in it is no window), in the
; renglones it learns from (awake) or in the ones kept apart (knocking). Uses j1-j12.
windows:
  jldi j1, 0
  jst j1, j1, LINE
  jst j1, j1, JJ
  jld j2, j1, NTOK
  jldi j3, 3
  jsub j2, j2, j3
  jst j2, j1, JLEFT
  jwhile j2
    jldi j1, 0
    jld j9, j1, JJ
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ROOMT
    jadd j3, j3, j4
    jst j3, j1, WAT
    jld j2, j3, 0
    jjnz j2, wn_word
    jjz j9, wn_next
    jld j4, j1, LINE
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j1, LINE
    jjmp wn_next
  wn_word:
    jcall is_train
    jldi j1, 0
    jld j3, j1, TESTING
    jjz j2, wn_kept
    jjnz j3, wn_next
    jjmp wn_post
  wn_kept:
    jjz j3, wn_next
  wn_post:
    jld j9, j1, WAT
    jld j3, j9, 8
    jjz j3, wn_next
    jld j3, j9, 16
    jjz j3, wn_next
    jldi j2, 2                  ; three in a row, said: the hole empty
    jst j2, j1, FLOOR
    jld j2, j1, FNVO
    jldi j3, 2
    jcall hw
    jld j3, j9, 0
    jcall hw
    jld j3, j9, 8
    jcall hw
    jld j3, j9, 16
    jcall hw
    jldi j3, 0
    jcall post
    jldi j1, 0
    jld j9, j1, WAT
    jld j3, j9, 24
    jjz j3, wn_next
    jld j2, j1, FNVO            ; four in a row, the second taken out
    jldi j3, 2
    jcall hw
    jld j3, j9, 0
    jcall hw
    jld j3, j9, 16
    jcall hw
    jld j3, j9, 24
    jcall hw
    jld j3, j9, 8
    jcall post
    jldi j1, 0
    jld j9, j1, WAT
    jld j2, j1, FNVO            ; the third taken out
    jldi j3, 2
    jcall hw
    jld j3, j9, 0
    jcall hw
    jld j3, j9, 8
    jcall hw
    jld j3, j9, 24
    jcall hw
    jld j3, j9, 16
    jcall post
    jldi j1, 0                  ; the door: the pair of the ends without its order, filled by the two between
    jldi j2, 3
    jst j2, j1, FLOOR
    jld j9, j1, WAT
    jld j10, j9, 0
    jld j11, j9, 24
    jsub j2, j11, j10
    jjz j2, wn_next
    jldi j3, 63
    jsar j2, j2, j3             ; -1: the second end is the lower
    jldi j12, 1                 ; 1: the lower went first
    jjz j2, wn_order
    jldi j12, 0
    jadd j3, j10, j1
    jadd j10, j11, j1
    jadd j11, j3, j1
  wn_order:
    jld j2, j1, FNVO
    jldi j3, 3
    jcall hw
    jadd j3, j10, j1
    jcall hw
    jadd j3, j11, j1
    jcall hw
    jld j9, j1, WAT
    jld j3, j9, 8
    jld j4, j9, 16
    jldi j5, 24
    jshl j4, j4, j5
    jor j3, j3, j4
    jldi j5, 48
    jshl j4, j12, j5
    jor j3, j3, j4
    jcall post
  wn_next:
    jldi j1, 0
    jld j9, j1, JJ
    jldi j3, 1
    jadd j9, j9, j3
    jst j9, j1, JJ
    jld j2, j1, JLEFT
    jsub j2, j2, j3
    jst j2, j1, JLEFT
  jwend
  jret

; j2 = (j2 xor j3) * the FNV prime. Uses j1, j4 (j1 = 0 after).
hw:
  jldi j1, 0
  jld j4, j1, FNVP
  jxor j2, j2, j3
  jmul j2, j2, j4
  jret

; The place of key j5 in the table at j2, j3 bytes a place -> j4 (empty if the key is not there). Uses j1, j4, j6-j8.
t_find:
  jldi j1, 0
  jldi j6, 32
  jshr j6, j5, j6
  jxor j6, j6, j5
  jld j7, j1, RMASK
  jand j6, j6, j7
  jldi j8, 1
  jwhile j8
    jmul j4, j6, j3
    jadd j4, j4, j2
    jld j7, j4, 0
    jsub j8, j7, j5
    jjnz j7, tf_full
    jldi j8, 0
  tf_full:
    jldi j7, 1
    jadd j6, j6, j7
    jld j7, j1, RMASK
    jand j6, j6, j7
  jwend
  jret

; A request: key j2, filled by j3 (0: said empty). Awake it hangs (a form only once) and wakes the pulses it meets;
; knocking it only wakes them. Uses j1-j8.
post:
  jldi j1, 0
  jjnz j2, po_key
  jldi j2, 1
po_key:
  jst j2, j1, KEY
  jst j3, j1, PAY
  jld j4, j1, TESTING
  jjnz j4, po_test
  jcall hw                      ; seen before?
  jjnz j2, po_seen
  jldi j2, 1
po_seen:
  jadd j5, j2, j1
  jld j2, j1, ROOMS
  jldi j3, 8
  jcall t_find
  jld j6, j4, 0
  jjnz j6, po_done
  jst j5, j4, 0
  jld j5, j1, KEY
  jld j2, j1, ROOMR
  jldi j3, 24
  jcall t_find
  jld j6, j4, 0
  jjnz j6, po_old
  jst j5, j4, 0                 ; a new request falls asleep
  jld j6, j1, NREQ
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j1, NREQ
po_old:
  jld j3, j1, PAY
  jjz j3, po_said
  jld j6, j4, 16                ; filled: against the empty, if it was said so
  jjz j6, po_first
  jst j4, j1, RENT
  jldi j2, 0
  jcall pulse
  jldi j1, 0
  jld j4, j1, RENT
  jld j3, j1, PAY
po_first:
  jld j2, j4, 8                 ; and against the first that filled it
  jjnz j2, po_two
  jst j3, j4, 8
  jret
po_two:
  jsub j6, j2, j3
  jjz j6, po_done
  jjmp pulse
po_said:
  jld j6, j4, 16
  jjnz j6, po_done
  jldi j6, 1
  jst j6, j4, 16
  jld j3, j4, 8
  jjz j3, po_done
  jldi j2, 0
  jjmp pulse
po_done:
  jret
po_test:
  jadd j5, j2, j1
  jld j2, j1, ROOMR
  jldi j3, 24
  jcall t_find
  jld j6, j4, 0
  jjz j6, po_done               ; nothing asleep there
  jld j3, j1, PAY
  jjz j3, pt_said
  jld j6, j4, 16
  jjz j6, pt_first
  jst j4, j1, RENT
  jldi j2, 0
  jcall pulse
  jldi j1, 0
  jld j4, j1, RENT
  jld j3, j1, PAY
pt_first:
  jld j2, j4, 8
  jjz j2, po_done
  jsub j6, j2, j3
  jjz j6, po_done
  jjmp pulse
pt_said:
  jld j6, j4, 16
  jjnz j6, po_done
  jld j3, j4, 8
  jjz j3, po_done
  jldi j2, 0
  jjmp pulse

; A pulse between fillings j2 (the one waiting) and j3 (the one that arrived) of the floor FLOOR: awake, its difference
; is born or counted once more, and so are its fillings; knocking, it is looked up among the pieces, and so is the
; blind pulse beside it. Uses j1-j8.
pulse:
  jldi j1, 0
  jst j2, j1, PA
  jst j3, j1, PB
  jcall d_make
  jld j2, j1, ROOMD
  jldi j3, 48
  jcall t_find
  jld j6, j1, CAT
  jst j6, j1, RC
  jldi j7, 3
  jshl j6, j6, j7
  jld j7, j1, TESTING
  jjz j7, pl_awake
  jld j7, j6, TPULC
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j6, TPULC
  jld j7, j4, 40                ; a piece: it saves bits
  jldi j8, 63
  jsar j8, j7, j8
  jjnz j8, pl_blind
  jjz j7, pl_blind
  jld j7, j6, TPCEC
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j6, TPCEC
pl_blind:                       ; the blind: the waiting filling against the one that arrived before, on this floor
  jld j5, j1, FLOOR
  jldi j7, 3
  jshl j5, j5, j7
  jld j3, j5, PREVX
  jld j7, j1, PB
  jst j7, j5, PREVX
  jjz j3, pl_done
  jld j6, j1, RC
  jldi j7, 3
  jshl j6, j6, j7
  jld j7, j6, TBLN
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j6, TBLN
  jld j2, j1, PA
  jcall d_make
  jld j2, j1, ROOMD
  jldi j3, 48
  jcall t_find
  jld j7, j4, 40
  jldi j8, 63
  jsar j8, j7, j8
  jjnz j8, pl_done
  jjz j7, pl_done
  jld j6, j1, RC
  jldi j7, 3
  jshl j6, j6, j7
  jld j7, j6, TBLC
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j6, TBLC
  jret
pl_awake:
  jld j7, j4, 0
  jjnz j7, pl_count
  jst j5, j4, 0
  jld j7, j1, DLO
  jst j7, j4, 8
  jld j7, j1, DHI
  jst j7, j4, 16
  jld j7, j1, DKT
  jst j7, j4, 24
  jld j7, j6, NDIFC
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j6, NDIFC
pl_count:
  jld j7, j4, 32
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j4, 32
  jld j7, j6, NPULC
  jadd j7, j7, j8
  jst j7, j6, NPULC
  jld j2, j1, DLO               ; its fillings, and its floor
  jcall f_bump
  jld j2, j1, DHI
  jcall f_bump
  jld j5, j1, FLOOR
  jldi j7, 3
  jshl j5, j5, j7
  jld j7, j5, NFL
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j5, NFL
pl_done:
  jret

; The difference of fillings j2 and j3 on the floor FLOOR: DLO, DHI (without their order; a door's side bit apart),
; DKT (the floor, and whether it turned), CAT, and its key -> j5. Uses j1-j8.
d_make:
  jldi j1, 0
  jld j4, j1, FLOOR
  jldi j5, 0                    ; a door: did it turn? (the side bit), and the fillings without it
  jldi j6, 3
  jsub j6, j4, j6
  jjnz j6, dm_order
  jldi j6, 48
  jshr j7, j2, j6
  jshr j8, j3, j6
  jxor j5, j7, j8
  jldi j6, 1
  jand j5, j5, j6
  jld j6, j1, M48
  jand j2, j2, j6
  jand j3, j3, j6
dm_order:
  jsub j6, j3, j2               ; low and high
  jldi j7, 63
  jsar j6, j6, j7
  jjz j6, dm_ordered
  jadd j6, j2, j1
  jadd j2, j3, j1
  jadd j3, j6, j1
dm_ordered:
  jst j2, j1, DLO
  jst j3, j1, DHI
  jldi j6, 8
  jshl j6, j5, j6
  jor j6, j6, j4
  jst j6, j1, DKT
  jcall d_cat_of
  jldi j1, 0
  jst j5, j1, CAT
  jld j2, j1, FNVO
  jld j3, j1, DKT
  jcall hw
  jld j3, j1, DLO
  jcall hw
  jld j3, j1, DHI
  jcall hw
  jjnz j2, dm_key
  jldi j2, 1
dm_key:
  jadd j5, j2, j1
  jret

; The place of the filling j2 of the floor FLOOR among the fillings -> j4. Uses j1-j8.
f_find:
  jldi j1, 0
  jadd j3, j2, j1
  jld j2, j1, FNVO
  jst j3, j1, GN
  jld j3, j1, FLOOR
  jcall hw
  jld j3, j1, GN
  jcall hw
  jjnz j2, ff_key
  jldi j2, 1
ff_key:
  jadd j5, j2, j1
  jld j2, j1, ROOMF
  jldi j3, 16
  jcall t_find
  jst j5, j4, 0
  jret

; The filling j2 of the floor FLOOR took part in one more pulse. Uses j1-j8.
f_bump:
  jcall f_find
  jld j6, j4, 8
  jjnz j6, fb_old
  jld j5, j1, FLOOR
  jldi j7, 3
  jshl j5, j5, j7
  jld j7, j5, UFL
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j5, UFL
fb_old:
  jldi j8, 1
  jadd j6, j6, j8
  jst j6, j4, 8
  jret

; The judge of harmony: every difference born gets the bits it saves as a piece (in 2^-16 of a bit): n * (log2(2N) +
; log2(n) - log2(c(low)) - log2(c(high))) - 2 * log2(U), on its floor. Uses j1-j12.
judge:
  jldi j9, 0
  jldi j1, 0
  jld j10, j1, RMASK
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j3, 48
    jmul j3, j9, j3
    jld j2, j1, ROOMD
    jadd j3, j3, j2
    jld j2, j3, 0
    jjz j2, ju_next
    jst j3, j1, GE
    jld j2, j3, 24
    jst j2, j1, DKT
    jldi j4, 255
    jand j2, j2, j4
    jst j2, j1, FLOOR
    jld j2, j3, 8
    jst j2, j1, DLO
    jld j2, j3, 16
    jst j2, j1, DHI
    jld j11, j1, FLOOR
    jldi j2, 3
    jshl j11, j11, j2
    jld j2, j11, NFL            ; log2(2N) + log2(n)
    jadd j2, j2, j2
    jcall lg16
    jst j2, j1, GS
    jld j3, j1, GE
    jld j2, j3, 32
    jcall lg16
    jld j3, j1, GS
    jadd j3, j3, j2
    jst j3, j1, GS
    jld j2, j1, DLO             ; - log2(c(low)) - log2(c(high))
    jcall f_find
    jld j2, j4, 8
    jcall lg16
    jld j3, j1, GS
    jsub j3, j3, j2
    jst j3, j1, GS
    jld j2, j1, DHI
    jcall f_find
    jld j2, j4, 8
    jcall lg16
    jld j3, j1, GS
    jsub j3, j3, j2
    jld j4, j1, GE              ; times n
    jld j4, j4, 32
    jmul j3, j3, j4
    jst j3, j1, GS
    jld j11, j1, FLOOR          ; - 2 log2(U): its name
    jldi j2, 3
    jshl j11, j11, j2
    jld j2, j11, UFL
    jcall lg16
    jld j3, j1, GS
    jsub j3, j3, j2
    jsub j3, j3, j2
    jld j4, j1, GE
    jst j3, j4, 40
    jldi j2, 63
    jsar j2, j3, j2
    jjnz j2, ju_next
    jjz j3, ju_next
    jcall d_cat_of
    jldi j3, 3
    jshl j5, j5, j3
    jld j3, j5, NADC
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j5, NADC
  ju_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret

; log2 of j2 (1 or more) in 2^-16 of a bit -> j2: the highest bit, then sixteen bits of the rest by squaring.
; Uses j1, j3-j6 (j1 = 0 after).
lg16:
  jldi j1, 0
  jldi j3, 0
  jldi j5, 1
  jshr j4, j2, j5
  jwhile j4
    jadd j3, j3, j5
    jshr j4, j4, j5
  jwend
  jldi j4, 31                   ; the mantissa in [2^31, 2^32)
  jsub j4, j4, j3
  jldi j6, 63
  jsar j6, j4, j6
  jjnz j6, lg_down
  jshl j2, j2, j4
  jjmp lg_frac
lg_down:
  jsub j4, j1, j4
  jshr j2, j2, j4
lg_frac:
  jldi j4, 16
  jwhile j4
    jmul j2, j2, j2
    jldi j5, 31
    jshr j2, j2, j5
    jldi j5, 32
    jshr j6, j2, j5
    jshr j2, j2, j6
    jadd j3, j3, j3
    jadd j3, j3, j6
    jldi j5, 1
    jsub j4, j4, j5
  jwend
  jadd j2, j3, j1
  jret

; The kind of the difference DKT, DLO -> j5: 1 gemelos, 2 interruptores (one filling empty), 3 asociados, 4 puertas.
; Uses j1, j5-j7.
d_cat_of:
  jldi j1, 0
  jld j6, j1, DKT
  jldi j7, 255
  jand j6, j6, j7
  jldi j5, 1
  jldi j7, 1
  jsub j7, j6, j7
  jjz j7, dc_done
  jldi j5, 4
  jldi j7, 3
  jsub j7, j6, j7
  jjz j7, dc_done
  jldi j5, 2
  jld j7, j1, DLO
  jjz j7, dc_done
  jldi j5, 3
dc_done:
  jret

; The kind CAT: its line, and its ten pieces that save the most bits (each written has its bits turned negative, so
; the next round finds the next). Its counts go into j0. Uses j1-j14.
kind_report:
  jldi j1, 0
  jld j2, j1, CAT
  jldi j3, 1
  jsub j2, j2, j3
  jldi j3, 6
  jshl j2, j2, j3
  jldi j1, S_KIND
  jadd j1, j1, j2
  jcall puts
  jld j9, j1, CAT
  jldi j3, 3
  jshl j9, j9, j3
  jldi j1, S_PUL
  jcall puts
  jld j2, j9, NPULC
  jcall putmix
  jldi j1, S_DIF
  jcall puts
  jld j2, j9, NDIFC
  jcall putmix
  jldi j1, S_PCS
  jcall puts
  jld j2, j9, NADC
  jcall putmix
  jldi j1, S_TPUL
  jcall puts
  jld j2, j9, TPULC
  jcall putmix
  jldi j1, S_TPCE
  jcall puts
  jld j2, j9, TPCEC
  jcall putmix
  jld j2, j9, TPCEC
  jld j3, j9, TPULC
  jcall putpct
  jldi j1, S_BLIND
  jcall puts
  jld j2, j9, TBLC
  jcall putmix
  jldi j2, 47
  jcall putch
  jld j2, j9, TBLN
  jcall putmix
  jld j2, j9, TBLC
  jld j3, j9, TBLN
  jcall putpct
  jldi j2, 10
  jcall putch
  jldi j2, 10
  jst j2, j1, TOPN
  jwhile j2
    jldi j1, 0                  ; the piece that saves the most bits left in this kind
    jldi j11, 0
    jldi j12, 0
    jldi j9, 0
    jld j10, j1, RMASK
    jldi j2, 1
    jadd j10, j10, j2
    jwhile j10
      jldi j3, 48
      jmul j3, j9, j3
      jld j2, j1, ROOMD
      jadd j3, j3, j2
      jld j2, j3, 0
      jjz j2, kr_next
      jld j2, j3, 40
      jsub j4, j11, j2
      jldi j5, 63
      jsar j4, j4, j5
      jjz j4, kr_next
      jld j4, j3, 24
      jst j4, j1, DKT
      jld j4, j3, 8
      jst j4, j1, DLO
      jcall d_cat_of
      jld j6, j1, CAT
      jsub j6, j5, j6
      jjnz j6, kr_next
      jld j11, j3, 40
      jadd j12, j3, j1
    kr_next:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j11, kr_done
    jldi j2, 0
    jsub j2, j2, j11
    jst j2, j12, 40
    jst j12, j1, RENT
    jldi j2, 32
    jcall putch
    jldi j2, 32
    jcall putch
    jldi j2, 16                 ; its bits, to a tenth
    jshr j2, j11, j2
    jcall putnum
    jldi j2, 44
    jcall putch
    jldi j2, 0
    jshi j2, 0FFFFh
    jand j2, j11, j2
    jldi j3, 10
    jmul j2, j2, j3
    jldi j3, 16
    jshr j2, j2, j3
    jcall putnum
    jldi j1, S_BITS
    jcall puts
    jld j12, j1, RENT
    jld j2, j12, 32
    jcall putnum
    jldi j1, S_PAIRS
    jcall puts
    jld j12, j1, RENT
    jcall d_print
    jldi j2, 10
    jcall putch
    jldi j1, 0
    jld j2, j1, TOPN
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, TOPN
  jwend
kr_done:
  jret

; j2 written, and into j0. Uses j1-j4, j12-j14.
putmix:
  jldi j1, 0
  jadd j12, j2, j1
  jcall mix
  jjmp putnum

; " (x,y%)" of j2 over j3. Uses j1-j4.
putpct:
  jldi j1, 1000
  jmul j2, j2, j1
  jdiv j2, j2, j3
  jldi j1, 0
  jst j2, j1, GN
  jldi j2, 32
  jcall putch
  jldi j2, 40
  jcall putch
  jldi j1, 0
  jld j2, j1, GN
  jldi j3, 10
  jdiv j2, j2, j3
  jcall putnum
  jldi j2, 44
  jcall putch
  jld j2, j1, GN
  jldi j3, 10
  jdiv j4, j2, j3
  jmul j4, j4, j3
  jsub j2, j2, j4
  jcall putnum
  jldi j2, 37
  jcall putch
  jldi j2, 41
  jjmp putch

; The difference at j12, written. Uses j1-j12.
d_print:
  jldi j1, 0
  jld j2, j12, 24
  jst j2, j1, DKT
  jld j2, j12, 8
  jst j2, j1, DLO
  jld j2, j12, 16
  jst j2, j1, DHI
  jcall d_cat_of
  jldi j6, 1
  jsub j6, j5, j6
  jjnz j6, dp_switch
  jld j2, j1, DLO               ; gemelos: the two letters
  jcall putletter
  jldi j2, 47
  jcall putch
  jld j2, j1, DHI
  jjmp putletter
dp_switch:
  jldi j6, 2
  jsub j6, j5, j6
  jjnz j6, dp_mates
  jld j2, j1, DHI               ; interruptores: the word taken out
  jjmp putword
dp_mates:
  jldi j6, 3
  jsub j6, j5, j6
  jjnz j6, dp_door
  jld j2, j1, DLO               ; asociados: the two words
  jcall putword
  jldi j2, 47
  jcall putch
  jld j2, j1, DHI
  jjmp putword
dp_door:
  jld j2, j1, DLO               ; puertas: the two ways, and whether it turned
  jcall putpair
  jldi j2, 32
  jcall putch
  jldi j2, 47
  jcall putch
  jldi j2, 32
  jcall putch
  jldi j1, 0
  jld j2, j1, DHI
  jcall putpair
  jldi j1, 0
  jld j2, j1, DKT
  jldi j3, 8
  jshr j2, j2, j3
  jjz j2, dp_done
  jldi j1, S_TURN
  jjmp puts
dp_done:
  jret

; The two words between of a door's filling j2. Uses j1-j6.
putpair:
  jldi j1, 0
  jldi j3, 24
  jshr j6, j2, j3
  jst j6, j1, RENT
  jldi j3, 0
  jshi j3, 0FFh
  jshi j3, 0FFFFh
  jand j2, j2, j3
  jcall putword
  jldi j2, 32
  jcall putch
  jld j2, j1, RENT
  jldi j3, 0
  jshi j3, 0FFh
  jshi j3, 0FFFFh
  jand j2, j2, j3
  jjmp putword

; A letter byte j2 (the second byte of one of U+00C0..U+00FF is written with its first). Uses j1-j3.
putletter:
  jldi j1, 80h
  jsub j1, j2, j1
  jldi j3, 63
  jsar j1, j1, j3
  jjnz j1, putch
  jst j2, j1, RENT
  jldi j2, 0C3h
  jcall putch
  jldi j1, 0
  jld j2, j1, RENT
  jjmp putch

include 'lectura.inc'
