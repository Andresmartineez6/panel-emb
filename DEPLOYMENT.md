# 🚀 Guía de Despliegue - Panel EMB

## Resumen del Despliegue

El **Panel EMB** está ahora completamente configurado con:

### ✅ Funcionalidades Implementadas

1. **🔐 Sistema de Autenticación Seguro**
   - Login obligatorio con usuarios específicos de EMB
   - PostgreSQL para almacenamiento seguro de credenciales
   - JWT + cookies HTTP-only para sesiones
   - Middleware de protección de rutas

2. **🎨 Diseño Premium con GSAP**
   - Página de carga espectacular con animaciones
   - Login page con efectos visuales impresionantes
   - Dashboard con partículas flotantes y transiciones suaves
   - Tema oscuro elegante con acentos dorados (#d4af37)

3. **🏗️ Arquitectura Completa**
   - Frontend Next.js 14 con App Router
   - Backend NestJS con arquitectura hexagonal
   - PostgreSQL como base de datos principal
   - Redis para cache y sesiones
   - Docker Compose para orquestación

## 📋 Pasos para Despliegue en Servidor

### 1. Preparación del Servidor (VPS Ubuntu 22.04)

```bash
# Conectar al servidor
ssh root@37.59.118.66

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker si no está instalado
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose -y

# Verificar instalación
docker --version
docker-compose --version
```

### 2. Subir Código al Servidor

```bash
# Opción 1: Usando Git (recomendado)
git clone https://github.com/Andresmartineez6/panel-emb.git
cd panel-emb

# Opción 2: Usando rsync desde local
rsync -avz --exclude node_modules --exclude .git /local/path/panel-emb/ root@37.59.118.66:/root/panel-emb/
```

### 3. Configurar Variables de Entorno

```bash
# En el servidor, crear archivo .env
cd /root/panel-emb
cp .env.example .env
nano .env
```

**Configuración crítica en `.env`:**

```env
# PostgreSQL (Producción)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=panel_emb
DB_USER=panel_emb_user
DB_PASSWORD=b#sHBEj9JrovK_DB

# JWT Seguro
JWT_SECRET=emb_super_secret_jwt_key_2024_panel_secure
JWT_EXPIRES_IN=24h

# URLs de Producción
NEXT_PUBLIC_API_URL=https://panel.embdevs.com/api
API_BASE_URL=https://panel.embdevs.com/api
CORS_ORIGIN=https://panel.embdevs.com

# Configuración de red
PORT=3000
NODE_ENV=production
```

### 4. Desplegar con Docker

```bash
# Construir y desplegar todos los servicios
docker-compose -f docker-compose.prod.yml up --build -d

# Verificar que los servicios estén corriendo
docker-compose -f docker-compose.prod.yml ps

# Ver logs para verificar funcionamiento
docker-compose -f docker-compose.prod.yml logs -f
```

### 5. Configurar Nginx (Si no está configurado)

```bash
# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/panel-emb
```

**Contenido del archivo nginx:**

```nginx
server {
    listen 80;
    server_name panel.embdevs.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name panel.embdevs.com;

    ssl_certificate /etc/letsencrypt/live/panel.embdevs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/panel.embdevs.com/privkey.pem;

    # Configuración SSL mejorada
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (NestJS)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/panel-emb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtener certificado SSL
sudo certbot --nginx -d panel.embdevs.com
```

## 🔍 Verificación del Despliegue

### 1. Verificar Servicios Docker

```bash
# Ver estado de contenedores
docker ps

# Deberían aparecer:
# - postgres (Puerto 5432)
# - redis (Puerto 6379) 
# - panel-emb-backend (Puerto 3000)
# - panel-emb-frontend (Puerto 3100)
```

### 2. Verificar Base de Datos

```bash
# Conectar a PostgreSQL
docker exec -it postgres psql -U panel_emb_user -d panel_emb

# Verificar tablas
\dt

# Verificar usuarios
SELECT username, active FROM users;

# Salir
\q
```

### 3. Probar Endpoints

```bash
# Health check del backend
curl https://panel.embdevs.com/api/

# Test de login (debe fallar sin credenciales)
curl -X POST https://panel.embdevs.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

## 🌐 Acceso al Sistema

Una vez desplegado, el sistema estará disponible en:

**URL Principal**: https://panel.embdevs.com

### Flujo de Usuario:
1. **Página de Carga**: Animación automática por 3 segundos
2. **Redirección al Login**: Formulario premium con GSAP
3. **Autenticación**: Validación contra PostgreSQL
4. **Dashboard**: Acceso a funcionalidades principales

### Credenciales de Acceso:
- **Usuarios válidos**: `andresemb`, `aguayoemb`, `alejandroemb`, `pepeemb`
- **Contraseña compartida**: `b#sHBEj9JrovK`

## 🛠️ Comandos de Mantenimiento

### Reiniciar Servicios

```bash
# Reiniciar todos los servicios
docker-compose -f docker-compose.prod.yml restart

# Reiniciar solo un servicio específico
docker-compose -f docker-compose.prod.yml restart frontend
docker-compose -f docker-compose.prod.yml restart backend
```

### Ver Logs

```bash
# Logs de todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Logs de un servicio específico
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Backup de Base de Datos

```bash
# Crear backup
docker exec postgres pg_dump -U panel_emb_user panel_emb > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i postgres psql -U panel_emb_user panel_emb < backup_20241203_235959.sql
```

### Actualizar Aplicación

```bash
# Parar servicios
docker-compose -f docker-compose.prod.yml down

# Actualizar código
git pull origin main

# Reconstruir y desplegar
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🚨 Solución de Problemas

### Error: No se puede conectar a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Ver logs de PostgreSQL
docker-compose -f docker-compose.prod.yml logs postgres

# Reiniciar PostgreSQL
docker-compose -f docker-compose.prod.yml restart postgres
```

### Error: Frontend no carga

```bash
# Verificar variables de entorno
docker-compose -f docker-compose.prod.yml exec frontend env | grep NEXT_PUBLIC

# Ver logs del frontend
docker-compose -f docker-compose.prod.yml logs frontend

# Verificar puerto
netstat -tlnp | grep 3100
```

### Error: Backend API no responde

```bash
# Verificar backend
curl http://localhost:3000/

# Ver logs del backend
docker-compose -f docker-compose.prod.yml logs backend

# Verificar conexión a base de datos
docker-compose -f docker-compose.prod.yml exec backend npm run check-db
```

## 📊 Monitoreo

### Portainer (Opcional)

```bash
# Instalar Portainer para gestión visual
docker volume create portainer_data
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest
```

**Acceso**: https://panel.embdevs.com:9443

### Logs del Sistema

```bash
# Configurar logrotate para evitar logs muy grandes
sudo nano /etc/logrotate.d/docker-containers
```

## ✅ Lista de Verificación Final

- [ ] Todos los contenedores Docker corriendo
- [ ] PostgreSQL inicializado con usuarios EMB
- [ ] Nginx configurado con SSL
- [ ] Dominio panel.embdevs.com apuntando al servidor
- [ ] Variables de entorno de producción configuradas
- [ ] Backup automático configurado
- [ ] Logs de acceso monitoreados

## 🎯 Resultado Final

El **Panel EMB** estará completamente operativo con:

- ✅ **Seguridad máxima** con autenticación restrictiva
- ✅ **Diseño espectacular** con animaciones GSAP premium
- ✅ **Arquitectura robusta** con Docker y PostgreSQL
- ✅ **SSL seguro** con certificados automáticos
- ✅ **Monitoreo completo** con logs detallados

**🏆 ¡Panel EMB listo para uso en producción!**

---

**Desarrollado con excelencia técnica por el equipo EMB**  
*La gestión empresarial nunca fue tan elegante y segura*
