; The pulse's machinery, shared by pulso and pregunta (the rule, the floors, the requests and the judge are told at the
; top of pulso.jsm). learn_pulses hangs the requests of the renglones it learns from (lectura.inc's is_train), wakes
; the pulses and judges every difference; all_floors with TESTING 1 then knocks with what it never read. The program
; that includes it keeps its own variables from 1600h on and includes it before lectura.inc.
ROOMC = 1200h                   ; how often each word was read where it learns, by number
ROOMR = 1208h                   ; the requests: {key, its last moves, newest first: a filling, or the empty as 1 << 62}
                                ; (8 bytes and 8 per move of the deepest floor)
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
RSZ   = 1F68h                   ; the bytes of a request, the depth of the floor walked, the move walked, the deepest
PDP   = 1F70h
PIX   = 1F78h
CAP   = 1F88h                   ; the moves a request keeps (the deepest floor and its probe)
DF    = 1548h                   ; by floor (8 bytes each, from floor 0): its depth now
TLV   = 1F00h                   ; by floor and distance: {key, met, foreseen} (a growing table)
PLIM  = 1750h                   ; meeting: how many moves, a probe (1), what it found (0 nothing, 1 new, 2 foreseen); a
PMODE = 1758h                   ; floor to widen the requests for
PST   = 1760h
WIDEN = 1768h
HDA   = 1770h                   ; weighing a depth: the two distances, the gain and its cost, their counts, logs
HDB   = 1778h
HDG   = 1780h
HDC   = 1788h
HNA   = 1790h
HHA   = 1798h
HNB   = 17A0h
HHB   = 17A8h
HL1   = 17B0h
HL2   = 17B8h
HT    = 17C0h
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

jldi j1, 0                      ; each floor starts at depth one (or the one "p" tells), and a request keeps one move more
jldi j9, 1                      ; than the deepest: the probe
jldi j10, 3
jldi j11, 1
jwhile j10
  jldi j2, 1
  jsub j2, j9, j2
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, HOND
  jshr j3, j3, j2
  jldi j2, 255
  jand j3, j3, j2
  jjnz j3, dx_one
  jldi j3, 1
dx_one:
  jldi j2, 3
  jshl j2, j9, j2
  jst j3, j2, DF
  jsub j4, j11, j3
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, dx_no
  jadd j11, j3, j1
dx_no:
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jldi j2, 1
jadd j11, j11, j2
jst j11, j1, CAP
jst j1, j1, WIDEN
jldi j2, 3
jshl j11, j11, j2
jldi j2, 8
jadd j11, j11, j2
jst j11, j1, RSZ
jldi j2, TLV                    ; what each distance of each floor foresaw (it grows to what it holds)
jldi j3, 24
jcall pl_new

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
jld j4, j1, RSZ
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
  jcall po_widen                ; (a floor went deeper than the requests hold: they widen first)
  jcall po_depth
  jld j5, j1, KEY
  jld j2, j1, ROOMR
  jld j3, j1, RSZ
  jcall t_find
  jld j6, j4, 0
  jjnz j6, po_old
  jst j5, j4, 0                 ; a new request falls asleep with its move
  jld j6, j1, NREQ
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j1, NREQ
  jjmp po_keep
po_old:
  jcall po_meet
  jldi j1, 0
  jld j4, j1, RENT
po_keep:                        ; the move goes first: if it was among its moves it comes forward, else the oldest falls
  jldi j1, 0
  jst j4, j1, RENT
  jld j3, j1, PAY
  jjnz j3, pk_code
  jldi j3, 1                    ; (the empty, as a move: a code no filling has)
  jldi j5, 62
  jshl j3, j3, j5
pk_code:
  jld j5, j1, CAP
  jldi j6, 1
  jsub j5, j5, j6
  jldi j6, 0
  jld j7, j1, CAP
  jwhile j7
    jldi j8, 3
    jshl j8, j6, j8
    jadd j8, j8, j4
    jld j2, j8, 8
    jjz j2, pk_at
    jsub j2, j2, j3
    jjz j2, pk_at
    jldi j2, 1
    jadd j6, j6, j2
    jsub j7, j7, j2
  jwend
  jjmp pk_shift
pk_at:
  jadd j5, j6, j1
pk_shift:
  jwhile j5
    jldi j8, 3
    jshl j8, j5, j8
    jadd j8, j8, j4
    jld j2, j8, 0
    jst j2, j8, 8
    jldi j2, 1
    jsub j5, j5, j2
  jwend
  jst j3, j4, 8
po_done:
  jret
po_test:
  jadd j5, j2, j1
  jcall po_depth
  jld j2, j1, ROOMR
  jld j3, j1, RSZ
  jcall t_find
  jld j6, j4, 0
  jjz j6, po_done               ; nothing asleep there
  jjmp po_meet

; The depth of the floor FLOOR, as it stands now -> PDP. Uses j1-j3.
po_depth:
  jldi j1, 0
  jld j2, j1, FLOOR
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j2, DF
  jst j3, j1, PDP
  jret

; The move PAY against the moves the request at j4 keeps {key, its last CAP moves, newest first}: each of the first
; PDP that is another wakes the pulse between the two (the empty, if one of them is, waits: j2 = 0). Awake, the next
; one is a probe: it only looks whether that pulse would be foreseen, and every pulse and probe counts at its distance,
; so the floor goes deeper or back as it reads (Capitan: "it adjusts while it runs: we never know what we will find").
; Uses j1-j8.
po_meet:
  jldi j1, 0
  jst j4, j1, RENT
  jst j1, j1, PIX
  jld j2, j1, PDP               ; how many it meets: its depth, and awake one more
  jld j3, j1, TESTING
  jjnz j3, pm_lim
  jldi j3, 1
  jadd j2, j2, j3
pm_lim:
  jld j3, j1, CAP
  jsub j4, j3, j2
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, pm_cap
  jadd j2, j3, j1
pm_cap:
  jst j2, j1, PLIM
pm_next:
  jldi j1, 0
  jld j6, j1, PIX
  jld j7, j1, PLIM
  jsub j7, j7, j6
  jjz j7, po_done
  jldi j7, 1
  jadd j7, j6, j7
  jst j7, j1, PIX
  jld j7, j1, PDP               ; past its depth: the probe
  jsub j7, j7, j6
  jldi j8, 1
  jjz j7, pm_mode
  jldi j8, 0
pm_mode:
  jst j8, j1, PMODE
  jst j1, j1, PST
  jld j4, j1, RENT
  jldi j7, 3
  jshl j7, j6, j7
  jadd j7, j7, j4
  jld j2, j7, 8
  jjz j2, po_done
  jld j3, j1, PAY
  jcall pm_pair
  jldi j1, 0
  jld j2, j1, TESTING
  jjnz j2, pm_next
  jcall lv_count
  jjmp pm_next

; The kept move j2 (a code) against the move j3 (0: the empty): the pulse, or the probe, if it is another. Uses j1-j8.
pm_pair:
  jldi j1, 0
  jldi j6, 1
  jldi j7, 62
  jshl j6, j6, j7
  jsub j7, j2, j6
  jjnz j7, mv_filled
  jjz j3, po_done               ; empty after empty: the same move
  jldi j2, 0
  jjmp pm_go
mv_filled:
  jjnz j3, mv_both
  jadd j3, j2, j1               ; empty after a filling
  jldi j2, 0
  jjmp pm_go
mv_both:
  jsub j6, j2, j3
  jjz j6, po_done               ; the same move
pm_go:
  jld j6, j1, PMODE
  jjz j6, pulse

; The probe: the pulse between j2 and j3 is not made, only looked at. PST: 0 the place already testified to it, 1 its
; difference is new, 2 it was there (foreseen). Uses j1-j8.
probe:
  jcall d_make
  jst j5, j1, PDK
  jld j2, j1, KEY
  jadd j3, j5, j1
  jcall hw
  jjnz j2, pr_k
  jldi j2, 1
pr_k:
  jadd j5, j2, j1
  jldi j2, TPT
  jcall pl_find
  jld j6, j4, 0
  jjnz j6, pr_none
  jld j5, j1, PDK
  jld j2, j1, ROOMD
  jldi j3, 48
  jcall t_find
  jld j6, j4, 0
  jldi j7, 1
  jjz j6, pr_set
  jldi j7, 2
pr_set:
  jst j7, j1, PST
pr_none:
  jret

; The pulse or probe just met, at distance PIX of the floor FLOOR: counted there, with the bits the judge would give its
; pair now, log2(2N n / (c(low) c(high))) (each count with this pair in, a probe as if it were made), and the floor
; weighs its depth again; a difference new here also pays its name. What a pulse foresees is not what repeats but what is
; specific. Uses j1-j8.
lv_count:
  jldi j1, 0
  jld j2, j1, PST
  jjz j2, lc_done
  jld j2, j1, PMODE             ; a probe counts itself in (1), a pulse is in already (0)
  jst j2, j1, HT
  jld j7, j1, FLOOR             ; log2(2N)
  jldi j2, 3
  jshl j7, j7, j2
  jld j2, j7, NFL
  jld j3, j1, HT
  jadd j2, j2, j3
  jadd j2, j2, j2
  jcall lc_lg
  jst j2, j1, HL1
  jld j5, j1, PDK               ; + log2(n)
  jld j2, j1, ROOMD
  jldi j3, 48
  jcall t_find
  jld j2, j4, 32
  jld j3, j1, HT
  jadd j2, j2, j3
  jcall lc_lg
  jld j3, j1, HL1
  jadd j3, j3, j2
  jst j3, j1, HL1
  jld j2, j1, DLO               ; - log2(c(low)) - log2(c(high))
  jcall f_find
  jld j2, j4, 8
  jld j3, j1, HT
  jadd j2, j2, j3
  jcall lc_lg
  jld j3, j1, HL1
  jsub j3, j3, j2
  jst j3, j1, HL1
  jld j2, j1, DHI
  jcall f_find
  jld j2, j4, 8
  jld j3, j1, HT
  jadd j2, j2, j3
  jcall lc_lg
  jld j3, j1, HL1
  jsub j3, j3, j2
  jst j3, j1, HL1
  jld j2, j1, PST               ; a difference new here pays its name, 2 log2(U), as the judge charges a piece
  jldi j3, 1
  jsub j2, j2, j3
  jjnz j2, lc_named
  jld j7, j1, FLOOR
  jldi j2, 3
  jshl j7, j7, j2
  jld j2, j7, UFL
  jcall lc_lg
  jld j3, j1, HL1
  jsub j3, j3, j2
  jsub j3, j3, j2
  jst j3, j1, HL1
lc_named:
  jld j5, j1, PIX               ; counted at its distance
  jcall lv_place
  jld j2, j4, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j4, 8
  jld j2, j4, 16
  jld j3, j1, HL1
  jadd j2, j2, j3
  jst j2, j4, 16
  jjmp hd_weigh
lc_done:
  jret

; log2 of j2 (0 counts as 1), in 2^-16 of a bit -> j2. Uses j1, j3-j6.
lc_lg:
  jjnz j2, lg16
  jldi j2, 1
  jjmp lg16

; The count of distance j5 on the floor FLOOR -> j4 {key, met, bits}, put in if new. Uses j1-j8.
lv_place:
  jldi j1, 0
  jld j2, j1, FLOOR
  jldi j3, 16
  jshl j2, j2, j3
  jadd j5, j5, j2
  jldi j2, TLV
  jjmp pl_take

; The floor FLOOR weighs its depth d: one deeper when the probe (distance d + 1) brings more bits per pulse than distance
; d, by more than naming the change costs (half log2 of the probe count); one back when distance d brings fewer than
; d - 1 by as much. Uses j1-j8.
hd_weigh:
  jldi j1, 0
  jld j5, j1, PDP
  jst j5, j1, HDA
  jldi j2, 1
  jadd j5, j5, j2
  jst j5, j1, HDB
  jcall hd_gain
  jldi j1, 0
  jld j2, j1, HDG
  jld j3, j1, HDC
  jsub j2, j3, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, hw_back
  jld j2, j1, FLOOR             ; deeper
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, HDB
  jst j3, j2, DF
  jst j3, j1, PDP
  jld j4, j1, CAP               ; and the requests must hold its probe too
  jsub j4, j3, j4
  jldi j5, 63
  jsar j4, j4, j5
  jjnz j4, hw_done
  jldi j4, 1
  jst j4, j1, WIDEN
  jret
hw_back:
  jld j5, j1, PDP
  jldi j2, 1
  jsub j5, j5, j2
  jjz j5, hw_done
  jst j5, j1, HDA
  jld j5, j1, PDP
  jst j5, j1, HDB
  jcall hd_gain
  jldi j1, 0
  jld j2, j1, HDG
  jld j3, j1, HDC
  jadd j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, hw_done
  jld j2, j1, FLOOR             ; back
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, HDA
  jst j3, j2, DF
  jst j3, j1, PDP
hw_done:
  jret

; What distance HDB brings over distance HDA on the floor FLOOR, in bits (2^-16): HDG = its bits - its pulses times the
; bits per pulse of HDA; HDC = half log2 of its pulses (both 0 if either is unmet). Uses j1-j8.
hd_gain:
  jldi j1, 0
  jst j1, j1, HDG
  jst j1, j1, HDC
  jld j5, j1, HDA
  jcall lv_place
  jld j2, j4, 8
  jjz j2, hg_done
  jst j2, j1, HNA
  jld j2, j4, 16
  jst j2, j1, HHA
  jld j5, j1, HDB
  jcall lv_place
  jld j2, j4, 8
  jjz j2, hg_done
  jst j2, j1, HNB
  jld j2, j4, 16
  jst j2, j1, HHB
  jld j2, j1, HHA               ; its pulses times the bits per pulse of HDA
  jld j3, j1, HNB
  jmul j2, j2, j3
  jld j3, j1, HNA
  jdiv j2, j2, j3
  jld j3, j1, HHB
  jsub j3, j3, j2
  jst j3, j1, HDG
  jld j2, j1, HNB               ; the cost of naming it
  jcall lg16
  jldi j3, 1
  jsar j2, j2, j3
  jst j2, j1, HDC
hg_done:
  jret

po_widen:
  jldi j1, 0
  jld j2, j1, WIDEN
  jjnz j2, pw_go
  jret
pw_go:
  jst j1, j1, WIDEN
  jst j9, j1, PLS
  jst j10, j1, PLS + 8
  jst j11, j1, PLS + 16
  jst j12, j1, PLS + 24
  jst j13, j1, PLS + 32
  jst j14, j1, PLS + 40
  jld j2, j1, RSZ
  jst j2, j1, PLN               ; (the old size, the old place)
  jld j2, j1, ROOMR
  jst j2, j1, PLO
  jld j2, j1, CAP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, CAP
  jldi j3, 3
  jshl j2, j2, j3
  jldi j3, 8
  jadd j2, j2, j3
  jst j2, j1, RSZ
  jld j3, j1, RMASK
  jldi j4, 1
  jadd j3, j3, j4
  jmul j11, j3, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMR
  jld j9, j1, PLO               ; every place, its bytes to the same place
  jadd j11, j13, j1
  jld j10, j1, RMASK
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j1, 0
    jld j3, j1, PLN
    jldi j6, 0
    jwhile j3
      jadd j7, j9, j6
      jld j8, j7, 0
      jadd j7, j11, j6
      jst j8, j7, 0
      jldi j7, 8
      jadd j6, j6, j7
      jsub j3, j3, j7
    jwend
    jld j3, j1, PLN
    jadd j9, j9, j3
    jld j3, j1, RSZ
    jadd j11, j11, j3
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j1, 0
  jld j9, j1, PLS
  jld j10, j1, PLS + 8
  jld j11, j1, PLS + 16
  jld j12, j1, PLS + 24
  jld j13, j1, PLS + 32
  jld j14, j1, PLS + 40
  jret

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
  jld j2, j1, KEY               ; this place and this difference: said before?
  jadd j3, j5, j1
  jcall hw
  jjnz j2, pu_k
  jldi j2, 1
pu_k:
  jadd j5, j2, j1
  jldi j2, TPT
  jcall pl_take
  jjz j6, pl_done                ; said before: nothing new
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
  jldi j8, 2                    ; (what the meeting finds: the difference was there, foreseen; or new)
  jst j8, j1, PST
  jjnz j7, pl_count
  jldi j8, 1
  jst j8, j1, PST
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
  jld j7, j1, CAT               ; the same place, another word: kept for the house (frame and fillings)
  jldi j8, 3
  jsub j7, j7, j8
  jjnz j7, pl_fill
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

