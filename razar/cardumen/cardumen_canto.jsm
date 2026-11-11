; Razar's school as a cabin that sings words (Capitan, 2026-11-06: a whole word is one song; everything in Janax).
; The school of cardumen_olas.jsm (4 * 4 * 4 pieces, harmony, the top face answering, waves that cross, born from
; seed 7) as the child of the will (voluntad_canto.jsm); the two talk in words (requests 30 say, 31 read):
;   4 a song: the word's greetings, 2 bits each from bit 8 (0 dot, 1 dash, 2 end of letter, 3 the end of the song),
;     one per step, with the three corner keys; each pulse a wave of its own, their pushes adding up. It answers how
;     many steps the song lasted, then the top face of each step (16 bits, piece 48 + j at bit j), 4 steps per word;
;     and the shape learns from it.
;   5 born again: from the seed in bits 16.., quiet (it never learns) if bit 8; no answer.
;   6 a song with the exact pieces of each greeting (a finger may slip): how many in bits 8..15, then one word per
;     greeting with its pieces; answered as a song.
;   3 the end: its own fingerprint (every weight and rate, h = (h * 31 + v) mod 2^48), as one word, and it ends.
; The loop of both cabins gives the fingerprint of huella_oraciones.pl, bit for bit.
;
; Room 0 (2000h bytes):
QUEUE = 100h                    ; its window: one request
W     = 200h                    ; weights: piece i, direction d at W + i*8 + d (one byte each)
RATE  = 400h                    ; one byte per piece
FT    = 500h                    ; the step each piece first woke at this song, 0FFh = not this time
NB    = 600h                    ; neighbors: piece i, direction d at NB + i*8 + d, 0FFh = past the edge
INP   = 800h                    ; what each piece was told this step, by every wave (a qword each)
MASK  = 0A00h                   ; which neighbors pushed it this step (bit d = the neighbor in direction d)
NCNT  = 0A40h                   ; how many neighbors each piece has
M48   = 0B00h                   ; 2^48 - 1
SEQ   = 0C00h                   ; this song's greetings, one byte per step (0 dot, 1 dash, 2 end of letter)
KEYM  = 0C48h                   ; the three keys as sets of pieces: dot {0,1,4}, dash {2,3,7}, end {8,12,13}
SLEN  = 0C60h                   ; this song: how many greetings
SBASE = 0C68h                   ; where its greetings start in SEQ (0: one song at a time)
TCUR  = 0C70h                   ; the step
ORP   = 0C78h                   ; whom any wave pushed this step
MAIL  = 0C80h                   ; a letter read from its mailbox: who said it, the word
WORD  = 0C90h                   ; the word it is saying
WHISP = 0C98h                   ; 1: quiet, it never learns (order 5)
SONGM = 1600h                   ; this song: the pieces of each greeting (a qword each)
TOPM  = 0E00h                   ; the top face at each step of the song (a qword each, 64 steps)
NOWW  = 1000h                   ; wave w: who of it is awake now (a qword each)
WOKEW = 1200h                   ; wave w: who of it ever woke
PUSHW = 1400h                   ; wave w: whom it pushed this step
include '../../escalon0/janax.inc'
jfirst j1, 2000h               ; first order: room 0

jldi j1, 1                      ; 2^48 - 1
jldi j2, 48
jshl j1, j1, j2
jldi j2, 1
jsub j1, j1, j2
jldi j2, 0
jst j1, j2, M48
jst j2, j2, SBASE
jldi j1, 13h                    ; the keys: dot {0,1,4}, dash {2,3,7}, end of letter {8,12,13}
jst j1, j2, KEYM
jldi j1, 8Ch
jst j1, j2, KEYM + 8
jldi j1, 3100h
jst j1, j2, KEYM + 16

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

jldi j3, 7                      ; born from seed 7 (an order 5 can give it another)
jcall born

jldi j15, 1                     ; it listens until the end
jwhile j15
  jcall hear                    ; the order, as a word (sleeping until it comes, costing nothing)
  jldi j13, 0
  jld j2, j13, MAIL + 8
  jldi j1, 0FFh
  jand j1, j2, j1
  jldi j3, 5
  jsub j3, j1, j3
  jjz j3, c_born
  jldi j3, 6
  jsub j3, j1, j3
  jjz j3, c_masks
  jldi j3, 4
  jsub j3, j1, j3
  jjnz j3, c_end
  jldi j3, 8                    ; a song: its greetings, 2 bits each, until a 3
  jshr j2, j2, j3
  jldi j4, 0                    ; how many
jwhile j6
  jstb j5, j4, SEQ
  jldi j3, 1
  jadd j4, j4, j3
  jldi j3, 2
  jshr j2, j2, j3
jwcheck
  jldi j3, 3
  jand j5, j2, j3
  jsub j6, j5, j3
jwend
c_coded:
  jldi j13, 0
  jst j4, j13, SLEN
  jldi j1, 0                    ; each greeting as its key's pieces
  jwhile j4
    jldb j2, j1, SEQ
    jldi j3, 3
    jshl j2, j2, j3
    jld j2, j2, KEYM
    jshl j3, j1, j3
    jst j2, j3, SONGM
    jldi j3, 1
    jadd j1, j1, j3
    jsub j4, j4, j3
  jwend
  jcall sing
  jcall answer
  jjmp c_next
c_born:                         ; order 5: born again from the seed in bits 16.., quiet (it never learns) if bit 8
  jldi j3, 8
  jshr j1, j2, j3
  jldi j3, 1
  jand j1, j1, j3
  jldi j13, 0
  jst j1, j13, WHISP
  jldi j3, 16
  jshr j3, j2, j3
  jcall born
  jjmp c_next
c_masks:                        ; order 6: a song with the exact pieces of each greeting (a finger may slip): how
  jldi j3, 8                    ; many in bits 8..15, then one word per greeting, its pieces
  jshr j4, j2, j3
  jldi j3, 0FFh
  jand j4, j4, j3
  jldi j13, 0
  jst j4, j13, SLEN
  jldi j5, 0
  jwhile j4
    jcall hear
    jldi j13, 0
    jld j2, j13, MAIL + 8
    jst j2, j5, SONGM
    jldi j3, 8
    jadd j5, j5, j3
    jldi j3, 1
    jsub j4, j4, j3
  jwend
  jcall sing
  jcall answer
  jjmp c_next
c_end:
  jcall fingerprint             ; the end: its fingerprint, as one word
  jldi j13, 0
  jst j0, j13, WORD
  jcall say
  jhalt
c_next:
jwend
jhalt

; The answer to a song: how many steps it lasted (TCUR), then the top face of each step, 4 steps per word.
; Uses j1-j14.
answer:
  jldi j13, 0
  jld j1, j13, TCUR
  jst j1, j13, WORD
  jcall say
  jldi j13, 0
  jld j9, j13, TCUR             ; words: (steps + 3) / 4
  jldi j1, 3
  jadd j9, j9, j1
  jldi j1, 2
  jshr j9, j9, j1
  jldi j3, 0                    ; TOPM offset of the first step of this word
  jwhile j9
    jld j1, j3, TOPM + 24
    jldi j2, 16
    jshl j1, j1, j2
    jld j4, j3, TOPM + 16
    jor j1, j1, j4
    jshl j1, j1, j2
    jld j4, j3, TOPM + 8
    jor j1, j1, j4
    jshl j1, j1, j2
    jld j4, j3, TOPM
    jor j1, j1, j4
    jldi j13, 0
    jst j1, j13, WORD
    jcall say
    jldi j13, 32
    jadd j3, j3, j13
    jldi j13, 1
    jsub j9, j9, j13
  jwend
  jret

; Its own fingerprint: every weight and rate into j0 = (j0 * 31 + v) mod 2^48. Uses j0-j5, j12-j14.
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
    jldi j3, 1
    jadd j1, j1, j3
    jsub j2, j2, j3
  jwend
  jret

; Born from seed j3: every weight = (seed >> 16) mod 256, seed = (seed * 1103515245 + 12345) mod 2^31, in order;
; every rate 20. Uses j1-j9.
born:
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

; Wave t starts if the song has a greeting at step t (TCUR < SLEN): its key's pieces, awake and woken in it.
; Uses j6-j8, j13.
press:
  jldi j13, 0
  jld j6, j13, TCUR
  jld j7, j13, SLEN
  jsub j7, j6, j7
  jldi j8, 63
  jsar j7, j7, j8
  jjz j7, p_done                ; no greeting left
  jldi j8, 8
  jmul j8, j6, j8
  jld j7, j8, SONGM             ; its pieces
  jst j7, j8, NOWW
  jst j7, j8, WOKEW
p_done:
  jret

; One song: its SLEN greetings (SEQ) go in, one per step, each a wave; their pushes add up; the top face of each step
; is kept (TOPM) and the shape learns from it. Uses j1-j14.
sing:
  jldi j1, 0                    ; nobody woke yet
  jldi j2, 64
  jldi j13, 0FFh
  jwhile j2
    jstb j13, j1, FT
    jldi j14, 1
    jadd j1, j1, j14
    jsub j2, j2, j14
  jwend
  jldi j1, 0                    ; no wave yet
  jldi j2, 64
  jldi j13, 0
  jwhile j2
    jldi j14, 8
    jmul j14, j1, j14
    jst j13, j14, NOWW
    jst j13, j14, WOKEW
    jldi j14, 1
    jadd j1, j1, j14
    jsub j2, j2, j14
  jwend
  jldi j1, 0                    ; no top face yet
  jldi j2, 64
  jldi j13, 0
  jwhile j2
    jldi j14, 8
    jmul j14, j1, j14
    jst j13, j14, TOPM
    jldi j14, 1
    jadd j1, j1, j14
    jsub j2, j2, j14
  jwend
  jst j13, j13, TCUR
  jcall press
waves:
  jldi j13, 0                   ; everyone awake now, in any wave
  jld j9, j13, SLEN
  jldi j1, 0
  jldi j4, 0
  jwhile j9
    jld j5, j1, NOWW
    jor j4, j4, j5
    jldi j14, 8
    jadd j1, j1, j14
    jldi j14, 1
    jsub j9, j9, j14
  jwend
  jjnz j4, w_go                 ; someone awake
  jld j5, j13, TCUR             ; or greetings still to come (t < SLEN - 1)
  jld j6, j13, SLEN
  jldi j7, 1
  jsub j6, j6, j7
  jsub j5, j5, j6
  jldi j7, 63
  jsar j5, j5, j7
  jjz j5, w_done
w_go:
  jld j6, j13, TCUR             ; this step's top face (to answer), and who wakes for the first time
  jldi j7, 48
  jshr j5, j4, j7
  jldi j7, 8
  jmul j7, j6, j7
  jst j5, j7, TOPM
  jldi j1, 0
  jldi j2, 64
  jwhile j2
    jshr j5, j4, j1
    jldi j7, 1
    jand j5, j5, j7
    jjz j5, b_next
    jldb j5, j1, FT
    jldi j7, 0FFh
    jsub j5, j5, j7
    jjnz j5, b_next
    jstb j6, j1, FT
  b_next:
    jldi j7, 1
    jadd j1, j1, j7
    jsub j2, j2, j7
  jwend
  jldi j1, 0                    ; nobody told anything yet
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
  jst j13, j13, ORP
  jld j9, j13, SLEN             ; each wave pushes: its awake pieces (not the top face) tell their neighbors that
  jldi j3, 0                    ; did not wake in it yet
  jwhile j9
    jld j4, j3, NOWW
    jld j5, j3, WOKEW
    jldi j6, 0
    jjz j4, d_store
    jldi j1, 0
    jldi j2, 48
    jwhile j2
      jshr j7, j4, j1
      jldi j8, 1
      jand j7, j7, j8
      jjz j7, i_next
      jldi j10, 0
      jldi j11, 6
      jwhile j11
        jldi j8, 8
        jmul j8, j1, j8
        jadd j8, j8, j10        ; i * 8 + d
        jldb j7, j8, NB         ; the neighbor
        jldi j12, 0FFh
        jsub j12, j7, j12
        jjz j12, d_next         ; past the edge
        jshr j12, j5, j7
        jldi j13, 1
        jand j12, j12, j13
        jjnz j12, d_next        ; it woke in this wave already
        jldb j12, j8, W         ; what it says to it
        jldi j13, 8
        jmul j13, j7, j13
        jld j14, j13, INP
        jadd j14, j14, j12
        jst j14, j13, INP
        jldi j13, 1             ; from which side: 1 << (d xor 1)
        jxor j12, j10, j13
        jshl j13, j13, j12
        jldb j14, j7, MASK
        jor j14, j14, j13
        jstb j14, j7, MASK
        jldi j13, 1             ; this wave pushed it
        jshl j13, j13, j7
        jor j6, j6, j13
      d_next:
        jldi j13, 1
        jadd j10, j10, j13
        jsub j11, j11, j13
      jwend
    i_next:
      jldi j13, 1
      jadd j1, j1, j13
      jsub j2, j2, j13
    jwend
  d_store:
    jst j6, j3, PUSHW
    jldi j13, 0
    jld j7, j13, ORP
    jor j7, j7, j6
    jst j7, j13, ORP
    jldi j13, 8
    jadd j3, j3, j13
    jldi j13, 1
    jsub j9, j9, j13
  jwend
  jldi j13, 0                   ; who wakes: pushed by some wave, told 100 in all, and in harmony
  jld j4, j13, ORP
  jldi j5, 0
  jldi j1, 0
  jldi j2, 64
  jwhile j2
    jshr j7, j4, j1
    jldi j8, 1
    jand j7, j7, j8
    jjz j7, u_next
    jldi j8, 8
    jmul j8, j1, j8
    jld j7, j8, INP
    jldi j8, 100
    jsub j7, j7, j8
    jldi j8, 63
    jsar j7, j7, j8
    jjnz j7, u_next             ; told less than 100
    jldb j7, j1, MASK           ; harmony: 2 * (neighbors that pushed it) <= its neighbors
    jldi j8, 0
    jldi j10, 6
    jwhile j10
      jldi j11, 1
      jand j12, j7, j11
      jadd j8, j8, j12
      jshr j7, j7, j11
      jsub j10, j10, j11
    jwend
    jadd j8, j8, j8
    jldb j7, j1, NCNT
    jsub j7, j7, j8
    jldi j8, 63
    jsar j7, j7, j8
    jjnz j7, u_next             ; drowned out
    jldi j8, 1
    jshl j8, j8, j1
    jor j5, j5, j8
  u_next:
    jldi j8, 1
    jadd j1, j1, j8
    jsub j2, j2, j8
  jwend
  jldi j13, 0                   ; each wave: the ones it pushed that woke are its awake ones now, and woken in it
  jld j9, j13, SLEN
  jldi j3, 0
  jwhile j9
    jld j6, j3, PUSHW
    jand j6, j6, j5
    jst j6, j3, NOWW
    jld j7, j3, WOKEW
    jor j7, j7, j6
    jst j7, j3, WOKEW
    jldi j13, 8
    jadd j3, j3, j13
    jldi j13, 1
    jsub j9, j9, j13
  jwend
  jldi j13, 0                   ; the next step, and its greeting
  jld j6, j13, TCUR
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j13, TCUR
  jcall press
  jjmp waves
w_done:
  jldi j13, 0                   ; unless it is quiet
  jld j13, j13, WHISP
  jjnz j13, l_skip
  jldi j1, 0                    ; the shape learns
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
l_skip:
  jret
