# Panel EMB - Sistema de Gestión Integral

Sistema profesional para la gestión integral de la marca EMB incluyendo:
- Gestión de clientes
- Facturación
- Control de horas
- Actividad de colaboradores

## 🏗️ Arquitectura

### Arquitectura Hexagonal (Ports & Adapters)
El proyecto implementa arquitectura hexagonal para mantener la lógica de negocio independiente de los detalles técnicos.

### Stack Tecnológico
- **Frontend**: Next.js 13+ + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **Base de Datos**: Supabase (PostgreSQL)
- **Containerización**: Docker + Docker Compose
- **Deployment**: VPS Ubuntu 22.04 + Portainer
- **DNS**: Cloudflare
- **Repositorio**: GitHub

## 📁 Estructura del Proyecto

```
panel-emb/
├── backend/                 # API en NestJS
│   ├── src/
│   │   ├── application/     # Casos de uso y servicios de aplicación
│   │   ├── domain/          # Entidades y reglas de negocio
│   │   ├── infrastructure/  # Implementaciones concretas (DB, APIs)
│   │   ├── interfaces/      # Controllers y DTOs
│   │   └── config/          # Configuración de la aplicación
│   └── test/
├── frontend/                # Next.js + Tailwind
│   ├── src/
│   │   ├── app/             # App Router (Next.js 13+)
│   │   ├── components/      # Componentes reutilizables
│   │   ├── hooks/           # Custom hooks
│   │   └── types/           # Tipos TypeScript
│   └── public/
├── docker-compose.yml       # Orquestación de servicios
└── .env.example            # Variables de entorno de ejemplo
```

## 🚀 Despliegue

- **Dominio**: panel.embdevs.com
- **Servidor**: VPS Ubuntu 22.04
- **Orquestación**: Docker + Portainer
- **Repositorio**: https://github.com/Andresmartineez6/panel-emb

## 🔒 Seguridad

- Variables sensibles en `.env` (no versionado)
- Autenticación JWT
- CORS configurado
- Validación de datos de entrada

## 📋 Próximos Pasos

1. ✅ Estructura base de arquitectura hexagonal
2. ⏳ Configuración de NestJS y dependencias
3. ⏳ Configuración de Next.js y Tailwind
4. ⏳ Integración con Supabase
5. ⏳ Dockerización de servicios
6. ⏳ CI/CD pipeline

## 🔒 Características de Seguridad

- **Autenticación Ultra Segura**: Acceso restringido solo a personal autorizado de EMB
- **PostgreSQL**: Base de datos robusta para información sensible
- **JWT + Sesiones**: Doble capa de autenticación con tokens seguros
- **Cookies HTTP-Only**: Protección contra ataques XSS
- **Validación Continua**: Verificación de sesiones en tiempo real

### 👥 Usuarios Autorizados
- `andresemb` - Desarrollador FullStack
- `aguayoemb` - Desarrollador FullStack y Diseñador
- `alejandroemb` - Desarrolador FullStack
- `pepeemb` - Desarrollador FullStack

## 🎨 Diseño Premium

- **Animaciones GSAP**: Efectos visuales impresionantes
- **Tema Oscuro Elegante**: Colores serios que reflejan la marca EMB
- **Partículas Interactivas**: Efectos de fondo dinámicos
- **Transiciones Suaves**: Experiencia de usuario fluida
- **Responsive Design**: Optimizado para todos los dispositivos

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14**: Framework React con App Router
- **GSAP**: Animaciones premium y efectos visuales
- **Tailwind CSS**: Diseño moderno y responsive
- **TypeScript**: Desarrollo tipado y seguro
- **Three.js**: Efectos 3D (preparado para expansión)

### Backend
- **NestJS**: Arquitectura hexagonal escalable
- **PostgreSQL**: Base de datos principal para datos sensibles
- **JWT**: Autenticación con tokens seguros
- **bcrypt**: Encriptación de contraseñas
- **Redis**: Cache y sesiones rápidas

### DevOps
- **Docker**: Contenedorización completa
- **Nginx**: Proxy reverso con SSL
- **Certbot**: Certificados SSL automáticos
- **Portainer**: Gestión visual de contenedores

## 🏗️ Arquitectura del Sistema

```
panel-emb/
├── frontend/
│   ├── src/app/
│   │   ├── login/         # Página de login con GSAP
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── api/auth/      # API Routes de autenticación
│   │   └── middleware.ts  # Protección de rutas
│   └── Dockerfile
├── backend/
│   ├── src/
│   │   ├── modules/auth/  # Sistema de autenticación
│   │   ├── modules/database/ # Servicio PostgreSQL
│   │   └── guards/        # Protección de endpoints  
│   └── Dockerfile
├── database/
│   └── init.sql          # Inicialización de BD
└── docker-compose.prod.yml
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- Acceso al VPS Ubuntu 22.04 (IP: 37.59.118.66)

### 1. Configuración de Variables de Entorno

**Crear archivo `.env` basado en `.env.example`:**

```bash
# PostgreSQL Seguro
DB_HOST=postgres
DB_NAME=panel_emb
DB_USER=panel_emb_user
DB_PASSWORD=b#sHBEj9JrovK_DB

# JWT Ultra Seguro
JWT_SECRET=emb_super_secret_jwt_key_2024_panel_secure
JWT_EXPIRES_IN=24h

# URLs de Producción
NEXT_PUBLIC_API_URL=https://panel.embdevs.com/api
CORS_ORIGIN=https://panel.embdevs.com
```

### 2. Despliegue en Producción

```bash
# En el servidor VPS
git clone https://github.com/Andresmartineez6/panel-emb.git
cd panel-emb

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con valores de producción

# Desplegar con Docker
docker-compose -f docker-compose.prod.yml up --build -d
```

### 3. Configuración de Nginx (ya configurado)

```nginx
server {
    listen 443 ssl;
    server_name panel.embdevs.com;
    
    ssl_certificate /etc/letsencrypt/live/panel.embdevs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/panel.embdevs.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3100;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔐 Sistema de Autenticación

### Flujo de Login
1. **Página de Carga**: Animación espectacular con partículas
2. **Login Premium**: Formulario con validación y efectos GSAP
3. **Validación Backend**: Verificación contra PostgreSQL
4. **Generación de Token**: JWT + Sesión en BD
5. **Cookie Segura**: HTTP-Only con expiración
6. **Dashboard**: Acceso a funcionalidades principales

### Middleware de Protección
- Verificación automática de tokens
- Redirección al login si no autenticado
- Validación de sesiones activas
- Logout automático al expirar

## 📊 Funcionalidades Principales

### 🎯 Dashboard Ejecutivo
- Métricas financieras en tiempo real
- Gráficos animados con GSAP
- Actividad reciente
- Acciones rápidas

### 👥 Gestión de Clientes
- Base de datos completa
- Historial de transacciones
- Seguimiento de proyectos

### 🧾 Facturación Avanzada
- IVA y retenciones automáticas
- Estados de factura
- Generación PDF
- Envío automático

### 💰 Control Financiero
- Presupuestos detallados
- Control de horas
- Asignación de ingresos
- Reportes ejecutivos

## 🌐 Acceso al Sistema

**URL**: https://panel.embdevs.com

**Credenciales**:
- **Usuarios**: andresemb, aguayoemb, alejandroemb, pepeemb
- **Contraseña**: `b#sHBEj9JrovK`

## 🔧 Comandos Útiles

```bash
# Ver estado de contenedores
docker-compose -f docker-compose.prod.yml ps

# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f

# Restart servicios
docker-compose -f docker-compose.prod.yml restart

# Backup base de datos
docker exec postgres pg_dump -U panel_emb_user panel_emb > backup.sql

# Restaurar base de datos
docker exec -i postgres psql -U panel_emb_user panel_emb < backup.sql
```

## 🛡️ Seguridad Avanzada

- **Encriptación**: Todas las contraseñas hasheadas con bcrypt
- **Sesiones**: Tokens de sesión únicos en PostgreSQL
- **Validación**: Verificación continua de usuarios activos
- **Logs**: Registro de todos los accesos y actividades
- **SSL**: Certificados automáticos con Let's Encrypt

## 📈 Monitoreo

- **Portainer**: https://portainer.embdevs.com (gestión de contenedores)
- **Logs**: Registro detallado de actividades
- **Backup**: Respaldos automáticos diarios
- **Alertas**: Notificaciones de estado del sistema

## 🎨 Características Visuales

- **Paleta de Colores**: Negros profundos con acentos dorados (#d4af37)
- **Tipografía**: Fuentes modernas y legibles
- **Iconografía**: Lucide Icons consistente
- **Animaciones**: Transiciones suaves y efectos impactantes
- **Responsive**: Adaptado a móviles y tablets

## 🚀 Próximas Actualizaciones

- [ ] Módulo de proyectos avanzado
- [ ] Integración con APIs de bancos
- [ ] Notificaciones push en tiempo real
- [ ] App móvil nativa
- [ ] Inteligencia artificial para predicciones

## 📞 Soporte Técnico

**Contacto**: info@embdevs.com  
**Repositorio**: https://github.com/Andresmartineez6/panel-emb  
**Servidor**: VPS OVH - Ubuntu 22.04 (IP: 37.59.118.66)  
**DNS**: Cloudflare  

---

**🏆 Desarrollado con excelencia por el equipo EMB**  
*Panel EMB - Donde la gestión empresarial se encuentra con el diseño premium*
