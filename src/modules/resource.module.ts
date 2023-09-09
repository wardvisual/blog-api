import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, PostsModule, AuthModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ResourceModule {}
