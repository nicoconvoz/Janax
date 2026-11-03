; Razar's will (Capitan, 2026-11-03), a lo Janax: the kernel that listens to the school's melody and answers it.
; It builds a box, gives it to its child "hijo" (the school, cardumen_lazo.jsm) as dowry, and the two take turns
; with greetings: the will writes an order in the box, greets the school, and sleeps until it greets back.
;
; The will has 4 things to say; it says one waking 3 bottom pieces. It reads the answer (which top pieces woke) with
; what it learned: for each thing, the share of times each top piece woke when it said it (it knows what it meant,
; so it learns every round), and guesses. Right: it confirms the melody (the school remembers it in tune) and
; sounds it once more (the school settles it). Wrong: it moves one of the pieces it says that thing with. Its dice
; have a fixed seed (12345), so every run is the same run. 200 rounds, then the school's own fingerprint is mixed
; in: j0 is the fingerprint of lazo.pl (nace=7 armonia=1 puertas=1 rounds=200 huella=1), bit for bit.
;
; Room 0 (2000h bytes):
QUEUE = 100h                    ; its window: one request
HIJO = 200h                    ; "hijo"
SAY   = 300h                    ; how it says thing m: 3 bottom pieces at SAY + m*4, in order
READ  = 400h                    ; what it learned: thing g, top piece 48 + j heard READ + (g*16 + j)*8 times
HEARD = 600h                    ; top pieces heard for each thing, in all (a qword each)
SEED  = 640h                    ; its dice
M48   = 648h                    ; 2^48 - 1
BOX   = 650h                    ; the box's address
CHILD = 658h                    ; the school's number
ROUND = 660h
ANS   = 668h                    ; the answer: bit j = top piece 48 + j woke
THING = 670h                    ; what it means this round
BEST  = 678h                    ; what it guessed (-1: nothing yet)
BSUM    = 680h                    ; the best share so far: BSUM / BTOT
BTOT    = 688h
CNT   = 690h                    ; how many top pieces woke
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

jldi j10, 2                     ; the box: 64 bytes
jldi j11, 64
jcall ask
jldi j1, 0
jst j13, j1, BOX
jldi j10, 22                    ; to the school's dowry, to read and write
jadd j11, j13, j1
jldi j12, 3
jcall ask
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

jldi j1, 0                      ; how it says each thing: 3 different bottom pieces from its dice, in order
jldi j2, 4
jwhile j2
  jldi j3, 4
  jmul j4, j1, j3               ; SAY + m*4
  jldi j5, 0                    ; how many it has
  jcall fill
  jldi j3, 1
  jadd j1, j1, j3
  jsub j2, j2, j3
jwend

jldi j1, 0                      ; 200 rounds
jst j1, j1, ROUND
jldi j15, 200
jwhile j15
  jldi j1, 0
  jld j2, j1, ROUND
  jldi j3, 3
  jand j2, j2, j3
  jst j2, j1, THING             ; what it means, in turn
  jldi j3, 1                    ; the order: a signal, with its 3 pieces
  jcall order
  jldi j1, 0                    ; the answer and how many pieces it has
  jld j4, j1, BOX
  jld j2, j4, 16
  jst j2, j1, ANS
  jldi j3, 0
  jldi j5, 16
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
  jldi j9, 4
  jwhile j9
    jldi j1, 0
    jldi j3, 3
    jshl j3, j8, j3
    jld j10, j3, HEARD          ; what it heard for g
    jjz j10, g_next
    jld j2, j1, ANS             ; s = what it heard of these pieces for g
    jldi j11, 0
    jldi j3, 7
    jshl j4, j8, j3             ; READ + g*16*8
    jldi j5, 16
    jwhile j5
      jldi j6, 1
      jand j7, j2, j6
      jjz j7, s_next
      jld j7, j4, READ
      jadd j11, j11, j7
    s_next:
      jldi j6, 1
      jshr j2, j2, j6
      jldi j6, 8
      jadd j4, j4, j6
      jldi j6, 1
      jsub j5, j5, j6
    jwend
    jld j3, j1, BTOT              ; better if s * BTOT > BSUM * heard
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
  jcall rnd                     ; nothing yet: a guess
  jldi j6, 3
  jand j2, j13, j6
  jldi j1, 0
  jst j2, j1, BEST
guessed:
  jldi j1, 0                    ; it knows what it meant: it learns what that sounded like
  jld j8, j1, THING
  jld j2, j1, ANS
  jldi j3, 7
  jshl j4, j8, j3
  jldi j5, 16
  jwhile j5
    jldi j6, 1
    jand j7, j2, j6
    jjz j7, r_next
    jld j7, j4, READ
    jadd j7, j7, j6
    jst j7, j4, READ
  r_next:
    jldi j6, 1
    jshr j2, j2, j6
    jldi j6, 8
    jadd j4, j4, j6
    jldi j6, 1
    jsub j5, j5, j6
  jwend
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
  jldi j3, 3                    ; into the fingerprint: thing * 8 + guess * 2 + right + 1
  jshl j12, j8, j3
  jadd j12, j12, j2
  jadd j12, j12, j2
  jadd j12, j12, j9
  jldi j3, 1
  jadd j12, j12, j3
  jcall mix
  jjz j9, wrong
  jldi j3, 2                    ; right: it confirms the melody, and sounds it once more
  jcall order
  jldi j3, 1
  jcall order
  jjmp next_round
wrong:                          ; wrong: it moves one of the pieces it says that thing with
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
jwend

jldi j3, 3                      ; the end: the school's own fingerprint, mixed in
jcall order
jldi j1, 0
jld j4, j1, BOX
jld j12, j4, 32
jcall mix
jhalt

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

; Order j3 to the school (1 a signal with the pieces of THING, 2 confirm, 3 the end): written in the box, then
; it greets the school and sleeps until the school greets back. Uses j1-j4, j10-j14.
order:
  jldi j1, 0
  jld j4, j1, BOX
  jst j3, j4, 0
  jld j2, j1, THING
  jldi j1, 4
  jmul j2, j2, j1
  jldb j1, j2, SAY
  jstb j1, j4, 8
  jldb j1, j2, SAY + 1
  jstb j1, j4, 9
  jldb j1, j2, SAY + 2
  jstb j1, j4, 10
  jldi j10, 28                  ; it greets the school
  jldi j1, 0
  jld j11, j1, CHILD
  jcall ask
  jldi j10, 29                  ; and sleeps until it greets back
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

; Thing at SAY + j4 has j5 pieces: new ones from its dice (mod 16, a bottom piece) until it has 3 different, then
; in order. Uses j5-j7, j13, j14.
fill:
  jldi j6, 3
  jsub j6, j6, j5                 ; how many are missing
  jwhile j6
    jcall rnd
    jldi j7, 15
    jand j13, j13, j7           ; the piece
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
