import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IClientRepository, ClientId, ClientStatus } from '@/domain/client';
import { REPOSITORY_TOKENS } from '../../../infrastructure/database';
import { ClientResponseDto } from '../dtos';
import { IUseCase } from '../interfaces/use-case.interface';

export interface ChangeClientStatusRequest {
  clientId: string;
  status: ClientStatus;
}

export interface ChangeClientStatusResponse {
  client: ClientResponseDto;
}

@Injectable()
export class ChangeClientStatusUseCase implements IUseCase<ChangeClientStatusRequest, ChangeClientStatusResponse> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(request: ChangeClientStatusRequest): Promise<ChangeClientStatusResponse> {
    const { clientId, status } = request;

    // Buscar cliente existente
    const clientIdVO = ClientId.fromString(clientId);
    const existingClient = await this.clientRepository.findById(clientIdVO);

    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Aplicar cambio de estado según la acción solicitada
    try {
      switch (status) {
        case ClientStatus.ACTIVE:
          existingClient.activate();
          break;
        case ClientStatus.INACTIVE:
          existingClient.deactivate();
          break;
        case ClientStatus.DELETED:
          existingClient.delete();
          break;
        default:
          throw new BadRequestException(`Invalid status: ${status}`);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    // Persistir cambios
    const updatedClient = await this.clientRepository.save(existingClient);

    // Crear DTO de respuesta
    const clientResponse = new ClientResponseDto({
      id: updatedClient.id.value,
      name: updatedClient.name,
      email: updatedClient.email.value,
      phone: updatedClient.phone.value,
      address: updatedClient.address,
      taxId: updatedClient.taxId,
      status: updatedClient.status,
      createdAt: updatedClient.createdAt,
      updatedAt: updatedClient.updatedAt,
      canCreateInvoice: updatedClient.canCreateInvoice(),
    });

    return {
      client: clientResponse,
    };
  }
}
