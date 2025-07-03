import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CurrentUser, CurrentUserData } from './decorators/current-user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthProfileController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: CurrentUserData) {
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        active: user.active,
      },
    };
  }

  @Get('validate')
  async validateToken(@CurrentUser() user: CurrentUserData) {
    return {
      success: true,
      valid: true,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}
