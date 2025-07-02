# Config Layer

Esta capa maneja toda la configuración de la aplicación:

## Contenido:
- **Database Config**: Configuración de Supabase/PostgreSQL
- **Environment Variables**: Manejo de variables de entorno
- **Application Config**: Configuración general de NestJS
- **Security Config**: JWT, CORS, etc.
- **Validation Schemas**: Validación de configuración

## Principios:
- Centraliza toda la configuración
- Valida variables de entorno al inicio
- Proporciona configuración tipada
- Facilita diferentes entornos (dev, prod, test)
