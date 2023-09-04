import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [UsersModule, PostsModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ResourceModule {}
