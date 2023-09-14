import { DatabaseType, DataSource, DataSourceOptions } from 'typeorm';

import { configService } from '@/lib/services/env.service';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const config: any = {
  type: configService.get<string>('DATABASE_DRIVER') as DatabaseType,
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/lib/database/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
  logging: true,
};

export default new DataSource(config as DataSourceOptions);

export const dataSourceConfig: TypeOrmModuleAsyncOptions = {
  inject: [],
  useFactory: async () => config,
};
