import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../infrastructure/database';
import { Client, Email, Phone, IClientRepository, ClientDomainService } from '@/domain/client';
import { CreateClientDto, ClientResponseDto } from '../dtos';
import { IUseCase } from '../interfaces/use-case.interface';

export interface CreateClientRequest {
  clientData: CreateClientDto;
}

export interface CreateClientResponse {
  client: ClientResponseDto;
}

@Injectable()
export class CreateClientUseCase implements IUseCase<CreateClientRequest, CreateClientResponse> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    private readonly clientDomainService: ClientDomainService,
  ) {}

  async execute(request: CreateClientRequest): Promise<CreateClientResponse> {
    const { clientData } = request;

    // Validar unicidad del email
    await this.clientDomainService.validateEmailUniqueness(clientData.email);

    // Validar unicidad del Tax ID
    await this.clientDomainService.validateTaxIdUniqueness(clientData.taxId);

    // Crear cliente usando factory method
    const client = Client.create({
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      taxId: clientData.taxId,
    });

    // Persistir cliente
    const savedClient = await this.clientRepository.save(client);

    // Crear DTO de respuesta
    const clientResponse = new ClientResponseDto({
      id: savedClient.id.value,
      name: savedClient.name,
      email: savedClient.email.value,
      phone: savedClient.phone.value,
      address: savedClient.address,
      taxId: savedClient.taxId,
      status: savedClient.status,
      createdAt: savedClient.createdAt,
      updatedAt: savedClient.updatedAt,
      canCreateInvoice: savedClient.canCreateInvoice(),
    });

    return {
      client: clientResponse,
    };
  }
}
