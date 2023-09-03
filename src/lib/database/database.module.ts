import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvHelper } from '@/lib/helpers/env.helper';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: EnvHelper.get<number>('DATABASE_PORT'),
      username: EnvHelper.get<string>('DATABASE_USERNAME'),
      password: EnvHelper.get<string>('DATABASE_PASSWORD'),
      database: EnvHelper.get<string>('DATABASE_name'),
      entities: [],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
