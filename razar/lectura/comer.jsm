; Razar eats a book that lives anywhere on the host (Capitan, 2026-11-07: "I do not want it to remember; I want it to
; keep the clue of where it read it and look for it to answer me, more like our mind").
;
; The file "come" holds the book's address on the host. Razar reads the book there (request 37, read only) and keeps
; nothing of what it says: only its clues, in its nest "pistas" + the print of the address (FNV-1a, sixteen hex
; digits: the same book eaten again falls in the same nest, and listing the nests finds every book). A nest is
; qwords: {2, the book's bytes, how many renglon marks, how many subjects, how many clues, the address's bytes, the
; bytes of a clue, the book's units, how many words of the foundation}, the address (padded to 8), where each renglon
; starts (renglon k is from mark k to mark k + 1, the last mark the end), each subject in order of first sight: {its
; bytes, its letters padded to 8, how many times it is in the book, in how many renglones it is, those renglones (each
; in the bytes of a clue, little end first; padded to 8)}, and then each word of the foundation: {its bytes, its
; letters, how many times}. The counts are no facts: they let the judge weigh a word by the whole book while it reads
; again only a part. A clue takes the
; bytes this book needs to name its last renglon (Capitan: "what is needed is used"): one up to 256 renglones, two for
; the New Testament's 7976. Only the subjects keep clues (Capitan: "the system deduces the subjects and keeps the
; subjects", not by capital letters): whatever the house did not decide is foundation (the furniture, and what it
; never judged), and no mark. The foundation ("de", "que", the commas) comes back when the renglon is read again.
; Asking follows the clues: it goes to those bytes (38) and reads only them again.
S_LIBRO = 0
S_P     = 10h
S_COME  = 18h
S_NOBOOK = 40h
S_NOMEM = 80h
S_ATE   = 0C0h
S_REN   = 100h
S_WORDS = 140h
S_CLUES = 180h
S_BYTES = 1C0h
S_NOCOME = 200h
S_OF    = 240h
S_TURN  = 280h                  ; (texts of pulso.inc's reports, never written here)
S_FLIPS = 2C0h

PLEN  = 1600h                   ; the address's bytes, at PATHB
HND    = 1608h                   ; a handle
CNTW  = 1610h                   ; by number of word: in how many renglones it is (then where its next clue goes), and
LASTW = 1618h                   ; the last renglon it was seen in (plus one)
OUTR  = 1620h                   ; the nest being written, its bytes, how many clues, the renglon being walked (plus one)
OSZ   = 1628h
NPOST = 1630h
RK    = 1638h
PHASH = 1640h                   ; the print of the address
CW    = 1648h                   ; the bytes of a clue
KEEP  = 1650h                   ; by number of word: 1 if it is a subject (its clues are kept), and how many are
NK    = 1658h
OCC   = 1660h                   ; by number of word: how many times it is in the book
PATHB = 6000h                   ; the address (511 bytes at most)
PLAB  = 6400h                   ; the nest's label: "pistas" and sixteen hex digits
PLABN = 22
include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j1, 0                      ; what to eat: the address in "come"
jldi j10, 4
jldi j11, S_COME
jldi j12, 4
jcall ask
jldi j1, 0
jldi j2, 63
jshr j2, j13, j2
jjnz j2, no_come
jst j13, j1, HND
jldi j2, 32
jshl j10, j13, j2
jldi j2, 5
jor j10, j10, j2
jldi j11, PATHB
jldi j12, 511
jcall ask
jldi j1, 0                      ; (a failed read is nothing)
jldi j2, 63
jsar j2, j13, j2
jldi j3, -1
jxor j2, j2, j3
jand j13, j13, j2
jst j13, j1, PLEN
jld j10, j1, HND
jldi j2, 32
jshl j10, j10, j2
jldi j2, 7
jor j10, j10, j2
jcall ask
jldi j1, 0                      ; (without the line feed, spaces or controls after it)
jld j3, j1, PLEN
cm_strip:
  jjz j3, cm_stripped
  jldi j4, PATHB - 1
  jadd j4, j4, j3
  jldb j5, j4, 0
  jldi j6, 33
  jsub j5, j5, j6
  jldi j6, 63
  jsar j5, j5, j6
  jjz j5, cm_stripped
  jldi j4, 1
  jsub j3, j3, j4
  jjmp cm_strip
cm_stripped:
jst j3, j1, PLEN
jjz j3, no_come

jldi j2, PATHB                  ; the book, there: read as always, keeping where each renglon starts
jst j2, j1, LABEL
jst j3, j1, LABLEN
jldi j2, 1
jst j2, j1, HOSTB
jcall read_book
jldi j1, 0                      ; the whole book, none kept apart: its pulses, and the house
jldi j2, 0
jshi j2, 4000h
jshi j2, 0
jshi j2, 0
jshi j2, 0
jst j2, j1, PK
jcall learn_pulses
jcall house_decide
jldi j1, 0                      ; the subjects: no foundation, no mark
jld j11, j1, NV
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, KEEP
jst j1, j1, NK
jld j10, j1, NV
jldi j9, 1
jsub j10, j10, j9
jwhile j10
  jldi j1, 0
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, ROOMSD
  jadd j4, j4, j3
  jld j4, j4, 0
  jsub j4, j1, j4
  jldi j5, 63
  jsar j4, j4, j5
  jjnz j4, ks_no
  jadd j2, j9, j1
  jcall w_mark
  jjnz j3, ks_no
  jldi j1, 0
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, KEEP
  jadd j4, j4, j3
  jldi j2, 1
  jst j2, j4, 0
  jld j2, j1, NK
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, NK
ks_no:
  jldi j1, 0
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend

jldi j1, 0                      ; the print of its address, and the nest's label
jld j2, j1, FNVO
jld j3, j1, PLEN
jldi j4, 0
jwhile j3
  jldi j5, PATHB
  jadd j5, j5, j4
  jldb j5, j5, 0
  jxor j2, j2, j5
  jld j6, j1, FNVP
  jmul j2, j2, j6
  jldi j5, 1
  jadd j4, j4, j5
  jsub j3, j3, j5
jwend
jst j2, j1, PHASH
jldi j3, PLAB
jldi j2, 112
jstb j2, j3, 0
jldi j2, 105
jstb j2, j3, 1
jldi j2, 115
jstb j2, j3, 2
jldi j2, 116
jstb j2, j3, 3
jldi j2, 97
jstb j2, j3, 4
jldi j2, 115
jstb j2, j3, 5
jld j5, j1, PHASH
jldi j3, PLAB + PLABN - 1
jldi j4, 16
jwhile j4
  jldi j6, 15
  jand j6, j5, j6
  jldi j7, 10
  jsub j7, j6, j7
  jldi j8, 63
  jsar j7, j7, j8
  jldi j8, 48                   ; a digit, or a letter past nine
  jjnz j7, ph_digit
  jldi j8, 87
ph_digit:
  jadd j6, j6, j8
  jstb j6, j3, 0
  jldi j6, 4
  jshr j5, j5, j6
  jldi j6, 1
  jsub j3, j3, j6
  jsub j4, j4, j6
jwend

jldi j1, 0                      ; in how many renglones each word is
jld j11, j1, NV
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, CNTW
jld j11, j1, NV
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, LASTW
jst j1, j1, NPOST
jcall clue_walk
jldi j1, 0                      ; the bytes of a clue: enough to name its last renglon
jld j2, j1, ROFFN
jldi j3, 2
jsub j2, j2, j3
jldi j3, 1
jst j3, j1, CW
jldi j4, 8
jshr j2, j2, j4
cm_width:
  jjz j2, cm_wide
  jadd j3, j3, j1
  jldi j5, 1
  jadd j3, j3, j5
  jst j3, j1, CW
  jshr j2, j2, j4
  jjmp cm_width
cm_wide:

jldi j1, 0                      ; how many times each word is in the book (the judge weighs by the whole book)
jld j11, j1, NV
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, OCC
jld j9, j1, ROOMT
jld j10, j1, NTOK
jwhile j10
  jld j2, j9, 0
  jldi j3, 3
  jshl j2, j2, j3
  jadd j2, j2, j13
  jld j3, j2, 0
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j2, 0
  jldi j2, 8
  jadd j9, j9, j2
  jsub j10, j10, j4
jwend

jldi j1, 0                      ; the nest's size: its head, the address, the marks, every word (a subject with its
jld j11, j1, PLEN               ; clues)
jldi j2, 7
jadd j11, j11, j2
jldi j2, -8
jand j11, j11, j2
jldi j2, 72
jadd j11, j11, j2
jld j2, j1, ROFFN
jldi j3, 3
jshl j2, j2, j3
jadd j11, j11, j2
jld j2, j1, NK
jldi j3, 3
jshl j2, j2, j3
jadd j11, j11, j2
jld j2, j1, NV
jldi j3, 1
jsub j2, j2, j3
jldi j3, 4
jshl j2, j2, j3
jadd j11, j11, j2
jld j10, j1, NV
jldi j9, 1
jsub j10, j10, j9
jwhile j10
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, ROOMI
  jadd j4, j3, j4
  jld j4, j4, 0
  jld j4, j4, 16
  jldi j5, 7
  jadd j4, j4, j5
  jldi j5, -8
  jand j4, j4, j5
  jadd j11, j11, j4
  jld j4, j1, KEEP
  jadd j4, j4, j3
  jld j4, j4, 0
  jjz j4, sz_next
  jldi j3, 3                    ; (and its clues, padded)
  jshl j3, j9, j3
  jld j4, j1, CNTW
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j4, j1, CW
  jmul j3, j3, j4
  jldi j4, 7
  jadd j3, j3, j4
  jldi j4, -8
  jand j3, j3, j4
  jadd j11, j11, j3
sz_next:
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jst j11, j1, OSZ
jcall room
jldi j1, 0
jst j13, j1, OUTR

jldi j2, 2                      ; its head
jst j2, j13, 0
jld j2, j1, NBYTES
jst j2, j13, 8
jld j2, j1, ROFFN
jst j2, j13, 16
jld j2, j1, NK
jst j2, j13, 24
jld j2, j1, NPOST
jst j2, j13, 32
jld j2, j1, PLEN
jst j2, j13, 40
jld j2, j1, CW
jst j2, j13, 48
jld j2, j1, NTOK
jst j2, j13, 56
jld j2, j1, NV
jld j3, j1, NK
jsub j2, j2, j3
jldi j3, 1
jsub j2, j2, j3
jst j2, j13, 64
jldi j4, 72
jadd j4, j13, j4
jldi j5, PATHB                  ; the address
jld j3, j1, PLEN
jwhile j3
  jldb j2, j5, 0
  jstb j2, j4, 0
  jldi j2, 1
  jadd j4, j4, j2
  jadd j5, j5, j2
  jsub j3, j3, j2
jwend
jld j3, j1, PLEN
jldi j2, 7
jadd j3, j3, j2
jldi j2, -8
jand j3, j3, j2
jldi j4, 72
jadd j4, j13, j4
jadd j4, j4, j3
jld j5, j1, ROFF                ; the marks
jld j3, j1, ROFFN
jwhile j3
  jld j2, j5, 0
  jst j2, j4, 0
  jldi j2, 8
  jadd j4, j4, j2
  jadd j5, j5, j2
  jldi j2, 1
  jsub j3, j3, j2
jwend
jld j10, j1, NV                 ; every word: its letters, how many clues, and room for them
jldi j9, 1
jsub j10, j10, j9
jwhile j10
  jldi j3, 3
  jshl j3, j9, j3
  jld j5, j1, KEEP
  jadd j5, j5, j3
  jld j5, j5, 0
  jjz j5, wr_next
  jld j5, j1, ROOMI
  jadd j5, j5, j3
  jld j5, j5, 0
  jld j6, j5, 16
  jld j5, j5, 8
  jld j7, j1, ROOMA
  jadd j5, j5, j7
  jst j6, j4, 0
  jldi j7, 8
  jadd j8, j4, j7
  jadd j7, j6, j1
  jwhile j7
    jldb j2, j5, 0
    jstb j2, j8, 0
    jldi j2, 1
    jadd j5, j5, j2
    jadd j8, j8, j2
    jsub j7, j7, j2
  jwend
  jldi j7, 7
  jadd j6, j6, j7
  jldi j7, -8
  jand j6, j6, j7
  jldi j7, 8
  jadd j4, j4, j7
  jadd j4, j4, j6
  jld j6, j1, OCC               ; how many times it is in the book
  jadd j6, j6, j3
  jld j6, j6, 0
  jst j6, j4, 0
  jldi j7, 8
  jadd j4, j4, j7
  jld j6, j1, CNTW
  jadd j6, j6, j3
  jld j7, j6, 0
  jst j7, j4, 0
  jldi j2, 8
  jadd j4, j4, j2
  jst j4, j6, 0                 ; (where its next clue goes)
  jld j2, j1, CW
  jmul j7, j7, j2
  jldi j2, 7
  jadd j7, j7, j2
  jldi j2, -8
  jand j7, j7, j2
  jadd j4, j4, j7
wr_next:
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jld j10, j1, NV                 ; the foundation: its letters and how many times, no clues
jldi j9, 1
jsub j10, j10, j9
jwhile j10
  jldi j3, 3
  jshl j3, j9, j3
  jld j5, j1, KEEP
  jadd j5, j5, j3
  jld j5, j5, 0
  jjnz j5, wf_next
  jld j5, j1, ROOMI
  jadd j5, j5, j3
  jld j5, j5, 0
  jld j6, j5, 16
  jld j5, j5, 8
  jld j7, j1, ROOMA
  jadd j5, j5, j7
  jst j6, j4, 0
  jldi j7, 8
  jadd j8, j4, j7
  jadd j7, j6, j1
  jwhile j7
    jldb j2, j5, 0
    jstb j2, j8, 0
    jldi j2, 1
    jadd j5, j5, j2
    jadd j8, j8, j2
    jsub j7, j7, j2
  jwend
  jldi j7, 7
  jadd j6, j6, j7
  jldi j7, -8
  jand j6, j6, j7
  jldi j7, 8
  jadd j4, j4, j7
  jadd j4, j4, j6
  jld j6, j1, OCC
  jadd j6, j6, j3
  jld j6, j6, 0
  jst j6, j4, 0
  jldi j7, 8
  jadd j4, j4, j7
wf_next:
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jld j10, j1, NV                 ; its clues: the walk again, writing them
jld j9, j1, LASTW
jwhile j10
  jst j1, j9, 0
  jldi j2, 8
  jadd j9, j9, j2
  jldi j2, 1
  jsub j10, j10, j2
jwend
jcall clue_walk

jldi j1, 0                      ; the nest, whole
jldi j10, 12
jldi j11, PLAB
jldi j12, PLABN
jcall ask
jldi j1, 0
jldi j10, 4
jldi j11, PLAB
jldi j12, PLABN
jcall ask
jldi j1, 0
jldi j2, 63
jshr j2, j13, j2
jjnz j2, cm_said
jst j13, j1, HND
jldi j2, 32
jshl j10, j13, j2
jldi j2, 6
jor j10, j10, j2
jld j11, j1, OUTR
jld j12, j1, OSZ
jcall ask
jldi j1, 0
jld j10, j1, HND
jldi j2, 32
jshl j10, j10, j2
jldi j2, 7
jor j10, j10, j2
jcall ask
cm_said:
jldi j1, S_ATE                  ; said: what it ate, how many renglones and words, how many clues, how many bytes
jcall puts
jld j2, j1, POS
jld j3, j1, PLEN
jldi j4, PATHB
jwhile j3
  jldb j5, j4, 0
  jstb j5, j2, TEXT
  jldi j5, 1
  jadd j4, j4, j5
  jadd j2, j2, j5
  jsub j3, j3, j5
jwend
jst j2, j1, POS
jldi j1, S_REN
jcall puts
jld j2, j1, ROFFN
jldi j3, 1
jsub j2, j2, j3
jcall putnum
jldi j1, S_WORDS
jcall puts
jld j2, j1, NK
jcall putnum
jldi j1, S_OF
jcall puts
jld j2, j1, NV
jldi j3, 1
jsub j2, j2, j3
jcall putnum
jldi j1, S_CLUES
jcall puts
jld j2, j1, NPOST
jcall putnum
jldi j1, S_BYTES
jcall puts
jld j2, j1, OSZ
jcall putnum
jldi j2, 10
jcall putch
jjmp finish
no_come:
jldi j1, S_NOCOME
jcall puts
jjmp finish

; The row walked: each word the first time in each renglon is one clue. Before the nest is written it counts them
; (CNTW, NPOST); after, CNTW holds where each word's next clue goes and it writes the renglon there. Uses j1-j10.
clue_walk:
  jldi j1, 0
  jst j1, j1, RK
  jld j9, j1, ROOMT
  jld j10, j1, NTOK
  jwhile j10
    jld j2, j9, 0
    jjnz j2, cw_word
    jld j3, j1, RK
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, RK
    jjmp cw_next
  cw_word:
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, KEEP            ; (a subject: the foundation keeps no clue)
    jadd j4, j4, j3
    jld j4, j4, 0
    jjz j4, cw_next
    jld j4, j1, LASTW
    jadd j4, j4, j3
    jld j5, j4, 0
    jld j6, j1, RK
    jsub j5, j5, j6
    jjz j5, cw_next
    jst j6, j4, 0
    jld j4, j1, CNTW
    jadd j4, j4, j3
    jld j5, j4, 0
    jld j7, j1, OUTR
    jjz j7, cw_count
    jldi j7, 1                  ; writing: the renglon (counted from 0) where the clue goes, in its bytes
    jsub j6, j6, j7
    jld j7, j1, CW
    cw_byte:
      jstb j6, j5, 0
      jldi j8, 8
      jshr j6, j6, j8
      jldi j8, 1
      jadd j5, j5, j8
      jsub j7, j7, j8
      jjnz j7, cw_byte
    jst j5, j4, 0
    jjmp cw_next
  cw_count:
    jldi j7, 1
    jadd j5, j5, j7
    jst j5, j4, 0
    jld j5, j1, NPOST
    jadd j5, j5, j7
    jst j5, j1, NPOST
  cw_next:
    jldi j2, 8
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jret

include 'crece.inc'
include 'casa.inc'
include 'pulso.inc'
include 'organo.inc'
include 'negacion.inc'
include 'lectura.inc'
