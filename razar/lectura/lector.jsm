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
; Its parameters are the file "p": K (one qword; 10 if there is none). Every answer of the two ways that look at the
; place goes into j0. It writes how it went in three lines.
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

QUEUE = 1000h                   ; its window: one request
PK    = 1040h                   ; one renglon in PK goes to the test
HAND  = 1048h                   ; the handle of the book
PASS  = 1050h                   ; 0: counting; 1: numbering
NBYTES = 1058h                  ; the book's bytes
LEFT  = 1060h                   ; bytes of the piece read still to look at, and where the next is
AT    = 1068h
GOT   = 1070h                   ; bytes the last read gave
WLEN  = 1078h                   ; the word being read: its bytes so far (at WBUF)
LEAD  = 1080h                   ; 1: the last byte opened a letter of U+00C0..U+00FF
LASTL = 1088h                   ; 1: the last unit was a renglon
BYTE  = 1090h
NUNITS = 1098h                  ; counting: words and renglones, the first renglon included
NLINES = 10A0h                  ; renglones
NTOK  = 10A8h                   ; units in the row so far
NV    = 10B0h                   ; numbers given (the renglon is 0)
VMASK = 10B8h                   ; places of each hash table, minus 1
ROOMT = 10C0h                   ; the row: unit i at ROOMT + 8i
ROOMA = 10C8h                   ; the words' letters, one after another
ARPOS = 10D0h
ROOMV = 10D8h                   ; the words: {hash, where its letters are, how many, its number} per place
ROOMC = 10E0h                   ; how often each word was read, by number
ROOMB = 10E8h                   ; the pairs: {p * NV + x + 1, how often} per place
ROOMS = 10F0h                   ; the words after p: SLIST from ROOMS[p] to ROOMS[p + 1]
ROOMU = 10F8h
ROOML = 1100h                   ; {x, how often} each
NB    = 1108h                   ; pairs seen
FNVO  = 1110h                   ; FNV-1a: offset and prime
FNVP  = 1118h
GOLD  = 1120h                   ; 2^64 / the golden ratio: spreads a pair over its table
M48   = 1128h                   ; 2^48 - 1
ECOW  = 1130h                   ; the word read most often
TESTS = 1138h                   ; covered words, and how many of them it never read
OOV   = 1140h
EHIT  = 1148h                   ; right, by way, and silent
LHIT  = 1150h
LSIL  = 1158h
BHIT  = 1160h
BSIL  = 1168h
POS   = 1170h                   ; how long the text it writes is so far
LINE  = 1178h                   ; the renglon being walked
JJ    = 1180h                   ; the unit being walked, and how many are left
JLEFT = 1188h
CP    = 1190h                   ; the word before, the covered one, the word after
CW    = 1198h
CN    = 11A0h
LBEST = 11A8h                   ; izquierda: its word and how often
LBC   = 11B0h
BBEST = 11B8h                   ; dos lados: its word and its score BNUM / BDEN
BNUM  = 11C0h
BDEN  = 11C8h
GAT   = 11D0h                   ; the list being walked
GLEFT = 11D8h
GX    = 11E0h
GC1   = 11E8h
TEXT  = 2000h                   ; the lines it writes
WBUF  = 3000h                   ; (255 bytes)
DIG   = 3200h                   ; digits of a number being written
BUF   = 8000h                   ; a piece of the book
BUFLEN = 8000h
include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j1, 0                      ; constants
jldi j2, 0
jshi j2, 0FFFFh
jshi j2, 0FFFFh
jshi j2, 0FFFFh
jst j2, j1, M48
jldi j2, 0
jshi j2, 0CBF2h
jshi j2, 9CE4h
jshi j2, 8422h
jshi j2, 2325h
jst j2, j1, FNVO
jldi j2, 0
jshi j2, 100h
jshi j2, 0
jshi j2, 1B3h
jst j2, j1, FNVP
jldi j2, 0
jshi j2, 9E37h
jshi j2, 79B9h
jshi j2, 7F4Ah
jshi j2, 7C15h
jst j2, j1, GOLD
jldi j0, 0                      ; the fingerprint

jldi j10, 4                     ; its parameters: open "p" (request 4) and read K (request 5)
jldi j11, S_P
jldi j12, 1
jcall ask
jldi j1, 0
jldi j2, 10                     ; one renglon in ten for the test, if it is not told: criterion, not measurement
jst j2, j1, PK
jldi j2, 1
jadd j2, j13, j2
jjz j2, pr_done
jldi j2, 32
jshl j10, j13, j2
jldi j2, 5
jor j10, j10, j2
jldi j11, PK
jldi j12, 8
jcall ask
jldi j1, 0
jld j2, j1, PK
jjnz j2, pr_done
jldi j2, 10
jst j2, j1, PK
pr_done:

jldi j1, 0                      ; first reading: it counts
jst j1, j1, PASS
jldi j2, 1
jst j2, j1, NUNITS
jcall scan

jldi j1, 0                      ; its rooms, to the book's size
jld j11, j1, NUNITS
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMT
jld j11, j1, NUNITS
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMC
jld j11, j1, NBYTES
jldi j2, 8
jadd j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMA
jld j2, j1, NUNITS              ; places: the least power of two with twice the units (no table holds more)
jadd j2, j2, j2
jldi j3, 1
jldi j4, 1
jwhile j4
  jsub j4, j3, j2
  jldi j5, 63
  jsar j4, j4, j5
  jand j5, j3, j4
  jadd j3, j3, j5
jwend
jldi j4, 1
jsub j4, j3, j4
jst j4, j1, VMASK
jldi j2, 5
jshl j11, j3, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMV
jld j11, j1, VMASK
jldi j2, 1
jadd j11, j11, j2
jldi j2, 4
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMB

jldi j1, 0                      ; second reading: the row of numbers (unit 0 is a renglon: the room starts in zeros)
jldi j2, 1
jst j2, j1, PASS
jst j2, j1, NV
jst j2, j1, NTOK
jst j1, j1, NLINES
jst j1, j1, ARPOS
jcall scan

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
  jcall bg_add
  jldi j1, 0
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
  jldi j2, 3
  jshl j2, j9, j2
  jld j3, j1, ROOMC
  jadd j2, j2, j3
  jld j2, j2, 0
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

jldi j1, 0                      ; the words after each word: a list per word, from the pairs
jld j2, j1, NV
jldi j3, 1
jadd j11, j2, j3
jldi j3, 3
jshl j11, j11, j3
jcall room
jldi j1, 0
jst j13, j1, ROOMS
jld j11, j1, NV
jldi j3, 3
jshl j11, j11, j3
jcall room
jldi j1, 0
jst j13, j1, ROOMU
jld j11, j1, NB
jldi j3, 1
jadd j11, j11, j3
jldi j3, 4
jshl j11, j11, j3
jcall room
jldi j1, 0
jst j13, j1, ROOML
jldi j9, 0                      ; how many after each p, at ROOMS[p + 1]
jld j8, j1, VMASK
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
jld j8, j1, VMASK
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
  jld j2, j1, TESTS
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, TESTS
  jld j2, j1, CW
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMC
  jadd j3, j3, j4
  jld j3, j3, 0
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
  jcall guess
  jldi j1, 0
  jld j12, j1, LBEST
  jcall mix
  jld j12, j1, BBEST
  jcall mix
  jldi j1, 0
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
jjmp finish

; Reads the book from its start, every byte through tok_byte, and ends its last word and renglon. Uses j1-j14.
scan:
  jldi j1, 0
  jst j1, j1, NBYTES
  jst j1, j1, WLEN
  jst j1, j1, LEAD
  jldi j2, 1
  jst j2, j1, LASTL
  jldi j10, 4
  jldi j11, S_LIBRO
  jldi j12, 5
  jcall ask
  jldi j1, 0
  jst j13, j1, HAND
  jldi j2, 1
  jadd j2, j13, j2
  jjnz j2, sc_open
  jldi j1, S_NOBOOK
  jcall puts
  jjmp finish
sc_open:
  jldi j2, 1
  jwhile j2
    jldi j1, 0
    jld j2, j1, HAND
    jldi j3, 32
    jshl j10, j2, j3
    jldi j3, 5
    jor j10, j10, j3
    jldi j11, 0
    jshi j11, BUF
    jldi j12, 0
    jshi j12, BUFLEN
    jcall ask
    jldi j1, 0                  ; (a failed read is the end)
    jldi j2, 63
    jsar j2, j13, j2
    jldi j3, -1
    jxor j2, j2, j3
    jand j13, j13, j2
    jst j13, j1, GOT
    jst j13, j1, LEFT
    jld j2, j1, NBYTES
    jadd j2, j2, j13
    jst j2, j1, NBYTES
    jldi j2, 0
    jshi j2, BUF
    jst j2, j1, AT
    jld j3, j1, LEFT
    jwhile j3
      jld j3, j1, AT
      jldb j2, j3, 0
      jldi j4, 1
      jadd j3, j3, j4
      jst j3, j1, AT
      jcall tok_byte
      jldi j1, 0
      jld j3, j1, LEFT
      jldi j4, 1
      jsub j3, j3, j4
      jst j3, j1, LEFT
    jwend
    jld j2, j1, GOT
  jwend
  jcall w_end
  jcall l_unit
  jldi j1, 0
  jld j2, j1, HAND
  jldi j3, 32
  jshl j10, j2, j3
  jldi j3, 7
  jor j10, j10, j3
  jcall ask
  jret

; One byte of the book (j2) into the word being read. Uses j1-j8, j10, j11.
tok_byte:
  jldi j1, 0
  jld j3, j1, LEAD
  jjz j3, tb_plain
  jst j1, j1, LEAD              ; the second byte of a letter of U+00C0..U+00FF
  jldi j5, 63
  jldi j4, 0C0h
  jsub j4, j2, j4
  jsar j4, j4, j5
  jjz j4, tb_bad
  jldi j4, 80h
  jsub j4, j2, j4
  jsar j4, j4, j5
  jjnz j4, tb_bad
  jldi j4, 9Fh                  ; 80h..9Eh: a capital, made small
  jsub j4, j2, j4
  jsar j4, j4, j5
  jldi j6, 20h
  jand j4, j4, j6
  jadd j2, j2, j4
  jst j2, j1, BYTE
  jldi j2, 0C3h
  jcall w_put
  jldi j1, 0
  jld j2, j1, BYTE
  jjmp w_put
tb_bad:                         ; not a letter's second byte: the word ends, and the byte is read on its own
  jst j2, j1, BYTE
  jcall w_end
  jldi j1, 0
  jld j2, j1, BYTE
tb_plain:
  jldi j3, 0C3h
  jsub j3, j2, j3
  jjnz j3, tb_ascii
  jldi j3, 1
  jst j3, j1, LEAD
  jret
tb_ascii:
  jldi j5, 63
  jldi j3, 41h
  jsub j3, j2, j3
  jsar j4, j3, j5
  jjnz j4, tb_other
  jldi j4, 26
  jsub j4, j3, j4
  jsar j4, j4, j5
  jjz j4, tb_small
  jldi j3, 20h
  jadd j2, j2, j3
  jjmp w_put
tb_small:
  jldi j3, 61h
  jsub j3, j2, j3
  jsar j4, j3, j5
  jjnz j4, tb_other
  jldi j4, 26
  jsub j4, j3, j4
  jsar j4, j4, j5
  jjz j4, tb_other
  jjmp w_put
tb_other:
  jldi j3, 10
  jsub j3, j2, j3
  jjnz j3, w_end
  jcall w_end
  jjmp l_unit

; The letter byte j2 at the end of the word being read (past 255 bytes they are not kept). Uses j1, j3, j4.
w_put:
  jldi j1, 0
  jld j3, j1, WLEN
  jldi j4, 255
  jsub j4, j3, j4
  jjz j4, wp_full
  jstb j2, j3, WBUF
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, WLEN
wp_full:
  jret

; The word being read ends (if there is one): counted, or its number to the row. Uses j1-j8, j10, j11.
w_end:
  jldi j1, 0
  jld j3, j1, WLEN
  jjz j3, we_none
  jst j1, j1, LASTL
  jld j3, j1, PASS
  jjz j3, we_count
  jcall word_id
  jcall t_put
  jjmp we_clear
we_count:
  jld j3, j1, NUNITS
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, NUNITS
we_clear:
  jldi j1, 0
  jst j1, j1, WLEN
we_none:
  jret

; The renglon ends (two in a row are one). Uses j1-j5.
l_unit:
  jldi j1, 0
  jld j3, j1, LASTL
  jjnz j3, lu_none
  jldi j3, 1
  jst j3, j1, LASTL
  jld j3, j1, NLINES
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, NLINES
  jld j3, j1, PASS
  jjz j3, lu_count
  jldi j2, 0
  jjmp t_put
lu_count:
  jld j3, j1, NUNITS
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, NUNITS
lu_none:
  jret

; The number j2 at the end of the row. Uses j1-j5.
t_put:
  jldi j1, 0
  jld j3, j1, NTOK
  jldi j4, 3
  jshl j4, j3, j4
  jld j5, j1, ROOMT
  jadd j4, j4, j5
  jst j2, j4, 0
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, NTOK
  jret

; The number of the word at WBUF (WLEN bytes) -> j2; a word never seen gets the next. Uses j1-j8, j10, j11.
word_id:
  jldi j1, 0
  jld j2, j1, FNVO
  jld j3, j1, FNVP
  jld j4, j1, WLEN
  jldi j5, 0
  jwhile j4
    jldb j6, j5, WBUF
    jxor j2, j2, j6
    jmul j2, j2, j3
    jldi j6, 1
    jadd j5, j5, j6
    jsub j4, j4, j6
  jwend
  jldi j3, 32
  jshr j3, j2, j3
  jxor j3, j3, j2
  jld j4, j1, VMASK
  jand j3, j3, j4
  jldi j8, 1
  jwhile j8
    jldi j4, 5
    jshl j4, j3, j4
    jld j5, j1, ROOMV
    jadd j4, j4, j5
    jld j5, j4, 16
    jjz j5, wi_new
    jld j6, j4, 0
    jsub j6, j6, j2
    jjnz j6, wi_next
    jld j6, j1, WLEN
    jsub j6, j5, j6
    jjnz j6, wi_next
    jld j6, j4, 8
    jld j7, j1, ROOMA
    jadd j6, j6, j7
    jldi j7, 0
    jwhile j5
      jldb j10, j6, 0
      jldb j11, j7, WBUF
      jsub j10, j10, j11
      jjnz j10, wi_next
      jldi j10, 1
      jadd j6, j6, j10
      jadd j7, j7, j10
      jsub j5, j5, j10
    jwend
    jld j2, j4, 24
    jret
  wi_next:
    jldi j5, 1
    jadd j3, j3, j5
    jld j5, j1, VMASK
    jand j3, j3, j5
  jwend
wi_new:
  jst j2, j4, 0
  jld j5, j1, WLEN
  jst j5, j4, 16
  jld j6, j1, ARPOS
  jst j6, j4, 8
  jld j7, j1, ROOMA
  jadd j6, j6, j7
  jldi j7, 0
  jwhile j5
    jldb j10, j7, WBUF
    jstb j10, j6, 0
    jldi j10, 1
    jadd j6, j6, j10
    jadd j7, j7, j10
    jsub j5, j5, j10
  jwend
  jld j6, j1, ARPOS
  jld j5, j1, WLEN
  jadd j6, j6, j5
  jst j6, j1, ARPOS
  jld j2, j1, NV
  jst j2, j4, 24
  jldi j5, 1
  jadd j5, j2, j5
  jst j5, j1, NV
  jret

; j2 = nonzero if the renglon LINE is one it learns from. Uses j1-j5.
is_train:
  jldi j1, 0
  jld j2, j1, LINE
  jld j3, j1, PK
  jdiv j4, j2, j3
  jmul j4, j4, j3
  jsub j4, j2, j4
  jldi j5, 1
  jadd j4, j4, j5
  jsub j2, j4, j3
  jret

; The place of the pair (j2 = p, j3 = x) -> j4, its key -> j5 (the place is empty if it was never seen). Uses j1-j8.
bg_slot:
  jldi j1, 0
  jld j6, j1, NV
  jmul j5, j2, j6
  jadd j5, j5, j3
  jldi j6, 1
  jadd j5, j5, j6
  jld j6, j1, GOLD
  jmul j6, j5, j6
  jldi j7, 32
  jshr j6, j6, j7
  jld j7, j1, VMASK
  jand j6, j6, j7
  jldi j8, 1
  jwhile j8
    jldi j7, 4
    jshl j4, j6, j7
    jld j7, j1, ROOMB
    jadd j4, j4, j7
    jld j7, j4, 0
    jsub j8, j7, j5
    jjnz j7, bs_full
    jldi j8, 0
  bs_full:
    jldi j7, 1
    jadd j6, j6, j7
    jld j7, j1, VMASK
    jand j6, j6, j7
  jwend
  jret

; The pair (j2 = p, j3 = x) seen once more. Uses j1-j8.
bg_add:
  jcall bg_slot
  jld j6, j4, 0
  jjnz j6, ba_old
  jst j5, j4, 0
  jld j6, j1, NB
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j1, NB
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
    jldi j3, 3
    jshl j3, j2, j3
    jld j7, j1, ROOMC
    jadd j3, j3, j7
    jld j7, j3, 0
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

; A new room of j11 bytes (request 2) -> j13 its address; without one, it says so and ends. Uses j1, j10-j14.
room:
  jldi j10, 2
  jldi j12, 0
  jcall ask
  jldi j1, 1
  jadd j1, j13, j1
  jjz j1, rm_none
  jret
rm_none:
  jldi j1, S_NOMEM
  jcall puts
finish:
  jldi j10, 1
  jldi j11, TEXT
  jldi j1, 0
  jld j12, j1, POS
  jcall ask
  jhalt

; j2 right of TESTS, and " (x,y%)". Uses j1-j6.
puthits:
  jldi j1, 0
  jst j2, j1, GX
  jcall putnum
  jldi j2, 32
  jcall putch
  jldi j2, 40
  jcall putch
  jldi j1, 0
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
  jcall putch
  jldi j1, 0
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

; The text at j1 (ended by a 0) at TEXT + POS. Uses j1-j3 (j1 = 0 after).
puts:
  jldi j3, 0
  jld j2, j3, POS
pu_lap:
  jldb j3, j1, 0
  jjz j3, pu_done
  jstb j3, j2, TEXT
  jldi j3, 1
  jadd j1, j1, j3
  jadd j2, j2, j3
  jjmp pu_lap
pu_done:
  jldi j1, 0
  jst j2, j1, POS
  jret

; The character j2 at TEXT + POS. Uses j1, j3.
putch:
  jldi j1, 0
  jld j3, j1, POS
  jstb j2, j3, TEXT
  jldi j1, 1
  jadd j3, j3, j1
  jldi j1, 0
  jst j3, j1, POS
  jret

; j2 (0 or more) in decimal at TEXT + POS. Uses j1-j4 (j1 = 0 after).
putnum:
  jldi j3, 0
pn_digit:
  jldi j1, 10
  jdiv j4, j2, j1
  jmul j1, j4, j1
  jsub j1, j2, j1
  jldi j2, 30h
  jadd j1, j1, j2
  jstb j1, j3, DIG
  jldi j1, 1
  jadd j3, j3, j1
  jadd j2, j4, j0
  jsub j2, j2, j0
  jjnz j2, pn_digit
  jldi j1, 0
  jld j4, j1, POS
pn_put:
  jldi j1, 1
  jsub j3, j3, j1
  jldb j2, j3, DIG
  jstb j2, j4, TEXT
  jadd j4, j4, j1
  jjnz j3, pn_put
  jldi j1, 0
  jst j4, j1, POS
  jret

; One request through the window: kind j10, a = j11, b = j12 -> j13 = its answer. Uses j14.
ask:
  jldi j14, 1
  jldi j13, 0
  jst j14, j13, QUEUE
  jst j10, j13, QUEUE + 8
  jst j11, j13, QUEUE + 16
  jst j12, j13, QUEUE + 24
  jldi j14, QUEUE
  jsys j14, j14
  jldi j13, 0
  jld j13, j13, QUEUE + 32
  jret

; j0 = (j0 * 31 + j12) mod 2^48. Uses j13, j14.
mix:
  jldi j13, 31
  jmul j0, j0, j13
  jadd j0, j0, j12
  jldi j13, 0
  jld j14, j13, M48
  jand j0, j0, j14
  jret
