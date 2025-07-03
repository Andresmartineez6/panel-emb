import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'emb-super-secret-key-2024';

  constructor(private readonly databaseService: DatabaseService) {}

  async login(username: string, password: string, ipAddress?: string, userAgent?: string) {
    try {
      // Verificar que solo usuarios de EMB puedan acceder
      const validUsers = ['andresemb', 'aguayoemb', 'alejandroemb', 'pepeemb'];
      if (!validUsers.includes(username)) {
        this.logger.warn(`Intento de acceso no autorizado: ${username} desde ${ipAddress}`);
        return { success: false, message: 'Acceso no autorizado' };
      }

      // Verificar contraseña (por seguridad, verificamos la contraseña exacta)
      const validPassword = 'b#sHBEj9JrovK';
      if (password !== validPassword) {
        this.logger.warn(`Contraseña incorrecta para usuario: ${username} desde ${ipAddress}`);
        return { success: false, message: 'Credenciales incorrectas' };
      }

      // Buscar usuario en la base de datos
      const query = 'SELECT * FROM users WHERE username = $1 AND active = true';
      const result = await this.databaseService.query(query, [username]);

      if (result.rows.length === 0) {
        this.logger.warn(`Usuario no encontrado: ${username}`);
        return { success: false, message: 'Usuario no encontrado' };
      }

      const user = result.rows[0];

      // Generar token JWT
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        role: user.role,
        fullName: user.full_name
      };

      const token = jwt.sign(tokenPayload, this.JWT_SECRET, { 
        expiresIn: '24h',
        issuer: 'panel-emb',
        audience: 'emb-team'
      });

      // Generar token de sesión para mayor seguridad
      const sessionToken = randomBytes(32).toString('hex');

      // Guardar sesión en base de datos
      const sessionQuery = `
        INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
      
      await this.databaseService.query(sessionQuery, [
        user.id,
        sessionToken,
        ipAddress,
        userAgent,
        expiresAt
      ]);

      // Actualizar último login
      const updateQuery = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
      await this.databaseService.query(updateQuery, [user.id]);

      this.logger.log(`Login exitoso para usuario: ${username} desde ${ipAddress}`);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.full_name,
          role: user.role
        }
      };

    } catch (error) {
      this.logger.error(`Error en login: ${error.message}`, error.stack);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      
      // Verificar que la sesión sigue activa
      const sessionQuery = `
        SELECT * FROM user_sessions 
        WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP
      `;
      const result = await this.databaseService.query(sessionQuery, [decoded.userId]);
      
      if (result.rows.length === 0) {
        return { valid: false, message: 'Sesión expirada' };
      }

      return { valid: true, user: decoded };
    } catch (error) {
      this.logger.error(`Error validando token: ${error.message}`);
      return { valid: false, message: 'Token inválido' };
    }
  }

  async logout(userId: number) {
    try {
      // Eliminar sesiones del usuario
      const query = 'DELETE FROM user_sessions WHERE user_id = $1';
      await this.databaseService.query(query, [userId]);
      
      return { success: true };
    } catch (error) {
      this.logger.error(`Error en logout: ${error.message}`);
      return { success: false, message: 'Error al cerrar sesión' };
    }
  }

  // Limpiar sesiones expiradas (ejecutar periódicamente)
  async cleanExpiredSessions() {
    try {
      const query = 'DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP';
      const result = await this.databaseService.query(query);
      
      this.logger.log(`Sesiones expiradas eliminadas: ${result.rowCount}`);
    } catch (error) {
      this.logger.error(`Error limpiando sesiones: ${error.message}`);
    }
  }
}
