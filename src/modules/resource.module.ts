import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ResourceModule {}
