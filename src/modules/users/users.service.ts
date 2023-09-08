import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, catchError, from, map, of, switchMap, take } from 'rxjs';
import { APIResponse } from '@/lib/types';
import { APIResponseHelper } from '@/lib/helpers/api-response.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  create(user: CreateUserDto): Observable<APIResponse> {
    return from(
      this.usersRepository.findOneBy({ username: user.username }),
    ).pipe(
      switchMap((res) => {
        if (res)
          return of(
            APIResponseHelper.error(
              HttpStatus.CONFLICT,
              'Username was already taken',
            ),
          );

        return from(this.usersRepository.insert(user)).pipe(
          map(() =>
            APIResponseHelper.success(
              HttpStatus.OK,
              'User created successfully',
            ),
          ),
          catchError(() =>
            of(
              APIResponseHelper.error(
                HttpStatus.UNPROCESSABLE_ENTITY,
                'Could not create user',
              ),
            ),
          ),
        );
      }),
    );
  }

  findAll(): Observable<APIResponse> {
    return from(this.usersRepository.find()).pipe(
      map((users: User[]) =>
        APIResponseHelper.success(
          HttpStatus.OK,
          'Users retrieved successfully',
          users,
        ),
      ),
      catchError(() =>
        of(
          APIResponseHelper.error(
            HttpStatus.NO_CONTENT,
            'Could not retrieve users',
          ),
        ),
      ),
    );
  }

  findOne(user: Partial<User>, selectFields?: any): Observable<APIResponse> {
    return from(
      this.usersRepository.findOneOrFail({
        where: { ...user },
        select: selectFields,
      }),
    ).pipe(
      map((user: User) =>
        APIResponseHelper.success(
          HttpStatus.OK,
          'User retrieved successfully',
          user,
        ),
      ),
      catchError(() =>
        of(
          APIResponseHelper.error(
            HttpStatus.NOT_FOUND,
            'Could not retrieve user',
          ),
        ),
      ),
    );
  }

  update(id: string, user: UpdateUserDto): Observable<APIResponse> {
    return this.findOne({ id }).pipe(
      switchMap((res) => {
        if (!res.isSuccess)
          return of(
            APIResponseHelper.error(
              HttpStatus.UNPROCESSABLE_ENTITY,
              'Could not update user',
            ),
          );

        return from(this.usersRepository.update(id, user)).pipe(
          map(() =>
            APIResponseHelper.success(
              HttpStatus.OK,
              'User updated successfully',
            ),
          ),
          catchError(() =>
            of(
              APIResponseHelper.error(
                HttpStatus.UNPROCESSABLE_ENTITY,
                'Could not update user',
              ),
            ),
          ),
        );
      }),
    );
  }

  remove(id: string): Observable<APIResponse> {
    return this.findOne({ id }).pipe(
      switchMap((res) => {
        if (!res.isSuccess)
          return of(
            APIResponseHelper.error(HttpStatus.NOT_FOUND, 'User was not found'),
          );

        return from(this.usersRepository.delete(id)).pipe(
          map(() =>
            APIResponseHelper.success(
              HttpStatus.NO_CONTENT,
              'User deleted successfully',
            ),
          ),
          catchError(() =>
            of(
              APIResponseHelper.error(
                HttpStatus.CONFLICT,
                'Could not delete user',
              ),
            ),
          ),
        );
      }),
    );
  }
}
