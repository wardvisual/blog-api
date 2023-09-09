import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { BaseService as BaseServiceProvider } from '@/lib/services/base.service';
import { AppGuardProvider } from '@/lib/providers/app-guard.provider';
import { dataSourceConfig, appConfig } from '@/lib/configs';
import { ResourceModule } from '@/modules/resource.module';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig),
    TypeOrmModule.forRootAsync(dataSourceConfig),
    ResourceModule,
  ],
  providers: [AppGuardProvider, BaseServiceProvider],
})
export class AppModule {}
