; Razar reads a book (Capitan, 2026-11-06: "let us see how much it can learn if we give it a book"; the book is his
; New Testament, which stays out of the repository: it is not ours to give). Everything in Janax.
;
; It reads the file "libro" twice. The first time it only counts, so every table is made to the size of this book
; (each hash table the least power of two with twice the places it could ever need). The second time every word gets
; a number in order of first sight (0 is the renglon, the line of the file) and the book becomes a row of numbers.
; A word is a run of letters: a..z, A..Z made small, and the letters of U+00C0..U+00FF (a tilde, the enie, the
; dieresis; capitals made small); anything else ends a word, and a line feed ends the renglon too.
;
; One renglon in K (the K-th, the 2K-th, ...) is kept apart for the test; it learns only from the rest: how often
; each word was read, and how often each word came right after each other word (its pairs). Then, in every renglon it
; never read, each word in turn is covered and it must say it, seeing the rest of the renglon. Three ways, measured on
; the same covered words:
;   eco: always the word it read most often (the null model: what it says knowing nothing of the place).
;   izquierda: the word that came most often after the word before.
;   dos lados: among the words that came after the word before, the one that best explains both sides: C(p,x) *
;     C(x,n) / C(x), how often x followed p, times how often n followed x, over how often x was read.
; Ties go to the word seen first. When the place gives it nothing to go on it says nothing (calla). A covered word it
; never read counts as asked and missed for all three.
;
; Its reading is lectura.inc. Every answer of the two ways that look at the place goes into j0. It writes how it went in
; three lines.
S_LIBRO = 0
S_P     = 10h
S_HEAD  = 40h
S_DIST  = 80h
S_LINES = 0C0h
S_TEST  = 100h
S_ASKED = 140h
S_OOV   = 180h
S_ECO   = 1C0h
S_LEFT  = 200h
S_BOTH  = 240h
S_SIL   = 280h
S_NOBOOK = 2C0h
S_NOMEM = 300h
S_BITS1 = 340h
S_BITS2 = 380h
S_BITS3 = 3C0h

ROOMC = 1200h                   ; how often each word was read, by number
ROOMB = 1208h                   ; the pairs: {p * NV + x + 1, how often} (a table that grows to what it holds)
ROOMS = 1210h                   ; the words after p: SLIST from ROOMS[p] to ROOMS[p + 1]
ROOMU = 1218h
ROOML = 1220h                   ; {x, how often} each
NB    = 1228h                   ; pairs seen
ECOW  = 1238h                   ; the word read most often
TESTS = 1240h                   ; covered words, and how many of them it never read
OOV   = 1248h
EHIT  = 1250h                   ; right, by way, and silent
LHIT  = 1258h
LSIL  = 1260h
BHIT  = 1268h
BSIL  = 1270h
JJ    = 1278h                   ; the unit being walked, and how many are left
JLEFT = 1280h
CP    = 1288h                   ; the word before, the covered one, the word after
CW    = 1290h
CN    = 1298h
LBEST = 12A0h                   ; izquierda: its word and how often
LBC   = 12A8h
BBEST = 12B0h                   ; dos lados: its word and its score BNUM / BDEN
BNUM  = 12B8h
BDEN  = 12C0h
GAT   = 12C8h                   ; the list being walked
GLEFT = 12D0h
GX    = 12D8h
GC1   = 12E0h
LGNV  = 12E8h                   ; the judge: log2(words read + words known), the bits of all without a model, of the ways
SALL  = 12F0h                   ; that miss (silent or wrong; forced), the outcomes (dos lados: right, wrong, silent;
SBM   = 12F8h                   ; forced: right, wrong), a total, log2 of the covered
SFM   = 1300h
BR    = 1308h
BW    = 1310h
BS    = 1318h
FR    = 1320h
FW    = 1328h
TT    = 1330h
LGN   = 1338h
include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j0, 0                      ; the fingerprint
jcall0 j1, read_book
jld j11, j1, NV                 ; its rooms: the words read (one place each word, by number), the pairs
jldi j2, 3
jshl j11, j11, j2
jcall0 j1, room
jst j13, j1, ROOMC
jldi j11, 32                    ; (the pairs grow to what they hold: Capitan, "nothing wasted"; they were made for
jcall0 j1, room                 ; twice the units, and held one in nine)
jst j13, j1, ROOMB
jadd j2, j13, j1
jldi j3, 16
jcall0 j1, pl_new

jldi j1, 0                      ; what it learns, from the renglones not kept apart: the pairs and the words read
jst j1, j1, LINE
jst j1, j1, NB
jst j1, j1, JJ
jld j2, j1, NTOK
jldi j3, 1
jsub j2, j2, j3
jst j2, j1, JLEFT
jwhile j2
  jldi j1, 0
  jld j9, j1, JJ
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, ROOMT
  jadd j3, j3, j4
  jld j2, j3, 0
  jld j3, j3, 8
  jst j2, j1, CP
  jst j3, j1, CW
  jjnz j2, tr_same              ; every renglon but the first starts a new one
  jjz j9, tr_same
  jld j4, j1, LINE
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j1, LINE
tr_same:
  jcall is_train
  jjz j2, tr_next
  jldi j1, 0
  jld j2, j1, CP
  jld j3, j1, CW
  jcall0 j1, bg_add
  jld j3, j1, CW
  jjz j3, tr_next
  jldi j4, 3
  jshl j3, j3, j4
  jld j4, j1, ROOMC
  jadd j3, j3, j4
  jld j4, j3, 0
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j3, 0
tr_next:
  jldi j1, 0
  jld j9, j1, JJ
  jldi j3, 1
  jadd j9, j9, j3
  jst j9, j1, JJ
  jld j2, j1, JLEFT
  jsub j2, j2, j3
  jst j2, j1, JLEFT
jwend

jldi j1, 0                      ; the eco: the word read most often (ties: the first seen)
jldi j6, 0
jldi j7, 0
jldi j9, 1
jld j8, j1, NV
jldi j2, 1
jsub j8, j8, j2
jwhile j8
  jld j3, j1, ROOMC
  jldx j2, j3, j9
  jsub j3, j6, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, ec_next
  jadd j6, j2, j1
  jadd j7, j9, j1
ec_next:
  jldi j2, 1
  jadd j9, j9, j2
  jsub j8, j8, j2
jwend
jst j7, j1, ECOW

jldi j1, 0                      ; the judge: words read where it learns, and log2 of them with the words it knows
jldi j6, 0
jldi j9, 1
jld j8, j1, NV
jldi j2, 1
jsub j8, j8, j2
jwhile j8
  jld j3, j1, ROOMC
  jldx j2, j3, j9
  jadd j6, j6, j2
  jldi j2, 1
  jadd j9, j9, j2
  jsub j8, j8, j2
jwend
jld j2, j1, NV
jadd j2, j2, j6
jcall lg16
jst j2, j1, LGNV

jldi j1, 0                      ; the words after each word: a list per word, from the pairs
jld j2, j1, NV
jldi j3, 1
jadd j11, j2, j3
jldi j3, 3
jshl j11, j11, j3
jcall0 j1, room
jst j13, j1, ROOMS
jld j11, j1, NV
jldi j3, 3
jshl j11, j11, j3
jcall0 j1, room
jst j13, j1, ROOMU
jld j11, j1, NB
jldi j3, 1
jadd j11, j11, j3
jldi j3, 4
jshl j11, j11, j3
jcall0 j1, room
jst j13, j1, ROOML
jldi j9, 0                      ; how many after each p, at ROOMS[p + 1]
jld j8, j1, ROOMB              ; (every place of its table)
jld j8, j8, 8
jldi j2, 1
jadd j8, j8, j2
jwhile j8
  jcall bg_at
  jjz j2, cs_next
  jldi j4, 1
  jadd j3, j3, j4
  jldi j4, 3
  jshl j3, j3, j4
  jld j4, j1, ROOMS
  jadd j3, j3, j4
  jld j4, j3, 0
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j3, 0
cs_next:
  jldi j2, 1
  jadd j9, j9, j2
  jsub j8, j8, j2
jwend
jldi j9, 0                      ; where each list starts, and its cursor
jldi j6, 0
jld j8, j1, NV
jwhile j8
  jldi j2, 3
  jshl j2, j9, j2
  jld j3, j1, ROOMS
  jadd j3, j3, j2
  jld j4, j3, 8
  jadd j6, j6, j4
  jst j6, j3, 8
  jld j4, j3, 0
  jld j3, j1, ROOMU
  jadd j3, j3, j2
  jst j4, j3, 0
  jldi j2, 1
  jadd j9, j9, j2
  jsub j8, j8, j2
jwend
jldi j9, 0                      ; each pair in its list
jld j8, j1, ROOMB              ; (every place of its table)
jld j8, j8, 8
jldi j2, 1
jadd j8, j8, j2
jwhile j8
  jcall bg_at
  jjz j2, cl_next
  jldi j4, 3
  jshl j3, j3, j4
  jld j4, j1, ROOMU
  jadd j3, j3, j4
  jld j4, j3, 0
  jldi j6, 1
  jadd j6, j4, j6
  jst j6, j3, 0
  jldi j6, 4
  jshl j4, j4, j6
  jld j6, j1, ROOML
  jadd j4, j4, j6
  jst j5, j4, 0
  jst j7, j4, 8
cl_next:
  jldi j2, 1
  jadd j9, j9, j2
  jsub j8, j8, j2
jwend

jldi j1, 0                      ; the test: every word of every renglon kept apart, covered in turn
jst j1, j1, LINE
jldi j2, 1
jst j2, j1, JJ
jld j2, j1, NTOK
jldi j3, 2
jsub j2, j2, j3
jst j2, j1, JLEFT
jwhile j2
  jldi j1, 0
  jld j9, j1, JJ
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, ROOMT
  jadd j3, j3, j4
  jld j2, j3, 0
  jjnz j2, te_word
  jld j4, j1, LINE
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j1, LINE
  jjmp te_next
te_word:
  jst j2, j1, CW
  jld j2, j3, -8
  jst j2, j1, CP
  jld j2, j3, 8
  jst j2, j1, CN
  jcall is_train
  jjnz j2, te_next
  jldi j1, 0
  jldi j2, 1
  jldadd j2, j1, TESTS
  jld j2, j1, CW
  jld j4, j1, ROOMC
  jldx j3, j4, j2
  jjnz j3, te_seen
  jld j3, j1, OOV
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, OOV
te_seen:
  jld j3, j1, ECOW
  jsub j3, j3, j2
  jjnz j3, te_place
  jld j3, j1, EHIT
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, EHIT
te_place:
  jcall0 j1, guess
  jld j12, j1, LBEST
  jcall mix
  jld j12, j1, BBEST
  jcall0 j1, mix
  jld j2, j1, CW
  jld j3, j1, LBEST
  jjnz j3, te_lsaid
  jld j3, j1, LSIL
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, LSIL
  jjmp te_both
te_lsaid:
  jsub j3, j3, j2
  jjnz j3, te_both
  jld j3, j1, LHIT
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, LHIT
te_both:
  jcall0 j1, lb_count           ; the two-part code of the covered word
  jld j2, j1, CW
  jld j3, j1, BBEST
  jjnz j3, te_bsaid
  jld j3, j1, BSIL
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, BSIL
  jjmp te_next
te_bsaid:
  jsub j3, j3, j2
  jjnz j3, te_next
  jld j3, j1, BHIT
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, BHIT
te_next:
  jldi j1, 0
  jld j9, j1, JJ
  jldi j3, 1
  jadd j9, j9, j3
  jst j9, j1, JJ
  jld j2, j1, JLEFT
  jsub j2, j2, j3
  jst j2, j1, JLEFT
jwend

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
jldi j2, 10
jcall putch
jldi j1, S_ASKED
jcall puts
jld j2, j1, TESTS
jcall putnum
jldi j1, S_OOV
jcall puts
jld j2, j1, OOV
jcall putnum
jldi j2, 10
jcall putch
jldi j1, S_ECO
jcall puts
jld j2, j1, EHIT
jcall puthits
jldi j1, S_LEFT
jcall puts
jld j2, j1, LHIT
jcall puthits
jldi j1, S_SIL
jcall puts
jld j2, j1, LSIL
jcall putnum
jldi j1, S_BOTH
jcall puts
jld j2, j1, BHIT
jcall puthits
jldi j1, S_SIL
jcall puts
jld j2, j1, BSIL
jcall putnum
jldi j2, 10
jcall putch
jcall lb_report
jjmp finish

; The place of the pair (j2 = p, j3 = x) -> j4, its key -> j5 (the place is empty if it was never seen). Uses j1-j8.
bg_slot:
  jcall bg_key
  jld j2, j1, ROOMB
  jjmp pl_find

; The key of the pair (j2 = p, j3 = x) -> j5. Uses j1, j5, j6.
bg_key:
  jldi j1, 0
  jld j6, j1, NV
  jmul j5, j2, j6
  jadd j5, j5, j3
  jldi j6, 1
  jadd j5, j5, j6
  jret

; The pair (j2 = p, j3 = x) seen once more. Uses j1-j8.
bg_add:
  jcall bg_key
  jld j2, j1, ROOMB
  jcall0 j1, pl_take
  jjz j6, ba_old
  jldi j6, 1
  jldadd j6, j1, NB
ba_old:
  jld j6, j4, 8
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j4, 8
  jret

; How often x (j3) came right after p (j2) -> j6. Uses j1-j8.
bg_count:
  jcall bg_slot
  jld j6, j4, 8
  jret

; The pair at place j9 of its table: j2 = its key (0: empty), j3 = p, j5 = x, j7 = how often. Uses j1-j7.
bg_at:
  jldi j1, 0
  jldi j2, 4
  jshl j2, j9, j2
  jld j3, j1, ROOMB
  jld j3, j3, 0
  jadd j3, j3, j2
  jld j7, j3, 8
  jld j2, j3, 0
  jjz j2, bt_none
  jldi j3, 1
  jsub j5, j2, j3
  jld j4, j1, NV
  jdiv j3, j5, j4
  jmul j4, j3, j4
  jsub j5, j5, j4
bt_none:
  jret

; What the two ways that look at the place say for the word between CP and CN: LBEST and BBEST (0: nothing).
; Uses j1-j8.
guess:
  jldi j1, 0
  jst j1, j1, LBEST
  jst j1, j1, LBC
  jst j1, j1, BBEST
  jst j1, j1, BNUM
  jldi j2, 1
  jst j2, j1, BDEN
  jld j2, j1, CP
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ROOMS
  jadd j2, j2, j3
  jld j3, j2, 0
  jld j4, j2, 8
  jsub j4, j4, j3
  jst j4, j1, GLEFT
  jldi j5, 4
  jshl j3, j3, j5
  jld j5, j1, ROOML
  jadd j3, j3, j5
  jst j3, j1, GAT
  jwhile j4
    jldi j1, 0
    jld j3, j1, GAT
    jld j2, j3, 0
    jld j6, j3, 8
    jjz j2, gu_next             ; the renglon is no word
    jst j2, j1, GX
    jst j6, j1, GC1
    jld j7, j1, LBC             ; izquierda: more often, or as often and seen first
    jsub j8, j6, j7
    jldi j5, 63
    jjz j8, gu_ltie
    jsar j8, j8, j5
    jjnz j8, gu_both
    jjmp gu_lnew
  gu_ltie:
    jld j7, j1, LBEST
    jsub j8, j2, j7
    jsar j8, j8, j5
    jjz j8, gu_both
  gu_lnew:
    jst j2, j1, LBEST
    jst j6, j1, LBC
  gu_both:
    jld j3, j1, CN              ; dos lados: C(p,x) * C(x,n) / C(x)
    jcall bg_count
    jjz j6, gu_next
    jld j7, j1, GC1
    jmul j6, j6, j7
    jld j2, j1, GX
    jld j7, j1, ROOMC
    jldx j7, j7, j2
    jld j3, j1, BDEN
    jmul j3, j6, j3
    jld j4, j1, BNUM
    jmul j4, j4, j7
    jsub j3, j3, j4
    jldi j5, 63
    jjz j3, gu_btie
    jsar j3, j3, j5
    jjnz j3, gu_next
    jjmp gu_bnew
  gu_btie:
    jld j4, j1, BBEST
    jsub j4, j2, j4
    jsar j4, j4, j5
    jjz j4, gu_next
  gu_bnew:
    jst j2, j1, BBEST
    jst j6, j1, BNUM
    jst j7, j1, BDEN
  gu_next:
    jldi j1, 0
    jld j3, j1, GAT
    jldi j4, 16
    jadd j3, j3, j4
    jst j3, j1, GAT
    jld j4, j1, GLEFT
    jldi j5, 1
    jsub j4, j4, j5
    jst j4, j1, GLEFT
  jwend
  jret

; j2 right of TESTS, and " (x,y%)". Uses j1-j6.
puthits:
  jldi j1, 0
  jst j2, j1, GX
  jcall putnum
  jldi j2, 32
  jcall putch
  jldi j2, 40
  jcall0 j1, putch
  jld j2, j1, GX
  jldi j3, 1000
  jmul j2, j2, j3
  jld j3, j1, TESTS
  jdiv j2, j2, j3
  jst j2, j1, GX
  jldi j3, 10
  jdiv j2, j2, j3
  jcall putnum
  jldi j2, 44
  jcall0 j1, putch
  jld j2, j1, GX
  jldi j3, 10
  jdiv j4, j2, j3
  jmul j4, j4, j3
  jsub j2, j2, j4
  jcall putnum
  jldi j2, 37
  jcall putch
  jldi j2, 41
  jcall putch
  jret


; The two-part code of the covered word CW (the judge of harmony on the reader): what naming it costs without a
; model, log2((words read + words known) / (its count + 1)), added to all; to the ways that miss it (dos lados silent
; or wrong; dos lados forced to the eco when silent, wrong); and the outcomes counted. Uses j1-j7.
lb_count:
  jldi j1, 0
  jld j2, j1, CW
  jld j4, j1, ROOMC
  jldx j2, j4, j2
  jldi j3, 1
  jadd j2, j2, j3
  jcall lg16
  jld j3, j1, LGNV
  jsub j3, j3, j2
  jst j3, j1, TT                ; its cost without a model
  jld j4, j1, SALL
  jadd j4, j4, j3
  jst j4, j1, SALL
  jld j5, j1, BBEST
  jld j6, j1, CW
  jjnz j5, lb_said
  jldi j4, 1                    ; silent: it pays the word; forced, the eco says it
  jldadd j4, j1, BS
  jld j4, j1, SBM
  jadd j4, j4, j3
  jst j4, j1, SBM
  jld j5, j1, ECOW
  jsub j5, j5, j6
  jjz j5, lb_fright
  jjmp lb_fwrong
lb_said:
  jsub j5, j5, j6
  jjnz j5, lb_wrong
  jldi j4, 1
  jldadd j4, j1, BR
lb_fright:
  jld j4, j1, FR
  jldi j7, 1
  jadd j4, j4, j7
  jst j4, j1, FR
  jret
lb_wrong:
  jldi j4, 1
  jldadd j4, j1, BW
  jld j4, j1, SBM
  jadd j4, j4, j3
  jst j4, j1, SBM
lb_fwrong:
  jld j4, j1, FW
  jldi j7, 1
  jadd j4, j4, j7
  jst j4, j1, FW
  jld j4, j1, SFM
  jadd j4, j4, j3
  jst j4, j1, SFM
  jret

; k * log2(n / k), the bits of one outcome of n, k = j2 (0: none) -> added to TT. Uses j1-j7.
lb_part:
  jjz j2, lp_none
  jldi j1, 0
  jst j2, j1, GX
  jcall lg16
  jld j3, j1, LGN
  jsub j3, j3, j2
  jld j4, j1, GX
  jmul j3, j3, j4
  jld j4, j1, TT
  jadd j4, j4, j3
  jst j4, j1, TT
lp_none:
  jret

; The bits per covered word of the three ways, written: without a model; dos lados always saying (silent: the eco);
; dos lados silent when the place gives it nothing. A way costs its outcomes (k log2(n / k) each, and log2(n) / 2 for
; each rate it keeps) and the words it misses. Uses j1-j14.
lb_report:
  jldi j1, 0
  jld j2, j1, TESTS
  jcall lg16
  jst j2, j1, LGN
  jldi j1, S_BITS1
  jcall puts
  jld j2, j1, SALL
  jld j3, j1, TESTS
  jdiv j2, j2, j3
  jcall0 j1, putq16             ; always saying: right or wrong
  jld j2, j1, SFM
  jld j3, j1, LGN
  jldi j4, 1
  jsar j3, j3, j4
  jadd j2, j2, j3
  jst j2, j1, TT
  jld j2, j1, FR
  jcall lb_part
  jld j2, j1, FW
  jcall lb_part
  jldi j1, S_BITS2
  jcall puts
  jld j2, j1, TT
  jadd j12, j2, j1
  jcall mix
  jld j3, j1, TESTS
  jdiv j2, j2, j3
  jcall0 j1, putq16             ; silent when it has nothing: right, wrong or silent
  jld j2, j1, SBM
  jld j3, j1, LGN
  jadd j2, j2, j3
  jst j2, j1, TT
  jld j2, j1, BR
  jcall lb_part
  jld j2, j1, BW
  jcall lb_part
  jld j2, j1, BS
  jcall lb_part
  jldi j1, S_BITS3
  jcall puts
  jld j2, j1, TT
  jadd j12, j2, j1
  jcall mix
  jld j3, j1, TESTS
  jdiv j2, j2, j3
  jcall putq16
  jldi j2, 10
  jjmp putch

include 'crece.inc'
include 'lectura.inc'
