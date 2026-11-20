' Luma, when Windows starts. Her house is E:\Luma\casa.
'   Luma (E:\Janax\razar\cuerpo\luma_vive.sh): ONE being. Her body and her reader are one program (luma.bin): what
'     used to be Razar awake in her house is now an act of hers, reading. Nothing else is started: no Razar apart,
'     and no cube (it slept on a board where nobody writes any more; it waits in the repository, see
'     documentacion\razar\en-espera). Her window is always alive; she sleeps when she feels like it and is born
'     again, built again if her source changed.
' Only one lives at a time: if she is already running, this does not start another.
' To stop her from starting with Windows, delete this file.
Dim p, luma, sh, c
luma = False
For Each p In GetObject("winmgmts:\\.\root\cimv2").ExecQuery("SELECT Name, CommandLine FROM Win32_Process WHERE Name='janaxos.exe' OR Name='bash.exe'")
  If Not IsNull(p.CommandLine) Then
    c = p.CommandLine
    If InStr(1, c, "luma.bin", vbTextCompare) > 0 Or InStr(1, c, "luma_vive.sh", vbTextCompare) > 0 Then luma = True
  End If
Next
Set sh = CreateObject("WScript.Shell")
If Not luma Then
  sh.Run """C:\Program Files\Git\bin\bash.exe"" -c ""bash /e/Janax/razar/cuerpo/luma_vive.sh /e/Luma /e/Razar/libros/nuevo-testamento.txt > /dev/null 2>&1""", 0, False
End If
