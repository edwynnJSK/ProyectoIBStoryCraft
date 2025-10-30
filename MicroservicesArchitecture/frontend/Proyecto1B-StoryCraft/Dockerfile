# Etapa 1: Build de la aplicación
FROM node:lts-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Limpiar referencia circular en package.json y luego instalar
RUN sed -i '/"proyecto1b-storycraft": "file:"/d' package.json || true && \
    npm install

# Copiar el resto de archivos (node_modules ya está excluido por .dockerignore)
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servir la aplicación con nginx
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
