import { Module } from '@nestjs/common';
import { configurationModule } from '@/config/configuration';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { DatabaseModule as NewDatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from '@/modules/client.module';
import { AppController } from '@/interfaces/controllers/app.controller';

@Module({
  imports: [
    configurationModule,
    DatabaseModule,
    NewDatabaseModule,
    
    // Feature Modules
    ClientModule,
    AuthModule,
    
    // Future modules
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
