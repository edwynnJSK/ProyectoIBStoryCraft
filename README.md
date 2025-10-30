# ProyectoIBStoryCraft

Repositorio con dos implementaciones completas del proyecto **StoryCraft** - una plataforma para crear y compartir historias colaborativas.

## 🏗️ Arquitecturas disponibles

### 1. 📦 Monolítica (`MonoliticArchitecture/`)
Implementación tradicional con backend y frontend en un solo repositorio.
- **Backend**: Node.js + Express + Prisma
- **Frontend**: React + Vite
- **Base de datos**: SQL Server
- **Características**: WebSockets para chat en tiempo real, gestión de imágenes

### 2. 🔀 Microservicios (`MicroservicesArchitecture/`)
Arquitectura moderna basada en microservicios independientes.
- **API Gateway**: NestJS (puerto 3000)
- **Auth Service**: Autenticación y autorización (puerto 3001)
- **Stories Service**: Gestión de historias (puerto 3002)
- **Chapters Service**: Gestión de capítulos (puerto 3003)
- **Frontend**: React + Vite + Nginx
- **Base de datos**: SQL Server compartido

---

## 🚀 Inicio rápido

### Scripts helper incluidos 🎯

Para facilitar el uso, el proyecto incluye scripts de ayuda:

**Windows (PowerShell):**
```powershell
# Levantar microservicios
.\run.ps1 micro up

# Levantar monolítico
.\run.ps1 mono up

# Ver logs
.\run.ps1 micro logs

# Detener servicios
.\run.ps1 micro down

# Ver estado
.\run.ps1 micro ps

# Limpiar todo (⚠️ elimina volúmenes)
.\run.ps1 micro clean
```

**Linux/Mac (Bash):**
```bash
# Dar permisos de ejecución primero
chmod +x run.sh

# Levantar microservicios
./run.sh micro up

# Levantar monolítico
./run.sh mono up

# Ver logs
./run.sh micro logs
```

### Opción 1: Docker (Recomendado)

#### Microservicios
```powershell
cd MicroservicesArchitecture
docker-compose up --build
```
Accede a http://localhost

#### Monolítico
```powershell
cd MonoliticArchitecture
docker-compose up --build
```
Accede a http://localhost

### Opción 2: Desarrollo local

Consulta los README específicos para instrucciones detalladas:
- **Monolítico**: [`MonoliticArchitecture/README.md`](MonoliticArchitecture/README.md)
- **Microservicios**: [`MicroservicesArchitecture/README.md`](MicroservicesArchitecture/README.md)

---

## 📋 Requisitos

### Para Docker (ambas arquitecturas)
- Docker >= 20.x
- docker-compose >= 1.27
- Al menos 4GB RAM disponible (microservicios) o 2GB (monolítico)

### Para desarrollo local
- Node.js >= 16
- npm >= 7
- SQL Server 2019+ (o usar el contenedor Docker de SQL Server)
- Git

---

## 🌟 Características principales

### Funcionalidades comunes (ambas arquitecturas)
- ✅ Autenticación y autorización de usuarios
- ✅ Creación y gestión de historias
- ✅ Creación y gestión de capítulos
- ✅ Chat en tiempo real (WebSockets)
- ✅ Gestión de imágenes/archivos
- ✅ Dashboard de usuario
- ✅ Interfaz responsive (Bootstrap)

### Arquitectura Monolítica
- ✅ Despliegue simple y rápido
- ✅ Ideal para desarrollo y pruebas
- ✅ Menor complejidad operacional
- ✅ Todo en un solo proceso

### Arquitectura de Microservicios
- ✅ Escalabilidad independiente por servicio
- ✅ Despliegue independiente
- ✅ Aislamiento de fallos
- ✅ Mejor separación de responsabilidades
- ✅ Ideal para equipos grandes

---

## 📊 Comparación de arquitecturas

| Característica | Monolítico | Microservicios |
|----------------|------------|----------------|
| **Complejidad inicial** | Baja ⭐ | Alta ⭐⭐⭐ |
| **Tiempo de setup** | ~5 min | ~10 min |
| **Escalabilidad** | Vertical | Horizontal |
| **Mantenimiento** | Simple | Complejo |
| **Contenedores** | 3 (DB + Backend + Frontend) | 6 (DB + 4 Services + Frontend) |
| **Memoria RAM** | ~2GB | ~4GB |
| **Ideal para** | MVP, equipos pequeños | Producción, equipos grandes |

---

## 📁 Estructura del proyecto

```
ProyectoIBStoryCraft/
├── README.md (este archivo)
├── MonoliticArchitecture/
│   ├── README.md (instrucciones detalladas)
│   ├── docker-compose.yml
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── src/
│   └── frontend/
│       └── Proyecto1B-StoryCraft/
│           ├── Dockerfile
│           └── nginx.conf
└── MicroservicesArchitecture/
    ├── README.md (instrucciones detalladas)
    ├── docker-compose.yml
    ├── backendv2/
    │   ├── docker-compose.yml
    │   ├── storycraft-api-gateway/
    │   │   ├── Dockerfile
    │   │   └── .env.example
    │   ├── storycraft-auth-service/
    │   │   ├── Dockerfile
    │   │   └── .env.example
    │   ├── storycraft-stories-service/
    │   │   ├── Dockerfile
    │   │   └── .env.example
    │   └── storycraft-chapters-service/
    │       ├── Dockerfile
    │       └── .env.example
    └── frontend/
        └── Proyecto1B-StoryCraft/
            ├── Dockerfile
            └── nginx.conf
```

---

## 🔧 Configuración

Ambas arquitecturas incluyen archivos `.env.example` con las variables de entorno necesarias. Revisa los README específicos para más detalles.

### Variables clave

**Base de datos (SQL Server)**
```bash
DATABASE_URL=sqlserver://localhost:1433;database=BDD_STORYCRAFT;user=usr_storycraft;password=PASSWORD;encrypt=true;trustServerCertificate=true
```

**Autenticación**
```bash
JWT_SECRET=S3cr3tK3y4JWT
```

---

## 🐛 Solución de problemas comunes

### Docker no arranca
```powershell
# Ver logs
docker-compose logs -f

# Liberar recursos
docker system prune -a
```

### Puerto en uso
```powershell
# Windows
netstat -ano | findstr :3000

# Cambiar puerto en docker-compose.yml
```

### Error de memoria
- Asigna más RAM a Docker Desktop (Configuración > Resources)
- Cierra aplicaciones no necesarias

### Base de datos no conecta
- Espera ~30 segundos para que SQL Server inicie completamente
- Verifica healthcheck: `docker-compose ps`

---

## 📚 Tecnologías utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** (Monolítico) - Framework web
- **NestJS** (Microservicios) - Framework empresarial
- **Prisma** - ORM para SQL Server
- **WebSockets** (ws / socket.io) - Comunicación en tiempo real
- **bcryptjs** - Hash de contraseñas
- **JWT** - Autenticación

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **TypeScript** - Tipado estático
- **React Router** - Navegación
- **Bootstrap 5** - Estilos y componentes
- **Axios** - Cliente HTTP

### Infraestructura
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación
- **Nginx** - Servidor web para frontend
- **SQL Server 2022** - Base de datos

---

## 🎯 ¿Cuál arquitectura elegir?

### Elige **Monolítico** si:
- ✅ Estás empezando el proyecto
- ✅ Tienes un equipo pequeño (1-3 personas)
- ✅ Quieres iterar rápidamente
- ✅ No necesitas escalar partes específicas
- ✅ Prefieres simplicidad sobre flexibilidad

### Elige **Microservicios** si:
- ✅ El proyecto está maduro
- ✅ Tienes múltiples equipos
- ✅ Necesitas escalar servicios específicos
- ✅ Quieres deploy independiente
- ✅ Buscas alta disponibilidad y resiliencia

---

## 📖 Guías de uso

1. **Instalación**: Consulta el README de la arquitectura elegida
2. **Desarrollo local**: Sigue las instrucciones "Opción 2" en cada README
3. **Despliegue**: Usa Docker Compose para ambientes de staging/producción
4. **Pruebas**: Endpoints de healthcheck en cada servicio

---

## 🤝 Contribución

1. Clona el repositorio
2. Elige una arquitectura para trabajar
3. Crea una rama para tu feature: `git checkout -b feature/mi-feature`
4. Haz commits descriptivos
5. Push y crea un Pull Request

---

## 📝 Notas adicionales

- Ambas implementaciones comparten la misma lógica de negocio
- El esquema de base de datos es idéntico en ambas
- Los archivos `.env.example` incluyen valores de desarrollo (cambiar en producción)
- SQL Server puede sustituirse por PostgreSQL/MySQL con ajustes menores en Prisma

---

## 🔗 Enlaces útiles

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de React](https://react.dev/)
- [Documentación de Docker](https://docs.docker.com/)

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la sección "Solución de problemas" del README específico
2. Consulta los logs: `docker-compose logs -f`
3. Verifica requisitos y versiones de software
4. Abre un issue en GitHub con detalles del error

---

**Versión**: 2.0  
**Última actualización**: Octubre 2025  
**Licencia**: MIT