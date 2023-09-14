import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, catchError, from, map, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { APIResponse } from '@/lib/types';
import { BaseService } from '@/lib/services/base.service';

@Injectable()
export class PostsService extends BaseService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {
    super();
  }

  create(createPostDto: CreatePostDto): Observable<APIResponse> {
    return from(this.postsRepository.insert(createPostDto)).pipe(
      map(() => this.send('Post created successfully')),
      catchError(() => {
        throw new UnprocessableEntityException('Could not create post');
      }),
    );
  }

  findAll(): Observable<APIResponse> {
    return from(this.postsRepository.find()).pipe(
      map((posts: Post[]) => this.send('Posts retrieved successfully', posts)),
      catchError(() => {
        throw new BadRequestException('Could not retrieve posts');
      }),
    );
  }

  findOne(id: string): Observable<APIResponse> {
    return from(this.postsRepository.findOne({ where: { id } })).pipe(
      map((post: Post) => this.send('Post retrieved successfully', post)),
      catchError(() => {
        throw new NotFoundException('Could not retrieve post');
      }),
    );
  }

  update(id: string, post: UpdatePostDto): Observable<APIResponse> {
    return this.findOne(id).pipe(
      switchMap(() => {
        return from(this.postsRepository.update(id, post)).pipe(
          map(() => this.send('Post updated successfully')),
          catchError(() => {
            throw new UnprocessableEntityException('Could not update post');
          }),
        );
      }),
    );
  }

  remove(id: string): Observable<APIResponse> {
    return this.findOne(id).pipe(
      switchMap((res) => {
        if (!res.isSuccess) throw new NotFoundException('Post was not found');

        return from(this.postsRepository.delete(id)).pipe(
          map(() => this.send('Post deleted successfully')),
          catchError(() => {
            throw new BadRequestException('Could not delete posts');
          }),
        );
      }),
    );
  }
}
