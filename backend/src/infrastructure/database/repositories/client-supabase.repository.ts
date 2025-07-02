
import { Injectable, Logger } from '@nestjs/common';
import {
  IClientRepository,
  FindClientsFilters,
  PaginationOptions,
  PaginatedResult,
} from '@/domain/client/repositories/client.repository.interface';
import {
  Client,
  ClientId,
  Email,
  Phone,
  ClientStatus,
} from '@/domain/client';
import { SupabaseService } from '../supabase.service';



interface ClientRowData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tax_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}


@Injectable()
export class ClientSupabaseRepository implements IClientRepository {
  private readonly logger = new Logger(ClientSupabaseRepository.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async save(client: Client): Promise<Client> {
    const supabase = this.supabaseService.getClient();
    
    const clientData = {
      id: client.id.value,
      name: client.name,
      email: client.email.value,
      phone: client.phone.value,
      address: client.address,
      tax_id: client.taxId,
      status: client.status,
      created_at: client.createdAt.toISOString(),
      updated_at: client.updatedAt.toISOString(),
    };

    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      this.logger.error('Error saving client:', error);
      throw new Error(`Failed to save client: ${error.message}`);
    }

    return this.mapRowToClient(data);
  }

  async findById(id: ClientId): Promise<Client | null> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id.value)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        //no se han devuleto filas
        return null;
      }
      this.logger.error('Error finding client by ID:', error);
      throw new Error(`Failed to find client: ${error.message}`);
    }

    return this.mapRowToClient(data);
  }


  async findByEmail(email: Email): Promise<Client | null> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email.value)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      this.logger.error('Error finding client by email:', error);
      throw new Error(`Failed to find client: ${error.message}`);
    }

    return this.mapRowToClient(data);
  }

  async findByTaxId(taxId: string): Promise<Client | null> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('tax_id', taxId.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      this.logger.error('Error finding client by tax ID:', error);
      throw new Error(`Failed to find client: ${error.message}`);
    }

    return this.mapRowToClient(data);
  }

  async findAll(
    filters?: FindClientsFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Client>> {
    return this.find(filters, pagination);
  }

  async find(
    filters?: FindClientsFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Client>> {
    const supabase = this.supabaseService.getClient();
    
    //crear consulta
    let query = supabase.from('clients').select('*', { count: 'exact' });

    //aplicar filtros
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.or(
        `name.ilike.${searchTerm},email.ilike.${searchTerm},tax_id.ilike.${searchTerm}`,
      );
    }

    if (filters?.createdAfter) {
      query = query.gte('created_at', filters.createdAfter.toISOString());
    }

    if (filters?.createdBefore) {
      query = query.lte('created_at', filters.createdBefore.toISOString());
    }

    //aplicar la paginacion
    const page = pagination?.page || 1;
    const limit = Math.min(pagination?.limit || 10, 100);
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1);

    //aplicar la clasificacion
    const sortBy = pagination?.sortBy || 'created_at';
    const sortOrder = pagination?.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error, count } = await query;

    if (error) {
      this.logger.error('Error finding clients:', error);
      throw new Error(`Failed to find clients: ${error.message}`);
    }

    const clients = data?.map(row => this.mapRowToClient(row)) || [];
    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: clients,
      total,
      page,
      limit,
      totalPages,
    };
  }


  async update(client: Client): Promise<void> {
    const supabase = this.supabaseService.getClient();

    const updateData = {
      name: client.name,
      email: client.email.value,
      phone: client.phone.value,
      address: client.address,
      tax_id: client.taxId,
      status: client.status,
      updated_at: client.updatedAt.toISOString(),
    };

    const { error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', client.id.value);

    if (error) {
      this.logger.error('Error updating client:', error);
      throw new Error(`Failed to update client: ${error.message}`);
    }
  }

  async delete(id: ClientId): Promise<void> {
    const supabase = this.supabaseService.getClient();

    //eliminar temporalmente actualizando el estado
    const { error } = await supabase
      .from('clients')
      .update({
        status: ClientStatus.DELETED,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id.value);

    if (error) {
      this.logger.error('Error deleting client:', error);
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  }


  async findActiveClients(): Promise<Client[]> {
    const result = await this.find({ status: ClientStatus.ACTIVE });
    return result.data;
  }


  async findClientsByStatus(status: ClientStatus): Promise<Client[]> {
    const result = await this.find({ status });
    return result.data;
  }


  async searchClients(searchTerm: string): Promise<Client[]> {
    const result = await this.find({ search: searchTerm });
    return result.data;
  }


  async countByStatus(status: ClientStatus): Promise<number> {
    const supabase = this.supabaseService.getClient();

    const { count, error } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);

    if (error) {
      this.logger.error('Error counting clients by status:', error);
      throw new Error(`Failed to count clients: ${error.message}`);
    }

    return count || 0;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const client = await this.findByEmail(email);
    return client !== null;
  }

  async existsByTaxId(taxId: string): Promise<boolean> {
    const client = await this.findByTaxId(taxId);
    return client !== null;
  }

  private mapRowToClient(row: ClientRowData): Client {
    return Client.fromPersistence({
      id: ClientId.fromString(row.id),
      name: row.name,
      email: Email.create(row.email),
      phone: Phone.create(row.phone),
      address: row.address,
      taxId: row.tax_id,
      status: row.status as ClientStatus,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
    
  }

}
