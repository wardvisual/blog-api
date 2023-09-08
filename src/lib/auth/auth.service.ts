import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, map } from 'rxjs';

import { APIResponseHelper } from '@/lib/helpers/api-response.helper';
import { UsersService } from '@/modules/users/users.service';
import { APIResponse } from '@/lib/types';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  signIn(username: string, password: string): Observable<APIResponse> {
    return this.usersService.findOne({ username }, { password: true }).pipe(
      map((res) => {
        if (!res.isSuccess) {
          return APIResponseHelper.error(
            HttpStatus.UNAUTHORIZED,
            "Account doesn't exist",
          );
        }

        if (res.data?.password !== password) {
          return APIResponseHelper.error(
            HttpStatus.UNAUTHORIZED,
            'Incorrect password',
          );
        }

        const payload = this.jwtService.sign({
          id: res.data.id,
          username: res.data?.username,
        });

        return APIResponseHelper.success<{ accessToken: string }>(
          HttpStatus.OK,
          'Successfully logged in',
          { accessToken: payload },
        );
      }),
    );
  }

  signUp(user: RegisterDto): Observable<APIResponse> {
    return this.usersService.findOne({ username: user.username }).pipe(
      map((res) => {
        if (res.isSuccess) {
          return APIResponseHelper.error(
            HttpStatus.UNAUTHORIZED,
            'Account already exist',
          );
        }

        return APIResponseHelper.success(
          HttpStatus.OK,
          'You are now registered!',
        );
      }),
    );
  }
}
