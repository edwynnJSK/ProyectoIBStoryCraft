# MonoliticArchitecture — StoryCraft (Monolítico)

Este directorio contiene la implementación monolítica (backend + frontend en el mismo repositorio). El backend maneja autenticación, historias, capítulos y WebSockets para chat en tiempo real.

## 📁 Estructura clave
- `backend/` — Servidor Node.js + Express (puerto 3001)
  - `src/index.js` — Punto de entrada
  - `src/routes/` — Rutas de API
  - `src/controllers/` — Lógica de negocio
  - `src/repositories/` — Acceso a datos (Prisma)
  - `src/websocket.js` — Chat en tiempo real
- `frontend/Proyecto1B-StoryCraft/` — Cliente React + Vite
- `docker-compose.yml` — Orquestación completa (backend + frontend + SQL Server)

## ⚙️ Requisitos
- **Docker** >= 20 y **docker-compose** (recomendado)
- **Node.js** >= 16 y **npm** (solo si ejecutas sin Docker)
- Al menos **2GB de RAM** disponible para contenedores

---

## 🚀 Opción 1: Ejecutar TODO con Docker (Recomendado)

Desde la raíz de `MonoliticArchitecture`:

```powershell
cd MonoliticArchitecture
docker-compose up --build
```

Este comando:
- ✅ Levanta SQL Server 2022 (puerto 1433)
- ✅ Construye y ejecuta el backend (puerto 3001)
- ✅ Construye y ejecuta el frontend en Nginx (puerto 80)
- ✅ Configura redes y volúmenes automáticamente

### Acceder a la aplicación

Una vez levantado (~2 minutos la primera vez):

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **SQL Server**: localhost:1433 (usuario: `sa`, password: `Politecnica1!`)

### Comandos útiles

```powershell
# Ver logs
docker-compose logs -f

# Ver logs del backend
docker-compose logs -f backend

# Parar servicios (mantiene datos)
docker-compose down

# Parar y eliminar todo
docker-compose down -v

# Reiniciar un servicio
docker-compose restart backend

# Ver estado
docker-compose ps
```

---

## 🔧 Opción 2: Desarrollo local (sin Docker)

### 1) Backend

#### Configurar variables de entorno

```powershell
cd MonoliticArchitecture\backend
copy .env.example .env
```

Edita `.env` con tu configuración de SQL Server local:
```bash
PORT=3001
DATABASE_URL=sqlserver://localhost:1433;database=BDD_STORYCRAFT;user=usr_storycraft;password=TU_PASSWORD;encrypt=true;trustServerCertificate=true
```

#### Ejecutar migraciones de Prisma

```powershell
npm install
npx prisma generate --schema=src/prisma/schema.prisma
npx prisma db push --schema=src/prisma/schema.prisma
```

#### Iniciar el servidor

```powershell
npm start
# o para desarrollo con auto-reload:
npm run dev
```

El backend estará en `http://localhost:3001`.

### 2) Frontend

En otra terminal:

```powershell
cd MonoliticArchitecture\frontend\Proyecto1B-StoryCraft
npm install
npm run dev
```

Vite servirá en `http://localhost:5173`.

---

## 🔐 Variables de entorno

### Backend (.env)
```bash
PORT=3001
DATABASE_URL=sqlserver://localhost:1433;database=BDD_STORYCRAFT;user=usr_storycraft;password=PASSWORD;encrypt=true;trustServerCertificate=true
```

**Nota para Docker**: Cambia `localhost` por `sqlserver` en la `DATABASE_URL`.

---

## 🗄️ Base de datos

### Con Docker (automático)
SQL Server se levanta automáticamente con:
- Usuario: `sa`
- Password: `Politecnica1!`
- Puerto: 1433
- Base de datos: `BDD_STORYCRAFT` (crear manualmente o con Prisma)

### Sin Docker (manual)
1. Instala SQL Server localmente
2. Crea la base de datos `BDD_STORYCRAFT`
3. Crea usuario `usr_storycraft` con permisos
4. Ejecuta migraciones de Prisma

---

## 🌐 Rutas del API

El backend expone las siguientes rutas principales:

### Autenticación
- `POST /api/login` — Iniciar sesión
- `POST /api/register` — Registrar usuario
- `POST /api/logout` — Cerrar sesión

### Usuarios
- `GET /api/users` — Listar usuarios
- `GET /api/users/:id` — Obtener usuario
- `PUT /api/users/:id` — Actualizar usuario
- `DELETE /api/users/:id` — Eliminar usuario

### Historias
- `GET /api/stories` — Listar historias
- `GET /api/stories/:id` — Obtener historia
- `POST /api/stories` — Crear historia
- `PUT /api/stories/:id` — Actualizar historia
- `DELETE /api/stories/:id` — Eliminar historia

### Capítulos
- `GET /api/chapters` — Listar capítulos
- `GET /api/chapters/:id` — Obtener capítulo
- `POST /api/chapters` — Crear capítulo
- `PUT /api/chapters/:id` — Actualizar capítulo
- `DELETE /api/chapters/:id` — Eliminar capítulo

### Imágenes
- `GET /images/:filename` — Servir imágenes estáticas

### WebSocket (Chat)
- Conectar a `ws://localhost:3001` para chat en tiempo real

---

## 🐛 Solución de problemas

### Contenedores no arrancan
```powershell
docker-compose logs -f
```

### Error de conexión a base de datos
- Verifica que SQL Server esté corriendo: `docker-compose ps`
- Revisa la `DATABASE_URL` en `.env`
- Espera a que el healthcheck de SQL Server esté "healthy"

### Errores de Prisma
```powershell
cd backend
npx prisma generate --schema=src/prisma/schema.prisma
npx prisma db push --schema=src/prisma/schema.prisma
```

### Puerto en uso
```powershell
netstat -ano | findstr :3001
# Mata el proceso o cambia el puerto en .env
```

### Frontend no se conecta al backend
- Docker completo: nginx proxy maneja `/api` automáticamente
- Desarrollo local: verifica que el frontend apunte a `http://localhost:3001`

### Imágenes no se cargan
- Verifica que la carpeta `backend/src/images/` tenga permisos de escritura
- En Docker, usa volumen: `docker-compose.yml` ya incluye `backend-images`

---

## 📚 Arquitectura

```
Frontend (Nginx:80)
       ↓
Backend (Express:3001) → SQL Server:1433
       ↓
WebSocket (Chat)
```

Simple y directo: un servidor maneja todo (API + WebSockets + servir imágenes).

---

## ✅ Verificar funcionamiento

```powershell
# Probar el backend
curl http://localhost:3001

# Ver historias (ejemplo)
curl http://localhost:3001/api/stories

# Frontend
# Abre http://localhost en tu navegador
```

---

## 🚀 Siguientes pasos

- Añadir tests unitarios e integración
- Implementar logging estructurado
- Configurar CI/CD
- Añadir rate limiting
- Implementar caché (Redis)

---

## 📞 Diferencias con Microservicios

| Aspecto | Monolítico | Microservicios |
|---------|------------|----------------|
| **Complejidad** | Baja | Alta |
| **Deploy** | Todo junto | Servicios independientes |
| **Escalabilidad** | Vertical (más recursos) | Horizontal (más instancias) |
| **Desarrollo** | Más rápido inicialmente | Más lento pero más flexible |
| **Debugging** | Más fácil | Más complejo (logs distribuidos) |
| **Tecnologías** | Una stack | Múltiples stacks posibles |

**¿Cuándo usar monolítico?**
- Proyectos pequeños/medianos
- Equipo pequeño
- MVP o prototipo
- Requisitos bien definidos

**¿Cuándo usar microservicios?**
- Proyectos grandes/complejos
- Equipos múltiples
- Necesidad de escalar partes específicas
- Diferentes tecnologías por dominio

---

## 📝 Notas adicionales

### Imágenes
El backend sirve imágenes desde `src/images/`. En Docker, usa un volumen para persistir las imágenes entre reinicios.

### WebSockets
El chat usa WebSockets (puerto 3001). El frontend se conecta automáticamente.

### Autenticación
Revisa `frontend/src/context/AuthContext.tsx` para ver cómo se manejan tokens y sesiones.

---

**Tip**: Para desarrollo rápido, usa `docker-compose up --build` y tendrás todo listo en minutos. Solo ejecuta localmente si necesitas depurar código específico.
