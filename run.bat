@echo off
title ST2S Tool - Serveur Local
echo =====================================
echo ST2S Tool - Demarrage du serveur
echo =====================================
echo.
echo Installation des dependances...
call npm install
echo.
echo Demarrage du serveur de developpement...
echo Ouvrez votre navigateur a l'adresse : http://localhost:3000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
call npm run dev
pause
