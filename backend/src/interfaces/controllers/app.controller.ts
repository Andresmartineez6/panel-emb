import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SupabaseService } from '@/infrastructure/database/supabase.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('health')
  @ApiOperation({ 
    summary: 'Health check de la aplicación',
    description: 'Verifica el estado de la aplicación y sus dependencias'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'La aplicación está funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00Z' },
        environment: { type: 'string', example: 'development' },
        services: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'connected' }
          }
        }
      }
    }
  })
  async getHealth() {
    const isDatabaseHealthy = await this.supabaseService.healthCheck();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: isDatabaseHealthy ? 'connected' : 'disconnected',
      },
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'Información básica de la API',
    description: 'Devuelve información básica sobre la API Panel EMB'
  })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Información de la API',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Panel EMB API' },
        version: { type: 'string', example: '1.0.0' },
        description: { type: 'string', example: 'Sistema de gestión integral para la marca EMB' },
        documentation: { type: 'string', example: '/api/docs' }
      }
    }
  })
  getInfo() {
    return {
      name: 'Panel EMB API',
      version: '1.0.0',
      description: 'Sistema de gestión integral para la marca EMB',
      documentation: '/api/docs',
      features: [
        'Gestión de clientes',
        'Facturación con IVA/retención',
        'Presupuestos',
        'Control de horas de colaboradores',
        'Dashboard financiero'
      ]
    };
  }
}
