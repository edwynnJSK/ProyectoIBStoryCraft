FROM node:lts-alpine

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar Prisma schema y generar cliente
COPY src/prisma ./src/prisma/
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Copiar el resto de la aplicación
COPY . .

# Crear directorio para imágenes
RUN mkdir -p src/images && chmod -R 777 src/images

# Ajustar permisos
RUN chown -R node:node /usr/src/app
USER node

# Exponer el puerto
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
