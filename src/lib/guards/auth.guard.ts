import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, catchError, from, map, of } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { User } from '@/modules/users/entities/user.entity';
import { configService } from '@/lib/services/env.service';
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
      throw new UnauthorizedException('Invalid token');
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
        throw new UnauthorizedException('Invalid token');
      }),
    );
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
