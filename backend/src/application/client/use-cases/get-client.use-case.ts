import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IClientRepository, ClientId } from '@/domain/client';
import { REPOSITORY_TOKENS } from '@/infrastructure/database';
import { ClientResponseDto } from '../dtos';
import { IUseCase } from '../interfaces/use-case.interface';

export interface GetClientRequest {
  clientId: string;
}

export interface GetClientResponse {
  client: ClientResponseDto;
}

@Injectable()
export class GetClientUseCase implements IUseCase<GetClientRequest, GetClientResponse> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(request: GetClientRequest): Promise<GetClientResponse> {
    const { clientId } = request;

    // Buscar cliente por ID
    const clientIdVO = ClientId.fromString(clientId);
    const client = await this.clientRepository.findById(clientIdVO);

    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Crear DTO de respuesta
    const clientResponse = new ClientResponseDto({
      id: client.id.value,
      name: client.name,
      email: client.email.value,
      phone: client.phone.value,
      address: client.address,
      taxId: client.taxId,
      status: client.status,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      canCreateInvoice: client.canCreateInvoice(),
    });

    return {
      client: clientResponse,
    };
  }
}
