import { DataSource } from 'typeorm';

import { configService } from '@/lib/services/env.service';

import { User } from '@/modules/users/entities/user.entity';
import { Post } from '@/modules/posts/entities/post.entity';

export default new DataSource({
  type: configService.getOrThrow<any>('DATABASE_DRIVER'),
  port: configService.getOrThrow<number>('DATABASE_PORT'),
  username: configService.getOrThrow<string>('DATABASE_USERNAME'),
  password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
  database: configService.getOrThrow<string>('DATABASE_NAME'),
  entities: [User, Post],
  migrations: ['src/lib/database/migrations/*.ts'],
});
