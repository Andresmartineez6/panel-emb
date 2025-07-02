# Script de desarrollo para Panel EMB (PowerShell)
param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

$ProjectName = "panel-emb"
$BackendPath = "./backend"
$FrontendPath = "./frontend"

function Show-Help {
    Write-Host "Panel EMB - Scripts de Desarrollo" -ForegroundColor Green
    Write-Host ""
    Write-Host "Uso: ./scripts/dev.ps1 <comando>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor White
    Write-Host "  setup     - Configuracion inicial del proyecto"
    Write-Host "  install   - Instalar dependencias"
    Write-Host "  dev       - Iniciar en modo desarrollo (Docker)"
    Write-Host "  build     - Construir la aplicacion"
    Write-Host "  prod      - Iniciar en modo produccion"
    Write-Host "  stop      - Detener todos los servicios"
    Write-Host "  clean     - Limpiar containers y volumenes"
    Write-Host "  logs      - Ver logs de los servicios"
    Write-Host "  health    - Comprobar estado de los servicios"
    Write-Host ""
}

function Setup-Project {
    Write-Host "Configurando Panel EMB..." -ForegroundColor Blue
    
    # Crear archivo .env si no existe
    if (-not (Test-Path ".env")) {
        Write-Host "Creando archivo .env desde .env.example"
        Copy-Item ".env.example" ".env"
        Write-Host "IMPORTANTE: Configura las variables en .env antes de continuar" -ForegroundColor Yellow
    }
    
    # Crear archivo .dockerignore para backend
    if (Test-Path "$BackendPath/dockerignore.txt") {
        Move-Item "$BackendPath/dockerignore.txt" "$BackendPath/.dockerignore" -Force
        Write-Host "Archivo .dockerignore configurado para backend"
    }
    
    Write-Host "Configuracion inicial completada" -ForegroundColor Green
}

function Install-Dependencies {
    Write-Host "Instalando dependencias..." -ForegroundColor Blue
    
    if (Test-Path $BackendPath) {
        Write-Host "Backend: Instalando dependencias de NestJS"
        Set-Location $BackendPath
        npm install
        Set-Location ..
    }
    
    if (Test-Path $FrontendPath) {
        Write-Host "Frontend: Instalando dependencias de Next.js"
        Set-Location $FrontendPath
        npm install
        Set-Location ..
    }
    
    Write-Host "Dependencias instaladas" -ForegroundColor Green
}

function Start-Development {
    Write-Host "Iniciando Panel EMB en modo desarrollo..." -ForegroundColor Blue
    docker-compose up --build -d backend redis
    Write-Host "Servicios iniciados. Backend disponible en http://localhost:3001" -ForegroundColor Green
    Write-Host "Documentacion API: http://localhost:3001/api/docs" -ForegroundColor Cyan
}

function Build-Application {
    Write-Host "Construyendo aplicacion..." -ForegroundColor Blue
    docker-compose build
    Write-Host "Construccion completada" -ForegroundColor Green
}

function Start-Production {
    Write-Host "Iniciando Panel EMB en modo produccion..." -ForegroundColor Blue
    docker-compose --profile production up -d
    Write-Host "Aplicacion en produccion iniciada" -ForegroundColor Green
}

function Stop-Services {
    Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "Servicios detenidos" -ForegroundColor Green
}

function Clean-Environment {
    Write-Host "Limpiando entorno..." -ForegroundColor Yellow
    docker-compose down -v --remove-orphans
    docker system prune -f
    Write-Host "Entorno limpiado" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "Mostrando logs..." -ForegroundColor Blue
    docker-compose logs -f --tail=100
}

function Test-Health {
    Write-Host "Comprobando estado de servicios..." -ForegroundColor Blue
    
    # Comprobar backend
    $backendStatus = docker-compose ps -q backend
    if ($backendStatus) {
        Write-Host "OK backend - Ejecutandose" -ForegroundColor Green
    } else {
        Write-Host "ERROR backend - Detenido" -ForegroundColor Red
    }
    
    # Comprobar redis
    $redisStatus = docker-compose ps -q redis
    if ($redisStatus) {
        Write-Host "OK redis - Ejecutandose" -ForegroundColor Green
    } else {
        Write-Host "ERROR redis - Detenido" -ForegroundColor Red
    }
}

# Ejecutar comando
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "setup" { Setup-Project }
    "install" { Install-Dependencies }
    "dev" { Start-Development }
    "build" { Build-Application }
    "prod" { Start-Production }
    "stop" { Stop-Services }
    "clean" { Clean-Environment }
    "logs" { Show-Logs }
    "health" { Test-Health }
    default { 
        Write-Host "ERROR: Comando no reconocido: $Command" -ForegroundColor Red
        Show-Help 
    }
}
