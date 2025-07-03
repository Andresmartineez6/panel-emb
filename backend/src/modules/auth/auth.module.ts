import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthProfileController } from './auth.profile.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'emb_super_secret_key_2024',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController, AuthProfileController],
  providers: [AuthService, JwtAuthGuard, DatabaseService],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
