import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, catchError, from, map, mergeMap, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import { Express } from 'express'

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { APIResponse } from '@/lib/types';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) { }


  create(createPostDto: CreatePostDto): Observable<APIResponse> {
    return from(this.postsRepository.insert(createPostDto)).pipe(
      map(() => {
        return {
          isSuccess: true,
          message: 'Post created successfully',
        } satisfies APIResponse;
      }),
      catchError(() =>
        of({
          isSuccess: false,
          message: 'Could not create post',
        } satisfies APIResponse),
      ),
    );
  }

  findAll(): Observable<APIResponse> {
    return from(this.postsRepository.find()).pipe(
      map(() => {
        return {
          isSuccess: true,
          message: 'Posts retrieved successfully',
        } satisfies APIResponse;
      }),
      catchError(() =>
        of({
          isSuccess: false,
          message: 'Could not retrieve posts',
        } satisfies APIResponse),
      ),
    );
  }

  findOne(id: string): Observable<APIResponse> {
    return from(this.postsRepository.findOne({ where: { id } })).pipe(
      map(() => {
        return {
          isSuccess: true,
          message: 'Post retrieved successfully',
        } satisfies APIResponse;
      }),
      catchError(() =>
        of({
          isSuccess: false,
          message: 'Could not retrieve post',
        } satisfies APIResponse),
      ),
    );
  }

  update(id: string, post: UpdatePostDto): Observable<APIResponse> {
    return this.findOne(id).pipe(
      switchMap((res) => {
        if (!res.isSuccess)
          return of({
            ...res,
            message: 'Could not update post',
          } satisfies APIResponse);

        return from(this.postsRepository.update(id, post)).pipe(
          map(
            () =>
              ({
                isSuccess: true,
                message: 'Post updated successfully',
              }) satisfies APIResponse,
          ),
          catchError(() =>
            of({
              isSuccess: false,
              message: 'Could not update post',
            } satisfies APIResponse),
          ),
        );
      }),
    );
  }

  remove(id: string): Observable<APIResponse> {
    return from(
      this.postsRepository.findOne({
        where: [{ id }],
      }),
    ).pipe(
      mergeMap((existingPost) => {
        if (!existingPost)
          return of({
            isSuccess: false,
            message: 'Post was not found',
          } satisfies APIResponse);

        return from(this.postsRepository.delete(id)).pipe(
          map(
            (user) =>
              ({
                isSuccess: true,
                message: 'Post deleted successfully',
                data: user,
              }) satisfies APIResponse,
          ),
          catchError(() =>
            of({
              isSuccess: false,
              message: 'Could not delete post',
            } satisfies APIResponse),
          ),
        );
      }),
    );
  }
}
