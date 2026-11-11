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
WLEN  = 1078h                   ; the word being read: its bytes so far (at WBP)
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
ROOMI = 10E0h                   ; each word's place in ROOMV, by number (it grows with them: ICAP places)
VCNT  = 11D8h                   ; the words in ROOMV, its places minus 1 (it grows to hold them), and ROOMI's places
WMASK = 11F0h
ICAP  = 11F8h
ACAP  = 11E0h                   ; the bytes ROOMA has room for (it grows with the words' letters)
WGD   = 1F90h                   ; the words' table growing: j2, the place, its old room and places, j9-j14 (crece.inc's
WGK   = 1F98h                   ; places: free in every program, never used by both at once)
WGO   = 1FA0h
WGN   = 1FA8h
WGS   = 1FB0h
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
RLIST = 1170h                   ; the rooms it got (0: it keeps no list; at its first qword how many it can hold, then
                                ; the rooms), how many; the shelf: where, how many books, the
RLN   = 1178h                   ; books left, the next one
SHELF = 1180h
SHN   = 1188h
SHI   = 1190h
SHP   = 1198h
HOSTB = 11A0h                   ; 1: the book is a file anywhere on the host, LABEL its address (opened with 37, no
ROFF  = 11A8h                   ; shelf), and where each renglon starts is kept: at ROFF, ROFFN of them (the first at
ROFFN = 11B0h                   ; 0, the last the end of the book: renglon k is from ROFF[k] to ROFF[k + 1])
HOSTF = 1FE0h                   ; a piece of a book of the host: from that byte (0: its start) to that one (0: its end);
HOSTE = 1FE8h                   ; its places, its renglones' starts and its bytes counted from the file's start
AUTH  = 1168h                   ; the autopsy being written: its handle plus one (0: none)
EXAMM = 1160h                   ; 0 no exam; 1 learning for an exam (its renglones apart), 2 knocking with them
NPAS  = 1158h                   ; how many times the pulse reads the book, after K in "p" (its first byte; 0: once)
LABEL = 1110h                   ; the file being read: its label and how long it is
LABLEN = 1118h
QN    = 1120h                   ; reading a question (PASS 2): its units so far, at QBUF (-1 a hole, -2 a word the
                                ; book never had, 0 its end)
TEXT  = 2000h                   ; the lines it writes (TEXTN bytes: full, they go out, to the console or to SINK)
TEXTN = 1000h
BKP   = 3300h                   ; where each book starts in the row (a page break ends one): {where, bytes, bytes it
                                ; must hold, one kept, the registers kept}, a room that grows; how many
BKN   = 3390h
WSP   = 11C0h                   ; 1: a space or a line end since the last unit; by unit, 1 if it came glued to the
ROOMGL = 11C8h                  ; one before (no space between: Capitan, "what is a separator, what opens, what closes")
MKP   = 3700h                   ; what each mark does (mk_learn): by two marks {key, opener, closer, times}; by mark
                                ; its counts, the marks seen and how many; walking; the pairs as a stack
MKC   = 3720h
MKL   = 3728h
MKLN  = 3730h
MK1   = 3738h
MK2   = 3740h
MK3   = 3748h
MK4   = 3750h
MK5   = 3758h
MK6   = 3760h
MK7   = 3768h
MK8   = 3770h
MK9   = 3778h
MKO   = 3780h
MKQ   = 3788h
MKPR  = 3790h
MKPN  = 3798h
MKS   = 37A0h
MKSN  = 37A8h
MKBE  = 37B0h
MKBT  = 37B8h
MKX   = 37C0h
MKHIT = 37C8h
MKALL = 37D0h
RLT   = 11B8h                   ; (the room just got, while the list of rooms grows)
SINK  = 3230h                   ; where the text goes: 0 the console, or a file's handle plus one; the text written
PUTP  = 3238h                   ; walked; the registers kept while it goes out (13 qwords)
PCS   = 3240h
WBP   = 3000h                   ; the word being read: where its bytes are (a room that grows: wb_need), how many
WBC   = 3008h                   ; it holds, how many it must hold, the registers kept while it grows (13 qwords), one
WBN   = 3010h                   ; kept
WBT   = 3018h
WBS   = 3020h
DIG   = 3200h                   ; digits of a number being written
QBP   = 4000h                   ; a question read: where its units are (a room that grows: qb_need), its bytes, the
QBK   = 4008h                   ; bytes it must hold, one kept, the registers kept while it grows (13 qwords)
QBN   = 4010h
QBT   = 4018h
QBS   = 4020h
QSCR  = 4100h                   ; (16 bytes read from "p")
BUF   = 8000h                   ; a piece of the book
BUFLEN = 8000h

; The book read: its constants, K, the first reading, its rooms (the row, the letters, the words and their places by
; number) and the second reading. Uses j1-j14.
read_book:
jldi j1, 0                      ; the book (a book of the host keeps its address), and constants
jld j2, j1, HOSTB
jjnz j2, rb_host
jldi j2, S_LIBRO
jst j2, j1, LABEL
jldi j2, 5
jst j2, j1, LABLEN
rb_host:
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
jcall0 j1, ask
jldi j2, 10                     ; one renglon in ten for the test, if it is not told: criterion, not measurement
jst j2, j1, PK
jldi j2, 1
jadd j2, j13, j2
jjz j2, pr_done
jldi j2, 32
jshl j10, j13, j2
jldi j2, 5
jor j10, j10, j2
jldi j11, QSCR                  ; K, and after it how many passes
jldi j12, 16
jcall0 j1, ask
jld j2, j1, QSCR + 8
jst j2, j1, NPAS
jld j2, j1, QSCR
jst j2, j1, PK
jjnz j2, pr_done
jldi j2, 10
jst j2, j1, PK
pr_done:

jldi j1, 0                      ; the shelf: every book there is (a book of the host is one)
jld j2, j1, HOSTB
jjnz j2, rb_one
jcall shelf_build
rb_one:
jldi j1, 0                      ; first reading: it counts
jst j1, j1, PASS
jldi j2, 1
jst j2, j1, NUNITS
jcall0 j1, scan                 ; its rooms, to the book's size

jld j11, j1, NUNITS
jldi j2, 3
jshl j11, j11, j2
jcall0 j1, room
jst j13, j1, ROOMT
jldi j11, 128                   ; (each word's place, by number: it grows with the words, from 16)
jcall0 j1, room
jst j13, j1, ROOMI
jldi j2, 16
jst j2, j1, ICAP
jld j11, j1, NUNITS              ; and which unit began with a capital (a byte each)
jldi j2, 8
jadd j11, j11, j2
jcall0 j1, room
jst j13, j1, ROOMCP
jld j11, j1, NUNITS              ; and which came glued to the one before (a byte each)
jldi j2, 8
jadd j11, j11, j2
jcall0 j1, room
jst j13, j1, ROOMGL
jldi j11, 264                   ; the words' letters, one after the other: they grow with them, from 256 bytes (it
jcall0 j1, room                 ; was made for every byte of the book, and held one in ten)
jst j13, j1, ROOMA
jldi j2, 256
jst j2, j1, ACAP
jld j2, j1, NUNITS              ; places: the least power of two with twice the units (no table holds more)
jadd j2, j2, j2
jcall pow2
jldi j4, 1
jsub j4, j3, j4
jst j4, j1, VMASK
jldi j11, 64                    ; the words: a table that grows to hold them (Capitan: "nothing wasted"; it was made
jcall0 j1, room                 ; for every unit, twice over: 2 % of it held a word), from two places
jst j13, j1, ROOMV
jldi j2, 1
jst j2, j1, WMASK
jst j1, j1, VCNT

jldi j1, 0                      ; a book of the host: where each renglon starts, to the renglones counted
jld j2, j1, HOSTB
jjz j2, rb_marks
jld j11, j1, NLINES
jldi j2, 2
jadd j11, j11, j2
jldi j2, 3
jshl j11, j11, j2
jcall0 j1, room
jst j13, j1, ROFF
jld j2, j1, HOSTF               ; (the first renglon starts where the piece does)
jst j2, j13, 0
jldi j2, 1
jst j2, j1, ROFFN
rb_marks:
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
  jld j4, j1, ROOMI
  jldx j3, j4, j2
  jld j5, j3, 16
  jld j4, j3, 8
  jld j3, j1, ROOMA
  jadd j4, j4, j3
  jwhile j5
    jldb j2, j4, 0
    jcall putch
    jldi j2, 1
    jadd j4, j4, j2
    jsub j5, j5, j2
  jwend
  jldi j1, 0
  jret

; The shelf (Capitan: "let it eat the new book"): every file whose label starts "libro", listed by the system
; (request 14: {its length, its bytes padded to 8}, as many as fit) and kept in order at SHELF, SHN of them. The book
; is all of them, one after the other. Uses j1-j14.
shelf_build:
  jldi j1, 0
  jst j1, j1, SHN
  jldi j11, 4096
  jcall0 j1, room
  jst j13, j1, SHELF
  jldi j10, 14
  jadd j11, j13, j1
  jldi j12, 4096
  jcall0 j1, ask
  jldi j2, 63
  jsar j2, j13, j2
  jjnz j2, sb_done
  jld j9, j1, SHELF             ; from, to
  jadd j10, j9, j1
  jadd j11, j13, j1
  jwhile j11
    jldi j1, 0
    jld j2, j9, 0               ; its length, and its place: 8 + the length padded to 8
    jldi j3, 7
    jadd j3, j2, j3
    jldi j4, -8
    jand j3, j3, j4
    jldi j4, 8
    jadd j3, j3, j4
    jldi j4, 5                  ; a book? five bytes or more, "libro" first
    jsub j4, j2, j4
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, sb_next
    jld j4, j9, 8
    jldi j5, 24
    jshl j4, j4, j5
    jshr j4, j4, j5
    jldi j5, 0
    jshi j5, 006Fh
    jshi j5, 7262h
    jshi j5, 696Ch
    jsub j4, j4, j5
    jjnz j4, sb_next
    jldi j5, 0                  ; kept: copied down to its place in the shelf
    jadd j6, j3, j1
    jwhile j6
      jadd j7, j9, j5
      jld j8, j7, 0
      jadd j7, j10, j5
      jst j8, j7, 0
      jldi j7, 8
      jadd j5, j5, j7
      jsub j6, j6, j7
    jwend
    jadd j10, j10, j3
    jld j4, j1, SHN
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j1, SHN
  sb_next:
    jadd j9, j9, j3
    jldi j4, 1
    jsub j11, j11, j4
  jwend
sb_done:
  jldi j1, 0
  jret

; The print (FNV-1a from j2) of the bytes of a book of the host, the j12 bytes of its address at j11: of its piece
; HOSTF to HOSTE when it is one. j2 the print, j3 = 1 if it did not open. Its state lives past its buffer (no place of
; its own: every program has this). Uses j1-j14.
host_print:
  jldi j1, 0
  jst j2, j1, PLS               ; (the print while the room is made: crece.inc's places, free now)
  jst j11, j1, PLS + 8
  jst j12, j1, PLS + 16
  jldi j11, 1
  jshi j11, 32
  jcall0 j1, room
  jld j2, j1, PLS
  jst j2, j13, 16
  jadd j9, j13, j1
  jldi j10, 37
  jld j11, j1, PLS + 8
  jld j12, j1, PLS + 16
  jcall0 j1, ask
  jst j13, j9, 0
  jldi j2, 63
  jshr j2, j13, j2
  jldi j3, 1
  jjnz j2, hpr_give
  jld j2, j1, HOSTF
  jst j2, j9, 8
  jjz j2, hpr_lap
  jldi j3, 32
  jshl j10, j13, j3
  jldi j3, 38
  jor j10, j10, j3
  jadd j11, j2, j1
  jcall ask
  hpr_lap:
    jldi j1, 0
    jld j10, j9, 0
    jldi j2, 32
    jshl j10, j10, j2
    jldi j2, 5
    jor j10, j10, j2
    jldi j11, 32
    jadd j11, j9, j11
    jldi j12, 1
    jshi j12, 0
    jld j2, j1, HOSTE
    jjz j2, hpr_read
    jld j3, j9, 8
    jsub j2, j2, j3
    jsub j3, j2, j12
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, hpr_read
    jadd j12, j2, j1
  hpr_read:
    jcall0 j1, ask
    jldi j2, 1
    jsub j2, j13, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, hpr_end
    jld j2, j9, 8
    jadd j2, j2, j13
    jst j2, j9, 8
    jld j2, j9, 16
    jldi j3, 32
    jadd j3, j9, j3
    jld j6, j1, FNVP
    jwhile j13
      jldb j4, j3, 0
      jxor j2, j2, j4
      jmul j2, j2, j6
      jldi j4, 1
      jadd j3, j3, j4
      jsub j13, j13, j4
    jwend
    jst j2, j9, 16
    jjmp hpr_lap
hpr_end:
  jld j10, j9, 0
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall0 j3, ask
hpr_give:
  jldi j1, 0
  jld j2, j9, 16
  jst j3, j1, PLS
  jst j2, j1, PLS + 8
  jldi j10, 3
  jadd j11, j9, j1
  jcall0 j1, ask
  jld j3, j1, PLS
  jld j2, j1, PLS + 8
  jret

; A piece of a book of the host: the j3 bytes at j2 are what "come" holds, its address and, if a line follows it,
; "<from> <to>" (the bytes of the piece, in decimal; the one who launches cuts it) -> j3 the address's bytes, HOSTF
; and HOSTE (0 and 0 without the line: the whole book). Uses j1-j8.
come_piece:
  jldi j1, 0
  jst j1, j1, HOSTF
  jst j1, j1, HOSTE
  jldi j4, 0
  jwhile j5
    jadd j5, j2, j4
    jldb j5, j5, 0
    jldi j6, 10
    jsub j5, j5, j6
    jjz j5, cpc_line
    jldi j5, 1
    jadd j4, j4, j5
  jwcheck
    jsub j5, j4, j3
  jwend
  jjmp cpc_done
cpc_line:
  jadd j7, j4, j1               ; (the address ends there)
  jldi j8, HOSTF
  cpc_num:
    jldi j6, 0
    jwhile j5
      jadd j5, j2, j4
      jldb j5, j5, 0
      jldi j1, 48
      jsub j5, j5, j1
      jldi j1, 63
      jsar j1, j5, j1
      jjnz j1, cpc_end
      jldi j1, 10
      jsub j1, j5, j1
      jldi j5, 63
      jsar j1, j1, j5
      jjz j1, cpc_end
      jadd j5, j2, j4
      jldb j5, j5, 0
      jldi j1, 48
      jsub j5, j5, j1
      jldi j1, 10
      jmul j6, j6, j1
      jadd j6, j6, j5
    jwcheck
      jldi j5, 1
      jadd j4, j4, j5
      jsub j5, j4, j3
    jwend
    jjmp cpc_put
  cpc_end:
    jldi j1, 0
    jst j6, j8, 0
    jldi j5, HOSTE
    jsub j5, j8, j5
    jjz j5, cpc_cut
    jldi j8, HOSTE
    jjmp cpc_num
cpc_put:
  jldi j1, 0
  jst j6, j8, 0
cpc_cut:
  jadd j3, j7, j1
cpc_done:
  jldi j1, 0
  jret

; Reads the book from its start, every byte through tok_byte, and ends its last word and renglon; the book is the
; shelf, every "libro" one after the other (each ends its renglon), when one was built. Uses j1-j14.
scan:
  jldi j1, 0
  jld j2, j1, HOSTF
  jst j2, j1, NBYTES
  jst j1, j1, WLEN
  jst j1, j1, LEAD
  jldi j2, 1
  jst j2, j1, LASTL
  jld j2, j1, LABEL             ; the book, and a shelf: every one of its books
  jldi j3, S_LIBRO
  jsub j2, j2, j3
  jjnz j2, scan_file
  jld j2, j1, SHN
  jjz j2, scan_file
  jld j2, j1, SHELF
  jst j2, j1, SHP
  jld j2, j1, SHN
  jst j2, j1, SHI
  jwhile j2
    jldi j1, 0
    jld j3, j1, SHP
    jld j4, j3, 0
    jst j4, j1, LABLEN
    jldi j5, 8
    jadd j5, j3, j5
    jst j5, j1, LABEL
    jldi j6, 7
    jadd j4, j4, j6
    jldi j6, -8
    jand j4, j4, j6
    jadd j3, j5, j4
    jst j3, j1, SHP
    jcall0 j1, scan_file
    jld j2, j1, SHI
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, SHI
  jwend
  jldi j2, S_LIBRO
  jst j2, j1, LABEL
  jldi j2, 5
  jst j2, j1, LABLEN
  jret

; One file of the book (LABEL, LABLEN), every byte through tok_byte. Uses j1-j14.
scan_file:
  jldi j1, 0
  jldi j10, 4
  jld j2, j1, HOSTB             ; (a book of the host: open on the host, read only)
  jjz j2, sf_label
  jldi j10, 37
sf_label:
  jld j11, j1, LABEL
  jld j12, j1, LABLEN
  jcall0 j1, ask
  jst j13, j1, HAND
  jldi j2, 1
  jadd j2, j13, j2
  jjnz j2, sc_open
  jldi j1, S_NOBOOK
  jcall puts
  jjmp finish
sc_open:
  jld j2, j1, HOSTF             ; (a piece: from its first byte, 38)
  jjz j2, sc_from
  jld j10, j1, HAND
  jldi j3, 32
  jshl j10, j10, j3
  jldi j3, 38
  jor j10, j10, j3
  jadd j11, j2, j1
  jcall ask
sc_from:
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
    jld j2, j1, HOSTE           ; (a piece: up to its last byte)
    jjz j2, sc_read
    jld j3, j1, NBYTES
    jsub j2, j2, j3
    jsub j3, j2, j12
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, sc_read
    jadd j12, j2, j1
  sc_read:
    jcall0 j1, ask              ; (a failed read is the end)
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
      jcall0 j1, tok_byte
      jld j3, j1, LEFT
      jldi j4, 1
      jsub j3, j3, j4
      jst j3, j1, LEFT
    jwend
    jld j2, j1, GOT
  jwend
  jcall w_end
  jcall0 j1, l_unit
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
  jldi j4, 0C0h                 ; a byte that does not continue it (10xxxxxx) ends it, and is read on its own: the
  jand j4, j2, j4               ; same as a letter's second byte (tb_bad)
  jldi j5, 80h
  jsub j4, j4, j5
  jjz j4, tb_cont
  jst j1, j1, MLEFT
  jst j2, j1, BYTE
  jcall0 j1, w_end
  jld j2, j1, BYTE
  jjmp tb_lead
tb_cont:
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
  jcall0 j1, w_put
  jld j2, j1, BYTE
  jjmp w_put
tb_bad:                         ; not a letter's second byte: the word ends, and the byte is read on its own
  jst j2, j1, BYTE
  jcall0 j1, w_end
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
  jcall0 j1, w_end
  jld j2, j1, BYTE
  jcall0 j1, w_put
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
  jldi j3, 12                   ; a page break: a book ends (what is read again comes from many, each its own world)
  jsub j3, j2, j3
  jjnz j3, tb_lf
  jcall w_end
  jcall bk_mark
  jjmp l_unit
tb_lf:
  jldi j3, 10
  jsub j3, j2, j3
  jjnz j3, tb_space
  jcall0 j1, w_end
  jldi j3, 1
  jst j3, j1, WSP
  jjmp l_unit
tb_space:
  jldi j3, 21h                  ; a space, a tab, a carriage return: the word ends
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, tb_white
  jst j2, j1, BYTE              ; any other: a mark, a piece of its own
  jcall0 j1, w_end
  jld j2, j1, BYTE
  jcall w_put
  jjmp w_end
tb_white:                       ; (what comes next comes apart)
  jcall0 j1, w_end
  jldi j3, 1
  jst j3, j1, WSP
  jret

; The buffer described at j1 {where its bytes are, how many it holds, how many it must hold, one kept, the registers
; kept (13 qwords)} holds what it must (Capitan, 2026-11-07: "no ceilings: if tomorrow it grows more, it adjusts
; itself"): a room that doubles before it would be short, what it held moved to the new one. Uses j1 (0 after; every
; other register kept).
buf_need:
  jst j3, j1, 40
  jst j4, j1, 48
  jld j3, j1, 16
  jld j4, j1, 8
  jsub j3, j4, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, bfn_grow
  jld j3, j1, 40
  jld j4, j1, 48
  jldi j1, 0
  jret
bfn_grow:
  jst j2, j1, 32
  jst j5, j1, 56
  jst j6, j1, 64
  jst j7, j1, 72
  jst j8, j1, 80
  jst j9, j1, 88
  jst j10, j1, 96
  jst j11, j1, 104
  jst j12, j1, 112
  jst j13, j1, 120
  jst j14, j1, 128
  jldi j9, 0
  jadd j9, j9, j1
  jld j11, j9, 8
  jadd j11, j11, j11
  jjnz j11, bfn_twice
  jldi j11, 256
jwhile j2
  jadd j11, j11, j11
jwcheck
bfn_twice:
  jld j2, j9, 16
  jsub j2, j11, j2
  jldi j3, 63
  jsar j2, j2, j3
jwend
bfn_room:
  jst j11, j9, 24
  jcall room
  jld j3, j9, 0                 ; (what it held, to the new room)
  jld j4, j9, 8
  jldi j5, 0
  jwhile j6
    jadd j6, j3, j5
    jldb j6, j6, 0
    jadd j7, j13, j5
    jstb j6, j7, 0
    jldi j6, 1
    jadd j5, j5, j6
  jwcheck
    jsub j6, j5, j4
  jwend
bfn_moved:
  jst j13, j9, 0
  jld j2, j9, 24
  jst j2, j9, 8
  jldi j1, 0
  jadd j1, j1, j9
  jld j3, j1, 40
  jld j4, j1, 48
  jld j2, j1, 32
  jld j5, j1, 56
  jld j6, j1, 64
  jld j7, j1, 72
  jld j8, j1, 80
  jld j9, j1, 88
  jld j10, j1, 96
  jld j11, j1, 104
  jld j12, j1, 112
  jld j13, j1, 120
  jld j14, j1, 128
  jldi j1, 0
  jret

; The word buffer holds WBN bytes at least. Uses j1 (0 after; every other register kept).
wb_need:
  jldi j1, WBP
  jjmp buf_need

; The question holds QBN bytes at least. Uses j1 (0 after; every other register kept).
qb_need:
  jldi j1, QBP
  jjmp buf_need

; A book ends: the next one starts at the row's next unit (numbering, PASS 1), noted in BKP. Uses j1-j4.
bk_mark:
  jldi j1, 0
  jld j2, j1, PASS
  jldi j3, 1
  jsub j2, j2, j3
  jjnz j2, bkm_done
  jld j2, j1, BKN
  jldi j3, 1
  jadd j2, j2, j3
  jldi j3, 3
  jshl j2, j2, j3
  jst j2, j1, BKP + 16
  jldi j1, BKP
  jcall buf_need
  jld j2, j1, BKN
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, BKP
  jadd j3, j3, j4
  jld j4, j1, NTOK
  jst j4, j3, 0
  jldi j4, 1
  jadd j2, j2, j4
  jst j2, j1, BKN
bkm_done:
  jret

; The letter byte j2 at the end of the word being read (as long as it is: the room grows). Uses j1, j3, j4.
w_put:
  jldi j1, 0
  jld j3, j1, WLEN
  jldi j4, 1
  jadd j4, j3, j4
  jst j4, j1, WBN
  jcall wb_need
  jld j3, j1, WLEN
  jld j4, j1, WBP
  jadd j4, j4, j3
  jstb j2, j4, 0
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, WLEN
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
  jldi j3, 1
  jldadd j3, j1, NLINES
  jld j3, j1, PASS
  jjz j3, lu_count
  jld j3, j1, ROFF              ; (a book of the host, numbering: the next renglon starts at the next byte)
  jjz j3, lu_put
  jld j3, j1, PASS
  jldi j4, 1
  jsub j3, j3, j4
  jjnz j3, lu_put
  jcall renglon_mark
lu_put:
  jldi j1, 0
  jldi j2, 0
  jjmp t_put
lu_count:
  jld j3, j1, NUNITS
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, NUNITS
lu_none:
  jret

; Where the next renglon starts: the byte after the one being read (the end of the book, past it), at ROFF. Uses
; j1-j5.
renglon_mark:
  jldi j1, 0
  jld j3, j1, NBYTES
  jld j4, j1, LEFT
  jsub j3, j3, j4
  jldi j4, 1
  jadd j3, j3, j4
  jld j4, j1, NBYTES
  jsub j4, j4, j3
  jjnn j4, rk_in
  jld j3, j1, NBYTES
rk_in:
  jld j4, j1, ROFFN
  jldi j5, 3
  jshl j5, j4, j5
  jld j2, j1, ROFF
  jadd j5, j5, j2
  jst j3, j5, 0
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j1, ROFFN
  jret

; The number j2 at the end of the row (reading a question: at the end of the question, QBUF; past QMAX units
; they are not kept). Uses j1-j5.
t_put:
  jldi j1, 0
  jld j3, j1, PASS
  jldi j4, 2
  jsub j3, j3, j4
  jjnz j3, tp_book
  jld j3, j1, QN                ; (as long as it is: the room grows)
  jldi j4, 1
  jadd j3, j3, j4
  jldi j4, 3
  jshl j4, j3, j4
  jst j4, j1, QBN
  jcall qb_need
  jld j3, j1, QN
  jldi j4, 3
  jshl j4, j3, j4
  jst j2, j1, QBT
  jld j2, j1, QBP
  jadd j4, j4, j2
  jld j2, j1, QBT
  jst j2, j4, 0
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, QN
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
  jld j5, j1, ROOMGL            ; and whether it came glued to the one before
  jjz j5, tp_glued
  jadd j5, j5, j3
  jldi j6, 1
  jsub j5, j5, j6
  jld j6, j1, WSP
  jldi j4, 1
  jxor j6, j6, j4
  jstb j6, j5, 0
tp_glued:
  jst j1, j1, WSP
  jst j3, j1, NTOK
  jret

; The number of the word at WBP (WLEN bytes) -> j2; a word never seen gets the next. Uses j1-j8, j10, j11.
word_id:
  jldi j1, 0
  jld j2, j1, FNVO
  jld j3, j1, FNVP
  jld j4, j1, WLEN
  jldi j5, 0
  jwhile j4
    jld j6, j1, WBP
    jadd j6, j6, j5
    jldb j6, j6, 0
    jxor j2, j2, j6
    jmul j2, j2, j3
    jldi j6, 1
    jadd j5, j5, j6
    jsub j4, j4, j6
  jwend
  jldi j3, 32
  jshr j3, j2, j3
  jxor j3, j3, j2
  jld j4, j1, WMASK
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
      jld j11, j1, WBP
      jadd j11, j11, j7
      jldb j11, j11, 0
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
    jld j5, j1, WMASK
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
  jld j5, j1, VCNT              ; one more would pass half its places: it doubles first, and the word is looked for
  jldi j6, 1                    ; again in the new one
  jadd j5, j5, j6
  jadd j5, j5, j5
  jld j6, j1, WMASK
  jsub j5, j6, j5
  jldi j6, 63
  jsar j5, j5, j6
  jjz j5, wi_room
  jcall wv_grow
  jjmp word_id
wi_room:
  jld j5, j1, NV                ; and its place by number has room
  jld j6, j1, ICAP
  jsub j5, j5, j6
  jldi j6, 63
  jsar j5, j5, j6
  jjnz j5, wi_put
  jst j4, j1, WGK
  jcall0 j1, wi_grow
  jld j4, j1, WGK
wi_put:
  jld j5, j1, ARPOS             ; and its letters have room
  jld j6, j1, WLEN
  jadd j5, j5, j6
  jld j6, j1, ACAP
  jsub j5, j6, j5
  jldi j6, 63
  jsar j5, j5, j6
  jjz j5, wi_letters
  jst j4, j1, WGK
  jcall0 j1, ra_grow
  jld j4, j1, WGK
wi_letters:
  jldi j5, 1
  jldadd j5, j1, VCNT
  jst j2, j4, 0
  jld j5, j1, WLEN
  jst j5, j4, 16
  jld j6, j1, ARPOS
  jst j6, j4, 8
  jld j7, j1, ROOMA
  jadd j6, j6, j7
  jldi j7, 0
  jwhile j5
    jld j10, j1, WBP
    jadd j10, j10, j7
    jldb j10, j10, 0
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

; The words' table with twice its places: every word moved to the first free place from its hash (two words can share
; a hash: they are told apart by their letters, so no key is compared here), and its place by number (ROOMI) follows
; it; the old one given back. Uses j1-j8 (j9-j14 kept, at WGS: crece.inc's, never in use at once).
wv_grow:
  jldi j1, 0
  jst j9, j1, WGS
  jst j10, j1, WGS + 8
  jst j11, j1, WGS + 16
  jst j12, j1, WGS + 24
  jst j13, j1, WGS + 32
  jst j14, j1, WGS + 40
  jld j11, j1, WMASK
  jldi j2, 1
  jadd j11, j11, j2
  jst j11, j1, WGN              ; its old places
  jldi j2, 6
  jshl j11, j11, j2             ; twice, 32 bytes each
  jcall0 j1, room
  jld j2, j1, ROOMV
  jst j2, j1, WGO
  jst j13, j1, ROOMV
  jld j2, j1, WGN
  jadd j2, j2, j2
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, WMASK
  jld j9, j1, WGO
  jld j10, j1, WGN
  jwhile j10
    jldi j1, 0
    jld j2, j9, 16
    jjz j2, wg_next
    jld j2, j9, 0               ; its first free place from its hash
    jldi j3, 32
    jshr j3, j2, j3
    jxor j3, j3, j2
    jld j4, j1, WMASK
    jand j3, j3, j4
    jldi j8, 1
    jwhile j8
      jldi j4, 5
      jshl j4, j3, j4
      jld j5, j1, ROOMV
      jadd j4, j4, j5
      jld j8, j4, 16
      jjz j8, wg_free
      jldi j5, 1
      jadd j3, j3, j5
      jld j5, j1, WMASK
      jand j3, j3, j5
    wg_free:
    jwend
    jldi j6, 0                  ; moved, 32 bytes
    jldi j7, 4
    jwhile j7
      jadd j5, j9, j6
      jld j8, j5, 0
      jadd j5, j4, j6
      jst j8, j5, 0
      jldi j5, 8
      jadd j6, j6, j5
      jldi j5, 1
      jsub j7, j7, j5
    jwend
    jld j5, j4, 24              ; and its place by number follows it
    jldi j6, 3
    jshl j5, j5, j6
    jld j6, j1, ROOMI
    jadd j5, j5, j6
    jst j4, j5, 0
  wg_next:
    jldi j1, 0
    jldi j2, 32
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j10, 3                   ; the old one given back
  jld j11, j1, WGO
  jcall0 j1, ask
  jld j9, j1, WGS
  jld j10, j1, WGS + 8
  jld j11, j1, WGS + 16
  jld j12, j1, WGS + 24
  jld j13, j1, WGS + 32
  jld j14, j1, WGS + 40
  jret

; The words' letters with room for twice as many (or more, until the word coming fits): copied, the old room given
; back (a word keeps where its letters are from the start, so nothing that points into it moves). Uses j1-j8 (j2
; kept; j9-j14 kept, at WGS).
ra_grow:
  jldi j1, 0
  jst j9, j1, WGS
  jst j10, j1, WGS + 8
  jst j11, j1, WGS + 16
  jst j12, j1, WGS + 24
  jst j13, j1, WGS + 32
  jst j14, j1, WGS + 40
  jst j2, j1, WGD
  jld j3, j1, ARPOS             ; what it needs
  jld j4, j1, WLEN
  jadd j3, j3, j4
  jld j2, j1, ACAP
  jldi j5, 1
  jwhile j5
    jadd j2, j2, j2
    jsub j5, j2, j3
    jldi j6, 63
    jsar j5, j5, j6
  jwend
  jst j2, j1, ACAP
  jldi j3, 8
  jadd j11, j2, j3
  jcall0 j1, room
  jld j9, j1, ROOMA
  jst j9, j1, WGO
  jst j13, j1, ROOMA
  jld j3, j1, ARPOS             ; what it holds, eight bytes at a time
  jldi j6, 0
  jwhile j3
    jadd j5, j9, j6
    jld j8, j5, 0
    jadd j5, j13, j6
    jst j8, j5, 0
    jldi j5, 8
    jadd j6, j6, j5
    jsub j3, j3, j5
    jldi j5, 63
    jsar j5, j3, j5
    jjz j5, ra_more
    jldi j3, 0
  ra_more:
  jwend
  jldi j10, 3
  jld j11, j1, WGO
  jcall0 j1, ask
  jld j2, j1, WGD
  jld j9, j1, WGS
  jld j10, j1, WGS + 8
  jld j11, j1, WGS + 16
  jld j12, j1, WGS + 24
  jld j13, j1, WGS + 32
  jld j14, j1, WGS + 40
  jret

; The places of words by number with twice their places: copied, the old ones given back. Uses j1-j8 (j2 kept;
; j9-j14 kept, at WGS).
wi_grow:
  jldi j1, 0
  jst j9, j1, WGS
  jst j10, j1, WGS + 8
  jst j11, j1, WGS + 16
  jst j12, j1, WGS + 24
  jst j13, j1, WGS + 32
  jst j14, j1, WGS + 40
  jst j2, j1, WGD
  jld j11, j1, ICAP
  jldi j3, 4
  jshl j11, j11, j3
  jcall0 j1, room
  jld j9, j1, ROOMI
  jst j9, j1, WGO
  jst j13, j1, ROOMI
  jld j10, j1, ICAP
  jldi j6, 0
  jwhile j10
    jadd j5, j9, j6
    jld j8, j5, 0
    jadd j5, j13, j6
    jst j8, j5, 0
    jldi j5, 8
    jadd j6, j6, j5
    jldi j5, 1
    jsub j10, j10, j5
  jwend
  jld j2, j1, ICAP
  jadd j2, j2, j2
  jst j2, j1, ICAP
  jldi j10, 3
  jld j11, j1, WGO
  jcall0 j1, ask
  jld j2, j1, WGD
  jld j9, j1, WGS
  jld j10, j1, WGS + 8
  jld j11, j1, WGS + 16
  jld j12, j1, WGS + 24
  jld j13, j1, WGS + 32
  jld j14, j1, WGS + 40
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
  jldi j1, 0                    ; (written in the list of its rooms, if it keeps one: to give them all back)
  jld j10, j1, RLIST
  jjz j10, rm_done
  jld j12, j1, RLN
  jld j11, j10, 0               ; full: a list twice as long, what it had moved to it (Capitan: "no ceilings")
  jsub j11, j12, j11
  jjnz j11, rm_list
  jst j13, j1, RLT
  jld j11, j10, 0
  jadd j11, j11, j11
  jldi j12, 1
  jadd j11, j11, j12
  jldi j12, 3
  jshl j11, j11, j12
  jldi j10, 2
  jldi j12, 0
  jcall ask
  jldi j1, 1
  jadd j1, j13, j1
  jjz j1, rm_none
  jldi j1, 0
  jld j10, j1, RLIST
  jld j11, j10, 0
  jadd j11, j11, j11
  jst j11, j13, 0
  jst j13, j1, RLT + 8
  jld j11, j1, RLN
  jldi j12, 3
  jshl j11, j11, j12
  jldi j14, 8
  jwhile j11
    jadd j10, j10, j14
    jadd j13, j13, j14
    jld j12, j10, 0
    jst j12, j13, 0
    jsub j11, j11, j14
  jwend
  rm_moved:
  jld j11, j1, RLIST            ; the old one given back
  jldi j10, 3
  jcall0 j1, ask
  jld j10, j1, RLT + 8
  jst j10, j1, RLIST
  jld j13, j1, RLT
  jld j12, j1, RLN
rm_list:
  jldi j11, 1
  jadd j11, j12, j11
  jldi j14, 3
  jshl j11, j11, j14
  jadd j11, j11, j10
  jst j13, j11, 0
  jldi j11, 1
  jadd j12, j12, j11
  jst j12, j1, RLN
rm_done:
  jldi j1, 1
  jret
rm_none:
  jldi j1, S_NOMEM
  jcall puts
finish:
  jcall flush
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
  jcall0 j1, putch
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
  jcall0 j1, putch
  jld j2, j1, Q16V
pq_two:
  jjmp putnum

; What it wrote so far, out (request 1; to SINK's file when it has one), and TEXT empty again. Uses j1, j10-j14.
flush:
  jldi j1, 0
  jld j10, j1, SINK
  jjz j10, fl_console
  jldi j11, 1
  jsub j10, j10, j11
  jldi j11, 32
  jshl j10, j10, j11
  jldi j11, 6
  jor j10, j10, j11
  jldi j11, TEXT
  jld j12, j1, POS
  jcall0 j1, ask
  jjmp fl_out
fl_console:
  jldi j10, 1
  jldi j11, TEXT
  jldi j1, 0
  jld j12, j1, POS
  jcall0 j1, ask                ; and into the autopsy, if one is being written (AUTH: its handle plus one)
  jld j10, j1, AUTH
  jjz j10, fl_out
  jldi j11, 1
  jsub j10, j10, j11
  jldi j11, 32
  jshl j10, j10, j11
  jldi j11, 6
  jor j10, j10, j11
  jldi j11, TEXT
  jld j12, j1, POS
  jcall0 j1, ask
fl_out:
  jst j1, j1, POS
  jret

; The text at j1 (ended by a 0) at TEXT + POS, a character at a time (putch: no ceiling). Uses j1-j3 (j1 = 0 after).
puts:
  jldi j3, 0
  jst j1, j3, PUTP
jwhile j2
  jldi j1, 1
  jadd j3, j3, j1
  jldi j1, 0
  jst j3, j1, PUTP
  jcall putch
jwcheck
  jldi j1, 0
  jld j3, j1, PUTP
  jldb j2, j3, 0
jwend
pu_done:
  jldi j1, 0
  jret

; The character j2 at TEXT + POS. When the text is full (TEXTN bytes) it goes out first, to where it goes (flush): what
; is written has no ceiling (Capitan, 2026-11-07: "no ceilings: if tomorrow it grows more, it adjusts itself"). Uses
; j1, j3 (every other register kept, even when the text goes out).
putch:
  jldi j1, 0
  jld j3, j1, POS
  jldi j1, TEXTN
  jsub j1, j3, j1
  jjnz j1, pc_put
  jcall0 j3, pc_out
pc_put:
  jldi j1, 0
  jstb j2, j3, TEXT
  jldi j1, 1
  jadd j3, j3, j1
  jldi j1, 0
  jst j3, j1, POS
  jret

; The text out (flush), every register kept. Uses j1.
pc_out:
  jldi j1, 0
  jst j2, j1, PCS
  jst j3, j1, PCS + 8
  jst j4, j1, PCS + 16
  jst j5, j1, PCS + 24
  jst j6, j1, PCS + 32
  jst j7, j1, PCS + 40
  jst j8, j1, PCS + 48
  jst j9, j1, PCS + 56
  jst j10, j1, PCS + 64
  jst j11, j1, PCS + 72
  jst j12, j1, PCS + 80
  jst j13, j1, PCS + 88
  jst j14, j1, PCS + 96
  jcall0 j1, flush
  jld j2, j1, PCS
  jld j3, j1, PCS + 8
  jld j4, j1, PCS + 16
  jld j5, j1, PCS + 24
  jld j6, j1, PCS + 32
  jld j7, j1, PCS + 40
  jld j8, j1, PCS + 48
  jld j9, j1, PCS + 56
  jld j10, j1, PCS + 64
  jld j11, j1, PCS + 72
  jld j12, j1, PCS + 80
  jld j13, j1, PCS + 88
  jld j14, j1, PCS + 96
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
  jadd j4, j3, j1
pn_put:
  jldi j1, 1
  jsub j4, j4, j1
  jldb j2, j4, DIG
  jcall putch
  jjnz j4, pn_put
  jldi j1, 0
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
  jld j4, j1, ROOMI
  jldx j3, j4, j2
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
  jcall0 j1, mk_learn           ; (what each mark does: its pairs, as a stack)
  jld j11, j1, NV               ; by word: closes, followed by a capital, followed by a word
  jldi j2, 24
  jmul j11, j11, j2
  jcall0 j1, room
  jst j13, j1, ROOMCL
  jldi j9, 1
  jld j10, j1, NTOK
  jldi j2, 2
  jsub j10, j10, j2
  jldi j2, 63                   ; (fewer units than the window: no window; a count left never starts below zero,
  jsar j2, j10, j2               ; or "while not zero" would walk past the row)
  jldi j3, -1
  jxor j2, j2, j3
  jand j10, j10, j2
  jwhile j10
    jldi j1, 0
    jst j9, j1, LMI
    jld j3, j1, ROOMT
    jldx j2, j3, j9
    jjz j2, lm_next
    jst j2, j1, BYTE
    jcall w_mark
    jjz j3, lm_next
    jldi j1, 0                  ; a mark: the first word after it (past other marks), in its renglon
    jld j11, j1, LMI
    lm_after:
      jldi j2, 1
      jadd j11, j11, j2
      jld j3, j1, ROOMT
      jldx j2, j3, j11
      jjz j2, lm_next
      jcall0 j1, w_mark
      jjnz j3, lm_after
    jld j2, j1, BYTE            ; followed by a word: once more; by a capital: once more
    jldi j3, 24
    jmul j2, j2, j3
    jld j3, j1, ROOMCL
    jadd j3, j3, j2
    jldi j4, 1
    jldadd j4, j3, 16
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
  jjmp mk_limits                ; and what a pair's opener opens, its closer closes

; What each mark does (Capitan, 2026-11-07: "find what is a separator, as the point or the comma in a number, what
; divides as a parenthesis or a bracket, as a capital and a point, or two exclamation marks, or two question marks";
; "do not forget the line end: it speaks too"). Every mark of the reading, and the capital (a word that begins with
; one) and the line end as marks too, counted over the row: how many times it comes glued to the unit before it, how
; many the unit after it comes glued to it, how many it stands glued between two digits; and, for every two, how many
; times one comes with the other seen since its own last time (the pairs that compensate, as the parentheses of the
; Capitan's calculator). Its work, by majority: one that the next unit glues to opens; one glued to the one before
; closes when an opener goes with it most times (its pair), and separates when none does; one glued on both sides
; between digits separates inside a number. Nothing is listed: the marks and their pairs come out of the books. By
; mark (a word's number; NV the capital, NV + 1 the line end) at MKC {times, glued before, glued after, between digits,
; last place seen}; by two at MKP {key, opener, closer, times}. Uses j1-j14.
mk_learn:
  jldi j1, 0
  jld j2, j1, ROOMGL
  jjz j2, mkl_done
  jld j11, j1, NV
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 40
  jmul j11, j11, j2
  jcall0 j1, room
  jst j13, j1, MKC
  jldi j2, MKP
  jldi j3, 32
  jcall0 j1, pl_new
  jld j11, j1, NV               ; the marks seen so far (a list)
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jcall0 j1, room
  jst j13, j1, MKL
  jst j1, j1, MKLN
  jldi j9, 1
  jwhile j2
    jst j9, j1, MK1
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ROOMT
    jadd j3, j3, j4
    jld j2, j3, 0
    jjnz j2, mkl_word
    jld j2, j1, NV              ; a line end
    jldi j3, 1
    jadd j2, j2, j3
    jjmp mkl_mark
  mkl_word:
    jst j2, j1, MK2
    jcall0 j1, w_mark
    jjnz j3, mkl_isn
    jld j2, j1, MK1             ; a word: with a capital, a mark too
    jld j3, j1, ROOMCP
    jadd j3, j3, j2
    jldb j3, j3, 0
    jjz j3, mkl_next
    jld j2, j1, NV
    jjmp mkl_mark
  mkl_isn:
    jld j2, j1, MK2
  mkl_mark:
    jst j2, j1, MK3             ; the mark, at place MK1
    jcall mk_note
  mkl_next:
    jldi j1, 0
    jld j9, j1, MK1
    jldi j2, 1
    jadd j9, j9, j2
  jwcheck
    jldi j1, 0
    jld j2, j1, NTOK
    jsub j2, j9, j2
  jwend
mkl_counted:
  jcall mk_stack                ; (its pairs, as a stack)
mkl_done:
  jldi j1, 0
  jret

; The record of mark j2 -> j3 (MKC + 40 j2). Uses j1, j3, j4.
mk_rec:
  jldi j1, 0
  jldi j3, 40
  jmul j3, j2, j3
  jld j4, j1, MKC
  jadd j3, j3, j4
  jret

; Mark MK3 at place MK1: its times, its gluings, between digits, and with every opener seen since its last time.
; Uses j1-j14.
mk_note:
  jldi j1, 0
  jld j2, j1, MK3
  jcall mk_rec
  jst j3, j1, MK5
  jld j2, j3, 0
  jjnz j2, mkc_seen
  jld j4, j1, MKLN              ; (first seen: into the list)
  jldi j5, 3
  jshl j5, j4, j5
  jld j6, j1, MKL
  jadd j5, j5, j6
  jld j6, j1, MK3
  jst j6, j5, 0
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j1, MKLN
mkc_seen:
  jld j3, j1, MK5
  jldi j2, 1
  jldadd j2, j3, 0
  jld j2, j1, MK3               ; (the capital and the line end glue to nothing: they are no unit of their own)
  jld j4, j1, NV
  jsub j4, j2, j4
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, mkc_pairs
  jld j9, j1, MK1               ; glued to the one before (a word, no line end)
  jldi j4, 1
  jsub j10, j9, j4
  jadd j2, j10, j1
  jcall0 j1, mk_tok
  jst j2, j1, MK6
  jjz j2, mkc_after
  jst j1, j1, MK7
  jcall0 j1, w_mark             ; (a word before it: a mark glued to a mark says nothing of either)
  jjnz j3, mkc_after
  jld j9, j1, MK1
  jld j4, j1, ROOMGL
  jadd j4, j4, j9
  jldb j4, j4, 0
  jst j4, j1, MK7
  jjz j4, mkc_after
  jld j3, j1, MK5
  jldi j2, 1
  jldadd j2, j3, 8
mkc_after:
  jld j9, j1, MK1               ; the one after glued to it
  jldi j4, 1
  jadd j9, j9, j4
  jld j2, j1, NTOK
  jsub j2, j9, j2
  jldi j4, 63
  jsar j2, j2, j4
  jjz j2, mkc_pairs
  jadd j2, j9, j1
  jcall0 j1, mk_tok
  jst j2, j1, MK8
  jjz j2, mkc_pairs
  jcall0 j1, w_mark             ; (a word after it)
  jjnz j3, mkc_pairs
  jld j9, j1, MK1
  jldi j4, 1
  jadd j9, j9, j4
  jld j4, j1, ROOMGL
  jadd j4, j4, j9
  jldb j4, j4, 0
  jjz j4, mkc_pairs
  jld j3, j1, MK5
  jldi j2, 1
  jldadd j2, j3, 16
  jld j4, j1, MK7               ; glued on both sides: between two digits?
  jjz j4, mkc_pairs
  jld j2, j1, MK6
  jcall mk_digit
  jjz j2, mkc_pairs
  jld j2, j1, MK8
  jcall mk_digit
  jjz j2, mkc_pairs
  jld j3, j1, MK5
  jldi j2, 1
  jldadd j2, j3, 24
mkc_pairs:                      ; every mark seen since this one's last time goes with it once
  jldi j1, 0
  jld j3, j1, MK5
  jld j2, j3, 32
  jst j2, j1, MK6               ; (its last place)
  jld j2, j1, MK1
  jldi j4, 1
  jadd j2, j2, j4
  jst j2, j3, 32
  jst j1, j1, MK7
  jwhile j3
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, MKL
    jadd j3, j3, j4
    jld j2, j3, 0
    jst j2, j1, MK8
    jld j4, j1, MK3
    jsub j4, j2, j4
    jjz j4, mkc_onext
    jcall mk_rec
    jld j4, j3, 32
    jld j5, j1, MK6
    jsub j4, j5, j4
    jldi j6, 63
    jsar j4, j4, j6
    jjz j4, mkc_onext           ; (not since its last time)
    jld j5, j1, FNVP
    jld j2, j1, MK8
    jmul j2, j2, j5
    jld j3, j1, MK3
    jxor j2, j2, j3
    jmul j5, j2, j5
    jjnz j5, mkc_k
    jldi j5, 1
  mkc_k:
    jldi j2, MKP
    jcall0 j1, pl_take
    jld j2, j1, MK8
    jst j2, j4, 8
    jld j2, j1, MK3
    jst j2, j4, 16
    jldi j2, 1
    jldadd j2, j4, 24
  mkc_onext:
    jldi j1, 0
    jldi j2, 1
    jldadd j2, j1, MK7
  jwcheck
    jldi j1, 0
    jld j2, j1, MK7
    jld j3, j1, MKLN
    jsub j3, j2, j3
  jwend
mkc_done:
  jldi j1, 0
  jret

; j2 = 1 if word j2 begins with a digit. Uses j1-j4.
mk_digit:
  jldi j1, 0
  jld j4, j1, ROOMI
  jldx j3, j4, j2
  jld j4, j3, 16
  jjz j4, mkd_no
  jld j3, j3, 8
  jld j4, j1, ROOMA
  jadd j3, j3, j4
  jldb j3, j3, 0
  jldi j4, 48
  jsub j4, j3, j4
  jldi j2, 63
  jsar j2, j4, j2
  jjnz j2, mkd_no
  jldi j4, 58
  jsub j4, j3, j4
  jldi j2, 63
  jsar j2, j4, j2
  jjz j2, mkd_no
  jldi j2, 1
  jret
mkd_no:
  jldi j2, 0
  jret

; The pairs, as a stack (the Capitan's calculator: "each one that closes closes the last one that opened"): the
; candidates (an opener that compensates with a closer both ways, mk_both) tried from the strongest (the most times)
; down; each one is kept when, with the ones kept before it, the row read with a stack has most of its closer's times
; closing its own opener, the one on top. ":" goes so: when it comes, the last "«" was closed already by "»". The
; capital stays out of the stack (names open and never close). By word: MKO its pair as an opener, MKQ as a closer
; (the pair's number plus one); the pairs at MKPR {opener, closer}, MKPN of them. Uses j1-j14.
mk_stack:
  jldi j1, 0
  jld j11, j1, NV
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jcall0 j1, room
  jst j13, j1, MKO
  jld j11, j1, NV
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jcall0 j1, room
  jst j13, j1, MKQ
  jld j11, j1, MKLN
  jmul j11, j11, j11
  jldi j2, 4
  jshl j11, j11, j2
  jldi j2, 16
  jadd j11, j11, j2
  jcall0 j1, room
  jst j13, j1, MKPR
  jst j1, j1, MKPN
  jld j11, j1, NTOK             ; (the stack: an opener a place at most)
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall0 j1, room
  jst j13, j1, MKS
  mks2_round:                   ; the strongest candidate not tried
    jldi j1, 0
    jst j1, j1, MKBE
    jst j1, j1, MKBT
    jld j9, j1, MKP
    jld j10, j1, MKP + 8
    jldi j2, 1
    jadd j10, j10, j2
    jwhile j10
      jld j2, j9, 0
      jjz j2, mks2_cnext
      jld j2, j9, 24
      jldi j3, 63
      jsar j3, j2, j3
      jjnz j3, mks2_cnext       ; (tried: its times made negative)
      jld j3, j1, MKBT
      jsub j3, j3, j2
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, mks2_cnext
      jld j2, j9, 8             ; (the capital stays out; a mark already in a pair stays as it is)
      jld j3, j1, NV
      jsub j3, j2, j3
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, mks2_cnext
      jld j2, j9, 16
      jld j3, j1, NV
      jsub j3, j2, j3
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, mks2_cnext
      jld j3, j9, 16
      jld j2, j1, MK3
      jst j3, j1, MK3
      jst j9, j1, MK8
      jst j10, j1, MK9
      jst j2, j1, MKX
      jcall0 j1, mk_both
      jld j3, j1, MKX
      jst j3, j1, MK3
      jld j9, j1, MK8
      jld j10, j1, MK9
      jjz j2, mks2_cnext
      jld j2, j9, 24
      jst j2, j1, MKBT
      jst j9, j1, MKBE
    mks2_cnext:
      jld j2, j1, MKP + 24
      jadd j9, j9, j2
      jldi j2, 1
      jsub j10, j10, j2
    jwcheck
      jldi j1, 0
    jwend
  mks2_got:
    jld j9, j1, MKBE
    jjz j9, mks2_done
    jld j2, j9, 24              ; (tried)
    jldi j3, 0
    jsub j2, j3, j2
    jst j2, j9, 24
    jld j2, j9, 8               ; a mark in a pair already: no second pair
    jld j4, j1, MKO
    jldx j3, j4, j2
    jjnz j3, mks2_round
    jld j2, j9, 16
    jld j4, j1, MKQ
    jldx j3, j4, j2
    jjnz j3, mks2_round
    jld j2, j1, MKPN            ; tried with the ones kept: as a pair for now
    jldi j3, 4
    jshl j3, j2, j3
    jld j4, j1, MKPR
    jadd j3, j3, j4
    jld j4, j9, 8
    jst j4, j3, 0
    jld j4, j9, 16
    jst j4, j3, 8
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, MKPN
    jld j3, j9, 8
    jldi j4, 3
    jshl j3, j3, j4
    jld j4, j1, MKO
    jadd j3, j3, j4
    jst j2, j3, 0
    jld j3, j9, 16
    jldi j4, 3
    jshl j3, j3, j4
    jld j4, j1, MKQ
    jadd j3, j3, j4
    jst j2, j3, 0
    jst j2, j1, MKX
    jcall0 j1, mk_run
    jjnz j2, mks2_round         ; most of its closer's times close its own: kept
    jld j2, j1, MKPN            ; else out again
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, MKPN
    jld j9, j1, MKBE
    jld j3, j9, 8
    jldi j4, 3
    jshl j3, j3, j4
    jld j4, j1, MKO
    jadd j3, j3, j4
    jst j1, j3, 0
    jld j3, j9, 16
    jldi j4, 3
    jshl j3, j3, j4
    jld j4, j1, MKQ
    jadd j3, j3, j4
    jst j1, j3, 0
    jjmp mks2_round
mks2_done:
  jldi j1, 0
  jret

; The row read with a stack of the pairs kept: j2 = 1 if most times the closer of pair MKX comes, its opener is on
; top. Uses j1-j14.
mk_run:
  jldi j1, 0
  jst j1, j1, MKSN
  jst j1, j1, MKHIT
  jst j1, j1, MKALL
  jldi j9, 1
  jwhile j2
    jld j4, j1, ROOMT
    jldx j2, j4, j9
    jjz j2, mkrn_next
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, MKQ
    jadd j4, j4, j3
    jld j5, j4, 0
    jjz j5, mkrn_open
    jld j6, j1, MKX             ; a closer: is its opener on top?
    jsub j6, j5, j6
    jjnz j6, mkrn_close
    jld j6, j1, MKALL
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j1, MKALL
  mkrn_close:
    jld j6, j1, MKSN
    jjz j6, mkrn_next
    jldi j7, 1
    jsub j6, j6, j7
    jldi j7, 3
    jshl j7, j6, j7
    jld j8, j1, MKS
    jadd j7, j7, j8
    jld j8, j7, 0
    jsub j8, j8, j5
    jjnz j8, mkrn_next          ; (another one on top: it closes nothing)
    jst j6, j1, MKSN
    jld j6, j1, MKX
    jsub j6, j5, j6
    jjnz j6, mkrn_next
    jld j6, j1, MKHIT
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j1, MKHIT
    jjmp mkrn_next
  mkrn_open:
    jld j4, j1, MKO
    jadd j4, j4, j3
    jld j5, j4, 0
    jjz j5, mkrn_next
    jld j6, j1, MKSN
    jldi j7, 3
    jshl j7, j6, j7
    jld j8, j1, MKS
    jadd j7, j7, j8
    jst j5, j7, 0
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j1, MKSN
  mkrn_next:
    jldi j2, 1
    jadd j9, j9, j2
  jwcheck
    jldi j1, 0
    jld j2, j1, NTOK
    jsub j2, j9, j2
  jwend
mkrn_end:
  jld j2, j1, MKHIT
  jadd j2, j2, j2
  jld j3, j1, MKALL
  jsub j2, j3, j2
  jldi j4, 63
  jsar j2, j2, j4
  jjz j2, mkrn_no
  jldi j2, 1
  jret
mkrn_no:
  jldi j2, 0
  jret

; j2 = 1 if the pair at MKP's entry j9 (opener, closer MK3) opens and compensates both ways. Uses j1-j8.
mk_both:
  jldi j1, 0
  jld j2, j9, 8                 ; an opener?
  jld j3, j1, NV
  jsub j3, j2, j3
  jjz j3, mkb_way
  jcall mk_rec
  jld j4, j3, 16
  jadd j4, j4, j4
  jld j5, j3, 0
  jsub j4, j5, j4
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, mkb_no
mkb_way:
  jld j2, j1, MK3               ; most of the closer's times
  jcall mk_rec
  jld j4, j3, 0
  jld j2, j9, 24
  jadd j2, j2, j2
  jsub j4, j4, j2
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, mkb_no
  jld j6, j1, FNVP              ; and of the opener's: the closer with it, since its own last time
  jld j3, j1, MK3
  jmul j3, j3, j6
  jld j2, j9, 8
  jxor j3, j3, j2
  jmul j5, j3, j6
  jjnz j5, mkb_k
  jldi j5, 1
mkb_k:
  jldi j2, MKP
  jcall0 j1, pl_find
  jld j2, j4, 0
  jjz j2, mkb_no
  jld j7, j4, 24
  jld j2, j9, 8
  jcall mk_rec
  jld j4, j3, 0
  jadd j7, j7, j7
  jsub j4, j4, j7
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, mkb_no
  jldi j2, 1
  jret
mkb_no:
  jldi j2, 0
  jret

; The unit at place j2 of the row -> j2. Uses j1, j3.
mk_tok:
  jldi j1, 0
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ROOMT
  jadd j2, j2, j3
  jld j2, j2, 0
  jret

; The pairs' closers close (Capitan's stack: what an opener opens, its closer closes): of every pair kept, when its
; opener closes a building (ROOMCL), its closer does too ("?" with "¿", "»" with "«", "]" with "["). Uses j1-j8.
mk_limits:
  jldi j1, 0
  jld j9, j1, MKPN
  jld j10, j1, MKPR
  jwhile j9
    jld j2, j10, 0
    jldi j3, 24
    jmul j2, j2, j3
    jld j3, j1, ROOMCL
    jadd j2, j2, j3
    jld j2, j2, 0
    jjz j2, mkm_next
    jld j2, j10, 8
    jldi j3, 24
    jmul j2, j2, j3
    jld j3, j1, ROOMCL
    jadd j2, j2, j3
    jldi j3, 1
    jst j3, j2, 0
  mkm_next:
    jldi j2, 16
    jadd j10, j10, j2
    jldi j2, 1
    jsub j9, j9, j2
  jwend
mkm_done:
  jret

