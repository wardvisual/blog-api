import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

import { configService } from '@/lib/services/env.service';

export const options: DataSourceOptions = {
  type: configService.getOrThrow<any>('DATABASE_DRIVER'),
  port: configService.getOrThrow<number>('DATABASE_PORT'),
  host: configService.getOrThrow<string>('DATABASE_HOST'),
  username: configService.getOrThrow<string>('DATABASE_USERNAME'),
  password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
  database: configService.getOrThrow<string>('DATABASE_NAME'),
  migrations: [join(__dirname), 'src/lib/database/migrations/*.ts'],
  entities: [join(__dirname), 'src/lib/database/entities/*.ts'],
};

export const dataSourceConnection = new DataSource(options);
