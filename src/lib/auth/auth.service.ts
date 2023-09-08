import { APIResponseHelper } from './../helpers/api-response.helper';
import { UsersService } from '@/modules/users/users.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Observable, catchError, from, map, switchMap, of } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { APIResponse } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  signIn(username: string, password: string): Observable<APIResponse> {
    return this.usersService.findOneBy({ username }).pipe(
      map((res) => {
        console.log({ res });
        if (!res.isSuccess) {
          return APIResponseHelper.error(
            HttpStatus.UNAUTHORIZED,
            "Account doesn't exist",
          );
        }

        if (res.data?.password !== password) {
          return APIResponseHelper.error(
            HttpStatus.UNAUTHORIZED,
            'Password is incorrect',
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
}
