
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';


export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Panel EMB API')
    .setDescription('Panel EMB - Internal Management System for EMB Services')
    .setVersion('1.0.0')
    .setContact(
      'EMB Development Team',
      'https://embdevs.com',
      'info@embdevs.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://panel.embdevs.com/api', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Clients', 'Client management endpoints')
    .addTag('Invoices', 'Invoice management endpoints')
    .addTag('Projects', 'Project management endpoints')
    .addTag('Time Tracking', 'Time tracking endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Dashboard', 'Dashboard and analytics endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      sortBy: 'alpha',
    },
    customSiteTitle: 'Panel EMB API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });
  
}
