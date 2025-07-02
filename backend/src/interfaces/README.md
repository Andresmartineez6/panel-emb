# Interfaces Layer

Esta capa maneja la comunicación con el exterior:

## Contenido:
- **Controllers**: Endpoints HTTP/REST
- **Middleware**: Autenticación, validación, logging
- **DTOs**: Objetos para entrada y salida de datos
- **Serializers**: Transformación de datos para respuestas
- **Guards**: Protección de rutas
- **Decorators**: Decoradores personalizados

## Principios:
- Punto de entrada a la aplicación
- Convierte requests HTTP en calls de Application
- Maneja autenticación y autorización
- Formatea respuestas para el cliente
