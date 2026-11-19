' Razar vigia: arranca escondido con Windows y come solo los textos que se escriben en C: y E:
' (E:\Janax\razar\lectura\vigia.sh). Su casa es ~/razar_vigia; la biblioteca, ~/razar_tablero, la comparte con la charla.
' Lo que hace queda en ~/razar_vigia/vigia.log, solo sus ultimos 100 renglones. Para que no arranque mas, borrar este archivo.
CreateObject("WScript.Shell").Run """C:\Program Files\Git\bin\bash.exe"" -c ""RAZAR_CASA=$HOME/razar_vigia VIGIA_LOG=$HOME/razar_vigia/vigia.log bash /e/Janax/razar/lectura/vigia.sh""", 0, False
