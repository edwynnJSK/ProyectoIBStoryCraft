# 🎨 Guía de Estilos - StoryCraft

## Paleta de Colores

La aplicación utiliza un esquema de colores moderno y profesional definido en `index.css`:

- **Primario**: `#FF500A` (Naranja vibrante)
- **Primario Oscuro**: `#E14508`
- **Secundario**: `#2C3E50` (Azul oscuro)
- **Acento**: `#3498DB`
- **Éxito**: `#27AE60`
- **Advertencia**: `#F39C12`
- **Peligro**: `#E74C3C`

## Archivos de Estilos

### 1. `index.css`
Estilos globales y variables CSS:
- Variables de color
- Tipografía base
- Botones globales
- Formularios
- Cards
- Modales
- Scrollbar personalizado
- Animaciones

### 2. `Auth.css`
Estilos para Login y SignUp:
- Fondo animado con gradiente
- Caja de autenticación con sombras
- Formularios estilizados
- Animaciones de entrada
- Responsive design

### 3. `Dashboard.css`
Estilos para el Dashboard:
- Header del dashboard
- Toolbar con botones
- Grid de historias
- Cards de historias con hover
- Modales de detalles
- Estados de carga y vacío
- Dropdown de usuario

### 4. `Chat.css`
Estilos para el chat flotante:
- Icono flotante con animación pulse
- Ventana de chat moderna
- Mensajes con diseño de chat moderno
- Input estilizado
- Scrollbar personalizado

### 5. `Modal.css`
Estilos para modales de creación y edición:
- Overlay con blur
- Modales con animaciones
- Formularios dentro de modales
- Preview de imágenes
- Botones de acción

### 6. `StoryDetailsModal.css`
Estilos específicos para el modal de detalles de historia:
- Header con gradiente
- Botón de cierre animado
- Grid de información
- Lista de capítulos

### 7. `ChaptersList.css`
Estilos para la lista de capítulos:
- Grid responsive
- Cards de capítulos
- Hover effects
- Estado vacío

## Características de Diseño

### Animaciones
- **fadeIn**: Aparición suave de elementos
- **slideUp**: Deslizamiento desde abajo
- **slideDown**: Deslizamiento desde arriba
- **pulse**: Animación pulsante continua
- **spin**: Rotación para spinners de carga

### Efectos Hover
- Todos los botones tienen efecto de elevación (`translateY(-2px)`)
- Cards se elevan y aumentan sombra al hacer hover
- Imágenes tienen efecto zoom suave

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - 480px: Móviles pequeños
  - 576px: Móviles grandes
  - 768px: Tablets
  - 992px: Desktop

### Sombras
- `--shadow`: `0 2px 10px rgba(0, 0, 0, 0.1)`
- `--shadow-hover`: `0 4px 20px rgba(0, 0, 0, 0.15)`

### Border Radius
- Inputs y botones: `8px - 12px`
- Cards: `12px - 15px`
- Modales: `20px`
- Botones circulares: `50%`

## Componentes Actualizados

### LoginForm
- Fondo con gradiente animado
- Logo circular con gradiente
- Inputs con focus mejorado
- Botón con gradiente y hover effect

### SignUp
- Mismo diseño que LoginForm
- Requisitos de contraseña visibles
- Validación en tiempo real
- Mensajes de error/éxito animados

### Dashboard
- Header con título en gradiente
- Toolbar con botones estilizados
- Grid de historias responsive
- Estados de carga y error mejorados

### CreateStory
- Modal moderno con header en gradiente
- Preview de imagen mejorado
- Formulario bien organizado
- Iconos en opciones de género

### ChaptersList
- Grid responsive de capítulos
- Cards con imagen y título
- Contador de capítulos
- Estado vacío ilustrado

### Chat
- Icono flotante con animación
- Ventana de chat moderna
- Mensajes con diseño tipo WhatsApp
- Input con border radius alto

## Uso de Clases Utilitarias

```css
.text-gradient        /* Texto con gradiente */
.fade-in             /* Animación de aparición */
.slide-in-left       /* Deslizar desde izquierda */
.slide-in-right      /* Deslizar desde derecha */
.slide-in-bottom     /* Deslizar desde abajo */
.shadow-sm           /* Sombra pequeña */
.shadow-lg           /* Sombra grande */
.rounded-lg          /* Border radius grande */
```

## Mejores Prácticas

1. **Consistencia**: Usa las variables CSS definidas en `index.css`
2. **Animaciones**: Mantén las animaciones sutiles (0.3s - 0.5s)
3. **Accesibilidad**: Mantén contraste adecuado en textos
4. **Responsive**: Prueba en diferentes tamaños de pantalla
5. **Performance**: Usa `transform` en lugar de `top/left` para animaciones

## Próximas Mejoras Sugeridas

- [ ] Dark mode toggle
- [ ] Temas personalizables
- [ ] Más animaciones de transición entre páginas
- [ ] Skeleton loaders
- [ ] Toast notifications
- [ ] Mejoras de accesibilidad (ARIA labels)

---

**Desarrollado con ❤️ para StoryCraft**
