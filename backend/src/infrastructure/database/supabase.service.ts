
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';


@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);

  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;


  constructor(private configService: ConfigService) {
    this.initializeSupabase();
  }


  private initializeSupabase() {

    const supabaseUrl = this.configService.get<string>('database.supabase.url');
    const supabaseAnonKey = this.configService.get<string>('database.supabase.anonKey');
    const supabaseServiceKey = this.configService.get<string>('database.supabase.serviceRoleKey');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing. Check your environment variables.');
    }


    //cliente publico(para operaciones normales)
    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false
      }
    });


    //cliente admin(para operaciones privilegiadas)
    this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    this.logger.log('Supabase clients initialized successfully');
  }


  /**
   * Cliente publico de Supabase (con permisos limitados)
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }


  /**
   * cliente admin de Supabase (para operaciones privilegiadas)
   */
  getAdminClient(): SupabaseClient {
    return this.supabaseAdmin;
  }


  /**
   * verificar el estado de la conexión con Supabase
   */
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('_health_check')
        .select('*')
        .limit(1);

      if (error && error.code !== 'PGRST116') { // PGRST116 = tabla no encontrada (esperado)
        this.logger.error('Supabase health check failed:', error);
        return false;
      }

      this.logger.log('Supabase health check passed');
      return true;
    } catch (error) {
      this.logger.error('Supabase health check error:', error);
      return false;
    }
  }

}
