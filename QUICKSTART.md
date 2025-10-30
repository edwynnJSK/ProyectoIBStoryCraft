# 🚀 Inicio Rápido - StoryCraft

## Para los apurados 😊

### Windows (PowerShell)

```powershell
# 1. Clonar el repositorio (si aún no lo has hecho)
git clone https://github.com/edwynnJSK/ProyectoIBStoryCraft.git
cd ProyectoIBStoryCraft

# 2. Elegir UNA de estas opciones:

# Opción A: Microservicios (más completo)
.\run.ps1 micro up
# Espera 2-3 minutos, luego abre http://localhost

# Opción B: Monolítico (más simple)
.\run.ps1 mono up
# Espera 2-3 minutos, luego abre http://localhost
```

### Linux/Mac

```bash
# 1. Clonar el repositorio
git clone https://github.com/edwynnJSK/ProyectoIBStoryCraft.git
cd ProyectoIBStoryCraft

# 2. Dar permisos al script
chmod +x run.sh

# 3. Elegir UNA de estas opciones:

# Opción A: Microservicios
./run.sh micro up

# Opción B: Monolítico
./run.sh mono up
```

---

## ❓ Comandos útiles

```powershell
# Ver logs en tiempo real
.\run.ps1 micro logs

# Ver estado de contenedores
.\run.ps1 micro ps

# Reiniciar servicios
.\run.ps1 micro restart

# Detener todo (mantiene datos)
.\run.ps1 micro down

# Limpiar todo (⚠️ elimina datos)
.\run.ps1 micro clean
```

---

## 🌐 URLs importantes

### Microservicios
- **Frontend**: http://localhost
- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Stories Service**: http://localhost:3002
- **Chapters Service**: http://localhost:3003

### Monolítico
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001

### Base de datos (ambos)
- **Host**: localhost
- **Puerto**: 1433
- **Usuario**: sa
- **Password**: Politecnica1!
- **Database**: BDD_STORYCRAFT

---

## ⚠️ Solución rápida de problemas

### "Docker no está corriendo"
1. Abre Docker Desktop
2. Espera a que inicie completamente
3. Vuelve a intentar

### "Puerto ya en uso"
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3000

# Opción 1: Cierra la aplicación que lo usa
# Opción 2: Cambia el puerto en docker-compose.yml
```

### "Contenedores no arrancan"
```powershell
# Ver qué salió mal
docker-compose logs -f

# Limpiar todo y empezar de nuevo
.\run.ps1 micro clean
.\run.ps1 micro up
```

### "No tengo suficiente RAM"
1. Cierra aplicaciones que no uses
2. En Docker Desktop: Settings > Resources > Aumenta Memory a 4GB
3. Reinicia Docker Desktop

---

## 📚 ¿Necesitas más información?

- **README principal**: Toda la documentación completa
- **Microservicios**: `MicroservicesArchitecture/README.md`
- **Monolítico**: `MonoliticArchitecture/README.md`
- **Changelog**: `CHANGELOG.md` - Lista de todos los cambios

---

## 🎯 Primera vez usando la app

1. Abre http://localhost
2. Haz clic en "Registrarse"
3. Crea una cuenta
4. Inicia sesión
5. Crea tu primera historia
6. ¡Empieza a escribir!

---

## 🛑 ¿Cómo detener todo?

```powershell
# Opción 1: Detener (mantiene los datos)
.\run.ps1 micro down

# Opción 2: Limpiar todo (elimina base de datos también)
.\run.ps1 micro clean
```

---

**¿Problemas?** Revisa los README detallados o los logs con `.\run.ps1 [arch] logs`
