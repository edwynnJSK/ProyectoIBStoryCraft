# MicroservicesArchitecture — StoryCraft (Microservicios)

Este directorio contiene la versión basada en microservicios: un API Gateway (NestJS), servicios independientes (Auth, Stories, Chapters) y el frontend (cliente Vite + React). A continuación hay instrucciones completas para ejecutar con Docker (rápido) o en local servicio por servicio.

## 📁 Estructura clave
- `backendv2/` — Microservicios backend:
  - `storycraft-api-gateway/` — API Gateway (puerto 3000)
  - `storycraft-auth-service/` — Servicio de autenticación (puerto 3001)
  - `storycraft-stories-service/` — Servicio de historias (puerto 3002)
  - `storycraft-chapters-service/` — Servicio de capítulos (puerto 3003)
- `frontend/Proyecto1B-StoryCraft/` — Cliente React + Vite
- `docker-compose.yml` — Orquestación completa (todos los servicios + SQL Server + frontend)

## ⚙️ Requisitos
- **Docker** >= 20 y **docker-compose** (recomendado para ejecución rápida)
- **Node.js** >= 16 y **npm** (solo si ejecutas servicios localmente sin Docker)
- Al menos **4GB de RAM** disponible para los contenedores

---

## 🚀 Opción 1: Ejecutar TODO con Docker (Recomendado)

Esta es la forma más rápida de levantar toda la aplicación (backend + frontend + base de datos) con un solo comando.

### Paso 1: Levantar todos los servicios

Desde la raíz de `MicroservicesArchitecture`:

```powershell
cd MicroservicesArchitecture
docker-compose up --build
```

Este comando:
- ✅ Levanta SQL Server 2022 (puerto 1433)
- ✅ Construye y ejecuta los 4 microservicios (Auth, Stories, Chapters, API Gateway)
- ✅ Construye y ejecuta el frontend en Nginx (puerto 80)
- ✅ Configura automáticamente las redes y dependencias entre servicios

### Paso 2: Acceder a la aplicación

Una vez que todos los contenedores estén corriendo (tarda ~2-3 minutos la primera vez):

- **Frontend**: http://localhost
- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Stories Service**: http://localhost:3002
- **Chapters Service**: http://localhost:3003
- **SQL Server**: localhost:1433 (usuario: `sa`, password: `Politecnica1!`)

### Comandos útiles de Docker

```powershell
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api-gateway

# Parar todos los servicios (mantiene los datos)
docker-compose down

# Parar y eliminar todo (incluyendo volúmenes/datos)
docker-compose down -v

# Reconstruir un servicio específico
docker-compose up --build api-gateway

# Ver estado de los contenedores
docker-compose ps
```

---

## 🔧 Opción 2: Ejecutar solo backend con Docker

Si quieres desarrollar el frontend localmente pero usar Docker para los servicios backend:

### Paso 1: Levantar solo los servicios backend

```powershell
cd MicroservicesArchitecture\backendv2
docker-compose up --build
```

Esto levanta:
- SQL Server
- Auth Service (3001)
- Stories Service (3002)
- Chapters Service (3003)
- API Gateway (3000)

### Paso 2: Ejecutar frontend en modo desarrollo

En otra terminal:

```powershell
cd MicroservicesArchitecture\frontend\Proyecto1B-StoryCraft
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173` y se conectará al API Gateway en `http://localhost:3000`.

---

## 💻 Opción 3: Ejecutar servicios individualmente (sin Docker)

### Prerequisitos
1. **SQL Server** instalado y corriendo localmente en puerto 1433
2. Crear base de datos `BDD_STORYCRAFT` y usuario `usr_storycraft`
3. **Node.js** >= 16 instalado

### Configurar variables de entorno

Cada servicio ya incluye `.env.example`. Copia y ajusta según necesites:

```powershell
# Auth Service
cd MicroservicesArchitecture\backendv2\storycraft-auth-service
copy .env.example .env

# Stories Service
cd ..\storycraft-stories-service
copy .env.example .env

# Chapters Service
cd ..\storycraft-chapters-service
copy .env.example .env

# API Gateway
cd ..\storycraft-api-gateway
copy .env.example .env
```

### Ejecutar migraciones de Prisma

Para servicios con base de datos (Auth, Stories, Chapters):

```powershell
cd MicroservicesArchitecture\backendv2\storycraft-auth-service
npm install
npx prisma generate
npx prisma db push
```

Repite para `storycraft-stories-service` y `storycraft-chapters-service`.

### Iniciar servicios (abre 5 terminales)

**Terminal 1 - Auth:**
```powershell
cd MicroservicesArchitecture\backendv2\storycraft-auth-service
npm run start:dev
```

**Terminal 2 - Stories:**
```powershell
cd MicroservicesArchitecture\backendv2\storycraft-stories-service
npm run start:dev
```

**Terminal 3 - Chapters:**
```powershell
cd MicroservicesArchitecture\backendv2\storycraft-chapters-service
npm run start:dev
```

**Terminal 4 - API Gateway:**
```powershell
cd MicroservicesArchitecture\backendv2\storycraft-api-gateway
npm run start:dev
```

**Terminal 5 - Frontend:**
```powershell
cd MicroservicesArchitecture\frontend\Proyecto1B-StoryCraft
npm run dev
```

---

## 🔐 Variables de entorno

### API Gateway
```bash
PORT=3000
AUTH_ENDPOINT=http://localhost:3001      # usa auth-service en Docker
STORIES_ENDPOINT=http://localhost:3002   # usa stories-service en Docker
CHAPTERS_ENDPOINT=http://localhost:3003  # usa chapters-service en Docker
JWT_SECRET=S3cr3tK3y4JWT
```

### Services (Auth/Stories/Chapters)
```bash
PORT=3001  # 3001 auth, 3002 stories, 3003 chapters
DATABASE_URL=sqlserver://localhost:1433;database=BDD_STORYCRAFT;user=usr_storycraft;password=PASSWORD;encrypt=true;trustServerCertificate=true
JWT_SECRET=S3cr3tK3y4JWT  # solo auth
```

---

## 🐛 Solución de problemas

### Contenedores no arrancan
```powershell
docker-compose logs -f
docker-compose logs -f api-gateway  # servicio específico
```

### Error de red externa
✅ Ya solucionado. El nuevo `docker-compose.yml` no requiere redes externas.

### Errores de Prisma
```powershell
npx prisma generate
npx prisma db push
```

### Puerto en uso
```powershell
netstat -ano | findstr :3000
# Cambiar puerto en docker-compose.yml o .env
```

### Frontend no encuentra API
- Docker completo: nginx proxy interno maneja rutas `/api`
- Vite dev: verifica URL base en `src/api/*` apunte a `http://localhost:3000`

---

## 📚 Arquitectura

```
Frontend (Nginx:80) → API Gateway:3000 → Auth:3001 ↘
                                        → Stories:3002  → SQL Server:1433
                                        → Chapters:3003 ↗
```

---

## ✅ Verificar funcionamiento

```powershell
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # Stories
curl http://localhost:3003/health  # Chapters
```

---

## 🚀 Siguientes pasos

- Configurar CI/CD
- Añadir tests (unit + e2e)
- Implementar monitoring (Prometheus/Grafana)
- Rate limiting y seguridad adicional
