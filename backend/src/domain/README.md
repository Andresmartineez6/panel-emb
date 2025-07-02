# Domain Layer

Esta capa contiene la lógica de negocio pura de la aplicación:

## Contenido:
- **Entities**: Objetos de negocio principales
- **Value Objects**: Objetos inmutables que representan conceptos del dominio
- **Aggregates**: Conjuntos de entidades relacionadas que se tratan como una unidad
- **Domain Services**: Servicios que contienen lógica de dominio que no pertenece a una entidad específica
- **Repositories (Interfaces)**: Contratos para acceso a datos
- **Domain Events**: Eventos que ocurren en el dominio

## Principios:
- No debe tener dependencias hacia capas externas
- Contiene únicamente lógica de negocio
- Es el núcleo de la aplicación
