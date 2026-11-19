' Luma, Razar and the cube, when Windows starts. Her house is E:\Luma\casa, and Razar lives in it.
'   Razar (E:\Janax\razar\cuerpo\razar_en_casa.sh): reads his books and rests; asleep he spends nothing. A letter
'     of Luma or a new book in the house wakes him. What he says is not kept in a file: a log that grows is a text the
'     vigia eats again every time it changes (his record is his autopsy, in the house).
'   Luma (E:\Janax\razar\cuerpo\luma_vive.sh): her window, always alive; she sleeps when she feels like it, and is
'     born again with what is new (Razar is reborn in her night if the board has a new recipe).
'   The cube (E:\Janax\razar\lectura\poetico\cubo.py vivo): asleep on the board; a recipe written there wakes it,
'     and what it finds goes back to the board for Razar.
' Only one of each lives at a time: if it is already running, this does not start another.
' To stop them from starting with Windows, delete this file.
Dim p, luma, razar, cubo, sh, c
luma = False : razar = False : cubo = False
For Each p In GetObject("winmgmts:\\.\root\cimv2").ExecQuery("SELECT Name, CommandLine FROM Win32_Process WHERE Name='janaxos.exe' OR Name='bash.exe' OR Name='python.exe'")
  If Not IsNull(p.CommandLine) Then
    c = p.CommandLine
    If InStr(1, c, "luma.bin", vbTextCompare) > 0 Or InStr(1, c, "luma_vive.sh", vbTextCompare) > 0 Then luma = True
    If InStr(1, c, "razar.armado", vbTextCompare) > 0 Then razar = True
    If InStr(1, c, "cubo.py vivo", vbTextCompare) > 0 Then cubo = True
  End If
Next
Set sh = CreateObject("WScript.Shell")
If Not razar Then
  sh.Run """C:\Program Files\Git\bin\bash.exe"" -c ""bash /e/Janax/razar/cuerpo/razar_en_casa.sh /e/Luma /e/Razar/libros/nuevo-testamento.txt > /dev/null 2>&1""", 0, False
End If
If Not luma Then
  sh.Run """C:\Program Files\Git\bin\bash.exe"" -c ""bash /e/Janax/razar/cuerpo/luma_vive.sh /e/Luma /e/Razar/libros/nuevo-testamento.txt > /dev/null 2>&1""", 0, False
End If
If Not cubo Then
  sh.Run """C:\Program Files\Git\bin\bash.exe"" -c ""python -I /e/Janax/razar/lectura/poetico/cubo.py vivo > /dev/null 2>&1""", 0, False
End If
