
import { Module } from '@nestjs/common';

//domain
import { ClientDomainService } from '@/domain/client';

//application
import {
  CreateClientUseCase,
  UpdateClientUseCase,
  GetClientUseCase,
  DeleteClientUseCase,
  GetClientListUseCase,
  ChangeClientStatusUseCase,
} from '@/application/client';

//interfaces
import { ClientController } from '@/interfaces/http/controllers';

//infraestructura
import { DatabaseModule, REPOSITORY_TOKENS } from '../infrastructure/database';

@Module({
  imports: [DatabaseModule],
  controllers: [ClientController],
  providers: [
    //servicios domain 
    ClientDomainService,
    
    //casos de uso
    CreateClientUseCase,
    UpdateClientUseCase,
    GetClientUseCase,
    DeleteClientUseCase,
    GetClientListUseCase,
    ChangeClientStatusUseCase,
  ],
  exports: [
    //exportar casos de uso si es necesario para otros modulos
    CreateClientUseCase,
    UpdateClientUseCase,
    GetClientUseCase,
    DeleteClientUseCase,
    GetClientListUseCase,
    ChangeClientStatusUseCase,
  ],
})
export class ClientModule {}
