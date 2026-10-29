; Data of the PDP assembler (ensamblador.datos): every name it knows. Anyone can change this table to make
; their Janax their own (rename an instruction, add another name for a register) without touching the
; assembler. Entries of 16 bytes: the name (up to 8 bytes, padded with zeros), its value (dword) and its
; format (dword). An empty name ends the table.
; Built with FASM for now: fasm ensamblador.datos.asm ensamblador.datos

F_NONE    = 0                   ; no operands: jhalt, jret
F_RI      = 1                   ; rd, imm: jldi, jshi
F_RRR     = 2                   ; rd, ra, rb
F_T       = 3                   ; target: jjmp, jcall
F_RT      = 4                   ; rd, target: jjz, jjnz
F_RRI     = 5                   ; rd, ra, imm: memory
F_RR      = 6                   ; rd, ra: jsys
F_WHILE   = 7                   ; r: jwhile, jwhilez (value = the condition that repeats)
F_WEND    = 8                   ; jwend
F_FIRST   = 9                   ; r, size: jfirst
F_DD      = 10                  ; a 32-bit word
F_CONST   = 11                  ; a name for a number: the registers
F_INCLUDE = 12                  ; include 'file'

macro entry name, value, format {
  local start
  start = $
  db name
  times start + 8 - $ db 0
  dd value, format
}

entry 'jhalt',   00h, F_NONE
entry 'jldi',    01h, F_RI
entry 'jadd',    02h, F_RRR
entry 'jsub',    03h, F_RRR
entry 'jmul',    04h, F_RRR
entry 'jdiv',    05h, F_RRR
entry 'jshl',    06h, F_RRR
entry 'jshr',    07h, F_RRR
entry 'jsar',    08h, F_RRR
entry 'jand',    09h, F_RRR
entry 'jor',     0Ah, F_RRR
entry 'jxor',    0Bh, F_RRR
entry 'jjmp',    0Ch, F_T
entry 'jjz',     0Dh, F_RT
entry 'jjnz',    0Eh, F_RT
entry 'jshi',    0Fh, F_RI
entry 'jld',     10h, F_RRI
entry 'jst',     11h, F_RRI
entry 'jldb',    12h, F_RRI
entry 'jstb',    13h, F_RRI
entry 'jcall',   14h, F_T
entry 'jret',    15h, F_NONE
entry 'jsys',    16h, F_RR
entry 'jwhile',  0Eh, F_WHILE
entry 'jwhilez', 0Dh, F_WHILE
entry 'jwend',   0,   F_WEND
entry 'jfirst',  0,   F_FIRST
entry 'dd',      0,   F_DD
entry 'include', 0,   F_INCLUDE
entry 'j0',  0,  F_CONST
entry 'j1',  1,  F_CONST
entry 'j2',  2,  F_CONST
entry 'j3',  3,  F_CONST
entry 'j4',  4,  F_CONST
entry 'j5',  5,  F_CONST
entry 'j6',  6,  F_CONST
entry 'j7',  7,  F_CONST
entry 'j8',  8,  F_CONST
entry 'j9',  9,  F_CONST
entry 'j10', 10, F_CONST
entry 'j11', 11, F_CONST
entry 'j12', 12, F_CONST
entry 'j13', 13, F_CONST
entry 'j14', 14, F_CONST
entry 'j15', 15, F_CONST
dq 0, 0
