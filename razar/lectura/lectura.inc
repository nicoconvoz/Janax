; Reading a book, shared by Razar's readers (lector, pulso). It reads the file "libro" twice. The first time it only
; counts, so every table is made to the size of this book (each hash table the least power of two with twice the places
; it could ever need). The second time every word gets a number in order of first sight (0 is the renglon, the line of
; the file) and the book becomes a row of numbers. A word is a run of letters and digits: a..z, A..Z made small, 0..9,
; and the letters of U+00C0..U+00FF (a tilde, the enie, the dieresis; capitals made small). A space ends a word, a line
; feed ends the renglon too, and every other character (a comma, a period, the marks of speech, a dash...) is a piece
; of its own, as Razar reads them: "ya, no" is not "ya no" (Capitan, 2026-11-06: without them the no was not found). One renglon in K (the K-th, the 2K-th, ...) is kept apart for the test (is_train). K comes from the
; file "p" (one qword; 10 if there is none).
;
; The program that includes it names its texts S_LIBRO ("libro"), S_P ("p"), S_NOBOOK and S_NOMEM, keeps its own
; variables from 1200h on and includes this file at its end.
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
VMASK = 10B8h                   ; places of each hash table made to the units, minus 1
ROOMT = 10C0h                   ; the row: unit i at ROOMT + 8i
ROOMA = 10C8h                   ; the words' letters, one after another
ARPOS = 10D0h
ROOMV = 10D8h                   ; the words: {hash, where its letters are, how many, its number} per place
ROOMI = 10E0h                   ; each word's place in ROOMV, by number
FNVO  = 10E8h                   ; FNV-1a: offset and prime
FNVP  = 10F0h
M48   = 10F8h                   ; 2^48 - 1
POS   = 1100h                   ; how long the text it writes is so far
LINE  = 1108h                   ; the renglon being walked
MLEFT = 1128h                   ; bytes left of the mark being read
Q16V  = 1130h                   ; a number being written with two decimals
WCAP  = 1138h                   ; 1: the word being read began with a capital; and by unit, a byte each
ROOMCP = 1140h
ROOMCL = 1148h                  ; the limits: by word, 1 if it closes a building
LMI   = 1150h                   ; (walking)
EXAMM = 1160h                   ; 0 no exam; 1 learning for an exam (its renglones apart), 2 knocking with them
NPAS  = 1158h                   ; how many times the pulse reads the book, after K in "p" (its first byte; 0: once)
LABEL = 1110h                   ; the file being read: its label and how long it is
LABLEN = 1118h
QN    = 1120h                   ; reading a question (PASS 2): its units so far, at QBUF (-1 a hole, -2 a word the
                                ; book never had, 0 its end)
TEXT  = 2000h                   ; the lines it writes
WBUF  = 3000h                   ; (255 bytes)
DIG   = 3200h                   ; digits of a number being written
QBUF  = 4000h                   ; a question read (QMAX units: criterion, a question is short)
QMAX  = 512
BUF   = 8000h                   ; a piece of the book
BUFLEN = 8000h

; The book read: its constants, K, the first reading, its rooms (the row, the letters, the words and their places by
; number) and the second reading. Uses j1-j14.
read_book:
jldi j1, 0                      ; the book, and constants
jldi j2, S_LIBRO
jst j2, j1, LABEL
jldi j2, 5
jst j2, j1, LABLEN
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

jldi j10, 4                    ; its parameters: open "p" (request 4) and read K (request 5)
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
jldi j11, QBUF                  ; K, and after it how many passes
jldi j12, 16
jcall ask
jldi j1, 0
jld j2, j1, QBUF + 8
jst j2, j1, NPAS
jld j2, j1, QBUF
jst j2, j1, PK
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
jst j13, j1, ROOMI
jld j11, j1, NUNITS              ; and which unit began with a capital (a byte each)
jldi j2, 8
jadd j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMCP
jld j11, j1, NBYTES
jldi j2, 8
jadd j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMA
jld j2, j1, NUNITS              ; places: the least power of two with twice the units (no table holds more)
jadd j2, j2, j2
jcall pow2
jldi j4, 1
jsub j4, j3, j4
jst j4, j1, VMASK
jldi j2, 5
jshl j11, j3, j2
jcall room
jldi j1, 0
jst j13, j1, ROOMV

jldi j1, 0                      ; second reading: the row of numbers (unit 0 is a renglon: the room starts in zeros)
jldi j2, 1
jst j2, j1, PASS
jst j2, j1, NV
jst j2, j1, NTOK
jst j1, j1, NLINES
jst j1, j1, ARPOS
jcall scan
jret

; The least power of two that is j2 or more -> j3. Uses j1, j3-j5 (j1 = 0 after).
pow2:
  jldi j1, 0
  jldi j3, 1
  jldi j4, 1
  jwhile j4
    jsub j4, j3, j2
    jldi j5, 63
    jsar j4, j4, j5
    jand j5, j3, j4
    jadd j3, j3, j5
  jwend
  jret

; The word number j2 at TEXT + POS. Uses j1-j5 (j1 = 0 after).
putword:
  jldi j1, 0
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j5, j3, 16
  jld j3, j3, 8
  jld j4, j1, ROOMA
  jadd j3, j3, j4
  jld j4, j1, POS
  jwhile j5
    jldb j2, j3, 0
    jstb j2, j4, TEXT
    jldi j2, 1
    jadd j3, j3, j2
    jadd j4, j4, j2
    jsub j5, j5, j2
  jwend
  jst j4, j1, POS
  jret

; Reads the book from its start, every byte through tok_byte, and ends its last word and renglon. Uses j1-j14.
scan:
  jldi j1, 0
  jst j1, j1, NBYTES
  jst j1, j1, WLEN
  jst j1, j1, LEAD
  jldi j2, 1
  jst j2, j1, LASTL
  jldi j10, 4
  jld j11, j1, LABEL
  jld j12, j1, LABLEN
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
  jld j3, j1, MLEFT             ; the rest of a mark of more than one byte
  jjz j3, tb_lead
  jldi j4, 1
  jsub j3, j3, j4
  jst j3, j1, MLEFT
  jjnz j3, w_put
  jcall w_put
  jjmp w_end
tb_lead:
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
  jjz j4, tb_lowc               ; a capital, the first letter of its word: the word began with a capital
  jld j7, j1, WLEN
  jjnz j7, tb_lowc
  jldi j7, 1
  jst j7, j1, WCAP
tb_lowc:
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
  jldi j3, 80h                  ; past ASCII: a mark of two, three or four bytes (a lead), or a stray continuation
  jsub j3, j2, j3
  jsar j4, j3, j5
  jjnz j4, tb_seven
  jldi j3, 0C0h
  jsub j3, j2, j3
  jsar j4, j3, j5
  jjnz j4, w_end
  jst j2, j1, BYTE
  jcall w_end
  jldi j1, 0
  jld j2, j1, BYTE
  jcall w_put
  jldi j1, 0
  jld j2, j1, BYTE
  jldi j5, 63
  jldi j4, 1                    ; how many bytes are left of it
  jldi j3, 0E0h
  jsub j3, j2, j3
  jsar j3, j3, j5
  jjnz j3, tb_left
  jldi j4, 2
  jldi j3, 0F0h
  jsub j3, j2, j3
  jsar j3, j3, j5
  jjnz j3, tb_left
  jldi j4, 3
tb_left:
  jst j4, j1, MLEFT
  jret
tb_seven:
  jldi j3, 41h
  jsub j3, j2, j3
  jsar j4, j3, j5
  jjnz j4, tb_digit
  jldi j4, 26
  jsub j4, j3, j4
  jsar j4, j4, j5
  jjz j4, tb_small
  jld j4, j1, WLEN              ; a capital, the first letter of its word: the word began with a capital
  jjnz j4, tb_up
  jldi j4, 1
  jst j4, j1, WCAP
tb_up:
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
tb_digit:                       ; a digit is part of a word too
  jldi j3, 30h
  jsub j3, j2, j3
  jsar j4, j3, j5
  jjnz j4, tb_other
  jldi j4, 10
  jsub j4, j3, j4
  jsar j4, j4, j5
  jjz j4, tb_other
  jjmp w_put
tb_other:
  jld j3, j1, PASS              ; reading a question, "?" is a hole
  jldi j4, 2
  jsub j3, j3, j4
  jjnz j3, tb_text
  jldi j3, 3Fh
  jsub j3, j2, j3
  jjnz j3, tb_text
  jcall w_end
  jldi j2, -1
  jjmp t_put
tb_text:
  jldi j3, 10
  jsub j3, j2, j3
  jjnz j3, tb_space
  jcall w_end
  jjmp l_unit
tb_space:
  jldi j3, 21h                  ; a space, a tab, a carriage return: the word ends
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, w_end
  jst j2, j1, BYTE              ; any other: a mark, a piece of its own
  jcall w_end
  jldi j1, 0
  jld j2, j1, BYTE
  jcall w_put
  jjmp w_end

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
  jst j1, j1, WCAP
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

; The number j2 at the end of the row (reading a question: at the end of the question, QBUF; past QMAX units
; they are not kept). Uses j1-j5.
t_put:
  jldi j1, 0
  jld j3, j1, PASS
  jldi j4, 2
  jsub j3, j3, j4
  jjnz j3, tp_book
  jld j3, j1, QN
  jldi j4, QMAX
  jsub j4, j3, j4
  jjz j4, tp_full
  jldi j4, 3
  jshl j4, j3, j4
  jst j2, j4, QBUF
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, QN
tp_full:
  jret
tp_book:
  jld j3, j1, NTOK
  jldi j4, 3
  jshl j4, j3, j4
  jld j5, j1, ROOMT
  jadd j4, j4, j5
  jst j2, j4, 0
  jldi j4, 1
  jadd j3, j3, j4
  jld j5, j1, ROOMCP            ; and whether it began with a capital (at the unit just put)
  jadd j5, j5, j3
  jldi j6, 1
  jsub j5, j5, j6
  jld j6, j1, WCAP
  jstb j6, j5, 0
  jst j1, j1, WCAP
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
  jld j5, j1, PASS              ; a question names only words the book has (-2: one it never read)
  jldi j6, 2
  jsub j5, j5, j6
  jjnz j5, wi_add
  jldi j2, -2
  jret
wi_add:
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
  jldi j5, 3
  jshl j5, j2, j5
  jld j6, j1, ROOMI
  jadd j5, j5, j6
  jst j4, j5, 0
  jldi j5, 1
  jadd j5, j2, j5
  jst j5, j1, NV
  jret

; j2 = nonzero if the renglon LINE is one it learns from (or, in an exam that knocks, if it is not the exam). Uses
; j1-j6.
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
  jld j5, j1, EXAMM             ; an exam: the renglon before the test one is kept apart too (EXAMM 1, learning), and
  jjz j5, it_done               ; knocking knocks with it alone (EXAMM 2): the test stays untouched
  jldi j6, 1
  jadd j4, j2, j6               ; (0: the exam renglon)
  jldi j6, 2
  jsub j5, j5, j6
  jjnz j5, it_learn
  jadd j2, j4, j1
  jret
it_learn:
  jjz j2, it_done
  jadd j2, j4, j1
it_done:
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

; j2 (0 or more, in 2^-16) with two decimals at TEXT + POS. Uses j1-j5.
putq16:
  jldi j1, 0
  jst j2, j1, Q16V
  jldi j3, 16
  jshr j2, j2, j3
  jcall putnum
  jldi j2, 44
  jcall putch
  jldi j1, 0
  jld j2, j1, Q16V
  jldi j3, 0
  jshi j3, 0FFFFh
  jand j2, j2, j3
  jldi j3, 100
  jmul j2, j2, j3
  jldi j3, 16
  jshr j2, j2, j3
  jldi j3, 10
  jsub j4, j2, j3
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, pq_two
  jst j2, j1, Q16V
  jldi j2, 48
  jcall putch
  jldi j1, 0
  jld j2, j1, Q16V
pq_two:
  jjmp putnum

; What it wrote so far, out (request 1), and TEXT empty again. Uses j1, j10-j14.
flush:
  jldi j10, 1
  jldi j11, TEXT
  jldi j1, 0
  jld j12, j1, POS
  jcall ask
  jldi j1, 0
  jst j1, j1, POS
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

; j3 = 1 if the piece j2 is a mark (its first byte is no letter nor digit: a piece of one character the reader cut on
; its own). Uses j1-j5.
w_mark:
  jldi j1, 0
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j3, j3, 8
  jld j4, j1, ROOMA
  jadd j3, j3, j4
  jldb j2, j3, 0                ; its first byte
  jldi j5, 63
  jldi j3, 0C3h                 ; a letter of U+00C0..U+00FF
  jsub j3, j2, j3
  jjz j3, wm_no
  jldi j3, 61h                  ; a..z
  jsub j3, j2, j3
  jsar j4, j3, j5
  jjnz j4, wm_digit
  jldi j4, 26
  jsub j4, j3, j4
  jsar j4, j4, j5
  jjnz j4, wm_no
wm_digit:
  jldi j3, 30h                  ; 0..9
  jsub j3, j2, j3
  jsar j4, j3, j5
  jjnz j4, wm_yes
  jldi j4, 10
  jsub j4, j3, j4
  jsar j4, j4, j5
  jjnz j4, wm_no
wm_yes:
  jldi j3, 1
  jret
wm_no:
  jldi j3, 0
  jret

; The limits of the buildings (Capitan, 2026-11-06: "a sentence begins with a capital and ends with a period; a new
; building is born only after a punctuation"), found in the book, not given: a mark closes a building when most of the
; times it is followed by a word, that word began with a capital (a run of marks: each of them). The end of a renglon
; always closes. ROOMCL gets, by word, 1 for a mark that closes. Uses j1-j14.
limits:
  jldi j1, 0
  jld j11, j1, NV               ; by word: closes, followed by a capital, followed by a word
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMCL
  jldi j9, 1
  jld j10, j1, NTOK
  jldi j2, 2
  jsub j10, j10, j2
  jwhile j10
    jldi j1, 0
    jst j9, j1, LMI
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jjz j2, lm_next
    jst j2, j1, BYTE
    jcall w_mark
    jjz j3, lm_next
    jldi j1, 0                  ; a mark: the first word after it (past other marks), in its renglon
    jld j11, j1, LMI
    lm_after:
      jldi j2, 1
      jadd j11, j11, j2
      jldi j2, 3
      jshl j2, j11, j2
      jld j3, j1, ROOMT
      jadd j2, j2, j3
      jld j2, j2, 0
      jjz j2, lm_next
      jcall w_mark
      jldi j1, 0
      jjnz j3, lm_after
    jld j2, j1, BYTE            ; followed by a word: once more; by a capital: once more
    jldi j3, 24
    jmul j2, j2, j3
    jld j3, j1, ROOMCL
    jadd j3, j3, j2
    jld j4, j3, 16
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j3, 16
    jld j4, j1, ROOMCP
    jadd j4, j4, j11
    jldb j4, j4, 0
    jld j5, j3, 8
    jadd j5, j5, j4
    jst j5, j3, 8
  lm_next:
    jldi j1, 0
    jld j9, j1, LMI
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j9, 1                    ; most of the times a capital: it closes
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j2, 24
    jmul j2, j9, j2
    jld j3, j1, ROOMCL
    jadd j3, j3, j2
    jld j4, j3, 8
    jadd j4, j4, j4
    jld j5, j3, 16
    jsub j4, j5, j4
    jldi j5, 63
    jsar j4, j4, j5
    jldi j5, 1
    jand j4, j4, j5
    jst j4, j3, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret
