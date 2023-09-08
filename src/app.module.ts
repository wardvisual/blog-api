import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourceModule } from '@/modules/resource.module';
import { dataSourceOptions } from '@/lib/config/typeorm.config';
import { AuthModule } from '@/lib/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(dataSourceOptions),
    AuthModule,
    ResourceModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
