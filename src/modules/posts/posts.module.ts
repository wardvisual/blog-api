import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/lib/auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class PostsModule {}
