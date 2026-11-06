; Razar's school with waves that cross, in Janax (Capitan, 2026-11-06: everything moves to Janax; Perl stays as the
; measuring stick). The same school as cardumen.jsm (4 * 4 * 4 pieces, harmony, the top face answering, born from
; seed 7), but a word goes in as a song: its Morse of greetings (dot, dash, end of letter: three corner keys of the
; bottom face) one greeting per step, each pulse a wave of its own, and the pushes of every wave add up, so a piece no
; single wave can wake wakes where two meet, and then belongs to every wave that pushed it; inside each wave a piece
; wakes once at most, so nothing goes round in circles and all of it dies after the last pulse (modelo.pl
; signal_waves with cross). It runs the history of huella_olas.pl (40 words in turn: sol, luna, mar, casa) and leaves
; the same fingerprint in j0, bit for bit.
;
; A lo Janax: with 64 pieces, a set of pieces is one qword, a bit per piece. Each wave w keeps three: who of it is
; awake now (NOWW), who of it ever woke (WOKEW), and whom it pushed this step (PUSHW). Crossing waves is adding the
; pushes and an AND of bits.
;
; Room 0 (2000h bytes):
W     = 200h                    ; weights: piece i, direction d at W + i*8 + d (one byte each)
RATE  = 400h                    ; one byte per piece
FT    = 500h                    ; the step each piece first woke at this song, 0FFh = not this time
NB    = 600h                    ; neighbors: piece i, direction d at NB + i*8 + d, 0FFh = past the edge
INP   = 800h                    ; what each piece was told this step, by every wave (a qword each)
MASK  = 0A00h                   ; which neighbors pushed it this step (bit d = the neighbor in direction d)
NCNT  = 0A40h                   ; how many neighbors each piece has
M48   = 0B00h                   ; 2^48 - 1
SEQ   = 0C00h                   ; the 4 words as greetings, one byte per step (0 dot, 1 dash, 2 end of letter), 16 each
LEN   = 0C40h                   ; how many greetings each word has (a byte each)
KEYM  = 0C48h                   ; the three keys as sets of pieces: dot {0,1,4}, dash {2,3,7}, end {8,12,13}
SLEN  = 0C60h                   ; this song: how many greetings
SBASE = 0C68h                   ; where its greetings start in SEQ
TCUR  = 0C70h                   ; the step
ORP   = 0C78h                   ; whom any wave pushed this step
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

jldi j1, 13h                    ; the keys: dot {0,1,4}, dash {2,3,7}, end of letter {8,12,13}
jst j1, j2, KEYM
jldi j1, 8Ch
jst j1, j2, KEYM + 8
jldi j1, 3100h
jst j1, j2, KEYM + 16
                                ; the words sol, luna, mar, casa as greetings (as huella_olas.pl says them)
jldi j1, 0201h
jshi j1, 0101h
jshi j1, 0200h
jshi j1, 0000h
jst j1, j2, SEQ + 0
jldi j1, 0000h
jshi j1, 0002h
jshi j1, 0000h
jshi j1, 0100h
jst j1, j2, SEQ + 8
jldi j1, 0100h
jshi j1, 0002h
jshi j1, 0000h
jshi j1, 0100h
jst j1, j2, SEQ + 16
jldi j1, 0002h
jshi j1, 0100h
jshi j1, 0200h
jshi j1, 0102h
jst j1, j2, SEQ + 24
jldi j1, 0100h
jshi j1, 0201h
jshi j1, 0002h
jshi j1, 0101h
jst j1, j2, SEQ + 32
jldi j1, 0000h
jshi j1, 0000h
jshi j1, 0000h
jshi j1, 0200h
jst j1, j2, SEQ + 40
jldi j1, 0201h
jshi j1, 0002h
jshi j1, 0001h
jshi j1, 0001h
jst j1, j2, SEQ + 48
jldi j1, 0002h
jshi j1, 0100h
jshi j1, 0200h
jshi j1, 0000h
jst j1, j2, SEQ + 56
jldi j1, 0F0Ah
jshi j1, 0F0Dh
jst j1, j2, LEN

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
jldi j15, 0                     ; 40 songs
jldi j14, 40
jwhile j14
  jldi j3, 3
  jand j3, j15, j3              ; the word, in turn
  jcall sing
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
  jld j7, j13, SBASE
  jadd j7, j7, j6
  jldb j7, j7, SEQ              ; which key
  jldi j8, 8
  jmul j7, j7, j8
  jld j7, j7, KEYM              ; its pieces
  jmul j8, j6, j8
  jst j7, j8, NOWW
  jst j7, j8, WOKEW
p_done:
  jret

; One song: the word j3 goes in, one greeting per step, each a wave; their pushes add up; the journey goes into the
; fingerprint, and the shape learns from it. Uses j1-j14.
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
  jldi j13, 0
  jldb j4, j3, LEN
  jst j4, j13, SLEN
  jldi j5, 16
  jmul j5, j3, j5
  jst j5, j13, SBASE
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
  jld j6, j13, TCUR             ; this step into the fingerprint, in order, and who wakes for the first time
  jldi j1, 0
  jldi j2, 64
  jwhile j2
    jshr j5, j4, j1
    jldi j7, 1
    jand j5, j5, j7
    jjz j5, b_next
    jldi j7, 64
    jmul j12, j6, j7
    jadd j12, j12, j1
    jldi j7, 1
    jadd j12, j12, j7
    jcall mix
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
  jldi j12, 4096                ; between songs
  jcall mix
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
  jret
