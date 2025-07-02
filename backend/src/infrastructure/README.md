# Infrastructure Layer

Esta capa contiene las implementaciones concretas de los servicios externos:

## Contenido:
- **Database**: Implementaciones de repositorios con Supabase/PostgreSQL
- **External APIs**: Servicios externos (emails, pagos, etc.)
- **File Storage**: Manejo de archivos
- **Adapters**: Implementaciones concretas de los ports definidos en Application
- **Configuration**: Configuración de servicios externos

## Principios:
- Implementa las interfaces definidas en Application
- Contiene detalles técnicos específicos
- Se puede cambiar sin afectar el dominio
- Maneja persistencia y servicios externos
