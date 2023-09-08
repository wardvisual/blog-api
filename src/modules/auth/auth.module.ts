import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/modules/users/users.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { configService } from '@/lib/services/env.service';
import { PasswordService } from '@/lib/services/password.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  exports: [AuthService],
})
export class AuthModule {}
