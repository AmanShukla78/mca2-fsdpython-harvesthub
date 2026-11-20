@echo off
title HarvestHub - Farm Management Platform Launcher
color 0A
echo ================================================================
echo    HarvestHub (P08) - Farm Management & Crop Planning Platform
echo ================================================================
echo.
cd /d "%~dp0"

echo [1/3] Starting Django REST Backend on http://127.0.0.1:8000/ ...
start "HarvestHub Django Backend (Port 8000)" cmd /k "cd backend && python manage.py runserver 127.0.0.1:8000"

echo [2/3] Starting Frontend Web Server on http://localhost:5173/ ...
start "HarvestHub Frontend (Port 5173)" cmd /k "cd frontend && python -m http.server 5173"

timeout /t 2 /nobreak > nul

echo [3/3] Opening HarvestHub in your default web browser ...
start http://localhost:5173/preview.html

echo.
echo ================================================================
echo    HarvestHub is now LIVE and running on your local device!
echo    - Frontend UI:  http://localhost:5173/preview.html
echo    - Backend API:  http://127.0.0.1:8000/api/
echo.
echo    Close the backend/frontend command windows to stop the servers.
echo ================================================================
pause
