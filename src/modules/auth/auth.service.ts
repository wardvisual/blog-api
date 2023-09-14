import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, map } from 'rxjs';

import { UsersService } from '@/modules/users/users.service';
import { APIResponse } from '@/lib/types';
import { RegisterDto } from './dto/register.dto';
import { BaseService } from '@/lib/services/base.service';
import { LoginDto } from './dto/login.dto';
import { PasswordService } from '@/lib/services/password.service';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {
    super();
  }

  signIn(user: LoginDto): Observable<APIResponse> {
    return this.usersService
      .findOne({ username: user.username }, { password: true })
      .pipe(
        map((res) => {
          if (!res.isSuccess)
            throw new UnauthorizedException("Account doesn't exist");

          if (!this.passwordService.decrypt(user.password, res.data?.password))
            throw new UnauthorizedException('Incorrect password');

          const payload = this.jwtService.sign({
            id: res.data.id,
            username: res.data?.username,
          });

          return this.send<{ accessToken: string }>('Successfully logged in', {
            accessToken: payload,
          });
        }),
      );
  }

  signUp(user: RegisterDto): Observable<APIResponse> {
    user.password = this.passwordService.encrypt(user.password);
    return this.usersService.create(user);
  }
}
