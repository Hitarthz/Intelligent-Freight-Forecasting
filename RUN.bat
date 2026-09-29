@echo off
setlocal
cd /d "%~dp0"
title SIH26006 FreightForecaster - Aeturnus
cls
echo ==========================================
echo   SIH26006 FREIGHT FORECASTER - AETURNUS
echo ==========================================
echo.

if not exist "backend\venv\Scripts\python.exe" (
    echo [1/3] Creating Python environment...
    py -m venv backend\venv
    if errorlevel 1 goto ERROR
)

call "backend\venv\Scripts\activate.bat"
echo [2/3] Checking Python packages...
pip install -r backend\requirements.txt -q
if errorlevel 1 goto ERROR

where npm >nul 2>&1
if errorlevel 1 (
    echo Node.js/npm is not installed.
    goto ERROR
)

if not exist "frontend\node_modules" (
    echo Installing frontend packages - first run only...
    cd frontend
    call npm install
    if errorlevel 1 goto ERROR
    cd ..
)

if not exist "frontend\node_modules\.vite" (
    rem Vite may be installed under node_modules; no action needed.
)

echo [3/3] Starting backend and dashboard...
echo.
echo Dashboard: http://localhost:5173
start "" /b cmd /c "cd /d ""%~dp0backend"" && call venv\Scripts\activate.bat && python -m uvicorn app:app --reload"
start "" /b cmd /c "cd /d ""%~dp0frontend"" && npm run dev"

timeout /t 5 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo ==========================================
echo   DASHBOARD IS RUNNING
 echo  Keep this ONE terminal open.
echo   Close this window to stop the demo.
echo ==========================================
echo.
cmd /k
exit /b

:ERROR
echo.
echo Something is missing or an installation failed.
echo Check the message above, then press any key.
pause
exit /b 1
