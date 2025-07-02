#!/bin/bash

# Script de despliegue para panel-emb en VPS
set -e

echo "=== Iniciando despliegue de Panel EMB en panel.embdevs.com ==="

# Verificar si el usuario es root
if [ "$(id -u)" -ne 0 ]; then
    echo "Este script debe ejecutarse como root o con sudo"
    exit 1
fi

# Variables
DOMAIN="panel.embdevs.com"
EMAIL="info@embdevs.com"
APP_DIR="/opt/panel-emb"

# 1. Preparar el sistema
echo "=== Preparando el sistema ==="
apt update && apt upgrade -y
apt install -y git curl wget nginx certbot python3-certbot-nginx

# 2. Configurar Cloudflare DNS (recordatorio manual)
echo "=== RECORDATORIO: Configura el registro DNS en Cloudflare ==="
echo "Tipo: A"
echo "Nombre: panel"
echo "Contenido: 37.59.118.66"
echo "TTL: Auto"
echo "Proxy status: DNS only (icono gris - IMPORTANTE para obtener certificados SSL)"
echo "Presiona Enter cuando hayas configurado el DNS..."
read -p ""

# 3. Crear directorio de la aplicación
echo "=== Creando directorio de la aplicación ==="
mkdir -p $APP_DIR
cd $APP_DIR

# 4. Clonar el repositorio (o actualizar si ya existe)
if [ -d ".git" ]; then
    echo "=== Actualizando repositorio existente ==="
    git pull
else
    echo "=== Clonando repositorio ==="
    # Nota: Reemplazar con tu URL de repositorio Git si existe
    git clone https://github.com/tu-usuario/panel-emb.git .
fi

# 5. Configurar archivos necesarios
echo "=== Configurando archivos ==="
cp .env.production .env

# 6. Obtener certificados SSL con Certbot
echo "=== Obteniendo certificados SSL ==="
mkdir -p ./nginx/certbot/conf ./nginx/certbot/www
certbot certonly --webroot -w ./nginx/certbot/www -d $DOMAIN --email $EMAIL --agree-tos --no-eff-email

# 7. Copiar certificados a directorio de nginx
echo "=== Copiando certificados SSL ==="
mkdir -p ./nginx/ssl
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./nginx/ssl/

# 8. Configurar renovación automática de certificados
echo "=== Configurando renovación automática de SSL ==="
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" > /etc/cron.d/certbot-renew

# 9. Iniciar los servicios con Docker Compose
echo "=== Iniciando servicios con Docker Compose ==="
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# 10. Verificar estado de los contenedores
echo "=== Verificando estado de los contenedores ==="
docker ps

echo "=== Despliegue completado ==="
echo "Tu aplicación ahora debería estar accesible en https://$DOMAIN"
echo "Verifica el acceso y realiza las pruebas necesarias"
