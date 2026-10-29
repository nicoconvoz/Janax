; Data of the window to the host (ventanita.inc), for the data section of whoever includes it.
; The catalog of this port: every request it offers, its name (8 bytes) and its number.
  host_names   dq 'escribir'
  HOST_COUNT = ($ - host_names) / 8
  host_numbers dq 1
  host_calls   dq host_escribir
  host_on      db HOST_COUNT dup 1  ; 0 = taken out by JANAX_SIN
  host_ready   db 0
  host_rsp     dq 0
  host_rax     dq 0
  host_written dd 0
  host_env     db 'JANAX_SIN', 0
  HOST_SIN_CAP = 256
  host_sin     db HOST_SIN_CAP dup 0
