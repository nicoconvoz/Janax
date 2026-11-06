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
S_STAYS = 540h
S_OF    = 580h
S_FLIPS = 5C0h
S_P2    = 600h
S_P2T   = 640h

include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j0, 0                      ; the fingerprint
jcall read_book
jcall learn_pulses
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
jldi j1, S_P2                   ; property 2: the bar, and the switches that turn
jcall puts
jld j2, j1, BASES
jcall putmix
jldi j1, S_OF
jcall puts
jld j2, j1, BASEN
jcall putmix
jld j2, j1, BASES
jld j3, j1, BASEN
jcall putpct
jldi j1, S_P2T
jcall puts
jldi j9, 0
jld j10, j1, RMASK
jldi j2, 1
jadd j10, j10, j2
jwhile j10
  jldi j1, 0
  jldi j11, 64
  jmul j11, j9, j11
  jld j2, j1, ROOMD
  jadd j11, j11, j2
  jld j2, j11, 0
  jjz j2, tv_next
  jld j2, j11, 56
  jjz j2, tv_next
  jldi j2, 32
  jcall putch
  jld j2, j11, 16
  jcall putword
tv_next:
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jldi j2, 10
jcall putch
jjmp finish

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
      jldi j3, 64
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

include 'pulso.inc'
include 'lectura.inc'
