import { DataSource } from 'typeorm';

import { configService } from '@/lib/services/env.service';

export default new DataSource({
  type: configService.get<any>('DATABASE_DRIVER'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/lib/database/migrations/*{.ts,.js}'],
  synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
});
