@echo off
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: UTILISATION                                                ::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: À utiliser sur un poste Windows.
:: Déposer ce fichier dans le dossier de travail.
::   Au besoin, changer le numéro du nom du fichier pour correspondre au numéro de port désiré.
::   Au besoin, ôter le numéro du nom du fichier pour utiliser numéro de port aléatoire.
:: Démarrer le serveur en double-cliquant sur le fichier ".bat".
::   Si le port est déjà pris, on incrémente jusqu'à en trouver un libre. Bien noter le port trouvé.
::   Si le dossier contient un sous-dossier "public", le root du site sera "public". 
::   Sinon, on utilisera le cossier courant.
:: ATTENTION! On peut avoir besoin de mettre le chemin complet vers l'exécutable "php.exe" à la fin de ce fichier.

set fic=%~nx0
set chemin=%~dp0

FOR /F "tokens=2,3 delims=." %%I IN ("%fic%") DO (
    if "%%I"=="bat" (
		set /a port=%RANDOM% %% 8192 + 49152
	) else (
		set port=%%I
	)
)

cd %chemin%
IF EXIST public (
	cd public
)

:checkport
netstat -oan |findstr /c:":%port% " >nul
if %ERRORLEVEL% == 0 (
	echo Le port '%port%' est pris.
	set /A port=port+1
	goto checkport
)

setlocal
set "myString=%port%"
call :strlen result myString
setlocal enabledelayedexpansion
set char=═
set num=%result%
for /l %%i in (1,1,%num%) do set res=!res!%char%
echo                    ╔%res%╗
echo On utilise le port ║ %port% ║
echo                    ╚%res%╝
goto :demarrer

:strlen <resultVar> <stringVar>
(   
    setlocal EnableDelayedExpansion
    set "s=!%~2!#"
    set "len=2"
    for %%P in (4096 2048 1024 512 256 128 64 32 16 8 4 2 1) do (
        if "!s:~%%P,1!" NEQ "" ( 
            set /a "len+=%%P"
            set "s=!s:~%%P!"
        )
    )
)
( 
    endlocal
    set "%~1=%len%"
    exit /b
)
:demarrer
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: DÉMARRAGE DU SERVEUR                                       ::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
php.exe -S 0.0.0.0:%port%
