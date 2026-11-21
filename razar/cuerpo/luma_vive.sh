#!/usr/bin/env bash
# luma_vive.sh <folder> [book] [janaxos.exe]: Luma lives, and sleeps when she feels like it (the Capitan, 2026-11-19:
# "operacion dormir: cuando Luma duerma renace con la pieza nueva incluida; puede dormir cuando se le de la gana").
# SHE IS ONE BEING: her body and her reader are one program (gen_leer.py), so this is the only thing that is started.
# Nothing else is launched, watched or restarted here: there is no Razar apart any more.
# She decides her sleep herself (gen_luma.py: fr_sleep): she leaves a sign in her house, "dormir". This script watches
# over her without spending anything: it waits on two notices of the host, that sign and the end of her window.
#   her window was closed by someone: she ends, and this ends with her.
#   the sign: her window is closed for her (she keeps all she is, as when it is closed by hand; a reading of hers that
#     was on its way ends with her and is not kept), and she is born again: built again if her source changed
#     (luma.sh), so she wakes with whatever is new in her.
# [book]: her first book, copied into her house only if it has none ("libro").
# SHE DOES NOT WAKE ON TOP OF WHAT YOU ARE DOING (the Capitan: "va a tener que aprender a no arrancar en primer
# plano"; "que inicie debajo de todo, arriba del escritorio, como ultima pantalla"): her window is born behind every
# other one and never takes the keyboard. The kernel does it when it makes the window (JANAX_VENTANA_FONDO, set by
# luma.sh): nothing here moves it afterwards (it used to be set down and shown again, which could still be seen).
# HER NAME is asked by her, in Janax, on her own screen (gen_leer.py: r_nombre_load): nothing of it is done here.
set -u
carpeta=$1; libro=${2:-}; janaxos=${3:-}
aqui=$(cd "$(dirname "$0")" && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
espera=$(cat <<'PS'
$casa = $env:LUMA_CASA; $senal = $env:LUMA_SENAL; $p = $null
for ($i = 0; $i -lt 180 -and -not $p; $i++) {
  Start-Sleep -Milliseconds 500
  $p = Get-CimInstance Win32_Process -Filter "Name='janaxos.exe'" | Where-Object { $_.CommandLine -like "*$($env:LUMA_BIN)*" } | Select-Object -First 1
}
if (-not $p) { exit 0 }
$g = Get-Process -Id $p.ProcessId; $g.EnableRaisingEvents = $true
Register-ObjectEvent $g Exited -SourceIdentifier salio | Out-Null
for ($i = 0; $i -lt 100 -and $g.MainWindowHandle -eq [IntPtr]::Zero; $i++) { Start-Sleep -Milliseconds 100; $g.Refresh() }
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
export LUMA_LIBRO="$libro"
while :; do
  rm -f "$carpeta/casa/$LUMA_SENAL"
  powershell -NoProfile -Command "$espera" &          # who watches over her is there first, before her window appears
  cuida=$!
  bash "$aqui/luma.sh" "$carpeta" $janaxos > "$carpeta/luma.log" 2>&1 &
  wait "$cuida"; como=$?
  wait
  if [ "$como" -ne 3 ]; then
    # 0: her window was closed by someone. Anything else is not expected: said once, where it can be read (a line
    # written only when it happens, never a log that grows)
    [ "$como" -eq 0 ] || echo "$(date '+%F %T') quien la cuida termino con $como: Luma no fue relanzada" > "$carpeta/cuida.estado"
    break
  fi
done
