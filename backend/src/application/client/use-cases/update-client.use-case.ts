import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IClientRepository, ClientId, ClientDomainService, Email, Phone } from '@/domain/client';
import { REPOSITORY_TOKENS } from '@/infrastructure/database';
import { UpdateClientDto, ClientResponseDto } from '../dtos';
import { IUseCase } from '../interfaces/use-case.interface';

export interface UpdateClientRequest {
  clientId: string;
  clientData: UpdateClientDto;
}

export interface UpdateClientResponse {
  client: ClientResponseDto;
}

@Injectable()
export class UpdateClientUseCase implements IUseCase<UpdateClientRequest, UpdateClientResponse> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    private readonly clientDomainService: ClientDomainService,
  ) {}

  async execute(request: UpdateClientRequest): Promise<UpdateClientResponse> {
    const { clientId, clientData } = request;

    // Buscar cliente existente
    const clientIdVO = ClientId.fromString(clientId);
    const existingClient = await this.clientRepository.findById(clientIdVO);

    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Validar unicidad del email si se está actualizando
    if (clientData.email && clientData.email !== existingClient.email.value) {
      await this.clientDomainService.validateEmailUniqueness(clientData.email);
    }

    // Validar unicidad del Tax ID si se está actualizando
    if (clientData.taxId && clientData.taxId !== existingClient.taxId) {
      await this.clientDomainService.validateTaxIdUniqueness(clientData.taxId);
    }

    // Crear value objects si se proporcionan
    const email = clientData.email ? Email.fromString(clientData.email) : existingClient.email;
    const phone = clientData.phone ? Phone.fromString(clientData.phone) : existingClient.phone;

    // Actualizar información personal
    existingClient.updatePersonalInfo(
      clientData.name ?? existingClient.name,
      email,
      phone,
      clientData.address ?? existingClient.address,
    );

    // Actualizar Tax ID si se proporciona
    if (clientData.taxId) {
      existingClient.updateTaxId(clientData.taxId);
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
