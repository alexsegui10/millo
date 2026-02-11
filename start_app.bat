@echo off
echo ==========================================
echo      OFM AGENCY HUB - STARTING APP
echo ==========================================

echo [1/2] Starting Backend Server...
start "OFM Backend" cmd /k "cd server && npm run dev"

timeout /t 5 >nul

echo [2/2] Starting Frontend Client...
start "OFM Frontend" cmd /k "cd client && npm run dev"

echo.
echo ===================================================
echo    App should be running shortly!
echo    Frontend: http://localhost:5173 (or 5174)
echo    Backend:  http://localhost:3000
echo.
echo    Login:    admin@example.com
echo    Password: admin123
echo ===================================================
pause
