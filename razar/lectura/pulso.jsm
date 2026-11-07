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
S_DEEP  = 0F80h
S_CONC  = 0FC0h
SPH   = 1CC8h                   ; shelf_print: its fingerprint so far, the entry, how many left, the handle
SPA   = 1CD0h
SPN   = 1CD8h
SPHD  = 1CE0h
OGFILL = 1C40h                  ; the audit of its organs: the garbage, how many, their room, which one, the exams
AUDN  = 1C48h                   ; without organ before and after, the passes of each invariant, the canonical tried
AUD   = 1C50h
AUDI  = 1C58h
AUDB0 = 1C60h
AUDB1 = 1C68h
AUDOK1 = 1C70h
AUDOK2 = 1C78h
AUDNC = 1C80h
AUDC  = 1C88h
BOOKH = 1CE8h                   ; the fingerprint of its shelf as it read it (names and bytes): news is a new one
OGWAKE = 1CF0h                  ; someone else rang while it waited on a child of its organs: it is told at its rest
REBORN = 1CF8h                  ; news woke it: it is reborn (forgotten with what it read)
EVC   = 1D00h                   ; evolving the instincts: the champion, the second, their exams, the child, the
EVR   = 1D08h                   ; generations left, the luck, an exam, the generation, the child kept, the champion
EVCS  = 1D10h                   ; kept, a line is the champion, two temporaries
EVRS  = 1D18h
EVCH  = 1D20h
EVG   = 1D28h
RNG   = 1D30h
EVS   = 1D38h
EVI   = 1D40h
EVC2  = 1D48h
EVKEEP = 1D50h
EVW   = 1D58h
EVT   = 1D60h
EVT2  = 1D68h
EVGA  = 1D70h                   ; a log; the labels "nido" and "autopsia"; the nest: {its mark, the champion, the
NIDL  = 1D78h                   ; second, their exams, the luck, the generations it lived} (56 bytes)
AUTL  = 1E38h                   ; (16 bytes: "autopsia" and its number)
NEST  = 1D88h
EVLIV = 1DC0h                   ; the generations it has lived, all its life
QUIEN = 1DC8h                   ; who it is (0: alone); the length of its nest label; its letter, the other's, the genome
NIDN  = 1DD0h                   ; that came in it, and whether one came
CARL  = 1DD8h
OTRL  = 1DE0h
CARTA = 1DE8h
PARTOK = 1DF0h
VIGIL = 1DF8h                   ; awake for good (1); it knows who it is; its sibling's cabin; the champion as the
VQ    = 1E00h                   ; stretch began; the generations of a stretch; a word read
PARTNER = 1E08h
EVJC  = 1E10h
EVG0  = 1E18h
MAILV = 1E20h
AUTN  = 1E30h
WOKE  = 1E48h                   ; who woke it: its sibling, or itself (the sentinel: news in the files)                   ; the length of its autopsy label
RBC   = 1E50h                   ; how many times it has been reborn (kept: it is part of who it is)
MEML  = 1E58h                   ; its memory: "memoria" and its number (MEMN bytes), its handle, how many in it, the
MEMN  = 1E60h                   ; bytes read, the room it is written in, a name's price, how many came from this life
MEMH  = 1E68h
MCNT  = 1E70h
MSZ   = 1E78h
MBUFP = 1E80h
MCOST = 1E88h
MNOW  = 1E90h
MHELP = 1E98h                   ; how many pieces now pay with what they carried (more than this reading saw)
OGN   = 1EA0h                   ; its organs: trials left, its molde (room, bytes), the room for signatures and words,
OGM   = 1EA8h                   ; the organ it has and the one tried, the score to beat, the candidate's budget, the
OGML  = 1EB0h                   ; child it waits on, the candidate's score, and two to keep
OGPEND = 1EB8h
OGCODE = 1EC0h
OGTRY = 1EC8h
OGBASE = 1ED0h
OGBUD = 1ED8h
OGKID = 1EE0h
OGSC  = 1EE8h
OGT   = 1EF0h
OGLET = 1EF8h
ROOMOP = 1900h                  ; the questions: where the place is said plain, and with the switch
ROOMOW = 1908h
LETB  = 1CA0h                   ; a letter as it travels: {genome, organ} (what it has, never what it read), the
PORG  = 1CB0h                   ; other's organ to try first, and the last letter of the other it read
LSEEN = 1CB8h
OPCAP = 1C90h                   ; the places of the two lists (they grow with what they hold)
OWCAP = 1C98h
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
KNEW  = 1B58h                   ; the skeletons: a form born now, the skeletons {key, fillings, different}, the forms
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

jldi j11, 4096                  ; the list of its rooms (4096 of them): to give them all back when it is reborn
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, RLIST
renace:
jldi j0, 0                      ; the fingerprint
jcall read_book
jldi j1, 0                      ; awake for good, the fingerprint of what it read: the sentinel's word is checked
jld j2, j1, NPAS                ; against it
jldi j3, 32
jshr j2, j2, j3
jldi j3, 255
jand j2, j2, j3
jjz j2, rn_print
jcall shelf_print
jldi j1, 0
jst j2, j1, BOOKH
rn_print:
jldi j2, ORGAN_CANDIDATE        ; a candidate built by Razar: it sits its exam and says its score, nothing more
jjz j2, rn_razar
jjmp candidate
rn_razar:
jldi j1, 0                      ; (reborn: what it ate, the books and the words)
jld j2, j1, RBC
jjz j2, rn_first
jldi j2, 0                      ; "renace"
jshi j2, 0000h
jshi j2, 6563h
jshi j2, 616Eh
jshi j2, 6572h
jcall put8
jldi j2, 32
jcall putch
jld j2, j1, SHN
jcall putmix
jldi j2, 32
jcall putch
jld j2, j1, NTOK
jcall putmix
jldi j2, 10
jcall putch
jcall flush
rn_first:
jcall distill_no                ; the switch first (it needs no pulse): the forms kept are of its kind
jldi j1, 0                      ; the forms seen are kept: the irregular is studied over them
jldi j2, 1
jst j2, j1, FORMS
jcall evolve                    ; the instincts, built and recombined, if "p" asks for generations
jldi j1, 0                      ; news woke it: reborn, its identity and its evolution kept, everything it read given
jld j2, j1, REBORN              ; back and read again, the new books with the old
jjz j2, rn_no
jcall reborn
jjmp renace
rn_no:
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
jcall flush
jcall concept_report
jcall flush                     ; the bits each kind's pieces save
jldi j1, S_DEEP
jcall puts
jldi j9, 1
jldi j10, 4
jwhile j10
  jldi j2, 32
  jcall putch
  jldi j1, 0
  jldi j3, 3
  jshl j3, j9, j3
  jld j2, j3, SAVC              ; (in all: per pulse, over the pulses its line says)
  jcall putq16
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jldi j2, 10
jcall putch
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
  jld j10, j1, SMSK
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
  jld j2, j1, SMSK
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
    jld j10, j1, SMSK
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
  jldi j2, ROOMS
  jcall pl_find
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
  jldi j11, 128                 ; (each a list that grows with what it holds, from 16: they were made for every place
  jcall room                    ; of the book, and hold the times one place is said)
  jldi j1, 0
  jst j13, j1, ROOMOP
  jldi j11, 128
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMOW
  jldi j2, 16
  jst j2, j1, OPCAP
  jst j2, j1, OWCAP
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

; The list whose room is at j2 and its places at j3, full, with twice its places: what it holds copied, the old room
; given back. Uses j1-j7 (j8-j14 kept, at crece.inc's PLS and PLK: never in use at once).
ql_grow:
  jldi j1, 0
  jst j8, j1, PLK
  jst j9, j1, PLS
  jst j10, j1, PLS + 8
  jst j11, j1, PLS + 16
  jst j12, j1, PLS + 24
  jst j13, j1, PLS + 32
  jst j14, j1, PLS + 40
  jst j2, j1, PLD
  jst j3, j1, PLO
  jld j11, j3, 0
  jldi j4, 4
  jshl j11, j11, j4
  jcall room
  jldi j1, 0
  jld j2, j1, PLD
  jld j3, j1, PLO
  jld j5, j2, 0                 ; the old room
  jst j13, j2, 0
  jld j4, j3, 0
  jst j5, j1, PLN
  jldi j6, 0
  jwhile j4
    jadd j7, j5, j6
    jld j7, j7, 0
    jadd j2, j13, j6
    jst j7, j2, 0
    jldi j2, 8
    jadd j6, j6, j2
    jldi j2, 1
    jsub j4, j4, j2
  jwend
  jld j3, j1, PLO
  jld j4, j3, 0
  jadd j4, j4, j4
  jst j4, j3, 0
  jldi j10, 3
  jld j11, j1, PLN
  jcall ask
  jldi j1, 0
  jld j8, j1, PLK
  jld j9, j1, PLS
  jld j10, j1, PLS + 8
  jld j11, j1, PLS + 16
  jld j12, j1, PLS + 24
  jld j13, j1, PLS + 32
  jld j14, j1, PLS + 40
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
    jld j6, j1, OPCAP           ; (full: it doubles first)
    jsub j6, j2, j6
    jjnz j6, qo_room
    jldi j2, ROOMOP
    jldi j3, OPCAP
    jcall ql_grow
    jldi j1, 0
    jld j2, j1, NPL
  qo_room:
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
    jld j6, j1, OWCAP           ; (full: it doubles first)
    jsub j6, j2, j6
    jjnz j6, qo_room2
    jldi j2, ROOMOW
    jldi j3, OWCAP
    jcall ql_grow
    jldi j1, 0
    jld j2, j1, NWI
  qo_room2:
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


; The concepts: how many (groups of two words or more), how often two associates of what it never read fall in one
; (real, and blind), and the eight biggest, ten words each. Their sizes go into j0. Uses j1-j14.
concept_report:
  jldi j1, 0                    ; sizes, at each root's best bits (no longer needed)
  jldi j9, 0
  jld j10, j1, NV
  jwhile j10
    jldi j1, 0
    jldi j3, 24
    jmul j3, j9, j3
    jld j4, j1, ROOMUF
    jadd j3, j3, j4
    jst j1, j3, 8
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j9, 0
  jld j10, j1, NV
  jwhile j10
    jldi j1, 0
    jldi j3, 24
    jmul j3, j9, j3
    jld j4, j1, ROOMUF
    jadd j3, j3, j4
    jld j3, j3, 16
    jjz j3, cr_next
    jadd j2, j9, j1
    jcall uf_find
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMUF
    jadd j3, j3, j4
    jld j4, j3, 8
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j3, 8
  cr_next:
    jldi j1, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j11, 0                   ; how many
  jldi j9, 0
  jld j10, j1, NV
  jwhile j10
    jldi j1, 0
    jldi j3, 24
    jmul j3, j9, j3
    jld j4, j1, ROOMUF
    jadd j3, j3, j4
    jld j3, j3, 8
    jjz j3, cn_next
    jldi j3, 1
    jadd j11, j11, j3
  cn_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j1, S_CONC
  jcall puts
  jadd j2, j11, j1
  jcall putmix
  jldi j2, 32
  jcall putch
  jldi j2, 124
  jcall putch
  jldi j2, 32
  jcall putch
  jld j2, j1, TCOC
  jcall putmix
  jldi j2, 47
  jcall putch
  jld j2, j1, TPULC + 24
  jcall putmix
  jldi j2, 32
  jcall putch
  jldi j2, 124
  jcall putch
  jldi j2, 32
  jcall putch
  jld j2, j1, TCOB
  jcall putmix
  jldi j2, 47
  jcall putch
  jld j2, j1, TBLN + 24
  jcall putmix
  jldi j2, 10
  jcall putch
  jcall flush
  jldi j2, 8                    ; the biggest
  jst j2, j1, TOPN
  jwhile j2
    jldi j1, 0
    jldi j11, 1
    jldi j12, 0
    jldi j9, 0
    jld j10, j1, NV
    jwhile j10
      jldi j3, 24
      jmul j3, j9, j3
      jld j4, j1, ROOMUF
      jadd j3, j3, j4
      jld j2, j3, 8
      jsub j4, j11, j2
      jldi j5, 63
      jsar j4, j4, j5
      jjz j4, cb2_next
      jadd j11, j2, j1
      jadd j12, j9, j1
    cb2_next:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j12, cr_done
    jst j12, j1, CPA              ; (its root; written: its size out)
    jldi j3, 24
    jmul j3, j12, j3
    jld j4, j1, ROOMUF
    jadd j3, j3, j4
    jst j1, j3, 8
    jadd j12, j11, j1
    jcall mix
    jldi j2, 32
    jcall putch
    jldi j2, 32
    jcall putch
    jadd j2, j11, j1
    jcall putnum
    jldi j2, 58
    jcall putch
    jldi j1, 0
    jldi j2, 10
    jst j2, j1, CPB
    jldi j9, 0
    jld j10, j1, NV
    jwhile j10
      jldi j1, 0
      jldi j3, 24
      jmul j3, j9, j3
      jld j4, j1, ROOMUF
      jadd j3, j3, j4
      jld j3, j3, 16
      jjz j3, cw_next
      jadd j2, j9, j1
      jcall uf_find
      jld j3, j1, CPA
      jsub j3, j2, j3
      jjnz j3, cw_next
      jld j3, j1, CPB
      jjz j3, cw_next
      jldi j4, 1
      jsub j3, j3, j4
      jst j3, j1, CPB
      jldi j2, 32
      jcall putch
      jadd j2, j9, j1
      jcall putword
    cw_next:
      jldi j1, 0
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jldi j2, 10
    jcall putch
    jcall flush
    jldi j1, 0
    jld j2, j1, TOPN
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, TOPN
  jwend
cr_done:
  jret


; The instincts, built and recombined (Capitan: "build and recombine instincts"): a genome {patience, firmness, how many
; readings} (a byte each). The champion starts with the instincts of today; each generation a child is born crossing the
; champion with the second best (each instinct from one of them) and changing one instinct one step, reads the book,
; and sits an exam: what it explains of renglones kept apart for it (never the test ones), less what the blind
; explains, on every floor and in its concepts. A child better than the champion takes its place, the champion goes
; second. How many generations: the second byte after K in "p" (0: none). The champion's instincts stay. Uses j1-j14.
evolve:
  jldi j1, 0
  jld j2, j1, NPAS
  jldi j3, 8
  jshr j2, j2, j3
  jldi j3, 255
  jand j2, j2, j3
  jjnz j2, ev_go
  jret
ev_go:
  jst j2, j1, EVG
  jst j2, j1, EVG0
  jcall vg_who                  ; (awake for good: who it is among its siblings)
  jldi j1, 0
  jldi j2, 0                    ; the luck, the same every time (deterministic: a seed, xorshift)
  jshi j2, 9E37h
  jshi j2, 79B9h
  jshi j2, 7F4Ah
  jshi j2, 7C15h
  jst j2, j1, RNG
  jcall nest_labels             ; (each one is born with its own luck: its number mixed in)
  jldi j1, 0
  jld j2, j1, RNG
  jld j3, j1, QUIEN
  jcall hw
  jjnz j2, ev_seed
  jldi j2, 1
ev_seed:
  jst j2, j1, RNG
  jld j2, j1, NPAS              ; the champion: today's instincts
  jldi j3, 255
  jand j2, j2, j3
  jjnz j2, ev_lect
  jldi j2, 1
ev_lect:
  jldi j3, 16
  jshl j2, j2, j3
  jldi j3, 1
  jldi j4, 8
  jshl j3, j3, j4
  jor j2, j2, j3
  jldi j3, 4
  jor j2, j2, j3
  jst j2, j1, EVC
  jcall autopsy_open            ; (its dissection, written as it goes)
  jcall mem_load                ; and what it learned in lives before: its best paths
  jcall nest_load              ; it wakes with its own instincts, if it has lived before
  jldi j1, 0
  jjz j2, ev_born
  jld j2, j1, EVLIV
  jst j2, j1, EVI
  jld j2, j1, TMEM + 16         ; it remembers: its exams were paid in a coin without this memory, and exams of different
  jjz j2, ev_same               ; memories are not set against each other; the champion and the second sit it again
  jcall ev_exam
  jcall mem_save                ; (what the champion reads, kept: the memory is always the champion's paths)
  jldi j1, 0
  jld j2, j1, EVS
  jst j2, j1, EVCS
  jld j2, j1, EVC
  jst j2, j1, EVKEEP
  jld j2, j1, EVR
  jst j2, j1, EVC
  jcall ev_exam
  jldi j1, 0
  jld j2, j1, EVKEEP
  jst j2, j1, EVC
  jld j2, j1, EVS
  jst j2, j1, EVRS
  jld j3, j1, EVCS              ; (the second better now: they change places)
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, ev_same
  jld j3, j1, EVCS
  jst j2, j1, EVCS
  jst j3, j1, EVRS
  jld j2, j1, EVC
  jld j3, j1, EVR
  jst j3, j1, EVC
  jst j2, j1, EVR
  jcall mem_save                ; (the new champion's paths, just read)
ev_same:
  jldi j1, 0
  jld j2, j1, EVC
  jst j2, j1, EVCH
  jld j2, j1, EVCS
  jst j2, j1, EVS
  jldi j2, 1
  jcall ev_line
  jjmp ev_gens
ev_born:
  jcall ev_exam
  jcall mem_save                ; (born: its first paths kept)
  jldi j1, 0
  jld j2, j1, EVS
  jst j2, j1, EVCS
  jld j2, j1, EVC
  jst j2, j1, EVR
  jld j2, j1, EVCS
  jst j2, j1, EVRS
  jst j1, j1, EVI
  jldi j2, 0
  jcall ev_line
ev_gens:
  jldi j1, 0                    ; (who it is as this stretch begins: to know whether it made itself better)
  jld j2, j1, EVC
  jst j2, j1, EVJC
  jcall letter_read            ; the other's letter: its genome is the one it crosses with (Capitan: "they agree, pass
  jldi j1, 0                    ; each other the genome and build a new one with the best of each; the same Razar,
  jld j2, j1, PARTOK            ; remade better")
  jjz j2, ev_alone
  jld j2, j1, CARTA
  jst j2, j1, EVR
  jldi j2, 0
  jshi j2, 0C000h
  jshi j2, 0
  jshi j2, 0
  jshi j2, 0
  jst j2, j1, EVRS
  jldi j2, 0                    ; written: "carta" and the genome that came
  jshi j2, 0061h
  jshi j2, 7472h
  jshi j2, 6163h
  jcall put8
  jldi j1, 0
  jldi j2, 58
  jcall putch
  jld j2, j1, CARTA
  jst j2, j1, EVCH
  jldi j2, 255
  jld j3, j1, EVCH
  jand j2, j3, j2
  jst j2, j1, EVT
  jldi j2, 32
  jcall putch
  jld j2, j1, EVT
  jcall putmix
  jldi j2, 32
  jcall putch
  jld j2, j1, EVCH
  jldi j3, 8
  jshr j2, j2, j3
  jldi j3, 255
  jand j2, j2, j3
  jcall putmix
  jldi j2, 32
  jcall putch
  jld j2, j1, EVCH
  jldi j3, 16
  jshr j2, j2, j3
  jldi j3, 255
  jand j2, j2, j3
  jcall putmix
  jldi j2, 10
  jcall putch
  jcall flush
ev_alone:
  jldi j1, 0
  jld j2, j1, EVG
  jwhile j2
    jldi j1, 0                  ; a child: crossed, then one instinct changed
    jldi j9, 0
    jldi j10, 0
    jldi j11, 3
    jwhile j11
      jcall ev_rand
      jldi j1, 0
      jldi j3, 1
      jand j3, j2, j3
      jld j4, j1, EVC
      jjz j3, ev_from
      jld j4, j1, EVR
    ev_from:
      jldi j3, 3
      jshl j3, j10, j3
      jshr j4, j4, j3
      jldi j5, 255
      jand j4, j4, j5
      jshl j4, j4, j3
      jor j9, j9, j4
      jldi j3, 1
      jadd j10, j10, j3
      jsub j11, j11, j3
    jwend
    jst j9, j1, EVCH
    jcall ev_rand
    jcall ev_mutate
    jldi j1, 0
    jld j2, j1, EVI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, EVI
    jld j2, j1, EVCH
    jst j2, j1, EVC2
    jld j2, j1, EVC             ; (the exam sits the child: it takes the champion's place for a while)
    jst j2, j1, EVKEEP
    jld j2, j1, EVCH
    jst j2, j1, EVC
    jcall ev_exam
    jldi j1, 0
    jld j2, j1, EVKEEP
    jst j2, j1, EVC
    jld j2, j1, EVS             ; better than the champion: it is the champion, the champion the second
    jld j3, j1, EVCS
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, ev_second
    jld j3, j1, EVC
    jst j3, j1, EVR
    jld j3, j1, EVCS
    jst j3, j1, EVRS
    jld j3, j1, EVC2
    jst j3, j1, EVC
    jst j2, j1, EVCS
    jldi j2, 1
    jcall ev_line
    jcall mem_save              ; (a better one: the paths it read kept)
    jjmp ev_next
  ev_second:
    jld j3, j1, EVRS            ; better than the second: the second
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, ev_lost
    jld j3, j1, EVC2
    jst j3, j1, EVR
    jst j2, j1, EVRS
  ev_lost:
    jldi j2, 0
    jcall ev_line
  ev_next:
    jldi j1, 0
    jld j2, j1, EVG
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, EVG
  jwend
  jldi j1, 0                    ; its identity kept for the next time, with what it lived
  jld j2, j1, EVI
  jst j2, j1, EVLIV
  jcall nest_save
  jcall letter_write            ; and its letter for the other, with what it is now
  jcall organ_trials            ; its organs, every stretch, if "p" asks for them (it may come back remade)
  jldi j1, 0                    ; awake for good (Capitan: "that a Razar never turns off: its will always active,
  jld j2, j1, VIGIL             ; exploring, though it may choose to rest for a while"): it made itself better, it
  jjz j2, ev_end                ; tells the other and explores again; it did not, it rests on its doorbell (nothing
  jld j2, j1, EVC               ; spent) until the other has something new; nobody left who could wake it, it ends
  jld j3, j1, EVJC
  jsub j2, j2, j3
  jjz j2, ev_rest
  jld j11, j1, PARTNER
  jldi j12, 0                   ; "carta"
  jshi j12, 0061h
  jshi j12, 7472h
  jshi j12, 6163h
  jldi j10, 30
  jcall ask
  jjmp ev_again
ev_rest:
  jldi j2, 0                    ; "descansa"
  jshi j2, 6173h
  jshi j2, 6E61h
  jshi j2, 6373h
  jshi j2, 6564h
  jcall put8
  jldi j2, 10
  jcall putch
  jcall flush
  jldi j1, 0                    ; (someone rang while its organs were tried: that one woke it)
  jld j13, j1, OGWAKE
  jjz j13, vg_bell
  jst j1, j1, OGWAKE
  jldi j1, 1
  jsub j13, j13, j1
  jjmp vg_rang
vg_bell:
  jldi j10, 29
  jcall ask
  jldi j1, 1                    ; (one of its own children, an end that rang late: no news, asleep again)
  jadd j1, j13, j1
  jjz j1, vg_rang
  jldi j1, 0
  jst j13, j1, OGT
  jldi j10, 19
  jadd j11, j13, j1
  jcall ask
  jldi j1, 2
  jadd j1, j13, j1
  jjnz j1, vg_bell
  jldi j1, 0
  jld j13, j1, OGT
vg_rang:
  jldi j1, 1
  jadd j1, j13, j1
  jjz j1, ev_end
  jldi j1, 0                    ; (who woke it: itself is the sentinel, news in the files; else its sibling)
  jst j13, j1, WOKE
vg_drain:
  jldi j10, 31                  ; (the words that woke it: read, so the mailbox is empty)
  jldi j11, MAILV
  jldi j12, 16
  jcall ask
  jjnz j13, vg_drain
  jldi j1, 0
  jld j2, j1, WOKE
  jld j3, j1, PARTNER
  jsub j2, j2, j3
  jjz j2, vg_sib
  jcall shelf_print             ; the sentinel tells a change, the shelf's fingerprint tells whether it is news (the
  jldi j1, 0                    ; host tells one copy in several batches: the ones after the first are nothing new)
  jld j3, j1, BOOKH
  jsub j3, j2, j3
  jjnz j3, vg_book
  jcall letter_new              ; not a book: a letter of the other? it explores again with it (not reborn)
  jldi j1, 0
  jjz j2, vg_bell
  jldi j2, 0                    ; "carta"
  jshi j2, 0061h
  jshi j2, 7472h
  jshi j2, 6163h
  jjmp vg_said
vg_book:
  jldi j2, 0                    ; "novedad"
  jshi j2, 0064h
  jshi j2, 6164h
  jshi j2, 6576h
  jshi j2, 6F6Eh
  jldi j3, 1                    ; (news: it is reborn, reading the whole shelf again, once this is said)
  jst j3, j1, REBORN
  jjmp vg_said
vg_sib:
  jldi j2, 0                    ; "vuelve"
  jshi j2, 0000h
  jshi j2, 6576h
  jshi j2, 6C65h
  jshi j2, 7576h
vg_said:
  jcall put8
  jldi j2, 10
  jcall putch
  jcall flush
ev_again:
  jldi j1, 0
  jld j2, j1, REBORN
  jjnz j2, ev_end
  jldi j1, 0
  jld j2, j1, EVG0
  jst j2, j1, EVG
  jjmp ev_gens
ev_end:
  jldi j1, 0                    ; the champion's instincts stay, for the reading that counts
  jld j2, j1, EVC
  jst j2, j1, EVCH
  jcall ev_set
  jldi j1, 0
  jst j1, j1, EXAMM
  jret


; Awake for good (VIGIL: the fifth byte after K in "p"): who it is among the siblings started with it. A word said to
; oneself does not go (-1), to a sibling it does: so the one whose word to cabin 0 does not go is cabin 0, and the
; other is cabin 1. QUIEN is its cabin plus one, PARTNER the other's cabin. Uses j1-j14.
vg_who:
  jldi j1, 0
  jst j1, j1, VQ
  jld j2, j1, NPAS
  jldi j3, 32
  jshr j2, j2, j3
  jldi j3, 255
  jand j2, j2, j3
  jst j2, j1, VIGIL
  jjz j2, vw_done
  jldi j10, 30
  jldi j11, 0
  jldi j12, 6F68h               ; "ho"
  jcall ask
  jldi j1, 0
  jldi j2, 1                    ; to cabin 0 it did not go: it is cabin 0
  jldi j3, 1
  jadd j4, j13, j3
  jjz j4, vw_set
  jldi j2, 2
vw_set:
  jst j2, j1, QUIEN
  jldi j3, 2
  jsub j3, j3, j2
  jst j3, j1, PARTNER
  jldi j2, 1
  jst j2, j1, VQ
  jldi j10, 32                  ; and the sentinel told: news in the files whose label starts "libro" wakes it
  jldi j11, 5
  jldi j12, 0
  jshi j12, 006Fh
  jshi j12, 7262h
  jshi j12, 696Ch
  jcall ask
  jcall nest_labels             ; and so does the other's letter (only the other's: its own does not wake it)
  jldi j1, 0
  jldi j10, 32
  jldi j11, 6
  jld j12, j1, OTRL
  jcall ask
  jldi j1, 0
vw_done:
  jret

; Its organs (Capitan: "that it improves itself with what it learned, compiling a better solution: new members,
; maybe eyes, ears, and who knows what organ it invents"; "Legos, and inside the Legos free mutation of code"). As
; many times as "p" asks (the sixth byte after K): its organ changed by one letter (organo.molde: put in, taken out
; or changed), written as organo.inc, built by the PDP assembler launched as its child, and the candidate built from
; it launched in a cage (a budget, request 34) to sit the champion's exam and say its score; the better one stays.
; Everything waits on its doorbell (29): a signature its children ask for, the candidate's word, or nobody left.
; Both exams without memory (the same coin). If one won, it is built again as Razar itself: the same Razar, with one
; organ more. Uses j1-j14.
organ_trials:
  jldi j1, 0                    ; an audit, if "p" asks for one (the seventh byte after K): instead of its trials
  jld j2, j1, NPAS
  jldi j3, 48
  jshr j2, j2, j3
  jldi j3, 255
  jand j2, j2, j3
  jjz j2, ot_trials
  jjmp organ_audit
ot_trials:
  jld j2, j1, NPAS
  jldi j3, 40
  jshr j2, j2, j3
  jldi j3, 255
  jand j2, j2, j3
  jjnz j2, ot_go
  jret
ot_go:
  jst j2, j1, OGN
  jcall og_init
  jldi j1, 0
  jld j2, j1, OGML
  jjnz j2, ot_have
  jldi j2, 0                    ; "sin molde"
  jshi j2, 7369h
  jshi j2, 6E20h
  jshi j2, 6D6Fh
  jshi j2, 6C64h
  jcall og_r8
  jldi j2, 0
  jshi j2, 650Ah
  jcall og_r8
  jjmp flush
ot_have:
  jldi j2, ORGAN_CODE           ; the organ it has, and its exam without memory: what a new one has to beat
  jst j2, j1, OGCODE
  jld j2, j1, EVC
  jst j2, j1, EVCH
  jld j2, j1, TMEM
  jst j2, j1, OGT
  jst j1, j1, TMEM
  jcall ev_exam
  jldi j1, 0
  jld j2, j1, OGT
  jst j2, j1, TMEM
  jld j2, j1, EVS
  jst j2, j1, OGBASE
  jldi j10, 35                  ; the cage: twice what this life cost it so far (a reading and its exams; a real organ
  jldi j11, -1                  ; measured +2 %: the 2 is criterion, not measurement)
  jcall ask
  jldi j1, 0
  jadd j2, j13, j13
  jst j2, j1, OGBUD
  jld j2, j1, OGN
  jwhile j2
    jcall og_next
    jcall og_write
    jldi j1, 0
    jcall og_build
    jldi j1, 0
    jjz j2, ot_next
    jcall og_trial
    jcall og_line
    jldi j1, 0                  ; better: the new organ is its own
    jld j2, j1, OGSC
    jld j3, j1, OGBASE
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, ot_next
    jst j2, j1, OGBASE
    jld j2, j1, OGTRY
    jst j2, j1, OGCODE
  ot_next:
    jldi j1, 0
    jld j2, j1, OGN
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, OGN
  jwend
  jld j2, j1, OGCODE            ; it grew one: built again as itself (not a candidate), for its next life
  jldi j3, ORGAN_CODE
  jsub j2, j2, j3
  jjz j2, ot_done
  jld j2, j1, OGCODE
  jst j2, j1, OGTRY
  jcall og_write0
  jcall og_build
  jldi j1, 0
  jjz j2, ot_done
  jldi j2, 0                    ; "se rehace": the same cabin, its new program (36), when it ends here
  jshi j2, 7365h
  jshi j2, 2072h
  jshi j2, 6568h
  jshi j2, 6163h
  jcall og_r8
  jldi j2, 0
  jshi j2, 650Ah
  jcall og_r8
  jcall flush
  jldi j2, 112
  jcall og_label
  jldi j10, 36
  jcall ask
  jhalt
ot_done:
  jldi j1, 0
  jret

; The label of the block j2, a file of its own tree: "PDP/razar", its number after it if it has one (each Razar of
; a society writes, builds and launches only its own), and the rest -> j11 where, j12 its bytes. Uses j1-j10.
og_label:
  jcall og_block
  jldi j1, 0
  jld j11, j1, OGPEND
  jldi j2, 4160
  jadd j11, j11, j2
  jldi j7, 0
  jldi j8, 0
  jwhile j6
    jldb j2, j5, 0
    jadd j3, j11, j7
    jstb j2, j3, 0
    jldi j3, 1
    jadd j7, j7, j3
    jadd j8, j8, j3
    jadd j5, j5, j3
    jsub j6, j6, j3
    jldi j3, 9                  ; after "PDP/razar"
    jsub j3, j8, j3
    jjnz j3, ol_on
    jld j3, j1, QUIEN
    jjz j3, ol_on
    jldi j4, 48
    jadd j3, j3, j4
    jadd j4, j11, j7
    jstb j3, j4, 0
    jldi j3, 1
    jadd j7, j7, j3
  ol_on:
  jwend
  jadd j12, j7, j1
  jret

; The audit of its organs (a reviewer the Capitan brought: "not hunting channels: demanding invariants, that cover
; every channel at once, known and unknown"). As many organs as "p" asks (the seventh byte after K), each drawn by its
; luck, sit the exam three ways: in order with the machine they get all 0; in the reverse order with it all 1 (a score
; that moves with the order or the garbage hangs on something not its own); and in their canonical form (the same
; frames, each one's mixes in order and none twice, no frame twice, nothing after the last hole: a score that moves
; hangs on how it is written, not on what it means). The exam without organ before and after them all: if it moved,
; something builds up. Uses j1-j14.
organ_audit:
  jldi j1, 0
  jst j2, j1, AUDN
  jcall og_init
  jldi j1, 0
  jld j2, j1, OGML
  jjnz j2, oa_have
  jret
oa_have:
  jcall og_base
  jldi j1, 0
  jld j2, j1, EVS
  jst j2, j1, AUDB0
  jldi j10, 35                  ; the cage, as for its organs
  jldi j11, -1
  jcall ask
  jldi j1, 0
  jadd j2, j13, j13
  jst j2, j1, OGBUD
  jld j11, j1, AUDN             ; its organs: {letters, in order, reversed, canonical}
  jldi j2, 5
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, AUD
  jst j1, j1, AUDI
  jld j2, j1, AUDN
  jwhile j2                     ; drawn: one to four letters, each 1..9
    jcall ev_rand
    jldi j3, 4
    jdiv j4, j2, j3
    jmul j4, j4, j3
    jsub j2, j2, j4
    jldi j3, 1
    jadd j2, j2, j3
    jldi j1, 0
    jst j2, j1, AUDC
    jst j1, j1, OGTRY
    jldi j2, 0
    jst j2, j1, OGT
    jld j2, j1, AUDC
    jwhile j2
      jcall ev_rand
      jldi j3, 9
      jdiv j4, j2, j3
      jmul j4, j4, j3
      jsub j2, j2, j4
      jldi j3, 1
      jadd j2, j2, j3
      jldi j1, 0
      jld j3, j1, OGT
      jshl j2, j2, j3
      jld j4, j1, OGTRY
      jor j4, j4, j2
      jst j4, j1, OGTRY
      jldi j2, 4
      jadd j3, j3, j2
      jst j3, j1, OGT
      jld j2, j1, AUDC
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, AUDC
    jwend
    jcall oa_at
    jld j2, j1, OGTRY
    jst j2, j4, 0
    jld j2, j1, AUDI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, AUDI
    jld j3, j1, AUDN
    jsub j2, j3, j2
  jwend
  jst j1, j1, AUDI              ; in order, all 0
  jld j2, j1, AUDN
  jwhile j2
    jldi j1, 0
    jst j1, j1, OGFILL
    jcall oa_at
    jld j2, j4, 0
    jcall oa_exam
    jcall oa_at
    jld j2, j1, OGSC
    jst j2, j4, 8
    jld j2, j1, AUDI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, AUDI
    jld j3, j1, AUDN
    jsub j2, j3, j2
  jwend
  jld j2, j1, AUDN              ; reversed, all 1
  jwhile j2
    jldi j1, 0
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, AUDI
    jst j3, j1, OGFILL
    jcall oa_at
    jld j2, j4, 0
    jcall oa_exam
    jcall oa_at
    jld j2, j1, OGSC
    jst j2, j4, 16
    jld j2, j1, AUDI
  jwend
  jst j1, j1, OGFILL            ; canonical, all 0 (the same organ: its score in order)
  jst j1, j1, AUDNC
  jst j1, j1, AUDI
  jld j2, j1, AUDN
  jwhile j2
    jcall oa_at
    jld j2, j4, 0
    jcall og_canon
    jldi j1, 0
    jst j2, j1, AUDC
    jcall oa_at
    jld j3, j4, 0
    jld j5, j4, 8
    jst j5, j4, 24
    jsub j3, j3, j2
    jjz j3, oa_same
    jld j2, j1, AUDNC
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, AUDNC
    jld j2, j1, AUDC
    jcall oa_exam
    jcall oa_at
    jld j2, j1, OGSC
    jst j2, j4, 24
  oa_same:
    jldi j1, 0
    jld j2, j1, AUDI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, AUDI
    jld j3, j1, AUDN
    jsub j2, j3, j2
  jwend
  jcall og_base                 ; the exam without organ, after them all
  jldi j1, 0
  jld j2, j1, EVS
  jst j2, j1, AUDB1
  jst j1, j1, AUDOK1            ; what moved, said; how many held
  jst j1, j1, AUDOK2
  jst j1, j1, AUDI
  jld j2, j1, AUDN
  jwhile j2
    jcall oa_at
    jld j2, j4, 8
    jld j3, j4, 16
    jsub j3, j3, j2
    jjnz j3, oa_moved
    jld j3, j1, AUDOK1
    jldi j5, 1
    jadd j3, j3, j5
    jst j3, j1, AUDOK1
  oa_moved:
    jld j3, j4, 24
    jsub j3, j3, j2
    jjnz j3, oa_moved2
    jld j3, j1, AUDOK2
    jldi j5, 1
    jadd j3, j3, j5
    jst j3, j1, AUDOK2
  oa_moved2:
    jld j2, j4, 8
    jld j3, j4, 16
    jsub j3, j3, j2
    jld j5, j4, 24
    jsub j5, j5, j2
    jor j3, j3, j5
    jjz j3, oa_quiet
    jldi j2, 0                  ; "fuga <letters>: <in order> <reversed> <canonical>"
    jshi j2, 0066h
    jshi j2, 7567h
    jshi j2, 6120h
    jcall og_r8
    jcall oa_at
    jld j2, j4, 0
    jcall og_hex
    jldi j2, 58
    jcall putch
    jldi j2, 32
    jcall putch
    jcall oa_at
    jld j2, j4, 8
    jcall og_signed
    jldi j2, 32
    jcall putch
    jcall oa_at
    jld j2, j4, 16
    jcall og_signed
    jldi j2, 32
    jcall putch
    jcall oa_at
    jld j2, j4, 24
    jcall og_signed
    jldi j2, 10
    jcall putch
    jcall flush
  oa_quiet:
    jldi j1, 0
    jld j2, j1, AUDI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, AUDI
    jld j3, j1, AUDN
    jsub j2, j3, j2
  jwend
  jldi j2, 0                    ; "auditoria <n>: orden y basura <held>, escritura <held> (<canonical tried>), base
  jshi j2, 6175h                ; <before> <after>"
  jshi j2, 6469h
  jshi j2, 746Fh
  jshi j2, 7269h
  jcall og_r8
  jldi j2, 0
  jshi j2, 6120h
  jcall og_r8
  jldi j1, 0
  jld j2, j1, AUDN
  jcall putnum
  jldi j2, 0
  jshi j2, 3A20h
  jshi j2, 6F72h
  jshi j2, 6465h
  jshi j2, 6E20h
  jcall og_r8
  jldi j2, 0
  jshi j2, 7920h
  jshi j2, 6261h
  jshi j2, 7375h
  jshi j2, 7261h
  jcall og_r8
  jldi j2, 32
  jcall putch
  jldi j1, 0
  jld j2, j1, AUDOK1
  jcall putnum
  jldi j2, 0
  jshi j2, 2C20h
  jshi j2, 6573h
  jshi j2, 6372h
  jshi j2, 6974h
  jcall og_r8
  jldi j2, 0
  jshi j2, 7572h
  jshi j2, 6120h
  jcall og_r8
  jldi j1, 0
  jld j2, j1, AUDOK2
  jcall putnum
  jldi j2, 0
  jshi j2, 2028h
  jcall og_r8
  jldi j1, 0
  jld j2, j1, AUDNC
  jcall putnum
  jldi j2, 0
  jshi j2, 292Ch
  jshi j2, 2062h
  jshi j2, 6173h
  jshi j2, 6520h
  jcall og_r8
  jldi j1, 0
  jld j2, j1, AUDB0
  jcall og_signed
  jldi j2, 32
  jcall putch
  jldi j1, 0
  jld j2, j1, AUDB1
  jcall og_signed
  jldi j2, 10
  jcall putch
  jjmp flush

; Where the audit's organ AUDI is -> j4. Uses j1-j4.
oa_at:
  jldi j1, 0
  jld j4, j1, AUDI
  jldi j3, 5
  jshl j4, j4, j3
  jld j3, j1, AUD
  jadd j4, j4, j3
  jret

; The organ j2 sits the champion's exam as a candidate (OGFILL its garbage) -> OGSC (the lowest there is if it
; could not be built). Uses j1-j14.
oa_exam:
  jldi j1, 0
  jst j2, j1, OGTRY
  jldi j2, 1
  jldi j3, 63
  jshl j2, j2, j3
  jst j2, j1, OGSC
  jcall og_write
  jcall og_build
  jldi j1, 0
  jjz j2, oe_done
  jcall og_trial
oe_done:
  jldi j1, 0
  jret

; The champion's exam without memory and without organ change (what an organ has to beat) -> EVS. Uses j1-j14.
og_base:
  jldi j1, 0
  jld j2, j1, EVC
  jst j2, j1, EVCH
  jld j2, j1, TMEM
  jst j2, j1, OGT
  jst j1, j1, TMEM
  jcall ev_exam
  jldi j1, 0
  jld j2, j1, OGT
  jst j2, j1, TMEM
  jret

; The canonical form of the organ j2 -> j2: its frames (the mixes up to each hole) in the order they come, each one's
; mixes in order and none twice, no frame twice, nothing after its last hole. Only what changes no request the judge
; sees: a frame's mixes in another order or twice only rename its key, one to one; a frame twice testifies once; mixes
; with no hole after them post nothing. The order of the frames is kept: at a place the first one testifies (the
; audit found it, against what was believed here: sorting them moved 7847 from -4416 to -8795). Uses j1-j10 (its frames at OGPEND + 4224, sixteen at most).
og_canon:
  jldi j1, 0
  jld j9, j1, OGPEND
  jldi j3, 4224
  jadd j9, j9, j3
  jldi j6, 0                    ; how many frames
  jldi j7, 0                    ; the mixes so far
  jwhile j2
    jldi j3, 15
    jand j4, j2, j3
    jldi j3, 4
    jshr j2, j2, j3
    jldi j3, 5
    jsub j3, j4, j3
    jldi j5, 63
    jsar j3, j3, j5
    jjz j3, oc_hole
    jldi j3, 1                  ; a mix: its word's bit
    jsub j4, j4, j3
    jshl j3, j3, j4
    jor j7, j7, j3
    jjmp oc_next
  oc_hole:
    jldi j3, 4                  ; a hole: the frame {mixes, hole}, if it is not there yet
    jshl j4, j4, j3
    jor j4, j4, j7
    jldi j7, 0
    jldi j5, 0
    jldi j8, 1
    jsub j10, j6, j5
    jwhile j10
      jldi j3, 3
      jshl j3, j5, j3
      jadd j3, j9, j3
      jld j3, j3, 0
      jsub j3, j3, j4
      jjnz j3, oc_other
      jldi j8, 0
    oc_other:
      jldi j3, 1
      jadd j5, j5, j3
      jsub j10, j6, j5
    jwend
    jjz j8, oc_next
    jldi j3, 3
    jshl j3, j6, j3
    jadd j3, j9, j3
    jst j4, j3, 0
    jldi j3, 1
    jadd j6, j6, j3
  oc_next:
  jwend
  jldi j2, 0                    ; written again: each frame's mixes from the first word, then its hole
  jldi j8, 0
  jldi j5, 0
  jsub j10, j6, j5
  jwhile j10
    jldi j3, 3
    jshl j3, j5, j3
    jadd j3, j9, j3
    jld j4, j3, 0
    jldi j7, 1
    jldi j3, 5
    jsub j3, j7, j3
    jwhile j3
      jldi j3, 1
      jsub j3, j7, j3
      jldi j10, 1
      jshl j3, j10, j3
      jand j3, j4, j3
      jjz j3, oc_nomix
      jshl j3, j7, j8
      jor j2, j2, j3
      jldi j3, 4
      jadd j8, j8, j3
    oc_nomix:
      jldi j3, 1
      jadd j7, j7, j3
      jldi j3, 5
      jsub j3, j7, j3
    jwend
    jldi j3, 4
    jshr j3, j4, j3
    jshl j3, j3, j8
    jor j2, j2, j3
    jldi j3, 4
    jadd j8, j8, j3
    jldi j3, 1
    jadd j5, j5, j3
    jsub j10, j6, j5
  jwend
  jldi j1, 0
  jret

; Its molde read into a room (OGM, OGML bytes; 0 if there is none), and a room for what waits for its signature and
; the words it hears (OGPEND: 4096 bytes of pending, then 16 of a word, then the molde's label). Uses j1-j14.
og_init:
  jldi j1, 0
  jst j1, j1, OGML
  jldi j11, 4096
  jldi j2, 256
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, OGPEND
  jldi j2, 4096                 ; "PDP/razar/lectura/organo.molde"
  jadd j9, j13, j2
  jldi j2, 16
  jadd j9, j9, j2
  jldi j2, 0
  jshi j2, 617Ah
  jshi j2, 6172h
  jshi j2, 2F50h
  jshi j2, 4450h
  jst j2, j9, 0
  jldi j2, 0
  jshi j2, 7275h
  jshi j2, 7463h
  jshi j2, 656Ch
  jshi j2, 2F72h
  jst j2, j9, 8
  jldi j2, 0
  jshi j2, 6F6Eh
  jshi j2, 6167h
  jshi j2, 726Fh
  jshi j2, 2F61h
  jst j2, j9, 16
  jldi j2, 0
  jshi j2, 6564h
  jshi j2, 6C6Fh
  jshi j2, 6D2Eh
  jst j2, j9, 24
  jldi j2, 30                   ; (its number after "PDP/razar", if it has one: its own tree)
  jst j2, j1, OGLET
  jld j3, j1, QUIEN
  jjz j3, oi_own
  jldi j4, 21                   ; the 21 bytes after "PDP/razar" one place up, from the last
  jwhile j4
    jldi j5, 8
    jadd j5, j5, j4
    jadd j5, j9, j5
    jldb j6, j5, 0
    jstb j6, j5, 1
    jldi j6, 1
    jsub j4, j4, j6
  jwend
  jldi j4, 48
  jadd j3, j3, j4
  jstb j3, j9, 9
  jldi j2, 31
  jst j2, j1, OGLET
oi_own:
  jldi j11, 4096                ; its room: as big as a molde may be (criterion: the one it has is 3 KB)
  jldi j2, 4
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, OGM
  jldi j10, 4
  jld j11, j1, OGPEND
  jldi j2, 4112
  jadd j11, j11, j2
  jld j12, j1, OGLET
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, oi_done
  jst j13, j1, OGT
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, OGM
  jldi j12, 4096
  jldi j2, 4
  jshl j12, j12, j2
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, oi_close
  jst j13, j1, OGML
oi_close:
  jldi j1, 0
  jld j10, j1, OGT
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
oi_done:
  jldi j1, 0
  jret

; The organ to try now -> OGTRY: the other's, first, if a letter brought one (it is tried with its own books, in its
; cage, and stays only if it wins here too); else its own changed by one letter. Uses j1-j8.
og_next:
  jldi j1, 0
  jld j2, j1, PORG
  jjz j2, og_mutate
  jld j3, j1, OGCODE
  jsub j3, j2, j3
  jst j1, j1, PORG
  jjz j3, og_mutate
  jst j2, j1, OGTRY
  jret

; Its organ changed by one letter: OGCODE -> OGTRY (four bits a letter from the lowest, 1-9; 0 ends it). A letter
; put in, taken out or changed, at a place drawn by its luck; drawn again until it is another organ (at most 16
; letters: a qword, criterion). Uses j1-j8.
og_mutate:
  jldi j8, 1
  jwhile j8
    jldi j1, 0
    jld j5, j1, OGCODE          ; how many letters it has
    jldi j6, 0
    jadd j7, j5, j1
    jwhile j7
      jldi j3, 1
      jadd j6, j6, j3
      jldi j3, 4
      jshr j7, j7, j3
    jwend
    jst j6, j1, OGT
    jcall ev_rand               ; which: 0 in, 1 out, 2 changed (none yet: in; sixteen: not in)
    jldi j3, 3
    jdiv j4, j2, j3
    jmul j4, j4, j3
    jsub j7, j2, j4
    jldi j1, 0
    jld j6, j1, OGT
    jjnz j6, om_some
    jldi j7, 0
  om_some:
    jldi j3, 16
    jsub j3, j6, j3
    jjnz j3, om_room
    jjnz j7, om_room
    jldi j7, 1
  om_room:
    jst j7, j1, OGKID
    jcall ev_rand               ; where: 0..n for in, 0..n-1 otherwise
    jldi j1, 0
    jld j6, j1, OGT
    jld j7, j1, OGKID
    jadd j3, j6, j1
    jjnz j7, om_where
    jldi j4, 1
    jadd j3, j3, j4
  om_where:
    jdiv j4, j2, j3
    jmul j4, j4, j3
    jsub j4, j2, j4
    jldi j3, 2
    jshl j4, j4, j3             ; its bit
    jst j4, j1, OGSC
    jcall ev_rand               ; the letter, 1..9
    jldi j3, 9
    jdiv j4, j2, j3
    jmul j4, j4, j3
    jsub j2, j2, j4
    jldi j3, 1
    jadd j2, j2, j3
    jldi j1, 0
    jld j3, j1, OGSC
    jshl j2, j2, j3             ; the letter at its place
    jld j5, j1, OGCODE
    jldi j4, 1                  ; below its place, kept
    jshl j4, j4, j3
    jldi j6, 1
    jsub j4, j4, j6
    jand j6, j5, j4
    jshr j5, j5, j3             ; from its place on
    jld j7, j1, OGKID
    jjnz j7, om_out
    jldi j4, 4                  ; in: the rest moves up one letter
    jshl j5, j5, j4
    jshl j5, j5, j3
    jor j5, j5, j2
    jjmp om_put
  om_out:
    jldi j4, 4                  ; out or changed: its letter leaves
    jshr j5, j5, j4
    jldi j4, 1
    jsub j4, j7, j4
    jjz j4, om_down
    jshl j5, j5, j4             ; changed: the new one in its place (j4 = 1: one letter up again)
    jldi j4, 3
    jshl j5, j5, j4
    jshl j5, j5, j3
    jor j5, j5, j2
    jjmp om_put
  om_down:
    jshl j5, j5, j3
  om_put:
    jor j5, j5, j6
    jst j5, j1, OGTRY
    jld j4, j1, OGCODE
    jsub j8, j5, j4             ; the same organ: drawn again
    jjz j8, om_again
    jldi j8, 0
    jjmp om_end
  om_again:
    jldi j8, 1
  om_end:
  jwend
  jret

; organo.inc written whole from the molde: as a candidate (og_write: it sits the exam and says its score) or as
; Razar itself (og_write0), with the champion's genome and the organ OGTRY. Uses j1-j14.
og_write:
  jldi j2, 1
  jjmp ow_go
og_write0:
  jldi j2, 0
ow_go:
  jldi j1, 0
  jst j2, j1, OGKID
  jcall flush                   ; (what it wrote is out: TEXT is the organ's now)
  jldi j2, 67                   ; ORGAN_CANDIDATE =
  jcall og_put
  jldi j1, 0
  jld j2, j1, OGKID
  jcall putnum
  jldi j2, 10
  jcall putch
  jldi j2, 71                   ; ORGAN_GENOME =
  jcall og_put
  jldi j1, 0
  jld j2, j1, EVC
  jcall putnum
  jldi j2, 10
  jcall putch
  jldi j2, 79                   ; ORGAN_CODE =
  jcall og_put
  jldi j1, 0
  jld j2, j1, OGTRY
  jcall putnum
  jldi j2, 10
  jcall putch
  jldi j2, 70                   ; ORGAN_FILL = (the audit's garbage: 0 or 1)
  jcall og_put
  jldi j1, 0
  jld j2, j1, OGFILL
  jcall putnum
  jldi j2, 10
  jcall putch
  jldi j2, 104                  ; the head, then its letters, then the foot
  jcall og_line_put
  jldi j1, 0
  jld j2, j1, OGTRY
  jst j2, j1, OGLET
  jwhile j2
    jldi j3, 15
    jand j2, j2, j3
    jldi j3, 48
    jadd j2, j2, j3
    jcall og_line_put
    jldi j1, 0
    jld j2, j1, OGLET
    jldi j3, 4
    jshr j2, j2, j3
    jst j2, j1, OGLET
  jwend
  jldi j2, 102
  jcall og_line_put
  jldi j2, 111                  ; its file, whole: the old one out
  jcall og_label
  jldi j10, 12
  jcall ask
  jldi j2, 111
  jcall og_label
  jldi j10, 4
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ow_done
  jst j13, j1, OGT
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jldi j11, TEXT
  jld j12, j1, POS
  jcall ask
  jldi j1, 0
  jld j10, j1, OGT
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
ow_done:
  jldi j1, 0
  jst j1, j1, POS
  jret

; The block named j2 of the molde into the text, and a line end after it. Uses j1-j10.
og_line_put:
  jcall og_put
  jldi j2, 10
  jjmp putch

; The block named j2 of the molde into the text (TEXT + POS). Uses j1-j10.
og_put:
  jcall og_block
  jwhile j6
    jldb j2, j5, 0
    jst j5, j1, EVT
    jst j6, j1, EVT2
    jcall putch
    jldi j1, 0
    jld j5, j1, EVT
    jld j6, j1, EVT2
    jldi j2, 1
    jadd j5, j5, j2
    jsub j6, j6, j2
  jwend
  jret

; The block named j2 (a byte) of the molde -> j5 where it starts, j6 its bytes (0 if there is none): after its line
; "@" and its name, up to the line end before the next block (that line end left out). Uses j1-j10.
og_block:
  jldi j1, 0
  jld j7, j1, OGM
  jld j8, j1, OGML
  jadd j8, j7, j8
  jldi j5, 0
  jldi j6, 0
  jldi j9, 10                   ; (the byte before the first: as if a line ended)
  jsub j3, j8, j7
  jwhile j3
    jldb j4, j7, 0
    jldi j10, 10
    jsub j10, j9, j10
    jjnz j10, ob_next
    jldi j10, 64
    jsub j10, j4, j10
    jjnz j10, ob_next
    jldb j10, j7, 1
    jsub j10, j10, j2
    jjnz j10, ob_next
    jldi j10, 1                 ; its line passed
    jldi j3, 1
    jwhile j3
      jadd j7, j7, j10
      jldb j4, j7, 0
      jldi j3, 10
      jsub j3, j4, j3
    jwend
    jadd j7, j7, j10
    jadd j5, j7, j1             ; up to a line end followed by "@", or the end
    jldi j3, 1
    jwhile j3
      jsub j3, j8, j7
      jjz j3, ob_end
      jldb j4, j7, 0
      jldi j10, 10
      jsub j10, j4, j10
      jldi j3, 1
      jjnz j10, ob_step
      jldb j4, j7, 1
      jldi j10, 64
      jsub j3, j4, j10
      jjz j3, ob_end
      jldi j3, 1
    ob_step:
      jldi j10, 1
      jadd j7, j7, j10
    jwend
  ob_end:
    jsub j6, j7, j5
    jjz j6, ob_bare
    jldi j3, -1                 ; (a line end of the host, "\r\n", is a line end too: its "\r" left out)
    jadd j4, j7, j3
    jldb j4, j4, 0
    jldi j3, 13
    jsub j4, j4, j3
    jjnz j4, ob_bare
    jldi j3, 1
    jsub j6, j6, j3
  ob_bare:
    jldi j3, 0
    jjmp ob_last
  ob_next:
    jadd j9, j4, j1
    jldi j10, 1
    jadd j7, j7, j10
    jsub j3, j8, j7
  ob_last:
  jwend
  jldi j1, 0
  jret

; The PDP assembler launched as its child (the block "a": memory, reading and writing), everything it asks signed,
; until nobody is left: -> j2 1 if it ended well. Uses j1-j14.
og_build:
  jldi j2, 97
  jcall og_block
  jldi j10, 14
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 16
  jor j10, j10, j2
  jadd j11, j5, j1
  jadd j12, j6, j1
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ob_bad
  jst j13, j1, OGKID
  jcall og_serve
  jldi j1, 0
  jldi j10, 19
  jld j11, j1, OGKID
  jcall ask
  jldi j1, 0
  jldi j2, 1
  jjz j13, ob_ok
ob_bad:
  jldi j1, 0
  jldi j2, 0
ob_ok:
  jret

; The candidate launched as its child (the block "p": memory, reading and writing; its letters ask for nothing, so a
; mutant can not touch a file), caged by its budget, everything it asks signed, its word heard -> OGSC its score
; (the lowest there is if it said none: it broke or spent its budget). Uses j1-j14.
og_trial:
  jldi j1, 0
  jldi j2, 1
  jldi j3, 63
  jshl j2, j2, j3
  jst j2, j1, OGSC
  jldi j2, 112
  jcall og_label
  jldi j10, 14
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 16
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, otr_done
  jst j13, j1, OGKID
  jldi j10, 34
  jadd j11, j13, j1
  jld j12, j1, OGBUD
  jcall ask
  jcall og_serve
otr_done:
  jldi j1, 0
  jret

; Asleep on its doorbell until nobody is left: each time it wakes, what waits for its signature is signed (its
; children's own requests: what they may do the porters already checked) and the words are heard; a word from the
; child OGKID is its score (OGSC). Uses j1-j14.
og_serve:
  jldi j9, 1
  jwhile j9
    jldi j10, 29
    jcall ask
    jldi j1, 1
    jadd j9, j13, j1            ; (-1: nobody is left)
    jjz j9, os_end
    jldi j1, 0                  ; another rang (its sibling, the sentinel): kept for its rest, never lost; one of its
    jld j2, j1, OGKID           ; own children (an end that rang late) is never news
    jsub j2, j13, j2
    jjz j2, os_child
    jld j2, j1, OGWAKE
    jjnz j2, os_child
    jst j13, j1, OGT
    jldi j10, 19
    jadd j11, j13, j1
    jcall ask
    jldi j1, 0
    jldi j2, 2
    jadd j2, j13, j2
    jjnz j2, os_child
    jld j2, j1, OGT
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, OGWAKE
  os_child:
    jldi j1, 0
    jldi j10, 18                ; what waits: {its number, the child, its kind}
    jld j11, j1, OGPEND
    jldi j12, 4096
    jcall ask
    jldi j1, 0
    jld j9, j1, OGPEND
    jadd j8, j13, j1
    jldi j2, 63                 ; (-1: nothing to sign)
    jsar j2, j8, j2
    jjz j2, os_some
    jldi j8, 0
  os_some:
    jwhile j8
      jldi j1, 0
      jst j9, j1, OGT
      jst j8, j1, OGLET
      jldi j10, 17
      jld j11, j9, 0
      jldi j12, 1
      jcall ask
      jldi j1, 0
      jld j9, j1, OGT
      jld j8, j1, OGLET
      jldi j2, 24
      jadd j9, j9, j2
      jldi j2, 1
      jsub j8, j8, j2
    jwend
    jldi j8, 1                  ; the words it was told
    jwhile j8
      jldi j1, 0
      jldi j10, 31
      jld j11, j1, OGPEND
      jldi j2, 4096
      jadd j11, j11, j2
      jcall ask
      jldi j1, 0
      jldi j2, 1
      jsub j8, j13, j2
      jjnz j8, os_quiet
      jld j3, j1, OGPEND
      jldi j2, 4096
      jadd j3, j3, j2
      jld j2, j3, 0
      jld j4, j1, OGKID
      jsub j2, j2, j4
      jldi j8, 1
      jjnz j2, os_heard
      jld j2, j3, 8
      jst j2, j1, OGSC
      jjmp os_heard
    os_quiet:
      jldi j8, 0
    os_heard:
    jwend
    jldi j1, 0                  ; the child ended (its end rang): done; still rowing: asleep again
    jldi j10, 19
    jld j11, j1, OGKID
    jcall ask
    jldi j1, 1
    jadd j2, j13, j1
    jldi j9, 0
    jjnz j2, os_again
    jldi j9, 1
    jjmp os_again
  os_end:
    jldi j9, 0
  os_again:
  jwend
  jldi j1, 0
  jret

; "organo <its letters> = <its score> (sin <the one to beat>)", and " *" if it won. Uses j1-j12.
og_line:
  jldi j2, 0
  jshi j2, 006Fh
  jshi j2, 7267h
  jshi j2, 616Eh
  jshi j2, 6F20h
  jcall og_r8
  jldi j1, 0
  jld j2, j1, OGTRY
  jcall og_hex
  jldi j2, 0
  jshi j2, 0020h
  jshi j2, 3D20h
  jcall og_r8
  jldi j1, 0
  jld j2, j1, OGSC
  jcall og_signed
  jldi j2, 0
  jshi j2, 2028h
  jshi j2, 7369h
  jshi j2, 6E20h
  jcall og_r8
  jldi j1, 0
  jld j2, j1, OGBASE
  jcall og_signed
  jldi j2, 41
  jcall putch
  jldi j1, 0
  jld j2, j1, OGSC
  jld j3, j1, OGBASE
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, ol_end
  jldi j2, 32
  jcall putch
  jldi j2, 42
  jcall putch
ol_end:
  jldi j2, 10
  jcall putch
  jjmp flush

; Up to 8 letters of j2, the first in its highest byte (a 0 byte skipped). Uses j1-j6.
og_r8:
  jldi j1, 0
  jst j2, j1, OGLET
  jldi j5, 8
  jwhile j5
    jldi j1, 0
    jld j2, j1, OGLET
    jldi j3, 56
    jshr j2, j2, j3
    jst j5, j1, EVT2
    jjz j2, or_skip
    jcall putch
  or_skip:
    jldi j1, 0
    jld j2, j1, OGLET
    jldi j3, 8
    jshl j2, j2, j3
    jst j2, j1, OGLET
    jld j5, j1, EVT2
    jldi j3, 1
    jsub j5, j5, j3
  jwend
  jret

; Its letters as they are written, the first one first ("-": none). Uses j1-j6.
og_hex:
  jldi j1, 0
  jst j2, j1, OGLET
  jjnz j2, oh_some
  jldi j2, 45
  jjmp putch
oh_some:
  jwhile j2
    jldi j3, 15
    jand j2, j2, j3
    jldi j3, 48
    jadd j2, j2, j3
    jcall putch
    jldi j1, 0
    jld j2, j1, OGLET
    jldi j3, 4
    jshr j2, j2, j3
    jst j2, j1, OGLET
  jwend
  jret

; j2 with its sign, as the exam is said. Uses j1-j12.
og_signed:
  jldi j1, 0
  jst j2, j1, OGLET
  jldi j3, 63
  jsar j3, j2, j3
  jjz j3, osg_pos
  jldi j2, 45
  jcall putch
  jldi j1, 0
  jld j2, j1, OGLET
  jldi j3, 0
  jsub j2, j3, j2
  jjmp putmix
osg_pos:
  jld j2, j1, OGLET
  jjmp putmix

; A candidate (ORGAN_CANDIDATE): it sits the exam of the genome it was built with, tells its parent its score (a word
; to -1, "my parent") and ends. Nothing written. Uses j1-j14.
candidate:
  jcall distill_no
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, FORMS
  jldi j2, ORGAN_GENOME
  jst j2, j1, EVC
  jcall ev_exam
  jldi j1, 0
  jldi j10, 30
  jldi j11, -1
  jld j12, j1, EVS
  jcall ask
  jhalt


; Its memory (Capitan: "the concepts it learned and the genome cannot be lost: something has to remain… no paste +
; paste + paste growing the file: only taking out or keeping the best paths"). The file "memoria" (its number after
; it) is written whole every time, never appended to: {how many, then each piece: key, its evidence, its bits a pair,
; low, high, floor} (48 bytes each). Read when it is born into TMEM: the judge counts each difference with the larger
; of its evidence now and the one it carried (the same book read again is no new evidence). Uses j1-j14.
mem_load:
  jcall mem_label
  jldi j2, TMEM
  jldi j3, 48
  jcall pl_new
  jldi j10, 4                   ; open (created if it is not there: then it reads nothing)
  jldi j11, MEML
  jldi j1, 0
  jld j12, j1, MEMN
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ml_done
  jst j13, j1, MEMH
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 5
  jor j10, j10, j2
  jldi j11, MCNT
  jldi j12, 8
  jcall ask
  jldi j1, 0
  jldi j2, 8
  jsub j2, j13, j2
  jjnz j2, ml_close
  jld j11, j1, MCNT
  jjz j11, ml_close
  jldi j2, 48
  jmul j11, j11, j2
  jst j11, j1, MSZ
  jcall room
  jldi j1, 0
  jst j13, j1, MBUFP
  jld j10, j1, MEMH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jadd j11, j13, j1
  jld j12, j1, MSZ
  jcall ask
  jldi j1, 0
  jld j2, j1, MSZ               ; (all of it, or nothing: a memory cut short is no memory)
  jsub j2, j13, j2
  jjnz j2, ml_close
  jld j9, j1, MBUFP             ; every piece into TMEM
  jld j10, j1, MCNT
  jwhile j10
    jldi j1, 0
    jld j5, j9, 0
    jldi j2, TMEM
    jcall pl_take
    jldi j6, 8
    jldi j3, 5
    jwhile j3
      jadd j7, j9, j6
      jld j8, j7, 0
      jadd j7, j4, j6
      jst j8, j7, 0
      jldi j7, 8
      jadd j6, j6, j7
      jldi j7, 1
      jsub j3, j3, j7
    jwend
    jldi j2, 48
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j1, 0                    ; (its room given back: what it read is in TMEM)
  jldi j10, 3
  jld j11, j1, MBUFP
  jcall ask
ml_close:
  jldi j1, 0
  jld j10, j1, MEMH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
ml_done:
  jldi j1, 0
  jret

; The memory written again, whole: every piece that pays now (its evidence and its bits a pair as the judge weighed
; them, so a confirmed one keeps the larger of what it carried and what it has now), and every one it carried that
; this reading never met, its evidence halved (one life without confirmation; the half is criterion, not measurement),
; kept only while that evidence still pays its name by the judge's own law. One it carried that this reading met and
; that did not pay falls out: it had its chance. Uses j1-j14.
mem_save:
  jcall mem_label
  jldi j1, 0                    ; room for all of them: the pieces that pay now, and what it carried
  jld j11, j1, TMEM + 16
  jldi j9, 0
  jld j10, j1, ROOMD             ; (every place of the differences' table)
  jld j10, j10, 8
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j3, 48
    jmul j3, j9, j3
    jld j2, j1, ROOMD
    jld j2, j2, 0
    jadd j3, j3, j2
    jld j2, j3, 0
    jjz j2, mz_next
    jld j2, j3, 40
    jldi j4, 63
    jsar j4, j2, j4
    jjnz j4, mz_next
    jjz j2, mz_next
    jldi j2, 1
    jadd j11, j11, j2
  mz_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j2, 48
  jmul j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, MBUFP
  jst j1, j1, MCNT
  jst j1, j1, MHELP
  jldi j9, 0                    ; the pieces now
  jld j10, j1, ROOMD             ; (every place of the differences' table)
  jld j10, j10, 8
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j3, 48
    jmul j3, j9, j3
    jld j2, j1, ROOMD
    jld j2, j2, 0
    jadd j3, j3, j2
    jld j2, j3, 0
    jjz j2, ms_next
    jld j2, j3, 40
    jldi j4, 63
    jsar j4, j2, j4
    jjnz j4, ms_next
    jjz j2, ms_next
    jst j3, j1, GE
    jld j5, j3, 0
    jldi j2, TRD
    jcall pl_find
    jld j2, j4, 24              ; (its evidence carried, more than this reading saw: the memory made it)
    jldi j3, 16
    jsar j2, j2, j3
    jld j6, j4, 40
    jsub j2, j2, j6
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, ms_own
    jld j2, j1, MHELP
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, MHELP
  ms_own:
    jld j6, j4, 40
    jld j7, j4, 48
    jld j3, j1, GE
    jcall ms_put
  ms_next:
    jldi j1, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jld j2, j1, MCNT
  jst j2, j1, MNOW
  jld j9, j1, TMEM              ; what it carried and this reading never met
  jld j10, j1, TMEM + 8
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j1, 0
    jld j5, j9, 0
    jjz j5, mc_next
    jst j9, j1, GE
    jld j2, j1, ROOMD
    jcall pl_find
    jld j2, j4, 0
    jjnz j2, mc_next
    jld j3, j1, GE              ; its evidence halved: does it still pay its name?
    jld j6, j3, 8
    jldi j2, 1
    jsar j6, j6, j2
    jjz j6, mc_next
    jst j6, j1, MSZ
    jld j2, j3, 40              ; its name: 2 log2 U of its floor, times the patience instinct over 2 (the judge's law)
    jldi j4, 255
    jand j2, j2, j4
    jldi j4, 3
    jshl j2, j2, j4
    jld j2, j2, UFL
    jcall lc_lg
    jld j4, j1, GPAC
    jjnz j4, mc_pac
    jldi j4, 4
  mc_pac:
    jmul j2, j2, j4
    jldi j4, 1
    jsar j2, j2, j4
    jst j2, j1, MCOST
    jld j3, j1, GE
    jld j7, j3, 16
    jld j6, j1, MSZ
    jmul j2, j6, j7
    jld j4, j1, MCOST
    jsub j2, j2, j4
    jldi j4, 63
    jsar j4, j2, j4
    jjnz j4, mc_next
    jjz j2, mc_next
    jld j3, j1, GE              ; kept, as it was but halved
    jld j6, j1, MSZ
    jld j7, j3, 16
    jcall mc_put
  mc_next:
    jldi j1, 0
    jldi j2, 48
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j10, 12                  ; the file, whole: the old one out, the new one in
  jldi j11, MEML
  jld j12, j1, MEMN
  jcall ask
  jldi j10, 4
  jldi j11, MEML
  jldi j1, 0
  jld j12, j1, MEMN
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ms_free
  jst j13, j1, MEMH
  jld j2, j1, MBUFP             ; how many, at its head
  jld j3, j1, MCNT
  jst j3, j2, 0
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, MBUFP
  jld j12, j1, MCNT
  jldi j2, 48
  jmul j12, j12, j2
  jldi j2, 8
  jadd j12, j12, j2
  jcall ask
  jldi j1, 0
  jld j10, j1, MEMH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0                    ; said: "memoria", how many it keeps, and how many of them come from lives before
  jldi j2, 0
  jshi j2, 0061h
  jshi j2, 6972h
  jshi j2, 6F6Dh
  jshi j2, 656Dh
  jcall put8
  jldi j2, 32
  jcall putch
  jld j2, j1, MCNT
  jcall putmix
  jldi j2, 32
  jcall putch
  jld j2, j1, MCNT
  jld j3, j1, MNOW
  jsub j2, j2, j3
  jcall putmix
  jldi j2, 32
  jcall putch
  jld j2, j1, MHELP
  jcall putmix
  jldi j2, 10
  jcall putch
  jcall flush
ms_free:
  jldi j1, 0                    ; its room given back
  jldi j10, 3
  jld j11, j1, MBUFP
  jcall ask
  jldi j1, 0
  jret

; A piece now into the memory being written: ROOMD entry j3 {key, low, high, floor, pairs, bits}, its evidence j6, its
; bits a pair j7. Uses j1-j5.
ms_put:
  jldi j1, 0
  jld j2, j1, MCNT
  jldi j4, 48
  jmul j4, j2, j4
  jld j5, j1, MBUFP
  jadd j4, j4, j5
  jld j5, j3, 0
  jst j5, j4, 8
  jst j6, j4, 16
  jst j7, j4, 24
  jld j5, j3, 8
  jst j5, j4, 32
  jld j5, j3, 16
  jst j5, j4, 40
  jld j5, j3, 24
  jst j5, j4, 48
  jldi j5, 1
  jadd j2, j2, j5
  jst j2, j1, MCNT
  jret

; One it carried into the memory being written: TMEM entry j3 {key, evidence, bits a pair, low, high, floor}, its
; evidence j6, its bits a pair j7. Uses j1-j5.
mc_put:
  jldi j1, 0
  jld j2, j1, MCNT
  jldi j4, 48
  jmul j4, j2, j4
  jld j5, j1, MBUFP
  jadd j4, j4, j5
  jld j5, j3, 0
  jst j5, j4, 8
  jst j6, j4, 16
  jst j7, j4, 24
  jld j5, j3, 24
  jst j5, j4, 32
  jld j5, j3, 32
  jst j5, j4, 40
  jld j5, j3, 40
  jst j5, j4, 48
  jldi j5, 1
  jadd j2, j2, j5
  jst j2, j1, MCNT
  jret

; The label "memoria", with its number after it if it has one, at MEML (MEMN bytes). Uses j1-j5.
mem_label:
  jcall nest_labels
  jldi j1, 0
  jldi j2, 0
  jshi j2, 0061h
  jshi j2, 6972h
  jshi j2, 6F6Dh
  jshi j2, 656Dh
  jldi j4, 7
  jst j4, j1, MEMN
  jld j3, j1, QUIEN
  jjz j3, mm_one
  jldi j4, 48
  jadd j4, j3, j4
  jldi j5, 56
  jshl j4, j4, j5
  jor j2, j2, j4
  jldi j4, 8
  jst j4, j1, MEMN
mm_one:
  jst j2, j1, MEML
  jret

; Its identity, in the file "nido" (Capitan, from the chess creature: "they have identity and keep testing"): {its
; mark, the champion, the second, their exams, the luck, the generations it lived}. If it is there, the evolution goes
; on from it (it wakes with its own instincts and luck), else it is born with today's. Read -> j2 1 if it woke.
; Uses j1-j14.
nest_load:
  jcall nest_labels
  jldi j10, 4                   ; open (created if it is not there: then it reads nothing)
  jldi j11, NIDL
  jld j12, j1, NIDN
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, nl_none
  jst j13, j1, EVT
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 5
  jor j10, j10, j2
  jldi j11, NEST
  jldi j12, 56
  jcall ask
  jldi j1, 0
  jst j13, j1, EVT2
  jld j10, j1, EVT              ; closed
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j2, j1, EVT2
  jldi j3, 56
  jsub j2, j2, j3
  jjnz j2, nl_none
  jld j2, j1, NEST
  jcall nest_mark
  jsub j2, j2, j3
  jjnz j2, nl_none
  jld j2, j1, NEST + 8
  jst j2, j1, EVC
  jld j2, j1, NEST + 16
  jst j2, j1, EVR
  jld j2, j1, NEST + 24
  jst j2, j1, EVCS
  jld j2, j1, NEST + 32
  jst j2, j1, EVRS
  jld j2, j1, NEST + 40
  jst j2, j1, RNG
  jld j2, j1, NEST + 48
  jst j2, j1, EVLIV
  jldi j2, 1
  jret
nl_none:
  jldi j1, 0
  jst j1, j1, EVLIV
  jldi j2, 0
  jret

; The identity written back to "nido", whole. Uses j1-j14.
nest_save:
  jcall nest_labels
  jcall nest_mark
  jst j3, j1, NEST
  jld j2, j1, EVC
  jst j2, j1, NEST + 8
  jld j2, j1, EVR
  jst j2, j1, NEST + 16
  jld j2, j1, EVCS
  jst j2, j1, NEST + 24
  jld j2, j1, EVRS
  jst j2, j1, NEST + 32
  jld j2, j1, RNG
  jst j2, j1, NEST + 40
  jld j2, j1, EVLIV
  jst j2, j1, NEST + 48
  jldi j10, 12                  ; the old one out, a new one in
  jldi j11, NIDL
  jld j12, j1, NIDN
  jcall ask
  jldi j10, 4
  jldi j11, NIDL
  jld j12, j1, NIDN
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ns_done
  jst j13, j1, EVT
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jldi j11, NEST
  jldi j12, 56
  jcall ask
  jldi j1, 0
  jld j10, j1, EVT
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
ns_done:
  jldi j1, 0
  jret

; The autopsy opened: "autopsia", new, and from here on everything written goes into it too (the chess creature's
; dissection, readable: its instincts, its evolution, its concepts). Uses j1-j14.
autopsy_open:
  jcall nest_labels
  jldi j10, 12
  jldi j11, AUTL
  jld j12, j1, AUTN
  jcall ask
  jldi j10, 4
  jldi j11, AUTL
  jld j12, j1, AUTN
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ao_done
  jldi j2, 1
  jadd j2, j13, j2
  jst j2, j1, AUTH
ao_done:
  jret

; The labels: its nest at NIDL (NIDN bytes), its letter and the other's at CARL and OTRL, "autopsia" at AUTL. Uses
; j1-j5.
nest_labels:
  jldi j1, 0
  jld j3, j1, QUIEN             ; (awake for good it already knows who it is)
  jld j4, j1, VQ
  jjnz j4, nl_who
  jld j3, j1, NPAS              ; who it is: the third byte after K in "p" (0: alone, its nest is "nido")
  jldi j4, 16
  jshr j3, j3, j4
  jldi j4, 255
  jand j3, j3, j4
  jst j3, j1, QUIEN
nl_who:
  jldi j2, 0                    ; "nido", and its number after it
  jshi j2, 6F64h
  jshi j2, 696Eh
  jldi j4, 4
  jst j4, j1, NIDN
  jjz j3, nl_alone
  jldi j4, 48
  jadd j4, j3, j4
  jldi j5, 32
  jshl j4, j4, j5
  jor j2, j2, j4
  jldi j4, 5
  jst j4, j1, NIDN
nl_alone:
  jst j2, j1, NIDL
  jldi j2, 0                    ; its letter "cartaN", and the other's: two of them, N and 3 - N
  jshi j2, 0061h
  jshi j2, 7472h
  jshi j2, 6163h
  jldi j4, 48
  jadd j4, j3, j4
  jldi j5, 40
  jshl j4, j4, j5
  jor j4, j2, j4
  jst j4, j1, CARL
  jldi j4, 51
  jsub j4, j4, j3
  jldi j5, 40
  jshl j4, j4, j5
  jor j4, j2, j4
  jst j4, j1, OTRL
  jldi j2, 0
  jshi j2, 6169h
  jshi j2, 7370h
  jshi j2, 6F74h
  jshi j2, 7561h
  jst j2, j1, AUTL
  jldi j4, 8                    ; (with its number after it, if it has one: each its own)
  jst j4, j1, AUTN
  jst j1, j1, AUTL + 8
  jjz j3, nl_aut
  jldi j4, 48
  jadd j4, j3, j4
  jst j4, j1, AUTL + 8
  jldi j4, 9
  jst j4, j1, AUTN
nl_aut:
  jret

; The other's letter read (CARTA: its genome), if it left one and it is not mute (the fourth byte after K: 1
; reads no letters, the control). PARTOK 1 if there is one. Uses j1-j14.
letter_read:
  jldi j1, 0
  jst j1, j1, PARTOK
  jld j2, j1, QUIEN
  jjz j2, lr_done
  jld j2, j1, NPAS
  jldi j3, 24
  jshr j2, j2, j3
  jldi j3, 255
  jand j2, j2, j3
  jjnz j2, lr_done
  jldi j10, 4
  jldi j11, OTRL
  jldi j12, 6
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, lr_done
  jst j13, j1, EVT
  jst j1, j1, LETB + 8          ; (a letter of 8 bytes, from before organs: one without an organ)
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 5
  jor j10, j10, j2
  jldi j11, LETB
  jldi j12, 16
  jcall ask
  jldi j1, 0
  jst j13, j1, EVT2
  jld j10, j1, EVT
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j2, j1, EVT2              ; eight bytes at least: its genome
  jldi j3, 8
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, lr_done
  jld j2, j1, LETB
  jst j2, j1, CARTA
  jst j2, j1, LSEEN
  jld j2, j1, LETB + 8          ; and its organ, to try first (if it is not the one it has)
  jst j2, j1, LSEEN + 8
  jldi j3, ORGAN_CODE
  jsub j3, j2, j3
  jjnz j3, lr_organ
  jldi j2, 0
lr_organ:
  jst j2, j1, PORG
  jldi j2, 1
  jst j2, j1, PARTOK
lr_done:
  jret

; j2 = 1 if the other's letter is not the last one it read (it came while it slept). Uses j1-j14.
letter_new:
  jldi j1, 0
  jld j2, j1, QUIEN
  jjz j2, ln_none
  jldi j10, 4
  jldi j11, OTRL
  jldi j12, 6
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ln_none
  jst j13, j1, EVT
  jst j1, j1, LETB
  jst j1, j1, LETB + 8
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 5
  jor j10, j10, j2
  jldi j11, LETB
  jldi j12, 16
  jcall ask
  jldi j1, 0
  jld j10, j1, EVT
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j2, j1, LETB
  jjz j2, ln_none
  jld j3, j1, LSEEN
  jsub j2, j2, j3
  jld j3, j1, LETB + 8
  jld j4, j1, LSEEN + 8
  jsub j3, j3, j4
  jor j2, j2, j3
  jjz j2, ln_none
  jldi j2, 1
  jret
ln_none:
  jldi j1, 0
  jldi j2, 0
  jret

; Its letter for the other: its champion's genome, in "cartaN". Uses j1-j14.
letter_write:
  jldi j1, 0
  jld j2, j1, QUIEN
  jjz j2, lw_done
  jld j2, j1, EVC
  jst j2, j1, CARTA
  jst j2, j1, LETB
  jldi j2, ORGAN_CODE           ; and the organ it has: letters of its molde, no word of what it read
  jst j2, j1, LETB + 8
  jldi j10, 12
  jldi j11, CARL
  jldi j12, 6
  jcall ask
  jldi j10, 4
  jldi j11, CARL
  jldi j12, 6
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, lw_done
  jst j13, j1, EVT
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jldi j11, LETB
  jldi j12, 16
  jcall ask
  jldi j1, 0
  jld j10, j1, EVT
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
lw_done:
  jldi j1, 0
  jret

; The nest's mark -> j3 ("RAZARNID"). Uses j3.
nest_mark:
  jldi j3, 0
  jshi j3, 4449h
  jshi j3, 4E52h
  jshi j3, 415Ah
  jshi j3, 4152h
  jret

; One instinct of the child EVCH changed one step up or down (j2: the luck), inside its range: patience 1-8,
; firmness 1-4, readings 1-3. Uses j1-j8.
ev_mutate:
  jldi j1, 0
  jldi j3, 3
  jdiv j4, j2, j3
  jmul j4, j4, j3
  jsub j3, j2, j4               ; which (0, 1, 2; the luck is never negative here)
  jldi j4, 1
  jldi j5, 8
  jshr j4, j2, j5
  jldi j5, 1
  jand j4, j4, j5               ; up or down
  jadd j4, j4, j4
  jsub j4, j4, j5
  jldi j5, 3
  jshl j5, j3, j5
  jld j6, j1, EVCH
  jshr j7, j6, j5
  jldi j8, 255
  jand j7, j7, j8
  jadd j7, j7, j4
  jldi j8, 8                    ; its top
  jjz j3, em_top
  jldi j8, 4
  jldi j2, 1
  jsub j2, j3, j2
  jjz j2, em_top
  jldi j8, 3
em_top:
  jsub j2, j7, j8               ; past the top: the top; below one: one
  jldi j4, 63
  jsar j2, j2, j4
  jjnz j2, em_low
  jadd j7, j8, j1
em_low:
  jjnz j7, em_put
  jldi j7, 1
em_put:
  jldi j8, 255                  ; put back in its byte
  jshl j8, j8, j5
  jldi j2, -1
  jxor j8, j8, j2
  jand j6, j6, j8
  jshl j7, j7, j5
  jor j6, j6, j7
  jst j6, j1, EVCH
  jret

; The luck: xorshift (13, 7, 17) -> j2, never negative. Uses j1-j4.
ev_rand:
  jldi j1, 0
  jld j2, j1, RNG
  jldi j3, 13
  jshl j4, j2, j3
  jxor j2, j2, j4
  jldi j3, 7
  jshr j4, j2, j3
  jxor j2, j2, j4
  jldi j3, 17
  jshl j4, j2, j3
  jxor j2, j2, j4
  jst j2, j1, RNG
  jldi j3, 1
  jshr j2, j2, j3
  jret

; The instincts of EVCH set. Uses j1-j4.
ev_set:
  jldi j1, 0
  jld j2, j1, EVCH
  jldi j3, 255
  jand j4, j2, j3
  jst j4, j1, GPAC
  jldi j4, 8
  jshr j4, j2, j4
  jand j4, j4, j3
  jst j4, j1, GFIRM
  jldi j4, 16
  jshr j4, j2, j4
  jand j4, j4, j3
  jld j2, j1, NPAS
  jldi j3, -256
  jand j2, j2, j3
  jor j2, j2, j4
  jst j2, j1, NPAS
  jret

; The exam of the champion EVC: read with its instincts, the exam renglones apart, then knock with them -> EVS,
; the bits the pieces and the concepts tell over the blind, less what naming its pieces costs. Uses j1-j14.
ev_exam:
  jldi j1, 0
  jld j2, j1, EVC
  jst j2, j1, EVCH
  jcall ev_set
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, EXAMM
  jcall learn_pulses
  jldi j1, 0
  jldi j2, 2
  jst j2, j1, EXAMM
  jldi j2, 1
  jst j2, j1, TESTING
  jcall all_floors
  jldi j1, 0
  jst j1, j1, TESTING
  jldi j1, 0                    ; the exam, in bits: what the pieces and the concepts tell of the exam renglones more
  jst j1, j1, EVS               ; than chance, each kind H log2((H + 1/2) / (B + 1/2)) (H its hits, B the blind's): many
  jld j2, j1, TCOC              ; hits and a clear edge both count, and a ratio of few cases shrinks by itself (precision
  jld j3, j1, TCOB              ; weighed by its own precision: no weight set by hand)
  jcall ev_gain
  jldi j9, 1
  jldi j10, 4
  jwhile j10
    jldi j1, 0
    jldi j3, 3
    jshl j3, j9, j3
    jld j2, j3, TPCEC
    jld j3, j3, TBLC
    jcall ev_gain
    jldi j4, 1
    jadd j9, j9, j4
    jsub j10, j10, j4
  jwend
  jldi j9, 1                    ; less what its pieces cost, in the judge's own coin: each named, 2 log2 U bits of its
  jldi j10, 4                   ; floor (the true price, not the one patience sets: else patience would lower its own)
  jwhile j10
    jldi j1, 0
    jldi j3, 3
    jshl j3, j9, j3
    jld j2, j3, NADC
    jst j2, j1, EVT
    jldi j2, 1                  ; its floor: twins 1, switches and associates 2, doors 3
    jldi j4, 1
    jsub j4, j9, j4
    jjz j4, ec_floor
    jldi j2, 2
    jldi j4, 4
    jsub j4, j9, j4
    jjnz j4, ec_floor
    jldi j2, 3
  ec_floor:
    jldi j3, 3
    jshl j3, j2, j3
    jld j2, j3, UFL
    jcall lg16
    jadd j2, j2, j2
    jld j3, j1, EVT
    jmul j2, j2, j3
    jldi j3, 16
    jsar j2, j2, j3
    jld j3, j1, EVS
    jsub j3, j3, j2
    jst j3, j1, EVS
    jldi j4, 1
    jadd j9, j9, j4
    jsub j10, j10, j4
  jwend
  jldi j1, 0                    ; and what it lived moves its luck: the path depends on its experience
  jld j2, j1, RNG
  jld j3, j1, EVS
  jcall hw
  jjnz j2, ex_luck
  jldi j2, 1
ex_luck:
  jst j2, j1, RNG
  jret

; EVS plus the bits H j2 tells over the blind's B j3: H (log2(2H + 1) - log2(2B + 1)), whole bits. Uses j1-j8.
ev_gain:
  jldi j1, 0
  jst j2, j1, EVT
  jst j3, j1, EVT2
  jadd j2, j2, j2
  jldi j3, 1
  jadd j2, j2, j3
  jcall lg16
  jst j2, j1, EVGA
  jld j2, j1, EVT2
  jadd j2, j2, j2
  jldi j3, 1
  jadd j2, j2, j3
  jcall lg16
  jld j3, j1, EVGA
  jsub j3, j3, j2
  jld j4, j1, EVT
  jmul j3, j3, j4
  jldi j4, 16
  jsar j3, j3, j4
  jld j4, j1, EVS
  jadd j4, j4, j3
  jst j4, j1, EVS
  jret

; A line of the evolution: the generation, the child's instincts, its exam, and "*" if it is the champion now (j2). Its
; numbers go into j0. Uses j1-j14.
ev_line:
  jldi j1, 0
  jst j2, j1, EVW
  jldi j2, 0                    ; "instinto"
  jshi j2, 6F74h
  jshi j2, 6E69h
  jshi j2, 7473h
  jshi j2, 6E69h
  jcall put8
  jldi j2, 32
  jcall putch
  jld j2, j1, EVI
  jcall putmix
  jldi j2, 58
  jcall putch
  jld j2, j1, EVCH
  jldi j3, 255
  jand j2, j2, j3
  jldi j4, 32
  jst j2, j1, EVT
  jadd j2, j4, j1
  jcall putch
  jld j2, j1, EVT
  jcall putmix
  jldi j2, 32
  jcall putch
  jld j2, j1, EVCH
  jldi j3, 8
  jshr j2, j2, j3
  jldi j3, 255
  jand j2, j2, j3
  jcall putmix
  jldi j2, 32
  jcall putch
  jld j2, j1, EVCH
  jldi j3, 16
  jshr j2, j2, j3
  jldi j3, 255
  jand j2, j2, j3
  jcall putmix
  jldi j2, 32
  jcall putch
  jldi j2, 61
  jcall putch
  jldi j2, 32
  jcall putch
  jld j2, j1, EVS               ; (with its sign: an exam can cost more than it tells)
  jldi j3, 63
  jsar j3, j2, j3
  jjz j3, el_pos
  jldi j2, 45
  jcall putch
  jld j2, j1, EVS
  jldi j3, 0
  jsub j2, j3, j2
  jjmp el_num
el_pos:
  jld j2, j1, EVS
el_num:
  jcall putmix
  jld j2, j1, EVW
  jjz j2, el_end
  jldi j2, 32
  jcall putch
  jldi j2, 42
  jcall putch
el_end:
  jldi j2, 10
  jcall putch
  jjmp flush

; The eight letters j2 (the first in its low byte; a 0 ends them). Uses j1-j4.
put8:
  jldi j1, 0
  jst j2, j1, EVT
  jldi j3, 8
  jwhile j3
    jldi j1, 0
    jld j2, j1, EVT
    jldi j4, 255
    jand j2, j2, j4
    jjz j2, p8_done
    jst j3, j1, EVT2
    jcall putch
    jldi j1, 0
    jld j2, j1, EVT
    jldi j4, 8
    jshr j2, j2, j4
    jst j2, j1, EVT
    jld j3, j1, EVT2
    jldi j4, 1
    jsub j3, j3, j4
  jwend
p8_done:
  jret


; Reborn (Capitan: "let them eat the new book"): every room it got is given back (request 3), and what it knew of the
; books is forgotten, so reading the whole shelf again costs the same memory as the first time. What it is stays: its
; identity and its evolution (1D00h-1E4Fh), its autopsy, the list of its rooms. Uses j1-j14.
reborn:
  jldi j1, 0                    ; its autopsy closed: the next life writes a new one (open, it could not be taken out,
  jld j10, j1, AUTH             ; and the new one was written over the old, its rest left behind)
  jjz j10, rb_noaut
  jldi j2, 1
  jsub j10, j10, j2
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jst j1, j1, AUTH
rb_noaut:
  jldi j1, 0                    ; (one more life lived)
  jld j2, j1, RBC
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, RBC
  jldi j1, 0
  jld j9, j1, RLIST
  jld j10, j1, RLN
  jwhile j10
    jldi j1, 0
    jld j11, j9, 0
    jldi j10, 3
    jcall ask
    jldi j1, 0
    jldi j2, 8
    jadd j9, j9, j2
    jld j10, j1, RLN
    jldi j2, 1
    jsub j10, j10, j2
    jst j10, j1, RLN
  jwend
  jldi j2, 1008h                ; what it knew of the books: the reader's and the pulse's (its window's request,
  jldi j3, 160h                 ; at 1000h, is rewritten by every request)
  jcall rb_zero
  jldi j2, 1180h
  jldi j3, 0B80h                ; up to its evolution
  jcall rb_zero
  jldi j2, 1F00h                ; and the growing tables, past its identity
  jldi j3, 100h
  jjmp rb_zero

; The fingerprint of its shelf -> j2: every "libro" file, its label and its bytes, FNV-1a, in the shelf's order. Its
; list is kept as it was (the one read). Uses j1-j14.
shelf_print:
  jldi j1, 0
  jld j2, j1, SHELF
  jst j2, j1, OGT
  jld j2, j1, SHN
  jst j2, j1, OGLET
  jcall shelf_build
  jldi j1, 0
  jld j2, j1, FNVO
  jst j2, j1, SPH
  jld j9, j1, SHELF
  jld j10, j1, SHN
  jwhile j10
    jldi j1, 0
    jst j9, j1, SPA
    jst j10, j1, SPN
    jld j2, j1, SPH             ; its label
    jld j5, j9, 0
    jldi j6, 8
    jadd j6, j9, j6
    jwhile j5
      jldb j3, j6, 0
      jcall hw
      jldi j4, 1
      jadd j6, j6, j4
      jsub j5, j5, j4
    jwend
    jldi j1, 0
    jst j2, j1, SPH
    jldi j10, 4                 ; and its bytes
    jld j9, j1, SPA
    jldi j2, 8
    jadd j11, j9, j2
    jld j12, j9, 0
    jcall ask
    jldi j1, 0
    jldi j2, 63
    jshr j2, j13, j2
    jjnz j2, sh_next
    jst j13, j1, SPHD
    jldi j8, 1
    jwhile j8
      jldi j1, 0
      jld j2, j1, SPHD
      jldi j3, 32
      jshl j10, j2, j3
      jldi j3, 5
      jor j10, j10, j3
      jldi j11, 0
      jshi j11, BUF
      jldi j12, 0
      jshi j12, BUFLEN
      jcall ask
      jldi j1, 0
      jldi j2, 63
      jsar j2, j13, j2
      jldi j3, -1
      jxor j2, j2, j3
      jand j8, j13, j2
      jadd j5, j8, j1
      jldi j6, 0
      jshi j6, BUF
      jld j2, j1, SPH
      jwhile j5
        jldb j3, j6, 0
        jcall hw
        jldi j4, 1
        jadd j6, j6, j4
        jsub j5, j5, j4
      jwend
      jldi j1, 0
      jst j2, j1, SPH
    jwend
    jld j10, j1, SPHD
    jldi j2, 32
    jshl j10, j10, j2
    jldi j2, 7
    jor j10, j10, j2
    jcall ask
  sh_next:
    jldi j1, 0
    jld j9, j1, SPA             ; the next one: 8 + its label padded to 8
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jld j10, j1, SPN
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j1, 0                    ; its list's room given back, the one read kept
  jldi j10, 3
  jld j11, j1, SHELF
  jcall ask
  jldi j1, 0
  jld j2, j1, OGT
  jst j2, j1, SHELF
  jld j2, j1, OGLET
  jst j2, j1, SHN
  jld j2, j1, SPH
  jret

; j3 bytes from j2 set to 0, eight at a time. Uses j1-j4.
rb_zero:
  jldi j1, 0
  jldi j4, 8
  jwhile j3
    jst j1, j2, 0
    jadd j2, j2, j4
    jsub j3, j3, j4
  jwend
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
  jst j1, j1, GN                ; the pieces written, to give them back their bits after
  jldi j2, 10
  jldi j2, 10
  jst j2, j1, TOPN
  jwhile j2
    jldi j1, 0                  ; the piece that saves the most bits left in this kind
    jldi j11, 0
    jldi j12, 0
    jldi j9, 0
    jld j10, j1, ROOMD             ; (every place of the differences' table)
    jld j10, j10, 8
    jldi j2, 1
    jadd j10, j10, j2
    jwhile j10
      jldi j3, 48
      jmul j3, j9, j3
      jld j2, j1, ROOMD
      jld j2, j2, 0
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
  jldi j1, 0                    ; its rooms: the skeletons {key, fillings, different} and the forms seen, each a table
  jldi j11, 64                  ; that grows to what it holds (Capitan: "nothing wasted"; they were made for twice the
  jcall room                    ; units, and held one in sixteen), and by word the openness summed and its places
  jldi j1, 0
  jst j13, j1, ROOMK1
  jldi j2, 32
  jadd j2, j13, j2
  jst j2, j1, ROOMK2
  jld j2, j1, ROOMK1
  jldi j3, 32
  jcall pl_new
  jldi j1, 0
  jld j2, j1, ROOMK2
  jldi j3, 32
  jcall pl_new
  jldi j1, 0
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
  jcall k_point                 ; (what each place keeps, now that the tables stopped growing)
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
    jcall pl_take
    jldi j1, 0
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
    jcall pl_take
    jldi j1, 0
    jst j6, j1, KNEW
    jld j6, j4, 8               ; this filling in this skeleton, once more
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j4, 8
    jld j6, j1, KI              ; the place keeps its skeleton and its filling there
    jldi j7, 3
    jshl j6, j6, j7
    jld j7, j1, ROOMPS          ; (their keys while the tables grow: k_point makes them places once they stop)
    jadd j7, j7, j6
    jld j8, j1, KKEY
    jst j8, j7, 0
    jld j7, j1, ROOMPF
    jadd j7, j7, j6
    jst j5, j7, 0
    jld j6, j1, KNEW            ; a form never seen: one different more
    jjz j6, kw_next
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

; What each place keeps, its skeleton and its form, made places from their keys: the tables grow while they are filled
; (an entry moves when they double), so a place is taken only once they stopped. Uses j1-j14.
k_point:
  jldi j1, 0
  jld j9, j1, ROOMPS
  jld j10, j1, ROOMPF
  jld j11, j1, NTOK
  jwhile j11
    jldi j1, 0
    jld j5, j9, 0
    jjz j5, kp_form
    jld j2, j1, ROOMK1
    jcall pl_find
    jst j4, j9, 0
  kp_form:
    jldi j1, 0
    jld j5, j10, 0
    jjz j5, kp_next
    jld j2, j1, ROOMK2
    jcall pl_find
    jst j4, j10, 0
  kp_next:
    jldi j1, 0
    jldi j2, 8
    jadd j9, j9, j2
    jadd j10, j10, j2
    jldi j2, 1
    jsub j11, j11, j2
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
  jld j9, j1, ROOMK1            ; (every place of its table)
  jld j10, j9, 8
  jld j9, j9, 0
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

include 'crece.inc'
include 'casa.inc'
include 'pulso.inc'
include 'organo.inc'
include 'negacion.inc'
include 'lectura.inc'
