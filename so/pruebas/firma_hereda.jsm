; 45 inherit signatures: the next child is born with "write" (kind 1, bit 1) already signed. The parent launches
; "hijo", greets it so it writes, and sleeps on its doorbell (29): the child's end rings it, and nothing waits for
; its signature. j0 = byte 0 who rang, byte 1 how many wait for my signature (18), from byte 2 what 45 answered.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j10, 45                    ; the next child: born with "write" signed
jldi j11, 0
jldi j12, 2
jcall tocar
jadd j7, j13, j9                ; what remained
jldi j5, 32
jldi j1, 200h                   ; "hijo" = 68 69 6A 6F
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jldi j10, 15                    ; launch: type = 16 | rights << 32
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jadd j11, j1, j9
jldi j12, 4
jcall tocar
jadd j6, j13, j9                ; the child's number
jldi j10, 28                    ; greeted: now it writes
jadd j11, j6, j9
jcall tocar
jldi j10, 29                    ; asleep on its doorbell
jcall tocar
jldi j8, 255
jand j0, j13, j8
jldi j10, 18                    ; what waits for my signature, into 800h
jldi j11, 800h
jldi j12, 100h
jcall tocar
jldi j8, 8
jshl j13, j13, j8
jor j0, j0, j13
jldi j8, 16
jshl j7, j7, j8
jor j0, j0, j7
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
