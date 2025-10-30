#!/bin/bash
# Script de ayuda para ejecutar StoryCraft con Docker
# Uso: ./run.sh [mono|micro] [up|down|logs|restart]

set -e

ARCHITECTURE=${1:-micro}
COMMAND=${2:-up}

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${CYAN}
╔════════════════════════════════════════════════════════╗
║          StoryCraft - Docker Helper Script             ║
╚════════════════════════════════════════════════════════╝

Uso: ./run.sh [arquitectura] [comando]

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
  ./run.sh                    # Levanta microservicios
  ./run.sh mono up            # Levanta monolítico
  ./run.sh micro logs         # Ver logs de microservicios
  ./run.sh mono clean         # Limpiar monolítico completamente
${NC}"
}

get_arch_path() {
    if [ "$1" = "mono" ]; then
        echo "MonoliticArchitecture"
    else
        echo "MicroservicesArchitecture"
    fi
}

execute_docker_command() {
    local path=$1
    local cmd=$2
    
    cd "$path" || exit 1
    
    case $cmd in
        up)
            echo -e "\n${GREEN}🚀 Levantando servicios en $path...${NC}"
            docker-compose up --build -d
            echo -e "\n${GREEN}✅ Servicios levantados!${NC}"
            echo -e "\n${YELLOW}📍 Accede a la aplicación en: http://localhost${NC}"
            echo -e "\n${CYAN}Para ver logs: ./run.sh $ARCHITECTURE logs\n${NC}"
            ;;
        down)
            echo -e "\n${YELLOW}🛑 Deteniendo servicios...${NC}"
            docker-compose down
            echo -e "\n${GREEN}✅ Servicios detenidos!\n${NC}"
            ;;
        logs)
            echo -e "\n${CYAN}📋 Mostrando logs (Ctrl+C para salir)...${NC}"
            docker-compose logs -f
            ;;
        restart)
            echo -e "\n${YELLOW}🔄 Reiniciando servicios...${NC}"
            docker-compose restart
            echo -e "\n${GREEN}✅ Servicios reiniciados!\n${NC}"
            ;;
        ps)
            echo -e "\n${CYAN}📊 Estado de contenedores:\n${NC}"
            docker-compose ps
            echo ""
            ;;
        clean)
            echo -e "\n${RED}⚠️  ADVERTENCIA: Esto eliminará todos los contenedores y volúmenes.\n${NC}"
            read -p "¿Estás seguro? (s/N): " confirm
            if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
                echo -e "\n${YELLOW}🧹 Limpiando todo...${NC}"
                docker-compose down -v
                echo -e "\n${GREEN}✅ Limpieza completada!\n${NC}"
            else
                echo -e "\n${YELLOW}❌ Operación cancelada.\n${NC}"
            fi
            ;;
        *)
            echo -e "\n${RED}❌ Comando desconocido: $cmd${NC}\n"
            show_help
            exit 1
            ;;
    esac
    
    cd - > /dev/null || exit 1
}

# Validar arquitectura
if [ "$ARCHITECTURE" != "mono" ] && [ "$ARCHITECTURE" != "micro" ]; then
    echo -e "\n${RED}❌ Arquitectura inválida: $ARCHITECTURE${NC}\n"
    show_help
    exit 1
fi

# Main
clear

ARCH_PATH=$(get_arch_path "$ARCHITECTURE")
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FULL_PATH="$SCRIPT_DIR/$ARCH_PATH"

if [ ! -d "$FULL_PATH" ]; then
    echo -e "\n${RED}❌ Error: No se encontró el directorio $FULL_PATH${NC}\n"
    exit 1
fi

if [ ! -f "$FULL_PATH/docker-compose.yml" ]; then
    echo -e "\n${RED}❌ Error: No se encontró docker-compose.yml en $FULL_PATH${NC}\n"
    exit 1
fi

# Verificar que Docker esté corriendo
if ! docker ps > /dev/null 2>&1; then
    echo -e "\n${RED}❌ Error: Docker no está corriendo. Por favor inicia Docker.${NC}\n"
    exit 1
fi

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║          StoryCraft - $(echo $ARCHITECTURE | tr '[:lower:]' '[:upper:]') - $(echo $COMMAND | tr '[:lower:]' '[:upper:]')                    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"

execute_docker_command "$FULL_PATH" "$COMMAND"
