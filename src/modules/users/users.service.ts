/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Observable,
  catchError,
  from,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';
import { APIResponse } from '@/lib/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  create(user: CreateUserDto): Observable<APIResponse> {
    return from(
      this.usersRepository.findOne({
        where: [{ username: user.username }],
      }),
    ).pipe(
      mergeMap((existingUser) => {
        if (existingUser)
          return of({
            isSuccess: false,
            message: 'Username was already taken',
          } satisfies APIResponse);

        return from(this.usersRepository.insert(user)).pipe(
          map(() => {
            return {
              isSuccess: true,
              message: 'User created successfully',
            } satisfies APIResponse;
          }),
          catchError((error) =>
            of({
              isSuccess: false,
              message: 'Could not create user',
            } satisfies APIResponse),
          ),
        );
      }),
    );
  }

  findAll(): Observable<APIResponse> {
    return from(this.usersRepository.find()).pipe(
      map((users) => {
        users.forEach((user) => delete user.password);

        return {
          isSuccess: true,
          message: 'Users retrieved successfully',
          data: users,
        } satisfies APIResponse;
      }),

      catchError((error) =>
        of({
          isSuccess: false,
          message: 'Failed to retrieve users',
        } satisfies APIResponse),
      ),
    );
  }

  findOne(id: string): Observable<APIResponse> {
    return from(
      this.usersRepository.findOne({
        where: { id },
      }),
    ).pipe(
      map((user) => {
        delete user.password;

        return {
          isSuccess: true,
          message: 'User retrieved successfully',
          data: user,
        };
      }),

      catchError((error) =>
        of({
          isSuccess: false,
          message: 'Could not retrieve user',
        } satisfies APIResponse),
      ),
    );
  }

  update(id: string, user: UpdateUserDto): Observable<APIResponse> {
    return this.findOne(id).pipe(
      switchMap((res) => {
        if (!res.isSuccess)
          return of({
            ...res,
            message: 'Could not update user',
          } satisfies APIResponse);

        return from(this.usersRepository.update(id, user)).pipe(
          map(
            (user) =>
              ({
                isSuccess: true,
                message: 'User updated successfully',
              }) satisfies APIResponse,
          ),
          catchError(() =>
            of({
              isSuccess: false,
              message: 'Could not update user',
            } satisfies APIResponse),
          ),
        );
      }),
    );
  }

  remove(id: string): Observable<APIResponse> {
    return from(
      this.usersRepository.findOne({
        where: [{ id }],
      }),
    ).pipe(
      mergeMap((existingUser) => {
        if (!existingUser)
          return of({
            isSuccess: false,
            message: 'User was not found',
          } satisfies APIResponse);

        return from(this.usersRepository.delete(id)).pipe(
          map(
            (user) =>
              ({
                isSuccess: true,
                message: 'User deleted successfully',
                data: user,
              }) satisfies APIResponse,
          ),
          catchError(() =>
            of({
              isSuccess: false,
              message: 'Could not delete user',
            } satisfies APIResponse),
          ),
        );
      }),
    );
  }
}
