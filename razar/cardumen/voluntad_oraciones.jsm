; Razar's sentences with noise, in Janax (Capitan, 2026-11-06: everything in Janax; Perl stays as the measuring stick).
; The experiment of oraciones.pl, run by the will (this cabin) with the school as its child (cardumen_canto.jsm), the
; two talking in words. It reads its parameters from the file "p" (three qwords: the school's seed, the percent of
; slipping fingers, 1 if the school is quiet), has the school born from that seed (order 5), and then:
;   - learns the 30 words of its vocabulary, 20 passes: each word a song with the exact pieces of each greeting
;     (order 6), where a finger may slip (one of the key's 3 pieces lands on a neighbor of it on the bottom face);
;   - reads 40 sentences of 3 to 5 words drawn by dice, recognizing each word by its song;
;   - hears the 20 words it never heard, clean.
; Its dice are oraciones.pl's: seed2 = seed * 7919 + 1, seed2 = (seed2 * 1103515245 + 12345) mod 2^31, a throw is
; seed2 >> 16, in the same order. Every guess goes into j0 as said * 1024 + (guess + 1) * 2 + right (the new words:
; guess + 1), then the counts: j0 is oraciones.pl huella=1, bit for bit. And it writes how it went.
;
; Room 0 (50000h bytes):
QUEUE = 100h                    ; its window: one request
HIJO  = 200h                    ; "hijo"
PLAB  = 210h                    ; "p", the parameters file
NACE  = 220h                    ; the parameters: the school's seed
DESLIZ = 228h                   ; the percent of slipping fingers
QUIET = 230h                    ; 1: the school never learns
M48   = 300h                    ; 2^48 - 1
SEED2 = 308h                    ; its dice
CHILD = 310h                    ; the school's number
THING = 318h                    ; the word it says (0..49)
BEST  = 320h                    ; what it guessed (-1: nothing yet)
BSUM  = 328h                    ; the best share so far: BSUM / BTOT
BTOT  = 330h
SLONG = 338h                    ; how many steps the song lasted
WORD  = 340h                    ; the word it is saying
OKN   = 348h                    ; while learning: right, and said
ALLN  = 350h
WOK   = 358h                    ; in sentences: words right, and words
WALL  = 360h
SW    = 368h                    ; sentences read whole
SRIGHT = 370h                   ; this sentence still whole
CLEAN = 378h                    ; 1: a clean song (no finger slips)
SLENW = 380h                    ; this sentence: how many words
SENT  = 388h                    ; its words (up to 5, a qword each)
MAIL  = 3C0h                    ; a letter read from its mailbox: who said it, the word
KEYP  = 400h                    ; the keys: dot 0,1,4; dash 3,2,7; end of letter 12,13,8 (KEYP + key * 4 + j)
CURKEY = 410h                   ; the 3 pieces of the greeting being said
NBL   = 418h                    ; a piece's neighbors on the bottom face (up to 4)
NSONG = 420h                    ; how many greetings in the song
POS   = 428h                    ; how long the line it writes is so far
VOC   = 800h                    ; the 50 words as greetings, 2 bits each (0 dot, 1 dash, 2 end of letter, 3 the end),
                                ; two qwords each: the 30 of its vocabulary, then the 20 it never hears while learning
HEARD = 0C00h                   ; notes heard for each word, in all (a qword each)
STEPM = 0E00h                   ; the top face of each step of the song heard (a qword each, 64 steps)
SONGM = 1000h                   ; the song being said: the pieces of each greeting (a qword each)
TEXT  = 1400h                   ; the line it writes at the end
READ  = 10000h                  ; what it learned: word g, top piece 48 + j heard at step t READ + ((g*16 + j)*64 + t)*8
                                ; times (past what a load's offset reaches: its address goes in a register)
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
jldi j1, 0                      ; the keys
jstb j1, j2, KEYP
jldi j1, 1
jstb j1, j2, KEYP + 1
jldi j1, 4
jstb j1, j2, KEYP + 2
jldi j1, 3
jstb j1, j2, KEYP + 4
jldi j1, 2
jstb j1, j2, KEYP + 5
jldi j1, 7
jstb j1, j2, KEYP + 6
jldi j1, 12
jstb j1, j2, KEYP + 8
jldi j1, 13
jstb j1, j2, KEYP + 9
jldi j1, 8
jstb j1, j2, KEYP + 10
                                ; the 50 words, as greetings
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00E04h
jshi j1, 09580h
jst j1, j2, VOC + 0          ; sol
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 8
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 0E486h
jshi j1, 04204h
jst j1, j2, VOC + 16          ; luna
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 24
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00038h
jshi j1, 04925h
jst j1, j2, VOC + 32          ; mar
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 40
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00381h
jshi j1, 06214h
jst j1, j2, VOC + 48          ; pez
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 56
jldi j1, 00000h
jshi j1, 00E56h
jshi j1, 01184h
jshi j1, 09201h
jst j1, j2, VOC + 64          ; barco
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 72
jldi j1, 00000h
jshi j1, 000E5h
jshi j1, 06048h
jshi j1, 08211h
jst j1, j2, VOC + 80          ; cielo
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 88
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 03924h
jshi j1, 02164h
jst j1, j2, VOC + 96          ; agua
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 104
jldi j1, 00000h
jshi j1, 000E5h
jshi j1, 06162h
jshi j1, 04210h
jst j1, j2, VOC + 112          ; fuego
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 120
jldi j1, 00000h
jshi j1, 00039h
jshi j1, 02121h
jshi j1, 02209h
jst j1, j2, VOC + 128          ; tierra
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 136
jldi j1, 00000h
jshi j1, 000E5h
jshi j1, 06618h
jshi j1, 08240h
jst j1, j2, VOC + 144          ; viento
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 152
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 0E480h
jshi j1, 09211h
jst j1, j2, VOC + 160          ; casa
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 168
jldi j1, 00000h
jshi j1, 000E5h
jshi j1, 06121h
jshi j1, 02214h
jst j1, j2, VOC + 176          ; perro
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 184
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00E56h
jshi j1, 06485h
jst j1, j2, VOC + 192          ; gato
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 200
jldi j1, 00000h
jshi j1, 00E04h
jshi j1, 09580h
jshi j1, 06124h
jst j1, j2, VOC + 208          ; arbol
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 216
jldi j1, 00000h
jshi j1, 00038h
jshi j1, 04958h
jshi j1, 01210h
jst j1, j2, VOC + 224          ; flor
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 232
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 000E5h
jshi j1, 06084h
jst j1, j2, VOC + 240          ; rio
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 248
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 03898h
jshi j1, 06565h
jst j1, j2, VOC + 256          ; monte
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 264
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 03880h
jshi j1, 06421h
jst j1, j2, VOC + 272          ; nube
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 280
jldi j1, 0000Eh
jshi j1, 04824h
jshi j1, 00908h
jshi j1, 01204h
jst j1, j2, VOC + 288          ; lluvia
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 296
jldi j1, 00000h
jshi j1, 00E48h
jshi j1, 04818h
jshi j1, 08214h
jst j1, j2, VOC + 304          ; piedra
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 312
jldi j1, 00000h
jshi j1, 00E56h
jshi j1, 01825h
jshi j1, 09211h
jst j1, j2, VOC + 320          ; camino
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 328
jldi j1, 00000h
jshi j1, 00392h
jshi j1, 06122h
jshi j1, 04214h
jst j1, j2, VOC + 336          ; puerta
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 344
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00392h
jshi j1, 00225h
jst j1, j2, VOC + 352          ; mesa
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 360
jldi j1, 00000h
jshi j1, 00392h
jshi j1, 00481h
jshi j1, 02080h
jst j1, j2, VOC + 368          ; silla
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 376
jldi j1, 00000h
jshi j1, 00E56h
jshi j1, 01201h
jshi j1, 08204h
jst j1, j2, VOC + 384          ; libro
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 392
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00E56h
jshi j1, 01925h
jst j1, j2, VOC + 400          ; mano
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 408
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00E56h
jshi j1, 05495h
jst j1, j2, VOC + 416          ; ojo
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 424
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 03816h
jshi j1, 05640h
jst j1, j2, VOC + 432          ; voz
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 440
jldi j1, 00000h
jshi j1, 0000Eh
jshi j1, 05661h
jshi j1, 09211h
jst j1, j2, VOC + 448          ; canto
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 456
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 03920h
jshi j1, 02084h
jst j1, j2, VOC + 464          ; risa
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 472
jldi j1, 00003h
jshi j1, 09586h
jshi j1, 04961h
jshi j1, 02200h
jst j1, j2, VOC + 480          ; hermano (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 488
jldi j1, 00003h
jshi j1, 08649h
jshi j1, 08214h
jshi j1, 09211h
jst j1, j2, VOC + 496          ; capitan (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 504
jldi j1, 00000h
jshi j1, 000E4h
jshi j1, 01921h
jshi j1, 09254h
jst j1, j2, VOC + 512          ; janax (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 520
jldi j1, 00000h
jshi j1, 000E1h
jshi j1, 02481h
jshi j1, 06484h
jst j1, j2, VOC + 528          ; razar (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 536
jldi j1, 00003h
jshi j1, 09208h
jshi j1, 01958h
jshi j1, 01225h
jst j1, j2, VOC + 544          ; melodia (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 552
jldi j1, 00386h
jshi j1, 02590h
jshi j1, 08184h
jshi j1, 09211h
jst j1, j2, VOC + 560          ; cardumen (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 568
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00392h
jshi j1, 00495h
jst j1, j2, VOC + 576          ; ola (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 584
jldi j1, 00000h
jshi j1, 00003h
jshi j1, 09584h
jshi j1, 09210h
jst j1, j2, VOC + 592          ; faro (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 600
jldi j1, 03920h
jshi j1, 04909h
jshi j1, 05242h
jshi j1, 01201h
jst j1, j2, VOC + 608          ; brujula (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 616
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 0E195h
jshi j1, 09609h
jst j1, j2, VOC + 624          ; timon (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 632
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 0E481h
jshi j1, 02240h
jst j1, j2, VOC + 640          ; vela (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 648
jldi j1, 00000h
jshi j1, 000E4h
jshi j1, 08121h
jshi j1, 01864h
jst j1, j2, VOC + 656          ; ancla (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 664
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 0E481h
jshi j1, 02020h
jst j1, j2, VOC + 672          ; isla (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 680
jldi j1, 00000h
jshi j1, 00E56h
jshi j1, 06122h
jshi j1, 04214h
jst j1, j2, VOC + 688          ; puerto (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 696
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00E26h
jshi j1, 05601h
jst j1, j2, VOC + 704          ; bote (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 712
jldi j1, 000E4h
jshi j1, 08120h
jshi j1, 04884h
jshi j1, 09808h
jst j1, j2, VOC + 720          ; estrella (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 728
jldi j1, 00000h
jshi j1, 000E2h
jshi j1, 00084h
jshi j1, 06561h
jst j1, j2, VOC + 736          ; noche (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 744
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00039h
jshi j1, 02081h
jst j1, j2, VOC + 752          ; dia (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 760
jldi j1, 00000h
jshi j1, 0000Eh
jshi j1, 05616h
jshi j1, 04254h
jst j1, j2, VOC + 768          ; jugo (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 776
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 03825h
jshi j1, 02091h
jst j1, j2, VOC + 784          ; kiwi (nunca la oye al aprender)
jldi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jshi j1, 00000h
jst j1, j2, VOC + 792

jldi j1, 0                      ; its parameters: open "p" (request 4) and read 24 bytes (request 5)
jldi j2, 70h
jst j2, j1, PLAB
jldi j10, 4
jldi j11, PLAB
jldi j12, 1
jcall ask
jldi j1, 32
jshl j10, j13, j1               ; the handle travels in the high half of the kind
jldi j1, 5
jor j10, j10, j1
jldi j11, NACE
jldi j12, 24
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

jldi j1, 0                      ; the school is born from the seed, quiet or not (order 5)
jld j2, j1, NACE
jldi j3, 16
jshl j2, j2, j3
jld j3, j1, QUIET
jldi j4, 8
jshl j3, j3, j4
jor j2, j2, j3
jldi j3, 5
jor j2, j2, j3
jst j2, j1, WORD
jcall say
jld j2, j1, NACE                ; and its own dice: seed * 7919 + 1
jldi j3, 7919
jmul j2, j2, j3
jldi j3, 1
jadd j2, j2, j3
jst j2, j1, SEED2

jldi j15, 20                    ; it learns: 20 passes over its 30 words, fingers slipping
jwhile j15
  jldi j1, 0
  jst j1, j1, THING
  jldi j9, 30
  jwhile j9
    jldi j1, 0
    jst j1, j1, CLEAN
    jcall sing
    jcall guess
    jldi j1, 0                  ; right, and said
    jld j2, j1, ALLN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ALLN
    jld j2, j1, BEST
    jld j4, j1, THING
    jsub j2, j2, j4
    jjnz j2, l_counted
    jld j2, j1, OKN
    jadd j2, j2, j3
    jst j2, j1, OKN
  l_counted:
    jcall hg
    jcall learn
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

jldi j15, 40                    ; it reads 40 sentences: how many words (3 + a throw mod 3), then each word (a throw
jwhile j15                      ; mod 30), then each one heard
  jcall rnd2
  jldi j1, 3
  jdiv j2, j13, j1
  jmul j2, j2, j1
  jsub j2, j13, j2
  jadd j2, j2, j1
  jldi j1, 0
  jst j2, j1, SLENW
  jldi j3, 0
  jwhile j2
    jcall rnd2
    jldi j1, 30
    jdiv j4, j13, j1
    jmul j4, j4, j1
    jsub j4, j13, j4
    jst j4, j3, SENT
    jldi j1, 8
    jadd j3, j3, j1
    jldi j1, 1
    jsub j2, j2, j1
  jwend
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, SRIGHT
  jldi j9, 0                    ; SENT offset of the word
s_word:
  jldi j1, 0
  jld j2, j1, SLENW
  jldi j3, 3
  jshl j2, j2, j3
  jsub j2, j9, j2
  jjz j2, s_read
  jld j4, j9, SENT
  jst j4, j1, THING
  jst j1, j1, CLEAN
  jcall sing
  jcall guess
  jcall hg
  jldi j1, 0
  jld j2, j1, WALL
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, WALL
  jld j2, j1, BEST
  jld j4, j1, THING
  jsub j2, j2, j4
  jjnz j2, s_wrong
  jld j2, j1, WOK
  jadd j2, j2, j3
  jst j2, j1, WOK
  jjmp s_on
s_wrong:
  jst j1, j1, SRIGHT
s_on:
  jldi j1, 8
  jadd j9, j9, j1
  jjmp s_word
s_read:
  jld j2, j1, SRIGHT
  jld j3, j1, SW
  jadd j3, j3, j2
  jst j3, j1, SW
  jldi j1, 1
  jsub j15, j15, j1
jwend

jldi j1, 30                     ; the 20 words it never heard, clean: what it takes each for
jldi j2, 0
jst j1, j2, THING
jldi j9, 20
jwhile j9
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, CLEAN
  jcall sing
  jcall guess
  jldi j1, 0
  jld j12, j1, BEST
  jldi j2, 1
  jadd j12, j12, j2
  jcall mix
  jldi j1, 0
  jld j2, j1, THING
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, THING
  jsub j9, j9, j3
jwend

jldi j1, 0                      ; the counts
jld j12, j1, OKN
jcall mix
jld j12, j1, ALLN
jcall mix
jld j12, j1, WOK
jcall mix
jld j12, j1, WALL
jcall mix
jld j12, j1, SW
jcall mix

jldi j1, 0                      ; the school ends (order 3: it says its fingerprint, not mixed here)
jldi j2, 3
jst j2, j1, WORD
jcall say
jcall hear

jldi j7, 0                      ; how it went, as oraciones.pl says it
jcall f1
jldi j1, 0
jld j2, j1, OKN
jldi j3, 100
jmul j2, j2, j3
jld j3, j1, ALLN
jdiv j2, j2, j3
jcall putnum
jcall f2
jldi j1, 0
jld j2, j1, WOK
jldi j3, 100
jmul j2, j2, j3
jld j3, j1, WALL
jdiv j2, j2, j3
jcall putnum
jcall f3
jldi j1, 0
jld j2, j1, SW
jcall putnum
jcall f4
jldi j10, 1
jldi j11, TEXT
jldi j1, 0
jadd j12, j7, j1
jcall ask
jhalt

; One song: the word THING (0..49) as greetings, each with its key's pieces; unless CLEAN, a finger may slip (a throw
; mod 100 below DESLIZ: one of the 3 pieces, a throw mod 3, lands on one of its neighbors on the bottom face, a throw
; mod how many). Said as order 6 (how many, then each greeting's pieces); the school's answer (how many steps, the
; top face of each) into SLONG and STEPM. Uses j1-j8, j10-j14 (keeps j9, j15).
sing:
  jldi j1, 0
  jld j2, j1, THING
  jldi j3, 4
  jshl j8, j2, j3               ; VOC offset of the word
  jldi j5, 0                    ; greeting k
g_code:
  jldi j3, 5                    ; code k: (VOC[w*16 + (k >> 5)*8] >> ((k & 31)*2)) & 3
  jshr j4, j5, j3
  jldi j3, 3
  jshl j4, j4, j3
  jadd j4, j4, j8
  jld j6, j4, VOC
  jldi j3, 31
  jand j4, j5, j3
  jadd j4, j4, j4
  jshr j6, j6, j4
  jldi j3, 3
  jand j6, j6, j3
  jsub j4, j6, j3
  jjz j4, g_coded               ; 3: the end of the song
  jldi j3, 2
  jshl j4, j6, j3               ; its key's 3 pieces
  jldi j3, 0
  jldb j1, j4, KEYP
  jstb j1, j3, CURKEY
  jldb j1, j4, KEYP + 1
  jstb j1, j3, CURKEY + 1
  jldb j1, j4, KEYP + 2
  jstb j1, j3, CURKEY + 2
  jld j1, j3, CLEAN
  jjnz j1, g_mask
  jld j1, j3, DESLIZ
  jjz j1, g_mask
  jcall rnd2                    ; does a finger slip?
  jldi j3, 100
  jdiv j4, j13, j3
  jmul j4, j4, j3
  jsub j4, j13, j4
  jldi j3, 0
  jld j1, j3, DESLIZ
  jsub j4, j4, j1
  jldi j3, 63
  jsar j4, j4, j3
  jjz j4, g_mask
  jcall rnd2                    ; which of the 3 pieces
  jldi j3, 3
  jdiv j4, j13, j3
  jmul j4, j4, j3
  jsub j7, j13, j4
  jldb j1, j7, CURKEY
  jldi j2, 0                    ; its neighbors on the bottom face: +x, -x, +y, -y
  jldi j3, 3
  jand j4, j1, j3               ; x
  jsub j6, j4, j3
  jjz j6, g_nx1
  jldi j6, 1
  jadd j6, j1, j6
  jstb j6, j2, NBL
  jldi j6, 1
  jadd j2, j2, j6
g_nx1:
  jjz j4, g_nx2
  jldi j6, 1
  jsub j6, j1, j6
  jstb j6, j2, NBL
  jldi j6, 1
  jadd j2, j2, j6
g_nx2:
  jldi j3, 2
  jshr j4, j1, j3               ; y
  jldi j3, 3
  jsub j6, j4, j3
  jjz j6, g_ny1
  jldi j6, 4
  jadd j6, j1, j6
  jstb j6, j2, NBL
  jldi j6, 1
  jadd j2, j2, j6
g_ny1:
  jjz j4, g_ny2
  jldi j6, 4
  jsub j6, j1, j6
  jstb j6, j2, NBL
  jldi j6, 1
  jadd j2, j2, j6
g_ny2:
  jcall rnd2                    ; which neighbor
  jdiv j4, j13, j2
  jmul j4, j4, j2
  jsub j4, j13, j4
  jldb j1, j4, NBL
  jstb j1, j7, CURKEY
g_mask:
  jldi j3, 0                    ; the greeting's pieces, as a set
  jldi j6, 0
  jldi j4, 1
  jldb j1, j3, CURKEY
  jshl j2, j4, j1
  jor j6, j6, j2
  jldb j1, j3, CURKEY + 1
  jshl j2, j4, j1
  jor j6, j6, j2
  jldb j1, j3, CURKEY + 2
  jshl j2, j4, j1
  jor j6, j6, j2
  jldi j3, 3
  jshl j4, j5, j3
  jst j6, j4, SONGM
  jldi j3, 1
  jadd j5, j5, j3
  jjmp g_code
g_coded:
  jldi j1, 0                    ; order 6: how many, then each greeting
  jst j5, j1, NSONG
  jldi j3, 8
  jshl j2, j5, j3
  jldi j3, 6
  jor j2, j2, j3
  jst j2, j1, WORD
  jcall say
  jldi j4, 0
  jwhile j5
    jld j2, j4, SONGM
    jldi j1, 0
    jst j2, j1, WORD
    jcall say
    jldi j1, 8
    jadd j4, j4, j1
    jldi j1, 1
    jsub j5, j5, j1
  jwend
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
  jldi j7, 0
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
  jret

; Its dice: seed2 = (seed2 * 1103515245 + 12345) mod 2^31 -> j13 = seed2 >> 16. Uses j14.
rnd2:
  jldi j13, 0
  jld j14, j13, SEED2
  jldi j13, 41C6h
  jshi j13, 4E6Dh
  jmul j14, j14, j13
  jldi j13, 3039h
  jadd j14, j14, j13
  jldi j13, 7FFFh
  jshi j13, 0FFFFh
  jand j14, j14, j13
  jldi j13, 0
  jst j14, j13, SEED2
  jldi j13, 16
  jshr j13, j14, j13
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
; looks again. Uses j1, j10-j14.
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
  jjmp hear
h_got:
  jret

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

; What it guesses: the word whose notes it heard most, as a share of all it heard for it (BEST, -1 if none).
; Uses j1-j8, j10-j14 (keeps j9, j15).
guess:
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
  jret

; It knows what it said (THING): it learns what that sounded like. Uses j1-j8, j10, j11.
learn:
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
  jret

; Into the fingerprint: said * 1024 + (guess + 1) * 2 + right. Uses j2-j5, j8, j12-j14.
hg:
  jldi j1, 0
  jld j8, j1, THING
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

; The fixed text "palabras reconocidas aprendiendo: " at TEXT + j7; j7 moves past it. Uses j1.
f1:
  jldi j1, 112
  jstb j1, j7, TEXT + 0
  jldi j1, 97
  jstb j1, j7, TEXT + 1
  jldi j1, 108
  jstb j1, j7, TEXT + 2
  jldi j1, 97
  jstb j1, j7, TEXT + 3
  jldi j1, 98
  jstb j1, j7, TEXT + 4
  jldi j1, 114
  jstb j1, j7, TEXT + 5
  jldi j1, 97
  jstb j1, j7, TEXT + 6
  jldi j1, 115
  jstb j1, j7, TEXT + 7
  jldi j1, 32
  jstb j1, j7, TEXT + 8
  jldi j1, 114
  jstb j1, j7, TEXT + 9
  jldi j1, 101
  jstb j1, j7, TEXT + 10
  jldi j1, 99
  jstb j1, j7, TEXT + 11
  jldi j1, 111
  jstb j1, j7, TEXT + 12
  jldi j1, 110
  jstb j1, j7, TEXT + 13
  jldi j1, 111
  jstb j1, j7, TEXT + 14
  jldi j1, 99
  jstb j1, j7, TEXT + 15
  jldi j1, 105
  jstb j1, j7, TEXT + 16
  jldi j1, 100
  jstb j1, j7, TEXT + 17
  jldi j1, 97
  jstb j1, j7, TEXT + 18
  jldi j1, 115
  jstb j1, j7, TEXT + 19
  jldi j1, 32
  jstb j1, j7, TEXT + 20
  jldi j1, 97
  jstb j1, j7, TEXT + 21
  jldi j1, 112
  jstb j1, j7, TEXT + 22
  jldi j1, 114
  jstb j1, j7, TEXT + 23
  jldi j1, 101
  jstb j1, j7, TEXT + 24
  jldi j1, 110
  jstb j1, j7, TEXT + 25
  jldi j1, 100
  jstb j1, j7, TEXT + 26
  jldi j1, 105
  jstb j1, j7, TEXT + 27
  jldi j1, 101
  jstb j1, j7, TEXT + 28
  jldi j1, 110
  jstb j1, j7, TEXT + 29
  jldi j1, 100
  jstb j1, j7, TEXT + 30
  jldi j1, 111
  jstb j1, j7, TEXT + 31
  jldi j1, 58
  jstb j1, j7, TEXT + 32
  jldi j1, 32
  jstb j1, j7, TEXT + 33
  jldi j1, 34
  jadd j7, j7, j1
  jret

; The fixed text "%; en oraciones: " at TEXT + j7; j7 moves past it. Uses j1.
f2:
  jldi j1, 37
  jstb j1, j7, TEXT + 0
  jldi j1, 59
  jstb j1, j7, TEXT + 1
  jldi j1, 32
  jstb j1, j7, TEXT + 2
  jldi j1, 101
  jstb j1, j7, TEXT + 3
  jldi j1, 110
  jstb j1, j7, TEXT + 4
  jldi j1, 32
  jstb j1, j7, TEXT + 5
  jldi j1, 111
  jstb j1, j7, TEXT + 6
  jldi j1, 114
  jstb j1, j7, TEXT + 7
  jldi j1, 97
  jstb j1, j7, TEXT + 8
  jldi j1, 99
  jstb j1, j7, TEXT + 9
  jldi j1, 105
  jstb j1, j7, TEXT + 10
  jldi j1, 111
  jstb j1, j7, TEXT + 11
  jldi j1, 110
  jstb j1, j7, TEXT + 12
  jldi j1, 101
  jstb j1, j7, TEXT + 13
  jldi j1, 115
  jstb j1, j7, TEXT + 14
  jldi j1, 58
  jstb j1, j7, TEXT + 15
  jldi j1, 32
  jstb j1, j7, TEXT + 16
  jldi j1, 17
  jadd j7, j7, j1
  jret

; The fixed text "% de las palabras, " at TEXT + j7; j7 moves past it. Uses j1.
f3:
  jldi j1, 37
  jstb j1, j7, TEXT + 0
  jldi j1, 32
  jstb j1, j7, TEXT + 1
  jldi j1, 100
  jstb j1, j7, TEXT + 2
  jldi j1, 101
  jstb j1, j7, TEXT + 3
  jldi j1, 32
  jstb j1, j7, TEXT + 4
  jldi j1, 108
  jstb j1, j7, TEXT + 5
  jldi j1, 97
  jstb j1, j7, TEXT + 6
  jldi j1, 115
  jstb j1, j7, TEXT + 7
  jldi j1, 32
  jstb j1, j7, TEXT + 8
  jldi j1, 112
  jstb j1, j7, TEXT + 9
  jldi j1, 97
  jstb j1, j7, TEXT + 10
  jldi j1, 108
  jstb j1, j7, TEXT + 11
  jldi j1, 97
  jstb j1, j7, TEXT + 12
  jldi j1, 98
  jstb j1, j7, TEXT + 13
  jldi j1, 114
  jstb j1, j7, TEXT + 14
  jldi j1, 97
  jstb j1, j7, TEXT + 15
  jldi j1, 115
  jstb j1, j7, TEXT + 16
  jldi j1, 44
  jstb j1, j7, TEXT + 17
  jldi j1, 32
  jstb j1, j7, TEXT + 18
  jldi j1, 19
  jadd j7, j7, j1
  jret

; The fixed text " de 40 oraciones enteras" and a new line, at TEXT + j7; j7 moves past it. Uses j1.
f4:
  jldi j1, 32
  jstb j1, j7, TEXT + 0
  jldi j1, 100
  jstb j1, j7, TEXT + 1
  jldi j1, 101
  jstb j1, j7, TEXT + 2
  jldi j1, 32
  jstb j1, j7, TEXT + 3
  jldi j1, 52
  jstb j1, j7, TEXT + 4
  jldi j1, 48
  jstb j1, j7, TEXT + 5
  jldi j1, 32
  jstb j1, j7, TEXT + 6
  jldi j1, 111
  jstb j1, j7, TEXT + 7
  jldi j1, 114
  jstb j1, j7, TEXT + 8
  jldi j1, 97
  jstb j1, j7, TEXT + 9
  jldi j1, 99
  jstb j1, j7, TEXT + 10
  jldi j1, 105
  jstb j1, j7, TEXT + 11
  jldi j1, 111
  jstb j1, j7, TEXT + 12
  jldi j1, 110
  jstb j1, j7, TEXT + 13
  jldi j1, 101
  jstb j1, j7, TEXT + 14
  jldi j1, 115
  jstb j1, j7, TEXT + 15
  jldi j1, 32
  jstb j1, j7, TEXT + 16
  jldi j1, 101
  jstb j1, j7, TEXT + 17
  jldi j1, 110
  jstb j1, j7, TEXT + 18
  jldi j1, 116
  jstb j1, j7, TEXT + 19
  jldi j1, 101
  jstb j1, j7, TEXT + 20
  jldi j1, 114
  jstb j1, j7, TEXT + 21
  jldi j1, 97
  jstb j1, j7, TEXT + 22
  jldi j1, 115
  jstb j1, j7, TEXT + 23
  jldi j1, 10
  jstb j1, j7, TEXT + 24
  jldi j1, 25
  jadd j7, j7, j1
  jret
