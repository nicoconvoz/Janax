; Razar awake to the host (Capitan, 2026-11-07: "when it detects the writing of a new book, go there, eat it and come
; back with the clues"). It sleeps until the kernel says that a file of the host's watched folders is new and quiet
; (39: JANAX_VIGIA, and the kernel's rules: no hidden or system folder, owned by the user). If it is text, what Razar
; understands (Capitan: "all the text or code ones serve me"): UTF-8 and no zero byte, every byte of it looked at, it
; writes its address in "come" and launches comer, signing what comer asks (its child: what it may do the porters
; already checked), and sleeps again. The book stays where it is: comer reads it there and the library keeps only its
; clues. Nothing runs while nothing is new.
S_COME  = 0
S_COMER = 8
S_NOVIG = 10h
S_SEEN  = 50h
S_NOTXT = 60h
S_NOMEM = 80h
S_EATS  = 0A0h
S_NOKID = 0C0h
S_SENT  = 100h

QUEUE = 1000h                   ; its window: one request {count, kind, a, b, answer}
POS   = 1028h                   ; what it wrote in TEXT
PATH  = 1030h                   ; the path the kernel gave (a room), its bytes
PATHN = 1038h
BUF   = 1040h                   ; a piece of the file being looked at (a room), its handle, the UTF-8 letter's bytes
HND   = 1048h                   ; still to come, 1 if it is not text, its bytes so far
NEED  = 1050h
BIN   = 1058h
SEENB = 1060h
KID   = 1068h                   ; comer, its child; what waits for its signature (a room)
PEND  = 1070h
TEXT  = 2000h                   ; the lines it writes (TEXTN bytes: full, they go out)
TEXTN = 1000h
PUTP  = 1080h                   ; the text written walked; the registers kept while it goes out (13 qwords)
PCS   = 1088h
DIG   = 3000h                   ; digits of a number being written
FROM  = 1090h                   ; the piece being eaten: from that byte to that one (0: the end); what "come" says, its
TO    = 1098h                   ; bytes (a room)
CB    = 10A0h
CBN   = 10A8h
PIECE = 40h                     ; the bytes of a piece, in 64 KB (cut at the end of a renglon past them): criterion, not
                                ; measurement; comer measured ~115 bytes of memory a byte of text (2 MB 243 MB, 4 MB
                                ; 473 MB), so a piece of 4 MB costs about half a GB however long the book is
PATHC = 98304                   ; a path of the host in UTF-8: 32768 UTF-16 units, 3 bytes each at most
BUFC  = 65536                   ; (the bytes read at once: any number gives the same answer)
include '../../escalon0/janax.inc'
jfirst j1, 4000h

jldi j11, 1                     ; its rooms
jshi j11, 8000h
jcall0 j1, room
jst j13, j1, PATH
jldi j11, 1
jshi j11, 0
jcall0 j1, room
jst j13, j1, BUF
jldi j11, 4096
jcall0 j1, room
jst j13, j1, PEND
jldi j11, 1
jshi j11, 8040h
jcall0 j1, room
jst j13, j1, CB

jwhile j2
  jjnz j13, vg_new
  jldi j10, 29                  ; nothing yet: asleep until something is
  jcall ask
jwcheck
vg_wait:                        ; what is new in the host
  jldi j1, 0
  jldi j10, 39
  jld j11, j1, PATH
  jldi j12, 1
  jshi j12, 8000h
  jcall0 j1, ask
  jldi j2, 1
  jadd j2, j13, j2
jwend
vg_none:
  jldi j1, S_NOVIG
  jcall puts
  jjmp finish
vg_new:
  jst j13, j1, PATHN
  jldi j1, S_SEEN
  jcall puts
  jcall put_path
  jcall0 j1, is_text
  jld j2, j1, BIN
  jjz j2, vg_text
  jldi j1, S_NOTXT
  jcall puts
  jcall flush
  jjmp vg_wait
vg_text:
  jldi j1, S_EATS
  jcall puts
  jcall0 j1, flush              ; a book longer than a piece goes by pieces, each eaten as a book (Capitan: "by
  jst j1, j1, FROM              ; pieces"): what is learned goes from one to the next as from book to book
vg_piece:
  jcall vg_cut
  jcall0 j1, vg_say             ; its address in "come", new
  jldi j10, 12
  jldi j11, S_COME
  jldi j12, 4
  jcall ask
  jldi j10, 4
  jldi j11, S_COME
  jldi j12, 4
  jcall0 j1, ask
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, vg_wait
  jst j13, j1, HND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, CB
  jld j12, j1, CBN
  jcall0 j1, ask
  jld j10, j1, HND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j11, S_COMER             ; comer, its child: the book's clues and silhouettes
  jldi j12, 5
  jcall child
  jldi j11, S_SENT              ; then sentido, eating too: the turns of its skeletons, for every Razar
  jldi j12, 7
  jcall0 j1, child
  jld j2, j1, TO
  jjz j2, vg_eaten
  jst j2, j1, FROM
  jjmp vg_piece
vg_eaten:
  jldi j1, 0                    ; ("come" goes: what it names is eaten)
  jldi j10, 12
  jldi j11, S_COME
  jldi j12, 4
  jcall ask
  jjmp vg_wait

; Where the piece that starts at FROM ends -> TO: past the first line feed after PIECE bytes of it, or 0 if the book
; ends before (SEENB its bytes; a renglon is never cut). Uses j1-j14.
vg_cut:
  jldi j1, 0
  jst j1, j1, TO
  jld j2, j1, FROM
  jldi j3, PIECE
  jshi j3, 0
  jadd j2, j2, j3
  jst j2, j1, NEED
  jld j3, j1, SEENB
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, vc_done
  jldi j10, 37
  jld j11, j1, PATH
  jld j12, j1, PATHN
  jcall0 j1, ask
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, vc_done
  jst j13, j1, HND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 38
  jor j10, j10, j2
  jld j11, j1, NEED
  jcall ask
  jwhilez j2
    jld j9, j1, BUF
    vc_scan:
      jjz j13, vc_more
      jldb j2, j9, 0
      jld j3, j1, NEED
      jldi j4, 1
      jadd j3, j3, j4
      jst j3, j1, NEED
      jadd j9, j9, j4
      jsub j13, j13, j4
      jldi j4, 10
      jsub j2, j2, j4
      jjnz j2, vc_scan
    jld j2, j1, SEENB             ; (the last line feed of the book is no cut)
    jsub j2, j2, j3
    jjz j2, vc_close
    jst j3, j1, TO
    jjmp vc_close
  vc_more:
  jwcheck
    jldi j1, 0
    jld j10, j1, HND
    jldi j2, 32
    jshl j10, j10, j2
    jldi j2, 5
    jor j10, j10, j2
    jld j11, j1, BUF
    jldi j12, 1
    jshi j12, 0
    jcall0 j1, ask
    jldi j2, 1
    jsub j2, j13, j2
    jldi j3, 63
    jsar j2, j2, j3
  jwend
vc_close:
  jldi j1, 0
  jld j10, j1, HND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
vc_done:
  jldi j1, 0
  jst j1, j1, NEED
  jret

; What "come" says into CB, CBN: the address and, for a piece, a line "<FROM> <TO>" (a whole book: the address
; alone, as always). Uses j1-j8.
vg_say:
  jldi j1, 0
  jld j2, j1, PATH
  jld j3, j1, CB
  jld j4, j1, PATHN
  jldi j5, 0
  jwhile j6
    jadd j6, j2, j5
    jldb j6, j6, 0
    jadd j7, j3, j5
    jstb j6, j7, 0
    jldi j6, 1
    jadd j5, j5, j6
  jwcheck
    jsub j6, j5, j4
  jwend
vs_cpd:
  jst j4, j1, CBN
  jld j2, j1, FROM
  jld j3, j1, TO
  jor j2, j2, j3
  jjz j2, vs_done
  jldi j2, 10
  jcall vs_ch
  jld j2, j1, FROM
  jcall vs_num
  jldi j2, 32
  jcall vs_ch
  jld j2, j1, TO
  jcall vs_num
vs_done:
  jldi j1, 0
  jret

; Byte j2 at the end of CB. Uses j1, j3, j4.
vs_ch:
  jldi j1, 0
  jld j3, j1, CB
  jld j4, j1, CBN
  jadd j3, j3, j4
  jstb j2, j3, 0
  jldi j3, 1
  jadd j4, j4, j3
  jst j4, j1, CBN
  jret

; Number j2 in decimal at the end of CB. Uses j1-j8.
vs_num:
  jldi j5, 0                    ; its digits, the lowest first, at DIG
  vn_d:
    jldi j3, 10
    jdiv j4, j2, j3
    jmul j6, j4, j3
    jsub j6, j2, j6
    jldi j3, 48
    jadd j6, j6, j3
    jldi j3, DIG
    jadd j3, j3, j5
    jstb j6, j3, 0
    jldi j3, 1
    jadd j5, j5, j3
    jadd j2, j4, j1
    jldi j1, 0
    jjnz j2, vn_d
  jwhile j5
    jldi j3, 1
    jsub j5, j5, j3
    jldi j3, DIG
    jadd j3, j3, j5
    jldb j2, j3, 0
    jadd j8, j5, j1
    jcall vs_ch
    jadd j5, j8, j1
  jwend
vn_done:
  jldi j1, 0
  jret

; The program of the label at j11 (j12 bytes) launched as its child, with every right it has, and what it asks signed
; until it ends. Uses j1-j14.
child:
  jldi j1, 0
  jldi j10, 15
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 16
  jor j10, j10, j2
  jcall0 j1, ask
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, vg_nokid
  jst j13, j1, KID
jwhilez j2
  jldi j10, 29
  jcall ask
jwcheck
  jcall0 j1, sign_all
  jldi j10, 19
  jld j11, j1, KID
  jcall ask
  jldi j1, 1
  jadd j2, j13, j1
jwend
ch_done:
  jldi j1, 0
  jret
vg_nokid:
  jldi j1, S_NOKID
  jcall puts
  jcall0 j1, flush
  jret

; Every request of its child that waits for its signature, signed (17). Uses j1-j14.
sign_all:
  jldi j1, 0
  jldi j10, 18                  ; what waits: {its number, the child, its kind}
  jld j11, j1, PEND
  jldi j12, 4096
  jcall0 j1, ask
  jld j9, j1, PEND
  jadd j8, j13, j1
  jldi j2, 63
  jsar j2, j8, j2
  jjz j2, sa_some
  jldi j8, 0
sa_some:
  jwhile j8
    jldi j10, 17
    jld j11, j9, 0
    jldi j12, 1
    jcall ask
    jldi j2, 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j8, j8, j2
  jwend
  jldi j1, 0
  jret

; BIN = 0 if the file at PATH is text: every byte of it read (37, read only), none is a zero, and they make whole
; letters of UTF-8 (a lead byte and its continuation bytes, 10xxxxxx); an empty file is nothing to eat. Uses j1-j14.
is_text:
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, BIN
  jst j1, j1, NEED
  jst j1, j1, SEENB
  jldi j10, 37
  jld j11, j1, PATH
  jld j12, j1, PATHN
  jcall0 j1, ask
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, it_out
  jst j13, j1, HND
  jst j1, j1, BIN
jwhilez j2
  jld j2, j1, SEENB
  jadd j2, j2, j13
  jst j2, j1, SEENB
  jld j9, j1, BUF
  jld j8, j1, NEED
  jwhile j13
    jldb j2, j9, 0
    jjz j2, it_bin
    jjz j8, it_lead
    jldi j3, 0C0h               ; a continuation: 10xxxxxx
    jand j3, j2, j3
    jldi j4, 80h
    jsub j3, j3, j4
    jjnz j3, it_bin
    jldi j3, 1
    jsub j8, j8, j3
    jjmp it_next
  it_lead:
    jldi j3, 80h                ; one byte (ASCII), or a lead: two (C2-DF), three (E0-EF), four (F0-F4)
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, it_next
    jldi j3, 0C2h
    jsub j3, j2, j3
    jsar j3, j3, j4
    jjnz j3, it_bin
    jldi j8, 1
    jldi j3, 0E0h
    jsub j3, j2, j3
    jsar j3, j3, j4
    jjnz j3, it_next
    jldi j8, 2
    jldi j3, 0F0h
    jsub j3, j2, j3
    jsar j3, j3, j4
    jjnz j3, it_next
    jldi j8, 3
    jldi j3, 0F5h
    jsub j3, j2, j3
    jsar j3, j3, j4
    jjz j3, it_bin
  it_next:
    jldi j3, 1
    jadd j9, j9, j3
    jsub j13, j13, j3
  jwend
  jst j8, j1, NEED
jwcheck
  jldi j1, 0
  jld j10, j1, HND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, BUF
  jldi j12, 1
  jshi j12, 0
  jcall0 j1, ask
  jldi j2, 1
  jsub j2, j13, j2
  jldi j3, 63
  jsar j2, j2, j3
jwend
jjmp it_end
it_bin:
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, BIN
it_end:
  jldi j1, 0
  jld j2, j1, NEED              ; (a letter cut at the end, or nothing at all: not text)
  jld j3, j1, SEENB
  jjnz j3, it_some
  jldi j2, 1
it_some:
  jjz j2, it_close
  jldi j2, 1
  jst j2, j1, BIN
it_close:
  jld j10, j1, HND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
it_out:
  jldi j1, 0
  jret

; The path at PATH (PATHN bytes) at TEXT + POS. Uses j1-j5.
put_path:
  jldi j1, 0
  jld j6, j1, PATHN
  jld j4, j1, PATH
  jwhile j6
    jldb j2, j4, 0
    jcall putch
    jldi j5, 1
    jadd j4, j4, j5
    jsub j6, j6, j5
  jwend
  jldi j1, 0
  jret

; A new room of j11 bytes (request 2) -> j13 its address; without one, it says so and ends. Uses j1, j10-j14.
room:
  jldi j10, 2
  jldi j12, 0
  jcall ask
  jldi j1, 1
  jadd j1, j13, j1
  jjz j1, rm_none
  jldi j1, 0
  jret
rm_none:
  jldi j1, S_NOMEM
  jcall puts
finish:
  jcall flush
  jhalt

; What it wrote, out (request 1), and TEXT empty again. Uses j1, j10-j14.
flush:
  jldi j10, 1
  jldi j11, TEXT
  jldi j1, 0
  jld j12, j1, POS
  jcall0 j1, ask
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
