@echo off
echo Starting Solar Administration Portal...

:: Start Django Backend in a new window
start "Solar Backend" cmd /k "cd /d %~dp0backend && python manage.py runserver"

:: Start Vite Frontend in a new window  
start "Solar Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting...
echo   Backend:  http://127.0.0.1:8000
echo   Frontend: http://localhost:5174
echo.
