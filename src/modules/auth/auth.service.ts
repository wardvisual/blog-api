import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, map } from 'rxjs';

import { UsersService } from '@/modules/users/users.service';
import { APIResponse } from '@/lib/types';
import { RegisterDto } from './dto/register.dto';
import { BaseService } from '@/lib/services/base.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
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

          if (res.data?.password !== user.password)
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
    return this.usersService.create(user);
  }
}
