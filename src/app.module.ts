import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { BaseService as BaseServiceProvider } from '@/lib/services/base.service';
import { AppGuardProvider } from '@/lib/providers/app-guard.provider';
import { DatabaseProviderProvider } from '@/lib/providers/database.provider';

import { appConfig } from '@/lib/configs';
import { ResourceModule } from '@/modules/resource.module';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig),
    ResourceModule,
    DatabaseProviderProvider,
  ],
  providers: [AppGuardProvider, BaseServiceProvider, DatabaseProviderProvider],
})
export class AppModule {}
