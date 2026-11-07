; The pulse's machinery, shared by pulso and pregunta (the rule, the floors, the requests and the judge are told at the
; top of pulso.jsm). learn_pulses hangs the requests of the renglones it learns from (lectura.inc's is_train), wakes
; the pulses and judges every difference; all_floors with TESTING 1 then knocks with what it never read. The program
; that includes it keeps its own variables from 1600h on and includes it before lectura.inc.
ROOMC = 1200h                   ; how often each word was read where it learns, by number
ROOMR = 1208h                   ; the requests: {key, its silhouette (a filling, or the empty as 1 << 62), its weight}
                                ; (24 bytes)
ROOMS = 1F20h                   ; the forms seen: {hash of key and filling, key, filling, times, first place, floor,
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
TPT   = 1F40h                   ; what each place testified: {key of place and difference} (a growing table)
PDK   = 1F60h                   ; the key of the difference of a pulse
PASN  = 1F68h                   ; the passes: this one (from 0), how many left
PASL  = 1F70h
TRD   = 1F00h                   ; by difference: {key, in how many readings it was met, the last (from 1), what it weighed in its first, the reading it was born in, its evidence judged, its bits a pair} (growing)
TFW   = 1780h                   ; by filling: {key, its pulses weighed} (a growing table)
NFLW  = 1750h                   ; by floor (8 bytes each, from floor 0): its pulses weighed
TRC   = 17D0h                   ; by reading: {key of a filling or a floor and the reading, its pulses} (growing)
GNE   = 17F0h                   ; judging: the pairs of the difference in its birth reading, that reading
GBR   = 17F8h
ROOMUF = 12F8h                  ; the concepts: by word {its root, its best bits, its best partner}; they exist (1)
CONOK = 17A0h
CPA   = 17A8h                   ; (two roots)
CPB   = 17B0h
TCOC  = 17B8h                   ; knocking: associates pulses in one concept, real and blind
TCOB  = 17C0h
LPDONE = 17C8h                  ; the rooms of a reading exist (1)
GPAC  = 1F78h                   ; the instincts (0: unset, the default): patience (the name of a piece costs GPAC/2
GFIRM = 1F80h                   ; log2 U), firmness (what the same move adds to a silhouette)
PW    = 1770h                   ; the weight of the pulse being counted (2^16 is one), a filling place
FBP   = 1778h
TMEM  = 1548h                   ; its memory: by difference {key, its evidence, its bits a pair, low, high, floor} (growing)
GTRD  = 1F88h
SAVC  = 1520h                   ; by kind (8 bytes each, from kind 0): the bits its pieces save
SMSK  = 1F28h                   ; (the forms are a growing table: its places minus 1)
FORMS = 12F0h                   ; 1: keep the forms seen (for the irregular), set before learn_pulses
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
ROOMFX = 15A0h                  ; by word: how often it was the frame kept (foundation), how often what changed
ROOMVR = 15A8h                  ; (furniture); the frame of the request being hung; the pulses of the same place with
ROOMHL = 15C8h                  ; another word, and how many
NHL   = 15D0h
KW1   = 15B0h
KW2   = 15B8h
KW3   = 15C0h

; The requests of the renglones it learns from hung, the pulses woken and every difference judged. Uses j1-j14.
learn_pulses:
jldi j1, 0                      ; read again in the same program (the instincts' duels): every table emptied, its room
jld j2, j1, LPDONE              ; reused, so a reading costs the same memory however many there are
jjz j2, lp_first
jcall lp_clear
jjmp lp_count
lp_first:
jldi j1, 0                      ; the foundation and the furniture: by word, how often it was kept, how often it changed
jld j11, j1, NV
jldi j2, 4
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMFX
jld j2, j1, NV
jldi j3, 3
jshl j2, j2, j3
jadd j2, j13, j2
jst j2, j1, ROOMVR
jld j11, j1, NTOK                ; and every pulse of the same place with another word: its frame and its two fillings
jldi j2, 120                     ; (at most three requests of the words floor per unit, one pulse each; 40 bytes)
jmul j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMHL
jst j1, j1, NHL
jldi j1, 0                      ; the words read where it learns
jld j11, j1, NUNITS
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMC
lp_count:
jldi j1, 0
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

jldi j1, 0                      ; (a reading after the first: its tables are there, emptied)
jld j2, j1, LPDONE
jjnz j2, lp_awake
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
jld j2, j1, FORMS               ; the forms, only if asked for
jjz j2, lp_noforms
jldi j2, ROOMS                  ; (one of each kind: it grows to what it holds, crece.inc)
jldi j3, 56
jcall pl_new
lp_noforms:
jldi j2, TPT                    ; what each place already testified (it grows to what it holds)
jldi j3, 8
jcall pl_new
jldi j2, TRD                    ; in how many readings each difference was met, and each filling weighed
jldi j3, 56
jcall pl_new
jldi j2, TFW
jldi j3, 16
jcall pl_new
jldi j2, TRC                    ; what each filling and each floor pulsed in each reading
jldi j3, 16
jcall pl_new
jldi j1, 0
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
jldi j1, 0
jst j13, j1, ROOMD
jldi j2, 1                      ; (its rooms exist: a reading after this one empties and reuses them)
jst j2, j1, LPDONE

lp_awake:
jldi j1, 0                      ; awake: what it learns from hangs its requests, and the pulses are born
jst j1, j1, TESTING
jst j1, j1, PASN                ; read as many times as "p" tells after K (0: once); each pass meets the silhouettes the
jld j2, j1, NPAS                ; ones before perfected (Capitan: "it will not widen: the majority has it digested")
jldi j3, 255
jand j2, j2, j3
jjnz j2, lp_passes
jldi j2, 1
lp_passes:
jst j2, j1, PASL
jwhile j2
  jcall all_floors
  jldi j1, 0
  jld j2, j1, PASN
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, PASN
  jld j2, j1, PASL
  jsub j2, j2, j3
  jst j2, j1, PASL
jwend
jcall judge
jcall concepts
jret
jret

; Every table and count of a reading emptied, in the rooms it already has (a reading after the first). Uses j1-j8.
lp_clear:
  jldi j1, 0
  jld j2, j1, ROOMFX            ; the foundation and the furniture
  jld j3, j1, NV
  jldi j4, 4
  jshl j3, j3, j4
  jcall zfill
  jld j2, j1, ROOMHL            ; the pulses kept for the house
  jld j3, j1, NHL
  jldi j4, 40
  jmul j3, j3, j4
  jcall zfill
  jst j1, j1, NHL
  jld j2, j1, ROOMC             ; the words read where it learns
  jld j3, j1, NUNITS
  jldi j4, 3
  jshl j3, j3, j4
  jcall zfill
  jld j5, j1, RMASK             ; the requests, the fillings, the differences
  jldi j4, 1
  jadd j5, j5, j4
  jst j5, j1, PDK
  jld j2, j1, ROOMR
  jldi j4, 24
  jmul j3, j5, j4
  jcall zfill
  jld j5, j1, PDK
  jld j2, j1, ROOMF
  jldi j4, 4
  jshl j3, j5, j4
  jcall zfill
  jld j5, j1, PDK
  jld j2, j1, ROOMD
  jldi j4, 48
  jmul j3, j5, j4
  jcall zfill
  jldi j2, TPT                  ; the growing ones, in the places they grew to
  jcall pl_clear
  jldi j2, TRD
  jcall pl_clear
  jldi j2, TFW
  jcall pl_clear
  jldi j2, TRC
  jcall pl_clear
  jld j2, j1, FORMS
  jjz j2, lc_noforms
  jldi j2, ROOMS
  jcall pl_clear
lc_noforms:
  jldi j2, NPULC                ; the counts: by kind and floor, the blind, the bits
  jldi j3, 248h
  jcall zfill
  jldi j2, NFLW
  jldi j3, 32
  jcall zfill
  jst j1, j1, NREQ
  jst j1, j1, TCOC
  jst j1, j1, TCOB
  jst j1, j1, CONOK
  jst j1, j1, PASN
  jret

; j3 bytes from j2 set to 0 (eight at a time). Uses j1-j4.
zfill:
  jldi j1, 0
  jldi j4, 8
  jwhile j3
    jst j1, j2, 0
    jadd j2, j2, j4
    jsub j3, j3, j4
  jwend
  jret

; The growing table at j2 emptied, in the places it has. Uses j1-j6.
pl_clear:
  jldi j1, 0
  jst j1, j2, 16
  jld j3, j2, 8
  jldi j4, 1
  jadd j3, j3, j4
  jld j4, j2, 24
  jmul j3, j3, j4
  jld j2, j2, 0
  jjmp zfill

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
    jld j3, j9, 0              ; the frame kept: three words
    jst j3, j1, KW1
    jld j3, j9, 8
    jst j3, j1, KW2
    jld j3, j9, 16
    jst j3, j1, KW3
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
    jld j3, j9, 0              ; the frame kept: three words
    jst j3, j1, KW1
    jld j3, j9, 16
    jst j3, j1, KW2
    jld j3, j9, 24
    jst j3, j1, KW3
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
    jld j3, j9, 0              ; the frame kept: three words
    jst j3, j1, KW1
    jld j3, j9, 8
    jst j3, j1, KW2
    jld j3, j9, 24
    jst j3, j1, KW3
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
    jcall organ                 ; and the mold it grew itself, if it has one (organo.inc)
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

; A request: key j2, filled by j3 (0: said empty). Its floor's depth (Capitan: "it can be deeper, but no depth wasted: if
; it is 3, do not reach 4"): a request keeps its last moves, as many as its floor's depth, and the next one wakes the
; pulse with each that is another, and goes first. Awake it hangs and wakes; knocking it only wakes. When FORMS asks
; for them, the forms the irregular is studied over are kept, one of each kind (Capitan: "not every form, one of each
; kind; the rest is the weights"): a place of the words' floor said plain, and said with the switch (distilled before), each
; with where it was first and its weight, how often. Uses j1-j8.
post:
  jldi j1, 0
  jjnz j2, po_key
  jldi j2, 1
po_key:
  jst j2, j1, KEY
  jst j3, j1, PAY
  jld j4, j1, TESTING
  jjnz j4, po_test
  jld j4, j1, FORMS
  jjz j4, po_req
  jld j4, j1, PASN              ; (counted on the first pass only: the others would only repeat their weight)
  jjnz j4, po_req
  jld j4, j1, FLOOR             ; of a kind kept: the words' floor, plain or with the switch
  jldi j5, 2
  jsub j4, j4, j5
  jjnz j4, po_req
  jld j2, j1, PAY
  jjz j2, po_kind
  jcall n_flags
  jldi j4, 1
  jand j3, j3, j4
  jjz j3, po_req
po_kind:
  jldi j1, 0
  jld j2, j1, KEY
  jld j3, j1, PAY
  jcall hw                      ; seen before?
  jjnz j2, po_seen
  jldi j2, 1
po_seen:
  jadd j5, j2, j1
  jldi j2, ROOMS
  jcall pl_take
  jjz j6, po_again              ; a new form: its key, filling, where it first was, its floor
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
  jjmp po_req
po_again:                       ; a form seen before: once more
  jld j6, j4, 24
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j4, 24
po_req:
  jldi j1, 0
  jld j5, j1, KEY
  jld j2, j1, ROOMR
  jldi j3, 24
  jcall t_find
  jld j6, j4, 0
  jjnz j6, po_old
  jst j5, j4, 0                 ; a new request falls asleep: its silhouette is its first move, weight one
  jld j6, j1, NREQ
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j1, NREQ
  jcall po_code
  jst j3, j4, 8
  jldi j3, 1
  jst j3, j4, 16
  jret
po_old:
  jst j4, j1, RENT
  jcall po_meet
  jldi j1, 0                    ; and the silhouette is perfected: the same move weighs it more, another less, and
  jld j4, j1, RENT              ; when its weight is gone the move that came takes its place (the majority of all,
  jcall po_code                 ; with two numbers: Boyer and Moore)
  jld j2, j4, 8
  jsub j2, j2, j3
  jld j5, j4, 16
  jldi j6, 1
  jjnz j2, po_other
  jld j7, j1, GFIRM             ; (the same move weighs it as much as the firmness instinct; unset: one)
  jjnz j7, po_firm
  jldi j7, 1
po_firm:
  jadd j5, j5, j7
  jst j5, j4, 16
  jret
po_other:
  jjz j5, po_take
  jsub j5, j5, j6
  jst j5, j4, 16
  jret
po_take:
  jst j3, j4, 8
  jst j6, j4, 16
po_done:
  jret
po_test:
  jadd j5, j2, j1
  jld j2, j1, ROOMR
  jldi j3, 24
  jcall t_find
  jld j6, j4, 0
  jjz j6, po_done               ; nothing asleep there
  jjmp po_meet

; The move PAY as a silhouette keeps it -> j3: a filling, or the empty as a code no filling has (1 << 62). Uses j1,
; j3, j5.
po_code:
  jldi j1, 0
  jld j3, j1, PAY
  jjnz j3, pc_done
  jldi j3, 1
  jldi j5, 62
  jshl j3, j3, j5
pc_done:
  jret

; The move PAY against the silhouette of the request at j4 {key, its silhouette, its weight}: if it is another, the
; pulse between the two (the empty, if one of them is, waits: j2 = 0). Every move is met with what the place has
; been so far, all of it, and no case is kept (Capitan: "with all of them, and the silhouette is the only thing
; perfected: we do not need the case"). Uses j1-j8.
po_meet:
  jldi j1, 0
  jld j2, j4, 8
  jld j3, j1, PAY
  jldi j6, 1
  jldi j7, 62
  jshl j6, j6, j7
  jsub j7, j2, j6
  jjnz j7, mv_filled
  jjz j3, po_done               ; empty after empty: the same move
  jldi j2, 0
  jjmp pulse
mv_filled:
  jjnz j3, mv_both
  jadd j3, j2, j1               ; empty after a filling
  jldi j2, 0
  jjmp pulse
mv_both:
  jsub j6, j2, j3
  jjz j6, po_done               ; the same move
  jjmp pulse

; A pulse between fillings j2 (the one waiting) and j3 (the one that arrived) of the floor FLOOR: awake, its difference
; is born or counted once more, and so are its fillings; knocking, it is looked up among the pieces, and so is the
; blind pulse beside it. Awake, a place testifies once to each difference: a place that alternates (A, B, A, B) says
; the same again, and the judge counts independent pairs. Uses j1-j8.
pulse:
  jldi j1, 0
  jst j2, j1, PA
  jst j3, j1, PB
  jcall d_make
  jld j6, j1, TESTING
  jjnz j6, pu_any
  jst j5, j1, PDK
  jld j2, j1, KEY               ; this place and this difference, in this reading: said before?
  jadd j3, j5, j1
  jcall hw
  jld j3, j1, PASN
  jcall hw
  jjnz j2, pu_k
  jldi j2, 1
pu_k:
  jadd j5, j2, j1
  jldi j2, TPT
  jcall pl_take
  jjz j6, pl_done                ; said before: nothing new
  jld j5, j1, PDK               ; in how many readings this difference was met, k: the pulse weighs 1/k (what is
  jldi j2, TRD                  ; new to this reading teaches the most, even if it is the obvious)
  jcall pl_take
  jldi j1, 0
  jjz j6, pu_born               ; (a difference new: the reading it is born in)
  jld j7, j1, PASN
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j4, 32
pu_born:
  jld j7, j1, PASN
  jldi j8, 1
  jadd j7, j7, j8
  jld j3, j4, 16
  jsub j3, j3, j7
  jjz j3, pu_kd
  jst j7, j4, 16
  jld j3, j4, 8
  jadd j3, j3, j8
  jst j3, j4, 8
pu_kd:
  jld j3, j4, 8
  jldi j2, 1
  jldi j7, 16
  jshl j2, j2, j7
  jdiv j2, j2, j3
  jst j2, j1, PW
  jld j3, j4, 8                 ; (in its first reading: what it gathers there, its n1)
  jldi j7, 1
  jsub j3, j3, j7
  jjnz j3, pu_first
  jld j3, j4, 24
  jadd j3, j3, j2
  jst j3, j4, 24
pu_first:
  jld j5, j1, PDK
pu_any:
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
  jld j7, j1, RC                ; (first: two associates of one concept?)
  jldi j8, 3
  jsub j7, j7, j8
  jjnz j7, pb_go
  jcall cp_same
  jldi j1, 0
  jld j7, j1, TCOC
  jadd j7, j7, j3
  jst j7, j1, TCOC
pb_go:
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
  jld j7, j1, RC                ; (the blind pair: one concept?)
  jldi j8, 3
  jsub j7, j7, j8
  jjnz j7, pb_key
  jst j5, j1, PDK
  jcall cp_same
  jldi j1, 0
  jld j7, j1, TCOB
  jadd j7, j7, j3
  jst j7, j1, TCOB
  jld j5, j1, PDK
pb_key:
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
  jld j7, j4, 40                ; (and weighed: until the judge, its bits' place holds its pairs weighed)
  jld j8, j1, PW
  jadd j7, j7, j8
  jst j7, j4, 40
  jldi j8, 1
  jld j7, j6, NPULC
  jadd j7, j7, j8
  jst j7, j6, NPULC
  jld j7, j1, CAT               ; the same place, another word: kept for the house (frame and fillings)
  jldi j8, 3
  jsub j7, j7, j8
  jjnz j7, pl_fill
  jld j7, j1, NTOK              ; (its room holds three a unit: never past it)
  jldi j8, 3
  jmul j8, j7, j8
  jld j7, j1, NHL
  jsub j8, j7, j8
  jldi j2, 63
  jsar j8, j8, j2
  jjz j8, pl_fill
  jld j7, j1, NHL
  jldi j8, 40
  jmul j8, j7, j8
  jld j2, j1, ROOMHL
  jadd j8, j8, j2
  jld j2, j1, KW1
  jst j2, j8, 0
  jld j2, j1, KW2
  jst j2, j8, 8
  jld j2, j1, KW3
  jst j2, j8, 16
  jld j2, j1, DLO
  jst j2, j8, 24
  jld j2, j1, DHI
  jst j2, j8, 32
  jldi j2, 1
  jadd j7, j7, j2
  jst j7, j1, NHL
pl_fill:
  jldi j1, 0
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
  jld j7, j5, NFLW
  jld j8, j1, PW
  jadd j7, j7, j8
  jst j7, j5, NFLW
  jld j2, j1, FNVO              ; (and its floor, in this reading)
  jld j3, j1, FLOOR
  jldi j4, 1
  jldi j5, 32
  jshl j4, j4, j5
  jor j3, j3, j4
  jcall hw
  jadd j5, j2, j1
  jjmp tr_add
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
  jldi j1, 0                    ; (and weighed)
  jst j4, j1, FBP
  jldi j2, TFW
  jcall pl_take
  jld j6, j4, 8
  jld j7, j1, PW
  jadd j6, j6, j7
  jst j6, j4, 8
  jcall tr_add                  ; (and in this reading)
  jldi j1, 0
  jld j4, j1, FBP
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
    jld j4, j1, GE              ; each difference is judged in the reading it was born in, all at that one scale
    jld j5, j4, 0               ; (Capitan: "microscope, eyes, telescope": what is born late is seen at the size of its
    jldi j2, TRD                ; own reading, what repeats is gathered into one point; counts of different readings are
    jcall pl_find               ; never set against each other): its pairs there, the floor's pulses there, and its
    jld j2, j4, 24              ; two fillings' there
    jldi j3, 16
    jsar j2, j2, j3
    jst j2, j1, GNE
    jst j4, j1, GTRD            ; what it carries from lives before (its memory): its evidence is the larger of this
    jld j5, j4, 0               ; reading and the past, never the two added (reading the same book again is no new
    jldi j1, 0
    jld j2, j1, TMEM            ; (no memory: nothing carried)
    jjz j2, gm_none
    jldi j2, TMEM               ; evidence)
    jcall pl_find
    jld j3, j4, 0
    jjz j3, gm_none
    jld j3, j4, 8
    jld j2, j1, GNE
    jsub j6, j2, j3
    jldi j7, 63
    jsar j6, j6, j7
    jjz j6, gm_none
    jst j3, j1, GNE
gm_none:
    jld j4, j1, GTRD
    jld j2, j4, 32
    jst j2, j1, GBR
    jld j2, j1, FNVO            ; log2(2N) + log2(n)
    jld j3, j1, FLOOR
    jldi j4, 1
    jldi j5, 32
    jshl j4, j4, j5
    jor j3, j3, j4
    jcall hw
    jld j3, j1, GBR
    jcall hw
    jjnz j2, jl_k
    jldi j2, 1
jl_k:
    jadd j5, j2, j1
    jldi j2, TRC
    jcall pl_find
    jld j2, j4, 8
    jadd j2, j2, j2
    jcall lc_lg
    jst j2, j1, GS
    jld j2, j1, GNE
    jcall lc_lg
    jld j3, j1, GS
    jadd j3, j3, j2
    jst j3, j1, GS
    jld j2, j1, DLO             ; - log2(c(low)) - log2(c(high))
    jcall ju_fill
    jld j3, j1, GS
    jsub j3, j3, j2
    jst j3, j1, GS
    jld j2, j1, DHI
    jcall ju_fill
    jld j3, j1, GS
    jsub j3, j3, j2
    jld j6, j1, GTRD            ; (kept for its memory: the evidence and the bits a pair)
    jst j3, j6, 48
    jld j7, j1, GNE
    jst j7, j6, 40
    jld j4, j1, GNE             ; times n
    jmul j3, j3, j4
    jst j3, j1, GS
    jld j11, j1, FLOOR          ; - 2 log2(U): its name
    jldi j2, 3
    jshl j11, j11, j2
    jld j2, j11, UFL
    jcall lg16
    jld j4, j1, GPAC            ; times the patience instinct over 2 (unset: 4, the two-part code, 2 log2 U)
    jjnz j4, ju_pac
    jldi j4, 4
ju_pac:
    jmul j2, j2, j4
    jldi j4, 1
    jsar j2, j2, j4
    jld j3, j1, GS
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
    jld j4, j1, GE              ; and the bits its kind's pieces save
    jld j4, j4, 40
    jld j3, j5, SAVC
    jadd j3, j3, j4
    jst j3, j5, SAVC
  ju_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret


; log2 of the pulses of the filling j2 on the floor FLOOR in the reading GBR -> j2. Uses j1-j8.
ju_fill:
  jcall f_find
  jadd j2, j5, j1
  jld j3, j1, GBR
  jcall hw
  jjnz j2, jf_k
  jldi j2, 1
jf_k:
  jadd j5, j2, j1
  jldi j2, TRC
  jcall pl_find
  jld j2, j4, 8
  jjmp lc_lg

; log2 of j2 (0 counts as 1), in 2^-16 of a bit -> j2. Uses j1, j3-j6.
lc_lg:
  jjnz j2, lg16
  jldi j2, 1
  jjmp lg16

; One pulse more in this reading for the key j5 (a filling, or a floor). Uses j1-j8.
tr_add:
  jadd j2, j5, j1
  jld j3, j1, PASN
  jldi j4, 1
  jadd j3, j3, j4
  jcall hw
  jjnz j2, ta_k
  jldi j2, 1
ta_k:
  jadd j5, j2, j1
  jldi j2, TRC
  jcall pl_take
  jld j2, j4, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j4, 8
  jret


; The concepts, inside the silhouettes (Capitan: "generate concepts in silhouettes"): each word joins the one it is
; most like, its associate piece that saves the most bits, and the groups those links make are the concepts. No
; threshold: you are of the family of whom you most resemble. By word {its root, its best bits, its best partner}
; (24 bytes); CONOK 1 once they exist. Uses j1-j14.
concepts:
  jldi j1, 0
  jld j2, j1, ROOMUF             ; (its room once: a reading after reuses it)
  jjnz j2, cp_room
  jld j11, j1, NV
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMUF
cp_room:
  jldi j1, 0
  jldi j9, 0                    ; every word its own root
  jld j10, j1, NV
  jwhile j10
    jldi j1, 0
    jldi j3, 24
    jmul j3, j9, j3
    jld j4, j1, ROOMUF
    jadd j3, j3, j4
    jst j9, j3, 0               ; (and no best yet: a reading before leaves nothing)
    jst j1, j3, 8
    jst j1, j3, 16
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j9, 0                    ; every associate piece: each of its two words keeps the strongest
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
    jjz j2, cp_next
    jld j2, j3, 40
    jldi j4, 63
    jsar j4, j2, j4
    jjnz j4, cp_next
    jjz j2, cp_next
    jst j3, j1, GE
    jld j2, j3, 24
    jst j2, j1, DKT
    jld j2, j3, 8
    jst j2, j1, DLO
    jld j2, j3, 16
    jst j2, j1, DHI
    jcall d_cat_of
    jldi j6, 3
    jsub j6, j5, j6
    jjnz j6, cp_next
    jld j2, j1, DLO
    jld j3, j1, DHI
    jcall cp_best
    jldi j1, 0
    jld j2, j1, DHI
    jld j3, j1, DLO
    jcall cp_best
  cp_next:
    jldi j1, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j9, 0                    ; each word with its best: one concept
  jld j10, j1, NV
  jwhile j10
    jldi j1, 0
    jldi j3, 24
    jmul j3, j9, j3
    jld j4, j1, ROOMUF
    jadd j3, j3, j4
    jld j3, j3, 16
    jjz j3, cu_next
    jadd j2, j9, j1
    jcall uf_union
  cu_next:
    jldi j1, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, CONOK
  jret

; The word j2 keeps j3 as its best partner if the piece at GE saves more bits than its best so far. Uses j1-j6.
cp_best:
  jldi j1, 0
  jldi j4, 24
  jmul j4, j2, j4
  jld j5, j1, ROOMUF
  jadd j4, j4, j5
  jld j5, j1, GE
  jld j5, j5, 40
  jld j6, j4, 8
  jsub j6, j6, j5
  jldi j1, 63
  jsar j6, j6, j1
  jldi j1, 0
  jjz j6, cb_done
  jst j5, j4, 8
  jst j3, j4, 16
cb_done:
  jret

; The root of the word j2 (each step halves the path) -> j2. Uses j1, j3, j4.
uf_find:
  jldi j1, 0
uf_step:
  jldi j3, 24
  jmul j3, j2, j3
  jld j4, j1, ROOMUF
  jadd j3, j3, j4
  jld j4, j3, 0
  jsub j4, j4, j2
  jjz j4, uf_done
  jld j4, j3, 0                 ; its parent's parent becomes its parent
  jldi j2, 24
  jmul j2, j4, j2
  jld j1, j1, ROOMUF
  jadd j2, j2, j1
  jldi j1, 0
  jld j2, j2, 0
  jst j2, j3, 0
  jjmp uf_step
uf_done:
  jret

; The words j2 and j3 in one concept (the smaller root stays). Uses j1-j6.
uf_union:
  jst j3, j1, CPB
  jcall uf_find
  jst j2, j1, CPA
  jld j2, j1, CPB
  jcall uf_find
  jld j3, j1, CPA
  jsub j4, j2, j3
  jjz j4, un_done
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, un_put
  jadd j4, j2, j1               ; (the smaller as the root)
  jadd j2, j3, j1
  jadd j3, j4, j1
un_put:
  jldi j4, 24                   ; the larger root under the smaller
  jmul j4, j2, j4
  jld j5, j1, ROOMUF
  jadd j4, j4, j5
  jst j3, j4, 0
un_done:
  jret

; j3 = 1 if the words DLO and DHI are in one concept (other words), else 0. Uses j1-j6.
cp_same:
  jldi j1, 0
  jldi j3, 0
  jld j2, j1, CONOK
  jjz j2, cs_done
  jld j2, j1, DLO
  jld j3, j1, DHI
  jsub j3, j2, j3
  jjz j3, cs_done
  jjz j2, cs_no
  jld j2, j1, DHI
  jjz j2, cs_no
  jld j2, j1, DLO
  jcall uf_find
  jst j2, j1, CPA
  jld j2, j1, DHI
  jcall uf_find
  jld j3, j1, CPA
  jsub j3, j2, j3
  jjnz j3, cs_no
  jldi j3, 1
  jret
cs_no:
  jldi j3, 0
cs_done:
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

