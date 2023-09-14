import { Observable, catchError, from, map, switchMap, take } from 'rxjs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { APIResponse } from '@/lib/types';
import { BaseService } from '@/lib/services/base.service';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    super();
  }

  create(user: CreateUserDto): Observable<APIResponse> {
    return from(
      this.usersRepository.findOneBy({ username: user.username }),
    ).pipe(
      take(1),
      switchMap((res) => {
        if (res) throw new ConflictException('Username was already taken');

        return from(this.usersRepository.insert(user)).pipe(
          map(() => this.send('User created successfully')),
          catchError(() => {
            throw new UnprocessableEntityException('Could not create user');
          }),
        );
      }),
    );
  }

  findAll(): Observable<APIResponse> {
    return from(this.usersRepository.find()).pipe(
      take(1),
      map((users: User[]) => this.send('Users retrieved successfully', users)),
      catchError(() => {
        throw new BadRequestException('Could not retrieve users');
      }),
    );
  }

  findOne(user: Partial<User>, selectFields?: any): Observable<APIResponse> {
    return from(
      this.usersRepository.findOneOrFail({
        where: { ...user },
        select: selectFields,
      }),
    ).pipe(
      take(1),
      map((user: User) => {
        if (!user) throw new NotFoundException('Could not retrieve user');
        return this.send('User retrieved successfully', user);
      }),
      catchError(() => {
        throw new NotFoundException('Could not retrieve user');
      }),
    );
  }

  update(id: string, user: UpdateUserDto): Observable<APIResponse> {
    return this.findOne({ id }).pipe(
      take(1),
      switchMap((res) => {
        if (!res.isSuccess)
          throw new UnprocessableEntityException('Could not update user');

        return from(this.usersRepository.update(id, user)).pipe(
          map(() => this.send('User updated successfully')),
          catchError(() => {
            throw new UnprocessableEntityException('Could not update user');
          }),
        );
      }),
    );
  }

  remove(id: string): Observable<APIResponse> {
    return this.findOne({ id }).pipe(
      take(1),
      switchMap((res) => {
        if (!res.isSuccess) throw new NotFoundException('User was not found');

        return from(this.usersRepository.delete(id)).pipe(
          map(() => this.send('User deleted successfully')),
          catchError(() => {
            throw new ConflictException('Could not delete user');
          }),
        );
      }),
    );
  }
}
