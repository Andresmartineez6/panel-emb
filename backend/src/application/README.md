# Application Layer

Esta capa orquesta las operaciones del dominio:

## Contenido:
- **Use Cases**: Casos de uso específicos de la aplicación
- **Application Services**: Servicios que coordinan operaciones del dominio
- **Command/Query Handlers**: Implementaciones de CQRS
- **DTOs**: Objetos de transferencia de datos
- **Ports**: Interfaces para servicios externos

## Principios:
- Orquesta las operaciones del dominio
- No contiene lógica de negocio (esa va en Domain)
- Define contratos (ports) para servicios externos
- Implementa casos de uso específicos
