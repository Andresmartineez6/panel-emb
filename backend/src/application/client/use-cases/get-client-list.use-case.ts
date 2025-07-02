import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../infrastructure/database';
import { IClientRepository, FindClientsFilters, PaginationOptions } from '@/domain/client';
import { ClientQueryFiltersDto, ClientResponseDto } from '../dtos';
import { IUseCase } from '../interfaces/use-case.interface';

export interface GetClientListRequest {
  filters: ClientQueryFiltersDto;
}

export interface GetClientListResponse {
  clients: ClientResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

@Injectable()
export class GetClientListUseCase implements IUseCase<GetClientListRequest, GetClientListResponse> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(request: GetClientListRequest): Promise<GetClientListResponse> {
    const { filters } = request;

    // Preparar filtros para el dominio
    const domainFilters: FindClientsFilters = {
      search: filters.search,
      status: filters.status,
    };

    // Preparar opciones de paginación
    const paginationOptions: PaginationOptions = {
      page: filters.page || 1,
      limit: filters.limit || 10,
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc',
    };

    // Obtener clientes paginados
    const result = await this.clientRepository.find(domainFilters, paginationOptions);

    // Mapear clientes a DTOs de respuesta
    const clientDtos = result.data.map(client => new ClientResponseDto({
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
    }));

    // Calcular información de paginación
    const totalPages = Math.ceil(result.total / paginationOptions.limit);
    const hasNext = paginationOptions.page < totalPages;
    const hasPrevious = paginationOptions.page > 1;

    return {
      clients: clientDtos,
      pagination: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
        total: result.total,
        totalPages,
        hasNext,
        hasPrevious,
      },
    };
  }
}
