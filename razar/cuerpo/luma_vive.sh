#!/usr/bin/env bash
# luma_vive.sh <folder> <book>: Luma lives, and sleeps when she feels like it (the Capitan, 2026-11-19: "operacion
# dormir: cuando Luma duerma renace con la pieza nueva incluida; puede dormir cuando se le de la gana").
# She decides it herself (gen_luma.py: fr_sleep): she leaves a sign in her house, "dormir". This script watches over
# her without spending anything: it waits on two notices of the host, that sign and the end of her window.
#   her window was closed by someone: she ends, and this ends with her.
#   the sign: her window is closed for her (she keeps all she is, as when it is closed by hand), the night does its
#     work, and she is born again.
# THE NIGHT. Razar is reborn if the board has a recipe it did not have at his last birth (what the cube found, what
# another Razar kept): then his shared shelf makes it sit his exam with his own books, and what he makes his own is
# born as a form of hers when she wakes. Nothing new on the board: he is left as he is (unless he is not there).
# SHE DOES NOT WAKE ON TOP OF WHAT YOU ARE DOING (the Capitan: "va a tener que aprender a no arrancar en primer
# plano"): when her window appears it is set down and shown again without taking the keyboard, behind the others;
# whoever had it keeps it. She wakes many times a day: each one must not interrupt.
set -u
carpeta=$1; libro=$2
aqui=$(cd "$(dirname "$0")" && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
tablero=${JANAX_TABLERO:-$(cygpath -m "$HOME/razar_tablero")}
recetas() {   # the recipes the board holds now: how many, and a print of their names
  python -I -c "import hashlib,os,sys; p='tablero/Receta de Organos/'.encode().hex(); n=sorted(f for f in os.listdir(sys.argv[1]) if f.startswith(p)); print(len(n), hashlib.sha256(''.join(n).encode()).hexdigest()[:16])" "$tablero" 2>/dev/null
}
espera=$(cat <<'PS'
Add-Type @'
using System; using System.Runtime.InteropServices;
public class Vent {
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int cx, int cy, uint f);
}
'@
$casa = $env:LUMA_CASA; $senal = $env:LUMA_SENAL; $p = $null
for ($i = 0; $i -lt 180 -and -not $p; $i++) {
  Start-Sleep -Milliseconds 500
  $p = Get-CimInstance Win32_Process -Filter "Name='janaxos.exe'" | Where-Object { $_.CommandLine -like "*$($env:LUMA_BIN)*" } | Select-Object -First 1
}
if (-not $p) { exit 0 }
$g = Get-Process -Id $p.ProcessId; $g.EnableRaisingEvents = $true
Register-ObjectEvent $g Exited -SourceIdentifier salio | Out-Null
for ($i = 0; $i -lt 100 -and $g.MainWindowHandle -eq [IntPtr]::Zero; $i++) { Start-Sleep -Milliseconds 100; $g.Refresh() }
if ($g.MainWindowHandle -ne [IntPtr]::Zero) {
  [void][Vent]::ShowWindow($g.MainWindowHandle, 6)                                  # set down: the keyboard goes back to who had it
  [void][Vent]::ShowWindow($g.MainWindowHandle, 4)                                  # shown again, without taking it
  [void][Vent]::SetWindowPos($g.MainWindowHandle, [IntPtr]1, 0, 0, 0, 0, 0x13)      # and behind the others
}
$w = New-Object IO.FileSystemWatcher $casa, $senal
$w.NotifyFilter = [IO.NotifyFilters]'FileName, LastWrite'; $w.EnableRaisingEvents = $true
Register-ObjectEvent $w Created -SourceIdentifier dormir | Out-Null
Register-ObjectEvent $w Changed -SourceIdentifier dormir2 | Out-Null
if (Test-Path (Join-Path $casa $senal)) { $quien = 'dormir' } else { $quien = (Wait-Event).SourceIdentifier }
if ($quien -like 'dormir*') { [void]$g.CloseMainWindow(); [void]$g.WaitForExit(30000); exit 3 }
exit 0
PS
)
export LUMA_CASA="$(cygpath -w "$carpeta/casa")" LUMA_SENAL="$(etiqueta dormir)" LUMA_BIN="$(cygpath -m "$carpeta/bin/luma.bin")"
export LUMA_RAZAR="$(cygpath -m "$carpeta/razar.armado")"
while :; do
  rm -f "$carpeta/casa/$LUMA_SENAL"
  powershell -NoProfile -Command "$espera" &          # who watches over her is there first, before her window appears
  cuida=$!
  bash "$aqui/luma.sh" "$carpeta" > "$carpeta/luma.log" 2>&1 &
  wait "$cuida"; como=$?
  wait
  if [ "$como" -ne 3 ]; then
    # 0: her window was closed by someone. Anything else is not expected: said once, where it can be read (a line
    # written only when it happens, never a log that grows)
    [ "$como" -eq 0 ] || echo "$(date '+%F %T') quien la cuida termino con $como: Luma no fue relanzada" > "$carpeta/cuida.estado"
    break
  fi
  ahora=$(recetas)
  antes=$(cat "$carpeta/tablero.visto" 2>/dev/null)   # the board as he found it when he was born (razar_en_casa.sh)
  vivo=$(powershell -NoProfile -Command \
    "(Get-CimInstance Win32_Process -Filter \"Name='janaxos.exe'\" | Where-Object { \$_.CommandLine -like \"*\$(\$env:LUMA_RAZAR)*\" } | Measure-Object).Count" 2>/dev/null | tr -d '\r')
  if [ "$ahora" != "$antes" ] || [ "${vivo:-0}" = 0 ]; then   # something new for him, or he is not there (a known flaw:
                                                               # a book that comes while he is awake ends him)
    powershell -NoProfile -Command \
      "Get-CimInstance Win32_Process -Filter \"Name='janaxos.exe'\" | Where-Object { \$_.CommandLine -like \"*\$(\$env:LUMA_RAZAR)*\" } | ForEach-Object { Stop-Process -Id \$_.ProcessId -Force }" > /dev/null 2>&1
    bash "$aqui/razar_en_casa.sh" "$carpeta" "$libro" > /dev/null 2>&1 &
  fi
done
