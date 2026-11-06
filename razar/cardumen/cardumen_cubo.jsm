; Razar's school of any size, as a cabin that sings words (Capitan, 2026-11-06: "if 7^3 is not enough, let it model
; its own size"). The school of cardumen_canto.jsm (harmony, the top face answering, waves that cross) with a side n the
; will chooses: n * n * n pieces, its tables in a room to that measure, nothing fixed to 64 pieces. It is the child of
; the will (voluntad_acertijos.jsm); the two talk in words (requests 30 say, 31 read):
;   5 born: quiet (it never learns) if bit 8, the side n in bits 16..23, the seed in bits 24... It answers how many
;     bytes its tables need, or 0 if the room it has is enough: a child's request for memory would wait for its
;     mother's signature, so she builds the room and moves it here (request 23), says so, and it takes it (25).
;   6 a song with the exact pieces of each greeting: how many in bits 8..15 (at most 255), bit 16 if it is only heard
;     (it does not learn from it), then one word per greeting,
;     its 3 pieces in bits 0..15, 16..31, 32..47. Each pulse a wave of its own, their pushes adding up. It answers how
;     many steps the song lasted, then the top face of every step as a stream of bits (step t, top piece j at bit
;     t * n^2 + j, 64 per word); and the shape learns from it.
;   3 the end: its own fingerprint (every weight and rate, h = (h * 31 + v) mod 2^48), as one word, and it ends.
; A wave wakes each piece once at most and the last starts at step 254 at the latest, so a song lasts at most 256 + n^3
; steps: that is the size of its table of top faces.
;
; Room 0 (1000h bytes):
QUEUE = 100h                    ; its window: one request
MAIL  = 180h                    ; a letter read from its mailbox: who said it, the word
WORD  = 190h                    ; the word it is saying
WHISP = 198h                    ; 1: quiet, it never learns
M48   = 1A0h                    ; 2^48 - 1
NN    = 1A8h                    ; the side n
PP    = 1B0h                    ; its pieces, n^3
N2    = 1B8h                    ; the pieces of a face, n^2
SLEN  = 1C0h                    ; this song: how many greetings
TCUR  = 1C8h                    ; the step
SINK  = 1D0h                    ; the first piece of the top face, n^3 - n^2 (from there on, they answer)
TMAX  = 1D8h                    ; the most steps a song can last: 256 + n^3
ROOMB = 1E0h                    ; its room of tables (0: not born yet)
ANYW  = 1E8h                    ; someone awake this step, in any wave
HAVE  = 1F0h                    ; how big its room of tables is (0: none yet)
NEED  = 1F8h                    ; how big it has to be for this side
SEEDV = 270h                    ; the seed it is born from
SQ    = 278h                    ; 1: this song is only heard (order 6, bit 16)
; Where each table is, in its room (addresses):
AW    = 200h                    ; weights: piece i, direction d at AW + i*8 + d (one byte each)
ARATE = 208h                    ; one byte per piece
AFT   = 210h                    ; the step each piece first woke at this song, -1 = not this time (a qword each)
ANB   = 218h                    ; neighbors: piece i, direction d at ANB + (i*6 + d)*8, -1 = past the edge
AINP  = 220h                    ; what each piece was told this step, by every wave (a qword each)
AMASK = 228h                    ; which neighbors pushed it this step (bit d = the neighbor in direction d)
ANCNT = 230h                    ; how many neighbors each piece has
AORP  = 238h                    ; whether any wave pushed it this step
AUNI  = 240h                    ; awake now in any wave; then, who wakes
ANOW  = 248h                    ; wave w, piece i: awake now (ANOW + w*n^3 + i, one byte, 256 waves)
AWOKE = 250h                    ; wave w, piece i: ever woke in it
APUSH = 258h                    ; wave w, piece i: it pushed it this step
ATOP  = 260h                    ; the top face of step t: ATOP + t*n^2 + j
SONG  = 400h                    ; this song: the pieces of each greeting (a qword each, 256)
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0

jldi j1, 1                      ; 2^48 - 1
jldi j2, 48
jshl j1, j1, j2
jldi j2, 1
jsub j1, j1, j2
jldi j2, 0
jst j1, j2, M48
jst j2, j2, ROOMB
jst j2, j2, HAVE

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
  jjnz j3, c_end
  jldi j3, 16                   ; order 6: bit 16 = this song only heard, not learned (the will asks what it remembers)
  jshr j4, j2, j3
  jldi j3, 1
  jand j4, j4, j3
  jldi j13, 0
  jst j4, j13, SQ
  jldi j3, 8                    ; how many greetings in bits 8..15, then one word per greeting
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
    jst j2, j5, SONG
    jldi j3, 8
    jadd j5, j5, j3
    jldi j3, 1
    jsub j4, j4, j3
  jwend
  jcall sing
  jcall answer
  jjmp c_next
c_born:
  jcall born
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

; Born from the order in j2: quiet if bit 8, side in bits 16..23, seed in bits 24... Its room of tables is built to the
; measure of n (the one before, if any, destroyed); every weight = (seed >> 16) mod 256 with
; seed = (seed * 1103515245 + 12345) mod 2^31, in order; every rate 20; the neighbors. Uses j1-j14.
born:
  jldi j3, 8
  jshr j1, j2, j3
  jldi j3, 1
  jand j1, j1, j3
  jldi j13, 0
  jst j1, j13, WHISP
  jldi j3, 16
  jshr j1, j2, j3
  jldi j3, 0FFh
  jand j1, j1, j3
  jst j1, j13, NN
  jmul j4, j1, j1
  jst j4, j13, N2
  jmul j5, j4, j1
  jst j5, j13, PP
  jsub j6, j5, j4
  jst j6, j13, SINK
  jldi j6, 256
  jadd j6, j6, j5
  jst j6, j13, TMAX
  jldi j3, 24
  jshr j3, j2, j3
  jst j3, j13, SEEDV
  jldi j13, 0                   ; where each table goes (j7 = the size so far); a byte per piece rounded to 8
  jld j5, j13, PP
  jldi j3, 7
  jadd j8, j5, j3
  jldi j3, 0FFF8h
  jand j8, j8, j3               ; one byte per piece, rounded
  jldi j3, 3
  jshl j9, j5, j3               ; one qword per piece
  jldi j7, 0
  jst j7, j13, AW
  jadd j7, j7, j9
  jst j7, j13, ARATE
  jadd j7, j7, j8
  jst j7, j13, AFT
  jadd j7, j7, j9
  jst j7, j13, ANB
  jldi j3, 6
  jmul j3, j9, j3
  jadd j7, j7, j3
  jst j7, j13, AINP
  jadd j7, j7, j9
  jst j7, j13, AMASK
  jadd j7, j7, j8
  jst j7, j13, ANCNT
  jadd j7, j7, j8
  jst j7, j13, AORP
  jadd j7, j7, j8
  jst j7, j13, AUNI
  jadd j7, j7, j8
  jst j7, j13, ANOW
  jldi j3, 8
  jshl j3, j8, j3               ; 256 waves
  jadd j7, j7, j3
  jst j7, j13, AWOKE
  jadd j7, j7, j3
  jst j7, j13, APUSH
  jadd j7, j7, j3
  jst j7, j13, ATOP
  jld j3, j13, TMAX
  jld j4, j13, N2
  jmul j3, j3, j4
  jldi j4, 7
  jadd j3, j3, j4
  jldi j4, 0FFF8h
  jand j3, j3, j4
  jadd j11, j7, j3              ; all of it. A child's request for memory waits for its mother's signature, so it
  jldi j1, 0                    ; asks her: it says how much it needs (0: the room it has is enough) and she builds
  jst j11, j1, NEED             ; the room and moves it here (request 23); it takes it (request 25) when she says so
  jld j2, j1, HAVE
  jsub j2, j2, j11
  jldi j3, 63
  jsar j2, j2, j3
  jldi j12, 0
  jjz j2, b_say
  jadd j12, j11, j1
b_say:
  jst j12, j1, WORD
  jcall say
  jldi j1, 0
  jld j12, j1, WORD
  jjz j12, b_kept
  jcall hear                    ; she says it is here
  jldi j10, 25
  jcall ask
  jldi j1, 0
  jst j13, j1, ROOMB
  jld j2, j1, NEED
  jst j2, j1, HAVE
b_kept:
  jldi j1, 0
  jld j13, j1, ROOMB
  jldi j2, AW                   ; every table: its place in the room
  jldi j3, 13
  jwhile j3
    jld j4, j2, 0
    jadd j4, j4, j13
    jst j4, j2, 0
    jldi j4, 8
    jadd j2, j2, j4
    jldi j4, 1
    jsub j3, j3, j4
  jwend

  jldi j13, 0                   ; the neighbors of every piece: +x, -x, +y, -y, +z, -z
  jld j2, j13, PP
  jldi j1, 0
  jwhile j2
    jldi j13, 0
    jld j3, j13, NN
    jdiv j4, j1, j3
    jmul j5, j4, j3
    jsub j5, j1, j5             ; x
    jdiv j6, j4, j3
    jmul j7, j6, j3
    jsub j6, j4, j7             ; y
    jld j7, j13, N2
    jdiv j7, j1, j7             ; z
    jldi j4, 48
    jmul j4, j1, j4
    jld j9, j13, ANB
    jadd j4, j4, j9             ; where its neighbors go
    jldi j10, 0                 ; how many
    jldi j9, 1
    jsub j11, j3, j9            ; n - 1
    jsub j8, j5, j11            ; +x: none if x = n - 1
    jldi j12, 1
    jcall nb_set
    jadd j8, j5, j9             ; -x: none if x = 0 (j8 = x)
    jsub j8, j8, j9
    jldi j12, 0FFFFh
    jcall nb_set
    jsub j8, j6, j11            ; +y
    jadd j12, j3, j9
    jsub j12, j12, j9
    jcall nb_set
    jadd j8, j6, j9             ; -y
    jsub j8, j8, j9
    jldi j12, 0
    jsub j12, j12, j3
    jcall nb_set
    jsub j8, j7, j11            ; +z
    jld j12, j13, N2
    jcall nb_set
    jadd j8, j7, j9             ; -z
    jsub j8, j8, j9
    jld j12, j13, N2
    jldi j9, 0
    jsub j12, j9, j12
    jcall nb_set
    jld j9, j13, ANCNT
    jadd j9, j9, j1
    jstb j10, j9, 0
    jldi j9, 1
    jadd j1, j1, j9
    jsub j2, j2, j9
  jwend

  jldi j13, 0                   ; the weights and rates, from the seed
  jld j3, j13, SEEDV
  jldi j4, 41C6h
  jshi j4, 4E6Dh                ; 1103515245
  jldi j5, 7FFFh
  jshi j5, 0FFFFh               ; 2^31 - 1
  jld j7, j13, AW
  jld j10, j13, ARATE
  jld j2, j13, PP
  jwhile j2
    jldi j8, 6
    jwhile j8
      jmul j3, j3, j4
      jldi j6, 3039h            ; 12345
      jadd j3, j3, j6
      jand j3, j3, j5
      jldi j6, 16
      jshr j9, j3, j6
      jldi j6, 0FFh
      jand j9, j9, j6
      jstb j9, j7, 0
      jldi j6, 1
      jadd j7, j7, j6
      jsub j8, j8, j6
    jwend
    jldi j6, 2                  ; the 7th and 8th byte of the piece: unused
    jadd j7, j7, j6
    jldi j6, 20                 ; its rate
    jstb j6, j10, 0
    jldi j6, 1
    jadd j10, j10, j6
    jsub j2, j2, j6
  jwend
  jret

; Direction slot j4 of piece j1: none (-1) if j8 = 0, else the piece j1 + j12 (and one more neighbor in j10). Then the
; next slot. Uses j14.
nb_set:
  jjz j8, nb_edge
  jadd j14, j1, j12
  jst j14, j4, 0
  jldi j14, 1
  jadd j10, j10, j14
  jjmp nb_next
nb_edge:
  jldi j14, 0FFFFh
  jst j14, j4, 0
nb_next:
  jldi j14, 8
  jadd j4, j4, j14
  jret

; j2 bytes from address j1 set to j3. Uses j1, j2, j14.
fillb:
  jwhile j2
    jstb j3, j1, 0
    jldi j14, 1
    jadd j1, j1, j14
    jsub j2, j2, j14
  jwend
  jret

; j2 qwords from address j1 set to j3. Uses j1, j2, j14.
fillq:
  jwhile j2
    jst j3, j1, 0
    jldi j14, 8
    jadd j1, j1, j14
    jldi j14, 1
    jsub j2, j2, j14
  jwend
  jret

; Wave t starts if the song has a greeting at step t (TCUR < SLEN): its 3 pieces, awake and woken in it. Uses j5-j9,
; j13.
press:
  jldi j13, 0
  jld j6, j13, TCUR
  jld j7, j13, SLEN
  jsub j7, j6, j7
  jldi j8, 63
  jsar j7, j7, j8
  jjz j7, p_done                ; no greeting left
  jldi j8, 3
  jshl j8, j6, j8
  jld j5, j8, SONG              ; its pieces
  jld j7, j13, PP
  jmul j7, j7, j6
  jld j8, j13, ANOW
  jadd j8, j8, j7               ; this wave's row
  jld j9, j13, AWOKE
  jadd j9, j9, j7
  jldi j6, 3
  jwhile j6
    jldi j7, 1                  ; 0FFFFh
    jldi j13, 16
    jshl j7, j7, j13
    jldi j13, 1
    jsub j7, j7, j13
    jand j7, j5, j7             ; the piece
    jadd j13, j8, j7
    jldi j14, 1
    jstb j14, j13, 0
    jadd j13, j9, j7
    jstb j14, j13, 0
    jldi j13, 16
    jshr j5, j5, j13
    jsub j6, j6, j14
  jwend
p_done:
  jret

; One song: its SLEN greetings (SONG) go in, one per step, each a wave; their pushes add up; the top face of each step
; is kept (ATOP) and the shape learns from it. Uses j1-j14.
sing:
  jldi j13, 0                   ; nobody woke yet
  jld j1, j13, AFT
  jld j2, j13, PP
  jldi j3, 0FFFFh
  jcall fillq
  jldi j13, 0                   ; no wave yet
  jld j2, j13, PP
  jld j3, j13, SLEN
  jmul j2, j2, j3
  jld j1, j13, ANOW
  jldi j3, 0
  jcall fillb
  jldi j13, 0
  jld j2, j13, PP
  jld j3, j13, SLEN
  jmul j2, j2, j3
  jld j1, j13, AWOKE
  jldi j3, 0
  jcall fillb
  jldi j13, 0
  jst j13, j13, TCUR
  jcall press
s_step:
  jldi j13, 0                   ; everyone awake now, in any wave
  jst j13, j13, ANYW
  jld j1, j13, ANOW             ; wave 0's byte of piece i
  jld j2, j13, AUNI
  jld j3, j13, PP
  jwhile j3
    jldi j5, 0
    jadd j6, j1, j13
    jld j7, j13, SLEN
    jwhile j7
      jldb j8, j6, 0
      jor j5, j5, j8
      jld j8, j13, PP
      jadd j6, j6, j8
      jldi j8, 1
      jsub j7, j7, j8
    jwend
    jstb j5, j2, 0
    jld j8, j13, ANYW
    jor j8, j8, j5
    jst j8, j13, ANYW
    jldi j8, 1
    jadd j1, j1, j8
    jadd j2, j2, j8
    jsub j3, j3, j8
  jwend
  jld j4, j13, ANYW
  jjnz j4, s_go                 ; someone awake
  jld j5, j13, TCUR             ; or greetings still to come (t < SLEN - 1)
  jld j6, j13, SLEN
  jldi j7, 1
  jsub j6, j6, j7
  jsub j5, j5, j6
  jldi j7, 63
  jsar j5, j5, j7
  jjz j5, s_done
s_go:
  jld j6, j13, TCUR             ; this step's top face (to answer)
  jld j7, j13, N2
  jmul j1, j6, j7
  jld j2, j13, ATOP
  jadd j1, j1, j2
  jld j2, j13, AUNI
  jld j3, j13, SINK
  jadd j2, j2, j3
  jwhile j7
    jldb j3, j2, 0
    jstb j3, j1, 0
    jldi j3, 1
    jadd j1, j1, j3
    jadd j2, j2, j3
    jsub j7, j7, j3
  jwend
  jld j1, j13, AUNI             ; who wakes for the first time
  jld j2, j13, AFT
  jld j3, j13, PP
  jwhile j3
    jldb j5, j1, 0
    jjz j5, f_next
    jld j5, j2, 0
    jldi j7, 1
    jadd j5, j5, j7
    jjnz j5, f_next
    jst j6, j2, 0
  f_next:
    jldi j7, 1
    jadd j1, j1, j7
    jldi j7, 8
    jadd j2, j2, j7
    jldi j7, 1
    jsub j3, j3, j7
  jwend
  jldi j13, 0                   ; nobody told anything yet
  jld j1, j13, AINP
  jld j2, j13, PP
  jldi j3, 0
  jcall fillq
  jldi j13, 0
  jld j1, j13, AMASK
  jld j2, j13, PP
  jldi j3, 0
  jcall fillb
  jldi j13, 0
  jld j1, j13, AORP
  jld j2, j13, PP
  jldi j3, 0
  jcall fillb
  jldi j15, 0                   ; each wave pushes: its awake pieces (not the top face) tell their neighbors that did
w_lap:                          ; not wake in it yet (j15 = the wave)
  jldi j13, 0
  jld j1, j13, SLEN
  jsub j1, j15, j1
  jjz j1, w_done
  jld j1, j13, PP
  jmul j1, j1, j15
  jld j2, j13, APUSH
  jadd j2, j2, j1
  jst j2, j13, WORD             ; this wave's push row, kept here a moment
  jld j3, j13, ANOW
  jadd j3, j3, j1               ; its awake row
  jld j4, j13, AWOKE
  jadd j4, j4, j1               ; its woken row
  jadd j1, j2, j13
  jld j2, j13, PP
  jldi j3, 0
  jcall fillb
  jldi j13, 0                   ; (fillb took j1-j3: again)
  jld j1, j13, PP
  jmul j1, j1, j15
  jld j3, j13, ANOW
  jadd j3, j3, j1
  jldi j1, 0                    ; piece i
  jld j2, j13, SINK
  jwhile j2
    jadd j5, j3, j1
    jldb j5, j5, 0
    jjz j5, i_next
    jldi j10, 0                 ; direction d
    jldi j5, 48
    jmul j11, j1, j5
    jld j5, j13, ANB
    jadd j11, j11, j5           ; its neighbors
    jldi j5, 3
    jshl j12, j1, j5
    jld j5, j13, AW
    jadd j12, j12, j5           ; what it says to them
  d_lap:
    jldi j5, 6
    jsub j5, j10, j5
    jjz j5, i_next
    jld j7, j11, 0              ; the neighbor
    jldi j5, 63
    jsar j5, j7, j5
    jjnz j5, d_next             ; past the edge
    jadd j5, j4, j7
    jldb j5, j5, 0
    jjnz j5, d_next             ; it woke in this wave already
    jldb j6, j12, 0             ; what it says to it
    jldi j5, 3
    jshl j8, j7, j5
    jld j5, j13, AINP
    jadd j8, j8, j5
    jld j5, j8, 0
    jadd j5, j5, j6
    jst j5, j8, 0
    jldi j5, 1                  ; from which side: 1 << (d xor 1)
    jxor j6, j10, j5
    jshl j6, j5, j6
    jld j8, j13, AMASK
    jadd j8, j8, j7
    jldb j9, j8, 0
    jor j9, j9, j6
    jstb j9, j8, 0
    jld j8, j13, WORD           ; this wave pushed it
    jadd j8, j8, j7
    jstb j5, j8, 0
    jld j8, j13, AORP
    jadd j8, j8, j7
    jstb j5, j8, 0
  d_next:
    jldi j5, 1
    jadd j10, j10, j5
    jldi j5, 8
    jadd j11, j11, j5
    jldi j5, 1
    jadd j12, j12, j5
    jjmp d_lap
  i_next:
    jldi j5, 1
    jadd j1, j1, j5
    jsub j2, j2, j5
  jwend
  jldi j5, 1
  jadd j15, j15, j5
  jjmp w_lap
w_done:
  jldi j13, 0                   ; who wakes: pushed by some wave, told 100 in all, and in harmony
  jldi j1, 0
  jld j2, j13, PP
  jwhile j2
    jldi j9, 0
    jld j5, j13, AORP
    jadd j5, j5, j1
    jldb j5, j5, 0
    jjz j5, u_store
    jldi j5, 3
    jshl j5, j1, j5
    jld j6, j13, AINP
    jadd j5, j5, j6
    jld j7, j5, 0
    jldi j8, 100
    jsub j7, j7, j8
    jldi j8, 63
    jsar j7, j7, j8
    jjnz j7, u_store            ; told less than 100
    jld j5, j13, AMASK          ; harmony: 2 * (neighbors that pushed it) <= its neighbors
    jadd j5, j5, j1
    jldb j7, j5, 0
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
    jld j5, j13, ANCNT
    jadd j5, j5, j1
    jldb j7, j5, 0
    jsub j7, j7, j8
    jldi j8, 63
    jsar j7, j7, j8
    jjnz j7, u_store            ; drowned out
    jldi j9, 1
  u_store:
    jld j5, j13, AUNI
    jadd j5, j5, j1
    jstb j9, j5, 0
    jldi j8, 1
    jadd j1, j1, j8
    jsub j2, j2, j8
  jwend
  jldi j13, 0                   ; each wave: the ones it pushed that woke are its awake ones now, and woken in it
  jld j3, j13, SLEN
  jld j3, j13, PP
  jld j9, j13, SLEN
  jmul j3, j3, j9               ; every wave's byte, all in a row
  jld j4, j13, APUSH
  jld j5, j13, ANOW
  jld j6, j13, AWOKE
  jldi j1, 0                    ; piece i of the wave
  jwhile j3
    jld j7, j13, AUNI
    jadd j7, j7, j1
    jldb j7, j7, 0
    jldb j8, j4, 0
    jand j8, j8, j7
    jstb j8, j5, 0
    jldb j9, j6, 0
    jor j9, j9, j8
    jstb j9, j6, 0
    jldi j8, 1
    jadd j4, j4, j8
    jadd j5, j5, j8
    jadd j6, j6, j8
    jadd j1, j1, j8
    jld j8, j13, PP
    jsub j8, j1, j8
    jjnz j8, a_same
    jldi j1, 0
  a_same:
    jldi j8, 1
    jsub j3, j3, j8
  jwend
  jldi j13, 0                   ; the next step, and its greeting
  jld j6, j13, TCUR
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j13, TCUR
  jcall press
  jjmp s_step
s_done:
  jldi j13, 0                   ; unless it is quiet
  jld j13, j13, WHISP
  jjnz j13, l_skip
  jldi j13, 0                   ; nor if this song is only heard
  jld j13, j13, SQ
  jjnz j13, l_skip
  jldi j1, 0                    ; the shape learns
  jldi j13, 0
  jld j2, j13, PP
  jwhile j2
    jldi j13, 3
    jshl j3, j1, j13
    jldi j13, 0
    jld j4, j13, AFT
    jadd j4, j4, j3
    jld j5, j4, 0               ; when it woke
    jldi j13, 63
    jsar j14, j5, j13
    jjnz j14, ln_next           ; it did not wake
    jldi j13, 0
    jld j3, j13, AW
    jldi j4, 3
    jshl j4, j1, j4
    jadd j3, j3, j4             ; its weights
    jldi j4, 48
    jmul j4, j1, j4
    jld j6, j13, ANB
    jadd j4, j4, j6             ; its neighbors
    jld j6, j13, ARATE
    jadd j6, j6, j1             ; its rate
    jldi j10, 6
    jwhile j10
      jld j8, j4, 0
      jldi j14, 63
      jsar j14, j8, j14
      jjnz j14, l_next          ; past the edge
      jldi j14, 3
      jshl j8, j8, j14
      jldi j13, 0
      jld j14, j13, AFT
      jadd j8, j8, j14
      jld j12, j8, 0
      jldi j14, 63
      jsar j14, j12, j14
      jjnz j14, l_weaken        ; it did not wake
      jsub j14, j12, j5         ; together: (ft[q] - ft[i])^2 <= 1
      jmul j14, j14, j14
      jldi j13, 2
      jsub j14, j14, j13
      jldi j13, 63
      jsar j14, j14, j13
      jjz j14, l_next
      jldb j13, j3, 0           ; it speaks more: + its rate, up to 255
      jldb j14, j6, 0
      jadd j13, j13, j14
      jldi j14, 255
      jsub j14, j14, j13
      jldi j12, 63
      jsar j14, j14, j12
      jjz j14, l_store
      jldi j13, 255
    l_store:
      jstb j13, j3, 0
      jjmp l_next
    l_weaken:                   ; it speaks one less, down to 0
      jldb j13, j3, 0
      jjz j13, l_next
      jldi j14, 1
      jsub j13, j13, j14
      jstb j13, j3, 0
    l_next:
      jldi j13, 1
      jadd j3, j3, j13
      jsub j10, j10, j13
      jldi j13, 8
      jadd j4, j4, j13
    jwend
    jldb j13, j6, 0             ; its rate drops by one, down to 1
    jldi j14, 1
    jsub j14, j13, j14
    jjz j14, ln_next
    jldi j14, 1
    jsub j13, j13, j14
    jstb j13, j6, 0
  ln_next:
    jldi j13, 1
    jadd j1, j1, j13
    jsub j2, j2, j13
  jwend
l_skip:
  jret

; The answer to a song: how many steps it lasted (TCUR), then the top face of every step as a stream of bits, 64 per
; word. Uses j1-j14.
answer:
  jldi j13, 0
  jld j1, j13, TCUR
  jst j1, j13, WORD
  jcall say
  jldi j13, 0
  jld j3, j13, TCUR
  jld j4, j13, N2
  jmul j3, j3, j4               ; how many bits
  jld j2, j13, ATOP
  jldi j5, 0                    ; the word being filled
  jldi j6, 0                    ; its next bit
  jwhile j3
    jldb j7, j2, 0
    jshl j7, j7, j6
    jor j5, j5, j7
    jldi j7, 1
    jadd j6, j6, j7
    jadd j2, j2, j7
    jsub j3, j3, j7
    jldi j7, 64
    jsub j7, j6, j7
    jjnz j7, a_bit
    jldi j13, 0
    jst j5, j13, WORD
    jcall say
    jldi j5, 0
    jldi j6, 0
  a_bit:
  jwend
  jjz j6, a_done
  jldi j13, 0
  jst j5, j13, WORD
  jcall say
a_done:
  jret

; Its own fingerprint: every weight and rate into j0 = (j0 * 31 + v) mod 2^48. Uses j0-j5, j12-j14.
fingerprint:
  jldi j0, 0
  jldi j13, 0
  jld j1, j13, AW
  jld j2, j13, ARATE
  jld j3, j13, PP
  jwhile j3
    jldi j5, 6
    jwhile j5
      jldb j12, j1, 0
      jcall mix
      jldi j4, 1
      jadd j1, j1, j4
      jsub j5, j5, j4
    jwend
    jldi j4, 2
    jadd j1, j1, j4
    jldb j12, j2, 0
    jcall mix
    jldi j4, 1
    jadd j2, j2, j4
    jsub j3, j3, j4
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
