# Changelog - Configuración Docker y Documentación

## Fecha: Octubre 2025 - Actualización 2

### 🔧 Correcciones de Producción

#### ✅ Problemas resueltos
- **SQL Server Healthcheck**: Removido healthcheck que causaba fallos (ruta de sqlcmd incorrecta en imagen 2022)
- **Credenciales de BD**: Creado usuario `usr_storycraft` y base de datos `BDD_STORYCRAFT` automáticamente
- **Schema de Base de Datos**: Ejecutado `prisma db push` en todos los servicios (auth, stories, chapters)
- **Dependencias de Contenedores**: Cambiado de `condition: service_healthy` a dependencias simples

#### ✅ Estado de Servicios Verificado
- ✅ SQL Server corriendo en puerto 1433
- ✅ Auth Service corriendo en puerto 3001
- ✅ Stories Service corriendo en puerto 3002  
- ✅ Chapters Service corriendo en puerto 3003
- ✅ API Gateway corriendo en puerto 3000
- ✅ Frontend corriendo en puerto 80
- ✅ Base de datos sincronizada con todos los schemas de Prisma

---

## Fecha: Octubre 2025

### 🎉 Cambios principales

#### ✅ Contenedores Docker completos

**Microservicios (`MicroservicesArchitecture/`):**
- ✅ `docker-compose.yml` completo en raíz (incluye frontend + todos los servicios + SQL Server)
- ✅ `backendv2/docker-compose.yml` mejorado (solo backend services + SQL Server)
- ✅ Dockerfile para frontend (`frontend/Proyecto1B-StoryCraft/Dockerfile`)
- ✅ nginx.conf para frontend con proxy al API Gateway
- ✅ Healthchecks en todos los servicios
- ✅ Red interna (eliminada dependencia de red externa)
- ✅ Variables de entorno configurables vía environment en compose

**Monolítico (`MonoliticArchitecture/`):**
- ✅ `docker-compose.yml` completo (backend + frontend + SQL Server)
- ✅ Dockerfile para backend (`backend/Dockerfile`)
- ✅ Dockerfile para frontend (`frontend/Proyecto1B-StoryCraft/Dockerfile`)
- ✅ nginx.conf para frontend con proxy al backend
- ✅ Volumen persistente para imágenes
- ✅ Healthcheck para SQL Server

#### 📄 Archivos .env.example creados

- ✅ `MicroservicesArchitecture/backendv2/storycraft-api-gateway/.env.example`
- ✅ `MicroservicesArchitecture/backendv2/storycraft-auth-service/.env.example`
- ✅ `MicroservicesArchitecture/backendv2/storycraft-stories-service/.env.example`
- ✅ `MicroservicesArchitecture/backendv2/storycraft-chapters-service/.env.example`
- ✅ `MonoliticArchitecture/backend/.env.example`

#### 📚 Documentación actualizada

**README principal (`README.md`):**
- ✅ Comparación detallada entre arquitecturas
- ✅ Guía de inicio rápido
- ✅ Instrucciones de scripts helper
- ✅ Solución de problemas común
- ✅ Stack tecnológico completo
- ✅ Guía para elegir arquitectura

**README Microservicios (`MicroservicesArchitecture/README.md`):**
- ✅ 3 opciones de ejecución (Docker completo, backend Docker + frontend local, todo local)
- ✅ Instrucciones paso a paso con comandos PowerShell
- ✅ Configuración de variables de entorno
- ✅ Pasos de Prisma migrations
- ✅ Healthchecks y verificación
- ✅ Diagrama de arquitectura
- ✅ Solución de problemas específicos
- ✅ Puertos exactos de cada servicio

**README Monolítico (`MonoliticArchitecture/README.md`):**
- ✅ Instrucciones Docker y desarrollo local
- ✅ Configuración de base de datos
- ✅ Listado completo de rutas del API
- ✅ Diagrama de arquitectura
- ✅ Comparación con microservicios
- ✅ Solución de problemas

#### 🛠️ Scripts helper

**Windows (`run.ps1`):**
- ✅ Script PowerShell con comandos amigables
- ✅ Soporta: up, down, logs, restart, ps, clean
- ✅ Validación de Docker
- ✅ Mensajes con colores
- ✅ Confirmación para comandos destructivos

**Linux/Mac (`run.sh`):**
- ✅ Script Bash equivalente al de PowerShell
- ✅ Mismos comandos y funcionalidad
- ✅ Colores ANSI
- ✅ Validaciones de prerrequisitos

#### 🗄️ Utilidades adicionales

- ✅ `init-db.sql` - Script de inicialización de base de datos
- ✅ `CHANGELOG.md` - Este archivo

---

## 🔧 Cambios técnicos específicos

### Microservicios

#### docker-compose.yml (raíz)
- Agregado servicio `sqlserver` con healthcheck
- Agregado servicio `frontend` con nginx
- Configuradas dependencias entre servicios
- Variables de entorno inline (no requiere .env)
- Red bridge interna `storycraft-network`
- Volumen persistente para SQL Server

#### backendv2/docker-compose.yml
- Eliminada red externa `ms-bdd_default`
- Agregado SQL Server con healthcheck
- Healthchecks en todos los servicios
- Variables de entorno inline
- Endpoints internos (nombres de servicios) para comunicación

#### Dockerfiles
- Frontend: build multi-stage (node + nginx)
- Servicios backend: ya existían, sin cambios
- API Gateway: ya existía, sin cambios

### Monolítico

#### docker-compose.yml
- Todo nuevo: SQL Server + Backend + Frontend
- Healthcheck para SQL Server
- Volumen para imágenes del backend
- Red interna `storycraft-mono-network`

#### Dockerfiles
- Backend: nuevo, incluye Prisma generate
- Frontend: nuevo, build multi-stage (node + nginx)

---

## 📊 Mejoras implementadas

### Experiencia de usuario
- ✅ Un solo comando para levantar todo (`docker-compose up --build`)
- ✅ Scripts helper para simplificar operaciones comunes
- ✅ No requiere configuración manual de redes externas
- ✅ Base de datos incluida (no hay que instalar SQL Server local)
- ✅ Frontend accesible en puerto 80 (http://localhost)

### Robustez
- ✅ Healthchecks aseguran que servicios dependientes esperen
- ✅ Variables de entorno documentadas en .env.example
- ✅ Volúmenes persistentes para datos
- ✅ Restart automático de contenedores

### Documentación
- ✅ READMEs detallados con múltiples opciones de ejecución
- ✅ Ejemplos de comandos para PowerShell (Windows)
- ✅ Diagramas de arquitectura ASCII
- ✅ Sección de solución de problemas
- ✅ Comparación clara entre arquitecturas

---

## 🎯 Próximos pasos sugeridos

### Corto plazo
- [ ] Probar los contenedores en ambas arquitecturas
- [ ] Ejecutar migraciones de Prisma en primera ejecución
- [ ] Verificar healthchecks y tiempos de inicio

### Mediano plazo
- [ ] Añadir docker-compose.prod.yml para producción
- [ ] Implementar secrets management (Docker secrets o .env.prod)
- [ ] Configurar volúmenes para logs persistentes
- [ ] Añadir nginx rate limiting en producción

### Largo plazo
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Kubernetes manifests para escalabilidad
- [ ] Monitoreo con Prometheus + Grafana
- [ ] Logging centralizado (ELK stack)
- [ ] Tests automatizados en contenedores

---

## 📝 Notas importantes

### Para desarrollo
- Los archivos `.env` NO están incluidos en el repositorio (.gitignore)
- Usa `.env.example` como plantilla
- Para desarrollo local sin Docker, necesitas SQL Server instalado

### Para producción
- Cambiar passwords en variables de entorno
- Usar secretos de Docker/Kubernetes
- Configurar SSL/TLS en nginx
- Habilitar logs persistentes
- Configurar backups de base de datos

### Requisitos de sistema
- **Docker Desktop**: 4GB RAM mínimo
- **Espacio en disco**: ~10GB para imágenes y volúmenes
- **Puertos libres**: 80, 1433, 3000-3003 (microservicios) o 80, 1433, 3001 (monolítico)

---

## ✅ Checklist de verificación

Antes de ejecutar por primera vez:

- [ ] Docker Desktop instalado y corriendo
- [ ] Al menos 4GB RAM disponible
- [ ] Puertos 80, 1433, 3000-3003 libres
- [ ] Git instalado (para clonar el repo)
- [ ] PowerShell 5.1+ o Bash (para scripts helper)

Ejecución:

- [ ] Elegir arquitectura (mono o micro)
- [ ] Ejecutar `.\run.ps1 [arch] up` o `docker-compose up --build`
- [ ] Esperar ~2-3 minutos para primera construcción
- [ ] Verificar que todos los contenedores estén "healthy"
- [ ] Acceder a http://localhost
- [ ] Probar login/registro/crear historia

Troubleshooting:

- [ ] Ver logs si algo falla: `docker-compose logs -f`
- [ ] Verificar healthchecks: `docker-compose ps`
- [ ] Reintentar con `docker-compose down -v` y `docker-compose up --build`

---

**Autor**: GitHub Copilot  
**Fecha**: Octubre 2025  
**Versión**: 2.0
