@echo off
setlocal EnableDelayedExpansion
echo ==========================================
echo      OFM AGENCY HUB - SMART SETUP
echo ==========================================

:: 0. Check if Port 5432 is in use (Postgres might be running but not in PATH)
netstat -an | find "5432" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo [v] Port 5432 is LISTENING. Postgres seems to be running.
    set PG_RUNNING=1
) else (
    echo [i] Port 5432 not in use.
    set PG_RUNNING=0
)

:: 1. Check for psql in PATH
where psql >nul 2>nul
if %errorlevel% equ 0 (
    echo [v] 'psql' found in PATH.
    goto :DB_SETUP
)

:: 2. Search for psql in standard directories (Program Files)
echo [i] Searching for psql in Program Files...
for /d %%D in ("C:\Program Files\PostgreSQL\*") do (
    if exist "%%D\bin\psql.exe" (
        echo [v] Found psql at: %%D\bin
        set "PATH=%PATH%;%%D\bin"
        set PG_HOME=%%D
        goto :DB_SETUP
    )
)

:: 3. Install if not found and not running
if %PG_RUNNING% equ 1 (
    echo [!] Postgres is running but psql tools were not found in standard paths.
    echo [!] Installing command line tools might be tricky without full install.
    echo [!] We will try to install full Postgres to get the tools.
)

echo [!] PostgreSQL not found. Installing...
echo.
echo [>] Updating Winget sources...
winget source update
echo.
echo [>] Installing PostgreSQL...
echo [IMPORTANT] Acepta permisos de administrador si se solicitan.
echo [IMPORTANT] Password para superusuario: postgres
echo.
winget install --id PostgreSQL.PostgreSQL -e --source winget --interactive --accept-package-agreements --accept-source-agreements

if %errorlevel% neq 0 (
    echo [x] Install failed. Trying alternative ID...
    winget install --id PostgreSQL.PostgreSQL.16 -e --source winget --interactive --accept-package-agreements --accept-source-agreements
    if !errorlevel! neq 0 (
        echo [x] CRITICAL: Automatic installation failed.
        echo Please install manually from https://www.postgresql.org/download/windows/
        pause
        exit /b 1
    )
)

:: 4. Try to find psql again after install
for /d %%D in ("C:\Program Files\PostgreSQL\*") do (
    if exist "%%D\bin\psql.exe" (
        echo [v] Found psql at: %%D\bin
        set "PATH=%PATH%;%%D\bin"
        goto :DB_SETUP
    )
)

echo [!] Could not locate psql.exe automatically after install.
echo [!] You may need to restart your terminal and run this script again.
pause
exit /b 1

:DB_SETUP
echo.
echo [v] Postgres tools ready.

:: 1. Check/Ask for Password
set PGPASSWORD=postgres
echo [i] Testing default password 'postgres'...
psql -U postgres -c "SELECT 1" >nul 2>nul

if %errorlevel% neq 0 (
    echo.
    echo [!] Default password failed.
    echo [!] You have an existing PostgreSQL installation.
    echo.
    set /p PGPASSWORD="Please enter your PostgreSQL password for user 'postgres': "
    
    psql -U postgres -c "SELECT 1" >nul 2>nul
    if !errorlevel! neq 0 (
        echo.
        echo [x] Authentication failed again.
        echo [x] Please check your password or use pgAdmin to reset it.
        pause
        exit /b 1
    )
)

echo [v] Password accepted.

:: 2. Update .env file for Backend
echo [>] Updating server configuration...
echo DATABASE_URL="postgresql://postgres:!PGPASSWORD!@localhost:5432/ofm_agency_hub?schema=public" > server\.env
echo JWT_SECRET="dev-secret-123" >> server\.env
echo PORT=3000 >> server\.env
echo CLIENT_URL="http://localhost:5173" >> server\.env

:: 3. Create User/DB if needed
echo [>] Configuring Database...
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'ofm_agency_hub'" | findstr "1" >nul
if %errorlevel% neq 0 (
    echo Creating database 'ofm_agency_hub'...
    psql -U postgres -c "CREATE DATABASE ofm_agency_hub;"
    if !errorlevel! neq 0 (
        echo [!] Failed to create database. check if password is 'postgres'.
        echo.
        echo If you used a different password, edit this script and change 'set PGPASSWORD=...'
        pause
        exit /b 1
    )
) else (
    echo [v] Database 'ofm_agency_hub' exists.
)

:: Dependencies and Migrations
echo.
echo [>] Installing NPM dependencies...
cd server && call npm install && cd ..
cd client && call npm install && cd ..

echo.
echo [>] Running Migrations...
cd server
call npx prisma migrate dev --name init_auto
if %errorlevel% neq 0 (
    echo [x] Migration failed. Check DB connection.
    pause
    exit /b 1
)

echo.
echo [>] Seeding Data...
call npm run db:seed:sql
cd ..

:: Start
echo.
echo [v] ALL SYSTEMS GO! Starting servers...
start "OFM Backend" cmd /k "cd server && npm run dev"
timeout /t 3 >nul
start "OFM Frontend" cmd /k "cd client && npm run dev"

echo.
echo ===================================================
echo    App Running at: http://localhost:5173
echo    Credentials: admin@ofmagency.com / admin123
echo ===================================================
pause
