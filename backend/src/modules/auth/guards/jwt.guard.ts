import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request) || this.extractTokenFromCookies(request);

    if (!token) {
      throw new UnauthorizedException('Token de acceso requerido');
    }

    try {
      // Verificar el token JWT
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'emb_super_secret_key_2024',
      });

      // Verificar que el usuario sigue activo en la base de datos
      const userQuery = await this.databaseService.query(
        'SELECT id, username, active FROM users WHERE id = $1 AND active = true',
        [payload.sub]
      );

      if (userQuery.rows.length === 0) {
        throw new UnauthorizedException('Usuario no válido o inactivo');
      }

      // Verificar sesión activa
      const sessionQuery = await this.databaseService.query(
        'SELECT id FROM user_sessions WHERE user_id = $1 AND token = $2 AND expires_at > NOW()',
        [payload.sub, token]
      );

      if (sessionQuery.rows.length === 0) {
        throw new UnauthorizedException('Sesión expirada o inválida');
      }

      // Añadir información del usuario a la request
      request.user = {
        id: payload.sub,
        username: payload.username,
        ...userQuery.rows[0]
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookies(request: any): string | undefined {
    return request.cookies?.auth_token;
  }
}
