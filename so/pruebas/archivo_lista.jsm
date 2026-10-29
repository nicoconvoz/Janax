; In an empty folder: create "a" and "b", list (2), delete "a", rename "b" to "c", list again (1: "c").
; Listing format: per label a qword with its length, then its bytes padded to 8.
; j0 = first count << 16 | second count << 8 | first byte of the second listing = 0x020163.
include '../../escalon0/janax.inc'
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h                   ; "a" at 200h, "b" at 208h followed by "c" at 209h
jldi j2, 61h
jst j2, j1, 0
jldi j2, 6362h
jst j2, j1, 8
jldi j10, 4                     ; open "a"
jadd j11, j1, j9
jldi j12, 1
jcall tocar
jshl j10, j13, j5               ; close it
jldi j8, 7
jor j10, j10, j8
jcall tocar
jldi j10, 4                     ; open "b"
jldi j11, 208h
jldi j12, 1
jcall tocar
jshl j10, j13, j5               ; close it
jldi j8, 7
jor j10, j10, j8
jcall tocar
jldi j10, 14                    ; list into 800h, 256 bytes
jldi j11, 800h
jldi j12, 100h
jcall tocar
jadd j6, j13, j9                ; first count
jldi j10, 12                    ; delete "a"
jadd j11, j1, j9
jldi j12, 1
jcall tocar
jldi j10, 1                     ; rename "b" -> "c": type = 13 | new label length << 32
jshl j10, j10, j5
jldi j8, 13
jor j10, j10, j8
jldi j11, 208h
jldi j12, 1
jcall tocar
jldi j10, 14                    ; list again
jldi j11, 800h
jldi j12, 100h
jcall tocar
jadd j7, j13, j9                ; second count
jldi j8, 16
jshl j0, j6, j8
jldi j8, 8
jshl j7, j7, j8
jor j0, j0, j7
jldb j7, j11, 8                 ; first byte of the first label listed
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
