import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourceModule } from '@/modules/resource.module';
import { dataSourceOptions } from '@/lib/config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(dataSourceOptions),
    ResourceModule,
  ],
  providers: [],
})
export class AppModule {}
