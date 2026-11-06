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
S_FLIPS = 5C0h
S_QHEAD = 680h
S_Q1    = 6C0h
S_Q2    = 700h
S_Q3    = 740h
S_Q4    = 780h
S_Q5    = 7C0h
S_Q6    = 800h
S_QB    = 840h
S_NEG   = 880h
S_NEG2  = 8C0h
S_NEG3  = 900h
S_NEG4  = 940h
S_NEG5  = 980h
S_Q7    = 9C0h
S_ASSOC = 0A00h
S_ASSOC2 = 0A40h
S_PP1   = 0A80h
S_PP2   = 0AC0h
S_ANS   = 0B00h
S_ANS2  = 0B40h
S_ANS3  = 0B80h
S_ANS4  = 0BC0h
S_DUNNO = 0C00h
S_ALSO  = 0C40h
S_RET1  = 0C80h
S_RET2  = 0CC0h
S_RET3  = 0D00h
S_RET4  = 0D40h
S_RET5  = 0D80h
S_RET6  = 0DC0h
S_BRINGS = 0E00h
S_HOUSE = 0E40h
S_HFND  = 0E80h
S_HFUR  = 0EC0h
S_HCOL  = 0F00h
S_HRND  = 0F40h
S_SKEL  = 600h
S_SKC   = 540h
S_SKO   = 580h
S_KIN   = 640h
ROOMOP = 1900h                  ; the questions: where the place is said plain, and with the switch
ROOMOW = 1908h
ROOMMK = 1910h                  ; by word: the stamp of the renglones marked, the stamp of the last counted, its whys,
ROOMON = 1918h                  ; its blind whys
ROOMWY = 1920h
ROOMBL = 1928h
QA    = 1930h                   ; the place of the question: its three words, the switch
QB    = 1938h
QC    = 1940h
QW    = 1948h
NPL   = 1950h                   ; how often said plain, and with the switch
NWI   = 1958h
STAMP = 1960h
WMODE = 1968h
RL    = 1970h                   ; the rule: its list and how many; the exceptions: the same
NRL   = 1978h
XL    = 1980h
NXL   = 1988h
OI    = 1990h                   ; walking a list: where, how many left
OL    = 1998h
OI2   = 19A0h
NQ    = 19A8h                   ; exceptions looked at
QI    = 19B0h                   ; walking the forms: the place, how many left
QL    = 19B8h
CBY   = 19C0h                   ; the judge of an association: its whys, its blind whys, a term, the total, log2 NQ,
CBL   = 19C8h                   ; log2(2 NQ + 2)
CBA   = 19D0h
CBT   = 19D8h
CBN   = 19E0h
CBQ   = 19E8h
BESTW = 19F0h                   ; the answer: the why that saves the most bits, and its bits
BESTG = 19F8h
ROOMRN = 1A00h                  ; the silhouettes of the book, by word: in how many renglones it is, in how many with a
ROOMNC = 1A10h                  ; switch, the last renglon counted
ROOMSN = 1A18h
NEGR  = 1A20h                   ; renglones with a switch, all renglones, and log2 of them, of all, of those without
NREN  = 1A28h
LNEG  = 1A30h
LNREN = 1A38h
LNPOS = 1AA8h
NCAND = 1A40h                   ; the answer: pieces it could name, naming one; the piece weighed: its renglones (this
CCOST = 1A48h                   ; one out), those with a switch, log2 of the first, its bits; the three best (word,
RNX   = 1A50h                   ; bits)
RKX   = 1A58h
LGNX  = 1A60h
ACC2  = 1AB0h
B1W   = 1A68h
B1G   = 1A70h
B2W   = 1A78h
B2G   = 1A80h
B3W   = 1A88h
B3G   = 1A90h
CXW   = 1A98h
QDIR  = 1AB8h                   ; 1: the question asks why the switch (its rule is plain); 0: why without it
FPOS  = 1AC0h                   ; through the door: where it is, the exception being looked in
FSTART = 1AC8h                  ; (walking the exceptions)
KMASK = 1B58h                   ; the skeletons: places minus 1, the skeletons {key, fillings, different}, the forms
ROOMK1 = 1B60h                  ; seen; by word: openness summed, places, written; walking: what it does, the place,
ROOMK2 = 1B68h                  ; places left, the key, the skeleton, the side listed
ROOMOP2 = 1B70h
ROOMOC = 1B78h
ROOMKT = 1B80h
KMODE = 1B88h
KI    = 1B90h
KL    = 1B98h
KKEY  = 1BA0h
KENT  = 1BA8h
KSIDE = 1BB0h
ROOMPS = 1BB8h                  ; by place: its skeleton and its filling there; by word: structure, its siblings that are
ROOMPF = 1BC0h                  ; structure, all its siblings; the rounds, words added in the last one
ROOMST = 1BC8h
ROOMSS = 1BD0h
ROOMSA = 1BD8h
NKR   = 1BE0h
NKADD = 1BE8h
KRSTAMP = 1BF0h                 ; the round's stamp

include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j0, 0                      ; the fingerprint
jcall read_book
jcall learn_pulses
jcall distill_no
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
jcall flush                     ; the switch, distilled by the five properties
jldi j1, S_NEG
jcall puts
jld j2, j1, NP1
jcall putmix
jldi j1, S_NEG2
jcall puts
jld j2, j1, NP2
jcall putmix
jldi j1, S_NEG3
jcall puts
jld j2, j1, NP4
jcall putmix
jldi j1, S_NEG4
jcall puts
jld j2, j1, NP5
jcall putmix
jldi j1, S_NEG5
jcall puts
jldi j9, 0
jld j10, j1, NNEG
jwhile j10
  jldi j2, 32
  jcall putch
  jldi j1, 0
  jldi j2, 3
  jshl j2, j9, j2
  jld j3, j1, NEGL
  jadd j2, j2, j3
  jld j2, j2, 0
  jadd j12, j2, j1
  jcall mix
  jcall putword
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jldi j2, 10
jcall putch
jcall house_report
jcall skel_report
jcall kin_report
jcall questions
jjmp finish

; The questions it asks itself (Capitan, 2026-11-06: "study the irregular and stop chasing what repeats"). A place said
; both ways, plain and with the switch distilled (negacion.inc) in front, has a rule (the way it was said most) and
; exceptions: an exception asks "why this time the switch?" (where it is mostly said plain) or "why this time without
; it?" (plain where it is mostly said with it). A tie has no rule and asks nothing. They are ordered by the bits the exception surprises
; with, n * log2(N / n) (n the exceptions, N all), and the strongest are written with the renglon where the exception
; was. Uses j1-j14.
questions:
  jldi j1, 0
  jldi j9, 0
  jld j10, j1, RMASK
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j11, 56
    jmul j11, j9, j11
    jld j2, j1, ROOMS
    jadd j11, j11, j2
    jst j1, j11, 48
    jld j2, j11, 0
    jjz j2, qs_next
    jld j2, j11, 40             ; a form of the words' floor, with a switch in the hole
    jldi j3, 2
    jsub j2, j2, j3
    jjnz j2, qs_next
    jld j3, j11, 16
    jjz j3, qs_next
    jadd j2, j3, j1             ; the switch distilled (the five properties)?
    jcall n_flags
    jldi j4, 1
    jand j3, j3, j4
    jjz j3, qs_next
    jcall q_plain               ; and the place said plain
    jjz j4, qs_next
    jld j5, j4, 24              ; said plain, and with the switch
    jld j6, j11, 24
    jsub j7, j5, j6
    jjz j7, qs_next             ; a tie: no rule
    jldi j8, 63
    jsar j7, j7, j8
    jadd j8, j6, j1             ; the exceptions: the fewer
    jjz j7, qs_min
    jadd j8, j5, j1
  qs_min:
    jadd j2, j5, j6
    jst j8, j1, PN
    jcall lg16
    jst j2, j1, ACC
    jld j2, j1, PN
    jcall lg16
    jld j3, j1, ACC
    jsub j3, j3, j2
    jld j2, j1, PN
    jmul j3, j3, j2
    jst j3, j11, 48
  qs_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jcall why_rooms               ; every exception: what it has that the rule never had, and a blind one beside it
  jldi j1, 0
  jst j1, j1, NQ
  jst j1, j1, QI
  jld j2, j1, RMASK
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, QL
  jwhile j2
    jldi j1, 0
    jld j9, j1, QI
    jldi j11, 56
    jmul j11, j9, j11
    jld j2, j1, ROOMS
    jadd j11, j11, j2
    jld j2, j11, 48
    jjz j2, qw_skip
    jcall q_load
    jcall q_occ
    jldi j1, 0
    jldi j2, 1
    jst j2, j1, WMODE
    jcall q_whys
    jcall q_blind
    jldi j1, 0
    jld j2, j1, NQ
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, NQ
  qw_skip:
    jldi j1, 0
    jld j2, j1, QI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QI
    jld j2, j1, QL
    jsub j2, j2, j3
    jst j2, j1, QL
  jwend
  jcall flush
  jcall assoc_report
  jcall flush
  jldi j1, S_QHEAD
  jcall puts
  jldi j2, 20
  jst j2, j1, TOPN
  jwhile j2
    jldi j1, 0                  ; the strongest question left
    jldi j11, 0
    jldi j12, 0
    jldi j9, 0
    jld j10, j1, RMASK
    jldi j2, 1
    jadd j10, j10, j2
    jwhile j10
      jldi j3, 56
      jmul j3, j9, j3
      jld j2, j1, ROOMS
      jadd j3, j3, j2
      jld j2, j3, 48
      jsub j4, j11, j2
      jldi j5, 63
      jsar j4, j4, j5
      jjz j4, qb_next
      jadd j11, j2, j1
      jadd j12, j3, j1
    qb_next:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j11, qs_done
    jst j1, j12, 48
    jst j12, j1, GE
    jadd j2, j11, j1
    jst j2, j1, GS
    jadd j12, j2, j1
    jcall mix
    jcall q_write
    jcall flush
    jldi j1, 0
    jld j2, j1, TOPN
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, TOPN
  jwend
qs_done:
  jret

; The form of the same place said plain, for the form with a switch at j11 -> j4 (0: never said plain). Uses j1-j8.
q_plain:
  jldi j1, 0
  jld j2, j11, 8
  jldi j3, 0
  jcall hw
  jjnz j2, qp_key
  jldi j2, 1
qp_key:
  jadd j5, j2, j1
  jld j2, j1, ROOMS
  jldi j3, 56
  jcall t_find
  jld j5, j4, 0
  jjnz j5, qp_done
  jldi j4, 0
qp_done:
  jret

; The question of the form with a switch at GE (its bits GS): the place, how often each way, and the renglon of the
; exception. Uses j1-j14.
q_write:
  jldi j1, 0
  jld j11, j1, GE
  jcall q_plain
  jst j4, j1, GN
  jldi j2, 32
  jcall putch
  jldi j2, 32
  jcall putch
  jld j2, j1, GS                ; its bits
  jldi j3, 16
  jshr j2, j2, j3
  jcall putnum
  jldi j1, S_QB
  jcall puts
  jld j4, j1, GN                ; the place, as said plain
  jld j9, j4, 32
  jldi j10, 3
  jwhile j10
    jldi j1, 0
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jcall putword
    jldi j2, 32
    jcall putch
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j1, S_Q1                 ; said plain n times, with the switch m
  jcall puts
  jld j4, j1, GN
  jld j2, j4, 24
  jcall putnum
  jldi j1, S_Q2
  jcall puts
  jld j4, j1, GE
  jld j2, j4, 16
  jcall putword
  jldi j1, S_Q3
  jcall puts
  jld j4, j1, GE
  jld j2, j4, 24
  jcall putnum
  jldi j1, S_Q4                 ; why this time (without) the switch?
  jcall puts
  jld j4, j1, GE
  jld j5, j1, GN
  jld j6, j4, 24
  jld j7, j5, 24
  jsub j6, j6, j7
  jldi j7, 63
  jsar j6, j6, j7
  jld j9, j4, 32                ; where the exception was
  jjnz j6, qw_with
  jld j9, j5, 32
  jldi j1, S_Q5
  jcall puts
qw_with:
  jldi j1, 0
  jld j4, j1, GE
  jld j2, j4, 16
  jcall putword
  jldi j2, 63
  jcall putch
  jldi j2, 10
  jcall putch
  jldi j1, S_Q6                 ; its renglon
  jcall puts
  jldi j1, 0
  qw_back:
    jjz j9, qw_start
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, -8
    jjz j2, qw_start
    jldi j2, 1
    jsub j9, j9, j2
    jjmp qw_back
qw_start:
  jldi j10, 1
  jwhile j10
    jldi j1, 0
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jadd j10, j2, j1
    jjz j2, qw_end
    jcall putword
    jldi j2, 32
    jcall putch
    jldi j2, 1
    jadd j9, j9, j2
  qw_end:
  jwend
  jldi j2, 10
  jcall putch
  jld j11, j1, GE               ; its answer: what is irregular against the silhouette of all that is regular
  jcall q_load
  jcall q_occ
  jcall q_answer
  jldi j1, S_ANS
  jcall puts
  jld j2, j1, B1W
  jjnz j2, qw_answer
  jldi j1, S_DUNNO
  jcall puts
  jjmp qw_said
qw_answer:
  jldi j1, S_ANS2
  jcall puts
  jld j2, j1, B1W
  jadd j12, j2, j1
  jcall mix
  jld j3, j1, B1G
  jcall put_cand
  jld j2, j1, B2W
  jjz j2, qw_said
  jldi j1, S_ALSO
  jcall puts
  jld j2, j1, B2W
  jld j3, j1, B2G
  jcall put_cand
  jld j2, j1, B3W
  jjz j2, qw_said
  jldi j2, 44
  jcall putch
  jldi j2, 32
  jcall putch
  jld j2, j1, B3W
  jld j3, j1, B3G
  jcall put_cand
qw_said:
  jcall q_follow                ; through the door: what it brings
  jldi j2, 10                   ; and the evident, asked too (rhetorical): its rule answers itself
  jcall putch
  jldi j1, S_RET1
  jcall puts
  jldi j1, S_RET3
  jld j2, j1, QDIR
  jjz j2, qw_with2
  jldi j1, S_RET2
qw_with2:
  jcall puts
  jld j2, j1, QW
  jcall putword
  jldi j1, S_RET4
  jcall puts
  jld j2, j1, NRL
  jcall putnum
  jldi j1, S_RET5
  jcall puts
  jld j2, j1, NRL
  jld j3, j1, NXL
  jadd j2, j2, j3
  jcall putnum
  jldi j1, S_RET6
  jcall puts
  jldi j2, 10
  jjmp putch

; Through the door of the answer (B1W, the piece the book repeats around the switch): in the renglon of the first
; exception, that piece (after the exception, or else before it) and what it brings, to the first mark, where the book
; itself cuts it: the answer the door carries. Written on a new line; nothing if there is no door. Uses j1-j14.
q_follow:
  jldi j1, 0
  jld j2, j1, B1W
  jjz j2, qf_done
  jld j2, j1, XL                ; the exceptions, in order: the first renglon where the door is
  jst j2, j1, FSTART
  jld j2, j1, NXL
  jst j2, j1, OL
  qf_each:
    jldi j1, 0
    jld j2, j1, OL
    jjz j2, qf_done
    jld j9, j1, FSTART
    jld j9, j9, 0
    jst j9, j1, FPOS
    jcall door_find             ; after the exception
    jjnz j2, qf_found
    jldi j1, 0
    jld j9, j1, FPOS            ; or before it, in its renglon
    jcall r_start
    jcall door_find
    jjnz j2, qf_found
    jldi j1, 0
    jld j2, j1, FSTART
    jldi j3, 8
    jadd j2, j2, j3
    jst j2, j1, FSTART
    jld j2, j1, OL
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, OL
    jjmp qf_each
qf_found:
  jst j9, j1, FPOS
  jldi j2, 10
  jcall putch
  jldi j1, S_BRINGS
  jcall puts
  jld j9, j1, FPOS              ; the door, then its words to the first mark
  jldi j2, 3
  jshl j2, j9, j2
  jld j3, j1, ROOMT
  jadd j2, j2, j3
  jld j2, j2, 0
  jcall putword
  qf_word:
    jldi j1, 0
    jld j9, j1, FPOS
    jldi j2, 1
    jadd j9, j9, j2
    jst j9, j1, FPOS
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jjz j2, qf_done
    jst j2, j1, CXW
    jcall w_mark
    jjnz j3, qf_done
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j2, j1, CXW
    jadd j12, j2, j1
    jcall mix
    jcall putword
    jjmp qf_word
qf_done:
  jret

; From the unit j9 to its renglon's end, the first B1W -> j9 at it, j2 = 1 (0: none). Uses j1-j4.
door_find:
  jldi j1, 0
  jld j4, j1, B1W
  ff_look:
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jjz j2, ff_none
    jsub j3, j2, j4
    jjz j3, ff_yes
    jldi j2, 1
    jadd j9, j9, j2
    jjmp ff_look
ff_yes:
  jldi j2, 1
  jret
ff_none:
  jldi j2, 0
  jret

; The word j2 and its bits j3: "word (x,yz bits)". Uses j1-j5.
put_cand:
  jldi j1, 0
  jst j3, j1, GN
  jcall putword
  jldi j1, S_ANS3
  jcall puts
  jld j2, j1, GN
  jcall putq16
  jldi j1, S_ANS4
  jjmp puts

; The silhouettes of the book, once: how many renglones (NREN) and in how many each word is (ROOMRN); how many have a
; switch (NEGR) and in how many of those each word is (ROOMNC). Uses j1-j14.
neg_sil:
  jldi j1, 0
  jst j1, j1, NREN
  jst j1, j1, NEGR
  jldi j9, 1                    ; a renglon's first unit
  jld j10, j1, NTOK
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j1, 0
    jadd j11, j9, j1            ; to its end, and is there a switch?
    jldi j12, 0
    ns_scan:
      jldi j2, 3
      jshl j2, j11, j2
      jld j3, j1, ROOMT
      jadd j2, j2, j3
      jld j2, j2, 0
      jjz j2, ns_end
      jcall n_flags
      jldi j4, 1
      jand j3, j3, j4
      jor j12, j12, j3
      jldi j2, 1
      jadd j11, j11, j2
      jjmp ns_scan
  ns_end:
    jld j2, j1, NREN            ; every renglon counts; the ones with a switch, again
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, NREN
    jld j2, j1, NEGR
    jadd j2, j2, j12
    jst j2, j1, NEGR
    jadd j13, j9, j1            ; each word once
    ns_count:
      jsub j2, j13, j11
      jjz j2, ns_next
      jldi j2, 3
      jshl j2, j13, j2
      jld j3, j1, ROOMT
      jadd j2, j2, j3
      jld j2, j2, 0
      jldi j3, 3
      jshl j7, j2, j3
      jld j3, j1, ROOMSN
      jadd j3, j3, j7
      jld j4, j3, 0
      jsub j4, j4, j9
      jjz j4, ns_seen
      jst j9, j3, 0
      jld j3, j1, ROOMRN
      jadd j3, j3, j7
      jld j4, j3, 0
      jldi j5, 1
      jadd j4, j4, j5
      jst j4, j3, 0
      jld j3, j1, ROOMNC
      jadd j3, j3, j7
      jld j4, j3, 0
      jadd j4, j4, j12
      jst j4, j3, 0
    ns_seen:
      jldi j2, 1
      jadd j13, j13, j2
      jjmp ns_count
  ns_next:
    jldi j1, 0                  ; the next renglon
    jldi j2, 1
    jadd j11, j11, j2
    jsub j2, j11, j9
    jsub j10, j10, j2
    jadd j9, j11, j1
    jldi j2, 63
    jsar j2, j10, j2
    jjz j2, ns_more
    jldi j10, 0
  ns_more:
  jwend
  jld j2, j1, NREN              ; log2 of the renglones, of those with a switch, of those without
  jcall lg16
  jst j2, j1, LNREN
  jld j2, j1, NEGR
  jcall lg16
  jst j2, j1, LNEG
  jld j2, j1, NREN
  jld j3, j1, NEGR
  jsub j2, j2, j3
  jcall lg16
  jst j2, j1, LNPOS
  jret

; The answer of the question loaded: every piece of its exceptions' renglones (once), weighed by what the book repeats
; outside this exception (c_regular): the question comes from the surprise, the answer from what is regular. Naming one
; of the NCAND pieces costs log2(NCAND). The three that pay the most, most first (B1W..B3W, 0: none). Uses j1-j14.
q_answer:
  jldi j1, 0
  jst j1, j1, B1W
  jst j1, j1, B2W
  jst j1, j1, B3W
  jst j1, j1, B1G
  jst j1, j1, B2G
  jst j1, j1, B3G
  jst j1, j1, NCAND
  jldi j2, 1                    ; first: how many pieces it could name
  jst j2, j1, WMODE
  jcall q_xwalk
  jldi j1, 0
  jld j2, j1, NCAND
  jjz j2, qa_done
  jcall lg16
  jst j2, j1, CCOST
  jldi j2, 2                    ; then: each one's bits
  jst j2, j1, WMODE
  jcall q_xwalk
qa_done:
  jret

; Every piece of the exceptions' renglones, once (a new stamp): WMODE 1 counts them (NCAND), 2 weighs them. Uses
; j1-j14.
q_xwalk:
  jldi j1, 0
  jld j2, j1, STAMP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, STAMP
  jld j2, j1, XL
  jst j2, j1, OI
  jld j2, j1, NXL
  jst j2, j1, OL
  jwhile j2
    jldi j1, 0
    jld j9, j1, OI
    jld j9, j9, 0
    jcall r_start
    xw_word:
      jldi j1, 0
      jldi j2, 3
      jshl j2, j9, j2
      jld j3, j1, ROOMT
      jadd j2, j2, j3
      jld j2, j2, 0
      jjz j2, xw_next
      jldi j3, 3
      jshl j7, j2, j3
      jld j3, j1, ROOMON
      jadd j3, j3, j7
      jld j4, j3, 0
      jld j5, j1, STAMP
      jsub j4, j4, j5
      jjz j4, xw_skip
      jst j5, j3, 0
      jld j3, j1, WMODE
      jldi j4, 1
      jsub j3, j3, j4
      jjnz j3, xw_weigh
      jld j3, j1, NCAND
      jadd j3, j3, j4
      jst j3, j1, NCAND
      jjmp xw_skip
    xw_weigh:
      jst j9, j1, OI2
      jst j2, j1, CXW
      jcall c_regular
      jcall c_keep
      jldi j1, 0
      jld j9, j1, OI2
    xw_skip:
      jldi j2, 1
      jadd j9, j9, j2
      jjmp xw_word
  xw_next:
    jldi j1, 0
    jld j2, j1, OI
    jldi j3, 8
    jadd j2, j2, j3
    jst j2, j1, OI
    jld j2, j1, OL
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, OL
  jwend
  jret

; The bits of the piece CXW as an answer, by what the book repeats outside this exception (the judge of harmony): in
; the n renglones it is in (this one out), whether a switch is there (k of them), coded with its own rate against the
; book's (NEGR / NREN), its rate paying log2(n) / 2, and naming it among NCAND paying log2(NCAND). It answers only in
; the question's direction: for "why this time the switch?" it must come with a switch more than the book does, for
; "why without it?", less. -> j2 (at or below 0: it is no answer). Uses j1-j7.
c_regular:
  jldi j1, 0
  jld j2, j1, CXW               ; the difference asked about is never its own answer
  jcall n_flags
  jldi j4, 1
  jand j3, j3, j4
  jjnz j3, cr_no
  jld j2, j1, CXW
  jldi j3, 3
  jshl j7, j2, j3
  jld j3, j1, ROOMRN            ; n: its renglones, this one out
  jadd j3, j3, j7
  jld j4, j3, 0
  jldi j5, 1
  jsub j4, j4, j5
  jld j3, j1, ROOMNC            ; k: those with a switch (this one had it, if the question asks why the switch)
  jadd j3, j3, j7
  jld j5, j3, 0
  jld j6, j1, QDIR
  jsub j5, j5, j6
  jst j4, j1, RNX
  jst j5, j1, RKX
  jldi j6, 63
  jsar j6, j4, j6
  jjnz j6, cr_no
  jjz j4, cr_no
  jld j6, j1, NREN              ; its direction: k * NREN against NEGR * n
  jmul j6, j5, j6
  jld j7, j1, NEGR
  jmul j7, j7, j4
  jsub j6, j6, j7
  jld j7, j1, QDIR
  jjnz j7, cr_more
  jldi j7, 0
  jsub j6, j7, j6
cr_more:
  jldi j7, 63
  jsar j7, j6, j7
  jjnz j7, cr_no
  jjz j6, cr_no
  jld j2, j1, RNX
  jcall lg16
  jst j2, j1, LGNX
  jst j1, j1, ACC2
  jld j2, j1, RKX               ; k * (log2 k - log2 n - log2 NEGR + log2 NREN)
  jjz j2, cr_rest
  jcall lg16
  jld j3, j1, LGNX
  jsub j2, j2, j3
  jld j3, j1, LNEG
  jsub j2, j2, j3
  jld j3, j1, LNREN
  jadd j2, j2, j3
  jld j3, j1, RKX
  jmul j2, j2, j3
  jst j2, j1, ACC2
cr_rest:
  jld j2, j1, RNX               ; (n - k) * (log2(n - k) - log2 n - log2(NREN - NEGR) + log2 NREN)
  jld j3, j1, RKX
  jsub j2, j2, j3
  jjz j2, cr_cost
  jcall lg16
  jld j3, j1, LGNX
  jsub j2, j2, j3
  jld j3, j1, LNPOS
  jsub j2, j2, j3
  jld j3, j1, LNREN
  jadd j2, j2, j3
  jld j3, j1, RNX
  jld j4, j1, RKX
  jsub j3, j3, j4
  jmul j2, j2, j3
  jld j3, j1, ACC2
  jadd j2, j2, j3
  jst j2, j1, ACC2
cr_cost:
  jld j2, j1, ACC2              ; its rate, and naming it
  jld j3, j1, LGNX
  jldi j4, 1
  jsar j3, j3, j4
  jsub j2, j2, j3
  jld j3, j1, CCOST
  jsub j2, j2, j3
  jret
cr_no:
  jldi j2, -1
  jret

; The piece CXW with bits j2 among the three best (above 0). Uses j1-j6.
c_keep:
  jldi j1, 0
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, ck_done
  jjz j2, ck_done
  jld j3, j1, B1G
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, ck_2
  jld j3, j1, B2W               ; first: the others move down
  jst j3, j1, B3W
  jld j3, j1, B2G
  jst j3, j1, B3G
  jld j3, j1, B1W
  jst j3, j1, B2W
  jld j3, j1, B1G
  jst j3, j1, B2G
  jld j3, j1, CXW
  jst j3, j1, B1W
  jst j2, j1, B1G
  jret
ck_2:
  jld j3, j1, B2G
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, ck_3
  jld j3, j1, B2W
  jst j3, j1, B3W
  jld j3, j1, B2G
  jst j3, j1, B3G
  jld j3, j1, CXW
  jst j3, j1, B2W
  jst j2, j1, B2G
  jret
ck_3:
  jld j3, j1, B3G
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, ck_done
  jld j3, j1, CXW
  jst j3, j1, B3W
  jst j2, j1, B3G
ck_done:
  jret

; The rooms of the whys (once): the lists of where a place is said, and the seven tables by word; then the silhouettes
; of the switch. Uses j1-j14.
why_rooms:
  jldi j1, 0
  jld j2, j1, ROOMOP
  jjnz j2, wr_have
  jld j11, j1, NTOK
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMOP
  jld j11, j1, NTOK
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMOW
  jld j11, j1, NV
  jldi j2, 56
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMMK
  jld j2, j1, NV
  jldi j3, 3
  jshl j2, j2, j3
  jadd j3, j13, j2
  jst j3, j1, ROOMON
  jadd j3, j3, j2
  jst j3, j1, ROOMWY
  jadd j3, j3, j2
  jst j3, j1, ROOMBL
  jadd j3, j3, j2
  jst j3, j1, ROOMRN
  jadd j3, j3, j2
  jst j3, j1, ROOMNC
  jadd j3, j3, j2
  jst j3, j1, ROOMSN
  jcall neg_sil
wr_have:
  jret

; The place of the question at j11 (a form with the switch): its three words QA QB QC (as said plain) and the switch
; QW. Uses j1-j9.
q_load:
  jcall q_plain
  jldi j1, 0
  jld j9, j4, 32
  jldi j3, 3
  jshl j9, j9, j3
  jld j3, j1, ROOMT
  jadd j9, j9, j3
  jld j2, j9, 0
  jst j2, j1, QA
  jld j2, j9, 8
  jst j2, j1, QB
  jld j2, j9, 16
  jst j2, j1, QC
  jld j2, j11, 16
  jst j2, j1, QW
  jret

; Every time the book says the place: plain (QA QB QC) to the list at ROOMOP, with the switch (QA QW QB QC or QA QB
; QW QC) to ROOMOW; then the rule (the way said most) is RL / NRL and the exceptions XL / NXL. Uses j1-j14.
q_occ:
  jldi j1, 0
  jst j1, j1, NPL
  jst j1, j1, NWI
  jld j11, j1, QA
  jld j12, j1, QB
  jld j13, j1, QC
  jld j14, j1, QW
  jld j9, j1, ROOMT
  jldi j8, 0
  jld j10, j1, NTOK
  jldi j2, 3
  jsub j10, j10, j2
  jwhile j10
    jld j2, j9, 0
    jsub j2, j2, j11
    jjnz j2, qo_next
    jld j3, j9, 8
    jld j4, j9, 16
    jld j5, j9, 24
    jsub j2, j3, j12            ; plain
    jjnz j2, qo_w1
    jsub j2, j4, j13
    jjnz j2, qo_w2
    jld j2, j1, NPL
    jldi j6, 3
    jshl j6, j2, j6
    jld j7, j1, ROOMOP
    jadd j6, j6, j7
    jst j8, j6, 0
    jldi j6, 1
    jadd j2, j2, j6
    jst j2, j1, NPL
    jjmp qo_next
  qo_w2:
    jsub j2, j4, j14            ; QA QB QW QC
    jjnz j2, qo_next
    jsub j2, j5, j13
    jjnz j2, qo_next
    jjmp qo_with
  qo_w1:
    jsub j2, j3, j14            ; QA QW QB QC
    jjnz j2, qo_next
    jsub j2, j4, j12
    jjnz j2, qo_next
    jsub j2, j5, j13
    jjnz j2, qo_next
  qo_with:
    jld j2, j1, NWI
    jldi j6, 3
    jshl j6, j2, j6
    jld j7, j1, ROOMOW
    jadd j6, j6, j7
    jst j8, j6, 0
    jldi j6, 1
    jadd j2, j2, j6
    jst j2, j1, NWI
  qo_next:
    jldi j2, 8
    jadd j9, j9, j2
    jldi j2, 1
    jadd j8, j8, j2
    jsub j10, j10, j2
  jwend
  jld j2, j1, NPL               ; the rule is the way said most
  jld j3, j1, NWI
  jsub j4, j3, j2
  jldi j5, 63
  jsar j4, j4, j5
  jld j5, j1, ROOMOP
  jld j6, j1, ROOMOW
  jjnz j4, qo_plain
  jst j1, j1, QDIR              ; the rule is said with the switch: the exceptions are plain (why without it?)
  jst j6, j1, RL
  jst j3, j1, NRL
  jst j5, j1, XL
  jst j2, j1, NXL
  jret
qo_plain:
  jldi j4, 1                    ; the rule is said plain: the exceptions have the switch (why this time it?)
  jst j4, j1, QDIR
  jst j5, j1, RL
  jst j2, j1, NRL
  jst j6, j1, XL
  jst j3, j1, NXL
  jret

; The first unit of the renglon of the unit j9 -> j9. Uses j1-j3.
r_start:
  jldi j1, 0
  jwhile j9
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, -8
    jjz j2, rs_done
    jldi j2, 1
    jsub j9, j9, j2
  jwend
rs_done:
  jret

; Every piece of the renglon of the unit j9 marked with STAMP. Uses j1-j6, j9.
r_mark:
  jcall r_start
  jldi j1, 0
  jld j5, j1, STAMP
  jldi j6, 1
  jwhile j6
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j6, j2, 0
    jjz j6, rm_end
    jldi j3, 3
    jshl j3, j6, j3
    jld j4, j1, ROOMMK
    jadd j3, j3, j4
    jst j5, j3, 0
    jldi j2, 1
    jadd j9, j9, j2
  rm_end:
  jwend
  jret

; Every piece of the renglon of the unit j9 not marked with STAMP (once each): WMODE 1 counts it as a why, 2 as a
; blind why, 3 writes it ("*" if it is an association). Uses j1-j9.
r_why:
  jcall r_start
  jldi j8, 1
  jwhile j8
    jldi j1, 0
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j8, j2, 0
    jjz j8, rw_end
    jldi j3, 3
    jshl j7, j8, j3             ; its offset in the word tables
    jld j4, j1, ROOMMK
    jadd j4, j4, j7
    jld j4, j4, 0
    jld j5, j1, STAMP
    jsub j4, j4, j5
    jjz j4, rw_next             ; it was there too
    jld j4, j1, ROOMON
    jadd j4, j4, j7
    jld j6, j4, 0
    jsub j6, j6, j5
    jjz j6, rw_next             ; already counted
    jst j5, j4, 0
    jld j2, j1, WMODE
    jldi j3, 3
    jsub j3, j2, j3
    jjz j3, rw_write
    jld j4, j1, ROOMWY
    jldi j3, 1
    jsub j3, j2, j3
    jjz j3, rw_bump
    jld j4, j1, ROOMBL
  rw_bump:
    jadd j4, j4, j7
    jld j3, j4, 0
    jldi j2, 1
    jadd j3, j3, j2
    jst j3, j4, 0
    jjmp rw_next
  rw_write:
    jst j9, j1, OI2
    jadd j2, j8, j1
    jcall is_assoc
    jjz j3, rw_plain
    jld j2, j1, CBT               ; the why that saves the most bits is its answer
    jld j3, j1, BESTG
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, rw_star
    jst j2, j1, BESTG
    jst j8, j1, BESTW
  rw_star:
    jldi j2, 42
    jcall putch
  rw_plain:
    jldi j1, 0
    jld j9, j1, OI2
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jcall putword
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j9, j1, OI2
    jldi j8, 1
  rw_next:
    jldi j2, 1
    jadd j9, j9, j2
  rw_end:
  jwend
  jret

; j3 = 1 if the word j2 is an association: it saves bits as one (c_bits above 0; its bits stay in CBT). Uses j1-j7.
is_assoc:
  jcall c_bits
  jldi j1, 0
  jst j2, j1, CBT
  jldi j3, 0
  jldi j4, 63
  jsar j4, j2, j4
  jjnz j4, ia_no
  jjz j2, ia_no
  jldi j3, 1
ia_no:
  jret

; The bits the word j2 saves as an association (in 2^-16; at or below 0 it does not pay), by the judge of harmony:
; whether it is in each of the NQ exceptions, coded with its own rate against coded with the rate of the blind ones
; (Krichevsky-Trofimov: (BL + 1/2) / (NQ + 1)), its own rate paying log2(NQ) / 2. Only if it is in more exceptions than
; blind ones. Uses j1-j7 -> j2.
c_bits:
  jldi j1, 0
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMWY
  jadd j4, j4, j3
  jld j4, j4, 0
  jst j4, j1, CBY
  jld j5, j1, ROOMBL
  jadd j5, j5, j3
  jld j5, j5, 0
  jst j5, j1, CBL
  jsub j6, j5, j4
  jldi j7, 63
  jsar j6, j6, j7
  jjz j6, cb_no
  jld j2, j1, NQ                ; log2 NQ and log2(2 NQ + 2)
  jcall lg16
  jst j2, j1, CBN
  jld j2, j1, NQ
  jadd j2, j2, j2
  jldi j3, 2
  jadd j2, j2, j3
  jcall lg16
  jst j2, j1, CBQ
  jld j2, j1, CBY               ; WY * (log2 WY - log2 NQ - log2(2 BL + 1) + log2(2 NQ + 2))
  jcall lg16
  jld j3, j1, CBN
  jsub j2, j2, j3
  jld j3, j1, CBQ
  jadd j2, j2, j3
  jst j2, j1, CBA
  jld j2, j1, CBL
  jadd j2, j2, j2
  jldi j3, 1
  jadd j2, j2, j3
  jcall lg16
  jld j3, j1, CBA
  jsub j3, j3, j2
  jld j4, j1, CBY
  jmul j3, j3, j4
  jst j3, j1, CBT
  jld j2, j1, NQ                ; (NQ - WY) * (log2(NQ - WY) - log2 NQ - log2(2 NQ - 2 BL + 1) + log2(2 NQ + 2))
  jld j3, j1, CBY
  jsub j2, j2, j3
  jjz j2, cb_cost
  jcall lg16
  jld j3, j1, CBN
  jsub j2, j2, j3
  jld j3, j1, CBQ
  jadd j2, j2, j3
  jst j2, j1, CBA
  jld j2, j1, NQ
  jld j3, j1, CBL
  jsub j2, j2, j3
  jadd j2, j2, j2
  jldi j3, 1
  jadd j2, j2, j3
  jcall lg16
  jld j3, j1, CBA
  jsub j3, j3, j2
  jld j4, j1, NQ
  jld j5, j1, CBY
  jsub j4, j4, j5
  jmul j3, j3, j4
  jld j4, j1, CBT
  jadd j4, j4, j3
  jst j4, j1, CBT
cb_cost:
  jld j2, j1, CBT               ; its own rate: log2(NQ) / 2
  jld j3, j1, CBN
  jldi j4, 1
  jsar j3, j3, j4
  jsub j2, j2, j3
  jret
cb_no:
  jldi j2, -1
  jret

; The whys of the question loaded (q_occ done): in its exceptions, never in its rule; counted (WMODE 1) or written
; (3). Uses j1-j14.
q_whys:
  jldi j1, 0
  jld j2, j1, STAMP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, STAMP
  jld j2, j1, RL                ; the rule's renglones, marked
  jld j3, j1, NRL
  jcall q_markall
  jldi j1, 0                    ; what the exceptions have that the rule never had
  jst j1, j1, OI
  jld j2, j1, NXL
  jst j2, j1, OL
  jwhile j2
    jldi j1, 0
    jld j9, j1, OI
    jldi j3, 3
    jshl j9, j9, j3
    jld j3, j1, XL
    jadd j9, j9, j3
    jld j9, j9, 0
    jcall r_why
    jldi j1, 0
    jld j2, j1, OI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, OI
    jld j2, j1, OL
    jsub j2, j2, j3
    jst j2, j1, OL
  jwend
  jret

; The blind whys of the question loaded: the same, with the rule's first renglon in place of the exceptions (against
; the rule's other renglones and the exceptions'). Uses j1-j14.
q_blind:
  jldi j1, 0
  jld j2, j1, STAMP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, STAMP
  jld j2, j1, RL
  jldi j3, 8
  jadd j2, j2, j3
  jld j3, j1, NRL
  jldi j4, 1
  jsub j3, j3, j4
  jcall q_markall
  jldi j1, 0
  jld j2, j1, XL
  jld j3, j1, NXL
  jcall q_markall
  jldi j1, 0
  jldi j2, 2
  jst j2, j1, WMODE
  jld j9, j1, RL
  jld j9, j9, 0
  jcall r_why
  jret

; The renglones of the j3 units listed at j2, marked with STAMP. Uses j1-j9.
q_markall:
  jldi j1, 0
  jst j2, j1, OI
  jst j3, j1, OL
  jwhile j3
    jldi j1, 0
    jld j9, j1, OI
    jld j9, j9, 0
    jcall r_mark
    jldi j1, 0
    jld j2, j1, OI
    jldi j3, 8
    jadd j2, j2, j3
    jst j2, j1, OI
    jld j3, j1, OL
    jldi j4, 1
    jsub j3, j3, j4
    jst j3, j1, OL
  jwend
  jret

; The associations that came up: the words that save the most bits as one (c_bits: in more exceptions than blind, up to
; fifteen, each with its whys and blind whys). Uses j1-j14.
assoc_report:
  jldi j1, S_ASSOC
  jcall puts
  jld j2, j1, NQ
  jcall putmix
  jldi j1, S_ASSOC2
  jcall puts
  jldi j2, 15
  jst j2, j1, OL
  jwhile j2
    jldi j1, 0                  ; the most bits left
    jldi j11, 0
    jldi j12, 0
    jldi j9, 1
    jld j10, j1, NV
    jldi j2, 1
    jsub j10, j10, j2
    jwhile j10
      jadd j2, j9, j1
      jcall is_assoc
      jjz j3, ar_next
      jldi j1, 0
      jldi j3, 3
      jshl j5, j9, j3
      jld j3, j1, ROOMON        ; (taken: -1)
      jadd j3, j3, j5
      jld j3, j3, 0
      jldi j4, 1
      jadd j3, j3, j4
      jjz j3, ar_next
      jld j3, j1, CBT
      jsub j4, j11, j3
      jldi j6, 63
      jsar j4, j4, j6
      jjz j4, ar_next
      jadd j11, j3, j1
      jadd j12, j9, j1
    ar_next:
      jldi j1, 0
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j12, ar_done
    jldi j3, 3
    jshl j5, j12, j3
    jld j3, j1, ROOMON
    jadd j3, j3, j5
    jldi j4, -1
    jst j4, j3, 0
    jst j12, j1, OI
    jldi j2, 32
    jcall putch
    jld j2, j1, OI
    jadd j12, j2, j1
    jcall mix
    jcall putword
    jldi j2, 40
    jcall putch
    jld j2, j1, OI
    jldi j3, 3
    jshl j5, j2, j3
    jld j3, j1, ROOMWY
    jadd j3, j3, j5
    jld j2, j3, 0
    jcall putnum
    jldi j2, 47
    jcall putch
    jld j2, j1, OI
    jldi j3, 3
    jshl j5, j2, j3
    jld j3, j1, ROOMBL
    jadd j3, j3, j5
    jld j2, j3, 0
    jcall putnum
    jldi j2, 41
    jcall putch
    jldi j1, 0
    jld j2, j1, OL
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, OL
  jwend
ar_done:
  jldi j2, 10
  jjmp putch

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
  jst j1, j1, GN                ; the pieces written, to give them back their bits after
  jldi j2, 10
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
    jld j3, j1, GN
    jldi j4, 3
    jshl j4, j3, j4
    jst j12, j4, QBUF
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, GN
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
    jldi j1, S_PP1                ; and its bits per pair: does it win by what each pair says, or by how many?
    jcall puts
    jld j12, j1, RENT
    jadd j2, j11, j1
    jld j3, j12, 32
    jdiv j2, j2, j3
    jcall putq16
    jldi j1, S_PP2
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
  jldi j1, 0                    ; the bits given back
  jld j9, j1, GN
  jldi j10, QBUF
  jwhile j9
    jld j3, j10, 0
    jld j2, j3, 40
    jsub j2, j1, j2
    jst j2, j3, 40
    jldi j2, 8
    jadd j10, j10, j2
    jldi j2, 1
    jsub j9, j9, j2
  jwend
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


; The foundation and the furniture (Capitan, 2026-11-06: "two cores that explain an object or an action, and glue,
; the structure that gives the cores their sense; two meanings, the structural one and the one of sense: the
; foundations and the furniture inside a house"). By the one rule: in every pulse "the same place, another word", what
; was kept is foundation and what changed is furniture. Each word is judged against the book's own share of kept
; (all kept over all): its k kept of n, coded with its own share against the book's, its share paying log2(n) / 2.
; Above the book's share and paying: foundation; below and paying: furniture; else neither yet. The fifteen of each
; that pay the most are written. Uses j1-j14.
house_report:
  jcall house_decide
  jcall flush
  jldi j1, S_HOUSE              ; the line: the book's share kept, the rounds, how many of each, the fifteen of each
  jcall puts
  jld j2, j1, SFX
  jld j3, j1, SVR
  jadd j3, j3, j2
  jcall putpct
  jldi j1, S_HRND
  jcall puts
  jld j2, j1, NRND
  jcall putmix
  jldi j1, S_HFND
  jcall puts
  jld j2, j1, NFND
  jcall putmix
  jldi j1, S_HCOL
  jcall puts
  jldi j2, 1
  jcall h_top
  jldi j1, S_HFUR
  jcall puts
  jld j2, j1, NFUR
  jcall putmix
  jldi j1, S_HCOL
  jcall puts
  jldi j2, -1
  jcall h_top
  jldi j2, 10
  jjmp putch
hr_none:
  jret

; The fifteen words with the most bits on the side j2 (1 foundation, -1 furniture), each "word (bits)". Uses j1-j14.
h_top:
  jldi j1, 0
  jst j2, j1, HSIDE
  jldi j2, 15
  jst j2, j1, OL
  jwhile j2
    jldi j1, 0
    jldi j11, 0
    jldi j12, 0
    jldi j9, 1
    jld j10, j1, NV
    jldi j2, 1
    jsub j10, j10, j2
    jwhile j10
      jldi j3, 3
      jshl j3, j9, j3
      jld j4, j1, ROOMGB
      jadd j3, j3, j4
      jld j2, j3, 0
      jld j4, j1, HSIDE
      jmul j2, j2, j4
      jsub j4, j11, j2
      jldi j5, 63
      jsar j4, j4, j5
      jjz j4, ht_next
      jadd j11, j2, j1
      jadd j12, j9, j1
    ht_next:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j12, ht_done
    jldi j3, 3                  ; taken
    jshl j3, j12, j3
    jld j4, j1, ROOMGB
    jadd j3, j3, j4
    jst j1, j3, 0
    jst j11, j1, HK
    jldi j2, 32
    jcall putch
    jadd j2, j12, j1
    jadd j12, j2, j1
    jcall mix
    jcall putword
    jldi j2, 40
    jcall putch
    jldi j1, 0
    jld j2, j1, HK
    jldi j3, 16
    jshr j2, j2, j3
    jcall putnum
    jldi j2, 41
    jcall putch
    jldi j1, 0
    jld j2, j1, OL
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, OL
  jwend
ht_done:
  jret


; The skeleton (Capitan, 2026-11-06: "el nino se cayo porque no miro / el hombre miro porque estaba arriba / la nina
; temblo porque tenia miedo: el _ porque _; it is recognised in the structure though the furniture changed"). The
; skeleton of each place: the two pieces before it and the two after, the foundations as they are and the furniture as
; holes (the house decided above). The same skeleton comes back all over the book with other things inside; what fills
; a place of it is furniture if it keeps being something else (open), structure if it is always the same few (closed:
; a door changed for another door). Each place weighs how open its skeleton is (different fillings over all of them);
; each word, how open the places it fills are; where those values part in two, best (n_split), is the cut. Uses j1-j14.
skel_report:
  jldi j1, 0                    ; its rooms: the skeletons {key, fillings, different}, the forms seen, and by word the
  jld j2, j1, NTOK              ; openness summed and its places
  jadd j2, j2, j2
  jcall pow2
  jldi j4, 1
  jsub j4, j3, j4
  jst j4, j1, KMASK
  jldi j4, 32
  jmul j11, j3, j4
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMK1
  jld j3, j1, KMASK
  jldi j4, 1
  jadd j3, j3, j4
  jldi j4, 5
  jshl j11, j3, j4
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMK2
  jld j11, j1, NV
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMOP2
  jld j2, j1, NV
  jldi j3, 3
  jshl j2, j2, j3
  jadd j2, j13, j2
  jst j2, j1, ROOMOC
  jadd j2, j2, j2
  jsub j2, j2, j13
  jst j2, j1, ROOMKT            ; (and the words already written)
  jld j11, j1, NTOK              ; by place: its skeleton and its filling
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMPS
  jld j11, j1, NTOK
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMPF
  jldi j2, 1                    ; first: every place into its skeleton
  jst j2, j1, KMODE
  jcall k_walk
  jldi j1, 0                    ; then: every word, how open its places are
  jldi j2, 2
  jst j2, j1, KMODE
  jcall k_walk
  jldi j1, 0                    ; where the words' openness parts in two (seen twice or more: the anecdote rule)
  jst j1, j1, NVL
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jcall k_open
    jjz j3, kr2_next
    jcall n_vput
  kr2_next:
    jldi j1, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jcall n_split
  jcall flush
  jldi j1, S_SKEL
  jcall puts
  jld j2, j1, CUT2
  jldi j3, 1
  jshr j2, j2, j3
  jldi j3, 0                    ; (in 2^-16)
  jshi j3, 1
  jshi j3, 0
  jcall putpct
  jldi j1, S_SKC
  jcall puts
  jldi j2, 1
  jcall k_top
  jldi j1, S_SKO
  jcall puts
  jldi j2, 0
  jcall k_top
  jldi j2, 10
  jjmp putch

; Every place of the row (a word, not a renglon) with its skeleton: KMODE 1 counts it into its skeleton (its filling
; once more, a different filling once more), 2 adds to its word how open its skeleton is (different over all, in
; 2^-16). Uses j1-j14.
k_walk:
  jldi j1, 0
  jldi j2, 2
  jst j2, j1, KI
  jld j2, j1, NTOK
  jldi j3, 4
  jsub j2, j2, j3
  jst j2, j1, KL
  jwhile j2
    jldi j1, 0
    jld j9, j1, KI
    jldi j3, 3
    jshl j9, j9, j3
    jld j3, j1, ROOMT
    jadd j9, j9, j3
    jld j12, j9, 0              ; the filling
    jjz j12, kw_next
    jld j2, j1, FNVO            ; its skeleton: two before, two after, each a foundation, a hole or the renglon's end
    jld j3, j9, -16
    jcall k_elem
    jcall hw
    jld j3, j9, -8
    jcall k_elem
    jcall hw
    jld j3, j9, 8
    jcall k_elem
    jcall hw
    jld j3, j9, 16
    jcall k_elem
    jcall hw
    jjnz j2, kw_key
    jldi j2, 1
  kw_key:
    jadd j5, j2, j1
    jst j5, j1, KKEY
    jld j2, j1, ROOMK1
    jldi j3, 32
    jcall k_find
    jld j6, j4, 0
    jjnz j6, kw_old
    jst j5, j4, 0
  kw_old:
    jld j2, j1, KMODE
    jldi j3, 1
    jsub j2, j2, j3
    jjnz j2, kw_weigh
    jld j6, j4, 8               ; one more filling
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j4, 8
    jst j4, j1, KENT
    jld j2, j1, KKEY            ; a different one?
    jadd j3, j12, j1
    jcall hw
    jjnz j2, kw_k2
    jldi j2, 1
  kw_k2:
    jadd j5, j2, j1
    jld j2, j1, ROOMK2
    jldi j3, 32
    jcall k_find
    jld j6, j4, 8               ; this filling in this skeleton, once more
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j4, 8
    jld j6, j1, KI              ; the place keeps its skeleton and its filling there
    jldi j7, 3
    jshl j6, j6, j7
    jld j7, j1, ROOMPS
    jadd j7, j7, j6
    jld j8, j1, KENT
    jst j8, j7, 0
    jld j7, j1, ROOMPF
    jadd j7, j7, j6
    jst j4, j7, 0
    jld j6, j4, 0
    jjnz j6, kw_next
    jst j5, j4, 0
    jld j4, j1, KENT
    jld j6, j4, 16
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j4, 16
    jjmp kw_next
  kw_weigh:
    jld j2, j4, 16              ; how open: different over all
    jldi j3, 16
    jshl j2, j2, j3
    jld j3, j4, 8
    jdiv j2, j2, j3
    jldi j3, 3
    jshl j3, j12, j3
    jld j4, j1, ROOMOP2
    jadd j4, j4, j3
    jld j5, j4, 0
    jadd j5, j5, j2
    jst j5, j4, 0
    jld j4, j1, ROOMOC
    jadd j4, j4, j3
    jld j5, j4, 0
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j4, 0
  kw_next:
    jldi j1, 0
    jld j2, j1, KI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, KI
    jld j2, j1, KL
    jsub j2, j2, j3
    jst j2, j1, KL
  jwend
  jret

; A piece j3 as an element of a skeleton -> j3: itself if a foundation, the renglon's end as it is (0), else a hole
; (-1). Uses j1, j3, j4, j6.
k_elem:
  jldi j1, 0
  jjz j3, ke_done
  jldi j4, 3
  jshl j4, j3, j4
  jld j6, j1, ROOMSD
  jadd j4, j4, j6
  jld j4, j4, 0
  jldi j6, 63
  jsar j6, j4, j6
  jjnz j6, ke_hole
  jjnz j4, ke_done
ke_hole:
  jldi j3, -1
ke_done:
  jret

; The place of key j5 in the table at j2, j3 bytes a place (KMASK places) -> j4. Uses j1, j4, j6-j8.
k_find:
  jldi j1, 0
  jldi j6, 32
  jshr j6, j5, j6
  jxor j6, j6, j5
  jld j7, j1, KMASK
  jand j6, j6, j7
  jldi j8, 1
  jwhile j8
    jmul j4, j6, j3
    jadd j4, j4, j2
    jld j7, j4, 0
    jsub j8, j7, j5
    jjnz j7, kf_full
    jldi j8, 0
  kf_full:
    jldi j7, 1
    jadd j6, j6, j7
    jld j7, j1, KMASK
    jand j6, j6, j7
  jwend
  jret

; How open the places of the word j9 are, in 2^-16 -> j2; j3 = 1 if it filled two places or more. Uses j1-j5.
k_open:
  jldi j1, 0
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, ROOMOC
  jadd j4, j4, j3
  jld j5, j4, 0
  jld j4, j1, ROOMOP2
  jadd j4, j4, j3
  jld j2, j4, 0
  jldi j3, 0
  jldi j4, 2
  jsub j4, j5, j4
  jldi j1, 63
  jsar j4, j4, j1
  jldi j1, 0
  jjnz j4, ko_done
  jdiv j2, j2, j5
  jldi j3, 1
ko_done:
  jret

; The twenty-five words seen most on one side of the cut, each "word (openness%)": j2 = 1 the closed (structure), 0
; the open (furniture). Uses j1-j14.
k_top:
  jldi j1, 0
  jst j2, j1, KSIDE
  jldi j2, 25
  jst j2, j1, OL
  jwhile j2
    jldi j1, 0
    jldi j11, 0
    jldi j12, 0
    jldi j9, 1
    jld j10, j1, NV
    jldi j2, 1
    jsub j10, j10, j2
    jwhile j10
      jcall k_open
      jjz j3, kt_next
      jadd j2, j2, j2           ; its side
      jld j3, j1, CUT2
      jsub j3, j3, j2
      jldi j4, 63
      jsar j3, j3, j4           ; -1: open
      jldi j4, 1
      jadd j3, j3, j4           ; 1 closed, 0 open
      jld j4, j1, KSIDE
      jsub j3, j3, j4
      jjnz j3, kt_next
      jldi j3, 3
      jshl j3, j9, j3
      jld j4, j1, ROOMKT
      jadd j4, j4, j3
      jld j5, j4, 0
      jldi j6, -7
      jsub j5, j5, j6
      jjz j5, kt_next           ; already written
      jld j4, j1, ROOMOC
      jadd j4, j4, j3
      jld j5, j4, 0
      jsub j4, j11, j5
      jldi j6, 63
      jsar j4, j4, j6
      jjz j4, kt_next
      jadd j11, j5, j1
      jadd j12, j9, j1
    kt_next:
      jldi j1, 0
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j12, kt_done
    jldi j3, 3
    jshl j3, j12, j3
    jld j4, j1, ROOMKT
    jadd j4, j4, j3
    jldi j5, -7
    jst j5, j4, 0
    jst j12, j1, KI
    jldi j2, 32
    jcall putch
    jld j2, j1, KI
    jadd j12, j2, j1
    jcall mix
    jcall putword
    jld j9, j1, KI
    jcall k_open
    jldi j3, 0
    jshi j3, 1
    jshi j3, 0
    jcall putpct
    jldi j1, 0
    jld j2, j1, OL
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, OL
  jwend
kt_done:
  jret


; You are what your siblings are (Capitan, 2026-11-06: "join the two looks"). The structure starts as the house's
; foundations; a word not yet structure becomes it when most of the others that fill its places (in the skeletons, by
; who they are, not how often: kn_walk) are structure. Words are only added, never taken out, so it ends. Written:
; how many rounds, how many words, and the fifty seen most. Uses j1-j14.
kin_report:
  jldi j1, 0                    ; by word: structure, its siblings that are structure, all its siblings
  jld j11, j1, NV
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMST
  jld j2, j1, NV
  jldi j3, 3
  jshl j2, j2, j3
  jadd j3, j13, j2
  jst j3, j1, ROOMSS
  jadd j3, j3, j2
  jst j3, j1, ROOMSA
  jldi j9, 1                    ; the seed: the house's foundations
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMSD
    jadd j3, j3, j2
    jld j3, j3, 0
    jldi j4, 63
    jsar j4, j3, j4
    jjnz j4, ks_no
    jjz j3, ks_no
    jld j3, j1, ROOMST
    jadd j3, j3, j2
    jldi j4, 1
    jst j4, j3, 0
  ks_no:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jst j1, j1, NKR
kn_round:
  jldi j1, 0                    ; every skeleton: how many of its fillings are structure, this round
  jld j9, j1, ROOMK1
  jld j10, j1, KMASK
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jst j1, j9, 24
    jldi j2, 32
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j2, 1
  jst j2, j1, KMODE
  jcall kn_walk
  jldi j1, 0                    ; every word: its siblings, from nothing
  jld j9, j1, ROOMSS
  jld j10, j1, NV
  jadd j10, j10, j10
  jwhile j10
    jst j1, j9, 0
    jldi j2, 8
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j2, 2
  jst j2, j1, KMODE
  jcall kn_walk
  jldi j1, 0                    ; most of its siblings structure: it is structure too
  jst j1, j1, NKADD
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMST
    jadd j3, j3, j2
    jld j4, j3, 0
    jjnz j4, ka_next
    jld j4, j1, ROOMSS
    jadd j4, j4, j2
    jld j4, j4, 0
    jld j5, j1, ROOMSA
    jadd j5, j5, j2
    jld j5, j5, 0
    jjz j5, ka_next
    jadd j4, j4, j4
    jsub j4, j5, j4
    jldi j6, 63
    jsar j4, j4, j6
    jjz j4, ka_next
    jldi j4, 1
    jst j4, j3, 0
    jld j4, j1, NKADD
    jldi j6, 1
    jadd j4, j4, j6
    jst j4, j1, NKADD
  ka_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jld j2, j1, NKR
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, NKR
  jld j2, j1, NKADD
  jjnz j2, kn_round
  jcall flush                   ; written: the rounds, how many, the fifty seen most
  jldi j1, S_KIN
  jcall puts
  jld j2, j1, NKR
  jcall putmix
  jldi j2, 32
  jcall putch
  jldi j1, 0
  jldi j9, 1
  jldi j11, 0
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMST
    jadd j3, j3, j2
    jld j3, j3, 0
    jadd j11, j11, j3
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jadd j2, j11, j1
  jcall putmix
  jldi j2, 10
  jcall putch
  jldi j2, 32
  jcall putch
  jldi j2, 50
  jst j2, j1, OL
  jwhile j2
    jldi j1, 0
    jldi j11, 0
    jldi j12, 0
    jldi j9, 1
    jld j10, j1, NV
    jldi j2, 1
    jsub j10, j10, j2
    jwhile j10
      jldi j3, 3
      jshl j3, j9, j3
      jld j4, j1, ROOMST
      jadd j4, j4, j3
      jld j4, j4, 0
      jldi j5, 1
      jsub j4, j4, j5
      jjnz j4, kt2_next
      jld j4, j1, ROOMOC
      jadd j4, j4, j3
      jld j5, j4, 0
      jsub j4, j11, j5
      jldi j6, 63
      jsar j4, j4, j6
      jjz j4, kt2_next
      jadd j11, j5, j1
      jadd j12, j9, j1
    kt2_next:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j12, kt2_done
    jldi j3, 3                  ; written: marked 2
    jshl j3, j12, j3
    jld j4, j1, ROOMST
    jadd j4, j4, j3
    jldi j5, 2
    jst j5, j4, 0
    jldi j2, 32
    jcall putch
    jadd j2, j12, j1
    jadd j12, j2, j1
    jcall mix
    jcall putword
    jldi j1, 0
    jld j2, j1, OL
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, OL
  jwend
kt2_done:
  jldi j2, 10
  jjmp putch

; Every place of the row with its skeleton, the siblings counted by who they are, not how often (each different
; filling once, by a stamp of the round in its form): KMODE 1 adds its filling, if structure, to the skeleton's
; different structure fillings; 2 adds to its filling, if not structure, once per skeleton, its siblings there (the
; different structure ones, and all the different ones but itself). Uses j1-j14.
kn_walk:
  jldi j1, 0
  jld j2, j1, NKR
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, KRSTAMP
  jldi j9, 2
  jld j10, j1, NTOK
  jldi j2, 4
  jsub j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMPS
    jadd j3, j3, j2
    jld j3, j3, 0               ; its skeleton
    jjz j3, kn_next
    jld j4, j1, ROOMT
    jadd j4, j4, j2
    jld j4, j4, 0               ; its filling
    jldi j5, 3
    jshl j5, j4, j5
    jld j6, j1, ROOMST
    jadd j6, j6, j5
    jld j6, j6, 0               ; structure?
    jld j7, j1, KMODE
    jldi j8, 1
    jsub j7, j7, j8
    jld j11, j1, ROOMPF         ; its form (this filling in this skeleton)
    jadd j11, j11, j2
    jld j11, j11, 0
    jld j12, j1, KRSTAMP
    jjnz j7, kn_sib
    jjz j6, kn_next
    jld j7, j11, 16             ; this structure filling, once in its skeleton
    jsub j7, j7, j12
    jjz j7, kn_next
    jst j12, j11, 16
    jld j7, j3, 24
    jadd j7, j7, j8
    jst j7, j3, 24
    jjmp kn_next
  kn_sib:
    jjnz j6, kn_next
    jld j7, j11, 24             ; once per skeleton for this word
    jsub j7, j7, j12
    jjz j7, kn_next
    jst j12, j11, 24
    jld j7, j3, 24              ; siblings structure (different)
    jld j8, j1, ROOMSS
    jadd j8, j8, j5
    jld j11, j8, 0
    jadd j11, j11, j7
    jst j11, j8, 0
    jld j7, j3, 16              ; all siblings (different), itself out
    jldi j8, 1
    jsub j7, j7, j8
    jld j8, j1, ROOMSA
    jadd j8, j8, j5
    jld j11, j8, 0
    jadd j11, j11, j7
    jst j11, j8, 0
  kn_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret

include 'casa.inc'
include 'pulso.inc'
include 'negacion.inc'
include 'lectura.inc'
