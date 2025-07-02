import { Client } from '../entities/client.entity';
import { Email, ClientId } from '../value-objects';
import { ClientStatus } from '../enums';
import { IClientRepository } from '../repositories/client.repository.interface';

export class ClientDomainService {
  constructor(private readonly clientRepository: IClientRepository) {}

  /**
   * Valida que no exista otro cliente con el mismo email
   */
  public async validateUniqueEmail(email: Email, excludeClientId?: string): Promise<void> {
    const existingClient = await this.clientRepository.findByEmail(email);
    
    if (existingClient && (!excludeClientId || existingClient.id.value !== excludeClientId)) {
      throw new Error(`Client with email ${email.value} already exists`);
    }
  }

  /**
   * Valida que no exista otro cliente con el mismo Tax ID
   */
  public async validateUniqueTaxId(taxId: string, excludeClientId?: string): Promise<void> {
    const existingClient = await this.clientRepository.findByTaxId(taxId);
    
    if (existingClient && (!excludeClientId || existingClient.id.value !== excludeClientId)) {
      throw new Error(`Client with Tax ID ${taxId} already exists`);
    }
  }

  /**
   * Valida unicidad de Email (alias para validateUniqueEmail)
   */
  public async validateEmailUniqueness(email: string, excludeClientId?: string): Promise<void> {
    const emailVO = Email.fromString(email);
    await this.validateUniqueEmail(emailVO, excludeClientId);
  }

  /**
   * Valida unicidad de Tax ID (alias para validateUniqueTaxId)
   */
  public async validateTaxIdUniqueness(taxId: string, excludeClientId?: string): Promise<void> {
    await this.validateUniqueTaxId(taxId, excludeClientId);
  }

  /**
   * Valida si un cliente puede ser eliminado por ID
   */
  public async canDeleteClient(clientId: string): Promise<boolean> {
    const clientIdVO = ClientId.fromString(clientId);
    const client = await this.clientRepository.findById(clientIdVO);
    if (!client) {
      return false;
    }
    return await this.canBeDeleted(client);
  }

  /**
   * Valida si un cliente puede ser eliminado
   * En el futuro se puede extender para verificar facturas pendientes, etc.
   */
  public async canBeDeleted(client: Client): Promise<boolean> {
    // Por ahora, cualquier cliente puede ser eliminado
    // En el futuro agregar validaciones como:
    // - No tiene facturas pendientes
    // - No tiene presupuestos activos
    // - etc.
    return true;
  }

  /**
   * Obtiene estadísticas básicas de clientes
   */
  public async getClientStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    deleted: number;
  }> {
    const [active, inactive, deleted] = await Promise.all([
      this.clientRepository.countByStatus(ClientStatus.ACTIVE),
      this.clientRepository.countByStatus(ClientStatus.INACTIVE),
      this.clientRepository.countByStatus(ClientStatus.DELETED),
    ]);

    const total = active + inactive + deleted;
    return { total, active, inactive, deleted };
  }

  /**
   * Busca clientes duplicados potenciales basado en similitud de nombres
   */
  public async findPotentialDuplicates(client: Client): Promise<Client[]> {
    // Implementación básica - en el futuro se puede mejorar con algoritmos de similitud
    const searchTerm = client.name.substring(0, 5).toLowerCase();
    const similarClients = await this.clientRepository.searchClients(searchTerm);
    
    return similarClients.filter(c => 
      c.id.value !== client.id.value && 
      c.name.toLowerCase().includes(searchTerm)
    );
  }
}
