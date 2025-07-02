# Dockerfile para el backend de Panel EMB
FROM node:18-alpine AS development

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=development

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3001

# Comando por defecto para desarrollo
CMD ["npm", "run", "start:dev"]

# Etapa de construcción para producción
FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Crear usuario no root por seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

# Copiar package.json para instalar solo dependencias de producción
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar archivos construidos desde la etapa de build
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist

# Cambiar al usuario no root
USER nestjs

# Exponer puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Comando para producción
CMD ["node", "dist/main"]
