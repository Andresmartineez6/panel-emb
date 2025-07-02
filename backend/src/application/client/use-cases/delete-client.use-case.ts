import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IClientRepository, ClientDomainService, ClientId } from '@/domain/client';
import { REPOSITORY_TOKENS } from '../../../infrastructure/database';
import { IUseCase } from '../interfaces/use-case.interface';

export interface DeleteClientRequest {
  clientId: string;
}

export interface DeleteClientResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class DeleteClientUseCase implements IUseCase<DeleteClientRequest, DeleteClientResponse> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    private readonly clientDomainService: ClientDomainService,
  ) {}

  async execute(request: DeleteClientRequest): Promise<DeleteClientResponse> {
    const { clientId } = request;

    // Buscar cliente existente
    const clientIdVO = ClientId.fromString(clientId);
    const existingClient = await this.clientRepository.findById(clientIdVO);

    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Verificar si el cliente puede ser eliminado (reglas de negocio)
    const canDelete = await this.clientDomainService.canDeleteClient(clientId);

    if (!canDelete) {
      throw new BadRequestException(
        'Client cannot be deleted due to business constraints (e.g., has active invoices)'
      );
    }

    // Marcar cliente como eliminado (soft delete)
    existingClient.delete();

    // Persistir cambios
    await this.clientRepository.save(existingClient);

    return {
      success: true,
      message: 'Client has been successfully deleted',
    };
  }
}
