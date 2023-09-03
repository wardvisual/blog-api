import { Module } from '@nestjs/common';

import { ResourceModule } from '@/modules/resource.module';
import { DatabaseModule } from '@/lib/database/database.module';
import { ConfigModule } from '@/lib/config/config.module';

@Module({
  imports: [ConfigModule, DatabaseModule, ResourceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
