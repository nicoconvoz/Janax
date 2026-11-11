; Razar's school (cardumen) in Janax (Capitan, 2026-11-03): the reference model (modelo.pl) with harmony, the top
; face answering, born from seed 7. It runs the same fixed history as huella.pl (40 signals, in turn the 4 things
; the will says) and leaves the same fingerprint in j0, bit for bit: every journey (each piece as step * 64 +
; piece + 1, in order; 4096 between signals), then every final weight and rate; h = (h * 31 + v) mod 2^48.
;
; A cube of 4 * 4 * 4 pieces; piece i = x + 4y + 16z. Each one talks only to its 6 neighbors (depth 1), in the
; directions +x -x +y -y +z -z (d = 0..5; d xor 1 is the opposite one). A signal wakes 3 pieces of the bottom face
; at once; then the wave goes on step by step: a piece wakes when what its neighbors that woke in the step before
; say to it adds up to 100, unless more than half of its own neighbors woke it at once (harmony: a note drowned
; out does not pass). A piece wakes at most once per signal; the top face (pieces 48..63) answers and its branch
; ends there. After each signal: a piece speaks more (+ its rate, up to 255) to a neighbor that woke together with
; it (the same step or the next) and one less to one that did not wake; its rate drops by one, down to 1.
;
; Room 0 (1000h bytes):
W     = 200h                    ; weights: piece i, direction d at W + i*8 + d (one byte each)
RATE  = 400h                    ; one byte per piece
FT    = 500h                    ; the step each piece woke at this signal, 0FFh = not this time
NB    = 600h                    ; neighbors: piece i, direction d at NB + i*8 + d, 0FFh = past the edge
INP   = 800h                    ; what each piece was told this step (a qword each)
MASK  = 0A00h                   ; which neighbors woke it this step (bit d = the neighbor in direction d)
NCNT  = 0A40h                   ; how many neighbors each piece has
SAY   = 0A80h                   ; the 4 things the will says: thing m, piece k at SAY + m*4 + k
M48   = 0B00h                   ; 2^48 - 1
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0

jldi j1, 1                      ; 2^48 - 1
jldi j2, 48
jshl j1, j1, j2
jldi j2, 1
jsub j1, j1, j2
jldi j2, 0
jst j1, j2, M48

jldi j2, 0                      ; what the will says: [0,1,4] [2,3,7] [8,12,13] [10,11,15]
jldi j1, 0
jstb j1, j2, SAY + 0
jldi j1, 1
jstb j1, j2, SAY + 1
jldi j1, 4
jstb j1, j2, SAY + 2
jldi j1, 2
jstb j1, j2, SAY + 4
jldi j1, 3
jstb j1, j2, SAY + 5
jldi j1, 7
jstb j1, j2, SAY + 6
jldi j1, 8
jstb j1, j2, SAY + 8
jldi j1, 12
jstb j1, j2, SAY + 9
jldi j1, 13
jstb j1, j2, SAY + 10
jldi j1, 10
jstb j1, j2, SAY + 12
jldi j1, 11
jstb j1, j2, SAY + 13
jldi j1, 15
jstb j1, j2, SAY + 14

jldi j1, 0                      ; the neighbors of every piece
jldi j2, 64
jwhile j2
  jldi j3, 8
  jmul j4, j1, j3               ; i * 8
  jldi j10, 0                   ; how many neighbors
  jldi j9, 0                    ; the direction
  jldi j3, 3
  jand j5, j1, j3               ; x
  jldi j3, 2
  jshr j6, j1, j3
  jldi j3, 3
  jand j6, j6, j3               ; y
  jldi j3, 4
  jshr j7, j1, j3               ; z
  jldi j3, 3                    ; +x: none if x = 3
  jsub j8, j5, j3
  jldi j12, 1
  jcall nb_set
  jadd j8, j5, j9               ; -x: none if x = 0 (j9 = 1 here: x + 1 - 1)
  jldi j3, 1
  jsub j8, j8, j3
  jldi j12, 0
  jsub j12, j12, j3
  jcall nb_set
  jldi j3, 3                    ; +y
  jsub j8, j6, j3
  jldi j12, 4
  jcall nb_set
  jadd j8, j6, j9               ; -y (j9 = 3 here)
  jldi j3, 3
  jsub j8, j8, j3
  jldi j12, 0
  jldi j3, 4
  jsub j12, j12, j3
  jcall nb_set
  jldi j3, 3                    ; +z
  jsub j8, j7, j3
  jldi j12, 16
  jcall nb_set
  jadd j8, j7, j9               ; -z (j9 = 5 here)
  jldi j3, 5
  jsub j8, j8, j3
  jldi j12, 0
  jldi j3, 16
  jsub j12, j12, j3
  jcall nb_set
  jstb j10, j1, NCNT
  jldi j3, 1
  jadd j1, j1, j3
  jsub j2, j2, j3
jwend

jldi j3, 7                      ; born different: seed 7, seed = (seed * 1103515245 + 12345) mod 2^31,
jldi j4, 41C6h                  ; a weight = (seed >> 16) mod 256
jshi j4, 4E6Dh                  ; 1103515245
jldi j5, 7FFFh
jshi j5, 0FFFFh                 ; 2^31 - 1
jldi j1, 0
jldi j2, 64
jwhile j2
  jldi j6, 8
  jmul j7, j1, j6               ; i * 8
  jldi j8, 6
  jwhile j8
    jmul j3, j3, j4
    jldi j6, 3039h              ; 12345
    jadd j3, j3, j6
    jand j3, j3, j5
    jldi j6, 16
    jshr j9, j3, j6
    jldi j6, 0FFh
    jand j9, j9, j6
    jstb j9, j7, W
    jldi j6, 1
    jadd j7, j7, j6
    jsub j8, j8, j6
  jwend
  jldi j6, 20                   ; its rate
  jstb j6, j1, RATE
  jldi j6, 1
  jadd j1, j1, j6
  jsub j2, j2, j6
jwend

jldi j0, 0                      ; the fingerprint
jldi j15, 0                     ; 40 signals
jldi j14, 40
jwhile j14
  jldi j3, 3
  jand j3, j15, j3              ; the thing it says, in turn
  jcall signal
  jldi j13, 1
  jadd j15, j15, j13
  jldi j13, 40
  jsub j14, j13, j15
jwend

jldi j1, 0                      ; then every final weight and rate
jldi j2, 64
jwhile j2
  jldi j3, 8
  jmul j4, j1, j3
  jldi j5, 6
  jwhile j5
    jldb j12, j4, W
    jcall mix
    jldi j3, 1
    jadd j4, j4, j3
    jsub j5, j5, j3
  jwend
  jldb j12, j1, RATE
  jcall mix
  jldi j3, 1
  jadd j1, j1, j3
  jsub j2, j2, j3
jwend
jhalt

; Direction j9 of piece j1 (slot j4 + j9): none if j8 = 0, else the piece j1 + j12 (and one more neighbor in
; j10). Then the next direction. Uses j11, j13.
nb_set:
  jadd j11, j4, j9
  jjz j8, nb_edge
  jadd j13, j1, j12
  jstb j13, j11, NB
  jldi j13, 1
  jadd j10, j10, j13
  jjmp nb_next
nb_edge:
  jldi j13, 0FFh
  jstb j13, j11, NB
nb_next:
  jldi j13, 1
  jadd j9, j9, j13
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

; One signal: the thing j3 is said, the wave runs, its journey goes into the fingerprint, and the shape learns
; from it. Uses j1-j14.
signal:
  jldi j1, 0                    ; nobody woke yet
  jldi j2, 64
  jldi j13, 0FFh
  jwhile j2
    jstb j13, j1, FT
    jldi j14, 1
    jadd j1, j1, j14
    jsub j2, j2, j14
  jwend
  jldi j4, 4                    ; its 3 pieces wake at step 0
  jmul j4, j3, j4
  jldi j13, 0
  jldb j5, j4, SAY
  jstb j13, j5, FT
  jldb j5, j4, SAY + 1
  jstb j13, j5, FT
  jldb j5, j4, SAY + 2
  jstb j13, j5, FT
  jldi j6, 0                    ; the step
  jldi j1, 0                    ; step 0 into the fingerprint, in order
  jldi j2, 64
  jwhile j2
    jldb j5, j1, FT
    jjnz j5, s0_next
    jldi j13, 1
    jadd j12, j1, j13
    jcall mix
  s0_next:
    jldi j13, 1
    jadd j1, j1, j13
    jsub j2, j2, j13
  jwend
  jldi j7, 1                    ; while someone woke in the last step
  jwhile j7
    jldi j1, 0                  ; nobody told anything yet
    jldi j2, 64
    jldi j13, 0
    jwhile j2
      jldi j14, 8
      jmul j14, j1, j14
      jst j13, j14, INP
      jstb j13, j1, MASK
      jldi j14, 1
      jadd j1, j1, j14
      jsub j2, j2, j14
    jwend
    jldi j1, 0                  ; the ones that woke in this step tell their neighbors (the top face: no)
    jldi j2, 48
    jwhile j2
      jldb j5, j1, FT
      jsub j5, j5, j6
      jjnz j5, sp_next
      jldi j9, 0
      jldi j10, 6
      jwhile j10
        jldi j14, 8
        jmul j11, j1, j14
        jadd j11, j11, j9       ; i * 8 + d
        jldb j8, j11, NB        ; the neighbor
        jldi j14, 0FFh
        jsub j14, j8, j14
        jjz j14, sd_next        ; past the edge
        jldb j14, j8, FT
        jldi j13, 0FFh
        jsub j14, j14, j13
        jjnz j14, sd_next       ; it woke already
        jldb j13, j11, W        ; what it says to it
        jldi j14, 8
        jmul j14, j8, j14
        jld j12, j14, INP
        jadd j12, j12, j13
        jst j12, j14, INP
        jldi j13, 1             ; and from which side: 1 << (d xor 1)
        jxor j14, j9, j13
        jshl j13, j13, j14
        jldb j14, j8, MASK
        jor j14, j14, j13
        jstb j14, j8, MASK
      sd_next:
        jldi j13, 1
        jadd j9, j9, j13
        jsub j10, j10, j13
      jwend
    sp_next:
      jldi j13, 1
      jadd j1, j1, j13
      jsub j2, j2, j13
    jwend
    jldi j13, 1                 ; the next step
    jadd j6, j6, j13
    jldi j7, 0
    jldi j1, 0                  ; who wakes in it, in order
    jldi j2, 64
    jwhile j2
      jldb j5, j1, FT
      jldi j13, 0FFh
      jsub j5, j5, j13
      jjnz j5, wk_next          ; it woke already
      jldi j14, 8
      jmul j14, j1, j14
      jld j5, j14, INP
      jldi j13, 100
      jsub j5, j5, j13
      jldi j13, 63
      jsar j5, j5, j13
      jjnz j5, wk_next          ; told less than 100
      jldb j5, j1, MASK         ; harmony: 2 * (neighbors that woke it) <= its neighbors
      jldi j8, 0
      jldi j10, 6
      jwhile j10
        jldi j13, 1
        jand j14, j5, j13
        jadd j8, j8, j14
        jshr j5, j5, j13
        jsub j10, j10, j13
      jwend
      jadd j8, j8, j8
      jldb j5, j1, NCNT
      jsub j5, j5, j8
      jldi j13, 63
      jsar j5, j5, j13
      jjnz j5, wk_next          ; drowned out: it does not pass
      jstb j6, j1, FT           ; it wakes
      jldi j7, 1
      jldi j13, 64
      jmul j12, j6, j13
      jadd j12, j12, j1
      jldi j13, 1
      jadd j12, j12, j13
      jcall mix
    wk_next:
      jldi j13, 1
      jadd j1, j1, j13
      jsub j2, j2, j13
    jwend
  jwend
  jldi j12, 4096                ; between signals
  jcall0 j1, mix                ; the shape learns
  jldi j2, 64
  jwhile j2
    jldb j5, j1, FT
    jldi j13, 0FFh
    jsub j14, j5, j13
    jjz j14, ln_next            ; it did not wake
    jldi j9, 0
    jldi j10, 6
    jwhile j10
      jldi j14, 8
      jmul j11, j1, j14
      jadd j11, j11, j9
      jldb j8, j11, NB
      jldi j14, 0FFh
      jsub j14, j8, j14
      jjz j14, l_next           ; past the edge
      jldb j12, j8, FT
      jldi j14, 0FFh
      jsub j14, j12, j14
      jjz j14, l_weaken         ; it did not wake
      jsub j14, j12, j5         ; together: (ft[q] - ft[i])^2 <= 1
      jmul j14, j14, j14
      jldi j13, 2
      jsub j14, j14, j13
      jldi j13, 63
      jsar j14, j14, j13
      jjz j14, l_next
      jldb j13, j11, W          ; it speaks more: + its rate, up to 255
      jldb j14, j1, RATE
      jadd j13, j13, j14
      jldi j14, 255
      jsub j14, j14, j13
      jldi j12, 63
      jsar j14, j14, j12
      jjz j14, l_store
      jldi j13, 255
    l_store:
      jstb j13, j11, W
      jjmp l_next
    l_weaken:                   ; it speaks one less, down to 0
      jldb j13, j11, W
      jjz j13, l_next
      jldi j14, 1
      jsub j13, j13, j14
      jstb j13, j11, W
    l_next:
      jldi j13, 1
      jadd j9, j9, j13
      jsub j10, j10, j13
    jwend
    jldb j13, j1, RATE          ; its rate drops by one, down to 1
    jldi j14, 1
    jsub j14, j13, j14
    jjz j14, ln_next
    jldi j14, 1
    jsub j13, j13, j14
    jstb j13, j1, RATE
  ln_next:
    jldi j13, 1
    jadd j1, j1, j13
    jsub j2, j2, j13
  jwend
  jret
