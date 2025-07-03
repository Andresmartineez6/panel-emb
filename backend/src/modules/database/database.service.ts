import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      this.pool = new Pool({
        host: process.env.DB_HOST || 'postgres',
        port: parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'panel_emb',
        user: process.env.DB_USER || 'panel_emb_user',
        password: process.env.DB_PASSWORD || 'b#sHBEj9JrovK_DB',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Verificar la conexión
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.logger.log('✅ Conexión a PostgreSQL establecida correctamente');
    } catch (error) {
      this.logger.error('❌ Error conectando a PostgreSQL:', error.message);
      throw error;
    }
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    const start = Date.now();
    
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      this.logger.debug(`Query ejecutada en ${duration}ms - Filas: ${result.rowCount}`);
      return result;
    } catch (error) {
      this.logger.error(`Error en query: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getClient() {
    return this.pool.connect();
  }

  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('🔌 Conexión a PostgreSQL cerrada');
    }
  }
}
