import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@/modules/users/users.module';
import { PasswordService } from '@/lib/services/password.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConfig } from '@/lib/configs';

@Module({
  imports: [UsersModule, JwtModule.register(jwtConfig)],
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  exports: [AuthService],
})
export class AuthModule {}
