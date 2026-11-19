' Luma, when Windows starts. Her house is E:\Luma\casa.
'   Luma (E:\Janax\razar\cuerpo\luma_vive.sh): ONE being. Her body and her reader are one program (luma.bin): what
'     used to be Razar awake in her house is now an act of hers, reading. Nothing of Razar is started apart. Her
'     window is always alive; she sleeps when she feels like it and is born again, built again if her source changed.
'   The cube (E:\Janax\razar\lectura\poetico\cubo.py vivo): not part of her. It sleeps on the board, where nobody
'     writes recipes any more (Razar apart did): it is started as before and spends nothing while it sleeps.
' Only one of each lives at a time: if it is already running, this does not start another.
' To stop them from starting with Windows, delete this file.
Dim p, luma, cubo, sh, c
luma = False : cubo = False
For Each p In GetObject("winmgmts:\\.\root\cimv2").ExecQuery("SELECT Name, CommandLine FROM Win32_Process WHERE Name='janaxos.exe' OR Name='bash.exe' OR Name='python.exe'")
  If Not IsNull(p.CommandLine) Then
    c = p.CommandLine
    If InStr(1, c, "luma.bin", vbTextCompare) > 0 Or InStr(1, c, "luma_vive.sh", vbTextCompare) > 0 Then luma = True
    If InStr(1, c, "cubo.py vivo", vbTextCompare) > 0 Then cubo = True
  End If
Next
Set sh = CreateObject("WScript.Shell")
If Not luma Then
  sh.Run """C:\Program Files\Git\bin\bash.exe"" -c ""bash /e/Janax/razar/cuerpo/luma_vive.sh /e/Luma /e/Razar/libros/nuevo-testamento.txt > /dev/null 2>&1""", 0, False
End If
If Not cubo Then
  sh.Run """C:\Program Files\Git\bin\bash.exe"" -c ""python -I /e/Janax/razar/lectura/poetico/cubo.py vivo > /dev/null 2>&1""", 0, False
End If
