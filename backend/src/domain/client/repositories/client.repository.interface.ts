
import { Client } from '../entities/client.entity';
import { ClientId } from '../value-objects/client-id.vo';
import { Email } from '../value-objects/email.vo';
import { ClientStatus } from '../enums/client-status.enum';


export interface FindClientsFilters {
  status?: ClientStatus;
  search?: string; // Buscar por nombre, email o taxId
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IClientRepository {
  //crear
  save(client: Client): Promise<Client>;
  
  //leer
  findById(id: ClientId): Promise<Client | null>;
  findByEmail(email: Email): Promise<Client | null>;
  findByTaxId(taxId: string): Promise<Client | null>;
  findAll(
    filters?: FindClientsFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Client>>;
  find(
    filters?: FindClientsFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Client>>;
  
  //actualizar
  update(client: Client): Promise<void>;
  
  //borrar
  delete(id: ClientId): Promise<void>;
  
  //consultas de logica de negocio
  findActiveClients(): Promise<Client[]>;
  findClientsByStatus(status: ClientStatus): Promise<Client[]>;
  searchClients(searchTerm: string): Promise<Client[]>;
  countByStatus(status: ClientStatus): Promise<number>;
  existsByEmail(email: Email): Promise<boolean>;
  existsByTaxId(taxId: string): Promise<boolean>;
}
