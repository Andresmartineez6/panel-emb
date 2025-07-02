
import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ClientSupabaseRepository } from './repositories/client-supabase.repository';


//Tokens para inyección de dependencias
export const REPOSITORY_TOKENS = {
  CLIENT_REPOSITORY: 'CLIENT_REPOSITORY',
};


@Global()
@Module({
  providers: [
    SupabaseService,
    {
      provide: REPOSITORY_TOKENS.CLIENT_REPOSITORY,
      useClass: ClientSupabaseRepository,
    },
  ],
  exports: [
    SupabaseService,
    REPOSITORY_TOKENS.CLIENT_REPOSITORY,
  ],
})

export class DatabaseModule {}
