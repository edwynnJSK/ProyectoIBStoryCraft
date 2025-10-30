FROM node:lts-alpine

# directorio de trabajo
WORKDIR /usr/src/app

# Copiar e instalar las dependencias 
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --silent

# Copiar Prisma y sincronizar esquema con la BD existente
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar el resto de los archivos del proyecto
COPY . .

# Compilar el proyecto con el CLI local de NestJS
RUN npx nest build

# Eliminar las dependencias de desarrollo para optimizar la imagen
RUN npm prune --production

# Ajustar permisos y definir el usuario
RUN chown -R node:node /usr/src/app
USER node

# Exponer el puerto de la aplicación
EXPOSE 3003

# Ejecutar la aplicación desde la carpeta 'dist'
CMD ["node", "dist/main"]