import { Controller, Post, Body, HttpException, HttpStatus, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    try {
      const result = await this.authService.login(
        loginDto.username, 
        loginDto.password,
        request.ip,
        request.get('User-Agent')
      );

      if (!result.success) {
        throw new HttpException(
          result.message || 'Credenciales incorrectas',
          HttpStatus.UNAUTHORIZED
        );
      }

      // Configurar cookie segura con el token
      response.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      });

      return {
        success: true,
        message: 'Login exitoso',
        user: result.user
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('auth_token');
    return { success: true, message: 'Logout exitoso' };
  }
}
