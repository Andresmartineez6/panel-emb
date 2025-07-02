// Entities
export { Client } from './entities/client.entity';

// Value Objects
export { ClientId, Email, Phone } from './value-objects';

// Enums
export { 
  ClientStatus, 
  ClientStatusLabels, 
  ClientStatusColors 
} from './enums';

// Repository Interface
export { 
  IClientRepository,
  FindClientsFilters,
  PaginationOptions,
  PaginatedResult,
} from './repositories/client.repository.interface';

// Domain Services
export { ClientDomainService } from './services/client-domain.service';
