import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  CreateClientUseCase,
  UpdateClientUseCase,
  GetClientUseCase,
  DeleteClientUseCase,
  GetClientListUseCase,
  ChangeClientStatusUseCase,
  CreateClientDto,
  UpdateClientDto,
  ClientResponseDto,
  ClientQueryFiltersDto,
} from '@/application/client';
import { ClientStatus } from '@/domain/client';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly getClientUseCase: GetClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
    private readonly getClientListUseCase: GetClientListUseCase,
    private readonly changeClientStatusUseCase: ChangeClientStatusUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 409, description: 'Conflict - email or taxId already exists' })
  async createClient(@Body() createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    const result = await this.createClientUseCase.execute({
      clientData: createClientDto,
    });
    return result.client;
  }

  @Get()
  @ApiOperation({ summary: 'Get clients list with filters and pagination' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, email or taxId' })
  @ApiQuery({ name: 'status', required: false, enum: ClientStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field (default: createdAt)' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order (default: desc)' })
  @ApiResponse({
    status: 200,
    description: 'Clients list retrieved successfully',
  })
  async getClients(@Query() filters: ClientQueryFiltersDto) {
    const result = await this.getClientListUseCase.execute({
      filters,
    });
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({ name: 'id', description: 'Client UUID' })
  @ApiResponse({
    status: 200,
    description: 'Client retrieved successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async getClient(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ClientResponseDto> {
    const result = await this.getClientUseCase.execute({
      clientId: id,
    });
    return result.client;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiParam({ name: 'id', description: 'Client UUID' })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 409, description: 'Conflict - email or taxId already exists' })
  async updateClient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const result = await this.updateClientUseCase.execute({
      clientId: id,
      clientData: updateClientDto,
    });
    return result.client;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete client (soft delete)' })
  @ApiParam({ name: 'id', description: 'Client UUID' })
  @ApiResponse({ status: 204, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 400, description: 'Client cannot be deleted due to business constraints' })
  async deleteClient(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteClientUseCase.execute({
      clientId: id,
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change client status' })
  @ApiParam({ name: 'id', description: 'Client UUID' })
  @ApiResponse({
    status: 200,
    description: 'Client status changed successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  async changeClientStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: ClientStatus,
  ): Promise<ClientResponseDto> {
    const result = await this.changeClientStatusUseCase.execute({
      clientId: id,
      status,
    });
    return result.client;
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate client' })
  @ApiParam({ name: 'id', description: 'Client UUID' })
  @ApiResponse({
    status: 200,
    description: 'Client activated successfully',
    type: ClientResponseDto,
  })
  async activateClient(@Param('id', ParseUUIDPipe) id: string): Promise<ClientResponseDto> {
    const result = await this.changeClientStatusUseCase.execute({
      clientId: id,
      status: ClientStatus.ACTIVE,
    });
    return result.client;
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate client' })
  @ApiParam({ name: 'id', description: 'Client UUID' })
  @ApiResponse({
    status: 200,
    description: 'Client deactivated successfully',
    type: ClientResponseDto,
  })
  async deactivateClient(@Param('id', ParseUUIDPipe) id: string): Promise<ClientResponseDto> {
    const result = await this.changeClientStatusUseCase.execute({
      clientId: id,
      status: ClientStatus.INACTIVE,
    });
    return result.client;
  }
}
