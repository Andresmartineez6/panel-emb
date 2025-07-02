import { Module } from '@nestjs/common';
import { configurationModule } from '@/config/configuration';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { ClientModule } from '@/modules/client.module';
import { AppController } from '@/interfaces/controllers/app.controller';

@Module({
  imports: [
    configurationModule,
    DatabaseModule,
    
    // Feature Modules
    ClientModule,
    
    // Future modules
    // AuthModule,
    // InvoicesModule,
    // BudgetsModule,
    // TimeTrackingModule,
    // CollaboratorsModule,
    // DashboardModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    // Global services will go here
  ],
})
export class AppModule {}
