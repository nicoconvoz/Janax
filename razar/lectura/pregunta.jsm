; Razar is asked about the book with a melody (Capitan, 2026-11-06: "feed it the whole New Testament and ask it with a
; melody something about what is written in the book; not a literal answer, one it has to infer").
;
; It reads the whole book (lectura.inc), and what was said stays as requests with a hole, the same as in the pulse:
; every two words with one to three between them ("isaac padre de jacob") hang "? padre de jacob", filled by isaac,
; and "isaac padre de ?", filled by jacob. A question is a melody with holes, one per line of the file "q":
; "? padre de ? padre de juda" (who is the father of the father of Juda). It is cut where the holes are, into the
; same requests: "? padre de juda", "? padre de ?". Thinking is walking (Razar, P47): a request with a known end is
; answered by what fills it; what it answered fills the next hole, and so on until every hole is reached or one stays
; empty. Every answer keeps the way it came, so the melody is written filled in, and it says whether the book says it
; like that word for word (said) or not (inferred: it joined things said apart). Nothing is invented: a step that
; was never said in the form asked leaves the hole empty, and it says it does not know.
;
; The answers go into j0.
S_LIBRO = 0
S_P     = 10h
S_Q     = 18h
S_ASK   = 40h
S_ARROW = 80h
S_SAID  = 0C0h
S_INFER = 100h
S_NONE  = 140h
S_UNK   = 180h
S_NOBOOK = 1C0h
S_NOMEM = 200h
S_HEAD  = 240h
S_WITH  = 280h
S_OUT   = 2C0h
S_TURNED = 300h
S_TURN  = 300h
S_PLACE = 340h
S_NSW   = 380h
S_NDR   = 3C0h
S_FLIPS = 480h
S_NTURN = 4C0h
S_KBITS = 500h
S_KBITS2 = 540h
S_CAMINO = 580h                 ; asking by the clues (pistas.inc): its walk, and its own program
S_SELF  = 5C0h
S_SIL   = 600h                  ; "siluetas": the reading's silhouettes, decided over the library (pistas.inc)
S_SELFN = 8

ROOMX = 1600h                   ; the facts: {key, the word that fills it} per place (a key may have many)
XMASK = 1608h
NFACT = 1610h
ROOMK = 1618h                   ; the answers of each hole: {word, the word it came from, from which hole} (NV each)
ROOMN = 1620h                   ; the requests of the question: {left end, right end, where its middle is, how long}
QS    = 1628h                   ; the question being answered: its first unit, past its last, its holes
QE    = 1630h
NH    = 1638h
NC    = 1640h                   ; its requests
MAXH  = 1648h                   ; the most holes a question has
CHG   = 1650h                   ; something was answered this round
LASTH = 1658h                   ; the hole answered last (what is asked)
CI    = 1660h
CL    = 1668h                   ; the request being walked: its ends, its middle
CR    = 1670h
CM    = 1678h
CMN   = 1680h
SRC   = 1688h                   ; walking it: the hole it comes from (-1 a word), the value, which one
SV    = 1690h
SK    = 1698h
DST   = 16A0h
SIDE  = 16A8h                   ; 0: the hole is on the left ("? padre de jacob"); 1: on the right
KEYQ  = 16B0h
AI    = 16B8h                   ; writing an answer
AT2   = 16C0h
FOUND = 16C8h
VIA   = 16D0h                   ; the piece a lookup goes by (0: none; 1 << 56 | a switch's word; 2 << 56 | turned
SIDEQ = 16D8h                   ; << 48 | the door's other middle), and the side it looks on
ROOMP = 16E0h                   ; its pieces: {1 switch / 2 door, word / one middle, other middle, turned} (32 bytes)
NPC   = 16E8h
NSWP  = 16F0h
NDRP  = 16F8h
MPOS  = 1700h                   ; a switch put in the middle: where, places left
MLEFT = 1708h
SVB   = 1710h                   ; the judge: the bits of the value walked from, of the answer being added, how often the
KB    = 1718h                   ; request was said (and its log2), where its places start, log2 of the book, the name of
CKEY  = 1720h                   ; a piece, how often each word is in the book
LCK   = 1728h
XS0   = 1730h
LGT   = 1738h
PCOST = 1740h
ROOMF2 = 1748h
VIAS  = 7000h                   ; an answer written: the piece of each hole's step
MBUF  = 7800h                   ; a middle made with a piece
HPOS  = 5000h                 ; where each hole of the question is (HMAX holes: criterion, past them it says it
HCNT  = 5800h                   ; does not know); how many answers each hole has; 1: the hole was walked to; an
HDONE = 6000h                   ; answer written: the word in each hole
ASGN  = 6800h
HMAX  = 256
include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j0, 0
jcall clue_round                ; (with nests: what this round reads again, as its book)
jcall read_book
jldi j1, 0                      ; the whole book, none kept apart (one renglon in more than any book has)
jldi j2, 0
jshi j2, 4000h
jshi j2, 0
jshi j2, 0
jshi j2, 0
jst j2, j1, PK
jcall learn_pulses
jcall distill_no

jldi j1, 0                      ; its pieces that pay: the switches and the doors
jld j2, j1, NADC + 16
jld j3, j1, NADC + 32
jadd j11, j2, j3
jldi j4, 1
jadd j11, j11, j4
jldi j4, 5
jshl j11, j11, j4
jcall room
jldi j1, 0
jst j13, j1, ROOMP
jst j1, j1, NPC
jst j1, j1, NSWP
jst j1, j1, NDRP
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
  jjz j2, pc_next
  jld j2, j3, 40
  jldi j4, 63
  jsar j4, j2, j4
  jjnz j4, pc_next
  jjz j2, pc_next
  jld j2, j3, 24
  jst j2, j1, DKT
  jld j2, j3, 8
  jst j2, j1, DLO
  jcall d_cat_of
  jld j4, j1, NPC
  jldi j6, 5
  jshl j4, j4, j6
  jld j6, j1, ROOMP
  jadd j4, j4, j6
  jldi j6, 2
  jsub j6, j5, j6
  jjnz j6, pc_door
  jldi j6, 1                    ; a switch: its word
  jst j6, j4, 0
  jld j6, j3, 16
  jst j6, j4, 8
  jst j4, j1, AT2                ; and whether it is the switch distilled (a negation is never taken out)
  jadd j2, j6, j1
  jcall n_flags
  jldi j4, 1
  jand j6, j3, j4
  jld j4, j1, AT2
  jst j6, j4, 24
  jld j6, j1, NSWP
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j1, NSWP
  jjmp pc_add
pc_door:
  jldi j6, 4
  jsub j6, j5, j6
  jjnz j6, pc_next
  jldi j6, 2                    ; a door: its two middles, and whether it turns
  jst j6, j4, 0
  jld j6, j3, 8
  jst j6, j4, 8
  jld j6, j3, 16
  jst j6, j4, 16
  jld j6, j3, 24
  jldi j7, 8
  jshr j6, j6, j7
  jst j6, j4, 24
  jld j6, j1, NDRP
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j1, NDRP
pc_add:
  jld j6, j1, NPC
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j1, NPC
pc_next:
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend

jldi j1, 0                      ; the judge: how often each word is in the book, log2 of the book, and the name of a piece
jld j11, j1, NV
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMF2
jld j9, j1, ROOMT
jld j10, j1, NTOK
jwhile j10
  jld j2, j9, 0
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ROOMF2
  jadd j2, j2, j3
  jld j3, j2, 0
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j2, 0
  jldi j2, 8
  jadd j9, j9, j2
  jsub j10, j10, j4
jwend
jld j2, j1, NTOK
jcall lg16
jst j2, j1, LGT
jld j2, j1, NPC
jldi j3, 1
jadd j2, j2, j3
jcall lg16
jst j2, j1, PCOST
jcall clue_counts               ; (asking by the clues: the counts of the whole books)

jldi j1, 0                      ; the facts: places for two per word for each of the three lengths, twice over
jld j2, j1, NTOK
jldi j3, 12
jmul j2, j2, j3
jcall pow2
jldi j4, 1
jsub j4, j3, j4
jst j4, j1, XMASK
jldi j4, 24
jmul j11, j3, j4
jcall room
jldi j1, 0
jst j13, j1, ROOMX
jst j1, j1, JJ
jld j2, j1, NTOK
jst j2, j1, JLEFT
jwhile j2
  jcall hang_at
  jldi j1, 0
  jld j2, j1, JJ
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, JJ
  jld j2, j1, JLEFT
  jsub j2, j2, j3
  jst j2, j1, JLEFT
jwend

jldi j1, 0                      ; the questions
jldi j2, S_Q
jst j2, j1, LABEL
jldi j2, 1
jst j2, j1, LABLEN
jldi j2, 2
jst j2, j1, PASS
jst j1, j1, QN
jcall scan
jldi j1, S_HEAD
jcall puts
jld j2, j1, NFACT
jcall putnum
jldi j1, S_NSW
jcall puts
jld j2, j1, NSWP
jcall putnum
jldi j1, S_NDR
jcall puts
jld j2, j1, NDRP
jcall putnum
jldi j1, S_NTURN
jcall puts
jld j2, j1, NNEG
jcall putnum
jldi j2, 41
jcall putch
jldi j2, 10
jcall putch

jldi j1, 0                      ; the most holes in one question: the room of answers
jst j1, j1, MAXH
jldi j3, 0
jldi j9, 0
jld j10, j1, QN
jwhile j10
  jldi j2, 3
  jshl j2, j9, j2
  jst j3, j1, QBT
  jld j3, j1, QBP
  jadd j2, j2, j3
  jld j2, j2, 0
  jld j3, j1, QBT
  jjnz j2, mh_unit
  jldi j3, 0
  jjmp mh_next
mh_unit:
  jldi j4, 1
  jadd j2, j2, j4
  jjnz j2, mh_next
  jadd j3, j3, j4
  jld j5, j1, MAXH
  jsub j5, j5, j3
  jldi j6, 63
  jsar j5, j5, j6
  jjz j5, mh_next
  jst j3, j1, MAXH
mh_next:
  jldi j4, 1
  jadd j9, j9, j4
  jsub j10, j10, j4
jwend
jld j2, j1, MAXH
jjz j2, q_none
jld j3, j1, NV
jmul j11, j2, j3
jldi j3, 40
jmul j11, j11, j3
jcall room
jldi j1, 0
jst j13, j1, ROOMK
jld j11, j1, MAXH
jldi j2, 1
jadd j11, j11, j2
jldi j2, 32
jmul j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMN
q_none:

jldi j1, 0                      ; each question, to the 0 that ends it
jst j1, j1, QS
jld j2, j1, QN
jwhile j2
  jldi j1, 0
  jld j9, j1, QS
  qe_find:
    jld j2, j1, QN
    jsub j2, j9, j2
    jjz j2, qe_found
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jjz j2, qe_found
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qe_find
  qe_found:
  jst j9, j1, QE
  jld j2, j1, QS
  jsub j2, j9, j2
  jjz j2, q_next
  jst j1, j1, NH                ; (no holes, until it finds them)
  jcall answer
  jcall clue_gather
q_next:
  jldi j1, 0
  jld j9, j1, QE
  jldi j2, 1
  jadd j9, j9, j2
  jst j9, j1, QS
  jld j2, j1, QN
  jsub j2, j2, j9
  jldi j3, 63
  jsar j3, j2, j3
  jjz j3, q_more
  jldi j2, 0
q_more:
jwend
jcall clue_end
jjmp finish

include 'crece.inc'
include 'pulso.inc'
include 'organo.inc'
include 'negacion.inc'
include 'pistas.inc'
include 'carpeta.inc'

; The facts that start at unit JJ: for one, two and three words between, if they are all words. Uses j1-j12.
hang_at:
  jldi j1, 0
  jldi j11, 1
  jldi j12, 3
  jwhile j12
    jld j9, j1, JJ
    jadd j9, j9, j11
    jldi j2, 1
    jadd j9, j9, j2
    jld j2, j1, NTOK
    jsub j2, j9, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, ha_done             ; past the row
    jld j2, j1, JJ
    jldi j3, 3
    jshl j10, j2, j3
    jld j2, j1, ROOMT
    jadd j10, j10, j2           ; where it starts
    jldi j9, 0                  ; all words?
    jadd j8, j11, j1
    jldi j2, 2
    jadd j8, j8, j2
    jadd j7, j10, j1
    jldi j9, 1
    jwhile j8
      jld j2, j7, 0
      jjnz j2, ha_word
      jldi j9, 0
    ha_word:
      jldi j2, 8
      jadd j7, j7, j2
      jldi j2, 1
      jsub j8, j8, j2
    jwend
    jjz j9, ha_next
    jldi j2, 6                  ; "A middle ?" filled by B
    jld j3, j10, 0
    jcall key_left
    jldi j3, 1
    jadd j3, j3, j11
    jldi j4, 3
    jshl j3, j3, j4
    jadd j3, j3, j10
    jld j6, j3, 0
    jcall x_add
    jldi j1, 0                  ; "? middle B" filled by A
    jldi j3, 1
    jadd j3, j3, j11
    jldi j4, 3
    jshl j3, j3, j4
    jadd j3, j3, j10
    jld j3, j3, 0
    jcall key_right
    jld j6, j10, 0
    jcall x_add
  ha_next:
    jldi j1, 0
    jldi j2, 1
    jadd j11, j11, j2
    jsub j12, j12, j2
  jwend
ha_done:
  jret

; The key of "A middle ?": A = j3, the middle j11 units from j10 + 8 -> j5. Uses j1-j4, j7, j8.
key_left:
  jldi j1, 0
  jld j2, j1, FNVO
  jadd j7, j3, j1
  jldi j3, 6
  jcall hw
  jadd j3, j7, j1
  jcall hw
  jadd j3, j11, j1
  jcall hw
  jldi j8, 8
  jadd j8, j8, j10
  jadd j7, j11, j1
  jwhile j7
    jld j3, j8, 0
    jcall hw
    jldi j3, 8
    jadd j8, j8, j3
    jldi j3, 1
    jsub j7, j7, j3
  jwend
  jjnz j2, kl_key
  jldi j2, 1
kl_key:
  jadd j5, j2, j1
  jret

; The key of "? middle B": B = j3, the middle j11 units from j10 + 8 -> j5. Uses j1-j4, j7, j8.
key_right:
  jldi j1, 0
  jld j2, j1, FNVO
  jadd j7, j3, j1
  jldi j3, 5
  jcall hw
  jadd j3, j11, j1
  jcall hw
  jldi j8, 8
  jadd j8, j8, j10
  jst j7, j1, KEYQ
  jadd j7, j11, j1
  jwhile j7
    jld j3, j8, 0
    jcall hw
    jldi j3, 8
    jadd j8, j8, j3
    jldi j3, 1
    jsub j7, j7, j3
  jwend
  jld j3, j1, KEYQ
  jcall hw
  jjnz j2, kr_key
  jldi j2, 1
kr_key:
  jadd j5, j2, j1
  jret


; The first place of key j5 among the facts -> j6. Uses j1, j6, j7.
x_slot:
  jldi j1, 0
  jldi j6, 32
  jshr j6, j5, j6
  jxor j6, j6, j5
  jld j7, j1, XMASK
  jand j6, j6, j7
  jret

; The fact: key j5 filled by j6 (once). Uses j1-j8.
x_add:
  jldi j1, 0
  jadd j2, j6, j1
  jcall x_slot
  jldi j8, 1
  jwhile j8
    jldi j3, 24
    jmul j3, j6, j3
    jld j4, j1, ROOMX
    jadd j3, j3, j4
    jld j4, j3, 0
    jjnz j4, xa_full
    jst j5, j3, 0
    jst j2, j3, 8
    jldi j4, 1
    jst j4, j3, 16
    jld j4, j1, NFACT
    jldi j7, 1
    jadd j4, j4, j7
    jst j4, j1, NFACT
    jret
  xa_full:
    jsub j4, j4, j5
    jjnz j4, xa_next
    jld j4, j3, 8
    jsub j4, j4, j2
    jjz j4, xa_again
  xa_next:
    jldi j7, 1
    jadd j6, j6, j7
    jld j7, j1, XMASK
    jand j6, j6, j7
  jwend
xa_again:                       ; said again: once more
  jld j4, j3, 16
  jldi j7, 1
  jadd j4, j4, j7
  jst j4, j3, 16
  jret

; The question from QS to QE: its holes, its requests, the walk, and what it answers. Uses j1-j14.
answer:
  jldi j1, 0                    ; no hole filled yet
  jldi j9, HMAX
  jldi j10, ASGN
  jwhile j9
    jst j1, j10, 0
    jldi j2, 8
    jadd j10, j10, j2
    jldi j2, 1
    jsub j9, j9, j2
  jwend
  jldi j1, S_ASK                ; the question, as it was asked
  jcall puts
  jld j2, j1, QS
  jld j3, j1, QE
  jcall put_units
  jldi j2, 10
  jcall putch
  jldi j1, 0                    ; a word the book never had: it cannot answer
  jld j9, j1, QS
  an_unk:
    jld j2, j1, QE
    jsub j2, j9, j2
    jjz j2, an_known
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 2
    jadd j2, j2, j3
    jjnz j2, an_unext
    jldi j1, S_UNK
    jjmp puts
  an_unext:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp an_unk
  an_known:
  jst j1, j1, NH                ; its holes
  jld j9, j1, QS
  an_hole:
    jld j2, j1, QE
    jsub j2, j9, j2
    jjz j2, an_holes
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 1
    jadd j2, j2, j3
    jjnz j2, an_hnext
    jld j2, j1, NH
    jldi j3, HMAX
    jsub j3, j2, j3
    jjnz j3, an_room
    jldi j1, S_NONE
    jjmp puts
  an_room:
    jldi j3, 3
    jshl j3, j2, j3
    jst j9, j3, HPOS
    jst j1, j3, HCNT
    jst j1, j3, HDONE
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, NH
  an_hnext:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp an_hole
  an_holes:
  jld j2, j1, NH
  jjnz j2, an_cut
  jldi j1, S_NONE
  jjmp puts
an_cut:
  jcall cut
  jldi j1, 0                    ; the walk: rounds while something new is answered
  jldi j2, -1
  jst j2, j1, LASTH
  jldi j2, 1
  jst j2, j1, CHG
  jwhile j2
    jldi j1, 0
    jst j1, j1, CHG
    jst j1, j1, CI
    jld j12, j1, NC
    jwhile j12
      jcall walk_one
      jldi j1, 0
      jld j2, j1, CI
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, CI
      jld j12, j1, NC
      jsub j12, j12, j2
    jwend
    jld j2, j1, CHG
  jwend
  jld j2, j1, LASTH             ; what it answers: every word the last hole reached, with its way
  jldi j3, 1
  jadd j3, j2, j3
  jjz j3, an_dunno
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j3, HCNT
  jjz j4, an_dunno
  jst j1, j1, FOUND             ; the answers whose way says bits (above 0), the most first; none: it does not know
  an_each:
    jldi j1, 0
    jld j2, j1, LASTH
    jld j4, j1, NV
    jmul j4, j2, j4
    jldi j5, 40
    jmul j4, j4, j5
    jld j5, j1, ROOMK
    jadd j4, j4, j5             ; its answers
    jldi j3, 3
    jshl j3, j2, j3
    jld j6, j3, HCNT
    jldi j7, 0                  ; the most bits, and which
    jldi j8, -1
    jldi j9, 0
    jwhile j6
      jld j5, j4, 32
      jsub j10, j7, j5
      jldi j11, 63
      jsar j10, j10, j11
      jjz j10, an_less
      jadd j7, j5, j1
      jadd j8, j9, j1
    an_less:
      jldi j5, 40
      jadd j4, j4, j5
      jldi j5, 1
      jadd j9, j9, j5
      jsub j6, j6, j5
    jwend
    jldi j5, 1
    jadd j5, j8, j5
    jjz j5, an_done
    jst j8, j1, AI
    jst j7, j1, KB
    jcall write_one
    jldi j1, 0                  ; written: out of the count
    jld j2, j1, LASTH
    jld j4, j1, NV
    jmul j4, j2, j4
    jld j5, j1, AI
    jadd j4, j4, j5
    jldi j5, 40
    jmul j4, j4, j5
    jld j5, j1, ROOMK
    jadd j4, j4, j5
    jst j1, j4, 32
    jldi j2, 1
    jst j2, j1, FOUND
    jjmp an_each
an_dunno:
  jldi j1, S_NONE
  jjmp puts
an_done:
  jld j2, j1, FOUND
  jjz j2, an_dunno
  jret

; The question's requests, cut where its holes are: before the first hole (its first word, the rest), between two
; holes (one to three words), after the last (the words, its last word). An end is a word, or -(hole + 1). Uses j1-j8.
cut:
  jldi j1, 0
  jst j1, j1, NC
  jld j2, j1, HPOS              ; before the first hole
  jld j3, j1, QS
  jsub j4, j2, j3               ; how many words
  jldi j5, 4
  jsub j6, j5, j4               ; at most four, the ones next to the hole
  jldi j7, 63
  jsar j6, j6, j7
  jjz j6, ct_h1
  jsub j3, j2, j5
  jadd j4, j5, j1
ct_h1:
  jldi j5, 2
  jsub j5, j4, j5
  jsar j5, j5, j7
  jjnz j5, ct_mid
  jldi j5, 3                    ; left end: the word at j3; middle from j3 + 1, j4 - 1 long; right end: hole 0
  jshl j5, j3, j5
  jst j2, j1, QBT
  jld j2, j1, QBP
  jadd j5, j5, j2
  jld j5, j5, 0
  jld j2, j1, QBT
  jldi j6, -1
  jldi j7, 1
  jadd j3, j3, j7
  jsub j4, j4, j7
  jcall c_add
ct_mid:
  jldi j9, 0                    ; between holes
  ct_pair:
    jldi j1, 0
    jld j2, j1, NH
    jldi j3, 1
    jsub j2, j2, j3
    jsub j2, j9, j2
    jjz j2, ct_tail
    jldi j3, 3
    jshl j3, j9, j3
    jld j2, j3, HPOS
    jld j4, j3, HPOS + 8
    jsub j4, j4, j2
    jldi j5, 1
    jsub j4, j4, j5             ; words between
    jjz j4, ct_pnext
    jldi j5, 4
    jsub j5, j4, j5
    jldi j6, 63
    jsar j5, j5, j6
    jjz j5, ct_pnext
    jldi j5, 1
    jadd j3, j2, j5
    jadd j5, j9, j5
    jldi j6, 0
    jsub j5, j6, j5             ; -(hole + 1)
    jldi j6, 2
    jadd j6, j9, j6
    jldi j7, 0
    jsub j6, j7, j6
    jcall c_add
  ct_pnext:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp ct_pair
ct_tail:
  jldi j1, 0                    ; after the last hole
  jld j2, j1, NH
  jldi j3, 1
  jsub j9, j2, j3
  jldi j3, 3
  jshl j3, j9, j3
  jld j2, j3, HPOS
  jldi j3, 1
  jadd j3, j2, j3               ; its first word
  jld j4, j1, QE
  jsub j4, j4, j3               ; how many
  jldi j5, 4
  jsub j6, j5, j4
  jldi j7, 63
  jsar j6, j6, j7
  jjz j6, ct_t1
  jadd j4, j5, j1
ct_t1:
  jldi j5, 2
  jsub j5, j4, j5
  jsar j5, j5, j7
  jjnz j5, ct_done
  jldi j5, 1                    ; left end: the last hole; middle from j3, j4 - 1 long; right end: its last word
  jadd j5, j9, j5
  jldi j6, 0
  jsub j5, j6, j5
  jadd j6, j3, j4
  jldi j7, 1
  jsub j6, j6, j7
  jldi j7, 3
  jshl j6, j6, j7
  jst j2, j1, QBT
  jld j2, j1, QBP
  jadd j6, j6, j2
  jld j6, j6, 0
  jld j2, j1, QBT
  jldi j7, 1
  jsub j4, j4, j7
  jcall c_add
ct_done:
  jret

; A request of the question: left end j5, right end j6, middle from unit j3 of QBUF, j4 long. Uses j1, j7, j8.
c_add:
  jldi j1, 0
  jld j7, j1, NC
  jldi j8, 5
  jshl j8, j7, j8
  jld j1, j1, ROOMN
  jadd j8, j8, j1
  jst j5, j8, 0
  jst j6, j8, 8
  jst j3, j8, 16
  jst j4, j8, 24
  jldi j1, 1
  jadd j7, j7, j1
  jldi j1, 0
  jst j7, j1, NC
  jret

; The request CI: if one end is known (a word, or a hole walked to that has answers) and the other is a hole not yet
; walked to, every value of the known end asks the facts and what fills them answers the hole. Uses j1-j14.
walk_one:
  jldi j1, 0
  jld j2, j1, CI
  jldi j3, 5
  jshl j2, j2, j3
  jld j3, j1, ROOMN
  jadd j2, j2, j3
  jld j3, j2, 0
  jst j3, j1, CL
  jld j3, j2, 8
  jst j3, j1, CR
  jld j3, j2, 16
  jst j3, j1, CM
  jld j3, j2, 24
  jst j3, j1, CMN
  jld j2, j1, CR                ; the right end known, the left a hole to walk to: "? middle B"
  jcall is_ready
  jjz j3, wo_left
  jld j2, j1, CL
  jcall is_open
  jjz j3, wo_left
  jst j1, j1, SIDE
  jld j2, j1, CR
  jst j2, j1, SRC
  jld j2, j1, CL
  jst j2, j1, DST
  jjmp walk_from
wo_left:
  jld j2, j1, CL                ; the left end known, the right a hole: "A middle ?"
  jcall is_ready
  jjz j3, wo_none
  jld j2, j1, CR
  jcall is_open
  jjz j3, wo_none
  jldi j2, 1
  jst j2, j1, SIDE
  jld j2, j1, CL
  jst j2, j1, SRC
  jld j2, j1, CR
  jst j2, j1, DST
  jjmp walk_from
wo_none:
  jret

; j3 = 1 if the end j2 is known: a word, or a hole walked to with answers. Uses j1, j3, j4.
is_ready:
  jldi j1, 0
  jldi j3, 1
  jldi j4, 63
  jsar j4, j2, j4
  jjz j4, ir_done
  jldi j4, 0
  jsub j4, j4, j2
  jldi j3, 1
  jsub j4, j4, j3
  jldi j3, 3
  jshl j4, j4, j3
  jld j3, j4, HDONE
  jjz j3, ir_done
  jld j3, j4, HCNT
  jjz j3, ir_done
  jldi j3, 1
ir_done:
  jret

; j3 = 1 if the end j2 is a hole not walked to yet. Uses j1, j3, j4.
is_open:
  jldi j1, 0
  jldi j3, 0
  jldi j4, 63
  jsar j4, j2, j4
  jjz j4, io_done
  jldi j4, 0
  jsub j4, j4, j2
  jldi j3, 1
  jsub j4, j4, j3
  jldi j3, 3
  jshl j4, j4, j3
  jld j3, j4, HDONE
  jldi j4, 1
  jxor j3, j3, j4
io_done:
  jret

; Walk from SRC (a word, or a hole and each of its answers) through the request CI to the hole DST. Uses j1-j14.
walk_from:
  jldi j1, 0
  jld j2, j1, DST               ; the hole walked to (whatever it finds)
  jldi j3, 0
  jsub j2, j3, j2
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, LASTH
  jldi j3, 3
  jshl j3, j2, j3
  jldi j4, 1
  jst j4, j3, HDONE
  jst j4, j1, CHG
  jst j1, j1, SK
  jld j2, j1, SRC
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, wf_hole
  jst j2, j1, SV                ; a word: one value, from no hole
  jst j1, j1, SVB
  jcall wf_ask
  jret
wf_hole:
  jldi j1, 0
  jld j2, j1, SRC
  jldi j3, 0
  jsub j2, j3, j2
  jldi j3, 1
  jsub j2, j2, j3
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j3, HCNT
  jld j5, j1, SK
  jsub j4, j5, j4
  jjz j4, wf_done
  jld j4, j1, NV                ; its answer SK
  jmul j4, j2, j4
  jadd j4, j4, j5
  jldi j5, 40
  jmul j4, j4, j5
  jld j5, j1, ROOMK
  jadd j4, j4, j5
  jld j5, j4, 32                ; the bits its way already says
  jst j5, j1, SVB
  jld j4, j4, 0
  jst j4, j1, SV
  jcall wf_ask
  jldi j1, 0
  jld j2, j1, SK
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, SK
  jjmp wf_hole
wf_done:
  jret

; The facts for the value SV on the side SIDE of the request CI: every word that fills them is an answer of DST.
; First as the question says it; then by its pieces: each switch put in each place of a middle shorter than three
; ("padre de" heard as "fue padre de"), and each door with the question's middle on one side (its other middle in its
; place, on the other side if it turns). What is answered first keeps its way. Uses j1-j14.
wf_ask:
  jldi j1, 0
  jst j1, j1, VIA
  jld j2, j1, SIDE
  jst j2, j1, SIDEQ
  jld j10, j1, CM               ; the middle: QBP + 8 * (CM - 1), as the row's facts are read (j10 + 8)
  jldi j2, 1
  jsub j10, j10, j2
  jldi j2, 3
  jshl j10, j10, j2
  jld j2, j1, QBP
  jadd j10, j10, j2
  jld j11, j1, CMN
  jcall wf_look
  jldi j1, 0
  jld j9, j1, ROOMP
  jld j12, j1, NPC
  jwhile j12
    jldi j1, 0
    jld j2, j9, 0
    jldi j3, 1
    jsub j3, j2, j3
    jjnz j3, wa_door
    jld j2, j9, 24              ; a switch that turns is never taken out
    jjnz j2, wa_next
    jld j2, j1, CMN             ; a switch
    jldi j3, 3
    jsub j3, j2, j3
    jjz j3, wa_next
    jld j2, j9, 8
    jldi j3, 1
    jldi j4, 56
    jshl j3, j3, j4
    jor j3, j3, j2
    jst j3, j1, VIA
    jld j2, j1, SIDE
    jst j2, j1, SIDEQ
    jst j1, j1, MPOS
    jld j2, j1, CMN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, MLEFT
    jwhile j2
      jcall m_insert
      jldi j10, MBUF - 8
      jld j11, j1, CMN
      jldi j2, 1
      jadd j11, j11, j2
      jcall wf_look
      jldi j1, 0
      jld j2, j1, MPOS
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, MPOS
      jld j2, j1, MLEFT
      jsub j2, j2, j3
      jst j2, j1, MLEFT
    jwend
    jjmp wa_next
  wa_door:
    jld j2, j1, CMN             ; a door: the question's middle, two words, as a door's filling
    jldi j3, 2
    jsub j3, j2, j3
    jjnz j3, wa_next
    jld j2, j1, CM
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j4, j2, 0
    jld j5, j2, 8
    jldi j3, 24
    jshl j5, j5, j3
    jor j4, j4, j5
    jld j2, j9, 8
    jld j3, j9, 16
    jsub j5, j2, j4
    jjnz j5, wd_high
    jadd j6, j3, j1
    jjmp wd_go
  wd_high:
    jsub j5, j3, j4
    jjnz j5, wa_next
    jadd j6, j2, j1
  wd_go:
    jldi j2, 0                  ; its other middle
    jshi j2, 0FFh
    jshi j2, 0FFFFh
    jand j3, j6, j2
    jst j3, j1, MBUF
    jldi j3, 24
    jshr j3, j6, j3
    jand j3, j3, j2
    jst j3, j1, MBUF + 8
    jld j4, j9, 24
    jldi j3, 48
    jshl j5, j4, j3
    jor j5, j5, j6
    jldi j3, 2
    jldi j7, 56
    jshl j3, j3, j7
    jor j5, j5, j3
    jst j5, j1, VIA
    jld j2, j1, SIDE
    jxor j2, j2, j4
    jst j2, j1, SIDEQ
    jldi j10, MBUF - 8
    jldi j11, 2
    jcall wf_look
  wa_next:
    jldi j1, 0
    jldi j2, 32
    jadd j9, j9, j2
    jldi j2, 1
    jsub j12, j12, j2
  jwend
  jret

; MBUF: the question's middle with the switch at j9 put at MPOS. Uses j1-j8.
m_insert:
  jldi j1, 0
  jld j2, j1, CM
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, QBP
  jadd j2, j2, j3
  jldi j3, MBUF
  jldi j5, 0
  jld j6, j1, CMN
  jldi j4, 1
  jadd j6, j6, j4
  jwhile j6
    jld j7, j1, MPOS
    jsub j7, j5, j7
    jjnz j7, mi_copy
    jld j7, j9, 8
    jjmp mi_put
  mi_copy:
    jld j7, j2, 0
    jldi j8, 8
    jadd j2, j2, j8
  mi_put:
    jst j7, j3, 0
    jldi j8, 8
    jadd j3, j3, j8
    jldi j8, 1
    jadd j5, j5, j8
    jsub j6, j6, j8
  jwend
  jret

; The facts for the value SV on the side SIDEQ, the middle j11 units from j10 + 8, by the piece VIA: every word that
; fills them is an answer of DST. Uses j1-j8.
wf_look:
  jldi j1, 0
  jld j3, j1, SV
  jld j2, j1, SIDEQ
  jjz j2, wl_right
  jcall key_left
  jjmp wl_key
wl_right:
  jcall key_right
wl_key:
  jst j5, j1, KEYQ
  jcall x_slot
  jst j6, j1, XS0
  jst j1, j1, CKEY              ; first: how often the request was said, all its fillings together
  jldi j8, 1
  jwhile j8
    jldi j3, 24
    jmul j3, j6, j3
    jld j4, j1, ROOMX
    jadd j3, j3, j4
    jld j4, j3, 0
    jjz j4, wl_counted
    jld j5, j1, KEYQ
    jsub j4, j4, j5
    jjnz j4, wl_cnext
    jld j4, j3, 16
    jld j5, j1, CKEY
    jadd j5, j5, j4
    jst j5, j1, CKEY
  wl_cnext:
    jldi j7, 1
    jadd j6, j6, j7
    jld j7, j1, XMASK
    jand j6, j6, j7
    jldi j8, 1
  jwend
wl_counted:
  jld j2, j1, CKEY
  jjz j2, wl_done
  jcall lg16
  jst j2, j1, LCK
  jld j6, j1, XS0
  jldi j8, 1
  jwhile j8
    jldi j3, 24
    jmul j3, j6, j3
    jld j4, j1, ROOMX
    jadd j3, j3, j4
    jld j4, j3, 0
    jjz j4, wl_done
    jld j5, j1, KEYQ
    jsub j4, j4, j5
    jjnz j4, wl_next
    jst j6, j1, AT2             ; the bits of this step: what the filling says here beyond what it says anywhere,
    jld j2, j3, 16              ; log2((said so / the request said) / (the filling / the book)); a piece pays its name
    jcall lg16
    jld j3, j1, LGT
    jadd j2, j2, j3
    jld j3, j1, LCK
    jsub j2, j2, j3
    jld j3, j1, SVB
    jadd j2, j2, j3
    jst j2, j1, KB
    jld j6, j1, AT2
    jldi j3, 24
    jmul j3, j6, j3
    jld j4, j1, ROOMX
    jadd j3, j3, j4
    jld j2, j3, 8
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ROOMF2
    jadd j3, j3, j4
    jld j2, j3, 0
    jcall lg16
    jld j3, j1, KB
    jsub j3, j3, j2
    jld j4, j1, VIA
    jjz j4, wl_free
    jld j4, j1, PCOST
    jsub j3, j3, j4
  wl_free:
    jst j3, j1, KB
    jld j6, j1, AT2
    jldi j3, 24
    jmul j3, j6, j3
    jld j4, j1, ROOMX
    jadd j3, j3, j4
    jld j2, j3, 8
    jcall k_add
    jldi j1, 0
    jld j6, j1, AT2
  wl_next:
    jldi j7, 1
    jadd j6, j6, j7
    jld j7, j1, XMASK
    jand j6, j6, j7
    jldi j8, 1
  jwend
wl_done:
  jret

; The word j2 is an answer of the hole DST, come from SV of SRC (once). Uses j1-j7.
k_add:
  jldi j1, 0
  jld j3, j1, DST
  jldi j4, 0
  jsub j3, j4, j3
  jldi j4, 1
  jsub j3, j3, j4               ; the hole
  jld j4, j1, NV
  jmul j4, j3, j4
  jldi j5, 40
  jmul j4, j4, j5
  jld j5, j1, ROOMK
  jadd j4, j4, j5               ; its answers
  jldi j5, 3
  jshl j5, j3, j5
  jld j6, j5, HCNT
  jwhile j6
    jld j7, j4, 0
    jsub j7, j7, j2
    jjz j7, ka_seen
    jldi j7, 40
    jadd j4, j4, j7
    jldi j7, 1
    jsub j6, j6, j7
  jwend
  jst j2, j4, 0
  jld j6, j5, HCNT
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j5, HCNT
ka_way:
  jld j7, j1, SV
  jst j7, j4, 8
  jld j7, j1, SRC
  jst j7, j4, 16
  jld j7, j1, VIA
  jst j7, j4, 24
  jld j7, j1, KB
  jst j7, j4, 32
  jret
ka_seen:                        ; reached again: the way that says more bits stays
  jld j7, j4, 32
  jld j6, j1, KB
  jsub j7, j7, j6
  jldi j6, 63
  jsar j7, j7, j6
  jjnz j7, ka_way
  jret

; The answer AI of the hole LASTH: every hole filled by its way back, the melody written filled in, and whether the
; book says it so. Uses j1-j14.
write_one:
  jldi j1, 0                    ; no hole filled yet
  jld j9, j1, NH
  jldi j10, 0
  jwhile j9
    jldi j2, 3
    jshl j2, j10, j2
    jst j1, j2, ASGN
    jst j1, j2, VIAS
    jldi j2, 1
    jadd j10, j10, j2
    jsub j9, j9, j2
  jwend
  jld j9, j1, LASTH             ; its answer AI, and back along its way
  jld j10, j1, AI
  wr_back:
    jld j4, j1, NV
    jmul j4, j9, j4
    jadd j4, j4, j10
    jldi j5, 40
    jmul j4, j4, j5
    jld j5, j1, ROOMK
    jadd j4, j4, j5
    jld j2, j4, 0
    jldi j3, 3
    jshl j3, j9, j3
    jst j2, j3, ASGN
    jld j5, j4, 24
    jst j5, j3, VIAS
    jadd j12, j2, j1
    jcall mix
    jldi j1, 0
    jld j2, j4, 16              ; from a hole?
    jldi j3, 63
    jsar j3, j2, j3
    jjz j3, wr_filled
    jld j11, j4, 8              ; the value it came from: find it among that hole's answers
    jldi j3, 0
    jsub j9, j3, j2
    jldi j3, 1
    jsub j9, j9, j3
    jldi j3, 3
    jshl j3, j9, j3
    jld j5, j3, HCNT
    jldi j10, 0
    jld j4, j1, NV
    jmul j4, j9, j4
    jldi j6, 40
    jmul j4, j4, j6
    jld j6, j1, ROOMK
    jadd j4, j4, j6
    wr_find:
      jjz j5, wr_filled
      jld j6, j4, 0
      jsub j6, j6, j11
      jjz j6, wr_back
      jldi j6, 40
      jadd j4, j4, j6
      jldi j6, 1
      jadd j10, j10, j6
      jsub j5, j5, j6
      jjmp wr_find
wr_filled:
  jldi j1, S_ARROW
  jcall puts
  jld j2, j1, QS
  jld j3, j1, QE
  jcall put_units
  jcall said_so                 ; said like that, or inferred
  jldi j1, S_SAID
  jjnz j2, wr_say
  jldi j1, S_INFER
wr_say:
  jcall puts
  jldi j1, 0                    ; the pieces its way used
  jld j9, j1, NH
  jldi j10, 0
  jwhile j9
    jldi j1, 0
    jldi j2, 3
    jshl j2, j10, j2
    jld j11, j2, VIAS
    jjz j11, wv_next
    jldi j1, S_WITH
    jcall puts
    jldi j2, 56
    jshr j2, j11, j2
    jldi j3, 1
    jsub j2, j2, j3
    jjnz j2, wv_door
    jld j2, j1, M48             ; a switch: its word, taken out
    jand j2, j11, j2
    jcall putword
    jldi j1, S_OUT
    jcall puts
    jjmp wv_next
  wv_door:
    jld j2, j1, M48             ; a door: the other middle, turned or in place
    jand j2, j11, j2
    jcall putpair
    jldi j1, S_TURNED
    jldi j2, 48
    jshr j2, j11, j2
    jldi j3, 1
    jand j2, j2, j3
    jjnz j2, wv_say
    jldi j1, S_PLACE
  wv_say:
    jcall puts
  wv_next:
    jldi j2, 1
    jadd j10, j10, j2
    jsub j9, j9, j2
  jwend
  jldi j1, S_KBITS              ; and the bits its way says
  jcall puts
  jld j2, j1, KB
  jcall putq16
  jldi j1, S_KBITS2
  jcall puts
  jldi j2, 10
  jjmp putch

; The units from j2 to j3 of QBUF written, a hole by its word in ASGN (or "?"). Uses j1-j11.
put_units:
  jldi j1, 0
  jadd j9, j2, j1
  jadd j10, j3, j1
  jldi j11, 0                   ; holes passed
  jsub j10, j10, j9
  jwhile j10
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 1
    jadd j3, j2, j3
    jjnz j3, pu_word
    jldi j3, 3
    jshl j3, j11, j3
    jld j2, j3, ASGN
    jldi j3, 1
    jadd j11, j11, j3
    jjnz j2, pu_word
    jldi j2, 63
    jcall putch
    jjmp pu_space
  pu_word:
    jldi j3, 2                  ; a word the book never had: "*"
    jadd j3, j2, j3
    jjnz j3, pu_known
    jldi j2, 42
    jcall putch
    jjmp pu_space
  pu_known:
    jcall putword
  pu_space:
    jldi j1, 0
    jldi j2, 1
    jsub j10, j10, j2
    jjz j10, pu_last
    jldi j2, 32
    jcall putch
  pu_last:
    jldi j1, 0
    jldi j2, 1
    jadd j9, j9, j2
  jwend
  jret

; j2 = 1 if the question filled by ASGN is in the book word for word (every hole filled). Uses j1-j12.
said_so:
  jldi j1, 0
  jld j9, j1, NH
  jldi j10, 0
  jwhile j9
    jldi j2, 3
    jshl j2, j10, j2
    jld j2, j2, ASGN
    jjz j2, ss_no
    jldi j2, 1
    jadd j10, j10, j2
    jsub j9, j9, j2
  jwend
  jld j9, j1, NTOK              ; every place of the row
  jld j2, j1, QE
  jld j3, j1, QS
  jsub j11, j2, j3              ; its length
  jsub j9, j9, j11
  jldi j12, 0
  jwhile j9
    jldi j1, 0
    jldi j2, 3
    jshl j2, j12, j2
    jld j3, j1, ROOMT
    jadd j8, j2, j3             ; the row from j12
    jld j7, j1, QS
    jldi j6, 0                  ; holes passed
    jadd j5, j11, j1
    jwhile j5
      jldi j2, 3
      jshl j2, j7, j2
      jst j3, j1, QBT
      jld j3, j1, QBP
      jadd j2, j2, j3
      jld j2, j2, 0
      jld j3, j1, QBT
      jldi j3, 1
      jadd j3, j2, j3
      jjnz j3, ss_word
      jldi j3, 3
      jshl j3, j6, j3
      jld j2, j3, ASGN
      jldi j3, 1
      jadd j6, j6, j3
    ss_word:
      jld j3, j8, 0
      jsub j3, j3, j2
      jjnz j3, ss_next
      jldi j3, 8
      jadd j8, j8, j3
      jldi j3, 1
      jadd j7, j7, j3
      jsub j5, j5, j3
    jwend
    jldi j2, 1
    jret
  ss_next:
    jldi j2, 1
    jadd j12, j12, j2
    jsub j9, j9, j2
  jwend
ss_no:
  jldi j2, 0
  jret

include 'lectura.inc'
