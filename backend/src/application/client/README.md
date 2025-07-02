# Capa de Aplicación - Cliente

Esta es la capa de aplicación del módulo Cliente, implementada siguiendo los principios de **Arquitectura Hexagonal** y **Domain-Driven Design (DDD)**.

## 📁 Estructura del Módulo

```
src/application/client/
├── dtos/                      # Data Transfer Objects
│   ├── create-client.dto.ts   # DTO para crear cliente
│   ├── update-client.dto.ts   # DTO para actualizar cliente
│   ├── client-response.dto.ts # DTO de respuesta de cliente
│   ├── client-query-filters.dto.ts # DTO para filtros de consulta
│   └── index.ts               # Barrel exports
├── interfaces/                # Interfaces de contratos
│   ├── use-case.interface.ts  # Interfaz base para casos de uso
│   └── index.ts               # Barrel exports
├── use-cases/                 # Casos de uso (servicios de aplicación)
│   ├── create-client.use-case.ts     # Crear cliente
│   ├── get-client.use-case.ts        # Obtener cliente por ID
│   ├── update-client.use-case.ts     # Actualizar cliente
│   ├── delete-client.use-case.ts     # Eliminar cliente
│   ├── get-client-list.use-case.ts   # Listar clientes paginados
│   ├── change-client-status.use-case.ts # Cambiar estado del cliente
│   └── index.ts               # Barrel exports
├── index.ts                   # Barrel exports principal
└── README.md                  # Esta documentación
```

## 🎯 Casos de Uso Implementados

### 1. **CreateClientUseCase**
- **Propósito**: Crear un nuevo cliente
- **Validaciones**: Email único, Tax ID único
- **Entrada**: `CreateClientDto`
- **Salida**: `ClientResponseDto`

### 2. **GetClientUseCase**
- **Propósito**: Obtener un cliente por ID
- **Validaciones**: Cliente existe
- **Entrada**: `clientId: string`
- **Salida**: `ClientResponseDto`

### 3. **UpdateClientUseCase**
- **Propósito**: Actualizar información de un cliente
- **Validaciones**: Cliente existe, email único (si se cambia), Tax ID único (si se cambia)
- **Entrada**: `clientId: string`, `UpdateClientDto`
- **Salida**: `ClientResponseDto`

### 4. **DeleteClientUseCase**
- **Propósito**: Eliminar un cliente (soft delete)
- **Validaciones**: Cliente existe, puede ser eliminado (reglas de negocio)
- **Entrada**: `clientId: string`
- **Salida**: `{ success: boolean, message: string }`

### 5. **GetClientListUseCase**
- **Propósito**: Listar clientes con filtros y paginación
- **Características**: Filtrado por estado, búsqueda, paginación, ordenación
- **Entrada**: `ClientQueryFiltersDto`
- **Salida**: `{ clients: ClientResponseDto[], pagination: {...} }`

### 6. **ChangeClientStatusUseCase**
- **Propósito**: Cambiar el estado de un cliente
- **Estados**: `ACTIVE`, `INACTIVE`, `DELETED`
- **Entrada**: `clientId: string`, `status: ClientStatus`
- **Salida**: `ClientResponseDto`

## 📋 DTOs (Data Transfer Objects)

### CreateClientDto
```typescript
{
  name: string;        // Nombre del cliente (2-100 chars)
  email: string;       // Email válido
  phone: string;       // Teléfono español (9 dígitos)
  address: string;     // Dirección (5-200 chars)
  taxId: string;       // NIF/CIF español
}
```

### UpdateClientDto
```typescript
{
  name?: string;       // Opcional - Nombre del cliente
  email?: string;      // Opcional - Email válido
  phone?: string;      // Opcional - Teléfono español
  address?: string;    // Opcional - Dirección
  taxId?: string;      // Opcional - NIF/CIF español
}
```

### ClientResponseDto
```typescript
{
  id: string;                    // UUID del cliente
  name: string;                  // Nombre del cliente
  email: string;                 // Email del cliente
  phone: string;                 // Teléfono del cliente
  address: string;               // Dirección del cliente
  taxId: string;                 // Tax ID del cliente
  status: ClientStatus;          // Estado del cliente
  createdAt: Date;               // Fecha de creación
  updatedAt: Date;               // Fecha de última actualización
  canCreateInvoice: boolean;     // Si puede crear facturas
}
```

### ClientQueryFiltersDto
```typescript
{
  search?: string;           // Búsqueda por nombre/email/taxId
  status?: ClientStatus;     // Filtro por estado
  page?: number;             // Página (default: 1)
  limit?: number;            // Elementos por página (default: 10, max: 100)
  sortBy?: string;           // Campo para ordenar (default: 'createdAt')
  sortOrder?: 'asc'|'desc';  // Orden (default: 'desc')
}
```

## 🔧 Validaciones

### Validaciones de Entrada (DTOs)
- **Nombre**: 2-100 caracteres
- **Email**: Formato válido de email
- **Teléfono**: Formato teléfono español (9 dígitos)
- **Dirección**: 5-200 caracteres
- **Tax ID**: Formato NIF/CIF español válido

### Validaciones de Negocio (Domain Services)
- **Email único**: No puede existir otro cliente con el mismo email
- **Tax ID único**: No puede existir otro cliente con el mismo Tax ID
- **Eliminación segura**: Verificación de reglas de negocio antes de eliminar

## 🚀 Uso de los Casos de Uso

### Ejemplo de Uso en un Controlador NestJS

```typescript
@Controller('clients')
export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly getClientUseCase: GetClientUseCase,
    // ... otros casos de uso
  ) {}

  @Post()
  async createClient(@Body() createClientDto: CreateClientDto) {
    const result = await this.createClientUseCase.execute({
      clientData: createClientDto
    });
    return result.client;
  }

  @Get(':id')
  async getClient(@Param('id') id: string) {
    const result = await this.getClientUseCase.execute({
      clientId: id
    });
    return result.client;
  }

  @Get()
  async getClients(@Query() filters: ClientQueryFiltersDto) {
    const result = await this.getClientListUseCase.execute({
      filters
    });
    return result;
  }
}
```

## 🏗️ Principios de Arquitectura

### Arquitectura Hexagonal
- **Independencia**: Los casos de uso no dependen de detalles de infraestructura
- **Testabilidad**: Cada caso de uso puede ser probado de forma aislada
- **Flexibilidad**: Fácil intercambio de implementaciones concretas

### SOLID Principles
- **SRP**: Cada caso de uso tiene una sola responsabilidad
- **OCP**: Abierto para extensión, cerrado para modificación
- **LSP**: Los casos de uso siguen el contrato de la interfaz IUseCase
- **ISP**: Interfaces específicas para cada necesidad
- **DIP**: Dependemos de abstracciones, no de concreciones

### Domain-Driven Design
- **Casos de Uso**: Representan operaciones de negocio específicas
- **DTOs**: Contratos claros entre capas
- **Validaciones**: Separación entre validaciones técnicas y de negocio

## 🔗 Dependencias

### Dependencias Internas
- `@/domain/client`: Entidades, value objects, servicios de dominio
- `class-validator`: Validaciones de DTOs
- `class-transformer`: Transformación de datos

### Dependencias Externas
- `@nestjs/common`: Decoradores e inyección de dependencias
- Implementaciones concretas de repositorios (en capa de infraestructura)

## 📝 Notas Importantes

1. **Inyección de Dependencias**: Todos los casos de uso usan inyección de dependencias de NestJS
2. **Manejo de Errores**: Errores específicos de negocio son lanzados como excepciones de NestJS
3. **Validaciones**: Dos niveles - DTOs (técnicas) y Domain Services (negocio)
4. **Paginación**: Implementada con limit/offset estándar
5. **Filtros**: Soporte para búsqueda y filtrado por múltiples campos

## 🧪 Testing

Cada caso de uso debe ser probado:
- **Unit Tests**: Con mocks de repositorios y servicios
- **Integration Tests**: Con implementaciones reales
- **E2E Tests**: Flujos completos de negocio

## 🔄 Próximos Pasos

1. Implementar la capa de infraestructura (repositorios Supabase)
2. Crear controladores REST para exposición de APIs
3. Implementar middleware de autenticación
4. Agregar logging y monitoreo
5. Documentar APIs con Swagger/OpenAPI
