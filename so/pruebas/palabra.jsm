; A greeting that carries a word (Capitan, 2026-11-06: "the greeting is not a pulse but a written word: before it was
; a bit, now it is the bits of words"). The mother launches "hijo", which says "hola" and then "sol" to her (request
; 30). She waits for the greeting (29: the bit is still the doorbell), waits again (so both words are in: the second
; wait answers when the child greets again or ends), and reads her mailbox (31) in order: who said it, and the word.
; A third read finds it empty (0), and saying a word to a cabin outside the family answers -1.
; j0 = who greeted + first word + its sender + (second word << 32) + empty read + (outside answer + 1)
;    = 1 + "hola" + 1 + ("sol" << 32) + 0 + 0 = 006C6F73616C6F6A.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h                   ; "hijo" = 68 69 6A 6F
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jcall lanzar
jldi j0, 0
jldi j10, 29                    ; the doorbell: who greeted
jcall tocar
jadd j0, j0, j13
jldi j10, 29                    ; both words in (greeted again, or the child ended)
jcall tocar
jldi j10, 31                    ; the first word, and who said it
jldi j11, 300h
jldi j12, 16
jcall tocar
jldi j1, 300h
jld j2, j1, 8
jadd j0, j0, j2
jld j2, j1, 0
jadd j0, j0, j2
jldi j10, 31                    ; the second word
jcall tocar
jldi j1, 300h
jld j2, j1, 8
jshl j2, j2, j5
jadd j0, j0, j2
jldi j10, 31                    ; nothing left: 0
jcall tocar
jadd j0, j0, j13
jldi j10, 30                    ; a word to cabin 9, not family: -1
jldi j11, 9
jldi j12, 1
jcall tocar
jadd j0, j0, j13
jldi j2, 1
jadd j0, j0, j2
jhalt
lanzar:                         ; "hijo", with every right
jldi j10, 15
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jldi j11, 200h
jldi j12, 4
jcall tocar
jret
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
