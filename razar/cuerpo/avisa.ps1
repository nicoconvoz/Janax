# avisa.ps1 <house> [-Mudo]: tells when Luma composes something new (the Capitan, 2026-11-20: "pone un vigia; cuando
# componga algo nuevo mostrame urgente"). It spends nothing while nothing happens: it sleeps on a notice of the host
# (a change of "libre" or "leido" in her house), never on a clock.
# What it tells, one line each (and, unless -Mudo, a notice of the host on the screen; the last 50 lines stay in
# <house>\..\avisos.txt):
#   a song of hers was read: its score, against reading with no organ;
#   something she read WON and lives in her body (a letter changed, a song, an instinct): her eight forms after it;
#   a reading better than every one before, with this shelf and these instincts.
# It reads what she keeps: "libre" (gen_leer.py: her counts from byte 4384: read N S, instinct N S, letter N S, shelf,
# instincts, ..., songs N S at 4592) and "leido" (48 bytes a reading: name, name, score, shelf, instincts, alphabet).
param([string]$Casa = 'E:\Luma\casa', [switch]$Mudo)
function Hex([string]$s) { -join ([Text.Encoding]::ASCII.GetBytes($s) | ForEach-Object { $_.ToString('x2') }) }
$fLibre = Join-Path $Casa (Hex 'libre'); $fLeido = Join-Path $Casa (Hex 'leido'); $fFormas = Join-Path $Casa (Hex 'formas')
$registro = Join-Path (Split-Path $Casa -Parent) 'avisos.txt'
function Leer([string]$p) {
  for ($i = 0; $i -lt 5; $i++) { try { return [IO.File]::ReadAllBytes($p) } catch { Start-Sleep -Milliseconds 100 } }
  return ,[byte[]]@()
}
function Nombre([UInt64]$lo, [UInt64]$hi) {
  if (($hi -shr 60) -eq 15) { return 'una cancion larga (mas de 31 letras)' }
  $s = ''
  foreach ($w in @($lo, $hi)) { while ($w -ne 0) { $s += '0123456789ABCDEF'[[int]($w -band 15)]; $w = $w -shr 4 } }
  if ($s) { $s } else { '(sin organo)' }
}
function Formas() {
  $t = [Text.Encoding]::GetEncoding(28591).GetString((Leer $fFormas)) -split "`n"
  ($t[1..8] | ForEach-Object { -join ($_.Substring(0, 31).ToCharArray() | Where-Object { $_ -ne '.' } | ForEach-Object { '0123456789ABCDEF'[[int]$_ - 48] }) }) -join '  '
}
function Estado() {
  $b = Leer $fLibre; $e = @{ S5 = 0; NS = 0; SS = 0; shelf = [UInt64]0; gen = [UInt64]0 }
  if ($b.Length -ge 4608) {
    $e.S5 = [BitConverter]::ToInt64($b, 4392); $e.shelf = [BitConverter]::ToUInt64($b, 4432); $e.gen = [BitConverter]::ToUInt64($b, 4440)
    $e.NS = [BitConverter]::ToInt64($b, 4592); $e.SS = [BitConverter]::ToInt64($b, 4600)
  }
  $e
}
function Lecturas([hashtable]$e) {      # -> how many, the best with her shelf and instincts, the one with no organ, the last
  $b = Leer $fLeido; $n = [int][Math]::Floor($b.Length / 48); $best = $null; $piso = $null; $last = $null
  for ($i = 0; $i -lt $n; $i++) {
    $o = 48 * $i
    if ([BitConverter]::ToUInt64($b, $o + 24) -ne $e.shelf -or [BitConverter]::ToUInt64($b, $o + 32) -ne $e.gen) { continue }
    $lo = [BitConverter]::ToUInt64($b, $o); $hi = [BitConverter]::ToUInt64($b, $o + 8); $sc = [BitConverter]::ToInt64($b, $o + 16)
    if ($lo -eq 0 -and $hi -eq 0) { $piso = $sc }
    if ($null -eq $best -or $sc -gt $best.sc) { $best = @{ sc = $sc; nom = (Nombre $lo $hi) } }
    $last = @{ sc = $sc; nom = (Nombre $lo $hi) }
  }
  @{ n = $n; best = $best; piso = $piso; last = $last }
}
function Avisar([string]$linea) {
  $linea = (Get-Date -Format 'HH:mm') + ' ' + $linea
  Write-Output $linea; [Console]::Out.Flush()
  if ($Mudo) { return }
  try {
    $v = @(Get-Content $registro -ErrorAction SilentlyContinue) + $linea
    Set-Content $registro ($v | Select-Object -Last 50) -Encoding UTF8
    Add-Type -AssemblyName System.Windows.Forms, System.Drawing
    $g = New-Object Windows.Forms.NotifyIcon; $g.Icon = [Drawing.SystemIcons]::Information; $g.Visible = $true
    $g.ShowBalloonTip(20000, 'Luma', $linea, 'Info'); Start-Sleep -Seconds 8; $g.Dispose()
  } catch { }
}
$e = Estado; $l = Lecturas $e
$S5 = $e.S5; $NS = $e.NS; $n = $l.n; $mejor = if ($l.best) { $l.best.sc } else { $null }; $pendiente = 0
$w = New-Object IO.FileSystemWatcher $Casa; $w.NotifyFilter = [IO.NotifyFilters]'FileName, LastWrite, Size'; $w.EnableRaisingEvents = $true
Register-ObjectEvent $w Changed -SourceIdentifier cambio | Out-Null
Register-ObjectEvent $w Created -SourceIdentifier nuevo | Out-Null
while ($true) {
  $ev = Wait-Event
  $mio = $false
  foreach ($x in @(Get-Event)) { if ($x.SourceEventArgs.Name -eq (Split-Path $fLibre -Leaf) -or $x.SourceEventArgs.Name -eq (Split-Path $fLeido -Leaf)) { $mio = $true }; Remove-Event -EventIdentifier $x.EventIdentifier }
  if (-not $mio) { continue }
  Start-Sleep -Milliseconds 300          # (she writes both files in a row: read them once they are whole)
  $e = Estado; $l = Lecturas $e
  if ($e.NS -gt $NS) { $pendiente += $e.NS - $NS; $NS = $e.NS }
  if ($l.n -gt $n) {
    if ($pendiente -gt 0 -and $l.last) {
      $pendiente = 0
      Avisar ("LUMA COMPUSO UNA CANCION ({0} en su vida): {1} lee {2} bits (sin organo {3})" -f $e.NS, $l.last.nom, $l.last.sc, $l.piso)
    }
    $n = $l.n
  }
  if ($e.S5 -gt $S5) {
    $S5 = $e.S5
    Avisar ("LO QUE LEYO GANO Y VIVE EN SU CUERPO ({0} canciones ganaron). Sus formas: {1}" -f $e.SS, (Formas))
  }
  if ($l.best -and ($null -eq $mejor -or $l.best.sc -gt $mejor)) {
    if ($null -ne $mejor) { Avisar ("NUEVA MEJOR LECTURA: {0} = {1} bits (antes {2})" -f $l.best.nom, $l.best.sc, $mejor) }
    $mejor = $l.best.sc
  }
}
