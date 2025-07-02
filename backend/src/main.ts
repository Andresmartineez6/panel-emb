import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';

// Import our custom components
import {
  ValidationPipe,
  ResponseInterceptor,
  HttpExceptionFilter,
  setupSwagger,
} from './interfaces';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Response Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de seguridad
  app.use(helmet());
  app.use(compression());

  // Configuración de CORS
  const corsOrigins = configService.get<string[]>('app.corsOrigins') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api/v1');

  // Configuración de Swagger/OpenAPI
  setupSwagger(app);

  // Puerto de la aplicación
  const port = configService.get<number>('app.port');
  const environment = configService.get<string>('app.environment');

  await app.listen(port);

  logger.log(`🚀 Panel EMB API está ejecutándose en: http://localhost:${port}`);
  logger.log(`📚 Documentación Swagger disponible en: http://localhost:${port}/api/docs`);
  logger.log(`🌍 Entorno: ${environment}`);
  
  if (environment === 'development') {
    logger.warn('⚠️  Aplicación ejecutándose en modo desarrollo');
  }
}

bootstrap().catch((error) => {
  Logger.error('❌ Error al iniciar la aplicación:', error);
  process.exit(1);
});
