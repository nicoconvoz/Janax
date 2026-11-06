; Razar's school as a cabin that listens to its will (Capitan, 2026-11-03), a lo Janax. The two talk in words
; (Capitan, 2026-11-06: the greeting carries a word; requests 30 say and 31 read): it hears its mother's order as a
; word, does it, and answers with words. Each keeps its own copy of "the box", which the words fill:
;   1 a signal: the 3 bottom pieces at box + 8 wake; the answer (bit j = top piece 48 + j woke) goes to box + 16,
;     and the step each top piece woke at (a byte each, 0FFh = not then) to box + 48
;   3 the end: its own fingerprint (every weight, rate and fragment) goes to box + 32, and it ends
; The school is the reference model (modelo.pl) with harmony and the top face answering, no doors, born from
; seed 7: the loop of both cabins gives the fingerprint of lazo.pl (huella=1), bit for bit.
;
; Room 0 (2000h bytes):
QUEUE = 100h                    ; its window: one request
W     = 200h                    ; weights: piece i, direction d at W + i*8 + d
RATE  = 400h
FT    = 500h                    ; the step each piece woke at in the last signal, 0FFh = not then
NB    = 600h                    ; neighbors: piece i, direction d at NB + i*8 + d, 0FFh = past the edge
INP   = 800h                    ; what each piece was told this step (a qword each)
MASK  = 0A00h                   ; which neighbors woke it this step
NCNT  = 0A40h                   ; how many neighbors each piece has
FRAG  = 0A80h                   ; its fragment of the last melody: which neighbors woke it
M48   = 0B00h                   ; 2^48 - 1
BOXA  = 0B08h                   ; the box's address: LBOX, its own copy
LBOX  = 0D00h                   ; the box, as the words fill it (64 bytes)
MAIL  = 0D40h                   ; a letter read from its mailbox: who said it, the word
include '../../escalon0/janax.inc'
jfirst j1, 2000h               ; first order: room 0

jldi j1, 1                      ; 2^48 - 1
jldi j2, 48
jshl j1, j1, j2
jldi j2, 1
jsub j1, j1, j2
jldi j2, 0
jst j1, j2, M48
jldi j1, LBOX                   ; its copy of the box, in its own room: the words fill it
jst j1, j2, BOXA

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


jldi j15, 1                     ; it listens until the end
jwhile j15
  jcall hear                    ; the order, as a word (sleeping until it comes, costing nothing)
  jldi j13, 0
  jld j1, j13, BOXA
  jld j2, j1, 0                 ; the order
  jldi j13, 1
  jsub j3, j2, j13
  jjnz j3, not_signal
  jcall signal
  jjmp answered
not_signal:
  jcall fingerprint             ; the end: its fingerprint, as one word
  jldi j6, 32
  jcall say
  jhalt
answered:
  jldi j6, 16                   ; it answers with three words: which top pieces woke, and the step of each
  jcall say
  jldi j6, 48
  jcall say
  jldi j6, 56
  jcall say
jwend
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

; The next order from its mailbox (request 31); while it is empty it sleeps until the doorbell (29), and looks again.
; The word is the order in its low byte and the 3 pieces in the next three: into its box, at 0 and at 8, 9, 10.
; Uses j1, j2, j4, j10-j14.
hear:
  jldi j10, 31
  jldi j11, MAIL
  jldi j12, 16
  jcall ask
  jldi j1, 1
  jsub j1, j13, j1
  jjz j1, heard
  jldi j10, 29
  jcall ask
  jjmp hear
heard:
  jldi j1, 0
  jld j4, j1, BOXA
  jld j2, j1, MAIL + 8
  jldi j1, 0FFh
  jand j13, j2, j1
  jst j13, j4, 0
  jldi j1, 8
  jshr j2, j2, j1
  jstb j2, j4, 8
  jshr j2, j2, j1
  jstb j2, j4, 9
  jshr j2, j2, j1
  jstb j2, j4, 10
  jret

; Says to its mother (P0, request 30) the word at box + j6. Uses j4, j10-j14.
say:
  jldi j13, 0
  jld j4, j13, BOXA
  jadd j4, j4, j6
  jld j12, j4, 0
  jldi j10, 30
  jldi j11, 0
  jcall ask
  jret

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

; One signal: the 3 pieces at box + 8 wake, the wave runs (harmony, the top face answering), the answer
; goes to box + 16, and the shape learns from it. Uses j1-j14.
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
  jldi j13, 0                   ; its 3 pieces wake at step 0
  jld j4, j13, BOXA
  jldb j5, j4, 8
  jstb j13, j5, FT
  jldb j5, j4, 9
  jstb j13, j5, FT
  jldb j5, j4, 10
  jstb j13, j5, FT
  jldi j6, 0                    ; the step
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
    jldi j1, 0                  ; who wakes in it
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
    wk_next:
      jldi j13, 1
      jadd j1, j1, j13
      jsub j2, j2, j13
    jwend
  jwend
  jldi j3, 0                    ; the answer: which top pieces woke
  jldi j1, 48
  jldi j2, 16
  jldi j9, 0
  jwhile j2
    jldb j5, j1, FT
    jldi j13, 0FFh
    jsub j5, j5, j13
    jjz j5, an_next
    jldi j13, 1
    jshl j13, j13, j9
    jor j3, j3, j13
  an_next:
    jldi j13, 1
    jadd j1, j1, j13
    jadd j9, j9, j13
    jsub j2, j2, j13
  jwend
  jldi j13, 0
  jld j4, j13, BOXA
  jst j3, j4, 16
  jld j3, j13, FT + 48          ; and its rhythm: the step each top piece woke at (a byte each, 0FFh = not), box + 48
  jst j3, j4, 48
  jld j3, j13, FT + 56
  jst j3, j4, 56
  jldi j1, 0                    ; the shape learns
  jldi j2, 64
  jwhile j2
    jldb j5, j1, FT
    jldi j13, 0FFh
    jsub j14, j5, j13
    jjz j14, ln_next            ; it did not wake
    jldi j3, 0                  ; its fragment
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
      jsub j14, j12, j5         ; ft[q] - ft[i]
      jjz j5, l_nofrag          ; its fragment: the neighbors that woke one step before it (not at step 0)
      jldi j13, 1
      jadd j13, j14, j13
      jjnz j13, l_nofrag
      jldi j13, 1
      jshl j13, j13, j9
      jor j3, j3, j13
    l_nofrag:
      jmul j14, j14, j14        ; together: (ft[q] - ft[i])^2 <= 1
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
    jstb j3, j1, FRAG
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

; Its own fingerprint to box + 32: for every piece its 6 weights, its rate and its fragment. Uses j0-j14.
fingerprint:
  jldi j0, 0
  jldi j1, 0
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
    jldb j12, j1, FRAG
    jcall mix
    jldi j3, 1
    jadd j1, j1, j3
    jsub j2, j2, j3
  jwend
  jldi j13, 0
  jld j4, j13, BOXA
  jst j0, j4, 32
  jret
