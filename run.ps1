# Script de ayuda para ejecutar StoryCraft con Docker
# Uso: .\run.ps1 [mono|micro] [up|down|logs|restart]

param(
    [Parameter(Position=0)]
    [ValidateSet('mono', 'micro')]
    [string]$Architecture = 'micro',
    
    [Parameter(Position=1)]
    [ValidateSet('up', 'down', 'logs', 'restart', 'ps', 'clean')]
    [string]$Command = 'up'
)

$ErrorActionPreference = "Stop"

function Show-Help {
    Write-Host "
╔════════════════════════════════════════════════════════╗
║          StoryCraft - Docker Helper Script             ║
╚════════════════════════════════════════════════════════╝

Uso: .\run.ps1 [arquitectura] [comando]

Arquitecturas:
  mono   - Arquitectura monolítica (3 contenedores)
  micro  - Arquitectura de microservicios (6 contenedores)

Comandos:
  up      - Levantar servicios (default)
  down    - Detener servicios
  logs    - Ver logs en tiempo real
  restart - Reiniciar servicios
  ps      - Ver estado de contenedores
  clean   - Eliminar todo (contenedores + volúmenes)

Ejemplos:
  .\run.ps1                    # Levanta microservicios
  .\run.ps1 mono up            # Levanta monolítico
  .\run.ps1 micro logs         # Ver logs de microservicios
  .\run.ps1 mono clean         # Limpiar monolítico completamente
" -ForegroundColor Cyan
}

function Get-ArchPath {
    param([string]$Arch)
    
    if ($Arch -eq 'mono') {
        return "MonoliticArchitecture"
    } else {
        return "MicroservicesArchitecture"
    }
}

function Execute-DockerCommand {
    param(
        [string]$Path,
        [string]$Cmd
    )
    
    Push-Location $Path
    
    try {
        switch ($Cmd) {
            'up' {
                Write-Host "`n🚀 Levantando servicios en $Path..." -ForegroundColor Green
                docker-compose up --build -d
                Write-Host "`n✅ Servicios levantados!" -ForegroundColor Green
                Write-Host "`n📍 Accede a la aplicación en: http://localhost" -ForegroundColor Yellow
                Write-Host "`nPara ver logs: .\run.ps1 $Architecture logs`n" -ForegroundColor Cyan
            }
            'down' {
                Write-Host "`n🛑 Deteniendo servicios..." -ForegroundColor Yellow
                docker-compose down
                Write-Host "`n✅ Servicios detenidos!`n" -ForegroundColor Green
            }
            'logs' {
                Write-Host "`n📋 Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Cyan
                docker-compose logs -f
            }
            'restart' {
                Write-Host "`n🔄 Reiniciando servicios..." -ForegroundColor Yellow
                docker-compose restart
                Write-Host "`n✅ Servicios reiniciados!`n" -ForegroundColor Green
            }
            'ps' {
                Write-Host "`n📊 Estado de contenedores:`n" -ForegroundColor Cyan
                docker-compose ps
                Write-Host ""
            }
            'clean' {
                Write-Host "`n⚠️  ADVERTENCIA: Esto eliminará todos los contenedores y volúmenes.`n" -ForegroundColor Red
                $confirm = Read-Host "¿Estás seguro? (s/N)"
                if ($confirm -eq 's' -or $confirm -eq 'S') {
                    Write-Host "`n🧹 Limpiando todo..." -ForegroundColor Yellow
                    docker-compose down -v
                    Write-Host "`n✅ Limpieza completada!`n" -ForegroundColor Green
                } else {
                    Write-Host "`n❌ Operación cancelada.`n" -ForegroundColor Yellow
                }
            }
        }
    }
    catch {
        Write-Host "`n❌ Error: $_`n" -ForegroundColor Red
        exit 1
    }
    finally {
        Pop-Location
    }
}

# Main
Clear-Host

$archPath = Get-ArchPath -Arch $Architecture
$fullPath = Join-Path $PSScriptRoot $archPath

if (-not (Test-Path $fullPath)) {
    Write-Host "`n❌ Error: No se encontró el directorio $fullPath`n" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path (Join-Path $fullPath "docker-compose.yml"))) {
    Write-Host "`n❌ Error: No se encontró docker-compose.yml en $fullPath`n" -ForegroundColor Red
    exit 1
}

# Verificar que Docker esté corriendo
try {
    docker ps > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ Error: Docker no está corriendo. Por favor inicia Docker Desktop.`n" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "`n❌ Error: Docker no está instalado o no está corriendo.`n" -ForegroundColor Red
    exit 1
}

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          StoryCraft - $($Architecture.ToUpper()) - $($Command.ToUpper())                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Execute-DockerCommand -Path $fullPath -Cmd $Command
