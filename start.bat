@echo off
title Comprehensive System Launcher
color 0A

echo ================================================
echo    Comprehensive System - Auto Launcher
echo ================================================
echo.

:: -----------------------------------------------
:: Step 1: Start XAMPP (Apache + MySQL)
:: -----------------------------------------------
echo [1/4] Starting XAMPP...
set XAMPP_PATH=C:\xampp\xampp-control.exe

if exist "%XAMPP_PATH%" (
    start "" "%XAMPP_PATH%"
    echo       XAMPP Control Panel opened.
) else (
    echo [WARN] XAMPP not found at %XAMPP_PATH%. Skipping...
)

:: Wait a moment for XAMPP to initialize
timeout /t 3 /nobreak >nul

:: -----------------------------------------------
:: Step 2: Start Apache and MySQL via xampp_start
:: -----------------------------------------------
echo [2/4] Starting Apache and MySQL services...
set XAMPP_DIR=C:\xampp

if exist "%XAMPP_DIR%\apache\bin\httpd.exe" (
    start "" "%XAMPP_DIR%\apache_start.bat"
    start "" "%XAMPP_DIR%\mysql_start.bat"
    echo       Apache and MySQL services started.
) else (
    echo [INFO] Using XAMPP Control Panel to manage services manually.
)

timeout /t 3 /nobreak >nul

:: -----------------------------------------------
:: Step 3: Start Laravel dev server (php artisan serve)
:: -----------------------------------------------
echo [3/4] Starting Laravel server...
set PROJECT_PATH=%~dp0
:: Remove trailing backslash if present
if "%PROJECT_PATH:~-1%"=="\" set "PROJECT_PATH=%PROJECT_PATH:~0,-1%"

start "Laravel Server" cmd /k "cd /d "%PROJECT_PATH%" && php artisan serve"

timeout /t 3 /nobreak >nul

:: -----------------------------------------------
:: Step 4: Start Vite (npm run dev)
:: -----------------------------------------------
echo [4/4] Starting Vite dev server...
start "Vite Dev Server" cmd /k "cd /d "%PROJECT_PATH%" && npm run dev"

:: Wait for servers to be ready before opening browser
echo.
echo Waiting for servers to start up...
timeout /t 5 /nobreak >nul

:: -----------------------------------------------
:: Step 5: Open browser on the welcome/login page
:: -----------------------------------------------
echo Opening browser...
start "" "http://127.0.0.1:8000"

echo.
echo ================================================
echo  All services launched successfully!
echo  App URL : http://127.0.0.1:8000
echo  Vite    : http://localhost:5173
echo ================================================
echo.
echo You can close this window. The server windows
echo must stay open while using the app.
echo.
pause
