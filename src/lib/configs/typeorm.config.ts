import { ResourceModule } from '@/modules/resource.module';
import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';

export const dataSourceConfig: TypeOrmModuleOptions = {
  imports: [ResourceModule],
  useFactory: async (configService: ConfigService) => ({
    type: configService.get<string>('DATABASE_DRIVER') as DatabaseType,
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    // entities: ['src/modules/**/*.entity{.ts,.js}'],
    // migrations: ['src/lib/database/migrations/**/*{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: true,
    migrationRun: false,
  }),
  inject: [ConfigService],
} as TypeOrmModuleAsyncOptions;
