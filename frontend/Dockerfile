# Etapa de build
FROM node:18-alpine AS production
WORKDIR /app

# Copiar archivos de dependencias primero para mejorar el caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar el resto de los archivos
COPY . .

# Importante: Next.js necesita variables de entorno NEXT_PUBLIC_* durante el build
# Esto permitirá usar las variables en el contenedor
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_API_URL

# Construir la aplicación
RUN npm run build

# Etapa final (de producción)
FROM node:18-alpine AS final
WORKDIR /app

# Copiar los archivos necesarios desde la etapa de build
COPY --from=production /app/.next ./.next
COPY --from=production /app/node_modules ./node_modules
COPY --from=production /app/package.json ./
COPY --from=production /app/next.config.js ./

# Definir el puerto correcto (3100 en lugar de 3000)
EXPOSE 3100
ENV PORT=3100

# Comando de inicio
CMD ["npm", "start"]
