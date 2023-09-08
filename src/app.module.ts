import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { dataSourceOptions } from '@/lib/config/typeorm.config';
import { ResourceModule } from '@/modules/resource.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { AuthGuard } from '@/lib/guards/auth.guard';
import { BaseService } from '@/lib/services/base.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(dataSourceOptions),
    AuthModule,
    ResourceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    BaseService,
  ],
})
export class AppModule {}
