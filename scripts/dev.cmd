@echo off
REM Script de desarrollo para Panel EMB (Batch)

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="setup" goto setup
if "%1"=="install" goto install
if "%1"=="dev" goto dev
if "%1"=="build" goto build
if "%1"=="prod" goto prod
if "%1"=="stop" goto stop
if "%1"=="clean" goto clean
if "%1"=="logs" goto logs
if "%1"=="health" goto health
goto error

:help
echo Panel EMB - Scripts de Desarrollo
echo.
echo Uso: scripts\dev.cmd ^<comando^>
echo.
echo Comandos disponibles:
echo   setup     - Configuracion inicial del proyecto
echo   install   - Instalar dependencias
echo   dev       - Iniciar en modo desarrollo (Docker)
echo   build     - Construir la aplicacion
echo   prod      - Iniciar en modo produccion
echo   stop      - Detener todos los servicios
echo   clean     - Limpiar containers y volumenes
echo   logs      - Ver logs de los servicios
echo   health    - Comprobar estado de los servicios
echo.
goto end

:setup
echo Configurando Panel EMB...
if not exist ".env" (
    echo Creando archivo .env desde .env.example
    copy ".env.example" ".env" >nul
    echo IMPORTANTE: Configura las variables en .env antes de continuar
)
if exist "backend\dockerignore.txt" (
    move "backend\dockerignore.txt" "backend\.dockerignore" >nul
    echo Archivo .dockerignore configurado para backend
)
echo Configuracion inicial completada
goto end

:install
echo Instalando dependencias...
if exist "backend" (
    echo Backend: Instalando dependencias de NestJS
    cd backend
    npm install
    cd ..
)
if exist "frontend" (
    echo Frontend: Instalando dependencias de Next.js
    cd frontend
    npm install
    cd ..
)
echo Dependencias instaladas
goto end

:dev
echo Iniciando Panel EMB en modo desarrollo...
docker-compose up --build -d backend redis
echo Servicios iniciados. Backend disponible en http://localhost:3001
echo Documentacion API: http://localhost:3001/api/docs
goto end

:build
echo Construyendo aplicacion...
docker-compose build
echo Construccion completada
goto end

:prod
echo Iniciando Panel EMB en modo produccion...
docker-compose --profile production up -d
echo Aplicacion en produccion iniciada
goto end

:stop
echo Deteniendo servicios...
docker-compose down
echo Servicios detenidos
goto end

:clean
echo Limpiando entorno...
docker-compose down -v --remove-orphans
docker system prune -f
echo Entorno limpiado
goto end

:logs
echo Mostrando logs...
docker-compose logs -f --tail=100
goto end

:health
echo Comprobando estado de servicios...
for /f %%i in ('docker-compose ps -q backend 2^>nul') do set BACKEND_STATUS=%%i
for /f %%i in ('docker-compose ps -q redis 2^>nul') do set REDIS_STATUS=%%i

if defined BACKEND_STATUS (
    echo OK backend - Ejecutandose
) else (
    echo ERROR backend - Detenido
)

if defined REDIS_STATUS (
    echo OK redis - Ejecutandose
) else (
    echo ERROR redis - Detenido
)
goto end

:error
echo ERROR: Comando no reconocido: %1
goto help

:end
