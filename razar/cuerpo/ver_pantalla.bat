@echo off
rem Double-click: Janax draws its screen and the image opens. It stays in %USERPROFILE%\janax_pantalla\pantalla.png
set "AQUI=%~dp0"
"C:\Program Files\Git\bin\bash.exe" -lc "rm -rf ~/janax_pantalla && bash \"$(cygpath -u '%AQUI%')pantalla.sh\" ~/janax_pantalla"
start "" "%USERPROFILE%\janax_pantalla\pantalla.png"
