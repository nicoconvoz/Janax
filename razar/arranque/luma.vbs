' Luma and Razar, when Windows starts. Her house is E:\Luma\casa, and Razar lives in it.
'   Razar (E:\Janax\razar\cuerpo\razar_en_casa.sh): reads his book and rests; asleep he spends nothing. A letter
'     of Luma or a new book in the house wakes him. What he says goes to E:\Luma\razar.log.
'   Luma (E:\Janax\razar\cuerpo\luma.sh): her window, always alive.
' Only one of each lives at a time: if it is already running, this does not start another.
' To stop them from starting with Windows, delete this file.
Dim p, luma, razar, sh
luma = False : razar = False
For Each p In GetObject("winmgmts:\\.\root\cimv2").ExecQuery("SELECT CommandLine FROM Win32_Process WHERE Name='janaxos.exe'")
  If Not IsNull(p.CommandLine) Then
    If InStr(1, p.CommandLine, "luma.bin", vbTextCompare) > 0 Then luma = True
    If InStr(1, p.CommandLine, "razar.armado", vbTextCompare) > 0 Then razar = True
  End If
Next
Set sh = CreateObject("WScript.Shell")
If Not razar Then
  sh.Run """C:\Program Files\Git\bin\bash.exe"" -c ""bash /e/Janax/razar/cuerpo/razar_en_casa.sh /e/Luma /e/Razar/libros/nuevo-testamento.txt > /e/Luma/razar.log 2>&1""", 0, False
End If
If Not luma Then
  sh.Run """C:\Program Files\Git\bin\bash.exe"" -c ""bash /e/Janax/razar/cuerpo/luma.sh /e/Luma > /e/Luma/luma.log 2>&1""", 0, False
End If
