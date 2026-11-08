; Razar's will playing with relations (Capitan, 2026-11-08: "that the 7^3 cube learns 16 relations at a time", as it
; learned the language of 16 things to 100%). The same will as voluntad.jsm, with two changes: when the house has
; "cosas" (k things, 4 bytes each, all of them: the 3 bottom pieces it says that thing with, and one unused), it says each thing
; with those pieces and never moves them (they are what the thing holds, not a name it can change); and over the last
; quarter of the rounds it counts what it guessed for each thing, and writes a line "C: thing right all other times"
; for each (its most guessed other thing, and how many times). Two things it keeps confusing are, for the cube, one.
; With "cantos" instead (Capitan, 2026-11-08: "that it hears it"), each thing is a song: for each thing, its notes
; (two bytes how many, then three bytes a note: its bottom pieces). A round sings the whole song, note by note, and
; what the cube answers to all of it (which top piece woke at which step, how many times) is what it heard; it guesses
; the thing whose learned answers that resembles most (as for one signal), and learns it. Pieces are never moved, and
; a right song is not sounded again (a song is many signals already).
;
; Razar's will (Capitan, 2026-11-03), a lo Janax: the kernel that listens to the school's melody and answers it,
; with a cube of any side up to 7 and any number of things (Capitan, 2026-11-06: everything in Janax). It reads its
; parameters from the file "p" (four qwords: the cube's side n, how many things k, how many rounds, the school's
; seed), launches its child "hijo" (the school, cardumen_lazo.jsm), has it born (order 2), and the two talk in words
; (requests 30 say and 31 read).
;
; It says each thing waking 3 bottom pieces. It reads the answer as a melody (which top pieces woke, and at which
; step) with what it learned: for each thing, the share of times each top piece woke at that step when it said it
; (it knows what it meant, so it learns every round), and guesses. Right: it sounds the melody once more (the school
; settles it). Wrong: it moves one of the pieces it says that thing with. Its dice have a fixed seed (12345), so
; every run is the same run. At the end the school's own fingerprint is mixed in: j0 is the fingerprint of lazo.pl
; (armonia=1 huella=1 lee=ritmo, with the same n, k, rounds and seed), bit for bit; and it writes its hits every 50
; rounds, the same line as the model.
;
; Room 0 (2000h bytes); what it learned lives in a room of its own, as big as it needs (request 2).
QUEUE = 100h                    ; its window: one request
HIJO  = 200h                    ; "hijo"
PLAB  = 210h                    ; "p", the parameters file
NSV   = 220h                    ; the parameters: the side n
KV    = 228h                    ; how many things
RNDS  = 230h                    ; how many rounds
NACEV = 238h                    ; the school's seed
M48   = 248h                    ; 2^48 - 1
SEED  = 250h                    ; its dice
CHILD = 258h                    ; the school's number
ROUND = 260h
ANS   = 268h                    ; the answer: bit j = top piece j woke
THING = 270h                    ; what it means this round
BEST  = 278h                    ; what it guessed (-1: nothing yet)
BSUM  = 280h                    ; the best share so far: BSUM / BTOT
BTOT  = 288h
CNT   = 290h                    ; how many top pieces woke
OKC   = 298h                    ; hits in this block of 50 rounds
POS   = 2A0h                    ; how long the line of hits is so far
WORD  = 2A8h                    ; the word it is saying
NNV   = 2B0h                    ; a face: n^2
PV    = 2B8h                    ; pieces: n^3 (a wave lasts fewer steps than there are pieces: each step wakes someone)
PSZ   = 2C0h                    ; P * 8: the stride of a top piece in what it learned
GSZ   = 2C8h                    ; n^2 * P * 8: the stride of a thing
RBASE = 2D0h                    ; where what it learned lives: thing g, top piece j heard at step t at
                                ; RBASE + g * GSZ + j * PSZ + t * 8 (times)
FP    = 2D8h                    ; the school's fingerprint, said at the end
MAIL  = 2E0h                    ; a letter read from its mailbox: who said it, the word
SAY   = 300h                    ; how it says thing m: 3 bottom pieces at SAY + m*4, in order (up to 192 things)
HEARD = 600h                    ; top pieces heard for each thing, in all (a qword each)
STB   = 0C00h                   ; the answer: the step each top piece woke at (a byte each)
TEXT  = 1000h                   ; the line of hits it writes at the end
CLAB  = 0D00h                   ; "cosas"; 1 if its things are said with the pieces given; what it guessed by thing in
FIXED = 0D08h                   ; the last quarter (a room, k * k qwords)
CONF  = 0D10h
SONGS = 0D18h                   ; the songs: 1 if given, their bytes (a room), where each starts (a room), how many
SNG   = 0D20h                   ; bytes; what a song made the cube answer, by top piece and step (a room), the places
SOFF  = 0D28h                   ; it touched (a room), how many, how many answers; the note being sung, the notes
SBYT  = 0D30h                   ; left; the thing meant; "cantos"
SH    = 0D38h
SHL   = 0D40h
SHN   = 0D48h
CNTS  = 0D50h
SNP   = 0D58h
SNN   = 0D60h
STH   = 0D68h
CLAB2 = 0D70h
include '../../escalon0/janax.inc'
jfirst j1, 2000h               ; first order: room 0

jldi j1, 1                      ; 2^48 - 1
jldi j2, 48
jshl j1, j1, j2
jldi j2, 1
jsub j1, j1, j2
jldi j2, 0
jst j1, j2, M48
jldi j1, 3039h                  ; its dice: seed 12345
jst j1, j2, SEED
jldi j0, 0                      ; the fingerprint

jldi j1, 70h                    ; its parameters: open "p" (request 4) and read 32 bytes (request 5)
jst j1, j2, PLAB
jldi j10, 4
jldi j11, PLAB
jldi j12, 1
jcall ask
jldi j1, 32
jshl j10, j13, j1
jldi j1, 5
jor j10, j10, j1
jldi j11, NSV
jldi j12, 32
jcall ask
jldi j13, 0                     ; its sizes
jld j1, j13, NSV
jmul j2, j1, j1
jst j2, j13, NNV
jmul j3, j2, j1
jst j3, j13, PV
jldi j4, 8
jmul j4, j3, j4
jst j4, j13, PSZ
jmul j4, j4, j2
jst j4, j13, GSZ
jld j5, j13, KV                 ; what it learned: a room of k * GSZ bytes (request 2)
jmul j11, j4, j5
jldi j10, 2
jcall ask
jldi j1, 0
jst j13, j1, RBASE

jldi j1, 0                      ; "hijo" = 68 69 6A 6F, launched with every right
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, HIJO
jldi j10, 15
jldi j3, 32
jshl j10, j10, j3
jldi j3, 16
jor j10, j10, j3
jldi j11, HIJO
jldi j12, 4
jcall ask
jldi j1, 0
jst j13, j1, CHILD
jld j2, j1, NACEV               ; the school is born: order 2, side n, the seed
jldi j3, 16
jshl j2, j2, j3
jld j3, j1, NSV
jldi j4, 8
jshl j3, j3, j4
jor j2, j2, j3
jldi j3, 2
jor j2, j2, j3
jst j2, j1, WORD
jcall say

jldi j7, 0                      ; the line of hits: "aciertos cada 50 vueltas (el azar es " 100 / k "%):"
jcall f1
jldi j1, 0
jldi j2, 100
jld j3, j1, KV
jdiv j2, j2, j3
jcall putnum
jcall f2
jldi j1, 0
jst j7, j1, POS
jst j1, j1, OKC

jldi j1, 0                      ; how it says each thing: 3 different bottom pieces from its dice, in order
jld j2, j1, KV
jwhile j2
  jldi j3, 4
  jmul j4, j1, j3               ; SAY + m*4
  jldi j5, 0                    ; how many it has
  jcall fill
  jldi j3, 1
  jadd j1, j1, j3
  jsub j2, j2, j3
jwend

jldi j1, 0                      ; the pieces given, if the house has "cosas": read over the ones of its dice
jst j1, j1, FIXED
jldi j2, 73h
jshi j2, 6173h
jshi j2, 6F63h
jst j2, j1, CLAB
jldi j10, 4
jldi j11, CLAB
jldi j12, 5
jcall ask
jldi j1, 0
jldi j2, 63
jshr j2, j13, j2
jjnz j2, c_none
jldi j2, 32
jshl j10, j13, j2
jldi j2, 5
jor j10, j10, j2
jldi j11, SAY
jld j12, j1, KV
jldi j2, 4
jmul j12, j12, j2
jcall ask
jldi j1, 0
jld j2, j1, KV                  ; (all of them read, or none given: an empty "cosas" is none)
jldi j3, 4
jmul j2, j2, j3
jsub j2, j13, j2
jjnz j2, c_none
jldi j2, 1
jst j2, j1, FIXED
c_none:
jld j11, j1, KV                 ; what it guessed by thing: k * k qwords
jmul j11, j11, j11
jldi j2, 3
jshl j11, j11, j2
jldi j10, 2
jcall ask
jldi j1, 0
jst j13, j1, CONF

jcall songs_read                ; the songs, if the house has "cantos"
jldi j1, 0
jld j2, j1, SONGS
jjnz j2, s_main

jldi j1, 0                      ; the rounds
jst j1, j1, ROUND
jld j15, j1, RNDS
jwhile j15
  jldi j1, 0
  jld j2, j1, ROUND
  jld j3, j1, KV
  jdiv j4, j2, j3
  jmul j4, j4, j3
  jsub j2, j2, j4
  jst j2, j1, THING             ; what it means, in turn
  jldi j3, 1                    ; the order: a signal, with its 3 pieces
  jcall order
  jldi j1, 0                    ; how many pieces the answer has
  jld j2, j1, ANS
  jldi j3, 0
  jld j5, j1, NNV
  jwhile j5
    jldi j6, 1
    jand j7, j2, j6
    jadd j3, j3, j7
    jshr j2, j2, j6
    jsub j5, j5, j6
  jwend
  jst j3, j1, CNT
  jldi j2, 0                    ; what it guesses: the thing whose pieces it heard most, as a share
  jldi j6, 1
  jsub j2, j2, j6
  jst j2, j1, BEST              ; -1
  jldi j2, 0
  jst j2, j1, BSUM
  jldi j2, 1
  jst j2, j1, BTOT
  jldi j8, 0                    ; thing g
  jld j9, j1, KV
  jwhile j9
    jldi j1, 0
    jldi j3, 3
    jshl j3, j8, j3
    jld j10, j3, HEARD          ; what it heard for g
    jjz j10, g_next
    jld j2, j1, ANS             ; s = what it heard of these pieces, at these steps, for g
    jldi j12, 0                 ; top piece j
    jldi j11, 0
    jld j4, j1, GSZ
    jmul j4, j8, j4
    jld j3, j1, RBASE
    jadd j4, j4, j3             ; where thing g starts
    jld j5, j1, NNV
    jwhile j5
      jldi j6, 1
      jand j7, j2, j6
      jjz j7, s_next
      jldb j7, j12, STB         ; its step
      jldi j6, 3
      jshl j7, j7, j6
      jadd j7, j7, j4
      jld j7, j7, 0
      jadd j11, j11, j7
    s_next:
      jldi j6, 1
      jshr j2, j2, j6
      jadd j12, j12, j6
      jldi j6, 0
      jld j6, j6, PSZ
      jadd j4, j4, j6
      jldi j6, 1
      jsub j5, j5, j6
    jwend
    jld j3, j1, BTOT            ; better if s * BTOT > BSUM * heard
    jmul j3, j11, j3
    jld j4, j1, BSUM
    jmul j4, j4, j10
    jsub j4, j4, j3
    jldi j6, 63
    jsar j4, j4, j6
    jjz j4, g_next
    jst j8, j1, BEST
    jst j11, j1, BSUM
    jst j10, j1, BTOT
  g_next:
    jldi j6, 1
    jadd j8, j8, j6
    jsub j9, j9, j6
  jwend
  jldi j1, 0
  jld j2, j1, BEST
  jldi j6, 63
  jsar j3, j2, j6
  jjz j3, guessed               ; something it learned helps
  jcall rnd                     ; nothing yet: a guess, its dice mod k
  jldi j1, 0
  jld j6, j1, KV
  jdiv j2, j13, j6
  jmul j2, j2, j6
  jsub j2, j13, j2
  jst j2, j1, BEST
guessed:
  jldi j1, 0                    ; it knows what it meant: it learns what that sounded like
  jld j8, j1, THING
  jld j2, j1, ANS
  jldi j12, 0
  jld j4, j1, GSZ
  jmul j4, j8, j4
  jld j3, j1, RBASE
  jadd j4, j4, j3
  jld j5, j1, NNV
  jwhile j5
    jldi j6, 1
    jand j7, j2, j6
    jjz j7, r_next
    jldb j7, j12, STB
    jldi j3, 3
    jshl j7, j7, j3
    jadd j7, j7, j4
    jld j3, j7, 0
    jadd j3, j3, j6
    jst j3, j7, 0
  r_next:
    jldi j6, 1
    jshr j2, j2, j6
    jadd j12, j12, j6
    jldi j6, 0
    jld j6, j6, PSZ
    jadd j4, j4, j6
    jldi j6, 1
    jsub j5, j5, j6
  jwend
  jldi j1, 0
  jldi j3, 3
  jshl j3, j8, j3
  jld j7, j3, HEARD
  jld j6, j1, CNT
  jadd j7, j7, j6
  jst j7, j3, HEARD
  jld j2, j1, BEST              ; right: what it guessed is what it meant, and something answered
  jsub j3, j2, j8
  jldi j9, 0
  jjnz j3, judged
  jjz j6, judged
  jldi j9, 1
judged:
  jldi j1, 0                    ; the last quarter: what it guessed for this thing
  jld j3, j1, ROUND
  jldi j4, 2
  jshl j3, j3, j4
  jld j4, j1, RNDS
  jldi j5, 3
  jmul j4, j4, j5
  jsub j3, j3, j4
  jldi j5, 63
  jsar j3, j3, j5
  jjnz j3, j_early
  jld j3, j1, KV
  jmul j3, j8, j3
  jadd j3, j3, j2
  jldi j4, 3
  jshl j3, j3, j4
  jld j4, j1, CONF
  jadd j3, j3, j4
  jld j4, j3, 0
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j3, 0
j_early:
  jldi j3, 3                    ; into the fingerprint: thing * 8 + guess * 2 + right + 1
  jshl j12, j8, j3
  jadd j12, j12, j2
  jadd j12, j12, j2
  jadd j12, j12, j9
  jldi j3, 1
  jadd j12, j12, j3
  jcall mix
  jjz j9, wrong
  jldi j1, 0                    ; right: one more hit in this block
  jld j3, j1, OKC
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, OKC
  jldi j3, 1                    ; and it sounds the melody once more (the school settles it)
  jcall order
  jjmp next_round
wrong:                          ; wrong: it moves one of the pieces it says that thing with
  jldi j1, 0
  jld j3, j1, FIXED
  jjnz j3, next_round           ; (not the pieces given: they are what the thing holds)
  jcall rnd
  jldi j3, 3
  jdiv j4, j13, j3
  jmul j4, j4, j3
  jsub j6, j13, j4              ; j = dice mod 3
  jldi j1, 0
  jld j8, j1, THING
  jldi j3, 4
  jmul j4, j8, j3               ; SAY + m*4
  jjz j6, w_shift0              ; the ones after j move one place back (j = 0: two; 1: one; 2: none)
  jldi j3, 1
  jsub j3, j6, j3
  jjz j3, w_shift1
  jjmp w_filled
w_shift0:
  jldb j7, j4, SAY + 1
  jstb j7, j4, SAY
w_shift1:
  jldb j7, j4, SAY + 2
  jstb j7, j4, SAY + 1
w_filled:
  jldi j5, 2
  jcall fill
next_round:
  jldi j1, 0
  jld j2, j1, ROUND
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ROUND
  jsub j15, j15, j3
  jldi j6, 50                   ; every 50 rounds, a block of hits
  jdiv j7, j2, j6
  jmul j7, j7, j6
  jsub j7, j2, j7
  jjnz j7, no_block
  jcall block
no_block:
jwend

v_end:
jldi j1, 0                      ; the line of hits, written once at the end
jld j4, j1, POS
jldi j5, 0Ah
jstb j5, j4, TEXT
jldi j10, 1
jldi j11, TEXT
jldi j5, 1
jadd j12, j4, j5
jcall ask

jldi j1, 0                      ; what it guessed for each thing: "C: thing right all other times"
jldi j7, 0
jst j1, j1, THING
jld j15, j1, KV
jwhile j15
  jldi j1, 0
  jld j8, j1, THING
  jld j9, j1, KV
  jmul j10, j8, j9
  jldi j3, 3
  jshl j10, j10, j3
  jld j3, j1, CONF
  jadd j10, j10, j3             ; its row
  jldi j11, 0                   ; all
  jldi j12, 0                   ; the other most guessed
  jldi j13, 0                   ; its times
  jldi j14, 0                   ; walking
  jwhile j9
    jldi j3, 3
    jshl j3, j14, j3
    jadd j3, j3, j10
    jld j3, j3, 0
    jadd j11, j11, j3
    jsub j4, j14, j8
    jjz j4, c_self
    jsub j4, j13, j3
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, c_self
    jadd j12, j14, j1
    jadd j13, j3, j1
  c_self:
    jldi j3, 1
    jadd j14, j14, j3
    jsub j9, j9, j3
  jwend
  jldi j3, 43h                  ; "C: "
  jstb j3, j7, TEXT
  jldi j3, 3Ah
  jstb j3, j7, TEXT + 1
  jldi j3, 20h
  jstb j3, j7, TEXT + 2
  jldi j3, 3
  jadd j7, j7, j3
  jadd j2, j8, j1
  jcall c_num
  jldi j3, 3
  jshl j3, j8, j3
  jadd j3, j3, j10
  jld j2, j3, 0
  jcall c_num
  jadd j2, j11, j1
  jcall c_num
  jadd j2, j12, j1
  jcall c_num
  jadd j2, j13, j1
  jcall putnum
  jldi j3, 0Ah
  jstb j3, j7, TEXT
  jldi j3, 1
  jadd j7, j7, j3
  jldi j1, 0
  jld j2, j1, THING
  jadd j2, j2, j3
  jst j2, j1, THING
  jsub j15, j15, j3
jwend
jldi j10, 1
jldi j11, TEXT
jadd j12, j7, j1
jcall ask

jldi j3, 3                      ; the end: the school's own fingerprint, mixed in
jcall order
jldi j1, 0
jld j12, j1, FP
jcall mix
jhalt

; Order j3 to the school (1 a signal with the pieces of THING, 3 the end), said as one word (request 30): the order in
; the low byte, the 3 pieces in the next three. Then it reads the school's answer: the end, one word (its
; fingerprint, to FP); a signal, which top pieces woke (to ANS) and then the step of each, 8 per word (to STB).
; Uses j1-j8, j10-j14.
order:
  jldi j1, 0
  jld j2, j1, THING
  jldi j1, 4
  jmul j2, j2, j1
  jldb j12, j2, SAY + 2
  jldi j1, 8
  jshl j12, j12, j1
  jldb j4, j2, SAY + 1
  jor j12, j12, j4
  jshl j12, j12, j1
  jldb j4, j2, SAY
  jor j12, j12, j4
  jshl j12, j12, j1
  jor j12, j12, j3
  jldi j1, 0
  jst j12, j1, WORD
  jcall say
  jldi j1, 3
  jsub j1, j3, j1
  jjnz j1, o_signal
  jcall hear
  jldi j1, 0
  jld j2, j1, MAIL + 8
  jst j2, j1, FP
  jret
o_signal:
  jcall hear
  jldi j1, 0
  jld j2, j1, MAIL + 8
  jst j2, j1, ANS
  jld j5, j1, NNV               ; (n^2 + 7) / 8 words of steps
  jldi j2, 7
  jadd j5, j5, j2
  jldi j2, 3
  jshr j5, j5, j2
  jldi j7, 0
  jwhile j5
    jcall hear
    jldi j1, 0
    jld j2, j1, MAIL + 8
    jst j2, j7, STB
    jldi j1, 8
    jadd j7, j7, j1
    jldi j1, 1
    jsub j5, j5, j1
  jwend
  jret

; One block of hits added to the line: " %3d%%" of 100 * hits / 50 (= 2 * hits), as the model prints it; the block's
; count starts again. Uses j1-j8.
block:
  jldi j1, 0
  jld j2, j1, OKC
  jadd j2, j2, j2               ; the percentage
  jld j4, j1, POS
  jldi j5, 20h
  jstb j5, j4, TEXT
  jldi j6, 100                  ; hundreds, or a space
  jdiv j7, j2, j6
  jldi j5, 20h
  jjz j7, bk_h
  jldi j5, 30h
  jadd j5, j5, j7
bk_h:
  jstb j5, j4, TEXT + 1
  jldi j6, 10                   ; tens, or a space below 10
  jdiv j8, j2, j6
  jdiv j3, j8, j6
  jmul j3, j3, j6
  jsub j3, j8, j3
  jldi j5, 20h
  jjz j8, bk_t
  jldi j5, 30h
  jadd j5, j5, j3
bk_t:
  jstb j5, j4, TEXT + 2
  jmul j3, j8, j6               ; units
  jsub j3, j2, j3
  jldi j5, 30h
  jadd j5, j5, j3
  jstb j5, j4, TEXT + 3
  jldi j5, 25h                  ; %
  jstb j5, j4, TEXT + 4
  jldi j5, 5
  jadd j4, j4, j5
  jst j4, j1, POS
  jldi j2, 0
  jst j2, j1, OKC
  jret

; The songs: "cantos" read (64 KB at most), where each thing's song starts; all of them there, or none. Uses j1-j14.
songs_read:
  jldi j1, 0
  jst j1, j1, SONGS
  jldi j2, 736Fh
  jshi j2, 746Eh
  jshi j2, 6163h
  jst j2, j1, CLAB2
  jldi j10, 4
  jldi j11, CLAB2
  jldi j12, 6
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, sr_none
  jst j13, j1, STH              ; (its handle, a moment)
  jldi j11, 1
  jldi j2, 16
  jshl j11, j11, j2
  jldi j10, 2
  jcall ask
  jldi j1, 0
  jst j13, j1, SNG
  jld j10, j1, STH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jadd j11, j13, j1
  jldi j12, 1
  jldi j2, 16
  jshl j12, j12, j2
  jcall ask
  jldi j1, 0
  jst j13, j1, SBYT
  jld j11, j1, KV
  jldi j2, 3
  jshl j11, j11, j2
  jldi j10, 2
  jcall ask
  jldi j1, 0
  jst j13, j1, SOFF
  jldi j2, 0                    ; where each starts
  jldi j3, 0
  jld j4, j1, KV
  sr_lap:
    jjz j4, sr_all
    jldi j5, 3
    jshl j5, j3, j5
    jld j6, j1, SOFF
    jadd j5, j5, j6
    jst j2, j5, 0
    jldi j5, 2
    jadd j5, j2, j5
    jld j6, j1, SBYT
    jsub j6, j6, j5
    jldi j7, 63
    jsar j6, j6, j7
    jjnz j6, sr_none
    jld j6, j1, SNG
    jadd j6, j6, j2
    jldb j7, j6, 0
    jldb j8, j6, 1
    jldi j9, 8
    jshl j8, j8, j9
    jor j7, j7, j8
    jldi j8, 3
    jmul j7, j7, j8
    jadd j2, j5, j7
    jldi j5, 1
    jadd j3, j3, j5
    jsub j4, j4, j5
    jjmp sr_lap
sr_all:
  jld j6, j1, SBYT
  jsub j6, j6, j2
  jldi j7, 63
  jsar j6, j6, j7
  jjnz j6, sr_none
  jld j11, j1, NNV              ; what a song made it answer: n^2 * P qwords, and the places touched
  jld j2, j1, PV
  jmul j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jst j11, j1, STH
  jldi j10, 2
  jcall ask
  jldi j1, 0
  jst j13, j1, SH
  jld j11, j1, STH
  jldi j10, 2
  jcall ask
  jldi j1, 0
  jst j13, j1, SHL
  jldi j2, 1
  jst j2, j1, SONGS
sr_none:
  jldi j1, 0
  jret

; One note sung: the three pieces at SNP said as a signal (through the place of thing 191), what it answered into SH
; (each top piece that woke, at its step, once more), the places touched into SHL. Uses j1-j14.
song_note:
  jldi j1, 0
  jld j2, j1, SNP
  jldb j3, j2, 0
  jstb j3, j1, SAY + 764        ; (191 * 4)
  jldb j3, j2, 1
  jstb j3, j1, SAY + 765
  jldb j3, j2, 2
  jstb j3, j1, SAY + 766
  jld j2, j1, THING
  jst j2, j1, STH
  jldi j2, 191
  jst j2, j1, THING
  jldi j3, 1
  jcall order
  jldi j1, 0
  jld j2, j1, STH
  jst j2, j1, THING
  jld j2, j1, ANS
  jldi j12, 0
  jld j5, j1, NNV
  jwhile j5
    jldi j6, 1
    jand j7, j2, j6
    jjz j7, sn_next
    jldb j7, j12, STB
    jld j3, j1, PV
    jmul j3, j12, j3
    jadd j3, j3, j7
    jldi j4, 3
    jshl j4, j3, j4
    jld j6, j1, SH
    jadd j4, j4, j6
    jld j6, j4, 0
    jjnz j6, sn_old
    jld j8, j1, SHN             ; a place touched the first time
    jldi j9, 3
    jshl j9, j8, j9
    jld j10, j1, SHL
    jadd j9, j9, j10
    jst j3, j9, 0
    jldi j9, 1
    jadd j8, j8, j9
    jst j8, j1, SHN
  sn_old:
    jldi j9, 1
    jadd j6, j6, j9
    jst j6, j4, 0
    jld j8, j1, CNTS
    jadd j8, j8, j9
    jst j8, j1, CNTS
  sn_next:
    jldi j6, 1
    jshr j2, j2, j6
    jadd j12, j12, j6
    jsub j5, j5, j6
  jwend
  jret

; The rounds of songs: each round a thing sung whole, guessed by what the cube answered, learned. Uses j1-j15.
s_main:
  jldi j1, 0
  jst j1, j1, ROUND
  jld j15, j1, RNDS
  jwhile j15
    jldi j1, 0
    jld j2, j1, ROUND
    jld j3, j1, KV
    jdiv j4, j2, j3
    jmul j4, j4, j3
    jsub j2, j2, j4
    jst j2, j1, THING
    jst j1, j1, SHN
    jst j1, j1, CNTS
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, SOFF
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j4, j1, SNG
    jadd j3, j3, j4
    jldb j5, j3, 0
    jldb j6, j3, 1
    jldi j7, 8
    jshl j6, j6, j7
    jor j5, j5, j6
    jst j5, j1, SNN
    jldi j6, 2
    jadd j3, j3, j6
    jst j3, j1, SNP
    sm_n:
      jldi j1, 0
      jld j2, j1, SNN
      jjz j2, sm_nd
      jcall song_note
      jldi j1, 0
      jld j2, j1, SNP
      jldi j3, 3
      jadd j2, j2, j3
      jst j2, j1, SNP
      jld j2, j1, SNN
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, SNN
      jjmp sm_n
  sm_nd:
    jldi j2, -1                 ; what it guesses: the thing whose answers that resembles most
    jst j2, j1, BEST
    jst j1, j1, BSUM
    jldi j2, 1
    jst j2, j1, BTOT
    jldi j8, 0
    jld j9, j1, KV
    jwhile j9
      jldi j1, 0
      jldi j3, 3
      jshl j3, j8, j3
      jld j10, j3, HEARD
      jjz j10, sg_next
      jld j4, j1, GSZ
      jmul j4, j8, j4
      jld j3, j1, RBASE
      jadd j4, j4, j3
      jldi j11, 0
      jld j5, j1, SHN
      jld j6, j1, SHL
      jwhile j5
        jld j7, j6, 0
        jldi j3, 3
        jshl j7, j7, j3
        jld j3, j1, SH
        jadd j3, j3, j7
        jld j3, j3, 0
        jadd j7, j7, j4
        jld j7, j7, 0
        jmul j7, j7, j3
        jadd j11, j11, j7
        jldi j3, 8
        jadd j6, j6, j3
        jldi j3, 1
        jsub j5, j5, j3
      jwend
      jld j3, j1, BTOT
      jmul j3, j11, j3
      jld j4, j1, BSUM
      jmul j4, j4, j10
      jsub j4, j4, j3
      jldi j6, 63
      jsar j4, j4, j6
      jjz j4, sg_next
      jst j8, j1, BEST
      jst j11, j1, BSUM
      jst j10, j1, BTOT
    sg_next:
      jldi j6, 1
      jadd j8, j8, j6
      jsub j9, j9, j6
    jwend
    jldi j1, 0
    jld j2, j1, BEST
    jldi j6, 63
    jsar j3, j2, j6
    jjz j3, s_guessed
    jcall rnd
    jldi j1, 0
    jld j6, j1, KV
    jdiv j2, j13, j6
    jmul j2, j2, j6
    jsub j2, j13, j2
    jst j2, j1, BEST
  s_guessed:
    jldi j1, 0                  ; it learns what that song sounded like, and the places go back to nothing
    jld j8, j1, THING
    jld j4, j1, GSZ
    jmul j4, j8, j4
    jld j3, j1, RBASE
    jadd j4, j4, j3
    jld j5, j1, SHN
    jld j6, j1, SHL
    jwhile j5
      jld j7, j6, 0
      jldi j3, 3
      jshl j7, j7, j3
      jld j3, j1, SH
      jadd j3, j3, j7
      jld j9, j3, 0
      jst j1, j3, 0
      jadd j7, j7, j4
      jld j10, j7, 0
      jadd j10, j10, j9
      jst j10, j7, 0
      jldi j3, 8
      jadd j6, j6, j3
      jldi j3, 1
      jsub j5, j5, j3
    jwend
    jldi j3, 3
    jshl j3, j8, j3
    jld j7, j3, HEARD
    jld j6, j1, CNTS
    jadd j7, j7, j6
    jst j7, j3, HEARD
    jld j2, j1, BEST
    jsub j3, j2, j8
    jldi j9, 0
    jjnz j3, s_judged
    jjz j6, s_judged
    jldi j9, 1
  s_judged:
    jld j3, j1, ROUND           ; the last quarter: what it guessed for this thing
    jldi j4, 2
    jshl j3, j3, j4
    jld j4, j1, RNDS
    jldi j5, 3
    jmul j4, j4, j5
    jsub j3, j3, j4
    jldi j5, 63
    jsar j3, j3, j5
    jjnz j3, s_early
    jld j3, j1, KV
    jmul j3, j8, j3
    jadd j3, j3, j2
    jldi j4, 3
    jshl j3, j3, j4
    jld j4, j1, CONF
    jadd j3, j3, j4
    jld j4, j3, 0
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j3, 0
  s_early:
    jldi j3, 3                  ; into the fingerprint: thing * 8 + guess * 2 + right + 1
    jshl j12, j8, j3
    jadd j12, j12, j2
    jadd j12, j12, j2
    jadd j12, j12, j9
    jldi j3, 1
    jadd j12, j12, j3
    jcall mix
    jjz j9, sm_next
    jldi j1, 0
    jld j3, j1, OKC
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, OKC
  sm_next:
    jldi j1, 0
    jld j2, j1, ROUND
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ROUND
    jsub j15, j15, j3
    jldi j6, 50
    jdiv j7, j2, j6
    jmul j7, j7, j6
    jsub j7, j2, j7
    jjnz j7, s_noblock
    jcall block
  s_noblock:
  jwend
  jjmp v_end

; j2 and a space at TEXT + j7 (putnum); j7 moves past them. Keeps j8-j15. Uses j1-j4.
c_num:
  jcall putnum
  jldi j3, 20h
  jstb j3, j7, TEXT
  jldi j3, 1
  jadd j7, j7, j3
  jldi j1, 0
  jret

; j2 (0..999) in decimal at TEXT + j7; j7 moves past it. Uses j1-j4.
putnum:
  jldi j3, 100
  jdiv j4, j2, j3
  jjz j4, pn_tens
  jldi j1, 30h
  jadd j1, j1, j4
  jstb j1, j7, TEXT
  jldi j1, 1
  jadd j7, j7, j1
  jmul j4, j4, j3
  jsub j2, j2, j4
  jldi j3, 10                   ; a middle zero is written
  jdiv j4, j2, j3
  jjmp pn_ten
pn_tens:
  jldi j3, 10
  jdiv j4, j2, j3
  jjz j4, pn_unit
pn_ten:
  jldi j1, 30h
  jadd j1, j1, j4
  jstb j1, j7, TEXT
  jldi j1, 1
  jadd j7, j7, j1
  jmul j4, j4, j3
  jsub j2, j2, j4
pn_unit:
  jldi j1, 30h
  jadd j1, j1, j2
  jstb j1, j7, TEXT
  jldi j1, 1
  jadd j7, j7, j1
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

; The next letter from its mailbox (request 31) into MAIL; while it is empty it sleeps until the doorbell (29), and
; looks again. If nobody is left who could greet it, it ends. Uses j1, j10-j14.
hear:
  jldi j10, 31
  jldi j11, MAIL
  jldi j12, 16
  jcall ask
  jldi j1, 1
  jsub j1, j13, j1
  jjz j1, h_got
  jldi j10, 29
  jcall ask
  jldi j1, 1                    ; nobody is left who could greet it (-1): waiting again would spin for nothing
  jadd j1, j13, j1
  jjz j1, h_alone
  jjmp hear
h_got:
  jret
h_alone:
  jhalt

; Says WORD to the school (request 30). Uses j10-j14.
say:
  jldi j13, 0
  jld j12, j13, WORD
  jldi j10, 30
  jld j11, j13, CHILD
  jcall ask
  jret

; Its dice: seed = (seed * 1103515245 + 12345) mod 2^31 -> j13 = it. Uses j14.
rnd:
  jldi j13, 0
  jld j14, j13, SEED
  jldi j13, 41C6h
  jshi j13, 4E6Dh
  jmul j14, j14, j13
  jldi j13, 3039h
  jadd j14, j14, j13
  jldi j13, 7FFFh
  jshi j13, 0FFFFh
  jand j14, j14, j13
  jldi j13, 0
  jst j14, j13, SEED
  jadd j13, j14, j13
  jret

; Thing at SAY + j4 has j5 pieces: new ones from its dice (mod n^2, a bottom piece) until it has 3 different, then
; in order. Uses j5-j7, j13, j14.
fill:
  jldi j6, 3
  jsub j6, j6, j5               ; how many are missing
  jwhile j6
    jcall rnd
    jldi j7, 0
    jld j7, j7, NNV
    jdiv j14, j13, j7
    jmul j14, j14, j7
    jsub j13, j13, j14          ; the piece
    jjz j5, f_new               ; it has none yet
    jldb j14, j4, SAY           ; is it one it has?
    jsub j14, j14, j13
    jjz j14, f_again
    jldi j14, 1
    jsub j14, j5, j14
    jjz j14, f_new              ; it has only one
    jldb j14, j4, SAY + 1
    jsub j14, j14, j13
    jjz j14, f_again
  f_new:
    jadd j14, j4, j5
    jstb j13, j14, SAY
    jldi j14, 1
    jadd j5, j5, j14
  f_again:
    jldi j6, 3
    jsub j6, j6, j5
  jwend
  jldb j5, j4, SAY              ; in order: three compare-and-swap
  jldb j6, j4, SAY + 1
  jcall order2
  jstb j5, j4, SAY
  jstb j6, j4, SAY + 1
  jldb j5, j4, SAY + 1
  jldb j6, j4, SAY + 2
  jcall order2
  jstb j5, j4, SAY + 1
  jstb j6, j4, SAY + 2
  jldb j5, j4, SAY
  jldb j6, j4, SAY + 1
  jcall order2
  jstb j5, j4, SAY
  jstb j6, j4, SAY + 1
  jret

; j5, j6 -> the smaller in j5, the larger in j6. Uses j7, j13.
order2:
  jsub j7, j6, j5
  jldi j13, 63
  jsar j7, j7, j13
  jjz j7, o2_done               ; already in order
  jxor j5, j5, j6               ; swapped
  jxor j6, j6, j5
  jxor j5, j5, j6
o2_done:
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

; A fixed piece of the line of hits at TEXT + j7; j7 moves past it. Uses j1.
f1:
  jldi j1, 97
  jstb j1, j7, TEXT + 0
  jldi j1, 99
  jstb j1, j7, TEXT + 1
  jldi j1, 105
  jstb j1, j7, TEXT + 2
  jldi j1, 101
  jstb j1, j7, TEXT + 3
  jldi j1, 114
  jstb j1, j7, TEXT + 4
  jldi j1, 116
  jstb j1, j7, TEXT + 5
  jldi j1, 111
  jstb j1, j7, TEXT + 6
  jldi j1, 115
  jstb j1, j7, TEXT + 7
  jldi j1, 32
  jstb j1, j7, TEXT + 8
  jldi j1, 99
  jstb j1, j7, TEXT + 9
  jldi j1, 97
  jstb j1, j7, TEXT + 10
  jldi j1, 100
  jstb j1, j7, TEXT + 11
  jldi j1, 97
  jstb j1, j7, TEXT + 12
  jldi j1, 32
  jstb j1, j7, TEXT + 13
  jldi j1, 53
  jstb j1, j7, TEXT + 14
  jldi j1, 48
  jstb j1, j7, TEXT + 15
  jldi j1, 32
  jstb j1, j7, TEXT + 16
  jldi j1, 118
  jstb j1, j7, TEXT + 17
  jldi j1, 117
  jstb j1, j7, TEXT + 18
  jldi j1, 101
  jstb j1, j7, TEXT + 19
  jldi j1, 108
  jstb j1, j7, TEXT + 20
  jldi j1, 116
  jstb j1, j7, TEXT + 21
  jldi j1, 97
  jstb j1, j7, TEXT + 22
  jldi j1, 115
  jstb j1, j7, TEXT + 23
  jldi j1, 32
  jstb j1, j7, TEXT + 24
  jldi j1, 40
  jstb j1, j7, TEXT + 25
  jldi j1, 101
  jstb j1, j7, TEXT + 26
  jldi j1, 108
  jstb j1, j7, TEXT + 27
  jldi j1, 32
  jstb j1, j7, TEXT + 28
  jldi j1, 97
  jstb j1, j7, TEXT + 29
  jldi j1, 122
  jstb j1, j7, TEXT + 30
  jldi j1, 97
  jstb j1, j7, TEXT + 31
  jldi j1, 114
  jstb j1, j7, TEXT + 32
  jldi j1, 32
  jstb j1, j7, TEXT + 33
  jldi j1, 101
  jstb j1, j7, TEXT + 34
  jldi j1, 115
  jstb j1, j7, TEXT + 35
  jldi j1, 32
  jstb j1, j7, TEXT + 36
  jldi j1, 37
  jadd j7, j7, j1
  jret

; A fixed piece of the line of hits at TEXT + j7; j7 moves past it. Uses j1.
f2:
  jldi j1, 37
  jstb j1, j7, TEXT + 0
  jldi j1, 41
  jstb j1, j7, TEXT + 1
  jldi j1, 58
  jstb j1, j7, TEXT + 2
  jldi j1, 3
  jadd j7, j7, j1
  jret
