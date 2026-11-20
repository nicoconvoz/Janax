' Luma, when Windows starts. Her house is E:\Luma\casa.
'   Luma (E:\Janax\razar\cuerpo\luma_vive.sh): ONE being. Her body and her reader are one program (luma.bin): what
'     used to be Razar awake in her house is now an act of hers, reading. Nothing else of hers is started: no Razar
'     apart, and no cube (it slept on a board where nobody writes any more; it waits in the repository, see
'     documentacion\razar\en-espera). Her window is born behind the others and is always alive; she sleeps when she
'     feels like it and is born again, built again if her source changed.
'   Who tells (E:\Janax\razar\cuerpo\avisa.ps1): a notice on the screen when she composes a song, when something she
'     read wins, or when a reading beats every one before. It sleeps on a notice of the host: it spends nothing.
' Only one of each lives at a time: if it is already running, this does not start another.
' To stop them from starting with Windows, delete this file.
Dim p, luma, avisa, sh, c
luma = False : avisa = False
For Each p In GetObject("winmgmts:\\.\root\cimv2").ExecQuery("SELECT Name, CommandLine FROM Win32_Process WHERE Name='janaxos.exe' OR Name='bash.exe' OR Name='powershell.exe'")
  If Not IsNull(p.CommandLine) Then
    c = p.CommandLine
    If p.Name <> "powershell.exe" And (InStr(1, c, "luma.bin", vbTextCompare) > 0 Or InStr(1, c, "luma_vive.sh", vbTextCompare) > 0) Then luma = True
    If p.Name = "powershell.exe" And InStr(1, c, "avisa.ps1", vbTextCompare) > 0 And InStr(1, c, "-Mudo", vbTextCompare) = 0 Then avisa = True
  End If
Next
Set sh = CreateObject("WScript.Shell")
If Not luma Then
  sh.Run """C:\Program Files\Git\bin\bash.exe"" -c ""bash /e/Janax/razar/cuerpo/luma_vive.sh /e/Luma /e/Razar/libros/nuevo-testamento.txt > /dev/null 2>&1""", 0, False
End If
If Not avisa Then
  sh.Run "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File E:\Janax\razar\cuerpo\avisa.ps1 -Casa E:\Luma\casa", 0, False
End If
