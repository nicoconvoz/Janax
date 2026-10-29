; The PDP assembler (Capitan): Janax assembled by Janax, on Janax OS. It walks the folder PDP of the system
; and builds every source "X.jsm" into "X.bin". A source whose fingerprint (its bytes and the assembler's
; table) is the one saved in "X.huella" is already built and is not built again.
; The names it knows (instructions, registers, directives) come from its table, ensamblador.datos, which
; anyone can change. j0 at the end = sources built + (sources with errors << 32).
;
; It understands: comments, labels, "name = expression", the instructions, jwhile/jwhilez/jwend, jfirst, dd,
; expressions with numbers (decimal, hexadecimal ending in h), names, $, + - * / and parentheses, and the
; structures: include (janax.inc is the language itself and is not read; any other file is, relative to the
; source's folder), repeat ... end repeat, and macros with parameters, local names and <grouped, arguments>.
; Those three are nested texts: a file read, a body copied as many times as asked, a body with its
; arguments in place; each one is read as part of the source and then reading goes back where it was (a
; stack of places to go back to). The fingerprint also takes every included file, so changing one rebuilds
; what uses it: the first pass always runs to learn them.
;
; Registers: j12 = 8, j13 = 1, j14 = 0 (globals live at fixed addresses below 8000h), j15 = data stack.
; Routines take j1-j3 and answer in j0; j0-j7 are free to change, j8-j11 are kept (saved on the stack).
include '../../../escalon0/janax.inc'

; --- memory: room 0 ---
; 0         the table (ensamblador.datos): 16-byte entries, name (8 bytes), value (dword), format (dword)
; 1000h     request queue
; 1040h     variables
; 1200h     output label, 1300h fingerprint label, 1400h fingerprint bytes
; 1500h     places to go back to when a nested text ends (8 bytes each, 32 deep)
; 1800h     label of an included file (512 bytes)
; 1A00h     arguments of a macro, 1B00h its parameters, 1C00h its local names (16 of each: address, bytes)
; 2000h     open whiles: 32 bytes each (body address, register, condition, order), 128 deep
; 3000h     where the condition of each while is, by order (8 bytes each), 2560 whiles
; 10000h    folder listing (64 KiB)
; 20000h    source (1 MiB), a 0 after it
; 120000h   output (1 MiB)
; 220000h   symbols: 65536 entries of 32 bytes (name address, name bytes, value, generation)
; 420000h   macros: 4096 entries of 32 bytes (name address, name bytes, where its parameters start, generation)
; 440000h   nested texts of a pass (2 MiB): included files, repeated bodies, expanded macros, each ending in 0
QUEUE     = 1000h
V_POS     = 1040h
V_PC      = 1048h
V_PASS    = 1050h
V_ERR     = 1058h
V_NWHILE  = 1060h
V_WDEPTH  = 1068h
V_COUNT   = 1070h
V_ERRS    = 1078h
V_TOK     = 1080h
V_TOKLEN  = 1088h
V_LEFT    = 1090h
V_LP      = 1098h
V_NAME    = 10A0h
V_NAMELEN = 10A8h
V_BASELEN = 10B0h
V_TABHASH = 10B8h
V_HASH    = 10C0h
V_GEN     = 10C8h
V_OP      = 10D0h
V_FMT     = 10D8h
V_DEFTOK  = 10E0h
V_DEFLEN  = 10E8h
V_RD      = 10F0h
V_RA      = 10F8h
V_TEXT    = 1100h               ; where the next nested text goes
V_FDEPTH  = 1108h               ; places to go back to
V_SWITCH  = 1110h               ; 1: the statement moved the reading into a nested text
V_EXPAND  = 1118h               ; macro expansions in this pass (names their local labels)
V_ARGC    = 1120h
V_PARC    = 1128h
V_LOCC    = 1130h
V_BODY    = 1138h
V_BODYEND = 1140h
V_BACK    = 1148h               ; where reading goes on after the statement
V_N       = 1150h
V_START   = 1158h
V_STOP    = 1160h
V_NEST    = 1168h
V_LINE    = 1170h
V_TABLE   = 1178h               ; find_entry: the table and its mask
V_MASK    = 1180h
OUTLBL    = 1200h
HLBL      = 1300h
FPBUF     = 1400h
FRAMES    = 1500h
INCLBL    = 1800h
ARGS      = 1A00h
PARAMS    = 1B00h
LOCALS    = 1C00h
WSTACK    = 2000h
CHECKS    = 3000h

; formats of the table (the same numbers as ensamblador.datos)
F_NONE    = 0
F_RI      = 1
F_RRR     = 2
F_T       = 3
F_RT      = 4
F_RRI     = 5
F_RR      = 6
F_WHILE   = 7
F_WEND    = 8
F_FIRST   = 9
F_DD      = 10
F_CONST   = 11
F_INCLUDE = 12
F_MACRO   = 13
F_REPEAT  = 14
F_END     = 15
F_LOCAL   = 16

start:
jfirst j1, 640000h
jldi j12, 8
jldi j13, 1
jldi j14, 0
jcall table_hash
jldi j1, 14                     ; list the system's folder into 10000h
jldi j2, 1
jldi j3, 16
jshl j2, j2, j3
jadd j3, j2, j14
jcall sys1
jst j0, j14, V_LEFT
jldi j1, 63
jshr j1, j0, j1
jjz j1, list_ok
jst j14, j14, V_LEFT            ; nothing could be listed
list_ok:
jldi j1, 1
jldi j2, 16
jshl j1, j1, j2
jst j1, j14, V_LP
jld j0, j14, V_LEFT
jwhile j0                       ; every label: its length (qword), then its bytes padded to 8
  jld j1, j14, V_LP
  jld j2, j1, 0
  jadd j1, j1, j12
  jcall want
  jjz j0, next_entry
  jld j1, j14, V_LP
  jld j2, j1, 0
  jadd j1, j1, j12
  jcall do_file
next_entry:
  jld j1, j14, V_LP
  jld j2, j1, 0
  jldi j3, 7
  jadd j2, j2, j3
  jldi j3, -8
  jand j2, j2, j3
  jadd j1, j1, j2
  jadd j1, j1, j12
  jst j1, j14, V_LP
  jld j0, j14, V_LEFT
  jsub j0, j0, j13
  jst j0, j14, V_LEFT
jwend
jld j0, j14, V_ERRS
jldi j1, 32
jshl j0, j0, j1
jld j1, j14, V_COUNT
jor j0, j0, j1
jhalt

; One request through the window: j1 type, j2 a, j3 b -> j0 its answer. Uses j4.
sys1:
jldi j4, QUEUE
jst j13, j4, 0
jst j1, j4, 8
jst j2, j4, 16
jst j3, j4, 24
jsys j0, j4
jld j0, j4, 32
jret

; j1 label, j2 its bytes, j3 where, j4 room -> j0 bytes read, negative if it cannot be opened.
read_file:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jsub j15, j15, j12
jst j10, j15, 0
jadd j9, j3, j14
jadd j10, j4, j14
jadd j3, j2, j14
jadd j2, j1, j14
jldi j1, 4                      ; open
jcall sys1
jadd j8, j0, j14
jldi j1, 63
jshr j1, j0, j1
jjz j1, rf_open
jldi j0, -1
jjmp rf_out
rf_open:
jldi j1, 32
jshl j1, j8, j1
jldi j2, 5
jor j1, j1, j2                  ; read
jadd j2, j9, j14
jadd j3, j10, j14
jcall sys1
jadd j9, j0, j14
jldi j1, 32
jshl j1, j8, j1
jldi j2, 7
jor j1, j1, j2                  ; close
jcall sys1
jadd j0, j9, j14
rf_out:
jld j10, j15, 0
jadd j15, j15, j12
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; j1 label, j2 its bytes, j3 from, j4 bytes: the file holds exactly those bytes.
write_file:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jsub j15, j15, j12
jst j10, j15, 0
jsub j15, j15, j12
jst j11, j15, 0
jadd j8, j1, j14
jadd j9, j2, j14
jadd j10, j3, j14
jadd j11, j4, j14
jldi j1, 12                     ; delete the old one (it may not be there)
jadd j2, j8, j14
jadd j3, j9, j14
jcall sys1
jldi j1, 4                      ; open: it is created
jadd j2, j8, j14
jadd j3, j9, j14
jcall sys1
jadd j8, j0, j14
jldi j1, 63
jshr j1, j0, j1
jjnz j1, wf_out
jldi j1, 32
jshl j1, j8, j1
jldi j2, 6
jor j1, j1, j2                  ; write
jadd j2, j10, j14
jadd j3, j11, j14
jcall sys1
jldi j1, 32
jshl j1, j8, j1
jldi j2, 7
jor j1, j1, j2                  ; close
jcall sys1
wf_out:
jld j11, j15, 0
jadd j15, j15, j12
jld j10, j15, 0
jadd j15, j15, j12
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; j3 = the FNV-1a basis. Keeps everything else.
fnv_basis:
jldi j3, 0CBF2h
jshi j3, 9CE4h
jshi j3, 8422h
jshi j3, 2325h
jret

; FNV-1a: j1 bytes, j2 how many, j3 the hash so far -> j0. Uses j4, j5.
fnv:
jadd j0, j3, j14
jldi j4, 100h
jshi j4, 0
jshi j4, 01B3h
jwhile j2
  jldb j5, j1, 0
  jxor j0, j0, j5
  jmul j0, j0, j4
  jadd j1, j1, j13
  jsub j2, j2, j13
jwend
jret

; V_TABHASH = the fingerprint of the table, its empty entry included.
table_hash:
jldi j1, 0
jld j2, j1, 0
jwhile j2
  jldi j3, 16
  jadd j1, j1, j3
  jld j2, j1, 0
jwend
jldi j3, 16
jadd j2, j1, j3
jldi j1, 0
jcall fnv_basis
jcall fnv
jst j0, j14, V_TABHASH
jret

; j1 label, j2 its bytes -> j0 = 1 if it is "PDP/....jsm".
want:
jldi j0, 0
jldi j3, 8
jsub j3, j2, j3
jldi j4, 63
jshr j3, j3, j4
jjnz j3, want_no                ; shorter than "PDP/" + ".jsm"
jld j3, j1, 0
jldi j4, 32
jshl j3, j3, j4
jshr j3, j3, j4
jldi j4, 2F50h
jshi j4, 4450h                  ; "PDP/"
jsub j3, j3, j4
jjnz j3, want_no
jadd j5, j1, j2
jldi j4, 4
jsub j5, j5, j4
jldb j6, j5, 0
jldb j7, j5, 1
jldi j4, 8
jshl j7, j7, j4
jor j6, j6, j7
jldb j7, j5, 2
jldi j4, 16
jshl j7, j7, j4
jor j6, j6, j7
jldb j7, j5, 3
jldi j4, 24
jshl j7, j7, j4
jor j6, j6, j7
jldi j4, 6D73h
jshi j4, 6A2Eh                  ; ".jsm"
jsub j6, j6, j4
jjnz j6, want_no
jldi j0, 1
want_no:
jret

; Copies j2 bytes from j1 to j3 -> j3 = after the last one. Uses j4.
copy_bytes:
jwhile j2
  jldb j4, j1, 0
  jstb j4, j3, 0
  jadd j1, j1, j13
  jadd j3, j3, j13
  jsub j2, j2, j13
jwend
jret

; One source: j1 its label, j2 its bytes.
do_file:
jst j1, j14, V_NAME
jst j2, j14, V_NAMELEN
jldi j3, 4
jsub j2, j2, j3
jst j2, j14, V_BASELEN
jldi j3, OUTLBL                 ; "X.bin"
jcall copy_bytes
jldi j4, 2Eh
jstb j4, j3, 0
jldi j4, 62h
jstb j4, j3, 1
jldi j4, 69h
jstb j4, j3, 2
jldi j4, 6Eh
jstb j4, j3, 3
jld j1, j14, V_NAME             ; "X.huella"
jld j2, j14, V_BASELEN
jldi j3, HLBL
jcall copy_bytes
jldi j4, 2Eh
jstb j4, j3, 0
jldi j4, 68h
jstb j4, j3, 1
jldi j4, 75h
jstb j4, j3, 2
jldi j4, 65h
jstb j4, j3, 3
jldi j4, 6Ch
jstb j4, j3, 4
jstb j4, j3, 5
jldi j4, 61h
jstb j4, j3, 6
jld j1, j14, V_NAME             ; the source, with a 0 after it
jld j2, j14, V_NAMELEN
jldi j3, 2
jshi j3, 0
jldi j4, 10h
jshi j4, 0
jsub j4, j4, j12
jcall read_file
jldi j1, 63
jshr j1, j0, j1
jjnz j1, df_out
jldi j3, 2
jshi j3, 0
jadd j3, j3, j0
jstb j14, j3, 0
jldi j1, 2                      ; its fingerprint: the table and the source
jshi j1, 0
jadd j2, j0, j14
jld j3, j14, V_TABHASH
jcall fnv
jst j0, j14, V_HASH
jcall assemble_first            ; learns the labels and adds the included files to the fingerprint
jjz j0, df_error
jst j14, j14, FPBUF             ; the fingerprint of the last build
jldi j1, HLBL
jld j2, j14, V_BASELEN
jldi j3, 7
jadd j2, j2, j3
jldi j3, FPBUF
jldi j4, 8
jcall read_file
jsub j0, j0, j12
jjnz j0, df_build
jld j0, j14, FPBUF
jld j1, j14, V_HASH
jsub j0, j0, j1
jjz j0, df_out                  ; the same: already built
df_build:
jcall assemble_second
jjnz j0, df_write
df_error:
jld j0, j14, V_ERRS
jadd j0, j0, j13
jst j0, j14, V_ERRS
jjmp df_out
df_write:
jldi j1, OUTLBL
jld j2, j14, V_BASELEN
jldi j3, 4
jadd j2, j2, j3
jldi j3, 12h
jshi j3, 0
jld j4, j14, V_PC
jcall write_file
jld j0, j14, V_HASH
jst j0, j14, FPBUF
jldi j1, HLBL
jld j2, j14, V_BASELEN
jldi j3, 7
jadd j2, j2, j3
jldi j3, FPBUF
jldi j4, 8
jcall write_file
jld j0, j14, V_COUNT
jadd j0, j0, j13
jst j0, j14, V_COUNT
df_out:
jret

; The first pass over the source at 20000h -> j0 = 1, or 0 if it has errors.
assemble_first:
jld j0, j14, V_GEN              ; a new generation: the symbols and macros of the last source are gone
jadd j0, j0, j13
jst j0, j14, V_GEN
jst j13, j14, V_PASS
jcall run_pass
jld j0, j14, V_ERR
jjnz j0, as_fail
jldi j0, 1
jret
as_fail:
jldi j0, 0
jret

; The second pass -> j0 = 1 and the words at 120000h (V_PC bytes), or 0 if it has errors.
assemble_second:
jldi j0, 2
jst j0, j14, V_PASS
jcall run_pass
jld j0, j14, V_ERR
jjnz j0, as_fail
jldi j0, 1
jret

; One pass over the source: the first one learns where every label is, the second one writes the words.
run_pass:
jldi j0, 2
jshi j0, 0
jst j0, j14, V_POS
jst j14, j14, V_PC
jst j14, j14, V_NWHILE
jst j14, j14, V_WDEPTH
jst j14, j14, V_ERR
jst j14, j14, V_FDEPTH
jst j14, j14, V_EXPAND
jldi j0, 44h
jshi j0, 0
jst j0, j14, V_TEXT
jcall next_source
jwhile j0
  jcall do_line
  jcall next_source
  jld j1, j14, V_ERR
  jjz j1, rp_next
  jldi j0, 0
rp_next:
jwend
jld j0, j14, V_WDEPTH
jjz j0, rp_out
jst j13, j14, V_ERR             ; a jwhile without its jwend
rp_out:
jret

; One line: statements while they are labels.
do_line:
jldi j0, 1
jwhile j0
  jcall statement
  jld j1, j14, V_ERR
  jjz j1, dl_next
  jldi j0, 0
dl_next:
jwend
jret

; One statement -> j0 = 1 if the line goes on (it was a label).
statement:
jst j14, j14, V_SWITCH
jcall skip_spaces
jcall peek
jcall line_end_char
jjz j1, st_word
jcall end_line
jldi j0, 0
jret
st_word:
jcall read_ident
jjz j0, st_error
jcall skip_spaces
jcall peek
jldi j1, 3Ah                    ; "name:"
jsub j1, j0, j1
jjnz j1, st_not_label
jcall advance
jld j1, j14, V_TOK
jld j2, j14, V_TOKLEN
jld j3, j14, V_PC
jcall define_symbol
jldi j0, 1
jret
st_not_label:
jldi j1, 3Dh                    ; "name = expression"
jsub j1, j0, j1
jjnz j1, st_instruction
jcall advance
jld j0, j14, V_TOK
jst j0, j14, V_DEFTOK
jld j0, j14, V_TOKLEN
jst j0, j14, V_DEFLEN
jcall expr
jadd j3, j0, j14
jld j1, j14, V_DEFTOK
jld j2, j14, V_DEFLEN
jcall define_symbol
jjmp st_finish
st_instruction:
jld j1, j14, V_TOK
jld j2, j14, V_TOKLEN
jcall lookup_table
jjz j0, st_macro
jld j1, j1, 8                   ; value (low dword) and format (high dword)
jldi j3, 32
jshl j2, j1, j3
jshr j2, j2, j3
jst j2, j14, V_OP
jshr j1, j1, j3
jst j1, j14, V_FMT
jcall operands
jjmp st_finish
st_macro:                       ; not in the table: a macro of this source
jld j1, j14, V_TOK
jld j2, j14, V_TOKLEN
jcall find_macro
jjz j1, st_error
jcall expand
st_finish:
jld j0, j14, V_ERR
jjnz j0, st_stop
jld j0, j14, V_SWITCH
jjnz j0, st_stop                ; reading goes on in a nested text
jcall skip_spaces
jcall peek
jcall line_end_char
jjz j1, st_error
jcall end_line
st_stop:
jldi j0, 0
jret
st_error:
jst j13, j14, V_ERR
jldi j0, 0
jret

; The operands of the instruction in V_OP / V_FMT, and its words.
operands:
jld j0, j14, V_FMT
jjz j0, op_none
jldi j1, F_RI
jsub j1, j0, j1
jjz j1, op_ri
jldi j1, F_RRR
jsub j1, j0, j1
jjz j1, op_rrr
jldi j1, F_T
jsub j1, j0, j1
jjz j1, op_t
jldi j1, F_RT
jsub j1, j0, j1
jjz j1, op_rt
jldi j1, F_RRI
jsub j1, j0, j1
jjz j1, op_rri
jldi j1, F_RR
jsub j1, j0, j1
jjz j1, op_rr
jldi j1, F_WHILE
jsub j1, j0, j1
jjz j1, op_while
jldi j1, F_WEND
jsub j1, j0, j1
jjz j1, op_wend
jldi j1, F_FIRST
jsub j1, j0, j1
jjz j1, op_first
jldi j1, F_DD
jsub j1, j0, j1
jjz j1, op_dd
jldi j1, F_INCLUDE
jsub j1, j0, j1
jjz j1, op_include
jldi j1, F_MACRO
jsub j1, j0, j1
jjz j1, op_macro
jldi j1, F_REPEAT
jsub j1, j0, j1
jjz j1, op_repeat
jst j13, j14, V_ERR             ; a name that is not a statement (a register, end, local)
jret
op_none:
jld j1, j14, V_OP
jldi j2, 0
jldi j3, 0
jldi j4, 0
jcall emit
jret
op_ri:
jcall expr
jst j0, j14, V_RD
jcall comma
jcall expr
jadd j4, j0, j14
jld j1, j14, V_OP
jld j2, j14, V_RD
jldi j3, 0
jcall emit
jret
op_rrr:
jcall expr
jst j0, j14, V_RD
jcall comma
jcall expr
jst j0, j14, V_RA
jcall comma
jcall expr
jadd j4, j0, j14
jld j1, j14, V_OP
jld j2, j14, V_RD
jld j3, j14, V_RA
jcall emit
jret
op_t:
jcall expr
jcall offset
jld j1, j14, V_OP
jldi j2, 0
jldi j3, 0
jcall emit
jret
op_rt:
jcall expr
jst j0, j14, V_RD
jcall comma
jcall expr
jcall offset
jld j1, j14, V_OP
jld j2, j14, V_RD
jldi j3, 0
jcall emit
jret
op_rri:
jcall expr
jst j0, j14, V_RD
jcall comma
jcall expr
jst j0, j14, V_RA
jcall comma
jcall expr
jadd j4, j0, j14
jld j1, j14, V_OP
jld j2, j14, V_RD
jld j3, j14, V_RA
jcall emit
jret
op_rr:
jcall expr
jst j0, j14, V_RD
jcall comma
jcall expr
jadd j3, j0, j14
jld j1, j14, V_OP
jld j2, j14, V_RD
jldi j4, 0
jcall emit
jret
op_while:                       ; jjmp to its condition, then the body
jcall expr
jst j0, j14, V_RD
jld j1, j14, V_WDEPTH
jldi j2, 128
jsub j2, j1, j2
jjnz j2, ow_room
jst j13, j14, V_ERR
jret
ow_room:
jld j3, j14, V_NWHILE
jldi j4, 2560
jsub j4, j3, j4
jjnz j4, ow_order
jst j13, j14, V_ERR
jret
ow_order:
jldi j2, 5
jshl j2, j1, j2
jldi j4, WSTACK
jadd j2, j2, j4
jld j4, j14, V_PC
jldi j5, 4
jadd j4, j4, j5
jst j4, j2, 0                   ; its body: after the entry jump
jld j4, j14, V_RD
jst j4, j2, 8
jld j4, j14, V_OP
jst j4, j2, 16
jst j3, j2, 24
jadd j1, j1, j13
jst j1, j14, V_WDEPTH
jadd j4, j3, j13
jst j4, j14, V_NWHILE
jldi j4, 3
jshl j3, j3, j4
jldi j4, CHECKS
jadd j3, j3, j4
jld j0, j3, 0                   ; its condition, known since the first pass
jcall offset
jldi j1, 0Ch
jldi j2, 0
jldi j3, 0
jcall emit
jret
op_wend:                        ; the condition, which jumps back to the body
jld j1, j14, V_WDEPTH
jjnz j1, owe_open
jst j13, j14, V_ERR
jret
owe_open:
jsub j1, j1, j13
jst j1, j14, V_WDEPTH
jldi j2, 5
jshl j2, j1, j2
jldi j3, WSTACK
jadd j2, j2, j3
jld j3, j2, 24
jldi j4, 3
jshl j3, j3, j4
jldi j4, CHECKS
jadd j3, j3, j4
jld j4, j14, V_PC
jst j4, j3, 0                   ; its condition is here
jld j0, j2, 0
jcall offset
jld j1, j2, 16
jld j3, j2, 8
jadd j2, j3, j14
jldi j3, 0
jcall emit
jret
op_first:                       ; jldi (and jshi) of the size, then jsys
jcall expr
jst j0, j14, V_RD
jcall comma
jcall expr
jst j0, j14, V_RA
jldi j1, 0
jshi j1, 8000h
jsub j1, j0, j1
jldi j2, 63
jshr j1, j1, j2
jjz j1, of_big
jldi j1, 1
jld j2, j14, V_RD
jldi j3, 0
jld j4, j14, V_RA
jcall emit
jjmp of_sys
of_big:
jldi j1, 1
jld j2, j14, V_RD
jldi j3, 0
jld j4, j14, V_RA
jldi j5, 16
jshr j4, j4, j5
jcall emit
jldi j1, 0Fh
jld j2, j14, V_RD
jldi j3, 0
jld j4, j14, V_RA
jcall emit
of_sys:
jldi j1, 16h
jld j2, j14, V_RD
jld j3, j14, V_RD
jldi j4, 0
jcall emit
jret
op_dd:
jcall expr
jadd j1, j0, j14
jcall emit_word
jret
op_include:                     ; only janax.inc: the language itself, which this assembler knows
jcall skip_spaces
jcall peek
jldi j1, 27h
jsub j1, j0, j1
jjnz j1, oi_error
jcall advance
jld j1, j14, V_POS
jadd j6, j1, j14
jldi j3, 1
jwhile j3                       ; to the closing quote (or the end of the line)
  jldb j0, j1, 0
  jldi j2, 27h
  jsub j2, j0, j2
  jjz j2, oi_close
  jjz j0, oi_close
  jldi j2, 10
  jsub j2, j0, j2
  jjz j2, oi_close
  jadd j1, j1, j13
  jjmp oi_next
oi_close:
  jldi j3, 0
oi_next:
jwend
jldb j0, j1, 0
jldi j2, 27h
jsub j2, j0, j2
jjnz j2, oi_error
jadd j2, j1, j13
jst j2, j14, V_POS
jsub j3, j1, j6
jst j6, j14, V_START            ; the path
jst j3, j14, V_N
jldi j4, 9
jsub j4, j3, j4
jldi j5, 63
jshr j4, j4, j5
jjnz j4, oi_file
jldi j4, 9
jsub j1, j1, j4
jldb j0, j1, 8
jldi j2, 63h                    ; "c"
jsub j0, j0, j2
jjnz j0, oi_file
jcall load8                     ; "janax.in"
jldi j1, 6E69h
jshi j1, 2E78h
jshi j1, 616Eh
jshi j1, 616Ah
jsub j0, j0, j1
jjnz j0, oi_file
jret                            ; janax.inc: the language itself, known from birth
oi_file:
jld j1, j14, V_START
jld j2, j14, V_N
jcall include_file
jret
oi_error:
jst j13, j14, V_ERR
jret

; include of another file: j1 its path, j2 its bytes. Read relative to the source's folder (".." goes up
; one folder), it becomes the next text to read; the first pass adds it to the fingerprint.
include_file:
jcall join_path
jldi j1, 63
jshr j1, j0, j1
jjnz j1, if_error
jst j0, j14, V_N                ; the label's bytes
jcall rest_of_line              ; where reading goes on after it
jld j0, j14, V_ERR
jjnz j0, if_out
jldi j1, INCLBL
jld j2, j14, V_N
jld j3, j14, V_TEXT
jcall text_room
jcall read_file
jldi j1, 63
jshr j1, j0, j1
jjnz j1, if_error
jld j1, j14, V_TEXT
jadd j2, j1, j0
jstb j14, j2, 0                 ; a 0 after it
jld j2, j14, V_PASS
jsub j2, j2, j13
jjnz j2, if_read
jadd j2, j0, j14                ; first pass: into the fingerprint
jld j3, j14, V_HASH
jcall fnv
jst j0, j14, V_HASH
if_read:
jld j1, j14, V_TEXT
jcall enter_text
jret
if_error:
jst j13, j14, V_ERR
if_out:
jret

; The label of an included file: the folder of the source plus the path j1 (j2 bytes), with ".." going up
; and "." staying. -> INCLBL and j0 = its bytes, or -1 if it leaves the system's folders.
join_path:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jsub j15, j15, j12
jst j10, j15, 0
jadd j8, j1, j14                ; what is left of the path
jadd j9, j2, j14
jld j1, j14, V_NAME             ; the folder: the source's label up to its last "/"
jld j2, j14, V_NAMELEN
jldi j3, 0
jldi j10, 0
jwhile j2
  jldb j4, j1, 0
  jadd j3, j3, j13
  jldi j5, 2Fh
  jsub j4, j4, j5
  jjnz j4, jp_char
  jadd j10, j3, j14
jp_char:
  jadd j1, j1, j13
  jsub j2, j2, j13
jwend
jld j1, j14, V_NAME
jadd j2, j10, j14
jldi j3, INCLBL
jcall copy_bytes                ; j10 = the label's bytes so far, ending in "/"
jwhile j9                       ; one piece of the path at a time
  jadd j1, j8, j14              ; its bytes: up to the next "/"
  jldi j2, 0
  jldi j3, 1
  jwhile j3
    jsub j4, j9, j2
    jjz j4, jp_piece_end
    jldb j4, j1, 0
    jldi j5, 2Fh
    jsub j4, j4, j5
    jjz j4, jp_piece_end
    jadd j1, j1, j13
    jadd j2, j2, j13
    jjmp jp_piece_next
jp_piece_end:
    jldi j3, 0
jp_piece_next:
  jwend
  jldi j3, 2                    ; ".." goes up one folder
  jsub j3, j2, j3
  jjnz j3, jp_not_up
  jldi j4, 2Eh
  jldb j3, j8, 0
  jsub j3, j3, j4
  jjnz j3, jp_not_up
  jldb j3, j8, 1
  jsub j3, j3, j4
  jjnz j3, jp_not_up
  jsub j10, j10, j13            ; drop the last "/" and the folder before it
  jldi j3, 1
  jwhile j3
    jjz j10, jp_left
    jldi j4, INCLBL
    jadd j4, j4, j10
    jsub j4, j4, j13
    jldb j4, j4, 0
    jldi j5, 2Fh
    jsub j4, j4, j5
    jjz j4, jp_up_done
    jsub j10, j10, j13
    jjmp jp_up_next
jp_up_done:
    jldi j3, 0
jp_up_next:
  jwend
  jjmp jp_skip
jp_not_up:
  jldi j3, 1                    ; "." stays
  jsub j3, j2, j3
  jjnz j3, jp_name
  jldb j3, j8, 0
  jldi j4, 2Eh
  jsub j3, j3, j4
  jjz j3, jp_skip
jp_name:
  jsub j15, j15, j12
  jst j2, j15, 0
  jadd j1, j8, j14
  jldi j3, INCLBL
  jadd j3, j3, j10
  jcall copy_bytes
  jld j2, j15, 0
  jadd j15, j15, j12
  jadd j10, j10, j2
  jsub j3, j9, j2               ; a "/" after it if the path goes on
  jjz j3, jp_skip
  jldi j3, INCLBL
  jadd j3, j3, j10
  jldi j4, 2Fh
  jstb j4, j3, 0
  jadd j10, j10, j13
jp_skip:
  jadd j8, j8, j2               ; past the piece and its "/"
  jsub j9, j9, j2
  jjz j9, jp_next
  jadd j8, j8, j13
  jsub j9, j9, j13
jp_next:
jwend
jldi j1, 400
jsub j1, j10, j1
jldi j2, 63
jshr j1, j1, j2
jjz j1, jp_left                 ; too long for the buffer
jadd j0, j10, j14
jjmp jp_out
jp_left:
jldi j0, -1
jp_out:
jld j10, j15, 0
jadd j15, j15, j12
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; The rest of the line must be empty (or a comment): V_BACK = the start of the next line, where reading goes
; on after a nested text.
rest_of_line:
jcall skip_spaces
jcall peek
jcall line_end_char
jjnz j1, rl_ok
jst j13, j14, V_ERR
jret
rl_ok:
jcall end_line
jld j0, j14, V_POS
jst j0, j14, V_BACK
jret

; j4 = the room left for nested texts (with a 0 after the last one). Keeps j1-j3.
text_room:
jldi j4, 64h
jshi j4, 0
jld j5, j14, V_TEXT
jsub j4, j4, j5
jsub j4, j4, j12
jret

; Reading goes on in the text at j1 (it ends in 0, its 0 was written), and back at V_BACK when it ends.
; V_TEXT moves past it.
enter_text:
jld j2, j14, V_FDEPTH
jldi j3, 32
jsub j3, j2, j3
jjnz j3, et_room
jst j13, j14, V_ERR             ; nested too deep
jret
et_room:
jldi j3, 3
jshl j3, j2, j3
jldi j4, FRAMES
jadd j3, j3, j4
jld j4, j14, V_BACK
jst j4, j3, 0
jadd j2, j2, j13
jst j2, j14, V_FDEPTH
jst j1, j14, V_POS
jst j13, j14, V_SWITCH
jadd j2, j1, j14                ; past its 0, aligned to 8
jldi j3, 1
jwhile j3
  jldb j3, j2, 0
  jadd j2, j2, j13
jwend
jldi j3, 7
jadd j2, j2, j3
jldi j3, -8
jand j2, j2, j3
jst j2, j14, V_TEXT
jret

; j0 = the byte to read next, going back from the nested texts that ended.
next_source:
jldi j3, 1
jwhile j3
  jld j0, j14, V_POS
  jldb j0, j0, 0
  jldi j3, 0
  jjnz j0, ns_next              ; something to read
  jld j1, j14, V_FDEPTH
  jjz j1, ns_next               ; the end of the source
  jsub j1, j1, j13
  jst j1, j14, V_FDEPTH
  jldi j2, 3
  jshl j2, j1, j2
  jldi j4, FRAMES
  jadd j2, j2, j4
  jld j2, j2, 0
  jst j2, j14, V_POS
  jldi j3, 1                    ; and look again
ns_next:
jwend
jret

; j1 -> j0 = the 8 bytes there, as a little-endian qword (any alignment). Uses j2-j4.
load8:
jldi j0, 0
jldi j2, 0
jldi j3, 8
jwhile j3
  jldb j4, j1, 0
  jshl j4, j4, j2
  jor j0, j0, j4
  jadd j2, j2, j12
  jadd j1, j1, j13
  jsub j3, j3, j13
jwend
jret

; j0 target -> j4 = its jump distance in words from the next one. Uses j1.
offset:
jld j1, j14, V_PC
jsub j4, j0, j1
jldi j1, 4
jsub j4, j4, j1
jdiv j4, j4, j1
jret

; One word: j1 op, j2 rd, j3 ra, j4 immediate (its low 16 bits).
emit:
jldi j5, 8
jshl j2, j2, j5
jor j1, j1, j2
jldi j5, 12
jshl j3, j3, j5
jor j1, j1, j3
jldi j5, 0
jshi j5, 0FFFFh
jand j4, j4, j5
jldi j5, 16
jshl j4, j4, j5
jor j1, j1, j4
jcall emit_word
jret

; j1: its low 32 bits are the next word (written in the second pass). Uses j2-j4.
emit_word:
jld j2, j14, V_PC
jld j3, j14, V_PASS
jldi j4, 2
jsub j3, j3, j4
jjnz j3, ew_count
jldi j3, 12h
jshi j3, 0
jadd j3, j3, j2
jstb j1, j3, 0
jshr j1, j1, j12
jstb j1, j3, 1
jshr j1, j1, j12
jstb j1, j3, 2
jshr j1, j1, j12
jstb j1, j3, 3
ew_count:
jldi j3, 4
jadd j2, j2, j3
jst j2, j14, V_PC
jldi j3, 10h
jshi j3, 0
jsub j3, j3, j2
jldi j4, 63
jshr j3, j3, j4
jjz j3, ew_out
jst j13, j14, V_ERR             ; more than the room for the output
ew_out:
jret

; A comma, or an error.
comma:
jcall skip_spaces
jcall peek
jldi j1, 2Ch
jsub j1, j0, j1
jjz j1, cm_ok
jst j13, j14, V_ERR
jret
cm_ok:
jcall advance
jret

; Expressions: j0 = the value at the reading position. Terms with + and -.
expr:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jcall term
jadd j8, j0, j14
jldi j9, 1
jwhile j9
  jcall skip_spaces
  jcall peek
  jldi j1, 2Bh
  jsub j1, j0, j1
  jjnz j1, ex_minus
  jcall advance
  jcall term
  jadd j8, j8, j0
  jjmp ex_next
ex_minus:
  jldi j1, 2Dh
  jsub j1, j0, j1
  jjnz j1, ex_end
  jcall advance
  jcall term
  jsub j8, j8, j0
  jjmp ex_next
ex_end:
  jldi j9, 0
ex_next:
jwend
jadd j0, j8, j14
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; Factors with * and /.
term:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jcall unary
jadd j8, j0, j14
jldi j9, 1
jwhile j9
  jcall skip_spaces
  jcall peek
  jldi j1, 2Ah
  jsub j1, j0, j1
  jjnz j1, te_div
  jcall advance
  jcall unary
  jmul j8, j8, j0
  jjmp te_next
te_div:
  jldi j1, 2Fh
  jsub j1, j0, j1
  jjnz j1, te_end
  jcall advance
  jcall unary
  jdiv j8, j8, j0
  jjmp te_next
te_end:
  jldi j9, 0
te_next:
jwend
jadd j0, j8, j14
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; A signed factor: - + ( ) $ a number or a name.
unary:
jcall skip_spaces
jcall peek
jldi j1, 2Dh
jsub j1, j0, j1
jjnz j1, un_plus
jcall advance
jcall unary
jsub j0, j14, j0
jret
un_plus:
jldi j1, 2Bh
jsub j1, j0, j1
jjnz j1, un_paren
jcall advance
jcall unary
jret
un_paren:
jldi j1, 28h
jsub j1, j0, j1
jjnz j1, un_dollar
jcall advance
jcall expr
jsub j15, j15, j12
jst j0, j15, 0
jcall skip_spaces
jcall peek
jldi j1, 29h
jsub j1, j0, j1
jjz j1, un_close
jst j13, j14, V_ERR
un_close:
jcall advance
jld j0, j15, 0
jadd j15, j15, j12
jret
un_dollar:
jldi j1, 24h
jsub j1, j0, j1
jjnz j1, un_number
jcall advance
jld j0, j14, V_PC
jret
un_number:
jldi j2, 30h
jldi j3, 39h
jcall in_range
jjz j1, un_name
jcall number
jret
un_name:
jcall is_ident
jjz j1, un_error
jcall read_ident
jld j1, j14, V_TOK
jld j2, j14, V_TOKLEN
jcall symbol_value
jret
un_error:
jst j13, j14, V_ERR
jldi j0, 0
jret

; j0 = the number at the position: decimal, or hexadecimal ending in h.
number:
jcall read_ident
jld j6, j14, V_TOK
jld j7, j14, V_TOKLEN
jadd j1, j6, j7
jsub j1, j1, j13
jldb j1, j1, 0                  ; its last character
jldi j5, 10
jldi j2, 68h
jsub j2, j1, j2
jjz j2, nu_hex
jldi j2, 48h
jsub j2, j1, j2
jjnz j2, nu_digits
nu_hex:
jldi j5, 16
jsub j7, j7, j13
nu_digits:
jldi j0, 0
jwhile j7
  jldb j1, j6, 0
  jcall digit_value
  jsub j2, j3, j5
  jldi j4, 63
  jshr j2, j2, j4
  jjnz j2, nu_ok
  jst j13, j14, V_ERR           ; not a digit of its base
  jldi j3, 0
nu_ok:
  jmul j0, j0, j5
  jadd j0, j0, j3
  jadd j6, j6, j13
  jsub j7, j7, j13
jwend
jret

; j1 a character -> j3 its value as a digit (0-15), or 99. Uses j2, j4.
digit_value:
jldi j4, 63
jldi j2, 30h
jsub j3, j1, j2
jshr j2, j3, j4
jjnz j2, dv_upper
jldi j2, 10
jsub j2, j3, j2
jshr j2, j2, j4
jjnz j2, dv_out
dv_upper:
jldi j2, 41h
jsub j3, j1, j2
jshr j2, j3, j4
jjnz j2, dv_lower
jldi j2, 6
jsub j2, j3, j2
jshr j2, j2, j4
jjz j2, dv_lower
jldi j2, 10
jadd j3, j3, j2
jret
dv_lower:
jldi j2, 61h
jsub j3, j1, j2
jshr j2, j3, j4
jjnz j2, dv_none
jldi j2, 6
jsub j2, j3, j2
jshr j2, j2, j4
jjz j2, dv_none
jldi j2, 10
jadd j3, j3, j2
jret
dv_none:
jldi j3, 99
dv_out:
jret

; j1 name, j2 its bytes -> j0 = its value: a name of the table (a register) or a symbol of this source.
symbol_value:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jadd j8, j1, j14
jadd j9, j2, j14
jcall lookup_table
jjz j0, sv_symbol
jld j1, j1, 8
jldi j2, 32
jshr j3, j1, j2
jldi j4, F_CONST
jsub j3, j3, j4
jjnz j3, sv_error               ; an instruction is not a value
jshl j0, j1, j2
jshr j0, j0, j2
jjmp sv_out
sv_symbol:
jadd j1, j8, j14
jadd j2, j9, j14
jcall find_symbol
jjz j1, sv_unknown
jld j0, j0, 16
jjmp sv_out
sv_unknown:
jldi j0, 0
jld j1, j14, V_PASS
jsub j1, j1, j13
jjz j1, sv_out                  ; the first pass does not know what comes later
sv_error:
jst j13, j14, V_ERR
jldi j0, 0
sv_out:
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; j1 name, j2 its bytes -> j0 = 1 and j1 = its entry if the table has it, j0 = 0 if not.
lookup_table:
jldi j0, 0
jldi j3, 9
jsub j3, j2, j3
jldi j4, 63
jshr j3, j3, j4
jjz j3, lt_out                  ; table names are up to 8 bytes
jjz j2, lt_out
jldi j5, 0                      ; the name as a qword padded with zeros
jldi j6, 0
jwhile j2
  jldb j3, j1, 0
  jshl j3, j3, j6
  jor j5, j5, j3
  jadd j6, j6, j12
  jadd j1, j1, j13
  jsub j2, j2, j13
jwend
jldi j1, 0
jld j3, j1, 0
jwhile j3
  jsub j4, j3, j5
  jjnz j4, lt_next
  jldi j0, 1
  jldi j3, 0
  jjmp lt_cont
lt_next:
  jldi j4, 16
  jadd j1, j1, j4
  jld j3, j1, 0
lt_cont:
jwend
lt_out:
jret

; j1 name, j2 its bytes, j3 value: the symbol is defined (or changed).
define_symbol:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jsub j15, j15, j12
jst j10, j15, 0
jadd j8, j3, j14
jadd j9, j1, j14
jadd j10, j2, j14
jcall find_symbol
jst j8, j0, 16
jjnz j1, def_out
jst j9, j0, 0
jst j10, j0, 8
jld j1, j14, V_GEN
jst j1, j0, 24
def_out:
jld j10, j15, 0
jadd j15, j15, j12
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; j1 name, j2 its bytes -> j0 = its entry in the symbols, j1 = 1 if it was there (0: a free entry).
find_symbol:
jldi j3, 22h
jshi j3, 0
jst j3, j14, V_TABLE
jldi j3, 0
jshi j3, 0FFFFh
jst j3, j14, V_MASK
jjmp find_entry

; The same in the macros.
find_macro:
jldi j3, 42h
jshi j3, 0
jst j3, j14, V_TABLE
jldi j3, 0FFFh
jst j3, j14, V_MASK
jjmp find_entry

; j1 name, j2 its bytes, in the table V_TABLE of V_MASK + 1 entries of 32 bytes (name address, name bytes,
; value, generation) -> j0 = its entry, j1 = 1 if it was there (0: a free entry).
find_entry:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jsub j15, j15, j12
jst j10, j15, 0
jsub j15, j15, j12
jst j11, j15, 0
jadd j8, j1, j14
jadd j9, j2, j14
jcall fnv_basis
jcall fnv
jld j1, j14, V_MASK
jand j10, j0, j1                ; where to look first
jldi j11, 1
jwhile j11
  jldi j0, 5
  jshl j0, j10, j0
  jld j1, j14, V_TABLE
  jadd j0, j0, j1
  jld j1, j0, 24
  jld j2, j14, V_GEN
  jsub j1, j1, j2
  jjnz j1, fs_free               ; of another source: free
  jld j1, j0, 8
  jsub j1, j1, j9
  jjnz j1, fs_next
  jsub j15, j15, j12
  jst j0, j15, 0
  jld j1, j0, 0
  jadd j2, j8, j14
  jadd j3, j9, j14
  jcall same_bytes
  jadd j1, j0, j14
  jld j0, j15, 0
  jadd j15, j15, j12
  jjz j1, fs_next
  jldi j1, 1
  jldi j11, 0
  jjmp fs_cont
fs_free:
  jldi j1, 0
  jldi j11, 0
  jjmp fs_cont
fs_next:
  jadd j10, j10, j13
  jld j1, j14, V_MASK
  jand j10, j10, j1
fs_cont:
jwend
jld j11, j15, 0
jadd j15, j15, j12
jld j10, j15, 0
jadd j15, j15, j12
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; j1, j2: j3 bytes to compare -> j0 = 1 if they are the same. Uses j4, j5.
same_bytes:
jldi j0, 1
jwhile j3
  jldb j4, j1, 0
  jldb j5, j2, 0
  jsub j4, j4, j5
  jjz j4, sb_same
  jldi j0, 0
  jldi j3, 1
sb_same:
  jadd j1, j1, j13
  jadd j2, j2, j13
  jsub j3, j3, j13
jwend
jret

; --- reading the source ---

; j0 = the byte at the reading position (0 = the end).
peek:
jld j0, j14, V_POS
jldb j0, j0, 0
jret

; The reading position moves one byte.
advance:
jld j0, j14, V_POS
jadd j0, j0, j13
jst j0, j14, V_POS
jret

; Past spaces and tabs. Uses j0-j3.
skip_spaces:
jld j1, j14, V_POS
jldi j3, 1
jwhile j3
  jldb j0, j1, 0
  jldi j2, 20h
  jsub j2, j0, j2
  jjz j2, ss_skip
  jldi j2, 9
  jsub j2, j0, j2
  jjz j2, ss_skip
  jldi j3, 0
  jjmp ss_next
ss_skip:
  jadd j1, j1, j13
ss_next:
jwend
jst j1, j14, V_POS
jret

; To the start of the next line. Uses j0-j2.
end_line:
jld j1, j14, V_POS
jldb j0, j1, 0
jwhile j0
  jldi j2, 10
  jsub j2, j0, j2
  jjz j2, el_newline
  jadd j1, j1, j13
  jldb j0, j1, 0
  jjmp el_next
el_newline:
  jadd j1, j1, j13
  jldi j0, 0
el_next:
jwend
jst j1, j14, V_POS
jret

; j0 a byte -> j1 = 1 if it ends a statement (; CR LF or the end). Uses j2.
line_end_char:
jldi j1, 1
jjz j0, lec_out
jldi j2, 3Bh
jsub j2, j0, j2
jjz j2, lec_out
jldi j2, 13
jsub j2, j0, j2
jjz j2, lec_out
jldi j2, 10
jsub j2, j0, j2
jjz j2, lec_out
jldi j1, 0
lec_out:
jret

; The name or number at the position -> V_TOK, V_TOKLEN, and j0 = its bytes. Uses j0-j7.
read_ident:
jld j6, j14, V_POS
jst j6, j14, V_TOK
jldi j7, 1
jwhile j7
  jldb j0, j6, 0
  jcall is_ident
  jadd j7, j1, j14
  jjz j1, ri_end
  jadd j6, j6, j13
ri_end:
jwend
jst j6, j14, V_POS
jld j0, j14, V_TOK
jsub j0, j6, j0
jst j0, j14, V_TOKLEN
jret

; j0 a byte -> j1 = 1 if it can be part of a name or a number: letters, digits, _ and . Uses j1-j5.
is_ident:
jldi j2, 30h
jldi j3, 39h
jcall in_range
jjnz j1, ii_out
jldi j2, 41h
jldi j3, 5Ah
jcall in_range
jjnz j1, ii_out
jldi j2, 61h
jldi j3, 7Ah
jcall in_range
jjnz j1, ii_out
jldi j1, 1
jldi j2, 5Fh
jsub j2, j0, j2
jjz j2, ii_out
jldi j2, 2Eh
jsub j2, j0, j2
jjz j2, ii_out
jldi j1, 0
ii_out:
jret

; j0 in [j2, j3]? -> j1 = 1 or 0. Uses j4, j5.
in_range:
jldi j4, 63
jsub j1, j0, j2
jshr j5, j1, j4
jjnz j5, ir_no
jsub j1, j3, j0
jshr j5, j1, j4
jjnz j5, ir_no
jldi j1, 1
jret
ir_no:
jldi j1, 0
jret

; --- structures: macros and repeat ---

; macro name params { body }: the macro is kept (its body is read when it is used) and reading goes on
; after its closing brace.
op_macro:
jcall skip_spaces
jcall read_ident
jjz j0, om_error
jld j1, j14, V_TOK
jld j2, j14, V_TOKLEN
jcall find_macro
jld j2, j14, V_TOK
jst j2, j0, 0
jld j2, j14, V_TOKLEN
jst j2, j0, 8
jld j2, j14, V_POS
jst j2, j0, 16                  ; its parameters start here
jld j2, j14, V_GEN
jst j2, j0, 24
jldi j1, 7Bh                    ; past its body: to the open brace, then past the closing one
jcall skip_to
jldi j1, 7Dh
jcall skip_to
jret
om_error:
jst j13, j14, V_ERR
jret

; The reading position moves past the next byte j1 (an error if the text ends first). Uses j0-j3.
skip_to:
jld j2, j14, V_POS
jldi j3, 1
jwhile j3
  jldb j0, j2, 0
  jjz j0, sk_end
  jadd j2, j2, j13
  jsub j0, j0, j1
  jjnz j0, sk_next
  jldi j3, 0
  jjmp sk_next
sk_end:
  jst j13, j14, V_ERR
  jldi j3, 0
sk_next:
jwend
jst j2, j14, V_POS
jret

; A macro used (j0 its entry): its arguments go in place of its parameters, its local names get this
; expansion's number, and the body becomes the next text to read.
expand:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jsub j15, j15, j12
jst j10, j15, 0
jsub j15, j15, j12
jst j11, j15, 0
jadd j8, j0, j14
jst j14, j14, V_ARGC            ; 1. the arguments, up to the end of the line
jldi j9, 1
jwhile j9
  jcall skip_spaces
  jcall peek
  jcall line_end_char
  jjnz j1, ea_done
  jldi j1, 3Ch                  ; grouped between angle brackets, commas and all
  jsub j1, j0, j1
  jjnz j1, ea_plain
  jcall advance
  jld j10, j14, V_POS
  jldi j1, 3Eh
  jcall skip_to
  jld j11, j14, V_POS
  jsub j11, j11, j10
  jsub j11, j11, j13
  jjmp ea_store
ea_plain:                       ; up to the next comma or the end of the line, without spaces at its end
  jld j10, j14, V_POS
  jldi j11, 1
  jwhile j11
    jcall peek
    jldi j1, 2Ch
    jsub j1, j0, j1
    jjz j1, ea_plain_end
    jcall line_end_char
    jjnz j1, ea_plain_end
    jcall advance
    jjmp ea_plain_next
ea_plain_end:
    jldi j11, 0
ea_plain_next:
  jwend
  jld j11, j14, V_POS
  jsub j11, j11, j10
  jldi j1, 1
  jwhile j1
    jldi j1, 0
    jjz j11, ea_trimmed
    jadd j2, j10, j11
    jsub j2, j2, j13
    jldb j2, j2, 0
    jldi j3, 20h
    jsub j3, j2, j3
    jjz j3, ea_trim
    jldi j3, 9
    jsub j3, j2, j3
    jjnz j3, ea_trimmed
ea_trim:
    jsub j11, j11, j13
    jldi j1, 1
ea_trimmed:
  jwend
ea_store:
  jld j1, j14, V_ARGC
  jldi j2, 16
  jsub j2, j1, j2
  jjnz j2, ea_room
  jst j13, j14, V_ERR
  jldi j9, 0
  jjmp ea_next
ea_room:
  jldi j2, 4
  jshl j2, j1, j2
  jldi j3, ARGS
  jadd j2, j2, j3
  jst j10, j2, 0
  jst j11, j2, 8
  jadd j1, j1, j13
  jst j1, j14, V_ARGC
  jcall skip_spaces             ; a comma: another argument
  jcall peek
  jldi j1, 2Ch
  jsub j1, j0, j1
  jjnz j1, ea_done
  jcall advance
  jjmp ea_next
ea_done:
  jldi j9, 0
ea_next:
jwend
jcall rest_of_line              ; where reading goes on after it
jld j0, j14, V_ERR
jjnz j0, ex_out
jld j0, j8, 16                  ; 2. the parameters: names up to the open brace
jst j0, j14, V_POS
jst j14, j14, V_PARC
jldi j9, 1
jwhile j9
  jcall skip_spaces
  jcall peek
  jldi j1, 7Bh
  jsub j1, j0, j1
  jjz j1, ep_body
  jcall read_ident
  jjz j0, ep_error
  jld j1, j14, V_PARC
  jldi j2, 16
  jsub j2, j1, j2
  jjz j2, ep_error
  jldi j2, 4
  jshl j2, j1, j2
  jldi j3, PARAMS
  jadd j2, j2, j3
  jld j3, j14, V_TOK
  jst j3, j2, 0
  jld j3, j14, V_TOKLEN
  jst j3, j2, 8
  jadd j1, j1, j13
  jst j1, j14, V_PARC
  jcall skip_spaces
  jcall peek
  jldi j1, 2Ch
  jsub j1, j0, j1
  jjnz j1, ep_next
  jcall advance
  jjmp ep_next
ep_body:
  jcall advance
  jldi j9, 0
  jjmp ep_next
ep_error:
  jst j13, j14, V_ERR
  jldi j9, 0
ep_next:
jwend
jld j0, j14, V_ERR
jjnz j0, ex_out
jld j0, j14, V_POS              ; the body: up to the closing brace
jst j0, j14, V_BODY
jldi j1, 7Dh
jcall skip_to
jld j0, j14, V_POS
jsub j0, j0, j13
jst j0, j14, V_BODYEND
jst j14, j14, V_LOCC            ; 3. its local names: the lines that start with "local"
jld j0, j14, V_BODY
jst j0, j14, V_POS
jcall in_body
jwhile j0
  jcall local_line
  jjz j0, el_other
  jldi j9, 1
  jwhile j9                     ; the names, separated by commas
    jcall skip_spaces
    jcall read_ident
    jjz j0, el_names_end
    jld j1, j14, V_LOCC
    jldi j2, 16
    jsub j2, j1, j2
    jjz j2, el_names_end
    jldi j2, 4
    jshl j2, j1, j2
    jldi j3, LOCALS
    jadd j2, j2, j3
    jld j3, j14, V_TOK
    jst j3, j2, 0
    jld j3, j14, V_TOKLEN
    jst j3, j2, 8
    jadd j1, j1, j13
    jst j1, j14, V_LOCC
    jcall skip_spaces
    jcall peek
    jldi j1, 2Ch
    jsub j1, j0, j1
    jjnz j1, el_names_end
    jcall advance
    jjmp el_names_next
el_names_end:
    jldi j9, 0
el_names_next:
  jwend
el_other:
  jcall end_line
  jcall in_body
jwend
jld j10, j14, V_TEXT            ; 4. the expansion, at the next free place for texts
jld j0, j14, V_BODY
jst j0, j14, V_POS
jldi j11, 1                     ; at the start of a line
jcall in_body
jwhile j0
  jjz j11, ew_text
  jldi j11, 0
  jcall local_line
  jjz j0, ew_text
  jcall end_line                ; a "local" line is not part of the expansion
  jldi j1, 10
  jstb j1, j10, 0
  jadd j10, j10, j13
  jldi j11, 1
  jjmp ew_next
ew_text:
  jcall peek
  jcall is_ident
  jjz j1, ew_byte
  jcall read_ident              ; a name: a parameter, a local name or itself
  jld j1, j14, V_TOK
  jld j2, j14, V_TOKLEN
  jldi j3, PARAMS
  jld j4, j14, V_PARC
  jcall match_name
  jldi j1, 63
  jshr j1, j0, j1
  jjnz j1, ew_local
  jldi j1, 4
  jshl j0, j0, j1
  jldi j1, ARGS
  jadd j0, j0, j1
  jld j1, j0, 0
  jld j2, j0, 8
  jadd j3, j10, j14
  jcall copy_text
  jadd j10, j3, j14
  jjmp ew_next
ew_local:
  jld j1, j14, V_TOK
  jld j2, j14, V_TOKLEN
  jadd j3, j10, j14
  jcall copy_text
  jadd j10, j3, j14
  jld j1, j14, V_TOK
  jld j2, j14, V_TOKLEN
  jldi j3, LOCALS
  jld j4, j14, V_LOCC
  jcall match_name
  jldi j1, 63
  jshr j1, j0, j1
  jjnz j1, ew_next
  jldi j1, 2Eh                  ; name.number of this expansion
  jstb j1, j10, 0
  jadd j10, j10, j13
  jld j1, j14, V_EXPAND
  jadd j3, j10, j14
  jcall write_hex
  jadd j10, j3, j14
  jjmp ew_next
ew_byte:
  jcall peek
  jstb j0, j10, 0
  jadd j10, j10, j13
  jldi j1, 10
  jsub j1, j0, j1
  jjnz j1, ew_advance
  jldi j11, 1
ew_advance:
  jcall advance
ew_next:
  jcall text_room_at
  jcall in_body
jwend
jstb j14, j10, 0                ; its 0
jld j0, j14, V_EXPAND
jadd j0, j0, j13
jst j0, j14, V_EXPAND
jld j1, j14, V_TEXT
jcall enter_text
ex_out:
jld j11, j15, 0
jadd j15, j15, j12
jld j10, j15, 0
jadd j15, j15, j12
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; j0 = 1 while the reading position is inside the macro body (before V_BODYEND) and there is no error.
in_body:
jld j0, j14, V_POS
jld j1, j14, V_BODYEND
jsub j0, j0, j1
jldi j1, 63
jshr j0, j0, j1
jld j1, j14, V_ERR
jjz j1, ib_out
jldi j0, 0
ib_out:
jret

; j0 = 1 if the line at the reading position starts with the table's "local" word, and then the position
; is past it; j0 = 0 and the position stays if not.
local_line:
jld j0, j14, V_POS
jsub j15, j15, j12
jst j0, j15, 0
jcall skip_spaces
jcall read_ident
jjz j0, ll_no
jld j1, j14, V_TOK
jld j2, j14, V_TOKLEN
jcall lookup_table
jjz j0, ll_no
jld j1, j1, 8
jldi j2, 32
jshr j1, j1, j2
jldi j2, F_LOCAL
jsub j1, j1, j2
jjnz j1, ll_no
jadd j15, j15, j12
jldi j0, 1
jret
ll_no:
jld j0, j15, 0
jadd j15, j15, j12
jst j0, j14, V_POS
jldi j0, 0
jret

; j1 name, j2 its bytes, j3 a list of (address, bytes), j4 its length -> j0 = the index of the name in it,
; or -1. Uses j0-j7.
match_name:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jadd j6, j1, j14
jadd j7, j2, j14
jadd j8, j3, j14
jldi j9, 0
jldi j0, -1
jwhile j4
  jld j1, j8, 8
  jsub j1, j1, j7
  jjnz j1, mn_next
  jsub j15, j15, j12
  jst j4, j15, 0
  jsub j15, j15, j12
  jst j0, j15, 0
  jld j1, j8, 0
  jadd j2, j6, j14
  jadd j3, j7, j14
  jcall same_bytes
  jadd j1, j0, j14
  jld j0, j15, 0
  jadd j15, j15, j12
  jld j4, j15, 0
  jadd j15, j15, j12
  jjz j1, mn_next
  jadd j0, j9, j14
  jldi j4, 1                    ; the last lap
mn_next:
  jldi j1, 16
  jadd j8, j8, j1
  jadd j9, j9, j13
  jsub j4, j4, j13
jwend
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; Copies j2 bytes from j1 to j3 inside the room for texts -> j3 = after them. Uses j4, j5.
copy_text:
jsub j15, j15, j12
jst j3, j15, 0
jadd j4, j3, j2
jldi j5, 64h
jshi j5, 0
jsub j5, j5, j12
jsub j4, j4, j5
jldi j5, 63
jshr j4, j4, j5
jld j3, j15, 0
jadd j15, j15, j12
jjnz j4, ct_copy
jst j13, j14, V_ERR             ; no room left for nested texts
jret
ct_copy:
jcall copy_bytes
jret

; j10 still inside the room for texts? (an error if not). Uses j0-j1.
text_room_at:
jldi j0, 64h
jshi j0, 0
jsub j0, j0, j12
jsub j0, j10, j0
jldi j1, 63
jshr j0, j0, j1
jjnz j0, tr_ok
jst j13, j14, V_ERR
tr_ok:
jret

; j1 written at j3 as 16 hexadecimal digits -> j3 = after them. Uses j0-j2, j4, j5.
write_hex:
jldi j4, 16
jwhile j4
  jldi j2, 60
  jshr j5, j1, j2
  jldi j2, 0Fh
  jand j5, j5, j2
  jldi j2, 30h
  jadd j5, j5, j2
  jldi j2, 3Ah
  jsub j2, j5, j2
  jldi j0, 63
  jshr j2, j2, j0
  jjnz j2, wh_digit
  jldi j2, 7
  jadd j5, j5, j2
wh_digit:
  jstb j5, j3, 0
  jadd j3, j3, j13
  jldi j2, 4
  jshl j1, j1, j2
  jsub j4, j4, j13
jwend
jret

; repeat count ... end repeat: the body becomes the next text to read, copied count times.
op_repeat:
jsub j15, j15, j12
jst j8, j15, 0
jsub j15, j15, j12
jst j9, j15, 0
jcall expr
jst j0, j14, V_N
jcall rest_of_line
jld j0, j14, V_ERR
jjnz j0, or_out
jld j0, j14, V_POS
jst j0, j14, V_START            ; the body starts at the next line
jst j14, j14, V_NEST
jldi j9, 1
jwhile j9                       ; to its "end repeat" (other repeats inside it nest)
  jcall peek
  jjz j0, or_no_end
  jld j0, j14, V_POS
  jst j0, j14, V_LINE
  jcall skip_spaces
  jcall line_word
  jldi j1, F_REPEAT
  jsub j1, j0, j1
  jjnz j1, or_end
  jld j1, j14, V_NEST
  jadd j1, j1, j13
  jst j1, j14, V_NEST
  jjmp or_line
or_end:
  jldi j1, F_END
  jsub j1, j0, j1
  jjnz j1, or_line
  jcall skip_spaces
  jcall line_word
  jldi j1, F_REPEAT
  jsub j1, j0, j1
  jjnz j1, or_line
  jld j1, j14, V_NEST
  jjz j1, or_found
  jsub j1, j1, j13
  jst j1, j14, V_NEST
  jjmp or_line
or_found:
  jld j0, j14, V_LINE
  jst j0, j14, V_STOP
  jldi j9, 0
or_line:
  jcall end_line
  jjmp or_next
or_no_end:
  jst j13, j14, V_ERR
  jldi j9, 0
or_next:
jwend
jld j0, j14, V_ERR
jjnz j0, or_out
jld j0, j14, V_POS
jst j0, j14, V_BACK             ; reading goes on after the "end repeat" line
jst j13, j14, V_SWITCH
jld j9, j14, V_N
jldi j1, 63
jshr j1, j9, j1
jjz j1, or_count
jldi j9, 0                      ; a negative count repeats nothing
or_count:
jld j8, j14, V_TEXT
jwhile j9                       ; the copies
  jld j1, j14, V_START
  jld j2, j14, V_STOP
  jsub j2, j2, j1
  jadd j3, j8, j14
  jcall copy_text
  jadd j8, j3, j14
  jld j0, j14, V_ERR
  jjz j0, or_copied
  jldi j9, 1                    ; no room: the last lap
or_copied:
  jsub j9, j9, j13
jwend
jstb j14, j8, 0
jld j0, j14, V_ERR
jjnz j0, or_out
jld j1, j14, V_TEXT
jcall enter_text
or_out:
jld j9, j15, 0
jadd j15, j15, j12
jld j8, j15, 0
jadd j15, j15, j12
jret

; j0 = the table format of the word at the reading position (-1 if it is not a word of the table).
line_word:
jcall read_ident
jjz j0, lw_none
jld j1, j14, V_TOK
jld j2, j14, V_TOKLEN
jcall lookup_table
jjz j0, lw_none
jld j0, j1, 8
jldi j1, 32
jshr j0, j0, j1
jret
lw_none:
jldi j0, -1
jret
