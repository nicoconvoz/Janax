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
TEXT  = 2000h                   ; the lines it writes
DIG   = 3000h                   ; digits of a number being written
PATHC = 98304                   ; a path of the host in UTF-8: 32768 UTF-16 units, 3 bytes each at most
BUFC  = 65536                   ; (the bytes read at once: any number gives the same answer)
include '../../escalon0/janax.inc'
jfirst j1, 4000h

jldi j11, 1                     ; its rooms
jshi j11, 8000h
jcall room
jldi j1, 0
jst j13, j1, PATH
jldi j11, 1
jshi j11, 0
jcall room
jldi j1, 0
jst j13, j1, BUF
jldi j11, 4096
jcall room
jldi j1, 0
jst j13, j1, PEND

vg_wait:                        ; what is new in the host
  jldi j1, 0
  jldi j10, 39
  jld j11, j1, PATH
  jldi j12, 1
  jshi j12, 8000h
  jcall ask
  jldi j1, 0
  jldi j2, 1
  jadd j2, j13, j2
  jjz j2, vg_none
  jjnz j13, vg_new
  jldi j10, 29                  ; nothing yet: asleep until something is
  jcall ask
  jjmp vg_wait
vg_none:
  jldi j1, S_NOVIG
  jcall puts
  jjmp finish
vg_new:
  jst j13, j1, PATHN
  jldi j1, S_SEEN
  jcall puts
  jcall put_path
  jcall is_text
  jldi j1, 0
  jld j2, j1, BIN
  jjz j2, vg_text
  jldi j1, S_NOTXT
  jcall puts
  jcall flush
  jjmp vg_wait
vg_text:
  jldi j1, S_EATS
  jcall puts
  jcall flush
  jldi j1, 0                    ; its address in "come", new
  jldi j10, 12
  jldi j11, S_COME
  jldi j12, 4
  jcall ask
  jldi j10, 4
  jldi j11, S_COME
  jldi j12, 4
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, vg_wait
  jst j13, j1, HND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, PATH
  jld j12, j1, PATHN
  jcall ask
  jldi j1, 0
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
  jcall child
  jldi j1, 0                    ; ("come" goes: what it names is eaten)
  jldi j10, 12
  jldi j11, S_COME
  jldi j12, 4
  jcall ask
  jjmp vg_wait

; The program of the label at j11 (j12 bytes) launched as its child, with every right it has, and what it asks signed
; until it ends. Uses j1-j14.
child:
  jldi j1, 0
  jldi j10, 15
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 16
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, vg_nokid
  jst j13, j1, KID
ch_serve:                       ; what it asks, signed, until it ends
  jcall sign_all
  jldi j1, 0
  jldi j10, 19
  jld j11, j1, KID
  jcall ask
  jldi j1, 1
  jadd j2, j13, j1
  jjnz j2, ch_done              ; (-1 while it runs)
  jldi j10, 29
  jcall ask
  jjmp ch_serve
ch_done:
  jldi j1, 0
  jret
vg_nokid:
  jldi j1, S_NOKID
  jcall puts
  jcall flush
  jldi j1, 0
  jret

; Every request of its child that waits for its signature, signed (17). Uses j1-j14.
sign_all:
  jldi j1, 0
  jldi j10, 18                  ; what waits: {its number, the child, its kind}
  jld j11, j1, PEND
  jldi j12, 4096
  jcall ask
  jldi j1, 0
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
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, it_out
  jst j13, j1, HND
  jst j1, j1, BIN
it_read:
  jldi j1, 0
  jld j10, j1, HND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, BUF
  jldi j12, 1
  jshi j12, 0
  jcall ask
  jldi j1, 0
  jldi j2, 1
  jsub j2, j13, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, it_end
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
  jjmp it_read
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
  jld j2, j1, POS
  jld j3, j1, PATHN
  jld j4, j1, PATH
  jwhile j3
    jldb j5, j4, 0
    jstb j5, j2, TEXT
    jldi j5, 1
    jadd j4, j4, j5
    jadd j2, j2, j5
    jsub j3, j3, j5
  jwend
  jst j2, j1, POS
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
