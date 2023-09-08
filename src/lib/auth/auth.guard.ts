import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable, catchError, from, map, of } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { APIResponseHelper } from '@/lib/helpers/api-response.helper';
import { User } from '@/modules/users/entities/user.entity';
import { configService } from '@/lib/helpers/env.helper';
import { IS_PUBLIC_KEY } from '@/lib/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return of(true);

    if (!token) {
      APIResponseHelper.error(HttpStatus.UNAUTHORIZED, 'Invalid token');
      return of(false);
    }

    return from(
      this.jwtService.verifyAsync(token, {
        secret: configService.get('JWT_SECRET'),
      }),
    ).pipe(
      map((payload: User) => {
        request['user'] = payload;
        return true;
      }),
      catchError(() => {
        APIResponseHelper.error(HttpStatus.UNAUTHORIZED, 'Invalid token');
        return of(false);
      }),
    );
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
