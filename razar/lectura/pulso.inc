; The pulse's machinery, shared by pulso and pregunta (the rule, the floors, the requests and the judge are told at the
; top of pulso.jsm). learn_pulses hangs the requests of the renglones it learns from (lectura.inc's is_train), wakes
; the pulses and judges every difference; all_floors with TESTING 1 then knocks with what it never read. The program
; that includes it keeps its own variables from 1600h on and includes it before lectura.inc.
ROOMC = 1200h                   ; how often each word was read where it learns, by number
ROOMR = 1208h                   ; the requests: {key, what filled it first, said empty} per place (24 bytes)
ROOMS = 1210h                   ; the forms seen: {hash of key and filling, key, filling, times, first place, floor,
                                ; its question's bits} per place (56 bytes)
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
PN    = 1568h                   ; the questions: the exceptions, and log2 of all
ACC   = 1588h

; The requests of the renglones it learns from hung, the pulses woken and every difference judged. Uses j1-j14.
learn_pulses:
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
jldi j4, 56
jmul j11, j3, j4
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
jret

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
  jld j3, j1, PAY
  jcall hw                      ; seen before?
  jjnz j2, po_seen
  jldi j2, 1
po_seen:
  jadd j5, j2, j1
  jld j2, j1, ROOMS
  jldi j3, 56
  jcall t_find
  jld j6, j4, 0
  jjnz j6, po_again
  jst j5, j4, 0                 ; a new form: its key, filling, where it first was, its floor
  jld j6, j1, KEY
  jst j6, j4, 8
  jld j6, j1, PAY
  jst j6, j4, 16
  jld j6, j1, JJ
  jst j6, j4, 32
  jld j6, j1, FLOOR
  jst j6, j4, 40
  jldi j6, 1
  jst j6, j4, 24
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
po_again:                       ; a form seen before: once more
  jld j6, j4, 24
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j4, 24
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
  jld j2, j1, DHI               ; interruptores: the word taken out, and if it is the switch distilled
  jcall putword
  jldi j1, 0
  jld j2, j1, DHI
  jcall n_flags
  jldi j4, 1
  jand j3, j3, j4
  jjz j3, dp_done
  jldi j1, S_FLIPS
  jjmp puts
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

