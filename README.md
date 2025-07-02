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
