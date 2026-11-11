; Razar's school as a cabin that listens to its will (Capitan, 2026-11-03), a lo Janax, with a cube of any side up to
; 7 (Capitan, 2026-11-06: everything in Janax). The two talk in words (requests 30 say and 31 read): it hears its
; mother's order as a word, does it, and answers with words:
;   2 born: a cube of side n (bits 8..15) from the seed in bits 16..: n^3 pieces, the bottom face z = 0 (n^2 pieces,
;     the ones a signal wakes) and the top face z = n - 1 (the n^2 pieces that answer). No answer.
;   1 a signal: the 3 bottom pieces in bytes 1, 2, 3 wake; the wave runs (harmony, the top face answering); the shape
;     learns from it. It answers which top pieces woke (bit j = top piece j), then the step each woke at (a byte each,
;     0FFh = not then), 8 per word.
;   3 the end: its own fingerprint (every weight, rate and fragment), as one word, and it ends.
; The school is the reference model (modelo.pl) with harmony and the top face answering, no doors: the loop of both
; cabins gives the fingerprint of lazo.pl (huella=1), bit for bit.
;
; Room 0 (8000h bytes). Every table stays below what a load's offset reaches (7FFFh): that is what caps the side at
; 7 (343 pieces); a bigger cube would put the tables' addresses in registers.
QUEUE = 100h                    ; its window: one request (40 bytes: nothing else may live there)
M48   = 180h                    ; 2^48 - 1
NSIDE = 188h                    ; the side n
P     = 190h                    ; pieces: n^3
NN    = 198h                    ; a face: n^2
TOPS  = 1A0h                    ; the first piece of the top face: n^3 - n^2
MAIL  = 1C0h                    ; a letter read from its mailbox: who said it, the word
WORD  = 1D0h                    ; the word it is saying
KEY3  = 1D8h                    ; the 3 pieces a signal wakes (a qword each)
MASKT = 1F0h                    ; the answer: which top pieces woke
W     = 1000h                   ; weights: piece i, direction d at W + i*8 + d (one byte each)
RATE  = 1C00h                   ; one byte per piece
MASK  = 1E00h                   ; which neighbors woke it this step (bit d = the neighbor in direction d)
NCNT  = 2000h                   ; how many neighbors each piece has
FRAG  = 2200h                   ; its fragment of the last melody: which neighbors woke it
STEPB = 2400h                   ; the answer: the step each top piece woke at (a byte each, 0FFh = not then)
FT    = 2500h                   ; the step each piece woke at in the last signal (a qword each), -1 = not then
INP   = 3000h                   ; what each piece was told this step (a qword each)
NB    = 3C00h                   ; neighbors: piece i, direction d at NB + (i*6 + d)*8 (a qword each), -1 = past the edge
include '../../escalon0/janax.inc'
jfirst j1, 8000h               ; first order: room 0

jldi j1, 1                      ; 2^48 - 1
jldi j2, 48
jshl j1, j1, j2
jldi j2, 1
jsub j1, j1, j2
jldi j2, 0
jst j1, j2, M48

jldi j15, 1                     ; it listens until the end
jwhile j15
  jcall hear                    ; the order, as a word (sleeping until it comes, costing nothing)
  jldi j13, 0
  jld j2, j13, MAIL + 8
  jldi j1, 0FFh
  jand j1, j2, j1
  jldi j3, 2
  jsub j3, j1, j3
  jjz j3, o_born
  jldi j3, 1
  jsub j3, j1, j3
  jjnz j3, o_end
  jldi j3, 8                    ; a signal: its 3 pieces
  jshr j2, j2, j3
  jldi j4, 0FFh
  jand j5, j2, j4
  jst j5, j13, KEY3
  jshr j2, j2, j3
  jand j5, j2, j4
  jst j5, j13, KEY3 + 8
  jshr j2, j2, j3
  jand j5, j2, j4
  jst j5, j13, KEY3 + 16
  jcall signal
  jcall answer
  jjmp o_next
o_born:
  jldi j3, 8
  jshr j4, j2, j3
  jldi j3, 0FFh
  jand j4, j4, j3
  jldi j3, 16
  jshr j3, j2, j3
  jcall born
  jjmp o_next
o_end:
  jcall fingerprint             ; the end: its fingerprint, as one word
  jldi j13, 0
  jst j0, j13, WORD
  jcall say
  jhalt
o_next:
jwend
jhalt

; Born: a cube of side j4 from the seed j3. Its sizes, every piece's neighbors (+x -x +y -y +z -z, d xor 1 the
; opposite one), and its weights, born different: seed = (seed * 1103515245 + 12345) mod 2^31, a weight =
; (seed >> 16) mod 256, in order; every rate 20, every fragment 0. Uses j1-j14.
born:
  jldi j13, 0
  jst j4, j13, NSIDE
  jmul j5, j4, j4
  jst j5, j13, NN
  jmul j6, j5, j4
  jst j6, j13, P
  jsub j7, j6, j5
  jst j7, j13, TOPS
  jldi j1, 0                    ; piece i
  jld j2, j13, P
  jwhile j2
    jldi j13, 0
    jld j4, j13, NSIDE
    jdiv j7, j1, j4             ; x = i mod n
    jmul j7, j7, j4
    jsub j5, j1, j7
    jdiv j7, j1, j4             ; y = (i / n) mod n
    jdiv j8, j7, j4
    jmul j8, j8, j4
    jsub j6, j7, j8
    jld j8, j13, NN             ; z = i / n^2
    jdiv j7, j1, j8
    jldi j10, 0                 ; how many neighbors
    jldi j9, 0                  ; the slot: NB + i*48
    jldi j11, 48
    jmul j9, j1, j11
    jldi j11, 1                 ; +x: none if x = n - 1
    jsub j12, j4, j11
    jsub j12, j5, j12
    jldi j3, 1
    jcall nb_set
    jadd j12, j5, j0            ; -x: none if x = 0
    jsub j12, j12, j0
    jldi j3, 0
    jldi j11, 1
    jsub j3, j3, j11
    jcall nb_set
    jsub j12, j4, j11           ; +y: none if y = n - 1
    jsub j12, j6, j12
    jadd j3, j4, j0
    jsub j3, j3, j0
    jcall nb_set
    jadd j12, j6, j0            ; -y: none if y = 0
    jsub j12, j12, j0
    jldi j3, 0
    jsub j3, j3, j4
    jcall nb_set
    jldi j11, 1                 ; +z: none if z = n - 1
    jsub j12, j4, j11
    jsub j12, j7, j12
    jadd j3, j8, j0
    jsub j3, j3, j0
    jcall nb_set
    jadd j12, j7, j0            ; -z: none if z = 0
    jsub j12, j12, j0
    jldi j3, 0
    jsub j3, j3, j8
    jcall nb_set
    jstb j10, j1, NCNT
    jldi j11, 0
    jstb j11, j1, FRAG
    jldi j11, 20                ; its rate
    jstb j11, j1, RATE
    jldi j11, 1
    jadd j1, j1, j11
    jsub j2, j2, j11
  jwend
  jldi j13, 0                   ; the weights, from the seed (it came in j3: it is kept in MAIL meanwhile)
  jld j3, j13, MAIL + 8
  jldi j1, 16
  jshr j3, j3, j1
  jldi j4, 41C6h
  jshi j4, 4E6Dh                ; 1103515245
  jldi j5, 7FFFh
  jshi j5, 0FFFFh               ; 2^31 - 1
  jldi j1, 0
  jld j2, j13, P
  jldi j6, 8
  jmul j2, j2, j6               ; 6 weights a piece, in slots of 8
  jwhile j2
    jldi j6, 7
    jand j6, j1, j6
    jldi j7, 6
    jsub j6, j6, j7
    jldi j7, 63
    jsar j6, j6, j7
    jjz j6, b_skip              ; slots 6 and 7 of each piece: no weight
    jmul j3, j3, j4
    jldi j6, 3039h              ; 12345
    jadd j3, j3, j6
    jand j3, j3, j5
    jldi j6, 16
    jshr j9, j3, j6
    jldi j6, 0FFh
    jand j9, j9, j6
    jstb j9, j1, W
  b_skip:
    jldi j6, 1
    jadd j1, j1, j6
    jsub j2, j2, j6
  jwend
  jret

; Direction slot j9 of piece j1: past the edge if j12 = 0, else the piece j1 + j3 (and one more neighbor in j10).
; Then the next slot. Uses j11, j13.
nb_set:
  jjz j12, nb_edge
  jadd j13, j1, j3
  jst j13, j9, NB
  jldi j13, 1
  jadd j10, j10, j13
  jjmp nb_next
nb_edge:
  jldi j13, 0
  jldi j11, 1
  jsub j13, j13, j11
  jst j13, j9, NB
nb_next:
  jldi j13, 8
  jadd j9, j9, j13
  jret

; One signal: the 3 pieces of KEY3 wake, the wave runs (harmony, the top face answering), and the shape learns from
; it. Uses j1-j14.
signal:
  jldi j1, 0                    ; nobody woke yet
  jldi j13, 0
  jld j2, j13, P
  jldi j3, 1
  jsub j13, j13, j3             ; -1
  jwhile j2
    jldi j14, 3
    jshl j14, j1, j14
    jst j13, j14, FT
    jldi j14, 1
    jadd j1, j1, j14
    jsub j2, j2, j14
  jwend
  jldi j13, 0                   ; its 3 pieces wake at step 0
  jld j5, j13, KEY3
  jldi j14, 3
  jshl j5, j5, j14
  jst j13, j5, FT
  jld j5, j13, KEY3 + 8
  jshl j5, j5, j14
  jst j13, j5, FT
  jld j5, j13, KEY3 + 16
  jshl j5, j5, j14
  jst j13, j5, FT
  jldi j6, 0                    ; the step
  jldi j7, 1                    ; while someone woke in the last step
  jwhile j7
    jldi j1, 0                  ; nobody told anything yet
    jldi j13, 0
    jld j2, j13, P
    jwhile j2
      jldi j14, 3
      jshl j14, j1, j14
      jst j13, j14, INP
      jstb j13, j1, MASK
      jldi j14, 1
      jadd j1, j1, j14
      jsub j2, j2, j14
    jwend
    jldi j1, 0                  ; the ones that woke in this step tell their neighbors (the top face: no)
    jld j2, j13, TOPS
    jwhile j2
      jldi j14, 3
      jshl j14, j1, j14
      jld j5, j14, FT
      jsub j5, j5, j6
      jjnz j5, sp_next
      jldi j9, 0
      jldi j10, 6
      jldi j11, 48
      jmul j11, j1, j11         ; NB slot of (i, 0)
      jwhile j10
        jld j8, j11, NB         ; the neighbor
        jldi j14, 63
        jsar j14, j8, j14
        jjnz j14, sd_next       ; past the edge
        jldi j14, 3
        jshl j14, j8, j14
        jld j12, j14, FT
        jldi j13, 63
        jsar j13, j12, j13
        jjz j13, sd_next        ; it woke already
        jldi j13, 8             ; what it says to it
        jmul j13, j1, j13
        jadd j13, j13, j9
        jldb j13, j13, W
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
        jldi j13, 8
        jadd j11, j11, j13
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
    jldi j13, 0
    jld j2, j13, P
    jwhile j2
      jldi j14, 3
      jshl j14, j1, j14
      jld j5, j14, FT
      jldi j13, 63
      jsar j5, j5, j13
      jjz j5, wk_next           ; it woke already
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
        jand j12, j5, j13
        jadd j8, j8, j12
        jshr j5, j5, j13
        jsub j10, j10, j13
      jwend
      jadd j8, j8, j8
      jldb j5, j1, NCNT
      jsub j5, j5, j8
      jldi j13, 63
      jsar j5, j5, j13
      jjnz j5, wk_next          ; drowned out: it does not pass
      jst j6, j14, FT           ; it wakes
      jldi j7, 1
    wk_next:
      jldi j13, 1
      jadd j1, j1, j13
      jsub j2, j2, j13
    jwend
  jwend
  jldi j1, 0                    ; the shape learns
  jldi j13, 0
  jld j2, j13, P
  jwhile j2
    jldi j14, 3
    jshl j14, j1, j14
    jld j5, j14, FT
    jldi j13, 63
    jsar j13, j5, j13
    jjnz j13, ln_next           ; it did not wake
    jldi j3, 0                  ; its fragment
    jldi j9, 0
    jldi j10, 6
    jldi j11, 48
    jmul j11, j1, j11
    jwhile j10
      jld j8, j11, NB
      jldi j14, 63
      jsar j14, j8, j14
      jjnz j14, l_next          ; past the edge
      jldi j14, 3
      jshl j14, j8, j14
      jld j12, j14, FT
      jldi j14, 63
      jsar j14, j12, j14
      jjnz j14, l_weaken        ; it did not wake
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
      jldi j12, 8               ; it speaks more: + its rate, up to 255
      jmul j12, j1, j12
      jadd j12, j12, j9
      jldb j13, j12, W
      jldb j14, j1, RATE
      jadd j13, j13, j14
      jldi j14, 255
      jsub j14, j14, j13
      jldi j4, 63
      jsar j14, j14, j4
      jjz j14, l_store
      jldi j13, 255
    l_store:
      jstb j13, j12, W
      jjmp l_next
    l_weaken:                   ; it speaks one less, down to 0
      jldi j12, 8
      jmul j12, j1, j12
      jadd j12, j12, j9
      jldb j13, j12, W
      jjz j13, l_next
      jldi j14, 1
      jsub j13, j13, j14
      jstb j13, j12, W
    l_next:
      jldi j13, 1
      jadd j9, j9, j13
      jsub j10, j10, j13
      jldi j13, 8
      jadd j11, j11, j13
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

; The answer: which top pieces woke (MASKT, bit j = top piece j) and the step each woke at (STEPB, a byte each,
; 0FFh = not then), said as one word, then 8 steps per word. Uses j1-j9, j10-j14.
answer:
  jldi j3, 0
  jldi j13, 0
  jld j1, j13, TOPS
  jld j2, j13, NN
  jldi j9, 0
  jwhile j2
    jldi j14, 3
    jshl j14, j1, j14
    jld j5, j14, FT
    jldi j13, 0FFh
    jldi j14, 63
    jsar j14, j5, j14
    jjnz j14, an_not
    jldi j13, 1
    jshl j13, j13, j9
    jor j3, j3, j13
    jadd j13, j5, j0
    jsub j13, j13, j0
  an_not:
    jstb j13, j9, STEPB
    jldi j13, 1
    jadd j1, j1, j13
    jadd j9, j9, j13
    jsub j2, j2, j13
  jwend
  jldi j13, 0
  jst j3, j13, WORD
  jcall say
  jldi j13, 0
  jld j9, j13, NN               ; words: (n^2 + 7) / 8
  jldi j1, 7
  jadd j9, j9, j1
  jldi j1, 3
  jshr j9, j9, j1
  jldi j7, 0
  jwhile j9
    jld j1, j7, STEPB
    jldi j13, 0
    jst j1, j13, WORD
    jcall say
    jldi j13, 8
    jadd j7, j7, j13
    jldi j13, 1
    jsub j9, j9, j13
  jwend
  jret

; Its own fingerprint: for every piece its 6 weights, its rate and its fragment, into j0. Uses j0-j5, j12-j14.
fingerprint:
  jldi j0, 0
  jldi j1, 0
  jldi j13, 0
  jld j2, j13, P
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
jwhile j1
  jldi j10, 29
  jcall ask
  jldi j1, 1                    ; nobody is left who could greet it (-1): waiting again would spin for nothing
  jadd j1, j13, j1
  jjz j1, h_alone
jwcheck
hear:
  jldi j10, 31
  jldi j11, MAIL
  jldi j12, 16
  jcall ask
  jldi j1, 1
  jsub j1, j13, j1
jwend
h_got:
  jret
h_alone:
  jhalt

; Says WORD to its mother (P0, request 30). Uses j10-j14.
say:
  jldi j13, 0
  jld j12, j13, WORD
  jldi j10, 30
  jldi j11, 0
  jcall ask
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
