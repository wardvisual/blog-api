import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { APIResponseHelper } from '@/lib/helpers/api-response.helper';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { APIResponse } from '@/lib/types';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto): Observable<APIResponse> {
    return from(this.postsRepository.insert(createPostDto)).pipe(
      map(() =>
        APIResponseHelper.success(
          HttpStatus.CREATED,
          'Post created successfully',
        ),
      ),
      catchError(() =>
        of(
          APIResponseHelper.error(
            HttpStatus.UNPROCESSABLE_ENTITY,
            'Could not create post',
          ),
        ),
      ),
    );
  }

  findAll(): Observable<APIResponse> {
    return from(this.postsRepository.find()).pipe(
      map((posts: Post[]) =>
        APIResponseHelper.success(
          HttpStatus.OK,
          'Posts retrieved successfully',
          posts,
        ),
      ),
      catchError(() =>
        of(
          APIResponseHelper.error(
            HttpStatus.NO_CONTENT,
            'Could not retrieve posts',
          ),
        ),
      ),
    );
  }

  findOne(id: string): Observable<APIResponse> {
    return from(this.postsRepository.findOne({ where: { id } })).pipe(
      map((post: Post) =>
        APIResponseHelper.success(
          HttpStatus.OK,
          'Post retrieved successfully',
          post,
        ),
      ),
      catchError(() =>
        of(
          APIResponseHelper.error(
            HttpStatus.NOT_FOUND,
            'Could not retrieve post',
          ),
        ),
      ),
    );
  }

  update(id: string, post: UpdatePostDto): Observable<APIResponse> {
    return this.findOne(id).pipe(
      switchMap((res) => {
        if (!res.isSuccess)
          return of(
            APIResponseHelper.error(
              HttpStatus.UNPROCESSABLE_ENTITY,
              'Could not update post',
            ),
          );

        return from(this.postsRepository.update(id, post)).pipe(
          map(() =>
            APIResponseHelper.success(
              HttpStatus.OK,
              'Post updated successfully',
            ),
          ),
          catchError(() =>
            of(
              APIResponseHelper.error(
                HttpStatus.UNPROCESSABLE_ENTITY,
                'Could not update post',
              ),
            ),
          ),
        );
      }),
    );
  }

  remove(id: string): Observable<APIResponse> {
    return this.findOne(id).pipe(
      switchMap((res) => {
        if (!res.isSuccess)
          return of(
            APIResponseHelper.error(HttpStatus.NOT_FOUND, 'Post was not found'),
          );

        return from(this.postsRepository.delete(id)).pipe(
          map(() =>
            APIResponseHelper.success(
              HttpStatus.NO_CONTENT,
              'Post deleted successfully',
            ),
          ),
          catchError(() =>
            of(
              APIResponseHelper.error(
                HttpStatus.CONFLICT,
                'Could not delete post',
              ),
            ),
          ),
        );
      }),
    );
  }
}
