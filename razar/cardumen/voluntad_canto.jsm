; Razar's will that knows whole words (Capitan, 2026-11-06: a whole word is one song; everything in Janax). It
; launches its child "hijo" (the school, cardumen_canto.jsm) and the two talk in words (requests 30 say, 31 read). It
; says the 30 words of its vocabulary in turn, 3 passes, each as one song: the word's greetings, 2 bits each from
; bit 8 (0 dot, 1 dash, 2 end of letter, 3 the end of the song), with order 4 in the low byte. The school answers how
; many steps the song lasted and the top face of each step. The will hears it with its rhythm (piece and step),
; guesses the word whose notes it heard most as a share of all it heard for it, and, knowing what it said, learns.
; Each song goes into j0 as said * 1024 + (guess + 1) * 2 + right; at the end the school says its own fingerprint and
; it is mixed in: j0 is the fingerprint of huella_oraciones.pl, bit for bit.
;
; Room 0 (50000h bytes):
QUEUE = 100h                    ; its window: one request
HIJO  = 200h                    ; "hijo"
M48   = 648h                    ; 2^48 - 1
CHILD = 658h                    ; the school's number
THING = 670h                    ; the word it says this time
BEST  = 678h                    ; what it guessed (-1: nothing yet)
BSUM  = 680h                    ; the best share so far: BSUM / BTOT
BTOT  = 688h
CNT   = 690h                    ; how many notes it heard this song
SLONG = 698h                    ; how many steps the song lasted
WORD  = 6A0h                    ; the word it is saying
MAIL  = 740h                    ; a letter read from its mailbox: who said it, the word
VOCW  = 800h                    ; the 30 words as songs (a qword each)
HEARD = 900h                    ; notes heard for each word, in all (a qword each)
STEPM = 0A00h                   ; the top face of each step of the song heard (a qword each, 64 steps)
READ  = 10000h                  ; what it learned: word g, top piece 48 + j heard at step t READ + ((g*16 + j)*64 + t)*8
                                ; (past what a load's offset reaches, 7FFFh: its address goes in a register)
                                ; times (30 words; a song lasts less than 64 steps: the longest measured lasts 34)
include '../../escalon0/janax.inc'
jfirst j1, 50000h              ; first order: room 0

jldi j1, 1                      ; 2^48 - 1
jldi j2, 48
jshl j1, j1, j2
jldi j2, 1
jsub j1, j1, j2
jldi j2, 0
jst j1, j2, M48
jldi j0, 0                      ; the fingerprint
                                ; the vocabulary, as songs
jldi j1, 0000h
jshi j1, 000Eh
jshi j1, 0495h
jshi j1, 8004h
jst j1, j2, VOCW + 0          ; sol
jldi j1, 0000h
jshi j1, 00E4h
jshi j1, 8642h
jshi j1, 0404h
jst j1, j2, VOCW + 8          ; luna
jldi j1, 0000h
jshi j1, 0000h
jshi j1, 3849h
jshi j1, 2504h
jst j1, j2, VOCW + 16          ; mar
jldi j1, 0000h
jshi j1, 0003h
jshi j1, 8162h
jshi j1, 1404h
jst j1, j2, VOCW + 24          ; pez
jldi j1, 000Eh
jshi j1, 5611h
jshi j1, 8492h
jshi j1, 0104h
jst j1, j2, VOCW + 32          ; barco
jldi j1, 0000h
jshi j1, 0E560h
jshi j1, 4882h
jshi j1, 1104h
jst j1, j2, VOCW + 40          ; cielo
jldi j1, 0000h
jshi j1, 0039h
jshi j1, 2421h
jshi j1, 6404h
jst j1, j2, VOCW + 48          ; agua
jldi j1, 0000h
jshi j1, 0E561h
jshi j1, 6242h
jshi j1, 1004h
jst j1, j2, VOCW + 56          ; fuego
jldi j1, 0000h
jshi j1, 3921h
jshi j1, 2122h
jshi j1, 0904h
jst j1, j2, VOCW + 64          ; tierra
jldi j1, 0000h
jshi j1, 0E566h
jshi j1, 1882h
jshi j1, 4004h
jst j1, j2, VOCW + 72          ; viento
jldi j1, 0000h
jshi j1, 00E4h
jshi j1, 8092h
jshi j1, 1104h
jst j1, j2, VOCW + 80          ; casa
jldi j1, 0000h
jshi j1, 0E561h
jshi j1, 2122h
jshi j1, 1404h
jst j1, j2, VOCW + 88          ; perro
jldi j1, 0000h
jshi j1, 000Eh
jshi j1, 5664h
jshi j1, 8504h
jst j1, j2, VOCW + 96          ; gato
jldi j1, 000Eh
jshi j1, 0495h
jshi j1, 8061h
jshi j1, 2404h
jst j1, j2, VOCW + 104          ; arbol
jldi j1, 0000h
jshi j1, 3849h
jshi j1, 5812h
jshi j1, 1004h
jst j1, j2, VOCW + 112          ; flor
jldi j1, 0000h
jshi j1, 0000h
jshi j1, 0E560h
jshi j1, 8404h
jst j1, j2, VOCW + 120          ; rio
jldi j1, 0000h
jshi j1, 0038h
jshi j1, 9865h
jshi j1, 6504h
jst j1, j2, VOCW + 128          ; monte
jldi j1, 0000h
jshi j1, 0038h
jshi j1, 8064h
jshi j1, 2104h
jst j1, j2, VOCW + 136          ; nube
jldi j1, 0E48h
jshi j1, 2409h
jshi j1, 0812h
jshi j1, 0404h
jst j1, j2, VOCW + 144          ; lluvia
jldi j1, 000Eh
jshi j1, 4848h
jshi j1, 1882h
jshi j1, 1404h
jst j1, j2, VOCW + 152          ; piedra
jldi j1, 000Eh
jshi j1, 5618h
jshi j1, 2592h
jshi j1, 1104h
jst j1, j2, VOCW + 160          ; camino
jldi j1, 0003h
jshi j1, 9261h
jshi j1, 2242h
jshi j1, 1404h
jst j1, j2, VOCW + 168          ; puerta
jldi j1, 0000h
jshi j1, 0003h
jshi j1, 9202h
jshi j1, 2504h
jst j1, j2, VOCW + 176          ; mesa
jldi j1, 0003h
jshi j1, 9204h
jshi j1, 8120h
jshi j1, 8004h
jst j1, j2, VOCW + 184          ; silla
jldi j1, 000Eh
jshi j1, 5612h
jshi j1, 0182h
jshi j1, 0404h
jst j1, j2, VOCW + 192          ; libro
jldi j1, 0000h
jshi j1, 000Eh
jshi j1, 5619h
jshi j1, 2504h
jst j1, j2, VOCW + 200          ; mano
jldi j1, 0000h
jshi j1, 000Eh
jshi j1, 5654h
jshi j1, 9504h
jst j1, j2, VOCW + 208          ; ojo
jldi j1, 0000h
jshi j1, 0038h
jshi j1, 1656h
jshi j1, 4004h
jst j1, j2, VOCW + 216          ; voz
jldi j1, 0000h
jshi j1, 0E56h
jshi j1, 6192h
jshi j1, 1104h
jst j1, j2, VOCW + 224          ; canto
jldi j1, 0000h
jshi j1, 0039h
jshi j1, 2020h
jshi j1, 8404h
jst j1, j2, VOCW + 232          ; risa

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

jldi j15, 3                     ; 3 passes over the 30 words
jwhile j15
  jldi j1, 0
  jst j1, j1, THING
  jldi j9, 30
  jwhile j9
    jcall song
    jldi j1, 0
    jld j2, j1, THING
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, THING
    jsub j9, j9, j3
  jwend
  jldi j1, 1
  jsub j15, j15, j1
jwend

jldi j1, 0                      ; the end: order 3, and the school's fingerprint mixed in
jldi j2, 3
jst j2, j1, WORD
jcall say
jcall hear
jldi j1, 0
jld j12, j1, MAIL + 8
jcall mix
jhalt

; One word said and heard: the song goes to the school, its answer comes back, it guesses, learns, and the round goes
; into the fingerprint. Uses j1-j8, j10-j14 (keeps j9, j15).
song:
  jldi j1, 0                    ; the song
  jld j2, j1, THING
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j3, VOCW
  jst j4, j1, WORD
  jcall say
  jcall hear                    ; how many steps it lasted
  jldi j1, 0
  jld j2, j1, MAIL + 8
  jst j2, j1, SLONG
  jldi j1, 0                    ; no step heard yet
  jldi j2, 64
  jldi j3, 0
  jwhile j2
    jldi j4, 8
    jmul j4, j1, j4
    jst j3, j4, STEPM
    jldi j4, 1
    jadd j1, j1, j4
    jsub j2, j2, j4
  jwend
  jldi j1, 0                    ; its top face, 4 steps per word
  jld j6, j1, SLONG
  jldi j2, 3
  jadd j6, j6, j2
  jldi j2, 2
  jshr j6, j6, j2
  jldi j7, 0                    ; STEPM offset of the first step of this word
  jwhile j6
    jcall hear
    jldi j1, 0
    jld j2, j1, MAIL + 8
    jldi j4, 1                  ; 16 bits: 0FFFFh
    jldi j5, 16
    jshl j4, j4, j5
    jldi j5, 1
    jsub j4, j4, j5
    jldi j8, 4
    jwhile j8
      jand j3, j2, j4
      jst j3, j7, STEPM
      jldi j5, 16
      jshr j2, j2, j5
      jldi j5, 8
      jadd j7, j7, j5
      jldi j5, 1
      jsub j8, j8, j5
    jwend
    jldi j1, 1
    jsub j6, j6, j1
  jwend
  jldi j1, 0                    ; what it guesses: the word whose notes it heard most, as a share
  jldi j2, 1
  jsub j2, j1, j2
  jst j2, j1, BEST              ; -1
  jst j1, j1, BSUM
  jldi j2, 1
  jst j2, j1, BTOT
  jldi j8, 0                    ; word g
gw_lap:
  jldi j1, 30
  jsub j1, j8, j1
  jjz j1, gw_done
  jldi j1, 3
  jshl j1, j8, j1
  jld j10, j1, HEARD            ; what it heard for g
  jjz j10, gw_next
  jldi j11, 0                   ; s
  jldi j1, 13
  jshl j4, j8, j1               ; READ address of word g
  jldi j1, 1
  jshi j1, 0
  jadd j4, j4, j1
  jldi j5, 0                    ; step t
  jldi j1, 0
  jld j6, j1, SLONG
  jwhile j6
    jldi j1, 3
    jshl j1, j5, j1
    jld j2, j1, STEPM           ; the top face at step t
    jldi j1, 3
    jshl j3, j5, j1
    jadd j3, j3, j4             ; READ offset of (g, piece 0, t)
    jldi j7, 16
    jwhile j7
      jldi j1, 1
      jand j1, j2, j1
      jjz j1, gs_next
      jld j1, j3, 0
      jadd j11, j11, j1
    gs_next:
      jldi j1, 1
      jshr j2, j2, j1
      jldi j1, 512
      jadd j3, j3, j1
      jldi j1, 1
      jsub j7, j7, j1
    jwend
    jldi j1, 1
    jadd j5, j5, j1
    jsub j6, j6, j1
  jwend
  jldi j1, 0                    ; better if s * BTOT > BSUM * heard
  jld j3, j1, BTOT
  jmul j3, j11, j3
  jld j2, j1, BSUM
  jmul j2, j2, j10
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, gw_next
  jst j8, j1, BEST
  jst j11, j1, BSUM
  jst j10, j1, BTOT
gw_next:
  jldi j1, 1
  jadd j8, j8, j1
  jjmp gw_lap
gw_done:
  jldi j1, 0                    ; it knows what it said: it learns what that sounded like
  jld j8, j1, THING
  jldi j1, 13
  jshl j4, j8, j1
  jldi j1, 1
  jshi j1, 0
  jadd j4, j4, j1
  jldi j5, 0
  jldi j10, 0                   ; how many notes
  jldi j1, 0
  jld j6, j1, SLONG
  jwhile j6
    jldi j1, 3
    jshl j1, j5, j1
    jld j2, j1, STEPM
    jldi j1, 3
    jshl j3, j5, j1
    jadd j3, j3, j4
    jldi j7, 16
    jwhile j7
      jldi j1, 1
      jand j1, j2, j1
      jjz j1, gl_next
      jld j1, j3, 0
      jldi j11, 1
      jadd j1, j1, j11
      jst j1, j3, 0
      jadd j10, j10, j11
    gl_next:
      jldi j1, 1
      jshr j2, j2, j1
      jldi j1, 512
      jadd j3, j3, j1
      jldi j1, 1
      jsub j7, j7, j1
    jwend
    jldi j1, 1
    jadd j5, j5, j1
    jsub j6, j6, j1
  jwend
  jldi j1, 3
  jshl j1, j8, j1
  jld j2, j1, HEARD
  jadd j2, j2, j10
  jst j2, j1, HEARD
  jldi j1, 0                    ; into the fingerprint: said * 1024 + (guess + 1) * 2 + right
  jld j2, j1, BEST
  jsub j3, j2, j8
  jldi j4, 0
  jjnz j3, gw_judged
  jldi j4, 1
gw_judged:
  jldi j3, 10
  jshl j12, j8, j3
  jldi j3, 1
  jadd j5, j2, j3
  jadd j12, j12, j5
  jadd j12, j12, j5
  jadd j12, j12, j4
  jcall mix
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

; j0 = (j0 * 31 + j12) mod 2^48. Uses j13, j14.
mix:
  jldi j13, 31
  jmul j0, j0, j13
  jadd j0, j0, j12
  jldi j13, 0
  jld j14, j13, M48
  jand j0, j0, j14
  jret
